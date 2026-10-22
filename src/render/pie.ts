// 饼图/环形图:行为由皮肤规则驱动(规范 饼图 1-5、7,六种变体)。
import type { ChartSpec, Datum } from '../specs/index.js';
import { card, TAB } from '../theme.js';
import {
  esc, fmtFull, fmtNum, r2, textW, trunc,
  type RenderOpts, svgDoc, editorialTitle, titleBlock, sVar, LabelPlacer,
} from './svg.js';
import { radialFit } from './measure.js';

const MAX_SLICES = 9; // 8 个分类 + "Other"

interface Row {
  label: string;
  value: number;
  colorIdx: number; // 皮肤系列号;-1 = Other(用 faint)
  color?: string;   // 显式指定色(#rrggbb,来自 datum.color)
}

function buildRows(data: Datum[], seriesCount: number): Row[] {
  // 按数值排名分配颜色:最大占比取最深/主色(色板不足时循环)
  const rank = new Map(
    data.map((d) => d.value).sort((a, b) => b - a).map((v, i) => [v, i] as const),
  );
  const colorOf = (v: number, fallbackIdx: number): number =>
    (rank.get(v) ?? fallbackIdx) % Math.max(seriesCount, 1);

  if (data.length <= MAX_SLICES) {
    return data.map((d, i) => ({ ...d, colorIdx: colorOf(d.value, i) }));
  }
  const sorted = data.map((d, i) => ({ ...d, i })).sort((a, b) => b.value - a.value);
  const keep = new Set(sorted.slice(0, MAX_SLICES - 1).map((x) => x.i));
  const rows: Row[] = data
    .filter((_, i) => keep.has(i))
    .map((d, i) => ({ ...d, colorIdx: colorOf(d.value, i) }));
  const rest = data.filter((_, i) => !keep.has(i)).reduce((s, d) => s + d.value, 0);
  rows.push({ label: 'Other', value: rest, colorIdx: -1 });
  return rows;
}

const rowColor = (i: number): string => (i === -1 ? 'var(--d-faint)' : sVar(i));
const fillOf = (row: Row): string => row.color ?? rowColor(row.colorIdx);

// ECharts 极坐标(0=3 点钟,正角逆时针);圆角扇区恒 a0→a1 逆时针,
// 外弧两端切线 fillet(Evil 系签名),角半径受跨距/环宽约束。
export function pol(cx: number, cy: number, rad: number, a: number): [number, number] {
  return [cx + rad * Math.cos(a), cy - rad * Math.sin(a)];
}
const PT = (p: [number, number]): string => `${r2(p[0])} ${r2(p[1])}`;

function filletArc(from: [number, number], fc: [number, number], to: [number, number], c: number): string {
  const a0 = Math.atan2(from[1] - fc[1], from[0] - fc[0]);
  const a1 = Math.atan2(to[1] - fc[1], to[0] - fc[0]);
  let d = a1 - a0;
  while (d > Math.PI) d -= Math.PI * 2;
  while (d < -Math.PI) d += Math.PI * 2;
  return `A${r2(c)} ${r2(c)} 0 ${Math.abs(d) > Math.PI ? 1 : 0} ${d > 0 ? 1 : 0} ${PT(to)}`;
}

export function segPath(cx: number, cy: number, R: number, r: number, a0: number, a1: number, corner: number): string {
  let sweep = a1 - a0;
  if (sweep < 0) sweep += Math.PI * 2;
  if (sweep <= 0.0009) return '';
  const end = a0 + sweep;
  if (r < 0.5) r = 0;

  const half = sweep / 2;
  const maxCr = Math.min(
    (R - r) / 2.2,
    (r > 0 ? r : R * 0.4) * Math.tan(Math.min(half, 1.2)) * 0.85,
    R * Math.tan(Math.min(half, 1.2)) * 0.85,
  );
  const c = Math.max(0, Math.min(corner, maxCr));
  const large = sweep > Math.PI ? 1 : 0;

  if (c < 0.45) {
    if (!r) return `M${PT(pol(cx, cy, R, a0))}A${r2(R)} ${r2(R)} 0 ${large} 0 ${PT(pol(cx, cy, R, end))}L${r2(cx)} ${r2(cy)}Z`;
    return (
      `M${PT(pol(cx, cy, R, a0))}A${r2(R)} ${r2(R)} 0 ${large} 0 ${PT(pol(cx, cy, R, end))}` +
      `L${PT(pol(cx, cy, r, end))}A${r2(r)} ${r2(r)} 0 ${large} 1 ${PT(pol(cx, cy, r, a0))}Z`
    );
  }

  const ao = Math.min(Math.asin(Math.min(0.999, c / Math.max(R - c, 0.001))), half * 0.9);
  const rOJ = (R - c) * Math.cos(ao);
  const osR = pol(cx, cy, rOJ, a0);
  const osO = pol(cx, cy, R, a0 + ao);
  const osC = pol(cx, cy, R - c, a0 + ao);
  const oeO = pol(cx, cy, R, end - ao);
  const oeR = pol(cx, cy, rOJ, end);
  const oeC = pol(cx, cy, R - c, end - ao);

  if (!r) {
    return (
      `M${PT(osR)}${filletArc(osR, osC, osO, c)}A${r2(R)} ${r2(R)} 0 ${large} 0 ${PT(oeO)}` +
      `${filletArc(oeO, oeC, oeR, c)}L${r2(cx)} ${r2(cy)}Z`
    );
  }
  const ai = Math.min(Math.asin(Math.min(0.999, c / (r + c))), half * 0.9);
  const rIJ = (r + c) * Math.cos(ai);
  const ieR = pol(cx, cy, rIJ, end);
  const ieI = pol(cx, cy, r, end - ai);
  const ieC = pol(cx, cy, r + c, end - ai);
  const isI = pol(cx, cy, r, a0 + ai);
  const isR = pol(cx, cy, rIJ, a0);
  const isC = pol(cx, cy, r + c, a0 + ai);
  return (
    `M${PT(osR)}${filletArc(osR, osC, osO, c)}A${r2(R)} ${r2(R)} 0 ${large} 0 ${PT(oeO)}` +
    `${filletArc(oeO, oeC, oeR, c)}L${PT(ieR)}${filletArc(ieR, ieC, ieI, c)}` +
    `A${r2(r)} ${r2(r)} 0 ${large} 1 ${PT(isI)}${filletArc(isI, isC, isR, c)}Z`
  );
}

const HALO_ATTRS = 'paint-order="stroke" stroke="var(--d-halo)" stroke-width="3" stroke-linejoin="round"';

/**
 * Donut chart (solid pie with `o.donut = false`); label placement follows the skin.
 */
export function renderPie(spec: ChartSpec, o: RenderOpts): string {
  const { width, height, version, skin } = o;
  const rules = skin.rules;
  const total = spec.data.reduce((s, d) => s + d.value, 0);
  const rows = buildRows(spec.data, skin.series.length);
  const mode = rules.pieLabels;
  const editorial = rules.title === 'editorial' && !!spec.title;
  const plain = rules.canvas === 'plain';

  const pad = 24;

  // 点状进度环(progress):每行数据一个环
  if (mode === 'dots') return renderDots(spec, o, rows, total, plain, pad);

  // 标题区
  let headSvg = '';
  let headH = 0;
  if (editorial) {
    const t = editorialTitle(spec.title!, width, pad);
    headSvg = t.svg;
    headH = t.height + 8;
  } else if (spec.title) {
    headSvg = titleBlock(spec.title, pad);
    headH = 26;
  }

  // 图例预留区
  const legendBottom = rules.legend === 'bottom';
  const legendRight = rules.legend === 'right';
  const legendH = legendBottom ? (rules.legendCols > 1 ? Math.ceil(rows.length / rules.legendCols) * 26 + 26 : 36) : 0;
  const legendW = legendRight ? 170 : 0;

  // 环几何:规范实测 R/h 比例封顶(见 specR 表)
  const specR: Record<string, number> = { onSlice: 140.6 / 500, insideValue: 168 / 520, outside: 148 / 520, insidePct: 168 / 520, legend: 188 / 520 };
  const availW = width - pad * 2 - legendW;
  const availH = height - pad * 2 - headH - legendH;
  // outside 外标:走 radialFit 保图优先降级,穷尽则整层不标
  const outLabelW = (cut: number): number => Math.max(...rows.map((row) => textW(`${trunc(row.label, cut)} ${fmtFull(row.value)}`, 12)), 0);
  const Rfit = Math.min(availW, availH) / 2 - (mode === 'onSlice' || mode === 'outside' ? 14 : 4);
  const cx = legendRight ? pad + availW / 2 : width / 2;
  const Rbase = plain && specR[mode] ? Math.min(Rfit, specR[mode] * height) : Rfit;
  const fit = mode === 'outside'
    ? radialFit({ natural: Rbase, budget: Math.min(cx, width - cx) - pad, lead: 46, minLead: 26, labelW: outLabelW, maxCut: 12, minCut: 4, floorK: 0.55, overflow: 'drop' })
    : null;
  const outCut = fit?.cut ?? 12;
  const lead = fit?.lead ?? 46; // 肘点 22 + 横段 16 + 间距 8
  const outDrop = fit?.drop ?? false;
  const R = fit && !fit.drop ? fit.R : Rbase;
  const cy = pad + headH + availH / 2;
  const donut = o.donut !== false; // donut=0 强制实心饼
  const r = donut && rules.pieRadius > 0 ? R * rules.pieRadius : 0;

  const parts: string[] = [card(width, height, plain)];
  const gap = rules.pieSliceGap;

  // 渐变扇区 defs(revenue)
  if (rules.pieGradient) {
    const defs = rows.map((row, i) => {
      const a = row.colorIdx === -1 ? 0 : (row.colorIdx * 2) % skin.series.length;
      const b = row.colorIdx === -1 ? 0 : (row.colorIdx * 2 + 1) % skin.series.length;
      return (
        `<linearGradient id="dgs-${i}" x1="0" y1="0" x2="1" y2="1">` +
        `<stop stop-color="${sVar(a)}"/><stop offset="1" stop-color="${sVar(b)}"/></linearGradient>`
      );
    }).join('');
    parts.push(`<defs>${defs}</defs>`);
  }
  const sliceFill = (i: number): string => (rules.pieGradient && !rows[i].color ? `url(#dgs-${i})` : fillOf(rows[i]));
  // Interactive embedders: preformatted tooltip text (value + share) on each slice
  const tipAttr = (row: Row): string =>
    o.interactive
      ? ` data-tip="${esc(`${row.label} · ${fmtFull(row.value)}${spec.unit ? ' ' + spec.unit : ''} (${((row.value / total) * 100).toFixed(1)}%)`)}"`
      : '';

  // 扇区方向/起始角:规范 Evil 系 = 逆时针(ECharts 度),OpenData = 顺时针自 12 点钟
  const startRad = (rules.pieStart * Math.PI) / 180;
  const dirSign = rules.pieDir === 'ccw' ? 1 : -1;
  const draw = rules.pieOrder === 'reverse' ? [...rows].reverse() : rows;
  const midAngle = (row: Row, before: number): number =>
    startRad + dirSign * (before + row.value / total / 2) * Math.PI * 2;

  // 扇区
  if (rows.length === 1) {
    const stroke = gap > 0 ? ` stroke="var(--d-halo)" stroke-width="${gap}"` : '';
    if (r > 0) {
      parts.push(`<circle cx="${r2(cx)}" cy="${r2(cy)}" r="${r2((R + r) / 2)}" fill="none" stroke="${sliceFill(0)}" stroke-width="${r2(R - r - Math.max(gap, 0))}"${tipAttr(rows[0])}/>`);
    } else {
      parts.push(`<circle cx="${r2(cx)}" cy="${r2(cy)}" r="${r2(R)}" fill="${sliceFill(0)}"${stroke}${tipAttr(rows[0])}/>`);
    }
  } else {
    const twoPi = Math.PI * 2;
    let cum = 0;
    draw.forEach((row) => {
      const frac = row.value / total;
      // 起止角统一传 (小, 大):(大, 小) 会让 >180° 的扇区翻成小弧
      const aA = startRad + dirSign * cum * twoPi;
      const aB = startRad + dirSign * (cum + frac) * twoPi;
      const lo = Math.min(aA, aB);
      const hi = Math.max(aA, aB);
      cum += frac;
      const d = segPath(cx, cy, R, r, lo, hi, rules.pieCorner);
      if (d) {
        const fill = rules.pieGradient && !row.color ? `url(#dgs-${rows.indexOf(row)})` : fillOf(row);
        const stroke = gap > 0 ? ` stroke="var(--d-halo)" stroke-width="${gap}" stroke-linejoin="round" stroke-linecap="round"` : '';
        parts.push(`<path d="${d}" fill="${fill}"${stroke}${tipAttr(row)}/>`);
      }
    });
  }

  // 标注
  if (mode === 'onSlice') {
    // OpenData:标签圈外;相撞时引线外标(斜出+横段)
    let cum = 0;
    const placedBoxes: { x0: number; y0: number; w: number; h: number }[] = [];
    const out: string[] = [];
    const h = 13;
    // 就近找空位:先原位,再上下逐行向外;纵向钳制在画布内
    const freeY = (x0: number, w: number, want: number): number | null => {
      const clash = (y: number) =>
        placedBoxes.some((b) => x0 < b.x0 + b.w + 6 && x0 + w + 6 > b.x0 && y - h < b.y0 + b.h + 3 && y > b.y0 - 3);
      const step = h + 4;
      const yMin = pad + headH + 2;
      const yMax = height - pad - legendH - h - 2;
      for (let k = 0; k <= draw.length * 3; k++) {
        const down = want + k * step;
        const up = want - k * step;
        if (down <= yMax && !clash(down)) return down;
        if (up >= yMin && !clash(up)) return up;
      }
      return null; // 穷尽仍无空位:放弃该标签(绝不重叠优先于全可见)
    };
    for (const row of draw) {
      const frac = row.value / total;
      const a = midAngle(row, cum);
      cum += frac;
      const text = `${trunc(row.label, 12)} ${Math.round(frac * 100)}%`;
      const w = textW(text, 11.5);
      const [lx0, ly0] = pol(cx, cy, R + 10, a);
      const anchor = Math.cos(a) > 0.25 ? 'start' : Math.cos(a) < -0.25 ? 'end' : 'middle';
      const ax = anchor === 'end' ? lx0 - w : anchor === 'start' ? lx0 : lx0 - w / 2;
      const lyNat = freeY(ax, w, ly0);
      if (lyNat === null) { placedBoxes.push({ x0: ax, y0: ly0 - h, w, h }); continue; } // 放弃但占位,防后续再挤此区
      const inCanvasX = ax >= pad - 2 && ax + w <= width - pad + 2;
      if (Math.abs(lyNat - ly0) <= 6 && inCanvasX) {
        // 自然位置可用:浮标签
        placedBoxes.push({ x0: ax, y0: lyNat - h, w, h });
        out.push(
          `<text x="${r2(lx0)}" y="${r2(lyNat + 4)}" text-anchor="${anchor}" font-size="11.5" font-weight="500" fill="var(--d-ink)" ${HALO_ATTRS}>${esc(text)}</text>`,
        );
      } else {
        // 引线外标:径向外移,相撞时小幅垂直错开
        const side = Math.cos(a) >= 0 ? 1 : -1;
        const [sx, sy] = pol(cx, cy, R + 2, a);
        const [ex, ey] = pol(cx, cy, R + 24, a); // 肘点:同角度外移
        const endX = ex + side * 10; // 短横段
        const tx = endX + side * 6;
        const ax2 = side > 0 ? tx : tx - w;
        const lyNear = freeY(ax2, w, ey - h / 2); // 基线取文字盒中线,就近搜索
        if (lyNear === null || ax2 < pad - 2 || ax2 + w > width - pad + 2) { placedBoxes.push({ x0: ax2, y0: ey - h / 2 - h, w, h }); continue; } // 穷尽无空位/出画布:放弃该标签但占位
        out.push(
          `<path d="M${r2(sx)} ${r2(sy)}L${r2(ex)} ${r2(lyNear)}H${r2(endX)}" fill="none" stroke="var(--d-muted)" stroke-opacity="0.45" stroke-width="1"/>`,
        );
        out.push(
          `<text x="${r2(tx)}" y="${r2(lyNear + 4)}" text-anchor="${side > 0 ? 'start' : 'end'}" font-size="11.5" font-weight="500" fill="var(--d-ink)" ${HALO_ATTRS}>${esc(text)}</text>`,
        );
        placedBoxes.push({ x0: ax2, y0: lyNear - h, w, h });
      }
    }
    parts.push(...out);
  } else if (mode === 'insideValue' || mode === 'insidePct') {
    // 数值/占比内标:白字,全有或全无
    const labelable = draw.every((row) => row.value / total >= 0.05);
    if (labelable) {
      let cum = 0;
      for (const row of draw) {
        const frac = row.value / total;
        const a = midAngle(row, cum);
        cum += frac;
        const [tx, ty] = pol(cx, cy, (R + r) / 2, a);
        const text = mode === 'insideValue' ? fmtNum(row.value) : `${Math.round(frac * 100)}%`;
        parts.push(
          `<text x="${r2(tx)}" y="${r2(ty + 4)}" text-anchor="middle" font-size="12" font-weight="500" fill="var(--d-card)" style="${TAB}">${esc(text)}</text>`,
        );
      }
    }
  } else if (mode === 'outside') {
    // Evil 外标:引线 + 名灰值墨,全有或全无
    let cum = 0;
    const placer = new LabelPlacer();
    const out: string[] = [];
    let allPlaced = draw.every((row) => row.value / total >= 0.02);
    if (allPlaced && !outDrop) {
      const elbowR = R + (lead === 46 ? 22 : 14);
      const leadSeg = lead === 46 ? 16 : 8;
      const leadGap = lead === 46 ? 8 : 4;
      for (const row of draw) {
        const frac = row.value / total;
        const a = midAngle(row, cum);
        cum += frac;
        const [sx, sy] = pol(cx, cy, R + 2, a);
        const [elbowX, elbowY] = pol(cx, cy, elbowR, a);
        const side = Math.cos(a) >= 0 ? 1 : -1;
        const endX = elbowX + side * leadSeg;
        const anchor = side > 0 ? 'start' : 'end';
        const name = trunc(row.label, outCut);
        const valText = fmtFull(row.value);
        const w = textW(name + ' ' + valText, 12);
        const tx = endX + side * leadGap;
        const ax = side > 0 ? tx : tx - w;
        // 兜底:标签盒越出画布(含引线纵向)→ 整层不标(R 已收窄仍放不下说明画布过窄)
        if (ax < pad - 2 || ax + w > width - pad + 2 || elbowY - 6 < pad - 2 || elbowY + 6 > height - pad + 2) {
          allPlaced = false;
          break;
        }
        if (!placer.fits(ax, elbowY - 6, w, 12)) {
          allPlaced = false;
          break;
        }
        out.push(
          `<path d="M${r2(sx)} ${r2(sy)}L${r2(elbowX)} ${r2(elbowY)}H${r2(endX)}" fill="none" stroke="var(--d-muted)" stroke-opacity="0.45" stroke-width="1"/>`,
        );
        out.push(
          `<text x="${r2(tx)}" y="${r2(elbowY + 4)}" text-anchor="${anchor}" font-size="12" font-weight="500"><tspan fill="var(--d-muted)">${esc(name)} </tspan><tspan fill="var(--d-ink)" style="${TAB}">${esc(valText)}</tspan></text>`,
        );
      }
    }
    if (allPlaced) parts.push(...out);
  }

  // 虚线内圈(revenue)
  if (rules.pieDashedInner && r > 0) {
    parts.push(`<circle cx="${r2(cx)}" cy="${r2(cy)}" r="${r2(r * 0.78)}" fill="none" stroke="var(--d-border)" stroke-width="1.5" stroke-dasharray="4 5"/>`);
  }

  // 环心(total:market-mono/revenue)
  if (r > 0 && rules.pieCenter === 'total') {
    const fs = Math.min(34, Math.max(18, r * 0.42));
    parts.push(`<text x="${r2(cx)}" y="${r2(cy + fs * 0.26)}" text-anchor="middle" font-size="${r2(fs)}" font-weight="600" letter-spacing="-0.03em" fill="var(--d-ink)" style="${TAB}">${fmtFull(total)}</text>`);
    if (spec.unit) {
      parts.push(`<text x="${r2(cx)}" y="${r2(cy + fs * 0.26 + 18)}" text-anchor="middle" font-size="11" fill="var(--d-muted)">${esc(trunc(spec.unit, 18))}</text>`);
    }
  }

  // 图例
  if (legendBottom) {
    const legendTop = height - pad - legendH + 12;
    if (rules.legendCols > 1) {
      // 多列网格(market-mono):顶部细分隔线,值右对齐
      const cols = rules.legendCols;
      parts.push(`<line x1="${pad}" y1="${r2(legendTop - 12)}" x2="${width - pad}" y2="${r2(legendTop - 12)}" stroke="var(--d-border)" stroke-width="1"/>`);
      const colW = (width - pad * 2) / cols;
      rows.forEach((row, i) => {
        const x = pad + (i % cols) * colW;
        const y = legendTop + Math.floor(i / cols) * 26;
        const pct = Math.round((row.value / total) * 100);
        parts.push(`<rect x="${r2(x)}" y="${r2(y - 8)}" width="9" height="9" rx="2" fill="${fillOf(row)}"/>`);
        parts.push(`<text x="${r2(x + 15)}" y="${r2(y)}" font-size="12" font-weight="500" fill="var(--d-ink)">${esc(trunc(row.label, 14))}</text>`);
        if (rules.legendValue) {
          parts.push(
            `<text x="${r2(x + colW - 8)}" y="${r2(y)}" text-anchor="end" font-size="12" style="${TAB}">` +
            `<tspan fill="var(--d-muted)">${fmtFull(row.value)}</tspan>` +
            `<tspan fill="var(--d-faint)"> (${pct}%)</tspan></text>`,
          );
        }
      });
    } else {
      // 单行横排(evil):居中,放不下换到第二行
      const items = rows.map((row) => {
        const name = trunc(row.label, 14);
        return { row, name, w: 15 + textW(name, 12) + 24 };
      });
      const total = items.reduce((s, it) => s + it.w, 0);
      let x = pad + Math.max(0, (width - pad * 2 - total) / 2);
      let y = legendTop;
      for (const it of items) {
        if (x + it.w > width - pad && x > pad) {
          x = pad;
          y += 24;
        }
        parts.push(`<rect x="${r2(x)}" y="${r2(y - 8)}" width="9" height="9" rx="2" fill="${fillOf(it.row)}"/>`);
        parts.push(`<text x="${r2(x + 15)}" y="${r2(y)}" font-size="12" font-weight="500" fill="var(--d-muted)">${esc(it.name)}</text>`);
        x += it.w;
      }
    }
  } else if (legendRight) {
    const lx = cx + R + 28;
    const legendTop = pad + headH + 16;
    const legendAvail = height - pad - 8 - legendTop;
    const rowStep = rows.length > 1 ? Math.min(28, legendAvail / (rows.length - 1)) : 28;
    const firstY = legendTop + (legendAvail - rowStep * (rows.length - 1)) / 2;
    rows.forEach((row, i) => {
      const y = firstY + i * rowStep;
      parts.push(`<rect x="${r2(lx)}" y="${r2(y - 8)}" width="10" height="10" rx="2" fill="${fillOf(row)}"/>`);
      parts.push(`<text x="${r2(lx + 16)}" y="${r2(y)}" font-size="12" font-weight="500" fill="var(--d-muted)">${esc(trunc(row.label, 14))}</text>`);
      if (rules.legendValue) {
        parts.push(`<text x="${r2(width - pad)}" y="${r2(y)}" text-anchor="end" font-size="12" font-weight="500" fill="var(--d-ink)" style="${TAB}">${fmtFull(row.value)}</text>`);
      }
    });
  }

  return svgDoc(width, height, 'pie', version, spec.title ?? 'pie chart', spec, skin, headSvg + parts.join(''));
}

// 点状进度环(饼图 5 · progress):每行数据一个环,点阵表示占比,环心大百分比+说明
function renderDots(spec: ChartSpec, o: RenderOpts, rows: Row[], total: number, plain: boolean, pad: number): string {
  const { width, height, version, skin } = o;
  const n = rows.length;
  const parts: string[] = [card(width, height, plain)];

  // 标题:kicker(unit 大写)+ 18px 标题;右侧总数备注
  let headH = 0;
  if (spec.title) {
    if (spec.unit) {
      parts.push(`<text x="${pad}" y="${pad + 10}" font-size="10" letter-spacing="0.08em" fill="var(--d-muted)" style="text-transform:uppercase">${esc(spec.unit.toUpperCase())}</text>`);
      parts.push(`<text x="${pad}" y="${pad + 32}" font-size="18" font-weight="500" letter-spacing="-0.02em" fill="var(--d-ink)">${esc(spec.title)}</text>`);
      parts.push(`<text x="${width - pad}" y="${pad + 10}" text-anchor="end" font-size="12" fill="var(--d-muted)" style="${TAB}">${fmtFull(total)} ${esc(spec.unit)}</text>`);
      headH = 48;
    } else {
      parts.push(titleBlock(spec.title, pad));
      headH = 30;
    }
  }

  // 环阵:横向排布;点阵环带 0.885R,点径 0.035R,中心盘 0.782R(规范 pie-5 比例)
  const cellW = (width - pad * 2) / n;
  const cellH = height - pad - headH - 8;
  const R = Math.min(cellW, cellH) / 2 - 18;
  const dotR = Math.max(2.2, R * 0.035);
  const ringR = R * 0.885;
  const discR = R * 0.782;
  const DOTS = 40; // 圆周点数(规范:40)

  rows.forEach((row, i) => {
    const frac = row.value / total;
    const cx = pad + cellW * i + cellW / 2;
    const cy = headH + 8 + cellH / 2;
    const lit = Math.round(frac * DOTS);
    for (let d = 0; d < DOTS; d++) {
      const a = Math.PI / 2 + ((d + 0.25) / DOTS) * Math.PI * 2; // 自 12 点钟逆时针点亮
      const [dx, dy] = pol(cx, cy, ringR, a);
      parts.push(
        `<circle cx="${r2(dx)}" cy="${r2(dy)}" r="${r2(dotR)}" fill="${d < lit ? 'var(--d-s1)' : 'var(--d-faint)'}"/>`,
      );
    }
    parts.push(`<circle cx="${r2(cx)}" cy="${r2(cy)}" r="${r2(discR)}" fill="var(--d-grid)"/>`);
    const fs = Math.min(44, Math.max(20, R * 0.3));
    parts.push(`<text x="${r2(cx)}" y="${r2(cy - 4)}" text-anchor="middle" font-size="${r2(fs)}" font-weight="600" letter-spacing="-0.03em" fill="var(--d-ink)" style="${TAB}">${Math.round(frac * 100)}%</text>`);
    // 说明:按词拆至多两行,放不下省略号
    const maxW = discR * 1.72;
    const capAtoms = row.label.match(/[A-Za-z0-9'’\-]+\s*|[^\s]/g) ?? [...row.label];
    const capLines: string[] = [];
    let capCur = '';
    let capTrunc = false;
    for (const atom of capAtoms) {
      if (textW(capCur + atom, 12) <= maxW) {
        capCur += atom;
        continue;
      }
      if (capCur.trim()) capLines.push(capCur.trimEnd());
      capCur = atom.trimStart();
      if (capLines.length === 2) {
        capTrunc = true;
        capCur = '';
        break;
      }
    }
    if (capCur.trim() && capLines.length < 2) capLines.push(capCur.trimEnd());
    if (capTrunc && capLines.length) {
      let last = capLines[capLines.length - 1];
      while (last.length > 1 && textW(last + '…', 12) > maxW) last = last.slice(0, -1);
      capLines[capLines.length - 1] = last + '…';
    }
    capLines.forEach((l, li) => {
      parts.push(`<text x="${r2(cx)}" y="${r2(cy + 16 + li * 16)}" text-anchor="middle" font-size="12" fill="var(--d-muted)">${esc(l)}</text>`);
    });
  });

  return svgDoc(width, height, 'pie', version, spec.title ?? 'progress rings', spec, skin, parts.join(''));
}
