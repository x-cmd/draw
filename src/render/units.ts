// 显示单元:页头 / 提示 / 页脚。
//
// 一个图除了主体,还有几块「附属信息」:
//   header —— 抬头(标题那一行;右边可以挂一句摘要)
//   tip    —— 提示(主体里装不下的明细,列出来 —— 网格太密时塞不下的日程)
//   footer —— 页脚(补充信息:统计、口径、来源)
//
// 先在日历上做出来(那儿最需要),以后别的图种接上就行 —— 三个单元都与图种无关。

import { esc, r2, textW } from './svg.js';

export interface FooterItem {
  /** 小标题 */
  label: string;
  /** 值(跟在 label 后面) */
  value?: string;
  /** 值前面的色点 */
  color?: string;
}

export interface TipRow {
  /** 主文案 */
  text: string;
  /** 右边的小字(时间、日期) */
  sub?: string;
  /** 前面的小圆点颜色 */
  color?: string;
}

/**
 * 页头:标题那一行的右边,挂一句摘要(多少个日程、什么口径)。
 */
export function headerMeta(meta: string | undefined, x: number, y: number, width: number): string {
  if (!meta) return '';
  return `<text x="${r2(x + width)}" y="${r2(y)}" text-anchor="end" font-size="12" fill="var(--d-muted)">${esc(meta)}</text>`;
}

/**
 * 页脚:一行小字。
 * 左边若干项(中间用「·」隔开),右边一句备注(来源、口径)。
 */
export function footerUnit(items: FooterItem[], note: string | undefined, x: number, y: number, width: number): string {
  if (!items.length && !note) return '';
  const parts: string[] = [];
  let cx = x;
  items.forEach((it, i) => {
    if (i > 0) {
      parts.push(`<text x="${r2(cx)}" y="${r2(y)}" font-size="11" fill="var(--d-faint)">·</text>`);
      cx += 9;
    }
    if (it.color) {
      parts.push(`<circle cx="${r2(cx + 3)}" cy="${r2(y - 4)}" r="3" fill="${it.color}"/>`);
      cx += 12;
    }
    const label = it.value ? `${it.label} ${it.value}` : it.label;
    parts.push(`<text x="${r2(cx)}" y="${r2(y)}" font-size="11" fill="var(--d-muted)">${esc(label)}</text>`);
    cx += textW(label, 11);
  });
  if (note) {
    parts.push(`<text x="${r2(x + width)}" y="${r2(y)}" text-anchor="end" font-size="11" fill="var(--d-faint)">${esc(note)}</text>`);
  }
  return `<g class="footer">${parts.join('')}</g>`;
}

/**
 * 提示单元:主体里塞不下、但又不该丢掉的明细 —— 列成一块小面板。
 * 两列排(条目多的时候不至于拉得太高)。
 */
export function tipUnit(rows: TipRow[], x: number, y: number, width: number, title?: string): string {
  if (!rows.length) return '';
  const cols = width > 520 ? 2 : 1;
  const perCol = Math.ceil(rows.length / cols);
  const rowH = 15;
  const titleH = title ? 20 : 0;
  const h = titleH + perCol * rowH + 10;
  const colW = width / cols;
  const parts: string[] = [];
  parts.push(
    `<rect x="${r2(x)}" y="${r2(y)}" width="${r2(width)}" height="${r2(h)}" rx="8" fill="var(--d-card)" stroke="var(--d-border)" stroke-width="1" fill-opacity="0.9"/>`,
  );
  if (title) {
    parts.push(
      `<text x="${r2(x + 10)}" y="${r2(y + 15)}" font-size="11" font-weight="600" fill="var(--d-muted)">${esc(title)}</text>`,
    );
  }
  rows.forEach((r, i) => {
    const col = Math.floor(i / perCol);
    const row = i % perCol;
    const rx = x + 10 + col * colW;
    const ry = y + titleH + 6 + row * rowH;
    if (r.color) parts.push(`<circle cx="${r2(rx + 3)}" cy="${r2(ry - 3)}" r="3" fill="${r.color}"/>`);
    parts.push(`<text x="${r2(rx + (r.color ? 11 : 0))}" y="${r2(ry)}" font-size="11" fill="var(--d-text)">${esc(r.text)}</text>`);
    if (r.sub) {
      parts.push(
        `<text x="${r2(rx + colW - 16)}" y="${r2(ry)}" text-anchor="end" font-size="11" fill="var(--d-faint)">${esc(r.sub)}</text>`,
      );
    }
  });
  return `<g class="tip">${parts.join('')}</g>`;
}

/** 提示单元要占多高(画之前先问一遍,好留位置) */
export function tipHeight(rows: number, width: number, hasTitle = true): number {
  if (!rows) return 0;
  const cols = width > 520 ? 2 : 1;
  const perCol = Math.ceil(rows / cols);
  return (hasTitle ? 20 : 0) + perCol * 15 + 10;
}
