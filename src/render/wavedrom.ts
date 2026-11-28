// WaveDrom —— 时序波形图(数字电路那种)。
//
// wavedrom 的渲染是「先算几何,再吐一棵 onml 树」—— 不碰 DOM,
// 所以服务端画得动:renderAny() 给树,onml.s() 把它序列化成 SVG。
//
// 波形图的颜色是**数据**(信号 0/1 的填充色、时钟的蓝)—— 不动。
// 动的是结构色:笔画(#000)、文字、波形块的底色(#fff)。
// 暗色下:笔画与文字变浅,波形块的底变深 —— 于是「高电平」是亮的,跟正视图一样。
//
// 库是**动态载入**的:只有真来 /draw/wavedrom 才付这份下载(≈800KB)。

import { ApiError, clip } from '../specs/base.js';
import {
  THEMES, withBackground, withFont, canvasOf, setSize, inlineCss,
  ensureSvgNs, ensureViewBox,
  type Scheme,
} from './source-theme.js';

interface WavedromNS {
  renderAny: (index: number, source: unknown, skins: unknown, a?: boolean, b?: boolean) => unknown;
}

interface OnmlNS {
  s: (tree: unknown) => string;
}

export interface SourceOpts {
  scheme?: Scheme;
  width?: number;
  height?: number;
  /** 皮肤:default / narrow / narrower / narrowerer / lowkey / dark */
  skin?: string;
  /** 一个周期占几格(位宽) */
  hscale?: number;
  /** 要不要刻度线 */
  marks?: boolean;
}

/** 波形图源码(JSON / JSON5)→ SVG */
export async function renderWavedrom(src: string, opts: SourceOpts = {}): Promise<string> {
  const s = src.trim();
  if (!s) {
    throw new ApiError(400, '"d" is required: the WaveDrom source, e.g. d=' + encodeURIComponent('{"signal":[{"name":"clk","wave":"p......"}]}'));
  }

  // JSON5:波形图的源码常带注释,写 JSON 太费劲
  let source: unknown;
  try {
    const json5 = (await import('json5')).default as { parse: (t: string) => unknown };
    source = json5.parse(s);
  } catch (e) {
    throw new ApiError(400, `"d" is not valid WaveDrom source (JSON): ${clip(e instanceof Error ? e.message : String(e), 200)}`);
  }
  if (typeof source !== 'object' || source === null || Array.isArray(source)) {
    throw new ApiError(400, '"d" must be a WaveDrom object (with a "signal", "assign" or "reg" field)');
  }

  const scheme = opts.scheme ?? 'dark';
  const theme = THEMES[scheme];

  const [wd, onml, def, narrow, narrower, narrowerer, lowkey, dark] = await Promise.all([
    import('wavedrom'),
    import('onml'),
    import('wavedrom/skins/default.js'),
    import('wavedrom/skins/narrow.js'),
    import('wavedrom/skins/narrower.js'),
    import('wavedrom/skins/narrowerer.js'),
    import('wavedrom/skins/lowkey.js'),
    import('wavedrom/skins/dark.js'),
  ]);
  const wavedrom = (wd.default ?? wd) as unknown as WavedromNS;
  const onmlS = ((onml.default ?? onml) as unknown as OnmlNS).s;
  // 皮肤文件是「var WaveSkin = …; module.exports = WaveSkin」,各自导出一个名字
  const skinFiles: unknown[] = [def, narrow, narrower, narrowerer, lowkey, dark];
  const skins: Record<string, unknown> = {};
  for (const mod of skinFiles) {
    Object.assign(skins, (mod as { default?: unknown }).default ?? mod);
  }
  // 用哪套皮肤:指定了就用它;没指定 —— 暗色用官方的 dark,亮色用 default
  const skinName = opts.skin && skins[opts.skin] ? opts.skin : (scheme === 'dark' ? 'dark' : 'default');
  // 位宽/刻度:盖掉源码里的 config
  const cfg = (source as { config?: Record<string, unknown> }).config ?? {};
  cfg.skin = skinName;                       // 皮肤是源码里的 config.skin 决定的
  if (opts.hscale && opts.hscale !== 1) cfg.hscale = opts.hscale;
  if (opts.marks === false) cfg.marks = false;
  (source as { config: Record<string, unknown> }).config = cfg;

  let svg: string;
  try {
    const tree = wavedrom.renderAny(0, source, skins);
    svg = onmlS(tree);
  } catch (e) {
    throw new ApiError(400, `wavedrom could not render this source: ${clip(e instanceof Error ? e.message : String(e), 200)}`);
  }
  if (!svg || !svg.includes('<svg')) {
    throw new ApiError(400, 'wavedrom produced no drawing for this source');
  }

  const size = canvasOf(svg, { w: opts.width ?? 900, h: opts.height ?? 200 });

  let out = svg;
  // 结构色换掉(波形的数据色不动):#000 是笔画/文字,#fff 是波形块的底
  out = out.replace(/<style([^>]*)>([\s\S]*?)<\/style>/g, (_m, attrs: string, css: string) => {
    let themed = css
      .replace(/stroke:#000/g, `stroke:${theme.ink}`)
      .replace(/color:#000/g, `color:${theme.ink}`)
      .replace(/fill:#000/g, `fill:${theme.ink}`)
      .replace(/fill:#fff;/g, `fill:${theme.panel};`);
    // 文字没写 fill(默认黑)—— 给一条
    themed = themed.replace(/text\{/, `text{fill:${theme.ink};`);
    // 皮肤那个深蓝(信号名用它)在暗色底上太沉 —— 换成站上的强调色
    if (scheme === 'dark') themed = themed.replace(/#0041c4/g, theme.accent);
    return `<style${attrs}>${themed}</style>`;
  });
  // wavedrom 的画法全写在 CSS 类里(.s1/.s2/…)—— 样式块会被出图那道工序剥掉,
  // 所以先内联到元素上:图就自足了(没有 CSS),浏览器和 PNG 一个样。
  out = inlineCss(out);
  // 数据块(head/body/tail)的颜色:皮肤的一个颜色类会**同时**用在
  // 「波形的 0 块」和「数据块」上(.s7 是白底)—— 波形 0 块在暗色底上要换成卡片色,
  // 但数据块得留住自己的颜色(官方演示里 head/body/tail 是彩色的)。
  // 两者只能靠形状 id 分开:数据块的 id 带 v,波形块的不带。
  // 数据块的底色:块里的字是白的 ⇒ 底色不能太浅(浅底上白字读不出来 ✗)
  const DATA_FILLS = ['#b8860b', '#c2703a', '#3b6fb5', '#2f8f8f', '#3f8f4f', '#8f4f9e', '#a34a4a'];
  out = out.replace(/(<g id="([^"]+)">\s*<path[^>]*?style="[^"]*?)fill:#[0-9a-fA-F]{3,8}/gi, (m, head, id) => {
    if (!id.includes('v')) return m;
    const idx = Number(/-(\d+)"?$/.exec(id)?.[1] ?? 0);
    return `${head}fill:${DATA_FILLS[idx % DATA_FILLS.length]}`;
  });
  // wavedrom 自己垫了一张**白底**的画布(在最后,盖住所有东西)—— 换成我们的底色
  out = out.replace(/fill:white/g, `fill:${theme.bg}`);
  if (scheme === 'dark') out = out.replace(/#0041c4/g, theme.accent);
  out = withFont(out);
  out = withBackground(out, theme, size.w, size.h);
  out = setSize(out, size.w, size.h);
  out = ensureSvgNs(out);
  out = ensureViewBox(out);
  return out;
}
