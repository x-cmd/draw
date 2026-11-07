// 地图数据生成的公共件:抽稀 + 投影定尺 + y 翻转。
//
// 约定(踩过的坑,别改):
//   ① 投影产物是**屏幕坐标(y 向下)**;echarts 把地图坐标按「北为正」读
//      (实测:数据里 y=100 的点画在屏幕上方)。两边差一个翻转 —— 翻转统一在
//      src/render/maps.ts 里做(那里也是算纵横比的地方),数据文件保持投影原样。
//   ② d3 的 rotate 取负值才是"东在右":geoConicEqualArea().rotate([-105, 0])。
//      取正会把地图左右镜像(中国那版就翻过一回)。
//   ③ d3 的默认 scale 是给世界地图的,国家/区域图要自己按目标尺寸换算(两遍定尺)。

/** Douglas-Peucker:按「点到弦的垂距」丢点 */
export function dp(pts, tol) {
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

/**
 * 把经纬度 GeoJSON 投成平面坐标的 GeoJSON:
 * 投影 → 按 targetH 定尺居中 → 抽稀 → 取整(方向不动,翻转在 maps.ts)。
 * @param proj d3 投影实例(会被改 scale/translate)
 * @param geo FeatureCollection(经纬度)
 * @param targetH 目标高度(投影单位)
 * @param tol 抽稀容差(投影单位)
 */
export function projectGeoJson(proj, geo, targetH, tol) {
  proj.translate([0, 0]); // 量 bbox 时清零平移,免得把默认平移算进去
  const bboxOf = (coords) => {
    let x0 = Infinity, x1 = -Infinity, y0 = Infinity, y1 = -Infinity;
    const w = (v) => {
      if (!Array.isArray(v)) return;
      if (typeof v[0] === 'number') {
        const p = proj([v[0], v[1]]);
        if (p) {
          if (p[0] < x0) x0 = p[0];
          if (p[0] > x1) x1 = p[0];
          if (p[1] < y0) y0 = p[1];
          if (p[1] > y1) y1 = p[1];
        }
        return;
      }
      v.forEach(w);
    };
    w(coords);
    return [x0, x1, y0, y1];
  };
  const boxes = geo.features.map((f) => bboxOf(f.geometry.coordinates));
  const bx0 = Math.min(...boxes.map((b) => b[0])), bx1 = Math.max(...boxes.map((b) => b[1]));
  const by0 = Math.min(...boxes.map((b) => b[2])), by1 = Math.max(...boxes.map((b) => b[3]));
  const k = targetH / (by1 - by0);
  proj.scale(proj.scale() * k);
  proj.translate([(targetH * (bx1 - bx0) / (by1 - by0)) / 2 - bx0 * k, (targetH - (by1 - by0) * k) / 2 - by0 * k]);

  const transform = (coords) => {
    if (isPair(coords)) {
      const p = proj([coords[0], coords[1]]);
      return [Math.round(p[0]), Math.round(p[1])];
    }
    if (isRing(coords)) {
      const s = dp(coords.map(([lon, lat]) => proj([lon, lat])), tol);
      return s.length > 2 ? s.map(([x, y]) => [Math.round(x), Math.round(y)]) : [];
    }
    return coords.map(transform);
  };

  return {
    type: 'FeatureCollection',
    features: geo.features.map((f) => ({
      type: 'Feature',
      properties: f.properties,
      geometry: { type: f.geometry.type, coordinates: transform(f.geometry.coordinates) },
    })),
  };
}
