// 分组并排柱(多系列):≤6 系列主题色板循环,顶部图例,数值入柱;evil 变体 = 规范 bar-1 几何。
import type { MultiSpec } from '../specs/index.js';
import { TAB, card } from '../theme.js';
import { esc, fmtFull, fmtNum, niceTicks, r2, textW, topLegend, trunc, type RenderOpts, svgDoc, titleBlock, yAxisGrid, findPeak, onVar, sVar, pushBarLabelsAllOrNothing, labelStride, LabelPlacer, reserveBands } from './svg.js';
import { yTickInset, type GeoMeasure } from './measure.js';

// 规范 bar-1 实测几何(960×520):left 76、右留 50、顶 94(0.181h)、底 448(0.862h)、X 标签 480
// 留白 = max(规范比例, 实测刻度列):长刻度/窄画布时左缘撑大,刻度不裁字
function barGeo(w: number, h: number, hasTitle: boolean, m: GeoMeasure = {}) {
  return {
    left: Math.round(Math.max(w * 0.0792, yTickInset(m))),
    right: w - Math.round(w * 0.0521),
    top: Math.round(h * (hasTitle ? 0.2 : 0.181)),
    bottom: Math.round(h * 0.8615),
    xLabelY: Math.round(h * 0.9231),
    legendY: Math.round(h * 0.0923),
  };
}

/**
 * Grouped (side-by-side) multi-series bars.
 */
export function renderBarMulti(spec: MultiSpec, o: RenderOpts): string {
  const height = o.height;
  const { version, skin } = o;
  const rules = skin.rules;
  const k = spec.series.length;
  const colors = spec.series.map((_, i) => sVar(i % skin.series.length));
  const n = spec.labels.length;
  const gMax = Math.max(...spec.series.flatMap((s) => s.values));
  const [peakS, peakP] = findPeak(spec.series);
  // 自动加宽:目标是"数值标签能放进柱内"。按与下面 barW 完全一致的公式反推所需槽宽,
  // 不够宽则放大画布(封顶 2.5×),把回退到柱顶的数字收回柱内
  let width = o.width;
  if (o.autoWidth && n > 0) {
    const maxLabelW = Math.max(...spec.series.flatMap((ser) => ser.values.map((v) => textW(fmtNum(v), 7))));
    const corner = rules.barCorner > 0;
    const gapAB = corner ? 5 : 0;
    const cap = corner ? 22 : 40;
    const factor = 0.72;
    const plain = rules.canvas === 'plain';
    const margins = plain ? 0 : 92;
    const ratio = plain ? 0.8687 : 1;
    // barW = min(cap, (step*factor - gap*(k-1))/k) → 解出 step;柱内标签还需纵向放得下(略)
    // 只有"扩了真能装进柱"才扩:扩到位(封顶 1.5×)后柱宽仍 < 标签宽 → 不扩,
    // 数字按"只进柱"整层丢弃——白扩不加宽(corner 变体柱宽封顶常触发此情形)
    const needBarW = Math.min(maxLabelW + 6, cap);
    const needStep = (needBarW * k + gapAB * (k - 1)) / factor;
    const curStep = ((width - margins) * ratio) / n;
    if (curStep < needStep) {
      const w2 = Math.round(Math.min(width * 1.5, (needStep * n) / ratio + margins));
      const step2 = ((w2 - margins) * ratio) / n;
      const barW2 = Math.min(cap, (step2 * factor - gapAB * (k - 1)) / k);
      if (barW2 >= maxLabelW + 4) width = w2;
    }
  }

  const pad = 24;
  const plain = rules.canvas === 'plain';
  const ticks = niceTicks(gMax, plain ? 5 : 4);
  // 组数少(<5)时宽度贴内容收缩(设计密度 5 组:card 槽 93.6、plain 槽 139;下限 320)
  if (o.autoWidth && n > 0 && n < 5) {
    const slot = plain ? 139 : 93.6;
    const insets = plain ? width * 0.0792 + width * 0.0521 : pad + 44 + pad;
    const need = insets + n * slot;
    if (need < width) width = Math.round(Math.max(320, need));
  }
  const geo = plain ? barGeo(width, height, !!spec.title, { ticks }) : null;
  const contentTop = geo
    ? Math.max(geo.top, pad + (spec.title ? 32 : 0) + (spec.unit ? 18 : 0) + 24)
    : pad + (spec.title ? 32 : 0) + (spec.unit ? 18 : 0) + 24;
  const left = geo ? geo.left : Math.max(pad + 44, yTickInset({ ticks }));
  const right = geo ? geo.right : width - pad;
  const bottom = geo ? geo.bottom : height - pad - 30;
  const xLabelY = geo ? geo.xLabelY : bottom + 20;
  const legendY = geo ? geo.legendY : pad + 16;

  const yMax = ticks[ticks.length - 1];
  const y = (v: number): number => bottom - (v / yMax) * (bottom - contentTop);

  const parts: string[] = [
    card(width, height, plain),
    `<defs><linearGradient id="dg-bar" x1="0" y1="0" x2="0" y2="1">` +
      `<stop offset="0" stop-color="var(--d-ramp-a)"/><stop offset="1" stop-color="var(--d-ramp-b)"/></linearGradient></defs>`,
  ];
  if (rules.legend === 'top-left') {
    parts.push(topLegend(spec.series.map((s, i) => ({ name: s.name, color: colors[i], ...(o.interactive ? { index: i } : {}) })), left, legendY, 'left', rules.legendShape));
  } else {
    parts.push(topLegend(spec.series.map((s, i) => ({ name: s.name, color: colors[i], ...(o.interactive ? { index: i } : {}) })), plain ? right : width - pad, legendY, 'right', rules.legendShape));
  }

  yAxisGrid(parts, ticks, y, left, right, bottom, rules.grid, rules.gridDash, false, rules.baseline, [], rules.tickFont, geo ? 18 : 8);

  const step = (right - left) / n;
  // 规范 bar-1:柱宽 22、系列间距 5,四角圆角 rx4;通用形态按槽宽自适应
  const gap = rules.barCorner > 0 ? 5 : 0;
  const barW = rules.barCorner > 0
    ? Math.max(4, Math.min(22, (step * 0.72 - (k - 1) * gap) / k))
    : Math.max(4, Math.min(40, (step * 0.72) / k));
  const num = o.valueLabels ?? rules.num;
  const numItems: { x: number; yt: number; w: number; hAvail: number; text: string; fs: number; peak: boolean; fill: string; row?: number; fx?: number; fyt?: number; haloColor?: string; insideOnly?: boolean }[] = [];
  // 回退位:组中线 + 组内最高柱顶(同组标签在组上方单列堆叠)
  const groupTop = spec.labels.map((_, pi) => Math.min(...spec.series.map((s) => y(s.values[pi]))));
  spec.series.forEach((s, si) => {
    s.values.forEach((v, pi) => {
      if (v <= 0) return;
      const groupX = left + step * pi + (step - (barW * k + (k - 1) * gap)) / 2;
      const x = groupX + si * (barW + gap);
      const yt = y(v);
      const tip = o.interactive ? ` data-tip="${esc(`${spec.labels[pi]} · ${s.name}: ${fmtFull(v)}${spec.unit ? ' ' + spec.unit : ''}`)}" data-series="${si}"` : '';
      if (rules.barCorner > 0) {
        parts.push(`<rect x="${r2(x)}" y="${r2(yt)}" width="${r2(barW)}" height="${r2(bottom - yt)}" rx="${rules.barCorner}" fill="${colors[si]}"${tip}/>`);
      } else {
        const m = Math.min(3, barW / 2, bottom - yt);
        const path =
          `M${r2(x)} ${r2(bottom)}V${r2(yt + m)}Q${r2(x)} ${r2(yt)} ${r2(x + m)} ${r2(yt)}` +
          `H${r2(x + barW - m)}Q${r2(x + barW)} ${r2(yt)} ${r2(x + barW)} ${r2(yt + m)}V${r2(bottom)}Z`;
        parts.push(`<path d="${path}" fill="${colors[si]}"${tip}/>`);
      }
      const isPeak = si === peakS && pi === peakP;
      // 零值/占位不标:零高柱上飘"0"是噪音(标注克制原则)
      if (v > 0 && (num === 'all' || (num === 'peak' && isPeak))) {
        // 数值只进柱:柱内放不下(缩到 7px 也不行)→ 整层不标。
        // 不做组顶飘浮回退——密集图上一群数字浮在柱群上方比没有数字难看(标注克制)
        const text = fmtNum(v);
        numItems.push({ x, yt, w: barW, hAvail: bottom - yt, text, fs: isPeak ? 12 : 10.5, peak: isPeak, fill: onVar(si % skin.series.length), row: si, fx: left + step * pi + step / 2, fyt: groupTop[pi], haloColor: colors[si], insideOnly: true });
      }
    });
  });
  const placer = new LabelPlacer();
  reserveBands(placer, left, right, contentTop, bottom, xLabelY, spec.series, width - pad, legendY);
  pushBarLabelsAllOrNothing(parts, numItems, placer);
  const xStride = labelStride(spec.labels, step);
  spec.labels.forEach((l, pi) => {
    const cx = left + step * pi + step / 2;
    if (pi % xStride === 0) parts.push(`<text x="${r2(cx)}" y="${r2(xLabelY)}" text-anchor="middle" font-size="12" fill="var(--d-muted)">${esc(trunc(l, 12))}</text>`);
  });

  return svgDoc(width, height, 'bar', version, spec.title ?? 'bar chart', spec, skin, titleBlock(spec.title) + parts.join(''));
}
