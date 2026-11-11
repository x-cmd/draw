// 双翼条形图(butterfly chart):两个系列背靠背,共用一根中轴。
//
// 为什么单独一种图:横向条形图只能比「谁更长」,两边一比就得两张图;把两个系列
// 画在中轴两侧,长度可比、还省一半地方 —— 人口金字塔(年龄×性别)、「开了 vs 关了」
// 的按龄分布、两个引擎的内存/磁盘对比,都是这个形状。
//
// 四种变体都在这套数据里:
//   1 堆叠    两侧各自可堆叠(自中轴往外):tokei 的 code 一侧、comments+blanks 另一侧
//   2 上下    dir=tb:柱自中轴往上/往下长(类别变成列)
//   3 一线一柱 右侧(或左侧)改成折线:「内存+磁盘」柱 vs 「响应时间」曲线
//   4 叠线    柱上再叠一条自己的标尺的折线(单位不同)
//
// 单位进图例(不放轴上):读图的人只看得见图例,轴上写「1k」而单位是 MB 会读错。
import type { ButterflySpec, BflySegment } from '../specs/butterfly.js';
import { sideSegments, sideTotals } from '../specs/butterfly.js';
import { TAB, card } from '../theme.js';
import {
  esc, fmtFull, niceTicks, r2, sVar, svgDoc, textW, topLegend, trunc, type RenderOpts,
} from './svg.js';

const PAD = 24;
const LEGEND_H = 26;
const VALUE_W = 54;   // 外端数值那一列的宽
const TRACK = 'var(--d-faint)';

/** 一侧的所有段(带色):自中轴往外 */
interface Painted {
  name: string;
  color: string;
  values: number[];
}

function paintSide(
  side: { name?: string; values?: number[]; segments?: BflySegment[] } | undefined,
  fallback: string,
  colorIdx: number,
  unit: string | undefined,
): Painted[] {
  const segs = sideSegments(side);
  return segs.map((sg, i) => ({
    name: sg.name ?? (segs.length === 1 ? side?.name ?? fallback : `${fallback} ${i + 1}`),
    color: sVar((colorIdx + i) % 10),
    values: sg.values,
  }));
}

export function renderButterfly(spec: ButterflySpec, o: RenderOpts): string {
  const { version, skin } = o;
  const n = spec.labels.length;
  const tb = spec.dir === 'tb';
  // 底纹轨道:默认画;t=bare 不画(空着的底纹容易被当成数据的一部分)
  const track = skin.rules.butterflyMode !== 'bare';
  const unit = spec.unit?.trim();
  const left = paintSide(spec.left, 'Left', 0, unit);
  const right = paintSide(spec.right, 'Right', left.length, unit);
  const line = spec.line
    ? { name: spec.line.name ?? 'Line', values: spec.line.values, side: spec.line.side ?? 'right' }
    : undefined;
  const hasBars = left.length > 0 || right.length > 0;

  const leftTot = sideTotals(spec.left, n);
  const rightTot = sideTotals(spec.right, n);
  const barMax = Math.max(...leftTot, ...rightTot, 1);
  const lineMax = line ? Math.max(...line.values.map((v) => Math.abs(v)), 1) : 0;

  let width = o.width;
  let height = o.height;
  const titleH = spec.title ? 34 : 0;
  const legendItems: { name: string; color: string; index?: number }[] = [];
  // 图例:有段名就列段名(一段时用侧名),否则列侧名 —— 单位跟着名字走
  const withUnit = (s: string): string => (unit ? `${s} (${unit})` : s);
  if (left.length > 1 || right.length > 1) {
    left.forEach((p, i) => legendItems.push({ name: withUnit(p.name), color: p.color, index: i }));
    right.forEach((p, i) => legendItems.push({ name: withUnit(p.name), color: p.color, index: left.length + i }));
  } else {
    if (left.length) legendItems.push({ name: withUnit(left[0].name), color: left[0].color, index: 0 });
    if (right.length) legendItems.push({ name: withUnit(right[0].name), color: right[0].color, index: left.length ? 1 : 0 });
  }
  if (line) legendItems.push({ name: withUnit(line.name), color: 'var(--d-s9)', index: legendItems.length });

  const parts: string[] = [card(width, height, true)];
  // 图例单独一行(标题下面):双翼图的图例项可能很多,和标题并排会撞在一起
  const contentTop = PAD + titleH + (legendItems.length ? LEGEND_H : 0);

  /* ---- 左右版:类别是行,柱自中轴往两侧长 */
  if (!tb) {
    // 行名列
    const labelW = Math.max(...spec.labels.map((l) => textW(l, 13)), 0);
    const labelX = PAD;
    const labelEnd = labelX + labelW;
    const plotL = labelEnd + VALUE_W + 10;
    const plotR = width - PAD - VALUE_W - 10;
    const centre = (plotL + plotR) / 2;
    const half = (plotR - plotL) / 2;
    // 行高:行多时压缩
    const avail = height - contentTop - PAD - 26;
    const pitch = avail / Math.max(n, 1);
    const barH = Math.min(22, Math.max(6, pitch * 0.56));

    // 网格:中轴 + 两侧等距刻度(scale=each 时两侧各画各的刻度)
    const each = spec.scale === 'each';
    const leftMax = each ? Math.max(...leftTot, 1) : barMax;
    const rightMax = each ? Math.max(...rightTot, 1) : barMax;
    const gridFor = (max: number, dir: -1 | 1): void => {
      const ticks = niceTicks(max, 4);
      const tickMax = ticks[ticks.length - 1] || max;
      for (const t of ticks) {
        if (t === 0) continue;
        const dx = (t / tickMax) * half;
        const x = dir < 0 ? centre - dx : centre + dx;
        parts.push(`<line x1="${r2(x)}" y1="${r2(contentTop)}" x2="${r2(x)}" y2="${r2(height - PAD - 26)}" stroke="var(--d-grid)"/>`);
      }
    };
    if (each) {
      gridFor(leftMax, -1);
      gridFor(rightMax, 1);
    } else {
      const ticks = niceTicks(barMax, 4);
      const tickMax = ticks[ticks.length - 1] || barMax;
      for (const t of ticks) {
        if (t === 0) continue;
        const dx = (t / tickMax) * half;
        for (const x of [centre - dx, centre + dx]) {
          parts.push(`<line x1="${r2(x)}" y1="${r2(contentTop)}" x2="${r2(x)}" y2="${r2(height - PAD - 26)}" stroke="var(--d-grid)"/>`);
        }
      }
    }
    parts.push(`<line x1="${r2(centre)}" y1="${r2(contentTop)}" x2="${r2(centre)}" y2="${r2(height - PAD - 26)}" stroke="var(--d-border)"/>`);
    // 没有折线时,柱端的数值直接画(没有遮挡,不需要垫底)

    // 柱端的数值占的位置 —— 线的标签要避开它们
    const barLabelBoxes: { x0: number; y0: number; x1: number; y1: number }[] = [];
    const barLabels: string[] = [];
    spec.labels.forEach((label, i) => {
      const y = contentTop + i * pitch + (pitch - barH) / 2;
      parts.push(`<text x="${r2(labelX)}" y="${r2(y + barH * 0.74)}" font-size="13" fill="var(--d-ink)">${esc(trunc(label, 22))}</text>`);
      // 两侧:轨道 + 段(自中轴往外堆叠)
      const drawSide = (segs: Painted[], totals: number[], dir: -1 | 1): void => {
        if (!segs.length) return;
        const sideMax = dir < 0 ? leftMax : rightMax;
        const totalLen = (totals[i] / sideMax) * half;
        // 轨道:整条到底(bare 风格不画 —— 底纹是空的,读者容易当成数据)
        if (track) {
          parts.push(`<rect x="${r2(dir < 0 ? centre - half : centre)}" y="${r2(y)}" width="${r2(half)}" height="${r2(barH)}" rx="4" fill="${TRACK}" fill-opacity="0.35"/>`);
        }
        let acc = 0;
        for (const seg of segs) {
          const len = (seg.values[i] ?? 0) / sideMax * half;
          if (len <= 0) { continue; }
          const x = dir < 0 ? centre - acc - len : centre + acc;
          parts.push(
            `<rect x="${r2(x)}" y="${r2(y)}" width="${r2(len)}" height="${r2(barH)}" rx="4" fill="${seg.color}"/>`,
          );
          acc += len;
        }
        // 外端的数值:折线在柱之上,数值得等折线画完再画(否则被线盖住)
        const v = totals[i];
        const vx = dir < 0 ? centre - totalLen - 8 : centre + totalLen + 8;
        const vw = textW(fmtFull(v), 12);
        barLabelBoxes.push({
          x0: dir < 0 ? vx - vw : vx, x1: dir < 0 ? vx : vx + vw,
          y0: y + barH * 0.74 - 12, y1: y + barH * 0.74 + 3,
        });
        barLabels.push(
          `<text x="${r2(vx)}" y="${r2(y + barH * 0.74)}" text-anchor="${dir < 0 ? 'end' : 'start'}" font-size="12" font-weight="600" fill="var(--d-text)" style="${TAB}">${esc(fmtFull(v))}</text>`,
        );
      };
      drawSide(left, leftTot, -1);
      drawSide(right, rightTot, 1);
    });

    // 没有折线:柱端的数值直接画(不会被挡)
    if (!line) parts.push(...barLabels);

    // 折线:在它那一侧,自己的标尺
    if (line) {
      // 线在自己那一侧从中轴往外长(和柱一样):0 在中轴,最大到那一侧的边
      const dir = line.side === 'left' ? -1 : 1;
      const base = centre;
      const span = dir < 0 ? centre - plotL : plotR - centre;
      const lineTicks = niceTicks(lineMax, 3);
      const lineTop = lineTicks[lineTicks.length - 1] || lineMax;
      const pts = line.values.map((v, i) => {
        const y = contentTop + i * pitch + pitch / 2;
        const d = (Math.abs(v) / lineTop) * span * 0.86;
        return [base + dir * d, y] as [number, number];
      });
      if (pts.length > 1) {
        parts.push(`<path d="${pts.map((p, i) => `${i === 0 ? 'M' : 'L'}${r2(p[0])} ${r2(p[1])}`).join('')}" fill="none" stroke="var(--d-s9)" stroke-width="2" stroke-linejoin="round" stroke-linecap="round"/>`);
        pts.forEach((p) => parts.push(`<circle cx="${r2(p[0])}" cy="${r2(p[1])}" r="3" fill="var(--d-s9)" stroke="var(--d-card)" stroke-width="1.5"/>`));
      }
      // 柱端的数值画在折线之上 —— 数值比线重要,字底下垫一块画布色把线挡住
      for (const t of barLabels) {
        const m = /x="([\d.]+)" y="([\d.]+)"/.exec(t)!;
        const tx = Number(m[1]);
        const ty = Number(m[2]);
        const anchor = /text-anchor="end"/.test(t) ? 'end' : 'start';
        const tw = textW(t.replace(/<[^>]+>/g, ''), 12);
        const bx = anchor === 'end' ? tx - tw - 4 : tx - 4;
        parts.push(
          `<rect x="${r2(bx)}" y="${r2(ty - 12)}" width="${r2(tw + 8)}" height="15" rx="4" fill="var(--d-card)" fill-opacity="0.94"/>`,
          t,
        );
      }
      // 线的数值:在点周围几个位置里挑一个不撞柱端数值的,并垫一块画布色
      // (线和柱会叠,没垫就看不清)
      const cand: [number, number][] = [[-16, 0], [-16, -18], [-16, 18], [14, 0], [14, -18], [14, 18]];
      line.values.forEach((v, i) => {
        const y = contentTop + i * pitch + pitch / 2;
        const d = (Math.abs(v) / lineTop) * span * 0.86;
        const x = base + dir * d;
        const text = fmtFull(v);
        const tw = textW(text, 11);
        let bx = x - tw / 2 - 4;
        let by = y - 24;
        for (const [dy, dx] of cand) {
          const cx = x + dx - tw / 2 - 4;
          const cy = y + dy - 11;
          const hit = barLabelBoxes.some((b) => cx < b.x1 && cx + tw + 8 > b.x0 && cy < b.y1 && cy + 14 > b.y0);
          if (!hit) { bx = cx; by = cy; break; }
        }
        parts.push(
          `<rect x="${r2(bx)}" y="${r2(by)}" width="${r2(tw + 8)}" height="14" rx="4" fill="var(--d-card)" fill-opacity="0.92"/>`,
          `<text x="${r2(x + (bx + 4 + tw / 2) - x)}" y="${r2(by + 11)}" text-anchor="middle" font-size="11" font-weight="600" fill="var(--d-s9)" style="${TAB}">${esc(text)}</text>`,
        );
      });
    }
  } else {
    /* ---- 上下版:类别是列,柱自中轴往上/往下长 */
    const labelH = 22;
    const plotTop = contentTop + VALUE_W;
    const plotBottom = height - PAD - labelH;
    const centreY = (plotTop + plotBottom) / 2;
    const half = (plotBottom - plotTop) / 2;
    const slotW = (width - PAD * 2) / Math.max(n, 1);
    const barW = Math.min(34, Math.max(6, slotW * 0.5));
    const eachTb = spec.scale === 'each';
    const leftMax = eachTb ? Math.max(...leftTot, 1) : barMax;
    const rightMax = eachTb ? Math.max(...rightTot, 1) : barMax;
    const gridTb = (max: number, dir: -1 | 1): void => {
      const ticks = niceTicks(max, 4);
      const tickMax = ticks[ticks.length - 1] || max;
      for (const t of ticks) {
        if (t === 0) continue;
        const dy = (t / tickMax) * half;
        const y = dir < 0 ? centreY - dy : centreY + dy;
        parts.push(`<line x1="${r2(PAD)}" y1="${r2(y)}" x2="${r2(width - PAD)}" y2="${r2(y)}" stroke="var(--d-grid)"/>`);
      }
    };
    if (eachTb) {
      gridTb(leftMax, -1);
      gridTb(rightMax, 1);
    } else {
      const ticks = niceTicks(barMax, 4);
      const tickMax = ticks[ticks.length - 1] || barMax;
      for (const t of ticks) {
        if (t === 0) continue;
        const dy = (t / tickMax) * half;
        for (const y of [centreY - dy, centreY + dy]) {
          parts.push(`<line x1="${r2(PAD)}" y1="${r2(y)}" x2="${r2(width - PAD)}" y2="${r2(y)}" stroke="var(--d-grid)"/>`);
        }
      }
    }
    parts.push(`<line x1="${r2(PAD)}" y1="${r2(centreY)}" x2="${r2(width - PAD)}" y2="${r2(centreY)}" stroke="var(--d-border)"/>`);

    const tbLabels: string[] = [];
    spec.labels.forEach((label, i) => {
      const cx = PAD + slotW * i + slotW / 2;
      const x = cx - barW / 2;
      parts.push(`<text x="${r2(cx)}" y="${r2(height - PAD - 4)}" text-anchor="middle" font-size="12" fill="var(--d-ink)">${esc(trunc(label, 14))}</text>`);
      const drawSide = (segs: Painted[], totals: number[], dir: -1 | 1): void => {
        if (!segs.length) return;
        const sideMax = dir < 0 ? leftMax : rightMax;
        const totalLen = (totals[i] / sideMax) * half;
        if (track) {
          parts.push(`<rect x="${r2(x)}" y="${r2(dir < 0 ? centreY - half : centreY)}" width="${r2(barW)}" height="${r2(half)}" rx="4" fill="${TRACK}" fill-opacity="0.35"/>`);
        }
        let acc = 0;
        for (const seg of segs) {
          const len = (seg.values[i] ?? 0) / sideMax * half;
          if (len <= 0) continue;
          const y = dir < 0 ? centreY - acc - len : centreY + acc;
          parts.push(`<rect x="${r2(x)}" y="${r2(y)}" width="${r2(barW)}" height="${r2(len)}" rx="4" fill="${seg.color}"/>`);
          acc += len;
        }
        const v = totals[i];
        const vy = dir < 0 ? centreY - totalLen - 6 : centreY + totalLen + 6;
        tbLabels.push(
          `<text x="${r2(cx)}" y="${r2(vy + (dir < 0 ? 0 : 10))}" text-anchor="middle" font-size="12" font-weight="600" fill="var(--d-text)" style="${TAB}">${esc(fmtFull(v))}</text>`,
        );
      };
      drawSide(left, leftTot, -1);
      drawSide(right, rightTot, 1);
    });

    // 折线:在类别之间画一条曲线(自己的标尺),画在柱之上
    if (line) {
      const lineTop = niceTicks(Math.max(...line.values.map((v) => Math.abs(v)), 1), 3).slice(-1)[0] || 1;
      const dirUp = (line.side ?? 'left') === 'left';
      const pts = line.values.map((v, i) => {
        const cx = PAD + slotW * i + slotW / 2;
        const d = (Math.abs(v) / lineTop) * half * 0.86;
        return [cx, dirUp ? centreY - d : centreY + d] as [number, number];
      });
      if (pts.length > 1) {
        parts.push(`<path d="${pts.map((p, i) => `${i === 0 ? 'M' : 'L'}${r2(p[0])} ${r2(p[1])}`).join('')}" fill="none" stroke="var(--d-s9)" stroke-width="2" stroke-linejoin="round" stroke-linecap="round"/>`);
        pts.forEach((p) => parts.push(`<circle cx="${r2(p[0])}" cy="${r2(p[1])}" r="3" fill="var(--d-s9)" stroke="var(--d-card)" stroke-width="1.5"/>`));
        line.values.forEach((v, i) => {
          const text = fmtFull(v);
          const tw = textW(text, 11);
          parts.push(
            `<rect x="${r2(pts[i][0] - tw / 2 - 4)}" y="${r2(pts[i][1] - 24)}" width="${r2(tw + 8)}" height="14" rx="4" fill="var(--d-card)" fill-opacity="0.92"/>`,
            `<text x="${r2(pts[i][0])}" y="${r2(pts[i][1] - 14)}" text-anchor="middle" font-size="11" font-weight="600" fill="var(--d-s9)" style="${TAB}">${esc(text)}</text>`,
          );
        });
      }
      // 柱端的数值画在折线之上
      for (const t of tbLabels) {
        const m = /x="([\d.]+)" y="([\d.]+)"/.exec(t)!;
        const tw = textW(t.replace(/<[^>]+>/g, ''), 12);
        parts.push(
          `<rect x="${r2(Number(m[1]) - tw / 2 - 4)}" y="${r2(Number(m[2]) - 12)}" width="${r2(tw + 8)}" height="15" rx="4" fill="var(--d-card)" fill-opacity="0.94"/>`,
          t,
        );
      }
    } else {
      parts.push(...tbLabels);
    }
  }

  // 标题 + 图例
  const titleSvg = spec.title
    ? `<text x="${PAD}" y="${PAD + 14}" font-size="18" font-weight="500" letter-spacing="-0.02em" fill="var(--d-ink)">${esc(spec.title)}</text>`
    : '';
  const legendSvg = legendItems.length
    ? topLegend(legendItems, PAD, PAD + titleH + 12, 'left', 'square')
    : '';

  // metadata 带全量 spec —— AI 读它能把图原样重建(角标的 explore 链接也靠它)
  const meta = {
    type: 'butterfly',
    title: spec.title,
    unit: spec.unit,
    dir: spec.dir,
    ...(spec.scale ? { scale: spec.scale } : {}),
    labels: spec.labels,
    ...(spec.left ? { left: spec.left } : {}),
    ...(spec.right ? { right: spec.right } : {}),
    ...(spec.line ? { line: spec.line } : {}),
  };
  const svg = svgDoc(
    width, height, 'butterfly', version,
    spec.title ?? `butterfly chart, ${n} categories`,
    meta, skin,
    titleSvg + legendSvg + parts.join(''),
  );
  return svg;
}
