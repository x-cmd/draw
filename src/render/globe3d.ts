// 球面的几何:经纬度 ↔ 球面坐标、黄金角铺球面、大圆弧、投影。
//
// 这一层**不依赖渲染库** —— 浏览器端(转球的那个脚本)也要用它;
// 把库拖进浏览器端会带进 node 的东西。

import { project, cameraBasis, type Camera, type Vec3 } from './scene3d.js';

/** 球半径(场景单位) */
export const GLOBE_R = 170;

export interface GlobeNode {
  id: string;
  label: string;
  sub?: string;
  color: string;
  /** 球面上的位置 */
  p: Vec3;
  /** 纬度/经度(度)—— 没写位置的是按序号铺的,这两项就是 undefined */
  lat?: number;
  lon?: number;
  /** 高亮(hl= 里点名的那些)—— 画得更大,还带一圈圈 */
  hl?: boolean;
  /** 数据气泡(全球统计那一档):r = 屏幕半径,v = 值 */
  bubble?: { r: number; v: number };
}

export interface GlobeEdge {
  from: string;
  to: string;
  label?: string;
  /** 弧上的点(球面上的) */
  pts: Vec3[];
}

export interface GlobeScene {
  nodes: GlobeNode[];
  edges: GlobeEdge[];
  radius: number;
  /** 大陆(地球才有;球面上的关系图没有) */
  land?: GlobeLand[];
  /** 色标(data= 那一档):标题 + 两端的值 + 颜色梯度 */
  legend?: { title: string; min: string; max: string; ramp: string[] };
}

/** 经纬度 → 球面坐标(x 向右、y 向里、z 向上) */
export function sph(lat: number, lon: number, r: number): Vec3 {
  const la = (lat * Math.PI) / 180;
  const lo = (lon * Math.PI) / 180;
  return {
    x: r * Math.cos(la) * Math.cos(lo),
    y: r * Math.cos(la) * Math.sin(lo),
    z: r * Math.sin(la),
  };
}

/** 黄金角铺球面:第 i 个点的位置(均匀,不打架) */
export function fibonacci(i: number, n: number, r: number): Vec3 {
  if (n <= 1) return sph(0, 0, r);
  const golden = Math.PI * (3 - Math.sqrt(5));
  const y = 1 - (i / (n - 1)) * 2;          // 1 → -1
  const rad = Math.sqrt(Math.max(0, 1 - y * y));
  const th = golden * i;
  return { x: Math.cos(th) * rad * r, y: Math.sin(th) * rad * r, z: y * r };
}

const cross = (a: Vec3, b: Vec3): Vec3 => ({
  x: a.y * b.z - a.z * b.y,
  y: a.z * b.x - a.x * b.z,
  z: a.x * b.y - a.y * b.x,
});
const dotv = (a: Vec3, b: Vec3): number => a.x * b.x + a.y * b.y + a.z * b.z;
const normalize = (a: Vec3): Vec3 => {
  const l = Math.hypot(a.x, a.y, a.z) || 1;
  return { x: a.x / l, y: a.y / l, z: a.z / l };
};

/** 弧:两点之间的大圆,再往外挑一点(贴着球面的那半边会被球挡住) */
export function arc(a: Vec3, b: Vec3, lift = 0.12, steps = 28): Vec3[] {
  const na = Math.hypot(a.x, a.y, a.z) || 1;
  const nb = Math.hypot(b.x, b.y, b.z) || 1;
  const ua = { x: a.x / na, y: a.y / na, z: a.z / na };
  const ub = { x: b.x / nb, y: b.y / nb, z: b.z / nb };
  const dot = Math.max(-1, Math.min(1, ua.x * ub.x + ua.y * ub.y + ua.z * ub.z));
  const omega = Math.acos(dot);
  const pts: Vec3[] = [];
  const r = na;
  // 几乎对跖的两点:大圆不唯一,球面插值的分母趋近 0 → 数值会炸。
  // 换个稳的做法:拿一条不过原点的辅助轴,把起点绕它转半圈。
  const antipodal = omega > Math.PI - 0.02;
  const axis = antipodal ? normalize(cross(ua, Math.abs(ua.z) < 0.9 ? { x: 0, y: 0, z: 1 } : { x: 1, y: 0, z: 0 })) : null;
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    let v: Vec3;
    if (antipodal && axis) {
      const ang = Math.PI * t;
      const c = Math.cos(ang);
      const sn = Math.sin(ang);
      const d = dotv(axis, ua);
      v = {
        x: ua.x * c + (axis.y * ua.z - axis.z * ua.y) * sn + axis.x * d * (1 - c),
        y: ua.y * c + (axis.z * ua.x - axis.x * ua.z) * sn + axis.y * d * (1 - c),
        z: ua.z * c + (axis.x * ua.y - axis.y * ua.x) * sn + axis.z * d * (1 - c),
      };
    } else if (omega < 1e-6) {
      v = { x: ua.x + (ub.x - ua.x) * t, y: ua.y + (ub.y - ua.y) * t, z: ua.z + (ub.z - ua.z) * t };
    } else {
      const s = Math.sin(omega);
      const k1 = Math.sin((1 - t) * omega) / s;
      const k2 = Math.sin(t * omega) / s;
      v = { x: ua.x * k1 + ub.x * k2, y: ua.y * k1 + ub.y * k2, z: ua.z * k1 + ub.z * k2 };
    }
    // 挑起来:中点最高(1 + lift·sin(πt))
    const k = r * (1 + lift * Math.sin(Math.PI * t));
    const len = Math.hypot(v.x, v.y, v.z) || 1;
    pts.push({ x: (v.x / len) * k, y: (v.y / len) * k, z: (v.z / len) * k });
  }
  return pts;
}

/* ---------------------------------------------------------------- 球面上的力导向布局 */

/**
 * 固定 seed 的伪随机 —— 同样的图,每次摆得一模一样。
 * (布局要能复现:换个时间打开,图不能就变形了)
 */
export function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return function (): number {
    a = (a + 0x6D2B79F5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * 球面上的力导向布局(Fruchterman-Reingold 那套):
 * 节点之间互相推(斥力),有边的互相拉(弹簧),每步限一下位移并慢慢降温。
 * 节点始终在球面上 —— 每步结束把它们归一化回球面。
 *
 * 起始位置用黄金角铺开(不打架),再按固定 seed 加一点点扰动 —— 免得
 * 完全对称的初始状态让算法卡在对称解上。
 */
export function layoutOnSphere(n: number, links: [number, number][], radius: number, seed = 42): Vec3[] {
  const rnd = mulberry32(seed);
  const pts: Vec3[] = [];
  for (let i = 0; i < n; i++) {
    const base = fibonacci(i, n, radius);
    const j = { x: (rnd() - 0.5) * 0.6, y: (rnd() - 0.5) * 0.6, z: (rnd() - 0.5) * 0.6 };
    const p0 = normalize({ x: base.x + j.x * radius, y: base.y + j.y * radius, z: base.z + j.z * radius });
    pts.push({ x: p0.x * radius, y: p0.y * radius, z: p0.z * radius });
  }
  if (n < 2) return pts;

  // 理想间距:球面上每个节点分到的面积开根号
  const k = 2 * radius * Math.sqrt(Math.PI / n);
  const disp: Vec3[] = pts.map(() => ({ x: 0, y: 0, z: 0 }));
  let temp = radius * 0.35;
  const STEPS = 320;
  for (let step = 0; step < STEPS; step++) {
    for (const d of disp) { d.x = 0; d.y = 0; d.z = 0; }
    // 斥力:所有节点互相推
    for (let i = 0; i < n; i++) {
      for (let j = i + 1; j < n; j++) {
        let dx = pts[i].x - pts[j].x;
        let dy = pts[i].y - pts[j].y;
        let dz = pts[i].z - pts[j].z;
        let len = Math.hypot(dx, dy, dz);
        if (len < 1e-6) { dx = 1e-3; dy = 0; dz = 0; len = 1e-3; }
        const f = (k * k) / len;
        const ux = dx / len, uy = dy / len, uz = dz / len;
        disp[i].x += ux * f; disp[i].y += uy * f; disp[i].z += uz * f;
        disp[j].x -= ux * f; disp[j].y -= uy * f; disp[j].z -= uz * f;
      }
    }
    // 弹簧:有边的互相拉
    for (const [i, j] of links) {
      let dx = pts[j].x - pts[i].x;
      let dy = pts[j].y - pts[i].y;
      let dz = pts[j].z - pts[i].z;
      let len = Math.hypot(dx, dy, dz);
      if (len < 1e-6) continue;
      const f = (len * len) / k;
      const ux = dx / len, uy = dy / len, uz = dz / len;
      disp[i].x += ux * f; disp[i].y += uy * f; disp[i].z += uz * f;
      disp[j].x -= ux * f; disp[j].y -= uy * f; disp[j].z -= uz * f;
    }
    // 走一步:限步长,再拉回球面
    for (let i = 0; i < n; i++) {
      const len = Math.hypot(disp[i].x, disp[i].y, disp[i].z) || 1;
      const lim = Math.min(1, temp / len);
      const q = normalize({
        x: pts[i].x + disp[i].x * lim * 0.35,
        y: pts[i].y + disp[i].y * lim * 0.35,
        z: pts[i].z + disp[i].z * lim * 0.35,
      });
      pts[i] = { x: q.x * radius, y: q.y * radius, z: q.z * radius };
    }
    temp *= 0.985;
  }
  return pts.map((p) => {
    const q = normalize(p);
    return { x: q.x * radius, y: q.y * radius, z: q.z * radius };
  });
}

/**
 * 大陆的轮廓(球面上)—— 世界地图的经纬度数据,投到球面再投影到屏幕。
 * 背面那半边淡着画(跟球上的点、线一个待遇)。
 */
export interface GlobeLand {
  /** 每个国家的一圈或多圈经纬度(每圈是 [经度,纬度] 的点列) */
  rings: number[][][];
  name: string;
}

export interface GlobeProj {
  /** 球心的投影(剪影的圆心) */
  center: { x: number; y: number };
  /** 球的轮廓(投影后的圆) */
  outline: [number, number][];
  /** 经纬网 */
  grid: [number, number][][];
  /** 大陆:每个国家一圈(投影后的) */
  land: { name: string; rings: [number, number][][]; back: boolean }[];
  nodes: { id: string; x: number; y: number; depth: number; back: boolean }[];
  edges: {
    from: string; to: string; label?: string;
    pts: [number, number][]; lx: number; ly: number; depth: number; back: boolean;
  }[];
  bbox: { x: number; y: number; w: number; h: number };
}

/** 点在不在背面(球心朝相机的反方向) */
function dotToCam(p: Vec3, basis: { cam: Vec3 }): number {
  const dx = basis.cam.x - p.x;
  const dy = basis.cam.y - p.y;
  const dz = basis.cam.z - p.z;
  return dx * p.x + dy * p.y + dz * p.z;
}

/** 球 + 经纬网 + 点 + 弧 → 屏幕坐标 */
export function projectGlobe(scene: GlobeScene, cam: Camera): GlobeProj {
  const basis = cameraBasis(cam);
  const focal = cam.focal;
  const R = scene.radius;

  // 球的轮廓:赤道上的圆(球的剪影就是它)
  const outline: [number, number][] = [];
  for (let i = 0; i <= 72; i++) {
    const a = (i / 72) * Math.PI * 2;
    const p = project({ x: R * Math.cos(a), y: R * Math.sin(a), z: 0 }, basis, focal);
    outline.push([p.x, p.y]);
  }

  // 经纬网:纬线(一圈)+ 经线(半圈)
  const grid: [number, number][][] = [];
  for (const lat of [-60, -30, 0, 30, 60]) {
    const line: [number, number][] = [];
    for (let i = 0; i <= 48; i++) {
      const lon = (i / 48) * 360 - 180;
      const p = project(sph(lat, lon, R * 1.002), basis, focal);
      line.push([p.x, p.y]);
    }
    grid.push(line);
  }
  for (const lon of [-120, -60, 0, 60, 120]) {
    const line: [number, number][] = [];
    for (let i = 0; i <= 48; i++) {
      const lat = -90 + (i / 48) * 180;
      const p = project(sph(lat, lon, R * 1.002), basis, focal);
      line.push([p.x, p.y]);
    }
    grid.push(line);
  }

  // 大陆:经纬度 → 球面 → 屏幕
  const land = (scene.land ?? []).map((c) => {
    const rings = c.rings.map((ring) => ring.map((pt) => {
      const p = project(sph(pt[1], pt[0], R * 1.001), basis, focal);
      return [p.x, p.y] as [number, number];
    }));
    // 这块地朝向相机吗(整个国家当成一个面)
    const mid = c.rings[0]?.[0];
    const back = mid ? dotToCam(sph(mid[1], mid[0], R), basis) < 0 : false;   // [lon, lat]
    return { name: c.name, rings, back };
  });

  const nodes = scene.nodes.map((n) => {
    const p = project(n.p, basis, focal);
    return { id: n.id, x: p.x, y: p.y, depth: p.depth, back: dotToCam(n.p, basis) < 0 };
  });

  const edges = scene.edges.map((e) => {
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
      back: dotToCam(e.pts[Math.floor(e.pts.length / 2)], basis) < 0,
    };
  });

  let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
  const eat = (x: number, y: number): void => {
    minX = Math.min(minX, x);
    maxX = Math.max(maxX, x);
    minY = Math.min(minY, y);
    maxY = Math.max(maxY, y);
  };
  const c0 = project({ x: 0, y: 0, z: 0 }, basis, focal);
  const rad = R * (focal / Math.max(1, cam.dist));
  // 剪影是球投出来的圆 —— 比赤道的投影大(赤道斜看是个椭圆),要按它算画布
  for (let i = 0; i < 24; i++) {
    const a = (i / 24) * Math.PI * 2;
    eat(c0.x + Math.cos(a) * rad, c0.y + Math.sin(a) * rad);
  }
  for (const p of outline) eat(p[0], p[1]);
  for (const l of grid) for (const p of l) eat(p[0], p[1]);
  for (const n of nodes) eat(n.x, n.y);
  for (const e of edges) for (const p of e.pts) eat(p[0], p[1]);
  if (!Number.isFinite(minX)) { minX = minY = 0; maxX = maxY = 1; }

  return {
    center: { x: c0.x, y: c0.y },
    outline, grid, land, nodes, edges,
    bbox: { x: minX, y: minY, w: Math.max(1, maxX - minX), h: Math.max(1, maxY - minY) },
  };
}
