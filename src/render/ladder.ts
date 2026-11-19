// 天梯图(ladder)与双翼天梯图(butterfly-ladder)。
//
// 天梯图:一边,按强弱排成梯子,可以分档(S/A/B/C)。
// 双翼天梯图:两边同时排,一行两个型号,正面对打。
//
// 为什么跟 butterfly 分开:butterfly 是**通用**的双系列图(人口金字塔、
// 「开了 vs 关了」的按龄分布),行标签两侧共用一套;天梯图要的是
// **一行两个型号**(左边 N 卡、右边 AMD/Intel),而且要能分档 ——
// 那是另一套语义,另一套读法。
//
// 两条规则:
//   1. **档位是行的一组属性**,不是名字的一部分 —— 同一档的行连在一起,
//      档与档之间有分隔,档名标在左边那一列。
//   2. **一侧行数少时,多出来的行留空,不挪位** —— 挪位会让
//      「第 k 行对第 k 行」这个含义失效。
import type { LadderItem, LadderSide, LadderSpec } from '../specs/ladder.js';
import { matchLadderRows } from '../specs/ladder.js';
import { TAB, card } from '../theme.js';
import {
  esc, fmtFull, fmtNum, niceTicks, r2, sVar, svgDoc, textW, titleBlock, trunc, type RenderOpts,
} from './svg.js';

const PAD = 24;
const LEGEND_H = 26;
const VALUE_W = 62;    // 外端数值那一列的宽(具体数字要放得下 ✓)
const BAR_H = 18;

/** 连续同档的行算一组 */
function tierGroups(tiers: (string | undefined)[]): { tier?: string; from: number; to: number }[] {
  const out: { tier?: string; from: number; to: number }[] = [];
  let i = 0;
  while (i < tiers.length) {
    const t = tiers[i];
    let j = i;
    while (j + 1 < tiers.length && tiers[j + 1] === t) j++;
    out.push({ tier: t, from: i, to: j });
    i = j + 1;
  }
  return out;
}

/** 档位名列:组名竖排在组中间(组太矮就排在组首行上) */

/** tooltip 的属性(文字 ⇒ 属性 ✓ —— 别把整串属性再塞进属性里 ✗) */
const tipAttr = (text: string | undefined): string => (text ? ` data-tip="${esc(text)}"` : '');

/** 一根柱 */
function bar(
  x0: number, y: number, len: number, h: number, color: string, tip: string | undefined, row = -1,
): string[] {
  return [
    `<rect${row >= 0 ? ` data-row="${row}"` : ''} x="${r2(x0)}" y="${r2(y)}" width="${r2(Math.max(len, 1))}" height="${r2(h)}" rx="4" fill="${color}"${tipAttr(tip)}/>`,
  ];
}

/**
 * 行底色:鼠标悬停时**整行**亮一下 ✓
 * (垫色,不要描边 ✓ —— 描边会像选中框 ✗)
 * 它同时是这一行的「悬停热区」✓ —— 悬在行里的空白处也能亮 ✓。
 */
function rowBand(x: number, y: number, w: number, h: number, row: number, tip: string | undefined): string {
  return `<rect class="row-band" data-row="${row}" x="${r2(x)}" y="${r2(y)}" width="${r2(w)}" height="${r2(h)}" fill="var(--d-ink)" fill-opacity="0"${tipAttr(tip)}/>`;
}

/**
 * 天梯图(单边)。
 *
 * 行从上到下按值排(调用方排好,这里只画);同一档的行连在一起,
 * 档与档之间一条分隔线,档名在左边那一列。
 */
/**
 * 品牌色:名字里认得出来就用它的 ✓
 * (NVIDIA 绿 / AMD 红 / Intel 蓝 ✓ —— 「各自的主题色」✓)
 */
const BRAND_COLOR: [RegExp, string][] = [
  [/nvidia|geforce|\brtx\b|quadro|titan|tesla/i, '#76B900'],
  [/amd|radeon|ryzen|epyc/i, '#ED1C24'],
  [/intel|\barc\b|\bcore\b|xeon/i, '#0071C5'],
];

/** 名字里认得出是哪个牌子 ✓ */
function brandOf(name: string): string | undefined {
  for (const [re, c] of BRAND_COLOR) if (re.test(name)) return c;
  return undefined;
}

/** 颜色 ⇒ 牌子名(给图例用 ✓) */
const BRAND_NAME: Record<string, string> = { '#76B900': 'NVIDIA', '#ED1C24': 'AMD', '#0071C5': 'Intel' };

/**
 * 图例:**图里真用到的那些颜色** ✓
 * (不是「这一侧叫什么」✓ —— 一侧里混着 AMD 和 Intel 时,一个色块说不清 ✓;
 *  牌子认得出来的就用牌子名 ✓,认不出来的才用这一侧的名字 ✓)
 */
function legendOf(groups: { items: LadderItem[]; side?: LadderSide; fallback: string }[]): { name: string; color: string }[] {
  const seen = new Map<string, string>();
  for (const g of groups) {
    for (const it of g.items) {
      const c = itemColor(it, g.side, g.fallback);
      if (!seen.has(c)) seen.set(c, BRAND_NAME[c] ?? g.side?.name ?? '');
    }
  }
  return [...seen].filter(([, n]) => n !== '').map(([color, name]) => ({ name, color }));
}

/** 这一侧用什么颜色:显式给的 ✓ → 名字里的品牌 ✓ → 缺省的序列色 ✓ */
function sideColor(side: LadderSide | undefined, fallback: string): string {
  if (!side) return fallback;
  if (side.color) return side.color;
  return brandOf(side.name ?? '') ?? fallback;
}

/** 名字前面的牌子:要去就去掉 ✓(「GeForce RTX 5090」→「RTX 5090」✓) */
const BRAND_WORDS = /^(nvidia|geforce|quadro|amd|radeon|ryzen|epyc|intel|core|xeon|arc)\s+/i;
function stripped(label: string | undefined, spec: LadderSpec): string {
  const s = label ?? '';
  return spec.stripbrand ? s.replace(BRAND_WORDS, '') : s;
}

/** 这一张卡用什么颜色:卡自己给的 ✓ → 卡名字里的品牌 ✓ → 那一侧的颜色 ✓ */
function itemColor(item: LadderItem, side: LadderSide | undefined, fallback: string): string {
  if (item.color) return item.color;
  return brandOf(item.label ?? '') ?? sideColor(side, fallback);
}

export function renderLadder(spec: LadderSpec, o: RenderOpts): string {
  const { width, version, skin } = o;
  const cap = spec.labelmax ?? 22;
  const side = spec.side;
  const items = side?.items ?? [];
  const n = items.length;
  if (!n) return svgDoc(width, o.height, 'ladder', version, 'ladder', spec, skin, '');

  // 标题/图例/图 三者的位置比例 ✓ —— 天梯图往往很高,标题要压得住 ✓
  const titleSvg = spec.title
    ? `<text x="${PAD}" y="${PAD + 17}" font-size="22" font-weight="600" letter-spacing="-0.02em" fill="var(--d-ink)">${esc(spec.title)}</text>`
    : '';
  const titleH = spec.title ? 38 : 0;
  const legendItems = legendOf([{ items, side, fallback: 'var(--d-s1)' }]);
  const contentTop = PAD + titleH + (legendItems.length ? LEGEND_H : 0);

  // 行多的时候画布自动拉高 —— 行距压到 16 以下,行标签就叠在一起了
  // (h= 只是「最少这么高」✓:100 行的天梯图硬压进 480px ⇒ 后半截掉出画布 ✗)
  let height = o.height;
  const need = contentTop + 8 + PAD + 26 + n * 16;
  if (height < need) height = Math.min(need, 4000);

  const avail = height - contentTop - PAD - 26;
  const pitch = Math.max(12, Math.min(26, avail / Math.max(n, 1)));
  const barH = Math.min(BAR_H, Math.max(6, pitch * 0.62));

  const labelW = Math.min(
    190 + Math.max(0, cap - 22) * 7,
    Math.max(...items.map((it) => textW(trunc(it.label ?? '', cap), 12.5))) + 6,
  );
  const left = PAD + labelW + 14;
  const right = width - PAD - VALUE_W;

  const max = Math.max(...items.map((it) => it.value));
  const ticks = niceTicks(max, 4);
  const xMax = ticks[ticks.length - 1] || max;
  const x = (v: number): number => left + (v / xMax) * (right - left);

  const bg = card(width, height);
  const parts: string[] = [];

  // 刻度:只留数字(背景网格线不要 ✓ —— 用户:「不需要背景网格线」✓)
  for (const t of ticks) {
    const gx = r2(x(t));
    parts.push(`<text x="${gx}" y="${r2(height - PAD - 26 + 16)}" text-anchor="middle" font-size="12" fill="var(--d-muted)" style="${TAB}">${fmtNum(t)}</text>`);
  }

  const yOf = (i: number): number => contentTop + i * pitch + (pitch - barH) / 2;
  const groups = tierGroups(items.map((it) => it.tier));

  // 档位:组与组之间一条分隔线,档名在左边那一列
  for (const g of groups) {
    if (g.from === 0) continue;
    const y = contentTop + g.from * pitch;
    parts.push(`<line x1="${r2(PAD)}" y1="${r2(y)}" x2="${r2(right)}" y2="${r2(y)}" stroke="var(--d-border)" stroke-width="1"/>`);
  }

  items.forEach((it, i) => {
    const y = yOf(i);
    const len = x(it.value) - left;
    const color = itemColor(it, side, sVar(0));   // 每张卡按自己的牌子 ✓
    const tip = o.interactive
      ? `${it.label ?? ''} · ${fmtFull(it.value)}${spec.unit ? ' ' + spec.unit : ''}`
      : undefined;
    const tipA = tipAttr(tip);
    const row = ` data-row="${i}"`;
    // 行底色(悬停整行亮 ✓)—— 画在柱与字之前,垫在最下面 ✓
    parts.push(rowBand(PAD, contentTop + i * pitch, right - PAD, pitch, i, tip));
    parts.push(...bar(left, y, len, barH, color, tip, i));
    if (it.label) {
      parts.push(`<text${row}${tipA} x="${r2(PAD)}" y="${r2(y + barH / 2 + 4)}" text-anchor="start" font-size="12.5" fill="var(--d-text)">${esc(trunc(stripped(it.label, spec), cap))}</text>`);
    }
    parts.push(`<text${row} x="${r2(right + 8)}" y="${r2(y + barH / 2 + 4)}" font-size="12" font-weight="600" fill="var(--d-text)"${tipA}>${fmtFull(it.value)}</text>`);
  });

  const legend = legendItems.length
    ? `<g data-legend="types">${legendItems.map((l, i) => `<rect x="${r2(PAD + i * 130)}" y="${r2(contentTop - LEGEND_H + 5)}" width="15" height="15" rx="4" fill="${l.color}" fill-opacity="0.2" stroke="${l.color}" stroke-opacity="0.55"/><text x="${r2(PAD + i * 130 + 22)}" y="${r2(contentTop - LEGEND_H + 17)}" font-size="12" fill="var(--d-muted)">${esc(l.name)}</text>`).join('')}</g>`
    : '';

  return svgDoc(
    width, height, 'ladder', version, 'ladder', spec, skin,
    bg + titleSvg + legend + parts.join(''),
  );
}

/**
 * 双翼天梯图:左边 N 卡、右边 AMD/Intel。
 *
 * 两翼的卡合成**一条**梯子,整体按强弱排:
 *   rank(缺省)—— **完全错位**:每一行只有一张卡,在它自己那一侧
 *   value      —— **匹配排序**:值相近的排在同一行,两翼都有
 *
 * 两翼共用一把标尺 —— 不然跨翼的长度没法比。
 */
export function renderButterflyLadder(spec: LadderSpec, o: RenderOpts): string {
  const { width, version, skin } = o;
  const cap = spec.labelmax ?? 22;
  const leftItems = spec.left?.items ?? [];
  const rightItems = spec.right?.items ?? [];
  const rows = matchLadderRows(leftItems, rightItems, spec.match ?? 'rank');
  const n = rows.length;
  if (!n) {
    return svgDoc(width, o.height, 'butterfly-ladder', version, 'butterfly ladder', spec, skin, '');
  }
  const legendItems = legendOf([
    { items: leftItems, side: spec.left, fallback: 'var(--d-s1)' },
    { items: rightItems, side: spec.right, fallback: 'var(--d-s2)' },
  ]);

  const titleSvg = spec.title
    ? `<text x="${PAD}" y="${PAD + 17}" font-size="22" font-weight="600" letter-spacing="-0.02em" fill="var(--d-ink)">${esc(spec.title)}</text>`
    : '';
  const contentTop = PAD + (spec.title ? 38 : 0) + (legendItems.length ? LEGEND_H : 0);

  // 行多的时候画布自动拉高(同上:h= 只是「最少这么高」✓)
  let height = o.height;
  const need = contentTop + 8 + PAD + 26 + n * 16;
  if (height < need) height = Math.min(need, 4000);

  const avail = height - contentTop - PAD - 26;
  const pitch = Math.max(12, Math.min(26, avail / Math.max(n, 1)));
  const barH = Math.min(BAR_H, Math.max(6, pitch * 0.62));

  const lLabels = leftItems.map((it) => it.label ?? '');
  const rLabels = rightItems.map((it) => it.label ?? '');
  const lW = Math.max(0, ...lLabels.map((l) => textW(trunc(l, cap), 12.5)));
  const rW = Math.max(0, ...rLabels.map((l) => textW(trunc(l, cap), 12.5)));
  const plotL = PAD + lW + 10 + VALUE_W;
  const plotR = width - PAD - rW - 10 - VALUE_W;
  const centre = (plotL + plotR) / 2;
  const half = (plotR - plotL) / 2;

  // **一把标尺**:两翼合起来是一条梯子,长度要能跨着比
  const lMax = Math.max(...leftItems.map((it) => it.value), 0);
  const rMax = Math.max(...rightItems.map((it) => it.value), 0);
  const leftMax = Math.max(lMax, rMax);
  const rightMax = leftMax;

  const bg = card(width, height);
  const parts: string[] = [];

  parts.push(`<line x1="${r2(centre)}" y1="${r2(contentTop)}" x2="${r2(centre)}" y2="${r2(height - PAD - 26)}" stroke="var(--d-border)"/>`);

  // 标度:两翼共用一把(缺省自动挑 ✓;可以用 ticks= 指定 ✓ 如 1000,2000,3000 ✓)
  const tickVals = (spec.ticks?.length ? [...spec.ticks].sort((a, b) => a - b) : niceTicks(leftMax, 4))
    .filter((t) => t > 0);
  const tickMax = tickVals[tickVals.length - 1] || leftMax;
  const tickY = height - PAD - 26 + 16;
  for (const t of tickVals) {
    const dx = (t / tickMax) * half;
    parts.push(`<text x="${r2(centre - dx)}" y="${r2(tickY)}" text-anchor="middle" font-size="11" fill="var(--d-muted)">${fmtNum(t)}</text>`);
    parts.push(`<text x="${r2(centre + dx)}" y="${r2(tickY)}" text-anchor="middle" font-size="11" fill="var(--d-muted)">${fmtNum(t)}</text>`);
  }

  const yOf = (i: number): number => contentTop + i * pitch + (pitch - barH) / 2;

  // 档位:两侧的行是配对的,档以左边为准
  const tiers = rows.map((r) => r[0]?.tier ?? r[1]?.tier);
  const groups = tierGroups(tiers);
  for (const g of groups) {
    if (g.from === 0) continue;
    const y = contentTop + g.from * pitch;
    parts.push(`<line x1="${r2(PAD)}" y1="${r2(y)}" x2="${r2(width - PAD)}" y2="${r2(y)}" stroke="var(--d-border)" stroke-width="1"/>`);
  }

  rows.forEach(([l, r], i) => {
    const y = yOf(i);
    const row = ` data-row="${i}"`;
    // 行底色(悬停整行亮 ✓)—— 一行两翼一起亮 ✓
    const bandTip = o.interactive
      ? `${l?.label ?? ''}${r?.label ? `  ·  ${r.label}` : ''}`
      : undefined;
    parts.push(rowBand(PAD, contentTop + i * pitch, width - PAD * 2, pitch, i, bandTip));
    if (l) {
      const len = (l.value / (leftMax || 1)) * half;
      const tip = o.interactive
        ? `${l.label ?? ''} · ${fmtFull(l.value)}${spec.unit ? ' ' + spec.unit : ''}`
        : undefined;
      const tipA = tipAttr(tip);
      parts.push(...bar(centre - len, y, len, barH, itemColor(l, spec.left, sVar(0)), tip, i));
      if (l.label) {
        parts.push(`<text${row}${tipA} x="${r2(PAD)}" y="${r2(y + barH / 2 + 4)}" text-anchor="start" font-size="12.5" fill="var(--d-text)">${esc(trunc(stripped(l.label, spec), cap))}</text>`);
      }
      // 数值:**一律画在 bar 外面** ✓(两边一致 ✓ —— 「左边的数据在 bar 里、右边在外面」看着别扭 ✓)
      // 左边的柱往左长 ⇒ 数值在尾端的左边 ✓(紧挨着名字列 ✓)
      parts.push(`<text${row} x="${r2(centre - len - 8)}" y="${r2(y + barH / 2 + 4)}" text-anchor="end" font-size="12" font-weight="600" fill="var(--d-text)"${tipA}>${fmtFull(l.value)}</text>`);
    }
    if (r) {
      const len = (r.value / (rightMax || 1)) * half;
      const tip = o.interactive
        ? `${r.label ?? ''} · ${fmtFull(r.value)}${spec.unit ? ' ' + spec.unit : ''}`
        : undefined;
      const tipA = tipAttr(tip);
      parts.push(...bar(centre, y, len, barH, itemColor(r, spec.right, sVar(1)), tip, i));
      if (r.label) {
        parts.push(`<text${row}${tipA} x="${r2(plotR + VALUE_W + 10)}" y="${r2(y + barH / 2 + 4)}" font-size="12.5" fill="var(--d-text)">${esc(trunc(stripped(r.label, spec), cap))}</text>`);
      }
      // 右边同样:**一律画在 bar 外面** ✓
      parts.push(`<text${row} x="${r2(centre + len + 8)}" y="${r2(y + barH / 2 + 4)}" font-size="12" font-weight="600" fill="var(--d-text)"${tipA}>${fmtFull(r.value)}</text>`);
    }
  });

  const legend = legendItems.length
    ? `<g data-legend="types">${legendItems.map((l, i) => `<rect x="${r2(PAD + i * 140)}" y="${r2(contentTop - LEGEND_H + 5)}" width="15" height="15" rx="4" fill="${l.color}" fill-opacity="0.2" stroke="${l.color}" stroke-opacity="0.55"/><text x="${r2(PAD + i * 140 + 22)}" y="${r2(contentTop - LEGEND_H + 17)}" font-size="12" fill="var(--d-muted)">${esc(l.name)}</text>`).join('')}</g>`
    : '';

  return svgDoc(
    width, height, 'butterfly-ladder', version, 'butterfly ladder', spec, skin,
    bg + titleSvg + legend + parts.join(''),
  );
}

/** 给 draw 的注册表用:这个 spec 该走哪个渲染器 */
export function isButterflyLadder(spec: LadderSpec): boolean {
  return !spec.side && (spec.left !== undefined || spec.right !== undefined);
}
