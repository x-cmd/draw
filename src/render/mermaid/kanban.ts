// mermaid kanban → draw 的看板参数。
//
// mermaid v11+ 的语法:
//   kanban
//     Todo
//       task1[Implement the parser]
//       task2[Fix the layout]
//     Doing
//       task3[Draw the chart]
//
// 任务可以在标题后面挂元信息:{priority: high} —— 取整个花括号里的字当小字一行。
// 缩进决定列的归属:mermaid 用「列名下面缩进的任务属于该列」来表达。
//
// 翻成 draw 的扁平参数:
//   column=<列名>                    列,按出现顺序
//   task=<列名>|<标题>[|<元信息>]     任务卡
import { bad, stripNoise, type MermaidPlan } from './common.js';

const EXAMPLE = 'kanban\n  Todo\n    task1[Implement the parser]\n  Doing\n    task3[Draw the chart]';

/** `task1[Implement the parser]{priority: high}` → id / 标题 / 元信息 */
function parseTask(line: string): { title: string; meta?: string } {
  // 先摘花括号里的元信息
  let meta: string | undefined;
  let body = line;
  const brace = /\{([^}]*)\}/.exec(line);
  if (brace) {
    meta = brace[1].trim() || undefined;
    body = line.slice(0, brace.index) + line.slice(brace.index + brace[0].length);
  }
  // 摘方括号里的标题
  const sq = /\[([^\]]*)\]/.exec(body);
  if (sq) return { title: sq[1].trim(), ...(meta ? { meta } : {}) };
  // 没有方括号:整条(去掉任务 id 后的空格)就是标题
  const cleaned = body.replace(/^\S+\s*/, '').trim();
  return { title: cleaned || body.trim(), ...(meta ? { meta } : {}) };
}

export function translateKanban(src: string): MermaidPlan {
  const columns: string[] = [];
  const tasks: { column: string; title: string; meta?: string }[] = [];
  let current: string | undefined;
  // 缩进是相对的:整块源码可以整体缩进(嵌在别的文档里)。
  // 记下第一条有效行的缩进当「列」的基准,比它深的才是任务。
  let baseIndent: number | undefined;

  for (const raw of stripNoise(src).split(/\r?\n/)) {
    if (/^kanban$/i.test(raw.trim())) continue;
    const indent = raw.length - raw.trimStart().length;
    const line = raw.trim();
    if (!line) continue;

    if (baseIndent === undefined) baseIndent = indent;

    if (indent <= baseIndent) {
      // 列名(也可以带 id:sectionId)
      const name = line.replace(/^[A-Za-z0-9_.-]+\s*:\s*/, '').trim();
      if (!name) bad(`kanban column needs a name. Example: ${EXAMPLE}`);
      if (!columns.includes(name)) columns.push(name);
      current = name;
      continue;
    }

    if (!current) {
      // 缩进了但上面还没有列 —— 把这一行当成列名(mermaid 允许省略缩进)
      const name = line.replace(/^[A-Za-z0-9_.-]+\s*:\s*/, '').trim();
      if (!columns.includes(name)) columns.push(name);
      current = name;
      continue;
    }

    const { title, meta } = parseTask(line);
    if (!title) continue;
    tasks.push({ column: current, title, ...(meta ? { meta } : {}) });
  }

  if (!columns.length) bad('kanban needs at least one column');
  if (!tasks.length) bad('kanban needs at least one task');

  const params: [string, string][] = [];
  for (const c of columns) params.push(['column', c]);
  for (const t of tasks) params.push(['task', [t.column, t.title, t.meta ?? ''].join('|')]);
  return { kind: 'kanban', params };
}
