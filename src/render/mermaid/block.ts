// mermaid block-beta → draw 的方块图参数。
//
// mermaid 的方块图是一格格摆出来的:
//   columns 3            当前列数(每行放几格)
//   a["A"] b["B"]        一行里的格子(空格分隔)
//   d space:2            d 后面空两格
//   block:group1:2       开一个宽两格的组(接下来的格子归它)
//   e["E"] --> f["F"]    箭头
//
// 翻成 draw 的四个参数:
//   cols=<列数>
//   item=<id>|<col>|<label>|<groupId>    一格:第几列、叫什么、属于哪个组
//   block=<id>|<col>|<col>|…|<label>     一个组:罩住哪几列、叫什么
//   edge=<from>|<to>
//
// 格子怎么落到列上:维护一个「光标」(当前行已用了几格)。摆一格 → 光标右移一格;
// 到行尾(列数满了)→ 换行,光标归零。space:N → 光标右移 N 格(跨行时先换行)。
// block:ID:N → 记住这个组从当前光标开始、占 N 列;组里的格子都带上这个组 id。
import { bad, codeLines, Ids, unquote, type MermaidPlan } from './common.js';

/** 一格 */
interface Cell {
  id: string;
  label: string;
  col: number;
  group?: string;
}

/** 一个组:罩住哪几列 */
interface Group {
  id: string;
  label: string;
  cols: number[];
}

/** 一格:`id["label"]` / `id[label]` / `id(label)` / `id` */
const CELL_RE = /^([A-Za-z0-9_.-]+)\s*(?:\[\s*"([\s\S]*?)"\s*\]|\[\s*([\s\S]*?)\s*\]|\(\s*"([\s\S]*?)"\s*\)|\(\s*([\s\S]*?)\s*\))?$/;

/** space:N —— 空几格 */
const SPACE_RE = /^space:(\d+)$/i;

/** block:ID:N —— 组 id 与它占的列数 */
const BLOCK_RE = /^block:([A-Za-z0-9_.-]+)(?::(\d+))?$/i;

/** 箭头记号:`-->`, `--`, `-.->`, `--x`, `==>`, `<--` 等 */
const ARROW_RE = /(?:\.\.-+>|--+[x>]|==+>|<==|--+|<--+|--)/;

export function translateBlock(src: string): MermaidPlan {
  const ids = new Ids();
  const cells: Cell[] = [];
  const groups: Group[] = [];
  const edges: [string, string][] = [];
  // 当前列数(没写 columns 就是 1 —— mermaid 的默认)
  let cols = 1;
  // 用过的最大列数(列数可以中途改 —— 画布按最大的那个算)
  let maxCols = 1;
  // 光标:当前行用了几格
  let cursor = 0;
  // 当前开的组(还没遇到下一个 block: 指令)
  let openGroup: Group | null = null;
  // 组开在哪一列(组的框从这一列起)
  let groupStartCol = 0;
  // 组占的列数
  let groupWidth = 0;
  // 组已经放进去的格数
  let groupUsed = 0;
  // 前头有个箭头等着配对(下一格就是它的落点)
  let pendingArrow = false;

  /** 光标右移 n 格(跨行时先换行) */
  const advance = (n: number): void => {
    for (let i = 0; i < n; i++) {
      cursor++;
      if (cursor >= cols) cursor = 0;
    }
  };

  for (const line of codeLines(src)) {
    // 首关键字 block-beta 只是抬头
    if (/^block-beta$/i.test(line)) continue;

    // columns N —— 改列数
    const cm = /^columns\s+(\d+)$/i.exec(line);
    if (cm) {
      const n = Number(cm[1]);
      if (n < 1) bad('block-beta: columns must be at least 1');
      cols = n;
      maxCols = Math.max(maxCols, n);
      // 列数变了 → 换行重开(列号是相对当前行的,变了就得重来)
      if (cursor > 0) cursor = 0;
      continue;
    }

    // 一行里可能有多个格子,还夹着箭头:先按箭头切,再按记号切格子
    for (const seg of splitByArrow(line)) {
      if (seg.arrow) {
        // 箭头:两端是它前后的那两格 —— 前面的格子已经摆好了,后面那格还没摆。
        // 所以先记下「待配对」,等下一格摆好再补。
        pendingArrow = true;
        continue;
      }
      // 一段里可能有若干记号:a["A"] b["B"] space:2 block:g1:2
      for (const tok of tokenize(seg.text)) {
        const t = tok.trim();
        if (!t) continue;
        // block:ID:N —— 开一个组(可以跟别的记号写在同一行)
        const bm = BLOCK_RE.exec(t);
        if (bm) {
          const gid = bm[1];
          const span = bm[2] ? Number(bm[2]) : 1;
          const g: Group = { id: gid, label: gid, cols: [] };
          groups.push(g);
          openGroup = g;
          groupWidth = Math.max(1, span);
          groupUsed = 0;
          groupStartCol = cursor;
          continue;
        }
        // space:N —— 空几格
        const sm = SPACE_RE.exec(t);
        if (sm) {
          advance(Number(sm[1]));
          continue;
        }
        // 一个格子
        const cm2 = CELL_RE.exec(t);
        if (!cm2) continue; // 认不出来的记号丢掉(方块图不缺这一块)
        const id = ids.get(cm2[1]);
        const label = unquote(cm2[2] ?? cm2[3] ?? cm2[4] ?? cm2[5] ?? cm2[1]);
        const col = cursor;
        const cell: Cell = { id, label, col };
        if (openGroup) {
          cell.group = openGroup.id;
          // 组罩住的列:开组那格起,连着 groupWidth 列
          // (中途改过列数的话,成员实际落在哪几列就罩哪几列)
          for (let c = groupStartCol; c < groupStartCol + groupWidth; c++) {
            if (!openGroup.cols.includes(c)) openGroup.cols.push(c);
          }
          if (!openGroup.cols.includes(col)) openGroup.cols.push(col);
          groupUsed++;
          // 组放满了 → 关掉(下一个格子不再属于它)
          if (groupUsed >= groupWidth) openGroup = null;
        }
        cells.push(cell);
        // 前头有个箭头 → 这一格就是箭头的落点
        if (pendingArrow) {
          pendingArrow = false;
          const prev = cells[cells.length - 2];
          if (prev) edges.push([prev.id, cell.id]);
        }
        advance(1);
      }
    }
  }

  if (!cells.length) bad('block-beta needs at least one block');

  const params: [string, string][] = [];
  // 列数:用过的最大列数(列数可以中途改)与最右那一格 —— 两者取大
  params.push(['cols', String(Math.max(maxCols, ...cells.map((c) => c.col + 1)))]);
  for (const c of cells) {
    params.push(['item', `${c.id}|${c.col}|${c.label}${c.group ? `|${c.group}` : ''}`]);
  }
  for (const g of groups) {
    if (!g.cols.length) continue;
    params.push(['block', `${g.id}|${g.cols.join('|')}|${g.label}`]);
  }
  for (const [from, to] of edges) params.push(['edge', `${from}|${to}`]);
  return { kind: 'block', params };
}

/**
 * 切记号:空格是分隔符,但引号里/方括号里的空格不算
 * (`e["Error path"]` 是一个记号,不是三个)。
 */
function tokenize(text: string): string[] {
  const out: string[] = [];
  let buf = '';
  let quote = '';   // 当前的引号(' 或 ")
  let depth = 0;    // 方括号/圆括号的层数
  for (const ch of text) {
    if (quote) {
      buf += ch;
      if (ch === quote) quote = '';
      continue;
    }
    if (ch === '"' || ch === "'") {
      quote = ch;
      buf += ch;
      continue;
    }
    if (ch === '[' || ch === '(') {
      depth++;
      buf += ch;
      continue;
    }
    if (ch === ']' || ch === ')') {
      if (depth > 0) depth--;
      buf += ch;
      continue;
    }
    if (/\s/.test(ch) && depth === 0) {
      if (buf) out.push(buf);
      buf = '';
      continue;
    }
    buf += ch;
  }
  if (buf) out.push(buf);
  return out;
}

/**
 * 一行按箭头切成几段:每段要么是格子,要么是一个箭头。
 *
 * 箭头本身没有名字 —— 它的两端是行里前后那两个格子。
 */
function splitByArrow(line: string): { text: string; arrow: boolean }[] {
  const out: { text: string; arrow: boolean }[] = [];
  let buf = '';
  let i = 0;
  let quote = '';   // 引号里 / 方括号里的箭头记号不算箭头
  let depth = 0;
  while (i < line.length) {
    const ch = line[i];
    if (quote) {
      buf += ch;
      if (ch === quote) quote = '';
      i++;
      continue;
    }
    if (ch === '"' || ch === "'") {
      quote = ch;
      buf += ch;
      i++;
      continue;
    }
    if (ch === '[' || ch === '(') {
      depth++;
      buf += ch;
      i++;
      continue;
    }
    if (ch === ']' || ch === ')') {
      if (depth > 0) depth--;
      buf += ch;
      i++;
      continue;
    }
    const m = depth === 0 ? ARROW_RE.exec(line.slice(i)) : null;
    if (m && m.index === 0) {
      if (buf.trim()) out.push({ text: buf, arrow: false });
      out.push({ text: m[0], arrow: true });
      buf = '';
      i += m[0].length;
      continue;
    }
    buf += ch;
    i++;
  }
  if (buf.trim()) out.push({ text: buf, arrow: false });
  return out;
}
