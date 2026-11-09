// 四向箭头(compass):中心一个点,上右下左四个方向各一支箭头,箭头端点带标签。
// 与四象限(quadrant)的分别:那边是两条轴切出四个区域,这边是四个方向各出一支箭头。
//
// 画法:中心一个小圆点;四支箭头从中心射出(正方向带箭头),标签写在箭头端点外侧,
// 副说明写在标签下面;某个方向没有内容就不画那支箭头。
import type { CompassArm, CompassSpec } from '../specs/index.js';
import { card } from '../theme.js';
import { esc, r2, textW, trunc, type RenderOpts, svgDoc, titleBlock } from './svg.js';

const ARROW = 10;

/**
 * Compass chart: four labelled arrows radiating from a center point.
 */
export function renderCompass(spec: CompassSpec, o: RenderOpts): string {
  const { width, height, version, skin } = o;
  const parts: string[] = [card(width, height, skin.rules.canvas === 'plain')];

  const titleH = spec.title ? 44 : 12;
  const cx = width / 2;
  const cy = titleH + (height - titleH) / 2;
  // 箭头长度:留出标签的位置(标签写在端点外,再留一行副说明)
  const arm = Math.max(60, Math.min(width, height) * 0.3);

  const arms: { dir: 'up' | 'right' | 'down' | 'left'; a: CompassArm; ux: number; uy: number }[] = [
    { dir: 'up', a: spec.up ?? {}, ux: 0, uy: -1 },
    { dir: 'right', a: spec.right ?? {}, ux: 1, uy: 0 },
    { dir: 'down', a: spec.down ?? {}, ux: 0, uy: 1 },
    { dir: 'left', a: spec.left ?? {}, ux: -1, uy: 0 },
  ];

  for (const { dir, a, ux, uy } of arms) {
    if (!a.label && !a.note) continue;
    const x2 = cx + ux * arm;
    const y2 = cy + uy * arm;
    // 线身:从中心到箭头根部
    const bx = x2 - ux * ARROW;
    const by = y2 - uy * ARROW;
    parts.push(`<line x1="${r2(cx)}" y1="${r2(cy)}" x2="${r2(bx)}" y2="${r2(by)}" stroke="var(--d-baseline)" stroke-width="1.4"/>`);
    const px = -uy;
    const py = ux;
    parts.push(`<path d="M${r2(x2)} ${r2(y2)}L${r2(bx + px * 4)} ${r2(by + py * 4)}L${r2(bx - px * 4)} ${r2(by - py * 4)}Z" fill="var(--d-baseline)"/>`);
    // 标签:写在端点外侧(上下方向居中,左右方向靠端点、纵向排布)
    if (a.label) {
      const label = trunc(a.label, 8);
      if (ux === 0) {
        parts.push(`<text x="${r2(cx)}" y="${r2(y2 + (uy < 0 ? -14 : 24))}" font-size="14" font-weight="600" text-anchor="middle" fill="var(--d-ink)">${esc(label)}</text>`);
        if (a.note) {
          parts.push(`<text x="${r2(cx)}" y="${r2(y2 + (uy < 0 ? -30 : 40))}" font-size="11" text-anchor="middle" fill="var(--d-muted)">${esc(trunc(a.note, 14))}</text>`);
        }
      } else {
        const tx = x2 + ux * 12;
        parts.push(`<text x="${r2(tx)}" y="${r2(cy + (a.note ? -2 : 5))}" font-size="14" font-weight="600" text-anchor="${ux > 0 ? 'start' : 'end'}" fill="var(--d-ink)">${esc(label)}</text>`);
        if (a.note) {
          parts.push(`<text x="${r2(tx)}" y="${r2(cy + 14)}" font-size="11" text-anchor="${ux > 0 ? 'start' : 'end'}" fill="var(--d-muted)">${esc(trunc(a.note, 14))}</text>`);
        }
      }
    }
  }

  // 中心点 + 中心的字
  parts.push(`<circle cx="${r2(cx)}" cy="${r2(cy)}" r="5" fill="var(--d-ink)"/>`);
  if (spec.center) {
    const t = trunc(spec.center, 8);
    const tw = textW(t, 13);
    // 中心有字就把它推到点的旁边(免得盖住点)
    parts.push(`<text x="${r2(cx + 12)}" y="${r2(cy - 10)}" font-size="13" font-weight="600" fill="var(--d-ink)">${esc(t)}</text>`);
    void tw;
  }

  return svgDoc(width, height, 'compass', version, spec.title ?? 'compass chart', spec, skin, titleBlock(spec.title) + parts.join(''));
}
