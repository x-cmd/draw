// 球面图的**一级区划**(省/州/府)—— 主键用 ISO 3166-2 ✓。
//
// 键的规矩(全站统一 ✓):
//   国家   = alpha-2(`CN` / `US` ✓)
//   一级区划 = `<alpha2>-<code>`(`CN-44` 广东、`US-UT` 犹他、`JP-13` 东京 ✓)
//   alpha-3 / 名字 / 旧名字 —— 全是**别名** ✓(改了名字不会把链接弄坏 ✓)
//
// ⚠️ ISO 3166-2 只到**一级** —— 中国的市县不在里面。
// 要下钻就沿用同一格式自己扩展(`CN-610100` 西安市)⇒ **这是我们的约定,不是标准** ✓
//
// 现在收录:中国 34 个一级区划(ISO 3166-2:CN ✓ —— 源:DataV 行政区划边界 ✓)。

import { chinaProvincesGeoJson } from './vendor/china-provinces.js';

/** 一级区划 */
export interface GlobeRegion {
  /** ISO 3166-2 的键(`CN-44` ✓) */
  key: string;
  /** 国家码(`CN` ✓) */
  country: string;
  /** 两位码(`44` ✓) */
  code: string;
  /** 显示名(广东 ✓) */
  name: string;
  /** 别名(旧名字/别名 ⇒ 老链接照样能用 ✓) */
  aliases: string[];
  /** 几何(经纬度 ✓;[多边形][环][点] ✓) */
  polygon: number[][][][];
}

/** 短名:去掉「省/市/自治区/特别行政区」这类后缀 ⇒ 广东 / 内蒙古 / 香港 ✓ */
function shortName(name: string): string {
  const m = name.match(/^(.*?)(省|市|自治区|特别行政区)/);
  return m ? m[1] : name;
}

interface RegionProps {
  name?: string;
  code?: string;
  key?: string;
  adcode?: string;
}

/** 中国的一级区划 ✓ */
export const GLOBE_REGIONS: GlobeRegion[] = (chinaProvincesGeoJson as unknown as {
  features: { properties: RegionProps; geometry: { coordinates: number[][][][] } }[];
}).features
  .filter((f) => f.properties.key)
  .map((f) => {
    const key = f.properties.key ?? '';
    const [country, code] = key.split('-');
    return {
      key,
      country,
      code,
      name: f.properties.name ?? '',
      // 别名:adcode(六位码 ✓)· 不带前缀的两位码 ✓ · 短名(广东 ✓ / 内蒙古 ✓)
      // —— 老链接几种写法都认 ✓
      aliases: [f.properties.adcode ?? '', code, shortName(f.properties.name ?? '')].filter(Boolean),
      polygon: f.geometry.coordinates,
    };
  });

/** 索引:小写 → 区划 ✓(键 / 名字 / 别名全收 ✓) */
const INDEX = new Map<string, GlobeRegion>();
for (const r of GLOBE_REGIONS) {
  for (const k of [r.key, r.name, ...r.aliases]) {
    if (!k) continue;
    const key = k.toLowerCase();
    if (!INDEX.has(key)) INDEX.set(key, r);
  }
}

/**
 * 解析一个一级区划的键 ⇒ 区划 ✓
 *
 * 认:ISO 键(`CN-44` ✓)· 不带前缀的两位码(`44` ✓)· 名字(`广东` ✓)· 别名 ✓
 */
export function resolveRegion(key: string): GlobeRegion | null {
  const k = key.trim();
  if (!k) return null;
  const hit = INDEX.get(k.toLowerCase());
  if (hit) return hit;
  // 只给两位码 ⇒ 按国家猜?⇒ 不猜(猜错比不认更坏 ✓)
  return null;
}
