// 抽稀 —— **一份实现**,脚本与运行时共用 ✓
// (scripts/simplify.mjs 直接 re-export 这里 ✓ —— 别再抄一份 ✗)
//
// ① dpOpen / dpRing:Douglas-Peucker。
//    **环要单独处理**:多边形的环是闭合的(首点=末点)⇒ 首尾弦长 0 ⇒
//    环上每个点都「离弦 0」⇒ 整条海岸线塌成一条直线 ✗(八边形轮廓的来源 ✓)。
//    环的做法:去掉重复的收尾点 ⇒ 在离起点最远的点上切成两条开链 ⇒ 各自 DP ⇒ 拼回去 ✓。
//
// ② simplifyPath:把 **投影后的** path 串在像素空间里抽稀 ——
//    形状不变(容差给的是像素 ✓)但字串小一半 ✓(50m 的底图投影出来 300KB+ ⇒ 太大 ✗)。

/** 开链的 DP(首尾不重合 ✓) */
export function dpOpen(pts: number[][], tol: number): number[][] {
  if (pts.length < 3) return pts;
  const keep = new Uint8Array(pts.length);
  keep[0] = 1;
  keep[pts.length - 1] = 1;
  const stack: [number, number][] = [[0, pts.length - 1]];
  while (stack.length) {
    const [a, b] = stack.pop()!;
    let idx = -1;
    let max = 0;
    const [ax, ay] = pts[a];
    const [bx, by] = pts[b];
    const dx = bx - ax;
    const dy = by - ay;
    const len2 = dx * dx + dy * dy;
    for (let i = a + 1; i < b; i++) {
      const [px, py] = pts[i];
      let d: number;
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

/** 闭合环的抽稀 ✓(首尾重合的环与开链都吃得下 ✓) */
export function dpRing(pts: number[][], tol: number): number[][] {
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

/**
 * path 串 → 像素空间抽稀(容差单位:像素 ✓)
 *
 * 为什么在**投影之后**抽:源数据抽的是经纬度(度数),而画布上想要的是**像素** ✓
 * —— 度数容差跟画布大小、缩放都对不上 ✓ ⇒ 出图时按像素再抽一遍 ⇒
 * 形状一点不变(容差 <1px ✓)字串小一半 ✓。
 */
export function simplifyPath(d: string, tol: number): string {
  if (!d || tol <= 0) return d;
  const parts = d.split('M').slice(1);
  if (!parts.length) return d;
  const out: string[] = [];
  for (const sub of parts) {
    const closed = /Z\s*$/.test(sub);
    const pts: number[][] = [];
    for (const m of sub.matchAll(/(-?[\d.]+),(-?[\d.]+)/g)) pts.push([Number(m[1]), Number(m[2])]);
    if (pts.length < 3) { out.push(`M${sub}`); continue; }
    const s = dpOpen(pts, tol);
    const body = s.map((q, i) => `${i ? 'L' : ''}${q[0]},${q[1]}`).join('');
    out.push(`M${body}${closed ? 'Z' : ''}`);
  }
  return out.join('');
}
