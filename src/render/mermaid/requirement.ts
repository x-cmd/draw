// mermaid requirementDiagram → draw 的需求图参数。
//
// mermaid 的需求图有两样东西:需求(requirement)与要素(element),外加它们之间的关系。
//   requirement test_req {      一条需求
//     id: 1
//     text: the test text.
//     risk: high
//     verifymethod: test
//   }
//   element test_entity {        一个要素
//     type: simulation
//   }
//   test_entity - satisfies -> test_req    一条关系(A 满足 B)
//
// 翻成 draw 的三个参数:
//   req=<name>|<id>|<text>|<risk>|<verifymethod>   可重复
//   el=<name>|<type>                              可重复
//   rel=<from>|<to>|<type>                        可重复
import { bad, codeLines, unquote, type MermaidPlan } from './common.js';

/** 需求/要素的块:`requirement <name> {` / `element <name> {` */
const DECL_RE = /^(requirement|element)\s+([A-Za-z0-9_.-]+)\s*\{\s*$/i;

/** 块里的一行:`id: 1` / `risk: high` / `type: simulation` */
const FIELD_RE = /^([A-Za-z_][A-Za-z0-9_]*)\s*:\s*(.*)$/;

/** 关系行:`<左> - <类型> -> <右>`(类型可有可无) */
const REL_RE = /^(\S+)\s*(?:-\s*([A-Za-z_][A-Za-z0-9_]*)\s*)?->\s*(\S+)$/;

/** 风险等级:认识的几个 */
const RISKS = ['high', 'medium', 'low'];

export function translateRequirement(src: string): MermaidPlan {
  const reqs: string[][] = [];   // [name, id, text, risk, verifymethod]
  const els: string[][] = [];    // [name, type]
  const rels: [string, string, string][] = [];

  // 当前块:null = 不在块里
  let block: { kind: 'req' | 'el'; name: string; fields: Map<string, string> } | null = null;

  for (const line of codeLines(src)) {
    // 首关键字 requirementDiagram 只是抬头
    if (/^requirementDiagram$/i.test(line)) continue;

    // 块的开头
    const dm = DECL_RE.exec(line);
    if (dm) {
      block = { kind: dm[1].toLowerCase() === 'requirement' ? 'req' : 'el', name: dm[2], fields: new Map() };
      continue;
    }
    if (line === '}') {
      if (block) {
        if (block.kind === 'req') {
          const f = block.fields;
          const risk = (f.get('risk') ?? '').trim().toLowerCase();
          reqs.push([
            block.name,
            (f.get('id') ?? '').trim(),
            (f.get('text') ?? '').trim(),
            RISKS.includes(risk) ? risk : '',
            (f.get('verifymethod') ?? '').trim(),
          ]);
        } else {
          els.push([block.name, (block.fields.get('type') ?? '').trim()]);
        }
        block = null;
      }
      continue;
    }
    if (block) {
      const fm = FIELD_RE.exec(line);
      if (fm) block.fields.set(fm[1].toLowerCase(), unquote(fm[2]).trim());
      continue;
    }

    // 关系行
    const rm = REL_RE.exec(line);
    if (rm) {
      const [, left, type, right] = rm;
      rels.push([left, right, (type ?? 'relates').trim().toLowerCase()]);
      continue;
    }
    // 认不出来的行丢掉(requirementDiagram 没有别的记号)
  }

  if (!reqs.length && !els.length && !rels.length) {
    bad('requirementDiagram needs at least one requirement or element');
  }

  // 关系里提到但没声明过的名字:补成空需求(边要有落点)
  const declared = new Set([...reqs.map((r) => r[0]), ...els.map((e) => e[0])]);
  for (const [from, to] of rels) {
    for (const n of [from, to]) {
      if (!declared.has(n)) {
        declared.add(n);
        reqs.push([n, '', '', '', '']);
      }
    }
  }

  const params: [string, string][] = [];
  for (const r of reqs) params.push(['req', r.join('|')]);
  for (const e of els) params.push(['el', e.join('|')]);
  for (const [from, to, type] of rels) params.push(['rel', `${from}|${to}|${type}`]);
  return { kind: 'requirement', params };
}
