// 四象限图:一「族」决策图形的合集 ——
//   矩阵式(frame=box):带箭头的两条轴 + 四格标签(BCG、艾森豪威尔、价值网矩阵)
//   十字式(frame=cross):两条带箭头的轴在正中交叉、标签挂四端(优先级排序、审美鸿沟)
// 两轴各分高低(端点可写标签),格里的标签组可选,也可加按坐标落点的散点(items=名称@x,y)。
//
// 画法(要像商业图,不像线框草图):
//   矩阵区 = 圆角面板 + 四格淡底小卡;格内主标签(粗)+ 说明(灰),**各格标题同一基线**
//   两条轴 = 带箭头的线(纵轴沿面板左边向上伸、横轴沿中线向右伸),端点标签做成胶囊
//   轴名贴在各自箭头的外侧(纵轴在上方、横轴在右侧),不与端点胶囊挤在一行
//   散点 = 系列色圆点 + 白圈,名字放在**远离纵轴**的一侧,不横穿轴线
import type { QuadrantSpec } from '../specs/index.js';
import { card } from '../theme.js';
import { esc, r2, textW, trunc, type RenderOpts, svgDoc, titleBlock, sVar } from './svg.js';

const ARROW = 12;   // 箭头长度
const PAD = 16;     // 格内边距
const RADIUS = 14;  // 面板圆角
const NO_BREAK = '，。、；：!?,.;:)]}」』】》';  // 这些不能出现在行首

/**
 * Quadrant chart: a 2×2 matrix (box) or a two-axis cross, with optional points.
 */
export function renderQuadrant(spec: QuadrantSpec, o: RenderOpts): string {
  const { width, height, version, skin } = o;
  const parts: string[] = [card(width, height, skin.rules.canvas === 'plain')];
  const groups = spec.groups ?? [];
  const hasCells = groups.some((g) => g && (g.name || g.note || g.labels?.length));
  const frame: 'box' | 'cross' = spec.frame ?? (hasCells ? 'box' : 'cross');
  const boxMode = frame === 'box';

  // 几何:矩阵区填满可用面积(不强制正方);四周给轴名与端标签留位。
  const titleH = spec.title ? 44 : 12;
  const top = titleH + (spec.title ? 26 : 10);   // 有标题时面板往下让开(左上角是标题)
  const left = 66;
  const right = spec.xlabel ? 30 + Math.ceil(textW(spec.xlabel, 13)) : 30;
  const bottom = 60;
  const mw = Math.max(120, width - left - right);
  const mh = Math.max(120, height - top - bottom);
  const mx = left;
  const myFinal = top;
  const midX = mx + mw / 2;
  const midY = myFinal + mh / 2;

  const px = (x: number): number => mx + x * mw;
  const py = (y: number): number => myFinal + (1 - y) * mh;

  // 轴的几何:矩阵式 = 纵轴沿面板左边、横轴沿中线;十字式 = 两条轴在正中交叉
  const axX = boxMode ? mx : midX;
  const axY0 = myFinal + mh;
  const axY1 = boxMode ? myFinal - 16 : myFinal;
  const axX0 = mx;
  const axX1 = boxMode ? mx + mw + 16 : mx + mw;
  const axMidY = midY;

  // 面板:矩阵式画外框 + 四格淡底;十字式只画一块底(不然图飘在空白里)
  parts.push(`<rect x="${r2(mx)}" y="${r2(myFinal)}" width="${r2(mw)}" height="${r2(mh)}" rx="${RADIUS}" fill="var(--d-card)" stroke="var(--d-border)" stroke-width="1"/>`);
  if (boxMode) {
    const cw = mw / 2 - 6;
    const ch = mh / 2 - 6;
    for (const [cx, cy] of [[mx + 3, myFinal + 3], [midX + 3, myFinal + 3], [mx + 3, midY + 3], [midX + 3, midY + 3]]) {
      parts.push(`<rect x="${r2(cx)}" y="${r2(cy)}" width="${r2(cw)}" height="${r2(ch)}" rx="9" fill="var(--d-grid)" fill-opacity="0.6"/>`);
    }
  }

  // 两条轴:正方向带箭头
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
    return `<line x1="${r2(x1)}" y1="${r2(y1)}" x2="${r2(bx)}" y2="${r2(by)}" stroke="var(--d-baseline)" stroke-width="1.4"/>` +
      `<path d="M${r2(x2)} ${r2(y2)}L${r2(bx + px2 * 4)} ${r2(by + py2 * 4)}L${r2(bx - px2 * 4)} ${r2(by - py2 * 4)}Z" fill="var(--d-baseline)"/>`;
  };
  parts.push(arrow(axX, axY0, axX, axY1));                       // 纵轴向上
  parts.push(arrow(axX0, axMidY, axX1, axMidY));                   // 横轴向右
  if (boxMode) {
    parts.push(`<line x1="${r2(midX)}" y1="${r2(myFinal + 3)}" x2="${r2(midX)}" y2="${r2(myFinal + mh - 3)}" stroke="var(--d-border)" stroke-width="1"/>`);
  }

  // 格内标签:四格的**标题同一基线**,说明按格宽折行(中文断行有规矩)
  if (boxMode) {
    type Row = { text: string; fs: number; fill: string; weight: string };
    const blocks = groups.map((g) => {
      const rows: Row[] = [];
      if (!g) return rows;
      if (g.name) rows.push({ text: trunc(g.name, 14), fs: 16, fill: 'var(--d-ink)', weight: '600' });
      if (g.note) {
        for (const ln of wrap(g.note, mw / 2 - PAD * 2, 12)) {
          rows.push({ text: ln, fs: 12, fill: 'var(--d-muted)', weight: '400' });
        }
      }
      for (const l of g.labels ?? []) rows.push({ text: trunc(l, 12), fs: 11, fill: 'var(--d-faint)', weight: '400' });
      return rows;
    });
    const GAP = 6;
    const blockH = (rows: Row[]): number => rows.reduce((a, r) => a + r.fs * 1.35, 0) + GAP * Math.max(0, rows.length - 1);
    // 标题对齐:以四格里最高的块为准,各块的标题落在同一条基线上
    const maxH = Math.max(0, ...blocks.map(blockH));
    const cells: [number, number][] = [[mx, myFinal], [midX, myFinal], [mx, midY], [midX, midY]];
    blocks.forEach((rows, i) => {
      if (!rows.length) return;
      const [cx, cy] = cells[i];
      const cellH = mh / 2;
      // 标题基线 = 格心 - 最高块的一半 + 标题高
      let y = cy + (cellH - maxH) / 2 + rows[0].fs * 0.95;
      rows.forEach((r, ri) => {
        const x = cx + PAD + (ri === 0 && r.fs >= 16 ? 13 : 0);
        if (ri === 0 && r.fs >= 16) {
          parts.push(`<circle cx="${r2(cx + PAD + 4)}" cy="${r2(y - r.fs * 0.32)}" r="4" fill="${sVar(i % skin.series.length)}"/>`);
        }
        parts.push(`<text x="${r2(x)}" y="${r2(y)}" font-size="${r.fs}" font-weight="${r.weight}"${r.fs >= 16 ? ' letter-spacing="-0.01em"' : ''} fill="${r.fill}">${esc(r.text)}</text>`);
        y += r.fs * 1.35 + GAP;
      });
    });
  }

  // 轴端标签:小胶囊(细描边 + 淡底)
  const pill = (text: string, x: number, y: number, anchor: 'start' | 'middle' | 'end'): void => {
    const w = textW(text, 11) + 14;
    const h = 18;
    const l = anchor === 'end' ? x - w : anchor === 'middle' ? x - w / 2 : x;
    parts.push(`<rect x="${r2(l)}" y="${r2(y - h + 4)}" width="${r2(w)}" height="${h}" rx="9" fill="var(--d-card)" stroke="var(--d-border)" stroke-width="1"/>`);
    const tx = anchor === 'end' ? x - 7 : anchor === 'middle' ? x : x + 7;
    parts.push(`<text x="${r2(tx)}" y="${r2(y - h + 4 + 12.5)}" font-size="11" text-anchor="${anchor === 'end' ? 'end' : anchor === 'middle' ? 'middle' : 'start'}" fill="var(--d-muted)">${esc(text)}</text>`);
  };

  const xLow = spec.xlow ?? '低';
  const xHigh = spec.xhigh ?? '高';
  const yLow = spec.ylow ?? '低';
  const yHigh = spec.yhigh ?? '高';
  if (boxMode) {
    pill(yHigh, mx - 12, myFinal + 10, 'end');
    pill(yLow, mx - 12, myFinal + mh - 4, 'end');
    pill(xLow, mx, myFinal + mh + 24, 'start');
    pill(xHigh, mx + mw, myFinal + mh + 24, 'end');
  } else {
    pill(yHigh, axX, myFinal - 8, 'middle');
    pill(yLow, axX, myFinal + mh + 8, 'middle');
    pill(xLow, mx - 8, midY, 'end');
    pill(xHigh, mx + mw + 8, midY, 'start');
  }

  // 轴名:贴在各自箭头的外侧,不与端点胶囊同行
  if (spec.xlabel) {
    if (boxMode) {
      parts.push(`<text x="${r2(axX1 + 8)}" y="${r2(axMidY + 4)}" font-size="13" fill="var(--d-text)">${esc(spec.xlabel)}</text>`);
    } else {
      parts.push(`<text x="${r2(axX1)}" y="${r2(axMidY + 30)}" font-size="13" text-anchor="end" fill="var(--d-text)">${esc(spec.xlabel)}</text>`);
    }
  }
  if (spec.ylabel) {
    if (boxMode) {
      // 纵轴名:放在箭头右侧、面板上方(左上角是标题,不能占那)
      parts.push(`<text x="${r2(axX + 14)}" y="${r2(myFinal - 12)}" font-size="13" fill="var(--d-text)">${esc(spec.ylabel)}</text>`);
    } else {
      const yx = Math.max(16, axX - 34);
      parts.push(`<text x="${r2(yx)}" y="${r2(midY)}" font-size="13" text-anchor="middle" fill="var(--d-text)" transform="rotate(-90 ${r2(yx)} ${r2(midY)})">${esc(spec.ylabel)}</text>`);
    }
  }

  // 散点:系列色圆点 + 白圈,名字放在**远离纵轴**的一侧(不横穿轴线)
  (spec.items ?? []).forEach((it, i) => {
    const cx = px(it.x);
    const cy = py(it.y);
    const color = sVar(i % skin.series.length);
    parts.push(`<circle cx="${r2(cx)}" cy="${r2(cy)}" r="6.5" fill="${color}" stroke="var(--d-halo)" stroke-width="2"/>`);
    const label = trunc(it.name, 10);
    const tw = textW(label, 12);
    const leftSide = cx < axX;                       // 默认往远离纵轴的一侧放
    const fits = leftSide ? cx - 13 - tw > mx : cx + 13 + tw < mx + mw;
    const useLeft = leftSide ? fits : !fits;
    parts.push(`<text x="${r2(useLeft ? cx - 13 : cx + 13)}" y="${r2(cy + 4)}" font-size="12" text-anchor="${useLeft ? 'end' : 'start'}" fill="var(--d-text)">${esc(label)}</text>`);
  });

  return svgDoc(width, height, 'quadrant', version, spec.title ?? 'quadrant chart', spec, skin, titleBlock(spec.title) + parts.join(''));
}

/**
 * 中文断行:按字宽折行;标点不落行首;末行不留孤字。
 */
function wrap(text: string, maxW: number, fs: number): string[] {
  const chars = [...text];
  const w = (ch: string): number => (ch.charCodeAt(0) > 0x2e80 ? fs : fs * 0.55);
  const lines: string[] = [];
  let line = '';
  let lw = 0;
  for (const ch of chars) {
    const cw = w(ch);
    if (lw + cw > maxW && line !== '') {
      // 下一个字符是标点 → 挤回本行(标点不落行首)
      if (NO_BREAK.includes(ch)) {
        line += ch;
        lw += cw;
        continue;
      }
      lines.push(line);
      line = ch;
      lw = cw;
    } else {
      line += ch;
      lw += cw;
    }
  }
  if (line !== '') lines.push(line);
  // 末行只剩一个字 → 并回上一行(孤字难看)
  if (lines.length > 1 && lines[lines.length - 1].length === 1) {
    lines[lines.length - 2] += lines[lines.length - 1];
    lines.pop();
  }
  return lines;
}
