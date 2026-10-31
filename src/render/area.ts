// 面积图:行为由皮肤规则驱动(规范 面积图 1-3)。
import { ApiError, type ChartSpec, type MultiSpec } from '../specs/index.js';
import { card, TAB } from '../theme.js';
import {
  esc, fmtFull, fmtNum, niceStep, niceTicks, r2, reserveBands, snap, smoothPath, trunc, LabelPlacer, pushLineLabelsAllOrNothing, pushPoints, toSegments,
  type RenderOpts, svgDoc, titleBlock, editorialTitle, yAxisGrid, axisTitleY, topLegend, findPeak, sVar,
} from './svg.js';
import { xOverhang, yTickInset, type GeoMeasure } from './measure.js';
import { HANDEE_WOFF2 } from '../styles/handlee.js';

const SKETCH_FONT = "Handlee,'Comic Sans MS','Chalkboard SE','Comic Neue','Segoe Print',cursive";

// 规范 area-1 实测几何(960×520);留白 = max(规范比例, 实测)
function areaGeo(w: number, h: number, hasTitle: boolean, m: GeoMeasure = {}) {
  const halfX = xOverhang(m);
  return {
    left: Math.round(Math.max(w * 0.0667, halfX, yTickInset(m))),
    right: w - Math.round(Math.max(w * 0.0625, halfX)),
    top: Math.round(h * (hasTitle ? 0.2 : 0.173)),
    bottom: Math.round(h * 0.8077),
    xLabelY: Math.round(h * 0.896),
    legendY: Math.round(h * 0.092),
  };
}

// 规范 area-3 实测几何(766×500)
function opendataGeo(w: number, h: number, m: GeoMeasure = {}) {
  const halfX = xOverhang(m);
  return {
    left: Math.round(Math.max(w * 0.064, halfX, yTickInset(m))),
    right: w - Math.round(Math.max(w * 0.034, halfX)),
    top: Math.round(h * 0.268),
    bottom: Math.round(h * 0.8096),
    xLabelY: Math.round(h * 0.852),
    legendY: Math.round(h * 0.092),
  };
}

// 单/多系列共用布局
function areaLayout(spec: { title?: string; unit?: string; subtitle?: string }, o: RenderOpts, m: GeoMeasure = {}): {
  headSvg: string; contentTop: number; left: number; right: number; bottom: number; xLabelY: number; legendY: number; xFirst: number;
} {
  const { width, height, skin } = o;
  const rules = skin.rules;
  const pad = 24;
  let headSvg = '';
  let headH = 0;
  if (rules.title === 'editorial' && spec.title) {
    const t = editorialTitle(spec.title, width, pad);
    // 编辑式副标题(规范 area-3:16px 灰,随末行标题 +29)
    headSvg = t.svg + (spec.subtitle
      ? `<text x="${pad}" y="${r2(pad + t.height + 18.5)}" font-size="16" fill="var(--d-muted)">${esc(spec.subtitle)}</text>`
      : '');
    headH = t.height + 6 + (spec.subtitle ? 26 : 0);
  } else {
    headSvg = titleBlock(spec.title, pad);
    if (spec.title) headH = 24;
  }
  const hasLegendRow = rules.legend.startsWith('top');
  // plain 画布用规范几何,card 变体用内边距布局
  const geo = rules.canvas === 'plain' && !rules.sketch
    ? (rules.title === 'editorial' ? opendataGeo(width, height, m) : areaGeo(width, height, !!spec.title, m))
    : null;
  const left = geo ? geo.left : pad + (rules.axisInline ? 42 : 48);
  return {
    headSvg,
    contentTop: geo ? Math.max(geo.top, pad + headH + (hasLegendRow ? 26 : 14)) : pad + headH + (hasLegendRow ? 36 : 20),
    left,
    right: geo ? geo.right : width - pad,
    bottom: geo ? geo.bottom : height - pad - 30,
    xLabelY: geo ? geo.xLabelY : height - pad - 30 + (rules.baseline === 'dots' ? 34 : 20),
    legendY: geo ? geo.legendY : pad + 16,
    // area-3:数据点自 left 内缩(时间轴留白)
    xFirst: rules.title === 'editorial' && geo ? left + Math.round(width * 0.0574) : left,
  };
}

export function renderArea(spec: ChartSpec, o: RenderOpts): string {
  const { width, height, version, skin } = o;
  const rules = skin.rules;
  if (rules.sketch) return renderSketchArea(spec, o);

  const values = spec.data.map((d) => d.value);
  const max = Math.max(...values);
  let peakIdx = 0;
  values.forEach((v, i) => {
    if (v > values[peakIdx]) peakIdx = i;
  });

  const vmin = Math.min(...values);
  // Y 轴区间:默认从 0;area-3 用数据区间外扩一格
  let ticks: number[];
  if (rules.yFromZero) {
    ticks = niceTicks(max, 4);
  } else {
    const step = niceStep((max - vmin) / 6);
    if (!(step > 0)) {
      // 常量数据回退 0 基准,避免 NaN
      ticks = niceTicks(max, 4);
    } else {
      const lo = Math.floor(vmin / step) * step;
      // area-3:顶刻度取数据下方最近格点,峰值允许微出上格
      let hi = Math.floor(max / step) * step;
      if (hi < lo + step) hi = lo + step * 6;
      ticks = [];
      for (let v = lo; v <= hi + 1e-9; v += step) ticks.push(snap(v, step));
    }
  }
  const { headSvg, contentTop, left, right, bottom, xLabelY, xFirst } = areaLayout(
    spec,
    o,
    { xLabels: spec.data.map((d) => d.label), xFs: rules.tickFont, ...(rules.axisInline ? {} : { ticks, tickFs: rules.tickFont }) },
  );
  const yMin = ticks[0];
  const yMax = ticks[ticks.length - 1];
  const y = (v: number): number => bottom - ((v - yMin) / (yMax - yMin)) * (bottom - contentTop);

  const n = spec.data.length;
  const xs = (i: number): number => (n === 1 ? (left + right) / 2 : xFirst + ((right - xFirst) * i) / (n - 1));
  const pts = spec.data.map((d, i) => [xs(i), y(d.value)] as [number, number]);
  const path = rules.smooth ? smoothPath(pts) : `M${pts.map((p) => `${r2(p[0])} ${r2(p[1])}`).join('L')}`;

  const parts: string[] = [card(width, height, rules.canvas === 'plain')];
  parts.push(
    `<defs><linearGradient id="dg-area" x1="0" y1="0" x2="0" y2="1">` +
    `<stop offset="0" stop-color="var(--d-s1)" stop-opacity="${rules.areaTop}"/>` +
    `<stop offset="1" stop-color="var(--d-s1)" stop-opacity="${rules.areaBottom}"/></linearGradient></defs>`,
  );
  yAxisGrid(parts, ticks, y, left, right, bottom, rules.grid, rules.gridDash, rules.axisInline, rules.baseline, pts.map((p) => p[0]), rules.tickFont);
  if (rules.axisTitle) parts.push(axisTitleY(spec.unit, (contentTop + bottom) / 2, left - (rules.axisInline ? 17 : 26)));

  parts.push(`<path d="${path}L${r2(pts[n - 1][0])} ${r2(bottom)}L${r2(pts[0][0])} ${r2(bottom)}Z" fill="url(#dg-area)"/>`);
  const dash = rules.lineDash ? ` stroke-dasharray="${rules.lineDash}"` : '';
  parts.push(`<path d="${path}" fill="none" stroke="var(--d-s1)" stroke-width="${rules.lineWidth}" stroke-linecap="round" stroke-linejoin="round"${dash}/>`);

  pushPoints(parts, pts, 'var(--d-s1)', rules, o.interactive ? spec.data.map((d) => `${d.label} · ${fmtFull(d.value)}${spec.unit ? ' ' + spec.unit : ''}`) : undefined, 0);
  const skip = n > 14 ? Math.ceil(n / 7) : 1;
  spec.data.forEach((d, i) => {
    if (i % skip !== 0 && i !== n - 1) return;
    parts.push(`<text x="${r2(xs(i))}" y="${r2(xLabelY)}" text-anchor="middle" font-size="${rules.tickFont}" fill="var(--d-muted)">${esc(trunc(d.label, 12))}</text>`);
  });

  // 数值标签:全有或全无;规范变体默认不标
  const num = o.valueLabels ?? rules.num;
  if (num !== 'none') {
    const items = pts
      .map((p, i) => ({ px: p[0], py: p[1], text: fmtNum(spec.data[i].value), isPeak: i === peakIdx }))
      .filter((_, i) => num === 'all' || i === peakIdx);
    const placer = new LabelPlacer();
    // 预留刻度带/标签带
    reserveBands(placer, left, right, contentTop, bottom, xLabelY, [], 0, 0);
    pushLineLabelsAllOrNothing(parts, placer, items, toSegments(pts));
  }

  // area-3 编辑元素:均值参考线 + 末点标注 + 来源脚注
  if (rules.refAvg) {
    const mean = values.reduce((a, b) => a + b, 0) / values.length;
    const my = y(mean);
    parts.push(`<line x1="${left}" y1="${r2(my)}" x2="${right}" y2="${r2(my)}" stroke="${sVar(2)}" stroke-width="1" stroke-dasharray="4 3"/>`);
    parts.push(
      `<text x="${r2(right)}" y="${r2(my - 6)}" text-anchor="end" font-size="11" fill="${sVar(2)}" ` +
      `paint-order="stroke" stroke="var(--d-halo)" stroke-width="3" stroke-linejoin="round">Avg: ${fmtNum(mean)}</text>`,
    );
  }
  if (rules.endValue) {
    const [ex, ey] = pts[n - 1];
    parts.push(`<circle cx="${r2(ex)}" cy="${r2(ey)}" r="4" fill="var(--d-halo)" stroke="var(--d-faint)" stroke-width="1.5"/>`);
    parts.push(
      `<text x="${r2(ex - 8)}" y="${r2(ey + 20)}" text-anchor="end" font-size="11" font-weight="500" fill="var(--d-ink)" ` +
      `paint-order="stroke" stroke="var(--d-halo)" stroke-width="3" stroke-linejoin="round" style="${TAB}">${fmtFull(spec.data[n - 1].value)}</text>`,
    );
  }
  if (spec.source) {
    parts.push(`<text x="24" y="${r2(Math.round(height * 0.904))}" font-size="13" fill="var(--d-muted)">${esc(spec.source)}</text>`);
  }

  return svgDoc(width, height, 'area', version, spec.title ?? 'area chart', spec, skin, headSvg + parts.join(''));
}

// 多系列面积(area-1):三遍绘制(面积 → 虚线描边 → 点)
export function renderAreaMulti(spec: MultiSpec, o: RenderOpts): string {
  const { width, height, version, skin } = o;
  const rules = skin.rules;
  const n = spec.labels.length;
  const gMax = Math.max(...spec.series.flatMap((s) => s.values));
  const [peakS, peakP] = findPeak(spec.series);

  const ticks = niceTicks(gMax, 4);
  const { headSvg, contentTop, left, right, bottom, xLabelY, legendY, xFirst } = areaLayout(
    spec,
    o,
    { xLabels: spec.labels, xFs: rules.tickFont, ...(rules.axisInline ? {} : { ticks, tickFs: rules.tickFont }) },
  );
  const yMax = ticks[ticks.length - 1];
  const y = (v: number): number => bottom - (v / yMax) * (bottom - contentTop);
  const xs = (i: number): number => (n === 1 ? (left + right) / 2 : xFirst + ((right - xFirst) * i) / (n - 1));

  const colors = spec.series.map((_, i) => sVar(i % skin.series.length));
  const allPts = spec.series.map((s) => s.values.map((v, i) => [xs(i), y(v)] as [number, number]));
  const pathOf = (pts: [number, number][]): string =>
    rules.smooth ? smoothPath(pts) : `M${pts.map((p) => `${r2(p[0])} ${r2(p[1])}`).join('L')}`;

  const parts: string[] = [card(width, height, rules.canvas === 'plain')];
  parts.push(
    `<defs>${spec.series.map((_, i) =>
      `<linearGradient id="dg-area-${i}" x1="0" y1="0" x2="0" y2="1">` +
      `<stop offset="0" stop-color="${colors[i]}" stop-opacity="${rules.areaTop}"/>` +
      `<stop offset="1" stop-color="${colors[i]}" stop-opacity="${rules.areaBottom}"/></linearGradient>`).join('')}</defs>`,
  );
  if (rules.legend === 'top-left') {
    parts.push(topLegend(spec.series.map((s, i) => ({ name: s.name, color: colors[i] })), left, legendY, 'left', rules.legendShape));
  } else if (rules.legend === 'top-right') {
    parts.push(topLegend(spec.series.map((s, i) => ({ name: s.name, color: colors[i] })), right, legendY, 'right', rules.legendShape));
  }
  yAxisGrid(parts, ticks, y, left, right, bottom, rules.grid, rules.gridDash, rules.axisInline, rules.baseline, spec.labels.map((_, i) => xs(i)), rules.tickFont);
  if (rules.axisTitle) parts.push(axisTitleY(spec.unit, (contentTop + bottom) / 2, left - (rules.axisInline ? 17 : 26)));

  allPts.forEach((pts, i) => {
    parts.push(`<path d="${pathOf(pts)}L${r2(pts[n - 1][0])} ${r2(bottom)}L${r2(pts[0][0])} ${r2(bottom)}Z" fill="url(#dg-area-${i})"/>`);
  });
  const dash = rules.lineDash ? ` stroke-dasharray="${rules.lineDash}"` : '';
  allPts.forEach((pts, i) => {
    parts.push(`<path d="${pathOf(pts)}" fill="none" stroke="${colors[i]}" stroke-width="${rules.lineWidth}" stroke-linecap="round" stroke-linejoin="round"${dash}/>`);
  });
  allPts.forEach((pts, i) => pushPoints(parts, pts, colors[i], rules, o.interactive ? spec.series[i].values.map((v, vi) => `${spec.labels[vi]} · ${spec.series[i].name}: ${fmtFull(v)}${spec.unit ? ' ' + spec.unit : ''}`) : undefined, i));
  const skip = n > 14 ? Math.ceil(n / 7) : 1;
  spec.labels.forEach((l, i) => {
    if (i % skip !== 0 && i !== n - 1) return;
    parts.push(`<text x="${r2(xs(i))}" y="${r2(xLabelY)}" text-anchor="middle" font-size="${rules.tickFont}" fill="var(--d-muted)">${esc(trunc(l, 12))}</text>`);
  });

  const num = o.valueLabels ?? rules.num;
  if (num !== 'none') {
    const items: { px: number; py: number; text: string; isPeak: boolean }[] = [];
    spec.series.forEach((s, si) => {
      s.values.forEach((v, pi) => {
        const isPeak = si === peakS && pi === peakP;
        if (num === 'peak' && !isPeak) return;
        items.push({ px: allPts[si][pi][0], py: allPts[si][pi][1], text: fmtNum(v), isPeak });
      });
    });
    // 数值标签:全有或无;预留刻度带
    if (items.length > 0) {
      const placer = new LabelPlacer();
      reserveBands(placer, left, right, contentTop, bottom, xLabelY, [], 0, 0);
      pushLineLabelsAllOrNothing(parts, placer, items, allPts.flatMap((p) => toSegments(p)));
    }
  }

  return svgDoc(width, height, 'area', version, spec.title ?? 'area chart', spec, skin, headSvg + parts.join(''));
}

// 手绘风面积图(area-2):xkcd 滤镜 + Handlee 手写字体 + 端点标注
function renderSketchArea(spec: ChartSpec, o: RenderOpts): string {
  const { width, height, version, skin } = o;
  const values = spec.data.map((d) => d.value);
  const max = Math.max(...values);
  // 几何取自规范 area-2(800x533)实测,按画布等比
  const left = Math.round(width * 0.1125);
  const right = width - Math.round(width * 0.044);
  const bottom = Math.round(height * 0.868);
  const top = Math.round(height * (spec.title ? 0.16 : 0.15));
  const xLabelY = Math.round(height * 0.915);

  const step = niceStep(max / 4);
  const yMax = Math.ceil(max / step) * step;
  const y = (v: number): number => bottom - (v / yMax) * (bottom - top);
  const n = spec.data.length;
  const xs = (i: number): number => (n === 1 ? (left + right) / 2 : left + ((right - left) * i) / (n - 1));
  const pts = spec.data.map((d, i) => [xs(i), y(d.value)] as [number, number]);
  const path = smoothPath(pts);

  const F = 'filter="url(#xkcd)"';
  const parts: string[] = [
    card(width, height, false),
    `<defs>` +
    `<style>@font-face{font-family:"Handlee";src:url(${HANDEE_WOFF2}) format("woff2")}</style>` +
    `<filter id="xkcd" width="100%" height="100%" x="-5%" y="-5%" filterUnits="userSpaceOnUse">` +
    `<feTurbulence baseFrequency=".05" result="noise" type="fractalNoise"/>` +
    `<feDisplacementMap in="SourceGraphic" in2="noise" scale="3" xChannelSelector="R" yChannelSelector="G"/></filter>` +
    `<linearGradient id="dg-area" x1="0" y1="0" x2="0" y2="1">` +
    `<stop offset="0%" stop-color="var(--d-s1)" stop-opacity="0.22"/>` +
    `<stop offset="100%" stop-color="var(--d-s1)" stop-opacity="0.02"/></linearGradient></defs>`,
    `<style>text{font-family:${SKETCH_FONT.replace(/"/g, '&quot;')}}</style>`,
  ];
  if (spec.title) {
    parts.push(`<text x="${width / 2}" y="${r2(Math.round(height * 0.056))}" text-anchor="middle" font-size="20" font-weight="bold" fill="var(--d-ink)" ${F}>${esc(spec.title)}</text>`);
  }
  for (let t = step; t <= yMax; t += step) {
    parts.push(`<line x1="${left}" y1="${r2(y(t))}" x2="${right}" y2="${r2(y(t))}" stroke="var(--d-grid)" stroke-width="1" ${F}/>`);
    parts.push(`<text x="${left - 8}" y="${r2(y(t) + 5)}" text-anchor="end" font-size="16" font-weight="bold" fill="var(--d-ink)">${fmtNum(t)}</text>`);
  }
  parts.push(`<text x="0" y="${r2((top + bottom) / 2)}" text-anchor="middle" font-size="17" font-weight="bold" fill="var(--d-ink)" transform="rotate(-90, 16, ${r2((top + bottom) / 2)})">${esc(spec.unit ?? '')}</text>`);
  // 黑色粗坐标轴(L 形,手绘抖动)
  parts.push(`<line x1="${left}" y1="${top - 6}" x2="${left}" y2="${bottom}" stroke="var(--d-baseline)" stroke-width="2.5" ${F}/>`);
  parts.push(`<line x1="${left}" y1="${bottom}" x2="${right}" y2="${bottom}" stroke="var(--d-baseline)" stroke-width="2.5" ${F}/>`);
  parts.push(`<path d="${path}L${r2(pts[n - 1][0])} ${r2(bottom)}L${r2(pts[0][0])} ${r2(bottom)}Z" fill="url(#dg-area)"/>`);
  parts.push(`<path d="${path}" fill="none" stroke="var(--d-s1)" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" ${F}/>`);
  const [ex, ey] = pts[n - 1];
  parts.push(`<circle cx="${r2(ex)}" cy="${r2(ey)}" r="5" fill="var(--d-s1)" stroke="var(--d-halo)" stroke-width="2" ${F}/>`);
  parts.push(`<text x="${r2(ex - 8)}" y="${r2(ey - Math.round(height * 0.0225))}" text-anchor="end" font-size="14" font-weight="bold" fill="var(--d-s1)">${fmtNum(values[n - 1])}</text>`);
  // X 刻度(抽样避免拥挤)
  const skip = Math.ceil(n / 8);
  spec.data.forEach((d, i) => {
    if (i % skip !== 0 && i !== n - 1) return;
    parts.push(`<text x="${r2(xs(i))}" y="${r2(xLabelY)}" text-anchor="middle" font-size="16" font-weight="bold" fill="var(--d-ink)">${esc(trunc(d.label, 10))}</text>`);
  });

  return svgDoc(width, height, 'area', version, spec.title ?? 'star history', spec, skin, parts.join(''));
}

// 像素 GitHub Star(area-3,900×470):100×46 格背景 + 双层发光轨迹 + 手写标注
function renderPixelArea(spec: ChartSpec, o: RenderOpts): string {
  const { width, height, version, skin } = o;
  const COLS = 100;
  const ROWS = 46;
  const dark = skin.scheme === 'dark';
  const anchors = spec.data.map((d) => d.value);
  const max = Math.max(...anchors);
  // 锚点 → 每列线性插值(规范同法)
  const cols: number[] = [];
  for (let i = 0; i < COLS; i++) {
    const p = (i / (COLS - 1)) * (anchors.length - 1);
    const a = Math.floor(p);
    const t = p - a;
    cols.push(anchors[a] + (anchors[Math.min(a + 1, anchors.length - 1)] - anchors[a]) * t);
  }

  const sx = width / 900;
  const sy = height / 470;
  const x0 = 43 * sx;
  const y0 = 66 * sy;
  const pitchX = 8.15 * sx;
  const pitchY = 7.65 * sy;
  const cell = 5.9 * Math.min(sx, sy);

  // 轨迹像素中心(列 → 行,自底向上)
  const centers: [number, number][] = [];
  for (let c = 0; c < COLS; c++) {
    const row = Math.max(0, Math.min(ROWS - 1, ROWS - 1 - Math.round((cols[c] / max) * (ROWS - 1))));
    centers.push([x0 + c * pitchX + pitchX / 2, y0 + row * pitchY + pitchY / 2]);
  }

  const parts: string[] = [
    `<defs>` +
    `<linearGradient id="pxbg" x1="0" y1="0" x2="1" y2="1">` +
    `<stop stop-color="${dark ? '#050605' : '#FFFFFF'}"/><stop offset=".58" stop-color="${dark ? '#071008' : '#FFFFFF'}"/><stop offset="1" stop-color="${dark ? '#0A1008' : '#FFFFFF'}"/></linearGradient>` +
    `<filter id="px-wide" x="-30%" y="-40%" width="160%" height="180%"><feGaussianBlur stdDeviation="9"/></filter>` +
    `<filter id="px-glow" x="-80%" y="-80%" width="260%" height="260%"><feGaussianBlur stdDeviation="2" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>` +
    `</defs>`,
    `<rect width="${r2(width)}" height="${r2(height)}" fill="url(#pxbg)"/>`,
    // 底层宽光晕
    `<polyline points="${centers.map((p) => `${r2(p[0])},${r2(p[1])}`).join(' ')}" fill="none" stroke="#64D51D" stroke-opacity="${dark ? 0.3 : 0.08}" stroke-width="20" stroke-linecap="round" stroke-linejoin="round" filter="url(#px-wide)"/>`,
  ];
  for (let c = 0; c < COLS; c++) {
    for (let rw = 0; rw < ROWS; rw++) {
      parts.push(
        `<rect x="${r2(x0 + c * pitchX + (pitchX - cell) / 2)}" y="${r2(y0 + rw * pitchY + (pitchY - cell) / 2)}" width="${r2(cell)}" height="${r2(cell)}" rx="${r2(cell * 0.042)}" fill="${dark ? '#071009' : '#FFFFFF'}" stroke="var(--d-grid)" stroke-width="0.7"/>`,
      );
    }
  }
  parts.push(`<g filter="url(#px-glow)">${cols.map((_, c) => {
    const [px, py] = centers[c];
    const s = 4.8 * Math.min(sx, sy);
    return `<rect x="${r2(px - s / 2)}" y="${r2(py - s / 2)}" width="${r2(s)}" height="${r2(s)}" rx="${r2(s * 0.083)}" fill="#8FEA2A" stroke="#B4FF43" stroke-width="0.3"/>`;
  }).join('')}</g>`);
  // 手写标题(总量)与日期刻度
  const ink = dark ? '#D8DEE9' : '#3F3F46';
  const last = spec.data[spec.data.length - 1];
  parts.push(
    `<text x="${r2(width - 44 * sx)}" y="${r2(44 * sy)}" text-anchor="end" fill="${ink}" font-family="${SKETCH_FONT}" font-size="${r2(23 * sy)}">${fmtFull(last.value)} ${esc(trunc(spec.unit ?? '', 16))}</text>`,
  );
  for (let i = 0; i <= 6; i++) {
    const frac = i / 6;
    const x = x0 + (COLS - 1) * pitchX * frac;
    const anchor = i === 0 ? 'start' : i === 6 ? 'end' : 'middle';
    parts.push(`<line x1="${r2(x)}" y1="${r2(418 * sy)}" x2="${r2(x)}" y2="${r2(424 * sy)}" stroke="${ink}" stroke-opacity="0.35"/>`);
    const label = spec.data[Math.round(frac * (spec.data.length - 1))]?.label ?? '';
    parts.push(`<text x="${r2(x)}" y="${r2(447 * sy)}" text-anchor="${anchor}" fill="${ink}" font-family="${SKETCH_FONT}" font-size="${r2(12 * sy)}">${esc(trunc(label, 12))}</text>`);
  }

  return svgDoc(width, height, 'area', version, spec.title ?? 'pixel star history', spec, skin, parts.join(''));
}

// 波点 GitHub Star(area-4,900×470):阶梯面积 + 9×9 圆点 pattern,双系列对比
function renderPolkaArea(spec: MultiSpec, o: RenderOpts): string {
  const { width, height, version, skin } = o;
  const k = spec.series.length;
  const gmax = Math.max(...spec.series.flatMap((s) => s.values));
  const step = niceStep(gmax / 3.2);
  const ticksY: number[] = [];
  for (let v = 0; v <= Math.ceil(gmax / step) * step + 1e-9; v += step) ticksY.push(v);
  const domain = Math.max(gmax * 1.1, ticksY[ticksY.length - 1]);

  const sx = width / 900;
  const sy = height / 470;
  const x0 = 48 * sx;
  const y0 = 414 * sy;
  const w = 804 * sx;
  const h = 238 * sy;
  const n = spec.labels.length;
  const px = (i: number): number => x0 + (w * i) / Math.max(n - 1, 1);
  const py = (v: number): number => y0 - (h * v) / domain;
  const stepPath = (values: number[]): string => {
    let d = `M${r2(px(0))} ${r2(py(values[0]))}`;
    for (let i = 1; i < values.length; i++) {
      d += ` H${r2(px(i))} V${r2(py(values[i]))}`;
    }
    return d;
  };

  const parts: string[] = [
    card(width, height, true),
    `<defs>${spec.series.map((_, i) =>
      `<pattern id="pk-${i}" width="9" height="9" patternUnits="userSpaceOnUse"><circle cx="2" cy="2" r="1.5" fill="${sVar(i % skin.series.length)}"/></pattern>`).join('')}</defs>`,
    `<line x1="${r2(x0)}" y1="${r2(y0)}" x2="${r2(x0 + w)}" y2="${r2(y0)}" stroke="var(--d-grid)"/>`,
  ];
  for (const t of ticksY) {
    const gy = py(t);
    parts.push(`<line x1="${r2(x0)}" y1="${r2(gy)}" x2="${r2(x0 + w)}" y2="${r2(gy)}" stroke="var(--d-grid)" stroke-dasharray="3 6"/>`);
    parts.push(`<text x="${r2(39 * sx)}" y="${r2(gy + 4)}" text-anchor="end" font-size="10" fill="var(--d-muted)" style="${TAB}">${fmtNum(t)}</text>`);
  }
  // 系列:后序先画,首个在最上(规范 a 覆盖 b)
  for (let i = k - 1; i >= 0; i--) {
    const s = spec.series[i];
    const color = sVar(i % skin.series.length);
    const sp = stepPath(s.values);
    parts.push(`<path d="${sp} V${r2(y0)} H${r2(px(0))} Z" fill="url(#pk-${i})" fill-opacity="${i === 0 ? 0.38 : 0.42}"/>`);
    parts.push(`<path d="${sp}" fill="none" stroke="${color}" stroke-width="2"/>`);
  }
  // 图例:圆圈 + 仓库名 + 大数值(两列排布)
  spec.series.forEach((s, i) => {
    const cx = x0 + 22 * sx + (i % 2) * (w * 0.502);
    const rowY = (62 + Math.floor(i / 2) * 56) * sy;
    const color = sVar(i % skin.series.length);
    parts.push(`<circle cx="${r2(cx)}" cy="${r2(rowY)}" r="7" fill="none" stroke="${color}" stroke-width="2"/>`);
    parts.push(`<text x="${r2(cx + 15)}" y="${r2(rowY + 5)}" font-size="14" fill="var(--d-muted)">${esc(trunc(s.name, 16))}</text>`);
    parts.push(`<text x="${r2(cx - 2)}" y="${r2(rowY + 40 * sy)}" font-size="${r2(31 * sy)}" font-weight="700" fill="var(--d-ink)" style="${TAB}">${fmtFull(s.values[s.values.length - 1])}</text>`);
  });
  parts.push(`<text x="${r2(x0)}" y="${r2(446 * sy)}" font-size="11" fill="var(--d-muted)">${esc(trunc(spec.labels[0], 12))}</text>`);
  parts.push(`<text x="${r2(x0 + w)}" y="${r2(446 * sy)}" text-anchor="end" font-size="11" fill="var(--d-muted)">${esc(trunc(spec.labels[n - 1], 12))}</text>`);

  return svgDoc(width, height, 'area', version, spec.title ?? 'star history', spec, skin, parts.join(''));
}

// 面积模式分发:auto=常规;pixel=单系列像素;polka=阶梯波点(单/多系列)
/**
 * Area chart — single or multi-series, dispatched by the input tag.
 */
export function renderAreaByMode(input: { multi: boolean; spec: ChartSpec | MultiSpec }, o: RenderOpts): string {
  const mode = o.skin.rules.areaMode;
  if (mode === 'pixel') {
    if (input.multi) throw new ApiError(400, 't=pixel takes a single cumulative series');
    return renderPixelArea(input.spec as ChartSpec, o);
  }
  if (mode === 'polka') {
    if (input.multi) return renderPolkaArea(input.spec as MultiSpec, o);
    const s = input.spec as ChartSpec;
    return renderPolkaArea({ title: s.title, unit: s.unit, labels: s.data.map((d) => d.label), series: [{ name: s.title ?? 'stars', values: s.data.map((d) => d.value) }] }, o);
  }
  return input.multi ? renderAreaMulti(input.spec as MultiSpec, o) : renderArea(input.spec as ChartSpec, o);
}
