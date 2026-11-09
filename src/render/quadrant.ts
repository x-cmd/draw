// 四象限图:2×2 矩阵 —— 横纵两轴各分高低,四格各一个名称(可带说明),可加散点。
// 象限顺序:左上、右上、左下、右下(读图顺序:先上后下、每行左到右)。
//
// 画法:矩阵区 = 一个 2×2 网格(外框 + 中十字),格内左上角写象限名(粗)+ 说明(灰);
// 轴端标签(低/高)贴矩阵外侧,轴标题(横轴在下、纵轴在左,纵轴竖排);
// 散点按 0..1 归一坐标落在矩阵里,点旁写名字。
import type { QuadrantSpec } from '../specs/index.js';
import { card } from '../theme.js';
import { esc, r2, textW, trunc, type RenderOpts, svgDoc, titleBlock, sVar } from './svg.js';

/**
 * Quadrant chart: a 2×2 matrix with axis ends, cell titles and optional points.
 */
export function renderQuadrant(spec: QuadrantSpec, o: RenderOpts): string {
  const { width, height, version, skin } = o;
  const parts: string[] = [card(width, height, skin.rules.canvas === 'plain')];

  // 几何:矩阵尽量正方(2×2 的四格才像矩阵),四周给轴标题与端标签留位。
  const titleH = spec.title ? 44 : 12;
  const left = 64;                    // 纵轴标题 + 端标签
  const right = 24;
  const top = titleH;
  const bottom = 56;                  // 横轴端标签 + 轴标题
  const availW = width - left - right;
  const availH = height - top - bottom;
  const size = Math.max(80, Math.min(availW, availH));
  const mx = left + (availW - size) / 2;
  const my = top + (availH - size) / 2;
  // Edit @X-CMD 角标在右上(约 94px 宽,占 y 45..63):矩阵顶伸到它下面就压上了,
  // 这时把矩阵整体下移到角标之下(画布窄的时候会发生)
  const badgeLeft = width - 102;
  const myFinal = mx + size > badgeLeft ? Math.min(top + 24, height - bottom - size) : my;
  const midX = mx + size / 2;
  const midY = myFinal + size / 2;

  const px = (x: number): number => mx + x * size;
  const py = (y: number): number => myFinal + (1 - y) * size;

  // 矩阵底 + 边框 + 中十字
  parts.push(`<rect x="${r2(mx)}" y="${r2(myFinal)}" width="${r2(size)}" height="${r2(size)}" fill="var(--d-card)" stroke="var(--d-border)" stroke-width="1"/>`);
  parts.push(`<line x1="${r2(midX)}" y1="${r2(myFinal)}" x2="${r2(midX)}" y2="${r2(myFinal + size)}" stroke="var(--d-grid)" stroke-width="1"/>`);
  parts.push(`<line x1="${r2(mx)}" y1="${r2(midY)}" x2="${r2(mx + size)}" y2="${r2(midY)}" stroke="var(--d-grid)" stroke-width="1"/>`);

  // 四格:左上、右上、左下、右下 —— 名称在格内左上角,说明在名称下方
  const cells: [number, number][] = [[mx, myFinal], [midX, myFinal], [mx, midY], [midX, midY]];
  spec.quadrants.forEach((cell, i) => {
    const [cx, cy] = cells[i];
    const pad = 14;
    const name = trunc(cell.name, 14);
    parts.push(`<text x="${r2(cx + pad)}" y="${r2(cy + pad + 14)}" font-size="15" font-weight="600" letter-spacing="-0.01em" fill="var(--d-ink)">${esc(name)}</text>`);
    if (cell.desc) {
      // 说明按格宽折行(中文按字宽算),最多三行
      const maxW = size / 2 - pad * 2;
      const lines = wrap(cell.desc, maxW, 12);
      lines.slice(0, 3).forEach((ln, li) => {
        parts.push(`<text x="${r2(cx + pad)}" y="${r2(cy + pad + 34 + li * 16)}" font-size="12" fill="var(--d-muted)">${esc(ln)}</text>`);
      });
    }
  });

  // 轴端标签:横轴低在左、高在右;纵轴低在下、高在上
  const xLow = spec.xlow ?? '低';
  const xHigh = spec.xhigh ?? '高';
  const yLow = spec.ylow ?? '低';
  const yHigh = spec.yhigh ?? '高';
  parts.push(`<text x="${r2(mx)}" y="${r2(myFinal + size + 20)}" font-size="12" fill="var(--d-muted)">${esc(xLow)}</text>`);
  parts.push(`<text x="${r2(mx + size)}" y="${r2(myFinal + size + 20)}" font-size="12" text-anchor="end" fill="var(--d-muted)">${esc(xHigh)}</text>`);
  parts.push(`<text x="${r2(mx - 12)}" y="${r2(myFinal + size + 4)}" font-size="12" text-anchor="end" fill="var(--d-muted)">${esc(yLow)}</text>`);
  parts.push(`<text x="${r2(mx - 12)}" y="${r2(myFinal + 10)}" font-size="12" text-anchor="end" fill="var(--d-muted)">${esc(yHigh)}</text>`);

  // 轴标题
  if (spec.xlabel) {
    parts.push(`<text x="${r2(mx + size / 2)}" y="${r2(myFinal + size + 42)}" font-size="13" text-anchor="middle" fill="var(--d-text)">${esc(spec.xlabel)}</text>`);
  }
  if (spec.ylabel) {
    const yx = Math.max(16, mx - 44);
    const ycy = myFinal + size / 2;
    parts.push(`<text x="${r2(yx)}" y="${r2(ycy)}" font-size="13" text-anchor="middle" fill="var(--d-text)" transform="rotate(-90 ${r2(yx)} ${r2(ycy)})">${esc(spec.ylabel)}</text>`);
  }

  // 散点:点 + 名字(名字放点的右侧,右侧放不下就放左侧)
  (spec.items ?? []).forEach((it, i) => {
    const cx = px(it.x);
    const cy = py(it.y);
    const color = sVar(i % skin.series.length);
    parts.push(`<circle cx="${r2(cx)}" cy="${r2(cy)}" r="6" fill="${color}" fill-opacity="0.85" stroke="var(--d-halo)" stroke-width="2"/>`);
    const label = trunc(it.name, 10);
    const tw = textW(label, 12);
    const rightFits = cx + 12 + tw <= mx + size;
    parts.push(`<text x="${r2(rightFits ? cx + 12 : cx - 12)}" y="${r2(cy + 4)}" font-size="12" text-anchor="${rightFits ? 'start' : 'end'}" fill="var(--d-text)">${esc(label)}</text>`);
  });

  return svgDoc(width, height, 'quadrant', version, spec.title ?? 'quadrant chart', spec, skin, titleBlock(spec.title) + parts.join(''));
}

// 折行:中文按 1em、其余按 0.55em 估宽
function wrap(text: string, maxW: number, fs: number): string[] {
  const lines: string[] = [];
  let line = '';
  let w = 0;
  for (const ch of text) {
    const cw = ch.charCodeAt(0) > 0x2e80 ? fs : fs * 0.55;
    if (w + cw > maxW && line !== '') {
      lines.push(line);
      line = '';
      w = 0;
    }
    line += ch;
    w += cw;
  }
  if (line !== '') lines.push(line);
  return lines;
}
