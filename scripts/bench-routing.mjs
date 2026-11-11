// 布线性能:节点数 → 渲染耗时。
// 用法:node scripts/bench-routing.mjs
import { renderArchFromUrl } from '../src/render/arch.js';

function mk(n) {
  const ps = [];
  for (let i = 0; i < n; i++) {
    ps.push(`n=n${i};be;Node ${i};sub;r${i}c${i % 6}`);
    if (i) ps.push(`e=n${i - 1};n${i};link`);
  }
  ps.push('title=Bench');
  return ps.join('&');
}

for (const n of [10, 20, 40, 80, 160]) {
  const url = new URL(`https://x-cmd.com/draw/arch2?${mk(n)}`);
  const t0 = performance.now();
  renderArchFromUrl(url);
  console.log(`${String(n).padStart(4)} 个节点 → ${(performance.now() - t0).toFixed(0)} ms`);
}
