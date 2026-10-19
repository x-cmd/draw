// 散点图(规范 scatter-1):双数值轴 + 虚线网格 + 轴标题,深浅蓝系列,点径交替(每 4 个一个大点)。
// 单系列(x=/y=)无图例;多系列(重复 x=/y= 或 JSON series)右上圆点图例。默认不标数值(轴已可读)。
import type { ScatterSpec, ScatterSeries } from '../specs/index.js';
import { TAB, card } from '../theme.js';
import { esc, fmtNum, niceStep, r2, snap, trunc, LabelPlacer, pushLineLabelsAllOrNothing, reserveBands, reserveEdges, sVar, type RenderOpts, svgDoc, titleBlock } from './svg.js';
import { tickColW } from './measure.js';

// 取整量程刻度:数据向下/向上取整到步长(规范 -18..19 → -20..20),刻度线铺满整域
function spanTicks(min: number, max: number, count: number): number[] {
  const step = niceStep((max - min) / count);
  const lo = Math.floor(min / step) * step;
  const hi = Math.ceil(max / step) * step;
  const out: number[] = [];
  for (let v = lo; v <= hi + 1e-9; v += step) out.push(snap(v, step));
  return out;
}

/**
 * Scatter plot with two numeric axes; negative values allowed.
 */
export function renderScatter(spec: ScatterSpec, o: RenderOpts): string {
  const { width, height, version, skin } = o;
  const series: ScatterSeries[] = spec.series?.length
    ? spec.series
    : [{ name: '', points: spec.points ?? [] }];
  const all = series.flatMap((s) => s.points);
  const xs = all.map((p) => p.x);
  const ys = all.map((p) => p.y);
  const xTicks = spanTicks(Math.min(...xs), Math.max(...xs), 4);
  const yTicks = spanTicks(Math.min(...ys), Math.max(...ys), 6);
  const minX = xTicks[0];
  const maxX = xTicks[xTicks.length - 1];
  const minY = yTicks[0];
  const maxY = yTicks[yTicks.length - 1];
  let peakS = 0;
  let peakP = 0;
  series.forEach((s, si) => s.points.forEach((p, pi) => {
    if (p.y > series[peakS].points[peakP].y) { peakS = si; peakP = pi; }
  }));

  // 几何(规范 920×490 实测):绘图区 92..852 × 90..420,刻度行 y=444,X 标题 y=470。
  // 左内边距 = max(规范 0.1w, 实测刻度列 + 旋转 Y 标题带)—— 长刻度/窄画布不再压轴标题
  const showTitles = width >= 320 && height >= 240;
  const left = Math.round(Math.max(
    width * 0.1,
    tickColW(yTicks, 12, 16) + (showTitles ? width * 0.024 + 14 : 6),
  ));
  const right = left + Math.round(width * 0.826);
  const bottom = Math.round(height * 0.857);
  const top = Math.round(height * 0.184);
  const tickY = Math.round(height * 0.906);

  const px = (x: number): number =>
    maxX === minX ? (left + right) / 2 : left + ((x - minX) / (maxX - minX)) * (right - left);
  const py = (y: number): number =>
    maxY === minY ? (top + bottom) / 2 : bottom - ((y - minY) / (maxY - minY)) * (bottom - top);

  const parts: string[] = [card(width, height, true)];

  // 网格 + 刻度(虚线 4 6)
  for (const t of yTicks) {
    const gy = py(t);
    parts.push(`<line x1="${left}" y1="${r2(gy)}" x2="${right}" y2="${r2(gy)}" stroke="var(--d-grid)" stroke-dasharray="4 6"/>`);
    parts.push(`<text x="${r2(left - 16)}" y="${r2(gy + 4)}" text-anchor="end" font-size="12" fill="var(--d-muted)" style="${TAB}">${fmtNum(t)}</text>`);
  }
  for (const t of xTicks) {
    const gx = px(t);
    parts.push(`<line x1="${r2(gx)}" y1="${r2(top)}" x2="${r2(gx)}" y2="${r2(bottom)}" stroke="var(--d-grid)" stroke-dasharray="4 6"/>`);
    parts.push(`<text x="${r2(gx)}" y="${r2(tickY)}" text-anchor="middle" font-size="12" fill="var(--d-muted)" style="${TAB}">${fmtNum(t)}</text>`);
  }
  parts.push(`<line x1="${left}" y1="${r2(bottom)}" x2="${right}" y2="${r2(bottom)}" stroke="var(--d-baseline)" stroke-width="1"/>`);
  // 轴标题:画布太小则省(会与刻度挤在一起)
  if (showTitles) {
    parts.push(`<text x="${r2((left + right) / 2)}" y="${r2(height * 0.959)}" text-anchor="middle" font-size="12" fill="var(--d-muted)">${esc(spec.unit ?? 'X value')}</text>`);
    parts.push(`<text x="${r2(width * 0.024)}" y="${r2(height / 2)}" text-anchor="middle" font-size="12" fill="var(--d-muted)" transform="rotate(-90 ${r2(width * 0.024)} ${r2(height / 2)})">Y value</text>`);
  }

  // 数据点:每系列一色,点径交替(每 4 个大点),半透明+白描边
  const num = o.valueLabels ?? 'none';
  const numItems: { px: number; py: number; text: string; isPeak: boolean }[] = [];
  series.forEach((s, si) => {
    const color = sVar(si % skin.series.length);
    s.points.forEach((p, pi) => {
      const isPeak = si === peakS && pi === peakP;
      parts.push(`<circle cx="${r2(px(p.x))}" cy="${r2(py(p.y))}" r="${pi % 4 === 0 ? 7 : 5}" fill="${color}" fill-opacity="0.78" stroke="var(--d-halo)" stroke-width="2"/>`);
      if (num === 'all' || (num === 'peak' && isPeak)) {
        numItems.push({ px: px(p.x), py: py(p.y), text: fmtNum(p.y), isPeak });
      }
    });
  });
  // 数值标签:全有或全无(num=all 时密集点必撞,整层不标优于重叠)。
  // 预留 Y 刻度带/X 刻度带/图例带与画布边带:标签不得压轴文字、不得出画布
  if (numItems.length > 0) {
    const placer = new LabelPlacer();
    reserveBands(placer, left, right, top, bottom, tickY, spec.series ?? [], right, Math.round(height * 0.09));
    reserveEdges(placer, width, height);
    pushLineLabelsAllOrNothing(parts, placer, numItems);
  }

  // 多系列:右上圆点图例
  if (spec.series?.length) {
    let lx = right;
    const legendY = Math.round(height * 0.09);
    for (let i = spec.series.length - 1; i >= 0; i--) {
      const name = trunc(spec.series[i].name, 12);
      parts.push(`<text x="${r2(lx)}" y="${r2(legendY)}" text-anchor="end" font-size="12" fill="var(--d-muted)">${esc(name)}</text>`);
      lx -= 12 + name.length * 6.5 + 10;
      parts.push(`<circle cx="${r2(lx)}" cy="${r2(legendY - 4)}" r="5" fill="${sVar(i % skin.series.length)}"/>`);
      lx -= 24;
    }
  }

  return svgDoc(width, height, 'scatter', version, spec.title ?? 'scatter chart', spec, skin, titleBlock(spec.title) + parts.join(''));
}
