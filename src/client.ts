/// <reference lib="dom" />
// 浏览器入口:引一行 <script> 就出图 —— **不请求后台**。
//
//   <script src="https://cdn.jsdelivr.net/npm/@x-cmd/draw@latest/client"></script>
//   <div data-draw="type=bar&labels=Jan,Feb&values=1,2"></div>
//
// 参数语法跟 /draw 端点**一模一样**(「URL 即数据」这条不许破)⇒
// 报告里那张图,地址栏上的参数就是它的全部数据 ✓
//
// 渲染器本来就是「拼字符串」的 ⇒ 与环境无关(Worker 里靠 svgdom 垫片,浏览器里用真 DOM)
// ⇒ 同一份渲染器,服务端与浏览器两端画出来的一样 ✓

// 只引**要用的模块**,不走 lib.js 的桶 ——
// 桶里有 PNG(resvg/wasm)、echarts SSR、node:fs 那些浏览器用不上的 ⇒ 浏览器包会炸。
import { ApiError, clip, parseMarks } from './specs/base.js';
import { parseInput } from './specs/input.js';
import { parseComboSpec, comboSpecFromParams } from './specs/combo.js';
import { parseSankeySpec, sankeySpecFromParams } from './specs/sankey.js';
import { parseQuadrantSpec, quadrantSpecFromParams } from './specs/quadrant.js';
import { parseCompassSpec, compassSpecFromParams } from './specs/compass.js';
import { parseButterflySpec, butterflySpecFromParams } from './specs/butterfly.js';
import { parseLadderSpec, ladderSpecFromParams } from './specs/ladder.js';
import { parseCalendarSpec, calendarSpecFromParams } from './specs/calendar.js';
import { parseGaugeSpec, gaugeSpecFromParams } from './specs/gauge.js';
import { parseScatterSpec, scatterSpecFromParams } from './specs/scatter.js';
import type { ChartSpec, MultiSpec, ComboSpec, SankeySpec, GaugeSpec, ScatterSpec, QuadrantSpec, CompassSpec, ButterflySpec } from './specs/index.js';
import { resolveSkin } from './styles/index.js';
import type { Scheme, Skin } from './styles/types.js';
import { checkSlotColors, refParams as refLinesParam } from './render/query.js';
import { EDIT_TAG_STRIP_SRC } from './render/svg.js';
import type { RenderOpts } from './render/svg.js';
import { CURRENT_VERSION } from './version.js';
import { renderPie } from './render/pie.js';
import { renderBar } from './render/bar.js';
import { renderBarGrid } from './render/bar-grid.js';
import { renderBarMulti } from './render/bar-grouped.js';
import { renderBarStacked } from './render/bar-stacked.js';
import { renderCombo } from './render/combo.js';
import { renderLine } from './render/line.js';
import { renderLineMulti } from './render/line-multi.js';
import { renderAreaByMode } from './render/area.js';
import { renderGauge } from './render/gauge.js';
import { renderScatter } from './render/scatter.js';
import { renderQR, requireQRText, parseColor, QR_DEFAULTS } from './render/qr.js';
import { renderSankey } from './render/sankey.js';
import { renderRadarByMode } from './render/radar.js';
import { renderQuadrant } from './render/quadrant.js';
import { renderCompass } from './render/compass.js';
import { renderHbarByMode } from './render/hbar-spec.js';
import { renderButterfly } from './render/butterfly.js';
import { renderLadder, renderButterflyLadder } from './render/ladder.js';
import { renderCalendar } from './render/calendar.js';

export const CHART_KINDS = [
  'pie', 'bar', 'hbar', 'line', 'area', 'gauge', 'scatter', 'combo', 'sankey', 'radar',
  'qr', 'quadrant', 'compass', 'butterfly', 'calendar', 'ladder', 'butterfly-ladder',
] as const;

export type ChartKind = (typeof CHART_KINDS)[number];

export type AnySpec =
  | ChartSpec | MultiSpec | ComboSpec | SankeySpec | GaugeSpec | ScatterSpec
  | QuadrantSpec | CompassSpec | ButterflySpec;

export const DEF_SIZE: Record<ChartKind, [number, number]> = {
  pie: [560, 300], bar: [560, 320], hbar: [560, 320], line: [640, 360], area: [640, 360],
  gauge: [480, 320], scatter: [560, 360], combo: [560, 320], sankey: [720, 420], radar: [480, 360],
  qr: [420, 420], quadrant: [760, 520], compass: [560, 460], butterfly: [640, 420],
  calendar: [760, 520], ladder: [640, 420], 'butterfly-ladder': [900, 520],
};

/** num=all|peak|none ⇒ 数值标注(库认这个参数,但得由渲染方传进去 ✓) */
export function valueLabelsParam(params: URLSearchParams): 'all' | 'peak' | 'none' | undefined {
  const raw = params.get('num');
  if (raw === null || raw === '') return undefined;
  if (raw === 'all' || raw === 'peak' || raw === 'none') return raw;
  throw new ApiError(400, `"num" must be one of: all, peak, none (value labels). Got: ${JSON.stringify(raw)}`);
}

/** stacked=1 ⇒ 堆叠柱 */
function stackParam(params: URLSearchParams): boolean {
  const v = params.get('stack');
  return v === '1' || v === 'true';
}

function clampInt(params: URLSearchParams, key: string, def: number, min: number, max: number): number {
  const raw = params.get(key);
  if (raw === null || raw === '') return def;
  const n = Number(raw);
  if (!Number.isFinite(n)) return def;
  return Math.round(Math.min(max, Math.max(min, n)));
}

/**
 * 出一张图(参数 → 规格 → SVG)。
 *
 * @param kind   图种(pie / bar / …)
 * @param params 查询串(与 /draw 端点完全一致)
 * @param scheme 明暗
 */
export function renderChartFromParams(
  kind: ChartKind,
  params: URLSearchParams,
  scheme: Scheme = 'dark',
): { svg: string; spec: AnySpec; skin: Skin } {
  const skin = resolveSkin(kind, params.get('t'), scheme === 'auto' ? 'dark' : scheme);
  const [dw, dh] = skin.size ?? DEF_SIZE[kind];
  const marks = parseMarks(params);
  const valueLabels = valueLabelsParam(params);
  const refExtra = refLinesParam(params);
  const o: RenderOpts = {
    width: clampInt(params, 'w', dw, 200, 2400),
    height: clampInt(params, 'h', dh, 140, 2000),
    autoWidth: params.get('w') === null,
    autoHeight: params.get('h') === null,
    version: CURRENT_VERSION,
    skin,
    interactive: true,
    ...(marks !== undefined ? { marks } : {}),
    ...(valueLabels ? { valueLabels } : {}),
    ...refExtra,
  };

  if (kind === 'combo') {
    const spec = parseComboSpec(comboSpecFromParams(params));
    return { svg: renderCombo(spec, o), spec, skin };
  }
  if (kind === 'line') {
    const input = parseInput(params, 'line');
    checkSlotColors(input, skin, params.get('t'));
    return input.multi
      ? { svg: renderLineMulti(input.spec, o), spec: input.spec, skin }
      : { svg: renderLine(input.spec, o), spec: input.spec, skin };
  }
  if (kind === 'area') {
    const input = parseInput(params, 'area');
    return { svg: renderAreaByMode(input, o), spec: input.spec, skin };
  }
  if (kind === 'gauge') {
    const spec = parseGaugeSpec(gaugeSpecFromParams(params));
    return { svg: renderGauge(spec, o), spec, skin };
  }
  if (kind === 'scatter') {
    const spec = parseScatterSpec(scatterSpecFromParams(params));
    return { svg: renderScatter(spec, o), spec, skin };
  }
  if (kind === 'qr') {
    const text = requireQRText(params.get('d'));
    const fg = parseColor(params.get('fg'), QR_DEFAULTS.fg, 'fg');
    const bg = parseColor(params.get('bg'), QR_DEFAULTS.bg, 'bg');
    const caption = clip(params.get('title') ?? '', 40) || undefined;
    const subtitle = clip(params.get('unit') ?? '', 24) || undefined;
    return {
      svg: renderQR(text, fg, bg, o.width, o.height, o.version, skin, caption, subtitle),
      spec: {} as ChartSpec, skin,
    };
  }
  if (kind === 'hbar') {
    const input = parseInput(params, 'hbar');
    checkSlotColors(input, skin, params.get('t'));
    return { svg: renderHbarByMode(input, o), spec: input.spec, skin };
  }
  if (kind === 'sankey') {
    const spec = parseSankeySpec(sankeySpecFromParams(params));
    return { svg: renderSankey(spec, o), spec, skin };
  }
  if (kind === 'quadrant') {
    const spec = parseQuadrantSpec(quadrantSpecFromParams(params));
    return { svg: renderQuadrant(spec, o), spec, skin };
  }
  if (kind === 'compass') {
    const spec = parseCompassSpec(compassSpecFromParams(params));
    return { svg: renderCompass(spec, o), spec, skin };
  }
  if (kind === 'butterfly') {
    const spec = parseButterflySpec(butterflySpecFromParams(params) ?? '{}');
    return { svg: renderButterfly(spec, o), spec, skin };
  }
  if (kind === 'calendar') {
    const spec = parseCalendarSpec(calendarSpecFromParams(params) ?? '{}');
    return { svg: renderCalendar(spec, o), spec, skin };
  }
  if (kind === 'ladder' || kind === 'butterfly-ladder') {
    const spec = parseLadderSpec(ladderSpecFromParams(params) ?? '{}');
    const svg = kind === 'ladder' ? renderLadder(spec, o) : renderButterflyLadder(spec, o);
    return { svg, spec, skin };
  }
  if (kind === 'radar') {
    const input = parseInput(params, 'radar');
    const vals = input.multi
      ? input.spec.series.flatMap((s: { values: number[] }) => s.values)
      : input.spec.data.map((d: { value: number }) => d.value);
    const dataMax = Math.max(...vals);
    let skin2 = skin;
    if (skin.rules.radarMax > 0 && dataMax < skin.rules.radarMax * 0.3) {
      skin2 = { ...skin, rules: { ...skin.rules, radarMax: 0 } };
    }
    const o2 = { ...o, skin: skin2 };
    return { svg: renderRadarByMode(input, o2), spec: input.spec, skin: skin2 };
  }
  const input = parseInput(params, kind === 'pie' ? 'pie' : 'bar');
  if (kind === 'pie' || kind === 'bar') checkSlotColors(input, skin, params.get('t'));
  if (kind === 'pie') {
    if (input.multi) throw new ApiError(400, 'multi-series is not supported for type=pie');
    return { svg: renderPie(input.spec as ChartSpec, o), spec: input.spec, skin };
  }
  if (skin.rules.barMode === 'grid') {
    if (input.multi) throw new ApiError(400, 'grid bar (t=grid) takes a single series; drop series=');
    return { svg: renderBarGrid(input.spec as ChartSpec, o), spec: input.spec, skin };
  }
  if (!input.multi) return { svg: renderBar(input.spec as ChartSpec, o), spec: input.spec, skin };
  const svg = stackParam(params)
    ? renderBarStacked(input.spec as MultiSpec, o)
    : renderBarMulti(input.spec as MultiSpec, o);
  return { svg, spec: input.spec, skin };
}

// ── 浏览器运行时 ──────────────────────────────────────────────────────────

/** 图元上的 data-tip ⇒ 悬停给一句话;data-legend ⇒ 图例项(点了显隐系列) */
const TIP_CSS = `
.draw-tip{position:fixed;z-index:9999;max-width:320px;padding:8px 11px;border-radius:10px;
background:rgba(17,17,20,.88);backdrop-filter:blur(8px);border:1px solid rgba(255,255,255,.14);
border-left:3px solid #6366f1;color:#f4f4f5;font:13px/1.45 ui-sans-serif,system-ui,sans-serif;
pointer-events:none;opacity:0;transform:translateY(3px);transition:opacity .12s,transform .12s}
.draw-tip.show{opacity:1;transform:none}
svg.chart .is-hovered{filter:brightness(1.18)}
svg.chart .is-hidden{opacity:.12}
svg.chart [data-legend]{cursor:pointer}
svg.chart [data-legend].is-off{opacity:.4}
`;

let tipEl: HTMLElement | null = null;
let tipTimer = 0;

function ensureTip(): HTMLElement | null {
  if (typeof document === 'undefined') return null;
  if (!tipEl) {
    const style = document.createElement('style');
    style.textContent = TIP_CSS;
    document.head.appendChild(style);
    tipEl = document.createElement('div');
    tipEl.className = 'draw-tip';
    tipEl.setAttribute('role', 'tooltip');
    tipEl.hidden = true;
    document.body.appendChild(tipEl);
  }
  return tipEl;
}

function placeTip(x: number, y: number): void {
  const el = ensureTip();
  if (!el) return;
  const r = el.getBoundingClientRect();
  let left = x + 14;
  let top = y - r.height - 14;
  if (left + r.width > window.innerWidth - 8) left = x - r.width - 14;
  if (top < 8) top = y + 14;
  if (left < 8) left = 8;
  el.style.left = `${left}px`;
  el.style.top = `${top}px`;
}

function showTip(target: Element, x: number, y: number): void {
  const text = target.getAttribute('data-tip');
  const el = ensureTip();
  if (!el || !text) return;
  window.clearTimeout(tipTimer);
  el.textContent = text;
  el.hidden = false;
  placeTip(x, y);
  requestAnimationFrame(() => el.classList.add('show'));
}

function hideTip(): void {
  const el = ensureTip();
  if (!el) return;
  window.clearTimeout(tipTimer);
  el.classList.remove('show');
  tipTimer = window.setTimeout(() => {
    if (!el.classList.contains('show')) el.hidden = true;
  }, 140);
}

/** 悬停聚焦:图例 hover 时整个系列一起亮 */
function setHover(chart: SVGElement, target: Element | null): void {
  chart.querySelectorAll('.is-hovered').forEach((n) => n.classList.remove('is-hovered'));
  if (!target) return;
  const row = target.getAttribute('data-row');
  if (row !== null && row !== '') {
    chart.querySelectorAll(`[data-row="${row}"]`).forEach((n) => n.classList.add('is-hovered'));
    return;
  }
  if (target.hasAttribute('data-tip')) {
    target.classList.add('is-hovered');
    return;
  }
  const idx = target.getAttribute('data-legend');
  if (idx !== null && idx !== '') {
    chart.querySelectorAll(`[data-series="${idx}"]`).forEach((n) => n.classList.add('is-hovered'));
  }
}

/** 给一张图绑上交互(悬停出话 / 点图例显隐) */
export function bindChart(chart: SVGElement): void {
  chart.addEventListener('pointermove', (ev) => {
    const t = ev.target as Element | null;
    const hit = t?.closest?.('[data-tip],[data-legend],[data-row]') as Element | null;
    setHover(chart, hit);
    if (hit?.hasAttribute('data-tip')) showTip(hit, ev.clientX, ev.clientY);
    else hideTip();
  });
  chart.addEventListener('pointerleave', () => { setHover(chart, null); hideTip(); });
  chart.addEventListener('click', (ev) => {
    const t = ev.target as Element | null;
    const item = t?.closest?.('[data-legend]') as Element | null;
    if (!item) return;
    const idx = Number(item.getAttribute('data-legend'));
    if (!Number.isFinite(idx)) return;
    const off = item.classList.toggle('is-off');
    chart.querySelectorAll(`[data-series="${idx}"]`).forEach((n) => n.classList.toggle('is-hidden', off));
  });
}

/**
 * 把一张图画进元素。
 *
 * @param el     容器(会被换成那张 SVG)
 * @param params 查询串:「type=bar&labels=Jan,Feb&values=1,2」
 * @param scheme 明暗(默认跟系统走)
 */
export function renderChartTo(
  el: Element,
  params: URLSearchParams | string,
  scheme: Scheme = 'auto',
): string {
  const sp = typeof params === 'string' ? new URLSearchParams(params.replace(/^[?]/, '')) : params;
  const kind = (sp.get('type') ?? 'bar') as ChartKind;
  if (!CHART_KINDS.includes(kind)) {
    throw new ApiError(400, `unknown chart type: ${kind}. Known: ${CHART_KINDS.join(', ')}`);
  }
  const { svg } = renderChartFromParams(kind, sp, scheme);
  // ① 去掉「Edit @X-CMD」角标(用户的报告里不需要「去官网编辑这张图」)
  // ② 皮肤变量从 :root 挪到 svg.chart —— 不然会污染用户整页的 CSS 变量
  const clean = svg
    .replace(new RegExp(EDIT_TAG_STRIP_SRC, 'g'), '')
    .replace(/:root\{/g, 'svg.chart{')
    .replace('<svg ', '<svg class="chart" ');
  el.innerHTML = clean;
  const chart = el.querySelector('svg');
  if (chart) bindChart(chart as SVGElement);
  return svg;
}

/**
 * 扫一遍页面,把带 `data-draw` 的元素都画出来。
 *
 *   <div data-draw="type=bar&labels=Jan,Feb&values=1,2"></div>
 *
 * 后加的元素也会被画上(MutationObserver)—— 报告是动态生成的时候用得上。
 */
export function autoRender(root: ParentNode = typeof document !== 'undefined' ? document : (undefined as never)): number {
  if (typeof document === 'undefined') return 0;
  const scope = root ?? document;
  let n = 0;
  scope.querySelectorAll('[data-draw]').forEach((el) => {
    const src = el.getAttribute('data-draw');
    if (!src || el.getAttribute('data-drawed') === '1') return;
    try {
      renderChartTo(el, src, (el.getAttribute('data-scheme') as Scheme) || 'auto');
      el.setAttribute('data-drawed', '1');
      n++;
    } catch (e) {
      // 画不出来就在元素上留一句说明,别让整页静默少一张图
      el.textContent = `[draw] ${e instanceof Error ? e.message : String(e)}`;
    }
  });
  return n;
}

/** 浏览器里自动跑一遍(引了脚本就出图,不用再调一次) */
if (typeof document !== 'undefined') {
  const boot = (): void => { autoRender(document); };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
  // 动态加进来的图也画
  if (typeof MutationObserver !== 'undefined') {
    const mo = new MutationObserver(() => { autoRender(document); });
    mo.observe(document.documentElement, { childList: true, subtree: true });
  }
}
