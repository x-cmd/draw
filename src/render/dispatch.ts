// 模板分发:ChartTemplate(+ChartInput/存档 spec)→ 渲染器。短链与 create 共用。
import { ApiError, parseChartSpec, parseSeriesSpec, parseGaugeSpec, parseScatterSpec, parseComboSpec, looksMultiSeries, type ChartInput } from '../specs/index.js';
import { renderPie } from './pie.js';
import { renderBar } from './bar.js';
import { renderBarGrid } from './bar-grid.js';
import { renderBarMulti } from './bar-grouped.js';
import { renderBarStacked } from './bar-stacked.js';
import { renderLine } from './line.js';
import { renderAreaByMode } from './area.js';
import { renderLineMulti } from './line-multi.js';
import { renderRadarByMode } from './radar.js';
import { renderHBar } from './hbar.js';
import { renderHbarByMode } from './hbar-spec.js';
import { renderGauge } from './gauge.js';
import { renderScatter } from './scatter.js';
import { renderCombo } from './combo.js';
import { renderQR, requireQRText, parseColor, QR_DEFAULTS } from './qr.js';
import { renderSankey } from './sankey.js';
import { parseSankeySpec } from '../specs/sankey.js';
import type { RenderOpts } from './svg.js';
import type { ChartTemplate, StoredChart } from '../store.js';

function dispatch(template: ChartTemplate, input: ChartInput, o: RenderOpts, stack = false): string {
  switch (template) {
    case 'pie':
      if (input.multi) throw new ApiError(400, 'multi-series is not supported for pie');
      return renderPie(input.spec, o);
    case 'bar':
      if (o.skin.rules.barMode === 'grid') {
        if (input.multi) throw new ApiError(400, 'grid bar (t=grid) takes a single series');
        return renderBarGrid(input.spec, o);
      }
      if (!input.multi) return renderBar(input.spec, o);
      return stack ? renderBarStacked(input.spec, o) : renderBarMulti(input.spec, o);
    case 'line':
      return input.multi ? renderLineMulti(input.spec, o) : renderLine(input.spec, o);
    case 'area':
      return renderAreaByMode(input, o);
    case 'hbar':
      return renderHbarByMode(input, o);
    case 'radar':
      return renderRadarByMode(input, o);
    default:
      throw new ApiError(400, `template ${template} cannot be rendered here`);
  }
}

// 短链存档 → SVG(结构校验后分发)
export function renderStored(doc: StoredChart, o: RenderOpts): string {
  if (doc.template === 'qr') {
    // 存档可能早于校验规则改动:渲染前按 create 同一规则复验(文本长度/颜色必为 hex)
    const s = doc.spec as { text?: unknown; fg?: unknown; bg?: unknown };
    const text = requireQRText(typeof s.text === 'string' ? s.text : null);
    const fg = parseColor(typeof s.fg === 'string' ? s.fg : null, QR_DEFAULTS.fg, 'fg');
    const bg = parseColor(typeof s.bg === 'string' ? s.bg : null, QR_DEFAULTS.bg, 'bg');
    return renderQR(text, fg, bg, o.width, o.height, o.version, o.skin);
  }
  const specJson = JSON.stringify(doc.spec);
  if (doc.template === 'gauge') return renderGauge(parseGaugeSpec(specJson), o);
  if (doc.template === 'scatter') return renderScatter(parseScatterSpec(specJson), o);
  if (doc.template === 'combo') return renderCombo(parseComboSpec(specJson), o);
  if (doc.template === 'sankey') return renderSankey(parseSankeySpec(specJson), o);
  const input: ChartInput = looksMultiSeries(specJson)
    ? { multi: true, spec: parseSeriesSpec(specJson, doc.template === 'line' || doc.template === 'area' ? 'line' : 'bar') }
    : { multi: false, spec: parseChartSpec(specJson, doc.template) };
  return dispatch(doc.template, input, o, doc.stack === true);
}
