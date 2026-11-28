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
import { ApiError } from './specs/base.js';
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
import { renderArchmapFromUrl } from './render/archmap.js';
import { renderMindmapFromUrl } from './render/mindmap.js';
import { renderMermaidFromUrl } from './render/mermaid.js';
import { renderSeqFromUrl } from './render/seq.js';
import { renderUcFromUrl } from './render/uc.js';
import { renderGanttFromUrl } from './render/gantt.js';
import { renderGantt2FromUrl } from './render/gantt2.js';
import { renderGitGraphFromUrl } from './render/gitgraph.js';
import { renderJourneyFromUrl } from './render/journey.js';
import { renderTimelineFromUrl } from './render/timeline.js';
import { renderKanbanFromUrl } from './render/kanban.js';
import { renderBlockFromUrl } from './render/block.js';
import { renderPacketFromUrl } from './render/packet.js';
import { renderRequirementFromUrl } from './render/requirement.js';
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

import {
  CHART_KINDS, renderChartFromParams, type ChartKind,
} from './render/params-dispatch.js';

export { CHART_KINDS, renderChartFromParams, type ChartKind };
/**
 * 清理一张图,让它能直接进页面:
 * ① 去掉「Edit @X-CMD」角标(用户的报告里不需要「去官网编辑这张图」)
 * ② 皮肤变量从 `:root` 挪到 `svg.chart` —— 不然会污染用户整页的 CSS 变量
 * ③ 给 `<svg>` 挂上 `class="chart"`(样式与交互都按它找)
 */
export function cleanChartSvg(svg: string): string {
  return svg
    .replace(new RegExp(EDIT_TAG_STRIP_SRC, 'g'), '')
    .replace(/:root\{/g, 'svg.chart{')
    .replace('<svg ', '<svg class="chart" ');
}

/** 出一张图并清理好(直接可以塞进页面) */
export function chartSvg(
  kind: ChartKind,
  params: URLSearchParams | string,
  scheme: Scheme = 'dark',
): string {
  const sp = typeof params === 'string' ? new URLSearchParams(params.replace(/^[?]/, '')) : params;
  return cleanChartSvg(renderChartFromParams(kind, sp, scheme).svg);
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
  const svg = chartSvg(kind, sp, scheme);
  el.innerHTML = svg;
  const chart = el.querySelector('svg');
  if (chart) bindChart(chart as SVGElement);
  return svg;
}

/** 图族(结构图那一族)—— 参数是 n=/e=/b= 那些 */
export const DIAGRAM_KINDS = [
  'archmap', 'mindmap', 'mermaid', 'seq', 'uc', 'gantt', 'gantt2', 'gitgraph',
  'journey', 'timeline', 'kanban', 'block', 'packet', 'requirement',
] as const;

export type DiagramKind = (typeof DIAGRAM_KINDS)[number];

const DIAGRAM_RENDERERS: Record<DiagramKind, (url: URL) => { svg: string }> = {
  archmap: (u) => renderArchmapFromUrl(u, true),
  mindmap: (u) => renderMindmapFromUrl(u, true),
  mermaid: (u) => renderMermaidFromUrl(u, true),
  seq: (u) => renderSeqFromUrl(u, true),
  uc: (u) => renderUcFromUrl(u, true),
  gantt: (u) => renderGanttFromUrl(u, true),
  gantt2: (u) => renderGantt2FromUrl(u, true),
  gitgraph: (u) => renderGitGraphFromUrl(u, true),
  journey: (u) => renderJourneyFromUrl(u, true),
  timeline: (u) => renderTimelineFromUrl(u, true),
  kanban: (u) => renderKanbanFromUrl(u, true),
  block: (u) => renderBlockFromUrl(u, true),
  packet: (u) => renderPacketFromUrl(u, true),
  requirement: (u) => renderRequirementFromUrl(u, true),
};

/**
 * 画一张**结构图**(架构图/思维导图/序列图/甘特…)—— 参数是 n=/e=/b= 那些。
 * 跟 /draw 端点同一套渲染器 ⇒ 两端同图 ✓
 */
export function renderDiagramTo(
  el: Element,
  params: URLSearchParams | string,
  base = 'https://draw.invalid/',
): string {
  const sp = typeof params === 'string' ? new URLSearchParams(params.replace(/^[?]/, '')) : params;
  const kind = (sp.get('type') ?? 'archmap') as DiagramKind;
  const render = DIAGRAM_RENDERERS[kind];
  if (!render) {
    throw new ApiError(400, `unknown diagram kind: ${kind}. Known: ${DIAGRAM_KINDS.join(', ')}`);
  }
  const url = new URL(base);
  sp.forEach((v, k) => url.searchParams.append(k, v));
  const svg = cleanChartSvg(render(url).svg);
  el.innerHTML = svg;
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

// 球面那几样(地球仪/三维架构图)浏览器端也要用 ⇒ 从这里一并导出,
// 免得宿主为了它们去引整个 source 入口(那一族要外部库,浏览器包扛不住)
export { renderEarthGlobe, earthSceneFromUrl, type EarthScene, type EarthOpts } from './render/globe-earth.js';
export { projectScene, DEFAULT_CAMERA, type Camera, type Scene } from './render/scene3d.js';
export { WORLD_COUNTRIES, WORLD_YEAR, type WorldCountry } from './world-data.js';
