// 表格渲染器:扁平的 {cols, rows} → SVG。
//
// 排版用 draw 自己的那一套(svgDoc / textW / skin),所以同一页里表格与其它图
// 长得是一家人 —— 这是 x-cmd/draw#24 明确要求的:「表头和单元格的对齐要跟 draw
// 的其它 kind 用同一套排版办法,不然同一张表在两个地方会长得不一样」。
//
// 规格自包含(见 src/specs/table.ts):多维表格仓(x-cmd/table)是另一个服务,
// 两边共享的是 cols=/rows= 这个约定,不是代码。

import { ApiError } from '../specs/index.js';
import type { TableSpec } from '../specs/table.js';
import { esc, svgDoc, textW, type RenderOpts } from './svg.js';

/** 单元格左右内边距。 */
const PAD_X = 10;
/** 行高。 */
const ROW_H = 28;
/** 表头字号。 */
const HEAD_FS = 13;
/** 数据字号。 */
const BODY_FS = 14;
/** 画布外边距。 */
const PAD = 24;
/**
 * 顶边那一条留给标题与 @X-CMD 角标(角标的基线固定在 38)。
 * 表头从它下面开始 —— 不然窄表格的最后一列表头会被角标压住。
 */
const TOP_LINE_Y = 38;
const CONTENT_TOP = TOP_LINE_Y + 20;
/** 列宽的上下限。 */
const MIN_COL_W = 72;
const MAX_COL_W = 320;

/** 一列。 */
export interface TableCol {
  name: string;
  align: 'left' | 'right';
  /** 列宽(px) */
  w: number;
}

/** 渲染用的网格。 */
export interface TableGrid {
  title?: string;
  cols: TableCol[];
  rows: string[][];
  /** 自然宽(px) */
  width: number;
  /** 自然高(px) */
  height: number;
}

/** 整列都是数字 → 右对齐(与 Airtable 一致)。 */
function columnNumeric(rows: string[][], index: number): boolean {
  let seen = false;
  for (const row of rows) {
    const v = row[index];
    if (v === undefined || v === '') continue;
    if (!Number.isFinite(Number(v))) return false;
    seen = true;
  }
  return seen;
}

/**
 * 规格 → 可渲染的网格。
 */
export function tableToGrid(spec: TableSpec): TableGrid {
  if (!spec.cols.length && !spec.rows.length) {
    throw new ApiError(
      400,
      'A table needs data. Try ?cols=Service,Errors&rows=api:12;worker:9',
    );
  }
  const width = Math.max(spec.cols.length, ...spec.rows.map((r) => r.length), 0);
  const names: string[] = [];
  for (let i = 0; i < width; i++) names.push(spec.cols[i] ?? String(i + 1));

  const cols: TableCol[] = names.map((name, i) => {
    let w = textW(name, HEAD_FS);
    for (const row of spec.rows) {
      const cw = textW(row[i] ?? '', BODY_FS);
      if (cw > w) w = cw;
    }
    return {
      name,
      align: columnNumeric(spec.rows, i) ? ('right' as const) : ('left' as const),
      w: Math.min(MAX_COL_W, Math.max(MIN_COL_W, Math.ceil(w) + PAD_X * 2)),
    };
  });

  const rows = spec.rows.map((r) => {
    const out: string[] = [];
    for (let i = 0; i < width; i++) out.push(r[i] ?? '');
    return out;
  });

  const grid: TableGrid = {
    cols,
    rows,
    width: Math.ceil(cols.reduce((a, c) => a + c.w, 0) + PAD * 2),
    height: Math.ceil(CONTENT_TOP + 34 + rows.length * ROW_H + PAD),
  };
  if (spec.title) grid.title = spec.title;
  return grid;
}

/**
 * 渲染表格。
 *
 * @param spec 规格(嵌进 <metadata> —— I5:输出里带着它渲染自的那份数据)
 * @param o 渲染选项
 */
export function renderTable(spec: TableSpec, o: RenderOpts): string {
  const grid = tableToGrid(spec);
  const width = o.width || grid.width;
  const height = o.height || grid.height;

  // 画布比自然宽度窄时,列宽等比压缩(文字放不下就溢出,宁可溢出也不要糊在一起)
  const natural = grid.width - PAD * 2;
  const scale = natural > 0 ? Math.min(1, (width - PAD * 2) / natural) : 1;
  const widths = grid.cols.map((c) => c.w * scale);

  const parts: string[] = [];

  // 标题与角标共用顶边那一条(角标的基线固定在 38)
  if (grid.title) {
    parts.push(
      `<text x="${PAD}" y="${TOP_LINE_Y}" font-size="18" font-weight="500" letter-spacing="-0.02em" fill="var(--d-ink)">${esc(grid.title)}</text>`,
    );
  }

  // 表头
  let y = CONTENT_TOP;
  let x = PAD;
  const headY = y + 22;
  for (let i = 0; i < grid.cols.length; i++) {
    const c = grid.cols[i]!;
    const anchor = c.align === 'right' ? 'end' : 'start';
    const tx = c.align === 'right' ? x + widths[i]! - PAD_X : x + PAD_X;
    parts.push(
      `<text x="${tx}" y="${headY}" font-size="${HEAD_FS}" font-weight="600" fill="var(--d-muted)" text-anchor="${anchor}">${esc(c.name)}</text>`,
    );
    x += widths[i]!;
  }
  parts.push(
    `<line x1="${PAD}" y1="${headY + 8}" x2="${width - PAD}" y2="${headY + 8}" stroke="var(--d-border)" stroke-width="1"/>`,
  );
  y = headY + 8;

  // 数据行
  for (let r = 0; r < grid.rows.length; r++) {
    const row = grid.rows[r]!;
    const rowY = y + r * ROW_H;
    if (r % 2 === 1) {
      parts.push(
        `<rect x="${PAD}" y="${rowY}" width="${width - PAD * 2}" height="${ROW_H}" fill="var(--d-grid)" opacity="0.35"/>`,
      );
    }
    let cx = PAD;
    for (let i = 0; i < grid.cols.length; i++) {
      const c = grid.cols[i]!;
      const anchor = c.align === 'right' ? 'end' : 'start';
      const tx = c.align === 'right' ? cx + widths[i]! - PAD_X : cx + PAD_X;
      parts.push(
        `<text x="${tx}" y="${rowY + ROW_H / 2 + 5}" font-size="${BODY_FS}" fill="var(--d-ink)" text-anchor="${anchor}">${esc(row[i] ?? '')}</text>`,
      );
      cx += widths[i]!;
    }
    parts.push(
      `<line x1="${PAD}" y1="${rowY + ROW_H}" x2="${width - PAD}" y2="${rowY + ROW_H}" stroke="var(--d-grid)" stroke-width="1"/>`,
    );
  }

  const aria = grid.title ? `${grid.title} — table` : 'table';
  return svgDoc(width, height, 'table', o.version, aria, spec, o.skin, parts.join(''));
}
