/**
 * 抽稀(Douglas-Peucker)—— **环要单独处理**。
 *
 * ## 为什么环要单独处理
 *
 * 多边形的环是**闭合**的(首点 = 末点)。直接拿开链的 DP 去跑:
 * 首尾两点重合 ⇒ 弦长为 0 ⇒ 环上每个点都「离弦 0」⇒ **整条海岸线塌成一条直线** ✗。
 *
 * 以前的底图就是这么来的:抽稀完只剩两三个点,脚本里的兜底又只留下 8 个 ⇒
 * 每条海岸线都是个八边形 ⇒ 「轮廓粗糙得像抽象画」✗(2026-11-25 用户报的就是这个 ✓)。
 *
 * ## 环的做法
 *
 * 去掉重复的收尾点 → 找**离起点最远**的那个点 → 切成两条开链 →
 * 各自 DP → 拼回去 → 补上收尾点。
 * (切在最远点 ⇒ 两条链都短 ⇒ 抽稀后的形状最接近原样 ✓)
 */

/** 开链的 DP(首尾不重合 ✓) */
export function dpOpen(pts, tol) {
  if (pts.length < 3) return pts;
  const keep = new Uint8Array(pts.length);
  keep[0] = 1;
  keep[pts.length - 1] = 1;
  const stack = [[0, pts.length - 1]];
  while (stack.length) {
    const [a, b] = stack.pop();
    let idx = -1;
    let max = 0;
    const [ax, ay] = pts[a];
    const [bx, by] = pts[b];
    const dx = bx - ax;
    const dy = by - ay;
    const len2 = dx * dx + dy * dy;
    for (let i = a + 1; i < b; i++) {
      const [px, py] = pts[i];
      let d;
      if (len2 === 0) d = Math.hypot(px - ax, py - ay);
      else {
        let t = ((px - ax) * dx + (py - ay) * dy) / len2;
        t = Math.max(0, Math.min(1, t));
        d = Math.hypot(px - (ax + t * dx), py - (ay + t * dy));
      }
      if (d > max) { max = d; idx = i; }
    }
    if (max > tol && idx > 0) { keep[idx] = 1; stack.push([a, idx], [idx, b]); }
  }
  return pts.filter((_, i) => keep[i]);
}

/**
 * 闭合环的抽稀 ✓
 *
 * 首尾重合的环(多边形 GeoJSON 的常态)与开链都吃得下 ✓。
 */
export function dpRing(pts, tol) {
  if (!pts.length) return pts;
  if (pts.length < 4) return pts;
  const first = pts[0];
  const last = pts[pts.length - 1];
  const closed = first[0] === last[0] && first[1] === last[1];
  const p = closed ? pts.slice(0, -1) : pts;
  if (p.length < 3) return pts;

  // 离起点最远的点 ⇒ 在那儿把环切成两条开链
  let far = 0;
  let fd = -1;
  for (let i = 1; i < p.length; i++) {
    const d = (p[i][0] - p[0][0]) ** 2 + (p[i][1] - p[0][1]) ** 2;
    if (d > fd) { fd = d; far = i; }
  }
  const a = dpOpen(p.slice(0, far + 1), tol);
  const b = dpOpen(p.slice(far), tol);
  const out = a.concat(b.slice(1));
  return closed ? out.concat([p[0]]) : out;
}
