// 统一输入入口:按参数决定单系列(ChartSpec)或多系列(MultiSpec)。
import { ApiError, parseChartSpec, specFromParams, type ChartSpec } from './base';
import { parseSeriesSpec, seriesSpecFromParams, type MultiSpec } from './multi';

// 统一入口:单系列(ChartSpec)或多系列(MultiSpec)
export type ChartInput =
  | { multi: false; spec: ChartSpec }
  | { multi: true; spec: MultiSpec };

// 结构判断(而非字符串嗅探):按解析后的对象是否含 "series" 键决定单/多系列,
// 避免标题里恰好含 "series" 字样时误路由
export function looksMultiSeries(json: string): boolean {
  try {
    const obj: unknown = JSON.parse(json);
    return typeof obj === 'object' && obj !== null && !Array.isArray(obj) && 'series' in (obj as object);
  } catch {
    return false; // 交给后续解析器给出具体报错
  }
}

export function parseInput(params: URLSearchParams, kind: 'pie' | 'bar' | 'hbar' | 'line' | 'area' | 'radar'): ChartInput {
  if (kind === 'pie') {
    if (params.has('series')) {
      throw new ApiError(400, `"series" (multi-series comparison) is not supported for /${kind}; use /bar or /line`);
    }
    return { multi: false, spec: parseChartSpec(specFromParams(params, kind), kind) };
  }
  const d = params.get('d');
  if (d !== null && d !== '') {
    // hbar 与 bar 同为 30 上限(line/area/radar 60);错误消息才不会张冠李戴
    if (looksMultiSeries(d)) return { multi: true, spec: parseSeriesSpec(d, kind === 'line' || kind === 'area' || kind === 'radar' ? 'line' : 'bar') };
    return { multi: false, spec: parseChartSpec(d, kind) };
  }
  const flatSeries = seriesSpecFromParams(params);
  if (flatSeries !== null) return { multi: true, spec: parseSeriesSpec(flatSeries, kind === 'line' || kind === 'area' || kind === 'radar' ? 'line' : 'bar') };
  return { multi: false, spec: parseChartSpec(specFromParams(params, kind), kind) };
}
