// npm 库入口(@x-cmd/draw):
//   import { draw } from '@x-cmd/draw';
//   const { svg } = draw({ type: 'pie', labels: 'A,B', values: '3,2' });
// 高层 draw() 同步渲染,与 GET /draw?type=... 完全同参同输出,无需网络。
// 亦可直接使用下层解析/渲染/皮肤 API(与线上服务同一套代码)。
export * from './specs/index.js';
export * from './styles/index.js';
export { CURRENT_VERSION, resolveVersion, type VersionInfo } from './version.js';
export { renderPie } from './render/pie.js';
export { renderBar } from './render/bar.js';
export { renderBarGrid } from './render/bar-grid.js';
export { renderBarMulti } from './render/bar-grouped.js';
export { renderBarStacked } from './render/bar-stacked.js';
export { renderLine } from './render/line.js';
export { renderLineMulti } from './render/line-multi.js';
export { renderAreaByMode } from './render/area.js';
export { renderRadarByMode } from './render/radar.js';
export { renderHbarByMode } from './render/hbar-spec.js';
export { renderGauge } from './render/gauge.js';
export { renderScatter } from './render/scatter.js';
export { renderCombo } from './render/combo.js';
export { renderQR } from './render/qr.js';
export { renderSankey } from './render/sankey.js';
export { renderStored } from './render/dispatch.js';
// Small helpers that page builders (and the x-cmd-hosted worker) reuse:
export { esc, fmtFull, fmtNum, textW } from './render/svg.js';
export { parseColor, requireQRText, QR_DEFAULTS } from './render/qr.js';
export { assertDims } from './render/radar.js';
export type { RenderOpts } from './render/svg.js';
import { renderFromUrl, type DrawResult } from './render/query.js';
export { renderFromUrl, renderStoredFromUrl } from './render/query.js';
// echarts 覆盖层:异步(SSR 引擎按需加载),与 GET /draw/echarts 同参同输出
export { renderEchartsFromUrl, renderEchartsOption } from './render/echarts-ssr.js';
// archmap 拓扑图:同步,与 GET /draw/archmap 同参同输出(draw({type:'archmap', n:[...]}) 亦可)
export { renderArchmapFromUrl } from './render/archmap.js';
// mindmap 树形导图:同步,与 GET /draw/mindmap 同参同输出
export { renderMindmapFromUrl } from './render/mindmap.js';
// PNG 导出(x-cmd-hub/draw#24):任意渲染产出的 SVG → 平面化(烘焙) → resvg-wasm 光栅化;
// 异步且 lazy 加载 wasm,库用户不调 png 则零成本
export { svgToPng, bakeFlatSvg } from './render/png.js';
export type { DrawResult } from './render/query.js';
export {
  CHART_TEMPLATES, fingerprint, canonicalJson,
  type ChartTemplate, type StoredChart,
} from './store.js';

// 对象/查询串/URLSearchParams → DrawResult(同步)。
// 对象值支持数组(重复参数,labels 含逗号时用):
//   draw({ type: 'bar', labels: ['Q1, 2024', 'Q2'], values: [1, 2] })
function toSearchParams(o: Record<string, string | string[]>): URLSearchParams {
  const sp = new URLSearchParams();
  for (const [k, v] of Object.entries(o)) {
    if (Array.isArray(v)) for (const item of v) sp.append(k, item);
    else sp.append(k, v);
  }
  return sp;
}

/**
 * Render a chart to an SVG string — synchronously, with no network access.
 *
 * Params mirror the `GET /draw` query string exactly (`type` required):
 * `labels`/`values` (or `series=`), `t` style family, `scheme`, `w`/`h`, `num`,
 * `title`, `unit`, `v`, and the chart-specific params from the README.
 *
 * @example
 * ```ts
 * import { draw } from "@x-cmd/draw";
 *
 * const { svg, version } = draw({ type: "pie", labels: "A,B", values: "3,2" });
 * draw("?type=bar&labels=Mon,Tue&values=3,5");                        // query string form
 * draw({ type: "bar", labels: ["Q1, 2024", "Q2"], values: [1, 2] });  // arrays = repeated params
 * ```
 *
 * @throws ApiError(400) with a corrective message on bad params
 */
export function draw(params: Record<string, string | string[]> | URLSearchParams | string): DrawResult {
  const sp = typeof params === 'string'
    ? new URLSearchParams(params.startsWith('?') ? params.slice(1) : params)
    : params instanceof URLSearchParams
      ? params
      : toSearchParams(params);
  // renderFromUrl 只读 searchParams;host 用占位符,不发起任何网络请求
  return renderFromUrl(new URL(`https://draw.local/?${sp.toString()}`));
}
