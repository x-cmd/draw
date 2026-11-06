// 生成 US 各州 GeoJSON(ECharts 地图数据):Albers USA 投影,50 州 + DC。
//
// 源: us-atlas@3 states-albers-10m.json
//     (US Census Bureau 边界数据,public domain;https://github.com/topojson/us-atlas)
// 流程: TopoJSON → GeoJSON(topojson-client feature)
//       → 抽稀(topojson-simplify presimplify/simplify, tol=1 —— 共享弧保持一致,州界无缝)
//       → 坐标四舍五入到 0.1(投影单位 ≈ 1.1km;760px 宽的图上 ≈ 0.08px,肉眼无损)
// 输出: src/render/vendor/us-states.js(约 68KB,纯数据/无依赖,Workers 可用)
//
// echarts 6 不再自带地图数据(v4 的 map/ 目录已从 npm 包移除),地图 GeoJSON 随包分发。
// 用法: npm run vendor:us-states
import { writeFileSync } from 'node:fs';
import { feature } from 'topojson-client';
import { presimplify, simplify } from 'topojson-simplify';

const SRC = 'https://cdn.jsdelivr.net/npm/us-atlas@3/states-albers-10m.json';
const OUT = new URL('../src/render/vendor/us-states.js', import.meta.url).pathname;
const TOL = 1;      // 抽稀容差(投影单位;1 ≈ 1.1km)
const DECIMALS = 1; // 坐标小数位

const roundAll = (v, d) => (Array.isArray(v) ? v.map((x) => roundAll(x, d)) : Number(v.toFixed(d)));

const res = await fetch(SRC);
if (!res.ok) throw new Error(`download failed: ${res.status} ${SRC}`);
const topo = await res.json();

// simplifly 走拓扑弧:相邻州共用同一条弧 → 抽稀后州界不裂
const simplified = simplify(presimplify(topo), TOL);
const geo = feature(simplified, simplified.objects.states);

const out = {
  type: 'FeatureCollection',
  features: geo.features.map((f) => ({
    type: 'Feature',
    properties: { name: f.properties.name },
    geometry: { type: f.geometry.type, coordinates: roundAll(f.geometry.coordinates, DECIMALS) },
  })),
};

const header = `/* eslint-disable */
/**
 * US 各州 GeoJSON —— ECharts 地图数据(vendored)。
 * 源: us-atlas@3 states-albers-10m.json(US Census Bureau 边界数据,public domain)
 *     https://github.com/topojson/us-atlas
 * 工具链: topojson-client(feature) + topojson-simplify(presimplify/simplify, tol=${TOL})
 *          → 坐标四舍五入到 ${DECIMALS} 位(投影单位 ≈ 1.1km)
 * 再生成: npm run vendor:us-states(脚本在 scripts/vendor-us-states.mjs)
 * 纯数据/无依赖,Workers 可用。50 州 + DC,Albers USA 投影(阿拉斯加/夏威夷为插图)。
 * 坐标系是投影平面坐标(x/y),ECharts 直接当平面坐标渲染 —— 无需再投影。
 */
export const usStatesGeoJson = `;

writeFileSync(OUT, header + JSON.stringify(out) + ';\n');
console.log(`${OUT}: ${out.features.length} features, ${(JSON.stringify(out).length / 1024).toFixed(1)} KB`);
