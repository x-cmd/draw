// 模板分发:ChartTemplate(+ChartInput/存档 spec)→ 渲染器。短链与 create 共用。
import { ApiError, parseChartSpec, parseSeriesSpec, parseGaugeSpec, parseScatterSpec, parseComboSpec, looksMultiSeries, type ChartInput } from '../specs';
import { renderPie } from './pie';
import { renderBar } from './bar';
import { renderBarGrid } from './bar-grid';
import { renderBarMulti } from './bar-grouped';
import { renderBarStacked } from './bar-stacked';
import { renderLine } from './line';
import { renderAreaByMode } from './area';
import { renderLineMulti } from './line-multi';
import { renderRadarByMode } from './radar';
import { renderHBar } from './hbar';
import { renderHbarByMode } from './hbar-spec';
import { renderGauge } from './gauge';
import { renderScatter } from './scatter';
import { renderCombo } from './combo';
import { renderQR, requireQRText, parseColor, QR_DEFAULTS } from './qr';
import { renderSankey } from './sankey';
import { parseSankeySpec } from '../specs/sankey';
import type { RenderOpts } from './svg';
import type { ChartTemplate, StoredChart } from '../store';

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
