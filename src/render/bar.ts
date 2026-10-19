// 柱状图(单系列):卡片容器、主题渐变柱体、顶角 4px 圆角、数值入柱。
import type { ChartSpec } from '../specs/index.js';
import { TAB, card } from '../theme.js';
import { esc, fmtNum, niceTicks, r2, trunc, svgDoc, titleBlock, yAxisGrid, pushBarLabelsAllOrNothing, labelStride, textW, LabelPlacer, reserveBands, type RenderOpts } from './svg.js';
import { yTickInset } from './measure.js';

export function renderBar(spec: ChartSpec, o: RenderOpts): string {
  const { height, version, skin } = o;
  let width = o.width;
  const values = spec.data.map((d) => d.value);
  const max = Math.max(...values);
  const peakIdx = values.indexOf(max);

  const pad = 24;
  const contentTop = pad + (spec.title ? 32 : 0) + (spec.unit ? 18 : 0) + 20;
  // 柱宽不足以容纳数值标签时自动加宽画布(封顶 2.5×),让数字留在柱内
  const nBars = spec.data.length;
  // 按缩字号下限(7px)估标签宽:只有"扩了真能装进柱"才扩宽(封顶 1.5×),
  // 装不下(如 corner 柱宽封顶 22 < 标签宽)就保持默认宽度、数字走回退——白扩不加宽
  const maxLabelW = Math.max(...spec.data.map((d) => textW(fmtNum(d.value), 7)));
  const needSlot = (maxLabelW + 10) / 0.55;
  if (o.autoWidth && nBars > 0 && (width - 68 - pad) / nBars < needSlot) {
    const w2 = Math.round(Math.min(width * 1.5, 68 + pad + needSlot * nBars));
    const barW2 = Math.min(56, ((w2 - 68 - pad) / nBars) * 0.55);
    if (barW2 >= maxLabelW + 4) width = w2;
  }
  const ticks = niceTicks(max, 4);
  // 左内边距 = max(规范 44, 实测刻度列):长刻度/窄画布不裁字
  const left = Math.max(pad + 44, yTickInset({ ticks }));
  // 组数少(<5)时宽度贴内容收缩(设计密度 5 组,槽 93.6;下限 320;显式 ?w= 不动)
  if (o.autoWidth && nBars < 5) {
    const need = left + nBars * 93.6 + pad;
    if (need < width) width = Math.round(Math.max(320, need));
  }
  const right = width - pad;
  const bottom = height - pad - 30;

  const yMax = ticks[ticks.length - 1];
  const y = (v: number): number => bottom - (v / yMax) * (bottom - contentTop);

  const parts: string[] = [
    card(width, height),
    // 柱体渐变(顶部亮 → 底部深)
    `<defs><linearGradient id="dg-bar" x1="0" y1="0" x2="0" y2="1">` +
      `<stop offset="0" stop-color="var(--d-ramp-a)"/><stop offset="1" stop-color="var(--d-ramp-b)"/></linearGradient></defs>`,
  ];

  // 网格线 + 刻度 + 基线
  yAxisGrid(parts, ticks, y, left, right, bottom, skin.rules.grid, skin.rules.gridDash);

  // 柱体:墨色、仅顶角圆角 4px
  const n = spec.data.length;
  const step = (right - left) / n;
  const barW = Math.min(56, Math.max(6, step * 0.55));
  const num = o.valueLabels ?? skin.rules.num;
  const labelColor = 'var(--d-on-s1)'; // 渐变顶端即标签所在处的底色
  const numItems: { x: number; yt: number; w: number; hAvail: number; text: string; fs: number; peak: boolean; fill: string; haloColor?: string }[] = [];
  const xStride = labelStride(spec.data.map((d) => d.label), step);
  spec.data.forEach((d, i) => {
    const x = left + step * i + (step - barW) / 2;
    const yt = y(d.value);
    const m = Math.min(4, barW / 2, bottom - yt);
    const path =
      `M${r2(x)} ${r2(bottom)}V${r2(yt + m)}Q${r2(x)} ${r2(yt)} ${r2(x + m)} ${r2(yt)}` +
      `H${r2(x + barW - m)}Q${r2(x + barW)} ${r2(yt)} ${r2(x + barW)} ${r2(yt + m)}V${r2(bottom)}Z`;
    parts.push(`<path d="${path}" fill="url(#dg-bar)"/>`);
    const isPeak = i === peakIdx;
    // 零值不标:没有柱子的"0"是噪音(标注克制原则)
    if (d.value > 0 && (num === 'all' || (num === 'peak' && isPeak))) {
      // 数值入柱;矮柱(极小值)回退柱顶上方;过密相撞才整层不标
      numItems.push({ x, yt, w: barW, hAvail: bottom - yt, text: fmtNum(d.value), fs: isPeak ? 13 : 11, peak: isPeak, fill: labelColor, haloColor: 'var(--d-s1)' });
    }
    if (i % xStride === 0) parts.push(`<text x="${r2(x + barW / 2)}" y="${r2(bottom + 20)}" text-anchor="middle" font-size="12" fill="var(--d-muted)">${esc(trunc(d.label, 12))}</text>`);
  });
  const placer = new LabelPlacer();
  // 预留 Y 刻度带与 X 标签带:数值标签不得压刻度
  reserveBands(placer, left, right, contentTop, bottom, bottom + 20, [], 0, 0);
  pushBarLabelsAllOrNothing(parts, numItems, placer);

  return svgDoc(width, height, 'bar', version, spec.title ?? 'bar chart', spec, skin, titleBlock(spec.title) + parts.join(''));
}
