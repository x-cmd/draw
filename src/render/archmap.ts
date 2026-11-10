// /draw/archmap(x-cmd-hub/draw#17/#20):网格拓扑图 — 自研网格引擎保底版。
// 分工:人或 AI 写①分层②排序(粗格 r0c1 或像素逃生舱,明文进 URL,读者零算术读拓扑),
// 引擎做③打包(auto 轨道:列宽=成员自然宽最大值,跨格补差均摊)④路由(L/Z 正交 +
// 端口面扩散 + 穿盒外推绕行)。输出静态 SVG,<metadata> 全量回程。
// 参数语法(n/e/b 字段分隔 ";",查询串原字符合法,label 可含逗号):
//   n=<id>;<type>;<label>[;<sublabel>][;<pos>]
//   e=<from>;<to>[;<label>[;<variant>]]        variant: main(强调)|dash(虚线)|缺省常规
//   b=<label>;<id> <id> ...                    边界包裹(ids 空格分隔)
// pos: r<row>c<col>[w<span>][h<span>](跨度≤3)| p<x>,<y>[,<w>x<h>](像素逃生舱)
// 类型枚举 → 语义色:fe/be/db/cloud/sec/bus/svc 映射系列色板,ext 中性虚线框。
// 渲染管线:路由先算 → 边界标签四角择优(远离走线) → 边标签多候选避让(节点盒∪边界标签区)。
import { ApiError } from '../specs/index.js';
import { resolveVersion, type VersionInfo } from '../version.js';
import { resolveSkin, type Skin } from '../styles/index.js';
import { esc, r2, sVar, segRectIntersect, svgDoc, textW } from './svg.js';
import { clampInt, schemeParam, type DrawResult } from './query.js';

const TYPES = ['ext', 'fe', 'be', 'db', 'cloud', 'sec', 'bus', 'svc'] as const;
type NodeType = (typeof TYPES)[number];
// 语义类型 → 系列色序号(ext 无色,走中性虚线框)
const TYPE_COLOR: Partial<Record<NodeType, number>> = {
  fe: 0, be: 1, db: 2, cloud: 3, sec: 4, bus: 5, svc: 6,
};
type EdgeVariant = 'plain' | 'main' | 'dash';

export const ID_RE = /^[A-Za-z0-9][A-Za-z0-9_.-]*$/;
export const GRID_POS_RE = /^r(\d+)c(\d+)(?:w([1-3]))?(?:h([1-3]))?$/;
export const PX_POS_RE = /^p(\d+(?:\.\d+)?),(\d+(?:\.\d+)?)(?:,(\d+)x(\d+))?$/;

const GAP_X = 30;
const GAP_Y = 34;
const PAD = 26;
const MIN_CELL_W = 96;
const MIN_CELL_H = 40;
const N_EXAMPLE = 'n=api;be;API Gateway;auth;r1c0w2';

export interface Box { x: number; y: number; w: number; h: number }
export interface ArchNode {
  id: string;
  type: NodeType;
  label: string;
  sub?: string;
  /** mermaid 源形状:方/菱(判定)/圆柱(存储)/圆角胶囊;缺省 rect */
  shape?: 'rect' | 'diamond' | 'cylinder' | 'round';
  grid?: { row: number; col: number; w: number; h: number };
  px?: { x: number; y: number; w?: number; h?: number };
}
export interface ArchEdge { from: string; to: string; label?: string; variant: EdgeVariant }
export interface ArchBoundary { label: string; ids: string[] }
interface ArchSpec {
  type: 'archmap';
  title?: string;
  nodes: ArchNode[];
  edges: ArchEdge[];
  boundaries: ArchBoundary[];
}

function bad(detail: string): never {
  throw new ApiError(400, `${detail} Example: ${N_EXAMPLE}`);
}

export function parseNodes(raw: string[]): ArchNode[] {
  return raw.map((v, i) => {
    const f = v.split(';');
    const where = `"n=${v}" (#${i + 1})`;
    if (f.length < 3 || f.length > 5) bad(`${where}: expected id;type;label[;sublabel][;pos] fields`);
    const [id, type, label] = f;
    let sub: string | undefined = f[3];
    let pos: string | undefined = f[4];
    // 4 字段时第 4 段按形状判别:像格位/像素坐标 → pos,否则视作 sublabel
    if (f.length === 4 && (GRID_POS_RE.test(f[3]) || PX_POS_RE.test(f[3]))) {
      pos = f[3];
      sub = undefined;
    }
    if (!ID_RE.test(id)) bad(`${where}: id must be alnum/dot/dash/underscore, not starting with a digit-punct`);
    if (!(TYPES as readonly string[]).includes(type)) bad(`${where}: unknown type "${type}" (one of ${TYPES.join('/')})`);
    if (!label.trim()) bad(`${where}: label is required`);
    let grid: ArchNode['grid'];
    let px: ArchNode['px'];
    if (pos !== undefined && pos !== '') {
      const g = GRID_POS_RE.exec(pos);
      if (g) grid = { row: +g[1], col: +g[2], w: g[3] ? +g[3] : 1, h: g[4] ? +g[4] : 1 };
      else {
        const p = PX_POS_RE.exec(pos);
        if (!p) bad(`${where}: pos must look like r0c1[w2][h2] or p40,80[,120x48]`);
        px = { x: +p[1], y: +p[2], ...(p[3] ? { w: +p[3], h: +p[4] } : {}) };
      }
    }
    return { id, type: type as NodeType, label: label.trim(), sub: sub?.trim() || undefined, grid, px };
  });
}

export function parseEdges(raw: string[], ids: Set<string>): ArchEdge[] {
  return raw.map((v, i) => {
    const f = v.split(';');
    const where = `"e=${v}" (#${i + 1})`;
    if (f.length < 2 || f.length > 4) bad(`${where}: expected from;to[;label][;variant] fields`);
    const [from, to, label, variant] = f;
    if (!ids.has(from)) bad(`${where}: unknown node "${from}"`);
    if (!ids.has(to)) bad(`${where}: unknown node "${to}"`);
    let va: EdgeVariant = 'plain';
    if (variant !== undefined && variant !== '') {
      if (variant !== 'main' && variant !== 'dash') bad(`${where}: unknown variant "${variant}" (main|dash)`);
      va = variant;
    }
    return { from, to, label: label?.trim() || undefined, variant: va };
  });
}

export function parseBoundaries(raw: string[], ids: Set<string>): ArchBoundary[] {
  return raw.map((v, i) => {
    const sep = v.indexOf(';');
    if (sep < 1) bad(`"b=${v}" (#${i + 1}): expected <label>;<id> <id> ...`);
    const label = v.slice(0, sep).trim();
    const members = v.slice(sep + 1).trim().split(/\s+/).filter(Boolean);
    if (!label || !members.length) bad(`"b=${v}" (#${i + 1}): label and at least one member id required`);
    for (const m of members) if (!ids.has(m)) bad(`"b=${v}": unknown node "${m}"`);
    return { label, ids: members };
  });
}

// 自然尺寸:label 13px 加左右内边距;副标 11px;盒高 40(带副标 56)
export function naturalSize(n: ArchNode, scale = 1): { w: number; h: number } {
  const w = Math.max(MIN_CELL_W * scale, textW(n.label, 13 * scale) + 34 * scale, n.sub ? textW(n.sub, 11 * scale) + 34 * scale : 0);
  const h = (n.sub ? 56 : 40) * scale;
  return { w: Math.min(w, 360), h };
}

export interface Placed extends ArchNode { box: Box; color: number } // color: -1 = 中性(ext)

// auto 轨道打包:单格成员先定轨道宽高,跨格节点不足则补差均摊到跨越轨道。
// 返回 placed(含最终盒)与轨道联合画布尺寸;纯像素图无轨道,W/H 由调用侧从盒推。
export interface GridOpts {
  /** 轨道间距(默认 GAP_X / GAP_Y) */
  gapX?: number;
  gapY?: number;
  /** 画布留白(默认 PAD) */
  pad?: number;
  /** 节点尺寸的量尺(默认 naturalSize) */
  sizeOf?: (n: ArchNode) => { w: number; h: number };
}

export function packGrid(nodes: ArchNode[], gridCols: number, opts: GridOpts = {}): { placed: Placed[]; W: number; H: number } {
  const gapX = opts.gapX ?? GAP_X;
  const gapY = opts.gapY ?? GAP_Y;
  const pad = opts.pad ?? PAD;
  const sizeOf = opts.sizeOf ?? ((n: ArchNode) => naturalSize(n));
  // 格子占用(显式先标,冲突即报);无 pos 节点自动落入首个空格(行优先,确定性,回程记录落位)
  const cell = new Map<string, string>();
  const mark = (n: ArchNode & { grid: NonNullable<ArchNode['grid']> }): void => {
    for (let r = n.grid.row; r < n.grid.row + n.grid.h; r++)
      for (let c = n.grid.col; c < n.grid.col + n.grid.w; c++) {
        const k = `${r},${c}`;
        const prev = cell.get(k);
        if (prev) bad(`nodes "${prev}" and "${n.id}" share grid cell r${r}c${c}`);
        cell.set(k, n.id);
      }
  };
  for (const n of nodes) if (n.grid) mark(n as ArchNode & { grid: NonNullable<ArchNode['grid']> });
  for (const n of nodes) {
    if (n.grid || n.px) continue;
    search: for (let r = 0; r < 64; r++) for (let c = 0; c < 12; c++) {
      const k = `${r},${c}`;
      if (!cell.has(k)) {
        n.grid = { row: r, col: c, w: 1, h: 1 };
        cell.set(k, n.id);
        break search;
      }
    }
  }
  const gridNodes = nodes.filter(n => n.grid) as (ArchNode & { grid: NonNullable<ArchNode['grid']> })[];
  const rows = Math.max(0, ...gridNodes.map(n => n.grid.row + n.grid.h));
  const cols = Math.max(gridCols, ...gridNodes.map(n => n.grid.col + n.grid.w));
  let trackX: number[] = [];
  let trackY: number[] = [];
  let colW: number[] = [];
  let rowH: number[] = [];
  if (cols > 0 && rows > 0) {
    colW = new Array<number>(cols).fill(sizeOf({ id: '', type: 'be', label: '' }).w);
    rowH = new Array<number>(rows).fill(sizeOf({ id: '', type: 'be', label: '' }).h);
    const spans: typeof gridNodes = [];
    for (const n of gridNodes) {
      const sz = sizeOf(n);
      if (n.grid.w === 1) colW[n.grid.col] = Math.max(colW[n.grid.col], sz.w);
      if (n.grid.h === 1) rowH[n.grid.row] = Math.max(rowH[n.grid.row], sz.h);
      if (n.grid.w > 1 || n.grid.h > 1) spans.push(n);
    }
    for (const n of spans) {
      const sz = sizeOf(n);
      const { col, row, w, h } = n.grid;
      const needW = sz.w - (colW.slice(col, col + w).reduce((a, b) => a + b, 0) + gapX * (w - 1));
      if (needW > 0) for (let c = col; c < col + w; c++) colW[c] += needW / w;
      const needH = sz.h - (rowH.slice(row, row + h).reduce((a, b) => a + b, 0) + gapY * (h - 1));
      if (needH > 0) for (let r = row; r < row + h; r++) rowH[r] += needH / h;
    }
    trackX = new Array<number>(cols);
    trackY = new Array<number>(rows);
    let x = pad;
    for (let c = 0; c < cols; c++) { trackX[c] = x; x += colW[c] + gapX; }
    let y = pad;
    for (let r = 0; r < rows; r++) { trackY[r] = y; y += rowH[r] + gapY; }
  }
  const W = cols > 0 && rows > 0 ? trackX[cols - 1] + colW[cols - 1] + pad : 0;
  const H = cols > 0 && rows > 0 ? trackY[rows - 1] + rowH[rows - 1] + pad : 0;
  const placed: Placed[] = nodes.map(n => {
    if (n.grid) {
      const { row, col, w, h } = n.grid;
      const box = {
        x: trackX[col], y: trackY[row],
        w: trackX[col + w - 1] + colW[col + w - 1] - trackX[col],
        h: trackY[row + h - 1] + rowH[row + h - 1] - trackY[row],
      };
      return { ...n, box, color: TYPE_COLOR[n.type] ?? -1 };
    }
    const sz = sizeOf(n);
    return { ...n, box: { x: n.px!.x, y: n.px!.y, w: n.px!.w ?? sz.w, h: n.px!.h ?? sz.h }, color: TYPE_COLOR[n.type] ?? -1 };
  });
  return { placed, W, H };
}

export type Side = 'left' | 'right' | 'top' | 'bottom';
const boxCx = (b: Box) => b.x + b.w / 2;
const boxCy = (b: Box) => b.y + b.h / 2;

// 端口:同面多边均匀扩散(第 i/n 条落在面长 (i+1)/(n+1) 处)
export function port(b: Box, side: Side, i: number, n: number): [number, number] {
  const len = side === 'left' || side === 'right' ? b.h : b.w;
  const off = ((i + 1) / (n + 1) - 0.5) * len;
  switch (side) {
    case 'left': return [b.x, boxCy(b) + off];
    case 'right': return [b.x + b.w, boxCy(b) + off];
    case 'top': return [boxCx(b) + off, b.y];
    case 'bottom': return [boxCx(b) + off, b.y + b.h];
  }
}

export function step(p: [number, number], side: Side, d: number): [number, number] {
  switch (side) {
    case 'left': return [p[0] - d, p[1]];
    case 'right': return [p[0] + d, p[1]];
    case 'top': return [p[0], p[1] - d];
    case 'bottom': return [p[0], p[1] + d];
  }
}

// 中线穿盒外推:撞到的盒子往来源方向同侧让出 16px(单次外推,网格布局下足够)
function nudgeMid(kind: 'v' | 'h', mid: number, p1: [number, number], p3: [number, number], a: Box, b: Box, others: Box[]): number {
  for (const o of others) {
    if (o === a || o === b) continue;
    if (kind === 'v') {
      const hit = mid >= o.x - 1 && mid <= o.x + o.w + 1
        && Math.min(p1[1], p3[1]) <= o.y + o.h && Math.max(p1[1], p3[1]) >= o.y;
      if (hit) mid = boxCx(a) < boxCx(o) ? o.x - 16 : o.x + o.w + 16;
    } else {
      const hit = mid >= o.y - 1 && mid <= o.y + o.h + 1
        && Math.min(p1[0], p3[0]) <= o.x + o.w && Math.max(p1[0], p3[0]) >= o.x;
      if (hit) mid = boxCy(a) < boxCy(o) ? o.y - 16 : o.y + o.h + 16;
    }
  }
  return mid;
}

// 折线按弧长取点(边标签锚点);t 为弧长比例
function polyAt(pts: [number, number][], t: number): { p: [number, number]; horiz: boolean } {
  const lens: number[] = [];
  let total = 0;
  for (let i = 1; i < pts.length; i++) {
    const l = Math.abs(pts[i][0] - pts[i - 1][0]) + Math.abs(pts[i][1] - pts[i - 1][1]);
    lens.push(l); total += l;
  }
  let acc = 0;
  for (let i = 0; i < lens.length; i++) {
    if (acc + lens[i] >= total * t && lens[i] > 0) {
      const f = (total * t - acc) / lens[i];
      const [x1, y1] = pts[i]; const [x2, y2] = pts[i + 1];
      return { p: [x1 + (x2 - x1) * f, y1 + (y2 - y1) * f], horiz: y1 === y2 };
    }
    acc += lens[i];
  }
  return { p: pts[pts.length - 1], horiz: true };
}

const rectsOverlap = (a: Box, b: Box): boolean =>
  a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y;

export interface Routed {
  e: ArchEdge;
  pts: [number, number][];
  stroke: string;
  width: number;
  dash: string;
  marker: string;
}

// 出/入面由中心差主轴决定(网格布局下单调,天然不回折);同面多边按出现序扩散

// 直角肘形路由(mermaid 语法糖):直线优先——同层对齐即纯直线;有落差在
// 中点垂直折一次(水平→垂直→水平);反向边从下方 U 形直角绕回。
// 线只为节点与方向折,永不因文字折(标签就近放置,不影响线形)。
function straightRoutes(placed: Placed[], edges: ArchEdge[], dir: 'TB' | 'LR'): Routed[] {
  const byId = new Map(placed.map(p => [p.id, p]));
  const lr = dir === 'LR';
  return edges.map(e => {
    const a = byId.get(e.from)!.box;
    const b = byId.get(e.to)!.box;
    let pts: [number, number][];
    const back = lr ? boxCx(b) < boxCx(a) : boxCy(b) < boxCy(a);
    if (back) {
      // 反向边:出底/右缘,外圈 U 形直角绕回
      if (lr) {
        const loopY = Math.max(a.y + a.h, b.y + b.h) + 36;
        pts = [[boxCx(a), a.y + a.h], [boxCx(a), loopY], [boxCx(b), loopY], [boxCx(b), b.y + b.h]];
      } else {
        const loopX = Math.max(a.x + a.w, b.x + b.w) + 36;
        pts = [[a.x + a.w, boxCy(a)], [loopX, boxCy(a)], [loopX, boxCy(b)], [b.x + b.w, boxCy(b)]];
      }
    } else if (lr) {
      const x0 = a.x + a.w, y0 = boxCy(a), x1 = b.x, y1 = boxCy(b);
      pts = Math.abs(y0 - y1) <= 14
        ? [[x0, y0], [x1, y1]]
        : [[x0, y0], [Math.round((x0 + x1) / 2), y0], [Math.round((x0 + x1) / 2), y1], [x1, y1]];
    } else {
      const x0 = boxCx(a), y0 = a.y + a.h, x1 = boxCx(b), y1 = b.y;
      pts = Math.abs(x0 - x1) <= 14
        ? [[x0, y0], [x1, y1]]
        : [[x0, y0], [x0, Math.round((y0 + y1) / 2)], [x1, Math.round((y0 + y1) / 2)], [x1, y1]];
    }
    return {
      e,
      pts,
      stroke: 'var(--d-muted)',
      width: 1.8,
      dash: e.variant === 'dash' ? ' stroke-dasharray="5 4"' : '',
      marker: 'am-p',
    };
  });
}

export function computeRoutes(placed: Placed[], edges: ArchEdge[]): Routed[] {
  const byId = new Map(placed.map(p => [p.id, p]));
  const boxes = placed.map(p => p.box);
  const exitSeen = new Map<string, number>();
  const entrySeen = new Map<string, number>();
  const exitAt: number[] = [];
  const entryAt: number[] = [];
  const sides: { exit: Side; entry: Side }[] = edges.map(e => {
    const a = byId.get(e.from)!.box;
    const b = byId.get(e.to)!.box;
    const horiz = Math.abs(boxCx(b) - boxCx(a)) >= Math.abs(boxCy(b) - boxCy(a));
    const toRight = boxCx(b) >= boxCx(a);
    const down = boxCy(b) >= boxCy(a);
    return {
      exit: horiz ? (toRight ? 'right' : 'left') : down ? 'bottom' : 'top',
      entry: horiz ? (toRight ? 'left' : 'right') : down ? 'top' : 'bottom',
    };
  });
  edges.forEach((e, i) => {
    const ek = `${e.from}|${sides[i].exit}`;
    exitAt[i] = exitSeen.get(ek) ?? 0;
    exitSeen.set(ek, exitAt[i] + 1);
    const rk = `${e.to}|${sides[i].entry}`;
    entryAt[i] = entrySeen.get(rk) ?? 0;
    entrySeen.set(rk, entryAt[i] + 1);
  });
  return edges.map((e, i) => {
    const a = byId.get(e.from)!;
    const b = byId.get(e.to)!;
    const { exit, entry } = sides[i];
    const p0 = port(a.box, exit, exitAt[i], exitSeen.get(`${e.from}|${exit}`) ?? 1);
    const p4 = port(b.box, entry, entryAt[i], entrySeen.get(`${e.to}|${entry}`) ?? 1);
    const OUT = 14;
    const p1 = step(p0, exit, OUT);
    const p3 = step(p4, entry, OUT);
    let pts: [number, number][];
    if (exit === 'left' || exit === 'right') {
      const mid = nudgeMid('v', (p1[0] + p3[0]) / 2, p1, p3, a.box, b.box, boxes);
      pts = [p0, p1, [mid, p1[1]], [mid, p3[1]], p3, p4];
    } else {
      const mid = nudgeMid('h', (p1[1] + p3[1]) / 2, p1, p3, a.box, b.box, boxes);
      pts = [p0, p1, [p1[0], mid], [p3[0], mid], p3, p4];
    }
    const style = e.variant === 'main'
      ? { stroke: 'var(--d-ink)', width: 1.8, marker: 'am-m', dash: '' }
      : e.variant === 'dash'
        ? { stroke: 'var(--d-faint)', width: 1.4, marker: 'am-d', dash: ' stroke-dasharray="5 4"' }
        : { stroke: 'var(--d-muted)', width: 1.4, marker: 'am-p', dash: '' };
    return { e, pts, ...style };
  });
}

function drawRoutes(routed: Routed[], interactive = false, style: ArchStyle = 'base', byId?: Map<string, Placed>): string {
  return routed.map(rt => {
    const d = rt.pts.map((p, j) => `${j === 0 ? 'M' : 'L'}${r2(p[0])} ${r2(p[1])}`).join('');
    const ia = interactive ? ` data-from="${esc(rt.e.from)}" data-to="${esc(rt.e.to)}"` : '';
    let stroke = rt.stroke;
    let width = rt.width;
    if (style === 'soft') {
      const src = byId?.get(rt.e.from);
      stroke = src && src.color >= 0 ? sVar(src.color) : rt.stroke;
      width = Math.max(rt.width, 1.6);
    } else if (style === 'mono') {
      stroke = 'var(--d-muted)';
    }
    return `<path d="${d}"${ia} fill="none" stroke="${stroke}" stroke-width="${width}"${rt.dash} marker-end="url(#${rt.marker})"/>`;
  }).join('');
}

// 边标签多候选避让:弧长 7 档 × 线两侧(横线上/下,竖线右/左),首个不撞胜出
function drawEdgeLabels(routed: Routed[], avoid: Box[], interactive = false): string {
  const out: string[] = [];
  for (const rt of routed) {
    const text = rt.e.label;
    if (!text) continue;
    const ia = interactive ? ` data-edge-label="${esc(rt.e.from)} ${esc(rt.e.to)}"` : '';
    const w = textW(text, 11) + 10;
    const rectOf = (p: [number, number], horiz: boolean, mirror: boolean): Box =>
      horiz
        ? { x: p[0] - w / 2, y: mirror ? p[1] + 2 : p[1] - 17, w, h: 16 }
        : { x: mirror ? p[0] - w - 4 : p[0] + 4, y: p[1] - 8, w, h: 16 };
    let place: { p: [number, number]; horiz: boolean; mirror: boolean } | undefined;
    for (const t of [0.5, 0.38, 0.62, 0.3, 0.7, 0.2, 0.8]) {
      const at = polyAt(rt.pts, t);
      for (const mirror of [false, true]) {
        if (!avoid.some(r => rectsOverlap(rectOf(at.p, at.horiz, mirror), r))) {
          place = { ...at, mirror };
          break;
        }
      }
      if (place) break;
    }
    if (!place) place = { ...polyAt(rt.pts, 0.5), mirror: false };
    const attrs = place.horiz
      ? `x="${r2(place.p[0])}" y="${r2(place.p[1] + (place.mirror ? 14 : -6))}" text-anchor="middle"`
      : `x="${r2(place.p[0] + (place.mirror ? -6 : 6))}" y="${r2(place.p[1] + 3.5)}" text-anchor="${place.mirror ? 'end' : 'start'}"`;
    out.push(`<text${ia} ${attrs} font-size="11" fill="var(--d-text)">${esc(text)}</text>`);
  }
  return out.join('');
}

// 风格变体(?t=):base=卡片+角色色条(默认);mono=文档线框(墨色直角,无色);
// soft=柔和填色(圆角胶囊,按节点角色淡填充+同色描边,连线随源节点着色)
export type ArchStyle = 'base' | 'mono' | 'soft';
export const ARCH_STYLES: ArchStyle[] = ['base', 'mono', 'soft'];

// 形状帧:rect(默认)/diamond(判定)/cylinder(存储)/round(胶囊)。
// soft 用同色淡填充;mono 墨线;base 用中性卡+角色色条(菱形/圆柱不吃色条)
function nodeFrame(b: Box, shape: NonNullable<ArchNode['shape']>, style: ArchStyle, color: number, dash: string, tint: string | null): string {
  const stroke = tint ?? (style === 'mono' ? 'var(--d-ink)' : 'var(--d-border)');
  const fill = tint ? `${tint}" fill-opacity="0.13` : 'var(--d-card)';
  const sw = style === 'mono' || tint ? 1.2 : 1;
  if (shape === 'diamond') {
    const pts = `${r2(boxCx(b))},${r2(b.y + 3)} ${r2(b.x + b.w - 3)},${r2(boxCy(b))} ${r2(boxCx(b))},${r2(b.y + b.h - 3)} ${r2(b.x + 3)},${r2(boxCy(b))}`;
    return `<polygon points="${pts}" fill="${fill}" stroke="${stroke}" stroke-width="${sw}"${dash}/>`;
  }
  if (shape === 'cylinder') {
    const ry = 7;
    return `<path d="M${r2(b.x)} ${r2(b.y + ry)}A${r2(b.w / 2)} ${ry} 0 0 1 ${r2(b.x + b.w)} ${r2(b.y + ry)}V${r2(b.y + b.h - ry)}A${r2(b.w / 2)} ${ry} 0 0 1 ${r2(b.x)} ${r2(b.y + b.h - ry)}Z" fill="${fill}" stroke="${stroke}" stroke-width="${sw}"${dash}/>` +
      `<ellipse cx="${r2(boxCx(b))}" cy="${r2(b.y + ry)}" rx="${r2(b.w / 2)}" ry="${ry}" fill="none" stroke="${stroke}" stroke-width="${sw}"/>`;
  }
  const rx = shape === 'round' ? r2(b.h / 2) : style === 'mono' ? 2 : style === 'soft' ? 14 : 8;
  return `<rect x="${r2(b.x)}" y="${r2(b.y)}" width="${r2(b.w)}" height="${r2(b.h)}" rx="${rx}" fill="${fill}" stroke="${stroke}" stroke-width="${sw}"${dash}/>`;
}

function drawNode(n: Placed, interactive = false, degree = 0, style: ArchStyle = 'base'): string {
  const { box: b, color } = n;
  const dash = n.type === 'ext' ? ' stroke-dasharray="5 3"' : '';
  const tint = style === 'soft' && color >= 0 ? sVar(color) : null;
  const frame = nodeFrame(b, n.shape ?? 'rect', style, color, dash, tint);
  const accent = style === 'base' && color >= 0 && n.type !== 'ext' && !(n.shape === 'diamond' || n.shape === 'cylinder')
    ? `<rect x="${r2(b.x)}" y="${r2(b.y)}" width="3.5" height="${r2(b.h)}" rx="1.5" fill="${sVar(color)}"/>`
    : '';
  const labelY = n.sub ? boxCy(b) - 3 : boxCy(b) + 4.5;
  const sub = n.sub
    ? `<text x="${r2(boxCx(b))}" y="${r2(boxCy(b) + 15)}" text-anchor="middle" font-size="11" fill="var(--d-muted)">${esc(n.sub)}</text>`
    : '';
  // interactive(explore 落地页):data-tip 悬停说明 + data-node 供点击高亮连通关系
  const ia = interactive
    ? ` data-node="${esc(n.id)}" data-tip="${esc(`${n.label} · ${n.type}${n.sub ? ` · ${n.sub}` : ''}${degree ? ` · ${degree} link${degree > 1 ? 's' : ''}` : ''}`)}" tabindex="0"`
    : '';
  return (
    `<g${ia}>` +
    frame +
    accent +
    `<text x="${r2(boxCx(b))}" y="${r2(labelY)}" text-anchor="middle" font-size="13" font-weight="500" fill="var(--d-ink)">${esc(n.label)}</text>` +
    sub +
    `</g>`
  );
}

export function boundaryBox(byId: Map<string, Placed>, bd: ArchBoundary): Box {
  const boxes = bd.ids.map(id => byId.get(id)!.box);
  const x = Math.min(...boxes.map(o => o.x)) - 14;
  const y = Math.min(...boxes.map(o => o.y)) - 14;
  return {
    x, y,
    w: Math.max(...boxes.map(o => o.x + o.w)) + 14 - x,
    h: Math.max(...boxes.map(o => o.y + o.h)) + 14 - y,
  };
}

interface Corner { x: number; y: number; anchor: 'start' | 'end' }

// 边界标签四角择优:远离边走线(权重高)与节点盒;平手偏好左上(视觉惯例)
function boundaryLabelCorner(box: Box, label: string, routed: Routed[], boxes: Box[]): Corner {
  const w = textW(label, 10) + label.length * 1.2;
  const cands: Corner[] = [
    { x: box.x + 12, y: box.y + 3.5, anchor: 'start' },               // TL
    { x: box.x + box.w - 12, y: box.y + 3.5, anchor: 'end' },         // TR
    { x: box.x + box.w - 12, y: box.y + box.h - 3.5, anchor: 'end' }, // BR
    { x: box.x + 12, y: box.y + box.h - 3.5, anchor: 'start' },       // BL
  ];
  const rectOf = (c: Corner): Box => ({
    x: c.anchor === 'start' ? c.x - 6 : c.x - w - 6,
    y: c.y - 13,
    w: w + 12,
    h: 26,
  });
  let best = cands[0];
  let bestScore = Infinity;
  cands.forEach((c, idx) => {
    const r = rectOf(c);
    let score = idx * 0.01; // 平手序 TL < TR < BR < BL
    for (const rt of routed) {
      for (let i = 1; i < rt.pts.length; i++) {
        if (segRectIntersect(rt.pts[i - 1][0], rt.pts[i - 1][1], rt.pts[i][0], rt.pts[i][1], r.x, r.y, r.w, r.h)) {
          score += 10;
          break;
        }
      }
    }
    for (const b of boxes) if (rectsOverlap(r, b)) score += 5;
    if (score < bestScore) { bestScore = score; best = c; }
  });
  return best;
}

function drawBoundaries(placed: Placed[], boundaries: ArchBoundary[], corners: Corner[], interactive = false): string {
  const byId = new Map(placed.map(p => [p.id, p]));
  return boundaries.map((bd, i) => {
    const box = boundaryBox(byId, bd);
    const c = corners[i];
    // interactive:带成员 id 清单,选中态下客户端据此判断边界是否相关(相关=含 .on 节点)
    const ia = interactive ? ` data-boundary="${esc(bd.ids.join(' '))}"` : '';
    return (
      `<g${ia}>` +
      `<rect x="${r2(box.x)}" y="${r2(box.y)}" width="${r2(box.w)}" height="${r2(box.h)}" rx="10" fill="none" stroke="var(--d-border)" stroke-width="1.2"/>` +
      `<text x="${r2(c.x)}" y="${r2(c.y)}" text-anchor="${c.anchor}" dominant-baseline="middle" font-size="10" font-weight="600" letter-spacing="1.2" fill="var(--d-faint)">${esc(bd.label.toUpperCase())}</text>` +
      `</g>`
    );
  }).join('');
}

const DEFS =
  `<defs>` +
  `<marker id="am-p" viewBox="0 0 10 10" refX="8.5" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0L10 5L0 10z" fill="var(--d-muted)"/></marker>` +
  `<marker id="am-m" viewBox="0 0 10 10" refX="8.5" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0L10 5L0 10z" fill="var(--d-ink)"/></marker>` +
  `<marker id="am-d" viewBox="0 0 10 10" refX="8.5" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0L10 5L0 10z" fill="var(--d-faint)"/></marker>` +
  `</defs>`;

/**
 * Render an architecture map from a URL's query params (`/draw/archmap`).
 *
 * Nodes carry their grid cell (`r0c1`, optional `w`/`h` spans up to 3) or a
 * pixel escape hatch (`p40,80`); the engine auto-sizes tracks, routes
 * orthogonal edges and rejects cell double-booking. Throws ApiError(400)
 * with a corrective example on malformed params.
 */
export function renderArchmapFromUrl(url: URL, interactive = false): DrawResult {
  const params = url.searchParams;
  const nRaw = params.getAll('n');
  if (!nRaw.length) bad('at least one node is required');
  const nodes = parseNodes(nRaw);
  const seen = new Set<string>();
  for (const n of nodes) {
    if (seen.has(n.id)) bad(`duplicate node id "${n.id}"`);
    seen.add(n.id);
  }
  const edges = parseEdges(params.getAll('e'), seen);
  const boundaries = parseBoundaries(params.getAll('b'), seen);
  const title = params.get('title')?.trim() || undefined;
  const gridCols = clampInt(params, 'grid', 0, 1, 12);
  const v = resolveVersion(params.get('v'));
  // t= 为架构图自有风格(base/mono/soft);其余值透传 sankey 皮肤(调色板复用)
  const tParam = params.get('t');
  const style: ArchStyle = tParam === 'mono' || tParam === 'soft' ? tParam : 'base';
  const skin = resolveSkin('sankey', style === 'base' ? tParam : null, schemeParam(params));

  return renderArchmapCore({ nodes, edges, boundaries, title, style, interactive, gridCols, v, skin,
    minW: clampInt(params, 'w', 0, 200, 2000), minH: clampInt(params, 'h', 0, 140, 2000),
    tagQuery: url.search });
}

// spec 级入口:节点/边/边界 + 版本与皮肤由调用方备好(mermaid 语法糖复用此层)
export interface ArchmapCoreOpts {
  nodes: ArchNode[];
  edges: ArchEdge[];
  boundaries: ArchBoundary[];
  title?: string;
  style: ArchStyle;
  interactive: boolean;
  gridCols: number;
  minW?: number;
  minH?: number;
  v: VersionInfo;
  skin: Skin;
  aria?: string;
  /** 正交折线(默认,格位架构图)或直连线(mermaid 流程图:迎面边直连,零弯折) */
  edgeMode?: 'ortho' | 'straight';
  straightDir?: 'TB' | 'LR';
  /** 原始 URL 查询串:角标直链 explore 落地页用(#44) */
  tagQuery?: string;
  /** 角标 explore 路径段(mermaid 复用本引擎时为 'mermaid') */
  tagKind?: string;
}
export function renderArchmapCore(o: ArchmapCoreOpts): DrawResult {
  const { placed, W, H } = packGrid(o.nodes, o.gridCols);
  // 无标题也留 30px 角标带(#44):Edit 胶囊占右上 y≈25–45,不留带会压住首行节点
  const titleH = o.title ? 40 : 30;
  let width = Math.max(W, 320);
  let bodyH = H;
  for (const p of placed) { // 像素节点可能超出轨道画布
    width = Math.max(width, p.box.x + p.box.w + PAD);
    bodyH = Math.max(bodyH, p.box.y + p.box.h + PAD);
  }
  width = Math.max(width, o.minW ?? 0);
  const height = Math.max(bodyH + titleH, o.minH ?? 0);
  // 管线:路由 → 边界标签选角(避开走线) → 边标签避让(节点盒 ∪ 边界标签区)
  const routed = o.edgeMode === 'straight' ? straightRoutes(placed, o.edges, o.straightDir ?? 'TB') : computeRoutes(placed, o.edges);
  const byId = new Map(placed.map(p => [p.id, p]));
  const boxes = placed.map(p => p.box);
  const corners = o.boundaries.map(bd => boundaryLabelCorner(boundaryBox(byId, bd), bd.label.toUpperCase(), routed, boxes));
  const cornerRect = (bd: ArchBoundary, c: Corner): Box => {
    const w = textW(bd.label.toUpperCase(), 10) + bd.label.length * 1.2;
    return { x: c.anchor === 'start' ? c.x - 6 : c.x - w - 6, y: c.y - 13, w: w + 12, h: 26 };
  };
  const avoid: Box[] = [
    ...boxes.map(b => ({ x: b.x - 2, y: b.y - 2, w: b.w + 4, h: b.h + 4 })),
    ...o.boundaries.map((bd, i) => cornerRect(bd, corners[i])),
  ];
  const titleSvg = o.title
    ? `<text x="${PAD}" y="${PAD + 14}" font-size="18" font-weight="500" letter-spacing="-0.02em" fill="var(--d-ink)">${esc(o.title)}</text>`
    : '';
  // interactive 悬停强调 + 点击高亮(1-hop 连通)样式;客户端脚本在 explore 落地页。
  // Figma/Miro 式:悬停 = 提亮,选中 = 提亮 + 未选中淡化;无描边/无换色/无 transform
  // (transform 会被入场动画 draw-rise 的 fill-both 终态锁死,勿用)
  const iStyle = o.interactive
    ? `<style>#am g[data-node]{cursor:pointer;transition:filter .12s ease,opacity .15s ease}` +
      `#am g[data-node]:focus{outline:none}` +
      `#am g[data-node]:hover,#am g[data-node]:focus-visible{filter:brightness(1.3)}` +
      `#am g[data-node].on{filter:brightness(1.3)}` +
      `#am.hl g[data-node]{opacity:.45}#am.hl g[data-node].on{opacity:1}` +
      `#am.hl g[data-boundary]{opacity:.4}#am.hl g[data-boundary].on{opacity:1}` +
      `#am.hl path[data-from]{opacity:.25}#am.hl path[data-from].on{opacity:1}` +
      `#am.hl text[data-edge-label]{opacity:.3}#am.hl text[data-edge-label].on{opacity:1}</style>`
    : '';
  const degree = new Map<string, number>();
  if (o.interactive) for (const e of o.edges) {
    degree.set(e.from, (degree.get(e.from) ?? 0) + 1);
    degree.set(e.to, (degree.get(e.to) ?? 0) + 1);
  }
  const body = iStyle + DEFS
    + drawBoundaries(placed, o.boundaries, corners, o.interactive)
    + drawRoutes(routed, o.interactive, o.style, byId)
    + drawEdgeLabels(routed, avoid, o.interactive)
    + placed.map(p => drawNode(p, o.interactive, degree.get(p.id) ?? 0, o.style)).join('');
  // 标题占位下移 + h 垫高的剩余空间上下均分(内容垂直居中,标题仍在顶部)
  const dy = titleH + (height - titleH - bodyH) / 2;
  const children = titleSvg + `<g id="am" transform="translate(0 ${r2(dy)})">` + body + `</g>`;
  const spec: ArchSpec = { type: 'archmap', ...(o.title ? { title: o.title } : {}), nodes: o.nodes, edges: o.edges, boundaries: o.boundaries };
  const svg = svgDoc(width, height, 'archmap', o.v.version, o.aria ?? o.title ?? `architecture map, ${o.nodes.length} nodes`, spec, o.skin, children, o.tagQuery, o.tagKind);
  return { svg, version: o.v.version, cacheControl: o.v.cacheControl };
}


