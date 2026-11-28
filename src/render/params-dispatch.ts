// 参数 → 规格 → SVG 的调度(**不含 DOM**):服务端与浏览器端都调它 ⇒ 同一份实现 ✓
//
// 参数语法就是 URL 查询串(「URL 即数据」):?type=bar&labels=Jan,Feb&values=1,2

import { ApiError, clip, parseMarks } from '../specs/base.js';
import { parseInput } from '../specs/input.js';
import { parseComboSpec, comboSpecFromParams } from '../specs/combo.js';
import { parseSankeySpec, sankeySpecFromParams } from '../specs/sankey.js';
import { parseQuadrantSpec, quadrantSpecFromParams } from '../specs/quadrant.js';
import { parseCompassSpec, compassSpecFromParams } from '../specs/compass.js';
import { parseButterflySpec, butterflySpecFromParams } from '../specs/butterfly.js';
import { parseLadderSpec, ladderSpecFromParams } from '../specs/ladder.js';
import { parseCalendarSpec, calendarSpecFromParams } from '../specs/calendar.js';
import { parseGaugeSpec, gaugeSpecFromParams } from '../specs/gauge.js';
import { parseScatterSpec, scatterSpecFromParams } from '../specs/scatter.js';
import type { ChartSpec, MultiSpec, ComboSpec, SankeySpec, GaugeSpec, ScatterSpec, QuadrantSpec, CompassSpec, ButterflySpec } from '../specs/index.js';
import { resolveSkin } from '../styles/index.js';
import type { Scheme, Skin } from '../styles/types.js';
import { checkSlotColors, refParams as refLinesParam } from '../render/query.js';
import type { RenderOpts } from './svg.js';
import { EDIT_TAG_STRIP_SRC } from '../render/svg.js';
import { CURRENT_VERSION } from '../version.js';
import { renderPie } from '../render/pie.js';
import { renderBar } from '../render/bar.js';
import { renderBarGrid } from '../render/bar-grid.js';
import { renderBarMulti } from '../render/bar-grouped.js';
import { renderBarStacked } from '../render/bar-stacked.js';
import { renderCombo } from '../render/combo.js';
import { renderLine } from '../render/line.js';
import { renderLineMulti } from '../render/line-multi.js';
import { renderAreaByMode } from '../render/area.js';
import { renderGauge } from '../render/gauge.js';
import { renderScatter } from '../render/scatter.js';
import { renderQR, requireQRText, parseColor, QR_DEFAULTS } from '../render/qr.js';
import { renderSankey } from '../render/sankey.js';
import { renderRadarByMode } from '../render/radar.js';
import { renderQuadrant } from '../render/quadrant.js';
import { renderCompass } from '../render/compass.js';
import { renderHbarByMode } from '../render/hbar-spec.js';
import { renderButterfly } from '../render/butterfly.js';
import { renderLadder, renderButterflyLadder } from '../render/ladder.js';
import { renderCalendar } from '../render/calendar.js';

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

