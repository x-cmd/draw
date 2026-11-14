// 布局引擎的挂载点 —— 库管「怎么画」,「怎么摆」可以换。
//
// 摆位分两种:
//   - **写了位置的**:作者说了算,引擎不插手(格子/像素都按给的来)
//   - **没写位置的**:交给**引擎**。库里自带一个通用的(够用但不聪明);
//     更好的算法(分层、簇感知那些)装在站上,不在这个公开仓里。
//
// 谁想接自己的引擎,renderArchCore({ layout }) 塞进来就行 ——
// URL 里没有 `engine=` 这种参数:引擎的选择是调用方的事,不是 URL 语法的一部分。

import type { ArchBoundary, ArchEdge, ArchNode } from './archmap.js';
import { packGrid, type Box } from './archmap.js';

/** 摆位引擎拿到的上下文 */
export interface LayoutCtx {
  /** 待摆的节点(一个位置都没写的那种情况) */
  nodes: ArchNode[];
  /** 连线 */
  edges: ArchEdge[];
  /** 分组(边界)—— 引擎可以拿它当「簇」 */
  boundaries: ArchBoundary[];
  /** 节点的框有多大(渲染层量好,引擎只管摆) */
  sizeOf: (n: ArchNode) => { w: number; h: number };
  /** 层(列)与层之间的横距 */
  gapX: number;
  /** 层内(上下)的纵距 */
  gapY: number;
  /** 画布留白 */
  pad: number;
  /** 方向:LR = 层往右走,TB = 层往下走 */
  dir: 'LR' | 'TB';
  /** 边标签有多宽(渲染层按字体量好,引擎不碰字体) */
  labelW: (e: ArchEdge) => number;
}

/** 摆完的结果:每个节点的框 + 画布多大 */
export interface LayoutResult {
  /** 节点 id → 框 */
  boxes: Map<string, Box>;
  W: number;
  H: number;
}

/** 摆位引擎:给一批节点,还一批框 */
export type LayoutEngine = (ctx: LayoutCtx) => LayoutResult;

/**
 * 边标签比两个节点之间的空档还宽时,把那一列撑开 —— 让标签有地方放,
 * 而不是压在节点的角标上。同一行、相邻两列的横边才需要(横着走的那一段最短)。
 */
export function labelGaps(nodes: ArchNode[], edges: ArchEdge[], labelW: (e: ArchEdge) => number): number[] {
  const colOf = new Map<string, { col: number; row: number }>();
  for (const n of nodes) if (n.grid) colOf.set(n.id, n.grid);
  const need = new Map<number, number>();
  for (const e of edges) {
    if (!e.label) continue;
    const a = colOf.get(e.from);
    const b = colOf.get(e.to);
    if (!a || !b || a.row !== b.row) continue;
    const [c1, c2] = a.col < b.col ? [a.col, b.col] : [b.col, a.col];
    if (c2 !== c1 + 1) continue; // 隔了列的边,横向那一段本来就够长
    need.set(c1, Math.max(need.get(c1) ?? 0, Math.min(labelW(e), 300)));
  }
  const out: number[] = [];
  for (const [c, v] of need) out[c] = v;
  return out;
}

/**
 * 库里自带的摆位:通用、够用,但不聪明 ——
 * 节点按你写的顺序(或落在邻居旁边)填进格子,一层一层排开。
 * 更好的算法在站上(私有仓),这个公开仓只留框架和这个通用实现。
 */
export function gridLayout(ctx: LayoutCtx): LayoutResult {
  // 拷贝一份:引擎不该改作者的节点(元数据里记的还是作者写的东西)
  const nodes = ctx.nodes.map((n) => ({ ...n }));
  const opts = {
    gapX: ctx.gapX,
    gapY: ctx.gapY,
    pad: ctx.pad,
    sizeOf: ctx.sizeOf,
    edges: ctx.edges,
  };
  // 第一遍:定格子(没写位置的节点会被自动放进去);第二遍:按边标签把列撑开
  packGrid(nodes, 0, opts);
  const r = packGrid(nodes, 0, { ...opts, gapAfter: labelGaps(nodes, ctx.edges, ctx.labelW) });
  return { boxes: new Map(r.placed.map((p) => [p.id, p.box])), W: r.W, H: r.H };
}
