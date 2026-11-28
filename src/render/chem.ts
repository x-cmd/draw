// 化学结构:SMILES → 分子图。
//
// 布局和画法用 smilesdrawer(https://github.com/reymond-group/smilesDrawer,MIT):
// 它是「建一棵 SVG DOM 树,再序列化」—— Worker 里没有 DOM,于是给它配一个
// 刚够用的最小 SVG DOM(src/render/svgdom.ts)。
//
// 库是**动态载入**的:只有真来 /draw/chem 才付这份下载(≈200KB),
// 别的端点一点不付。
//
// 参数:
//   smiles=<SMILES>   必填。例:CC(=O)Oc1ccccc1C(=O)O(阿司匹林)
//   w= h=             画布大小(默认 400×360)
//   theme=dark|light  配色(默认 dark)
//   title=            图下的小标题(默认写 SMILES 本身)

import { ApiError } from '../specs/base.js';
import { installSvgDom } from './svgdom.js';

export interface ChemOpts {
  width?: number;
  height?: number;
  theme?: string;
  title?: string;
  /** 碳原子的标注:none / default / terminal / acyclic / all */
  showCarbons?: string;
  /** 原子样式:default / balls / allballs */
  atomVisualization?: string;
  /** 显式画出所有氢 */
  explicitHydrogens?: boolean;
  /** 紧凑画法(缩写末端基团) */
  compactDrawing?: boolean;
  /** 立体化学 */
  isomeric?: boolean;
  bondLength?: number;
  bondThickness?: number;
  /** 元素符号的字号 */
  fontSizeLarge?: number;
}

/**
 * 配色:十二套 —— 站上的暗/亮 + smilesDrawer 自带的十套
 * (官方 demo 的主题下拉就是这些;名字沿用库的,不然切不过去)。
 */
const THEMES: Record<string, Record<string, string>> = {
  // 站上的两套:跟着站上的色板走
  dark: {
    FOREGROUND: '#FAFAFA', BACKGROUND: '#0E0F11',
    C: '#FAFAFA', O: '#F87171', N: '#60A5FA', F: '#34D399', CL: '#22D3EE',
    BR: '#FB923C', I: '#A78BFA', P: '#FB923C', S: '#FACC15', B: '#FB923C',
    SI: '#FB923C', H: '#A1A1AA',
  },
  light: {
    FOREGROUND: '#18181B', BACKGROUND: '#FFFFFF',
    C: '#18181B', O: '#DC2626', N: '#2563EB', F: '#059669', CL: '#0891B2',
    BR: '#EA580C', I: '#7C3AED', P: '#EA580C', S: '#CA8A04', B: '#EA580C',
    SI: '#EA580C', H: '#71717A',
  },
  // 库自带的十套(官方 defaultOptions.themes 的原值)
  oldschool: {
    FOREGROUND: '#000000', BACKGROUND: '#ffffff',
    C: '#000000', O: '#000000', N: '#000000', F: '#000000', CL: '#000000',
    BR: '#000000', I: '#000000', P: '#000000', S: '#000000', B: '#000000',
    SI: '#000000', H: '#000000',
  },
  solarized: {
    FOREGROUND: '#586e75', BACKGROUND: '#eee8d5',
    C: '#586e75', O: '#dc322f', N: '#268bd2', F: '#859900', CL: '#16a085',
    BR: '#cb4b16', I: '#6c71c4', P: '#d33682', S: '#b58900', B: '#2aa198',
    SI: '#2aa198', H: '#657b83',
  },
  'solarized-dark': {
    FOREGROUND: '#93a1a1', BACKGROUND: '#073642',
    C: '#93a1a1', O: '#dc322f', N: '#268bd2', F: '#859900', CL: '#16a085',
    BR: '#cb4b16', I: '#6c71c4', P: '#d33682', S: '#b58900', B: '#2aa198',
    SI: '#2aa198', H: '#839496',
  },
  matrix: {
    FOREGROUND: '#678c61', BACKGROUND: '#ffffff',
    C: '#678c61', O: '#2fc079', N: '#4f7e7e', F: '#90d762', CL: '#82d967',
    BR: '#23755a', I: '#409931', P: '#c1ff8a', S: '#faff00', B: '#50b45a',
    SI: '#409931', H: '#426644',
  },
  github: {
    FOREGROUND: '#24292f', BACKGROUND: '#ffffff',
    C: '#24292f', O: '#cf222e', N: '#0969da', F: '#2da44e', CL: '#6fdd8b',
    BR: '#bc4c00', I: '#8250df', P: '#bf3989', S: '#d4a72c', B: '#fb8f44',
    SI: '#bc4c00', H: '#57606a',
  },
  carbon: {
    FOREGROUND: '#161616', BACKGROUND: '#ffffff',
    C: '#161616', O: '#da1e28', N: '#0f62fe', F: '#198038', CL: '#007d79',
    BR: '#fa4d56', I: '#8a3ffc', P: '#ff832b', S: '#f1c21b', B: '#8a3800',
    SI: '#e67e22', H: '#525252',
  },
  cyberpunk: {
    FOREGROUND: '#ea00d9', BACKGROUND: '#ffffff',
    C: '#ea00d9', O: '#ff3131', N: '#0abdc6', F: '#00ff9f', CL: '#00fe00',
    BR: '#fe9f20', I: '#ff00ff', P: '#fe7f00', S: '#fcee0c', B: '#ff00ff',
    SI: '#ffffff', H: '#913cb1',
  },
  gruvbox: {
    FOREGROUND: '#665c54', BACKGROUND: '#fbf1c7',
    C: '#665c54', O: '#cc241d', N: '#458588', F: '#98971a', CL: '#79740e',
    BR: '#d65d0e', I: '#b16286', P: '#af3a03', S: '#d79921', B: '#689d6a',
    SI: '#427b58', H: '#7c6f64',
  },
  'gruvbox-dark': {
    FOREGROUND: '#ebdbb2', BACKGROUND: '#282828',
    C: '#ebdbb2', O: '#fb4934', N: '#83a598', F: '#b8bb26', CL: '#8ec07c',
    BR: '#fe8019', I: '#d3869b', P: '#fabd2f', S: '#fabd2f', B: '#8ec07c',
    SI: '#689d6a', H: '#a89984',
  },
};

/** 库的类型(它的 d.ts 只给了 default 导出,这里按需声明用到的那几个) */
interface SmilesDrawerNS {
  Parser: { parse(smiles: string): unknown };
  SvgDrawer: new (options: Record<string, unknown>) => {
    draw(data: unknown, target: string, themeName: string): { outerHTML: string };
    /** 画完之后,里面存着这一帧的紧框(顶点 bbox + padding)—— 用来把 viewBox 贴紧分子 */
    svgWrapper?: { minX: number; minY: number; maxX: number; maxY: number };
  };
}

const r2 = (v: number): number => Math.round(v * 100) / 100;

/** SMILES → SVG */
export async function renderChem(smiles: string, opts: ChemOpts = {}): Promise<string> {
  const s = smiles.trim();
  if (!s) throw new ApiError(400, '"smiles" is required. Example: /draw/chem?smiles=CCO');
  installSvgDom();
  const mod = await import('smiles-drawer');
  const SD = (mod.default ?? mod) as unknown as SmilesDrawerNS;

  let tree: unknown;
  try {
    tree = SD.Parser.parse(s);
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    // 括号不配是最常见的一类手误 —— 直接告诉用户差几个、在哪儿
    const open = (s.match(/\(/g) ?? []).length;
    const close = (s.match(/\)/g) ?? []).length;
    const hint = /parenthes/i.test(msg) && open !== close
      ? ` (this SMILES has ${open} "(" and ${close} ")")`
      : '';
    throw new ApiError(400, `invalid SMILES: ${msg}${hint}`);
  }

  const width = Math.max(120, Math.min(1600, opts.width ?? 400));
  const height = Math.max(120, Math.min(1200, opts.height ?? 360));
  // 配色:十二套里挑一套(名字对不上就回落到站的暗色)
  const themeName = THEMES[opts.theme ?? ''] ? (opts.theme as string) : 'dark';
  const theme = THEMES[themeName];

  const drawer = new SD.SvgDrawer({
    width, height,
    themes: THEMES,
    // 「同一份 SMILES 的多种画法」—— 这些都是 smilesDrawer 自己的选项
    showCarbons: opts.showCarbons ?? 'default',
    atomVisualization: opts.atomVisualization ?? 'default',
    explicitHydrogens: opts.explicitHydrogens ?? true,
    compactDrawing: opts.compactDrawing ?? true,
    isomeric: opts.isomeric ?? true,
    bondLength: opts.bondLength ?? 16,
    bondThickness: opts.bondThickness ?? 1.1,
    fontSizeLarge: opts.fontSizeLarge ?? 6,
  });
  const svg = drawer.draw(tree, 'svg', themeName);
  const inner = svg.outerHTML;

  // 库给的 viewBox 是「取长的那边」的正方形画布 —— 分子只占中间一块,四边全是空的。
  // 再按用户宽高比一撑,空得更多 ⇒ 分子缩在画布一角,四周一大片空白(见 issue #183)。
  //
  // 改成:用库自己算的**紧框**(顶点 bbox + padding,画完在 svgWrapper 里),
  // 再按用户宽高比撑开 —— 分子贴着画布边,空出来的只有比例本身要的那点。
  // padding 默认 10 个单位,原子旁边的标签(H3C/HO 这些)也在里头,不会切掉。
  const sw = drawer.svgWrapper;
  const tight =
    sw && [sw.minX, sw.minY, sw.maxX, sw.maxY].every((n) => Number.isFinite(n)) && sw.maxX > sw.minX && sw.maxY > sw.minY
      ? { x: sw.minX, y: sw.minY, w: sw.maxX - sw.minX, h: sw.maxY - sw.minY }
      : null;
  const vb = /viewBox="([^"]+)"/.exec(inner);
  const fromViewBox = (): { x: number; y: number; w: number; h: number } | null => {
    if (!vb) return null;
    const [vx, vy, vw, vh] = vb[1].split(/\s+/).map(Number);
    if (![vx, vy, vw, vh].every((n) => Number.isFinite(n)) || vw <= 0 || vh <= 0) return null;
    return { x: vx, y: vy, w: vw, h: vh };
  };
  const base = tight ?? fromViewBox();
  let box = { x: 0, y: 0, w: width, h: height };
  let out = inner;
  if (base) {
    // 用户给的宽高比 —— 把框按比例撑开(分子居中,空出来的是比例本身要的留白),
    // 否则 4:3 的画布会把分子压扁。
    const want = width / height;
    let nw = base.w;
    let nh = base.h;
    if (base.w / base.h < want) nw = base.h * want; else nh = base.w / want;
    box = { x: base.x + (base.w - nw) / 2, y: base.y + (base.h - nh) / 2, w: nw, h: nh };
    out = inner.replace(/viewBox="[^"]+"/, `viewBox="${r2(box.x)} ${r2(box.y)} ${r2(box.w)} ${r2(box.h)}"`);
  }
  // 尺寸与字体栈换成我们的(库里已经写了 width/height,先去掉再写)
  out = out.replace(/(<svg\b[^>]*?)\swidth="[^"]*"/, '$1').replace(/(<svg\b[^>]*?)\sheight="[^"]*"/, '$1');
  out = out.replace(/<svg\b/, `<svg width="${width}" height="${height}"`);
  out = out.replace(
    /font-family="[^"]*"/,
    `font-family="ui-sans-serif,-apple-system,BlinkMacSystemFont,'Segoe UI','PingFang SC','Hiragino Sans GB','Microsoft YaHei',sans-serif"`,
  );
  // 底色:用这套配色自己的 BACKGROUND(十二套各不相同)
  out = out.replace(
    /(<svg\b[^>]*>)/,
    `$1<rect x="${r2(box.x)}" y="${r2(box.y)}" width="${r2(box.w)}" height="${r2(box.h)}" fill="${theme.BACKGROUND}"/>`,
  );
  // 库里 <style> 用的是 .element / .sub 这种**通用类名** ——
  // 内联 SVG 的样式是全页生效的,会顺手把落地页的副标题(.sub)改成 3pt。
  // 给它们加个前缀,只在这张图里生效。
  out = out
    .replace(/class="element"/g, 'class="chem-element"')
    .replace(/class="sub"/g, 'class="chem-sub"')
    .replace(/\.element(\s*)\{/g, '.chem-element$1{')
    .replace(/\.sub(\s*)\{/g, '.chem-sub$1{');

  // 每个原子是库画的一个 <g>(里面一个 text)—— 给它加个类与名字,就能点选。
  //
  // transform 写成**属性**,不是 CSS:resvg(PNG 那条路的光栅化器)不认 style 里的
  // transform —— 原子会全跑到原点,标签全挤在左上角,图看着像缺了一块。
  // 浏览器两条都认,所以写成属性对网页没影响,对 PNG 是修好。
  out = out.replace(
    /<g style="transform: translateX\(([-\d.]+)px?\) translateY\(([-\d.]+)px?\)">/g,
    '<g class="chem-atom" transform="translate($1 $2)">',
  );
  out = out.replace(/<g class="chem-atom"([^>]*)>(.*?)<\/g>/g, (_m, attrs, inner) => {
    const label = [...inner.matchAll(/<tspan[^>]*>([^<]*)<\/tspan>/g)].map((t) => t[1]).join('');
    return `<g class="chem-atom" data-label="${label.replace(/"/g, '&quot;')}"${attrs}>${inner}</g>`;
  });
  // 点选的样式:选中的那个亮着,别的淡下去(样式写在图自己的 <style> 里,
  // 单独当图片用的时候也在)
  out = out.replace('</style>', `.chem-atom{cursor:pointer}
    .chem-pick .chem-atom{opacity:.22}
    .chem-pick .chem-atom.hl{opacity:1}
    </style>`);
  // 主体套一层 g#am —— 跟别的图一个约定(交互脚本按它找根组)
  out = out.replace(/(<svg\b[^>]*>)/, '$1<g id="am">');
  const at = out.lastIndexOf('</svg>');
  if (at >= 0) out = out.slice(0, at) + '</g>' + out.slice(at);
  return out;
}
