// 查渲染结果里的文字重叠:解析 SVG 里每个 <text> 的 bbox,两两判相交。
// 用法: node scripts/check-overlap.mjs <file.svg> ...
import { readFileSync } from 'node:fs';

const CJK = (ch) => ch.charCodeAt(0) > 0x2e80;
const width = (t, fs) => [...t].reduce((a, c) => a + (CJK(c) ? fs : fs * 0.55), 0);

for (const file of process.argv.slice(2)) {
  const svg = readFileSync(file, 'utf8');
  const boxes = [];
  for (const m of svg.matchAll(/<text\b([^>]*)>([^<]*)<\/text>/g)) {
    const attrs = m[1];
    const text = m[2].trim();
    if (!text) continue;
    const tr = /translate\((-?[\d.]+)[ ,]+(-?[\d.]+)\)/.exec(attrs);
    const xm = /x="(-?[\d.]+)"/.exec(attrs);
    const ym = /y="(-?[\d.]+)"/.exec(attrs);
    const fs = Number(/font-size="([\d.]+)"/.exec(attrs)?.[1] ?? 12);
    const anchor = /text-anchor="(\w+)"/.exec(attrs)?.[1] ?? 'start';
    const x = (tr ? Number(tr[1]) : 0) + (xm ? Number(xm[1]) : 0);
    const y = (tr ? Number(tr[2]) : 0) + (ym ? Number(ym[1]) : 0);
    const w = width(text, fs);
    const left = anchor === 'middle' ? x - w / 2 : anchor === 'end' ? x - w : x;
    boxes.push({ text, left, right: left + w, top: y - fs * 0.8, bottom: y + fs * 0.25 });
  }
  const hits = [];
  for (let i = 0; i < boxes.length; i++) {
    for (let j = i + 1; j < boxes.length; j++) {
      const a = boxes[i];
      const b = boxes[j];
      const ox = Math.min(a.right, b.right) - Math.max(a.left, b.left);
      const oy = Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top);
      if (ox > 1 && oy > 1) hits.push(`${a.text} × ${b.text} (${ox.toFixed(0)}×${oy.toFixed(0)}px)`);
    }
  }
  console.log(`${file}: ${boxes.length} 段文字,${hits.length} 处重叠`);
  for (const h of hits) console.log('   ', h);
}
