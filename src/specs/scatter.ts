// 散点图(scatter):x,y 点对;单系列扁平 x=/y=(或 JSON points),多系列重复 x=/y= 参数(或 JSON series)。
import { ApiError, LIMITS, clip } from './base';

// ===== 散点图(scatter):x,y 点对 =====

export interface ScatterSeries {
  name: string;
  points: { x: number; y: number }[];
}

export interface ScatterSpec {
  title?: string;
  unit?: string;
  /** 单系列形态(无名,无图例) */
  points?: { x: number; y: number }[];
  /** 多系列形态(规范 scatter-1 双系列对比) */
  series?: ScatterSeries[];
}

const SCATTER_EXAMPLE = 'x=1,2,3&y=4,5,6';

export function scatterSpecFromParams(params: URLSearchParams): string | null {
  const d = params.get('d');
  if (d !== null && d !== '') return d;
  if (!params.has('x') && !params.has('y')) return null;
  // 重复 x=/y= 参数 = 多系列(第 i 个 x 对应第 i 个 y)
  const xsAll = params.getAll('x');
  const ysAll = params.getAll('y');
  if (xsAll.length > 1 || ysAll.length > 1) {
    if (xsAll.length !== ysAll.length) {
      throw new ApiError(400, `got ${xsAll.length} "x" series but ${ysAll.length} "y" series — they must match`);
    }
    const series = xsAll.map((xv, i) => ({ name: `S${i + 1}`, points: pairs(xv, ysAll[i]) }));
    return JSON.stringify({
      series,
      ...(params.get('title') ? { title: params.get('title') } : {}),
      ...(params.get('unit') ? { unit: params.get('unit') } : {}),
    });
  }
  const xs = (xsAll[0] ?? '').split(',').filter(Boolean);
  const ys = (ysAll[0] ?? '').split(',').filter(Boolean);
  if (xs.length === 0 || ys.length === 0) {
    throw new ApiError(400, `both "x" and "y" are required. Example: ?type=scatter&${SCATTER_EXAMPLE}`);
  }
  if (xs.length !== ys.length) {
    throw new ApiError(400, `got ${xs.length} x values but ${ys.length} y values — they must match`);
  }
  return JSON.stringify({
    points: xs.map((x, i) => [Number(x), Number(ys[i])]),
    ...(params.get('title') ? { title: params.get('title') } : {}),
    ...(params.get('unit') ? { unit: params.get('unit') } : {}),
  });
}

function pairs(xRaw: string, yRaw: string): { x: number; y: number }[] {
  const xs = xRaw.split(',').filter(Boolean);
  const ys = yRaw.split(',').filter(Boolean);
  if (xs.length !== ys.length) {
    throw new ApiError(400, `x has ${xs.length} values but y has ${ys.length} — they must match`);
  }
  return xs.map((x, i) => {
    const nx = Number(x);
    const ny = Number(ys[i]);
    if (!Number.isFinite(nx) || !Number.isFinite(ny)) throw new ApiError(400, `points must be numbers, got ${JSON.stringify(x)}/${JSON.stringify(ys[i])}`);
    return { x: nx, y: ny };
  });
}

function parsePoints(rawPoints: unknown[], at: string): { x: number; y: number }[] {
  if (rawPoints.length > LIMITS.maxScatter) {
    throw new ApiError(400, `${at} has ${rawPoints.length} entries; scatter supports at most ${LIMITS.maxScatter} per series`);
  }
  return rawPoints.map((p, i) => {
    let x: unknown;
    let y: unknown;
    if (Array.isArray(p)) {
      [x, y] = p;
    } else if (typeof p === 'object' && p !== null) {
      x = (p as Record<string, unknown>).x;
      y = (p as Record<string, unknown>).y;
    }
    if (typeof x !== 'number' || !Number.isFinite(x) || typeof y !== 'number' || !Number.isFinite(y)) {
      throw new ApiError(400, `${at}[${i}] must be [x,y] numbers, got: ${JSON.stringify(p)}`);
    }
    return { x, y };
  });
}

export function parseScatterSpec(raw: string | null): ScatterSpec {
  if (raw === null || raw === '') {
    throw new ApiError(400, `Missing data. Use ?type=scatter&${SCATTER_EXAMPLE} — or ?d= with {"points":[[1,4],[2,5]]}`);
  }
  let obj: unknown;
  try {
    obj = JSON.parse(raw);
  } catch {
    throw new ApiError(400, `"d" is not valid JSON. Example: {"points":[[1,4],[2,5]]}`);
  }
  const o = obj as Record<string, unknown>;
  let spec: ScatterSpec;
  if (Array.isArray(o.series)) {
    if (o.series.length === 0) throw new ApiError(400, `"series" must be a non-empty array like [{"name":"A","points":[[1,4]]}]`);
    if (o.series.length > LIMITS.maxSeries) throw new ApiError(400, `at most ${LIMITS.maxSeries} series, got ${o.series.length}`);
    spec = {
      series: o.series.map((it, i) => {
        if (typeof it !== 'object' || it === null) throw new ApiError(400, `series[${i}] must be an object with "name" and "points"`);
        const s = it as Record<string, unknown>;
        if (typeof s.name !== 'string' || s.name === '') throw new ApiError(400, `series[${i}].name must be a non-empty string`);
        if (!Array.isArray(s.points)) throw new ApiError(400, `series[${i}].points must be a non-empty array like [[1,4],[2,5]]`);
        return { name: clip(s.name, LIMITS.seriesName), points: parsePoints(s.points, `series[${i}].points`) };
      }),
    };
  } else {
    const rawPoints = Array.isArray(o.points) ? o.points : Array.isArray(o.data) ? o.data : null;
    if (!rawPoints || rawPoints.length === 0) {
      throw new ApiError(400, `"points" must be a non-empty array like [[1,4],[2,5]] or [{"x":1,"y":4}]`);
    }
    spec = { points: parsePoints(rawPoints, 'points') };
  }
  if (o.title !== undefined) {
    if (typeof o.title !== 'string') throw new ApiError(400, `"title" must be a string`);
    spec.title = clip(o.title, LIMITS.title);
  }
  if (o.unit !== undefined) {
    if (typeof o.unit !== 'string') throw new ApiError(400, `"unit" must be a string`);
    spec.unit = clip(o.unit, LIMITS.unit);
  }
  return spec;
}
