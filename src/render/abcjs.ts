// ABC 记谱(abcjs)—— 乐谱。
//
// abcjs 是「建一棵 SVG DOM 树,再序列化」的那种库 —— Worker 里没有 DOM,
// 于是给它一个刚够用的(src/render/svgdom.ts)。
//
// **谱面是路径**:abcjs 内建了 Gonville 字体数据,音符、五线谱、升降号画出来
// 都是 <path> —— 所以出来的 SVG 是自足的,不依赖系统里有没有装字体,
// 浏览器和 resvg(PNG 光栅化)画出来一个样。只有标题那种文字是真的文字。
//
// 文字量不出来(Worker 没有排版引擎):abcjs 自己的兜底是「按字号估」——
// 谱面不受影响,只有标题的宽度是估的。
//
// 库是**动态载入**的:只有真来 /draw/abcjs 才付这份下载(≈500KB)。

import { ApiError, clip } from '../specs/base.js';
import { installSvgDom, ShimElement } from './svgdom.js';
import {
  THEMES, SERIF_STACK, withBackground, withFont, canvasOf, setSize, scopeCss,
  ensureSvgNs, ensureViewBox, annotateNotes,
  type Scheme,
} from './source-theme.js';
import { parseAbc } from './abc-parse.js';

interface AbcjsNS {
  renderAbc: (output: unknown, abc: string, parserParams?: Record<string, unknown>, engraverParams?: Record<string, unknown>, renderParams?: Record<string, unknown>) => void;
}

export interface SourceOpts {
  scheme?: Scheme;
  width?: number;
  height?: number;
  /** 移调(半音) */
  transpose?: number;
}

/** ABC 源码 → SVG */
export async function renderAbcjs(src: string, opts: SourceOpts = {}): Promise<string> {
  const s = src.trim();
  if (!s) {
    throw new ApiError(400, '"d" is required: the ABC notation source, e.g. d=' + encodeURIComponent('X:1\\nT:Air\\nK:C\\nCDEF|GABc|'));
  }
  installSvgDom();
  const mod = await import('abcjs');
  const abcjs = (mod.default ?? mod) as unknown as AbcjsNS;

  const width = Math.max(160, Math.min(1600, opts.width ?? 560));
  const host = new ShimElement('div');
  try {
    abcjs.renderAbc(host, s, {
      add_classes: true,
      // 移调:半音级(调号不变,变了的高度按临时升降号写出来)
      visualTranspose: opts.transpose ? String(opts.transpose) : undefined,
      responsive: 'none',
      staffwidth: width - 20,
      paddingleft: 10,
      paddingright: 10,
      paddingtop: 10,
      paddingbottom: 10,
    });
  } catch (e) {
    throw new ApiError(400, `abcjs could not render this ABC source: ${clip(e instanceof Error ? e.message : String(e), 200)}`);
  }

  const svgs = host.childNodes.filter((n): n is ShimElement => n instanceof ShimElement && n.tagName === 'svg');
  if (!svgs.length) {
    throw new ApiError(400, 'abcjs produced no drawing for this ABC source');
  }

  let out: string;
  if (svgs.length === 1) {
    out = svgs[0].outerHTML;
  } else {
    // 一段 ABC 里有多首曲子 —— 上下叠起来
    let y = 0;
    const parts: string[] = [];
    let maxW = 0;
    for (const g of svgs) {
      const h = Number(g.getAttribute('height') ?? 0);
      const w = Number(g.getAttribute('width') ?? 0);
      maxW = Math.max(maxW, w);
      parts.push(`<g transform="translate(0,${y})">${g.outerHTML}</g>`);
      y += h;
    }
    out = `<svg xmlns="http://www.w3.org/2000/svg" width="${maxW}" height="${y}" viewBox="0 0 ${maxW} ${y}">${parts.join('')}</svg>`;
  }

  const scheme = opts.scheme ?? 'dark';
  const theme = THEMES[scheme];
  const size = canvasOf(out, { w: width, h: 200 });

  // abcjs 用 currentColor 画谱面(它默认跟着页面走)—— SVG 单独存在时
  // currentColor 就是黑,暗色底上等于看不见。换成我们这套的 ink。
  out = out.replace(/currentColor/g, theme.ink);
  out = withFont(out, SERIF_STACK);
  // 图里那段 <style> 是全页生效的(内联 SVG 的 style 不 scoped)—— 限定在这张图里
  out = out.replace(/<svg\b/, '<svg class="abcjs-svg"');
  out = scopeCss(out, '.abcjs-svg');
  // 点谱上的音 → 选中源码里的对应几个字
  try {
    const notes = parseAbc(s).notes;
    out = annotateNotes(out, notes, /<g class="abcjs-note[^>]*data-index="\d+"[^>]*>/g);
  } catch {
    // 源码 abcjs 能画、我们的解析器画不了(超出子集)—— 那就不标,不影响出图
  }
  out = withBackground(out, theme, size.w, size.h);
  out = setSize(out, size.w, size.h);
  out = ensureSvgNs(out);
  out = ensureViewBox(out);
  return out;
}
