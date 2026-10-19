// 多折线(多系列):行为由皮肤规则驱动 —— 图例位置/形状、端标签(OpenData)、
// 虚线对比系列(evil-mono)、发光(evil-glow)、数值标注默认。
import type { MultiSpec } from '../specs';
import { card } from '../theme';
import { esc, fmtNum, niceTicks, r2, smoothPath, textW, topLegend, trunc, LabelPlacer, pushLineLabelsAllOrNothing, pushPoints, labelStride, reserveBands, toSegments, type LineSeg, type RenderOpts, svgDoc, titleBlock, editorialTitle, yAxisGrid, axisTitleY, findPeak, sVar } from './svg';
import { lineLayout } from './line';

export function renderLineMulti(spec: MultiSpec, o: RenderOpts): string {
  const { width, height, version, skin } = o;
  const allSegs: LineSeg[] = [];
  const rules = skin.rules;
  const k = spec.series.length;
  const colors = spec.series.map((_, i) => sVar(i % skin.series.length));
  const n = spec.labels.length;
  const gMax = Math.max(...spec.series.flatMap((s) => s.values));
  const [peakS, peakP] = findPeak(spec.series);

  const pad = 24;
  let headSvg = '';
  if (rules.title === 'editorial' && spec.title) {
    headSvg = editorialTitle(spec.title, width, pad).svg;
  } else {
    headSvg = titleBlock(spec.title, pad);
  }
  const { left, right: right0, bottom, contentTop, xLabelY, legendY } = lineLayout(spec, o);
  const ticks = niceTicks(gMax, 4);
  // 端标签(OpenData):右侧预留系列名宽度,防止贴边/裁切
  const endMax = rules.endLabels ? Math.max(...spec.series.map((s) => textW(trunc(s.name, 14), 11))) + 14 : 0;
  const right = Math.min(right0, width - pad - endMax);
  const yMax = ticks[ticks.length - 1];
  const y = (v: number): number => bottom - (v / yMax) * (bottom - contentTop);
  const xs = (i: number): number => (n === 1 ? (left + right) / 2 : left + ((right - left) * i) / (n - 1));

  const parts: string[] = [card(width, height, rules.canvas === 'plain')];
  if (rules.legend === 'top-left') {
    parts.push(topLegend(spec.series.map((s, i) => ({ name: s.name, color: colors[i] })), left, legendY, 'left', rules.legendShape));
  } else if (rules.legend === 'top-right') {
    parts.push(topLegend(spec.series.map((s, i) => ({ name: s.name, color: colors[i] })), right, legendY, 'right', rules.legendShape));
  }

  yAxisGrid(parts, ticks, y, left, right, bottom, rules.grid, rules.gridDash, rules.axisInline, rules.baseline, spec.labels.map((_, i) => xs(i)));
  if (rules.axisTitle) parts.push(axisTitleY(spec.unit, (contentTop + bottom) / 2, left - (rules.axisInline ? 17 : 26)));

  const num = o.valueLabels ?? rules.num;
  const placer = new LabelPlacer();
  // 预留 Y 刻度带、X 标签带与图例区:数值标签不得压上去
  reserveBands(
    placer, left, right0, contentTop, bottom, xLabelY,
    rules.legend === 'top-left' || rules.legend === 'top-right' ? spec.series : [],
    rules.legend === 'top-left' ? left : right,
    legendY,
  );
  const numItems: { px: number; py: number; text: string; isPeak: boolean }[] = [];
  spec.series.forEach((s, si) => {
    const pts = s.values.map((v, i) => [xs(i), y(v)] as [number, number]);
    allSegs.push(...toSegments(pts));
    const dpath = rules.smooth ? smoothPath(pts) : `M${pts.map((p) => `${r2(p[0])} ${r2(p[1])}`).join('L')}`;
    if (rules.glow) {
      parts.push(
        `<defs><filter id="d-glow" x="-20%" y="-60%" width="140%" height="220%"><feGaussianBlur stdDeviation="7"/></filter>` +
        `<linearGradient id="dg-glow-${si}" x1="0" y1="0" x2="1" y2="0">` +
        `<stop stop-color="${colors[si]}"/><stop offset="1" stop-color="${colors[(si + 1) % k]}"/></linearGradient></defs>`,
      );
      parts.push(`<path d="${dpath}" fill="none" stroke="${colors[si]}" stroke-width="14" stroke-opacity="0.32" stroke-linecap="round" filter="url(#d-glow)"/>`);
      parts.push(`<path d="${dpath}" fill="none" stroke="url(#dg-glow-${si})" stroke-width="${rules.lineWidth}" stroke-linecap="round" stroke-linejoin="round"/>`);
    } else {
      const dash = rules.dashSecondary && si > 0 ? ' stroke-dasharray="5 6"' : rules.lineDash ? ` stroke-dasharray="${rules.lineDash}"` : '';
      parts.push(`<path d="${dpath}" fill="none" stroke="${colors[si]}" stroke-width="${rules.lineWidth}" stroke-linecap="round" stroke-linejoin="round"${dash}/>`);
    }
    if (rules.endLabels) {
      // OpenData:线端系列名(彩色,白描边);碰撞即舍弃
      const [ex, ey] = pts[n - 1];
      const name = trunc(s.name, 14);
      const w = textW(name, 11);
      if (placer.fits(ex + 7, ey - 9, w, 13)) {
        parts.push(
          `<text x="${r2(ex + 7)}" y="${r2(ey + 4)}" text-anchor="start" font-size="11" font-weight="600" fill="${colors[si]}" ` +
          `paint-order="stroke" stroke="var(--d-halo)" stroke-width="3" stroke-linejoin="round">${esc(name)}</text>`,
        );
      }
    }
    pushPoints(parts, pts, colors[si], rules);
    // 多系列折线只标"每条线自己的峰值"(全标会挤成一团;全局峰值只标一个也不对)
    if (num !== 'none') {
      let ownPeak = 0;
      s.values.forEach((v, pi) => {
        if (v > s.values[ownPeak]) ownPeak = pi;
      });
      numItems.push({ px: pts[ownPeak][0], py: pts[ownPeak][1], text: fmtNum(s.values[ownPeak]), isPeak: si === peakS && ownPeak === peakP });
    }
  });
  // 数值标签:全有或全无(任一位置放不下则整层不标)
  if (numItems.length > 0) pushLineLabelsAllOrNothing(parts, placer, numItems, allSegs);
  const xStride = labelStride(spec.labels, (right - left) / Math.max(n - 1, 1));
  spec.labels.forEach((l, i) => {
    if (i % xStride === 0) parts.push(`<text x="${r2(xs(i))}" y="${r2(xLabelY)}" text-anchor="middle" font-size="12" fill="var(--d-muted)">${esc(trunc(l, 12))}</text>`);
  });

  return svgDoc(width, height, 'line', version, spec.title ?? 'line chart', spec, skin, headSvg + parts.join(''));
}
