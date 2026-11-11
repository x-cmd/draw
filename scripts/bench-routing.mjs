// 布线性能:节点数 → 渲染耗时。两种摆位各跑一遍:
//   格子  —— 位置都写死了(网格打包 + 正交布线)
//   分层  —— 不写位置(Sugiyama 分层 + 正交布线)
// 用法:node --import tsx scripts/bench-routing.mjs
import { renderArchFromUrl } from '../src/render/arch.js';

function mk(n, grid) {
  const ps = [];
  for (let i = 0; i < n; i++) {
    ps.push(grid ? `n=n${i};be;Node ${i};sub;r${i}c${i % 6}` : `n=n${i};be;Node ${i}`);
    if (i) ps.push(`e=n${i - 1};n${i};link`);
  }
  ps.push('title=Bench');
  return ps.join('&');
}

for (const grid of [true, false]) {
  console.log(grid ? '—— 格子摆位 ——' : '—— 自动分层 ——');
  for (const n of [10, 20, 40, 80, 160, 320]) {
    const url = new URL(`https://x-cmd.com/draw/arch2?${mk(n, grid)}`);
    const t0 = performance.now();
    renderArchFromUrl(url);
    console.log(`${String(n).padStart(4)} 个节点 → ${(performance.now() - t0).toFixed(0)} ms`);
  }
}
