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
const VALUE_W = 54;    // 外端数值那一列的宽
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

/** 一根柱 */
function bar(
  x0: number, y: number, len: number, h: number, color: string, tip: string | undefined,
): string[] {
  return [
    `<rect x="${r2(x0)}" y="${r2(y)}" width="${r2(Math.max(len, 1))}" height="${r2(h)}" rx="4" fill="${color}"${tip ? ` data-tip="${esc(tip)}"` : ''}/>`,
  ];
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
  [/nvidia|geforce|\brtx\b/i, '#76B900'],
  [/amd|radeon|ryzen|epyc/i, '#ED1C24'],
  [/intel|\barc\b|\bcore\b|xeon/i, '#0071C5'],
];

/** 名字里认得出是哪个牌子 ✓ */
function brandOf(name: string): string | undefined {
  for (const [re, c] of BRAND_COLOR) if (re.test(name)) return c;
  return undefined;
}

/** 这一侧用什么颜色:显式给的 ✓ → 名字里的品牌 ✓ → 缺省的序列色 ✓ */
function sideColor(side: LadderSide | undefined, fallback: string): string {
  if (!side) return fallback;
  if (side.color) return side.color;
  return brandOf(side.name ?? '') ?? fallback;
}

/** 名字前面的牌子:要去就去掉 ✓(「GeForce RTX 5090」→「RTX 5090」✓) */
const BRAND_WORDS = /^(nvidia|geforce|amd|radeon|ryzen|epyc|intel|core|xeon|arc)\s+/i;
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
  // 行多的时候自动拉高 —— 行距压到 16 以下,行标签就叠在一起了
  let height = o.height;
  if (o.autoHeight) {
    const head = PAD + (spec.title ? 32 : 0) + 8 + (side?.name ? LEGEND_H : 0);
    const need = head + PAD + 26 + n * 16;
    if (height < need) height = Math.min(need, 4000);
  }

  const titleH = spec.title ? titleBlock(spec.title).length / 40 : 0;  // 粗略,下面重算
  const legendItems = side?.name ? [{ name: side.name, color: 'var(--d-s1)' }] : [];
  const contentTop = PAD + (spec.title ? 32 : 0) + 8 + (legendItems.length ? LEGEND_H : 0);
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
      ? ` data-tip="${esc(`${it.label ?? ''} · ${fmtFull(it.value)}${spec.unit ? ' ' + spec.unit : ''}`)}"`
      : '';
    parts.push(...bar(left, y, len, barH, color, tip));
    if (it.label) {
      parts.push(`<text x="${r2(PAD)}" y="${r2(y + barH / 2 + 4)}" text-anchor="start" font-size="12.5" fill="var(--d-text)">${esc(trunc(stripped(it.label, spec), cap))}</text>`);
    }
    parts.push(`<text x="${r2(right + 8)}" y="${r2(y + barH / 2 + 4)}" font-size="12" font-weight="600" fill="var(--d-text)"${tip}>${fmtNum(it.value)}</text>`);
  });

  const legend = legendItems.length
    ? `<g data-legend="types">${legendItems.map((l, i) => `<rect x="${r2(PAD + i * 110)}" y="${r2(contentTop - LEGEND_H + 4)}" width="14" height="14" rx="4" fill="${l.color}" fill-opacity="0.2" stroke="${l.color}" stroke-opacity="0.55"/><text x="${r2(PAD + i * 110 + 20)}" y="${r2(contentTop - LEGEND_H + 15)}" font-size="11.5" fill="var(--d-muted)">${esc(l.name)}</text>`).join('')}</g>`
    : '';

  return svgDoc(
    width, height, 'ladder', version, 'ladder', spec, skin,
    bg + titleBlock(spec.title) + legend + parts.join(''),
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
  // 行多的时候自动拉高(同上)
  let height = o.height;
  if (o.autoHeight) {
    const legend = (spec.left?.name ? 1 : 0) + (spec.right?.name ? 1 : 0);
    const head = PAD + (spec.title ? 32 : 0) + 8 + (legend ? LEGEND_H : 0);
    const need = head + PAD + 26 + n * 16;
    if (height < need) height = Math.min(need, 4000);
  }

  const legendItems = [
    spec.left?.name ? { name: spec.left.name, color: sideColor(spec.left, 'var(--d-s1)') } : null,
    spec.right?.name ? { name: spec.right.name, color: sideColor(spec.right, 'var(--d-s2)') } : null,
  ].filter(Boolean) as { name: string; color: string }[];

  const contentTop = PAD + (spec.title ? 32 : 0) + 8 + (legendItems.length ? LEGEND_H : 0);
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
    if (l) {
      const len = (l.value / (leftMax || 1)) * half;
      const tip = o.interactive
        ? ` data-tip="${esc(`${l.label ?? ''} · ${fmtFull(l.value)}${spec.unit ? ' ' + spec.unit : ''}`)}"`
        : '';
      parts.push(...bar(centre - len, y, len, barH, itemColor(l, spec.left, sVar(0)), tip));
      if (l.label) {
        parts.push(`<text x="${r2(PAD)}" y="${r2(y + barH / 2 + 4)}" text-anchor="start" font-size="12.5" fill="var(--d-text)">${esc(trunc(stripped(l.label, spec), cap))}</text>`);
      }
      // 数值:柱够长**而且够粗**就画在柱里 —— 左边的柱尾紧挨着名字列,
      // 画在外面会撞上;柱太薄的话字会糊在柱边上。
      // 左边的柱往左长,「柱里」是尾端的**右边**,所以文字从尾端往右排(start)。
      const inBar = len > 56 && barH >= 11;
      parts.push(`<text x="${r2(centre - len + (inBar ? 8 : -8))}" y="${r2(y + barH / 2 + 4)}" text-anchor="${inBar ? 'start' : 'end'}" font-size="12" font-weight="600" fill="${inBar ? '#fff' : 'var(--d-text)'}">${fmtNum(l.value)}</text>`);
    }
    if (r) {
      const len = (r.value / (rightMax || 1)) * half;
      const tip = o.interactive
        ? ` data-tip="${esc(`${r.label ?? ''} · ${fmtFull(r.value)}${spec.unit ? ' ' + spec.unit : ''}`)}"`
        : '';
      parts.push(...bar(centre, y, len, barH, itemColor(r, spec.right, sVar(1)), tip));
      if (r.label) {
        parts.push(`<text x="${r2(plotR + VALUE_W + 10)}" y="${r2(y + barH / 2 + 4)}" font-size="12.5" fill="var(--d-text)">${esc(trunc(stripped(r.label, spec), cap))}</text>`);
      }
      // 右边跟左边一致:柱够长**而且够粗**就画在柱里 ✓(不然一律画在外面 ✓)
      const rInBar = len > 56 && barH >= 11;
      parts.push(`<text x="${r2(rInBar ? centre + len - 8 : centre + len + 8)}" y="${r2(y + barH / 2 + 4)}" text-anchor="${rInBar ? 'end' : 'start'}" font-size="12" font-weight="600" fill="${rInBar ? '#fff' : 'var(--d-text)'}">${fmtNum(r.value)}</text>`);
    }
  });

  const legend = legendItems.length
    ? `<g data-legend="types">${legendItems.map((l, i) => `<rect x="${r2(PAD + i * 130)}" y="${r2(contentTop - LEGEND_H + 4)}" width="14" height="14" rx="4" fill="${l.color}" fill-opacity="0.2" stroke="${l.color}" stroke-opacity="0.55"/><text x="${r2(PAD + i * 130 + 20)}" y="${r2(contentTop - LEGEND_H + 15)}" font-size="11.5" fill="var(--d-muted)">${esc(l.name)}</text>`).join('')}</g>`
    : '';

  return svgDoc(
    width, height, 'butterfly-ladder', version, 'butterfly ladder', spec, skin,
    bg + titleBlock(spec.title) + legend + parts.join(''),
  );
}

/** 给 draw 的注册表用:这个 spec 该走哪个渲染器 */
export function isButterflyLadder(spec: LadderSpec): boolean {
  return !spec.side && (spec.left !== undefined || spec.right !== undefined);
}
