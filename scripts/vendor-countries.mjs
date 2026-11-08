// 生成若干国家的 GeoJSON(ECharts 地图数据)。
//
// 源: codeforgermany/click_that_hood 的行政区划
//     (不是整个国家轮廓 —— 只有国界的图没法按省着色,示例数据也对不上)
//       巴西 27 个州 / 澳大利亚 8 个州+领地 / 德国 16 个联邦州 / 韩国 17 个行政区
// 流程: 经纬度 → 该国的标准 Albers(见下表)→ Douglas-Peucker 抽稀
//       → 坐标取整(方向不动,翻转在 src/render/maps.ts 里做)
// 输出: src/render/vendor/<key>.js
//
// 各国投影(中央经线 / 标准纬线):
//   BR 巴西   -60°E / 5°S-42°S   —— 巴西国家地理院的经典 Albers
//   AU 澳大利亚 132°E / 18°S-36°S
//   DE 德国   欧洲那套(10°E / 35°N-65°N)
//   KR 韩国   Mercator(朝鲜半岛纬度不高,畸变小)
//
// 用法: npm run vendor:countries
import { writeFileSync } from 'node:fs';
import { geoConicEqualArea, geoMercator } from 'd3-geo';
import { projectGeoJson } from './geo-util.mjs';

// jsdelivr 的 gh 代理比 raw.githubusercontent 稳(大文件不会下到一半断)
const CTH = 'https://cdn.jsdelivr.net/gh/codeforgermany/click_that_hood@main/public/data';
const TARGET_H = 400;

function writeMap(key, out, note, source, label) {
  const header = `/* eslint-disable */
/**
 * ${label} —— ECharts 地图数据(vendored)。
 * 源: ${source}
 * 投影: ${note}
 * 工具链: Douglas-Peucker 抽稀 → 坐标取整;坐标方向 = 投影原样(y 向下),翻转在 maps.ts
 * 再生成: npm run vendor:countries(脚本在 scripts/vendor-countries.mjs)
 * 纯数据/无依赖,Workers 可用。properties.name = 行政区名
 */
export const ${key.toLowerCase()}GeoJson = `;
  const file = new URL(`../src/render/vendor/${key.toLowerCase()}.js`, import.meta.url).pathname;
  writeFileSync(file, header + JSON.stringify(out) + ';\n');
  console.log(`${file}: ${out.features.length} features, ${(JSON.stringify(out).length / 1024).toFixed(1)} KB`);
}

// —— 行政区划 ——
// tol 是 Douglas-Peucker 容差(投影单位,整幅图高 400)。源文件巴西有 3MB,
// 容差给大了图上就看不出棱角,给小了文件涨到几百 KB。
const SUBDIV = [
  ['BR', 'brazil-states', () => geoConicEqualArea().parallels([-5, -42]).rotate([-60, 0]), 0.12,
    '巴西 Albers(中央经线 60°W,标准纬线 5°S/42°S)', '巴西各州'],
  ['AU', 'australia', () => geoConicEqualArea().parallels([-18, -36]).rotate([132, 0]), 0.05,
    '澳大利亚 Albers(中央经线 132°E,标准纬线 18°S/36°S)', '澳大利亚各州'],
  ['DE', 'germany', () => geoConicEqualArea().parallels([35, 65]).rotate([-10, 0]), 0.02,
    '欧洲 Albers(中央经线 10°E,标准纬线 35°N/65°N)', '德国各联邦州'],
  ['KR', 'korea', () => geoMercator(), 0.02,
    'Mercator(朝鲜半岛纬度不高,畸变小)', '韩国各行政区'],
];

for (const [key, file, projFactory, tol, note, label] of SUBDIV) {
  const url = `${CTH}/${file}.geojson`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`download failed: ${res.status} ${url}`);
  const geo = await res.json();
  // 源数据里的名字笔误,按官方写法改
  for (const f of geo.features) {
    if (f.properties && f.properties.name === 'Jellanam-do') f.properties.name = 'Jeollanam-do';
  }
  const out = projectGeoJson(projFactory(), geo, TARGET_H, tol);
  writeMap(key, out, note, `codeforgermany/click_that_hood · ${file}.geojson`, label);
}
