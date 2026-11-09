// 四象限图(quadrant):2×2 决策矩阵 —— 一族图形的合集,不是只有一种:
//   · 矩阵式(frame=box):外框 + 中十字,四格里写标签(价值网矩阵格图、问题处理矩阵)
//   · 十字式(frame=cross):只有两条带箭头的轴,标签挂在轴边(审美鸿沟、用户体验变革)
//   两轴各分高低(端点可写标签),可加按坐标落点的散点(items=名称@x,y)。
//
// 象限顺序固定:左上、右上、左下、右下(读图顺序:先上后下、每行左到右)。
// 格里的标签组可选:只要轴(=cross)或只要点(=items)都行 —— 不强制四个格。
import { ApiError, LIMITS, clip } from './base.js';

/** 一个象限里的标签组:主标签 + 副说明 + 额外的并列标签 */
export interface QuadrantGroup {
  name?: string;
  note?: string;
  labels?: string[];
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
  /** 矩阵式(box,默认)/ 十字式(cross):十字式不画外框与中分线 */
  frame?: 'box' | 'cross';
  /** 轴标题(横轴/纵轴,如「投入」「回报」) */
  xlabel?: string;
  ylabel?: string;
  /** 轴两端的标签(缺省「低」「高」) */
  xlow?: string;
  xhigh?: string;
  ylow?: string;
  yhigh?: string;
  /** 四格:左上、右上、左下、右下(可缺,缺的格子留空) */
  groups?: (QuadrantGroup | null)[];
  /** 散点(可选) */
  items?: QuadrantItem[];
}

const QUADRANT_EXAMPLE = 'quadrants=快赢,战略,填坑,放弃';

const AXIS_ENDS = 12;   // 轴端标签字数上限
const GROUP_NAME = 24;  // 象限主标签字数上限
const GROUP_NOTE = 48;  // 象限说明字数上限
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
  const itemsRaw = params.get('items');
  const frame = params.get('frame');
  // 十字式:光有轴的两端标签也算一份内容(审美鸿沟那类图没有格子)
  const axisOnly = ['xlabel', 'ylabel', 'xlow', 'xhigh', 'ylow', 'yhigh'].some((k) => {
    const v = params.get(k);
    return v !== null && v !== '';
  });
  if ((q === null || q === '') && (itemsRaw === null || itemsRaw === '') && !axisOnly) return null;

  const obj: Record<string, unknown> = {};
  if (q !== null && q !== '') {
    const names = split4(q, 'quadrants');
    const descs = params.get('quaddescs');
    const descParts = descs !== null && descs !== '' ? descs.split(',').map((s) => s.trim()) : [];
    if (descParts.length && descParts.length !== 4) {
      throw new ApiError(400, `"quaddescs" needs exactly 4 comma-separated values, got: ${JSON.stringify(descs)}`);
    }
    const extra = params.get('quadlabels');
    const extraParts = extra !== null && extra !== '' ? extra.split(';').map((s) => s.trim()) : [];
    if (extraParts.length && extraParts.length !== 4) {
      throw new ApiError(400, `"quadlabels" needs 4 groups separated by ";" (each group's labels by "|"), got: ${JSON.stringify(extra)}`);
    }
    obj.groups = names.map((name, i) => {
      const g: Record<string, unknown> = { name };
      if (descParts[i]) g.note = descParts[i];
      const ls = extraParts[i] ? extraParts[i].split('|').map((s) => s.trim()).filter((s) => s !== '') : [];
      if (ls.length) g.labels = ls;
      return g;
    });
  }
  if (frame !== null && frame !== '') {
    if (frame !== 'box' && frame !== 'cross') {
      throw new ApiError(400, `"frame" must be box or cross, got: ${JSON.stringify(frame)}`);
    }
    obj.frame = frame;
  }
  for (const key of ['xlabel', 'ylabel', 'xlow', 'xhigh', 'ylow', 'yhigh'] as const) {
    const v = params.get(key);
    if (v !== null && v !== '') obj[key] = v;
  }
  if (itemsRaw !== null && itemsRaw !== '') {
    obj.items = itemsRaw.split(';').map((s) => s.trim()).filter((s) => s !== '').map((s) => {
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
    throw new ApiError(400, `Missing data. Use ?type=quadrant&${QUADRANT_EXAMPLE} — or ?d= with {"groups":[{"name":"A"},{"name":"B"},{"name":"C"},{"name":"D"}]}`);
  }
  let obj: unknown;
  try {
    obj = JSON.parse(raw);
  } catch {
    throw new ApiError(400, `"d" is not valid JSON. Example: {"groups":[{"name":"快赢"},{"name":"战略"},{"name":"填坑"},{"name":"放弃"}]}`);
  }
  if (typeof obj !== 'object' || obj === null || Array.isArray(obj)) {
    throw new ApiError(400, `quadrant spec must be an object like {"groups":[{"name":"A"},{"name":"B"},{"name":"C"},{"name":"D"}]}`);
  }
  const o = obj as Record<string, unknown>;
  let title: string | undefined;
  if (o.title !== undefined) title = str(o.title, 'title', LIMITS.title);

  let frame: 'box' | 'cross' | undefined;
  if (o.frame !== undefined) {
    if (o.frame !== 'box' && o.frame !== 'cross') {
      throw new ApiError(400, `"frame" must be "box" or "cross", got ${JSON.stringify(o.frame)}`);
    }
    frame = o.frame;
  }

  // 格:groups(四格)或 quadrants(四格纯字符串)—— 后者是老写法,留着兼容
  const groupsRaw = o.groups ?? o.quadrants;
  let groups: (QuadrantGroup | null)[] | undefined;
  if (groupsRaw !== undefined) {
    if (!Array.isArray(groupsRaw) || groupsRaw.length !== 4) {
      throw new ApiError(400, `"groups" must be an array of exactly 4 cells (左上,右上,左下,右下), got ${JSON.stringify(groupsRaw)}`);
    }
    groups = groupsRaw.map((c, i) => {
      if (c === null || c === undefined) return null;
      if (typeof c === 'string') return c.trim() === '' ? null : { name: clip(c, GROUP_NAME) };
      if (typeof c !== 'object' || Array.isArray(c)) {
        throw new ApiError(400, `groups[${i}] must be a string or {"name":...,"note":...,"labels":[...]}`);
      }
      const g = c as Record<string, unknown>;
      const out: QuadrantGroup = {};
      if (g.name !== undefined && g.name !== '') out.name = str(g.name, `groups[${i}].name`, GROUP_NAME);
      if (g.note !== undefined && g.note !== '') out.note = str(g.note, `groups[${i}].note`, GROUP_NOTE);
      if (g.labels !== undefined) {
        if (!Array.isArray(g.labels)) throw new ApiError(400, `groups[${i}].labels must be an array of strings`);
        out.labels = g.labels.map((l, li) => str(l, `groups[${i}].labels[${li}]`, GROUP_NAME));
      }
      if (!out.name && !out.note && !out.labels?.length) return null;
      return out;
    });
  }

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

  // 至少要有一样内容:四格、散点,或者光有轴的十字式(审美鸿沟那类)
  const hasAxisText = !!(o.xlabel || o.ylabel || o.xlow || o.xhigh || o.ylow || o.yhigh);
  if (!groups && !items?.length && !hasAxisText) {
    throw new ApiError(400, `quadrant needs "groups" (four cells), "items" (points) or axis labels — e.g. {"groups":[{"name":"A"},{"name":"B"},{"name":"C"},{"name":"D"}]}`);
  }

  return {
    title,
    ...(frame ? { frame } : {}),
    xlabel: opt(o.xlabel, 'xlabel', AXIS_ENDS),
    ylabel: opt(o.ylabel, 'ylabel', AXIS_ENDS),
    xlow: opt(o.xlow, 'xlow', AXIS_ENDS),
    xhigh: opt(o.xhigh, 'xhigh', AXIS_ENDS),
    ylow: opt(o.ylow, 'ylow', AXIS_ENDS),
    yhigh: opt(o.yhigh, 'yhigh', AXIS_ENDS),
    ...(groups ? { groups } : {}),
    ...(items ? { items } : {}),
  };
}
