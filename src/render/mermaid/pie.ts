// mermaid pie → draw 的饼图参数(labels=/values=)。
//
// mermaid 的饼图正文是「标签 : 数值」一行一条;draw 的饼图要标签与数值两个平行数组。
// 标签里可能有逗号,所以标签一律用重复参数(labels=A&labels=B)——逗号列表会被切开。
import { bad, codeLines, unquote, type MermaidPlan } from './common.js';

/**
 * mermaid pie → draw 的饼图参数。
 *
 * "pie title X" → title=X;每条 `"Label" : 386` → 一个数据点。
 */
export function translatePie(src: string): MermaidPlan {
  const lines = codeLines(src);
  if (!lines.length) bad('pie needs at least one slice');
  const head = lines[0];
  if (!/^pie\b/i.test(head)) bad('pie source must start with "pie"');

  // 头部:可选的 title X 与 showData(纯显示开关,画法不变)
  let title = '';
  const rest = head.replace(/^pie\b/i, '').trim();
  if (/^title\b/i.test(rest)) {
    const after = rest.replace(/^title\b/i, '').trim();
    // 标题到 showData 之类的开关为止(其余都是标题的一部分)
    const cut = after.search(/\s+(showData)\b/i);
    title = unquote(cut < 0 ? after : after.slice(0, cut).trim());
  }

  const labels: string[] = [];
  const values: number[] = [];
  for (const line of lines.slice(1)) {
    // 标签里也能有冒号("A: B" : 5)—— 最后一个冒号才是分隔的那个
    const at = line.lastIndexOf(':');
    if (at < 0) bad(`pie: "${line}" needs a number after ":"`);
    const label = unquote(line.slice(0, at));
    const n = Number(line.slice(at + 1).trim());
    if (!Number.isFinite(n)) bad(`pie: "${line}" needs a number after ":"`);
    if (!label) bad(`pie: "${line}" needs a label before ":"`);
    labels.push(label);
    values.push(n);
  }
  if (!labels.length) bad('pie needs at least one slice');

  const params: [string, string][] = [];
  // 只有一个标签时 flatList 会按逗号再切一刀 —— 带逗号的标签改走 JSON 体
  if (labels.length === 1 && labels[0].includes(',')) {
    params.push(['d', JSON.stringify({ data: [{ label: labels[0], value: values[0] }] })]);
  } else {
    for (const l of labels) params.push(['labels', l]);
    params.push(['values', values.join(',')]);
  }
  if (title) params.push(['title', title]);
  return { kind: 'pie', params };
}
