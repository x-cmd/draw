// 共享 HTTP 层(web-standard Request/Response,Cloudflare Workers 与 Node 通吃):
// 路由、POST 短链创建、短链渲染、演示页、错误包装。
// 运行时差异(边缘缓存、限流 binding、waitUntil)由调用方通过 Platform 注入,
// 本文件不触碰任何 Workers 专属 API。
import {
  ApiError, parseChartSpec, parseSeriesSpec, parseGaugeSpec,
  parseScatterSpec, parseComboSpec, csvToSpecJson, looksMultiSeries, clip,
} from './specs/index.js';
import { parseSankeySpec } from './specs/sankey.js';
import { assertDims } from './render/radar.js';
import { renderQR, parseColor, requireQRText, QR_DEFAULTS } from './render/qr.js';
import { renderFromUrl, renderStoredFromUrl, stackParam, type DrawResult } from './render/query.js';
import { resolveSkin, VARIANTS } from './styles/index.js';
import { indexHandler } from './demo.js';
import {
  CHART_TEMPLATES, assertHash, fingerprint, getChart, putChart, readBody,
  type ChartTemplate, type StoredChart,
} from './store.js';
import type { DrawEnv, Platform } from './types.js';

const SVG_CT = 'image/svg+xml; charset=utf-8';
const TEXT_CT = 'text/plain; charset=utf-8';

// 服务路径前缀,按请求解析:env.BASE_PATH 显式钉死;否则自动探测(请求落在 /draw
// 下 → '/draw',即生产路由 x-cmd.com/draw*;否则根路径 '',即自部署 workers.dev)。
// 这样同一份代码在两种入口下都直接可用,自部署无需改任何代码。
function baseOf(url: URL, env: DrawEnv): string {
  if (env.BASE_PATH !== undefined) return env.BASE_PATH;
  return url.pathname === '/draw' || url.pathname.startsWith('/draw/') ? '/draw' : '';
}

function svgResponse(result: DrawResult, extra?: Record<string, string>): Response {
  return new Response(result.svg, {
    headers: {
      'content-type': SVG_CT,
      'cache-control': result.cacheControl,
      'x-draw-version': String(result.version),
      ...extra,
    },
  });
}

function textResponse(status: number, msg: string, extra?: Record<string, string>): Response {
  return new Response(msg + '\n', {
    status,
    headers: { 'content-type': TEXT_CT, 'cache-control': 'no-store', ...extra },
  });
}

// POST 限流:Worker 入口注入 platform.rateLimit(官方 Rate Limiting binding,
// 每 CF 数据中心独立计数,30/min/IP);本地 Node 不注入,不限。
// 计数宽松/最终一致,防滥用足够;内存 Map 方案在多 isolate 下形同虚设,已移除。
async function rateLimitPost(request: Request, platform: Platform): Promise<void> {
  if (!platform.rateLimit) return; // 未注入(本地/单测)→ 不限
  const ip = request.headers.get('cf-connecting-ip');
  if (!ip) return; // 无此头(本地 dev)→ 不限
  if (!(await platform.rateLimit(`post:${ip}`))) {
    throw new ApiError(429, 'too many create requests: limit is 30/min per IP, retry later');
  }
}

// POST /draw?type=...:JSON/CSV body → 校验+规范化 → 指纹 → 存 repo → 返回短链
async function createHandler(request: Request, env: DrawEnv, platform: Platform, base: string): Promise<Response> {
  await rateLimitPost(request, platform);
  const url = new URL(request.url);
  const templateParam = url.searchParams.get('type');
  if (!templateParam || !CHART_TEMPLATES.includes(templateParam as ChartTemplate)) {
    throw new ApiError(400, `"type" query param is required: one of ${CHART_TEMPLATES.join(', ')}. Example: POST /draw?type=pie`);
  }
  const template = templateParam as ChartTemplate;
  const themeParam = url.searchParams.get('t'); // 风格家族
  // 创建时即校验:短链 immutable,坏主题一旦入库将永久 400
  resolveSkin(template, themeParam, 'auto');
  // 缺省 t= 时存"第一个变体的 family"(与渲染端 resolveSkin 的默认解析一致;
  // 硬编码 'base' 会让默认非 base 的图种(bar=evil)短链与直接 GET 渲染不一致)
  const theme = themeParam ?? VARIANTS[template][0].family;

  const body = await readBody(request);
  const ct = (request.headers.get('content-type') ?? '').split(';')[0].trim();
  let specJson: string;
  if (ct === 'text/csv' || ct === 'application/csv') {
    specJson = csvToSpecJson(body);
  } else {
    try {
      JSON.parse(body);
    } catch {
      throw new ApiError(400, 'request body is not valid JSON (or set content-type: text/csv for CSV)');
    }
    specJson = body;
  }

  // 校验并规范化(存解析后的规范形,相同数据不同写法 → 相同指纹)
  let normalizedSpec: unknown;
  if (template === 'qr') {
    const o = JSON.parse(specJson) as Record<string, unknown>;
    const text = requireQRText(typeof o.text === 'string' ? o.text : null);
    normalizedSpec = {
      text,
      fg: parseColor(typeof o.fg === 'string' ? o.fg : null, QR_DEFAULTS.fg, 'fg'),
      bg: parseColor(typeof o.bg === 'string' ? o.bg : null, QR_DEFAULTS.bg, 'bg'),
    };
  } else if (template === 'gauge') {
    normalizedSpec = parseGaugeSpec(specJson);
  } else if (template === 'scatter') {
    normalizedSpec = parseScatterSpec(specJson);
  } else if (template === 'combo') {
    normalizedSpec = parseComboSpec(specJson);
  } else if (template === 'sankey') {
    normalizedSpec = parseSankeySpec(specJson);
  } else if (looksMultiSeries(specJson) || (template === 'hbar' && (theme === 'xcmd-issue' || theme === 'rank'))) {
    // hbar 双系列仅 xcmd-issue/rank 支持,且这两个风格强制恰好 2 系列——
    // body 单系列 + t=rank 会在渲染层 400,创建时拦下防永久坏链(同 radar 维度校验)
    if (template === 'hbar') {
      if (theme !== 'xcmd-issue' && theme !== 'rank') {
        throw new ApiError(400, 'multi-series hbar requires t=xcmd-issue or t=rank');
      }
      const series = (JSON.parse(specJson) as { series?: unknown }).series;
      const seriesCount = Array.isArray(series) ? series.length : 0; // looksMultiSeries 只查 in,防 500
      if (seriesCount !== 2) {
        throw new ApiError(400, `this hbar style takes exactly two series, got ${seriesCount}`);
      }
    } else if (template !== 'bar' && template !== 'line' && template !== 'area' && template !== 'radar') {
      throw new ApiError(400, `multi-series is not supported for type=${template}; use bar, line, area, radar or hbar (t=xcmd-issue/rank)`);
    }
    normalizedSpec = parseSeriesSpec(specJson, template === 'line' || template === 'area' || template === 'radar' ? 'line' : 'bar');
  } else {
    normalizedSpec = parseChartSpec(specJson, template);
  }
  if (template === 'radar') {
    // 维度校验在渲染层,创建路径若不拦,坏维度会入库成永久 400 的短链
    const s = normalizedSpec as { labels?: unknown[]; data?: unknown[] };
    assertDims((s.labels ?? s.data ?? []).length);
  }

  // URL 上的编辑参数并入 spec(SKILL 契约:POST /draw?type=pie&title=… + body);body 已有同名字段时以 body 为准
  if (typeof normalizedSpec === 'object' && normalizedSpec !== null) {
    const s = normalizedSpec as Record<string, unknown>;
    const caps: Record<string, number> = { title: 80, unit: 24, subtitle: 96, source: 96 };
    for (const k of ['title', 'unit', 'subtitle', 'source'] as const) {
      const v = url.searchParams.get(k);
      // 不能用 !(k in s):parseChartSpec 返回的规范形态恒带这些键(值可为 undefined)
      if (v !== null && !(typeof s[k] === 'string' && s[k] !== '')) s[k] = clip(v, caps[k]);
    }
  }
  const stack = template === 'bar' && stackParam(url.searchParams);
  const doc: StoredChart = { template, theme, ...(stack ? { stack: true } : {}), spec: normalizedSpec };
  const hash = await fingerprint(doc);
  await putChart(env, hash, doc);
  const shortUrl = `${url.origin}${base}/c/${hash}`;
  return new Response(JSON.stringify({ hash, url: shortUrl, template }) + '\n', {
    status: 201,
    headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' },
  });
}

// GET /draw/c/<指纹>:读 repo → 校验 → 渲染(内容寻址,永久 immutable)
async function shortHandler(sub: string, url: URL, env: DrawEnv): Promise<Response> {
  const hash = sub.slice(3);
  assertHash(hash);
  const doc = await getChart(env, hash);
  return svgResponse(renderStoredFromUrl(doc, url), { 'x-draw-hash': hash });
}

function route(request: Request, env: DrawEnv, platform: Platform): Response | Promise<Response> {
  const url = new URL(request.url);
  const path = url.pathname;
  const base = baseOf(url, env);
  if (path !== base && !path.startsWith(base + '/')) {
    return textResponse(404, `unknown path ${path}; service lives under ${base || '/'} (e.g. ${base}?type=pie&labels=A,B&values=1,2)`);
  }
  const sub = path.slice(base.length); // '' | '/c/<hash>'
  const method = request.method === 'HEAD' ? 'GET' : request.method; // 链接预览器常用 HEAD 探测

  if (sub.startsWith('/c/')) {
    if (method !== 'GET') {
      return textResponse(405, `method ${request.method} not allowed; use GET`, { allow: 'GET' });
    }
    return shortHandler(sub, url, env);
  }
  if (sub === '' || sub === '/') {
    if (method === 'POST') return createHandler(request, env, platform, base);
    if (method !== 'GET') {
      return textResponse(405, `method ${request.method} not allowed; use GET to render or POST to create a short link`, { allow: 'GET, POST' });
    }
    // 演示页:无查询,或仅带演示页自身的 tab 参数(?tab=pie)
    const onlyTab = url.searchParams.get('type') === null && [...url.searchParams.keys()].every((k) => k === 'tab');
    if (url.search === '' || onlyTab) return indexHandler(base);
    return svgResponse(renderFromUrl(url));
  }
  return textResponse(404, `unknown path ${path}; available: GET ${base}?type=... · POST ${base}?type=... · GET ${base}/c/{hash}`);
}

// 统一入口:Worker 的 fetch handler 与 Node 适配器都调这里。
// ApiError → 对应状态码文本;其余异常 → 500 + rid(日志带 stack)。
export async function handleRequest(request: Request, env: DrawEnv, platform: Platform): Promise<Response> {
  try {
    return await route(request, env, platform);
  } catch (e) {
    if (e instanceof ApiError) return textResponse(e.status, e.message);
    const rid = crypto.randomUUID().slice(0, 8);
    console.error(JSON.stringify({
      msg: 'unhandled error', rid, method: request.method, url: request.url,
      error: e instanceof Error ? e.stack ?? e.message : String(e),
    }));
    return textResponse(500, `internal error (ref ${rid})`);
  }
}
