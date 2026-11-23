// mermaid journey → draw 的 journey 参数。
//
// mermaid 语法:
//   journey
//       title My working day
//       section Go to work
//         Make tea: 5: Me
//         Go upstairs: 3: Me
//         Do work: 1: Me, Cat
//
// 翻过去:section= <段名>(按顺序),task= <段>|<任务>|<分数>|<参与者,…>。
// 事件行里第一个冒号后是分数(1–5),第二个冒号后是参与者(逗号分隔)。
import { bad, codeLines, unquote, type MermaidPlan } from './common.js';

/**
 * Translate a mermaid `journey` source into draw journey params.
 *
 * @throws ApiError(400) via `bad()` when the source has no tasks
 */
export function translateJourney(src: string): MermaidPlan {
  const params: [string, string][] = [];
  const sections: string[] = [];
  let title: string | undefined;

  for (const line of codeLines(src)) {
    // 首关键字只是抬头
    if (/^journey$/i.test(line)) continue;
    // title 行
    const tm = /^title\s+(.*)$/i.exec(line);
    if (tm) {
      title = unquote(tm[1]);
      continue;
    }
    // section 行:段名
    const sm = /^section\s+(.*)$/i.exec(line);
    if (sm) {
      const name = unquote(sm[1]);
      if (!name) bad('journey section needs a name');
      sections.push(name);
      continue;
    }
    // 任务行:`名字: 分数: 参与者`
    const parts = line.split(':');
    const name = parts[0].trim();
    if (!name) bad('journey task needs a name');
    const scoreRaw = (parts[1] ?? '').trim();
    const actors = (parts[2] ?? '').trim();
    if (!scoreRaw) bad(`journey task "${name}" needs a score (1-5)`);
    const score = Number(scoreRaw);
    if (!Number.isInteger(score) || score < 1 || score > 5) {
      bad(`journey task "${name}" score must be an integer 1-5 (got ${JSON.stringify(scoreRaw)})`);
    }
    const sec = sections[sections.length - 1] ?? (sections.push('Tasks'), 'Tasks');
    const actorList = actors.split(',').map((a) => a.trim()).filter(Boolean).join(',');
    params.push(['task', `${sec}|${name}|${score}${actorList ? `|${actorList}` : ''}`]);
  }

  if (!params.length) bad('journey needs at least one task');
  const out: [string, string][] = [];
  if (title) out.push(['title', title]);
  for (const s of sections) out.push(['section', s]);
  out.push(...params);
  return { kind: 'journey', params: out };
}
