// 参数 → SVG 的同步渲染核心(与 HTTP/运行时无关):
// 查询参数校验、尺寸/风格/版本解析、各图种分发,产出 DrawResult(纯数据)。
// HTTP 层(handler.ts)把它包成 Response;库(lib.ts)直接消费,无需网络。
import {
  ApiError, parseInput, parseGaugeSpec, gaugeSpecFromParams,
  parseScatterSpec, scatterSpecFromParams, parseComboSpec, comboSpecFromParams,
  clip, type ChartInput,
} from '../specs/index.js';
import { resolveVersion, CURRENT_VERSION, type VersionInfo } from '../version.js';
import { renderPie } from './pie.js';
import type { RenderOpts } from './svg.js';
import { renderBar } from './bar.js';
import { renderBarGrid } from './bar-grid.js';
import { renderBarMulti } from './bar-grouped.js';
import { renderBarStacked } from './bar-stacked.js';
import { renderLine } from './line.js';
import { renderAreaByMode } from './area.js';
import { renderLineMulti } from './line-multi.js';
import { renderRadarByMode } from './radar.js';
import { renderHbarByMode } from './hbar-spec.js';
import { renderGauge } from './gauge.js';
import { renderScatter } from './scatter.js';
import { renderCombo } from './combo.js';
import { renderQR, parseColor, requireQRText, QR_DEFAULTS } from './qr.js';
import { renderSankey } from './sankey.js';
import { parseSankeySpec, sankeySpecFromParams } from '../specs/sankey.js';
import { renderStored } from './dispatch.js';
import { renderArchmapFromUrl } from './archmap.js';
import { renderMindmapFromUrl } from './mindmap.js';
import { resolveSkin, type Scheme } from '../styles/index.js';
import { CHART_TEMPLATES, type ChartTemplate, type StoredChart } from '../store.js';

// 渲染结果(HTTP 层据此构造响应头;库用户直接拿 svg)
/**
 * A render result: the SVG plus the version and Cache-Control it should carry.
 */
export interface DrawResult {
  svg: string;
  version: number;
  cacheControl: string;
}

// 各模板默认尺寸 [宽,高](renderFromUrl 与短链渲染共用,知识单点)
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

function svgResult(svg: string, v: VersionInfo): DrawResult {
  return { svg, version: v.version, cacheControl: v.cacheControl };
}

export function valueLabelsParam(params: URLSearchParams): 'all' | 'peak' | 'none' | undefined {
  const raw = params.get('num');
  if (raw === null || raw === '') return undefined; // 未指定 → 用皮肤默认(规范变体多为 none)
  if (raw === 'all' || raw === 'peak' || raw === 'none') return raw;
  throw new ApiError(400, `"num" must be one of: all, peak, none (value labels). Got: ${JSON.stringify(raw)}`);
}

export function clampInt(params: URLSearchParams, key: string, def: number, min: number, max: number): number {
  const raw = params.get(key);
  if (raw === null || raw === '') return def;
  const n = Number(raw);
  if (!Number.isFinite(n)) {
    throw new ApiError(400, `"${key}" must be a number between ${min} and ${max}, got ${JSON.stringify(raw)}`);
  }
  return Math.round(Math.min(max, Math.max(min, n)));
}

export function stackParam(params: URLSearchParams): boolean {
  const raw = params.get('stack');
  if (raw === null || raw === '' || raw === '0' || raw === 'false') return false;
  if (raw === '1' || raw === 'true') return true;
  throw new ApiError(400, `"stack" must be 1/true (stacked) or 0/false (grouped). Got: ${JSON.stringify(raw)}`);
}

export function schemeParam(params: URLSearchParams): Scheme {
  const raw = params.get('scheme');
  if (raw === null || raw === '' || raw === 'auto') return 'auto';
  if (raw === 'dark' || raw === 'light') return raw;
  throw new ApiError(400, `"scheme" must be one of: auto (default), dark, light. Got: ${JSON.stringify(raw)}`);
}

export function boolParam(params: URLSearchParams, key: string): boolean | undefined {
  const raw = params.get(key);
  if (raw === null || raw === '') return undefined;
  if (raw === '1' || raw === 'true') return true;
  if (raw === '0' || raw === 'false') return false;
  throw new ApiError(400, `"${key}" must be 1/true or 0/false. Got: ${JSON.stringify(raw)}`);
}

function chartRender(
  request: URL,
  kind: 'pie' | 'bar' | 'hbar' | 'line' | 'area' | 'radar',
  render: (input: ChartInput, o: RenderOpts) => string,
  defW: number,
  defH: number,
  extra?: (params: URLSearchParams) => Partial<RenderOpts>,
): DrawResult {
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
  return svgResult(render(input, { width, height, version: v.version, skin, autoHeight, autoWidth, ...(valueLabels !== undefined ? { valueLabels } : {}), ...(donut !== undefined ? { donut } : {}), ...(extra ? extra(request.searchParams) : {}) }), v);
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

function qrRender(request: URL): DrawResult {
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
  return svgResult(renderQR(text, fg, bg, width, height, v.version, skin, caption, subtitle), v);
}

// GET ?type=pie|bar|hbar|line|radar|gauge|scatter|combo|sankey|qr&...
/**
 * Render a chart synchronously from a URL's query params — exactly the
 * GET /draw semantics (`type` required; all params documented in the README).
 *
 * @throws ApiError(400) with a corrective example on bad params
 */
export function renderFromUrl(url: URL): DrawResult {
  const typeParam = url.searchParams.get('type');
  // 拓扑图族(x-cmd-hub/draw#17/#20):在 CHART_TEMPLATES 校验前拦截,短链注册表保持零接触
  // (CLI 透传/lib.draw()/裸查询串与 /draw/archmap 端点同参同输出)
  if (typeParam === 'archmap') return renderArchmapFromUrl(url);
  if (typeParam === 'mindmap') return renderMindmapFromUrl(url);
  if (!typeParam || !CHART_TEMPLATES.includes(typeParam as ChartTemplate)) {
    throw new ApiError(400, `"type" query param is required: one of ${CHART_TEMPLATES.join(', ')}. Example: /draw?type=pie&labels=A,B&values=1,2`);
  }
  const kind = typeParam as ChartTemplate;
  if (kind === 'qr') return qrRender(url);
  if (kind === 'gauge') {
    const spec = parseGaugeSpec(gaugeSpecFromParams(url.searchParams));
    const v = resolveVersion(url.searchParams.get('v'));
    const skin = resolveSkin('gauge', url.searchParams.get('t'), schemeParam(url.searchParams));
    const [gw, gh] = skin.size ?? SIZE.gauge;
    const width = clampInt(url.searchParams, 'w', gw, 200, 1600);
    const height = clampInt(url.searchParams, 'h', gh, 140, 1200);
    return svgResult(renderGauge(spec, { width, height, version: v.version, skin }), v);
  }
  if (kind === 'scatter') {
    const spec = parseScatterSpec(scatterSpecFromParams(url.searchParams));
    const v = resolveVersion(url.searchParams.get('v'));
    const skin = resolveSkin('scatter', url.searchParams.get('t'), schemeParam(url.searchParams));
    const [dw, dh] = skin.size ?? SIZE.scatter;
    const width = clampInt(url.searchParams, 'w', dw, 200, 1600);
    const height = clampInt(url.searchParams, 'h', dh, 140, 1200);
    const vl = valueLabelsParam(url.searchParams);
    return svgResult(renderScatter(spec, { width, height, version: v.version, skin, ...(vl !== undefined ? { valueLabels: vl } : {}) }), v);
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
    return svgResult(renderCombo(spec, { width, height, version: v.version, skin, autoWidth, ...(vl !== undefined ? { valueLabels: vl } : {}) }), v);
  }
  if (kind === 'sankey') {
    const spec = parseSankeySpec(sankeySpecFromParams(url.searchParams));
    const v = resolveVersion(url.searchParams.get('v'));
    const skin = resolveSkin('sankey', url.searchParams.get('t'), schemeParam(url.searchParams));
    const [dw, dh] = skin.size ?? SIZE.sankey;
    const width = clampInt(url.searchParams, 'w', dw, 200, 1600);
    const height = clampInt(url.searchParams, 'h', dh, 140, 1200);
    return svgResult(renderSankey(spec, { width, height, version: v.version, skin }), v);
  }
  if (kind === 'hbar') {
    return chartRender(url, 'hbar', (i, o) => renderHbarByMode(i, o), SIZE.hbar[0], SIZE.hbar[1], refParams);
  }
  if (kind === 'pie') {
    return chartRender(url, 'pie', (i, o) => {
      if (i.multi) throw new ApiError(400, 'multi-series is not supported for type=pie');
      return renderPie(i.spec, o);
    }, SIZE.pie[0], SIZE.pie[1]);
  }
  if (kind === 'radar') {
    return chartRender(url, 'radar', (i, o) => renderRadarByMode(i, o), SIZE.radar[0], SIZE.radar[1]);
  }
  if (kind === 'bar') {
    const stack = stackParam(url.searchParams);
    return chartRender(url, 'bar', (i, o) => {
      if (o.skin.rules.barMode === 'grid') {
        if (i.multi) throw new ApiError(400, 'grid bar (t=grid) takes a single series; drop series=');
        return renderBarGrid(i.spec, o);
      }
      if (!i.multi) return renderBar(i.spec, o);
      return stack ? renderBarStacked(i.spec, o) : renderBarMulti(i.spec, o);
    }, SIZE.bar[0], SIZE.bar[1]);
  }
  if (kind === 'area') {
    return chartRender(url, 'area', (i, o) => renderAreaByMode(i, o), SIZE.area[0], SIZE.area[1]);
  }
  return chartRender(url, 'line', (i, o) => (i.multi ? renderLineMulti(i.spec, o) : renderLine(i.spec, o)), SIZE.line[0], SIZE.line[1]);
}

// 短链渲染段:?w/?h/?num/?scheme 应用到存档 doc(immutable,版本恒为当前)
/**
 * Render a stored (short-linked) chart, applying `w`/`h`/`num`/`scheme` overrides from the URL.
 */
export function renderStoredFromUrl(doc: StoredChart, url: URL): DrawResult {
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
  return { svg: renderStored(doc, o), version: CURRENT_VERSION, cacheControl: 'public, max-age=31536000, immutable' };
}
