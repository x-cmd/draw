// 四向箭头(compass):中心一个点,上右下左四个方向各一支箭头,箭头端点带标签。
// 与四象限(quadrant)的分别:那边是两条轴切出四个区域,这边是四个方向各出一支箭头。
//
// 画法(商业图的样子):中心一个圆盘;四支箭头用不同系列色(四个方向一眼可分),
// 箭身为渐窄的锥形(不是一根细线),端点的标签做成胶囊(带同色小圆点)。
import type { CompassArm, CompassSpec } from '../specs/index.js';
import { card } from '../theme.js';
import { esc, r2, textW, trunc, type RenderOpts, svgDoc, titleBlock, sVar } from './svg.js';

const ARROW = 12;  // 箭头长度
const BASE = 5.5;  // 箭身根部半宽

/**
 * Compass chart: four labelled arrows radiating from a center point.
 */
export function renderCompass(spec: CompassSpec, o: RenderOpts): string {
  const { width, height, version, skin } = o;
  const parts: string[] = [card(width, height, skin.rules.canvas === 'plain')];

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
    const label = a.label ? trunc(a.label, 8) : '';
    const note = a.note ? trunc(a.note, 14) : '';
    const tw = Math.max(textW(label, 13), textW(note, 11));
    const pillW = tw + 30;
    const pillH = a.note ? 34 : 22;
    if (ux === 0) {
      const py2 = y2 + (uy < 0 ? -pillH - 12 : 12);
      parts.push(`<rect x="${r2(cx - pillW / 2)}" y="${r2(py2)}" width="${r2(pillW)}" height="${pillH}" rx="${pillH / 2}" fill="var(--d-card)" stroke="var(--d-border)" stroke-width="1"/>`);
      parts.push(`<circle cx="${r2(cx - pillW / 2 + 13)}" cy="${r2(py2 + (a.note ? 12 : 11))}" r="4" fill="${color}"/>`);
      parts.push(`<text x="${r2(cx - pillW / 2 + 22)}" y="${r2(py2 + (a.note ? 15 : 14))}" font-size="13" font-weight="600" fill="var(--d-ink)">${esc(label)}</text>`);
      if (a.note) {
        parts.push(`<text x="${r2(cx)}" y="${r2(py2 + 28)}" font-size="11" text-anchor="middle" fill="var(--d-muted)">${esc(note)}</text>`);
      }
    } else {
      const px2 = x2 + ux * 14;
      parts.push(`<rect x="${r2(ux > 0 ? px2 : px2 - pillW)}" y="${r2(cy - pillH / 2)}" width="${r2(pillW)}" height="${pillH}" rx="${pillH / 2}" fill="var(--d-card)" stroke="var(--d-border)" stroke-width="1"/>`);
      const lx = ux > 0 ? px2 + 8 : px2 - 8;
      parts.push(`<circle cx="${r2(lx + (ux > 0 ? 4 : -4))}" cy="${r2(cy - (a.note ? 5 : 0))}" r="4" fill="${color}"/>`);
      parts.push(`<text x="${r2(lx + (ux > 0 ? 13 : -13))}" y="${r2(cy - (a.note ? 1 : 4))}" font-size="13" font-weight="600" text-anchor="${ux > 0 ? 'start' : 'end'}" fill="var(--d-ink)">${esc(label)}</text>`);
      if (a.note) {
        parts.push(`<text x="${r2(lx + (ux > 0 ? 13 : -13))}" y="${r2(cy + 13)}" font-size="11" text-anchor="${ux > 0 ? 'start' : 'end'}" fill="var(--d-muted)">${esc(note)}</text>`);
      }
    }
  }

  // 中心盘:外圈浅色 + 内点深色,中心的字放在盘的右上(不压盘)
  parts.push(`<circle cx="${r2(cx)}" cy="${r2(cy)}" r="13" fill="var(--d-card)" stroke="var(--d-border)" stroke-width="1.5"/>`);
  parts.push(`<circle cx="${r2(cx)}" cy="${r2(cy)}" r="4.5" fill="var(--d-ink)"/>`);
  if (spec.center) {
    parts.push(`<text x="${r2(cx + 17)}" y="${r2(cy - 17)}" font-size="13" font-weight="600" fill="var(--d-ink)">${esc(trunc(spec.center, 8))}</text>`);
  }

  return svgDoc(width, height, 'compass', version, spec.title ?? 'compass chart', spec, skin, titleBlock(spec.title) + parts.join(''));
}
