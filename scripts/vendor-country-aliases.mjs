/**
 * 生成**国家别名表**:ECharts 世界地图的名字 ⇒ ISO alpha-2 ✓。
 *
 * 为什么需要:底图有两套名字 ——
 *   · Natural Earth(球面底图 ✓):`United States of America` / `Dem. Rep. Congo` …
 *   · ECharts 世界地图(平面图 ✓):`United States` / `Congo` …
 * ⇒ 同一个国家两套名 ⇒ 老链接(用 ECharts 那套名字的 ✓)在新底图上认不出 ✗
 * ⇒ 这张表把两套名对上 ✓(主键仍是 ISO alpha-2 ✓ 名字只是别名 ✓)。
 *
 * 做法:拿两份数据按「归一化的名字」配对(去括号/去点/去空格/去连字符 ✓)
 *      ⇒ 配不上的不写(宁可少一条,别配错 ✓)。
 *
 * 用法: node scripts/vendor-country-aliases.mjs
 */
import { writeFileSync } from 'node:fs';

const NE = new URL('../src/render/vendor/world-ne.js', import.meta.url).pathname;
const WORLD = new URL('../src/render/vendor/world.js', import.meta.url).pathname;
const OUT = new URL('../src/render/vendor/country-aliases.js', import.meta.url).pathname;

const ne = await import(NE);
const world = await import(WORLD);

/**
 * 两套底图名字对不上的那些(手工对 ✓ —— 归一化对不上的就一张张来 ✓)
 * 键:ECharts 世界地图的名字 ✓ 值:ISO alpha-2 ✓
 */
const MANUAL = {
  'W. Sahara': 'EH', 'Aland': 'AX', 'Fr. S. Antarctic Lands': 'TF',
  'Antigua and Barb.': 'AG', 'Bahamas': 'BS', 'Bosnia and Herz.': 'BA',
  'Central African Rep.': 'CF', 'China': 'CN', "Côte d'Ivoire": 'CI',
  'Dem. Rep. Congo': 'CD', 'Congo': 'CG', 'Cayman Is.': 'KY',
  'Czech Rep.': 'CZ', 'Dominican Rep.': 'DO', 'Falkland Is.': 'FK',
  'Faeroe Is.': 'FO', 'Gambia': 'GM', 'Eq. Guinea': 'GQ',
  'Heard I. and McDonald Is.': 'HM', 'Br. Indian Ocean Ter.': 'IO',
  'Korea': 'KR', 'Lao PDR': 'LA', 'Macedonia': 'MK', 'Dem. Rep. Korea': 'KP',
  'Fr. Polynesia': 'PF', 'S. Sudan': 'SS', 'S. Geo. and S. Sandw. Is.': 'GS',
  'Solomon Is.': 'SB', 'St. Pierre and Miquelon': 'PM', 'São Tomé and Principe': 'ST',
  'Swaziland': 'SZ', 'Timor-Leste': 'TL', 'United States': 'US',
};

/** 名字归一化:括号里的补充说明去掉、点/空格/连字符去掉、大小写统一 ✓ */
const norm = (s) => String(s ?? '')
  .replace(/\s*\(.*?\)\s*/g, '')
  .replace(/[.\-_'’]/g, '')
  .replace(/\s+/g, '')
  .trim()
  .toLowerCase();

/** NE 的名字 → alpha-2 ✓ */
const byName = new Map();
for (const f of ne.worldNeGeoJson.features) {
  if (!f.properties.iso2) continue;
  byName.set(norm(f.properties.name), f.properties.iso2);
}

const pairs = [];
for (const f of world.worldGeoJson.features) {
  const name = f.properties?.name;
  if (!name) continue;
  const iso2 = byName.get(norm(name)) ?? MANUAL[name];
  if (!iso2) continue;
  pairs.push([name, iso2]);
}

/** 一对多的要人工看一眼(同一个归一化名对上两个不同的国家 ⇒ 别写 ✓) */
const seen = new Map();
for (const [name, iso2] of pairs) {
  const k = norm(name);
  if (seen.has(k) && seen.get(k) !== iso2) {
    console.warn('⚠️ 撞名:', name, seen.get(k), iso2, '⇒ 跳过');
    continue;
  }
  seen.set(k, iso2);
}

const header = `/* eslint-disable */
/**
 * 国家别名表:ECharts 世界地图的名字 ⇒ ISO alpha-2 ✓
 * 主键仍是 ISO ✓(名字只是别名 ✓ —— 老链接照样能用 ✓)
 * 生成: scripts/vendor-country-aliases.mjs ✓
 */
export const countryAliases = ${JSON.stringify(Object.fromEntries(pairs))};
`;
writeFileSync(OUT, header);
console.log(`写 ${OUT}:${pairs.length} 条别名 ✓`);
