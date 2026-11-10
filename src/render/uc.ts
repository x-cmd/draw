// /draw/uc —— 用例图:左边是参与者(火柴人),里面是用例(椭圆),外面一圈系统边界。
//
// 模型:
//   n=id;actor|label         参与者
//   n=id;uc|label            用例
//   e=from;to[;label]        关联;label 写 <<include>> / <<extend>> 就是虚线依赖
//   b=label;id id …          系统边界(用例在里面)
//
// 画法:参与者排成一列(左),用例排成一行(右),参与者和用例之间连线;
// 用例外面套一个系统边界框。
import { ApiError } from '../specs/index.js';
import type { ArchBoundary } from './archmap.js';
import { GRID_POS_RE, PX_POS_RE, parseBoundaries, splitFields } from './archmap.js';
import { resolveSkin } from '../styles/index.js';
import { clampInt, schemeParam, type DrawResult } from './query.js';
import { esc, r2, svgDoc, textW } from './svg.js';

const PAD = 44;
const ACTOR_H = 92;      // 火柴人 + 名字占的高度
const UC_H = 54;         // 椭圆高
const COL_GAP = 78;
const ROW_GAP = 18;
const UC_ROW_GAP = 46;

interface UcNode {
  id: string;
  kind: 'actor' | 'uc';
  label: string;
  sub?: string;
  x: number; y: number; w: number; h: number;
  /** 位置:和架构图同一套(不写就自己排) */
  grid?: { row: number; col: number; w: number; h: number };
  px?: { x: number; y: number; w?: number; h?: number };
}

interface UcEdge { from: string; to: string; label?: string; dep: boolean }

/**
 * 节点语法和架构图完全一致:id;类型;标签[;副标][;位置]
 * —— 位置可省(用例图自己排),给了就按给的摆。
 */
function parseNodes(raw: string[]): UcNode[] {
  return raw.map((v, i) => {
    const f = splitFields(v).map((x) => x.trim());
    if (f.length < 3 || f.length > 5) {
      throw new ApiError(400, `"n" #${i + 1} must be "id;actor|label[;sub][;pos]". Example: n=caller;actor;Your app`);
    }
    const kind = f[1];
    if (kind !== 'actor' && kind !== 'uc') {
      throw new ApiError(400, `"n" #${i + 1}: kind must be "actor" or "uc", got ${JSON.stringify(kind)}`);
    }
    if (!f[2]) throw new ApiError(400, `"n" #${i + 1}: label is required`);
    let sub: string | undefined;
    let pos: string | undefined;
    if (f.length === 4) {
      if (GRID_POS_RE.test(f[3]) || PX_POS_RE.test(f[3])) pos = f[3];
      else sub = f[3];
    } else if (f.length === 5) {
      sub = f[3];
      pos = f[4];
    }
    const node: UcNode = { id: f[0], kind, label: f[2], ...(sub ? { sub } : {}), x: 0, y: 0, w: 0, h: 0 };
    if (pos) {
      const g = GRID_POS_RE.exec(pos);
      if (g) {
        node.grid = { row: +g[1], col: +g[2], w: g[3] ? +g[3] : 1, h: g[4] ? +g[4] : 1 };
      } else {
        const px = PX_POS_RE.exec(pos);
        if (!px) throw new ApiError(400, `"n" #${i + 1}: pos must look like r0c1[w2][h2] or p40,80[,120x48]`);
        node.px = { x: +px[1], y: +px[2], ...(px[3] ? { w: +px[3], h: +px[4] } : {}) };
      }
    }
    return node;
  });
}

function parseEdges(raw: string[], ids: Set<string>): UcEdge[] {
  return raw.map((v, i) => {
    const f = v.split(';').map((x) => x.trim());
    if (f.length < 2 || !ids.has(f[0]) || !ids.has(f[1])) {
      throw new ApiError(400, `"e" #${i + 1} must be "from;to[;label]" and both ids must exist. Example: e=caller;uc1`);
    }
    const label = f[2] || undefined;
    return { from: f[0], to: f[1], label, dep: !!label && /^<<.+>>$/.test(label) };
  });
}

/** 火柴人:头 + 身子 + 两条胳膊 + 两条腿 */
function drawActor(n: UcNode, color: string, interactive = false): string {
  const cx = n.x + n.w / 2;
  const headR = 11;
  const headY = n.y + 4 + headR;
  const bodyTop = headY + headR + 3;
  const bodyBot = bodyTop + 26;
  const armY = bodyTop + 9;
  const labelY = n.y + n.h - 16;
  const ia = interactive ? ` data-node="${esc(n.id)}" data-tip="${esc(`actor · ${n.label}${n.sub ? ` · ${n.sub}` : ''}`)}" tabindex="0"` : '';
  return (
    `<g${ia}>` +
    `<circle cx="${r2(cx)}" cy="${r2(headY)}" r="${headR}" fill="none" stroke="${color}" stroke-width="1.6"/>` +
    `<path d="M${r2(cx)} ${r2(bodyTop)}L${r2(cx)} ${r2(bodyBot)}" stroke="${color}" stroke-width="1.6" fill="none"/>` +
    `<path d="M${r2(cx - 13)} ${r2(armY)}L${r2(cx + 13)} ${r2(armY)}" stroke="${color}" stroke-width="1.6" fill="none"/>` +
    `<path d="M${r2(cx - 11)} ${r2(bodyBot)}L${r2(cx)} ${r2(bodyTop + 12)}M${r2(cx + 11)} ${r2(bodyBot)}L${r2(cx)} ${r2(bodyTop + 12)}" stroke="${color}" stroke-width="1.6" fill="none"/>` +
    `<text x="${r2(cx)}" y="${r2(labelY)}" text-anchor="middle" font-size="13" font-weight="600" fill="var(--d-ink)">${esc(n.label)}</text>` +
    (n.sub ? `<text x="${r2(cx)}" y="${r2(labelY + 15)}" text-anchor="middle" font-size="11" fill="var(--d-muted)">${esc(n.sub)}</text>` : '') +
    `</g>`
  );
}

/** 用例:椭圆 */
function drawUseCase(n: UcNode, color: string, interactive = false): string {
  const cx = n.x + n.w / 2;
  const cy = n.y + n.h / 2;
  const labelY = n.sub ? cy - 2 : cy + 5;
  const ia = interactive ? ` data-node="${esc(n.id)}" data-tip="${esc(`use case · ${n.label}${n.sub ? ` · ${n.sub}` : ''}`)}" tabindex="0"` : '';
  return (
    `<g${ia}>` +
    `<ellipse cx="${r2(cx)}" cy="${r2(cy)}" rx="${r2(n.w / 2)}" ry="${r2(n.h / 2)}" fill="${color}" fill-opacity="0.1" stroke="${color}" stroke-opacity="0.6" stroke-width="1.3"/>` +
    `<text x="${r2(cx)}" y="${r2(labelY)}" text-anchor="middle" font-size="13" font-weight="500" fill="var(--d-ink)">${esc(n.label)}</text>` +
    (n.sub ? `<text x="${r2(cx)}" y="${r2(labelY + 15)}" text-anchor="middle" font-size="11" fill="var(--d-muted)">${esc(n.sub)}</text>` : '') +
    `</g>`
  );
}

export interface UcOpts {
  nodes: UcNode[];
  edges: UcEdge[];
  /** b= 画出来的边界(可以有多层) */
  boundaries: ArchBoundary[];
  /** 参与方摆在右边(默认在左边) */
  actorsRight?: boolean;
  title?: string;
  interactive: boolean;
  version: number;
  cacheControl: string;
  skin: ReturnType<typeof resolveSkin>;
  minW?: number;
  minH?: number;
}

/**
 * 渲染用例图。
 */
export function renderUcCore(o: UcOpts): DrawResult {
  const titleH = o.title ? 40 : 0;
  const actors = o.nodes.filter((n) => n.kind === 'actor');
  const ucs = o.nodes.filter((n) => n.kind === 'uc');
  // 参与者一列(左),用例一行(右)
  const actorW = Math.max(120, ...actors.map((a) => textW(a.label, 13) + 36));
  const ucW = Math.max(150, ...ucs.map((u) => Math.max(textW(u.label, 13) + 64, u.sub ? textW(u.sub, 11) + 64 : 0)));
  let maxY = PAD + titleH;
  actors.forEach((a) => { a.w = actorW; });
  // 用例排成一列,参与者在另一侧 —— 中间留出一条「脊柱」通道走线,
  // 这样同一个参与方连多个用例时,线各走各的,不横穿别人的椭圆。
  const ucColH = ucs.length * (UC_H + UC_ROW_GAP) - UC_ROW_GAP;
  const actorColH = actors.length * (ACTOR_H + ROW_GAP) - ROW_GAP;
  const colH = Math.max(ucColH, actorColH);
  const top = PAD + titleH;
  const ucTop = top + Math.max(0, (colH - ucColH) / 2);
  const actorTop = top + Math.max(0, (colH - actorColH) / 2);
  const ucX = o.actorsRight ? PAD : PAD + actorW + COL_GAP;
  const actorX = o.actorsRight ? PAD + actorW + COL_GAP + ucW + COL_GAP : PAD;
  ucs.forEach((u, i) => {
    u.x = ucX;
    u.y = ucTop + i * (UC_H + UC_ROW_GAP);
    u.w = ucW;
    u.h = UC_H;
    maxY = Math.max(maxY, u.y + u.h);
  });
  actors.forEach((a, i) => {
    a.x = actorX;
    a.y = actorTop + i * (ACTOR_H + ROW_GAP);
    a.w = actorW;
    a.h = ACTOR_H;
    maxY = Math.max(maxY, a.y + a.h);
  });
  // 给了位置的按位置摆(和架构图同一套格子)
  const placed = [...ucs, ...actors];
  const gridNodes = placed.filter((n) => n.grid);
  // 脊柱:参与方和用例之间的空档正中
  const spineX = o.actorsRight
    ? ucX + ucW + COL_GAP / 2
    : PAD + actorW + COL_GAP / 2;
  let width = Math.max(320, (o.actorsRight ? actorX + actorW : ucX + ucW + 30) + PAD);
  let height = maxY + PAD;
  if (gridNodes.length) {
    const rows = Math.max(...gridNodes.map((n) => n.grid!.row + n.grid!.h));
    const cols = Math.max(...gridNodes.map((n) => n.grid!.col + n.grid!.w));
    const colX = new Array<number>(cols).fill(0);
    const rowY = new Array<number>(rows).fill(0);
    for (const n of gridNodes) {
      colX[n.grid!.col] = Math.max(colX[n.grid!.col], n.kind === 'actor' ? actorW : ucW);
      rowY[n.grid!.row] = Math.max(rowY[n.grid!.row], n.kind === 'actor' ? ACTOR_H : UC_H);
    }
    const trackX: number[] = [];
    const trackY: number[] = [];
    let gx = PAD;
    for (let c = 0; c < cols; c++) { trackX[c] = gx; gx += colX[c] + COL_GAP; }
    let gy = PAD + titleH;
    for (let r = 0; r < rows; r++) { trackY[r] = gy; gy += rowY[r] + ROW_GAP; }
    for (const n of gridNodes) {
      const g = n.grid!;
      n.x = trackX[g.col];
      n.y = trackY[g.row];
      n.w = n.kind === 'actor' ? actorW : ucW;
      n.h = n.kind === 'actor' ? ACTOR_H : UC_H;
      width = Math.max(width, n.x + n.w + PAD);
      maxY = Math.max(maxY, n.y + n.h);
    }
    // 没给位置的用例回到用例列;没给位置的参与方留在原处
    for (const n of placed) {
      if (n.grid) continue;
      if (n.kind === 'uc') n.x = ucX;
    }
    height = Math.max(height, maxY + PAD);
  }

  // 系统边界:把用例框起来(可以有多层)
  let boundarySvg = '';
  for (const b of o.boundaries) {
    const bs = b.ids.map((id) => o.nodes.find((n) => n.id === id)).filter(Boolean) as UcNode[];
    if (!bs.length) continue;
    const bx = Math.min(...bs.map((x) => x.x)) - 26;
    const by = Math.min(...bs.map((x) => x.y)) - 26;
    const bw = Math.max(...bs.map((x) => x.x + x.w)) + 26 - bx;
    const bh = Math.max(...bs.map((x) => x.y + x.h)) + 26 - by;
    const label = b.label.toUpperCase();
    const lw = textW(label, 10) + b.label.length * 1.2 + 20;
    width = Math.max(width, bx + bw + PAD);
    height = Math.max(height, by + bh + PAD);
    boundarySvg +=
      `<g data-boundary="${esc(b.ids.join(' '))}">` +
      `<rect x="${r2(bx)}" y="${r2(by)}" width="${r2(bw)}" height="${r2(bh)}" rx="14" fill="none" stroke="var(--d-border)" stroke-width="1.3" stroke-dasharray="7 5"/>` +
      `<rect x="${r2(bx + 14)}" y="${r2(by - 9)}" width="${r2(lw)}" height="20" rx="6" fill="var(--d-card)"/>` +
      `<text x="${r2(bx + 14 + lw / 2)}" y="${r2(by + 4)}" text-anchor="middle" font-size="10" font-weight="600" letter-spacing="1.2" fill="var(--d-faint)">${esc(label)}</text>` +
      `</g>`;
  }

  // 连线:参与方 → 脊柱 → 用例,三段正交。同一个参与方连多个用例时,
  // 每条线在参与方那边错开一点、在脊柱上各走各的一段,互不压。
  const byId = new Map(o.nodes.map((n) => [n.id, n]));
  const exitSeen = new Map<string, number>();
  const edges: string[] = [];
  let labelRight = 0; // 标签往右伸出去多少(画布要留出这段)
  for (const e of o.edges) {
    const a = byId.get(e.from)!;
    const b = byId.get(e.to)!;
    const stroke = e.dep ? 'var(--d-faint)' : 'var(--d-muted)';
    const dash = e.dep ? ' stroke-dasharray="5 4"' : '';
    const ia = o.interactive ? ` data-from="${esc(e.from)}" data-to="${esc(e.to)}"` : '';
    const n = (exitSeen.get(e.from) ?? 0);
    exitSeen.set(e.from, n + 1);
    let pts: [number, number][];
    let lx = 0;
    let ly = 0;
    // 标签贴在哪:start = 从 lx 往右排,end = 往左排
    let lanchor: 'start' | 'end' = 'start';
    if (a.kind === 'actor' && b.kind === 'uc') {
      const ax = o.actorsRight ? a.x - n * 9 : a.x + a.w + n * 9;
      const ay = a.y + 30;
      const bx = o.actorsRight ? b.x + b.w : b.x;
      const by = b.y + b.h / 2;
      pts = [[ax, ay], [spineX, ay], [spineX, by], [bx, by]];
      // 标签贴在用例左边,不压在椭圆上
      lx = bx - 6; ly = by; lanchor = 'end';
    } else if (a.kind === 'uc' && b.kind === 'actor') {
      const ax = o.actorsRight ? a.x : a.x + a.w;
      const ay = a.y + a.h / 2;
      // 参与方在哪一侧,就从哪一侧接线(脊柱在参与方的右边还是左边)
      const bx = o.actorsRight ? b.x - n * 9 : b.x + b.w + n * 9;
      const by = b.y + 30;
      pts = [[ax, ay], [spineX, ay], [spineX, by], [bx, by]];
      lx = bx + 6; ly = by; lanchor = 'start';
    } else {
      // 用例之间的依赖(<<include>>):绕到用例列右边的一条通道上,
      // 不从两个椭圆中间斜穿过去
      const depX = ucX + ucW + 18;
      const ax = a.x + a.w;
      const ay = a.y + a.h / 2;
      const bx = b.x + b.w;
      const by = b.y + b.h / 2;
      pts = [[ax, ay], [depX, ay], [depX, by], [bx, by]];
      // 标签排在通道右边,一点不碰椭圆
      lx = depX + 6; ly = (ay + by) / 2; lanchor = 'start';
    }
    edges.push(
      `<path d="${pts.map((p, i) => `${i === 0 ? 'M' : 'L'}${r2(p[0])} ${r2(p[1])}`).join('')}" fill="none" stroke="${stroke}" stroke-width="1.3"${dash}${ia}/>`,
    );
    if (e.label) {
      const w = textW(e.label, 10.5) + 12;
      const rx = lanchor === 'end' ? lx - w : lx;
      const tx = lx;
      labelRight = Math.max(labelRight, rx + w);
      edges.push(
        `<rect x="${r2(rx)}" y="${r2(ly - 15)}" width="${r2(w)}" height="17" rx="5" fill="var(--d-card)" stroke="var(--d-border)" stroke-width="1"/>`,
        `<text x="${r2(tx)}" y="${r2(ly - 3)}" text-anchor="${lanchor}" font-size="10.5" fill="var(--d-text)">${esc(e.label)}</text>`,
      );
    }
  }
  width = Math.max(width, labelRight + PAD);

  const titleSvg = o.title
    ? `<text x="${PAD}" y="${PAD + 16}" font-size="18" font-weight="600" letter-spacing="-0.02em" fill="var(--d-ink)">${esc(o.title)}</text>`
    : '';
  const nodes = o.nodes.map((n) =>
    n.kind === 'actor'
      ? drawActor(n, 'var(--d-muted)', o.interactive)
      : drawUseCase(n, 'var(--d-s2)', o.interactive),
  ).join('');
  const spec = { type: 'uc', title: o.title, nodes: o.nodes, edges: o.edges };
  const svg = svgDoc(
    width, height, 'uc', o.version,
    o.title ?? `use case diagram, ${o.nodes.length} elements`,
    spec, o.skin,
    titleSvg + boundarySvg + edges.join('') + nodes,
  );
  return { svg, version: o.version, cacheControl: o.cacheControl };
}

/**
 * `/draw/uc` 入口:GET ?n=…&e=…&b=…
 */
export function renderUcFromUrl(url: URL, interactive = false): DrawResult {
  const params = url.searchParams;
  const nRaw = params.getAll('n');
  if (!nRaw.length) {
    throw new ApiError(400, `at least one element is required. Example: /draw/uc?n=caller;actor;Your app&n=uc1;uc;Render a chart&e=caller;uc1`);
  }
  const nodes = parseNodes(nRaw);
  const ids = new Set(nodes.map((n) => n.id));
  if (ids.size !== nodes.length) throw new ApiError(400, 'duplicate element id');
  const edges = parseEdges(params.getAll('e'), ids);
  const boundaries = parseBoundaries(params.getAll('b'), ids);
  const v = parseInt(params.get('v') ?? '1', 10) || 1;
  const side = (params.get('actors') ?? 'left').toLowerCase();
  if (side !== 'left' && side !== 'right') {
    throw new ApiError(400, `"actors" must be "left" (default) or "right". Got: ${JSON.stringify(side)}`);
  }
  const skin = resolveSkin('sankey', params.get('t'), schemeParam(params));
  return renderUcCore({
    nodes, edges, boundaries,
    actorsRight: side === 'right',
    title: params.get('title')?.trim() || undefined,
    interactive,
    version: v,
    cacheControl: 'public, max-age=300',
    skin,
    minW: clampInt(params, 'w', 0, 200, 2400),
    minH: clampInt(params, 'h', 0, 140, 2400),
  });
}
