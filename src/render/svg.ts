// SVG 生成通用工具:转义、数字格式化、好看刻度、metadata 嵌入、文档包装与公共图元。
import { FONT, TAB } from '../theme.js';
import { ticks as d3Ticks, tickStep } from 'd3-array';
import { INTER_FACE_CSS, INTER_WIDTHS } from '../styles/inter.js';
import type { Skin, Duo } from '../styles/types.js';

export function esc(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

const trim1 = (x: number): string => {
  const s = x.toFixed(1);
  return s.endsWith('.0') ? s.slice(0, -2) : s;
};

// 紧凑格式:1234 -> "1.2k", 1500000 -> "1.5M"
export function fmtNum(n: number): string {
  const abs = Math.abs(n);
  if (abs >= 1e9) return trim1(n / 1e9) + 'B';
  if (abs >= 1e6) return trim1(n / 1e6) + 'M';
  if (abs >= 1e3) return trim1(n / 1e3) + 'k';
  if (abs > 0 && abs < 0.01) return n.toPrecision(2); // 微值不用固定 2 位小数(会抹成 0)
  return String(Math.round(n * 100) / 100);
}

// 完整格式:4821 -> "4,821"
export function fmtFull(n: number): string {
  const r = Math.round(n * 100) / 100;
  return r.toLocaleString('en-US', { maximumFractionDigits: 2 });
}

export function trunc(s: string, n: number): string {
  return s.length > n ? s.slice(0, n - 1) + '…' : s;
}

export const r2 = (n: number): number | string => Math.round(n * 100) / 100;

// "好看"步长:d3 的 1/2/5×10ⁿ 阶梯
export function niceStep(raw: number): number {
  if (!(raw > 0)) return 1;
  return tickStep(0, raw, 1);
}

// 按步长量级取精度再取整(固定 2 位小数会把 0.0001 之类的微值刻度抹成 0 → NaN)
export function snap(v: number, step: number): number {
  const decimals = Math.max(0, -Math.floor(Math.log10(step)) + 2);
  const p = Math.pow(10, decimals);
  return Math.round(v * p) / p;
}

// 0..max 的刻度:0 起步、顶格向上取整(数据不超轴顶),刻度数 count±2(d3 惯例)
export function niceTicks(max: number, count = 4): number[] {
  if (!(max > 0)) return [0, 1];
  const t = d3Ticks(0, max, count);
  if (t.length >= 2 && t[t.length - 1] >= max - 1e-9) return t;
  const step = niceStep(max / count);
  const n = Math.ceil(max / step - 1e-9);
  const out: number[] = [];
  for (let i = 0; i <= n; i++) out.push(snap(i * step, step));
  return out;
}

// 任意区间 [min,max] 的"好看"刻度(散点图等不从 0 开始的轴)
export function rangeTicks(min: number, max: number, count = 4): number[] {
  if (!(max > min)) return [min];
  const step = niceStep((max - min) / count);
  const out: number[] = [];
  for (let v = Math.ceil(min / step) * step; v <= max + 1e-9; v += step) {
    out.push(snap(v, step));
  }
  return out.length > 0 ? out : [min, max];
}

// 内嵌结构化 metadata:数据 + 模板 + 版本,AI 可直接读取
function metaTag(template: string, version: number, spec: unknown): string {
  const json = JSON.stringify({ generator: 'draw', template, version, spec });
  return `<metadata>${esc(json)}</metadata>`;
}

// 顶部图例:anchor='left' 从左往右(shadcn 圆点) | 'right' 从右往左(Evil 方块)
// item.index is only passed by interactive embedders: the legend item gets a
// data-legend attribute plus an invisible hit rect (for click-to-toggle series).
export function topLegend(
  items: readonly { name: string; color: string; index?: number }[],
  x: number,
  y: number,
  anchor: 'left' | 'right' = 'right',
  shape: 'circle' | 'square' = 'circle',
): string {
  const parts: string[] = [];
  const lg = (index: number | undefined): string => (index === undefined ? '' : ` data-legend="${index}"`);
  const swatch = (sx: number, color: string, index?: number): string =>
    shape === 'square'
      ? `<rect x="${r2(sx - 5)}" y="${r2(y - 9)}" width="11" height="11" rx="3" fill="${color}"${lg(index)}/>`
      : `<circle cx="${r2(sx)}" cy="${r2(y - 4)}" r="5" fill="${color}"${lg(index)}/>`;
  const hit = (bx: number, bw: number, index?: number): string =>
    index === undefined
      ? ''
      : `<rect x="${r2(bx)}" y="${r2(y - 16)}" width="${r2(bw)}" height="20" fill="none" pointer-events="all" role="button" tabindex="0"${lg(index)}/>`;
  const gap = shape === 'square' ? 18 : 13;
  if (anchor === 'left') {
    let cx = x;
    for (const it of items) {
      const w = textW(it.name, 12);
      parts.push(swatch(cx, it.color, it.index));
      parts.push(`<text x="${r2(cx + gap)}" y="${r2(y)}" font-size="12" font-weight="500" fill="var(--d-text)"${lg(it.index)}>${esc(it.name)}</text>`);
      parts.push(hit(cx - 10, gap + w + 16, it.index));
      cx += gap + w + 26;
    }
  } else {
    let cx = x;
    for (let i = items.length - 1; i >= 0; i--) {
      const it = items[i];
      const w = textW(it.name, 12);
      const swatchX = cx - w - (shape === 'square' ? 18 : 10);
      parts.push(`<text x="${r2(cx)}" y="${r2(y)}" text-anchor="end" font-size="12" font-weight="500" fill="var(--d-text)"${lg(it.index)}>${esc(it.name)}</text>`);
      parts.push(swatch(swatchX, it.color, it.index));
      parts.push(hit(swatchX - 8, w + (shape === 'square' ? 18 : 10) + 14, it.index));
      cx -= w + 28 + (shape === 'square' ? 8 : 0);
    }
  }
  return parts.join('');
}

// 系列色 / 系列上文字色的 var 引用(渲染器一律使用)
export const sVar = (i: number): string => `var(--d-s${i + 1})`;
export const onVar = (i: number): string => `var(--d-on-s${i + 1})`;

const lumaHex = (hex: string): number => {
  const h = hex.replace('#', '');
  return 0.299 * parseInt(h.slice(0, 2), 16) + 0.587 * parseInt(h.slice(2, 4), 16) + 0.114 * parseInt(h.slice(4, 6), 16);
};
const onDuo = (d: Duo): Duo => ({
  light: lumaHex(d.light) > 150 ? '#18181b' : '#ffffff',
  dark: lumaHex(d.dark) > 150 ? '#18181b' : '#ffffff',
});

// 皮肤 → 内嵌样式块(auto=双套+media query,dark/light=单套);含 Inter 子集 @font-face
function skinStyle(skin: Skin): string {
  const n = skin.neutrals;
  const varsOf = (side: 'light' | 'dark'): string => {
    const items: string[] = [];
    skin.series.forEach((d, i) => items.push(`--d-s${i + 1}:${d[side]}`, `--d-on-s${i + 1}:${onDuo(d)[side]}`));
    items.push(
      `--d-ramp-a:${skin.ramp[0][side]}`, `--d-ramp-b:${skin.ramp[1][side]}`,
      `--d-ink:${n.ink[side]}`, `--d-text:${n.text[side]}`, `--d-muted:${n.muted[side]}`, `--d-faint:${n.faint[side]}`,
      `--d-grid:${n.grid[side]}`, `--d-baseline:${n.baseline[side]}`, `--d-border:${n.border[side]}`,
      `--d-card:${n.card[side]}`, `--d-halo:${n.halo[side]}`,
    );
    return `:root{color-scheme:${side};${items.join(';')}}`;
  };
  if (skin.scheme === 'auto') {
    return `<style>${INTER_FACE_CSS}${varsOf('light')}@media (prefers-color-scheme: dark){${varsOf('dark')}}</style>`;
  }
  return `<style>${INTER_FACE_CSS}${varsOf(skin.scheme)}</style>`;
}

// 统一 SVG 文档包装:外壳 + 皮肤变量 + metadata(渲染器不再各自拼 <svg>)
export function svgDoc(
  width: number,
  height: number,
  template: string,
  version: number,
  aria: string,
  spec: unknown,
  skin: Skin,
  children: string,
): string {
  return (
    `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" ` +
    `font-family="${FONT}" role="img" aria-label="${esc(aria)}">` +
    skinStyle(skin) + metaTag(template, version, spec) + children + `</svg>`
  );
}

// 标题块:plain = 18px/500(Evil 系);editorial = 30px/600 自然语言大标题(OpenData 系)
// editorial 超宽换行至多 2 行(Latin 按词、CJK 逐字),装不下省略号截断
export function editorialTitle(title: string, width: number, pad: number): { svg: string; height: number } {
  const maxW = width - pad * 2;
  // 切分原子:Latin 词(含尾部空格)与单个 CJK 字符
  const atoms = title.match(/[A-Za-z0-9'’\-]+\s*|[^\s]/g) ?? [...title];
  const lines: string[] = [];
  let cur = '';
  let truncated = false;
  for (const atom of atoms) {
    if (textW(cur + atom, 16) <= maxW) {
      cur += atom;
      continue;
    }
    if (cur.trim()) lines.push(cur.trimEnd());
    cur = atom.trimStart();
    if (lines.length === 2) {
      truncated = true;
      cur = '';
      break;
    }
  }
  if (cur.trim() && lines.length < 2) lines.push(cur.trimEnd());
  if (truncated && lines.length) {
    let last = lines[lines.length - 1];
    while (last.length > 1 && textW(last + '…', 16) > maxW) last = last.slice(0, -1);
    lines[lines.length - 1] = last + '…';
  }
  const svg = lines
    .map((l, i) => `<text x="${pad}" y="${pad + 30 + i * 34.5}" font-size="30" font-weight="600" letter-spacing="-0.02em" fill="var(--d-ink)">${esc(l)}</text>`)
    .join('');
  return { svg, height: lines.length * 34.5 + 10 };
}

export function titleBlock(title: string | undefined, pad = 24): string {
  if (!title) return '';
  return `<text x="${pad}" y="${pad + 14}" font-size="18" font-weight="500" letter-spacing="-0.02em" fill="var(--d-ink)">${esc(title)}</text>`;
}

// Y 轴三件套:网格线 + 刻度文字 + 基线;inline = 刻度悬在网格线上方(OpenData 风)
export function yAxisGrid(
  parts: string[],
  ticks: number[],
  y: (v: number) => number,
  left: number,
  right: number,
  bottom: number,
  grid: 'solid' | 'dashed' | 'none' = 'solid',
  gridDash = '3 8',
  inline = false,
  baseline: 'line' | 'dots' | 'none' = 'line',
  xDots: number[] = [],
  tickFs = 12,
  tickGap = 8,
): void {
  for (const t of ticks) {
    const gy = r2(y(t));
    // 无基线模式(规范 area-1)0 刻度也画网格线,充当底边
    if ((t > 0 || baseline === 'none') && grid !== 'none') {
      const dash = grid === 'dashed' ? ` stroke-dasharray="${gridDash}"` : '';
      parts.push(`<line x1="${left}" y1="${gy}" x2="${right}" y2="${gy}" stroke="var(--d-grid)" stroke-width="1"${dash}/>`);
    }
    if (inline) {
      parts.push(`<text x="${left}" y="${r2(y(t) - 6)}" text-anchor="start" font-size="${tickFs}" fill="var(--d-muted)" style="${TAB}">${fmtNum(t)}</text>`);
    } else {
      parts.push(`<text x="${r2(left - tickGap)}" y="${r2(y(t) + 4)}" text-anchor="end" font-size="${tickFs}" fill="var(--d-muted)" style="${TAB}">${fmtNum(t)}</text>`);
    }
  }
  if (baseline === 'line') {
    parts.push(`<line x1="${left}" y1="${bottom}" x2="${right}" y2="${bottom}" stroke="var(--d-baseline)" stroke-width="1"/>`);
  } else if (baseline === 'dots') {
    for (const dx of xDots) {
      parts.push(`<circle cx="${r2(dx)}" cy="${r2(bottom + 12)}" r="3" fill="var(--d-baseline)" fill-opacity="0.8"/>`);
    }
  }
}


// 旋转 Y 轴标题(取 unit;OpenData 风)
export function axisTitleY(unit: string | undefined, midY: number, x = 32): string {
  if (!unit) return '';
  return `<text x="${x}" y="${r2(midY)}" text-anchor="middle" font-size="15" font-weight="500" fill="var(--d-ink)" transform="rotate(-90, ${x}, ${r2(midY)})">${esc(unit)}</text>`;
}

// 多系列全局峰值(系列号, 点号),num=peak 与加粗用
export function findPeak(series: readonly { values: readonly number[] }[]): [number, number] {
  let ps = 0;
  let pp = 0;
  series.forEach((s, si) =>
    s.values.forEach((v, pi) => {
      if (v > series[ps].values[pp]) { ps = si; pp = pi; }
    }),
  );
  return [ps, pp];
}

// 渲染公共选项(所有渲染器共用)
/**
 * Options shared by every renderer: canvas, version, skin, and feature flags.
 */
export interface RenderOpts {
  width: number;
  height: number;
  version: number;
  skin: Skin;
  /** 数值标注:all=全部(默认) peak=仅最高 none=不标 */
  valueLabels?: 'all' | 'peak' | 'none';
  /** 用户未显式指定 ?h=:允许渲染器按需自动调整高度(如堆叠柱量级差过大时拉高) */
  autoHeight?: boolean;
  /** 用户未显式指定 ?w=:允许渲染器按需自动加宽(如分组柱太密放不下时) */
  autoWidth?: boolean;
  /** 环形图形态:true=环形(默认) false=实心饼 */
  donut?: boolean;
  /** 参考线数值(hbar opendata:?ref=4.5) */
  refLine?: number;
  /** 参考线文案(?reflabel=WCAG AA) */
  refLabel?: string;
  /** Interactive embedders (/explore): emit data-tip on data shapes for client tooltips */
  interactive?: boolean;
}

// 文字宽度:与内嵌 Inter 子集同源的 advance 表,宽度 = fs × Σ(advance/em)。
// 中文/全角 1em;子集外字符保守 1em(宁宽勿窄)
export function textW(s: string, fs: number): number {
  let em = 0;
  for (const ch of s) {
    em += ch.charCodeAt(0) > 0x2e80 ? 1 : INTER_WIDTHS[ch] ?? 1; // CJK=1em;未知拉丁按 1em(保守)
  }
  return em * fs;
}

// Catmull-Rom 平滑曲线转三次贝塞尔(t≈0.2),折线类共用
export function smoothPath(pts: [number, number][]): string {
  if (pts.length < 3) return `M${pts.map((p) => `${r2(p[0])} ${r2(p[1])}`).join('L')}`;
  let d = `M${r2(pts[0][0])} ${r2(pts[0][1])}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] ?? pts[i];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[i + 2] ?? p2;
    const t = 0.2;
    const c1x = p1[0] + (p2[0] - p0[0]) * t;
    const c1y = p1[1] + (p2[1] - p0[1]) * t;
    const c2x = p2[0] - (p3[0] - p1[0]) * t;
    const c2y = p2[1] - (p3[1] - p1[1]) * t;
    d += `C${r2(c1x)} ${r2(c1y)} ${r2(c2x)} ${r2(c2y)} ${r2(p2[0])} ${r2(p2[1])}`;
  }
  return d;
}

// 按底色亮度选字色:亮底→墨色,深底→白色
export function onColor(hex: string): string {
  const h = hex.replace('#', '');
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  return 0.299 * r + 0.587 * g + 0.114 * b > 150 ? '#18181b' : '#ffffff';
}

// 标签白描边属性(压在任意底色上都可读;仅 pushLineLabel 内部使用)
const HALO = 'paint-order="stroke" stroke="var(--d-halo)" stroke-width="3" stroke-linejoin="round"';

// 标签碰撞检测:重叠即舍弃,保证任何情况下数字不重叠
export class LabelPlacer {
  private boxes: [number, number, number, number][] = [];
  fits(x: number, y: number, w: number, h: number): boolean {
    for (const [bx, by, bw, bh] of this.boxes) {
      if (x < bx + bw && x + w > bx && y < by + bh && y + h > by) return false;
    }
    this.boxes.push([x, y, w, h]);
    return true;
  }
  /** 无条件占位:柱内标签等"位置已定"的文字,让后续标签(如线标签)避让 */
  reserve(x: number, y: number, w: number, h: number): void {
    this.boxes.push([x, y, w, h]);
  }
}

// 预留固定文字区(图例/刻度带/X 标签带):数值标签不得压上,避不开则整层不标
export function reserveBands(
  placer: LabelPlacer,
  left: number,
  right: number,
  contentTop: number,
  bottom: number,
  xLabelY: number | null,
  legendItems: readonly { name: string }[],
  legendX: number,
  legendY: number,
): void {
  placer.reserve(0, contentTop - 10, Math.max(left - 8, 1), bottom - contentTop + 20); // Y 刻度带
  if (xLabelY !== null) placer.reserve(left - 40, xLabelY - 12, right - left + 80, 18); // X 标签带
  if (legendItems.length) {
    const w = legendItems.reduce((s, it) => s + 15 + textW(it.name, 12) + 26, -26);
    placer.reserve(legendX - w - 8, legendY - 14, w + 16, 22);
  }
}

// X 轴标签抽稀步长:按最宽标签与槽宽决定隔几个显示一个(不重叠)
export function labelStride(labels: readonly string[], slot: number, fs = 12): number {
  if (slot <= 0) return 1;
  const maxW = Math.max(...labels.map((l) => textW(trunc(l, 12), fs)));
  return Math.max(1, Math.ceil((maxW + 4) / slot));
}

// 预留画布四边边带:标签候选位越出画布即不可放(LabelPlacer 不感知画布尺寸)
export function reserveEdges(placer: LabelPlacer, width: number, height: number): void {
  placer.reserve(-2, -2, width + 4, 2); // 上
  placer.reserve(-2, height, width + 4, 2); // 下
  placer.reserve(-2, -2, 2, height + 4); // 左
  placer.reserve(width, -2, 2, height + 4); // 右
}

// 数据点(hollow=空心描边 / filled=实心+白描边),折线/面积系列共用
export function pushPoints(
  parts: string[],
  pts: readonly (readonly [number, number])[],
  color: string,
  rules: { points: 'filled' | 'hollow' | 'none'; pointR: number },
): void {
  if (rules.points === 'none') return;
  for (const [px, py] of pts) {
    const attrs = rules.points === 'hollow'
      ? `fill="var(--d-halo)" stroke="${color}" stroke-width="2.5"`
      : `fill="${color}" stroke="var(--d-halo)" stroke-width="3"`;
    parts.push(`<circle cx="${r2(px)}" cy="${r2(py)}" r="${rules.pointR}" ${attrs}/>`);
  }
}

// 全有或全无的柱内数值标注:入柱(字号可缩到 7px)→ 回退柱顶/柱右侧 → 整层不标
export function pushBarLabelsAllOrNothing(
  parts: string[],
  items: readonly { x: number; yt: number; w: number; hAvail: number; text: string; fs: number; peak: boolean; fill: string; center?: boolean; side?: boolean; fallFill?: string; row?: number; fx?: number; fyt?: number; haloColor?: string; insideOnly?: boolean }[],
  sharedPlacer?: LabelPlacer,
  segments: readonly LineSeg[] = [],
): boolean {
  const out: string[] = [];
  const placer = sharedPlacer ?? new LabelPlacer();
  for (const l of items) {
    // 优先入柱:宽度/高度不够先自动缩字号(下限 7px)
    let fs = l.fs;
    let tw = textW(l.text, fs);
    while (fs > 7 && (l.w < tw + 4 || l.hAvail < fs + 4)) {
      fs -= 0.5;
      tw = textW(l.text, fs);
    }
    if (l.w >= tw + 4 && l.hAvail >= fs + 4) {
      // 柱内 3×3 挪位避开穿过的折线(线保持连续)
      const tyTop = l.yt + 1 + fs;
      const tyMax = Math.max(tyTop, l.yt + (l.center ? l.hAvail - 1 : l.hAvail - 2));
      const xs3 = [0.5, 0.26, 0.74];
      // 纵向自柱顶逐级下移
      const ys: number[] = [];
      for (let ty = tyTop; ty <= tyMax && ys.length < 3; ty += fs + 3) ys.push(ty);
      if (ys.length === 0) ys.push(tyTop);
      let placed = false;
      for (const ty of ys) {
        for (const xf of xs3) {
          const cx = l.x + l.w * xf;
          const bx = cx - tw / 2 - 1;
          if (segments.some(([sx1, sy1, sx2, sy2]) => segRectIntersect(sx1, sy1, sx2, sy2, bx - 1, ty - fs - 1, tw + 2, fs + 2))) continue;
          if (!placer.fits(bx, ty - fs, tw + 2, fs + 2)) continue;
          const halo = l.haloColor ? `paint-order="stroke" stroke="${l.haloColor}" stroke-width="3" stroke-linejoin="round" ` : '';
          out.push(
            `<text x="${r2(cx)}" y="${r2(ty)}" text-anchor="middle" font-size="${r2(fs)}" ${l.peak ? 'font-weight="600" ' : ''}fill="${l.fill}" ${halo}style="${TAB}">${l.text}</text>`,
          );
          placed = true;
          break;
        }
        if (placed) break;
      }
      if (placed) continue;
      // 柱内挪不开 → 交给下面的回退
    }
    // "只准柱内"(分组柱):放不下整层不标,避免柱顶堆出一列数字
    if (l.insideOnly) return false;
    // 回退位按原字号渲染,宽度须按原字号重算
    const fTw = textW(l.text, l.fs);
    if (l.side) {
      // 柱右侧回退:纵向多档尝试,避折线与其他标签
      const baseTy = l.yt + Math.max(l.hAvail / 2, l.fs * 0.36);
      const bx = l.x + l.w + 4;
      const step = l.fs + 3;
      let ok = false;
      for (const ty of [baseTy, baseTy - step, baseTy + step, baseTy - 2 * step, baseTy + 2 * step]) {
        if (segments.some(([sx1, sy1, sx2, sy2]) => segRectIntersect(sx1, sy1, sx2, sy2, bx - 1, ty - l.fs - 1, fTw + 2, l.fs + 2))) continue;
        if (!placer.fits(bx, ty - l.fs, fTw + 2, l.fs + 2)) continue;
        out.push(
          `<text x="${r2(bx)}" y="${r2(ty)}" text-anchor="start" font-size="${l.fs}" ${l.peak ? 'font-weight="600" ' : ''}fill="${l.fallFill ?? 'var(--d-ink)'}" ${HALO} style="${TAB}">${l.text}</text>`,
        );
        ok = true;
        break;
      }
      if (!ok) return false;
    } else {
      // 矮柱/窄柱回退:收拢到组中线(fx)上方按 row 堆叠
      const cx = l.fx ?? l.x + l.w / 2;
      const ty = (l.fyt ?? l.yt) - 6 - (l.row ?? 0) * (l.fs + 4);
      const bx = cx - fTw / 2 - 1;
      if (!placer.fits(bx, ty - l.fs, fTw + 2, l.fs + 2)) return false;
      out.push(
        `<text x="${r2(cx)}" y="${r2(ty)}" text-anchor="middle" font-size="${l.fs}" ${l.peak ? 'font-weight="600" ' : ''}fill="var(--d-ink)" paint-order="stroke" stroke="var(--d-halo)" stroke-width="3" stroke-linejoin="round" style="${TAB}">${l.text}</text>`,
      );
    }
  }
  parts.push(...out);
  return true;
}

// 全有或全无的线点标签:两位置尝试,任一失败整层放弃
export function pushLineLabelsAllOrNothing(
  parts: string[],
  placer: LabelPlacer,
  items: readonly { px: number; py: number; text: string; isPeak: boolean }[],
  segments: readonly LineSeg[] = [],
): boolean {
  const out: string[] = [];
  for (const l of items) {
    const probe: string[] = [];
    pushLineLabel(probe, placer, l.px, l.py, l.text, l.isPeak, segments);
    if (probe.length === 0) return false;
    out.push(...probe);
  }
  parts.push(...out);
  return true;
}

// 线段与矩形是否相交(Liang-Barsky 参数裁剪)
export function segRectIntersect(x1: number, y1: number, x2: number, y2: number, rx: number, ry: number, rw: number, rh: number): boolean {
  let t0 = 0;
  let t1 = 1;
  const dx = x2 - x1;
  const dy = y2 - y1;
  const p = [-dx, dx, -dy, dy];
  const q = [x1 - rx, rx + rw - x1, y1 - ry, ry + rh - y1];
  for (let i = 0; i < 4; i++) {
    if (p[i] === 0) {
      if (q[i] < 0) return false;
    } else {
      const r = q[i] / p[i];
      if (p[i] < 0) {
        if (r > t1) return false;
        if (r > t0) t0 = r;
      } else {
        if (r < t0) return false;
        if (r < t1) t1 = r;
      }
    }
  }
  return true;
}

/** 折线障碍段:文字不得压线(线横穿数字会看不清) */
export type LineSeg = readonly [number, number, number, number];

/** 由点序列构造折线障碍段 */
export function toSegments(pts: readonly (readonly [number, number])[]): LineSeg[] {
  const out: LineSeg[] = [];
  for (let i = 1; i < pts.length; i++) out.push([pts[i - 1][0], pts[i - 1][1], pts[i][0], pts[i][1]] as const);
  return out;
}

// 线点数值标签:近位(上下左右)→ 远位,共 8 个候选;还需避开折线本身
export function pushLineLabel(
  parts: string[],
  placer: LabelPlacer,
  px: number,
  py: number,
  text: string,
  isPeak: boolean,
  segments: readonly LineSeg[] = [],
): void {
  const fs = isPeak ? 13 : 11;
  const w = textW(text, fs);
  const candidates: { x: number; y: number; anchor: 'middle' | 'start' | 'end' }[] = [
    { x: px, y: py - 12, anchor: 'middle' },
    { x: px, y: py + 16, anchor: 'middle' },
    { x: px + 10, y: py + 4, anchor: 'start' },
    { x: px - 10, y: py + 4, anchor: 'end' },
    { x: px, y: py - 30, anchor: 'middle' },
    { x: px, y: py + 34, anchor: 'middle' },
    { x: px + 26, y: py + 4, anchor: 'start' },
    { x: px - 26, y: py + 4, anchor: 'end' },
  ];
  // 排除与该点相连的线段(必然贴边)
  const relevant = segments.filter(
    ([x1, y1, x2, y2]) => Math.hypot(x1 - px, y1 - py) > 0.6 && Math.hypot(x2 - px, y2 - py) > 0.6,
  );
  for (const c of candidates) {
    const bx = c.anchor === 'middle' ? c.x - w / 2 : c.anchor === 'start' ? c.x : c.x - w;
    const by = c.y - fs;
    // 折线横穿标签框 → 换位置
    if (relevant.some(([sx1, sy1, sx2, sy2]) => segRectIntersect(sx1, sy1, sx2, sy2, bx - 1, by - 1, w + 2, fs + 2))) continue;
    if (placer.fits(bx, by, w, fs)) {
      parts.push(
        `<text x="${r2(c.x)}" y="${r2(c.y)}" text-anchor="${c.anchor}" font-size="${fs}" ${isPeak ? 'font-weight="600" ' : ''}fill="${isPeak ? 'var(--d-ink)' : 'var(--d-text)'}" ${HALO} style="${TAB}">${text}</text>`,
      );
      return;
    }
  }
}
