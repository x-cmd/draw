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

/**
 * 布线的「口味」:同样的算法,不同的代价权重。
 *
 * 有些地方是口味问题不是对错问题:交叉一次 vs 绕远一圈,哪个更难看,看图的人说了算。
 * 所以权重交给调用方 —— 算法只有一种(这里是 Hanan 网格 + Dijkstra),
 * 换权重不换算法。
 */
export interface RoutingWeights {
  /** 交叉一次别的线的代价(像素当量) */
  cross?: number;
  /** 挨上(接在同一个点上)的代价 */
  touch?: number;
  /** 挤在别人已经走过的通道里的代价 */
  channel?: number;
  /** 拐一次弯的代价 */
  bend?: number;
  /** 绕远上限(路长 ≤ 直线距离 × 这个倍数) */
  detour?: number;
}

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
  /** 口味:代价权重(不给就用默认值) */
  weights?: RoutingWeights;
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
/**
 * 交叉一次别的线的代价。
 *
 * 交叉是「局部毛病」,绕远是「整张图变形」—— 后者更难看。所以交叉的价不能太高:
 * 贵到一定程度,路由宁可在画布外围兜一大圈(15 倍!)也不肯交叉一次。
 * 绕远有上限(MAX_DETOUR)兜着,交叉的价就压低一点。
 */
const ROUTE_CROSS = 500;
/** 挨上(接在同一个点上)的代价 —— 接成一根线最难读,比交叉贵一点 */
const ROUTE_TOUCH = 1000;
/** 绕远上限:路长 ≤ 直线距离 × 这个倍数 */
const MAX_DETOUR = 3;
/** 端口往外伸的那一小段(引线的长度) */
const STUB = 16;
/** 并行走的线离原来那条多远(地铁图那样:两条线分开一点) */
const PARALLEL = 7;
/** 多近算「同一条通道」(差这么几像素就是并排走,挤在一处) */
const CHANNEL = 12;
/**
 * 挤在别人已经走过的通道里的代价 —— 空着的通道更清楚,别都堆在一处。
 * 别设太高:太贵了,路由宁可绕一大圈也不肯并排走 —— 那更难看。
 */
const CHANNEL_COST = 120;

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
export interface Drawn { seg: [number, number, number, number]; edge: number }

/**
 * 一条线的折点 → 几段**直线**。
 *
 * 网格上的折点常常落在同一条直线上(比如一条竖线被切成四段)。
 * 不压成一段的话,别的线横着穿过去的时候,正好撞在某个折点上 ——
 * 判起来不是「交叉」而是「挨上」(贵十倍),路由器就宁可绕一大圈。
 * 压成一段之后,穿过去就是老老实实的交叉 ✓
 */
function straightSegs(pts: [number, number][]): [number, number, number, number][] {
  const out: [number, number, number, number][] = [];
  for (let j = 1; j < pts.length; j++) {
    const a = pts[j - 1];
    const b = pts[j];
    const last = out[out.length - 1];
    if (last && (last[0] === last[2]) === (a[0] === b[0])) {
      last[2] = b[0];
      last[3] = b[1];
      continue;
    }
    out.push([a[0], a[1], b[0], b[1]]);
  }
  return out;
}

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
export function routeOrthogonal(
  p0: [number, number], side0: Side,
  p4: [number, number], side4: Side,
  boxes: Box[],
  drawn: Drawn[],
  outer: Box,
  hard: boolean,
  maxLen: number,
  w: RoutingWeights = {},
): [number, number][] | null {
  const CROSS = w.cross ?? ROUTE_CROSS;
  const TOUCH = w.touch ?? ROUTE_TOUCH;
  const BEND = w.bend ?? ROUTE_BEND;
  const CHANNEL_C = w.channel ?? CHANNEL_COST;
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
    if (near > 700) continue;
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
        extra += CROSS;
        continue;
      }
      if (segsCross(a, b, c, e)) { extra += CROSS; continue; }
      if (segsMeet(a, b, c, e)) { extra += TOUCH; continue; }
      // 挤在同一条通道里:加钱(空着的通道更清楚)
      if (a[0] === b[0] && c[0] === e[0] && Math.abs(a[0] - c[0]) <= CHANNEL) extra += CHANNEL_C;
      else if (a[1] === b[1] && c[1] === e[1] && Math.abs(a[1] - c[1]) <= CHANNEL) extra += CHANNEL_C;
    }
    if (forbidden) continue;
    const step = Math.abs(b[0] - a[0]) + Math.abs(b[1] - a[1]);
    const newLen = len[idx] + step;
    // 绕远上限:太远的路直接不算(R5)—— 宁可绕不出去,也不要兜一大圈
    if (newLen > maxLen) continue;
    for (let nd = 0; nd < 4; nd++) {
      const nIdx = startIdx(ni, nj, nd);
      const bend = nd === d ? 0 : BEND;
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
  const w = ctx.weights ?? {};
  const DETOUR = w.detour ?? MAX_DETOUR;
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

  /**
   * 一条边走的时候,自己的源/目标节点**不算障碍** —— 但只在端口框跟节点框不一样时。
   *
   * 大图标模式:端口框是图标,图标在格子中间 —— 线得从源节点里出来、钻进目标节点,
   * 不把那一格让开就永远出不去,只能退回到那条不看障碍的直路(#29)。
   *
   * 端口框 == 节点框时(普通方框节点),节点照旧是障碍 —— 端口就在框边上,不用让。
   * 图标本身**还是障碍**:线不许从图标中间穿过去。
   */
  const obstaclesFor = (e: ArchEdge): Box[] => {
    const same = (a: Box, b: Box): boolean =>
      a.x === b.x && a.y === b.y && a.w === b.w && a.h === b.h;
    const out: Box[] = [];
    for (const [id, b] of boxes) {
      if ((id === e.from || id === e.to) && !same(portBox(id), b)) continue;
      out.push(b);
    }
    const pa = portBox(e.from);
    const pb = portBox(e.to);
    if (!same(pa, boxes.get(e.from)!)) out.push(pa);
    if (!same(pb, boxes.get(e.to)!)) out.push(pb);
    return out;
  };

  const outer: Box = allBoxes.length
    ? {
      x: Math.min(...allBoxes.map((b) => b.x)) - 40,
      y: Math.min(...allBoxes.map((b) => b.y)) - 40,
      w: Math.max(...allBoxes.map((b) => b.x + b.w)) + 80 - (Math.min(...allBoxes.map((b) => b.x)) - 40),
      h: Math.max(...allBoxes.map((b) => b.y + b.h)) + 80 - (Math.min(...allBoxes.map((b) => b.y)) - 40),
    }
    : { x: 0, y: 0, w: 0, h: 0 };
  const drawn: Drawn[] = [];
  const out: [number, number][][] = edges.map(() => []);

  // 谁先走:越没得选的越先走。
  //
  // 「直着走得了」的边(两头对齐、中间没挡)只有一条路可走 —— 先给它,
  // 后面的边就绕开它的通道。反过来先走的会占掉好位置,把直的那条挤歪。
  const order = edges.map((e, i) => {
    const a = portBox(e.from);
    const b = portBox(e.to);
    const p0 = portAt(a, faces[i].exit, exitOff[i]);
    const p1 = portAt(b, faces[i].entry, entryOff[i]);
    const straight = (faces[i].exit === 'left' || faces[i].exit === 'right')
      ? Math.abs(p0[1] - p1[1]) < 0.5
      : Math.abs(p0[0] - p1[0]) < 0.5;
    const len = Math.abs(p1[0] - p0[0]) + Math.abs(p1[1] - p0[1]);
    return { i, straight: straight ? 0 : 1, len };
  }).sort((x, y) => (x.straight - y.straight) || (x.len - y.len)).map((s) => s.i);

  // 枚举的预算:换脸是「走一遍看结果」,一次搜索不便宜 —— 一张图最多试这么多次。
  // (稠密图上枚举到 16 种组合 × 几十条边,渲染会变成几十秒。)
  let budget = 16;
  // 一条边最多试这么多次 —— 别让一条边把预算吃光,后面的边就没人管了
  const EDGE_TRIES = 6;

  // 已经占掉的端口(按 节点|脸)—— 换脸之后要重算,不然两个端口会落同一点
  const usedNow = (): Map<string, number[]> => {
    const m = new Map<string, number[]>();
    const add = (node: string, side: Side, off: number): void => {
      const k = `${node}|${side}`;
      m.set(k, [...(m.get(k) ?? []), off]);
    };
    // 全部的边都算上(还没走的那几条,占着它们分到的端口)
    ctx.edges.forEach((e, j) => {
      add(e.from, faces[j].exit, exitOff[j]);
      add(e.to, faces[j].entry, entryOff[j]);
    });
    return m;
  };

  // 走一遍:一条一条来,后来的躲着先来的
  for (const i of order) {
    const e = edges[i];
    const a = portBox(e.from);
    const b = portBox(e.to);
    const exit = faces[i].exit;
    const entry = faces[i].entry;
    const p0 = portAt(a, exit, exitOff[i]);
    const p4 = portAt(b, entry, entryOff[i]);
    const straight = Math.abs(p4[0] - p0[0]) + Math.abs(p4[1] - p0[1]);
    const maxLen = Math.max(straight * DETOUR, straight + 120);
    const obs = obstaclesFor(e);
    let pts = routeOrthogonal(p0, exit, p4, entry, obs, drawn, outer, true, maxLen, w);
    if (!pts) pts = routeOrthogonal(p0, exit, p4, entry, obs, drawn, outer, false, maxLen, w);
    if (!pts) pts = directRoute(p0, exit, p4, entry, a, b, obs, ctx.bounds);
    for (const seg of straightSegs(pts)) drawn.push({ seg, edge: i });
    out[i] = pts;
  }

  // ── 修一遍:出口面/入口面挑错了的,换一张脸重走一遍。
  //
  // 症状:绕太远(直线 590px 走了 1475px,绕着画布外圈走)或者跟别的线交叉。
  // 原因:脸是按几何挑的,没看「从这张脸出去走不走得通」。
  // 做法:逐条边换几张「朝得开」的脸各走一遍,挑更好的。
  //
  // **看的是全局**:贪心地一条一条换,会把后面的线挤到别处,总交叉数反而涨。
  // 所以只有当「整张图的交叉数确实少了」才换 —— 不可能越改越差。
  // 修的顺序:绕得最远、交叉最多的先修 —— 预算有限,先救最病的
  const repairOrder = [...order].sort((x, y) => {
    const bad = (i: number): number => detourOf(out[i]) + crossingsOf(out[i], drawn.filter((d) => d.edge !== i));
    return bad(y) - bad(x);
  });
  // 代价:长度 + 交叉 + 凸起。
  // **改一条线,只有跟它有关的交叉会变** —— 所以「这条线的代价变化」就是全局的变化,
  // 不用每次把整张图重算一遍(那样太贵了)。
  const CROSS = w.cross ?? ROUTE_CROSS;
  for (let pass = 0; pass < 2 && budget > 0; pass++) {
    let improved = false;
    for (const i of repairOrder) {
      const e = edges[i];
      const a = portBox(e.from);
      const b = portBox(e.to);
      const others = drawn.filter((d) => d.edge !== i);
      const curCross = crossingsOf(out[i], others);
      const curLen = lenOf(out[i]);
      // 该修的:绕太远(脸挑错了)、有交叉、或者路线里有个小凸起(并排位置的副作用)
      if (curCross === 0 && detourOf(out[i]) <= 1.75 && !hasJog(out[i])) continue;
      const used = usedNow();
      const curScore = curCross * CROSS + curLen + (hasJog(out[i]) ? 300 : 0);
      if (process.env.DBG) console.error('repair edge', i, 'cross', curCross, 'jog', hasJog(out[i]), 'curScore', Math.round(curScore), 'budget', budget);
      let best: { pts: [number, number][]; ex: Side; en: Side; q0: [number, number]; q4: [number, number]; score: number } | null = null;
      // 候选:(出口面, 端口位置, 入口面, 端口位置)
      // **端口位置也一起试** —— 同一张脸上往往还空着(tenants 的右面高 153px,
      // 只用了两个端口)。挪一下端口,线就不用先进别人占着的通道再让开(那个 7px 的凸起)。
      const outs: [Side, number | null][] = [];
      for (const ex of [faces[i].exit, ...alts[i].exit]) {
        const slots = ex === faces[i].exit
          ? [exitOff[i], ...freeSlots(used.get(`${e.from}|${ex}`) ?? [], faceLen(a, ex), exitOff[i])]
          : freeSlots(used.get(`${e.from}|${ex}`) ?? [], faceLen(a, ex), null);
        for (const o0 of slots) outs.push([ex, o0]);
      }
      const ins: [Side, number | null][] = [];
      for (const en of [faces[i].entry, ...alts[i].entry]) {
        const slots = en === faces[i].entry
          ? [entryOff[i], ...freeSlots(used.get(`${e.to}|${en}`) ?? [], faceLen(b, en), entryOff[i])]
          : freeSlots(used.get(`${e.to}|${en}`) ?? [], faceLen(b, en), null);
        for (const o4 of slots) ins.push([en, o4]);
      }
      // 候选的顺序:**挪端口和换脸交替着来**。
      //
      // 只挪端口:治得了「端口正好撞上别人的通道」这种小毛病。
      // 只换脸:治得了「这条线从这张脸出去就得出事」这种结构性的毛病。
      // 两类轮流试 —— 预算有限,不能让一类把名额占满,另一类就没机会了。
      const ordered: [Side, number | null, Side, number | null][] = [];
      const curEx = faces[i].exit;
      const curEn = faces[i].entry;
      // 挪端口:同一张脸,位置挪一挪
      const portMoves = (): [Side, number | null, Side, number | null][] => {
        const r: [Side, number | null, Side, number | null][] = [];
        // 1. 出口挪一挪(最常见的修法:端口撞上了别人的通道)
        for (const [ex, o0] of outs) if (ex === curEx) r.push([ex, o0, curEn, entryOff[i]]);
        // 2. 入口挪一挪
        for (const [en, o4] of ins) if (en === curEn) r.push([curEx, exitOff[i], en, o4]);
        return r;
      };
      // 换脸:换个出口面(或入口面),端口位置也一起试
      const faceMoves = (): [Side, number | null, Side, number | null][] => {
        const r: [Side, number | null, Side, number | null][] = [];
        for (const [ex, o0] of outs) {
          if (ex === curEx) continue;
          for (const [en, o4] of ins) r.push([ex, o0, en, o4]);
        }
        return r;
      };
      const pm = portMoves();
      const fm = faceMoves();
      for (let k = 0; k < Math.max(pm.length, fm.length); k++) {
        if (k < pm.length) ordered.push(pm[k]);
        if (k < fm.length) ordered.push(fm[k]);
      }
      let done = false;
      // 每条边最多试这么多次 —— 一条边别把预算吃光,后面的边就没得修了
      let tries = 0;
      // 绕远的底线:候选不能比现在更绕(不然「治好了交叉、绕出一大圈」,更难看)
      const curDetour = detourOf(out[i]);
      const detourCap = Math.max(1.75, curDetour + 0.2);
      for (const [ex, o0, en, o4] of ordered) {
        {
          if (done || budget <= 0) break;
          if (tries >= EDGE_TRIES) break;
          if (ex === faces[i].exit && en === faces[i].entry &&
              o0 === exitOff[i] && o4 === entryOff[i]) continue;
          if (o0 === null || o4 === null) continue;   // 这张脸塞不下了,换别的
          const q0 = portAt(a, ex, o0);
          const q4 = portAt(b, en, o4);
          const s2 = Math.abs(q4[0] - q0[0]) + Math.abs(q4[1] - q0[1]);
          const cap = Math.max(s2 * DETOUR, s2 + 120);
          budget--;
          tries++;
          const obs = obstaclesFor(e);
          let cand = routeOrthogonal(q0, ex, q4, en, obs, others, outer, true, cap, w);
          if (!cand) cand = routeOrthogonal(q0, ex, q4, en, obs, others, outer, false, cap, w);
          if (!cand) continue;
          // 绕太远的候选不要 —— 治好了交叉却兜一大圈,更难看
          if (detourOf(cand) > detourCap) {
            if (process.env.DBG) console.error('   cand', ex, o0, en, o4, '绕太远', detourOf(cand).toFixed(2));
            continue;
          }
          // 代价:交叉最贵,然后是长度,再然后是「有个小凸起」(并排位置的副作用)
          const score = crossingsOf(cand, others) * CROSS + lenOf(cand) + (hasJog(cand) ? 300 : 0);
          if (process.env.DBG) console.error('   cand', ex, o0, en, o4, 'score', Math.round(score), 'jog', hasJog(cand), cand.map((q) => `${q[0].toFixed(0)},${q[1].toFixed(0)}`).join(' '));
          if (!best || score < best.score) {
            best = { pts: cand, ex, en, q0, q4, score };
            // 找到「又短又干净」的就收手 —— 预算有限,别把后面的边饿着。
            // (还带凸起的就别收手:那种候选没解决问题,得继续找。)
            if (score < curScore && !hasJog(cand)) { done = true; break; }
          }
        }
      }
      if (!best || best.score >= curScore) continue;

      // 换:脸、端口、路线、线段表一起换
      faces[i].exit = best.ex;
      faces[i].entry = best.en;
      exitOff[i] = offsetOf(best.q0, a, best.ex);
      entryOff[i] = offsetOf(best.q4, b, best.en);
      out[i] = best.pts;
      for (let k = drawn.length - 1; k >= 0; k--) if (drawn[k].edge === i) drawn.splice(k, 1);
      for (const seg of straightSegs(best.pts)) drawn.push({ seg, edge: i });
      improved = true;
    }
    if (!improved) break;
  }

  return out;
}

/**
 * 路线里有没有「上去又下来」的小凸起。
 *
 * 那是从别人占着的通道里进去、又让开留下的副作用:上去 7px、横向 7px、再下来 7px。
 * 盒子是障碍,路线不会正经地跨过去 —— 所以这种小起伏一定是多余的。
 */
function hasJog(r: [number, number][]): boolean {
  // 上去一小截 → 横着走 → 下来,回到原来的高度 —— 绕了个弯又回来
  for (let i = 1; i < r.length - 1; i++) {
    if (!(r[i][1] < r[i - 1][1] && Math.abs(r[i][1] - r[i - 1][1]) < 12)) continue;
    for (let j = i + 1; j < Math.min(r.length, i + 6); j++) {
      if (r[j][1] > r[i - 1][1] && Math.abs(r[j][1] - r[i - 1][1]) < 14) return true;
    }
  }
  return false;
}

/** 绕远多少倍(曼哈顿长 ÷ 直线距离) */
function detourOf(r: [number, number][]): number {
  const l = lenOf(r);
  const s2 = Math.abs(r[r.length - 1][0] - r[0][0]) + Math.abs(r[r.length - 1][1] - r[0][1]);
  return s2 > 1 ? l / s2 : 1;
}

/** 这条线有多长(曼哈顿) */
function lenOf(pts: [number, number][]): number {
  let n = 0;
  for (let i = 1; i < pts.length; i++) n += Math.abs(pts[i][0] - pts[i - 1][0]) + Math.abs(pts[i][1] - pts[i - 1][1]);
  return n;
}

/** 端口偏移(相对脸的正中) */
function offsetOf(p: [number, number], box: Box, side: Side): number {
  switch (side) {
    case 'left': return p[1] - cy(box);
    case 'right': return p[1] - cy(box);
    case 'top': return p[0] - cx(box);
    case 'bottom': return p[0] - cx(box);
  }
}

/** 已经占掉的端口偏移(按 节点|脸) */
function usedOffsets(
  ctx: RoutingCtx, faces: Faces[], exitOff: number[], entryOff: number[],
): Map<string, number[]> {
  const m = new Map<string, number[]>();
  const put = (node: string, side: Side, off: number): void => {
    const k = `${node}|${side}`;
    m.set(k, [...(m.get(k) ?? []), off]);
  };
  ctx.edges.forEach((e, i) => {
    put(e.from, faces[i].exit, exitOff[i]);
    put(e.to, faces[i].entry, entryOff[i]);
  });
  return m;
}

/** 这张脸上的几个空位(离别人至少 9px)—— 挪端口时用 */
function freeSlots(used: number[], len: number, cur: number | null): number[] {
  const gap = PORT_GAP;
  const limit = len / 2 - FACE_MARGIN;
  const sorted = [...used].sort((a, b) => a - b);
  const far = (cand: number): boolean => sorted.every((u) => Math.abs(u - cand) >= gap);
  const out: number[] = [];
  for (let d = 0; d <= limit && out.length < 6; d += gap) {
    for (const cand of d === 0 ? [0] : [d, -d]) {
      if (Math.abs(cand) > limit) continue;
      if (cur !== null && Math.abs(cand - cur) < 0.5) continue;
      if (far(cand)) out.push(cand);
    }
  }
  // 两块之间的中间也算空位
  for (let i = 1; i < sorted.length && out.length < 6; i++) {
    const mid = (sorted[i - 1] + sorted[i]) / 2;
    if (Math.abs(mid) <= limit && far(mid) && (cur === null || Math.abs(mid - cur) >= 0.5)) out.push(mid);
  }
  return out;
}

/** 这张脸上找一个空着的端口(离别的至少 9px)—— 找不到就返回 null(这张脸别用了) */
function freeSlot(used: number[], len: number): number | null {
  const gap = PORT_GAP;
  const limit = len / 2 - FACE_MARGIN;
  const sorted = [...used].sort((a, b) => a - b);
  const far = (cand: number): boolean => sorted.every((u) => Math.abs(u - cand) >= gap);
  // 候选:正中、已占位置往两边让一格、两块之间的中间
  const cands: number[] = [0];
  for (const u of sorted) {
    cands.push(u + gap, u - gap);
    cands.push(u + gap / 2, u - gap / 2);
  }
  for (const u of sorted) {
    const i = sorted.indexOf(u);
    if (i + 1 < sorted.length) cands.push((u + sorted[i + 1]) / 2);
  }
  for (const cand of cands) {
    if (Math.abs(cand) > limit) continue;
    if (far(cand)) return cand;
  }
  return null;
}

/** 这条线跟已经画好的线交叉了几次 */
function crossingsOf(pts: [number, number][], drawn: Drawn[]): number {
  let n = 0;
  for (let i = 1; i < pts.length; i++) {
    for (const d of drawn) {
      const c: [number, number] = [d.seg[0], d.seg[1]];
      const e: [number, number] = [d.seg[2], d.seg[3]];
      if (segsCross(pts[i - 1], pts[i], c, e)) n++;
    }
  }
  return n;
}

/** 走不通时的兜底:先直连,直连撞到盒子就绕到空通道 */
function directRoute(
  p0: [number, number], exit: Side,
  p4: [number, number], entry: Side,
  a: Box, b: Box, boxes: Box[], bounds: Box[],
): [number, number][] {
  const p1: [number, number] = [p0[0] + OUT_DIR[exit][0] * STUB, p0[1] + OUT_DIR[exit][1] * STUB];
  const p3: [number, number] = [p4[0] + OUT_DIR[entry][0] * STUB, p4[1] + OUT_DIR[entry][1] * STUB];
  // 传进来的 boxes 已经去掉了源/目标节点(调用方干的),这里直接当障碍用
  const others = boxes;
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
