// mermaid stateDiagram / stateDiagram-v2 → draw 的生命周期参数。
//
//   n=id;type;label[;sub]   状态(state)/判定(decision)/终态(terminal)
//   e=from;to[;label]        迁移
//   b=label;id id …          组合态:一个边界把里面的状态圈起来
//   dir=lr|tb                方向
//
// mermaid 的 [*] 是起止伪状态,画不成盒子 —— 落成两个终态节点(Start / End)。
import { bad, codeLines, Ids, type MermaidPlan } from './common.js';

/** 判定/终态的记号:mermaid 的 <<fork>> 之类 */
const STEREOTYPE: Record<string, string> = {
  fork: 'decision',
  join: 'decision',
  choice: 'decision',
  end: 'terminal',
};

/** 分号会切开参数字段 —— 标签里的分号换成逗号 */
const semi = (s: string): string => s.replace(/;/g, ',');

interface St {
  raw: string;
  label: string;
  type: string;
  desc: string[];
}

export function translateState(src: string): MermaidPlan {
  const ids = new Ids();
  const states = new Map<string, St>();
  const order: string[] = [];
  const edges: { from: string; to: string; label: string }[] = [];
  /** 组合态:label 是块名,members 是里面的状态 id */
  const composites: { label: string; members: string[] }[] = [];
  /** 组合态块栈:每层记自己里面的状态(嵌套的组合态把自己也算进去) */
  const blockStack: { label: string; members: string[] }[] = [];
  /** 组合态的名字:它们是边界,不是节点(除非有迁移指向它,那就还得是个节点) */
  const compositeNames = new Set<string>();
  let dir = '';

  /** 记一个状态;同一状态重复出现只更新名字/类型 */
  const touch = (raw: string): St => {
    let st = states.get(raw);
    if (!st) {
      st = { raw, label: raw, type: 'state', desc: [] };
      states.set(raw, st);
      order.push(raw);
      // 组合态本身不算它自己的成员(它就是那个框)
      if (!compositeNames.has(raw)) {
        const top = blockStack[blockStack.length - 1];
        if (top) top.members.push(raw);
      }
    }
    return st;
  };

  for (const raw of codeLines(src)) {
    // 方向
    const dm = /^direction\s+(lr|tb|rl|bt)\s*$/i.exec(raw);
    if (dm) {
      const d = dm[1].toLowerCase();
      if (d === 'lr' || d === 'tb') dir = d;
      continue;
    }

    // 组合态的块首:state Name {   /   state "Long name" as Name {
    const cm = /^state\s+(.*?)\s*\{\s*$/.exec(raw);
    if (cm) {
      const head = cm[1].trim();
      const named = /^"(.*)"\s+as\s+(\S+)$/.exec(head);
      // 组合态也可以带记号(state C <<fork>> {),但记号对框没意义,丢掉
      const name = named ? named[2] : head.split(/\s+/)[0];
      const label = named ? named[1] : name;
      compositeNames.add(name);
      blockStack.push({ label, members: [] });
      continue;
    }

    // 块尾:}（mermaid 的组合态用花括号收尾）
    if (/^\}\s*$/.test(raw)) {
      const b = blockStack.pop();
      // 嵌套的组合态:里面的状态也算外层的一部分(外层的框要罩住它)
      const outer = blockStack[blockStack.length - 1];
      if (b) {
        if (outer) outer.members.push(...b.members);
        composites.push(b);
      }
      continue;
    }

    // 状态声明:state "Long name" as s2 / state s2 / state s2 <<fork>>
    const sm = /^state\s+(.*)$/.exec(raw);
    if (sm) {
      const head = sm[1].trim();
      const named = /^"(.*)"\s+as\s+(\S+?)(?:\s*<<(\S+)>>)?$/.exec(head);
      let name: string;
      let label: string | undefined;
      let stereo = '';
      if (named) {
        label = named[1];
        name = named[2];
        stereo = named[3] ?? '';
      } else {
        const st = /^(\S+)(?:\s*<<(\S+)>>)?$/.exec(head);
        if (!st) continue;
        name = st[1];
        stereo = st[2] ?? '';
      }
      const st = touch(name);
      if (label) st.label = label;
      const t = STEREOTYPE[stereo.toLowerCase()];
      if (t) st.type = t;
      continue;
    }

    // 迁移:A --> B : label
    const tm = /^(\S+)\s*-->\s*(\S+)\s*(?::\s*(.*))?$/.exec(raw);
    if (tm) {
      const from = tm[1];
      const to = tm[2];
      const label = (tm[3] ?? '').trim();
      edges.push({ from, to, label });
      if (from !== '[*]') touch(from);
      if (to !== '[*]') touch(to);
      continue;
    }

    // 状态说明:s2 : some description
    const dm2 = /^(\S+)\s*:\s*(.*)$/.exec(raw);
    if (dm2) {
      const st = touch(dm2[1]);
      st.desc.push(dm2[2].trim());
      continue;
    }

    // 其它(classDef/note/…):引擎装不下的,丢掉
  }

  // [*] 是起止伪状态:作源点是 Start,作宿点是 End,整张图各一个;
  // 自环([*] --> [*])没法两边兼得,算 Start。
  // 伪状态先占住 start/end 这两个 id —— 图里真有个状态叫 start/end,
  // 就给它洗白(start_2),免得两个节点撞 id。
  const startId = edges.some((e) => e.from === '[*]') ? ids.get('start') : '';
  const endId = edges.some((e) => e.to === '[*]') ? ids.get('end') : '';
  const selfLoop = edges.some((e) => e.from === '[*]' && e.to === '[*]');
  /** 状态 id:start/end 让给伪状态了,真撞名的往后挪一位 */
  const stateId = (raw: string): string =>
    (startId && raw === 'start') || (endId && raw === 'end') ? ids.get(`${raw} `) : ids.get(raw);

  if (!states.size && !startId && !endId) bad('stateDiagram needs at least one state');

  const params: [string, string][] = [];
  // [*] 的节点先摆出来(Start 在前、End 在后),其余按声明顺序
  if (startId) params.push(['n', `${startId};terminal;Start`]);
  if (endId && !selfLoop) params.push(['n', `${endId};terminal;End`]);
  for (const raw of order) {
    const st = states.get(raw)!;
    const id = stateId(raw);
    const sub = st.desc.join('\n');
    params.push(['n', sub ? `${id};${st.type};${semi(st.label)};${semi(sub)}` : `${id};${st.type};${semi(st.label)}`]);
  }
  for (const e of edges) {
    const from = e.from === '[*]' ? startId : stateId(e.from);
    const to = e.to === '[*]' ? (selfLoop ? startId : endId) : stateId(e.to);
    params.push(['e', e.label ? `${from};${to};${semi(e.label)}` : `${from};${to}`]);
  }
  // 组合态:里面一个状态都没有的(空的)不画
  for (const c of composites) {
    const inner = c.members.map((m) => stateId(m));
    if (!inner.length) continue;
    params.push(['b', `${semi(c.label)};${inner.join(' ')}`]);
  }
  if (dir) params.push(['dir', dir]);
  return { kind: 'lifecycle', params };
}
