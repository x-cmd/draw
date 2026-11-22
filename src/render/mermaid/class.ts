// mermaid classDiagram → draw 的 class 参数。
//
// mermaid 的关系记号带方向(`A <|-- B` 是 B 继承 A),draw 的边只有一个方向:
// 引擎把空心三角画在边的终点 —— 所以方向反了就翻过来写边。
// 边的标签:extends/implements 只能写那一个词(引擎靠它认 UML 三角,
// 多一个字三角就没了),别的记号可以把作者写的动词跟在后面。
import { bad, codeLines, Ids, unquote, type MermaidPlan } from './common.js';

/** draw 的 class 词汇:类 / 接口 / 枚举 */
type NodeType = 'class' | 'iface' | 'enum';

/** 构造型 → 节点类型;没列出的(abstract、service…)都当普通类 */
const STEREOTYPE: Record<string, NodeType> = {
  interface: 'iface',
  enumeration: 'enum',
  enum: 'enum',
};

/** 关系记号 → 边的方向与标签。dir: 'src' = 源→目标,'tgt' = 目标→源 */
const RELS: Record<string, { dir: 'src' | 'tgt'; label: string }> = {
  '<|--': { dir: 'src', label: 'extends' },    // A <|-- B:B 继承 A → 三角指 B
  '--|>': { dir: 'tgt', label: 'extends' },    // A --|> B:A 继承 B → 三角指 A
  '<|..': { dir: 'src', label: 'implements' },
  '..|>': { dir: 'tgt', label: 'implements' },
  '*--': { dir: 'src', label: 'extends' },
  '--*': { dir: 'tgt', label: 'extends' },
  'o--': { dir: 'src', label: 'aggregates' },
  '--o': { dir: 'tgt', label: 'aggregates' },
  '<--': { dir: 'src', label: 'uses' },
  '-->': { dir: 'src', label: 'uses' },
  '--': { dir: 'src', label: 'uses' },
  '..>': { dir: 'src', label: 'depends on' },
  '..': { dir: 'src', label: 'depends on' },
};

/** 长的记号排在前面(否则 "-->" 会被 "--" 吃掉) */
const CONN = ['<\\|--', '--\\|>', '<\\|\\.\\.', '\\.\\.\\|>', '\\*--', '--\\*', 'o--', '--o', '<--', '-->', '--', '\\.\\.>', '\\.\\.'].join('|');

/** 基数:mermaid 写成 "1" 或 1 —— 只认带引号的或纯数字,免得把 o-- 的 o 当成基数吃掉 */
const CARD = '"[^"]*"|\\d+';

/** 关系行:<左> [基数] 记号 [基数] <右> [: 动词] */
const REL_RE = new RegExp(
  `^(\\S+)\\s+(?:(${CARD})\\s*)?(${CONN})\\s+(?:(${CARD})\\s+)?(\\S+?)\\s*(?::\\s*(.*))?$`,
);

/** 构造型:`<<interface>> Shape` */
const STEREO_RE = /^<<\s*([^>]+?)\s*>>\s*(\S+)$/;

/** 声明:`class Animal` / `class Animal {` / `class Animal : +int age` */
const DECL_RE = /^class\s+(\S+?)\s*(?:\{(.*)|(?::\s*(.*)))?$/;

interface Cls {
  name: string;
  id: string;
  type: NodeType;
  rows: string[];
}

export function translateClass(src: string): MermaidPlan {
  const ids = new Ids();
  const classes = new Map<string, Cls>();
  const edges: [string, string, string][] = [];
  let block: Cls | null = null;

  const clsOf = (name: string): Cls => {
    const hit = classes.get(name);
    if (hit) return hit;
    const c: Cls = { name, id: ids.get(name), type: 'class', rows: [] };
    classes.set(name, c);
    return c;
  };

  for (const line of codeLines(src)) {
    if (/^classDiagram$/i.test(line)) continue;
    // 块里的成员
    if (block) {
      if (line === '}') { block = null; continue; }
      const st = STEREO_RE.exec(line);
      if (st) { block.type = STEREOTYPE[st[1].toLowerCase()] ?? 'class'; continue; }
      const row = memberRow(line);
      if (row) block.rows.push(row);
      continue;
    }
    // 构造型:`<<interface>> Shape`
    const st = STEREO_RE.exec(line);
    if (st) {
      const name = cleanName(st[2]);
      clsOf(name).type = STEREOTYPE[st[1].toLowerCase()] ?? 'class';
      continue;
    }
    // 声明:`class Animal {` / `class Car`
    const dec = DECL_RE.exec(line);
    if (dec) {
      const name = cleanName(dec[1]);
      const c = clsOf(name);
      if (dec[2] !== undefined) {
        // `class Animal {` —— 后面是大括号,成员一行行来
        block = c;
        const inner = dec[2].trim();
        if (inner) {
          const row = memberRow(inner);
          if (row) c.rows.push(row);
        }
      } else if (dec[3]) {
        // `class Duck : +int age` —— 成员写在声明后面
        const row = memberRow(dec[3]);
        if (row) c.rows.push(row);
      }
      continue;
    }
    // 关系行
    const rel = REL_RE.exec(line);
    if (rel) {
      const [, left, , conn, , right, verbRaw] = rel;
      const spec = RELS[conn];
      if (!spec) continue;
      const a = clsOf(cleanName(left));
      const b = clsOf(cleanName(right));
      const verb = unquote(verbRaw ?? '').trim();
      // 三角靠标签里的 "extends"/"implements" 认 —— 动词放进去就认不出了,只能丢
      const label = spec.label === 'extends' || spec.label === 'implements'
        ? spec.label
        : verb && verb.toLowerCase() !== spec.label.toLowerCase()
          ? `${spec.label} ${verb}`
          : spec.label;
      edges.push(spec.dir === 'src' ? [a.id, b.id, label] : [b.id, a.id, label]);
      continue;
    }
    // 块外的成员:`Duck : +int age`
    const mem = /^(\S+)\s*:\s*(.+)$/.exec(line);
    if (mem) {
      const c = clsOf(cleanName(mem[1]));
      const row = memberRow(mem[2]);
      if (row) c.rows.push(row);
      continue;
    }
    // 认不出来的行(direction、classDef、note…)丢掉 —— 类图不缺这一块
  }

  if (!classes.size) return bad('classDiagram needs at least one class');

  const params: [string, string][] = [];
  for (const c of classes.values()) {
    const sub = c.rows.length ? c.rows.join('\n') : '';
    params.push(['n', sub ? `${c.id};${c.type};${c.name};${sub}` : `${c.id};${c.type};${c.name}`]);
  }
  for (const [from, to, label] of edges) params.push(['e', `${from};${to};${label}`]);
  return { kind: 'class', params };
}

/** 类名后面可能挂着样式(`Shape:::cls`)—— 去掉 */
function cleanName(raw: string): string {
  return raw.replace(/:::[\w-]+$/, '').trim();
}

/**
 * 成员行 → 字段表的一行。
 *
 * mermaid 写「可见性 + 类型 + 名字」(+int age),draw 的字段表写
 * 「可见性 + 名字 + : + 类型」(+ age:int)—— 名字与类型要换位,
 * 可见性后面还要补一个空格(引擎按「标记 + 空格」认可见性)。
 * 带括号的是方法:整体当名字,类型交给引擎自己切(它认括号外的第一个冒号)。
 */
function memberRow(line: string): string {
  let s = line.trim();
  if (!s) return '';
  let vis = '';
  if (/^[+\-#]/.test(s)) {
    vis = s[0];
    s = s.slice(1).trim();
  }
  if (!s) return '';
  let name: string;
  let type = '';
  if (s.includes('(')) {
    name = s;                       // 方法:整体当名字
  } else {
    const i = s.lastIndexOf(' ');
    if (i < 0) {
      name = s;                     // 没有类型,只有名字
    } else {
      type = s.slice(0, i).trim();
      name = s.slice(i + 1).trim();
    }
  }
  if (!name) return '';
  const body = type ? `${name}:${type}` : name;
  return vis ? `${vis} ${body}` : body;
}
