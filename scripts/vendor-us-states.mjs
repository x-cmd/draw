// 生成 US 各州 GeoJSON(ECharts 地图数据)。
//
// 源: us-atlas@3 states-albers-10m.json(US Census Bureau 边界,public domain)
//     —— Albers USA 投影的平面坐标(50 州 + DC)
// 流程: TopoJSON → GeoJSON(topojson-client)→ 抽稀(topojson-simplify,共享弧不裂)
//       → 坐标取整
// 输出: src/render/vendor/us-states.js(约 68KB,纯数据/无依赖,Workers 可用)
//
// 坐标方向:投影产物是**屏幕坐标(y 向下)**,而 echarts 把地图坐标按「北为正」读
// (实测:数据里 y=100 的点画在屏幕上方)。两边差一个翻转 —— 翻转统一在
// src/render/maps.ts 里做(那里也是算纵横比的地方),数据文件本身保持投影原样。
// 用法: npm run vendor:us-states
import { writeFileSync } from 'node:fs';
import { feature } from 'topojson-client';
import { presimplify, simplify } from 'topojson-simplify';

const SRC = 'https://cdn.jsdelivr.net/npm/us-atlas@3/states-albers-10m.json';
const OUT = new URL('../src/render/vendor/us-states.js', import.meta.url).pathname;
const TOL = 1;      // 抽稀容差(量化空间单位)
const DECIMALS = 1; // 坐标小数位(投影单位 ≈ 1.1km)

const res = await fetch(SRC);
if (!res.ok) throw new Error(`download failed: ${res.status} ${SRC}`);
const topo = await res.json();

// 抽稀走拓扑弧:相邻州共用同一条弧 → 抽稀后州界不裂
const simplified = simplify(presimplify(topo), TOL);
const geo = feature(simplified, simplified.objects.states);

const roundAll = (v, d) => (Array.isArray(v) ? v.map((x) => roundAll(x, d)) : Number(v.toFixed(d)));
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
 * 源: us-atlas@3 states-albers-10m.json(US Census Bureau 边界,public domain)
 * 工具链: topojson-client(feature)+ topojson-simplify(presimplify/simplify, tol=${TOL})
 *          → 坐标四舍五入到 ${DECIMALS} 位(投影单位 ≈ 1.1km)
 * 再生成: npm run vendor:us-states(脚本在 scripts/vendor-us-states.mjs)
 * 纯数据/无依赖,Workers 可用。50 州 + DC,Albers USA 投影(阿拉斯加/夏威夷为插图)。
 * 坐标方向:投影原样(y 向下);echarts 按北为正读,翻转在 src/render/maps.ts 里做。
 */
export const usStatesGeoJson = `;

writeFileSync(OUT, header + JSON.stringify(out) + ';\n');
console.log(`${OUT}: ${out.features.length} features, ${(JSON.stringify(out).length / 1024).toFixed(1)} KB`);
