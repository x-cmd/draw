// 球面图的「键」:城市是节点 id,国家是 ISO 码。
//
// **主键一律 ISO 3166**(用户拍板 ✓ #157/#155):
//   国家   = alpha-2(`CN` / `US` ✓)
//   一级分区 = `<alpha2>-<code>`(`CN-44` 广东、`US-UT` 犹他、`JP-13` 东京 ✓)
//   alpha-3(`CHN`)、NE 自己的码、名字 —— 全是**别名** ✓
//   单图内不带前缀的短写法(`44`)也是别名 ✓
//
// 名字只作 label,不参与寻址 ⇒ 改个名字不会把链接弄坏 ✓
// 同一份 gdp/pop 数据在世界地图(ECharts choropleth)和球面图上用同一把钥匙 ✓。

import { GLOBE_COUNTRIES, type GlobeCountry } from './globe-proj.js';

/** 一个国家能被叫出来的所有名字(按优先级排 ✓) */
export interface CountryKeys {
  /** ISO 3166-1 alpha-2(主键 ✓ 最短 ✓) */
  iso2: string;
  /** ISO 3166-1 alpha-3(别名 ✓) */
  iso3: string;
  /** NE 自己的三字母码(兜底:CYN / SOL / KOS ✓) */
  adm0: string;
  /** 世行码(跟 gdp/pop 的数据同源 ✓) */
  wb: string;
  /** 英文名(别名 + label ✓) */
  name: string;
}

/** 国家表(带 ISO 码 ✓) */
export const COUNTRIES: (GlobeCountry & CountryKeys)[] = GLOBE_COUNTRIES;

/** 索引:小写 → 国家 ✓ */
const INDEX = new Map<string, GlobeCountry>();
for (const c of COUNTRIES) {
  const keys = [c.iso2, c.iso3, c.adm0, c.wb, c.name];
  for (const k of keys) {
    if (!k) continue;
    const key = k.toLowerCase();
    if (!INDEX.has(key)) INDEX.set(key, c);
  }
}

/**
 * 解析一个国家的键 ⇒ 国家 ✓。
 *
 * 顺序:ISO 码(alpha-2 / alpha-3 / adm0 / wb)→ 名字(小写化 ✓)。
 * 找不到 ⇒ null(调用方自己决定怎么办 ✓ —— 老名字的翻译在站上那层做 ✓)。
 */
export function resolveCountry(key: string): GlobeCountry | null {
  const k = key.trim();
  if (!k) return null;
  return INDEX.get(k.toLowerCase()) ?? null;
}

/**
 * 一级分区的键:`<alpha2>-<code>` ✓
 *
 * 例:`CN-44`(广东)/ `US-UT`(犹他)/ `JP-13`(东京)/ `KR-42`(江原道)/ `BR-AC`(Acre)/ `AU-NSW`(新南威尔士)
 *
 * ⚠️ ISO 3166-2 只到**一级** —— 中国的市县、美国的县都不在里面。
 * 要下钻就沿用同一格式自己扩展:`CN-610100`(西安市)⇒ **这是我们的约定,不是标准** ✓
 */
export function regionKey(countryAlpha2: string, code: string): string {
  return `${countryAlpha2.toUpperCase()}-${code.toUpperCase()}`;
}

/** 分区键拆开 ⇒ [国家码, 分区码](不是分区键 ⇒ null ✓) */
export function parseRegionKey(key: string): [string, string] | null {
  const m = /^([A-Za-z]{2})[-_]([A-Za-z0-9]{1,5})$/.exec(key.trim());
  return m ? [m[1].toUpperCase(), m[2].toUpperCase()] : null;
}
