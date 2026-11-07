// 生成欧盟 27 国 GeoJSON(ECharts 地图数据)。
//
// 源: world-atlas@2 countries-50m.json(Natural Earth 简化国界,public domain)
//     —— 取欧盟 27 个成员国,其余国家不要
// 流程: 经纬度 → 欧洲 Albers 投影(中央经线 10°E,标准纬线 35°/65°N)
//       → Douglas-Peucker 抽稀 → 坐标取整(方向不动,翻转在 maps.ts)
// 输出: src/render/vendor/eu.js
//
// 用法: npm run vendor:eu
import { writeFileSync } from 'node:fs';
import { geoConicEqualArea } from 'd3-geo';
import { feature } from 'topojson-client';
import { projectGeoJson } from './geo-util.mjs';

const SRC = 'https://cdn.jsdelivr.net/npm/world-atlas@2/countries-50m.json';
const OUT = new URL('../src/render/vendor/eu.js', import.meta.url).pathname;
const TARGET_H = 400; // 投影单位
const TOL = 0.02;     // ≈2km(画布上远小于 1px)

// 欧盟 27 国(world-atlas 里的英文名)
const EU = [
  'Austria', 'Belgium', 'Bulgaria', 'Croatia', 'Cyprus', 'Czechia', 'Denmark',
  'Estonia', 'Finland', 'France', 'Germany', 'Greece', 'Hungary', 'Ireland',
  'Italy', 'Latvia', 'Lithuania', 'Luxembourg', 'Malta', 'Netherlands', 'Poland',
  'Portugal', 'Romania', 'Slovakia', 'Slovenia', 'Spain', 'Sweden',
];

const res = await fetch(SRC);
if (!res.ok) throw new Error(`download failed: ${res.status} ${SRC}`);
const topo = await res.json();
const all = feature(topo, topo.objects.countries);
const picked = all.features.filter((f) => EU.includes(f.properties?.name));
if (picked.length !== EU.length) {
  const got = new Set(picked.map((f) => f.properties.name));
  throw new Error(`missing EU members: ${EU.filter((n) => !got.has(n)).join(', ')}`);
}

// 法国的海外省(圭亚那/马提尼克等)与西班牙的加那利群岛远在欧洲之外,
// 留着会把整幅地图的 bbox 撑大、纵横比算歪、地图压扁 —— 只留欧洲本岛。
const EUROPE = { lon0: -15, lon1: 45, lat0: 30, lat1: 72 };
const inEurope = (ring) => {
  let x0 = Infinity, x1 = -Infinity, y0 = Infinity, y1 = -Infinity;
  for (const [lon, lat] of ring) {
    if (lon < x0) x0 = lon;
    if (lon > x1) x1 = lon;
    if (lat < y0) y0 = lat;
    if (lat > y1) y1 = lat;
  }
  return x1 >= EUROPE.lon0 && x0 <= EUROPE.lon1 && y1 >= EUROPE.lat0 && y0 <= EUROPE.lat1;
};
const ringsOf = (geom) => {
  const out = [];
  if (geom.type === 'Polygon') out.push(...geom.coordinates);
  else for (const poly of geom.coordinates) out.push(...poly);
  return out;
};
const trimmed = picked.map((f) => ({
  type: 'Feature',
  properties: f.properties,
  geometry: { type: 'MultiPolygon', coordinates: ringsOf(f.geometry).filter(inEurope).map((r) => [r]) },
})).filter((f) => f.geometry.coordinates.length);

const proj = geoConicEqualArea().parallels([35, 65]).rotate([-10, 0]);
const out = projectGeoJson(proj, { type: 'FeatureCollection', features: trimmed }, TARGET_H, TOL);

const header = `/* eslint-disable */
/**
 * 欧盟 27 国 GeoJSON —— ECharts 地图数据(vendored)。
 * 源: world-atlas@2 countries-50m.json(Natural Earth 简化国界,public domain),取欧盟 27 国
 * 工具链: geoConicEqualArea(标准纬线 35°/65°N,中央经线 10°E)→ Douglas-Peucker 抽稀
 *          → 坐标取整;坐标方向 = 投影原样(y 向下),翻转在 maps.ts
 * 再生成: npm run vendor:eu(脚本在 scripts/vendor-eu.mjs)
 * 纯数据/无依赖,Workers 可用。properties.name 是英文国名(France/Germany/…)。
 */
export const euGeoJson = `;

writeFileSync(OUT, header + JSON.stringify(out) + ';\n');
console.log(`${OUT}: ${out.features.length} features, ${(JSON.stringify(out).length / 1024).toFixed(1)} KB`);
