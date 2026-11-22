// mermaid mindmap → draw 的导图参数(n=<根/枝/叶 路径>)。
//
// mermaid 的导图靠缩进定层级,draw 的导图靠路径定层级 —— 这里把缩进翻成路径。
// 缩进步长不固定(2 空格/4 空格/制表符都有人写),所以不比绝对宽度,只比
// 「谁比谁深」—— 同一段里深的就是下一层,这样混排也不会错位。
import { bad, bare, stripNoise, unquote, type MermaidPlan } from './common.js';

/** 一行节点:缩进宽度 + 去掉装饰的标签 */
interface NodeLine {
  indent: number;
  label: string;
}

/**
 * 去掉 mermaid 的形状装饰:((x)) (x) [x] {x} [[x]] …
 * 也有 "id[text]" 这种 —— id 是另一个词,连它一起剥掉,只留 text。
 */
function stripShape(raw: string): string {
  let t = raw.trim();
  // id[text] / id(text) / id{text} / id>text]:前半的 id 是个独立的词,壳只在后半段
  const m = /^[A-Za-z0-9_.-]+(?=\s*[\[({>])/.exec(t);
  if (m) t = t.slice(m[0].length).trim();
  // 侧开口的壳(`>text]`)bare 不认 —— 换成方括号,让 bare 统一剥
  t = t.replace(/^>\s*/, '[');
  // 换行标记:draw 的文字节点不排版 HTML,当空格断开即可
  t = t.replace(/<br\s*\/?>/gi, ' ');
  return unquote(bare(t));
}

/** 缩进宽度:制表符按 4 列算,空格按 1 列算 */
function indentOf(line: string): number {
  let n = 0;
  for (const ch of line) {
    if (ch === ' ') n += 1;
    else if (ch === '\t') n += 4;
    else break;
  }
  return n;
}

/**
 * mermaid mindmap → draw 的导图参数。
 *
 * 层级由缩进决定;每行翻成一条 n=<根/…/叶> 路径(根也发一条)。
 */
export function translateMindmap(src: string): MermaidPlan {
  const raw = stripNoise(src).split(/\r?\n/).filter((l) => l.trim() !== '');
  if (raw.length < 2) bad('mindmap needs at least a root and one branch');
  const first = raw[0].trim();
  if (!/^mindmap\b/i.test(first)) bad('mindmap source must start with "mindmap"');
  // 第一行是 "mindmap" 指令本身,第二个才是根
  const lines: NodeLine[] = raw.slice(1).map((l) => ({
    indent: indentOf(l),
    label: stripShape(l),
  }));
  if (!lines.length) bad('mindmap needs at least a root and one branch');
  const root = lines[0].label;
  if (!root) bad('mindmap root needs a label');

  // 路径栈:栈顶是当前节点的父
  const stack: { indent: number; label: string }[] = [{ indent: -1, label: root }];
  const params: [string, string][] = [['n', root]];
  for (const line of lines.slice(1)) {
    if (!line.label) continue; // 只剩装饰的空壳行当没写
    // 缩进比栈顶还深 → 这一层是上一个节点的子;否则回退到匹配的那一层
    while (stack.length > 1 && line.indent <= stack[stack.length - 1].indent) stack.pop();
    const path = [...stack.map((s) => s.label), line.label].join('/');
    params.push(['n', path]);
    stack.push({ indent: line.indent, label: line.label });
  }
  if (params.length < 2) bad('mindmap needs at least a root and one branch');
  return { kind: 'mindmap', params };
}
