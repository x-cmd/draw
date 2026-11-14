// 多系列(bar 分组/堆叠、line 多曲线):labels + series[{name, values}]。
import { ApiError, LIMITS, MAX_BY_KIND, clip, flatList } from './base.js';

// ===== 多系列(bar/line):labels + series[{name, values}] =====

/**
 * One named series of a multi-series chart.
 */
export interface SeriesEntry {
  name: string;
  values: number[];
}

/**
 * Multi-series chart data: shared labels + named series
 * (grouped/stacked bars, multi-line, multi-area, multi-radar).
 */
export interface MultiSpec {
  title?: string;
  unit?: string;
  labels: string[];
  series: SeriesEntry[];
}

const SERIES_EXAMPLE_FLAT = 'labels=Mon,Tue&series=draw:120,180&series=qc:80,90';

/**
 * Parse and validate a multi-series spec from a JSON string.
 *
 * @param kind `'bar'` or `'line'` — selects the applicable limits
 * @throws ApiError(400) with a corrective example on bad input
 */
export function parseSeriesSpec(raw: string | null, kind: 'bar' | 'line'): MultiSpec {
  if (raw === null || raw === '') {
    throw new ApiError(400, `Missing data. Use ?${SERIES_EXAMPLE_FLAT} — or ?d= with {"labels":["A","B"],"series":[{"name":"s1","values":[1,2]}]}`);
  }
  let obj: unknown;
  try {
    obj = JSON.parse(raw);
  } catch {
    throw new ApiError(400, `"d" is not valid JSON (remember to URL-encode it).`);
  }
  if (typeof obj !== 'object' || obj === null || Array.isArray(obj)) {
    throw new ApiError(400, `"d" must be an object with "labels" and "series"`);
  }
  const o = obj as Record<string, unknown>;

  if (!Array.isArray(o.labels) || o.labels.length === 0) {
    throw new ApiError(400, `"labels" must be a non-empty array of x-axis labels`);
  }
  const max = MAX_BY_KIND[kind];
  if (o.labels.length > max) {
    throw new ApiError(400, `"labels" has ${o.labels.length} points; ${kind} supports at most ${max}`);
  }
  const labels = o.labels.map((l, i) => {
    if (typeof l === 'string') return clip(l, LIMITS.label);
    if (typeof l === 'number' && Number.isFinite(l)) return String(l);
    throw new ApiError(400, `labels[${i}] must be a string, got ${typeof l}`);
  });

  if (!Array.isArray(o.series) || o.series.length === 0) {
    throw new ApiError(400, `"series" must be a non-empty array of {"name":string,"values":number[]}`);
  }
  if (o.series.length > LIMITS.maxSeries) {
    throw new ApiError(400, `"series" has ${o.series.length} entries; at most ${LIMITS.maxSeries} series are supported`);
  }
  let total = 0;
  const series: SeriesEntry[] = o.series.map((it, i) => {
    if (typeof it !== 'object' || it === null || Array.isArray(it)) {
      throw new ApiError(400, `series[${i}] must be an object with "name" and "values"`);
    }
    const s = it as Record<string, unknown>;
    if (typeof s.name !== 'string' || s.name === '') {
      throw new ApiError(400, `series[${i}].name must be a non-empty string`);
    }
    if (!Array.isArray(s.values) || s.values.length !== labels.length) {
      throw new ApiError(400, `series[${i}].values must have exactly ${labels.length} values (one per label)`);
    }
    const values = s.values.map((v, j) => {
      if (typeof v !== 'number' || !Number.isFinite(v)) {
        throw new ApiError(400, `series[${i}].values[${j}] must be a number`);
      }
      if (v < 0) throw new ApiError(400, `series[${i}].values[${j}] must be >= 0, got ${v}`);
      return v;
    });
    total += values.reduce((a, b) => a + b, 0);
    return { name: clip(s.name, LIMITS.seriesName), values };
  });
  if (!(total > 0)) throw new ApiError(400, `all values are 0; series must sum to more than 0`);

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
  return { title, unit, labels, series };
}

// 扁平参数 → 多系列 JSON:series=名字:1,2,3 重复参数
/**
 * Build multi-series spec JSON from flat params
 * (`labels=Mon,Tue&series=a:1,2&series=b:3,4`).
 * Returns null when no series params are present.
 */
export function seriesSpecFromParams(params: URLSearchParams): string | null {
  const entries = params.getAll('series');
  if (entries.length === 0) return null;
  const labels = flatList(params, 'labels');
  if (labels.length === 0) {
    throw new ApiError(400, `"labels" is required together with "series". Example: ?${SERIES_EXAMPLE_FLAT}`);
  }
  const series = entries.map((e, i) => {
    const idx = e.indexOf(':');
    if (idx <= 0) {
      throw new ApiError(400, `series[${i}] must look like "name:1,2,3" (colon after the name), got: ${JSON.stringify(e)}`);
    }
    const name = e.slice(0, idx);
    if (name.includes(',')) {
      throw new ApiError(400, `series[${i}] name must not contain commas (name: ${JSON.stringify(name)})`);
    }
    const values = e.slice(idx + 1).split(',').map((v) => {
      const n = Number(v);
      if (!Number.isFinite(n)) throw new ApiError(400, `series[${i}] has a non-numeric value: ${JSON.stringify(v)}`);
      return n;
    });
    return { name, values };
  });
  const obj: Record<string, unknown> = { labels, series };
  const title = params.get('title');
  if (title) obj.title = title;
  const unit = params.get('unit');
  if (unit) obj.unit = unit;
  return JSON.stringify(obj);
}

