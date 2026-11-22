// mermaid erDiagram → draw 的 erd 参数。
//
// mermaid 的一行关系(`CUSTOMER ||--o{ ORDER : "places"`)拆成三样:
// 两个基数记号 + 两个实体名 + 一个动词。draw 的边只吃一个标签,
// 所以基数写前面(引擎认「1:N」这个前缀,画鱼尾记号),动词跟在后面。
// 属性块(`CUSTOMER { … }`)翻成节点里的多行成员表 —— 引擎按字段表画。
import { bad, codeLines, Ids, unquote, type MermaidPlan } from './common.js';

/** 基数记号 → 一端是「一」还是「多」:|| 是恰好一个,o|/|o 是零或一,|{ }o 是一或多个/零或多个 */
type Card = 'one' | 'many';
const CARDS: Record<string, Card> = {
  '||': 'one',   // exactly one
  'o|': 'one',   // zero or one
  '|o': 'one',   // zero or one(另一种写法)
  '|{': 'many',  // one or more
  '}o': 'many',  // zero or more
  'o{': 'many',  // one or more(另一种写法)
};

/** 一串基数记号(长的排前面 —— |{ 与 |o 前缀一样) */
const CARD_TOK = '\\|\\||o\\||\\|o|\\|\\{|\\}o|o\\{';

/** 关系行:<左> <基数>--<基数> <右> : 动词 —— 单横线与 .. 也认(mermaid 自己的变体) */
const REL_RE = new RegExp(
  `^(\\S+)\\s*(${CARD_TOK})\\s*(--|\\.\\.)\\s*(${CARD_TOK})\\s+(\\S+)\\s*(?::\\s*(.*))?$`,
);

/** 少了左边的名字(``}o--|| DELIVERY``)—— 实体还是认,边不画 */
const HALF_REL_RE = new RegExp(
  `^(${CARD_TOK})\\s*(--|\\.\\.)\\s*(${CARD_TOK})\\s+(\\S+)\\s*(?::\\s*(.*))?$`,
);

/** 属性块里的一行:`类型 名字 [PK|FK|UK]`(后面可以跟一段注释,丢掉) */
const ATTR_RE = /^(\S+)\s+(\S+)(.*)$/i;

interface Entity {
  name: string;
  id: string;
  rows: string[];
}

export function translateErd(src: string): MermaidPlan {
  const ids = new Ids();
  const entities = new Map<string, Entity>();
  const edges: [string, string, string][] = [];
  const lines = codeLines(src);
  // 属性块的行要先收着,等 } 才知道属于谁
  let block: { name: string; rows: string[] } | null = null;

  const entityOf = (name: string): Entity => {
    const hit = entities.get(name);
    if (hit) return hit;
    const e: Entity = { name, id: ids.get(name), rows: [] };
    entities.set(name, e);
    return e;
  };

  for (const line of lines) {
    // 首关键字 erDiagram 只是抬头,不是内容
    if (/^erDiagram$/i.test(line)) continue;
    // 属性块的开头:`CUSTOMER {`
    const open = /^(\S+)\s*\{\s*$/.exec(line);
    if (open) {
      block = { name: open[1], rows: [] };
      continue;
    }
    if (line === '}') {
      if (block) {
        const e = entityOf(block.name);
        e.rows = block.rows;
        block = null;
      }
      continue;
    }
    if (block) {
      const row = attrRow(line);
      if (row) block.rows.push(row);
      continue;
    }
    // 关系行
    const rel = REL_RE.exec(line);
    if (rel) {
      const [, left, lc, , rc, right, verbRaw] = rel;
      const l = entityOf(left);
      const r = entityOf(right);
      const card = `${CARDS[lc] === 'one' ? '1' : 'N'}:${CARDS[rc] === 'one' ? '1' : 'N'}`;
      const verb = unquote(verbRaw ?? '').trim();
      edges.push([l.id, r.id, verb ? `${card} ${verb}` : card]);
      continue;
    }
    // 少了一头的写法(`}o--|| DELIVERY`):实体认下,边画不出 —— 不猜
    const half = HALF_REL_RE.exec(line);
    if (half) entityOf(half[4]);
  }
  if (!entities.size) return bad('erDiagram needs at least one entity');

  const params: [string, string][] = [];
  for (const e of entities.values()) {
    const sub = e.rows.length ? e.rows.join('\n') : '';
    params.push(['n', sub ? `${e.id};table;${e.name};${sub}` : `${e.id};table;${e.name}`]);
  }
  for (const [from, to, label] of edges) params.push(['e', `${from};${to};${label}`]);
  return { kind: 'erd', params };
}

/**
 * 属性行 → 字段表的一行:`名字:类型 (pk)`。
 * 引擎的字段表认「名字:类型」+ 尾部「(pk)」,所以这里把 mermaid 的
 * 「类型 名字 PK」倒过来写。
 */
function attrRow(line: string): string {
  const m = ATTR_RE.exec(line.trim());
  if (!m) return '';
  const [, type, name, rest] = m;
  const base = `${name}:${type}`;
  const km = /\b(PK|FK|UK)\b/i.exec(rest);
  return km ? `${base} (${km[1].toLowerCase()})` : base;
}
