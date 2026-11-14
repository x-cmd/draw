// 布线的契约与共用内核(v1/v2 共用这一份)。
//
// 规矩(2026-11-15,x-cmd-hub/draw#91/#92/#93):
//   R1 不同源的边:绝不共用一段,绝不首尾相接 —— 接成一根不是难看,是读者会看错图
//   R2 同源的边:可以共用一段引线(从源端口到扇出点),但只在必要时(合流窗口)
//   R3 端口:同一张脸进出的线一起排,不许落同一个点;相邻 ≥ PORT_GAP;这面装不下就换面
//   R4 通道:两条边不许共用同一条竖/横通道
//   R5 绕远上限:路长 ≤ 直线距离 × MAX_DETOUR —— 宁可交叉,也不许绕出画布一大圈
//
// 公开仓这版是**基础版**:规矩都守住,但没有引线(同源的线也各走各的)。
// 更好的那版(引线、通道分配、节点按度数长高)在私有仓 —— 挂载点见 RoutingEngine。
// 引擎是调用方的事,不是 URL 语法的一部分(跟摆位一样)。

import type { ArchEdge, ArchNode, Box, Side } from './archmap.js';

/* ---------------------------------------------------------------- 契约 */

/** 布线引擎的输入:摆好了的位置 + 边 + 障碍 */
export interface RoutingCtx {
  /** 节点(带 id) */
  nodes: ArchNode[];
  /** 摆好的位置:id → 框 */
  boxes: Map<string, Box>;
  /** 边(下标跟返回值的下标一一对应) */
  edges: ArchEdge[];
  /** 分组框 —— 绕行时别跑出这个框 */
  bounds: Box[];
  /** 层往哪儿走 */
  dir: 'LR' | 'TB';
  /** 线接在节点的哪块上(大图标模式:只接图标那块,不接名字) */
  portBox: (id: string) => Box;
}

/** 布线引擎:按 ctx.edges 的下标,返回每条边的折点 */
export type RoutingEngine = (ctx: RoutingCtx) => [number, number][][];

/* ---------------------------------------------------------------- 规矩的常量 */

/** 相邻端口的最小间距(箭头 7px + 2 —— 挤在一起箭头就叠了) */
export const PORT_GAP = 9;
/** 箭头的边长(画在 defs 里:markerWidth=7)—— 端口间距的下限 */
const ARROW = 7;
/** 端口离脸的两端留多少(别贴着角) */
const FACE_MARGIN = 8;
/** 障碍胀开的距离:路不贴着框走 */
const ROUTE_MARGIN = 8;
/** 拐一次弯的代价(像素当量) */
const ROUTE_BEND = 30;
/** 交叉一次别的线的代价 —— 比绕远一点贵,但不是「除非没别的路」 */
const ROUTE_CROSS = 800;
/** 挨上(接在同一个点上)的代价 —— 比交叉更贵:接成一根线最难读 */
const ROUTE_TOUCH = 1600;
/** 绕远上限:路长 ≤ 直线距离 × 这个倍数 */
const MAX_DETOUR = 3;
/** 端口往外伸的那一小段(引线的长度) */
const STUB = 16;
/** 并行走的线离原来那条多远(地铁图那样:两条线分开一点) */
const PARALLEL = 7;
/** 多近算「同一条通道」(差这么几像素就是并排走,挤在一处) */
const CHANNEL = 12;
/** 挤在别人已经走过的通道里的代价 —— 空着的通道更清楚,别都堆在一处 */
const CHANNEL_COST = 250;

/* ---------------------------------------------------------------- 小工具 */

/** 端口位置:偏移由调用方给(0 = 正中) */
export function portAt(b: Box, side: Side, off: number): [number, number] {
  const cx = b.x + b.w / 2;
  const cy = b.y + b.h / 2;
  switch (side) {
    case 'left': return [b.x, cy + off];
    case 'right': return [b.x + b.w, cy + off];
    case 'top': return [cx + off, b.y];
    case 'bottom': return [cx + off, b.y + b.h];
  }
}

/** 一侧上第 i 个端口的默认偏移(n 个端口均分这一侧) */
export function portOffset(len: number, i: number, n: number): number {
  return ((i + 1) / (n + 1) - 0.5) * len;
}

/** 端口朝外的方向 */
const OUT_DIR: Record<Side, [number, number]> = {
  left: [-1, 0], right: [1, 0], top: [0, -1], bottom: [0, 1],
};

const cx = (b: Box): number => b.x + b.w / 2;
const cy = (b: Box): number => b.y + b.h / 2;

/** 面的长度(左/右 = 高,上/下 = 宽) */
const faceLen = (b: Box, side: Side): number => (side === 'left' || side === 'right' ? b.h : b.w);

/** 两个框在某个方向上留出多远(不是中心差多少) */
function gapBetween(a: Box, b: Box): { gx: number; gy: number } {
  return {
    gx: Math.max(0, Math.max(a.x, b.x) - Math.min(a.x + a.w, b.x + b.w)),
    gy: Math.max(0, Math.max(a.y, b.y) - Math.min(a.y + a.h, b.y + b.h)),
  };
}

/** 点到框的 L1 距离(框内为 0) */
function distToBox(p: [number, number], b: Box): number {
  const dx = Math.max(0, Math.max(b.x - p[0], p[0] - (b.x + b.w)));
  const dy = Math.max(0, Math.max(b.y - p[1], p[1] - (b.y + b.h)));
  return dx + dy;
}

/** 两段线是否真交叉(共线、端点相接不算) */
export function segsCross(
  p1: [number, number], p2: [number, number],
  p3: [number, number], p4: [number, number],
): boolean {
  const d = (a: [number, number], b: [number, number], c: [number, number]): number =>
    (b[0] - a[0]) * (c[1] - a[1]) - (b[1] - a[1]) * (c[0] - a[0]);
  const d1 = d(p3, p4, p1);
  const d2 = d(p3, p4, p2);
  const d3 = d(p1, p2, p3);
  const d4 = d(p1, p2, p4);
  return d1 * d2 < 0 && d3 * d4 < 0;
}

/**
 * 共线且压在同一段上(两条线走同一条路)。
 *
 * 交叉判定抓不到这种:共线的两段,上面的 d3、d4 都是 0,判出来是「不相交」。
 * 而「两条线叠在一起」比「两条线交叉」更难看 —— 看着像一根线,
 * 读者分不清那是两条边。所以压线要单独判、单独罚。
 */
export function segsOverlap(
  p1: [number, number], p2: [number, number],
  p3: [number, number], p4: [number, number],
): boolean {
  const EPS = 0.01;
  const d = (a: [number, number], b: [number, number], c: [number, number]): number =>
    (b[0] - a[0]) * (c[1] - a[1]) - (b[1] - a[1]) * (c[0] - a[0]);
  if (Math.abs(d(p1, p2, p3)) > EPS || Math.abs(d(p1, p2, p4)) > EPS) return false;
  const axis = Math.abs(p2[0] - p1[0]) >= Math.abs(p2[1] - p1[1]) ? 0 : 1;
  const lo = Math.max(Math.min(p1[axis], p2[axis]), Math.min(p3[axis], p4[axis]));
  const hi = Math.min(Math.max(p1[axis], p2[axis]), Math.max(p3[axis], p4[axis]));
  return hi > lo + EPS;
}

/** 两段线有没有公共点(含交叉、含端点相接、含共线重叠) */
export function segsMeet(
  p1: [number, number], p2: [number, number],
  p3: [number, number], p4: [number, number],
): boolean {
  if (segsCross(p1, p2, p3, p4)) return true;
  const EPS = 1e-6;
  const d = (a: [number, number], b: [number, number], c: [number, number]): number =>
    (b[0] - a[0]) * (c[1] - a[1]) - (b[1] - a[1]) * (c[0] - a[0]);
  const on = (a: [number, number], b: [number, number], p: [number, number]): boolean =>
    Math.abs(d(a, b, p)) <= EPS &&
    p[0] >= Math.min(a[0], b[0]) - EPS && p[0] <= Math.max(a[0], b[0]) + EPS &&
    p[1] >= Math.min(a[1], b[1]) - EPS && p[1] <= Math.max(a[1], b[1]) + EPS;
  return on(p3, p4, p1) || on(p3, p4, p2) || on(p1, p2, p3) || on(p1, p2, p4);
}

/**
 * 一条线段是否穿过某个框。
 * 贴着框边走不算 —— 那些格子正是路径要用的(不然网格上就没有能走的线了)。
 */
function segInBox(a: [number, number], b: [number, number], box: Box): boolean {
  const EPS = 0.01;
  const x0 = Math.min(a[0], b[0]);
  const x1 = Math.max(a[0], b[0]);
  const y0 = Math.min(a[1], b[1]);
  const y1 = Math.max(a[1], b[1]);
  if (a[1] === b[1]) {
    if (!(a[1] > box.y + EPS && a[1] < box.y + box.h - EPS)) return false;
    return x0 < box.x + box.w - EPS && x1 > box.x + EPS;
  }
  if (!(a[0] > box.x + EPS && a[0] < box.x + box.w - EPS)) return false;
  return y0 < box.y + box.h - EPS && y1 > box.y + EPS;
}

/** 水平线段是否撞到某个框 */
const hitBox = (x1: number, y1: number, x2: number, y2: number, boxes: Box[]): boolean =>
  boxes.some((b) => segInBox([x1, y1], [x2, y2], b));

/** 两端都在哪个边界里(取最小的那个)—— 绕行时别跑出这个框 */
function enclosingBoundary(a: Box, b: Box, bounds: Box[]): Box | undefined {
  let best: Box | undefined;
  for (const bb of bounds) {
    const holds = (o: Box): boolean =>
      o.x >= bb.x - 1 && o.y >= bb.y - 1 && o.x + o.w <= bb.x + bb.w + 1 && o.y + o.h <= bb.y + bb.h + 1;
    if (!holds(a) || !holds(b)) continue;
    if (!best || bb.w * bb.h < best.w * best.h) best = bb;
  }
  return best;
}

/* ---------------------------------------------------------------- 选面 */

/** 一条边的出口面/入口面 */
interface Faces { exit: Side; entry: Side }

/**
 * 首选的面:横向优先(跟 archmap 一致),再决定出/入口在哪一侧。
 *
 * 比的是两个框**之间留出多远**,不是中心差多少 ——
 * 宽框(比如一整列宽的标题块)中心离得远,照中心算会把线甩到侧面绕一大圈,
 * 明明上下就隔一条线。
 */
function primaryFaces(a: Box, b: Box): Faces {
  const stacked = (b.x <= cx(a) && cx(a) <= b.x + b.w) || (a.x <= cx(b) && cx(b) <= a.x + a.w);
  const { gx, gy } = gapBetween(a, b);
  const horiz = !stacked && gx >= gy;
  const toRight = cx(b) >= cx(a);
  const down = cy(b) >= cy(a);
  return {
    exit: horiz ? (toRight ? 'right' : 'left') : down ? 'bottom' : 'top',
    entry: horiz ? (toRight ? 'left' : 'right') : down ? 'top' : 'bottom',
  };
}

/**
 * 备选的面:这张脸指着对面有多近。
 * 面中点离对面的框越近越合适 —— 面朝着哪边,中点自然就近哪边。
 */
function altFaces(self: Box, other: Box, primary: Side): Side[] {
  const sides: Side[] = ['left', 'right', 'top', 'bottom'];
  const mid = (s: Side): [number, number] =>
    s === 'left' ? [self.x, cy(self)]
      : s === 'right' ? [self.x + self.w, cy(self)]
        : s === 'top' ? [cx(self), self.y]
          : [cx(self), self.y + self.h];
  return sides
    .filter((s) => s !== primary)
    .sort((a, b) => distToBox(mid(a), other) - distToBox(mid(b), other));
}

/* ---------------------------------------------------------------- 端口分配 */

interface Member {
  /** 边下标 */
  i: number;
  /** 出口(true)/入口(false) */
  out: boolean;
  /** 节点 id */
  node: string;
  /** 哪张脸 */
  side: Side;
}

/**
 * 这条边能不能「直着走」—— 两端面对面、坐标对齐、中间没别的盒子挡着。
 *
 * 这是「谁走正中」的判据:一条线正下方就是它的目标(中间空着)时,
 * 它该走正中,那条线就是一根直线;要是中间隔着东西,那条线本来就得绕,
 * 让它靠边 —— 不然它会把本来笔直的那条线顶歪(读者看到的是「没必要的一折」)。
 */
function straightShot(
  i: number, edges: ArchEdge[], faces: Faces[],
  boxes: Map<string, Box>, portBox: (id: string) => Box,
): boolean {
  const e = edges[i];
  const s0 = faces[i].exit;
  const s4 = faces[i].entry;
  const vertical = s0 === 'bottom' || s0 === 'top';
  if (vertical) {
    if (!((s0 === 'bottom' && s4 === 'top') || (s0 === 'top' && s4 === 'bottom'))) return false;
  } else if (!((s0 === 'left' && s4 === 'right') || (s0 === 'right' && s4 === 'left'))) {
    return false;
  }
  const a = portBox(e.from);
  const b = portBox(e.to);
  const p0 = portAt(a, s0, 0);
  const p1 = portAt(b, s4, 0);
  if (vertical ? Math.abs(p0[0] - p1[0]) > 0.5 : Math.abs(p0[1] - p1[1]) > 0.5) return false;
  for (const [id, box] of boxes) {
    if (id === e.from || id === e.to) continue;
    if (segInBox(p0, p1, box)) return false;
  }
  return true;
}

/** 一张脸最多放得下几个端口(相邻 ≥ PORT_GAP,两端各留 FACE_MARGIN) */
function faceCapacity(box: Box, side: Side): number {
  const len = faceLen(box, side);
  return Math.max(1, Math.floor((len - 2 * FACE_MARGIN) / PORT_GAP));
}

/**
 * 端口怎么排 —— 一个整体的做法,不是补丁:
 *
 * 1. 先按首选面分桶(进出的线进同一个桶 —— 落同一个点会看着像一根线穿过节点)
 * 2. 装不下的往外挪:挪到那张脸离对面最近、且还有空位的备选面
 * 3. 排位置:走正中的那条(能直着走的)占正中,其余分到两边;
 *    相邻的间距 ≥ PORT_GAP(箭头 7px,挤了就叠)
 */
function allocatePorts(
  edges: ArchEdge[], faces: Faces[], alts: { exit: Side[]; entry: Side[] }[],
  boxes: Map<string, Box>, portBox: (id: string) => Box,
): { exitOff: number[]; entryOff: number[] } {
  const exitOff: number[] = new Array(edges.length).fill(0);
  const entryOff: number[] = new Array(edges.length).fill(0);
  const buckets = new Map<string, Member[]>();
  const key = (node: string, side: Side): string => `${node}|${side}`;
  const put = (node: string, side: Side, m: Member): void => {
    const k = key(node, side);
    buckets.set(k, [...(buckets.get(k) ?? []), m]);
  };
  edges.forEach((e, i) => {
    put(e.from, faces[i].exit, { i, out: true, node: e.from, side: faces[i].exit });
    put(e.to, faces[i].entry, { i, out: false, node: e.to, side: faces[i].entry });
  });

  // 2. 装不下的往外挪
  const move = (m: Member, to: Side): void => {
    const from = key(m.node, m.side);
    buckets.set(from, (buckets.get(from) ?? []).filter((x) => x !== m));
    if (buckets.get(from)?.length === 0) buckets.delete(from);
    m.side = to;
    // 这条边真正走哪张脸也改了 —— 端口位置是按脸算的,脸变了位置也得跟着变
    if (m.out) faces[m.i].exit = to;
    else faces[m.i].entry = to;
    put(m.node, to, m);
  };
  for (let round = 0; round < 8; round++) {
    let moved = false;
    for (const [k, members] of [...buckets]) {
      const nodeId = k.slice(0, k.lastIndexOf('|'));
      const box = portBox(nodeId);
      const cap = faceCapacity(box, members[0].side);
      if (members.length <= cap) continue;
      // 先挪「走不正中」的那条 —— 走正中那条是直的,动它最难看
      const order = [...members].sort((a, b) => rank(a) - rank(b));
      for (const m of order) {
        if (buckets.get(k)!.length <= cap) break;
        const cands = m.out ? alts[m.i].exit : alts[m.i].entry;
        const to = cands.find((s) => {
          const cap2 = faceCapacity(portBox(m.node), s);
          return (buckets.get(key(m.node, s))?.length ?? 0) < cap2;
        });
        if (!to) continue;
        move(m, to);
        moved = true;
      }
    }
    if (!moved) break;
  }

  // 3. 排位置
  for (const members of buckets.values()) {
    const box = portBox(members[0].node);
    const side = members[0].side;
    const len = faceLen(box, side);
    const avail = len - 2 * FACE_MARGIN;
    const n = members.length;
    // 间距:均分整张脸,但不许小于 PORT_GAP(箭头挤在一起就叠了)
    let gap = n > 1 ? avail / (n + 1) : 0;
    if (n > 1) gap = Math.max(gap, PORT_GAP);
    // 放不下就压到最小间距(宁可挤一点也不许叠箭头)
    if (n > 1 && (n - 1) * gap > avail) gap = Math.max(ARROW + 1, avail / (n - 1));
    // 走正中那条:能直着走的优先占正中(进出的线都算 —— 直着来的那条也该是直的)
    const centre = members.findIndex((m) => straightShot(m.i, edges, faces, boxes, portBox));
    const idx = centre >= 0 ? centre : -1;
    members.forEach((m, slot) => {
      let off: number;
      if (idx < 0) off = (slot - (n - 1) / 2) * gap;
      else if (slot < idx) off = -(idx - slot) * gap;
      else if (slot === idx) off = 0;
      else off = (slot - idx) * gap;
      if (m.out) exitOff[m.i] = off;
      else entryOff[m.i] = off;
    });
  }
  return { exitOff, entryOff };
}

/** rank:越靠前越不该被挪走(走正中的、对齐的先留) */
function rank(m: Member): number {
  return m.out ? 0 : 1;
}

/* ---------------------------------------------------------------- 正交布线 */

/** 已经画好的线段:谁画的 + 在哪 */
interface Drawn { seg: [number, number, number, number]; edge: number }

/**
 * 正交布线:Hanan 网格 + Dijkstra(长度 + 拐弯惩罚 + 交叉惩罚)。
 *
 * 1. **Hanan 网格** —— 候选坐标只有两拨:每个障碍框的左右边、上下边。
 *    路径的每一段只可能落在这些坐标上(正交路径的最优解一定如此)
 * 2. **Dijkstra** —— 在网格上找一条总代价最低的路。代价 = 长度 + **拐弯惩罚**
 *    (拐一次弯贵一点,所以路会尽量直)+ 交叉/挨上的惩罚
 * 3. 框都往外胀一点(MARGIN),路就不会贴着框走
 *
 * @param p0 起点端口 @param side0 起点在哪一侧
 * @param p4 终点端口 @param side4 终点在哪一侧
 * @param boxes 障碍(全部节点的框)
 * @param drawn 已经画好的线段(压上去要加钱;hard 模式下压线直接不许)
 * @param outer 图的外框 —— 绕远的那条边要能从图的外面绕过去
 * @param hard true = 压线直接封死(规矩 R1);false = 压线只加钱(宁可交叉也不能没有线)
 */
function routeOrthogonal(
  p0: [number, number], side0: Side,
  p4: [number, number], side4: Side,
  boxes: Box[],
  drawn: Drawn[],
  outer: Box,
  hard: boolean,
  maxLen: number,
): [number, number][] | null {
  // 障碍:往外胀一点,路就不会贴着框
  const obs: Box[] = boxes.map((b) => ({
    x: b.x - ROUTE_MARGIN, y: b.y - ROUTE_MARGIN,
    w: b.w + ROUTE_MARGIN * 2, h: b.h + ROUTE_MARGIN * 2,
  }));
  // 端口往外伸一小段(起点和终点)
  const d0 = OUT_DIR[side0];
  const d4 = OUT_DIR[side4];
  const s: [number, number] = [p0[0] + d0[0] * ROUTE_MARGIN, p0[1] + d0[1] * ROUTE_MARGIN];
  const t: [number, number] = [p4[0] + d4[0] * ROUTE_MARGIN, p4[1] + d4[1] * ROUTE_MARGIN];

  // Hanan 网格:候选坐标 = 障碍的边 + 两端
  const xsSet = new Set<number>([s[0], t[0]]);
  const ysSet = new Set<number>([s[1], t[1]]);
  for (const b of obs) {
    xsSet.add(b.x); xsSet.add(b.x + b.w);
    ysSet.add(b.y); ysSet.add(b.y + b.h);
  }
  // 图的外框也算候选 —— 绕远的那条边要能从图的外面绕过去
  xsSet.add(outer.x); xsSet.add(outer.x + outer.w);
  ysSet.add(outer.y); ysSet.add(outer.y + outer.h);
  // 已经走过的通道旁边留一条并行的位置(地铁图那样:两条线分开一点,不压在一起)——
  // 不然后来的线只能绕一大圈,而那条圈往往比「并排走」难看得多。
  // 只给「离这条路不远」的通道加 —— 网格是每个方向 × 每个点都走一遍,候选太多会慢。
  for (const dseg of drawn) {
    const [x1, y1, x2, y2] = dseg.seg;
    const near = Math.min(
      Math.abs(x1 - s[0]) + Math.abs(y1 - s[1]),
      Math.abs(x2 - t[0]) + Math.abs(y2 - t[1]),
    );
    if (near > 240) continue;
    if (y1 === y2) { ysSet.add(y1 - PARALLEL); ysSet.add(y1 + PARALLEL); }
    else { xsSet.add(x1 - PARALLEL); xsSet.add(x1 + PARALLEL); }
  }
  const xs = [...xsSet].sort((a, b) => a - b);
  const ys = [...ysSet].sort((a, b) => a - b);
  const xi = (x: number): number => xs.indexOf(x);
  const yi = (y: number): number => ys.indexOf(y);
  const si = xi(s[0]);
  const sj = yi(s[1]);
  const ti = xi(t[0]);
  const tj = yi(t[1]);
  if (si < 0 || sj < 0 || ti < 0 || tj < 0) return null;

  const blocked = (i: number, j: number): boolean => {
    const x = xs[i];
    const y = ys[j];
    return obs.some((b) => x > b.x && x < b.x + b.w && y > b.y && y < b.y + b.h);
  };

  // Dijkstra(状态 = 网格点 × 方向,方向用来算拐弯惩罚)
  const W = xs.length;
  const H = ys.length;
  if (process.env.DBG_GRID) console.error('DBG grid', W, 'x', H, 'drawn', drawn.length);
  const DIRS: [number, number][] = [[1, 0], [-1, 0], [0, 1], [0, -1]];
  const cost = new Float64Array(W * H * 4).fill(Infinity);
  const len = new Float64Array(W * H * 4).fill(Infinity);
  const prev = new Int32Array(W * H * 4).fill(-1);
  const startIdx = (i: number, j: number, d: number): number => ((j * W + i) * 4 + d);
  const gx = (i: number): number => xs[i];
  const gy = (j: number): number => ys[j];

  // 优先队列:二叉堆(线性扫一遍找最小是 O(V²) —— 状态数本身是 O(n²),那样就成 O(n⁴) 了)
  const heap: number[] = [];
  const heapPush = (v: number): void => {
    heap.push(v);
    let i = heap.length - 1;
    while (i > 0) {
      const p = (i - 1) >> 1;
      if (cost[heap[p]] <= cost[heap[i]]) break;
      [heap[p], heap[i]] = [heap[i], heap[p]];
      i = p;
    }
  };
  const heapPop = (): number | undefined => {
    if (!heap.length) return undefined;
    const top = heap[0];
    const last = heap.pop()!;
    if (heap.length) {
      heap[0] = last;
      let i = 0;
      for (;;) {
        const l = i * 2 + 1;
        const r = l + 1;
        let m = i;
        if (l < heap.length && cost[heap[l]] < cost[heap[m]]) m = l;
        if (r < heap.length && cost[heap[r]] < cost[heap[m]]) m = r;
        if (m === i) break;
        [heap[m], heap[i]] = [heap[i], heap[m]];
        i = m;
      }
    }
    return top;
  };
  const closed = new Set<number>();
  for (let d = 0; d < 4; d++) {
    const idx = startIdx(si, sj, d);
    cost[idx] = 0;
    len[idx] = 0;
    heapPush(idx);
  }
  const goal = (i: number, j: number): boolean => i === ti && j === tj;

  let guard = 0;
  while (heap.length && guard++ < W * H * 8) {
    // 用 Dijkstra 而不是 A*:拐弯惩罚让「曼哈顿距离」这个启发式不再一致,
    // A* 会提前把终点弹出来、给出次优的路线 —— 这里要的就是最优路线。
    const idx = heapPop()!;
    if (closed.has(idx)) continue;
    closed.add(idx);
    const d = idx % 4;
    const cell = (idx - d) / 4;
    const j = Math.floor(cell / W);
    const i = cell % W;
    if (goal(i, j)) {
      // 回溯
      const path: [number, number][] = [];
      let cur = idx;
      while (cur >= 0) {
        const dd = cur % 4;
        const cc = (cur - dd) / 4;
        const jj = Math.floor(cc / W);
        const ii = cc % W;
        path.push([gx(ii), gy(jj)]);
        cur = prev[cur];
      }
      path.reverse();
      // 去掉重复点
      const clean: [number, number][] = [];
      for (const p of path) {
        const last = clean[clean.length - 1];
        if (!last || last[0] !== p[0] || last[1] !== p[1]) clean.push(p);
      }
      return [[p0[0], p0[1]], ...clean, [p4[0], p4[1]]];
    }
    const [dx, dy] = DIRS[d];
    const ni = i + dx;
    const nj = j + dy;
    if (ni < 0 || nj < 0 || ni >= W || nj >= H) continue;
    if (blocked(ni, nj)) continue;
    // 这一段会不会从别的框里穿过去(网格点不在线段中间)
    const a: [number, number] = [gx(i), gy(j)];
    const b: [number, number] = [gx(ni), gy(nj)];
    if (obs.some((box) => segInBox(a, b, box))) continue;
    // 压到别的线:硬模式下直接不许(规矩 R1:两条边不许走同一段)
    // 交叉、挨上:加钱 —— 挨上比交叉更贵(接成一根线最难读)
    let extra = 0;
    let forbidden = false;
    for (const dseg of drawn) {
      const c: [number, number] = [dseg.seg[0], dseg.seg[1]];
      const e: [number, number] = [dseg.seg[2], dseg.seg[3]];
      // 包围盒都不沾边 → 交叉、挨上、压线都不可能(先粗后细:粗筛最省)
      if (Math.max(a[0], b[0]) < Math.min(c[0], e[0]) || Math.max(c[0], e[0]) < Math.min(a[0], b[0]) ||
          Math.max(a[1], b[1]) < Math.min(c[1], e[1]) || Math.max(c[1], e[1]) < Math.min(a[1], b[1])) continue;
      if (segsOverlap(a, b, c, e)) {
        if (hard) { forbidden = true; break; }
        extra += ROUTE_CROSS;
        continue;
      }
      if (segsCross(a, b, c, e)) { extra += ROUTE_CROSS; continue; }
      if (segsMeet(a, b, c, e)) { extra += ROUTE_TOUCH; continue; }
      // 挤在同一条通道里:加钱(空着的通道更清楚)
      if (a[0] === b[0] && c[0] === e[0] && Math.abs(a[0] - c[0]) <= CHANNEL) extra += CHANNEL_COST;
      else if (a[1] === b[1] && c[1] === e[1] && Math.abs(a[1] - c[1]) <= CHANNEL) extra += CHANNEL_COST;
    }
    if (forbidden) continue;
    const step = Math.abs(b[0] - a[0]) + Math.abs(b[1] - a[1]);
    const newLen = len[idx] + step;
    // 绕远上限:太远的路直接不算(R5)—— 宁可绕不出去,也不要兜一大圈
    if (newLen > maxLen) continue;
    for (let nd = 0; nd < 4; nd++) {
      const nIdx = startIdx(ni, nj, nd);
      const bend = nd === d ? 0 : ROUTE_BEND;
      const nc = cost[idx] + step + bend + extra;
      if (nc < cost[nIdx]) {
        const wasNew = cost[nIdx] === Infinity;
        cost[nIdx] = nc;
        len[nIdx] = newLen;
        prev[nIdx] = idx;
        if (wasNew) heapPush(nIdx);
      }
    }
  }
  return null;
}

/* ---------------------------------------------------------------- 内核 */

/**
 * 布线内核(公开仓这版:基础但合法)。
 *
 * 顺序:选面 → 排端口 → 一条一条走 → 收尾核对。
 * 每条边的路都自己走,不跟别的边共用一段(R1)。
 */
export function routeEdges(ctx: RoutingCtx): [number, number][][] {
  const { edges, boxes, portBox } = ctx;
  if (!edges.length) return [];
  const byId = new Map(ctx.nodes.map((n) => [n.id, n]));

  // 1. 选面
  const faces: Faces[] = edges.map((e) => {
    const a = portBox(e.from);
    const b = portBox(e.to);
    return primaryFaces(a, b);
  });
  const alts = edges.map((e, i) => {
    const a = portBox(e.from);
    const b = portBox(e.to);
    return { exit: altFaces(a, b, faces[i].exit), entry: altFaces(b, a, faces[i].entry) };
  });

  // 2. 排端口
  const { exitOff, entryOff } = allocatePorts(edges, faces, alts, boxes, portBox);

  // 3. 一条一条走
  const allBoxes = [...boxes.values()];
  const outer: Box = allBoxes.length
    ? {
      x: Math.min(...allBoxes.map((b) => b.x)) - 40,
      y: Math.min(...allBoxes.map((b) => b.y)) - 40,
      w: Math.max(...allBoxes.map((b) => b.x + b.w)) + 80 - (Math.min(...allBoxes.map((b) => b.x)) - 40),
      h: Math.max(...allBoxes.map((b) => b.y + b.h)) + 80 - (Math.min(...allBoxes.map((b) => b.y)) - 40),
    }
    : { x: 0, y: 0, w: 0, h: 0 };
  const drawn: Drawn[] = [];
  const out: [number, number][][] = [];

  edges.forEach((e, i) => {
    const a = portBox(e.from);
    const b = portBox(e.to);
    const exit = faces[i].exit;
    const entry = faces[i].entry;
    const p0 = portAt(a, exit, exitOff[i]);
    const p4 = portAt(b, entry, entryOff[i]);
    const straight = Math.abs(p4[0] - p0[0]) + Math.abs(p4[1] - p0[1]);
    const maxLen = Math.max(straight * MAX_DETOUR, straight + 120);
    let pts = routeOrthogonal(p0, exit, p4, entry, allBoxes, drawn, outer, true, maxLen);
    if (!pts) pts = routeOrthogonal(p0, exit, p4, entry, allBoxes, drawn, outer, false, maxLen);
    if (!pts) pts = directRoute(p0, exit, p4, entry, a, b, allBoxes, ctx.bounds);
    for (let j = 1; j < pts.length; j++) {
      drawn.push({ seg: [pts[j - 1][0], pts[j - 1][1], pts[j][0], pts[j][1]], edge: i });
    }
    out.push(pts);
  });

  return out;
}

/** 走不通时的兜底:先直连,直连撞到盒子就绕到空通道 */
function directRoute(
  p0: [number, number], exit: Side,
  p4: [number, number], entry: Side,
  a: Box, b: Box, boxes: Box[], bounds: Box[],
): [number, number][] {
  const p1: [number, number] = [p0[0] + OUT_DIR[exit][0] * STUB, p0[1] + OUT_DIR[exit][1] * STUB];
  const p3: [number, number] = [p4[0] + OUT_DIR[entry][0] * STUB, p4[1] + OUT_DIR[entry][1] * STUB];
  const others = boxes.filter((x) => x !== a && x !== b);
  if (exit === 'left' || exit === 'right') {
    if (hitBox(Math.min(p1[0], p3[0]), p1[1], Math.max(p1[0], p3[0]), p1[1], others)) {
      const dy = detourY(a, b, p1[0], p3[0], others, enclosingBoundary(a, b, bounds));
      return [p0, p1, [p1[0], dy], [p3[0], dy], p3, p4];
    }
    const vx = p3[0];
    if (!hitBox(vx, Math.min(p1[1], p3[1]), vx, Math.max(p1[1], p3[1]), others)) {
      return [p0, p1, [vx, p1[1]], [vx, p3[1]], p3, p4];
    }
    const ch = freeChannelX(p1[0], p3[0], p1[1], p3[1], others, p3[0]);
    const cx2 = ch ?? (p1[0] + p3[0]) / 2;
    return [p0, p1, [cx2, p1[1]], [cx2, p3[1]], p3, p4];
  }
  const mid = (p1[1] + p3[1]) / 2;
  return [p0, p1, [p1[0], mid], [p3[0], mid], p3, p4];
}

/**
 * 绕行通道:横向的线撞到挡路的盒子就换一条空通道走。
 * `inside` = 两端共同所属的边界(有的话)—— 通道优先待在框里,
 * 否则那条线看起来像是从「区域」里跑出去了。
 */
function detourY(a: Box, b: Box, x1: number, x2: number, boxes: Box[], inside?: Box): number {
  const lo = Math.min(x1, x2);
  const hi = Math.max(x1, x2);
  const below = Math.max(a.y + a.h, b.y + b.h);
  const above = Math.min(a.y, b.y);
  const cands = [below + 20, below + 52, above - 20, above - 52];
  const free = (y: number): boolean => !hitBox(lo, y, hi, y, boxes);
  const fits = (y: number): boolean => !inside || (y > inside.y + 4 && y < inside.y + inside.h - 4);
  for (const y of cands) if (fits(y) && free(y)) return y;
  for (const y of cands) if (free(y)) return y;
  return cands[0];
}

/** 竖着的那一段被挡住了 → 在两端之间找一条空通道(从目标那侧往外扫) */
function freeChannelX(
  fromX: number, toX: number, y1: number, y2: number, boxes: Box[], targetX: number,
): number | null {
  const lo = Math.min(fromX, toX);
  const hi = Math.max(fromX, toX);
  const yTop = Math.min(y1, y2);
  const yBot = Math.max(y1, y2);
  const order: number[] = [];
  if (targetX <= (lo + hi) / 2) {
    for (let x = targetX; x <= hi; x += 2) order.push(x);
  } else {
    for (let x = targetX; x >= lo; x -= 2) order.push(x);
  }
  for (const x of order) {
    if (hitBox(x, yTop, x, yBot, boxes)) continue;                                  // 竖着的那段
    if (hitBox(Math.min(fromX, x), y1, Math.max(fromX, x), y1, boxes)) continue;   // 源那侧的横段
    if (hitBox(Math.min(toX, x), y2, Math.max(toX, x), y2, boxes)) continue;       // 目标那侧的横段
    return x;
  }
  return null;
}
