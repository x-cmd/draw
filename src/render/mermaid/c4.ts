// mermaid C4(C4Context/C4Container/C4Component/C4Dynamic/C4Deployment)
// → draw 的 C4 图种参数(n=/e=/b= —— 与架构图同一套语法,只是换了 C4 词汇)。
//
// C4 的行是「声明式」的:一行一个元素,元素名 + 括号里的参数。
// 边界(Syste_Boundary)是一个带花括号的块,里面的元素归它管。
import { bad, codeLines, type MermaidPlan } from './common.js';

/** C4 元素名 → draw 的类型词汇 */
const ELEMENTS: Record<string, string> = {
  person: 'person',
  person_ext: 'external',
  system: 'system',
  system_ext: 'external',
  systemdb: 'system',
  container: 'container',
  containerdb: 'container',
  component: 'component',
  componentdb: 'component',
};

/** 拆一行里的参数:"a, "b", "c" d" → ['a','b','c d'] */
function argsOf(rest: string): string[] {
  const out: string[] = [];
  let cur = '';
  let quoted = false;
  for (let i = 0; i < rest.length; i++) {
    const c = rest[i];
    if (c === '"') {
      quoted = !quoted;
      continue;
    }
    if (c === ',' && !quoted) {
      out.push(cur.trim());
      cur = '';
      continue;
    }
    cur += c;
  }
  if (cur.trim()) out.push(cur.trim());
  return out;
}

/** 一行声明的元素:`System(alias, "Label", "Description")` */
function declOf(line: string): { kind: string; args: string[] } | null {
  const m = /^([A-Za-z_][A-Za-z0-9_]*)\s*\((.*)\)\s*$/.exec(line);
  if (!m) return null;
  return { kind: m[1].toLowerCase(), args: argsOf(m[2]) };
}

/** C4 源码 → draw 的 C4 图种参数 */
export function translateC4(src: string): MermaidPlan {
  const params: [string, string][] = [];
  const nodes: string[] = [];
  const edges: string[] = [];
  const boundaries: string[] = [];
  const byId = new Map<string, string>(); // C4 别名 → draw 的节点 id
  const ids = new Set<string>();
  const safe = (raw: string): string => {
    let id = raw.replace(/[^A-Za-z0-9_.-]/g, '_');
    if (!/^[A-Za-z0-9]/.test(id)) id = 'n' + id;
    if (!id) id = 'n';
    let n = id;
    let k = 2;
    while (ids.has(n)) {
      n = `${id}_${k}`;
      k++;
    }
    ids.add(n);
    return n;
  };

  let boundaryStack: { label: string; members: string[] }[] = [];
  const lines = codeLines(src);
  for (let i = 0; i < lines.length; i++) {
    let line = lines[i];
    // 花括号块:边界
    const bOpen = /^([A-Za-z_][A-Za-z0-9_]*)\s*\((.*)\)\s*\{\s*$/.exec(line);
    if (bOpen && /_boundary$/i.test(bOpen[1])) {
      const args = argsOf(bOpen[2]);
      boundaryStack.push({ label: args[1] ?? args[0] ?? 'Boundary', members: [] });
      // 找到配对的 }
      let depth = 1;
      const inner: string[] = [];
      for (let j = i + 1; j < lines.length && depth > 0; j++) {
        const l = lines[j];
        depth += (l.match(/\{/g) ?? []).length - (l.match(/\}/g) ?? []).length;
        if (depth === 0) {
          i = j;
          break;
        }
        inner.push(l);
      }
      // 块里的元素归这个边界
      for (const l of inner) {
        const d = declOf(l);
        if (!d) continue;
        const type = ELEMENTS[d.kind];
        if (!type) continue;
        const alias = d.args[0] ?? d.args[1] ?? 'x';
        const label = d.args[1] ?? alias;
        const desc = d.args[2] ?? '';
        const id = safe(alias);
        byId.set(alias, id);
        nodes.push(`${id};${type};${label}${desc ? `;${desc}` : ''}`);
        boundaryStack[boundaryStack.length - 1].members.push(id);
      }
      const b = boundaryStack.pop()!;
      if (b.members.length) boundaries.push(`b=${b.label};${b.members.join(' ')}`);
      continue;
    }
    if (/^\}/.test(line)) {
      const b = boundaryStack.pop();
      if (b && b.members.length) boundaries.push(`b=${b.label};${b.members.join(' ')}`);
      continue;
    }
    // 关系
    const rel = /^(BiRel|Rel|UpdateRelStyle)\s*\((.*)\)\s*$/.exec(line);
    if (rel) {
      const args = argsOf(rel[2]);
      const from = byId.get(args[0] ?? '');
      const to = byId.get(args[1] ?? '');
      if (!from || !to) continue; // 关系引用的元素还没声明(顺序反了)⇒ 跳过
      const label = args[2] ?? '';
      const tech = args[3] ?? '';
      edges.push(`${from};${to};${tech ? `${label} · ${tech}` : label}`);
      continue;
    }
    // 元素
    const d = declOf(line);
    if (!d) continue;
    const type = ELEMENTS[d.kind];
    if (!type) continue;
    const alias = d.args[0] ?? d.args[1] ?? 'x';
    const label = d.args[1] ?? alias;
    const desc = d.args[2] ?? '';
    const id = safe(alias);
    byId.set(alias, id);
    nodes.push(`${id};${type};${label}${desc ? `;${desc}` : ''}`);
    if (boundaryStack.length) boundaryStack[boundaryStack.length - 1].members.push(id);
  }
  // 收尾:没闭合的边界
  for (const b of boundaryStack) {
    if (b.members.length) boundaries.push(`b=${b.label};${b.members.join(' ')}`);
  }
  if (!nodes.length) bad('C4 needs at least one element (Person/System/Container/Component)');
  const title = lines.find((l) => /^title\s+/i.test(l))?.replace(/^title\s+/i, '').trim();
  if (title) params.push(['title', title]);
  for (const n of nodes) params.push(['n', n]);
  for (const e of edges) params.push(['e', e]);
  for (const b of boundaries) params.push(['b', b]);
  return { kind: 'c4', params };
}
