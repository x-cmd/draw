// /draw/arch —— 架构图 v2:同一套 URL 模型(data 和布局都写在 URL 里),换一张更像架构图的脸。
//
// 与 /draw/archmap 的关系:模型一模一样(n=/e=/b=),只是长相不同:
//   - 节点按语义类型着色(淡填色 + 同色描边),不再是一根色条
//   - 左上角一个类型角标(F/B/D/C/S/M/V/X)
//   - 底部一行图例:类型 + 个数
//   - 轨道间距、节点尺寸、画布留白都更松,图能撑到该有的那么大
//   - 边标签带底衬,线不再从字上穿过
//   - 边界用虚线框 + 标签胶囊
//
// 老路径 /draw/archmap 一行未动(它的输出与 v2 之前逐字节相同)。
import { ApiError } from '../specs/index.js';
import type { ArchBoundary, ArchEdge, ArchNode } from './archmap.js';
import {
  boundaryBox, packGrid, parseBoundaries, parseEdges, parseNodes, port, step,
  type Box, type Placed, type Side,
} from './archmap.js';
import { resolveSkin } from '../styles/index.js';
import { clampInt, schemeParam, type DrawResult } from './query.js';
import { esc, r2, svgDoc, textW } from './svg.js';

/* ---------------------------------------------------------------- 视觉常量 */
const PAD = 44;          // 画布留白
const GAP_X = 64;        // 轨道横距
const GAP_Y = 56;        // 轨道纵距
const LEGEND_H = 46;     // 图例带的高度
const NODE_MIN_W = 176;
const NODE_R = 12;       // 节点圆角
const BADGE = 20;        // 角标边长
const LABEL_FS = 14;     // 节点标题字号
const SUB_FS = 11.5;     // 节点副标题字号
const EDGE_FS = 11.5;    // 边标签字号

/** 一套语义类型词汇:类型 → (展示名, 角标字母, 颜色序号);图种换词汇,引擎不变 */
export interface HouseTypes {
  meta: Record<string, { name: string; badge: string; color: number }>;
  order: string[];
  /** 类型 → 形状(rect / round / cylinder / diamond) */
  shape?: Record<string, 'rect' | 'round' | 'cylinder' | 'diamond'>;
}

/** 语义类型 → (展示名, 角标字母) */
export const TYPE_META: Record<string, { name: string; badge: string; color: number }> = {
  fe: { name: 'Frontend', badge: 'F', color: 0 },
  be: { name: 'Backend', badge: 'B', color: 1 },
  db: { name: 'Database', badge: 'D', color: 2 },
  cloud: { name: 'Cloud', badge: 'C', color: 3 },
  sec: { name: 'Security', badge: 'S', color: 4 },
  bus: { name: 'Message bus', badge: 'M', color: 5 },
  svc: { name: 'Service', badge: 'V', color: 6 },
  ext: { name: 'External', badge: 'X', color: -1 },
};
const TYPE_ORDER = ['fe', 'be', 'db', 'cloud', 'sec', 'bus', 'svc', 'ext'] as const;

/** 架构图这套词汇(别的图种传自己的一套进来) */
export const ARCH_TYPES: HouseTypes = { meta: TYPE_META, order: [...TYPE_ORDER] };

const sVar = (i: number): string => `var(--d-s${i + 1})`;

/** v2 的节点尺寸:更宽更松,标题 14px;副标题多行时按行数长高 */
const v2Size = (n: ArchNode): { w: number; h: number } => {
  const lines = linesOf(n);
  const w = Math.max(
    NODE_MIN_W,
    textW(n.label, LABEL_FS) + 52,
    ...lines.map((l) => textW(l, SUB_FS) + 52),
  );
  const h = lines.length > 1 ? 34 + lines.length * 17 : n.sub ? 62 : 48;
  return { w: Math.min(w, 420), h };
};

/** 节点副标题可以多行(用 \n 分隔)—— ERD 的字段表、class 的成员表靠它 */
const linesOf = (n: { sub?: string }): string[] =>
  n.sub ? n.sub.split('\n').filter((l) => l !== '') : [];

/* ---------------------------------------------------------------- 节点 */
function drawNodeV2(n: Placed, interactive: boolean, degree: number, types: HouseTypes): string {
  const b = n.box;
  const meta = types.meta[n.type] ?? { name: n.type, badge: '?', color: -1 };
  const neutral = meta.color < 0;
  const color = neutral ? 'var(--d-muted)' : sVar(meta.color);
  const fill = neutral ? 'var(--d-card)' : color;
  const fillOp = neutral ? 1 : 0.1;
  const strokeOp = neutral ? 1 : 0.5;
  const dash = neutral ? ' stroke-dasharray="5 3"' : '';
  const titleW = textW(n.label, LABEL_FS);
  const subW = n.sub ? textW(n.sub, SUB_FS) : 0;
  // 角标在左上角;标题居中,若会撞上角标就右移半个角标
  const bx = b.x + 12;
  const by = b.y + 12;
  const badgeRight = bx + BADGE;
  let tx = b.x + b.w / 2;
  if (n.sub) {
    if (tx - titleW / 2 < badgeRight + 6) tx = badgeRight + 6 + titleW / 2;
  } else if (tx - titleW / 2 < badgeRight + 6 && bx < b.x + b.w / 2) {
    tx = badgeRight + 6 + titleW / 2;
  }
  const lines = linesOf(n);
  const titleY = n.sub ? b.y + 26 : b.y + b.h / 2 + 5;
  const tip = `${n.label}${n.sub ? ` · ${n.sub.replace(/\n/g, ', ')}` : ''} · ${meta.name}${degree ? ` · ${degree} link${degree > 1 ? 's' : ''}` : ''}`;
  const ia = interactive
    ? ` data-node="${esc(n.id)}" data-tip="${esc(tip)}" tabindex="0"`
    : '';
  const badgeFill = neutral ? 'var(--d-muted)' : color;
  const shape = types.shape?.[n.type] ?? 'rect';
  const fillAttrs = ` fill="${fill}" fill-opacity="${fillOp}" stroke="${color}" stroke-opacity="${strokeOp}" stroke-width="1.3"${dash}`;
  let frame: string;
  if (shape === 'cylinder') {
    const ry = 9;
    frame =
      `<path d="M${r2(b.x)} ${r2(b.y + ry)}A${r2(b.w / 2)} ${ry} 0 0 1 ${r2(b.x + b.w)} ${r2(b.y + ry)}V${r2(b.y + b.h - ry)}A${r2(b.w / 2)} ${ry} 0 0 1 ${r2(b.x)} ${r2(b.y + b.h - ry)}Z"${fillAttrs}/>` +
      `<ellipse cx="${r2(b.x + b.w / 2)}" cy="${r2(b.y + ry)}" rx="${r2(b.w / 2)}" ry="${ry}" fill="none" stroke="${color}" stroke-opacity="${strokeOp}" stroke-width="1.3"/>`;
  } else if (shape === 'diamond') {
    const cx = b.x + b.w / 2;
    const cy = b.y + b.h / 2;
    frame = `<polygon points="${r2(cx)},${r2(b.y)} ${r2(b.x + b.w)},${r2(cy)} ${r2(cx)},${r2(b.y + b.h)} ${r2(b.x)},${r2(cy)}"${fillAttrs}/>`;
  } else if (shape === 'round') {
    frame = `<rect x="${r2(b.x)}" y="${r2(b.y)}" width="${r2(b.w)}" height="${r2(b.h)}" rx="${r2(b.h / 2)}"${fillAttrs}/>`;
  } else {
    frame = `<rect x="${r2(b.x)}" y="${r2(b.y)}" width="${r2(b.w)}" height="${r2(b.h)}" rx="${NODE_R}"${fillAttrs}/>`;
  }
  return (
    `<g${ia}>` +
    frame +
    `<rect x="${r2(bx)}" y="${r2(by)}" width="${BADGE}" height="${BADGE}" rx="6"` +
    ` fill="${badgeFill}" fill-opacity="${neutral ? 0.18 : 0.2}" stroke="${badgeFill}" stroke-opacity="${neutral ? 0.5 : 0.55}" stroke-width="1"/>` +
    `<text x="${r2(bx + BADGE / 2)}" y="${r2(by + BADGE / 2 + 3.6)}" text-anchor="middle" font-size="10.5" font-weight="700" fill="${color}">${esc(meta.badge)}</text>` +
    `<text x="${r2(tx)}" y="${r2(titleY)}" text-anchor="middle" font-size="${LABEL_FS}" font-weight="600" fill="var(--d-ink)">${esc(n.label)}</text>` +
    (n.sub
      ? lines.length
        ? lines.map((l, i) => `<text x="${r2(b.x + b.w / 2)}" y="${r2(b.y + 44 + i * 17)}" text-anchor="middle" font-size="${SUB_FS}" fill="var(--d-muted)">${esc(l)}</text>`).join('')
        : `<text x="${r2(b.x + b.w / 2)}" y="${r2(b.y + 44)}" text-anchor="middle" font-size="${SUB_FS}" fill="var(--d-muted)">${esc(n.sub)}</text>`
      : '') +
    `</g>`
  );
}

/* ---------------------------------------------------------------- 走线
   v2 自己走线:横向的线遇到挡路的盒子就绕行(下一条空通道),不横穿别人的框。
   老路径的 computeRoutes 一行未动 —— 那是老图的形状,不能变。 */
interface V2Routed { e: ArchEdge; pts: [number, number][]; dash: string; marker: string }

const segHits = (x1: number, y1: number, x2: number, y2: number, b: Box): boolean => {
  if (y1 === y2) return y1 > b.y && y1 < b.y + b.h && x2 > b.x && x1 < b.x + b.w;
  return x1 > b.x && x1 < b.x + b.w && y2 > b.y && y1 < b.y + b.h;
};

const hitBox = (x1: number, y1: number, x2: number, y2: number, boxes: Box[]): boolean =>
  boxes.some((b) => segHits(x1, y1, x2, y2, b));

/** 在 a/b 之外找一条横向通道:先往下找,再往上找,取第一条不撞盒子的 */
function detourY(a: Box, b: Box, x1: number, x2: number, boxes: Box[]): number {
  const lo = Math.min(x1, x2);
  const hi = Math.max(x1, x2);
  const cands = [
    Math.max(a.y + a.h, b.y + b.h) + 22,
    Math.max(a.y + a.h, b.y + b.h) + 54,
    Math.min(a.y, b.y) - 22,
    Math.min(a.y, b.y) - 54,
  ];
  for (const y of cands) {
    if (!hitBox(lo, y, hi, y, boxes)) return y;
  }
  return cands[0];
}

function computeRoutesV2(placed: Placed[], edges: ArchEdge[]): V2Routed[] {
  const byId = new Map(placed.map((p) => [p.id, p]));
  const boxes = placed.map((p) => p.box);
  const cx = (b: Box) => b.x + b.w / 2;
  const cy = (b: Box) => b.y + b.h / 2;

  // 选边:横向优先(和 archmap 一致),再决定出/入口在哪一侧
  const sides: { exit: Side; entry: Side }[] = edges.map((e) => {
    const a = byId.get(e.from)!.box;
    const b = byId.get(e.to)!.box;
    // 目标(或源)横跨在自己的正下方/正上方 → 竖着走,别从侧面绕
    const stacked = (b.x <= cx(a) && cx(a) <= b.x + b.w) || (a.x <= cx(b) && cx(b) <= a.x + a.w);
    const horiz = !stacked && Math.abs(cx(b) - cx(a)) >= Math.abs(cy(b) - cy(a));
    const toRight = cx(b) >= cx(a);
    const down = cy(b) >= cy(a);
    return {
      exit: horiz ? (toRight ? 'right' : 'left') : down ? 'bottom' : 'top',
      entry: horiz ? (toRight ? 'left' : 'right') : down ? 'top' : 'bottom',
    };
  });

  // 扇出组:同一个源、多条边、目标在同一行且都在源下面 —— 走一条公共的横向通道
  // (像总线),谁也不横穿别人的盒子
  const groups = new Map<string, number[]>();
  edges.forEach((e, i) => {
    const a = byId.get(e.from)!.box;
    const b = byId.get(e.to)!.box;
    const sameRow = Math.abs(cy(b) - cy(a)) < 8;
    const below = cy(b) > cy(a) + 8;
    if (!sameRow || !below) return;
    const key = `${e.from}|${Math.round(cy(b))}`;
    const g = groups.get(key) ?? [];
    g.push(i);
    groups.set(key, g);
  });

  const exitSeen = new Map<string, number>();
  const entrySeen = new Map<string, number>();
  const exitAt: number[] = [];
  const entryAt: number[] = [];
  edges.forEach((e, i) => {
    const ek = `${e.from}|${sides[i].exit}`;
    exitAt[i] = exitSeen.get(ek) ?? 0;
    exitSeen.set(ek, exitAt[i] + 1);
    const rk = `${e.to}|${sides[i].entry}`;
    entryAt[i] = entrySeen.get(rk) ?? 0;
    entrySeen.set(rk, entryAt[i] + 1);
  });

  const OUT = 16;
  const routed: V2Routed[] = [];
  const busOf = new Map<number, { channelY: number; n: number }>();

  for (const [key, idxs] of groups) {
    if (idxs.length < 2) continue;
    const src = byId.get(edges[idxs[0]].from)!.box;
    const channelY = src.y + src.h + 26;
    idxs.forEach((i) => busOf.set(i, { channelY, n: idxs.length }));
  }

  edges.forEach((e, i) => {
    const a = byId.get(e.from)!;
    const b = byId.get(e.to)!;
    const style = e.variant === 'main'
      ? { stroke: 'var(--d-ink)', width: 1.8, marker: 'am-m', dash: '' }
      : e.variant === 'dash'
        ? { stroke: 'var(--d-faint)', width: 1.4, marker: 'am-d', dash: ' stroke-dasharray="5 4"' }
        : { stroke: 'var(--d-muted)', width: 1.4, marker: 'am-p', dash: '' };

    const bus = busOf.get(i);
    if (bus) {
      // 总线:从源底边下来 → 走到目标的横向位置 → 落进目标顶边
      const p0 = port(a.box, 'bottom', exitAt[i], bus.n);
      const p4 = port(b.box, 'top', entryAt[i], bus.n);
      routed.push({ e, pts: [p0, [p0[0], bus.channelY], [p4[0], bus.channelY], p4], ...style } as V2Routed & { stroke: string; width: number });
      return;
    }

    const { exit, entry } = sides[i];
    const p0 = port(a.box, exit, exitAt[i], exitSeen.get(`${e.from}|${exit}`) ?? 1);
    const p4 = port(b.box, entry, entryAt[i], entrySeen.get(`${e.to}|${entry}`) ?? 1);
    const p1 = step(p0, exit, OUT);
    const p3 = step(p4, entry, OUT);
    const others = boxes.filter((x) => x !== a.box && x !== b.box);
    let pts: [number, number][];
    if (exit === 'left' || exit === 'right') {
      // 横向:中间那段若横穿别人的盒子,改走下方(或上方)的通道
      if (hitBox(Math.min(p1[0], p3[0]), p1[1], Math.max(p1[0], p3[0]), p1[1], others)) {
        const dy = detourY(a.box, b.box, p1[0], p3[0], others);
        pts = [p0, p1, [p1[0], dy], [p3[0], dy], p3, p4];
      } else {
        const mid = (p1[0] + p3[0]) / 2;
        pts = [p0, p1, [mid, p1[1]], [mid, p3[1]], p3, p4];
      }
    } else {
      const mid = (p1[1] + p3[1]) / 2;
      pts = [p0, p1, [p1[0], mid], [p3[0], mid], p3, p4];
    }
    routed.push({ e, pts, ...style } as V2Routed & { stroke: string; width: number });
  });
  return routed;
}

/* ---------------------------------------------------------------- 边 */
function drawRoutesV2(routed: V2Routed[], interactive: boolean): string {
  return routed.map((rt) => {
    const d = rt.pts.map((p, j) => `${j === 0 ? 'M' : 'L'}${r2(p[0])} ${r2(p[1])}`).join('');
    const ia = interactive ? ` data-from="${esc(rt.e.from)}" data-to="${esc(rt.e.to)}"` : '';
    const s = rt as V2Routed & { stroke: string; width: number };
    return `<path d="${d}"${ia} fill="none" stroke="${s.stroke}" stroke-width="${s.width}"${rt.dash} marker-end="url(#${rt.marker})"/>`;
  }).join('');
}

/* ---------------------------------------------------------------- 边标签(带底衬) */
interface Spot { text: string; x: number; y: number; anchor: 'start' | 'middle' | 'end'; horiz: boolean; edge: ArchEdge }

const polyAt = (pts: [number, number][], t: number): { p: [number, number]; horiz: boolean } => {
  let total = 0;
  const segs: number[] = [];
  for (let i = 1; i < pts.length; i++) {
    const d = Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]);
    segs.push(d); total += d;
  }
  let want = total * t;
  for (let i = 0; i < segs.length; i++) {
    if (want <= segs[i] || i === segs.length - 1) {
      const f = segs[i] ? want / segs[i] : 0;
      const x = pts[i][0] + (pts[i + 1][0] - pts[i][0]) * f;
      const y = pts[i][1] + (pts[i + 1][1] - pts[i][1]) * f;
      return { p: [x, y], horiz: Math.abs(pts[i + 1][0] - pts[i][0]) >= Math.abs(pts[i + 1][1] - pts[i][1]) };
    }
    want -= segs[i];
  }
  return { p: pts[0], horiz: true };
};

const overlap = (a: Box, b: Box): boolean =>
  a.x < b.x + b.w && b.x < a.x + a.w && a.y < b.y + b.h && b.y < a.y + a.h;

/** 两个矩形压在一起的面积(用来挑「最不糟」的位置) */
const overlapArea = (a: Box, b: Box): number => {
  const w = Math.min(a.x + a.w, b.x + b.w) - Math.max(a.x, b.x);
  const h = Math.min(a.y + a.h, b.y + b.h) - Math.max(a.y, b.y);
  return w > 0 && h > 0 ? w * h : 0;
};

function placeEdgeLabels(routed: V2Routed[], avoid: Box[]): Spot[] {
  const out: Spot[] = [];
  // 已经放下的标签 —— 后面的标签要避开它们(不然两个标签会叠在一起)
  const taken: Box[] = [];
  for (const rt of routed) {
    const text = rt.e.label;
    if (!text) continue;
    const w = textW(text, EDGE_FS) + 12;
    const h = EDGE_FS + 8;
    const rectOf = (p: [number, number], horiz: boolean, mirror: boolean): Box =>
      horiz
        ? { x: p[0] - w / 2, y: mirror ? p[1] + 3 : p[1] - 3 - h, w, h }
        : { x: mirror ? p[0] - 3 - w : p[0] + 3, y: p[1] - h / 2, w, h };
    const blockers = [...avoid, ...taken];
    let place: { p: [number, number]; horiz: boolean; mirror: boolean } | undefined;
    let best: { p: [number, number]; horiz: boolean; mirror: boolean } | undefined;
    let bestCost = Infinity;
    for (const t of [0.5, 0.42, 0.58, 0.34, 0.66, 0.26, 0.74, 0.18, 0.82]) {
      const at = polyAt(rt.pts, t);
      for (const mirror of [false, true]) {
        const cost = blockers.reduce((s, b) => s + overlapArea(rectOf(at.p, at.horiz, mirror), b), 0);
        if (cost === 0) {
          place = { ...at, mirror };
          break;
        }
        if (cost < bestCost) {
          bestCost = cost;
          best = { ...at, mirror };
        }
      }
      if (place) break;
    }
    // 实在没地方放(标签比两个节点之间的空档还宽),挑压得最少的那个
    if (!place) place = best ?? { ...polyAt(rt.pts, 0.5), mirror: false };
    const p = place.p;
    const x = place.horiz ? p[0] : p[0] + (place.mirror ? -8 : 8);
    const y = place.horiz ? p[1] + (place.mirror ? 15 : -7) : p[1] + 4;
    const anchor: Spot['anchor'] = place.horiz ? 'middle' : place.mirror ? 'end' : 'start';
    out.push({ text, x, y, anchor, horiz: place.horiz, edge: rt.e });
    // 这个标签占的位置,后面的标签也得避开
    taken.push({
      x: anchor === 'middle' ? x - w / 2 : anchor === 'end' ? x - w : x,
      y: y - EDGE_FS - 3, w, h,
    });
  }
  return out;
}

function drawEdgeLabelsV2(spots: Spot[], interactive: boolean): string {
  return spots.map((s) => {
    const w = textW(s.text, EDGE_FS) + 12;
    const h = EDGE_FS + 8;
    const rx = s.anchor === 'middle' ? s.x - w / 2 : s.anchor === 'end' ? s.x - w : s.x;
    const ry = s.y - EDGE_FS - 1;
    const ia = interactive ? ` data-edge-label="${esc(s.edge.from)} ${esc(s.edge.to)}"` : '';
    return (
      `<g${ia}>` +
      `<rect x="${r2(rx)}" y="${r2(ry)}" width="${r2(w)}" height="${r2(h)}" rx="5" fill="var(--d-card)" stroke="var(--d-border)" stroke-width="1"/>` +
      `<text x="${r2(s.x)}" y="${r2(s.y)}" text-anchor="${s.anchor}" font-size="${EDGE_FS}" fill="var(--d-text)">${esc(s.text)}</text>` +
      `</g>`
    );
  }).join('');
}

/* ---------------------------------------------------------------- 边界 */
function drawBoundariesV2(placed: Placed[], boundaries: ArchBoundary[], interactive: boolean): string {
  const byId = new Map(placed.map((p) => [p.id, p]));
  return boundaries.map((bd) => {
    const box = boundaryBox(byId, bd);
    const ia = interactive ? ` data-boundary="${esc(bd.ids.join(' '))}"` : '';
    return (
      `<g${ia}>` +
      `<rect x="${r2(box.x)}" y="${r2(box.y)}" width="${r2(box.w)}" height="${r2(box.h)}" rx="14"` +
      ` fill="none" stroke="var(--d-border)" stroke-width="1.3" stroke-dasharray="7 5"/>` +
      `</g>`
    );
  }).join('');
}

/** 边界的标签胶囊:画在走线之上,线不会压在字上 */
function drawBoundaryLabelsV2(placed: Placed[], boundaries: ArchBoundary[]): string {
  const byId = new Map(placed.map((p) => [p.id, p]));
  return boundaries.map((bd) => {
    const box = boundaryBox(byId, bd);
    const label = bd.label.toUpperCase();
    const w = textW(label, 10) + bd.label.length * 1.2 + 20;
    return (
      `<g>` +
      `<rect x="${r2(box.x + 14)}" y="${r2(box.y - 9)}" width="${r2(w)}" height="20" rx="6" fill="var(--d-card)"/>` +
      `<text x="${r2(box.x + 14 + w / 2)}" y="${r2(box.y + 4)}" text-anchor="middle" font-size="10" font-weight="600" letter-spacing="1.2" fill="var(--d-faint)">${esc(label)}</text>` +
      `</g>`
    );
  }).join('');
}

/* ---------------------------------------------------------------- 图例 */
function drawLegend(placed: Placed[], vocab: HouseTypes): { svg: string; h: number } {
  const counts = new Map<string, number>();
  for (const p of placed) counts.set(p.type, (counts.get(p.type) ?? 0) + 1);
  const types = vocab.order.filter((t) => counts.has(t));
  if (!types.length) return { svg: '', h: 0 };
  let x = PAD;
  let y = 0;
  const parts: string[] = [];
  for (const t of types) {
    const meta = vocab.meta[t];
    const neutral = meta.color < 0;
    const color = neutral ? 'var(--d-muted)' : sVar(meta.color);
    const n = counts.get(t) ?? 0;
    const nameW = textW(meta.name, 11.5);
    const countW = textW(String(n), 11.5);
    parts.push(
      `<rect x="${r2(x)}" y="${r2(y - 10)}" width="14" height="14" rx="4" fill="${color}" fill-opacity="${neutral ? 0.18 : 0.2}" stroke="${color}" stroke-opacity="0.55" stroke-width="1"/>`,
      `<text x="${r2(x + 20)}" y="${r2(y + 1)}" font-size="11.5" fill="var(--d-muted)">${esc(meta.name)}</text>`,
      `<text x="${r2(x + 26 + nameW)}" y="${r2(y + 1)}" font-size="11.5" font-weight="700" fill="var(--d-ink)">${n}</text>`,
    );
    x += 20 + nameW + 8 + countW + 26;
  }
  return { svg: `<g data-legend="types">${parts.join('')}</g>`, h: LEGEND_H };
}

/* ---------------------------------------------------------------- 入口 */
const DEFS =
  `<defs>` +
  `<marker id="am-p" viewBox="0 0 10 10" refX="8.5" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0L10 5L0 10z" fill="var(--d-muted)"/></marker>` +
  `<marker id="am-m" viewBox="0 0 10 10" refX="8.5" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0L10 5L0 10z" fill="var(--d-ink)"/></marker>` +
  `<marker id="am-d" viewBox="0 0 10 10" refX="8.5" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0L10 5L0 10z" fill="var(--d-faint)"/></marker>` +
  `</defs>`;

export interface ArchOpts {
  nodes: ArchNode[];
  edges: ArchEdge[];
  boundaries: ArchBoundary[];
  /** 语义类型词汇(默认架构图那套) */
  types?: HouseTypes;
  title?: string;
  gridCols: number;
  legend: boolean;
  interactive: boolean;
  version: number;
  cacheControl: string;
  skin: ReturnType<typeof resolveSkin>;
  minW?: number;
  minH?: number;
  aria?: string;
}

/**
 * 边标签比两个节点之间的空档还宽时,把那一列撑开 —— 让标签有地方放,
 * 而不是压在节点的角标上。同一行、相邻两列的横边才需要(横着走的那一段最短)。
 */
function labelGaps(nodes: ArchNode[], edges: ArchEdge[]): number[] {
  const colOf = new Map<string, { col: number; row: number }>();
  for (const n of nodes) if (n.grid) colOf.set(n.id, n.grid);
  const need = new Map<number, number>();
  for (const e of edges) {
    if (!e.label) continue;
    const a = colOf.get(e.from);
    const b = colOf.get(e.to);
    if (!a || !b || a.row !== b.row) continue;
    const [c1, c2] = a.col < b.col ? [a.col, b.col] : [b.col, a.col];
    if (c2 !== c1 + 1) continue; // 隔了列的边,横向那一段本来就够长
    // 两端各留 16px 的接线头,再加标签自身的宽度
    const w = textW(e.label, EDGE_FS) + 12 + 32;
    need.set(c1, Math.max(need.get(c1) ?? 0, Math.min(w, 300)));
  }
  const out: number[] = [];
  for (const [c, v] of need) out[c] = v;
  return out;
}

/**
 * 渲染 v2 架构图。
 */
export function renderArchCore(o: ArchOpts): DrawResult {
  const types = o.types ?? ARCH_TYPES;
  // 第一遍:定格子(没写位置的节点会被自动放进去);第二遍:按边标签把列撑开
  packGrid(o.nodes, o.gridCols, { gapX: GAP_X, gapY: GAP_Y, pad: PAD, sizeOf: v2Size });
  const { placed, W, H } = packGrid(o.nodes, o.gridCols, {
    gapX: GAP_X, gapY: GAP_Y, pad: PAD, sizeOf: v2Size, gapAfter: labelGaps(o.nodes, o.edges),
  });
  const titleH = o.title ? 46 : 0;
  let width = Math.max(W, 320);
  let bodyH = H;
  const byIdEarly = new Map(placed.map((p) => [p.id, p]));
  for (const p of placed) {
    width = Math.max(width, p.box.x + p.box.w + PAD);
    bodyH = Math.max(bodyH, p.box.y + p.box.h + PAD);
  }
  // 边界框比它的成员大一圈:画布要给它留出位置,不然图例会压在边界上
  for (const bd of o.boundaries) {
    const bb = boundaryBox(byIdEarly, bd);
    width = Math.max(width, bb.x + bb.w + PAD);
    bodyH = Math.max(bodyH, bb.y + bb.h + PAD);
  }
  const legend = o.legend ? drawLegend(placed, types) : { svg: '', h: 0 };
  width = Math.max(width, o.minW ?? 0);
  const height = Math.max(bodyH + titleH + legend.h, o.minH ?? 0);

  const routed = computeRoutesV2(placed, o.edges);
  const byId = new Map(placed.map((p) => [p.id, p]));
  const boxes = placed.map((p) => p.box);
  const avoid: Box[] = [
    ...boxes.map((b) => ({ x: b.x - 2, y: b.y - 2, w: b.w + 4, h: b.h + 4 })),
    ...o.boundaries.map((bd) => {
      const bb = boundaryBox(byId, bd);
      const w = textW(bd.label.toUpperCase(), 10) + bd.label.length * 1.2 + 20;
      return { x: bb.x + 14, y: bb.y - 12, w, h: 22 };
    }),
  ];
  const spots = placeEdgeLabels(routed, avoid);
  const degree = new Map<string, number>();
  if (o.interactive) for (const e of o.edges) {
    degree.set(e.from, (degree.get(e.from) ?? 0) + 1);
    degree.set(e.to, (degree.get(e.to) ?? 0) + 1);
  }
  const iStyle = o.interactive
    ? `<style>#am g[data-node]{cursor:pointer;transition:filter .12s ease,opacity .15s ease}` +
      `#am g[data-node]:focus{outline:none}` +
      `#am g[data-node]:hover,#am g[data-node]:focus-visible{filter:brightness(1.25)}` +
      `#am g[data-node].on{filter:brightness(1.25)}` +
      `#am.hl g[data-node]{opacity:.4}#am.hl g[data-node].on{opacity:1}` +
      `#am.hl g[data-boundary]{opacity:.35}#am.hl g[data-boundary].on{opacity:1}` +
      `#am.hl path[data-from]{opacity:.22}#am.hl path[data-from].on{opacity:1}` +
      `#am.hl g[data-edge-label]{opacity:.3}#am.hl g[data-edge-label].on{opacity:1}</style>`
    : '';
  const titleSvg = o.title
    ? `<text x="${PAD}" y="${PAD + 16}" font-size="19" font-weight="600" letter-spacing="-0.02em" fill="var(--d-ink)">${esc(o.title)}</text>`
    : '';
  const body = iStyle + DEFS
    + drawBoundariesV2(placed, o.boundaries, o.interactive)
    + drawRoutesV2(routed, o.interactive)
    + drawEdgeLabelsV2(spots, o.interactive)
    + placed.map((p) => drawNodeV2(p, o.interactive, degree.get(p.id) ?? 0, types)).join('')
    + drawBoundaryLabelsV2(placed, o.boundaries);
  const legendSvg = legend.svg
    ? `<g transform="translate(0 ${r2(bodyH + 14)})">${legend.svg}</g>`
    : '';
  const dy = titleH + Math.max(0, (height - titleH - legend.h - bodyH) / 2);
  const children = titleSvg + `<g id="am" transform="translate(0 ${r2(dy)})">${body}</g>` + legendSvg;
  const spec = { type: 'arch', title: o.title, nodes: o.nodes, edges: o.edges, boundaries: o.boundaries };
  const svg = svgDoc(width, height, 'arch', o.version, o.aria ?? o.title ?? `architecture map, ${o.nodes.length} nodes`, spec, o.skin, children);
  return { svg, version: o.version, cacheControl: o.cacheControl };
}

/**
 * `/draw/arch` 入口:GET ?n=…&e=…&b=…(和 /draw/archmap 同一套参数)。
 */
export function renderArchFromUrl(url: URL, interactive = false): DrawResult {
  const params = url.searchParams;
  const nRaw = params.getAll('n');
  if (!nRaw.length) throw new ApiError(400, `at least one node is required. Example: /draw/arch?n=api;be;API Gateway;auth;r1c0w2`);
  const nodes = parseNodes(nRaw);
  const seen = new Set<string>();
  for (const n of nodes) {
    if (seen.has(n.id)) throw new ApiError(400, `duplicate node id "${n.id}"`);
    seen.add(n.id);
  }
  const edges = parseEdges(params.getAll('e'), seen);
  const boundaries = parseBoundaries(params.getAll('b'), seen);
  const title = params.get('title')?.trim() || undefined;
  const gridCols = clampInt(params, 'grid', 0, 1, 12);
  const legendRaw = params.get('legend');
  const legend = legendRaw === null || legendRaw === '' ? true : legendRaw !== '0' && legendRaw !== 'false';
  const v = parseInt(params.get('v') ?? '1', 10) || 1;
  const skin = resolveSkin('sankey', params.get('t'), schemeParam(params));
  return renderArchCore({
    nodes, edges, boundaries, title, gridCols, legend, interactive,
    version: v,
    cacheControl: 'public, max-age=300',
    skin,
    minW: clampInt(params, 'w', 0, 200, 2400),
    minH: clampInt(params, 'h', 0, 140, 2400),
  });
}
