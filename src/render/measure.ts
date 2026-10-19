// 测量层:量出固定文字的真实占位,各图种按 留白 = max(规范, 实测) 反推绘图区。
// 默认数据零漂移(实测 < 规范用规范值);防碰撞是 svg.ts 的 LabelPlacer,与本层互补。
// 精度来源:inter.ts 字宽表与渲染字体同源。
import { textW, fmtNum, trunc, labelStride } from './svg';

/** 四边留白 */
export interface Insets {
  left: number;
  right: number;
  top: number;
  bottom: number;
}

/** Y 轴刻度列宽:最宽刻度文字(可带后缀,如堆叠百分比模式的 "%")+ 与绘图区的间距 */
export function tickColW(ticks: readonly number[], fs = 12, gap = 8, suffix = ''): number {
  const w = Math.max(...ticks.map((t) => textW(fmtNum(t) + suffix, fs)), 0);
  return w + gap;
}

/** 径向"保图优先"预算结果 */
export interface RadialFitResult {
  R: number;
  /** 标签截短长度(= maxCut 表示未截) */
  cut: number;
  /** 引线段/标签间距(压缩后) */
  lead: number;
  /** true = 仍放不下 → 整层放弃标签,R 保持自然值 */
  drop: boolean;
}

/** 径向标注预算:R + lead + labelW ≤ budget。放不下按序降级(压引线/截名/R 下限),
 * 顺序由 order 决定;overflow='drop' 穷尽后放弃整层 */
export function radialFit(o: {
  natural: number;
  budget: number;
  lead: number;
  minLead: number;
  labelW: (cut: number) => number;
  maxCut: number;
  minCut: number;
  cutStep?: number;
  floorK: number;
  floorAbs?: number;
  order?: 'lead-first' | 'cut-first';
  overflow: 'drop' | 'floor';
}): RadialFitResult {
  if (o.natural + o.lead + o.labelW(o.maxCut) <= o.budget) {
    return { R: Math.max(Math.min(o.natural, o.budget - o.lead - o.labelW(o.maxCut)), o.floorAbs ?? 0), cut: o.maxCut, lead: o.lead, drop: false };
  }
  const cutFirst = o.order === 'cut-first';
  const lead = cutFirst ? o.lead : o.minLead;
  const step = o.cutStep ?? 2;
  let cut = o.maxCut;
  while (cut > o.minCut && o.floorK * o.natural + lead + o.labelW(cut) > o.budget) {
    cut = Math.max(o.minCut, cut - step);
  }
  if (cutFirst) {
    const r1 = Math.min(o.natural, o.budget - o.lead - o.labelW(cut));
    if (r1 >= o.floorK * o.natural) {
      return { R: Math.max(r1, o.floorAbs ?? 0), cut, lead: o.lead, drop: false };
    }
    const lead2 = Math.max(o.minLead, Math.floor(o.budget - o.labelW(cut) - o.floorK * o.natural));
    // 不钳 floorK:钳了会让标签溢出画布(文字不裁切优先)
    return { R: Math.max(Math.min(o.natural, o.budget - lead2 - o.labelW(cut)), o.floorAbs ?? 0), cut, lead: lead2, drop: false };
  }
  if (o.floorK * o.natural + lead + o.labelW(cut) <= o.budget) {
    return { R: Math.max(Math.min(o.natural, o.budget - lead - o.labelW(cut)), o.floorK * o.natural, o.floorAbs ?? 0), cut, lead, drop: false };
  }
  if (o.overflow === 'drop') {
    return { R: o.natural, cut, lead, drop: true };
  }
  const lead2 = Math.max(o.minLead, Math.floor(o.budget - o.labelW(cut) - o.floorK * o.natural));
  return { R: Math.max(Math.min(o.natural, o.budget - lead2 - o.labelW(cut)), o.floorAbs ?? 0), cut, lead: lead2, drop: false };
}

/** 规范几何函数接入测量的输入 */
export interface GeoMeasure {
  /** Y 轴刻度(非 inline 轴才有左列;yAxisGrid 默认 fs=12 / gap=8) */
  ticks?: readonly number[];
  tickFs?: number;
  tickGap?: number;
  /** X 轴标签(anchor=middle:首末标签半宽会外伸左右缘) */
  xLabels?: readonly string[];
  xFs?: number;
}

/** 首末 X 标签半宽外伸(按渲染同款 trunc 12 截断后取最宽的一半 + 间距) */
export function xOverhang(m: GeoMeasure): number {
  if (!m.xLabels?.length) return 0;
  const fs = m.xFs ?? 12;
  return Math.round(Math.max(...m.xLabels.map((l) => textW(trunc(l, 12), fs))) / 2 + 6);
}

/** Y 刻度列需要的最小左内边距 */
export function yTickInset(m: GeoMeasure): number {
  return m.ticks ? tickColW(m.ticks, m.tickFs ?? 12, m.tickGap ?? 8) + 2 : 0;
}

/** 预算内最大截断长度:按此截断后最宽标签 ≤ budget(放不下先截短不重叠) */
export function fitCut(labels: readonly string[], maxCut: number, budget: number, fs: number): number {
  const widest = (c: number): number => Math.max(...labels.map((l) => textW(trunc(l, c), fs)), 0);
  if (budget <= 0 || labels.length === 0) return maxCut;
  if (widest(maxCut) <= budget) return maxCut;
  for (let c = maxCut - 1; c >= 2; c--) {
    if (widest(c) <= budget) return c;
  }
  return 2;
}

// 规范几何(960×520 实测比例):留白 = max(规范, 实测),默认形态零漂移
export interface PlainGeo {
  left: number;
  right: number;
  top: number;
  bottom: number;
  xLabelY: number;
  legendY: number;
}
export function plainGeo(w: number, h: number, hasTitle: boolean, m: GeoMeasure = {}): PlainGeo {
  const halfX = xOverhang(m);
  return {
    left: Math.round(Math.max(Math.max(44, w * 0.082), halfX, yTickInset(m))),
    right: Math.round(w - Math.max(Math.max(28, w * 0.052), halfX)),
    top: Math.round(h * (hasTitle ? 0.185 : 0.163)),
    bottom: Math.round(h * 0.80),
    xLabelY: Math.round(h * 0.896),
    legendY: Math.round(h * (hasTitle ? 0.096 : 0.077)),
  };
}
