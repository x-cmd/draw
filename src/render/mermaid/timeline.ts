// mermaid timeline → draw 的 timeline 参数。
//
// mermaid 语法:
//   timeline
//       title History of Social Media Platform
//       section 2002
//           LinkedIn : Founded
//           Facebook : Founded
//       section 2004
//           Google : Acquired YouTube
//
// 翻过去:section= <时期名>(按顺序),event= <段>|<事件>|<时期文字>。
// 事件行里冒号后面是事件的「时期文字」(可省);冒号前面是事件名。
// %% 注释与 title 行由 codeLines 处理。
import { bad, codeLines, unquote, type MermaidPlan } from './common.js';

/**
 * Translate a mermaid `timeline` source into draw timeline params.
 *
 * @throws ApiError(400) via `bad()` when the source has no events
 */
export function translateTimeline(src: string): MermaidPlan {
  const params: [string, string][] = [];
  const sections: string[] = [];
  let title: string | undefined;

  for (const line of codeLines(src)) {
    // 首关键字只是抬头
    if (/^timeline$/i.test(line)) continue;
    // title 行
    const tm = /^title\s+(.*)$/i.exec(line);
    if (tm) {
      title = unquote(tm[1]);
      continue;
    }
    // section 行:时期名
    const sm = /^section\s+(.*)$/i.exec(line);
    if (sm) {
      const name = unquote(sm[1]);
      if (!name) bad('timeline section needs a name');
      sections.push(name);
      continue;
    }
    // 事件行:`名字 : 时期文字`(时期文字可省)
    const ci = line.indexOf(':');
    const name = (ci < 0 ? line : line.slice(0, ci)).trim();
    const period = ci < 0 ? '' : unquote(line.slice(ci + 1).trim());
    if (!name) bad('timeline event needs a name');
    // 事件属于最后一个 section;没有 section 就落到一个隐身的默认段
    const sec = sections[sections.length - 1] ?? (sections.push('Events'), 'Events');
    params.push(['event', `${sec}|${name}${period ? `|${period}` : ''}`]);
  }

  if (!params.length) bad('timeline needs at least one event');
  const out: [string, string][] = [];
  if (title) out.push(['title', title]);
  for (const s of sections) out.push(['section', s]);
  out.push(...params);
  return { kind: 'timeline', params: out };
}
