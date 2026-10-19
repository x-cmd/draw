// 规范水平柱四形态(hbar-1..4):rows 逐行分类色 / cells 像素格 /
// diverging 蝴蝶图(左新建右关闭)/ lift 实色基础分+斜纹增益。
import { ApiError } from '../specs/index.js';
import type { ChartSpec, MultiSpec, ChartInput } from '../specs/index.js';
import { TAB, card } from '../theme.js';
import { esc, fmtFull, fmtNum, niceTicks, r2, sVar, textW, trunc, type RenderOpts, svgDoc } from './svg.js';
import { fitCut } from './measure.js';
import { renderHBar } from './hbar.js';

export function renderHbarByMode(input: ChartInput, o: RenderOpts): string {
  const mode = o.skin.rules.hbarMode;
  if (mode === 'diverging' || mode === 'lift') {
    const need = mode === 'diverging' ? 'opened' : 'base';
    const other = mode === 'diverging' ? 'closed' : 'lift';
    if (!input.multi || input.spec.series.length !== 2) {
      throw new ApiError(400, `this hbar style needs exactly two series, e.g. series=${need}:1,2&series=${other}:1,2`);
    }
    return mode === 'diverging' ? renderHbarDiverging(input.spec, o) : renderHbarLift(input.spec, o);
  }
  if (input.multi) throw new ApiError(400, 'multi-series hbar is only supported for t=xcmd-issue / t=rank');
  if (mode === 'cells') return renderHbarCells(input.spec, o);
  if (mode === 'rows') return renderHbarOpendata(input.spec, o);
  return renderHBar(input.spec, o);
}

// 水平柱 1 · OpenData(规范 hbar-1,960×480)
export function renderHbarOpendata(spec: ChartSpec, o: RenderOpts): string {
  const { version, skin } = o;
  let width = o.width;
  let height = o.height;
  const n = spec.data.length;
  // 整图自适应:行少(<7)时画布贴内容收缩,行距保持规范绝对值,宽度等比跟随;
  // 显式 ?w=/?h= 不收缩
  const shrunk = o.autoHeight && n < 7;
  if (shrunk) {
    height = Math.round(Math.max(200, 54 + (n - 1) * 52 + 28 + 86)); // n=7 验算:480 ✓
    if (o.autoWidth) width = Math.round(Math.max(400, o.width * (height / o.height)));
  }
  // 行距过密(>20 行)自动拉高(封顶 2.5×)
  if (o.autoHeight) {
    const nRows = spec.data.length;
    const avail = height * (0.8375 - 0.1125);
    const pitch0 = Math.min(height * 0.1083, (avail - height * 0.0583) / Math.max(nRows - 1, 1));
    if (pitch0 > 0 && pitch0 < 20) height = Math.round(height * Math.min(2.5, 20 / pitch0));
  }
  const max = Math.max(...spec.data.map((d) => d.value));

  // 行标签列 = max(规范, 实测):放不下先截短(fitCut),再右吃余量
  const plotW = width * 0.7188;
  const specEnd = width * 0.1542;
  const gapL = width * 0.175 - specEnd;
  const lblCut = fitCut(spec.data.map((d) => d.label), 16, width - plotW - width * 0.02 - gapL - 8, 14);
  const maxLbl = Math.max(...spec.data.map((d) => textW(trunc(d.label, lblCut), 14)), 0);
  const labelEnd = Math.max(specEnd, maxLbl + 8);
  const x = Math.round(labelEnd > specEnd ? labelEnd + gapL : width * 0.175);
  // shrunk 时几何取规范绝对值,网格底贴末行
  const top = shrunk ? 54 : height * 0.1125;
  const gridBottom = shrunk ? top + (n - 1) * 52 + 28 : height * 0.8375;
  const barH0 = shrunk ? 28 : height * 0.0583;
  // 行距:规范 52,行多时压缩
  const pitch = shrunk ? 52 : Math.min(height * 0.1083, (gridBottom - top - barH0) / Math.max(n - 1, 1));
  const barH = Math.min(barH0, pitch * 0.62);
  const gridTop = shrunk ? 32 : height * 0.0667;
  const tickY = shrunk ? gridBottom + 28 : height * 0.8958;
  const unitY = shrunk ? gridBottom + 60 : height * 0.9625;

  const ticks = niceTicks(max, 5);
  const yMax = ticks[ticks.length - 1];
  // 刻度文字抽稀:大数(如 1000000.0)在窄画布上相邻刻度互叠 → 按间距隔一显示
  const tickGap = plotW / Math.max(ticks.length - 1, 1);
  const tickStride = Math.max(1, Math.ceil((Math.max(...ticks.map((t) => textW(fmtNum(t), 11))) + 6) / tickGap));

  const parts: string[] = [card(width, height, true)];
  // 竖直虚线网格 + 刻度(fmtNum 缩写大数:200k 而非 200000.0)
  ticks.forEach((t, i) => {
    const gx = x + (plotW * t) / yMax;
    parts.push(`<line x1="${r2(gx)}" y1="${r2(gridTop)}" x2="${r2(gx)}" y2="${r2(gridBottom)}" stroke="var(--d-grid)" stroke-dasharray="4 6"/>`);
    if (i % tickStride === 0 || i === ticks.length - 1) {
      parts.push(`<text x="${r2(gx)}" y="${r2(tickY)}" text-anchor="middle" font-size="11" fill="var(--d-muted)" style="${TAB}">${fmtNum(t)}</text>`);
    }
  });
  // 参考线(?ref= 数值 + ?reflabel= 文案)
  if (o.refLine !== undefined && o.refLine <= yMax) {
    const rx = x + (plotW * o.refLine) / yMax;
    parts.push(`<line x1="${r2(rx)}" y1="${r2(shrunk ? 36 : height * 0.075)}" x2="${r2(rx)}" y2="${r2(gridBottom)}" stroke="var(--d-faint)" stroke-width="1.5" stroke-dasharray="5 4"/>`);
    if (o.refLabel) {
      parts.push(`<text x="${r2(rx + 7)}" y="${r2(shrunk ? 48 : height * 0.1)}" font-size="11" fill="var(--d-faint)">${esc(trunc(o.refLabel, 40))}</text>`);
    }
  }
  spec.data.forEach((d, i) => {
    const y = top + i * pitch;
    const w = (plotW * d.value) / yMax;
    parts.push(`<text x="${r2(labelEnd)}" y="${r2(y + pitch * 0.36)}" text-anchor="end" font-size="14" fill="var(--d-muted)">${esc(trunc(d.label, lblCut))}</text>`);
    parts.push(`<rect x="${x}" y="${r2(y)}" width="${r2(w)}" height="${r2(barH)}" rx="3" fill="${sVar(i % skin.series.length)}"/>`);
    // 数值内标白字;放不下则外置墨色
    const text = fmtFull(d.value);
    if (textW(text, 11) + 14 <= w) {
      parts.push(`<text x="${r2(x + w - 8)}" y="${r2(y + barH * 0.68)}" text-anchor="end" font-size="11" font-weight="700" fill="#FFFFFF" style="${TAB}">${text}</text>`);
    } else {
      parts.push(`<text x="${r2(x + w + 8)}" y="${r2(y + barH * 0.68)}" font-size="11" font-weight="700" fill="var(--d-ink)" style="${TAB}">${text}</text>`);
    }
  });
  if (spec.unit) {
    parts.push(`<text x="${r2(x + plotW * 0.5)}" y="${r2(unitY)}" text-anchor="middle" font-size="13" fill="var(--d-muted)">${esc(trunc(spec.unit, 40))}</text>`);
  }

  return svgDoc(width, height, 'hbar', version, spec.title ?? 'hbar', spec, skin, parts.join(''));
}

// 水平柱 2 · X-CMD 语言像素格(规范 hbar-2,920×300)
export function renderHbarCells(spec: ChartSpec, o: RenderOpts): string {
  const { version, skin } = o;
  let width = o.width;
  let height = o.height;
  const n = spec.data.length;
  // 整图自适应:行少时贴内容收缩(行距/格高取规范绝对值),宽度等比跟随
  const shrunk = o.autoHeight && n <= 4; // n=4 验算:86+3×48+16+54=300 ✓
  if (shrunk) {
    height = Math.round(Math.max(200, 86 + (n - 1) * 48 + 16 + 54));
    if (o.autoWidth) width = Math.round(Math.max(400, o.width * (height / o.height)));
  }
  const CELLS = 24;

  const startX = width * 0.2935;
  const valueEndX = width * 0.9196;
  const labelX = width * 0.0826;
  const span = width * 0.4891; // 24 格总宽(规范 270→720)
  const cellPitch = span / CELLS;
  const cw = cellPitch * (13 / 19);
  const cellH = shrunk ? 16 : height * 0.0533;
  const top = shrunk ? 86 : height * 0.2867;
  const pitch = shrunk ? 48 : Math.min(height * 0.16, (height * 0.9157 - cellH - top) / Math.max(n, 1));

  // 行标签在 labelX..startX 之间:放不下按预算截短(fs18),不与像素格重叠
  const lblCut = fitCut(spec.data.map((d) => d.label), 16, startX - labelX - 10, 18);
  const parts: string[] = [card(width, height, true)];
  if (spec.title) {
    parts.push(`<text x="${r2(labelX)}" y="${r2(shrunk ? 46 : height * 0.1533)}" font-size="19" font-weight="700" fill="${sVar(0)}">${esc(trunc(spec.title, 40))}</text>`);
  }
  parts.push(`<line x1="${r2(labelX)}" y1="${r2(shrunk ? 60 : height * 0.2)}" x2="${r2(valueEndX)}" y2="${r2(shrunk ? 60 : height * 0.2)}" stroke="var(--d-grid)"/>`);
  spec.data.forEach((d, i) => {
    const rowY = top + i * pitch;
    const y = rowY + height * 0.01; // 规范:格子较行基线下移 3(0.01h)
    parts.push(`<text x="${r2(labelX)}" y="${r2(rowY + height * 0.06)}" font-size="18" fill="var(--d-text)">${esc(trunc(d.label, lblCut))}</text>`);
    const exact = (d.value / 100) * CELLS; // 值为百分比
    for (let c = 0; c < CELLS; c++) {
      const cx = startX + c * cellPitch;
      parts.push(`<rect x="${r2(cx)}" y="${r2(y)}" width="${r2(cw)}" height="${r2(cellH)}" rx="1" fill="var(--d-faint)"/>`);
      const cover = Math.max(0, Math.min(1, exact - c));
      if (cover > 0) {
        parts.push(`<rect x="${r2(cx)}" y="${r2(y)}" width="${r2(cw * cover)}" height="${r2(cellH)}" rx="1" fill="${sVar(0)}"/>`);
      }
    }
    parts.push(`<text x="${r2(valueEndX)}" y="${r2(rowY + height * 0.06)}" text-anchor="end" font-size="18" font-weight="700" fill="var(--d-muted)" style="${TAB}">${Math.round(d.value * 10) / 10}%</text>`);
  });

  return svgDoc(width, height, 'hbar', version, spec.title ?? 'language share', spec, skin, parts.join(''));
}

// 水平柱 3 · X-CMD Issue 蝴蝶图(规范 hbar-3,820×370):左新建右关闭
export function renderHbarDiverging(spec: MultiSpec, o: RenderOpts): string {
  const { version, skin } = o;
  let width = o.width;
  let height = o.height;
  const nD = spec.labels.length;
  // 整图自适应:行少时贴内容收缩(规范行距 47/条高 22/底带 51),宽度等比跟随
  const shrunk = o.autoHeight && nD <= 6; // 规范行数(6)也走绝对几何:比例压缩会给 38.66≠47
  if (shrunk) {
    height = Math.round(Math.max(200, 62 + (nD - 1) * 47 + 22 + 51)); // n=6 验算:370 ✓(规范行距47/条高22)
    if (o.autoWidth) width = Math.round(Math.max(400, o.width * (height / o.height)));
  }
  const [left, right] = spec.series;
  const n = spec.labels.length;
  const max = Math.max(...left.values, ...right.values, 1);

  const center = width * 0.6159;
  const half = width * 0.2744;
  const gap = width * 0.0098;
  const top = shrunk ? 62 : height * 0.1676;
  const barH = shrunk ? 22 : Math.min(height * 0.0595, ((height * 0.8475 - top) / Math.max(n, 1)) * 0.47);
  const pitch = shrunk ? 47 : (height * 0.8475 - top - barH) / Math.max(n, 1);

  // 行名在 0.0707w..0.2707w 之间(其后是左值):放不下按预算截短(fs16)
  const lblCut = fitCut(spec.labels, 12, width * 0.2707 - width * 0.0707 - 10, 16);
  const parts: string[] = [card(width, height, true)];
  // 图例(规范:圆点 swatch,中上)
  const ly = shrunk ? 30 : height * 0.0811;
  const lx1 = width * 0.4756;
  const lx2 = width * 0.5756;
  parts.push(`<circle cx="${r2(lx1)}" cy="${r2(shrunk ? 20 : height * 0.0541)}" r="5" fill="var(--d-s1)"/>`);
  parts.push(`<text x="${r2(lx1 + 16)}" y="${r2(ly)}" font-size="12" fill="var(--d-muted)">${esc(trunc(left.name, 12))}</text>`);
  parts.push(`<circle cx="${r2(lx2)}" cy="${r2(shrunk ? 20 : height * 0.0541)}" r="5" fill="var(--d-s2)"/>`);
  parts.push(`<text x="${r2(lx2 + 16)}" y="${r2(ly)}" font-size="12" fill="var(--d-muted)">${esc(trunc(right.name, 12))}</text>`);
  spec.labels.forEach((l, i) => {
    const y = top + i * pitch;
    const lw = (half * left.values[i]) / max;
    const rw = (half * right.values[i]) / max;
    parts.push(`<text x="${r2(width * 0.0707)}" y="${r2(y + barH * 0.77)}" font-size="16" fill="var(--d-muted)">${esc(trunc(l, lblCut))}</text>`);
    parts.push(`<text x="${r2(width * 0.2707)}" y="${r2(y + barH * 0.77)}" text-anchor="end" font-size="15" font-weight="700" fill="var(--d-text)" style="${TAB}">${fmtFull(left.values[i])}</text>`);
    parts.push(`<rect x="${r2(width * 0.2878)}" y="${r2(y)}" width="${r2(half)}" height="${r2(barH)}" rx="4" fill="var(--d-faint)"/>`);
    parts.push(`<rect x="${r2(center - lw - gap)}" y="${r2(y)}" width="${r2(lw)}" height="${r2(barH)}" rx="4" fill="var(--d-s1)"/>`);
    parts.push(`<rect x="${r2(center + gap)}" y="${r2(y)}" width="${r2(half)}" height="${r2(barH)}" rx="4" fill="var(--d-faint)"/>`);
    parts.push(`<rect x="${r2(center + gap)}" y="${r2(y)}" width="${r2(rw)}" height="${r2(barH)}" rx="4" fill="var(--d-s2)"/>`);
    parts.push(`<text x="${r2(width * 0.9268)}" y="${r2(y + barH * 0.77)}" font-size="15" font-weight="700" fill="var(--d-text)" style="${TAB}">${fmtFull(right.values[i])}</text>`);
  });

  return svgDoc(width, height, 'hbar', version, spec.title ?? 'issues', spec, skin, parts.join(''));
}

// 水平柱 4 · Search Intelligence 排行(规范 hbar-4,960×560):实色基础 + 斜纹增益
export function renderHbarLift(spec: MultiSpec, o: RenderOpts): string {
  const { version, skin } = o;
  let width = o.width;
  let height = o.height;
  const [base, lift] = spec.series;
  const n = spec.labels.length;
  const max = Math.max(...base.values.map((v, i) => v + lift.values[i]));

  // 整图自适应:行少时贴内容收缩(规范行距 43/条高 22/底带 96),宽度等比跟随
  const shrunk = o.autoHeight && n <= 10; // 规范行数(10)也走绝对几何:比例压缩会给 39.8≠43
  if (shrunk) {
    height = Math.round(Math.max(200, 55 + (n - 1) * 43 + 22 + 96)); // n=10 验算:560 ✓(规范行距43/条高22)
    if (o.autoWidth) width = Math.round(Math.max(400, o.width * (height / o.height)));
  }

  const x0 = width * 0.2813;
  const maxW = width * 0.6042;
  const top = shrunk ? 55 : height * 0.0982;
  const rowEnd = top + (n - 1) * (shrunk ? 43 : 0) + (shrunk ? 22 : 0);
  const gridBottom = shrunk ? rowEnd + 10 : height * 0.8464; // 规范:网格底 474 = 末行底 464 + 10;刻度 +36、图例 +76 由既有偏移给出
  const barH = shrunk ? 22 : Math.max(10, (gridBottom - top) * 0.51 / Math.max(n, 1));
  const pitch = shrunk ? 43 : (gridBottom - top - barH) / Math.max(n, 1);

  const ticks = niceTicks(max, 4);
  const yMax = ticks[ticks.length - 1];
  const baseColor = sVar(0);

  const parts: string[] = [
    card(width, height, true),
    `<defs><pattern id="dgl-hatch" width="8" height="8" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">` +
      `<line x1="0" y1="0" x2="0" y2="8" stroke="${baseColor}" stroke-width="3"/></pattern></defs>`,
  ];
  // 刻度同 opendata:fmtNum 缩写 + 间距不足时隔一显示(网格线保留,只抽稀文字)
  const tickGap = maxW / Math.max(ticks.length - 1, 1);
  const tickStride = Math.max(1, Math.ceil((Math.max(...ticks.map((t) => textW(fmtNum(t), 11))) + 6) / tickGap));
  ticks.forEach((t, i) => {
    const gx = x0 + (maxW * t) / yMax;
    parts.push(`<line x1="${r2(gx)}" y1="${r2(shrunk ? 36 : height * 0.0643)}" x2="${r2(gx)}" y2="${r2(gridBottom)}" stroke="var(--d-grid)" stroke-dasharray="3 5"/>`);
    if (i % tickStride === 0 || i === ticks.length - 1) {
      parts.push(`<text x="${r2(gx)}" y="${r2(shrunk ? gridBottom + 26 : height * 0.8929)}" text-anchor="middle" font-size="11" fill="var(--d-muted)" style="${TAB}">${fmtNum(t)}</text>`);
    }
  });
  // 行名在 0.075w..0.2707w 之间(其后是左值):放不下按预算截短(fs14)
  const nameCut = fitCut(spec.labels, 20, width * 0.2707 - width * 0.075 - 10, 14);
  spec.labels.forEach((l, i) => {
    const y = top + i * pitch;
    const total = base.values[i] + lift.values[i];
    const bw = (maxW * base.values[i]) / yMax;
    const tw = (maxW * total) / yMax;
    parts.push(`<text x="${r2(width * 0.0292)}" y="${r2(y + barH * 0.73)}" font-size="12" fill="var(--d-muted)" style="${TAB}">${i + 1}</text>`);
    parts.push(`<rect x="${r2(width * 0.049)}" y="${r2(y + barH * 0.09)}" width="3" height="${r2(barH * 0.82)}" fill="${i === 0 ? '#E5A719' : 'var(--d-muted)'}"/>`);
    parts.push(`<text x="${r2(width * 0.075)}" y="${r2(y + barH * 0.77)}" font-size="14" fill="var(--d-text)">${esc(trunc(l, nameCut))}</text>`);
    parts.push(`<rect x="${r2(x0)}" y="${r2(y)}" width="${r2(bw)}" height="${r2(barH)}" rx="1" fill="${baseColor}"/>`);
    if (tw > bw) {
      parts.push(`<rect x="${r2(x0 + bw)}" y="${r2(y)}" width="${r2(tw - bw)}" height="${r2(barH)}" rx="1" fill="url(#dgl-hatch)" stroke="${baseColor}"/>`);
    }
    parts.push(`<text x="${r2(x0 + tw + 8)}" y="${r2(y + barH * 0.73)}" font-size="12" fill="var(--d-muted)" style="${TAB}">${fmtFull(total)}  +${fmtFull(lift.values[i])}</text>`);
  });
  // 底部图例:系列名直读
  const lgY = shrunk ? gridBottom + 66 : height * 0.9643;
  parts.push(`<rect x="${r2(x0)}" y="${r2(lgY - 10)}" width="10" height="10" rx="2" fill="${baseColor}"/>`);
  parts.push(`<text x="${r2(x0 + 16)}" y="${r2(lgY)}" font-size="11" fill="var(--d-muted)">${esc(trunc(base.name, 12))}</text>`);
  parts.push(`<rect x="${r2(x0 + width * 0.1042)}" y="${r2(lgY - 10)}" width="10" height="10" rx="2" fill="url(#dgl-hatch)" stroke="${baseColor}"/>`);
  parts.push(`<text x="${r2(x0 + width * 0.1042 + 16)}" y="${r2(lgY)}" font-size="11" fill="var(--d-muted)">${esc(trunc(lift.name, 12))}</text>`);

  return svgDoc(width, height, 'hbar', version, spec.title ?? 'ranking', spec, skin, parts.join(''));
}
