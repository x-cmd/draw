// 公共解析基础:ApiError、LIMITS、单系列 ChartSpec(扁平参数/JSON)、统一入口 parseInput。
// 各图表专属解析器在本目录独立文件;新增图表 = 新增 specs/xxx.ts + render/xxx.ts。

/**
 * API error with an HTTP status. Parsers and renderers throw these;
 * the HTTP layer maps them to `status` + a plain-text body.
 */
export class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
  }
}

/**
 * One labeled data point: a category and its value.
 */
export interface Datum {
  label: string;
  value: number;
  /** Optional explicit color (#rrggbb); renderers that color per datum (pie) honor it. */
  color?: string;
}

/**
 * Single-series chart data (pie / bar / hbar / line / area / radar).
 */
export interface ChartSpec {
  title?: string;
  subtitle?: string; // 编辑式副标题(规范 area-3:16px 灰,随大标题)
  source?: string;   // 数据来源脚注(规范 area-3:13px,左下)
  unit?: string;
  data: Datum[];
}

/**
 * Global input limits shared by all parsers: text caps and max
 * categories / points / axes / series.
 */
export const LIMITS = {
  title: 80,
  subtitle: 96,
  source: 96,
  unit: 16,
  label: 64,
  maxPie: 100,
  maxBar: 30,
  maxLine: 60,
  maxRadar: 12,
  maxSeries: 6,
  seriesName: 24,
  maxScatter: 200,
} as const;

/**
 * Cap on the main data axis per chart kind (categories, points or axes).
 */
export const MAX_BY_KIND: Record<string, number> = {
  pie: LIMITS.maxPie,
  bar: LIMITS.maxBar,
  hbar: LIMITS.maxBar,
  line: LIMITS.maxLine,
  area: LIMITS.maxLine,
  radar: LIMITS.maxRadar,
};

const EXAMPLE = encodeURIComponent(
  JSON.stringify({ title: 'Demo', data: [{ label: 'A', value: 1 }, { label: 'B', value: 2 }] }),
);
const EXAMPLE_FLAT = 'title=Demo&labels=A,B&values=1,2';

/**
 * Parse and validate a single-series spec from a JSON string (the `?d=` payload).
 *
 * @param raw JSON string; null or empty triggers the corrective error
 * @param kind chart kind — selects the applicable limits
 * @returns the validated ChartSpec
 * @throws ApiError(400) with a corrective example on bad input
 */
export function parseChartSpec(raw: string | null, kind: 'pie' | 'bar' | 'hbar' | 'line' | 'area' | 'radar'): ChartSpec {
  if (raw === null || raw === '') {
    throw new ApiError(400, `Missing data. Use flat params: ?${EXAMPLE_FLAT} — or JSON: ?d=${EXAMPLE}`);
  }
  let obj: unknown;
  try {
    obj = JSON.parse(raw);
  } catch {
    throw new ApiError(400, `"d" is not valid JSON (remember to URL-encode it). Example: ?d=${EXAMPLE}`);
  }
  if (typeof obj !== 'object' || obj === null || Array.isArray(obj)) {
    throw new ApiError(400, `"d" must be a JSON object like {"title":"...","data":[{"label":"A","value":1}]}`);
  }
  const o = obj as Record<string, unknown>;

  let title: string | undefined;
  if (o.title !== undefined) {
    if (typeof o.title !== 'string') throw new ApiError(400, `"title" must be a string, got ${jsonType(o.title)}`);
    title = clip(o.title, LIMITS.title);
  }

  let unit: string | undefined;
  if (o.unit !== undefined) {
    if (typeof o.unit !== 'string') throw new ApiError(400, `"unit" must be a string, got ${jsonType(o.unit)}`);
    unit = clip(o.unit, LIMITS.unit);
  }

  let subtitle: string | undefined;
  if (o.subtitle !== undefined) {
    if (typeof o.subtitle !== 'string') throw new ApiError(400, `"subtitle" must be a string, got ${jsonType(o.subtitle)}`);
    subtitle = clip(o.subtitle, LIMITS.subtitle);
  }

  let source: string | undefined;
  if (o.source !== undefined) {
    if (typeof o.source !== 'string') throw new ApiError(400, `"source" must be a string, got ${jsonType(o.source)}`);
    source = clip(o.source, LIMITS.source);
  }

  if (!Array.isArray(o.data) || o.data.length === 0) {
    throw new ApiError(400, `"data" must be a non-empty array of {"label":string,"value":number}`);
  }
  const max = MAX_BY_KIND[kind];
  if (o.data.length > max) {
    throw new ApiError(400, `"data" has ${o.data.length} points; ${kind} chart supports at most ${max}. Aggregate the rest into fewer points.`);
  }

  const data: Datum[] = o.data.map((it, i) => {
    if (typeof it !== 'object' || it === null || Array.isArray(it)) {
      throw new ApiError(400, `data[${i}] must be an object with "label" and "value"`);
    }
    const d = it as Record<string, unknown>;
    let label: string;
    if (typeof d.label === 'string') label = clip(d.label, LIMITS.label);
    else if (typeof d.label === 'number' && Number.isFinite(d.label)) label = String(d.label);
    else throw new ApiError(400, `data[${i}].label must be a string, got ${jsonType(d.label)}`);
    if (typeof d.value !== 'number' || !Number.isFinite(d.value)) {
      throw new ApiError(400, `data[${i}].value must be a number, got ${jsonType(d.value)}`);
    }
    if (d.value < 0) {
      throw new ApiError(400, `data[${i}].value must be >= 0, got ${d.value}`);
    }
    let color: string | undefined;
    if (d.color !== undefined) {
      if (typeof d.color !== 'string' || !/^#[0-9a-f]{6}$/i.test(d.color)) {
        throw new ApiError(400, `data[${i}].color must be a hex color like "#6366f1", got ${JSON.stringify(d.color)}`);
      }
      color = d.color.toLowerCase();
    }
    return color ? { label, value: d.value, color } : { label, value: d.value };
  });

  const total = data.reduce((s, d) => s + d.value, 0);
  if (!(total > 0)) {
    throw new ApiError(400, `"data" values must sum to more than 0, got ${total}`);
  }

  return { title, subtitle, source, unit, data };
}

// 扁平参数 → JSON 字符串:让 URL 永远可读,无需百分号编码。
// 支持两种形态:?labels=A,B&values=1,2(逗号)或 ?labels=A&labels=B&values=1&values=2(重复参数,标签含逗号时用)
/**
 * Build single-series spec JSON from flat params (`labels=A,B&values=1,2`;
 * repeated params support comma-containing labels).
 * Returns null when no data params are present.
 */
export function specFromParams(params: URLSearchParams, kind: 'pie' | 'bar' | 'hbar' | 'line' | 'area' | 'radar'): string | null {
  const d = params.get('d');
  if (d !== null && d !== '') return d;
  if (!params.has('labels') && !params.has('values')) return null;

  const labels = flatList(params, 'labels');
  const values = flatList(params, 'values');
  if (labels.length === 0) throw new ApiError(400, `"labels" is empty. Example: ?${EXAMPLE_FLAT}`);
  if (values.length !== labels.length) {
    throw new ApiError(400, `got ${labels.length} labels but ${values.length} values — they must match`);
  }
  const nums = values.map((v, i) => {
    const n = Number(v);
    if (!Number.isFinite(n)) throw new ApiError(400, `values[${i}] is not a number: ${JSON.stringify(v)}`);
    return n;
  });
  // ?colors=%23aa00ff,...:parallel to labels, per-datum explicit colors (pie etc.)
  const colors = flatList(params, 'colors');
  const obj: Record<string, unknown> = {
    data: labels.map((label, i) => {
      const c = colors[i];
      return c && /^#[0-9a-f]{6}$/i.test(c) ? { label, value: nums[i], color: c.toLowerCase() } : { label, value: nums[i] };
    }),
  };
  const title = params.get('title');
  if (title) obj.title = title;
  const subtitle = params.get('subtitle');
  if (subtitle) obj.subtitle = subtitle;
  const source = params.get('source');
  if (source) obj.source = source;
  const unit = params.get('unit');
  if (unit) obj.unit = unit;
  return JSON.stringify(obj);
}

/**
 * All values of a repeated query param: `labels=a&labels=b` → `['a','b']`.
 */
export function flatList(params: URLSearchParams, key: string): string[] {
  const all = params.getAll(key);
  if (all.length > 1) return all; // 重复参数形态
  return all[0] !== undefined && all[0] !== '' ? all[0].split(',') : [];
}

function jsonType(v: unknown): string {
  if (v === null) return 'null';
  if (Array.isArray(v)) return 'an array';
  return typeof v;
}

/**
 * Truncate a string to at most `n` characters (input hardening for titles/labels).
 */
export function clip(s: string, n: number): string {
  return s.length > n ? s.slice(0, n - 1) + '…' : s;
}
