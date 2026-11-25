// 球面图上「能着色的一块地」:国家 或 一级区划 —— 统一查找 ✓。
//
// 为什么要有这一层:URL 里的键有两种形状 ——
//   国家     `US` / `USA` / `United States`  ⇒  ISO 3166-1 ✓
//   一级区划 `CN-44` / `广东` / `44`        ⇒  ISO 3166-2 ✓
// ⇒ 画的时候只关心「这块地的多边形」✓ ⇒ 合成一个类型 ✓(服务端与浏览器端同一份 ✓)。

import { GLOBE_COUNTRIES, type GlobeCountry } from './globe-proj.js';
import { resolveCountry } from './globe-keys.js';
import { GLOBE_REGIONS, resolveRegion, type GlobeRegion } from './globe-regions.js';

/** 球面上可着色的一块地 */
export interface GlobeArea {
  /** 国家还是一级区划 ✓ */
  kind: 'country' | 'region';
  /** 规范化后的键(国家 `US` ✓ / 区划 `CN-44` ✓) */
  key: string;
  /** 显示名 ✓ */
  name: string;
  /** 几何(经纬度 ✓;[多边形][环][点] ✓) */
  polygon: number[][][][];
}

/**
 * 找一块地 ✓
 *
 * 顺序:先当国家查(`US` ✓)· 再当一级区划查(`CN-44` ✓)——
 * ⚠️ **先国家后区划**:只给两位码(`44`)时,区划表里能查到 ✓;
 * 而 `CN` 这种两字母的永远是国家 ✓(不会撞 ✓)。
 */
export function resolveGlobeArea(key: string): GlobeArea | null {
  const k = key.trim();
  if (!k) return null;
  const c: GlobeCountry | null = resolveCountry(k);
  if (c && c.iso2) {
    return { kind: 'country', key: c.iso2, name: c.name, polygon: c.polygon };
  }
  const r: GlobeRegion | null = resolveRegion(k);
  if (r) {
    return { kind: 'region', key: r.key, name: r.name, polygon: r.polygon };
  }
  return null;
}

/** 全部可着色的地(国家 + 区划 ✓)—— 图例/下拉用 ✓ */
export function allGlobeAreas(): GlobeArea[] {
  const countries: GlobeArea[] = GLOBE_COUNTRIES
    .filter((c) => c.iso2)
    .map((c) => ({ kind: 'country' as const, key: c.iso2, name: c.name, polygon: c.polygon }));
  const regions: GlobeArea[] = GLOBE_REGIONS.map((r) => ({
    kind: 'region' as const, key: r.key, name: r.name, polygon: r.polygon,
  }));
  return countries.concat(regions);
}
