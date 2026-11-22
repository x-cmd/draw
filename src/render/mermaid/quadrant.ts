// mermaid quadrantChart → draw 的象限参数(quadrants=/items=/xlabel=…)。
//
// mermaid 的象限图:两条轴各写两端(低端 --> 高端)、四格各一个名字、若干散点。
// draw 的象限图:四个格名(左上/右上/左下/右下)、轴标题与两端标签、可选散点。
// 轴名是推出来的 —— 两端剥掉 Low/High 后相同的那截就是轴名("Low Reach"/"High Reach"
// → "Reach";两端没有共同词就不给轴名)。
import { bad, codeLines, unquote, type MermaidPlan } from './common.js';

/**
 * 剥掉高低修饰词("Low Reach" 的 Low、"Reach Low" 的 Low)——
 * 两端剥完剩的同一截就是轴名("Low Reach"/"High Reach" → "Reach");
 * 两端没有共同词就不给轴名。
 */
function axisNameOf(low: string, high: string): string {
  const strip = (s: string): string => s.replace(/\b(low|high)\b/gi, '').replace(/\s+/g, ' ').trim();
  const a = strip(low);
  const b = strip(high);
  return a && a.toLowerCase() === b.toLowerCase() ? a : '';
}

/**
 * mermaid quadrantChart → draw 的象限参数。
 *
 * quadrant-1..4 → quadrants=(左上,右上,左下,右下);
 * `Name: [0.3, 0.6]` → items=Name@0.3,0.6。
 */
export function translateQuadrant(src: string): MermaidPlan {
  const lines = codeLines(src);
  if (!lines.length) bad('quadrantChart needs at least one quadrant');
  const head = lines[0];
  if (!/^quadrantChart\b/i.test(head)) bad('quadrantChart source must start with "quadrantChart"');

  const quads: (string | undefined)[] = [];
  const items: string[] = [];
  let title = '';
  let xlow = '';
  let xhigh = '';
  let ylow = '';
  let yhigh = '';

  for (const line of lines.slice(1)) {
    if (/^title\b/i.test(line)) {
      title = unquote(line.replace(/^title\b/i, '').trim());
      continue;
    }
    const q = /^quadrant-([1-4])\b\s*(.*)$/i.exec(line);
    if (q) {
      quads[Number(q[1]) - 1] = unquote(q[2].trim());
      continue;
    }
    const ax = /^([xy])-axis\b\s*(.*)$/i.exec(line);
    if (ax) {
      const which = ax[1].toLowerCase();
      const body = ax[2];
      const arrow = body.indexOf('-->');
      const lo = unquote((arrow < 0 ? body : body.slice(0, arrow)).trim());
      const hi = unquote((arrow < 0 ? '' : body.slice(arrow + 3)).trim());
      if (which === 'x') { xlow = lo; xhigh = hi; } else { ylow = lo; yhigh = hi; }
      continue;
    }
    // 散点:`Campaign A: [0.3, 0.6]`
    const it = /^(.*?):\s*\[\s*([-\d.]+)\s*,\s*([-\d.]+)\s*\]$/.exec(line);
    if (it) {
      const name = unquote(it[1].trim());
      if (!name) bad(`quadrantChart: "${line}" needs a point name`);
      items.push(`${name}@${Number(it[2])},${Number(it[3])}`);
      continue;
    }
    // 认不出来的行丢掉 —— 象限图不缺这一块
  }

  const named = quads.filter((q) => q !== undefined && q !== '');
  if (!named.length) bad('quadrantChart needs at least one quadrant');
  // 引擎要正好四格 —— 没写的补空名(洞也补上)
  const cells: string[] = [];
  for (let i = 0; i < 4; i++) cells.push(quads[i] ?? '');

  const xlabel = axisNameOf(xlow, xhigh);
  const ylabel = axisNameOf(ylow, yhigh);
  const params: [string, string][] = [];

  if (cells.every((q) => q !== '')) {
    // 四格齐全:走扁平参数(URL 里一眼看得见)
    params.push(['quadrants', cells.join(',')]);
    if (title) params.push(['title', title]);
    if (xlow) params.push(['xlow', xlow]);
    if (xhigh) params.push(['xhigh', xhigh]);
    if (ylow) params.push(['ylow', ylow]);
    if (yhigh) params.push(['yhigh', yhigh]);
    if (xlabel) params.push(['xlabel', xlabel]);
    if (ylabel) params.push(['ylabel', ylabel]);
    if (items.length) params.push(['items', items.join(';')]);
  } else {
    // 缺格:扁平参数不容空名(split4 要求四个都非空),改走 JSON 体 ——
    // 那边空名算空格子,正好对上「少写一格」的语义。
    const obj: Record<string, unknown> = {
      groups: cells.map((name) => (name ? { name } : null)),
    };
    if (title) obj.title = title;
    if (xlow) obj.xlow = xlow;
    if (xhigh) obj.xhigh = xhigh;
    if (ylow) obj.ylow = ylow;
    if (yhigh) obj.yhigh = yhigh;
    if (xlabel) obj.xlabel = xlabel;
    if (ylabel) obj.ylabel = ylabel;
    if (items.length) {
      obj.items = items.map((s) => {
        const at = s.lastIndexOf('@');
        const [x, y] = s.slice(at + 1).split(',');
        return { name: s.slice(0, at), x: Number(x), y: Number(y) };
      });
    }
    params.push(['d', JSON.stringify(obj)]);
  }
  return { kind: 'quadrant', params };
}
