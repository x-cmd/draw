// mermaid radar-beta → draw 的雷达图参数(labels=/values=)。
//
// mermaid 的写法:title、axis m["Math"], s["Science"]、curve a{1,2,3}。
// 括号前的 id 不是标签的一部分,只留括号里的字。
// draw 的雷达图只有一套数据 —— 多条 curve 取第一条(后面的丢掉)。
import { bad, codeLines, unquote, type MermaidPlan } from './common.js';

/** `m["Math"]` → "Math";括号里没引号也照剥 */
function axisLabel(raw: string): string {
  const m = /^\s*\S*?\s*[\[\(]\s*(.*?)\s*[\]\)]\s*$/.exec(raw);
  return unquote(m ? m[1] : raw);
}

/**
 * mermaid radar-beta → draw 的雷达图参数。
 *
 * `axis m["Math"], s["Science"]` → labels=Math,Science;
 * `curve a{1,2,3}` → values=1,2,3。
 */
export function translateRadar(src: string): MermaidPlan {
  const lines = codeLines(src);
  if (!lines.length) bad('radar-beta needs at least 3 axes');
  const head = lines[0];
  if (!/^radar-beta\b/i.test(head)) bad('radar-beta source must start with "radar-beta"');

  let title = '';
  const labels: string[] = [];
  let values: number[] | null = null;

  for (const line of lines.slice(1)) {
    if (/^title\b/i.test(line)) {
      title = unquote(line.replace(/^title\b/i, '').trim());
      continue;
    }
    const ax = /^axis\b\s*(.*)$/i.exec(line);
    if (ax) {
      // `m["Math"], s["Science"]` —— 按逗号切开,每段一个轴
      for (const part of ax[1].split(',')) {
        const l = axisLabel(part);
        if (l) labels.push(l);
      }
      continue;
    }
    const cv = /^curve\b\s*\S*?\s*\{(.*)\}$/i.exec(line);
    if (cv) {
      if (values) continue; // 多条 curve 只取第一条(雷达图只有一套数据)
      const vs = cv[1].split(',').map((v) => Number(v.trim()));
      if (vs.length === 0 || vs.some((v) => !Number.isFinite(v))) {
        bad(`radar-beta: "${line}" needs numbers`);
      }
      values = vs;
      continue;
    }
    // 认不出来的行丢掉 —— 雷达图不缺这一块
  }

  if (!values) bad('radar-beta needs a curve');
  if (labels.length !== values.length) bad('radar-beta: axis count does not match the curve');
  if (labels.length < 3) bad('radar-beta needs at least 3 axes');

  const params: [string, string][] = [];
  for (const l of labels) params.push(['labels', l]);
  params.push(['values', values.join(',')]);
  if (title) params.push(['title', title]);
  return { kind: 'radar', params };
}
