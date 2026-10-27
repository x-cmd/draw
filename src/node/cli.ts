#!/usr/bin/env node
// CLI:把查询参数渲染成 SVG,写 stdout 或 --out 文件。
//   draw --type pie --labels "A,B" --values "3,2" --out pie.svg
//   draw "?type=bar&labels=Mon,Tue&values=3,5&scheme=dark"       # 裸查询串(与 URL 同参)
//   draw echarts '{"series":[...]}'                              # echarts 覆盖层(内联 JSON/文件/stdin)
// 未知 flag 透传为查询参数(--ref 5 → ref=5);重复 flag → 重复参数(labels 含逗号时用)。
// 参数语义与 GET /draw 完全一致,见 README 或 x-cmd.com/draw 演示页。
import { readFileSync, writeFileSync } from 'node:fs';
import { draw, renderEchartsOption } from '../lib.js';
import { ApiError } from '../specs/index.js';

// 长 flag → 查询参数名(单字母直写也依然有效,经透传)
const ALIASES: Record<string, string> = { theme: 't', width: 'w', height: 'h' };

const HELP = `usage: draw --type <pie|bar|hbar|line|area|radar|gauge|scatter|combo|sankey|qr> [params] [--out <file.svg>]
       draw echarts '<option json>' [params] [--out <file.svg>]        # ECharts coverage layer

params are the same as GET /draw query params:
  --labels "A,B" --values "3,2"            data (repeated flags = repeated params)
  --theme <family> --scheme <auto|dark|light> --width 560 --height 300 --num all
  --title "Stars by language" --unit stars
  (single-letter query names also pass through: --t evil --w 560)
or pass one bare query string:
  draw "?type=pie&labels=A,B&values=3,2"

echarts subcommand — the option comes from an inline JSON arg, a file, or stdin
(no URL-length cap; --theme/--scheme/--width/--height apply like everywhere else):
  draw echarts '{"series":[{"type":"bar","data":[1,2,3]}]}'
  draw echarts option.json --out chart.svg
  cat option.json | draw echarts --scheme dark

examples:
  draw --type pie --labels "TypeScript,Python,Go" --values "4821,2312,980" --out pie.svg
  draw "?type=hbar&labels=a,b,c&values=3,2,1&t=xcmd" | open -f -a Safari
  draw echarts '{"series":[{"type":"treemap","data":[{"name":"a","value":3}]}]}'`;

function fail(msg: string): never {
  console.error(`draw: ${msg}\n\n${HELP}`);
  process.exit(1);
}

// echarts 子命令:option 来源 = 内联 JSON | 文件路径 | stdin;渲染走 renderEchartsOption
// (option 级 API,不经过 ?d= 的 URL 长度闸),共享 flag 语义与核心图完全一致。
async function runEcharts(rest: string[]): Promise<void> {
  const sp = new URLSearchParams();
  let out: string | undefined;
  let source: string | undefined; // 内联 JSON 或文件路径
  for (let i = 0; i < rest.length; i++) {
    const a = rest[i];
    if (a === '--out' || a === '-o') {
      out = rest[++i];
      if (out === undefined) fail('--out requires a file path');
      continue;
    }
    if (a.startsWith('--')) {
      const key = ALIASES[a.slice(2)] ?? a.slice(2);
      const next = rest[i + 1];
      if (next === undefined || next.startsWith('--')) {
        sp.set(key, '1');
        continue;
      }
      sp.append(key, next);
      i++;
      continue;
    }
    if (source !== undefined) fail(`unexpected argument: ${a} (option source given twice?)`);
    source = a;
  }
  let raw: string;
  if (source === undefined || source === '-') {
    if (process.stdin.isTTY) fail('pass the ECharts option as an inline JSON arg, a file path, or via stdin');
    raw = readFileSync(0, 'utf8'); // 0 = stdin;管道/重定向到此一次性读完
  } else {
    try {
      raw = readFileSync(source, 'utf8');
    } catch {
      raw = source; // 不是文件 → 当内联 JSON 解析(错误在 JSON.parse 处报,信息更准)
    }
  }
  let option: unknown;
  try {
    option = JSON.parse(raw);
  } catch (e) {
    fail(`option is not valid JSON (${e instanceof Error ? e.message : 'parse error'}); pass an inline JSON object, a file path, or pipe via stdin`);
  }
  if (typeof option !== 'object' || option === null || Array.isArray(option)) {
    fail(`option must be a JSON object (the ECharts option), got ${Array.isArray(option) ? 'an array' : typeof option}`);
  }
  const { svg } = await renderEchartsOption(option as Record<string, unknown>, sp);
  if (out !== undefined) {
    writeFileSync(out, svg);
    console.error(`wrote ${out} (${svg.length} bytes)`);
  } else {
    process.stdout.write(svg);
  }
}

const args = process.argv.slice(2);
if (args.length === 0 || args[0] === '--help' || args[0] === '-h') {
  console.log(HELP);
  process.exit(0);
}

// echarts 子命令:渲染后即退出,不落入下方核心图的参数解析
if (args[0] === 'echarts' || args[0] === 'echart') {
  try {
    await runEcharts(args.slice(1));
  } catch (e) {
    if (e instanceof ApiError) {
      console.error(`draw: ${e.message}`);
      process.exit(1);
    }
    throw e;
  }
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
    const key = ALIASES[a.slice(2)] ?? a.slice(2);
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
    console.error(`draw: ${e.message}`);
    process.exit(1);
  }
  throw e;
}
