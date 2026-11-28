// nomnoml —— UML 图。
//
// nomnoml 是纯 JS 的(没有 DOM 依赖),`renderSvg(code)` 直接给一串 SVG ——
// 服务端画得动,不用浏览器。
//
// 库里只有两个颜色:#33322E(笔画/文字)和 #eee8d5(盒子填充)——
// 换成站上的配色就行。线的颜色是**结构色**,换;盒子的填充也换。
//
// 库是**动态载入**的:只有真来 /draw/nomnoml 才付这份下载(≈400KB)。

import { ApiError, clip } from '../specs/base.js';
import {
  THEMES, FONT_STACK, withBackground, recolor, withFont, canvasOf, setSize,
  ensureSvgNs, ensureViewBox,
  type Scheme,
} from './source-theme.js';

interface NomnomlNS {
  renderSvg: (code: string) => string;
}

export interface SourceOpts {
  scheme?: Scheme;
  width?: number;
  height?: number;
}

/** nomnoml 那三个颜色:笔画/文字、盒子底、包住一组的那层底 */
const INK = '#33322e';
const PAPER = '#eee8d5';
const FRAME = '#fdf6e3';

/** nomnoml 源码 → SVG */
export async function renderNomnoml(src: string, opts: SourceOpts = {}): Promise<string> {
  const s = src.trim();
  if (!s) {
    throw new ApiError(400, '"d" is required: the nomnoml source, e.g. d=' + encodeURIComponent('[A]->[B]'));
  }
  const mod = await import('nomnoml');
  const nomnoml = (mod.default ?? mod) as unknown as NomnomlNS;

  let svg: string;
  try {
    svg = nomnoml.renderSvg(s);
  } catch (e) {
    throw new ApiError(400, `nomnoml could not parse this source: ${clip(e instanceof Error ? e.message : String(e), 200)}`);
  }
  if (!svg || !svg.includes('<svg')) {
    throw new ApiError(400, 'nomnoml produced no drawing for this source');
  }

  const scheme = opts.scheme ?? 'dark';
  const theme = THEMES[scheme];
  const size = canvasOf(svg, { w: opts.width ?? 560, h: opts.height ?? 320 });

  let out = svg;
  // 暗色下盒子不能还是米色 —— 换成深色卡片;笔画换成浅色
  out = recolor(out, { [INK]: theme.ink, [PAPER]: theme.panel, [FRAME]: theme.frame });
  out = withFont(out, FONT_STACK);
  // nomnoml 画布是透明的,底下垫一张
  out = withBackground(out, theme, size.w, size.h);
  out = setSize(out, size.w, size.h);
  out = ensureSvgNs(out);
  out = ensureViewBox(out);
  return out;
}
