// 四象限图(quadrant):2×2 矩阵 —— 两轴各分高低,四格各一个名称(可带说明),可加散点。
// 典型用途:艾森豪威尔矩阵 / BCG 矩阵 / Atlassian 4Ls 回顾 / 决策类图表(#34 #36)。
//
// 象限顺序固定为:左上、右上、左下、右下(与读图顺序一致:先上后下、每行左到右)。
import { ApiError, LIMITS, clip } from './base.js';

/** 一个象限格:名称 + 可选说明 */
export interface QuadrantCell {
  name: string;
  desc?: string;
}

/** 落在矩阵里的一个点(x/y 为 0..1 的归一坐标) */
export interface QuadrantItem {
  name: string;
  x: number;
  y: number;
}

/** 四象限图数据 */
export interface QuadrantSpec {
  title?: string;
  /** 轴标题(横轴/纵轴,如「投入」「回报」) */
  xlabel?: string;
  ylabel?: string;
  /** 轴两端的标签(缺省「低」「高」) */
  xlow?: string;
  xhigh?: string;
  ylow?: string;
  yhigh?: string;
  /** 四格:左上、右上、左下、右下 */
  quadrants: [QuadrantCell, QuadrantCell, QuadrantCell, QuadrantCell];
  /** 散点(可选) */
  items?: QuadrantItem[];
}

const QUADRANT_EXAMPLE = 'quadrants=快赢,战略,填坑,放弃';

const AXIS_ENDS = 12;   // 轴端标签字数上限
const CELL_NAME = 24;  // 象限名字数上限
const CELL_DESC = 48;  // 象限说明字数上限
const ITEM_NAME = 24;

/** 象限名从逗号分隔串里取(四个,顺序左上/右上/左下/右下) */
function split4(raw: string, what: string): string[] {
  const parts = raw.split(',').map((s) => s.trim());
  if (parts.length !== 4 || parts.some((p) => p === '')) {
    throw new ApiError(400, `"${what}" needs exactly 4 comma-separated values (左上,右上,左下,右下), got: ${JSON.stringify(raw)}`);
  }
  return parts;
}

/**
 * Build quadrant spec JSON from query params.
 * Returns null when no quadrant data is present.
 */
export function quadrantSpecFromParams(params: URLSearchParams): string | null {
  const d = params.get('d');
  if (d !== null && d !== '') return d;
  const q = params.get('quadrants');
  if (q === null || q === '') return null;
  const obj: Record<string, unknown> = { quadrants: split4(q, 'quadrants') };
  const descs = params.get('quaddescs');
  if (descs !== null && descs !== '') {
    const parts = descs.split(',').map((s) => s.trim());
    if (parts.length !== 4) {
      throw new ApiError(400, `"quaddescs" needs exactly 4 comma-separated values, got: ${JSON.stringify(descs)}`);
    }
    obj.quadrants = split4(q, 'quadrants').map((name, i) => (parts[i] ? { name, desc: parts[i] } : { name }));
  }
  for (const [key, param] of [['xlabel', 'xlabel'], ['ylabel', 'ylabel'], ['xlow', 'xlow'], ['xhigh', 'xhigh'], ['ylow', 'ylow'], ['yhigh', 'yhigh']] as const) {
    const v = params.get(param);
    if (v !== null && v !== '') obj[key] = v;
  }
  const items = params.get('items');
  if (items !== null && items !== '') {
    obj.items = items.split(';').map((s) => s.trim()).filter((s) => s !== '').map((s) => {
      const at = s.lastIndexOf('@');
      if (at < 1) throw new ApiError(400, `"items" entries look like "名称@x,y", got: ${JSON.stringify(s)}`);
      const name = s.slice(0, at).trim();
      const [xs, ys] = s.slice(at + 1).split(',');
      const x = Number(xs);
      const y = Number(ys);
      if (!name || !Number.isFinite(x) || !Number.isFinite(y)) {
        throw new ApiError(400, `"items" entries look like "名称@x,y" with numbers, got: ${JSON.stringify(s)}`);
      }
      return { name, x, y };
    });
  }
  const title = params.get('title');
  if (title) obj.title = title;
  return JSON.stringify(obj);
}

function str(v: unknown, field: string, max: number): string {
  if (typeof v !== 'string') throw new ApiError(400, `"${field}" must be a string, got ${JSON.stringify(v)}`);
  return clip(v, max);
}

/**
 * Parse and validate quadrant JSON.
 *
 * @throws ApiError(400) with a corrective example on bad input
 */
export function parseQuadrantSpec(raw: string | null): QuadrantSpec {
  if (raw === null || raw === '') {
    throw new ApiError(400, `Missing data. Use ?type=quadrant&${QUADRANT_EXAMPLE} — or ?d= with {"quadrants":["A","B","C","D"]}`);
  }
  let obj: unknown;
  try {
    obj = JSON.parse(raw);
  } catch {
    throw new ApiError(400, `"d" is not valid JSON. Example: {"quadrants":["快赢","战略","填坑","放弃"]}`);
  }
  if (typeof obj !== 'object' || obj === null || Array.isArray(obj)) {
    throw new ApiError(400, `quadrant spec must be an object like {"quadrants":["A","B","C","D"]}`);
  }
  const o = obj as Record<string, unknown>;
  let title: string | undefined;
  if (o.title !== undefined) title = str(o.title, 'title', LIMITS.title);

  const cellsRaw = o.quadrants;
  if (!Array.isArray(cellsRaw) || cellsRaw.length !== 4) {
    throw new ApiError(400, `"quadrants" must be an array of exactly 4 cells (左上,右上,左下,右下), got ${JSON.stringify(cellsRaw)}`);
  }
  const quadrants = cellsRaw.map((c, i) => {
    if (typeof c === 'string') return { name: clip(c, CELL_NAME) };
    if (typeof c !== 'object' || c === null || Array.isArray(c)) {
      throw new ApiError(400, `quadrants[${i}] must be a string or {"name":...,"desc":...}`);
    }
    const cell = c as Record<string, unknown>;
    if (typeof cell.name !== 'string' || cell.name.trim() === '') {
      throw new ApiError(400, `quadrants[${i}].name must be a non-empty string`);
    }
    const out: QuadrantCell = { name: clip(cell.name, CELL_NAME) };
    if (cell.desc !== undefined && cell.desc !== '') out.desc = str(cell.desc, `quadrants[${i}].desc`, CELL_DESC);
    return out;
  }) as QuadrantSpec['quadrants'];

  const opt = (v: unknown, field: string, max: number): string | undefined =>
    v === undefined || v === '' ? undefined : str(v, field, max);

  let items: QuadrantItem[] | undefined;
  if (o.items !== undefined) {
    if (!Array.isArray(o.items)) throw new ApiError(400, `"items" must be an array like [{"name":"A","x":0.2,"y":0.8}]`);
    items = o.items.map((it, i) => {
      if (typeof it !== 'object' || it === null || Array.isArray(it)) {
        throw new ApiError(400, `items[${i}] must be an object with "name", "x", "y"`);
      }
      const p = it as Record<string, unknown>;
      if (typeof p.name !== 'string' || p.name.trim() === '') {
        throw new ApiError(400, `items[${i}].name must be a non-empty string`);
      }
      const x = Number(p.x);
      const y = Number(p.y);
      if (!Number.isFinite(x) || !Number.isFinite(y)) {
        throw new ApiError(400, `items[${i}].x and .y must be numbers in 0..1, got ${JSON.stringify([p.x, p.y])}`);
      }
      // 坐标夹到 0..1:出界的点画到格外就没意义了
      return { name: clip(p.name, ITEM_NAME), x: Math.min(1, Math.max(0, x)), y: Math.min(1, Math.max(0, y)) };
    });
  }

  return {
    title,
    xlabel: opt(o.xlabel, 'xlabel', AXIS_ENDS),
    ylabel: opt(o.ylabel, 'ylabel', AXIS_ENDS),
    xlow: opt(o.xlow, 'xlow', AXIS_ENDS),
    xhigh: opt(o.xhigh, 'xhigh', AXIS_ENDS),
    ylow: opt(o.ylow, 'ylow', AXIS_ENDS),
    yhigh: opt(o.yhigh, 'yhigh', AXIS_ENDS),
    quadrants,
    ...(items ? { items } : {}),
  };
}
