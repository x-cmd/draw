// 四象限图:一「族」决策图形的合集 ——
//   矩阵式(frame=box):带箭头的两条轴 + 四格标签(BCG、艾森豪威尔、价值网矩阵)
//   十字式(frame=cross):两条带箭头的轴在正中交叉、标签挂四端(优先级排序、审美鸿沟)
// 两轴各分高低(端点可写标签),格里的标签组可选,也可加按坐标落点的散点(items=名称@x,y)。
//
// 画法(要像商业图,不像线框草图):
//   矩阵区 = 圆角面板 + 四格淡底小卡,格内左上角是主标签(粗)+ 说明(灰)
//   两条轴 = 带箭头的线(纵轴沿面板左边向上伸、横轴沿中线向右伸),端点标签做成胶囊
//   散点 = 系列色圆点 + 白圈,名字跟在点旁边
import type { QuadrantSpec } from '../specs/index.js';
import { card } from '../theme.js';
import { esc, r2, textW, trunc, type RenderOpts, svgDoc, titleBlock, sVar } from './svg.js';

const ARROW = 10;   // 箭头长度
const PAD = 16;     // 格内边距
const RADIUS = 14;  // 面板圆角

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

  // 几何:矩阵尽量正方(2×2 的四格才像矩阵),四周给轴名与端标签留位。
  const titleH = spec.title ? 44 : 12;
  const top = titleH + (spec.title ? 26 : 8);   // 有标题时矩阵往下让开(左上角是标题)
  const left = 64;
  // 右侧要给横轴名留位(矩阵填满宽度时,轴名会被挤出画布)
  const right = spec.xlabel ? 24 + Math.ceil(textW(spec.xlabel, 13)) + 14 : 24;
  const bottom = 58;
  // 矩阵区填满可用面积(不强制正方):2×2 的卡片本来就是宽格子,正方会两侧留大片空白
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
  const axY1 = boxMode ? myFinal - 14 : myFinal;
  const axX0 = mx;
  const axX1 = boxMode ? mx + mw + 14 : mx + mw;
  const axMidY = midY;

  // 面板(矩阵式):圆角 + 细描边,四格淡底小卡把 2×2 分开
  if (boxMode) {
    parts.push(`<rect x="${r2(mx)}" y="${r2(myFinal)}" width="${r2(mw)}" height="${r2(mh)}" rx="${RADIUS}" fill="var(--d-card)" stroke="var(--d-border)" stroke-width="1"/>`);
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

  // 四格:左上、右上、左下、右下 —— 标签组左上对齐(主标签粗、说明灰、并列标签更淡)
  const cells: [number, number][] = [[mx, myFinal], [midX, myFinal], [mx, midY], [midX, midY]];
  groups.forEach((g, i) => {
    if (!g) return;
    const [cx, cy] = cells[i];
    const cellH = mh / 2;
    // 先把标签组排成行,再整块在格内**垂直居中**(内容少时贴着顶会显得空)
    const rows: { text: string; fs: number; fill: string; weight: string }[] = [];
    if (g.name) rows.push({ text: trunc(g.name, 14), fs: 16, fill: 'var(--d-ink)', weight: '600' });
    if (g.note) {
      for (const ln of wrap(g.note, mw / 2 - PAD * 2, 12).slice(0, 3)) {
        rows.push({ text: ln, fs: 12, fill: 'var(--d-muted)', weight: '400' });
      }
    }
    for (const l of g.labels ?? []) rows.push({ text: trunc(l, 12), fs: 11, fill: 'var(--d-faint)', weight: '400' });
    if (!rows.length) return;
    const gap = 6;
    const total = rows.reduce((a, r) => a + r.fs * 1.35, 0) + gap * (rows.length - 1);
    let y = cy + (cellH - total) / 2 + rows[0].fs * 0.95;
    rows.forEach((r, ri) => {
      const x = cx + PAD + (ri === 0 && g.name ? 13 : 0);   // 主标签前留一个色点
      if (ri === 0 && g.name) {
        parts.push(`<circle cx="${r2(cx + PAD + 4)}" cy="${r2(y - rows[0].fs * 0.32)}" r="4" fill="${sVar(i % skin.series.length)}"/>`);
      }
      parts.push(`<text x="${r2(x)}" y="${r2(y)}" font-size="${r.fs}" font-weight="${r.weight}"${r.fs >= 16 ? ' letter-spacing="-0.01em"' : ''} fill="${r.fill}">${esc(r.text)}</text>`);
      y += r.fs * 1.35 + gap;
    });
  });

  // 轴端标签:小胶囊(细描边 + 淡底),比裸文字更像「设计过的」
  const pill = (text: string, x: number, y: number, anchor: 'start' | 'end'): void => {
    const w = textW(text, 11) + 14;
    const h = 18;
    const l = anchor === 'end' ? x - w : x;
    parts.push(`<rect x="${r2(l)}" y="${r2(y - h + 4)}" width="${r2(w)}" height="${h}" rx="9" fill="var(--d-card)" stroke="var(--d-border)" stroke-width="1"/>`);
    parts.push(`<text x="${r2(anchor === 'end' ? x - 7 : x + 7)}" y="${r2(y - h + 4 + 12.5)}" font-size="11" text-anchor="${anchor === 'end' ? 'end' : 'start'}" fill="var(--d-muted)">${esc(text)}</text>`);
  };

  const xLow = spec.xlow ?? '低';
  const xHigh = spec.xhigh ?? '高';
  const yLow = spec.ylow ?? '低';
  const yHigh = spec.yhigh ?? '高';
  if (boxMode) {
    pill(xLow, mx, myFinal + mh + 24, 'start');
    pill(xHigh, mx + mw, myFinal + mh + 24, 'end');
    pill(yLow, mx - 10, myFinal + mh + 6, 'end');
    pill(yHigh, mx - 10, myFinal + 8, 'end');
  } else {
    pill(xLow, axX0 - 8, axMidY + 6, 'end');
    pill(xHigh, axX1 + 8, axMidY + 6, 'start');
    pill(yLow, axX - 10, axY0 + 8, 'end');
    pill(yHigh, axX - 10, axY1 + 8, 'end');
  }

  // 轴名:横排贴在正端旁(参考图「市场/客户」「技术/产品」的写法)
  if (spec.xlabel) {
    parts.push(`<text x="${r2(axX1 + 8)}" y="${r2(boxMode ? myFinal + mh + 6 : axMidY + 26)}" font-size="13" text-anchor="${boxMode ? 'start' : 'end'}" fill="var(--d-text)">${esc(spec.xlabel)}</text>`);
  }
  if (spec.ylabel) {
    parts.push(`<text x="${r2(axX + 16)}" y="${r2(axY1 + 8)}" font-size="13" fill="var(--d-text)">${esc(spec.ylabel)}</text>`);
  }

  // 散点:系列色圆点 + 白圈,名字跟在点旁(右侧放不下就放左侧)
  (spec.items ?? []).forEach((it, i) => {
    const cx = px(it.x);
    const cy = py(it.y);
    const color = sVar(i % skin.series.length);
    parts.push(`<circle cx="${r2(cx)}" cy="${r2(cy)}" r="6.5" fill="${color}" stroke="var(--d-halo)" stroke-width="2"/>`);
    const label = trunc(it.name, 10);
    const tw = textW(label, 12);
    const rightFits = cx + 13 + tw <= mx + mw;
    parts.push(`<text x="${r2(rightFits ? cx + 13 : cx - 13)}" y="${r2(cy + 4)}" font-size="12" text-anchor="${rightFits ? 'start' : 'end'}" fill="var(--d-text)">${esc(label)}</text>`);
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
