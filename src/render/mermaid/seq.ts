// mermaid sequenceDiagram → draw 的时序图参数。
//
// 时序图翻过去是三样东西:参与方、消息、分支框。
//   n=id;type;label          参与方(participant→be,actor→ext)
//   e=from;to[;label][;dash] 消息;URL 里的先后就是发生的先后
//   f=kind;label;start;end   分支框,罩住第 start..end 条消息(含两端)
//
// mermaid 还有一堆渲染花样(Note/activate/rect/autonumber/link),
// draw 的时序图引擎没有对应件 —— 与其画个不像的,不如丢掉,只画能画准的那部分。
import { bad, codeLines, Ids, unquote, type MermaidPlan } from './common.js';

/**
 * 箭头:两端是 id(不含箭头字符),中间是箭头本体。
 * 箭头字符集含 ')' / 'x'(mermaid 的异步线与叉线),所以结尾允许跟一个。
 * 不这么切,'A->>B' 会被切成 id='A->' —— 贪婪的 \S+ 先吃掉箭头再回头。
 */
const MSG_RE = /^([^\s\-=<>.x)]+)\s*((?:[-=.<>]+[)>x]?)|(?:[-=.]+[)>x])|(?:[-=.]+))\s*([^\s\-=<>.x)]+)$/;

/** 参与方声明:`participant A as Alice` / `actor Bob` */
const PART_RE = /^(participant|actor)\s+(\S+)(?:\s+as\s+(.+))?$/i;

/** 分支框的种类:mermaid 的关键字 → draw 的 f=kind(引擎只认这六个) */
const BRANCH_KIND: Record<string, string> = {
  alt: 'alt',
  else: 'else',
  loop: 'loop',
  opt: 'opt',
  par: 'par',
  and: 'par', // 同 kind,引擎才会把并行的几支并进一个框
  break: 'break',
  critical: 'alt', // 引擎没有 critical;alt/else 是诚实的近似
  option: 'else',
};

/** 只开框不画东西的块(rect/box):里面的消息照收,但不产分支框 */
const SILENT_BLOCKS = new Set(['rect', 'box']);

/** 分号会切开参数字段 —— 标签里的分号换成逗号 */
const semi = (s: string): string => s.replace(/;/g, ',');

/** 箭头是虚线吗:两连横杠或带点(mermaid 的虚线/点线都是这两样) */
const isDash = (arrow: string): boolean => /-{2,}/.test(arrow) || arrow.includes('.');

interface Part {
  id: string;
  type: string;
  label: string;
}

interface Msg {
  from: string;
  to: string;
  label: string;
  dash: boolean;
}

/** 分支框的一支:罩住第 start..end 条消息 */
interface Branch {
  kind: string;
  label: string;
  start: number;
  end: number;
}

/** 一个块(alt/loop/…):里面一支支,`and`/`else` 各起新的一支 */
interface Block {
  branches: Branch[];
  open: Branch | null;
  /** rect/box:只占位,不产分支框 */
  silent: boolean;
}

export function translateSequence(src: string): MermaidPlan {
  const ids = new Ids();
  const parts: Part[] = [];
  const byRaw = new Map<string, Part>();
  const msgs: Msg[] = [];
  const frags: Branch[] = [];
  const stack: Block[] = [];

  /** 参与方:第一次露面就建,后来声明了只换类型与名字 */
  const partOf = (raw: string): Part => {
    const hit = byRaw.get(raw);
    if (hit) return hit;
    const p: Part = { id: ids.get(raw), type: 'be', label: raw };
    byRaw.set(raw, p);
    parts.push(p);
    return p;
  };

  /** 开一支:起点是此刻已攒下的消息数(下一条消息的下标) */
  const openBranch = (block: Block, kind: string, label: string): void => {
    const br: Branch = { kind, label, start: msgs.length, end: msgs.length - 1 };
    block.open = br;
    block.branches.push(br);
  };

  /** 收一支:没有消息的支不算(引擎的 f= 要求 start<=end) */
  const closeBranch = (block: Block): void => {
    const br = block.open;
    if (!br) return;
    br.end = msgs.length - 1;
    if (br.end < br.start) block.branches.pop();
    block.open = null;
  };

  for (const line of codeLines(src)) {
    // 分支框的开合:关键字后必须跟空白或行尾,否则 'loop->>B' 里的 loop 会被当成块
    const kw = /^(alt|else|loop|opt|par|and|break|critical|option|end|rect|box)(?=\s|$)\s*(.*)$/i.exec(line);
    if (kw) {
      const key = kw[1].toLowerCase();
      const rest = kw[2].trim();
      if (key === 'end') {
        const block = stack.pop();
        if (!block) continue;
        closeBranch(block);
        if (!block.silent) frags.push(...block.branches);
        continue;
      }
      if (SILENT_BLOCKS.has(key)) {
        stack.push({ branches: [], open: null, silent: true });
        continue;
      }
      const kind = BRANCH_KIND[key];
      if (!kind) continue;
      if (key === 'else' || key === 'and' || key === 'option') {
        // 同一块里的新一支
        const block = stack[stack.length - 1];
        if (!block) continue;
        closeBranch(block);
        openBranch(block, kind, rest);
        continue;
      }
      // alt/loop/opt/par/break/critical:开一个新块
      const block: Block = { branches: [], open: null, silent: false };
      stack.push(block);
      openBranch(block, kind, rest);
      continue;
    }

    // 参与方声明
    const pm = PART_RE.exec(line);
    if (pm) {
      const raw = pm[2];
      const p = partOf(raw);
      p.type = pm[1].toLowerCase() === 'actor' ? 'ext' : 'be';
      p.label = pm[3] ? unquote(pm[3]) : raw;
      continue;
    }

    // 消息:`A->>B: hi`。只有第一个冒号分隔(消息正文里可以有冒号)
    const ci = line.indexOf(':');
    if (ci < 0) continue;
    const head = line.slice(0, ci).trim();
    const label = line.slice(ci + 1).trim();
    const mm = MSG_RE.exec(head);
    if (!mm) continue;
    const from = partOf(mm[1]);
    const to = partOf(mm[3]);
    msgs.push({ from: from.id, to: to.id, label, dash: isDash(mm[2]) });
  }

  if (!msgs.length) bad('sequenceDiagram needs at least one message');

  const params: [string, string][] = [];
  for (const p of parts) params.push(['n', `${p.id};${p.type};${semi(p.label)}`]);
  for (const m of msgs) {
    const fields = [m.from, m.to];
    if (m.label) fields.push(semi(m.label));
    else if (m.dash) fields.push(''); // 标签空但要虚线:占住第三段,免得 'dash' 被当成标签
    if (m.dash) fields.push('dash');
    params.push(['e', fields.join(';')]);
  }
  for (const f of frags) params.push(['f', `${f.kind};${semi(f.label)};${f.start};${f.end}`]);
  return { kind: 'seq', params };
}
