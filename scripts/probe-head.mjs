// 探针:量 echarts SSR 里 title / legend / grid 的实际位置。
// 用法: node scripts/probe-head.mjs
import { renderEchartsOption } from '../src/render/echarts-ssr.js';

const opt = (extra) => ({
  title: { text: '标题在这里' },
  xAxis: { type: 'category', data: ['a', 'b'] },
  yAxis: { type: 'value' },
  series: [{ type: 'line', data: [1, 2], name: '系列一' }, { type: 'line', data: [2, 3], name: '系列二' }],
  ...extra,
});

const CASES = {
  'title only': {},
  'title+legend(无 top)': { legend: { data: ['系列一', '系列二'] } },
  'title+legend(top:30)': { legend: { data: ['系列一', '系列二'], top: 30 } },
  'title+legend(top:0)': { legend: { data: ['系列一', '系列二'], top: 0 } },
  'title(top:0)+legend(top:30)': { title: { text: '标题在这里', top: 0 }, legend: { data: ['系列一', '系列二'], top: 30 } },
  'title+legend(orient横向,left center)': { legend: { data: ['系列一', '系列二'], top: 30, left: 'center' } },
};

for (const [name, extra] of Object.entries(CASES)) {
  const { svg } = await renderEchartsOption(opt(extra), new URLSearchParams('w=760&h=420'));
  const rows = [];
  for (const m of svg.matchAll(/<text\b([^>]*)>([^<]*)<\/text>/g)) {
    const attrs = m[1];
    const txt = m[2].trim();
    if (!txt) continue;
    const tr = /translate\((-?[\d.]+)[ ,]+(-?[\d.]+)\)/.exec(attrs);
    const y = Number(/y="(-?[\d.]+)"/.exec(attrs)?.[1] ?? 0);
    const fs = Number(/font-size="([\d.]+)"/.exec(attrs)?.[1] ?? 12);
    if (!tr) continue;
    const absY = Number(tr[2]) + y;
    if (absY > 120) continue; // 只看顶部区域
    rows.push(`${txt}@y=${absY.toFixed(1)}(fs${fs})`);
  }
  console.log(name.padEnd(30), rows.join('  '));
}
