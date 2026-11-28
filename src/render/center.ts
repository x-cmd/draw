// 以某个国家/地方为中心画世界地图(center=CN / center=116,30)。
//
// 两个视图都要它:
//   · 平面地图 —— echarts 的 map series 有 center + zoom(单位是地图自己的坐标,
//     世界地图是 Mercator 投影过的,所以要用投影后的坐标)。
//   · 3D 地球仪 —— 球只能转,转的角度 = alpha/beta(实测:alpha = -90 - 经度,
//     beta = 纬度)。
import { loadMapGeoJson } from './maps.js';
import { WORLD_COUNTRIES } from '../world-data.js';

/** 常用简称 → 数据里的国家名 */
const ALIAS: Record<string, string> = {
  CN: 'China', US: 'United States', JP: 'Japan', DE: 'Germany', FR: 'France',
  GB: 'United Kingdom', RU: 'Russia', IN: 'India', BR: 'Brazil', CA: 'Canada',
  AU: 'Australia', KR: 'South Korea', KP: 'Dem. Rep. Korea', MX: 'Mexico',
  IT: 'Italy', ES: 'Spain', NL: 'Netherlands', SE: 'Sweden', CH: 'Switzerland',
  SG: 'Singapore', ID: 'Indonesia', TR: 'Turkiye', SA: 'Saudi Arabia',
  ZA: 'South Africa', AR: 'Argentina', NG: 'Nigeria', EG: 'Egypt',
};

export interface Center {
  lat: number;
  lon: number;
  /** 数据里的国家名(经纬度的来源) */
  name: string;
}

/** 归一化:去空格与标点,小写 —— "United States" 与 "unitedstates" 当同一个 */
const norm = (s: string): string => s.toLowerCase().replace(/[^a-z]/g, '');

/** 名字 → 经纬度(数据里那份) */
export function centerByName(name: string): Center | undefined {
  const key = norm(name);
  const hit = WORLD_COUNTRIES.find((c) => norm(c.n) === key);
  if (hit) return { lat: hit.lat, lon: hit.lon, name: hit.n };
  const alias = ALIAS[key.toUpperCase()];
  if (!alias) return undefined;
  const alt = WORLD_COUNTRIES.find((c) => norm(c.n) === norm(alias));
  return alt ? { lat: alt.lat, lon: alt.lon, name: alt.n } : undefined;
}

/** center= 的值 → 经纬度(国家名 或 lon,lat) */
export function parseCenter(raw: string | null): Center | undefined {
  if (!raw) return undefined;
  const s = raw.trim();
  if (!s) return undefined;
  if (s.includes(',')) {
    const [lon, lat] = s.split(',').map((v) => Number(v.trim()));
    if (Number.isFinite(lon) && Number.isFinite(lat)) return { lon, lat, name: `${lon},${lat}` };
    return undefined;
  }
  return centerByName(s);
}

/**
 * 球面镜头:转到某地正对着看。
 * 实测(拿地球照片试的):alpha = -90 - 经度,beta = 纬度。
 */
export function globeCamera(center: Center): { alpha: number; beta: number } {
  return { alpha: -90 - center.lon, beta: center.lat };
}

/**
 * 投影后的国家重心 —— 平面地图的 center 要用**投影坐标**(世界地图是
 * Mercator 投影过的,直接给经纬度会偏到地图外面去)。
 *
 * 取**最大那一块**的面积重心(不是所有顶点的平均):美国有阿拉斯加、夏威夷,
 * 顶点平均会把重心拉到阿拉斯加去 ✗ —— 地图就不以美国为中心了。
 */
export async function projectedCenter(name: string): Promise<[number, number] | undefined> {
  const geo = (await loadMapGeoJson('WORLD')) as {
    features?: { properties?: { name?: string }; geometry?: { coordinates?: unknown } }[];
  };
  const norm2 = (s: string): string => s.toLowerCase().replace(/[^a-z]/g, '');
  const feature = (geo.features ?? []).find((f) => norm2(f.properties?.name ?? '') === norm2(name));
  if (!feature) return undefined;
  // 所有环(多边形的外环 + 多块多边形):挑面积最大的那块
  const rings: number[][][] = [];
  const collect = (v: unknown): void => {
    if (!Array.isArray(v) || !v.length) return;
    if (typeof v[0] === 'number') return;
    if (Array.isArray(v[0]) && typeof (v[0] as unknown[])[0] === 'number') {
      rings.push(v as number[][]);
      return;
    }
    v.forEach(collect);
  };
  collect(feature.geometry?.coordinates);
  if (!rings.length) return undefined;
  const centroid = (ring: number[][]): { x: number; y: number; area: number } | undefined => {
    let a = 0, cx = 0, cy = 0;
    for (let i = 0, n = ring.length; i < n; i++) {
      const [x0, y0] = ring[i];
      const [x1, y1] = ring[(i + 1) % n];
      const f = x0 * y1 - x1 * y0;
      a += f;
      cx += (x0 + x1) * f;
      cy += (y0 + y1) * f;
    }
    a /= 2;
    if (!a) return undefined;
    return { x: cx / (6 * a), y: cy / (6 * a), area: Math.abs(a) };
  };
  let best: { x: number; y: number; area: number } | undefined;
  for (const ring of rings) {
    const c = centroid(ring);
    if (c && (!best || c.area > best.area)) best = c;
  }
  if (!best) return undefined;
  return [best.x, best.y];
}
