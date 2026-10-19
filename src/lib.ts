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
export type { RenderOpts } from './render/svg.js';
import { renderFromUrl, type DrawResult } from './render/query.js';
export { renderFromUrl, renderStoredFromUrl } from './render/query.js';
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

export function draw(params: Record<string, string | string[]> | URLSearchParams | string): DrawResult {
  const sp = typeof params === 'string'
    ? new URLSearchParams(params.startsWith('?') ? params.slice(1) : params)
    : params instanceof URLSearchParams
      ? params
      : toSearchParams(params);
  // renderFromUrl 只读 searchParams;host 用占位符,不发起任何网络请求
  return renderFromUrl(new URL(`https://draw.local/?${sp.toString()}`));
}
