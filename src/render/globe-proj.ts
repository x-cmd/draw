// 球面的投影层:d3-geo 正射投影。
//
// 为什么不用 ECharts 的 globe:它是 WebGL 的,Worker 里出不了图 ⇒ 断了「URL 即图」这条命。
// 但"自己画"≠"自己造投影":d3-geo 是纯 JS、无 DOM 依赖,Workers 与浏览器都能用 ✓。
//
// 它白送四件我们原先没有的东西:
//   ① 地平线裁剪(clipAngle(90)⇒ 背面自动没 ✓)
//   ② 球面重采样(precision ⇒ 陆地的边贴着球面走,不是屏幕上的直线弦 ✓)
//   ③ 大圆插值 / 大圆距离(弧贴着球面走 ✓)
//   ④ 经纬网(geoGraticule10 ✓)
//
// 投影是**一份**:服务端出 SVG、客户端画 canvas 用同一个配置 ⇒ 两张画才对得上 ✓。

import { geoOrthographic, geoPath, geoInterpolate, geoDistance, geoCentroid, geoGraticule10 } from 'd3-geo';
import type { GeoPermissibleObjects } from 'd3-geo';

import { simplifyPath } from './simplify.js';
import { worldNeGeoJson } from './vendor/world-ne.js';

/** 视角:球心的经纬度 + 缩放倍数 ✓(分享链接要带着它 ⇒ 角度一致 ✓) */
export interface GlobeView {
  /** 球心经度(度,正东为正) */
  lon: number;
  /** 球心纬度(度) */
  lat: number;
  /** 缩放倍数(1 = 铺满画布) */
  zoom: number;
}

export const DEFAULT_VIEW: GlobeView = { lon: 40, lat: -20, zoom: 1 };

/** 底图里的一个国家(带 ISO 码 ✓) */
export interface GlobeCountry {
  /** ISO 3166-1 alpha-3(主键 ✓) */
  iso3: string;
  /** ISO 3166-1 alpha-2(别名 ✓) */
  iso2: string;
  /** NE 自己的三字母码(兜底 ✓) */
  adm0: string;
  /** 显示名(label ✓ 不参与寻址 ✓) */
  name: string;
  /** 中文名(站点切中文时用 ✓) */
  nameZh?: string;
  /** 世行码(跟 gdp/pop 的数据同源 ✓) */
  wb: string;
  /** 多边形(经纬度 ✓;Polygon 是 [环…],MultiPolygon 是 [多边形…] ⇒ 统一成后者 ✓) */
  polygon: number[][][][];
}

/** 陆地/国家的几何(经纬度 ✓) */
interface CountryGeom {
  properties: GlobeCountry;
  /** Polygon 的坐标是 [环…];MultiPolygon 是 [多边形…] ⇒ 两种都得容下 ✓ */
  geometry: { type: 'Polygon' | 'MultiPolygon'; coordinates: number[][][] | number[][][][] };
}

/** 底图(一次解析,多处用 ✓) */
const raw = worldNeGeoJson as unknown as { features: CountryGeom[] };

/** 全部国家(陆地 + 岛 ✓) */
export const GLOBE_COUNTRIES: GlobeCountry[] = raw.features.map((f) => {
  // 统一成「多边形数组」:Polygon 的 coordinates 本身就是 [环…] ⇒ 包一层 ⇒ [多边形][环][点] ✓
  // (MultiPolygon 的 coordinates 已经是 [多边形][环][点] ✓ ⇒ 原样 ✓)
  const coords = f.geometry.coordinates as unknown;
  const polygon = (f.geometry.type === 'Polygon'
    ? [coords as number[][][]]
    : (coords as number[][][][])) as number[][][][];
  return { ...f.properties, polygon };
});

/**
 * 投影(正射 ✓)。
 *
 * `clipAngle(90)` ⇒ 背面自动裁掉(不用自己判正反面 ✓ —— 那是原来最大的坑之一:
 * 判正反面只看一个点 ⇒ 俄罗斯横跨 11 个时区必然判错 ✗)。
 * `precision(0.4)` ⇒ 陆地的边贴着球面走(不是屏幕上的弦 ✓)。
 */
export function globeProjection(w: number, h: number, view: GlobeView = DEFAULT_VIEW) {
  // 半径 = 画面的 46% ⇒ 球占九成,四周留一点边 ✓
  // (大气圈不再往外伸 ✓ —— 那圈光晕伸到画布外会被切掉,看着像「地球超出了画面」✗)
  const r0 = Math.min(w, h) * 0.46 - 8;
  const p = geoOrthographic()
    .clipAngle(90)
    .precision(0.4)
    .translate([w / 2, h / 2])
    .scale(r0 * view.zoom);
  p.rotate([-view.lon, -view.lat, 0]);
  return p;
}

/** 路径的额外收拾:像素空间抽稀(容差 px)⇒ 形状不变、字串小一半 ✓ */
export interface GlobePathOpts {
  /**
   * 投影之后按**像素**抽稀的容差 ✓
   * 0 = 不抽(浏览器端每帧重画 ⇒ 别抽 ✓ 抽了反而慢 ✗)
   * 出图(服务器)用 0.6~1 ⇒ 50m 的底图投影出来 300KB+ ⇒ 太大 ✗
   */
  tolPx?: number;
}

/**
 * 这个多边形在当前视角下**有看得见的部分**吗?
 *
 * 为什么问这个:d3 的 `clipAngle(90)` 裁剪时,会把被裁掉的那一半**沿着裁剪圆闭合**
 * ⇒ 一个**整个在背面**的多边形,它的 path 里会多出一整圈裁剪圆 ⇒
 * 填充把那半个球都糊上 ✗(实测:俄罗斯/加拿大/洪都拉斯各糊一整球 ✓)。
 *
 * ⇒ **整个在背面的多边形不画** ✓(正面有可见部分才画 ✓)。
 * ⚠️ 要按**多边形**判,不能按国家判:俄罗斯有 101 个多边形(大陆 + 100 个岛 ✓),
 * 背面那些岛照样会吐出整圈裁剪圆 ⇒ 把整个国家糊掉 ✗。
 *
 * ⚠️ 判可见**不能用投影的返回值**:d3 的 clipAngle 只在**画 path**的时候裁,
 * 单点投影照样给得出点(背面会被镜像到另一边 ✗)⇒ 用**球面角距**判 ✓。
 *
 * ⚠️ **要留余量**(1° ✓):正好贴在地平线上的多边形(角距 89.8° ✓)会被 d3 判成
 * 「整个在外面」⇒ 照样吐出整圈裁剪圆 ✗(实测:俄罗斯一个小岛把整个球糊红 ✓)。
 * ⇒ 判可见的门槛比 90° 严 1° ⇒ 这种贴着边的碎片整个丢掉 ✓(它只有 1px 宽 ✓)。
 */
const VISIBLE_MARGIN = (1 * Math.PI) / 180;

function polyVisible(poly: number[][][], view: GlobeView): boolean {
  for (const ring of poly) {
    for (const pt of ring) {
      if (globeAngle(pt[0], pt[1], view) < Math.PI / 2 - VISIBLE_MARGIN) return true;
    }
  }
  return false;
}

/**
 * 把 d3 吐出来的**整圈裁剪圆**丢掉。
 *
 * d3 的 `clipAngle(90)` 裁剪时,被裁掉的那一半会**沿裁剪圆闭合** ⇒
 * 有些多边形(整个在背面、或正好贴在地平线上)的 path 里会多出**一整圈裁剪圆**
 * ⇒ 填充把那半个球都糊上 ✗(实测:俄罗斯/加拿大/洪都拉斯各糊一整球 ✓)。
 *
 * ⇒ 凡是「所有点都在圆上、且绕了一整圈」的子路径,整个丢掉 ✓
 * (半圆弧那种是**多边形自己的封口** ⇒ 要留着 ✓)。
 */
function stripClipCircle(d: string, cx: number, cy: number, R: number): string {
  if (!d) return d;
  const kept: string[] = [];
  for (const seg of d.split('M').slice(1)) {
    const pts: number[][] = [];
    for (const m of seg.matchAll(/(-?[\d.]+),(-?[\d.]+)/g)) pts.push([Number(m[1]), Number(m[2])]);
    if (pts.length > 8 && pts.every(([x, y]) => Math.abs(Math.hypot(x - cx, y - cy) - R) < 0.6)) {
      // 在圆上 ⇒ 再看是不是绕了整圈(半圆弧是多边形的封口,要留 ✓)
      let span = 0;
      for (let i = 1; i < pts.length; i++) {
        let a = Math.atan2(pts[i][1] - cy, pts[i][0] - cx) - Math.atan2(pts[i - 1][1] - cy, pts[i - 1][0] - cx);
        while (a > Math.PI) a -= 2 * Math.PI;
        while (a < -Math.PI) a += 2 * Math.PI;
        span += Math.abs(a);
      }
      if (span > Math.PI * 1.8) continue;      // 整圈 ⇒ 丢掉 ✓
    }
    kept.push(`M${seg}`);
  }
  return kept.join('');
}

/** 陆地的一条 path(整个球面拼成一条 ⇒ 没有国界的接缝 ✓) */
export function globeLandPath(w: number, h: number, view: GlobeView = DEFAULT_VIEW, opts: GlobePathOpts = {}): string {
  const proj = globeProjection(w, h, view);
  const path = geoPath(proj);
  // 背面那些多边形不拼进来(它们的 path 是整圈裁剪圆 ⇒ 陆地会糊满半个球 ✗)
  const features: unknown[] = [];
  for (const c of GLOBE_COUNTRIES) {
    for (const poly of c.polygon) {
      if (!polyVisible(poly, view)) continue;
      features.push({
        type: 'Feature',
        properties: {},
        geometry: { type: 'Polygon', coordinates: poly },
      });
    }
  }
  const raw = path({ type: 'FeatureCollection', features } as unknown as GeoPermissibleObjects) ?? '';
  const d = stripClipCircle(raw, w / 2, h / 2, proj.scale());
  return opts.tolPx ? simplifyPath(d, opts.tolPx) : d;
}

/**
 * 一个**区域**(国家或一级区划)的 path ✓
 *
 * 几何统一成 [多边形][环][点] ✓ ⇒ 国家的与省级的走同一套画法 ✓。
 */
export function globeAreaPath(
  polygon: number[][][][],
  w: number,
  h: number,
  view: GlobeView = DEFAULT_VIEW,
  opts: GlobePathOpts = {},
): string {
  const proj = globeProjection(w, h, view);
  const path = geoPath(proj);
  const features = polygon
    .filter((poly) => polyVisible(poly, view))     // 整个在背面的多边形不画 ✓
    .map((poly) => ({ type: 'Feature' as const, properties: {}, geometry: { type: 'Polygon' as const, coordinates: poly } }));
  if (!features.length) return '';
  const raw = path({ type: 'FeatureCollection', features } as unknown as GeoPermissibleObjects) ?? '';
  const d = stripClipCircle(raw, w / 2, h / 2, proj.scale());
  return opts.tolPx ? simplifyPath(d, opts.tolPx) : d;
}

/** 一个国家的 path(填色时用 ✓) */
export function globeCountryPath(c: GlobeCountry, w: number, h: number, view: GlobeView = DEFAULT_VIEW, opts: GlobePathOpts = {}): string {
  return globeAreaPath(c.polygon, w, h, view, opts);
}

/** 经纬网(给「这是个球」一点提示 ✓) */
export function globeGraticule(w: number, h: number, view: GlobeView = DEFAULT_VIEW): string {
  const path = geoPath(globeProjection(w, h, view));
  return path(geoGraticule10() as unknown as GeoPermissibleObjects) ?? '';
}

/** 经纬度 → 屏幕坐标(点/标签 ✓);背面 ⇒ null ✓ */
export function globePoint(lon: number, lat: number, w: number, h: number, view: GlobeView = DEFAULT_VIEW): { x: number; y: number } | null {
  // 背面的点**不画** ✓ —— d3 的 clipAngle 只管几何的裁剪,单点投影它不管 ⇒ 自己判 ✓
  // (判正反面只看一个点是不行的 ✗ —— 俄罗斯横跨 11 个时区必然判错 ⇒ 用球面角距 ✓)
  if (globeAngle(lon, lat, view) >= Math.PI / 2) return null;
  const p = globeProjection(w, h, view);
  const q = p([lon, lat]);
  if (!q) return null;
  return { x: q[0], y: q[1] };
}

/** 球心到某点的球面角距(弧 > 90° ⇒ 画出来也是背面的 ⇒ 不画 ✓) */
export function globeAngle(lon: number, lat: number, view: GlobeView = DEFAULT_VIEW): number {
  return geoDistance([view.lon, view.lat], [lon, lat]);
}

/** 大圆弧(两点之间最短的那条球面路径 ✓ —— 贴着球面走,不被球挡住 ✓) */
export function globeArc(
  from: [number, number],
  to: [number, number],
  w: number,
  h: number,
  view: GlobeView = DEFAULT_VIEW,
  lift = 0.12,
): { d: string; front: boolean } {
  const proj = globeProjection(w, h, view);
  const mid = geoInterpolate(from, to)(0.5);
  // 弧稍稍挑起来一点 —— 贴着球面的那一半会被球挡住,挑起来才看得见「从这儿到那儿」✓
  const lifted: [number, number] = [mid[0], mid[1] + lift];
  const a = proj(from);
  const m = proj(lifted);
  const b = proj(to);
  if (!a || !m || !b) return { d: '', front: false };
  // 两端都得在正面 ⇒ 弧才画得出来 ✓(中间挑起来的点也算 ✓)
  const front = globeAngle(from[0], from[1], view) < Math.PI / 2 && globeAngle(to[0], to[1], view) < Math.PI / 2;
  return { d: `M${a[0].toFixed(2)},${a[1].toFixed(2)}Q${m[0].toFixed(2)},${m[1].toFixed(2)} ${b[0].toFixed(2)},${b[1].toFixed(2)}`, front };
}

/**
 * 球面上可见的**国家名**标签(位置 + 名字)✓
 *
 * 地图上该有地名 —— 平面世界地图有,球面没有 ⇒ 两张图对不上 ✗。
 * 质心跟视角无关 ⇒ **算一次缓存起来** ✓(每帧重算 242 个质心太贵 ✗)。
 */
let CENTROIDS: Map<string, [number, number]> | null = null;
function centroids(): Map<string, [number, number]> {
  if (CENTROIDS) return CENTROIDS;
  CENTROIDS = new Map();
  for (const c of GLOBE_COUNTRIES) {
    const p = globeCentroid(c);
    if (p) CENTROIDS.set(c.iso2, p);
  }
  return CENTROIDS;
}

/**
 * 国家的「大小」:**最大那个环的平面面积**(平方度)✓
 *
 * 不用外接框:英国海外领地那种横跨半个洋的 ⇒ 外接框巨大 ✗ 会被当成大国标上 ✗。
 * 跟视角无关 ⇒ 算一次缓存 ✓。
 */
let SIZES: Map<string, number> | null = null;
function sizes(): Map<string, number> {
  if (SIZES) return SIZES;
  SIZES = new Map();
  for (const c of GLOBE_COUNTRIES) {
    let best = 0;
    for (const poly of c.polygon) {
      for (const ring of poly) {
        let a = 0;
        for (let i = 0; i < ring.length; i++) {
          const [x1, y1] = ring[i];
          const [x2, y2] = ring[(i + 1) % ring.length];
          a += x1 * y2 - x2 * y1;
        }
        best = Math.max(best, Math.abs(a / 2));
      }
    }
    SIZES.set(c.iso2, best);
  }
  return SIZES;
}

/** 小到不值得标的国家(小岛、领地 ⇒ 标签糊成一片 ✗)—— 平方度 ✓ */
const LABEL_MIN_SIZE = 18;
/** 极地的不标(南极/北极那一圈标签没有意义 ✓) */
const LABEL_MAX_LAT = 62;
/** 一次最多标几个国家(再多就糊了 ✓) */
const LABEL_MAX_COUNT = 26;

export interface GlobeLabel {
  key: string;
  /** 英文名 ✓ */
  name: string;
  /** 中文名(有就带上 ✓ —— 站点能切语言 ✓) */
  nameZh?: string;
  x: number;
  y: number;
}

export function globeCountryLabels(w: number, h: number, view: GlobeView = DEFAULT_VIEW): GlobeLabel[] {
  const proj = globeProjection(w, h, view);
  const out: GlobeLabel[] = [];
  // 大的先标 ✓(顺序固定 ⇒ 转球时标签不会换来换去 ✓)
  const keys = [...centroids().keys()].sort((a, b) => (sizes().get(b) ?? 0) - (sizes().get(a) ?? 0));
  let n = 0;
  for (const key of keys) {
    if (n >= LABEL_MAX_COUNT) break;
    const c0 = centroids().get(key)!;
    const [lon, lat] = c0;
    if ((sizes().get(key) ?? 0) < LABEL_MIN_SIZE) continue;      // 太小的不标 ✓
    if (Math.abs(lat) > LABEL_MAX_LAT) continue;              // 极地不标 ✓
    if (globeAngle(lon, lat, view) >= Math.PI / 2) continue;   // 背面不标 ✓
    const q = proj([lon, lat]);
    if (!q) continue;
    const c = GLOBE_COUNTRIES.find((x) => x.iso2 === key);
    out.push({ key, name: c?.name ?? key, nameZh: c?.nameZh || undefined, x: q[0], y: q[1] });
    n++;
  }
  return out;
}

/** 一个国家的质心(拿它当连线的端点 ✓) */
export function globeCentroid(c: GlobeCountry): [number, number] | null {
  const geo = {
    type: 'FeatureCollection' as const,
    features: c.polygon.map((poly) => ({ type: 'Feature' as const, properties: {}, geometry: { type: 'Polygon' as const, coordinates: poly } })),
  };
  const c0 = geoCentroid(geo as unknown as GeoPermissibleObjects);
  if (!c0 || !Number.isFinite(c0[0]) || !Number.isFinite(c0[1])) return null;
  return [c0[0], c0[1]];
}
