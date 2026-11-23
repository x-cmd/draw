// mermaid packet-beta → draw 的数据包图参数。
//
// mermaid 的数据包图一行一个字段:`起-止: "名字"`(比特区间,含两端)。
// 单个比特写 `起: "名字"` —— 止就是起。
//
// 翻成 draw 的参数:
//   field=<start>|<end>|<name>   可重复
//   title=<标题>
import { bad, codeLines, unquote, type MermaidPlan } from './common.js';

/** 字段行:`0-15: "Source Port"` / `0: "Flag"` */
const FIELD_RE = /^(\d+)\s*(?:-\s*(\d+))?\s*:\s*(.+)$/;

export function translatePacket(src: string): MermaidPlan {
  const fields: [number, number, string][] = [];

  for (const line of codeLines(src)) {
    // 首关键字 packet-beta 只是抬头
    if (/^packet-beta$/i.test(line)) continue;
    const m = FIELD_RE.exec(line);
    if (!m) continue; // 认不出来的行丢掉
    const start = Number(m[1]);
    const end = m[2] !== undefined ? Number(m[2]) : start;
    const name = unquote(m[3]).trim();
    if (!name) continue;
    fields.push([start, end, name]);
  }

  if (!fields.length) bad('packet-beta needs at least one field');

  const params: [string, string][] = [];
  for (const [start, end, name] of fields) {
    params.push(['field', `${start}|${end}|${name}`]);
  }
  return { kind: 'packet', params };
}
