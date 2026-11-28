// 节点要接几条线 —— 摆位的时候就知道(ctx.edges 在手)。
//
// 端口是资源,面是容器:一张脸只有那么长,接不下就得让节点长高,
// 不然端口只能挤在一起(箭头叠成一条黑杠)。
//
// 接几条线 → 要占多长的脸:端口会分摊到几张脸上,按「一半」估(上界)。

import { PORT_GAP } from '@x-cmd/draw';

/** 端口离脸的两端留多少 */
const FACE_MARGIN = 8;

/** 每个节点接几条线(进 + 出) */
export function portDemand(
  nodes: { id: string }[], edges: { from: string; to: string }[],
): Map<string, number> {
  const d = new Map<string, number>();
  for (const n of nodes) d.set(n.id, 0);
  for (const e of edges) {
    d.set(e.from, (d.get(e.from) ?? 0) + 1);
    d.set(e.to, (d.get(e.to) ?? 0) + 1);
  }
  return d;
}

/**
 * 按端口需求把节点撑大:LR 涨高(左右两张脸),TB 涨宽(上下两张脸)。
 * 涨到刚好装得下 —— 不多涨(节点太胖也不好看)。
 */
export function growForPorts(
  size: { w: number; h: number },
  demand: number,
  dir: 'LR' | 'TB',
): { w: number; h: number } {
  if (demand < 2) return size;
  // 端口分摊到两张脸上 → 每张脸大约一半
  const perFace = Math.ceil(demand / 2);
  const need = perFace * PORT_GAP + 2 * FACE_MARGIN;
  if (dir === 'TB') return { w: Math.max(size.w, need), h: size.h };
  return { w: size.w, h: Math.max(size.h, need) };
}
