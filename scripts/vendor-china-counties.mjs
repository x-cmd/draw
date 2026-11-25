/**
 * 生成**中国县级**底图(省 → 市 → 县,三级)。
 *
 * 源:DataV 的行政区划边界(阿里云 geo.datav.aliyun.com ✓ 公开的 CC0 数据 ✓)
 *   https://geo.datav.aliyun.com/areas_v3/bound/<adcode>_full.json
 *   100000 = 全国(省)· 440000 = 广东省(市)· 440100 = 广州市(县区)
 *
 * 为什么要自己抓:市县这一层**没有现成的 ISO/公开打包**(Natural Earth 只到省 ✓)。
 * 抓法:先拿全国 ⇒ 再按省码拿市 ⇒ 再按市码拿县 ⇒ 三级拼成一张图 ✓。
 *
 * 投影:跟 china.js 同一套(Albers 等积圆锥,60°W/5°S–42°S ✓)⇒ 两张图能叠 ✓。
 *
 * 用法: node scripts/vendor-china-counties.mjs [--out <file>]
 */
import { writeFileSync } from 'node:fs';
import { geoConicEqualArea } from 'd3-geo';

/** 抽稀(环要切两段 —— 见 scripts/simplify.mjs ✓) */
import { dpRing } from './simplify.mjs';

const SRC = (adcode) => `https://geo.datav.aliyun.com/areas_v3/bound/${adcode}_full.json`;
const OUT = process.argv.includes('--out')
  ? process.argv[process.argv.indexOf('--out') + 1]
  : new URL('../src/render/vendor/china-counties.js', import.meta.url).pathname;

const TOL = Number(process.argv[2] ?? 0.6);   // 抽稀容差(投影单位 ≈ 像素)—— 县这一层点多,要比省松 ✓
const TARGET_H = 560;     // 目标画布高(跟 china.js 一样 ✓)
const isPair = (c) => Array.isArray(c) && c.length >= 2 && typeof c[0] === 'number';
const isRing = (c) => Array.isArray(c) && Array.isArray(c[0]) && isPair(c[0]);

// 下载的原始数据缓存在 /tmp ⇒ 重跑不用再抓一遍 ✓
const CACHE = '/tmp/dv-cache';
async function get(adcode) {
  const { mkdirSync, existsSync, readFileSync, writeFileSync } = await import('node:fs');
  mkdirSync(CACHE, { recursive: true });
  const f = `${CACHE}/${adcode}.json`;
  if (existsSync(f)) return JSON.parse(readFileSync(f, 'utf8'));
  const res = await fetch(SRC(adcode));
  if (!res.ok) throw new Error(`下载失败 ${adcode}: ${res.status}`);
  const j = await res.json();
  writeFileSync(f, JSON.stringify(j));
  return j;
}

/** 抽稀 + 投影 */
function makeProjector() {
  const proj = geoConicEqualArea().parallels([25, 47]).rotate([-105, 0]).center([0, 36]);
  return proj;
}

/** 两遍定尺:先量原始的 bbox,再按目标高缩放并居中 ✓(跟 china.js 同一套 ✓) */
function fit(proj, features) {
  let bx0 = Infinity, by0 = Infinity, bx1 = -Infinity, by1 = -Infinity;
  const walk = (c) => {
    if (isPair(c)) { const p = proj(c); bx0 = Math.min(bx0, p[0]); by0 = Math.min(by0, p[1]); bx1 = Math.max(bx1, p[0]); by1 = Math.max(by1, p[1]); return; }
    if (isRing(c)) { c.forEach(walk); return; }
    c.forEach(walk);
  };
  for (const f of features) walk(f.geometry.coordinates);
  const k = TARGET_H / (by1 - by0);
  proj.scale(proj.scale() * k);
  proj.translate([(TARGET_H * (bx1 - bx0) / (by1 - by0)) / 2 - bx0 * k, (TARGET_H - (by1 - by0) * k) / 2 - by0 * k]);
}

const transform = (proj) => (coords) => {
  if (isPair(coords)) { const p = proj([coords[0], coords[1]]); return [Math.round(p[0]), Math.round(p[1])]; }
  if (isRing(coords)) {
    const s = dpRing(coords.map(([lon, lat]) => proj([lon, lat])), TOL);
    return s.length > 2 ? s.map(([x, y]) => [Math.round(x), Math.round(y)]) : [];
  }
  return coords.map(transform(proj));
};

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// —— 1. 全国(省)——
console.log('拿全国…');
const country = await get('100000');
const provinces = country.features.map((f) => ({
  adcode: String(f.properties.adcode),
  name: f.properties.name,
  geometry: f.geometry,
}));
console.log(`  ${provinces.length} 个省级`);

// —— 2. 逐省拿市,逐市拿县 ——
const counties = [];
const cities = [];
let n = 0;
for (const p of provinces) {
  let cityGeo;
  try {
    cityGeo = await get(p.adcode);
  } catch {
    console.log(`  ${p.name}: 市这一层拿不到(直辖市?)⇒ 跳过`);
    continue;
  }
  for (const c of cityGeo.features) {
    const city = {
      adcode: String(c.properties.adcode),
      name: c.properties.name,
      province: p.name,
      provinceAdcode: p.adcode,
      geometry: c.geometry,
    };
    cities.push(city);
    n++;
    // 市下面再拿县
    let countyGeo;
    try {
      countyGeo = await get(city.adcode);
    } catch {
      continue;      // 有些市没有县这一层(直辖市的区算市 ✓)
    }
    for (const d of countyGeo.features) {
      counties.push({
        adcode: String(d.properties.adcode),
        name: d.properties.name,
        city: city.name,
        cityAdcode: city.adcode,
        province: p.name,
        provinceAdcode: p.adcode,
        geometry: d.geometry,
      });
    }
    await sleep(60);      // 别把人家站点打崩 ✓
  }
  process.stdout.write(`\r  ${p.name}(${cities.length} 市 / ${counties.length} 县)`);
}
console.log(`\n  共 ${cities.length} 市 · ${counties.length} 县`);

// —— 3. 投影 + 抽稀 ——
const proj = makeProjector();
fit(proj, cities);
const t = transform(proj);
const out = counties.map((c) => ({
  type: 'Feature',
  properties: {
    name: c.name,
    adcode: c.adcode,
    city: c.city,
    cityAdcode: c.cityAdcode,
    province: c.province,
    provinceAdcode: c.provinceAdcode,
  },
  geometry: { type: c.geometry.type, coordinates: t(c.geometry.coordinates) },
}));

const header = `/* eslint-disable */
/**
 * 中国县级底图(省 → 市 → 县)—— DataV 行政区划边界(v3)✓ 投影:Albers 等积圆锥 ✓
 * 画布:跟 china.js 同一套(${TARGET_H} 高,坐标是屏幕坐标、y 向下 ✓)
 * 键:properties.adcode(行政区划代码 ✓ 六位)/ name / city / province ✓
 * 源: geo.datav.aliyun.com/areas_v3(公开数据 ✓)
 */
export const chinaCountiesGeoJson = ${JSON.stringify({ type: 'FeatureCollection', features: out })};
`;
writeFileSync(OUT, header);
console.log(`写 ${OUT}:${out.length} 个县 ✓`);
