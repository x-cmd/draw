// 仪表盘(gauge):多环(labels+values,每行一环,值为百分比)或单值(value/max)。
import { ApiError, LIMITS, clip, flatList } from './base';

export interface GaugeDatum {
  label: string;
  value: number; // 百分比 0-100
}

export interface GaugeSpec {
  title?: string;
  unit?: string;
  /** 多环模式:每行一环(规范 gauge-1/2);与 value/max 二选一 */
  data?: GaugeDatum[];
  /** 单值模式(zones/reliability 或单环);data 存在时可为空 */
  value?: number;
  max: number;
}

const GAUGE_EXAMPLE = 'value=87&max=100';

export function gaugeSpecFromParams(params: URLSearchParams): string | null {
  const d = params.get('d');
  if (d !== null && d !== '') return d;
  // 多环:labels+values(值为百分比)
  if (params.has('labels') && params.has('values')) {
    const labels = flatList(params, 'labels');
    const values = flatList(params, 'values');
    if (labels.length !== values.length) {
      throw new ApiError(400, `got ${labels.length} labels but ${values.length} values — they must match`);
    }
    const obj: Record<string, unknown> = { max: 100, data: labels.map((label, i) => ({ label, value: Number(values[i]) })) };
    const title = params.get('title');
    if (title) obj.title = title;
    return JSON.stringify(obj);
  }
  const valueRaw = params.get('value');
  if (valueRaw === null || valueRaw === '') return null;
  const value = Number(valueRaw);
  if (!Number.isFinite(value)) {
    throw new ApiError(400, `"value" must be a number, got: ${JSON.stringify(valueRaw)}`);
  }
  const obj: Record<string, unknown> = { value };
  const maxRaw = params.get('max');
  if (maxRaw !== null && maxRaw !== '') {
    const max = Number(maxRaw);
    if (!Number.isFinite(max)) {
      throw new ApiError(400, `"max" must be a number, got: ${JSON.stringify(maxRaw)}`);
    }
    obj.max = max;
  }
  const title = params.get('title');
  if (title) obj.title = title;
  const unit = params.get('unit');
  if (unit) obj.unit = unit;
  return JSON.stringify(obj);
}

export function parseGaugeSpec(raw: string | null): GaugeSpec {
  if (raw === null || raw === '') {
    throw new ApiError(400, `Missing data. Use ?type=gauge&${GAUGE_EXAMPLE} — or ?d= with {"value":87,"max":100}`);
  }
  let obj: unknown;
  try {
    obj = JSON.parse(raw);
  } catch {
    throw new ApiError(400, `"d" is not valid JSON. Example: {"value":87,"max":100}`);
  }
  if (typeof obj !== 'object' || obj === null || Array.isArray(obj)) {
    throw new ApiError(400, `gauge spec must be an object like {"value":87,"max":100} or {"max":100,"data":[{"label":"A","value":86}]}`);
  }
  const o = obj as Record<string, unknown>;
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
  // 多环形态:data 数组,每行一环,值为百分比
  if (o.data !== undefined) {
    if (!Array.isArray(o.data) || o.data.length === 0) {
      throw new ApiError(400, `"data" must be a non-empty array like [{"label":"A","value":86}]`);
    }
    if (o.data.length > 8) {
      throw new ApiError(400, `"data" has ${o.data.length} rings; gauge supports at most 8`);
    }
    const data = o.data.map((it, i) => {
      if (typeof it !== 'object' || it === null) throw new ApiError(400, `data[${i}] must be an object with "label" and "value"`);
      const d = it as Record<string, unknown>;
      if (typeof d.label !== 'string') throw new ApiError(400, `data[${i}].label must be a string`);
      if (typeof d.value !== 'number' || !Number.isFinite(d.value)) throw new ApiError(400, `data[${i}].value must be a number`);
      if (d.value < 0) throw new ApiError(400, `data[${i}].value must be >= 0 (ring percentage), got ${d.value}`);
      return { label: clip(d.label, LIMITS.label), value: d.value };
    });
    return { title, unit, max: 100, data };
  }
  if (typeof o.value !== 'number' || !Number.isFinite(o.value) || o.value < 0) {
    throw new ApiError(400, `"value" must be a number >= 0 (or use "data" for multi-ring), got ${JSON.stringify(o.value)}`);
  }
  let max = 100;
  if (o.max !== undefined) {
    if (typeof o.max !== 'number' || !Number.isFinite(o.max) || o.max <= 0) {
      throw new ApiError(400, `"max" must be a number > 0, got ${JSON.stringify(o.max)}`);
    }
    max = o.max;
  }
  if (o.value > max) {
    throw new ApiError(400, `"value" (${o.value}) must not exceed "max" (${max})`);
  }
  return { title, unit, value: o.value, max };
}

