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

    // 网格:中轴 + 两侧等距刻度
    const ticks = niceTicks(barMax, 4);
    const tickMax = ticks[ticks.length - 1] || barMax;
    for (const t of ticks) {
      if (t === 0) continue;
      const dx = (t / tickMax) * half;
      for (const x of [centre - dx, centre + dx]) {
        parts.push(`<line x1="${r2(x)}" y1="${r2(contentTop)}" x2="${r2(x)}" y2="${r2(height - PAD - 26)}" stroke="var(--d-grid)"/>`);
      }
    }
    parts.push(`<line x1="${r2(centre)}" y1="${r2(contentTop)}" x2="${r2(centre)}" y2="${r2(height - PAD - 26)}" stroke="var(--d-border)"/>`);

    spec.labels.forEach((label, i) => {
      const y = contentTop + i * pitch + (pitch - barH) / 2;
      parts.push(`<text x="${r2(labelX)}" y="${r2(y + barH * 0.74)}" font-size="13" fill="var(--d-ink)">${esc(trunc(label, 22))}</text>`);
      // 两侧:轨道 + 段(自中轴往外堆叠)
      const drawSide = (segs: Painted[], totals: number[], dir: -1 | 1): void => {
        if (!segs.length) return;
        const totalLen = (totals[i] / tickMax) * half;
        // 轨道:整条到底
        parts.push(`<rect x="${r2(dir < 0 ? centre - half : centre)}" y="${r2(y)}" width="${r2(half)}" height="${r2(barH)}" rx="4" fill="${TRACK}" fill-opacity="0.35"/>`);
        let acc = 0;
        for (const seg of segs) {
          const len = (seg.values[i] ?? 0) / tickMax * half;
          if (len <= 0) { continue; }
          const x = dir < 0 ? centre - acc - len : centre + acc;
          parts.push(
            `<rect x="${r2(x)}" y="${r2(y)}" width="${r2(len)}" height="${r2(barH)}" rx="4" fill="${seg.color}"/>`,
          );
          acc += len;
        }
        // 外端的数值
        const v = totals[i];
        const vx = dir < 0 ? centre - totalLen - 8 : centre + totalLen + 8;
        parts.push(
          `<text x="${r2(vx)}" y="${r2(y + barH * 0.74)}" text-anchor="${dir < 0 ? 'end' : 'start'}" font-size="12" font-weight="600" fill="var(--d-text)" style="${TAB}">${esc(fmtFull(v))}</text>`,
        );
      };
      drawSide(left, leftTot, -1);
      drawSide(right, rightTot, 1);
    });

    // 折线:在它那一侧,自己的标尺
    if (line) {
      const dir = line.side === 'left' ? -1 : 1;
      const base = line.side === 'left' ? plotL : centre;
      const span = line.side === 'left' ? half : plotR - centre;
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
      // 线的数值标在点的上方,并垫一块画布色 —— 线和柱会叠,没垫就看不清
      line.values.forEach((v, i) => {
        const y = contentTop + i * pitch + pitch / 2;
        const d = (Math.abs(v) / lineTop) * span * 0.86;
        const x = base + dir * d;
        const text = fmtFull(v);
        const tw = textW(text, 11);
        parts.push(
          `<rect x="${r2(x - tw / 2 - 4)}" y="${r2(y - 17)}" width="${r2(tw + 8)}" height="14" rx="4" fill="var(--d-card)" fill-opacity="0.92"/>`,
          `<text x="${r2(x)}" y="${r2(y - 7)}" text-anchor="middle" font-size="11" font-weight="600" fill="var(--d-s9)" style="${TAB}">${esc(text)}</text>`,
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
    const ticks = niceTicks(barMax, 4);
    const tickMax = ticks[ticks.length - 1] || barMax;

    for (const t of ticks) {
      if (t === 0) continue;
      const dy = (t / tickMax) * half;
      for (const y of [centreY - dy, centreY + dy]) {
        parts.push(`<line x1="${r2(PAD)}" y1="${r2(y)}" x2="${r2(width - PAD)}" y2="${r2(y)}" stroke="var(--d-grid)"/>`);
      }
    }
    parts.push(`<line x1="${r2(PAD)}" y1="${r2(centreY)}" x2="${r2(width - PAD)}" y2="${r2(centreY)}" stroke="var(--d-border)"/>`);

    spec.labels.forEach((label, i) => {
      const cx = PAD + slotW * i + slotW / 2;
      const x = cx - barW / 2;
      parts.push(`<text x="${r2(cx)}" y="${r2(height - PAD - 4)}" text-anchor="middle" font-size="12" fill="var(--d-ink)">${esc(trunc(label, 14))}</text>`);
      const drawSide = (segs: Painted[], totals: number[], dir: -1 | 1): void => {
        if (!segs.length) return;
        const totalLen = (totals[i] / tickMax) * half;
        parts.push(`<rect x="${r2(x)}" y="${r2(dir < 0 ? centreY - half : centreY)}" width="${r2(barW)}" height="${r2(half)}" rx="4" fill="${TRACK}" fill-opacity="0.35"/>`);
        let acc = 0;
        for (const seg of segs) {
          const len = (seg.values[i] ?? 0) / tickMax * half;
          if (len <= 0) continue;
          const y = dir < 0 ? centreY - acc - len : centreY + acc;
          parts.push(`<rect x="${r2(x)}" y="${r2(y)}" width="${r2(barW)}" height="${r2(len)}" rx="4" fill="${seg.color}"/>`);
          acc += len;
        }
        const v = totals[i];
        const vy = dir < 0 ? centreY - totalLen - 6 : centreY + totalLen + 6;
        parts.push(
          `<text x="${r2(cx)}" y="${r2(vy + (dir < 0 ? 0 : 10))}" text-anchor="middle" font-size="12" font-weight="600" fill="var(--d-text)" style="${TAB}">${esc(fmtFull(v))}</text>`,
        );
      };
      drawSide(left, leftTot, -1);
      drawSide(right, rightTot, 1);
    });
  }

  // 标题 + 图例
  const titleSvg = spec.title
    ? `<text x="${PAD}" y="${PAD + 14}" font-size="18" font-weight="500" letter-spacing="-0.02em" fill="var(--d-ink)">${esc(spec.title)}</text>`
    : '';
  const legendSvg = legendItems.length
    ? topLegend(legendItems, PAD, PAD + titleH + 12, 'left', 'square')
    : '';

  const meta = { type: 'butterfly', title: spec.title, dir: spec.dir, labels: spec.labels };
  const svg = svgDoc(
    width, height, 'butterfly', version,
    spec.title ?? `butterfly chart, ${n} categories`,
    meta, skin,
    titleSvg + legendSvg + parts.join(''),
  );
  return svg;
}
