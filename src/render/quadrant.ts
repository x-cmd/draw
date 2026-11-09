// 四象限图:一「族」决策图形的合集 ——
//   矩阵式(frame=box):外框 + 中十字,四格里写标签(价值网矩阵格图、问题处理矩阵)
//   十字式(frame=cross):只有两条带箭头的轴,标签挂在轴边(审美鸿沟、用户体验变革)
// 两轴各分高低(端点标签),格里的标签组可选,也可加按坐标落点的散点。
//
// 画法:两轴都是**带箭头的线**(正方向有箭头),轴名贴在轴的端点旁;
// 矩阵式再画外框与中分线;格里的标签组左上对齐(主标签粗、副说明灰、并列标签小一号)。
// 象限顺序:左上、右上、左下、右下。
import type { QuadrantGroup, QuadrantSpec } from '../specs/index.js';
import { card } from '../theme.js';
import { esc, r2, textW, trunc, type RenderOpts, svgDoc, titleBlock, sVar } from './svg.js';

const ARROW = 9;   // 箭头长度
const PAD = 14;    // 格内边距

/**
 * Quadrant chart: a 2×2 matrix (box) or a two-axis cross, with optional points.
 */
export function renderQuadrant(spec: QuadrantSpec, o: RenderOpts): string {
  const { width, height, version, skin } = o;
  const parts: string[] = [card(width, height, skin.rules.canvas === 'plain')];
  const groups = spec.groups ?? [];
  const hasCells = groups.some((g) => g && (g.name || g.note || g.labels?.length));
  const frame: 'box' | 'cross' = spec.frame ?? (hasCells ? 'box' : 'cross');

  // 几何:矩阵尽量正方(2×2 的四格才像矩阵),四周给轴名与端标签留位。
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

  // 两条轴:矩阵式贴着框(纵轴=左边、横轴=中分线),十字式在正中交叉
  const boxMode = frame === 'box';
  // 矩阵式:纵轴贴着框的左边,横轴是中分线;十字式:两条轴在**正中**交叉
  const axX = boxMode ? mx : mx + size / 2;                         // 纵轴所在的 x
  const axY0 = myFinal + size;                                      // 纵轴下端
  const axY1 = boxMode ? myFinal - 10 : myFinal;                    // 纵轴上端(箭头,矩阵式伸出框一点)
  const axX0 = mx;                                                  // 横轴左端
  const axX1 = boxMode ? mx + size + 10 : mx + size;                // 横轴右端(箭头)
  const axMidY = boxMode ? midY : myFinal + size / 2;                // 横轴的高度

  // 两条轴:正方向带箭头(十字式与矩阵式都一样 —— 参考图里矩阵的外框边也是箭头)
  const arrow = (x1: number, y1: number, x2: number, y2: number): string => {
    const dx = x2 - x1;
    const dy = y2 - y1;
    const len = Math.hypot(dx, dy) || 1;
    const ux = dx / len;
    const uy = dy / len;
    const bx = x2 - ux * ARROW;
    const by = y2 - uy * ARROW;
    const px2 = -uy;
    const py2 = ux;
    return `<line x1="${r2(x1)}" y1="${r2(y1)}" x2="${r2(bx)}" y2="${r2(by)}" stroke="var(--d-baseline)" stroke-width="1.2"/>` +
      `<path d="M${r2(x2)} ${r2(y2)}L${r2(bx + px2 * 3.5)} ${r2(by + py2 * 3.5)}L${r2(bx - px2 * 3.5)} ${r2(by - py2 * 3.5)}Z" fill="var(--d-baseline)"/>`;
  };
  parts.push(arrow(axX, axY0, axX, axY1));                       // 纵轴向上
  parts.push(arrow(axX0, axMidY, axX1, axMidY));                  // 横轴向右

  // 矩阵式:外框 + 中分线(中分线只画一半长,不压轴名)
  if (boxMode) {
    // 框:上/右/下三边(左边就是纵轴),中间一横一竖分开四格
    parts.push(`<path d="M${r2(mx)} ${r2(myFinal)}L${r2(mx + size)} ${r2(myFinal)}L${r2(mx + size)} ${r2(myFinal + size)}L${r2(mx)} ${r2(myFinal + size)}" fill="none" stroke="var(--d-border)" stroke-width="1"/>`);
    parts.push(`<line x1="${r2(midX)}" y1="${r2(myFinal)}" x2="${r2(midX)}" y2="${r2(myFinal + size)}" stroke="var(--d-grid)" stroke-width="1"/>`);
  }

  // 四格:左上、右上、左下、右下 —— 标签组左上对齐
  const cells: [number, number][] = [[mx, myFinal], [midX, myFinal], [mx, midY], [midX, midY]];
  groups.forEach((g, i) => {
    if (!g) return;
    const [cx, cy] = cells[i];
    let dy = PAD;
    if (g.name) {
      parts.push(`<text x="${r2(cx + PAD)}" y="${r2(cy + PAD + 14)}" font-size="15" font-weight="600" letter-spacing="-0.01em" fill="var(--d-ink)">${esc(trunc(g.name, 14))}</text>`);
      dy += 22;
    }
    if (g.note) {
      // 说明按格宽折行(中文按字宽算),最多三行
      const maxW = size / 2 - PAD * 2;
      wrap(g.note, maxW, 12).slice(0, 3).forEach((ln, li) => {
        parts.push(`<text x="${r2(cx + PAD)}" y="${r2(cy + PAD + dy + li * 16)}" font-size="12" fill="var(--d-muted)">${esc(ln)}</text>`);
      });
      dy += 16 * Math.min(3, wrap(g.note, maxW, 12).length);
    }
    // 并列的小标签(参考图里一格两条)
    for (const l of g.labels ?? []) {
      parts.push(`<text x="${r2(cx + PAD)}" y="${r2(cy + PAD + dy)}" font-size="11" fill="var(--d-faint)">${esc(trunc(l, 12))}</text>`);
      dy += 15;
    }
  });

  // 轴端标签:横轴低在左、高在右;纵轴低在下、高在上
  const xLow = spec.xlow ?? '低';
  const xHigh = spec.xhigh ?? '高';
  const yLow = spec.ylow ?? '低';
  const yHigh = spec.yhigh ?? '高';
  if (boxMode) {
    parts.push(`<text x="${r2(mx)}" y="${r2(myFinal + size + 20)}" font-size="12" fill="var(--d-muted)">${esc(xLow)}</text>`);
    parts.push(`<text x="${r2(mx + size)}" y="${r2(myFinal + size + 20)}" font-size="12" text-anchor="end" fill="var(--d-muted)">${esc(xHigh)}</text>`);
    parts.push(`<text x="${r2(mx - 12)}" y="${r2(myFinal + size + 4)}" font-size="12" text-anchor="end" fill="var(--d-muted)">${esc(yLow)}</text>`);
    parts.push(`<text x="${r2(mx - 12)}" y="${r2(myFinal + 10)}" font-size="12" text-anchor="end" fill="var(--d-muted)">${esc(yHigh)}</text>`);
  } else {
    // 十字式:两条轴在正中交叉,四个端的标签贴在轴外
    parts.push(`<text x="${r2(axX0 - 12)}" y="${r2(axMidY + 4)}" font-size="12" text-anchor="end" fill="var(--d-muted)">${esc(xLow)}</text>`);
    parts.push(`<text x="${r2(axX1 + 12)}" y="${r2(axMidY + 4)}" font-size="12" fill="var(--d-muted)">${esc(xHigh)}</text>`);
    parts.push(`<text x="${r2(axX - 12)}" y="${r2(axY0 + 4)}" font-size="12" text-anchor="end" fill="var(--d-muted)">${esc(yLow)}</text>`);
    parts.push(`<text x="${r2(axX - 12)}" y="${r2(axY1 + 10)}" font-size="12" text-anchor="end" fill="var(--d-muted)">${esc(yHigh)}</text>`);
  }


  // 轴名:横排贴在正端旁边(参考图「市场/客户」「技术/产品」的写法)
  if (spec.xlabel) {
    parts.push(`<text x="${r2(axX1 + 16)}" y="${r2(axMidY + 4)}" font-size="13" fill="var(--d-text)">${esc(spec.xlabel)}</text>`);
  }
  if (spec.ylabel) {
    parts.push(`<text x="${r2(axX + 14)}" y="${r2(axY1 + 4)}" font-size="13" fill="var(--d-text)">${esc(spec.ylabel)}</text>`);
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
