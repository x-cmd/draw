// 四向箭头(compass):中心一个点,上右下左四个方向各一支箭头,箭头端点带标签。
// 与四象限(quadrant)的分别:那边是两条轴切出四个区域,这边是四个方向各出一支箭头。
//
// 画法(商业图的样子):中心一个圆盘;四支箭头用不同系列色(四个方向一眼可分),
// 箭身为渐窄的锥形(不是一根细线),端点的标签做成胶囊(带同色小圆点)。
import type { CompassArm, CompassSpec } from '../specs/index.js';
import { BASELINE } from '../styles/baseline.js';
import { card } from '../theme.js';
import { esc, r2, textW, trunc, type RenderOpts, svgDoc, titleBlock, sVar } from './svg.js';

/**
 * 标签折行(按字宽折,最多 maxLines 行)——
 * 方向标签比「胶囊」能装下的宽 ⇒ 宁可折成两行,不要截成「Invest …」:
 * 截一半的标签等于给错信息(读者只能猜)。
 */
function wrapLabel(text: string, maxW: number, fs: number, maxLines = 2): string[] {
  if (!text) return [];
  const w = (ch: string): number => (ch.charCodeAt(0) > 0x2e80 ? fs : fs * 0.55);
  const chars = [...text];
  if (chars.reduce((s, c) => s + w(c), 0) <= maxW) return [text];
  const lines: string[] = [];
  let line = '';
  let lw = 0;
  for (const ch of chars) {
    const cw = w(ch);
    if (lw + cw > maxW && line !== '') {
      lines.push(line);
      line = ch;
      lw = cw;
      if (lines.length >= maxLines) break;
    } else {
      line += ch;
      lw += cw;
    }
  }
  if (line && lines.length < maxLines) lines.push(line);
  return lines.length ? lines : [text];
}

const ARROW = 12;  // 箭头长度
const BASE = 5.5;  // 箭身根部半宽
// 字号偏大:看这图的人年长,字要看得清
const FS_LABEL = BASELINE.axisName;  // 方向标签
const FS_NOTE = BASELINE.note;   // 副说明

/**
 * Compass chart: four labelled arrows radiating from a center point.
 */
export function renderCompass(spec: CompassSpec, o: RenderOpts): string {
  const { width, height, version, skin } = o;
  const bg = card(width, height, skin.rules.canvas === 'plain');
  const parts: string[] = [];

  const titleH = spec.title ? 44 : 12;
  const cx = width / 2;
  const cy = titleH + (height - titleH) / 2;
  // 箭头长度:留出端点标签的位置(标签在端点外,再留一行副说明)
  const arm = Math.max(64, Math.min(width, height) * 0.28);

  const arms: { dir: 'up' | 'right' | 'down' | 'left'; a: CompassArm; ux: number; uy: number }[] = [
    { dir: 'up', a: spec.up ?? {}, ux: 0, uy: -1 },
    { dir: 'right', a: spec.right ?? {}, ux: 1, uy: 0 },
    { dir: 'down', a: spec.down ?? {}, ux: 0, uy: 1 },
    { dir: 'left', a: spec.left ?? {}, ux: -1, uy: 0 },
  ];

  let idx = 0;
  for (const { a, ux, uy } of arms) {
    if (!a.label && !a.note) continue;
    const color = sVar(idx % skin.series.length);
    idx++;
    const x2 = cx + ux * arm;
    const y2 = cy + uy * arm;
    const px = -uy;
    const py = ux;
    // 箭身:根部宽、末端收成尖(锥形),比一根细线有分量
    const bx = cx + ux * (arm - ARROW);
    const by = cy + uy * (arm - ARROW);
    parts.push(`<path d="M${r2(cx + px * BASE)} ${r2(cy + py * BASE)}L${r2(bx + px * BASE)} ${r2(by + py * BASE)}L${r2(x2)} ${r2(y2)}L${r2(bx - px * BASE)} ${r2(by - py * BASE)}L${r2(cx - px * BASE)} ${r2(cy - py * BASE)}Z" fill="${color}" fill-opacity="0.16" stroke="${color}" stroke-width="1.6" stroke-linejoin="round"/>`);
    // 端点标签:胶囊(同色小圆点 + 文字),上下方向居中、左右方向顺排
    // 标签折行而不是截断(见 wrapLabel 的说明)
    const maxLabelW = ux === 0
      ? width - 48
      : Math.max(70, (ux > 0 ? width - 16 - (x2 + 14) : (x2 - 14) - 16) - 34);
    const labelLines = wrapLabel(a.label ?? '', maxLabelW, FS_LABEL);
    const label = labelLines.join(' ');
    const note = a.note ? trunc(a.note, 14) : '';
    const tw = Math.max(...labelLines.map((l) => textW(l, FS_LABEL)), textW(note, FS_NOTE));
    const extraLines = Math.max(0, labelLines.length - 1);
    const pillW = tw + 34;
    const pillH = (a.note ? 41 : 26) + extraLines * (FS_LABEL + 4);
    if (ux === 0) {
      const py2 = y2 + (uy < 0 ? -pillH - 12 : 12);
      // 圆点 + 文字作为一组居中(圆点占位,不然文字看着偏)
      const tw2 = Math.max(...labelLines.map((l) => textW(l, FS_LABEL)));
      const dotX = cx - (tw2 + 14) / 2;
      parts.push(`<rect x="${r2(cx - pillW / 2)}" y="${r2(py2)}" width="${r2(pillW)}" height="${pillH}" rx="${Math.min(pillH / 2, 13)}" fill="var(--d-card)" stroke="var(--d-border)" stroke-width="1"/>`);
      parts.push(`<circle cx="${r2(dotX)}" cy="${r2(py2 + (a.note ? 12 : 11))}" r="5" fill="${color}"/>`);
      labelLines.forEach((ln, i) => {
        parts.push(`<text x="${r2(dotX + 10)}" y="${r2(py2 + (a.note ? 17 : 16) + i * (FS_LABEL + 4))}" font-size="${FS_LABEL}" font-weight="600" fill="var(--d-ink)">${esc(ln)}</text>`);
      });
      if (a.note) {
        parts.push(`<text x="${r2(cx)}" y="${r2(py2 + 34 + extraLines * (FS_LABEL + 4))}" font-size="${FS_NOTE}" text-anchor="middle" fill="var(--d-muted)">${esc(note)}</text>`);
      }
    } else {
      const px2 = x2 + ux * 14;
      parts.push(`<rect x="${r2(ux > 0 ? px2 : px2 - pillW)}" y="${r2(cy - pillH / 2)}" width="${r2(pillW)}" height="${pillH}" rx="${pillH / 2}" fill="var(--d-card)" stroke="var(--d-border)" stroke-width="1"/>`);
      const lx = ux > 0 ? px2 + 8 : px2 - 8;
      parts.push(`<circle cx="${r2(lx + (ux > 0 ? 4 : -4))}" cy="${r2(cy - (a.note ? 5 : 0))}" r="5" fill="${color}"/>`);
      labelLines.forEach((ln, i) => {
        parts.push(`<text x="${r2(lx + (ux > 0 ? 13 : -13))}" y="${r2(cy - (a.note ? 2 : 5) - (labelLines.length - 1) * (FS_LABEL + 4) / 2 + i * (FS_LABEL + 4))}" font-size="${FS_LABEL}" font-weight="600" text-anchor="${ux > 0 ? 'start' : 'end'}" fill="var(--d-ink)">${esc(ln)}</text>`);
      });
      if (a.note) {
        // 说明对齐到**标签文字**的中线(不是整个胶囊)—— 圆点占了位,不然看着歪
        const nc = ux > 0 ? lx + 13 + textW(label, FS_LABEL) / 2 : lx - 13 - textW(label, FS_LABEL) / 2;
        parts.push(`<text x="${r2(nc)}" y="${r2(cy + 15)}" font-size="${FS_NOTE}" text-anchor="middle" fill="var(--d-muted)">${esc(note)}</text>`);
      }
    }
  }

  // 中心盘:外圈浅色 + 内点深色,中心的字放在盘的右上(不压盘)
  parts.push(`<circle cx="${r2(cx)}" cy="${r2(cy)}" r="13" fill="var(--d-card)" stroke="var(--d-border)" stroke-width="1.5"/>`);
  parts.push(`<circle cx="${r2(cx)}" cy="${r2(cy)}" r="4.5" fill="var(--d-ink)"/>`);
  if (spec.center) {
    const centerLines = wrapLabel(spec.center, width - cx - 40, FS_LABEL, 1);
    parts.push(`<text x="${r2(cx + 20)}" y="${r2(cy - 21)}" font-size="${FS_LABEL}" font-weight="600" fill="var(--d-ink)">${esc(centerLines[0] ?? spec.center)}</text>`);
  }

  return svgDoc(width, height, 'compass', version, spec.title ?? 'compass chart', spec, skin, bg + titleBlock(spec.title) + parts.join(''));
}
