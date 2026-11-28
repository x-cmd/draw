// 图的配色与字体 —— 四个新图种(nomnoml / wavedrom / abcjs / vexflow)共用。
//
// SVG 是**独立的一张图**:被 <img> 引走、被人存成 .svg 文件、发到 IM 里 ——
// 它拿不到站上的 CSS 变量。所以颜色得写死在图里(chem 那张分子图也是这么做的)。
//
// 站上的暗色底是 #080808(SITE_CSS 的 --bg),但图里垫的是 #0E0F11 ——
// 跟 chem 一致:图是一张「卡片」,不是页面本身。

export type Scheme = 'dark' | 'light';

export interface SvgTheme {
  /** 垫在图最下面的底色 */
  bg: string;
  /** 主要笔画/文字 */
  ink: string;
  /** 次要文字(淡一点) */
  muted: string;
  /** 卡片/盒子一类的填充 */
  panel: string;
  /** 细线(五线谱的线、表格边) */
  line: string;
  /** 五线谱那五条线(比细线亮一点,不然谱面看着空) */
  stave: string;
  /** 包住一组元素的那层底(nomnoml 的 frame) */
  frame: string;
  /** 强调色 */
  accent: string;
}

export const THEMES: Record<Scheme, SvgTheme> = {
  dark: {
    bg: '#0E0F11',
    ink: '#FAFAFA',
    muted: '#A1A1AA',
    panel: '#1C1C1F',
    line: '#3F3F46',
    stave: '#5A5A62',
    frame: '#16161A',
    accent: '#60A5FA',
  },
  light: {
    bg: '#FFFFFF',
    ink: '#18181B',
    muted: '#71717A',
    panel: '#F4F4F5',
    line: '#D4D4D8',
    stave: '#B4B4BC',
    frame: '#FFF8E7',
    accent: '#2563EB',
  },
};

/** 系统字体栈(站上的规矩:不内嵌字体,系统字体优先) */
export const FONT_STACK =
  "ui-sans-serif,-apple-system,BlinkMacSystemFont,'Segoe UI','PingFang SC','Hiragino Sans GB','Microsoft YaHei',sans-serif";

/** 记谱法的字体(五线谱上的字要衬线体,别用 UI 字体) */
export const SERIF_STACK = "'Times New Roman',Times,Georgia,serif";

const r2 = (v: number): number => Math.round(v * 100) / 100;

/**
 * 垫一层底色 —— 图是独立的一张图,得有底,不然在白底页面上看不见深色的线。
 *
 * 底色垫在**最下面**:插到 <svg> 开头(第一个子元素之前)。
 */
export function withBackground(svg: string, theme: SvgTheme, w: number, h: number): string {
  const rect = `<rect x="0" y="0" width="${r2(w)}" height="${r2(h)}" fill="${theme.bg}"/>`;
  const at = svg.indexOf('>');
  if (at < 0) return svg;
  return svg.slice(0, at + 1) + rect + svg.slice(at + 1);
}

/**
 * 库里写死的颜色换成我们这套。
 *
 * 只换**结构色**(笔画、文字、盒子填充),数据色(波形图的信号色、乐谱的谱线颜色)
 * 一律不动 —— 那是图的内容,不是皮肤。
 */
export function recolor(svg: string, map: Record<string, string>): string {
  let out = svg;
  for (const [from, to] of Object.entries(map)) {
    if (from === to) continue;
    const re = new RegExp(from.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi');
    out = out.replace(re, to);
  }
  return out;
}

/**
 * 把 currentColor 换成具体颜色。
 *
 * abcjs 的谱面用 currentColor 画(它默认跟着页面走)—— 但 SVG 单独存在时
 * currentColor 就是黑,暗色底上等于看不见。换成我们这套的 ink。
 */
export function resolveCurrentColor(svg: string, theme: SvgTheme): string {
  return svg.replace(/currentColor/g, theme.ink);
}

/** 把库里的字体栈换成站上的 */
export function withFont(svg: string, stack: string = FONT_STACK): string {
  return svg.replace(/font-family="[^"]*"/g, `font-family="${stack}"`);
}

/** 从 SVG 的 viewBox/width/height 里量出画布大小 */
export function canvasOf(svg: string, fallback: { w: number; h: number }): { w: number; h: number } {
  const w = /\swidth="([\d.]+)"/.exec(svg);
  const h = /\sheight="([\d.]+)"/.exec(svg);
  const vb = /viewBox="([-\d.]+)\s+([-\d.]+)\s+([\d.]+)\s+([\d.]+)"/.exec(svg);
  const wv = w ? Number(w[1]) : vb ? Number(vb[3]) : fallback.w;
  const hv = h ? Number(h[1]) : vb ? Number(vb[4]) : fallback.h;
  return {
    w: Number.isFinite(wv) && wv > 0 ? wv : fallback.w,
    h: Number.isFinite(hv) && hv > 0 ? hv : fallback.h,
  };
}

/**
 * 把画布尺寸写死成 w×h(库给的可能是自己算的,跟我们要的差一截)。
 * viewBox 不动 —— 图形按比例缩放,不会变形。
 */
export function setSize(svg: string, w: number, h: number): string {
  let out = svg.replace(/(<svg\b[^>]*?)\swidth="[^"]*"/, '$1').replace(/(<svg\b[^>]*?)\sheight="[^"]*"/, '$1');
  out = out.replace(/<svg\b/, `<svg width="${r2(w)}" height="${r2(h)}"`);
  return out;
}

/**
 * 补上 SVG 命名空间。
 *
 * abcjs、vexflow 吐出来的 <svg> 只有 xmlns:xlink,**没有默认的 xmlns** ——
 * 浏览器还能认(HTML 里的内联 SVG 不看命名空间),但 resvg(PNG 光栅化)不认:
 * 它要根元素在 SVG 命名空间里,不然报「没有根节点」。
 */
export function ensureSvgNs(svg: string): string {
  if (/<svg\b[^>]*\sxmlns=/.test(svg)) return svg;
  return svg.replace(/<svg\b/, '<svg xmlns="http://www.w3.org/2000/svg"');
}

/** 没有 viewBox 就补一个(尺寸按 width/height)—— 缩放时不会走形 */
export function ensureViewBox(svg: string): string {
  if (/viewBox=/.test(svg)) return svg;
  const w = /\swidth="([\d.]+)"/.exec(svg);
  const h = /\sheight="([\d.]+)"/.exec(svg);
  if (!w || !h) return svg;
  return svg.replace(/<svg\b/, `<svg viewBox="0 0 ${w[1]} ${h[1]}"`);
}

/**
 * 把图里的 <style> **内联到元素上**,然后把 <style> 块删掉。
 *
 * 为什么:出图那道工序(bakeFlatSvg)会把 <style> 整块剥掉 —— 那是给
 * 「var(--d-*) 换色 + 去掉 hover CSS」用的。库里那些图种的画法写在
 * CSS 类里(wavedrom 的 .s1/.s2/…),剥掉样式就等于图没了颜色。
 *
 * 内联之后:图是自足的(没有 CSS,谁画都一个样),浏览器和 PNG 光栅化一致。
 *
 * 只认两种选择器:单个类名(.foo)和单个元素名(text)—— wavedrom 的样式表
 * 就是这个形状;认不出来的规则原样丢在 <style> 里(这里等于删掉)。
 */
export function inlineCss(svg: string): string {
  const rules: { sel: string; decls: string }[] = [];
  let out = svg.replace(/<style([^>]*)>([\s\S]*?)<\/style>/g, (_m, _attrs: string, css: string) => {
    for (const m of css.matchAll(/([^{}]+)\{([^{}]*)\}/g)) {
      const sel = m[1].trim();
      const decls = m[2].trim();
      if (!decls) continue;
      rules.push({ sel, decls });
    }
    return '';
  });
  if (!rules.length) return out;

  const byClass = new Map<string, string>();
  const byTag = new Map<string, string>();
  for (const r of rules) {
    for (const p of r.sel.split(',').map((s) => s.trim()).filter(Boolean)) {
      if (p.startsWith('.')) byClass.set(p.slice(1), (byClass.get(p.slice(1)) ?? '') + ';' + r.decls);
      else if (/^[a-zA-Z][\w-]*$/.test(p)) byTag.set(p, (byTag.get(p) ?? '') + ';' + r.decls);
    }
  }

  out = out.replace(/<([a-zA-Z][\w:-]*)((?:"[^"]*"|'[^']*'|[^>"'])*?)(\/?)>/g, (m, tag: string, attrs: string, slash: string) => {
    const cls = /class="([^"]*)"/.exec(attrs)?.[1] ?? '';
    let decls = byTag.get(tag) ?? '';
    for (const c of cls.split(/\s+/).filter(Boolean)) {
      const d = byClass.get(c);
      if (d) decls += ';' + d;
    }
    if (!decls) return m;
    const existing = /style="([^"]*)"/.exec(attrs)?.[1] ?? '';
    const merged = mergeDecls(decls, existing);
    const newAttrs = existing
      ? attrs.replace(/style="[^"]*"/, `style="${merged}"`)
      : `${attrs} style="${merged}"`;
    return `<${tag}${newAttrs}${slash}>`;
  });
  return out;
}

/** 这些属性的值就是默认值 —— 写了等于没写,内联时省掉(图小一大截) */
const CSS_DEFAULTS: Record<string, string> = {
  'stroke-linejoin': 'miter',
  'stroke-miterlimit': '4',
  'fill-opacity': '1',
  'stroke-opacity': '1',
  'stroke-dasharray': 'none',
  'fill-rule': 'nonzero',
  marker: 'none',
  visibility: 'visible',
  display: 'inline',
  overflow: 'visible',
  'text-anchor': 'start',
};

/** 两串 CSS 声明合并:后者覆盖前者(元素自己的 style 优先) */
function mergeDecls(base: string, over: string): string {
  const order: string[] = [];
  const vals = new Map<string, string>();
  const put = (s: string): void => {
    for (const decl of s.split(';')) {
      const i = decl.indexOf(':');
      if (i < 0) continue;
      const k = decl.slice(0, i).trim();
      const v = decl.slice(i + 1).trim();
      if (!k) continue;
      if (!vals.has(k)) order.push(k);
      vals.set(k, v);
    }
  };
  put(base);
  put(over);
  // 等于默认值的省掉;color 只对 currentColor 有意义,这里用不上
  const kept = order.filter((k) => {
    const v = vals.get(k) ?? '';
    if (k === 'color') return false;
    return CSS_DEFAULTS[k] !== v;
  });
  return kept.map((k) => `${k}:${vals.get(k)}`).join(';');
}

/**
 * 把图里那段 <style> 限定在某棵子树里。
 *
 * 内联 SVG 的 <style> 是**全页生效**的 —— 库里那些通用选择器
 * (text{}、.s1{}、.h1{})会顺手把落地页上的东西也改了。
 * 办法:给每条选择器都加个前缀(rootClass),图根节点上已经有那个 class。
 */
export function scopeCss(svg: string, rootClass: string): string {
  return svg.replace(/<style([^>]*)>([\s\S]*?)<\/style>/g, (_m, attrs: string, css: string) => {
    const scoped = css.replace(/([^{}]+)\{([^{}]*)\}/g, (rule, sel: string, decl: string) => {
      const list = sel.split(',').map((s) => s.trim()).filter(Boolean);
      if (!list.length) return rule;
      const joined = list.map((s) => `${rootClass} ${s}`).join(',');
      return `${joined}{${decl}}`;
    });
    return `<style${attrs}>${scoped}</style>`;
  });
}

/**
 * 给谱面上的每个音标上它在**源码**里的位置(data-cstart / data-cend)。
 *
 * 这样点谱上的一个音,就能选中源码里对应的那几个字(官方 abcjs 编辑器的做法:
 * 契约就是 startChar/endChar)。
 *
 * @param svg 谱面
 * @param notes 每个音的源码位置(顺序跟谱面上的一致)
 * @param pick 从 SVG 里挑出「一个音」的匹配(带捕获组 = 音的序号)
 */
export function annotateNotes(
  svg: string,
  notes: { start: number; end: number }[],
  pick: RegExp,
): string {
  let i = 0;
  return svg.replace(pick, (m: string) => {
    const n = notes[i++];
    if (!n) return m;
    const attrs = ` data-cstart="${n.start}" data-cend="${n.end}"`;
    // 把属性插在这个元素的开始标签末尾(> 之前)
    const at = m.lastIndexOf('>');
    if (at < 0) return m;
    const selfClose = m[at - 1] === '/';
    const cut = selfClose ? at - 1 : at;
    return m.slice(0, cut) + attrs + m.slice(cut);
  });
}
