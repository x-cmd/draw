// 表格渲染器:规格 → SVG。
//
// 排版用 draw 自己的那一套(svgDoc / textW / skin),所以同一页里表格与其它图
// 长得是一家人 —— 这是 x-cmd/draw#24 明确要求的:「表头和单元格的对齐要跟 draw
// 的其它 kind 用同一套排版办法,不然同一张表在两个地方会长得不一样」。
//
// 规格来自 @x-cmd/table/core:字段、类型、关联记录都在那边定义。

import {
  applyView,
  cellText,
  columnNumeric,
  visibleFields,
  type TableSpec,
} from '@x-cmd/table/core';
import { ApiError } from '../specs/index.js';
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

/** 渲染用的网格(规格的一个投影)。 */
export interface TableGrid {
  title?: string;
  cols: TableCol[];
  rows: string[][];
  /** 自然宽(px) */
  width: number;
  /** 自然高(px) */
  height: number;
}

/**
 * 规格 → 可渲染的网格。
 *
 * 取第一个网格视图(没有就取第一个视图)的那张表;字段与行都按视图算。
 */
export function tableToGrid(spec: TableSpec): TableGrid {
  const view = spec.views.find((v) => v.type === 'grid') ?? spec.views[0];
  if (!view) {
    throw new ApiError(400, 'the table spec has no views. Add a "views" entry with a grid view.');
  }
  const table = spec.tables.find((t) => t.id === view.table);
  if (!table) {
    throw new ApiError(
      400,
      `view ${JSON.stringify(view.id)} looks at unknown table ${JSON.stringify(view.table)}. ` +
        `Known tables: ${spec.tables.map((t) => t.id).join(', ') || '(none)'}`,
    );
  }
  const fields = visibleFields(table, view);
  if (!fields.length) {
    throw new ApiError(400, `table ${JSON.stringify(table.id)} has no visible fields to render.`);
  }
  const rows = applyView(spec, view).map((r) =>
    fields.map((f) => cellText(spec, f, r.record.fields[f.id])),
  );

  const cols: TableCol[] = fields.map((f) => {
    // 列宽:表头与所有单元格里最宽的那条
    let w = textW(f.name, HEAD_FS);
    for (const row of rows) {
      const cw = textW(row[fields.indexOf(f)] ?? '', BODY_FS);
      if (cw > w) w = cw;
    }
    return {
      name: f.name,
      align: columnNumeric(table, f) ? ('right' as const) : ('left' as const),
      w: Math.min(MAX_COL_W, Math.max(MIN_COL_W, Math.ceil(w) + PAD_X * 2)),
    };
  });

  const width = Math.ceil(cols.reduce((a, c) => a + c.w, 0) + PAD * 2);
  const height = Math.ceil(CONTENT_TOP + 34 + rows.length * ROW_H + PAD);

  const grid: TableGrid = {
    cols,
    rows,
    width,
    height,
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
