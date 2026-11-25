// 生成世界地图 GeoJSON(ECharts 地图数据)。
//
// 投影:**自然地球投影**(Natural Earth 1,等积)—— 站里那张世界地图就用它。
// 为什么是等积:等积投影不骗面积(国家的相对大小是真的 ✓),极区也不像圆柱投影那样
// 炸开(墨卡托里格陵兰跟非洲差不多大 ✗);边缘是圆角,比方格世界好看 ✓。
//
// 源: echarts@4.9.0 的 world.json(217 个国家/地区,经纬度)
// 流程: 经纬度 → Natural Earth → **在日界线上切开** → Douglas-Peucker 抽稀 → 坐标取整
//       (方向不动,翻转在 src/render/maps.ts 里做)
// 输出: src/render/vendor/world.js
//
// 日界线上切开:跨日界线的国家(俄罗斯楚科奇、新西兰、斐济、美国阿留申)在投影后
// 会横跨整张图 —— 不但是一条横贯的脏东西,还会把底图外接框撑成「整个世界宽」,
// 地图的位置跟着歪(以前那张世界地图为什么写死布局,就是这个原因)。
//
// 用法: npm run vendor:world
import { writeFileSync } from 'node:fs';
import { geoNaturalEarth1, geoPath } from 'd3-geo';
import { dpRing, fitProjection } from './geo-util.mjs';

const SRC = 'https://cdn.jsdelivr.net/npm/echarts@4.9.0/map/json/world.json';
const TARGET_H = 360;   // 自然地球投影的纵横比 ≈ 2.3,矮一点省体积
const TOL = 0.6;        // 抽稀容差(投影单位)

const res = await fetch(SRC);
if (!res.ok) throw new Error(`下载失败: ${res.status}`);
const geo = await res.json();

// 转到本初子午线上(rot 0)—— 跟站里其他地图同一套「左西右东」的习惯
const proj = geoNaturalEarth1().rotate([0, 0]);
fitProjection(proj, geo, TARGET_H);

/** 有向面积(投影后的屏幕坐标,y 向下):正负号用来分外环/洞 */
function signedArea(ring) {
  let a = 0;
  for (let i = 0, n = ring.length; i < n; i++) {
    const [x1, y1] = ring[i];
    const [x2, y2] = ring[(i + 1) % n];
    a += x1 * y2 - x2 * y1;
  }
  return a / 2;
}

/** 路径串 → 环(每个 M…Z 是一段环)—— d3 的 geoPath 在日界线上把多边形切开了 */
function ringsOf(d) {
  const rings = [];
  let cur = null;
  for (const m of d.matchAll(/([ML])([^MLZ]+)/g)) {
    if (m[1] === 'M') {
      cur = [];
      rings.push(cur);
    }
    const nums = m[2].trim().split(/[\s,]+/).map(Number);
    for (let i = 0; i + 1 < nums.length; i += 2) cur.push([nums[i], nums[i + 1]]);
  }
  return rings.filter((r) => r.length > 2);
}

/** 一串环 → 多边形(外环 + 洞);按绕向分:外环开一个多边形,洞挂上去 */
function toPolygons(rings) {
  const polys = [];
  for (const ring of rings) {
    // 环是闭合的 ⇒ 必须用 dpRing(切两段)⇒ 开链的 dp 会把海岸线塌成直线 ✗
    const simplified = dpRing(ring, TOL);
    if (simplified.length <= 2) continue;
    const s = simplified.map(([x, y]) => [Math.round(x), Math.round(y)]);
    // 投影后缩成一条线的(日界线上切出来的小片)丢掉:画不出来,却会把外接框撑宽
    if (Math.max(...s.map((p) => p[0])) - Math.min(...s.map((p) => p[0])) < 0.5
      && Math.max(...s.map((p) => p[1])) - Math.min(...s.map((p) => p[1])) < 0.5) continue;
    if (signedArea(s) < 0) {
      // 洞(逆时针)—— 挂到最近的外环上
      const host = polys.find((p) => p.length === 1);
      if (host) host.push(s);
      else polys.push([s]);
    } else {
      polys.push([s]);
    }
  }
  return polys;
}

const path = geoPath(proj);
const features = [];
for (const f of geo.features) {
  const polygons = toPolygons(ringsOf(path(f.geometry) ?? ''));
  if (!polygons.length) continue;
  features.push({
    type: 'Feature',
    properties: { name: f.properties?.name ?? '' },
    geometry: { type: 'MultiPolygon', coordinates: polygons },
  });
}

const out = { type: 'FeatureCollection', features };

const header = `/* eslint-disable */
/**
 * 世界地图(217 个国家/地区)—— ECharts 地图数据(vendored)。
 * 源: echarts@4.9.0 map/json/world.json
 * 投影: Natural Earth 1(自然地球投影,等积)—— 面积不骗人、极区不炸、边缘圆角
 * 日界线: 跨日界线的国家在日界线上切开(楚科奇/新西兰/斐济/阿留申),不横跨整张图
 * 工具链: d3 geoPath(投影+日界线切割) → Douglas-Peucker 抽稀 → 坐标取整
 *         坐标方向 = 投影原样(y 向下),翻转在 maps.ts
 * 再生成: npm run vendor:world(脚本在 scripts/vendor-world.mjs)
 * 纯数据/无依赖,Workers 可用。properties.name = 国家/地区名(英文)
 */
export const worldGeoJson = `;
const file = new URL('../src/render/vendor/world.js', import.meta.url).pathname;
writeFileSync(file, header + JSON.stringify(out) + ';\n');
console.log(`${file}: ${out.features.length} features, ${(JSON.stringify(out).length / 1024).toFixed(1)} KB`);
