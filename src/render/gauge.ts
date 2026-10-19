
// 底部居中图例行:单行放不下自动换行(每行独立居中),窄画布多环不溢出
function pushLegendRow<T extends { name: string }>(
  parts: string[],
  items: T[],
  cx: number,
  ly0: number,
  width: number,
  advance: (it: T) => number,
  render: (lx: number, ly: number, it: T) => void,
): void {
  const avail = width - 24;
  const rows: T[][] = [[]];
  let acc = -26;
  for (const it of items) {
    const adv = advance(it);
    if (acc + adv > avail && rows[rows.length - 1].length > 0) {
      rows.push([]);
      acc = -26;
    }
    rows[rows.length - 1].push(it);
    acc += adv;
  }
  rows.forEach((row, ri) => {
    const rowW = row.reduce((sm, it) => sm + advance(it), -26);
    let lx = cx - rowW / 2;
    const ly = ly0 + ri * 18;
    for (const it of row) {
      render(lx, ly, it);
      lx += advance(it);
    }
  });
}

// 仪表盘:规范 gauge-1 半圆多环(默认)/ gauge-2 渐变整圆多环 / reliability 分区环。
import { ApiError, type GaugeSpec } from '../specs/index.js';
import { TAB, card } from '../theme.js';
import { esc, fmtFull, fmtNum, r2, textW, trunc, type RenderOpts, svgDoc, titleBlock, sVar } from './svg.js';
import { segPath, pol } from './pie.js';
import { C_gaugeGradient } from '../styles/common.js';

export function renderGauge(spec: GaugeSpec, o: RenderOpts): string {
  const { width, height, version, skin } = o;
  if (skin.rules.gauge === 'zones') return renderZoneGauge(spec, o);
  if (skin.rules.gauge === 'rings') return renderGaugeRings(spec, o);
  return renderGaugeSemi(spec, o);
}

// 环数据:data 多行,或单值 value/max 折算为一环
function gaugeRows(spec: GaugeSpec): { label?: string; pct: number }[] {
  if (spec.data?.length) return spec.data.map((d) => ({ label: d.label, pct: Math.max(0, Math.min(100, d.value)) }));
  const pct = spec.max > 0 && spec.value !== undefined ? (spec.value / spec.max) * 100 : 0;
  return [{ label: undefined, pct: Math.max(0, Math.min(100, pct)) }];
}

// 仪表盘 1 · 半圆多环(规范 gauge-1,860×480):
// 同心半圆弧(自左向右扫过上半圆),每行数据一环,轨道浅色+值弧系列色,底部图例
function renderGaugeSemi(spec: GaugeSpec, o: RenderOpts): string {
  const { width, height, version, skin } = o;
  const rows = gaugeRows(spec);
  const n = rows.length;

  // 几何(规范 860×480 实测):心 (430,340),首环 r=92,环距 34,弧宽 20。
  // 半圆弧横向至 cx±r、纵向至 cy-r:画布窄/环多时按比例整体收缩,最外环不出画布
  const cx = width / 2;
  const cy = height * 0.7083;
  let sw = height * 0.0417;
  let r0 = height * 0.1917;
  let pitch = height * 0.0708;
  const rOut = r0 + (n - 1) * pitch + sw / 2;
  const rLim = Math.min(cx, cy) - 8;
  if (rOut > rLim) {
    const k = rLim / rOut;
    sw *= k;
    r0 *= k;
    pitch *= k;
  }
  const arc = (r: number, frac: number): string => {
    const a0 = Math.PI;
    const a1 = Math.PI + Math.PI * frac;
    const [x0, y0] = pol(cx, cy, r, -a0);
    const [x1, y1] = pol(cx, cy, r, -a1);
    // 半圆系的弧最多 180°,large 恒 0(>180° 才为 1,否则值弧会绕到底部走长弧)
    return `M${r2(x0)} ${r2(y0)}A${r2(r)} ${r2(r)} 0 0 1 ${r2(x1)} ${r2(y1)}`;
  };

  const parts: string[] = [card(width, height, true)];
  rows.forEach((row, i) => {
    const r = r0 + i * pitch;
    parts.push(`<path d="${arc(r, 1)}" fill="none" stroke="var(--d-faint)" stroke-width="${r2(sw)}" stroke-linecap="round"/>`);
    if (row.pct > 0.5) {
      parts.push(`<path d="${arc(r, Math.min(row.pct, 100) / 100)}" fill="none" stroke="${sVar(i % skin.series.length)}" stroke-width="${r2(sw)}" stroke-linecap="round"/>`);
    }
  });
  // 底部图例(多环才显示):方块 + "标签 值%"
  if (spec.data?.length) {
    const items = spec.data.map((d, i) => ({ name: `${trunc(d.label, 12)} ${Math.round(d.value)}%`, color: sVar(i % skin.series.length) }));
    pushLegendRow(parts, items, cx, height * 0.9375, width,
      (it) => 15 + textW(it.name, 12) + 26,
      (lx, ly, it) => {
        parts.push(`<rect x="${r2(lx)}" y="${r2(ly - 10)}" width="10" height="10" rx="3" fill="${it.color}"/>`);
        parts.push(`<text x="${r2(lx + 16)}" y="${r2(ly)}" font-size="12" fill="var(--d-muted)">${esc(it.name)}</text>`);
      });
  }

  return svgDoc(width, height, 'gauge', version, spec.title ?? 'gauge', spec, skin, titleBlock(spec.title) + parts.join(''));
}

// 仪表盘 2 · 渐变多环(规范 gauge-2,860×480):
// 整圆环 pathLength=100 按百分比点亮,环环双色渐变,自顶顺时针
const RING_GRADS: string[][] = [
  ['mint', 'green'],
  ['yellow', 'orange'],
  ['cyan', 'indigo'],
  ['violet', 'pink'],
  ['peach', 'lemon', 'sky'],
];

function renderGaugeRings(spec: GaugeSpec, o: RenderOpts): string {
  const { width, height, version, skin } = o;
  const rows = gaugeRows(spec);
  const n = rows.length;
  const G = C_gaugeGradient;

  // 几何(规范 860×480 实测):心 (420,245),首环 r=154,环距 27(向内),弧宽 18。
  // 整圆环:最外不出画布(四向),环多时收环距保最内环半径为正
  const cx = width * 0.4884;
  const cy = height * 0.5104;
  let sw = height * 0.0375;
  let r0 = height * 0.3208;
  let pitch = height * 0.0563;
  const rOut = r0 + sw / 2;
  const rLim = Math.min(cx, width - cx, cy, height - cy) - 8;
  if (rOut > rLim) {
    const k = rLim / rOut;
    sw *= k;
    r0 *= k;
    pitch *= k;
  }
  if (n > 1) pitch = Math.min(pitch, (r0 - sw - 10) / (n - 1));

  const gradIds = rows.map((_, i) => {
    const names = RING_GRADS[i % RING_GRADS.length];
    const stops = names.map((nm) => G[nm]).filter(Boolean);
    const pair = stops.length >= 2 ? stops : [sVar(i % skin.series.length), sVar((i + 1) % skin.series.length)];
    return pair;
  });

  const parts: string[] = [
    card(width, height, true),
    `<defs>${gradIds.map((pair, i) =>
      `<linearGradient id="dgg-${i}" x1="0" x2="1">${pair.map((c, j) => `<stop offset="${r2(j / (pair.length - 1))}" stop-color="${c}"/>`).join('')}</linearGradient>`).join('')}</defs>`,
  ];
  rows.forEach((row, i) => {
    const r = r0 - i * pitch;
    parts.push(`<circle cx="${r2(cx)}" cy="${r2(cy)}" r="${r2(r)}" fill="none" stroke="var(--d-faint)" stroke-width="${r2(sw)}"/>`);
    if (row.pct > 0.5) {
      parts.push(
        `<circle cx="${r2(cx)}" cy="${r2(cy)}" r="${r2(r)}" pathLength="100" fill="none" stroke="url(#dgg-${i})" stroke-width="${r2(sw)}" stroke-linecap="round" stroke-dasharray="${r2(Math.min(row.pct, 100))} 100" transform="rotate(-90 ${r2(cx)} ${r2(cy)})"/>`,
      );
    }
  });
  if (spec.data?.length) {
    const items = spec.data.map((d, i) => ({ name: `${trunc(d.label, 12)} ${Math.round(d.value)}%`, grad: i }));
    pushLegendRow(parts, items, width / 2, height * 0.9438, width,
      (it) => 17 + textW(it.name, 12) + 26,
      (lx, ly, it) => {
        parts.push(`<rect x="${r2(lx)}" y="${r2(ly - 10)}" width="12" height="10" rx="3" fill="url(#dgg-${it.grad})"/>`);
        parts.push(`<text x="${r2(lx + 18)}" y="${r2(ly)}" font-size="12" fill="var(--d-muted)">${esc(it.name)}</text>`);
      });
  }

  return svgDoc(width, height, 'gauge', version, spec.title ?? 'gauge', spec, skin, titleBlock(spec.title) + parts.join(''));
}

// 分区仪表盘(reliability,规范 饼图 6):四分区圆环 + 中心分值 + 底部区刻度条
const ZONES: readonly { upto: number; name: string; seriesIdx: number }[] = [
  { upto: 0.45, name: 'Critical', seriesIdx: 0 },
  { upto: 0.65, name: 'At risk', seriesIdx: 1 },
  { upto: 0.82, name: 'Good', seriesIdx: 2 },
  { upto: 1, name: 'Excellent', seriesIdx: 3 },
];

function renderZoneGauge(spec: GaugeSpec, o: RenderOpts): string {
  const { width, height, version, skin } = o;
  const plain = skin.rules.canvas === 'plain';
  if (spec.data?.length) throw new ApiError(400, 't=reliability takes value=&max= (single score), not labels/values');
  const value = spec.value ?? 0;
  const frac = spec.max > 0 ? Math.min(1, value / spec.max) : 0;
  const zone = [...ZONES].reverse().find((z) => frac <= z.upto) ?? ZONES[3];

  const pad = 24;
  let headSvg = '';
  let headH = 0;
  if (spec.title) {
    headSvg = titleBlock(spec.title, pad);
    headH = 26;
  }
  const barH = 44;
  const cx = width / 2;
  const availH = height - pad * 2 - headH - barH;
  const R = Math.min(width / 2 - pad - 8, availH / 2 - 4, (168 / 520) * height); // 规范 pie-6:外径 168 封顶
  const cy = pad + headH + availH / 2;
  const r = R * (0.74 / 0.94); // 规范 pie-6:内径 132.3 / 外径 168

  const parts: string[] = [card(width, height, plain)];
  // 四分区环:240° 仪表弧,-30° 起逆时针,区序倒排(规范 pie-6);分隔 = 底色描边
  const START6 = -Math.PI / 6;
  const SPAN6 = Math.PI * 2 * (240 / 360);
  const segs = ZONES.map((z, i) => ({ z, lo: i === 0 ? 0 : ZONES[i - 1].upto, hi: z.upto }));
  let a = START6;
  for (const { z, lo, hi } of [...segs].reverse()) {
    const w = (hi - lo) * SPAN6;
    const d = segPath(cx, cy, R, r, a, a + w, skin.rules.pieCorner);
    if (d) {
      parts.push(
        `<path d="${d}" fill="var(--d-s${z.seriesIdx + 1})" stroke="var(--d-halo)" stroke-width="${skin.rules.pieSliceGap}" stroke-linejoin="round" stroke-linecap="round"/>`,
      );
    }
    a += w;
  }
  // 虚线刻度弧(同起止角)
  const tickR = r - R / 12;
  const [tsx, tsy] = pol(cx, cy, tickR, START6);
  const [tex, tey] = pol(cx, cy, tickR, START6 + SPAN6);
  parts.push(`<path d="M${r2(tsx)} ${r2(tsy)}A${r2(tickR)} ${r2(tickR)} 0 1 0 ${r2(tex)} ${r2(tey)}" fill="none" stroke="var(--d-muted)" stroke-width="1.3" stroke-linecap="round" stroke-dasharray="0.7 5.5" opacity="0.5"/>`);
  // 中心分值
  const fs = Math.min(52, Math.max(22, r * 0.5));
  parts.push(`<text x="${r2(cx)}" y="${r2(cy + fs * 0.28)}" text-anchor="middle" font-size="${r2(fs)}" font-weight="600" letter-spacing="-0.03em" fill="var(--d-ink)" style="${TAB}">${fmtFull(value)}</text>`);
  // 环下判词
  parts.push(`<text x="${r2(cx)}" y="${r2(cy + R + 20)}" text-anchor="middle" font-size="13" font-weight="500" fill="var(--d-ink)">${esc(zone.name)}</text>`);
  // 底部区刻度条:分段宽度=区间占比
  const barY = height - pad - 24;
  const barW = width - pad * 2;
  let bx = pad;
  let prev = 0;
  for (const z of ZONES) {
    const w = (z.upto - prev) * barW;
    parts.push(`<rect x="${r2(bx)}" y="${barY}" width="${r2(w)}" height="6" rx="3" fill="var(--d-s${z.seriesIdx + 1})"/>`);
    parts.push(`<text x="${r2(bx)}" y="${r2(barY - 8)}" font-size="11" fill="var(--d-muted)" style="${TAB}">${fmtNum(prev * spec.max)}</text>`);
    bx += w;
    prev = z.upto;
  }
  parts.push(`<text x="${r2(width - pad)}" y="${r2(barY - 8)}" text-anchor="end" font-size="11" fill="var(--d-muted)" style="${TAB}">${fmtNum(spec.max)}</text>`);

  return svgDoc(width, height, 'gauge', version, spec.title ?? 'reliability', spec, skin, headSvg + parts.join(''));
}
