// 雷达图:蛛网环 + 轴线 + 主题色半透明填充多边形 + 顶点圆点 + 维度标签。
// 规范款:radar-1 evil(多系列,轴端内嵌数值)、radar-2 xcmd(手绘五维,方形顶点)。
import type { ChartSpec, ChartInput, MultiSpec } from '../specs/index.js';
import { ApiError } from '../specs/index.js';
import { card, TAB } from '../theme.js';
import { esc, fmtFull, fmtNum, r2, textW, trunc, sVar, type RenderOpts, svgDoc, titleBlock } from './svg.js';
import { radialFit } from './measure.js';

const HAND_FONT = "Handlee,'Comic Sans MS','Chalkboard SE','Comic Neue','Segoe Print',cursive";

/**
 * Radar chart — single or multi-series, dispatched by the input tag.
 */
export function renderRadarByMode(input: ChartInput, o: RenderOpts): string {
  const mode = o.skin.rules.radarMode;
  if (mode === 'evil') {
    const spec = input.multi ? input.spec : singleToMulti(input.spec);
    return renderRadarEvil(spec, o);
  }
  if (input.multi) throw new ApiError(400, 'multi-series radar is only supported for t=evil');
  if (mode === 'xcmd') return renderRadarXcmd(input.spec, o);
  return renderRadar(input.spec, o);
}

function singleToMulti(spec: ChartSpec): MultiSpec {
  return { title: spec.title, unit: spec.unit, labels: spec.data.map((d) => d.label), series: [{ name: spec.title ?? 'value', values: spec.data.map((d) => d.value) }] };
}

export function assertDims(n: number): void {
  if (n < 3) throw new ApiError(400, `radar needs at least 3 dimensions, got ${n}`);
  if (n > 12) throw new ApiError(400, `radar supports at most 12 dimensions, got ${n}`);
}

export function renderRadar(spec: ChartSpec, o: RenderOpts): string {
  if (spec.data.length < 3) {
    throw new ApiError(400, `radar needs at least 3 dimensions, got ${spec.data.length}`);
  }
  const { width, height, version, skin } = o;
  const values = spec.data.map((d) => d.value);
  const max = Math.max(...values);
  const n = values.length;

  const pad = 24;
  const contentTop = pad + (spec.title ? 32 : 0);
  const cx = width / 2;
  const cy = contentTop + (height - contentTop - pad) / 2;
  // 维度标签在 R+18 处:长标签/窄画布下 R 收敛(0.75×标签宽:侧锚全宽、中锚半宽的折中)
  const maxLblW = Math.max(...spec.data.map((d) => textW(trunc(d.label, 10), 12)));
  const R = Math.min((height - contentTop - pad) / 2 - 14, width / 2 - pad - 12 - maxLblW * 0.75);

  const angle = (i: number): number => -Math.PI / 2 + (i * 2 * Math.PI) / n;
  const pt = (i: number, rad: number): [number, number] => [cx + rad * Math.cos(angle(i)), cy + rad * Math.sin(angle(i))];
  const poly = (rad: number): string =>
    Array.from({ length: n }, (_, i) => pt(i, rad).map(r2).join(' ')).join('L');

  const parts: string[] = [card(width, height)];

  // 蛛网环(3 层)
  for (const f of [1 / 3, 2 / 3, 1]) {
    parts.push(`<path d="M${poly(R * f)}Z" fill="none" stroke="var(--d-grid)" stroke-width="1"/>`);
  }
  // 轴线
  for (let i = 0; i < n; i++) {
    const [ax, ay] = pt(i, R);
    parts.push(`<line x1="${r2(cx)}" y1="${r2(cy)}" x2="${r2(ax)}" y2="${r2(ay)}" stroke="var(--d-grid)" stroke-width="1"/>`);
  }
  // 数据多边形
  const dataPoly = spec.data
    .map((d, i) => pt(i, (d.value / max) * R).map(r2).join(' '))
    .join('L');
  parts.push(`<path d="M${dataPoly}Z" fill="var(--d-s1)" fill-opacity="0.18" stroke="var(--d-s1)" stroke-width="2" stroke-linejoin="round"/>`);
  // 顶点圆点(interactive:外加透明命中圈,小点也可 hover)
  const unit = spec.unit ? ` ${spec.unit}` : '';
  spec.data.forEach((d, i) => {
    const [px, py] = pt(i, (d.value / max) * R);
    parts.push(`<circle cx="${r2(px)}" cy="${r2(py)}" r="3" fill="var(--d-s1)" stroke="var(--d-card)" stroke-width="2"/>`);
    if (o.interactive) {
      const tip = ` data-tip="${esc(`${d.label} · ${fmtFull(d.value)}${unit}`)}"`;
      parts.push(`<circle cx="${r2(px)}" cy="${r2(py)}" r="11" fill="none" pointer-events="all"${tip}/>`);
    }
  });
  // 维度标签
  spec.data.forEach((d, i) => {
    const a = angle(i);
    const lx = cx + (R + 18) * Math.cos(a);
    const ly = cy + (R + 18) * Math.sin(a);
    const anchor = Math.abs(Math.cos(a)) < 0.3 ? 'middle' : Math.cos(a) > 0 ? 'start' : 'end';
    const dy = Math.sin(a) > 0.3 ? 12 : Math.sin(a) < -0.3 ? 0 : 4;
    parts.push(`<text x="${r2(lx)}" y="${r2(ly + dy)}" text-anchor="${anchor}" font-size="12" fill="var(--d-muted)">${esc(trunc(d.label, 10))}</text>`);
  });

  return svgDoc(width, height, 'radar', version, spec.title ?? 'radar chart', spec, skin, titleBlock(spec.title) + parts.join(''));
}

// 雷达图 1 · Evil 双系列(规范 radar-1,900×540):
// 4 圈虚线环(25/50/75/100%)+ 空心点 + 轴端标签内嵌各系列数值 + 底部方块图例
function renderRadarEvil(spec: MultiSpec, o: RenderOpts): string {
  const { width, height, version, skin } = o;
  const n = spec.labels.length;
  assertDims(n);
  const colors = spec.series.map((_, i) => sVar(i % skin.series.length));
  const scaleMax = Math.max(o.skin.rules.radarMax, ...spec.series.flatMap((s) => s.values));

  // 几何(规范 900×540 实测):心 (450,258)、半径 166。
  // 轴端标签在 R+58 处,预算走 radialFit(保图优先):放不下先撤内嵌数值、
  // 再截短名、再压"标签与图的间距"(58→≥18),R 下限 0.45×,标签绝不溢出画布
  const cx = width / 2;
  const cy = height * 0.478;
  const PAD = 16;
  const axisW = (nameCut: number, withVals: boolean): number =>
    Math.max(...spec.labels.map((l, i) =>
      textW(trunc(l, nameCut), 16)
      + (withVals ? spec.series.reduce((s, ser) => s + textW(fmtNum(ser.values[i]) + ' / ', 13), 0) : 0)));
  const sideRoom = Math.min(cx, width - cx) - PAD;
  const hR = height * 0.3074;
  const natural = Math.min(hR, cy - PAD - 74, height * 0.93 - 70 - cy);
  // 数值列先于截名撤(规范 14 字全宽放不下 → 撤数值);预判用 natural(含纵向约束)
  const withVals = !(58 + axisW(14, true) > sideRoom - natural * 0.45);
  const fit = radialFit({
    natural,
    budget: sideRoom,
    lead: 58,
    minLead: 18,
    labelW: (c) => axisW(c, withVals),
    maxCut: 14,
    minCut: 2,
    cutStep: 4,
    floorK: 0.45,
    floorAbs: 30,
    order: 'cut-first',
    overflow: 'floor',
  });
  const nameCut = fit.cut;
  const gap = fit.lead;
  const R = fit.R;
  const angle = (i: number): number => -Math.PI / 2 + (i * 2 * Math.PI) / n;
  const pt = (i: number, rad: number): [number, number] => [cx + rad * Math.cos(angle(i)), cy + rad * Math.sin(angle(i))];
  const ring = (f: number): string =>
    `M${Array.from({ length: n }, (_, i) => pt(i, R * f).map(r2).join(' ')).join('L')}Z`;

  const parts: string[] = [card(width, height, true)];
  // 网格环:4 圈虚线
  for (const f of [0.25, 0.5, 0.75, 1]) {
    parts.push(`<path d="${ring(f)}" fill="none" stroke="var(--d-grid)" stroke-width="1.3" stroke-dasharray="5 6"/>`);
  }
  // 轴线
  for (let i = 0; i < n; i++) {
    const [ax, ay] = pt(i, R);
    parts.push(`<line x1="${r2(cx)}" y1="${r2(cy)}" x2="${r2(ax)}" y2="${r2(ay)}" stroke="var(--d-baseline)" stroke-width="1"/>`);
  }
  // 数据多边形 + 空心点(底色填充+系列色描边)
  const allPts = spec.series.map((s) => s.values.map((v, i) => pt(i, (v / scaleMax) * R)));
  allPts.forEach((pts, si) => {
    parts.push(`<path d="M${pts.map((p) => p.map(r2).join(' ')).join('L')}Z" fill="${colors[si]}" fill-opacity="${r2(0.12 + si * 0.02)}" stroke="${colors[si]}" stroke-width="2" stroke-linejoin="round"/>`);
  });
  allPts.forEach((pts, si) => {
    pts.forEach(([px, py], i) => {
      parts.push(`<circle cx="${r2(px)}" cy="${r2(py)}" r="5" fill="var(--d-card)" stroke="${colors[si]}" stroke-width="2"/>`);
      if (o.interactive) {
        const tip = ` data-tip="${esc(`${spec.labels[i]} · ${spec.series[si].name}: ${fmtFull(spec.series[si].values[i])}${spec.unit ? ` ${spec.unit}` : ''}`)}" data-series="${si}"`;
        parts.push(`<circle cx="${r2(px)}" cy="${r2(py)}" r="11" fill="none" pointer-events="all"${tip}/>`);
      }
    });
  });
  // 轴端标签:维度名 + 各系列数值内嵌(系列色,13px 粗体)
  spec.labels.forEach((l, i) => {
    const a = angle(i);
    const lx = cx + (R + gap) * Math.cos(a);
    const ly = cy + (R + gap) * Math.sin(a);
    const anchor = Math.abs(Math.cos(a)) < 0.3 ? 'middle' : Math.cos(a) > 0 ? 'start' : 'end';
    const dy = Math.sin(a) > 0.3 ? 12 : Math.sin(a) < -0.3 ? 0 : 5;
    const vals = withVals
      ? spec.series
        .map((s, si) => `<tspan fill="${colors[si]}" font-size="13" font-weight="700" style="${TAB}">${fmtNum(s.values[i])}</tspan>`)
        .join('<tspan fill="var(--d-muted)" font-size="13"> / </tspan>')
      : '';
    parts.push(
      `<text x="${r2(lx)}" y="${r2(ly + dy)}" text-anchor="${anchor}" font-size="16" fill="var(--d-text)">${esc(trunc(l, nameCut))} ${vals}</text>`,
    );
  });
  // 底部居中图例(方块 10×10 rx3)
  const items = spec.series.map((s, i) => ({ name: trunc(s.name, 14), color: colors[i] }));
  const rowW = items.reduce((s, it) => s + 15 + textW(it.name, 12) + 28, -28);
  let lx2 = cx - rowW / 2;
  const legendY = height * 0.959;
  for (const it of items) {
    parts.push(`<rect x="${r2(lx2)}" y="${r2(legendY - 10)}" width="10" height="10" rx="3" fill="${it.color}"/>`);
    parts.push(`<text x="${r2(lx2 + 16)}" y="${r2(legendY)}" font-size="12" fill="var(--d-muted)">${esc(it.name)}</text>`);
    lx2 += 15 + textW(it.name, 12) + 28;
  }

  return svgDoc(width, height, 'radar', version, spec.title ?? 'radar', spec, skin, parts.join(''));
}

// 雷达图 2 · X-CMD 手绘五维(规范 radar-2,900×490):
// 外环实线+内两圈虚线、方形顶点标记、Handlee 手写维度标签
function renderRadarXcmd(spec: ChartSpec, o: RenderOpts): string {
  const { width, height, version, skin } = o;
  const n = spec.data.length;
  assertDims(n);
  const scaleMax = Math.max(skin.rules.radarMax, ...spec.data.map((d) => d.value));

  // 几何(规范 900×490 实测):心 (450,245)、半径 102.5。
  // 手写标签在 R+52 处:同 evil 款走 radialFit 保图优先降级
  const cx = width / 2;
  const cy = height / 2;
  const hR = height * 0.2092;
  const sideRoom = Math.min(cx, width - cx) - 24;
  const fit = radialFit({
    natural: Math.min(hR, height / 2 - 24 - 66),
    budget: sideRoom,
    lead: 52,
    minLead: 16,
    labelW: (c) => Math.max(...spec.data.map((d) => textW(trunc(d.label, c), 18))),
    maxCut: 10,
    minCut: 2,
    floorK: 0.45,
    floorAbs: 24,
    order: 'cut-first',
    overflow: 'floor',
  });
  const cut = fit.cut;
  const gap = fit.lead;
  const R = fit.R;
  const angle = (i: number): number => -Math.PI / 2 + (i * 2 * Math.PI) / n;
  const pt = (i: number, rad: number): [number, number] => [cx + rad * Math.cos(angle(i)), cy + rad * Math.sin(angle(i))];
  const ring = (f: number): string =>
    `M${Array.from({ length: n }, (_, i) => pt(i, R * f).map(r2).join(' ')).join('L')}Z`;

  const parts: string[] = [card(width, height, true)];
  // 网格:外环实线,内两圈虚线(1/3、2/3)
  parts.push(`<path d="${ring(1)}" fill="none" stroke="var(--d-grid)" stroke-width="2"/>`);
  for (const f of [1 / 3, 2 / 3]) {
    parts.push(`<path d="${ring(f)}" fill="none" stroke="var(--d-grid)" stroke-width="1.2" stroke-dasharray="5 5"/>`);
  }
  for (let i = 0; i < n; i++) {
    const [ax, ay] = pt(i, R);
    parts.push(`<line x1="${r2(cx)}" y1="${r2(cy)}" x2="${r2(ax)}" y2="${r2(ay)}" stroke="var(--d-baseline)" stroke-width="1"/>`);
  }
  // 数据多边形 + 方形顶点标记(6×6 rx1)
  const pts = spec.data.map((d, i) => pt(i, (d.value / scaleMax) * R));
  parts.push(`<path d="M${pts.map((p) => p.map(r2).join(' ')).join('L')}Z" fill="var(--d-s1)" fill-opacity="0.16" stroke="var(--d-s1)" stroke-width="2.25" stroke-linejoin="round"/>`);
  pts.forEach(([px, py], i) => {
    parts.push(`<rect x="${r2(px - 3)}" y="${r2(py - 3)}" width="6" height="6" rx="1" fill="var(--d-s1)"/>`);
    if (o.interactive) {
      const d = spec.data[i];
      const tip = ` data-tip="${esc(`${d.label} · ${fmtFull(d.value)}${spec.unit ? ` ${spec.unit}` : ''}`)}"`;
      parts.push(`<circle cx="${r2(px)}" cy="${r2(py)}" r="11" fill="none" pointer-events="all"${tip}/>`);
    }
  });
  // 手写维度标签(Handlee,18px)
  spec.data.forEach((d, i) => {
    const a = angle(i);
    const lx = cx + (R + gap) * Math.cos(a);
    const ly = cy + (R + gap) * Math.sin(a);
    const anchor = Math.abs(Math.cos(a)) < 0.3 ? 'middle' : Math.cos(a) > 0 ? 'start' : 'end';
    const dy = Math.sin(a) > 0.3 ? 14 : Math.sin(a) < -0.3 ? 0 : 6;
    parts.push(
      `<text x="${r2(lx)}" y="${r2(ly + dy)}" text-anchor="${anchor}" font-family="${HAND_FONT}" font-size="18" fill="var(--d-muted)">${esc(trunc(d.label, cut))}</text>`,
    );
  });

  return svgDoc(width, height, 'radar', version, spec.title ?? 'radar', spec, skin, parts.join(''));
}
