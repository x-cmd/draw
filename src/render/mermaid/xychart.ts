// mermaid xychart-beta → draw 的柱/折线图参数(labels=/values=)。
//
// mermaid 的写法:title、x-axis [a, b, c] 或 x-axis a --> b、y-axis "名" 0 --> 9000、
// bar [1,2,3] / line [1,2,3]。draw 的柱/折线要标签与数值两个平行数组。
// 一张图只能有一套数值 —— bar 与 line 同时给,取 bar(line 忽略)。
import { bad, codeLines, unquote, type MermaidPlan } from './common.js';

/** `[a, b, c]` 里的内容拆成数组(空位保留 —— 位置就是数据的位置) */
function bracketList(body: string): string[] {
  return body
    .replace(/^\[/, '')
    .replace(/\]$/, '')
    .split(',')
    .map((s) => s.trim());
}

/**
 * mermaid xychart-beta → draw 的柱图或折线图参数。
 *
 * `bar [...]` → kind=bar;`line [...]` → kind=line(两者都有时取 bar)。
 */
export function translateXychart(src: string): MermaidPlan {
  const lines = codeLines(src);
  if (!lines.length) bad('xychart-beta needs a bar or a line series');
  const head = lines[0];
  if (!/^xychart-beta\b/i.test(head)) bad('xychart-beta source must start with "xychart-beta"');

  let title = '';
  let unit = '';
  let labels: string[] = [];
  let bar: number[] | null = null;
  let line: number[] | null = null;

  for (const raw of lines.slice(1)) {
    if (/^title\b/i.test(raw)) {
      title = unquote(raw.replace(/^title\b/i, '').trim());
      continue;
    }
    const ax = /^([xy])-axis\b\s*(.*)$/i.exec(raw);
    if (ax) {
      const which = ax[1].toLowerCase();
      const body = ax[2].trim();
      if (which === 'x') {
        if (body.startsWith('[')) {
          labels = bracketList(body).map((l) => unquote(l));
        } else {
          // `x-axis a --> b`:两端就是两个标签
          const arrow = body.indexOf('-->');
          const lo = unquote((arrow < 0 ? body : body.slice(0, arrow)).trim());
          const hi = unquote((arrow < 0 ? '' : body.slice(arrow + 3)).trim());
          labels = [lo, hi].filter((l) => l !== '');
        }
        continue;
      }
      // y 轴:`"名" 0 --> 9000` 或 `0 --> 9000`
      const arrow = body.indexOf('-->');
      const headPart = (arrow < 0 ? body : body.slice(0, arrow)).trim();
      // 轴名是引号里的那段;没有引号就是没有名字
      const quoted = /^"([^"]*)"/.exec(headPart);
      if (quoted) unit = quoted[1].trim();
      continue;
    }
    const ser = /^(bar|line)\b\s*\[(.*)\]$/i.exec(raw);
    if (ser) {
      const values = bracketList(ser[2]).map((v) => (v === '' ? NaN : Number(v)));
      if (values.some((v) => !Number.isFinite(v))) bad(`xychart-beta: "${raw}" needs numbers`);
      if (ser[1].toLowerCase() === 'bar') bar = values;
      else line = values;
      continue;
    }
    // 认不出来的行丢掉 —— 柱图不缺这一块
  }

  // bar 与 line 同时给:取 bar(line 是同一批数的另一种画法,先到先得)
  const values = bar ?? line;
  if (!values) bad('xychart-beta needs a bar or a line series');
  if (labels.length && labels.length !== values.length) {
    bad(`xychart-beta: x-axis has ${labels.length} labels but the series has ${values.length} values`);
  }
  // 没写 x-axis:mermaid 自己会按序号标 —— draw 的图必须有一串标签才画得出来
  const names = labels.length ? labels : values.map((_, i) => String(i + 1));

  const params: [string, string][] = [];
  for (const l of names) params.push(['labels', l]);
  params.push(['values', values.join(',')]);
  if (title) params.push(['title', title]);
  if (unit) params.push(['unit', unit]);
  return { kind: bar ? 'bar' : 'line', params };
}
