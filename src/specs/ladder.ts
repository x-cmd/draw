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
  match?: 'rank' | 'value' | 'tier';
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
    if (m !== 'rank' && m !== 'value' && m !== 'tier') {
      throw new ApiError(400, `"match" must be "rank", "value" or "tier". Got: ${JSON.stringify(obj.match)}`);
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
    if (match !== 'rank' && match !== 'value' && match !== 'tier') {
      throw new ApiError(400, `"match" must be "rank", "value" or "tier". Got: ${JSON.stringify(match)}`);
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
  match: 'rank' | 'value' | 'tier' = 'rank',
): [LadderItem | undefined, LadderItem | undefined][] {
  if (match === 'rank') {
    const all: { item: LadderItem; side: 0 | 1 }[] = [
      ...left.map((item) => ({ item, side: 0 as const })),
      ...right.map((item) => ({ item, side: 1 as const })),
    ];
    all.sort((a, b) => b.item.value - a.item.value);
    return all.map((x) => (x.side === 0 ? [x.item, undefined] : [undefined, x.item]));
  }
  if (match === 'tier') {
    // **按档分块**:同一档的行连在一起 ✓
    //
    // 本质是「原始双翼算法(全排序 ✓)+ 一个抬升处理 ✓」:
    //   1. **先全排序**:两边合起来按强弱排 ⇒ 档的次序、档内的次序都定了 ✓
    //   2. **按档分块**;每块的行数 = max(左边的张数, 右边的张数) ✓
    //      ⇒ **两边都可能空档** ✓(哪边少,哪边空 ✓ —— 缺位是信号 ✓)
    //   3. 块内:左边第 k 张对右边第 k 张 ✓
    //      ⇒ 右边的卡是「抬」到对得上的那一行的 ✓(它比左边的下一张强 ✓)
    //
    // 右边自己**按强弱排** ✓ ⇒ 抬升之后**顺序不变** ✓。
    const all: { item: LadderItem; side: 0 | 1 }[] = [
      ...left.filter((x): x is LadderItem => !!x).map((item) => ({ item, side: 0 as const })),
      ...right.filter((x): x is LadderItem => !!x).map((item) => ({ item, side: 1 as const })),
    ];
    all.sort((a, b) => b.item.value - a.item.value);
    // 档的次序 = 全排序里第一次出现的次序 ✓;没写档的算一档 ✓
    const blocks: { tier: string; l: LadderItem[]; r: LadderItem[] }[] = [];
    for (const { item, side } of all) {
      const tier = item.tier ?? '';
      let blk = blocks.find((b) => b.tier === tier);
      if (!blk) {
        blk = { tier, l: [], r: [] };
        blocks.push(blk);
      }
      (side === 0 ? blk.l : blk.r).push(item);
    }
    const rows: [LadderItem | undefined, LadderItem | undefined][] = [];
    for (const blk of blocks) {
      const n = Math.max(blk.l.length, blk.r.length);   // 两边都可能空档 ✓
      for (let i = 0; i < n; i++) rows.push([blk.l[i], blk.r[i]]);
    }
    return rows;
  }
  // 匹配排序(value):**右边的每张卡抬升**,落到左边数值对得上的那一行 ✓
  //
  // 规则(定死的 ✓):对右边的一张卡 r,找**最后一个**满足 `left[n].value >= r.value`
  // 的行 n ✓ —— 于是 `left[n] >= r > left[n+1]` ✓,右边的卡刚好夹在左右两行之间 ✓
  // (比左边最强的还强 ⇒ 顶行 ✓)。
  //
  // 右边自己**按强弱排** ✓ ⇒ 抬升之后**顺序不变** ✓(这是要保证的 ✓)。
  // 抢到同一行 ⇒ 后一张往下顺延 ✓。
  //
  // 两边都会空出几行 ✓ —— 那些行是真的没有能对上的卡 ✓(缺位是信号 ✓)。
  const rightSorted = [...right].filter((x): x is LadderItem => !!x).sort((a, b) => b.value - a.value);
  const place = new Map<number, LadderItem>();   // 行号 → 右边那张卡 ✓
  const taken = new Set<number>();
  for (const r of rightSorted) {
    let target = -1;
    for (let i = 0; i < left.length; i++) {
      const l = left[i];
      if (!l) continue;
      if (l.value >= r.value) target = i;
      else break;                    // 左边是降序 ✓ 后面的只会更弱 ✓
    }
    if (target < 0) target = 0;      // 比左边最强的还强 ⇒ 顶行 ✓
    let row = target;
    while (taken.has(row)) row++;    // 抢同一行 ⇒ 往下顺延 ✓
    taken.add(row);
    place.set(row, r);
  }
  const last = place.size ? Math.max(...place.keys()) + 1 : 0;
  const n = Math.max(left.length, last);
  const rows: [LadderItem | undefined, LadderItem | undefined][] = [];
  for (let i = 0; i < n; i++) rows.push([left[i], place.get(i)]);
  return rows;
}
