// 混合图(combo):柱系列+线系列同图,扁平 series=/line= 或 JSON(每系列可带 type)。
import { ApiError, LIMITS, clip, flatList } from './base.js';

// ===== 混合图(combo):柱系列 + 线系列同轴 =====

export interface ComboSeries {
  name: string;
  values: number[];
  kind: 'bar' | 'line';
}

export interface ComboSpec {
  title?: string;
  unit?: string;
  labels: string[];
  series: ComboSeries[];
  /** 柱系列堆叠(而非并排),折线仍叠加在上 */
  stack?: boolean;
}

const COMBO_EXAMPLE = 'labels=Mon,Tue&series=downloads:120,180&line=growth:5,8';

function parseSeriesEntries(rawEntries: unknown[], labels: string[], kind: 'bar' | 'line'): ComboSeries[] {
  return rawEntries.map((it, i) => {
    if (typeof it !== 'object' || it === null || Array.isArray(it)) {
      throw new ApiError(400, `series[${i}] must be an object with "name" and "values"`);
    }
    const s = it as Record<string, unknown>;
    if (typeof s.name !== 'string' || s.name === '') throw new ApiError(400, `series[${i}].name must be a non-empty string`);
    if (!Array.isArray(s.values) || s.values.length !== labels.length) {
      throw new ApiError(400, `series[${i}].values must have exactly ${labels.length} values (one per label)`);
    }
    const values = s.values.map((v, j) => {
      if (typeof v !== 'number' || !Number.isFinite(v)) throw new ApiError(400, `series[${i}].values[${j}] must be a number`);
      if (v < 0) throw new ApiError(400, `series[${i}].values[${j}] must be >= 0, got ${v}`);
      return v;
    });
    // 兼容存档回环:parseComboSpec 输出的是 kind(渲染器消费),短链渲染时会把存档
    // 再喂回本解析器,若无 kind 分支,line 系列会被静默改成 bar(线整条消失)
    const raw = s.type ?? s.kind;
    const entryKind = raw === undefined ? kind : raw === 'bar' || raw === 'line' ? raw : null;
    if (entryKind === null) throw new ApiError(400, `series[${i}].type must be "bar" or "line"`);
    return { name: clip(s.name, LIMITS.seriesName), values, kind: entryKind };
  });
}

export function parseComboSpec(raw: string | null): ComboSpec {
  if (raw === null || raw === '') {
    throw new ApiError(400, `Missing data. Use ?type=combo&${COMBO_EXAMPLE}`);
  }
  let obj: unknown;
  try {
    obj = JSON.parse(raw);
  } catch {
    throw new ApiError(400, `"d" is not valid JSON. Example: {"labels":["Mon","Tue"],"series":[{"name":"a","values":[1,2],"type":"bar"}]}`);
  }
  const o = obj as Record<string, unknown>;
  if (!Array.isArray(o.labels) || o.labels.length === 0) {
    throw new ApiError(400, `"labels" must be a non-empty array of x-axis labels`);
  }
  if (o.labels.length > LIMITS.maxBar) {
    throw new ApiError(400, `"labels" has ${o.labels.length} points; combo supports at most ${LIMITS.maxBar}`);
  }
  const labels = o.labels.map((l, i) => {
    if (typeof l === 'string') return clip(l, LIMITS.label);
    if (typeof l === 'number' && Number.isFinite(l)) return String(l);
    throw new ApiError(400, `labels[${i}] must be a string`);
  });
  if (!Array.isArray(o.series) || o.series.length === 0) {
    throw new ApiError(400, `"series" must be a non-empty array (each with optional "type": "bar"|"line")`);
  }
  const series = parseSeriesEntries(o.series, labels, 'bar');
  if (series.length > LIMITS.maxSeries) {
    throw new ApiError(400, `at most ${LIMITS.maxSeries} series are supported, got ${series.length}`);
  }
  if (!series.some((s) => s.values.some((v) => v > 0))) {
    throw new ApiError(400, `all values are 0; series must sum to more than 0`);
  }
  let title: string | undefined;
  if (o.title !== undefined) {
    if (typeof o.title !== 'string') throw new ApiError(400, `"title" must be a string`);
    title = clip(o.title, LIMITS.title);
  }
  let unit: string | undefined;
  if (o.unit !== undefined) {
    if (typeof o.unit !== 'string') throw new ApiError(400, `"unit" must be a string`);
    unit = clip(o.unit, LIMITS.unit);
  }
  const stack = o.stack === true;
  return { title, unit, labels, series, ...(stack ? { stack: true } : {}) };
}

export function comboSpecFromParams(params: URLSearchParams): string | null {
  const d = params.get('d');
  if (d !== null && d !== '') return d;
  const hasBars = params.has('series');
  const hasLines = params.has('line');
  // values= 也接受:作为单个柱系列(图例名取 unit,缺省 'bar'),不与 series= 混用
  const hasFlatValues = params.has('values');
  if (!hasBars && !hasLines && !hasFlatValues) return null;
  const labels = flatList(params, 'labels');
  if (labels.length === 0) {
    throw new ApiError(400, `"labels" is required. Example: ?type=combo&${COMBO_EXAMPLE}`);
  }
  const series: { name: string; values: number[]; type: 'bar' | 'line' }[] = [];
  if (hasFlatValues && !hasBars) {
    const values = flatList(params, 'values').map((v, i) => {
      const n = Number(v);
      if (!Number.isFinite(n)) throw new ApiError(400, `values[${i}] is not a number: ${JSON.stringify(v)}`);
      return n;
    });
    series.push({ name: params.get('unit') || 'bar', values, type: 'bar' });
  }
  for (const [key, kind] of [['series', 'bar'], ['line', 'line']] as const) {
    for (const e of params.getAll(key)) {
      const idx = e.indexOf(':');
      if (idx <= 0) throw new ApiError(400, `${key} entry must look like "name:1,2,3", got: ${JSON.stringify(e)}`);
      const name = e.slice(0, idx);
      const values = e.slice(idx + 1).split(',').map((v) => {
        const n = Number(v);
        if (!Number.isFinite(n)) throw new ApiError(400, `${key} "${name}" has a non-numeric value: ${JSON.stringify(v)}`);
        return n;
      });
      series.push({ name, values, type: kind });
    }
  }
  const stackRaw = params.get('stack');
  let stack = false;
  if (stackRaw !== null && stackRaw !== '' && stackRaw !== '0' && stackRaw !== 'false') {
    if (stackRaw !== '1' && stackRaw !== 'true') {
      throw new ApiError(400, `"stack" must be 1/true (stacked bars) or 0/false, got: ${JSON.stringify(stackRaw)}`);
    }
    stack = true;
  }
  return JSON.stringify({
    labels,
    series,
    ...(stack ? { stack: true } : {}),
    ...(params.get('title') ? { title: params.get('title') } : {}),
    ...(params.get('unit') ? { unit: params.get('unit') } : {}),
  });
}

