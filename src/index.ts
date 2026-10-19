// draw — 入口与路由。
// 代码结构(可维护性约定):
//   specs/    每种图表一个解析文件(base=公共校验),barrel 统一导出
//   render/   每种图表一个渲染文件(svg.ts=公共工具+RenderOpts,dispatch.ts=模板分发)
//   store.ts  短链存储(GitHub repo) · demo.ts 演示页 · theme/version 公共配置
// 新增图表 = specs/xxx.ts + render/xxx.ts + store.ts 的 CHART_TEMPLATES 加一项
//           + drawHandler 一行 + render/dispatch.ts 一行
import {
  ApiError, parseInput, parseChartSpec, parseSeriesSpec, parseGaugeSpec, gaugeSpecFromParams,
  parseScatterSpec, scatterSpecFromParams, parseComboSpec, comboSpecFromParams,
  csvToSpecJson, looksMultiSeries, clip, type ChartInput,
} from './specs';
import { resolveVersion, CURRENT_VERSION, type VersionInfo } from './version';
import { renderPie } from './render/pie';
import type { RenderOpts } from './render/svg';
import { renderBar } from './render/bar';
import { renderBarGrid } from './render/bar-grid';
import { renderBarMulti } from './render/bar-grouped';
import { renderBarStacked } from './render/bar-stacked';
import { renderLine } from './render/line';
import { renderAreaByMode } from './render/area';
import { renderLineMulti } from './render/line-multi';
import { renderRadarByMode, assertDims } from './render/radar';
import { renderHbarByMode } from './render/hbar-spec';
import { renderGauge } from './render/gauge';
import { renderScatter } from './render/scatter';
import { renderCombo } from './render/combo';
import { renderQR, parseColor, requireQRText, QR_DEFAULTS } from './render/qr';
import { renderSankey } from './render/sankey';
import { parseSankeySpec, sankeySpecFromParams } from './specs/sankey';
import { renderStored } from './render/dispatch';
import { resolveSkin, VARIANTS, type Scheme } from './styles';
import { indexHandler } from './demo';
import {
  CHART_TEMPLATES, assertHash, fingerprint, getChart, putChart, readBody,
  type ChartTemplate, type StoredChart,
} from './store';

const SVG_CT = 'image/svg+xml; charset=utf-8';
const TEXT_CT = 'text/plain; charset=utf-8';

// 服务路径前缀,按请求解析:env.BASE_PATH 显式钉死;否则自动探测(请求落在 /draw
// 下 → '/draw',即生产路由 x-cmd.com/draw*;否则根路径 '',即自部署 workers.dev)。
// 这样同一份代码在两种入口下都直接可用,自部署无需改任何代码。
function baseOf(url: URL, env: Env): string {
  if (env.BASE_PATH !== undefined) return env.BASE_PATH;
  return url.pathname === '/draw' || url.pathname.startsWith('/draw/') ? '/draw' : '';
}

// 各模板默认尺寸 [宽,高](drawHandler 与短链 shortHandler 共用,知识单点)
const SIZE: Record<ChartTemplate, [number, number]> = {
  pie: [560, 300],
  bar: [560, 320],
  hbar: [560, 320],
  line: [560, 320],
  area: [560, 320],
  radar: [480, 360],
  gauge: [360, 260],
  scatter: [560, 360],
  combo: [560, 320],
  sankey: [720, 420],
  qr: [240, 240],
};

function svgResponse(body: string, v: VersionInfo): Response {
  return new Response(body, {
    headers: {
      'content-type': SVG_CT,
      'cache-control': v.cacheControl,
      'x-draw-version': String(v.version),
    },
  });
}

function textResponse(status: number, msg: string, extra?: HeadersInit): Response {
  return new Response(msg + '\n', {
    status,
    headers: { 'content-type': TEXT_CT, 'cache-control': 'no-store', ...extra },
  });
}

function valueLabelsParam(params: URLSearchParams): 'all' | 'peak' | 'none' | undefined {
  const raw = params.get('num');
  if (raw === null || raw === '') return undefined; // 未指定 → 用皮肤默认(规范变体多为 none)
  if (raw === 'all' || raw === 'peak' || raw === 'none') return raw;
  throw new ApiError(400, `"num" must be one of: all, peak, none (value labels). Got: ${JSON.stringify(raw)}`);
}

function clampInt(params: URLSearchParams, key: string, def: number, min: number, max: number): number {
  const raw = params.get(key);
  if (raw === null || raw === '') return def;
  const n = Number(raw);
  if (!Number.isFinite(n)) {
    throw new ApiError(400, `"${key}" must be a number between ${min} and ${max}, got ${JSON.stringify(raw)}`);
  }
  return Math.round(Math.min(max, Math.max(min, n)));
}

function stackParam(params: URLSearchParams): boolean {
  const raw = params.get('stack');
  if (raw === null || raw === '' || raw === '0' || raw === 'false') return false;
  if (raw === '1' || raw === 'true') return true;
  throw new ApiError(400, `"stack" must be 1/true (stacked) or 0/false (grouped). Got: ${JSON.stringify(raw)}`);
}

function schemeParam(params: URLSearchParams): Scheme {
  const raw = params.get('scheme');
  if (raw === null || raw === '' || raw === 'auto') return 'auto';
  if (raw === 'dark' || raw === 'light') return raw;
  throw new ApiError(400, `"scheme" must be one of: auto (default), dark, light. Got: ${JSON.stringify(raw)}`);
}

function boolParam(params: URLSearchParams, key: string): boolean | undefined {
  const raw = params.get(key);
  if (raw === null || raw === '') return undefined;
  if (raw === '1' || raw === 'true') return true;
  if (raw === '0' || raw === 'false') return false;
  throw new ApiError(400, `"${key}" must be 1/true or 0/false. Got: ${JSON.stringify(raw)}`);
}

function chartHandler(
  request: URL,
  kind: 'pie' | 'bar' | 'hbar' | 'line' | 'area' | 'radar',
  render: (input: ChartInput, o: RenderOpts) => string,
  defW: number,
  defH: number,
  extra?: (params: URLSearchParams) => Partial<RenderOpts>,
): Response {
  const input = parseInput(request.searchParams, kind);
  const v = resolveVersion(request.searchParams.get('v'));
  const skin = resolveSkin(kind, request.searchParams.get('t'), schemeParam(request.searchParams));
  const [sw, sh] = skin.size ?? [defW, defH]; // 设计变体默认 = 规范画布
  const width = clampInt(request.searchParams, 'w', sw, 200, 1600);
  const height = clampInt(request.searchParams, 'h', sh, 140, 1200);
  const valueLabels = valueLabelsParam(request.searchParams);
  const donut = kind === 'pie' ? (boolParam(request.searchParams, 'donut') ?? true) : undefined;
  const autoHeight = request.searchParams.get('h') === null;
  const autoWidth = request.searchParams.get('w') === null;
  return svgResponse(render(input, { width, height, version: v.version, skin, autoHeight, autoWidth, ...(valueLabels !== undefined ? { valueLabels } : {}), ...(donut !== undefined ? { donut } : {}), ...(extra ? extra(request.searchParams) : {}) }), v);
}

// 参考线参数(hbar opendata):?ref=<数值> ?reflabel=<文案>
function refParams(params: URLSearchParams): Partial<RenderOpts> {
  const raw = params.get('ref');
  if (raw === null || raw === '') return {};
  const n = Number(raw);
  if (!Number.isFinite(n) || n < 0) {
    throw new ApiError(400, `"ref" must be a non-negative number (reference-line value), got ${JSON.stringify(raw)}`);
  }
  const label = params.get('reflabel');
  return { refLine: n, ...(label ? { refLabel: label } : {}) };
}

function qrHandler(request: URL): Response {
  const text = requireQRText(request.searchParams.get('d'));
  const fg = parseColor(request.searchParams.get('fg'), QR_DEFAULTS.fg, 'fg');
  const bg = parseColor(request.searchParams.get('bg'), QR_DEFAULTS.bg, 'bg');
  const v = resolveVersion(request.searchParams.get('v'));
  const skin = resolveSkin('qr', request.searchParams.get('t'), schemeParam(request.searchParams));
  const [qw, qh] = skin.size ?? [240, 240];
  const width = clampInt(request.searchParams, 'w', qw, 120, 1000);
  const height = clampInt(request.searchParams, 'h', qh, 140, 1000);
  const caption = clip(request.searchParams.get('title') ?? '', 40) || undefined;
  const subtitle = clip(request.searchParams.get('unit') ?? '', 24) || undefined;
  return svgResponse(renderQR(text, fg, bg, width, height, v.version, skin, caption, subtitle), v);
}

// POST /draw 限流:官方 Rate Limiting binding(每 CF 数据中心独立计数,全局限额 30/min/IP;
// 计数宽松/最终一致,防滥用足够)。内存 Map 方案在生产多 isolate 下形同虚设,已移除。
async function rateLimitPost(request: Request, env: Env): Promise<void> {
  if (!env.RATE_LIMITER) return; // 单测环境无 binding,不限
  const ip = request.headers.get('cf-connecting-ip');
  if (!ip) return; // 本地 dev 无此头,不限
  const { success } = await env.RATE_LIMITER.limit({ key: `post:${ip}` });
  if (!success) {
    throw new ApiError(429, 'too many create requests: limit is 30/min per IP, retry later');
  }
}

// POST /draw?type=...:JSON/CSV body → 校验+规范化 → 指纹 → 存 repo → 返回短链
async function createHandler(request: Request, env: Env, base: string): Promise<Response> {
  await rateLimitPost(request, env);
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
async function shortHandler(sub: string, url: URL, env: Env): Promise<Response> {
  const hash = sub.slice(3);
  assertHash(hash);
  const doc = await getChart(env, hash);
  const skin = resolveSkin(doc.template, doc.theme, schemeParam(url.searchParams));
  const [dw, dh] = skin.size ?? SIZE[doc.template];
  const width = clampInt(url.searchParams, 'w', dw, 120, 1600);
  const height = clampInt(url.searchParams, 'h', dh, 140, 1200);
  const vl = valueLabelsParam(url.searchParams);
  const o: RenderOpts = {
    width,
    height,
    version: CURRENT_VERSION,
    skin,
    autoWidth: url.searchParams.get('w') === null,
    autoHeight: url.searchParams.get('h') === null,
    ...(vl !== undefined ? { valueLabels: vl } : {}),
  };
  const svg = renderStored(doc, o);
  return new Response(svg, {
    headers: {
      'content-type': SVG_CT,
      'cache-control': 'public, max-age=31536000, immutable',
      'x-draw-hash': hash,
    },
  });
}

function route(request: Request, env: Env): Response | Promise<Response> {
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
    if (method === 'POST') return createHandler(request, env, base);
    if (method !== 'GET') {
      return textResponse(405, `method ${request.method} not allowed; use GET to render or POST to create a short link`, { allow: 'GET, POST' });
    }
    // 演示页:无查询,或仅带演示页自身的 tab 参数(?tab=pie)
    const onlyTab = url.searchParams.get('type') === null && [...url.searchParams.keys()].every((k) => k === 'tab');
    if (url.search === '' || onlyTab) return indexHandler(base);
    return drawHandler(url);
  }
  return textResponse(404, `unknown path ${path}; available: GET ${base}?type=... · POST ${base}?type=... · GET ${base}/c/{hash}`);
}

// GET /draw?type=pie|bar|hbar|line|radar|gauge|scatter|combo|qr&...
function drawHandler(url: URL): Response {
  const typeParam = url.searchParams.get('type');
  if (!typeParam || !CHART_TEMPLATES.includes(typeParam as ChartTemplate)) {
    throw new ApiError(400, `"type" query param is required: one of ${CHART_TEMPLATES.join(', ')}. Example: /draw?type=pie&labels=A,B&values=1,2`);
  }
  const kind = typeParam as ChartTemplate;
  if (kind === 'qr') return qrHandler(url);
  if (kind === 'gauge') {
    const spec = parseGaugeSpec(gaugeSpecFromParams(url.searchParams));
    const v = resolveVersion(url.searchParams.get('v'));
    const skin = resolveSkin('gauge', url.searchParams.get('t'), schemeParam(url.searchParams));
    const [gw, gh] = skin.size ?? SIZE.gauge;
    const width = clampInt(url.searchParams, 'w', gw, 200, 1600);
    const height = clampInt(url.searchParams, 'h', gh, 140, 1200);
    return svgResponse(renderGauge(spec, { width, height, version: v.version, skin }), v);
  }
  if (kind === 'scatter') {
    const spec = parseScatterSpec(scatterSpecFromParams(url.searchParams));
    const v = resolveVersion(url.searchParams.get('v'));
    const skin = resolveSkin('scatter', url.searchParams.get('t'), schemeParam(url.searchParams));
    const [dw, dh] = skin.size ?? SIZE.scatter;
    const width = clampInt(url.searchParams, 'w', dw, 200, 1600);
    const height = clampInt(url.searchParams, 'h', dh, 140, 1200);
    const vl = valueLabelsParam(url.searchParams);
    return svgResponse(renderScatter(spec, { width, height, version: v.version, skin, ...(vl !== undefined ? { valueLabels: vl } : {}) }), v);
  }
  if (kind === 'combo') {
    const spec = parseComboSpec(comboSpecFromParams(url.searchParams));
    const v = resolveVersion(url.searchParams.get('v'));
    const skin = resolveSkin('combo', url.searchParams.get('t'), schemeParam(url.searchParams));
    const [dw, dh] = skin.size ?? SIZE.combo;
    const width = clampInt(url.searchParams, 'w', dw, 200, 1600);
    const height = clampInt(url.searchParams, 'h', dh, 140, 1200);
    const vl = valueLabelsParam(url.searchParams);
    const autoWidth = url.searchParams.get('w') === null;
    return svgResponse(renderCombo(spec, { width, height, version: v.version, skin, autoWidth, ...(vl !== undefined ? { valueLabels: vl } : {}) }), v);
  }
  if (kind === 'sankey') {
    const spec = parseSankeySpec(sankeySpecFromParams(url.searchParams));
    const v = resolveVersion(url.searchParams.get('v'));
    const skin = resolveSkin('sankey', url.searchParams.get('t'), schemeParam(url.searchParams));
    const [dw, dh] = skin.size ?? SIZE.sankey;
    const width = clampInt(url.searchParams, 'w', dw, 200, 1600);
    const height = clampInt(url.searchParams, 'h', dh, 140, 1200);
    return svgResponse(renderSankey(spec, { width, height, version: v.version, skin }), v);
  }
  if (kind === 'hbar') {
    return chartHandler(url, 'hbar', (i, o) => renderHbarByMode(i, o), SIZE.hbar[0], SIZE.hbar[1], refParams);
  }
  if (kind === 'pie') {
    return chartHandler(url, 'pie', (i, o) => {
      if (i.multi) throw new ApiError(400, 'multi-series is not supported for type=pie');
      return renderPie(i.spec, o);
    }, SIZE.pie[0], SIZE.pie[1]);
  }
  if (kind === 'radar') {
    return chartHandler(url, 'radar', (i, o) => renderRadarByMode(i, o), SIZE.radar[0], SIZE.radar[1]);
  }
  if (kind === 'bar') {
    const stack = stackParam(url.searchParams);
    return chartHandler(url, 'bar', (i, o) => {
      if (o.skin.rules.barMode === 'grid') {
        if (i.multi) throw new ApiError(400, 'grid bar (t=grid) takes a single series; drop series=');
        return renderBarGrid(i.spec, o);
      }
      if (!i.multi) return renderBar(i.spec, o);
      return stack ? renderBarStacked(i.spec, o) : renderBarMulti(i.spec, o);
    }, SIZE.bar[0], SIZE.bar[1]);
  }
  if (kind === 'area') {
    return chartHandler(url, 'area', (i, o) => renderAreaByMode(i, o), SIZE.area[0], SIZE.area[1]);
  }
  return chartHandler(url, 'line', (i, o) => (i.multi ? renderLineMulti(i.spec, o) : renderLine(i.spec, o)), SIZE.line[0], SIZE.line[1]);
}


// 边缘缓存读:GET 图表/演示页响应按 URL 命中 Cache API(每 CF 节点独立)。
// POST、错误、no-store 不进缓存;?v= 与短链的 TTL 语义由 Cache-Control 承载。
// 缓存键带版本号:渲染逻辑修复的部署 bump ECV,旧条目(可能含坏渲染)整体作废
const ECV = '2';
function edgeKey(request: Request): Request {
  const u = new URL(request.url);
  u.searchParams.set('ecv', ECV);
  return new Request(u.toString());
}
async function edgeCached(request: Request, render: () => Response | Promise<Response>): Promise<Response> {
  if (request.method !== 'GET') return await render();
  const cached = await caches.default.match(edgeKey(request));
  if (cached) return cached;
  return await render();
}

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    try {
      const res = await edgeCached(request, () => route(request, env));
      // 写入边缘缓存(同 URL 同节点命中后 ~10ms;TTL 由响应 Cache-Control 决定)
      const cc = res.headers.get('cache-control') ?? '';
      if (request.method === 'GET' && res.status === 200 && /max-age=(3[0-9]{2,}|86[0-9]{3}|315[0-9]{4})/.test(cc)) {
        // 边缘副本统一 300s 淘汰:浏览器仍按原头缓存(短链 immutable 1 年),
        // 但渲染修复最迟 5 分钟/节点 内传播。注意:不能 new Response(res.body, res)——
        // 那会把 body 流转移给副本,原响应返回时抛 TypeError(曾致全站图表 500)。
        // 正确做法:clone 后读出文本,用可变 Headers 构造独立副本
        ctx.waitUntil((async () => {
          const body = await res.clone().text();
          const h = new Headers(res.headers);
          h.set('cache-control', 'public, max-age=300');
          await caches.default.put(edgeKey(request), new Response(body, { status: 200, headers: h }));
        })());
      }
      return res;
    } catch (e) {
      if (e instanceof ApiError) return textResponse(e.status, e.message);
      const rid = crypto.randomUUID().slice(0, 8);
      console.error(JSON.stringify({
        msg: 'unhandled error', rid, method: request.method, url: request.url,
        error: e instanceof Error ? e.stack ?? e.message : String(e),
      }));
      return textResponse(500, `internal error (ref ${rid})`);
    }
  },
};
