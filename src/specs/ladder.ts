// 天梯图(ladder)与双翼天梯图(butterfly-ladder)的规格。
//
// 为什么是两种图,不是一种的两种形态:
//   · 天梯图 —— 一边,按强弱排成梯子(可以分档)
//   · 双翼天梯图 —— 两边同时排,一行两个型号,正面对打
//
// 数据模型:每一边是**「名 + 值」的列表**(`items[]`),
// 名字和值不再分家 —— 早先的 `labels=` 是两侧共用一套的平行数组,
// 一行只能显示一个名字,天梯图要的恰恰是一行两个型号。
//
// 短形态(URL 里手写得出):
//
//   ?type=ladder&labels=A,B,C&values=1,2,3&tiers=S,A,B
//   ?type=butterfly-ladder
//     &left=NVIDIA:3264,2863&right=AMD/Intel:2095,1875
//     &llabels=…,…&rlabels=…,…&ltiers=S,A&rtiers=S,A
//
// JSON 形态(推荐:名、值、档在一处):
//
//   {
//     "type": "butterfly-ladder",
//     "left":  {"name": "NVIDIA",   "items": [{"label": "GeForce RTX 5090", "value": 3264, "tier": "S"}]},
//     "right": {"name": "AMD / Intel","items": [{"label": "Radeon RX 7900 XTX", "value": 2095, "tier": "S"}]}
//   }
import { ApiError } from './index.js';

export interface LadderItem {
  label?: string;
  value: number;
  /** 档位(S / A / B / C / D…)。同一档的行会连在一起,档与档之间有分隔。 */
  tier?: string;
}

export interface LadderSide {
  name?: string;
  items: LadderItem[];
}

export interface LadderSpec {
  title?: string;
  unit?: string;
  /** 标签最多显示几个字(缺省 22)。名字长的数据用 labelmax= 调大。 */
  labelmax?: number;
  /** 单边(天梯图) */
  side?: LadderSide;
  /** 双翼(双翼天梯图) */
  left?: LadderSide;
  right?: LadderSide;
  /**
   * 双翼怎么排:
   *   rank(缺省)—— **完全错位**:两翼合成一条梯子,整体按强弱排,
   *                 每一行只有一张卡,在它自己那一侧
   *   value      —— **匹配排序**:值相近的排在同一行,两翼都有
   */
  match?: 'rank' | 'value';
}

const isObj = (v: unknown): v is Record<string, unknown> =>
  typeof v === 'object' && v !== null && !Array.isArray(v);

/** 一侧的 items:从 JSON 的数组来 */
function parseItems(v: unknown, where: string): LadderItem[] {
  if (!Array.isArray(v)) {
    throw new ApiError(400, `"${where}.items" must be an array of {label, value, tier}.`);
  }
  return v.map((it, i) => {
    if (!isObj(it)) {
      throw new ApiError(400, `"${where}.items[${i}]" must be an object {label, value, tier}.`);
    }
    const value = Number(it.value);
    if (!Number.isFinite(value)) {
      throw new ApiError(400, `"${where}.items[${i}].value" must be a number.`);
    }
    const out: LadderItem = { value };
    if (typeof it.label === 'string') out.label = it.label;
    if (typeof it.tier === 'string') out.tier = it.tier;
    return out;
  });
}

function parseSide(v: unknown, where: string): LadderSide | undefined {
  if (v === undefined || v === null) return undefined;
  if (!isObj(v)) {
    throw new ApiError(400, `"${where}" must be an object {name, items}.`);
  }
  const out: LadderSide = { items: parseItems(v.items, where) };
  if (typeof v.name === 'string') out.name = v.name;
  return out;
}

/** 解析 JSON 形态 */
export function parseLadderSpec(raw: string): LadderSpec {
  let obj: unknown;
  try {
    obj = JSON.parse(raw);
  } catch {
    throw new ApiError(400, `"d" is not valid JSON. Example: {"type":"ladder","items":[{"label":"A","value":1}]}`);
  }
  if (!isObj(obj)) {
    throw new ApiError(400, `"d" must be an object.`);
  }
  const spec: LadderSpec = {};
  if (typeof obj.title === 'string') spec.title = obj.title;
  if (typeof obj.unit === 'string') spec.unit = obj.unit;
  if (obj.labelmax !== undefined) {
    const n = Number(obj.labelmax);
    if (!Number.isFinite(n) || n < 1) throw new ApiError(400, `"labelmax" must be a positive number.`);
    spec.labelmax = n;
  }
  const side = parseSide(obj.side, 'side');
  if (side) spec.side = side;
  const left = parseSide(obj.left, 'left');
  if (left) spec.left = left;
  const right = parseSide(obj.right, 'right');
  if (right) spec.right = right;
  if (obj.match !== undefined) {
    const m = String(obj.match).toLowerCase();
    if (m !== 'rank' && m !== 'value') {
      throw new ApiError(400, `"match" must be "rank" or "value". Got: ${JSON.stringify(obj.match)}`);
    }
    spec.match = m;
  }
  if (!spec.side && !spec.left && !spec.right) {
    throw new ApiError(400, `need "side" (a ladder) or "left"/"right" (a butterfly ladder).`);
  }
  return spec;
}

/** 扁平参数 → JSON 串 */
export function ladderSpecFromParams(params: URLSearchParams): string | null {
  const d = params.get('d');
  if (d !== null && d !== '') return d;
  const labels = splitLabels(params.getAll('labels'));
  const values = splitNumbers(params.getAll('values'));
  const tiers = splitLabels(params.getAll('tiers'));
  const leftRaw = params.getAll('left');
  const rightRaw = params.getAll('right');
  if (!labels.length && !values.length && !leftRaw.length && !rightRaw.length) return null;

  const spec: Record<string, unknown> = {};
  const title = params.get('title');
  if (title) spec.title = title;
  const unit = params.get('unit');
  if (unit) spec.unit = unit;
  const labelmax = params.get('labelmax');
  if (labelmax) spec.labelmax = labelmax;

  if (leftRaw.length || rightRaw.length) {
    // 双翼
    const lLabels = splitLabels(params.getAll('llabels'));
    const rLabels = splitLabels(params.getAll('rlabels'));
    const lTiers = splitLabels(params.getAll('ltiers'));
    const rTiers = splitLabels(params.getAll('rtiers'));
    const left = sideFromParts(leftRaw[0], lLabels, lTiers);
    const right = sideFromParts(rightRaw[0], rLabels, rTiers);
    if (left) spec.left = left;
    if (right) spec.right = right;
    const match = (params.get('match') ?? 'rank').toLowerCase();
    if (match !== 'rank' && match !== 'value') {
      throw new ApiError(400, `"match" must be "rank" or "value". Got: ${JSON.stringify(match)}`);
    }
    spec.match = match;
  } else {
    // 单边
    const items: LadderItem[] = values.map((value, i) => {
      const it: LadderItem = { value };
      if (labels[i] !== undefined) it.label = labels[i];
      if (tiers[i] !== undefined) it.tier = tiers[i];
      return it;
    });
    spec.side = { items };
  }
  return JSON.stringify(spec);
}

function sideFromParts(
  raw: string | undefined,
  labels: (string | undefined)[],
  tiers: (string | undefined)[],
): LadderSide | undefined {
  if (raw === undefined) return undefined;
  const ci = raw.indexOf(':');
  const name = ci > 0 ? raw.slice(0, ci).trim() : undefined;
  const body = ci > 0 ? raw.slice(ci + 1) : raw;
  const values = body.split(',').map((x) => Number(x.trim()));
  if (values.some((v) => !Number.isFinite(v))) {
    throw new ApiError(400, `"left"/"right" values must be numbers. Example: left=NVIDIA:3264,2863`);
  }
  const items: LadderItem[] = values.map((value, i) => {
    const it: LadderItem = { value };
    if (labels[i] !== undefined) it.label = labels[i];
    if (tiers[i] !== undefined) it.tier = tiers[i];
    return it;
  });
  return { ...(name ? { name } : {}), items };
}

/** 逗号分隔的字符串列表 —— **中间的空位留着**(空位是位置) */
function splitLabels(raws: string[]): (string | undefined)[] {
  const out: (string | undefined)[] = [];
  for (const raw of raws) {
    for (const part of raw.split(',')) {
      const t = part.trim();
      out.push(t === '' ? undefined : t);
    }
  }
  return out;
}

function splitNumbers(raws: string[]): number[] {
  const out: number[] = [];
  for (const raw of raws) {
    for (const part of raw.split(',')) {
      const t = part.trim();
      if (t === '') continue;
      const v = Number(t);
      if (!Number.isFinite(v)) {
        throw new ApiError(400, `"values" must be numbers. Got: ${JSON.stringify(t)}`);
      }
      out.push(v);
    }
  }
  return out;
}

/**
 * 双翼的行怎么排。
 *
 *   rank —— **完全错位**:两侧的卡合成**一条**梯子,谁强谁在前;
 *           每一行只有一张卡,在它自己那一侧,另一边空着。
 *   value—— **匹配排序**:**值相近的排在同一行**;
 *           左边每张卡配右边数值最接近它的那张,配不上的行留空。
 *
 * rank 那一种,两翼共用一把标尺(不然跨翼的长度没法比)。
 */
export function matchLadderRows(
  left: LadderItem[],
  right: LadderItem[],
  match: 'rank' | 'value' = 'rank',
): [LadderItem | undefined, LadderItem | undefined][] {
  if (match !== 'value') {
    const all: { item: LadderItem; side: 0 | 1 }[] = [
      ...left.map((item) => ({ item, side: 0 as const })),
      ...right.map((item) => ({ item, side: 1 as const })),
    ];
    all.sort((a, b) => b.item.value - a.item.value);
    return all.map((x) => (x.side === 0 ? [x.item, undefined] : [undefined, x.item]));
  }
  // 匹配排序:**右边每一张卡去找左边数值最接近的那张**,待到那一行去。
  //
  // 「左边在后面三行,右边那张也得找最相近的」—— 哪怕中间空出几行,
  // 被拉走的那张原来的位置就**空着**(缺位)。缺位不是 bug,是信号:
  // 这一档真的没有能对上的卡。
  //
  // 为什么这么设计:左右两边都是**按强弱排好**的,所以「找最接近的那个」
  // 的结果是**单调**的 —— 两张右边的卡不会抢同一行,总距离也是最小的。
  // (换成「每行去抢最接近的那张」就不单调了,谁先谁抢,顺序一换结果就变。)
  const taken = new Set<number>();       // 已被占用的左边行
  const placeAt = new Map<number, number>();  // 左边第 i 行 → 右边第 j 张
  for (let j = 0; j < right.length; j++) {
    const r = right[j];
    if (!r) continue;
    let best = -1;
    let bestGap = Infinity;
    for (let i = 0; i < left.length; i++) {
      const l = left[i];
      if (!l || taken.has(i)) continue;
      const gap = Math.abs(Math.log(r.value) - Math.log(l.value));
      if (gap < bestGap) {
        bestGap = gap;
        best = i;
      }
    }
    if (best >= 0) {
      taken.add(best);
      placeAt.set(best, j);
    }
  }
  // 没配上左边的右边卡,留在自己原来的行
  const n = Math.max(left.length, right.length);
  const rows: [LadderItem | undefined, LadderItem | undefined][] = [];
  for (let i = 0; i < n; i++) {
    const j = placeAt.get(i);
    let r: LadderItem | undefined;
    if (j !== undefined) r = right[j];
    else if (i < right.length && !taken.has(i) && ![...placeAt.values()].includes(i)) r = right[i];
    rows.push([left[i], r]);
  }
  return rows;
}
