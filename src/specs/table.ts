// 表格的规格:扁平的 {cols, rows} —— 与 draw 其它 kind 一样自包含。
//
// 写法与多维表格仓(x-cmd/table)那边的扁平形态一致:
//   ?cols=Service,Errors&rows=api:12;worker:9
// `:` 分单元格,`;` 分行 —— 与 links=A>B:30、ev=… 同一套约定。
//
// 那边是另一个服务,这边不依赖它:共享的是约定,不是代码。
import { ApiError, clip } from './base.js';

/** 表格的规格。 */
export interface TableSpec {
  /** 标题(可选) */
  title?: string;
  /** 列名 */
  cols: string[];
  /** 行;单元格一律字符串 */
  rows: string[][];
}

/** 列名上限。 */
const MAX_COL = 30;
/** 行数上限。 */
const MAX_ROW = 200;
/** 单元格文字上限。 */
const MAX_CELL = 200;
/** 标题上限。 */
const MAX_TITLE = 80;

/**
 * 列表参数:重复参数优先,否则按逗号分隔。
 *
 * 与 x-cmd/table 的扁平形态同一套约定。
 */
function flatList(params: URLSearchParams, key: string): string[] {
  const all = params.getAll(key);
  if (all.length > 1) return all;
  const one = all[0];
  return one !== undefined && one !== '' ? one.split(',') : [];
}

/**
 * URL 参数 → 规格的 JSON 字符串。
 *
 * `?d=` 的 JSON 优先;没有就解析扁平参数。
 *
 * @param params 查询参数
 */
export function tableSpecFromParams(params: URLSearchParams): string {
  const d = params.get('d');
  if (d !== null && d !== '') return d;

  const cols = flatList(params, 'cols').map((c) => c.trim());
  const rowParams = params.getAll('rows');
  if (rowParams.length > 1) {
    throw new ApiError(
      400,
      `"rows" must appear once (rows are separated by ";"); it appeared ${rowParams.length} times. Example: ?cols=A,B&rows=1:2`,
    );
  }
  const raw = rowParams[0] ?? '';
  const rows: string[][] = [];
  if (raw.trim() !== '') {
    for (const r of raw.split(';')) {
      const t = r.trim();
      if (t === '') continue;
      rows.push(t.split(':').map((c) => c.trim()));
    }
  }

  if (cols.length > MAX_COL) {
    throw new ApiError(400, `"cols" has ${cols.length} columns; the limit is ${MAX_COL}. Example: ?cols=A,B&rows=1:2`);
  }
  if (rows.length > MAX_ROW) {
    throw new ApiError(400, `"rows" has ${rows.length} rows; the limit is ${MAX_ROW}.`);
  }
  if (cols.length > 0) {
    for (let i = 0; i < rows.length; i++) {
      if (rows[i]!.length !== cols.length) {
        throw new ApiError(
          400,
          `"rows" has ${rows[i]!.length} cells in row ${i + 1} but "cols" declares ${cols.length} columns. Example: ?cols=A,B&rows=1:2;3:4`,
        );
      }
    }
  }

  const title = params.get('title');
  const spec: TableSpec = { cols, rows };
  if (title) spec.title = clip(title, MAX_TITLE);
  return JSON.stringify(spec);
}

/**
 * 规格的 JSON 字符串 → 校验过的规格。
 *
 * @param raw JSON 字符串
 * @throws ApiError(400) with a corrective example on bad input
 */
export function parseTableSpec(raw: string): TableSpec {
  let obj: unknown;
  try {
    obj = JSON.parse(raw);
  } catch {
    throw new ApiError(400, `"d" is not valid JSON (remember to URL-encode it). Example: ?d={"cols":["A","B"],"rows":[["api",12],["worker",9]]}`);
  }
  if (obj === null || typeof obj !== 'object' || Array.isArray(obj)) {
    throw new ApiError(400, `"d" must be a JSON object like {"cols":["A","B"],"rows":[["api",12],["worker",9]]}`);
  }
  const o = obj as Record<string, unknown>;
  for (const k of Object.keys(o)) {
    if (!['title', 'cols', 'rows'].includes(k)) {
      throw new ApiError(
        400,
        `unknown key ${JSON.stringify(k)} in the table spec. Known keys: title, cols, rows. Remove it or fix the spelling.`,
      );
    }
  }
  const colsRaw = o['cols'];
  if (colsRaw !== undefined && !Array.isArray(colsRaw)) {
    throw new ApiError(400, `"cols" must be an array of column names. Got: ${JSON.stringify(colsRaw)}`);
  }
  const cols: string[] = [];
  for (let i = 0; i < (colsRaw as unknown[] | undefined ?? []).length; i++) {
    const c = (colsRaw as unknown[])[i];
    if (typeof c !== 'string') {
      throw new ApiError(400, `"cols" #${i + 1} must be a string. Got: ${JSON.stringify(c)}`);
    }
    cols.push(clip(c.trim(), MAX_CELL));
  }
  if (cols.length > MAX_COL) {
    throw new ApiError(400, `"cols" has ${cols.length} columns; the limit is ${MAX_COL}.`);
  }

  const rowsRaw = o['rows'];
  if (rowsRaw !== undefined && !Array.isArray(rowsRaw)) {
    throw new ApiError(400, `"rows" must be an array of rows. Got: ${JSON.stringify(rowsRaw)}`);
  }
  const rows: string[][] = [];
  const rowList = (rowsRaw as unknown[] | undefined ?? []);
  if (rowList.length > MAX_ROW) {
    throw new ApiError(400, `"rows" has ${rowList.length} rows; the limit is ${MAX_ROW}.`);
  }
  for (let i = 0; i < rowList.length; i++) {
    const r = rowList[i];
    if (!Array.isArray(r)) {
      throw new ApiError(400, `"rows" #${i + 1} must be an array of cells. Got: ${JSON.stringify(r)}`);
    }
    const cells: string[] = [];
    for (let j = 0; j < r.length; j++) {
      const v = r[j];
      if (typeof v === 'string') cells.push(clip(v, MAX_CELL));
      else if (typeof v === 'number' || typeof v === 'boolean') cells.push(String(v));
      else {
        throw new ApiError(
          400,
          `"rows" #${i + 1} cell #${j + 1} must be a string, number or boolean. Got: ${JSON.stringify(v)}`,
        );
      }
    }
    rows.push(cells);
  }
  if (cols.length > 0) {
    for (let i = 0; i < rows.length; i++) {
      if (rows[i]!.length !== cols.length) {
        throw new ApiError(
          400,
          `"rows" has ${rows[i]!.length} cells in row ${i + 1} but "cols" declares ${cols.length} columns. Example: ?cols=A,B&rows=1:2;3:4`,
        );
      }
    }
  }

  const spec: TableSpec = { cols, rows };
  if (o['title'] !== undefined) {
    if (typeof o['title'] !== 'string') {
      throw new ApiError(400, `"title" must be a string. Got: ${JSON.stringify(o['title'])}`);
    }
    spec.title = clip(o['title'], MAX_TITLE);
  }
  return spec;
}
