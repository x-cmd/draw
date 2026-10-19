// 堆叠柱:同一 x 位置各系列上下堆叠,段间白缝,顶部段顶角圆角,数值标在每个色块内部。
// 量级差过大(某组的最大段都放不下标签)时自动拉高画布(封顶 3×,用户显式 ?h= 时不介入)。
import type { MultiSpec } from '../specs/index.js';
import { TAB, card } from '../theme.js';
import { esc, fmtNum, niceTicks, r2, textW, topLegend, trunc, type RenderOpts, svgDoc, titleBlock, yAxisGrid, findPeak, onVar, sVar, pushBarLabelsAllOrNothing, labelStride, LabelPlacer, reserveBands } from './svg.js';
import { yTickInset, tickColW } from './measure.js';

export function renderBarStacked(spec: MultiSpec, o: RenderOpts): string {
  let width = o.width;
  let height = o.height;
  const { version, skin } = o;
  const k = spec.series.length;
  const colors = spec.series.map((_, i) => sVar(i % skin.series.length));
  const n = spec.labels.length;
  const totals = spec.labels.map((_, pi) => spec.series.reduce((s, ser) => s + ser.values[pi], 0));
  const gMax = Math.max(...totals);
  // 全局最大段(num=peak 时只标它)
  const [peakS, peakP] = findPeak(spec.series);

  const pad = 24;
  const fixedTop = pad + (spec.title ? 32 : 0) + (spec.unit ? 18 : 0) + 24;
  // 刻度上限:5 档刻度更贴近数据(41842 → 50000,而非 4 档的 60000),减少顶部浪费
  const ticks0 = niceTicks(gMax, 5);
  const yMax0 = ticks0[ticks0.length - 1];
  // 极端量级差(最小组的总量连一行标签都放不下,如 40 倍差)→ 自动切 100% 百分比堆叠:
  // 各组满高、构成清晰,柱顶标总量补回绝对量;无需参数
  const plotH0 = height - pad - 30 - fixedTop;
  const smallestTotal = Math.min(...totals.filter((t) => t > 0));
  const pctMode = o.autoHeight === true && (smallestTotal / yMax0) * plotH0 < 14;
  // 非百分比模式下温和拉高(封顶 1.5×),补一点可读空间但不夸张
  if (!pctMode && o.autoHeight) {
    const groupMaxSeg = spec.labels.map((_, pi) => Math.max(...spec.series.map((s) => s.values[pi])));
    const smallest = Math.min(...groupMaxSeg.filter((v) => v > 0));
    const segPx = (smallest / yMax0) * plotH0;
    if (segPx > 0 && segPx < 10) {
      height = Math.round(height * Math.min(1.5, 10 / segPx));
    }
  }
  // 百分比模式柱顶要标总量,绘图区需下移到图例之下,否则总量与图例文字重叠
  const contentTop = pctMode ? Math.max(fixedTop, pad + 16 + 30) : fixedTop;
  // 百分比模式:各组的段按 pct 布局,轴刻度 0-100%
  const tickVals = pctMode ? [0, 20, 40, 60, 80, 100] : niceTicks(gMax, 5);
  // 左内边距 = max(规范 44, 实测刻度列;百分比模式刻度带 "%" 后缀)
  const left = Math.max(pad + 44, pctMode ? tickColW(tickVals, 12, 8, '%') + 2 : yTickInset({ ticks: tickVals }));
  // 组数少(<5)时宽度贴内容收缩(设计密度 5 组,槽 93.6;下限 320;显式 ?w= 不动)
  if (o.autoWidth && n < 5) {
    const need = left + n * 93.6 + pad;
    if (need < width) width = Math.round(Math.max(320, need));
  }
  const right = width - pad;
  const bottom = height - pad - 30;

  const yMax = pctMode ? 100 : tickVals[tickVals.length - 1];
  const scaleOf = (pi: number, v: number): number => (pctMode ? (v / totals[pi]) * 100 : v);
  const y = (v: number): number => bottom - (v / yMax) * (bottom - contentTop);
  // 显示的百分比:最大余数法取整,且只在"标签可见"的段之间分配余数,
  // 使图中能看到的数字合计恰好 100%(独立四舍五入会出 101%;隐藏小段会让合计 99%)
  const plotHForLabels = bottom - contentTop;
  const pctLabels: number[][] = spec.labels.map((_, pi) => {
    const exact = spec.series.map((s) => (s.values[pi] / totals[pi]) * 100);
    const visible = exact.map((e) => (e / 100) * plotHForLabels >= 7 + 4);
    const out = exact.map(() => 0);
    let rest = 100;
    for (let si = 0; si < out.length; si++) {
      if (visible[si]) {
        out[si] = Math.floor(exact[si]);
        rest -= out[si];
      }
    }
    const order = exact
      .map((e, i) => ({ i, rem: e - Math.floor(e) }))
      .filter((o) => visible[o.i])
      .sort((a, b) => b.rem - a.rem);
    for (const o of order) {
      if (rest <= 0) break;
      out[o.i]++;
      rest--;
    }
    return out;
  });

  const parts: string[] = [
    card(width, height),
    topLegend(spec.series.map((s, i) => ({ name: s.name, color: colors[i] })), width - pad, pad + 16),
  ];
  if (pctMode) {
    for (const t of tickVals) {
      const gy = y(t);
      if (t > 0) parts.push(`<line x1="${left}" y1="${r2(gy)}" x2="${right}" y2="${r2(gy)}" stroke="var(--d-grid)" stroke-width="1"/>`);
      parts.push(`<text x="${left - 8}" y="${r2(gy + 4)}" text-anchor="end" font-size="12" fill="var(--d-muted)" style="${TAB}">${t}%</text>`);
    }
    parts.push(`<line x1="${left}" y1="${r2(bottom)}" x2="${right}" y2="${r2(bottom)}" stroke="var(--d-baseline)" stroke-width="1"/>`);
  } else {
    yAxisGrid(parts, tickVals, y, left, right, bottom, skin.rules.grid, skin.rules.gridDash);
  }

  const step = (right - left) / n;
  const barW = Math.min(56, Math.max(6, step * 0.55));
  const num = o.valueLabels ?? skin.rules.num;
  const numItems: { x: number; yt: number; w: number; hAvail: number; text: string; fs: number; peak: boolean; fill: string; center: boolean; haloColor?: string }[] = [];
  const xStride = labelStride(spec.labels, step);
  spec.labels.forEach((label, pi) => {
    const x = left + step * pi + (step - barW) / 2;
    let cursor = bottom;
    spec.series.forEach((s, si) => {
      const v = s.values[pi];
      if (v <= 0) return; // 零值段:不画也不标(0 高度段标注是噪音)
      // 百分比模式:按该组占比布局(各组满高,构成清晰)
      const scaled = scaleOf(pi, v);
      const segH = (scaled / yMax) * (bottom - contentTop);
      // 微小段保底可见高度,否则 <1px 的段+白描边会渲染成白片
      const drawH = Math.max(segH, 1.6);
      const yTop = cursor - drawH;
      const isTopSeg = si === k - 1 || spec.series.slice(si + 1).every((ss) => ss.values[pi] === 0);
      const m = isTopSeg ? Math.min(4, barW / 2, drawH) : 0;
      const path =
        `M${r2(x)} ${r2(cursor)}V${r2(yTop + m)}Q${r2(x)} ${r2(yTop)} ${r2(x + m)} ${r2(yTop)}` +
        `H${r2(x + barW - m)}Q${r2(x + barW)} ${r2(yTop)} ${r2(x + barW)} ${r2(yTop + m)}V${r2(cursor)}Z`;
      // 分隔白描边按段高自适应:段太矮时描边会盖掉颜色
      const sw = segH >= 6 ? 2 : 0;
      parts.push(`<path d="${path}" fill="${colors[si]}"${sw ? ` stroke="var(--d-card)" stroke-width="${sw}"` : ''}/>`);
      const isPeakSeg = si === peakS && pi === peakP;
      if (num === 'all' || (num === 'peak' && isPeakSeg)) {
        // 数值一律入柱(像 900/1k 那样),字号自适应缩小;
        // 连 7px 都装不下的微小段不标——悬浮数字比缺一个数更难看
        const text = pctMode ? `${pctLabels[pi][si]}%` : fmtNum(v);
        const fs = isPeakSeg ? 12 : 11;
        const minFs = 7;
        if (barW >= textW(text, minFs) + 4 && segH >= minFs + 4) {
          numItems.push({ x, yt: yTop, w: barW, hAvail: segH, text, fs, peak: isPeakSeg, fill: onVar(si % skin.series.length), center: true, haloColor: colors[si] });
        }
      }
      cursor = yTop;
    });
    if (pi % xStride === 0) parts.push(`<text x="${r2(x + barW / 2)}" y="${r2(bottom + 20)}" text-anchor="middle" font-size="12" fill="var(--d-muted)">${esc(trunc(label, 12))}</text>`);
    // 百分比模式:柱顶标该组总量(补回绝对量)
    if (pctMode) {
      parts.push(
        `<text x="${r2(x + barW / 2)}" y="${r2(contentTop - 8)}" text-anchor="middle" font-size="11" font-weight="500" fill="var(--d-ink)" paint-order="stroke" stroke="var(--d-halo)" stroke-width="3" stroke-linejoin="round" style="${TAB}">${fmtNum(totals[pi])}</text>`,
      );
    }
  });
  const placer = new LabelPlacer();
  reserveBands(placer, left, right, contentTop, bottom, bottom + 20, spec.series, width - pad, pad + 16);
  pushBarLabelsAllOrNothing(parts, numItems, placer);

  return svgDoc(width, height, 'bar', version, spec.title ?? 'stacked bar chart', spec, skin, titleBlock(spec.title) + parts.join(''));
}
