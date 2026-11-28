// 三维场景:结构图的 3D 版本(arch3d)。
//
// 服务端(出静态图)与浏览器端(能转)共用这一份 —— 投影公式只有一处,
// 两边算出来的画面才是一张。
//
// ── 分层怎么定义 ──────────────────────────────────────────────────
// 3D 场景的高度轴只表达**一件事**:流到哪儿了。所以只有三层:
//
//   顶层(源) —— 没有入边的节点:入口、用户、请求
//   中层     —— 两头都有边的节点:平台、服务
//   底层(汇) —— 没有出边的节点:数据、资源
//
// 层的算法:去掉环上的边(回边)后按最长路径分层 —— 源在前,汇在后。
// 一个连通分量单独算(分量之间不相通,层号不能接起来),
// 分量内:第一层是顶层,最后一层是底层,中间的都是中层。
// 整个分量只有一层(孤零零一个节点)→ 算中层(没有流向可言)。
//
// 为什么不用「层号」而用「源/中/汇」:层号可以有很多(五层六层),
// 但 3D 场景里高度轴最多表达三层 —— 再多就分不清谁是谁了。
//
// ── 一层里怎么排 ──────────────────────────────────────────────────
// 一层之内用分层引擎再排一遍(只算层内的边):横向还是「源在左、汇在右」。
// 于是整张图读下来是:上面一层往下一层流,层内从左往右流。
//
// ── 3D 坐标 ──────────────────────────────────────────────────────
// x 向右、y 向里(纵深)、z 向上。节点是一块板砖(有厚度),浮在自己那层的高度上。

import { layeredCore } from '../layout/layered.js';

export interface Vec3 {
  x: number;
  y: number;
  z: number;
}

/** 相机:绕场景转 */
export interface Camera {
  /** 水平角(度)—— 0 = 正对着 */
  yaw: number;
  /** 俯仰角(度)—— 负数往下看 */
  pitch: number;
  /** 相机离场景中心的距离 */
  dist: number;
  /** 焦距(像素)—— 越大越平(透视越弱) */
  focal: number;
}

/** 默认相机:等轴测那一眼(俯 30°,转 30°) */
export const DEFAULT_CAMERA: Camera = { yaw: 32, pitch: -38, dist: 1400, focal: 1500 };

export interface SceneNode {
  id: string;
  label: string;
  sub?: string;
  /** 语义色(#rrggbb) */
  color: string;
  /** 图标(data URI)—— 摆在块上面,像参考图里那些浮着的图标 */
  icon?: string;
  /** 板砖中心 */
  p: Vec3;
  /** 板砖尺寸:沿 x / 沿 y / 沿 z */
  w: number;
  d: number;
  h: number;
  /** 层:0=源 1=中 2=汇 */
  tier: number;
}

export interface SceneEdge {
  from: string;
  to: string;
  label?: string;
  /** 三维折点 */
  pts: Vec3[];
}

export interface SceneGroup {
  label: string;
  ids: string[];
  /** 罩住成员的包围盒 */
  min: Vec3;
  max: Vec3;
}

export interface SceneTier {
  /** 0=源 1=中 2=汇 */
  tier: number;
  z: number;
  /** 这一层的板台范围 */
  min: Vec3;
  max: Vec3;
}

export interface Scene {
  nodes: SceneNode[];
  edges: SceneEdge[];
  groups: SceneGroup[];
  tiers: SceneTier[];
  /** 地面网格的范围 */
  ground: { min: Vec3; max: Vec3 };
}

/* ---------------------------------------------------------------- 摆位 */

export interface SceneInput {
  nodes: { id: string; label: string; sub?: string; color: string; icon?: string; w: number; d: number; h: number }[];
  edges: { from: string; to: string; label?: string }[];
  groups: { label: string; ids: string[] }[];
  /** 层与层之间的高度 */
  tierGap?: number;
  /** 板砖的厚度 */
  slabH?: number;
  /** 层内的间距 */
  gapX?: number;
  gapY?: number;
}

/** 层与层的高度:底 0、中 tierGap、顶 2*tierGap */
const TIER_Z = [2, 1, 0];

/**
 * 摆场景:分层 → 层内排 → 落到三维坐标。
 */
export function buildScene(input: SceneInput): Scene {
  const tierGap = input.tierGap ?? 210;
  const slabH = input.slabH ?? 26;
  const gapX = input.gapX ?? 90;
  const gapY = input.gapY ?? 70;

  // 1. 层:每个连通分量单独分层(去环 → 最长路径)
  const byId = new Map(input.nodes.map((n) => [n.id, n]));
  const all = layeredCore({
    nodes: input.nodes.map((n) => ({ id: n.id, w: n.w, h: n.d })),
    edges: input.edges.map((e) => ({ from: e.from, to: e.to })),
    dir: 'LR',
    layerGap: gapX,
    nodeGap: gapY,
    pad: 0,
  });
  /** 节点 → 层(0=源 1=中 2=汇) */
  const tierOf = new Map<string, number>();
  for (const comp of all.compLayers) {
    const last = comp.length - 1;
    comp.forEach((layer, r) => {
      const tier = comp.length === 1 ? 1 : r === 0 ? 0 : r === last ? 2 : 1;
      for (const id of layer) tierOf.set(id, tier);
    });
  }

  // 2. 层内再排一遍(只算层内的边)—— 层内保持「源在左、汇在右」
  const byTier = new Map<number, string[]>();
  for (const n of input.nodes) {
    const t = tierOf.get(n.id) ?? 1;
    byTier.set(t, [...(byTier.get(t) ?? []), n.id]);
  }
  const pos = new Map<string, { x: number; y: number }>();
  for (const [tier, ids] of byTier) {
    const inTier = new Set(ids);
    const res = layeredCore({
      nodes: ids.map((id) => ({ id, w: byId.get(id)!.w, h: byId.get(id)!.d })),
      edges: input.edges.filter((e) => inTier.has(e.from) && inTier.has(e.to)).map((e) => ({ from: e.from, to: e.to })),
      dir: 'LR',
      layerGap: gapX,
      nodeGap: gapY,
      pad: 0,
    });
    // 每层各自居中 —— 三层叠起来才正
    let minX = Infinity;
    let maxX = -Infinity;
    let minY = Infinity;
    let maxY = -Infinity;
    for (const id of ids) {
      const b = res.boxes.get(id);
      if (!b) continue;
      minX = Math.min(minX, b.x);
      maxX = Math.max(maxX, b.x + b.w);
      minY = Math.min(minY, b.y);
      maxY = Math.max(maxY, b.y + b.h);
    }
    const cx = (minX + maxX) / 2;
    const cy = (minY + maxY) / 2;
    for (const id of ids) {
      const b = res.boxes.get(id);
      if (!b) continue;
      pos.set(id, { x: b.x + b.w / 2 - cx, y: b.y + b.h / 2 - cy });
    }
    void tier;
  }

  // 3. 三维坐标:层定高度,层内排好的位置定平面
  const nodes: SceneNode[] = input.nodes.map((n) => {
    const tier = tierOf.get(n.id) ?? 1;
    const p = pos.get(n.id) ?? { x: 0, y: 0 };
    return {
      id: n.id,
      label: n.label,
      sub: n.sub,
      color: n.color,
      icon: n.icon,
      p: { x: p.x, y: p.y, z: TIER_Z[tier] * tierGap + slabH / 2 },
      w: n.w,
      d: n.d,
      h: slabH,
      tier,
    };
  });
  const nodeOf = new Map(nodes.map((n) => [n.id, n]));

  // 4. 边:从板砖边到板砖边(直线,3D 里就是一条空间直线)
  const edges: SceneEdge[] = [];
  for (const e of input.edges) {
    const a = nodeOf.get(e.from);
    const b = nodeOf.get(e.to);
    if (!a || !b) continue;
    edges.push({ from: e.from, to: e.to, label: e.label, pts: trim(a, b) });
  }

  // 5. 分组:罩住成员的半透明盒子
  const groups: SceneGroup[] = [];
  for (const g of input.groups) {
    const members = g.ids.map((id) => nodeOf.get(id)).filter(Boolean) as SceneNode[];
    if (!members.length) continue;
    const min: Vec3 = { x: Infinity, y: Infinity, z: Infinity };
    const max: Vec3 = { x: -Infinity, y: -Infinity, z: -Infinity };
    for (const m of members) {
      min.x = Math.min(min.x, m.p.x - m.w / 2);
      max.x = Math.max(max.x, m.p.x + m.w / 2);
      min.y = Math.min(min.y, m.p.y - m.d / 2);
      max.y = Math.max(max.y, m.p.y + m.d / 2);
      min.z = Math.min(min.z, m.p.z - m.h / 2);
      max.z = Math.max(max.z, m.p.z + m.h / 2);
    }
    groups.push({ label: g.label, ids: g.ids, min, max });
  }

  // 6. 每层的板台(那一层的地坪)
  const tiers: SceneTier[] = [];
  for (const tier of [0, 1, 2]) {
    const members = nodes.filter((n) => n.tier === tier);
    if (!members.length) continue;
    const min: Vec3 = { x: Infinity, y: Infinity, z: Infinity };
    const max: Vec3 = { x: -Infinity, y: -Infinity, z: -Infinity };
    for (const m of members) {
      min.x = Math.min(min.x, m.p.x - m.w / 2);
      max.x = Math.max(max.x, m.p.x + m.w / 2);
      min.y = Math.min(min.y, m.p.y - m.d / 2);
      max.y = Math.max(max.y, m.p.y + m.d / 2);
      min.z = Math.min(min.z, m.p.z - m.h / 2);
      max.z = Math.max(max.z, m.p.z + m.h / 2);
    }
    tiers.push({ tier, z: TIER_Z[tier] * tierGap, min, max });
  }

  // 7. 地面:比最底那层大一圈
  const gz = tiers.length ? Math.min(...tiers.map((t) => t.z)) : 0;
  let gMinX = Infinity, gMaxX = -Infinity, gMinY = Infinity, gMaxY = -Infinity;
  for (const t of tiers) {
    gMinX = Math.min(gMinX, t.min.x);
    gMaxX = Math.max(gMaxX, t.max.x);
    gMinY = Math.min(gMinY, t.min.y);
    gMaxY = Math.max(gMaxY, t.max.y);
  }
  if (!Number.isFinite(gMinX)) { gMinX = gMaxX = gMinY = gMaxY = 0; }
  const pad = 70;
  const ground = {
    min: { x: gMinX - pad, y: gMinY - pad, z: gz },
    max: { x: gMaxX + pad, y: gMaxY + pad, z: gz },
  };

  return { nodes, edges, groups, tiers, ground };
}

/** 边的两个端点:从板砖的边出发(不穿进板砖里) */
function trim(a: SceneNode, b: SceneNode): Vec3[] {
  const dx = b.p.x - a.p.x;
  const dy = b.p.y - a.p.y;
  const dz = b.p.z - a.p.z;
  const len = Math.hypot(dx, dy, dz) || 1;
  const ux = dx / len;
  const uy = dy / len;
  const uz = dz / len;
  const ra = Math.max(a.w, a.d, a.h) / 2;
  const rb = Math.max(b.w, b.d, b.h) / 2;
  return [
    { x: a.p.x + ux * ra, y: a.p.y + uy * ra, z: a.p.z + uz * ra },
    { x: b.p.x - ux * rb, y: b.p.y - uy * rb, z: b.p.z - uz * rb },
  ];
}

/* ---------------------------------------------------------------- 投影 */

interface Basis {
  cam: Vec3;
  r: Vec3;
  u: Vec3;
  f: Vec3;
}

/** 相机的三个基向量:右、上、前(视线方向) */
export function cameraBasis(cam: Camera): Basis {
  const yaw = (cam.yaw * Math.PI) / 180;
  const pitch = (cam.pitch * Math.PI) / 180;
  const cp = Math.cos(pitch);
  const c: Vec3 = {
    x: cam.dist * cp * Math.sin(yaw),
    y: -cam.dist * cp * Math.cos(yaw),
    // 俯仰角为负 = 从上往下看(所以这里取负号)
    z: -cam.dist * Math.sin(pitch),
  };
  const len = Math.hypot(c.x, c.y, c.z) || 1;
  const f: Vec3 = { x: -c.x / len, y: -c.y / len, z: -c.z / len };
  // 右 = 前 × 上(世界上方向)
  let r: Vec3 = { x: f.y * 1 - f.z * 0, y: f.z * 0 - f.x * 1, z: 0 };
  const rl = Math.hypot(r.x, r.y) || 1;
  r = { x: r.x / rl, y: r.y / rl, z: 0 };
  // 上 = 右 × 前
  const u: Vec3 = {
    x: r.y * f.z - r.z * f.y,
    y: r.z * f.x - r.x * f.z,
    z: r.x * f.y - r.y * f.x,
  };
  return { cam: c, r, u, f };
}

/** 世界坐标 → 屏幕坐标(深度 = 离相机多远,用来排前后) */
export function project(p: Vec3, basis: Basis, focal: number): { x: number; y: number; depth: number } {
  const v: Vec3 = { x: p.x - basis.cam.x, y: p.y - basis.cam.y, z: p.z - basis.cam.z };
  const cx = v.x * basis.r.x + v.y * basis.r.y + v.z * basis.r.z;
  const cy = v.x * basis.u.x + v.y * basis.u.y + v.z * basis.u.z;
  const cz = v.x * basis.f.x + v.y * basis.f.y + v.z * basis.f.z;   // 沿视线往前 = 正
  const k = focal / Math.max(1, cz);
  return { x: cx * k, y: -cy * k, depth: cz };
}

/** 板砖的八个角 */
function corners(n: SceneNode): Vec3[] {
  const hw = n.w / 2;
  const hd = n.d / 2;
  const hh = n.h / 2;
  return [
    { x: n.p.x - hw, y: n.p.y - hd, z: n.p.z - hh },
    { x: n.p.x + hw, y: n.p.y - hd, z: n.p.z - hh },
    { x: n.p.x + hw, y: n.p.y + hd, z: n.p.z - hh },
    { x: n.p.x - hw, y: n.p.y + hd, z: n.p.z - hh },
    { x: n.p.x - hw, y: n.p.y - hd, z: n.p.z + hh },
    { x: n.p.x + hw, y: n.p.y - hd, z: n.p.z + hh },
    { x: n.p.x + hw, y: n.p.y + hd, z: n.p.z + hh },
    { x: n.p.x - hw, y: n.p.y + hd, z: n.p.z + hh },
  ];
}

export interface ProjNode {
  id: string;
  /** 顶面 */
  top: [number, number][];
  /** 图标摆在哪儿(顶面中心往上飘一点) */
  icon: { x: number; y: number } | null;
  /** 顶面朝不朝相机(从下往上看的时候该藏起来) */
  topVis: boolean;
  /** 底面(从下往上看的时候露出来的那一面) */
  bottom: [number, number][];
  /** 落在地上的影子(块底那个面)—— 有了影子才看得出块是浮着的 */
  shadow: [number, number][];
  /** 四个侧面 + 哪些朝着相机 */
  sides: { pts: [number, number][]; vis: boolean }[];
  /** 标签落点 */
  lx: number;
  ly: number;
  depth: number;
}

export interface ProjEdge {
  from: string;
  to: string;
  label?: string;
  pts: [number, number][];
  lx: number;
  ly: number;
  depth: number;
}

export interface ProjGroup {
  label: string;
  ids: string[];
  /** 盒子的十二条棱 */
  lines: [number, number][][];
  lx: number;
  ly: number;
  depth: number;
}

export interface ProjTier {
  tier: number;
  /** 板台的四个角(上面) */
  pts: [number, number][];
  /** 板台的两个侧面(有厚度才像块板) */
  sides: [number, number][][];
  /** 板台多厚 */
  thick: number;
  /** 层名挂在哪儿(板台最靠前的那个角下面) */
  lx: number;
  ly: number;
  depth: number;
}

export interface ProjScene {
  nodes: ProjNode[];
  edges: ProjEdge[];
  groups: ProjGroup[];
  tiers: ProjTier[];
  /** 地面的网格线 */
  grid: [number, number][][];
  /** 画布范围(投影后) */
  bbox: { x: number; y: number; w: number; h: number };
}

/** 把整个场景投影到屏幕上 */
export function projectScene(scene: Scene, cam: Camera): ProjScene {
  const basis = cameraBasis(cam);
  const focal = cam.focal;
  const nodes: ProjNode[] = [];
  for (const n of scene.nodes) {
    const c = corners(n);
    const pr = c.map((p) => project(p, basis, focal));
    const top: [number, number][] = [pr[4], pr[5], pr[6], pr[7]].map((p) => [p.x, p.y]);
    // 四个侧面:法线朝着相机的才可见
    const sideIdx = [
      [0, 1, 5, 4],
      [1, 2, 6, 5],
      [2, 3, 7, 6],
      [3, 0, 4, 7],
    ];
    const sideNormals: Vec3[] = [
      { x: 0, y: -1, z: 0 },
      { x: 1, y: 0, z: 0 },
      { x: 0, y: 1, z: 0 },
      { x: -1, y: 0, z: 0 },
    ];
    const sides: { pts: [number, number][]; vis: boolean }[] = [];
    sideIdx.forEach((idx, i) => {
      const nm = sideNormals[i];
      const toCam: Vec3 = {
        x: basis.cam.x - n.p.x,
        y: basis.cam.y - n.p.y,
        z: basis.cam.z - n.p.z,
      };
      const vis = nm.x * toCam.x + nm.y * toCam.y + nm.z * toCam.z > 0;
      sides.push({ pts: idx.map((k) => [pr[k].x, pr[k].y] as [number, number]), vis });
    });
    // 顶面的中心要在**三维**里算 —— 拿投影后的点去平均就歪了
    const topMid = project({ x: n.p.x, y: n.p.y, z: n.p.z + n.h / 2 }, basis, focal);
    const mid = project(n.p, basis, focal);
    // 顶面朝不朝相机:相机在块的上方才看得见顶面
    const topVis = basis.cam.z > n.p.z + n.h / 2;
    nodes.push({
      id: n.id,
      top,
      // 图标:贴在板上,直立着(跟着面歪就认不出是什么)
      icon: n.icon ? { x: topMid.x, y: topMid.y - 20 } : null,
      topVis,
      bottom: [pr[0], pr[1], pr[2], pr[3]].map((p) => [p.x, p.y] as [number, number]),
      shadow: [pr[0], pr[1], pr[2], pr[3]].map((p) => [p.x, p.y] as [number, number]),
      sides,
      lx: mid.x,
      ly: mid.y + 17,          // 标签在板下(图标在板上,各占一边)
      depth: topMid.depth,
    });
  }

  const edges: ProjEdge[] = scene.edges.map((e) => {
    const pr = e.pts.map((p) => project(p, basis, focal));
    const mid = pr[Math.floor((pr.length - 1) / 2)];
    return {
      from: e.from,
      to: e.to,
      label: e.label,
      pts: pr.map((p) => [p.x, p.y] as [number, number]),
      lx: mid.x,
      ly: mid.y,
      depth: mid.depth,
    };
  });

  const groups: ProjGroup[] = scene.groups.map((g) => {
    const { min, max } = g;
    const cs: Vec3[] = [
      { x: min.x, y: min.y, z: min.z },
      { x: max.x, y: min.y, z: min.z },
      { x: max.x, y: max.y, z: min.z },
      { x: min.x, y: max.y, z: min.z },
      { x: min.x, y: min.y, z: max.z },
      { x: max.x, y: min.y, z: max.z },
      { x: max.x, y: max.y, z: max.z },
      { x: min.x, y: max.y, z: max.z },
    ];
    const pr = cs.map((p) => project(p, basis, focal));
    const edgesIdx = [
      [0, 1], [1, 2], [2, 3], [3, 0],
      [4, 5], [5, 6], [6, 7], [7, 4],
      [0, 4], [1, 5], [2, 6], [3, 7],
    ];
    const lines = edgesIdx.map(([a, b]) => [
      [pr[a].x, pr[a].y] as [number, number],
      [pr[b].x, pr[b].y] as [number, number],
    ]);
    const c0 = project({ x: (min.x + max.x) / 2, y: (min.y + max.y) / 2, z: max.z }, basis, focal);
    return { label: g.label, ids: g.ids, lines, lx: c0.x, ly: c0.y, depth: c0.depth };
  });

  const tiers: ProjTier[] = scene.tiers.map((t) => {
    const { min, max } = t;
    const z = t.z - 1;
    const cs: Vec3[] = [
      { x: min.x, y: min.y, z },
      { x: max.x, y: min.y, z },
      { x: max.x, y: max.y, z },
      { x: min.x, y: max.y, z },
    ];
    const pr = cs.map((p) => project(p, basis, focal));
    const c0 = project({ x: (min.x + max.x) / 2, y: (min.y + max.y) / 2, z }, basis, focal);
    const pts = pr.map((p) => [p.x, p.y] as [number, number]);
    // 厚度:往下沉一截,于是有侧面 —— 板台是块板,不是一张纸
    const th = 16;
    const low = cs.map((p) => project({ x: p.x, y: p.y, z: z - th }, basis, focal));
    // 两个侧面:朝向相机的两条边
    const sidePairs: [number, number][] = [[0, 1], [1, 2], [2, 3], [3, 0]];
    const sides: [number, number][][] = [];
    sidePairs.forEach(([a, b], i) => {
      const nm = [{ x: 0, y: -1 }, { x: 1, y: 0 }, { x: 0, y: 1 }, { x: -1, y: 0 }][i];
      const toCam = { x: basis.cam.x - (min.x + max.x) / 2, y: basis.cam.y - (min.y + max.y) / 2 };
      if (nm.x * toCam.x + nm.y * toCam.y > 0) {
        sides.push([
          [pr[a].x, pr[a].y],
          [pr[b].x, pr[b].y],
          [low[b].x, low[b].y],
          [low[a].x, low[a].y],
        ]);
      }
    });
    // 最靠前的角(屏幕上最低的那个)—— 层名挂它下面,那里是空的
    let front = pts[0];
    for (const q of pts) if (q[1] > front[1]) front = q;
    return { tier: t.tier, pts, sides, thick: th, lx: front[0], ly: front[1] + 13, depth: c0.depth };
  });

  // 地面网格
  const grid: [number, number][][] = [];
  {
    const g = scene.ground;
    const step = 120;
    const z = g.min.z;
    for (let x = g.min.x; x <= g.max.x + 1; x += step) {
      const a = project({ x, y: g.min.y, z }, basis, focal);
      const b = project({ x, y: g.max.y, z }, basis, focal);
      grid.push([[a.x, a.y], [b.x, b.y]]);
    }
    for (let y = g.min.y; y <= g.max.y + 1; y += step) {
      const a = project({ x: g.min.x, y, z }, basis, focal);
      const b = project({ x: g.max.x, y, z }, basis, focal);
      grid.push([[a.x, a.y], [b.x, b.y]]);
    }
  }

  // 画布范围
  let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
  const eat = (x: number, y: number): void => {
    minX = Math.min(minX, x);
    maxX = Math.max(maxX, x);
    minY = Math.min(minY, y);
    maxY = Math.max(maxY, y);
  };
  for (const n of nodes) {
    for (const p of n.top) eat(p[0], p[1]);
    for (const s of n.sides) for (const p of s.pts) eat(p[0], p[1]);
  }
  for (const e of edges) for (const p of e.pts) eat(p[0], p[1]);
  for (const g of groups) for (const l of g.lines) for (const p of l) eat(p[0], p[1]);
  for (const t of tiers) for (const p of t.pts) eat(p[0], p[1]);
  for (const l of grid) for (const p of l) eat(p[0], p[1]);
  if (!Number.isFinite(minX)) { minX = minY = 0; maxX = maxY = 1; }

  return {
    nodes,
    edges,
    groups,
    tiers,
    grid,
    bbox: { x: minX, y: minY, w: Math.max(1, maxX - minX), h: Math.max(1, maxY - minY) },
  };
}
