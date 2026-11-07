// 生成日本 47 都道府县 GeoJSON(ECharts 地图数据)。
//
// 源: codeforgermany/click_that_hood · public/data/japan.geojson
//     (47 个都道府县,经纬度;町名日文 + name_english)
// 流程: 经纬度 → Mercator 投影(日本的标准画法)→ Douglas-Peucker 抽稀
//       → 坐标取整(方向不动,翻转在 maps.ts)
// 输出: src/render/vendor/japan.js
//
// 用法: npm run vendor:japan
import { writeFileSync } from 'node:fs';
import { geoMercator } from 'd3-geo';
import { projectGeoJson } from './geo-util.mjs';

const SRC = 'https://raw.githubusercontent.com/codeforgermany/click_that_hood/main/public/data/japan.geojson';
const OUT = new URL('../src/render/vendor/japan.js', import.meta.url).pathname;
const TARGET_H = 400;
const TOL = 0.02;

const res = await fetch(SRC);
if (!res.ok) throw new Error(`download failed: ${res.status} ${SRC}`);
const src = await res.json();
const features = src.features.map((f) => ({
  type: 'Feature',
  properties: { name: f.properties?.name_english || f.properties?.name, ja: f.properties?.name },
  geometry: f.geometry,
}));
if (features.length !== 47) throw new Error(`expected 47 prefectures, got ${features.length}`);

const proj = geoMercator();
const out = projectGeoJson(proj, { type: 'FeatureCollection', features }, TARGET_H, TOL);

const header = `/* eslint-disable */
/**
 * 日本 47 都道府县 GeoJSON —— ECharts 地图数据(vendored)。
 * 源: codeforgermany/click_that_hood · public/data/japan.geojson
 * 工具链: geoMercator → Douglas-Peucker 抽稀 → 坐标取整;坐标方向 = 投影原样(y 向下),翻转在 maps.ts
 * 再生成: npm run vendor:japan(脚本在 scripts/vendor-japan.mjs)
 * 纯数据/无依赖,Workers 可用。properties.name 是英文县名(Hokkaido/…),
 * properties.ja 是日文县名(北海道/…)。
 */
export const japanGeoJson = `;

writeFileSync(OUT, header + JSON.stringify(out) + ';\n');
console.log(`${OUT}: ${out.features.length} features, ${(JSON.stringify(out).length / 1024).toFixed(1)} KB`);
