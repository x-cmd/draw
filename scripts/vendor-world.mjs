// 生成世界地图 GeoJSON(ECharts 地图数据)。
//
// 源: echarts@4.9.0 的 world.json(217 个国家/地区,经纬度)
// 流程: 经纬度 → Mercator → Douglas-Peucker 抽稀 → 坐标取整
//       (方向不动,翻转在 src/render/maps.ts 里做)
// 输出: src/render/vendor/world.js
//
// 用法: npm run vendor:world
import { writeFileSync } from 'node:fs';
import { geoMercator } from 'd3-geo';
import { projectGeoJson } from './geo-util.mjs';

const SRC = 'https://cdn.jsdelivr.net/npm/echarts@4.9.0/map/json/world.json';
const TARGET_H = 420;
const TOL = 0.6;

const res = await fetch(SRC);
if (!res.ok) throw new Error(`下载失败: ${res.status}`);
const geo = await res.json();

const out = projectGeoJson(geoMercator(), geo, TARGET_H, TOL);
// 名字保留英文(跟其它地图一致);中文名另说
out.features = out.features.map((f) => ({
  ...f,
  properties: { name: f.properties?.name ?? '' },
}));

const header = `/* eslint-disable */
/**
 * 世界地图(217 个国家/地区)—— ECharts 地图数据(vendored)。
 * 源: echarts@4.9.0 map/json/world.json
 * 投影: Mercator(世界地图的常规投影)
 * 工具链: Douglas-Peucker 抽稀 → 坐标取整;坐标方向 = 投影原样(y 向下),翻转在 maps.ts
 * 再生成: npm run vendor:world(脚本在 scripts/vendor-world.mjs)
 * 纯数据/无依赖,Workers 可用。properties.name = 国家/地区名(英文)
 */
export const worldGeoJson = `;
const file = new URL('../src/render/vendor/world.js', import.meta.url).pathname;
writeFileSync(file, header + JSON.stringify(out) + ';\n');
console.log(`${file}: ${out.features.length} features, ${(JSON.stringify(out).length / 1024).toFixed(1)} KB`);
