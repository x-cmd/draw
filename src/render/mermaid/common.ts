// mermaid 源码 → draw 参数:公共零件。
//
// 每种 mermaid 图有自己的语法(时序图/状态图/ER/类图/导图/饼/桑基/象限/xy…),
// 各自翻成 draw 对应图种的参数 —— 翻完交给那个引擎画,于是样式/交互/PNG/缓存全是同一套。
// 这里放公用的小工具:去注释去指令、认首关键字、id 洗白、参数攒起来。
import { ApiError } from '../../specs/index.js';

/**
 * 翻完的产物:目标图种 + 参数(URL 参数名 → 值;同名可重复 —— n=/e=/f=/b= 都可重复)。
 */
export interface MermaidPlan {
  /** 目标图种:chart 族是 ChartTemplate(走 ?type=),arch 族是 /draw/<kind> 端点 */
  kind: string;
  params: [string, string][];
}

/** mermaid 源码的错:带一句「这是 mermaid 源码」的前缀,免得跟 draw 的参数报错混在一起 */
export function bad(detail: string): never {
  throw new ApiError(400, `mermaid: ${detail}`);
}

/** 去掉初始化指令(%%{init: …}%%)与行注释(%% …) */
export function stripNoise(src: string): string {
  return src.replace(/%%\{[\s\S]*?\}%%/g, '').replace(/%%[^\n]*/g, '');
}

/** 有效行(去空行、去注释) */
export function codeLines(src: string): string[] {
  return stripNoise(src)
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter((l) => l !== '');
}

/** 首关键字 —— 决定图种(graph/flowchart/sequenceDiagram/stateDiagram/…) */
export function headOf(src: string): string {
  for (const l of codeLines(src)) {
    const m = /^([A-Za-z][A-Za-z0-9_-]*)/.exec(l);
    if (m) return m[1].toLowerCase();
  }
  return '';
}

/** draw 的 id 规则是 /^[A-Za-z0-9][A-Za-z0-9_.-]*$/ —— mermaid 的 id 不受管,洗一遍 */
export function drawId(raw: string): string {
  const s = raw.replace(/[^A-Za-z0-9_.-]/g, '_');
  return /^[A-Za-z0-9]/.test(s) ? s : `n${s}`;
}

/**
 * id 洗白 + 去重:mermaid 的 id 互相独立(A-B 与 A_B 是两个节点),
 * 洗到 draw 的 id 空间里可能撞 —— 后来的加序号。名字本身留在 label 里。
 */
export class Ids {
  private readonly map = new Map<string, string>();
  private readonly used = new Set<string>();

  /** 同一个 mermaid id 永远拿到同一个 draw id */
  get(raw: string): string {
    const hit = this.map.get(raw);
    if (hit !== undefined) return hit;
    let id = drawId(raw);
    let n = 2;
    while (this.used.has(id)) {
      id = `${drawId(raw)}_${n}`;
      n++;
    }
    this.map.set(raw, id);
    this.used.add(id);
    return id;
  }
}

/** mermaid 标签的外壳:["x"] (x) {x} [[x]] —— 剥掉,留里面的字 */
export function bare(s: string): string {
  let t = s.trim();
  const m = /^[[({<]+\s*"?([\s\S]*?)"?\s*[\])}>]+$/.exec(t);
  if (m) t = m[1];
  return t.trim();
}

/** 引号剥掉(饼图的 "Dogs"、标题的 "Sales Revenue") */
export function unquote(s: string): string {
  const t = s.trim();
  if (t.length >= 2 && ((t.startsWith('"') && t.endsWith('"')) || (t.startsWith("'") && t.endsWith("'")))) {
    return t.slice(1, -1);
  }
  return t;
}

/** 数字:不是有限数就当没给 */
export function num(raw: string | undefined): number | undefined {
  if (raw === undefined) return undefined;
  const n = Number(raw.trim());
  return Number.isFinite(n) ? n : undefined;
}
