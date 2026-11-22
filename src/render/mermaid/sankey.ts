// mermaid sankey-beta → draw 的桑基参数(labels=/links=)。
//
// mermaid 的桑基正文是 CSV:源,目标,权重。draw 的桑基要节点名单 + 一条条
// "From>To:weight" 的连线 —— 节点名按首次出现顺序收,连线一行一条。
import { bad, codeLines, type MermaidPlan } from './common.js';

/**
 * mermaid sankey-beta → draw 的桑基参数。
 *
 * 每行 `Source,Target,124.729` → labels 收节点名、links 收一条流向。
 */
export function translateSankey(src: string): MermaidPlan {
  const lines = codeLines(src);
  if (!lines.length) bad('sankey-beta needs at least one row');
  const head = lines[0];
  if (!/^sankey-beta\b/i.test(head)) bad('sankey-beta source must start with "sankey-beta"');

  const names: string[] = [];
  const seen = new Set<string>();
  const addName = (n: string): void => {
    if (seen.has(n)) return;
    seen.add(n);
    names.push(n);
  };
  const links: string[] = [];
  for (const line of lines.slice(1)) {
    // CSV:源,目标,权重(权重可以是 124.729 这样的小数)
    const parts = line.split(',').map((p) => p.trim());
    if (parts.length < 3 || !parts[0] || !parts[1]) {
      bad(`sankey-beta: "${line}" needs "source,target,value"`);
    }
    const from = parts[0];
    const to = parts[1];
    const value = Number(parts[2]);
    if (!Number.isFinite(value) || value <= 0) bad(`sankey-beta: "${line}" needs a positive number`);
    // 连线的写法是 "From>To:weight" —— 名字里带这两个符号会把连线切坏
    if (/[>:]/.test(from) || /[>:]/.test(to)) {
      bad(`sankey-beta: "${line}" — node names must not contain ">" or ":"`);
    }
    addName(from);
    addName(to);
    links.push(`${from}>${to}:${value}`);
  }
  if (!links.length) bad('sankey-beta needs at least one row');

  const params: [string, string][] = [];
  for (const n of names) params.push(['labels', n]);
  for (const l of links) params.push(['links', l]);
  return { kind: 'sankey', params };
}
