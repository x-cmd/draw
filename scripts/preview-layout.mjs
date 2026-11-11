// 布局预览:把 arch 图渲染成 PNG,肉眼看排版。
// 用法: node --import tsx scripts/preview-layout.mjs <out.png> <query...>
import { writeFileSync } from 'node:fs';
import { renderArchFromUrl } from '../src/render/arch.js';
import { svgToPng } from '../src/render/png.js';

const out = process.argv[2] ?? '/tmp/layout.png';
const q = process.argv.slice(3).join('&');
const { svg } = renderArchFromUrl(new URL(`https://x-cmd.com/draw/arch2?${q}`));
writeFileSync(out.replace(/\.png$/, '.svg'), svg);
const png = await svgToPng(svg, 'light', { scale: 2 });
writeFileSync(out, png);
console.log(`${out} (${png.byteLength} bytes)`);
