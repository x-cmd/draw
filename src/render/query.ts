// 参数 → SVG 的同步渲染核心(与 HTTP/运行时无关):
// 查询参数校验、尺寸/风格/版本解析、各图种分发,产出 DrawResult(纯数据)。
// HTTP 层(handler.ts)把它包成 Response;库(lib.ts)直接消费,无需网络。
import {
  ApiError, parseInput, parseGaugeSpec, gaugeSpecFromParams,
  parseScatterSpec, scatterSpecFromParams, parseComboSpec, comboSpecFromParams,
  parseQuadrantSpec, quadrantSpecFromParams, parseCompassSpec, compassSpecFromParams,
  parseButterflySpec, butterflySpecFromParams,
  parseLadderSpec, ladderSpecFromParams,
  parseCalendarSpec, calendarSpecFromParams,
  clip, type ChartInput,
} from '../specs/index.js';
import { resolveVersion, CURRENT_VERSION, type VersionInfo } from '../version.js';
import { parseAnnos, injectAnnos } from './anno.js';
import { renderPie } from './pie.js';
import type { RenderOpts } from './svg.js';
import type { RefLine } from './svg.js';
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
import { renderQuadrant } from './quadrant.js';
import { renderCompass } from './compass.js';
import { renderButterfly } from './butterfly.js';
import { renderLadder, renderButterflyLadder } from './ladder.js';
import { renderCalendar } from './calendar.js';
import { parseSankeySpec, sankeySpecFromParams } from '../specs/sankey.js';
import { renderStored } from './dispatch.js';
import { renderArchmapFromUrl } from './archmap.js';
import { parseTableSpec, tableSpecFromParams } from '../specs/table.js';
import { renderTable, tableToGrid } from './table.js';
import { renderMindmapFromUrl } from './mindmap.js';
import { resolveSkin, type Scheme, type Skin } from '../styles/index.js';
import { isSlot } from '../styles/types.js';
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
  quadrant: [760, 520],
  compass: [560, 460],
  butterfly: [640, 420],
  ladder: [640, 420],
  'butterfly-ladder': [900, 520],
  calendar: [760, 520],
  table: [640, 320],
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

/** 自动布局的方向:lr = 层往右走(默认),tb = 层往下走;不给 = 用默认 */
export function dirParam(params: URLSearchParams): 'LR' | 'TB' | undefined {
  const raw = params.get('dir');
  if (raw === null || raw === '') return undefined;
  const v = raw.trim().toLowerCase();
  if (v === 'lr') return 'LR';
  if (v === 'tb') return 'TB';
  throw new ApiError(400, `"dir" must be one of: lr, tb. Got: ${JSON.stringify(raw)}`);
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
  // 语义槽位前置校验(导出的同一份,hub 的两条直调路也用它)
  checkSlotColors(input, skin, request.searchParams.get('t'));
  const highlightRaw = request.searchParams.get('highlight');
  const highlight = highlightRaw === null || highlightRaw === '' ? undefined
    : new Set(highlightRaw.split(',').map((s) => s.trim()).filter(Boolean));
  const [sw, sh] = skin.size ?? [defW, defH]; // 设计变体默认 = 规范画布
  const width = clampInt(request.searchParams, 'w', sw, 200, 1600);
  const height = clampInt(request.searchParams, 'h', sh, 140, 1200);
  const valueLabels = valueLabelsParam(request.searchParams);
  const donut = kind === 'pie' ? (boolParam(request.searchParams, 'donut') ?? true) : undefined;
  const autoHeight = request.searchParams.get('h') === null;
  const autoWidth = request.searchParams.get('w') === null;
  return svgResult(render(input, { width, height, version: v.version, skin, autoHeight, autoWidth, highlight, ...(valueLabels !== undefined ? { valueLabels } : {}), ...(donut !== undefined ? { donut } : {}), ...(extra ? extra(request.searchParams) : {}) }), v);
}

// input(单系列/多系列)里的全部取色串 —— 槽位校验用
const ROLE_NAME_RE = /^(?:primary|success|warning|danger|info|accent)$/;

/**
 * 语义槽位前置校验:用了角色名(colors=danger)而该家族没配角色表 → 400 教正确写法。
 * 不做静默回退(静默 = 用户以为生效了,色值却根本没解析 —— 惊喜边界)。
 * hub 的 /draw? 与 /draw/explore/svg 有自己的分发器直调渲染器,绕不开这里 ——
 * 所以导出给那两条路也调(hub routes/render.ts、explore.ts)。
 */
export function checkSlotColors(input: ChartInput, skin: Skin, family: string | null): void {
  const used: string[] = [];
  if (input.multi) {
    for (const s of input.spec.series) if (s.color && ROLE_NAME_RE.test(s.color)) used.push(s.color);
  } else {
    for (const d of input.spec.data) if ('color' in d && d.color && ROLE_NAME_RE.test(d.color as string)) used.push(d.color as string);
  }
  if (used.length > 0 && !skin.roles) {
    throw new ApiError(
      400,
      `t=${JSON.stringify(family ?? '')} has no semantic roles; slot names (${used.join(', ')}) need one of the skin families (macaron, wabi-sabi, primer, morandi, nordic, salmon, neon). Use hex colors instead, or pick a skin family`,
    );
  }
}

// 参考线参数:?ref=<数值>[;<文案>][,#色] 可重复;?reflabel=<文案> 兼容旧写法(作用于第一条)。
// 分隔符:先 ';' 分文案、再 ',' 分颜色;文案里可以带 ';' 之前的任意字符,但 ';' 之后不再解析文案。
// 颜色要么 #rrggbb,要么 colors= 那套槽位名(s1..s10 / primary|success|warning|danger|info|accent|muted)。
const REF_SLOT_NAMES = 's1..s10, primary, success, warning, danger, info, accent, muted';

/** 一条 ref= 的解析结果 */
function parseRef(raw: string): RefLine {
  // 第一段是数值;';' 后是文案;文案后的第一个 ',' 后是颜色
  const semi = raw.indexOf(';');
  const numPart = semi < 0 ? raw : raw.slice(0, semi);
  const n = Number(numPart);
  if (!Number.isFinite(n)) {
    throw new ApiError(400, `"ref" must be a number (reference-line value), got ${JSON.stringify(raw)}. Example: ?ref=100 or ?ref=100;target`);
  }
  if (semi < 0) return { value: n };
  const rest = raw.slice(semi + 1);
  const comma = rest.indexOf(',');
  const label = comma < 0 ? rest : rest.slice(0, comma);
  // 文案里不能再有 ';' —— 分隔符只有这一层,再出现就是写错了
  if (label.includes(';')) {
    throw new ApiError(400, `"ref" label must not contain ";". Example: ?ref=100;target or ?ref=100;target,#60a5fa`);
  }
  if (comma < 0) return { value: n, ...(label ? { label } : {}) };
  const color = rest.slice(comma + 1).trim();
  if (!/^#[0-9a-fA-F]{6}$/.test(color) && !isSlot(color)) {
    throw new ApiError(400, `"ref" colour must be #rrggbb or a slot name (${REF_SLOT_NAMES}), got ${JSON.stringify(color)}. Example: ?ref=100;target,#60a5fa`);
  }
  return { value: n, ...(label ? { label } : {}), color };
}

// 参考线参数(?ref= 可重复;?reflabel= 旧写法作用于第一条)
//
// 旧写法(单条裸数值 + ?reflabel=)时**不填** refLines —— hbar 的旧竖线必须一像素不变,
// 由 o.refLine/o.refLabel 继续走老路径。新语法(带 ;文案/逗号色,或多条)才填 refLines。
export function refParams(params: URLSearchParams): Partial<RenderOpts> {
  const raws = params.getAll('ref').filter((r) => r !== '');
  if (!raws.length) return {};
  const refs = raws.map(parseRef);
  const first = refs[0];
  // 旧写法 ?reflabel= 只在没有内联文案时补上第一条(内联优先)
  const legacyLabel = params.get('reflabel');
  const withLabel = first.label ? first : (legacyLabel ? { ...first, label: legacyLabel } : first);
  // 是不是新语法:多条,或任一条带了 ';' / ','
  const isNew = refs.length > 1 || raws.some((r) => r.includes(';') || r.includes(','));
  if (!isNew) {
    // 旧写法:只给 refLine/refLabel,hbar 走原路径(老规矩:非负 —— 条形图没有负值)
    if (first.value < 0) {
      throw new ApiError(400, `"ref" must be a non-negative number (reference-line value), got ${JSON.stringify(raws[0])}`);
    }
    return { refLine: first.value, ...(withLabel.label ? { refLabel: withLabel.label } : {}) };
  }
  return {
    refLines: [withLabel, ...refs.slice(1)],
    refLine: first.value,
    ...(withLabel.label ? { refLabel: withLabel.label } : {}),
  };
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
  return withAnnos(renderFromUrlInner(url), url);
}

/** 标注层(_oval=/_text=):在画好的 SVG 上面再叠一层 —— 图还是那张图 */
function withAnnos(r: DrawResult, url: URL): DrawResult {
  const annos = parseAnnos(url.searchParams);
  if (!annos?.length) return r;
  return { ...r, svg: injectAnnos(r.svg, annos) };
}

function renderFromUrlInner(url: URL): DrawResult {
  const typeParam = url.searchParams.get('type');
  // 拓扑图族(x-cmd-hub/draw#17/#20):在 CHART_TEMPLATES 校验前拦截,短链注册表保持零接触
  // (CLI 透传/lib.draw()/裸查询串与 /draw/archmap 端点同参同输出)
  if (typeParam === 'archmap') return renderArchmapFromUrl(url);
  if (typeParam === 'mindmap') return renderMindmapFromUrl(url);
  if (!typeParam || !CHART_TEMPLATES.includes(typeParam as ChartTemplate)) {
    throw new ApiError(400, `"type" query param is required: one of ${CHART_TEMPLATES.join(', ')}. Example: /draw?type=pie&labels=A,B&values=1,2`);
  }
  const kind = typeParam as ChartTemplate;
  if (kind === 'table') {
    // 表格:规格来自 @x-cmd/table/core(唯一真源在多维表格仓那边)
    const spec = parseTableSpec(tableSpecFromParams(url.searchParams));
    const v = resolveVersion(url.searchParams.get('v'));
    const skin = resolveSkin('table', url.searchParams.get('t'), schemeParam(url.searchParams));
    const grid = tableToGrid(spec);
    const [tw, th] = skin.size ?? SIZE.table;
    // 表格的画布按内容算:没给 ?w=/?h= 就用自然尺寸
    const width = url.searchParams.has('w') ? clampInt(url.searchParams, 'w', tw, 200, 1600) : grid.width;
    const height = url.searchParams.has('h') ? clampInt(url.searchParams, 'h', th, 140, 1200) : grid.height;
    return svgResult(renderTable(spec, { width, height, version: v.version, skin }), v);
  }
  if (kind === 'qr') return qrRender(url);
  if (kind === 'quadrant') {
    const spec = parseQuadrantSpec(quadrantSpecFromParams(url.searchParams));
    const v = resolveVersion(url.searchParams.get('v'));
    const skin = resolveSkin('quadrant', url.searchParams.get('t'), schemeParam(url.searchParams));
    const [qw2, qh2] = skin.size ?? SIZE.quadrant;
    const width = clampInt(url.searchParams, 'w', qw2, 200, 1600);
    const height = clampInt(url.searchParams, 'h', qh2, 140, 1200);
    return svgResult(renderQuadrant(spec, { width, height, version: v.version, skin }), v);
  }
  if (kind === 'compass') {
    const spec = parseCompassSpec(compassSpecFromParams(url.searchParams));
    const v = resolveVersion(url.searchParams.get('v'));
    const skin = resolveSkin('compass', url.searchParams.get('t'), schemeParam(url.searchParams));
    const [cw, ch] = skin.size ?? SIZE.compass;
    const width = clampInt(url.searchParams, 'w', cw, 200, 1600);
    const height = clampInt(url.searchParams, 'h', ch, 140, 1200);
    return svgResult(renderCompass(spec, { width, height, version: v.version, skin }), v);
  }
  if (kind === 'ladder' || kind === 'butterfly-ladder') {
    const spec = parseLadderSpec(ladderSpecFromParams(url.searchParams) ?? '{}');
    const v = resolveVersion(url.searchParams.get('v'));
    const skin = resolveSkin(kind, url.searchParams.get('t'), schemeParam(url.searchParams));
    const [lw, lh] = skin.size ?? SIZE[kind];
    const width = clampInt(url.searchParams, 'w', lw, 200, 1600);
    const height = clampInt(url.searchParams, 'h', lh, 140, 1200);
    const aria = kind === 'ladder' ? 'ladder' : 'butterfly ladder';
    const autoHeight = url.searchParams.get('h') === null;
    const svg = kind === 'ladder'
      ? renderLadder(spec, { width, height, version: v.version, skin, interactive: true, autoHeight })
      : renderButterflyLadder(spec, { width, height, version: v.version, skin, interactive: true, autoHeight });
    return svgResult(svg, v);
  }

  if (kind === 'butterfly') {
    const spec = parseButterflySpec(butterflySpecFromParams(url.searchParams) ?? '{}');
    const v = resolveVersion(url.searchParams.get('v'));
    const skin = resolveSkin('butterfly', url.searchParams.get('t'), schemeParam(url.searchParams));
    const [bw, bh] = skin.size ?? SIZE.butterfly;
    const width = clampInt(url.searchParams, 'w', bw, 200, 1600);
    const height = clampInt(url.searchParams, 'h', bh, 140, 1200);
    return svgResult(renderButterfly(spec, { width, height, version: v.version, skin }), v);
  }
  if (kind === 'calendar') {
    const spec = parseCalendarSpec(calendarSpecFromParams(url.searchParams) ?? '{}');
    const v = resolveVersion(url.searchParams.get('v'));
    const skin = resolveSkin('calendar', url.searchParams.get('t'), schemeParam(url.searchParams));
    const [cw3, ch3] = skin.size ?? SIZE.calendar;
    const width = clampInt(url.searchParams, 'w', cw3, 200, 2000);
    const height = clampInt(url.searchParams, 'h', ch3, 140, 1600);
    return svgResult(renderCalendar(spec, { width, height, version: v.version, skin }), v);
  }
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
    return svgResult(renderScatter(spec, { width, height, version: v.version, skin, ...(vl !== undefined ? { valueLabels: vl } : {}), ...refParams(url.searchParams) }), v);
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
    }, SIZE.pie[0], SIZE.pie[1], refParams);
  }
  if (kind === 'radar') {
    return chartRender(url, 'radar', (i, o) => renderRadarByMode(i, o), SIZE.radar[0], SIZE.radar[1], refParams);
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
    }, SIZE.bar[0], SIZE.bar[1], refParams);
  }
  if (kind === 'area') {
    return chartRender(url, 'area', (i, o) => renderAreaByMode(i, o), SIZE.area[0], SIZE.area[1], refParams);
  }
  return chartRender(url, 'line', (i, o) => (i.multi ? renderLineMulti(i.spec, o) : renderLine(i.spec, o)), SIZE.line[0], SIZE.line[1], refParams);
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
