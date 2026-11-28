// 簇感知的布局:边界(b=)当成一个「簇」。
//
// 为什么要有簇:一个分组里的成员常常被别的节点隔开 ——
// 边界框就把不相干的东西圈进去了,读者会以为那个节点也归这个边界管。
// 簇的做法是:先排簇内部,再排簇与簇之间,合成后每个簇是一个只装着自己成员的紧盒子。
//
// 簇是一棵树:边界之间按「包含」定父子(最紧的那层是子),
// 一个节点归**最内层**的簇 —— 内层的分组说了算。
// 于是嵌套的分组也能排:b=Outer;a b c&b=Inner;b c 里,
// Inner 是 Outer 的孩子,b、c 归 Inner,a 归 Outer。
//
// 排法是递归的:
//   一层的内容 = 自己的成员节点 + 孩子簇(孩子当成一个盒子)
//   孩子的尺寸先算好(自底向上),这一层再排一次(分层引擎)
//   最外层 = 顶层簇 + 没进任何分组的节点,排一次,再把内容放进各自的簇里
//
// 引擎在站上(私有仓);公开的 @x-cmd/draw 里只有挂载点。

import type { LayoutCtx, LayoutResult } from '@x-cmd/draw';
import { growForPorts, portDemand } from './portsize.js';
import { layeredCore } from './layered.js';

interface Box {
  x: number;
  y: number;
  w: number;
  h: number;
}

/** 簇内边距 —— 和库里画边界框的留白一致(BOUNDARY_PAD) */
const PAD = 30;
/** 边界的小牌子探出框外的距离:簇上面得多留这一格 */
const LABEL_OUT = 9;

/** 一层里的一个「东西」:要么是节点,要么是子簇(当成一个盒子) */
interface Item {
  /** 'n:<节点id>' 或 'c:<边界下标>' */
  key: string;
  w: number;
  h: number;
  /** 这一项是节点时:节点 id */
  node?: string;
  /** 这一项是子簇时:边界下标 */
  cluster?: number;
}

interface Edge {
  from: string;
  to: string;
  /** 边标签的宽 —— 层间距要给它留地方 */
  lw: number;
}

export function clusterLayout(ctx: LayoutCtx): LayoutResult {
  const byId = new Map(ctx.nodes.map((n) => [n.id, n]));
  // 端口接不下就长高 —— 端口挤在一起,箭头会叠成一条黑杠
  const demand = portDemand(ctx.nodes, ctx.edges);

  // ── 1. 分簇:边界之间按「包含」定父子,节点归最内层
  // 只认有成员的边界(空的没有内容,也不该当别人的父)
  const bds = ctx.boundaries
    .map((bd, i) => ({ i, ids: bd.ids.filter((id) => byId.has(id)) }))
    .filter((b) => b.ids.length > 0);
  const setOf = new Map<number, Set<string>>(bds.map((b) => [b.i, new Set(b.ids)]));
  const contains = (a: number, b: number): boolean => {
    const sa = setOf.get(a)!;
    const sb = setOf.get(b)!;
    if (sa.size < sb.size) return false;
    for (const id of sb) if (!sa.has(id)) return false;
    return true;
  };
  /** 父 = 包含自己、且最贴身的那层;成员一样多时靠前的那个算父 */
  const parentOf = new Map<number, number>();
  for (const b of bds) {
    let best = -1;
    for (const c of bds) {
      if (c.i === b.i || !contains(c.i, b.i)) continue;
      const cs = setOf.get(c.i)!.size;
      const bs = setOf.get(b.i)!.size;
      // 成员一样多 → 靠前的算父:它靠后,那它是我的孩子(内层),不当父
      if (cs === bs && c.i > b.i) continue;
      if (best < 0) { best = c.i; continue; }
      const bestSize = setOf.get(best)!.size;
      if (cs < bestSize) best = c.i;
      else if (cs === bestSize && c.i < best) best = c.i;
    }
    if (best >= 0) parentOf.set(b.i, best);
  }
  // 兜底:万一还是成了环(两个成员一样的分组),断开一条 —— 不然递归会转死
  for (const b of bds) {
    const seen = new Set<number>();
    let cur: number | undefined = b.i;
    while (cur !== undefined && parentOf.has(cur)) {
      if (seen.has(cur)) { parentOf.delete(cur); break; }
      seen.add(cur);
      cur = parentOf.get(cur);
    }
  }
  const childrenOf = new Map<number, number[]>();
  for (const b of bds) {
    const p = parentOf.get(b.i);
    if (p === undefined) continue;
    childrenOf.set(p, [...(childrenOf.get(p) ?? []), b.i]);
  }
  const roots = bds.filter((b) => !parentOf.has(b.i)).map((b) => b.i);

  /** 节点归哪个簇:最内层(成员最少的那层);一样大 → 先到的算 */
  const owner = new Map<string, number>();
  for (const n of ctx.nodes) {
    let best = -1;
    for (const b of bds) {
      if (!setOf.get(b.i)!.has(n.id)) continue;
      if (best < 0) { best = b.i; continue; }
      const bs = setOf.get(best)!.size;
      const cs = setOf.get(b.i)!.size;
      if (cs < bs) best = b.i;
    }
    if (best >= 0) owner.set(n.id, best);
  }
  /** 直接归这个簇的节点(更深的那层已经拿走了) */
  const own = new Map<number, string[]>();
  for (const b of bds) own.set(b.i, []);
  for (const n of ctx.nodes) {
    const o = owner.get(n.id);
    if (o !== undefined) own.get(o)!.push(n.id);
  }
  /** 这个簇(含后代)里的所有节点 —— 边要按它在第几层来算 */
  const allOf = new Map<number, string[]>();
  const collect = (i: number): string[] => {
    if (allOf.has(i)) return allOf.get(i)!;
    const out = [...(own.get(i) ?? [])];
    for (const c of childrenOf.get(i) ?? []) out.push(...collect(c));
    allOf.set(i, out);
    return out;
  };
  for (const b of bds) collect(b.i);

  // ── 2. 一层的内容与边
  // 节点 → 它在这一层对应的 item:自己的成员是节点,孩子簇里的算孩子簇
  const buildLevel = (
    levelClusters: number[],
    levelNodes: string[],
  ): { items: Item[]; edges: Edge[] } => {
    const items: Item[] = [];
    const keyOf = new Map<string, string>();
    for (const n of levelNodes) {
      const s = growForPorts(ctx.sizeOf(byId.get(n)!), demand.get(n) ?? 0, ctx.dir);
      items.push({ key: `n:${n}`, w: s.w, h: s.h, node: n });
      keyOf.set(n, `n:${n}`);
    }
    for (const c of levelClusters) {
      items.push({ key: `c:${c}`, w: cw.get(c)!, h: ch.get(c)!, cluster: c });
      for (const n of allOf.get(c)!) keyOf.set(n, `c:${c}`);
    }
    // 边:两端都在这一层里才算;同一对只留一条(标签取最宽的)
    const seen = new Map<string, Edge>();
    for (const e of ctx.edges) {
      const a = keyOf.get(e.from);
      const b = keyOf.get(e.to);
      if (!a || !b || a === b) continue;
      const k = a < b ? `${a}>${b}` : `${b}>${a}`;
      const lw = ctx.labelW(e);
      const prev = seen.get(k);
      if (!prev) seen.set(k, { from: a, to: b, lw });
      else if (lw > prev.lw) prev.lw = lw;
    }
    return { items, edges: [...seen.values()] };
  };

  // ── 3. 每个簇的内容怎么排(自底向上:孩子先算好尺寸)
  const inner = new Map<number, Map<string, Box>>();   // 簇 → 内容的相对坐标
  const cw = new Map<number, number>();                 // 簇的宽
  const ch = new Map<number, number>();                 // 簇的高
  for (const b of bds) inner.set(b.i, new Map());

  const layoutCluster = (ci: number): void => {
    for (const c of childrenOf.get(ci) ?? []) layoutCluster(c);
    const lvl = buildLevel(childrenOf.get(ci) ?? [], own.get(ci) ?? []);
    const res = layeredCore({
      nodes: lvl.items.map((i) => ({ id: i.key, w: i.w, h: i.h })),
      edges: lvl.edges.map((e) => ({ from: e.from, to: e.to, labelW: e.lw })),
      dir: ctx.dir,
      layerGap: ctx.gapX,
      nodeGap: ctx.gapY,
      pad: 0,
    });
    const rel = inner.get(ci)!;
    for (const i of lvl.items) {
      const b = res.boxes.get(i.key);
      if (b) rel.set(i.key, b);
    }
    cw.set(ci, res.W + PAD * 2);
    ch.set(ci, res.H + PAD * 2 + LABEL_OUT);
  };
  for (const b of bds) layoutCluster(b.i);

  // ── 4. 最外层:顶层簇 + 没进任何分组的节点
  const loose = ctx.nodes.filter((n) => !owner.has(n.id)).map((n) => n.id);
  const lvl = buildLevel(roots, loose);
  const outer = layeredCore({
    nodes: lvl.items.map((i) => ({ id: i.key, w: i.w, h: i.h })),
    edges: lvl.edges.map((e) => ({ from: e.from, to: e.to, labelW: e.lw })),
    dir: ctx.dir,
    layerGap: ctx.gapX,
    nodeGap: ctx.gapY,
    pad: ctx.pad,
  });

  // ── 5. 合成:内容摆进自己的簇,簇摆进它的父簇
  const boxes = new Map<string, Box>();
  const place = (ci: number, ox: number, oy: number): void => {
    const rel = inner.get(ci)!;
    for (const [key, b] of rel) {
      if (key.startsWith('n:')) {
        const id = key.slice(2);
        boxes.set(id, { x: ox + PAD + b.x, y: oy + PAD + LABEL_OUT + b.y, w: b.w, h: b.h });
      } else {
        const child = Number(key.slice(2));
        place(child, ox + PAD + b.x, oy + PAD + LABEL_OUT + b.y);
      }
    }
  };
  for (const i of lvl.items) {
    const b = outer.boxes.get(i.key);
    if (!b) continue;
    if (i.node !== undefined) boxes.set(i.node, b);
    else if (i.cluster !== undefined) place(i.cluster, b.x, b.y);
  }
  return { boxes, W: outer.W, H: outer.H };
}
