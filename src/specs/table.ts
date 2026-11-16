// 表格的规格解析 —— 唯一真源在 @x-cmd/table/core(多维表格仓)。
//
// draw 这边只做转发:解析、规范化、校验、错误消息全在那边,
// 两边不会漂(见 x-cmd/draw#24)。
import {
  canonicalJson,
  parseSpec,
  specFromParams,
  type TableSpec,
} from '@x-cmd/table/core';

/**
 * URL 参数 → 规格的规范 JSON 字符串。
 *
 * 扁平参数(`cols=`/`rows=`)与 `?d=` JSON 都走同一套解析。
 *
 * @param params 查询参数
 */
export function tableSpecFromParams(params: URLSearchParams): string {
  return canonicalJson(specFromParams(params));
}

/**
 * 规格的 JSON 字符串 → 校验过的规格。
 *
 * @param raw JSON 字符串
 * @throws ApiError(400) with a corrective example on bad input
 */
export function parseTableSpec(raw: string): TableSpec {
  return parseSpec(raw);
}
