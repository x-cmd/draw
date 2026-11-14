// 散点图(scatter):x,y 点对;单系列扁平 x=/y=(或 JSON points),多系列重复 x=/y= 参数(或 JSON series)。
// 点可以带名字(names= / JSON 里的 label)—— 榜单类散点图没有名字就分不清谁是谁。
import { ApiError, LIMITS, clip } from './base.js';

// ===== 散点图(scatter):x,y 点对 =====

/**
 * One scatter point: coordinates plus an optional label.
 */
export interface ScatterPoint {
  x: number;
  y: number;
  /** 点旁边的名字(榜单类散点:名字是信息本身) */
  label?: string;
}

/**
 * One scatter series: a name plus `[x,y]` points.
 */
export interface ScatterSeries {
  name: string;
  points: ScatterPoint[];
}

/**
 * Scatter data — one or more series; negative coordinates allowed.
 */
export interface ScatterSpec {
  title?: string;
  unit?: string;   // 单位(也当作 X 轴标题的缺省)
  xname?: string;  // X 轴标题
  yname?: string;  // Y 轴标题
  logx?: boolean;  // X 轴取对数(量级差得远时:价格 1 块和 20 块挤在一起就分不开了)
  /** 单系列形态(无名,无图例) */
  points?: ScatterPoint[];
  /** 多系列形态(规范 scatter-1 双系列对比) */
  series?: ScatterSeries[];
}

const SCATTER_EXAMPLE = 'x=1,2,3&y=4,5,6';

/**
 * Build scatter spec JSON from `?x=&y=` (repeated pairs form multiple series).
 * Returns null when absent.
 */
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
      ...extras(params),
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
  // names= 给每个点起名字(榜单类散点:没有名字就分不清谁是谁)
  const names = (params.get('names') ?? '').split(',').map((n) => n.trim()).filter(Boolean);
  if (names.length && names.length !== xs.length) {
    throw new ApiError(400, `got ${names.length} names but ${xs.length} points — they must match`);
  }
  return JSON.stringify({
    points: xs.map((x, i) => {
      const p: ScatterPoint = { x: Number(x), y: Number(ys[i]) };
      if (names[i]) p.label = names[i];
      return p;
    }),
    ...extras(params),
  });
}

/** 标题/单位/Y 轴名/对数轴 —— 扁平与 JSON 两种形态共用 */
function extras(params: URLSearchParams): Record<string, unknown> {
  return {
    ...(params.get('title') ? { title: params.get('title') } : {}),
    ...(params.get('unit') ? { unit: params.get('unit') } : {}),
    ...(params.get('xname') ? { xname: params.get('xname') } : {}),
    ...(params.get('yname') ? { yname: params.get('yname') } : {}),
    ...(params.get('logx') === '1' || params.get('logx') === 'true' ? { logx: true } : {}),
  };
}

function pairs(xRaw: string, yRaw: string): ScatterPoint[] {
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

function parsePoints(rawPoints: unknown[], at: string): ScatterPoint[] {
  if (rawPoints.length > LIMITS.maxScatter) {
    throw new ApiError(400, `${at} has ${rawPoints.length} entries; scatter supports at most ${LIMITS.maxScatter} per series`);
  }
  return rawPoints.map((p, i) => {
    let x: unknown;
    let y: unknown;
    let label: unknown;
    if (Array.isArray(p)) {
      [x, y] = p;
    } else if (typeof p === 'object' && p !== null) {
      x = (p as Record<string, unknown>).x;
      y = (p as Record<string, unknown>).y;
      label = (p as Record<string, unknown>).label;
    }
    if (typeof x !== 'number' || !Number.isFinite(x) || typeof y !== 'number' || !Number.isFinite(y)) {
      throw new ApiError(400, `${at}[${i}] must be [x,y] numbers, got: ${JSON.stringify(p)}`);
    }
    if (label === undefined || label === null) return { x, y };
    if (typeof label !== 'string') {
      throw new ApiError(400, `${at}[${i}].label must be a string, got: ${JSON.stringify(label)}`);
    }
    return { x, y, label: clip(label, LIMITS.seriesName) };
  });
}

/**
 * Parse and validate scatter JSON (`{"points":[[1,4]]}` or `{"series":[...]}`).
 *
 * @throws ApiError(400) with a corrective example on bad input
 */
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
  if (o.xname !== undefined) {
    if (typeof o.xname !== 'string') throw new ApiError(400, `"xname" must be a string`);
    spec.xname = clip(o.xname, LIMITS.axisName);
  }
  if (o.yname !== undefined) {
    if (typeof o.yname !== 'string') throw new ApiError(400, `"yname" must be a string`);
    spec.yname = clip(o.yname, LIMITS.axisName);
  }
  if (o.logx !== undefined) {
    if (typeof o.logx !== 'boolean') throw new ApiError(400, `"logx" must be true/false`);
    spec.logx = o.logx;
  }
  // 对数轴:x 必须全为正,否则量不出来
  if (spec.logx) {
    const all = (spec.series ?? [{ name: '', points: spec.points ?? [] }]).flatMap((x) => x.points);
    const bad = all.find((p) => p.x <= 0);
    if (bad) {
      throw new ApiError(400, `"logx" needs every x > 0, got ${bad.x}. Example: ?type=scatter&x=1,2&y=4,5&logx=1`);
    }
  }
  return spec;
}
