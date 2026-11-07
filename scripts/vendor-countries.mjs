// 生成若干国家的 GeoJSON(ECharts 地图数据)。
//
// 源: world-atlas@2 countries-50m.json(Natural Earth 简化国界,public domain)
//     —— 按国家名取,其余国家不要
// 流程: 经纬度 → 该国的标准 Albers(见下表)→ Douglas-Peucker 抽稀
//       → 坐标取整(方向不动,翻转在 src/render/maps.ts 里做)
// 输出: src/render/vendor/<key>.js
//
// 各国投影(中央经线 / 标准纬线):
//   BR 巴西   -60°E / 5°S-42°S   —— 巴西国家地理院的经典 Albers
//   AU 澳大利亚 132°E / 18°S-36°S
//   DE 德国   用欧洲那套(10°E / 35°N-65°N)
//   KR 韩国   Mercator(朝鲜半岛纬度不高,畸变小)
//
// 用法: npm run vendor:countries
import { writeFileSync } from 'node:fs';
import { geoConicEqualArea, geoMercator } from 'd3-geo';
import { feature } from 'topojson-client';
import { projectGeoJson } from './geo-util.mjs';

const SRC = 'https://cdn.jsdelivr.net/npm/world-atlas@2/countries-50m.json';
const TARGET_H = 400;
const TOL = 0.02;

// [地图名, world-atlas 里的国家名, 投影工厂, 额外说明]
const COUNTRIES = [
  ['BR', 'Brazil', () => geoConicEqualArea().parallels([-5, -42]).rotate([-60, 0]), '巴西经典 Albers(中央经线 60°W,标准纬线 5°S/42°S)'],
  ['AU', 'Australia', () => geoConicEqualArea().parallels([-18, -36]).rotate([132, 0]), '澳大利亚 Albers(中央经线 132°E,标准纬线 18°S/36°S)'],
  ['DE', 'Germany', () => geoConicEqualArea().parallels([35, 65]).rotate([-10, 0]), '欧洲 Albers(中央经线 10°E,标准纬线 35°N/65°N)'],
  ['KR', 'South Korea', () => geoMercator(), 'Mercator(朝鲜半岛纬度不高,畸变小)'],
];

const res = await fetch(SRC);
if (!res.ok) throw new Error(`download failed: ${res.status} ${SRC}`);
const topo = await res.json();
const all = feature(topo, topo.objects.countries);

for (const [key, country, projFactory, note] of COUNTRIES) {
  const picked = all.features.filter((f) => f.properties?.name === country);
  if (!picked.length) throw new Error(`country not found in world-atlas: ${country}`);
  const out = projectGeoJson(projFactory(), { type: 'FeatureCollection', features: picked }, TARGET_H, TOL);
  const header = `/* eslint-disable */
/**
 * ${country} —— ECharts 地图数据(vendored)。
 * 源: world-atlas@2 countries-50m.json(Natural Earth 简化国界,public domain)
 * 投影: ${note}
 * 工具链: Douglas-Peucker 抽稀 → 坐标取整;坐标方向 = 投影原样(y 向下),翻转在 maps.ts
 * 再生成: npm run vendor:countries(脚本在 scripts/vendor-countries.mjs)
 * 纯数据/无依赖,Workers 可用。properties.name = ${country}
 */
export const ${key.toLowerCase()}GeoJson = `;
  const file = new URL(`../src/render/vendor/${key.toLowerCase()}.js`, import.meta.url).pathname;
  writeFileSync(file, header + JSON.stringify(out) + ';\n');
  console.log(`${file}: ${out.features.length} features, ${(JSON.stringify(out).length / 1024).toFixed(1)} KB`);
}
