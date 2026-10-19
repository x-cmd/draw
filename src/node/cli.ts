#!/usr/bin/env node
// CLI:把查询参数渲染成 SVG,写 stdout 或 --out 文件。
//   x-draw --type pie --labels "A,B" --values "3,2" --out pie.svg
//   x-draw "?type=bar&labels=Mon,Tue&values=3,5&scheme=dark"        # 裸查询串(与 URL 同参)
// 未知 flag 透传为查询参数(--ref 5 → ref=5);重复 flag → 重复参数(labels 含逗号时用)。
// 参数语义与 GET /draw 完全一致,见 README 或 x-cmd.com/draw 演示页。
import { writeFileSync } from 'node:fs';
import { draw } from '../lib.js';
import { ApiError } from '../specs/index.js';

const HELP = `usage: x-draw --type <pie|bar|hbar|line|area|radar|gauge|scatter|combo|sankey|qr> [params] [--out <file.svg>]

params are the same as GET /draw query params:
  --labels "A,B" --values "3,2"    data (repeated flags = repeated params)
  --t <family> --scheme <auto|dark|light> --w 560 --h 300 --num all
  --title "Stars by language" --unit stars
or pass one bare query string:
  x-draw "?type=pie&labels=A,B&values=3,2"

examples:
  x-draw --type pie --labels "TypeScript,Python,Go" --values "4821,2312,980" --out pie.svg
  x-draw "?type=hbar&labels=a,b,c&values=3,2,1&t=xcmd" | open -f -a Safari`;

function fail(msg: string): never {
  console.error(`x-draw: ${msg}\n\n${HELP}`);
  process.exit(1);
}

const args = process.argv.slice(2);
if (args.length === 0 || args[0] === '--help' || args[0] === '-h') {
  console.log(HELP);
  process.exit(0);
}

const sp = new URLSearchParams();
let out: string | undefined;
for (let i = 0; i < args.length; i++) {
  const a = args[i];
  if (a === '--out' || a === '-o') {
    out = args[++i];
    if (out === undefined) fail('--out requires a file path');
    continue;
  }
  if (a.startsWith('--')) {
    const key = a.slice(2);
    const next = args[i + 1];
    if (next === undefined || next.startsWith('--')) {
      sp.set(key, '1'); // 无值 flag → 布尔(--stack → stack=1)
      continue;
    }
    sp.append(key, next);
    i++;
    continue;
  }
  if (a.includes('=')) {
    const qs = new URLSearchParams(a.startsWith('?') ? a.slice(1) : a);
    for (const [k, v] of qs) sp.append(k, v);
    continue;
  }
  fail(`unexpected argument: ${a}`);
}

try {
  const { svg } = draw(sp);
  if (out !== undefined) {
    writeFileSync(out, svg);
    console.error(`wrote ${out} (${svg.length} bytes)`);
  } else {
    process.stdout.write(svg);
  }
} catch (e) {
  if (e instanceof ApiError) {
    console.error(`x-draw: ${e.message}`);
    process.exit(1);
  }
  throw e;
}
