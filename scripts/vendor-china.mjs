// 生成中国各省市 GeoJSON(ECharts 地图数据)。
//
// 源: DataV.GeoAtlas(阿里云) https://geo.datav.aliyun.com/areas_v3/bound/100000_full.json
//     —— 含 34 个省级行政区 + 南海诸岛插图;经纬度坐标
// 流程: 经纬度 → 中国标准 Albers 投影(中央经线 105°E,标准纬线 25°/47°N)
//       → Douglas-Peucker 抽稀(≈1.3km,画布上远小于 1px)
//       → 坐标取整(投影单位)
// 输出: src/render/vendor/china.js(约 240KB,纯数据/无依赖,Workers 可用)
//
// 投影方向:d3 的 rotate 取 [-105, 0](不是 +105 —— 取反会把地图左右镜像)。
// d3 输出的 y 是北正(向上),echarts 按 SVG 约定 y 向下画 —— 所以**要再翻一次 y**
// (us-states 那份 us-atlas 同理,也是翻 y 才对)。
// 用法: npm run vendor:china
import { writeFileSync } from 'node:fs';
import { geoConicEqualArea } from 'd3-geo';

const SRC = 'https://geo.datav.aliyun.com/areas_v3/bound/100000_full.json';
const OUT = new URL('../src/render/vendor/china.js', import.meta.url).pathname;
const TARGET_H = 440; // 投影后的目标高度(投影单位),宽度按纵横比自然得出
const TOL = 0.012;    // 抽稀容差(投影单位,≈1.3km)

/** 州名 → 短名(「广东省」→「广东」;数据里带「省/市/自治区/特别行政区」后缀) */
const SHORT = {
  北京市: '北京', 天津市: '天津', 河北省: '河北', 山西省: '山西', 内蒙古自治区: '内蒙古',
  辽宁省: '辽宁', 吉林省: '吉林', 黑龙江省: '黑龙江', 上海市: '上海', 江苏省: '江苏',
  浙江省: '浙江', 安徽省: '安徽', 福建省: '福建', 江西省: '江西', 山东省: '山东',
  河南省: '河南', 湖北省: '湖北', 湖南省: '湖南', 广东省: '广东', 海南省: '海南',
  四川省: '四川', 贵州省: '贵州', 云南省: '云南', 陕西省: '陕西', 甘肃省: '甘肃',
  青海省: '青海', 台湾省: '台湾', 广西壮族自治区: '广西', 西藏自治区: '西藏',
  宁夏回族自治区: '宁夏', 新疆维吾尔自治区: '新疆', 香港特别行政区: '香港',
  澳门特别行政区: '澳门',
};

/** Douglas-Peucker:按「点到弦的垂距」丢点 */
function dp(pts, tol) {
  if (pts.length < 3) return pts;
  const keep = new Uint8Array(pts.length);
  keep[0] = keep[pts.length - 1] = 1;
  const stack = [[0, pts.length - 1]];
  while (stack.length) {
    const [a, b] = stack.pop();
    let maxD = -1, idx = -1;
    const [ax, ay] = pts[a], [bx, by] = pts[b];
    const dx = bx - ax, dy = by - ay, len2 = dx * dx + dy * dy;
    for (let i = a + 1; i < b; i++) {
      const [px, py] = pts[i];
      let d;
      if (len2 === 0) d = Math.hypot(px - ax, py - ay);
      else {
        let t = ((px - ax) * dx + (py - ay) * dy) / len2;
        t = Math.max(0, Math.min(1, t));
        d = Math.hypot(px - (ax + t * dx), py - (ay + t * dy));
      }
      if (d > maxD) { maxD = d; idx = i; }
    }
    if (maxD > tol && idx > 0) { keep[idx] = 1; stack.push([a, idx], [idx, b]); }
  }
  return pts.filter((_, i) => keep[i]);
}

const isPair = (v) => Array.isArray(v) && typeof v[0] === 'number';
const isRing = (v) => Array.isArray(v) && Array.isArray(v[0]) && typeof v[0][0] === 'number';

const res = await fetch(SRC);
if (!res.ok) throw new Error(`download failed: ${res.status} ${SRC}`);
const g = await res.json();

const proj = geoConicEqualArea().parallels([25, 47]).rotate([-105, 0]);
proj.translate([0, 0]); // 量 bbox 时清零平移,免得把默认平移算进去

// 两遍定尺:d3 默认 scale 是给世界地图的,国家图要自己按目标高度换算
const bboxOf = (coords) => {
  let x0 = Infinity, x1 = -Infinity, y0 = Infinity, y1 = -Infinity;
  const w = (v) => {
    if (!Array.isArray(v)) return;
    if (typeof v[0] === 'number') {
      const p = proj([v[0], v[1]]);
      if (p) { if (p[0] < x0) x0 = p[0]; if (p[0] > x1) x1 = p[0]; if (p[1] < y0) y0 = p[1]; if (p[1] > y1) y1 = p[1]; }
      return;
    }
    v.forEach(w);
  };
  w(coords);
  return [x0, x1, y0, y1];
};
const boxes = g.features.map((f) => bboxOf(f.geometry.coordinates));
const bx0 = Math.min(...boxes.map((b) => b[0])), bx1 = Math.max(...boxes.map((b) => b[1]));
const by0 = Math.min(...boxes.map((b) => b[2])), by1 = Math.max(...boxes.map((b) => b[3]));
const k = TARGET_H / (by1 - by0);
proj.scale(proj.scale() * k);
proj.translate([(TARGET_H * (bx1 - bx0) / (by1 - by0)) / 2 - bx0 * k, (TARGET_H - (by1 - by0) * k) / 2 - by0 * k]);

function transform(coords) {
  if (isPair(coords)) { const p = proj([coords[0], coords[1]]); return [Math.round(p[0]), Math.round(p[1])]; }
  if (isRing(coords)) {
    const s = dp(coords.map(([lon, lat]) => proj([lon, lat])), TOL);
    return s.length > 2 ? s.map(([x, y]) => [Math.round(x), Math.round(y)]) : [];
  }
  return coords.map(transform);
}

const out = {
  type: 'FeatureCollection',
  features: g.features.map((f) => {
    const full = f.properties.name || '南海诸岛';
    return {
      type: 'Feature',
      properties: { name: SHORT[full] ?? full, full, adcode: f.properties.adcode },
      geometry: { type: f.geometry.type, coordinates: transform(f.geometry.coordinates) },
    };
  }),
};

const header = `/* eslint-disable */
/**
 * 中国各省市 GeoJSON —— ECharts 地图数据(vendored)。
 * 源: DataV.GeoAtlas 100000_full.json(34 个省级行政区 + 南海诸岛插图)
 * 工具链: geoConicEqualArea(标准纬线 25°/47°N,中央经线 105°E)→ Douglas-Peucker 抽稀
 *          → 坐标取整;坐标方向 = 投影原样(y 向下),翻转在 maps.ts
 * 再生成: npm run vendor:china(脚本在 scripts/vendor-china.mjs)
 * 纯数据/无依赖,Workers 可用。properties.name 是简称(北京/广东/…),
 * properties.full 是全称(北京市/广东省/…)。
 */
export const chinaGeoJson = `;

writeFileSync(OUT, header + JSON.stringify(out) + ';\n');
console.log(`${OUT}: ${out.features.length} features, ${(JSON.stringify(out).length / 1024).toFixed(1)} KB`);
