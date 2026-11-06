// /draw/x-cmd/onesvg —— Satori 内核(Yoga flex + opentype.js,字形转 path)的
// 通用文档条状渲染,与 /onepage(手写引擎,BP 模板)并排对比用(x-cmd-hub/draw#30)。
//
// 实验定案的四条工程结论(详见 #30):
//   1. satori 自身不折 CJK 长段 → 折行自实现(避头尾禁则),逐行 div 喂给 satori
//   2. loadAdditionalAsset 回调路径会丢 CJK 字形 → CJK 子集直接进主 fonts 列表
//   3. 文字全部转 path → 浏览器/微信/resvg 零字体依赖,度量与渲染天然一致
//      (onepage 的 SVG 依赖系统字体,两端字体不同必有偏差;onesvg 无此问题)
//   4. width-only 传参 → 高度随内容自动生长,无需裁剪 hack
// 输入契约与 /onepage 完全一致:?d= / ?src=(github blob 自动转 raw)/ POST body。
// standalone 构建 + 显式注入 wasm:默认构建的 emscripten 加载器在 Workers 里读
// 不存在的 location.href 直接崩;standalone 由调用方喂 WebAssembly.Module
// (Workers 入口静态 import 注入,Node/Deno 走 node_modules 文件读取 —— 同 resvg)
import { ApiError } from '../specs/index.js';
import { resolveVersion } from '../version.js';
import { esc, textW } from './svg.js';
import { INTER_TTF_B64 } from '../styles/fonts-ttf.js';
import { FONT_FILES_B64 } from '../styles/fonts-banner.js';
import { CJK_REGULAR_TTF_B64, CJK_BOLD_TTF_B64 } from '../styles/fonts-cjk.js';
import { parseOnepageDoc, type Doc } from './onepage.js';
import type { DrawResult } from './query.js';

const W = 1800;
const MX = 150;                        // 左右页边(onesvg 模板自定,不照抄 onepage)
const CW = W - MX * 2;                 // 1500
const H_MAX = 40000;
const FS_BODY = 36, LH = 1.75;

// satori 字体(主列表;CJK 必须在此,回调路径丢字形 —— 见文件头)
const fontBytes = (b64: string): Uint8Array => Uint8Array.from(atob(b64), (c) => c.charCodeAt(0));

// ── wasm:standalone 构建 + 显式注入(同 png.ts 的 resvg 模式) ──────────────────
// satori 固定 0.32.0:0.38+ 引入 harfbuzzjs,其 wasm 在运行时以 bytes 编译 ——
// Workers 禁运行时编译,拦不胜拦(实测三坑:emscripten 读 self.location.href、
// init fire-and-forget、instantiate(Module) 返回裸 Instance 而 emscripten 读
// .instance)。0.32 的文本引擎无 harfbuzz,yoga.wasm 静态注入即可全通;折的是
// 复杂文字 shaping(中英混排本引擎自折行,不受影响)。
let injectedWasm: WebAssembly.Module | undefined;
let engineP: Promise<typeof import('satori/standalone')> | undefined;

/** Workers 入口专用:打包期静态 import 的 yoga.wasm 注入(见 src/index.ts)。 */
export function injectSatoriWasm(mod: WebAssembly.Module): void { injectedWasm = mod; }

async function satoriEngine(): Promise<typeof import('satori/standalone')> {
  engineP ??= (async () => {
    // emscripten 探测 wasm 路径:typeof __filename<'u' ? __filename : self.location.href
    // —— Workers 里 WorkerGlobalScope 存在但 location 不存在,且该行不在 try/catch
    // → 垫一个假 location(仅用于拼 script 目录;Node 下无害)
    const g = globalThis as { location?: { href: string } };
    g.location ??= { href: 'https://draw.invalid/' };
    const m = await import('satori/standalone');
    // init 是 fire-and-forget(不返回 promise,不能 await);standalone 的 ready
    // promise 只有 init 被调用后才 resolve,satori() 内部会等它 —— 调一次即可。
    // Workers 喂静态 Module(instantiate(Module) 返回裸 Instance,0.32 加载器
    // 自己有 instanceof 归一化,无需帮它);Node 喂文件 bytes。
    let input: WebAssembly.Module | Buffer;
    if (injectedWasm !== undefined) {
      input = injectedWasm;
    } else {
      const { createRequire } = await import('node:module');
      const { readFileSync } = await import('node:fs');
      const req = createRequire(import.meta.url);
      input = readFileSync(req.resolve('satori/yoga.wasm')) as Buffer;
    }
    void m.init(input as never);
    return m;
  })();
  return engineP;
}

let satoriFonts: { name: string; data: Uint8Array; weight: 400 | 700; style: 'normal' }[] | undefined;
function fonts() {
  satoriFonts ??= [
    { name: 'Inter', data: fontBytes(INTER_TTF_B64), weight: 400, style: 'normal' },
    { name: 'Inter', data: fontBytes(FONT_FILES_B64[0].native), weight: 700, style: 'normal' },
    { name: 'DrawCJK', data: fontBytes(CJK_REGULAR_TTF_B64), weight: 400, style: 'normal' },
    { name: 'DrawCJK', data: fontBytes(CJK_BOLD_TTF_B64), weight: 700, style: 'normal' },
    { name: 'DrawMono', data: fontBytes(FONT_FILES_B64.find((f) => f.family === 'DrawMono')!.native), weight: 400, style: 'normal' },
  ];
  return satoriFonts;
}

// ── 折行:width 实测 + 避头尾(onesvg 的排版规则内核,satori 不管这些) ──────────
const NO_START = new Set([...'。，、；：?!,.:;)）]】」』”’…%‰']);
const NO_END = new Set([...'([（[【「『“‘$#']);
const isCJK = (ch: string) => /[⺀-鿿　-〿＀-￯]/.test(ch);

interface Run { t: string; b: boolean }

// 段落 → 行,每行是 run 数组(b 标记粗体段);行宽按 textW(与 Inter 同源,DrawCJK=1em)
function wrapRuns(runs: Run[], fs: number, maxW: number): Run[][] {
  const flat: { ch: string; b: boolean }[] = [];
  for (const r of runs) for (const ch of r.t) flat.push({ ch, b: r.b });
  const lines: Run[][] = [];
  let cur: { ch: string; b: boolean }[] = [];
  let w = 0;
  let lastBreak = -1;                  // cur 内最后一个可断点下标
  for (let i = 0; i < flat.length; i++) {
    const f = flat[i];
    const cw = textW(f.ch, fs);
    const prev = cur[cur.length - 1];
    const breakable = cur.length > 0
      && !NO_START.has(f.ch)
      && !(prev !== undefined && NO_END.has(prev.ch))
      && (isCJK(prev?.ch ?? '') || isCJK(f.ch) || f.ch === ' ');
    if (breakable) lastBreak = cur.length - 1;
    if (w + cw > maxW && lastBreak >= 0) {
      const head = cur.slice(0, lastBreak + 1);
      cur = cur.slice(lastBreak + 1);
      cur.push(f);
      w = cur.reduce((s2, c2) => s2 + textW(c2.ch, fs), 0);
      lines.push(group(head));
      lastBreak = -1;
    } else {
      cur.push(f);
      w += cw;
    }
  }
  if (cur.length > 0) lines.push(group(cur));
  return lines;
}
function group(chars: { ch: string; b: boolean }[]): Run[] {
  const out: Run[] = [];
  for (const c of chars) {
    const last = out[out.length - 1];
    if (last !== undefined && last.b === c.b) last.t += c.ch;
    else out.push({ t: c.ch, b: c.b });
  }
  return out;
}

function runsOf(text: string): Run[] {
  const out: Run[] = [];
  for (const m of text.matchAll(/\*\*([^*]+)\*\*|([^*]+)/g)) {
    if (m[1] !== undefined) out.push({ t: m[1], b: true });
    else if (m[2] !== undefined && m[2] !== '') out.push({ t: m[2], b: false });
  }
  return out;
}

// ── 元素构造(satori 只吃 {type:'div', props:{style, children}} 树) ───────────
type El = Record<string, unknown>;
// satori 0.32:多子节点必须显式 display —— 且它会把中英混排的单一字符串切成
// 多个子节点,所以所有 div 默认 flex row(文本行内联流);纵向容器各自显式 column
const el = (style: Record<string, unknown>, children: unknown): El => ({
  type: 'div',
  props: {
    style: { display: 'flex', flexDirection: 'row', ...style },
    children,
  },
});

const INK = '#111827';
const BODY_C = '#4b5563';
const MUTE = '#6b7280';
const ACCENT = '#3f78f6';
const CODE_BG = '#f5f7fa';

function runsLine(runs: Run[], fs: number, extra: Record<string, unknown> = {}): El {
  const kids = runs.map((r) => el(
    { ...(r.b ? { fontWeight: 700, color: INK } : {}) },
    r.t,
  ));
  return el({ fontSize: fs, lineHeight: LH, color: BODY_C, ...extra }, kids.length === 1 ? kids[0] : kids);
}

// 代码行:按宽度逐字符硬折(与 onepage 同策略),续行缩进两空格
function codeLines(lines: string[]): string[] {
  const out: string[] = [];
  for (const l of lines) {
    const hard = l.replace(/\s+$/, '');
    if (hard === '') { out.push(''); continue; }
    let cur = '';
    let w = 0;
    let cont = false;
    for (const ch of hard) {
      const cw = textW(ch, 27);
      if (w + cw > CW - 56 - (cont ? 40 : 0) && cur !== '') {
        out.push((cont ? '  ' : '') + cur);
        cont = true;
        cur = ch;
        w = cw;
      } else {
        cur += ch;
        w += cw;
      }
    }
    if (cur !== '') out.push((cont ? '  ' : '') + cur);
  }
  return out;
}

function buildTree(doc: Doc): El {
  const kids: El[] = [];
  // 页头
  kids.push(el({ fontSize: 78, fontWeight: 700, color: INK, letterSpacing: -1, lineHeight: 1.2 }, doc.title));
  if (doc.subtitle !== '') kids.push(el({ marginTop: 18, fontSize: 34, color: MUTE }, runsLine(runsOf(doc.subtitle), 34, { color: MUTE })));
  if (doc.bullets.length > 0) {
    kids.push(el({ marginTop: 30, display: 'flex', flexDirection: 'column' },
      doc.bullets.map((b: string) => el(
        { display: 'flex', flexDirection: 'row', marginTop: 10 },
        [
          el({ color: ACCENT, fontSize: 30, lineHeight: 1.5 }, '•'),
          el({ flex: 1 }, runsLine(runsOf(b), 32, { color: MUTE })),
        ],
      ))));
  }
  for (const sec of doc.sections) {
    if (sec.name !== '') {
      kids.push(sec.major
        ? el({ marginTop: 88, borderLeftWidth: 12, borderLeftStyle: 'solid', borderLeftColor: ACCENT, paddingLeft: 26, fontSize: 42, fontWeight: 700, color: INK, lineHeight: 1.35 }, sec.name)
        : el({ marginTop: 52, fontSize: 38, fontWeight: 700, color: '#1f2937', lineHeight: 1.4 }, sec.name));
    }
    for (const blk of sec.blocks) {
      if (blk.k === 'li') {
        for (const it of blk.items) {
          const numbered = /^\d+[.、)]/.test(it);
          kids.push(el(
            { display: 'flex', flexDirection: 'row', marginTop: 14 },
            [
              el({ width: 44, color: ACCENT, fontWeight: 700, fontSize: 32, lineHeight: 1.6 }, numbered ? it.slice(0, it.indexOf('.')) + '.' : '•'),
              el({ flex: 1 }, wrapRuns(runsOf(numbered ? it.slice(it.indexOf('.') + 1).trim() : it), 34, CW - 44)
                .map((line) => runsLine(line, 34))),
            ],
          ));
        }
      } else if (blk.k === 'code') {
        kids.push(el(
          { marginTop: 24, backgroundColor: CODE_BG, borderRadius: 16, padding: '24px 28px', display: 'flex', flexDirection: 'column' },
          codeLines(blk.lines).map((l) => el({ fontFamily: 'DrawMono, Inter', fontSize: 27, color: '#374151', lineHeight: 1.6 }, l === '' ? ' ' : l)),
        ));
      } else if (blk.k === 'quote' || blk.k === 'p') {
        const rs = runsOf(blk.k === 'p' ? blk.text : blk.text);
        const onlyBold = rs.length === 1 && rs[0].b;
        if (onlyBold) {
          kids.push(el({ marginTop: 48, fontSize: 38, fontWeight: 700, color: '#1f2937', lineHeight: 1.4 }, rs[0].t));
        } else {
          kids.push(el({ marginTop: 18, display: 'flex', flexDirection: 'column' },
            wrapRuns(rs, FS_BODY, CW).map((line) => runsLine(line, FS_BODY))));
        }
      }
    }
  }
  // 页脚(联系信息;onesvg 不画 QR —— 字形 path 方案嵌二维码复杂,v1 从简)
  const footer = [doc.meta.contact, doc.meta.location, doc.meta.website].filter((s): s is string => typeof s === 'string' && s !== '');
  if (footer.length > 0) {
    kids.push(el(
      { marginTop: 96, borderTopWidth: 2, borderTopStyle: 'solid', borderTopColor: '#e5e7eb', paddingTop: 36, display: 'flex', flexDirection: 'column' },
      footer.map((f, i) => el({ marginTop: i === 0 ? 0 : 12, fontSize: i === 0 ? 36 : 32, fontWeight: i === 0 ? 700 : 400, color: i === 0 ? INK : MUTE }, f)),
    ));
  }
  return el({
    width: W,
    padding: '96px 150px 120px',
    backgroundColor: '#ffffff',
    display: 'flex',
    flexDirection: 'column',
    fontFamily: 'Inter, DrawCJK',
  }, kids);
}

/** 渲染(markdown 与 /onepage 同契约)。async:satori 内部 wasm 布局。 */
export async function renderOnesvg(md: string, url: URL): Promise<DrawResult> {
  const v = resolveVersion(url.searchParams.get('v'));
  const doc = parseOnepageDoc(md);
  let svg: string;
  try {
    const { default: satori } = await satoriEngine();
    svg = await satori(buildTree(doc) as never, { width: W, fonts: fonts() } as never);
  } catch (e) {
    throw new ApiError(500, `onesvg layout failed: ${e instanceof Error ? e.message : String(e)}`);
  }
  const h = Number(/height="([\d.]+)"/.exec(svg)?.[1] ?? 0);
  if (!(h > 100)) throw new ApiError(500, 'onesvg produced an empty page');
  if (h > H_MAX) throw new ApiError(400, `onesvg is ${Math.round(h)}px tall (max ${H_MAX}); split the doc`);
  const meta = `<metadata>${esc(JSON.stringify({ generator: 'draw', template: 'onesvg', namespace: 'x-cmd', engine: 'satori', version: v.version, title: doc.title }))}</metadata>`;
  svg = svg.replace(/<svg([^>]*)>/, `<svg$1>${meta}`).replace('<svg ', `<svg role="img" aria-label="${esc(doc.title)}" `);
  return { svg, version: v.version, cacheControl: v.cacheControl };
}
