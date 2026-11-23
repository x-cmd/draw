// mermaid gitGraph → draw 的提交图参数。
//
// mermaid 的语法:
//   commit id:"one"          一个提交(可带 id / tag / type / order 等属性)
//   commit "message"         带标题的提交(引号里就是标题)
//   branch develop           从当前位置开一条新分支
//   checkout develop         切到某条分支
//   merge develop            把 develop 并进当前分支
//   tag v1.0                 给当前提交打标签
//   cherry-pick id:"x"       摘一个提交(当作普通提交记)
//
// 翻成 draw 的扁平参数:
//   branch=<名字>                            分支(泳道),按出现顺序
//   commit=<id>|<lane>|<label>|<p1>|<p2>     提交
//
// 语义要点:merge <name> 是把 name 并进**当前**分支 —— 当前分支得到一个新提交,
// 它有两个父(当前分支的头 + name 的头)。
import { bad, codeLines, unquote, type MermaidPlan } from './common.js';

interface Commit {
  id: string;
  lane: string;
  label?: string;
  parent?: string;
  parent2?: string;
}

const EXAMPLE = 'gitGraph\n  commit id:"one"\n  branch develop\n  checkout develop\n  commit id:"two"\n  checkout main\n  merge develop';

/** 属性串:id:"one" tag:"v1" type:"NORMAL" —— 拆成键值对 */
function attrs(raw: string): Map<string, string> {
  const out = new Map<string, string>();
  const re = /([A-Za-z_][A-Za-z0-9_]*)\s*:\s*"([^"]*)"|([A-Za-z_][A-Za-z0-9_]*)\s*:\s*([^\s]+)/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(raw)) !== null) {
    if (m[1] !== undefined) out.set(m[1].toLowerCase(), m[2]);
    else out.set(m[3].toLowerCase(), m[4]);
  }
  return out;
}

/** 属性引号(id:"…" / tag:"…")先摘掉,剩下的引号内容才是标题 */
const stripAttrs = (s: string): string => s.replace(/\b(?:id|tag|type|order)\s*:\s*"[^"]*"/gi, '');

/** 标题:属性之外的引号内容;没有引号就用裸词 */
function labelOf(rest: string): string | undefined {
  const left = stripAttrs(rest);
  const m = /"([^"]*)"/.exec(left);
  if (m) return m[1];
  const bare = left.trim();
  return bare === '' ? undefined : bare;
}

export function translateGitGraph(src: string): MermaidPlan {
  const branches: string[] = [];   // 泳道(按创建顺序)
  const commits: Commit[] = [];
  const head = new Map<string, string>();   // 分支 → 它的头提交 id
  let current = 'main';                     // 当前分支
  let seq = 0;

  const ensureBranch = (name: string): void => {
    if (!branches.includes(name)) branches.push(name);
  };
  ensureBranch(current);

  for (const line of codeLines(src)) {
    const kw = /^([A-Za-z][A-Za-z0-9_-]*)(?=\s|$)\s*(.*)$/.exec(line);
    if (!kw) continue;
    const key = kw[1].toLowerCase();
    const rest = kw[2].trim();
    if (key === 'gitgraph') continue;

    if (key === 'branch' || key === 'checkout' || key === 'switch') {
      const name = unquote(rest.split(/\s+/)[0] ?? '');
      if (!name) bad(`${key} needs a branch name. Example: ${EXAMPLE}`);
      if (key === 'branch') {
        // 新分支从当前 HEAD 长出来(分叉点 = 当前分支的头提交),
        // 但它是新泳道,不接管当前分支
        if (!branches.includes(name)) {
          ensureBranch(name);
          const fork = head.get(current);
          if (fork) head.set(name, fork);
        }
        continue;
      }
      if (!branches.includes(name)) ensureBranch(name);
      current = name;
      continue;
    }

    if (key === 'commit' || key === 'cherry-pick') {
      const a = attrs(rest);
      const id = a.get('id') ?? `c${++seq}`;
      const label = labelOf(rest);
      const parent = head.get(current);
      commits.push({
        id,
        lane: current,
        ...(label ? { label } : {}),
        ...(parent ? { parent } : {}),
      });
      head.set(current, id);
      continue;
    }

    if (key === 'merge') {
      const name = unquote(rest.split(/\s+/)[0] ?? '');
      if (!name) bad(`merge needs a branch name. Example: ${EXAMPLE}`);
      if (!branches.includes(name)) ensureBranch(name);
      const parent = head.get(current);
      const other = head.get(name);
      const id = `m${++seq}`;
      const label = labelOf(rest.replace(/^\S+/, ''));
      commits.push({
        id,
        lane: current,
        ...(label ? { label } : {}),
        ...(parent ? { parent } : {}),
        ...(other ? { parent2: other } : {}),
      });
      head.set(current, id);
      continue;
    }

    if (key === 'tag') {
      // 标签挂在当前提交上 —— draw 的提交图没有单独的标签层,
      // 把它并进当前提交的文字里(信息不丢)
      const tag = unquote(rest);
      if (!tag) continue;
      const last = commits[commits.length - 1];
      if (last) last.label = last.label ? `${last.label} [${tag}]` : `[${tag}]`;
      continue;
    }
    // 其他关键字(方向/选项之类)没有对应件,静默跳过
  }

  if (!commits.length) bad('gitGraph needs at least one commit');

  const params: [string, string][] = [];
  for (const b of branches) params.push(['branch', b]);
  for (const c of commits) {
    params.push(['commit', [c.id, c.lane, c.label ?? '', c.parent ?? '', c.parent2 ?? ''].join('|')]);
  }
  return { kind: 'gitgraph', params };
}
