// 分层布局(Sugiyama 骨架):分层 → 层内排序 → 定坐标。
//
// 为什么自己写而不用现成的:dagre 那套是给流程图调的(节点等宽、直线边、坐标在
// 它自己那套空间里),我们这儿节点大小不一、边是正交绕行的,坐标得能直接喂给
// 布线引擎(Hanan 网格那套)。借它的四步:
//   1. 分层(rank):去环后按最长路径分层 —— 源在前,汇在后
//   2. 层内排序:中位数重心法反复扫,取交叉最少的那轮
//   3. 定坐标:层轴按层宽累加;序轴解一个「保序最小间距」的最小二乘(PAVA),
//      让节点跟邻居对齐
//   4. 收拾:长边补虚节点、连通分量各自成带、整图居中
//
// 术语:层(layer)= 一列(横排时)/ 一行(竖排时);层内顺序 = 上下(横排时)的次序。

export interface LayoutNode {
  id: string;
  w: number;
  h: number;
}
export interface LayoutEdge {
  from: string;
  to: string;
  /** 边标签的宽(像素)—— 层间距要给它留地方;0/不给 = 没有标签 */
  labelW?: number;
}
export interface LayoutBox {
  x: number;
  y: number;
  w: number;
  h: number;
}

export interface LayeredOptions {
  nodes: LayoutNode[];
  edges: LayoutEdge[];
  /** 层往右走(LR,架构图默认)还是往下走(TB) */
  dir?: 'LR' | 'TB';
  /** 层与层之间的间距 */
  layerGap?: number;
  /** 同一层里节点之间的间距 */
  nodeGap?: number;
  /** 画布留白 */
  pad?: number;
  /** 某一层之后的额外间距(下标=层号)—— 给横着的边标签腾地方 */
  gapAfter?: number[];
}

export interface LayeredResult {
  /** 每个真实节点的最终框 */
  boxes: Map<string, LayoutBox>;
  /** 每层的真实节点 id(按序,虚节点已剔除) */
  layers: string[][];
  /** 层数 */
  depth: number;
  W: number;
  H: number;
}

/* ---------------------------------------------------------------- 小工具 */

/** 序列里的逆序对数(BIT,O(n log n))—— 层间交叉数就是它 */
function inversions(arr: number[]): number {
  if (arr.length < 2) return 0;
  let max = 0;
  for (const v of arr) if (v > max) max = v;
  const bit = new Int32Array(max + 2);
  let inv = 0;
  for (let i = arr.length - 1; i >= 0; i--) {
    const v = arr[i] + 1; // 1-based
    let s = 0;
    for (let x = v - 1; x > 0; x -= x & -x) s += bit[x];
    inv += s;
    for (let x = v; x <= max + 1; x += x & -x) bit[x]++;
  }
  return inv;
}

const median = (xs: number[]): number => {
  if (!xs.length) return 0;
  const s = [...xs].sort((a, b) => a - b);
  const m = s.length >> 1;
  return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2;
};

/**
 * 保序最小间距的最小二乘:求 y 使 Σ(y_i - t_i)² 最小,且 y_{i+1} - y_i ≥ sep_i。
 * 做法:把间距折进坐标(z_i = y_i - Σ_{j<i} sep_j)→ 变成标准单调回归 → PAVA
 * (池相邻违反者)。PAVA 的块合并是精确解,不是启发式。
 */
function pava(targets: number[], seps: number[]): number[] {
  const n = targets.length;
  if (n === 0) return [];
  const pre = new Array<number>(n).fill(0);
  for (let i = 1; i < n; i++) pre[i] = pre[i - 1] + seps[i - 1];
  const z = targets.map((t, i) => t - pre[i]);
  const blocks: { sum: number; cnt: number; val: number }[] = [];
  for (const zi of z) {
    blocks.push({ sum: zi, cnt: 1, val: zi });
    while (blocks.length >= 2) {
      const a = blocks[blocks.length - 2];
      const b = blocks[blocks.length - 1];
      if (a.val <= b.val) break;
      blocks.pop();
      blocks.pop();
      const sum = a.sum + b.sum;
      const cnt = a.cnt + b.cnt;
      blocks.push({ sum, cnt, val: sum / cnt });
    }
  }
  const out = new Array<number>(n);
  let i = 0;
  for (const b of blocks) {
    for (let k = 0; k < b.cnt; k++) out[i++] = b.val;
  }
  return out.map((v, k) => v + pre[k]);
}

/* ---------------------------------------------------------------- 一个连通分量
   分量内:分层 → 层内排序 → 定坐标。坐标是分量内的局部坐标(从 0 起)。 */

interface Item {
  /** 真实节点下标;虚节点为 -1 */
  node: number;
  real: boolean;
  w: number;
  h: number;
  rank: number;
}

interface CompLayout {
  /** 真实节点 → 局部坐标(层轴 along,序轴 across) */
  at: Map<number, { along: number; across: number }>;
  /** 每层的真实节点(局部层号) */
  layers: number[][];
  depth: number;
  /** 层轴 / 序轴的跨度 */
  alongSpan: number;
  acrossSpan: number;
}

function layoutComponent(
  nodeIdxs: number[],
  compEdges: { a: number; b: number; lw: number }[],
  sizeOf: (i: number) => { w: number; h: number },
  layerGap: number,
  nodeGap: number,
  gapAfter: number[],
  LR: boolean,
): CompLayout {
  const N = nodeIdxs.length;
  const local = new Map<number, number>();
  nodeIdxs.forEach((g, i) => local.set(g, i));

  // ── 1. 去环:DFS 回边(指向还在栈上的节点)不参与分层
  const outE: number[][] = Array.from({ length: N }, () => []);
  compEdges.forEach((e, i) => outE[local.get(e.a)!].push(i));
  const color = new Uint8Array(N);
  const back = new Set<number>();
  for (let s = 0; s < N; s++) {
    if (color[s]) continue;
    color[s] = 1;
    const stack: { v: number; i: number }[] = [{ v: s, i: 0 }];
    while (stack.length) {
      const top = stack[stack.length - 1];
      if (top.i < outE[top.v].length) {
        const ei = outE[top.v][top.i++];
        const w = local.get(compEdges[ei].b)!;
        if (color[w] === 1) back.add(ei);
        else if (color[w] === 0) {
          color[w] = 1;
          stack.push({ v: w, i: 0 });
        }
      } else {
        color[top.v] = 2;
        stack.pop();
      }
    }
  }

  // ── 2. 分层:最长路径(拓扑序里松弛 rank[to] ≥ rank[from] + 1)
  const rank = new Array<number>(N).fill(0);
  {
    const indeg = new Array<number>(N).fill(0);
    compEdges.forEach((e, i) => {
      if (!back.has(i)) indeg[local.get(e.b)!]++;
    });
    const deg = indeg.slice();
    const q: number[] = [];
    for (let v = 0; v < N; v++) if (deg[v] === 0) q.push(v);
    for (let qi = 0; qi < q.length; qi++) {
      const v = q[qi];
      for (const ei of outE[v]) {
        if (back.has(ei)) continue;
        const b = local.get(compEdges[ei].b)!;
        if (rank[b] < rank[v] + 1) rank[b] = rank[v] + 1;
        if (--deg[b] === 0) q.push(b);
      }
    }
  }

  // ── 3. 虚节点:跨层的长边在中间层补占位,排序和对齐才对得齐
  const items: Item[] = nodeIdxs.map((g, i) => {
    const s = sizeOf(g);
    return { node: g, real: true, w: s.w, h: s.h, rank: rank[i] };
  });
  const itemEdges: [number, number][] = [];
  let dummies = 0;
  for (const e of compEdges) {
    const a = local.get(e.a)!;
    const b = local.get(e.b)!;
    const ra = items[a].rank;
    const rb = items[b].rank;
    if (rb <= ra) continue; // 回边/同层:不串链
    let prev = a;
    for (let r = ra + 1; r < rb; r++) {
      items.push({ node: -1, real: false, w: 0, h: 0, rank: r });
      const di = items.length - 1;
      itemEdges.push([prev, di]);
      prev = di;
    }
    itemEdges.push([prev, b]);
  }

  const M = items.length;
  const depth = items.reduce((m, it) => Math.max(m, it.rank), 0) + 1;
  const layers: number[][] = Array.from({ length: depth }, () => []);
  items.forEach((it, i) => layers[it.rank].push(i));

  const succ: number[][] = Array.from({ length: M }, () => []);
  const pred: number[][] = Array.from({ length: M }, () => []);
  for (const [a, b] of itemEdges) {
    succ[a].push(b);
    pred[b].push(a);
  }

  const pos = new Int32Array(M);
  const reindex = (): void => {
    for (const l of layers) l.forEach((v, i) => (pos[v] = i));
  };
  reindex();

  // ── 4. 层内排序:中位数重心法来回扫,取交叉最少的那轮
  const medianPos = (v: number, from: number[][]): number => {
    const ns = from[v];
    if (!ns.length) return pos[v];
    return median(ns.map((u) => pos[u]));
  };
  const sweep = (dir: 1 | -1): void => {
    const from = dir === 1 ? pred : succ;
    const ls = dir === 1 ? layers.slice(1) : layers.slice(0, -1).reverse();
    for (const l of ls) {
      const key = new Map<number, number>();
      for (const v of l) key.set(v, medianPos(v, from));
      const old = new Map<number, number>();
      l.forEach((v, i) => old.set(v, i));
      l.sort((a, b) => key.get(a)! - key.get(b)! || old.get(a)! - old.get(b)!);
      reindex();
    }
  };
  const crossings = (): number => {
    let total = 0;
    for (let L = 0; L + 1 < depth; L++) {
      const es: [number, number][] = [];
      for (const u of layers[L]) {
        for (const v of succ[u]) if (items[v].rank === L + 1) es.push([pos[u], pos[v]]);
      }
      es.sort((a, b) => a[0] - b[0] || a[1] - b[1]);
      total += inversions(es.map((e) => e[1]));
    }
    return total;
  };
  let best = layers.map((l) => l.slice());
  let bestCross = crossings();
  for (let it = 0; it < 8 && bestCross > 0; it++) {
    sweep(it % 2 === 0 ? 1 : -1);
    sweep(it % 2 === 0 ? -1 : 1);
    const c = crossings();
    if (c < bestCross) {
      bestCross = c;
      best = layers.map((l) => l.slice());
    }
  }
  for (let L = 0; L < depth; L++) layers[L] = best[L];
  reindex();

  // ── 5. 定坐标
  // 层轴(横排时是 x):层宽累加;序轴(横排时是 y):跟邻居对齐。
  const alongOf = (it: Item): number => (LR ? it.w : it.h);
  const acrossOf = (it: Item): number => (LR ? it.h : it.w);
  const bandW = layers.map((l) => l.reduce((m, v) => Math.max(m, alongOf(items[v])), 0));
  // 带标签的那一段要腾出标签的宽(标签横着躺在层与层之间)
  const labelGap = new Array<number>(depth).fill(0);
  for (const e of compEdges) {
    if (!e.lw) continue;
    const a = items[local.get(e.a)!].rank;
    const b = items[local.get(e.b)!].rank;
    if (b <= a) continue;
    const m = Math.floor((a + b) / 2); // 标签落在中段
    if (m < depth - 1) labelGap[m] = Math.max(labelGap[m], e.lw);
  }
  const gapOf = (L: number): number => Math.max(layerGap, gapAfter[L] ?? 0, labelGap[L]);
  const along = new Array<number>(depth).fill(0);
  {
    let a = 0;
    for (let L = 0; L < depth; L++) {
      along[L] = a;
      a += bandW[L] + (L + 1 < depth ? gapOf(L) : 0);
    }
  }

  // 序轴:每层先按顺序摆开,再反复跟邻居对齐
  const across = new Array<number>(M).fill(0);
  for (const l of layers) {
    let y = 0;
    for (const v of l) {
      const it = items[v];
      across[v] = y + acrossOf(it) / 2;
      y += acrossOf(it) + nodeGap;
    }
  }
  const alignLayer = (l: number[], from: number[][], step: -1 | 1): void => {
    if (!l.length) return;
    const targets = l.map((v) => {
      const ns = from[v].filter((u) => items[u].rank === items[v].rank + step);
      if (!ns.length) return across[v];
      // 目标 = 邻居位置的中位数,但要「吸附」到最近的一个邻居上:
      // 两个邻居差着一格时,落在中间等于谁也没对齐,不如贴着其中一个,
      // 另一个那根线斜着走 —— 整层因此保持紧凑(这是 L1 意义下的最优)。
      const ps = ns.map((u) => across[u]).sort((a, b) => a - b);
      const m = ps.length >> 1;
      const med = ps.length % 2 ? ps[m] : (ps[m - 1] + ps[m]) / 2;
      let best = ps[0];
      for (const p of ps) if (Math.abs(p - med) < Math.abs(best - med)) best = p;
      return best;
    });
    const seps: number[] = [];
    for (let i = 1; i < l.length; i++) {
      seps.push((acrossOf(items[l[i - 1]]) + acrossOf(items[l[i]])) / 2 + nodeGap);
    }
    const ys = pava(targets, seps);
    l.forEach((v, i) => (across[v] = ys[i]));
  };
  for (let it = 0; it < 6; it++) {
    const fwd = it % 2 === 0;
    const ls = fwd ? layers.slice(1) : layers.slice(0, -1).reverse();
    for (const l of ls) alignLayer(l, fwd ? pred : succ, fwd ? -1 : 1);
  }

  // ── 6. 收拾:序轴整体上移,层轴收口
  let acrossMin = Infinity;
  let acrossMax = -Infinity;
  for (let v = 0; v < M; v++) {
    const it = items[v];
    if (!it.real) continue;
    acrossMin = Math.min(acrossMin, across[v] - acrossOf(it) / 2);
    acrossMax = Math.max(acrossMax, across[v] + acrossOf(it) / 2);
  }
  if (!Number.isFinite(acrossMin)) {
    acrossMin = 0;
    acrossMax = 0;
  }
  const acrossShift = -acrossMin;

  const at = new Map<number, { along: number; across: number }>();
  for (let v = 0; v < M; v++) {
    const it = items[v];
    if (!it.real) continue;
    at.set(it.node, {
      along: along[it.rank] + bandW[it.rank] / 2,
      across: across[v] + acrossShift,
    });
  }
  const last = depth - 1;
  return {
    at,
    layers: layers.map((l) => l.filter((v) => items[v].real).map((v) => items[v].node)),
    depth,
    alongSpan: along[last] + bandW[last],
    acrossSpan: acrossMax - acrossMin,
  };
}

/* ---------------------------------------------------------------- 主流程 */

export function layeredLayout(o: LayeredOptions): LayeredResult {
  const dir = o.dir ?? 'LR';
  const layerGap = o.layerGap ?? 64;
  const nodeGap = o.nodeGap ?? 56;
  const pad = o.pad ?? 44;
  const LR = dir === 'LR';

  const nodes = o.nodes;
  const N = nodes.length;
  const idx = new Map<string, number>();
  nodes.forEach((n, i) => idx.set(n.id, i));

  // ── 0. 边:去掉自环、重复、指向不存在节点的
  const E: { a: number; b: number; lw: number }[] = [];
  const eSeen = new Set<string>();
  for (const e of o.edges) {
    const a = idx.get(e.from);
    const b = idx.get(e.to);
    if (a === undefined || b === undefined || a === b) continue;
    const k = a < b ? `${a}:${b}` : `${b}:${a}`;
    if (eSeen.has(k)) continue;
    eSeen.add(k);
    E.push({ a, b, lw: e.labelW ?? 0 });
  }

  // ── 1. 弱连通分量:各自分别排,再一条一条叠起来(互不相干的子系统不搅在一起)
  const compOf = new Int32Array(N).fill(-1);
  const comps: number[][] = [];
  {
    const adj: number[][] = Array.from({ length: N }, () => []);
    for (const e of E) {
      adj[e.a].push(e.b);
      adj[e.b].push(e.a);
    }
    for (let s = 0; s < N; s++) {
      if (compOf[s] >= 0) continue;
      const c = comps.length;
      comps.push([]);
      const stack = [s];
      compOf[s] = c;
      while (stack.length) {
        const v = stack.pop()!;
        comps[c].push(v);
        for (const u of adj[v]) {
          if (compOf[u] < 0) {
            compOf[u] = c;
            stack.push(u);
          }
        }
      }
      // 分量内的节点按给的顺序(层内排序的初值就是它)
      comps[c].sort((x, y) => x - y);
    }
  }

  const sizeOf = (i: number): { w: number; h: number } => ({ w: nodes[i].w, h: nodes[i].h });

  // ── 2. 每个分量排一遍,再叠放
  const boxes = new Map<string, LayoutBox>();
  const layers: string[][] = [];
  let depth = 0;
  let alongSpan = 0;
  let acrossSpan = 0;
  const compGap = nodeGap;
  comps.forEach((comp, ci) => {
    const compEdges = E.filter((e) => compOf[e.a] === ci);
    const lay = layoutComponent(comp, compEdges, sizeOf, layerGap, nodeGap, o.gapAfter ?? [], LR);
    depth = Math.max(depth, lay.depth);
    alongSpan = Math.max(alongSpan, lay.alongSpan);
    for (const [node, p] of lay.at) {
      const it = nodes[node];
      // 分量沿序轴叠放(横排时上下分带,竖排时左右分带);层轴各自从 0 起
      const along = pad + p.along;
      const across = pad + acrossSpan + p.across;
      boxes.set(it.id, LR
        ? { x: along - it.w / 2, y: across - it.h / 2, w: it.w, h: it.h }
        : { x: across - it.w / 2, y: along - it.h / 2, w: it.w, h: it.h });
    }
    for (const l of lay.layers) layers.push(l.map((i) => nodes[i].id));
    acrossSpan += lay.acrossSpan + (ci + 1 < comps.length ? compGap : 0);
  });

  const W = LR ? alongSpan + pad * 2 : acrossSpan + pad * 2;
  const H = LR ? acrossSpan + pad * 2 : alongSpan + pad * 2;
  return { boxes, layers, depth, W, H };
}
