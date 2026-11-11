// 双翼条形图(butterfly chart):两个系列背靠背,共用一根中轴。
//
// 术语(data vis 领域):
//   butterfly chart / back-to-back bar chart —— 两个系列的柱从中轴往两侧长
//   tornado chart —— 同一构造,但按大小排序(敏感性分析常用)
//   population pyramid —— 同一构造,用于年龄 × 性别
//   diverging bar chart —— 更宽泛:以 0 为基线的双向柱
// 这里是前一种:两侧共用同一把标尺,长度可比;两侧各自可堆叠;
// 任意一侧可叠一条独立标尺的折线。
//
// 参数(扁平的):
//   labels=A,B,C          类别(行;dir=tb 时是列)
//   left=7,8,9            一侧的数值(不带名)
//   left=Opened:7,8,9     带名的一段
//   left=code:1,2;cm:3,4  堆叠:分号隔开各段(自中轴往外)
//   right=...             另一侧,同上
//   line=p95:1,2,3        叠一条折线(自己的标尺)
//   lineside=left|right   折线画在哪一侧(默认 right)
//   dir=lr|tb             左右(默认)/上下
//   title= unit=
//
// JSON(?d=)形态:
//
//   {
//     "title": "…", "unit": "…", "dir": "lr",
//     "labels": ["duckdb", "sqlite"],
//     "left":  { "name": "峰值内存", "segments": [{ "name": "ram", "values": [0.32, 0.04] }] },
//     "right": { "name": "磁盘", "segments": [{ "name": "disk", "values": [0.37, 3.08] }] },
//     "line":  { "name": "最长报告 (ms)", "values": [536, 49178], "side": "right" }
//   }
import { ApiError } from './index.js';

export interface BflySegment {
  name?: string;
  values: number[];
}

export interface BflySide {
  name?: string;
  /** 单段简写(等价于只有一个 segments) */
  values?: number[];
  /** 多段:自中轴往外堆叠 */
  segments?: BflySegment[];
}

export interface BflyLine {
  name?: string;
  values: number[];
  /** 画在哪一侧 */
  side?: 'left' | 'right';
}

export interface ButterflySpec {
  title?: string;
  unit?: string;
  dir: 'lr' | 'tb';
  labels: string[];
  left?: BflySide;
  right?: BflySide;
  line?: BflyLine;
}

export const BUTTERFLY_EXAMPLE =
  'labels=duckdb,sqlite&left=Opened:7,8&right=Closed:5,6&title=Opened vs Closed';

const isObj = (v: unknown): v is Record<string, unknown> =>
  typeof v === 'object' && v !== null && !Array.isArray(v);

/** 一侧的段:单段 values 与多段 segments 归一 */
export function sideSegments(side: BflySide | undefined): BflySegment[] {
  if (!side) return [];
  if (side.segments && side.segments.length) {
    return side.segments.map((sg) => ({ name: sg.name, values: sg.values.map((v) => Number(v) || 0) }));
  }
  if (side.values) {
    return [{ name: side.name, values: side.values.map((v) => Number(v) || 0) }];
  }
  return [];
}

/** 侧的总长度(各段之和) */
export function sideTotals(side: BflySide | undefined, n: number): number[] {
  const segs = sideSegments(side);
  const out = new Array<number>(n).fill(0);
  for (const sg of segs) sg.values.forEach((v, i) => { if (i < n) out[i] += v; });
  return out;
}

function parseSide(v: unknown, where: string): BflySide | undefined {
  if (v === undefined || v === null) return undefined;
  if (!isObj(v)) throw new ApiError(400, `"${where}" must be an object. Example: {"name":"Opened","values":[1,2]}`);
  const out: BflySide = {};
  if (typeof v.name === 'string') out.name = v.name;
  if (Array.isArray(v.values)) out.values = v.values.map((x) => Number(x) || 0);
  if (Array.isArray(v.segments)) {
    out.segments = v.segments.map((sg, i) => {
      if (!isObj(sg)) throw new ApiError(400, `"${where}.segments[${i}]" must be an object with "values".`);
      const seg: BflySegment = { values: (Array.isArray(sg.values) ? sg.values : []).map((x) => Number(x) || 0) };
      if (typeof sg.name === 'string') seg.name = sg.name;
      return seg;
    });
  }
  if (out.values === undefined && out.segments === undefined) {
    throw new ApiError(400, `"${where}" needs "values" or "segments".`);
  }
  return out;
}

/** 扁平参数 → JSON 串(和别的图种一个路子:URL 里只放可读的短值) */
export function butterflySpecFromParams(params: URLSearchParams): string | null {
  // ?d=<json> 优先(和别的图种一个规矩:复杂数据走 JSON)
  const d = params.get('d');
  if (d !== null && d !== '') return d;
  const labels = params.getAll('labels').flatMap((s) => s.split(',')).map((s) => s.trim()).filter(Boolean);
  const leftRaw = params.getAll('left');
  const rightRaw = params.getAll('right');
  const lineRaw = params.get('line');
  if (!labels.length && !leftRaw.length && !rightRaw.length && !lineRaw) return null;

  const sideFrom = (raws: string[], fallbackName: string): BflySide | undefined => {
    if (!raws.length) return undefined;
    const segments: BflySegment[] = [];
    for (const raw of raws) {
      for (const piece of raw.split(';')) {
        const s = piece.trim();
        if (!s) continue;
        const ci = s.indexOf(':');
        const name = ci > 0 ? s.slice(0, ci).trim() : undefined;
        const vals = (ci > 0 ? s.slice(ci + 1) : s).split(',').map((x) => Number(x.trim()));
        if (vals.some((v) => !Number.isFinite(v))) {
          throw new ApiError(400, `"left"/"right" values must be numbers. Example: left=Opened:7,8`);
        }
        segments.push({ ...(name ? { name } : {}), values: vals });
      }
    }
    if (!segments.length) return undefined;
    // 只有一段且没名字 → 用 fallbackName
    if (segments.length === 1 && !segments[0].name) segments[0].name = fallbackName;
    return segments.length === 1 ? { name: segments[0].name, values: segments[0].values } : { segments };
  };

  const spec: Record<string, unknown> = { labels };
  const left = sideFrom(leftRaw, 'Left');
  const right = sideFrom(rightRaw, 'Right');
  if (left) spec.left = left;
  if (right) spec.right = right;
  if (lineRaw) {
    const ci = lineRaw.indexOf(':');
    const name = ci > 0 ? lineRaw.slice(0, ci).trim() : undefined;
    const vals = (ci > 0 ? lineRaw.slice(ci + 1) : lineRaw).split(',').map((x) => Number(x.trim()));
    const side = (params.get('lineside') ?? 'right').toLowerCase();
    if (side !== 'left' && side !== 'right') {
      throw new ApiError(400, `"lineside" must be "left" or "right". Got: ${JSON.stringify(side)}`);
    }
    spec.line = { ...(name ? { name } : {}), values: vals, side };
  }
  const dir = (params.get('dir') ?? 'lr').toLowerCase();
  if (dir !== 'lr' && dir !== 'tb') {
    throw new ApiError(400, `"dir" must be "lr" (left-right) or "tb" (top-bottom). Got: ${JSON.stringify(dir)}`);
  }
  spec.dir = dir;
  const title = params.get('title');
  if (title) spec.title = title;
  const unit = params.get('unit');
  if (unit) spec.unit = unit;
  return JSON.stringify(spec);
}

export function parseButterflySpec(raw: string): ButterflySpec {
  let obj: unknown;
  try {
    obj = JSON.parse(raw);
  } catch {
    throw new ApiError(400, `"d" is not valid JSON. Example: ${BUTTERFLY_EXAMPLE}`);
  }
  if (!isObj(obj)) {
    throw new ApiError(400, `"d" must be an object. Example: ${BUTTERFLY_EXAMPLE}`);
  }
  const labels = Array.isArray(obj.labels)
    ? obj.labels.map((x) => String(x))
    : [];
  const left = parseSide(obj.left, 'left');
  const right = parseSide(obj.right, 'right');
  let line: BflyLine | undefined;
  if (obj.line !== undefined && obj.line !== null) {
    if (!isObj(obj.line)) throw new ApiError(400, '"line" must be an object with "values".');
    const values = (Array.isArray(obj.line.values) ? obj.line.values : []).map((x) => Number(x) || 0);
    const side = typeof obj.line.side === 'string' ? obj.line.side.toLowerCase() : 'right';
    if (side !== 'left' && side !== 'right') {
      throw new ApiError(400, `"line.side" must be "left" or "right". Got: ${JSON.stringify(obj.line.side)}`);
    }
    line = { values, side: side as 'left' | 'right' };
    if (typeof obj.line.name === 'string') line.name = obj.line.name;
  }
  if (!labels.length) {
    throw new ApiError(400, `"labels" is required. Example: ${BUTTERFLY_EXAMPLE}`);
  }
  if (!left && !right && !line) {
    throw new ApiError(400, `need at least one side ("left" or "right"). Example: ${BUTTERFLY_EXAMPLE}`);
  }
  const dir = typeof obj.dir === 'string' ? obj.dir.toLowerCase() : 'lr';
  if (dir !== 'lr' && dir !== 'tb') {
    throw new ApiError(400, `"dir" must be "lr" or "tb". Got: ${JSON.stringify(obj.dir)}`);
  }
  const spec: ButterflySpec = { dir, labels };
  if (typeof obj.title === 'string') spec.title = obj.title;
  if (typeof obj.unit === 'string') spec.unit = obj.unit;
  if (left) spec.left = left;
  if (right) spec.right = right;
  if (line) spec.line = line;
  return spec;
}
