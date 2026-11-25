// 生成世界地图的**经纬度**版本(给球面用)。
//
// src/render/vendor/world.js 是投影后的屏幕坐标(给二维地图用);
// 球面上的大陆要的是经纬度 —— 单独出一份,坐标粗一点(球上本来就小)。
//
// 用法: npm run vendor:world-geo
import { writeFileSync } from 'node:fs';
import { dpRing } from './simplify.mjs';

const SRC = 'https://cdn.jsdelivr.net/npm/echarts@4.9.0/map/json/world.json';
const TOL = 0.25;     // 抽稀(度)—— 球上够用

const res = await fetch(SRC);
if (!res.ok) throw new Error(`下载失败: ${res.status}`);
const geo = await res.json();

const ring = (r) => {
  // 环是闭合的 ⇒ 用 dpRing(切两段)⇒ 开链的 dp 会把海岸线塌成直线 ✗
  const s = dpRing(r.map(([lon, lat]) => [lon, lat]), TOL);
  return s.map(([lon, lat]) => [Math.round(lon * 100) / 100, Math.round(lat * 100) / 100]);
};
const walk = (c) => (Array.isArray(c[0]) && typeof c[0][0] === 'number' ? ring(c) : c.map(walk));

const features = geo.features.map((f) => ({
  type: 'Feature',
  properties: { name: f.properties?.name ?? '' },
  geometry: {
    type: f.geometry.type,
    coordinates: f.geometry.type === 'Polygon'
      ? f.geometry.coordinates.map(walk)
      : f.geometry.coordinates.map((poly) => poly.map(walk)),
  },
}));

const header = `/* eslint-disable */
/**
 * 世界地图的经纬度版本(给球面用)—— GeoJSON(vendored)。
 * 源: echarts@4.9.0 map/json/world.json
 * 抽稀: Douglas-Peucker(容差 ${TOL}°)→ 坐标取两位小数
 * 再生成: npm run vendor:world-geo(脚本在 scripts/vendor-world-geo.mjs)
 * 纯数据/无依赖,Workers 可用。properties.name = 国家/地区名(英文)
 */
export const worldSphericalGeoJson = `;
const file = new URL('../src/render/vendor/world-geo.js', import.meta.url).pathname;
writeFileSync(file, header + JSON.stringify({ type: 'FeatureCollection', features }) + ';\n');
console.log(`${file}: ${features.length} features, ${(JSON.stringify(features).length / 1024).toFixed(1)} KB`);
