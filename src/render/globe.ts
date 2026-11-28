// globe —— 球面上的图(服务端这一半:解析 URL + 画 SVG)。
//
// URL 语言跟结构图那一族一样(n= 节点、e= 边),但节点落在**球面**上:
//   n=id;type;label[;sub][;p<纬度>,<经度>]
// 位置那一段跟平面图里的像素位置是同一个字段,在这儿的意思是「球面上的哪一点」。
// 没写位置的节点按黄金角(Fibonacci)均匀铺在球面上 —— 30 到 200 个节点看着最舒服。
//
// 边走**大圆弧**(两点间最短的那条球面路径),弧稍稍挑起来一点 ——
// 贴着球面的那一半会被球挡住,挑起来才看得见「从这儿到那儿」。
//
// 球本身是半透明的:背面的点和线淡着画出来(X 光的样子)——
// 实心的球就只能看见前半面,那样这张图就少了一半的信息。
//
// 几何在 globe3d.ts(浏览器端也用它);相机那套(转、滚轮、双击复位)
// 跟 arch3d 共用:src/client/orbit.ts。

import { parseNodes, parseEdges } from './archmap.js';
import { esc } from './svg.js';
import { loadWorldSphericalGeoJson } from './maps.js';
import { DEFAULT_CAMERA, type Camera } from './scene3d.js';
import {
  GLOBE_R, projectGlobe, sph, fibonacci, arc, layoutOnSphere,
  type GlobeScene, type GlobeNode, type GlobeEdge, type GlobeLand,
} from './globe3d.js';
import { WORLD_COUNTRIES, type WorldCountry } from '../world-data.js';

/**
 * 全球统计那一档(data=gdp|pop):气泡的大小与颜色由值给。
 *
 * 参照 ECharts 的 globe-atmosphere 那个例子(球 + 一层大气 + 各国气泡),
 * 但**画在服务端**:ECharts 的 globe 是 WebGL 的,Worker 里出不了图 ——
 * 断了「URL 即图」这条命,所以这层用 SVG 自己画。
 */
interface Metric {
  key: 'gdp' | 'pop';
  label: string;
  zh: string;
  /** 取值 */
  get: (c: WorldCountry) => number;
  /** 值的写法(图例与提示里用) */
  fmt: (v: number) => string;
}

const METRICS: Record<string, Metric> = {
  gdp: {
    key: 'gdp',
    label: 'GDP per capita',
    zh: '人均 GDP',
    get: (c) => c.gdp,
    fmt: (v) => `$${v >= 1000 ? `${(v / 1000).toFixed(1)}k` : String(Math.round(v))}`,
  },
  pop: {
    key: 'pop',
    label: 'Population',
    zh: '人口',
    get: (c) => c.pop,
    fmt: (v) => (v >= 1e9 ? `${(v / 1e9).toFixed(2)}B` : v >= 1e6 ? `${(v / 1e6).toFixed(1)}M` : `${Math.round(v / 1e3)}k`),
  },
};

/** 色标:低 → 高(蓝 → 琥珀) */
const RAMP = ['#38BDF8', '#60A5FA', '#A78BFA', '#FBBF24'];

/** 两个 hex 之间插一个色 */
function mixHex(a: string, b: string, t: number): string {
  const pa = [1, 3, 5].map((i) => parseInt(a.slice(i, i + 2), 16));
  const pb = [1, 3, 5].map((i) => parseInt(b.slice(i, i + 2), 16));
  const c = pa.map((v, i) => Math.round(v + (pb[i] - v) * t));
  return `#${c.map((v) => v.toString(16).padStart(2, '0')).join('')}`;
}

/** 梯度上取一个色(t: 0-1) */
function rampAt(t: number): string {
  const x = Math.max(0, Math.min(1, t)) * (RAMP.length - 1);
  const i = Math.min(RAMP.length - 2, Math.floor(x));
  return mixHex(RAMP[i], RAMP[i + 1], x - i);
}

/** 类型 → 色(跟结构图那一族一致) */
const TYPE_COLOR: Record<string, number> = {
  fe: 0, be: 1, db: 2, cloud: 3, sec: 4, bus: 5, svc: 6,
};

function colorOf(type: string): string {
  const i = TYPE_COLOR[type];
  return i === undefined ? 'var(--d-muted)' : `var(--d-s${i + 1})`;
}

/**
 * 解析 URL → 球上的场景。
 *
 * 位置是**摆出来的**,不是写出来的:给一张关系图,力导向把它铺到球面上
 * (固定 seed —— 同样的图每次摆得一样)。想让某个点落在球面的特定位置,
 * 才在节点里写 `p<纬度>,<经度>`(写了的按它放,没写的参与力导向)。
 */
export async function globeFromUrl(url: URL, radius = GLOBE_R, seed = 42, mode: 'earth' | 'sphere' = 'earth'): Promise<GlobeScene> {
  const nodes = parseNodes(url.searchParams.getAll('n'));
  const ids = new Set(nodes.map((n) => n.id));
  const edges = parseEdges(url.searchParams.getAll('e'), ids);

  // 高亮:hl=<id,id> —— 点名的那些城市画大一点,还带一圈圈
  const hl = new Set((url.searchParams.get('hl') ?? '').split(',').map((s) => s.trim()).filter(Boolean));

  // 位置:p<纬度>,<经度>(平面图里那一段是像素坐标,在球面上是经纬度)。
  // 「球面」那一种不看位置 —— 位置是摆出来的,不是写出来的。
  const pos = new Map<string, { lat: number; lon: number }>();
  if (mode === 'earth') {
    for (const n of nodes) {
      const px = n.px;
      if (!px) continue;
      if (px.x < -90 || px.x > 90 || px.y < -180 || px.y > 180) continue;
      pos.set(n.id, { lat: px.x, lon: px.y });
    }
  }

  // 力导向:没写位置的节点参与,写了的钉住(它不参与,免得被推走)
  const idx = new Map(nodes.map((n, i) => [n.id, i]));
  const free: number[] = [];
  for (const n of nodes) if (!pos.has(n.id)) free.push(idx.get(n.id)!);
  const freeSet = new Set(free);
  const links: [number, number][] = [];
  for (const e of edges) {
    const a = idx.get(e.from);
    const b = idx.get(e.to);
    if (a === undefined || b === undefined) continue;
    // 两端都在自由集合里才拉 —— 钉住的不动
    if (freeSet.has(a) && freeSet.has(b)) links.push([a, b]);
  }
  // 自由节点之间的边(用它们在自由集合里的序号)
  const freePos = new Map(free.map((v, i) => [v, i]));
  const freeLinks: [number, number][] = [];
  for (const [a, b] of links) freeLinks.push([freePos.get(a)!, freePos.get(b)!]);
  const laid = layoutOnSphere(free.length, freeLinks, radius, seed);

  const globeNodes: GlobeNode[] = nodes.map((n) => {
    const at = pos.get(n.id);
    const i = idx.get(n.id)!;
    const freeI = freePos.get(i);
    return {
      id: n.id,
      label: n.label,
      sub: n.sub,
      color: colorOf(n.type),
      p: at ? sph(at.lat, at.lon, radius) : (freeI !== undefined ? laid[freeI] : fibonacci(i, nodes.length, radius)),
      lat: at?.lat,
      lon: at?.lon,
      hl: hl.has(n.id) || undefined,
    };
  });
  const nodeOf = new Map(globeNodes.map((n) => [n.id, n]));

  // 全球统计那一档:data=gdp|pop —— 各国一个气泡,大小与颜色由值给
  const metric = METRICS[url.searchParams.get('data') ?? ''];
  let legend: GlobeScene['legend'];
  if (metric) {
    const rows = WORLD_COUNTRIES
      .map((c) => ({ c, v: metric.get(c) }))
      .filter((r) => Number.isFinite(r.v) && r.v > 0);
    if (rows.length) {
      const max = Math.max(...rows.map((r) => r.v));
      const min = Math.min(...rows.map((r) => r.v));
      for (const { c, v } of rows) {
        // 面积正比于值 → 半径取平方根(不然大国会糊满半个球)
        const t = Math.sqrt(v / max);
        globeNodes.push({
          id: `b:${c.n}`,
          label: '',
          sub: `${c.n} · ${metric.fmt(v)}`,
          color: rampAt(t),
          p: sph(c.lat, c.lon, radius * 1.004),
          lat: c.lat,
          lon: c.lon,
          bubble: { r: 5 + 21 * t, v },
        });
      }
      legend = { title: metric.label, min: metric.fmt(min), max: metric.fmt(max), ramp: RAMP };
    }
  }

  const globeEdges: GlobeEdge[] = [];
  for (const e of edges) {
    const a = nodeOf.get(e.from);
    const b = nodeOf.get(e.to);
    if (!a || !b) continue;
    globeEdges.push({ from: e.from, to: e.to, label: e.label, pts: arc(a.p, b.p) });
  }

  // 地球:把世界地图装上(球面上的关系图没有大陆)
  let land: GlobeLand[] | undefined;
  if (mode === 'earth') {
    const world = (await loadWorldSphericalGeoJson()) as {
      features?: { properties?: { name?: string }; geometry?: { type?: string; coordinates?: unknown } }[];
    };
    land = (world.features ?? []).map((f) => {
      const g = f.geometry ?? {};
      const polys: unknown[][] = g.type === 'Polygon'
        ? (g.coordinates as unknown[][])
        : ((g.coordinates as unknown[][][]) ?? []).map((poly) => poly as unknown[]);
      const rings: number[][][] = [];
      for (const poly of polys) {
        const ring = (poly as number[][]).filter((pt) => Array.isArray(pt) && pt.length >= 2);
        if (ring.length > 2) rings.push(ring.map((pt) => [pt[0], pt[1]]));
      }
      return { name: f.properties?.name ?? '', rings };
    }).filter((c) => c.rings.length > 0);
  }

  return { nodes: globeNodes, edges: globeEdges, radius, land, legend };
}

export interface GlobeOpts {
  interactive?: boolean;
  width?: number;
}

/** 场景 → SVG */
export function renderGlobe(scene: GlobeScene, opts: GlobeOpts = {}): string {
  const cam: Camera = { ...DEFAULT_CAMERA, yaw: 20, pitch: -18, dist: 3000, focal: 8000 };
  const p = projectGlobe(scene, cam);
  const pad = 30;
  const vb = { x: p.bbox.x - pad, y: p.bbox.y - pad, w: p.bbox.w + pad * 2, h: p.bbox.h + pad * 2 };
  const width = opts.width ?? Math.round(vb.w);
  const height = Math.round((vb.h / vb.w) * width);
  const r2 = (v: number): number => Math.round(v * 100) / 100;

  const parts: string[] = [];

  // 球:半透明的蓝球 + 一圈大气
  // 剪影是个**正圆**(球转起来剪影还是自己):半径 = 球半径 × 透视系数,
  // 圆心 = 球心的投影。不能拿赤道的投影当剪影 —— 赤道斜看是个椭圆。
  const k = cam.focal / Math.max(1, cam.dist);
  const cx = p.center.x;
  const cy = p.center.y;
  const rad = scene.radius * k;
  // 大气:球外面一圈很淡的蓝光(ECharts 的 globe-atmosphere 那个感觉)
  parts.push(`<circle class="g-atmo" cx="${r2(cx)}" cy="${r2(cy)}" r="${r2(rad * 1.14)}" fill="url(#g-atmo)"/>`);
  parts.push(`<circle class="g-glow" cx="${r2(cx)}" cy="${r2(cy)}" r="${r2(rad)}" fill="none" stroke="var(--d-link)" stroke-opacity="0.25" stroke-width="10"/>`);
  parts.push(`<circle class="g-sphere" cx="${r2(cx)}" cy="${r2(cy)}" r="${r2(rad)}" fill="url(#g-grad)"/>`);

  // 大陆:地球才有 —— 一块淡的陆地,背面那半边更淡
  for (const l of p.land) {
    for (const ring of l.rings) {
      parts.push(
        `<path class="g-land${l.back ? ' back' : ''}" d="${ring.map((q, i) => `${i === 0 ? 'M' : 'L'}${r2(q[0])} ${r2(q[1])}`).join('')}Z"/>`,
      );
    }
  }

  // 经纬网:球不要那些线(点已经贴着球面,线只是噪点)

  // 弧:背面淡,正面亮
  for (const e of p.edges) {
    const ia = opts.interactive ? ` data-from="${esc(e.from)}" data-to="${esc(e.to)}"` : '';
    const d = e.pts.map((q, i) => `${i === 0 ? 'M' : 'L'}${r2(q[0])} ${r2(q[1])}`).join('');
    parts.push(
      `<g class="g-edge${e.back ? ' back' : ''}"${ia}>` +
      // data-from/data-to 也要落在 path 上 —— explore 那套点击高亮找的是 path[data-from]
      `<path d="${d}"${ia} fill="none"/>` +
      (e.label ? `<text class="g-edge-label" x="${r2(e.lx)}" y="${r2(e.ly)}" font-size="20" text-anchor="middle">${esc(e.label)}</text>` : '') +
      `</g>`
    );
  }

  // 点:背面小而淡,正面大而亮
  const order = [...p.nodes].sort((a, b) => b.depth - a.depth);
  const nodeOf = new Map(scene.nodes.map((n) => [n.id, n]));
  for (const n of order) {
    const s = nodeOf.get(n.id)!;
    const ia = opts.interactive ? ` data-node="${esc(n.id)}" data-tip="${esc(tipOf(s))}" tabindex="0"` : '';
    // 数据气泡:实心圆 + 一圈淡边(背面淡一半)
    if (s.bubble) {
      parts.push(
        `<g class="g-bubble${n.back ? ' back' : ''}"${ia}>` +
        `<circle cx="${r2(n.x)}" cy="${r2(n.y)}" r="${r2(s.bubble.r)}" fill="${s.color}" fill-opacity="0.5" stroke="${s.color}" stroke-width="1.4"/>` +
        `</g>`,
      );
      continue;
    }
    // 高亮的城市:大一点 + 一圈圈(圈是「点名」的意思)
    const rad = s.hl ? 15 : 10;
    parts.push(
      `<g class="g-node${n.back ? ' back' : ''}${s.hl ? ' hl' : ''}"${ia}>` +
      (s.hl ? `<circle class="g-ring" cx="${r2(n.x)}" cy="${r2(n.y)}" r="22" fill="none" stroke="${s.color}" stroke-width="2.5"/>` : '') +
      `<circle class="g-dot-halo" cx="${r2(n.x)}" cy="${r2(n.y)}" r="24" fill="${s.color}"/>` +
      `<circle class="g-dot" cx="${r2(n.x)}" cy="${r2(n.y)}" r="${rad}" fill="${s.color}"/>` +
      `<text class="g-label" x="${r2(n.x)}" y="${r2(n.y - 26)}" font-size="28" text-anchor="middle">${esc(s.label)}</text>` +
      `</g>`
    );
  }

  // 色标:这条 data= 那一档的说明(左下角,一小条渐变 + 两端的值)
  if (scene.legend) {
    const lg = scene.legend;
    const x = vb.x + 26;
    const y = vb.y + vb.h - 34;
    const w = 168;
    const steps = 24;
    let bar = '';
    for (let i = 0; i < steps; i++) {
      bar += `<rect x="${r2(x + (w / steps) * i)}" y="${r2(y)}" width="${r2(w / steps + 0.6)}" height="8" fill="${rampAt(i / (steps - 1))}"/>`;
    }
    parts.push(
      `<g class="g-legend">` +
      `<text x="${r2(x)}" y="${r2(y - 10)}" font-size="15" fill="#E2E8F0">${esc(lg.title)}</text>` +
      bar +
      `<text x="${r2(x)}" y="${r2(y + 24)}" font-size="13" fill="#94A3B8">${esc(lg.min)}</text>` +
      `<text x="${r2(x + w)}" y="${r2(y + 24)}" font-size="13" fill="#94A3B8" text-anchor="end">${esc(lg.max)}</text>` +
      `</g>`,
    );
  }

  return (
    `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" ` +
    `viewBox="${r2(vb.x)} ${r2(vb.y)} ${r2(vb.w)} ${r2(vb.h)}" ` +
    `font-family="ui-sans-serif,-apple-system,BlinkMacSystemFont,'Segoe UI','PingFang SC','Hiragino Sans GB','Microsoft YaHei',sans-serif" ` +
    `role="img" aria-label="globe">` +
    globeStyle() +
    `<g id="am">${parts.join('')}</g>` +
    `</svg>`
  );
}

function tipOf(n: GlobeNode): string {
  if (n.lat === undefined) return n.label;
  const at = `${Math.abs(n.lat).toFixed(1)}°${n.lat >= 0 ? 'N' : 'S'} ${Math.abs(n.lon ?? 0).toFixed(1)}°${(n.lon ?? 0) >= 0 ? 'E' : 'W'}`;
  return n.sub ? `${n.label} · ${n.sub} · ${at}` : `${n.label} · ${at}`;
}

function globeStyle(): string {
  return (
    `<style>:root{color-scheme:dark;` +
    `--d-s1:#34D399;--d-s2:#F87171;--d-s3:#A78BFA;--d-s4:#22D3EE;--d-s5:#60A5FA;--d-s6:#FB923C;` +
    `--d-s7:#4ADE80;--d-s8:#FB7185;--d-s9:#F59E0B;--d-s10:#0EA5E9;` +
    `--d-ink:#FAFAFA;--d-text:#D4D4D8;--d-muted:#A1A1AA;--d-faint:#71717A;--d-grid:#29292E;--d-card:#0E0F11;--d-link:#60A5FA;` +
    `#am .g-sphere{fill-opacity:.92}` +
    `#am .g-land{fill:#2E6FA8;fill-opacity:.5;stroke:#9BDCFF;stroke-opacity:.45;stroke-width:.9}` +
    `#am .g-land.back{fill-opacity:.16;stroke-opacity:.12}` +
    `#am .g-grid{stroke:#7DD3FC;stroke-opacity:.18;stroke-width:2}` +
    `#am .g-edge path{stroke:#DBEAFE;stroke-opacity:.92;stroke-width:3}` +
    `#am .g-edge.back path{stroke-opacity:.2}` +
    `#am .g-edge-label{fill:#DBEAFE;fill-opacity:.9}` +
    `#am .g-node .g-dot-halo{fill-opacity:.2}` +
    `#am .g-node .g-dot{stroke:#050B1C;stroke-width:1.5}` +
    `#am .g-node .g-label{fill:#F0F9FF;fill-opacity:.95;paint-order:stroke;stroke:#050B1C;stroke-width:3;stroke-opacity:.55}` +
    `#am .g-node.back{opacity:.4}` +
    `#am .g-node.hl .g-label{font-weight:600}` +
    `#am .g-node.hl .g-dot-halo{fill-opacity:.3}` +
    `#am g[data-node]{cursor:pointer;transition:filter .12s ease,opacity .15s ease}` +
    `#am g[data-node]:hover,#am g[data-node]:focus-visible{filter:brightness(1.3)}` +
    `#am g[data-node].on{filter:brightness(1.3)}` +
    `#am.hl g[data-node]{opacity:.25}#am.hl g[data-node].on{opacity:1}` +
    `#am.hl path[data-from]{opacity:.1}#am.hl path[data-from].on{opacity:1}` +
    `}</style>` +
    `<defs><radialGradient id="g-grad" cx="35%" cy="28%" r="78%">` +
    `<stop offset="0%" stop-color="#1E3A8A"/><stop offset="55%" stop-color="#0C1E45"/><stop offset="100%" stop-color="#050B1C"/>` +
    `</radialGradient>` +
    // 大气:球外面那圈淡蓝
    `<radialGradient id="g-atmo" cx="50%" cy="50%" r="50%">` +
    `<stop offset="76%" stop-color="#60A5FA" stop-opacity="0"/>` +
    `<stop offset="88%" stop-color="#60A5FA" stop-opacity="0.16"/>` +
    `<stop offset="100%" stop-color="#60A5FA" stop-opacity="0"/>` +
    `</radialGradient></defs>`
  );
}
