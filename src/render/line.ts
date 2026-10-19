// 折线图(单系列):行为由皮肤规则驱动(规范:折线图 1-5)。
// 面积填充/数值标注/平滑/点形态/线宽/虚线/发光全部跟随变体规则。
import type { ChartSpec, MultiSpec } from '../specs/index.js';
import { card } from '../theme.js';
import { esc, fmtNum, niceTicks, r2, trunc, LabelPlacer, pushLineLabelsAllOrNothing, pushPoints, labelStride, toSegments, reserveBands, smoothPath, type RenderOpts, svgDoc, titleBlock, editorialTitle, yAxisGrid, axisTitleY } from './svg.js';
import { plainGeo, type GeoMeasure } from './measure.js';

export function renderLine(spec: ChartSpec, o: RenderOpts): string {
  const { width, height, version, skin } = o;
  const rules = skin.rules;
  const values = spec.data.map((d) => d.value);
  const max = Math.max(...values);
  const peakIdx = values.indexOf(max);
  const plain = rules.canvas === 'plain';

  // 标题区(编辑式大标题占两行)
  const pad = 24;
  let headSvg = '';
  let headH = 0;
  if (rules.title === 'editorial' && spec.title) {
    const t = editorialTitle(spec.title, width, pad);
    headSvg = t.svg;
    headH = t.height + 6;
  } else {
    headSvg = titleBlock(spec.title, pad);
    if (spec.title) headH = 24;
  }
  const ticks = niceTicks(max, 4);
  // 测量驱动留白:inline 轴刻度画在绘图区内,不占左列
  const measure: GeoMeasure = {
    xLabels: spec.data.map((d) => d.label),
    ...(rules.axisInline ? {} : { ticks }),
  };
  const geo = plain ? plainGeo(width, height, !!spec.title, measure) : null;
  const contentTop = geo ? Math.max(geo.top, pad + headH + 14) : pad + headH + 20;
  const left = geo ? geo.left : pad + (rules.axisInline ? 42 : 48);
  const right = geo ? geo.right : width - pad;
  const bottom = geo ? geo.bottom : height - pad - 30;
  const xLabelY = geo ? geo.xLabelY : bottom + (rules.baseline === 'dots' ? 34 : 20);

  const yMax = ticks[ticks.length - 1];
  const y = (v: number): number => bottom - (v / yMax) * (bottom - contentTop);

  const n = spec.data.length;
  const xs = (i: number): number => (n === 1 ? (left + right) / 2 : left + ((right - left) * i) / (n - 1));
  const pts = spec.data.map((d, i) => [xs(i), y(d.value)] as [number, number]);
  const path = rules.smooth ? smoothPath(pts) : `M${pts.map((p) => `${r2(p[0])} ${r2(p[1])}`).join('L')}`;

  const parts: string[] = [card(width, height, rules.canvas === 'plain')];
  if (rules.areaGradient) {
    parts.push(
      `<defs><linearGradient id="dg-area" x1="0" y1="0" x2="0" y2="1">` +
      `<stop offset="0" stop-color="var(--d-s1)" stop-opacity="${rules.areaTop}"/>` +
      `<stop offset="1" stop-color="var(--d-s1)" stop-opacity="${rules.areaBottom}"/></linearGradient></defs>`,
    );
  }
  yAxisGrid(parts, ticks, y, left, right, bottom, rules.grid, rules.gridDash, rules.axisInline, rules.baseline, pts.map((p) => p[0]));
  if (rules.axisTitle) parts.push(axisTitleY(spec.unit, (contentTop + bottom) / 2, left - (rules.axisInline ? 17 : 26)));

  if (rules.glow) {
    // Glow 风:模糊底层 + 渐变描边(规范 line-3:宽14/透明.32/模糊7)
    parts.push(
      `<defs><filter id="d-glow" x="-20%" y="-60%" width="140%" height="220%"><feGaussianBlur stdDeviation="7"/></filter>` +
      `<linearGradient id="dg-glow-0" x1="0" y1="0" x2="1" y2="0">` +
      `<stop stop-color="var(--d-s1)"/><stop offset="1" stop-color="var(--d-s2)"/></linearGradient></defs>`,
    );
    parts.push(`<path d="${path}" fill="none" stroke="var(--d-s1)" stroke-width="14" stroke-opacity="0.32" stroke-linecap="round" filter="url(#d-glow)"/>`);
    parts.push(`<path d="${path}" fill="none" stroke="url(#dg-glow-0)" stroke-width="${rules.lineWidth}" stroke-linecap="round" stroke-linejoin="round"/>`);
  } else {
    if (rules.areaGradient) {
      parts.push(`<path d="${path}L${r2(pts[n - 1][0])} ${r2(bottom)}L${r2(pts[0][0])} ${r2(bottom)}Z" fill="url(#dg-area)"/>`);
    }
    const dash = rules.lineDash ? ` stroke-dasharray="${rules.lineDash}"` : '';
    parts.push(`<path d="${path}" fill="none" stroke="var(--d-s1)" stroke-width="${rules.lineWidth}" stroke-linecap="round" stroke-linejoin="round"${dash}/>`);
  }

  pushPoints(parts, pts, 'var(--d-s1)', rules);
  const xStride = labelStride(spec.data.map((d) => d.label), (right - left) / Math.max(n - 1, 1));
  spec.data.forEach((d, i) => {
    if (i % xStride === 0) parts.push(`<text x="${r2(xs(i))}" y="${r2(xLabelY)}" text-anchor="middle" font-size="12" fill="var(--d-muted)">${esc(trunc(d.label, 12))}</text>`);
  });

  // 数值标签:全有或全无(任一位置放不下则整层不标);规范变体默认不标
  const num = o.valueLabels ?? rules.num;
  if (num !== 'none') {
    const items = pts
      .map((p, i) => ({ px: p[0], py: p[1], text: fmtNum(spec.data[i].value), isPeak: i === peakIdx }))
      .filter((_, i) => num === 'all' || i === peakIdx);
    const placer = new LabelPlacer();
    // 预留 Y 刻度带与 X 标签带:数值标签不得压刻度
    reserveBands(placer, left, right, contentTop, bottom, xLabelY, [], 0, 0);
    pushLineLabelsAllOrNothing(parts, placer, items, toSegments(pts));
  }

  return svgDoc(width, height, 'line', version, spec.title ?? 'line chart', spec, skin, headSvg + parts.join(''));
}

// 多系列共享的头部布局计算(line-multi 使用)
export function lineLayout(spec: MultiSpec, o: RenderOpts): {
  left: number; right: number; bottom: number; contentTop: number; xLabelY: number; legendY: number;
} {
  const rules = o.skin.rules;
  const pad = 24;
  let headH = 0;
  if (rules.title === 'editorial' && spec.title) {
    headH = editorialTitle(spec.title, o.width, pad).height + 6;
  } else if (spec.title) {
    headH = 24;
  }
  const hasLegendRow = rules.legend.startsWith('top');
  if (rules.canvas === 'plain') {
    // 预览刻度与标签宽度参与留白测量(与渲染时的 niceTicks(gMax, 4) 同源)
    const m: GeoMeasure = {
      xLabels: spec.labels,
      ...(rules.axisInline ? {} : { ticks: niceTicks(Math.max(...spec.series.flatMap((s) => s.values)), 4) }),
    };
    const geo = plainGeo(o.width, o.height, !!spec.title, m);
    return {
      left: geo.left,
      right: geo.right,
      bottom: geo.bottom,
      contentTop: Math.max(geo.top, pad + headH + (hasLegendRow ? 26 : 14) + 10),
      xLabelY: geo.xLabelY,
      legendY: Math.max(geo.legendY, pad + headH + 16), // 标题存在时图例下移,避免压标题
    };
  }
  const bottom = o.height - pad - 30;
  return {
    left: pad + (rules.axisInline ? 42 : 48),
    right: o.width - pad,
    bottom,
    contentTop: pad + headH + (hasLegendRow ? 26 : 14) + 10,
    xLabelY: bottom + (rules.baseline === 'dots' ? 34 : 20),
    legendY: pad + headH + 16,
  };
}
