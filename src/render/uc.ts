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
}

interface UcEdge { from: string; to: string; label?: string; dep: boolean }

function parseNodes(raw: string[]): UcNode[] {
  return raw.map((v, i) => {
    const f = v.split(';').map((x) => x.trim());
    if (f.length < 3) {
      throw new ApiError(400, `"n" #${i + 1} must be "id;actor|label" or "id;uc|label". Example: n=caller;actor;Your app`);
    }
    const kind = f[1];
    if (kind !== 'actor' && kind !== 'uc') {
      throw new ApiError(400, `"n" #${i + 1}: kind must be "actor" or "uc", got ${JSON.stringify(kind)}`);
    }
    return { id: f[0], kind, label: f[2], sub: f[3] || undefined, x: 0, y: 0, w: 0, h: 0 };
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
  boundary?: { label: string; ids: string[] };
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
  let x = PAD;
  let maxY = PAD + titleH;
  actors.forEach((a, i) => { a.x = x; a.w = actorW; });
  // 用例排成网格(最多三列),参与者一列摆在左边,上下居中 —— 经典用例图的排法
  const ucCols = Math.max(1, Math.min(3, Math.ceil(Math.sqrt(ucs.length))));
  const ucRows = Math.ceil(ucs.length / ucCols);
  const gridH = ucRows * (UC_H + UC_ROW_GAP) - UC_ROW_GAP;
  const actorColH = actors.length * (ACTOR_H + ROW_GAP) - ROW_GAP;
  const actorTop = PAD + titleH + Math.max(0, (gridH - actorColH) / 2);
  actors.forEach((a, i) => {
    a.y = actorTop + i * (ACTOR_H + ROW_GAP);
    a.h = ACTOR_H;
    maxY = Math.max(maxY, a.y + a.h);
  });
  const ucX = PAD + actorW + COL_GAP;
  const gridTop = actorTop + Math.max(0, (actorColH - gridH) / 2); // 用例网格对着参与者列居中
  ucs.forEach((u, i) => {
    u.x = ucX + (i % ucCols) * (ucW + COL_GAP);
    u.y = gridTop + Math.floor(i / ucCols) * (UC_H + UC_ROW_GAP);
    u.w = ucW;
    u.h = UC_H;
    maxY = Math.max(maxY, u.y + u.h);
  });
  let width = Math.max(320, ucX + ucCols * (ucW + COL_GAP) - COL_GAP + PAD);
  let height = maxY + PAD;

  // 系统边界:把用例框起来
  let boundarySvg = '';
  if (o.boundary && o.boundary.ids.length) {
    const bs = o.boundary.ids.map((id) => o.nodes.find((n) => n.id === id)).filter(Boolean) as UcNode[];
    if (bs.length) {
      const bx = Math.min(...bs.map((b) => b.x)) - 26;
      const by = Math.min(...bs.map((b) => b.y)) - 26;
      const bw = Math.max(...bs.map((b) => b.x + b.w)) + 26 - bx;
      const bh = Math.max(...bs.map((b) => b.y + b.h)) + 26 - by;
      const label = o.boundary.label.toUpperCase();
      const lw = textW(label, 10) + o.boundary.label.length * 1.2 + 20;
      width = Math.max(width, bx + bw + PAD);
      height = Math.max(height, by + bh + PAD);
      boundarySvg =
        `<g data-boundary="${esc(o.boundary.ids.join(' '))}">` +
        `<rect x="${r2(bx)}" y="${r2(by)}" width="${r2(bw)}" height="${r2(bh)}" rx="14" fill="none" stroke="var(--d-border)" stroke-width="1.3" stroke-dasharray="7 5"/>` +
        `<rect x="${r2(bx + 14)}" y="${r2(by - 9)}" width="${r2(lw)}" height="20" rx="6" fill="var(--d-card)"/>` +
        `<text x="${r2(bx + 14 + lw / 2)}" y="${r2(by + 4)}" text-anchor="middle" font-size="10" font-weight="600" letter-spacing="1.2" fill="var(--d-faint)">${esc(label)}</text>` +
        `</g>`;
    }
  }

  // 连线
  const byId = new Map(o.nodes.map((n) => [n.id, n]));
  const edges: string[] = [];
  for (const e of o.edges) {
    const a = byId.get(e.from)!;
    const b = byId.get(e.to)!;
    const ax = a.kind === 'actor' ? a.x + a.w / 2 : a.x + a.w;
    const ay = a.kind === 'actor' ? a.y + 30 : a.y + a.h / 2;
    const bx = b.kind === 'actor' ? b.x + b.w / 2 : b.x;
    const by = b.kind === 'actor' ? b.y + 30 : b.y + b.h / 2;
    const stroke = e.dep ? 'var(--d-faint)' : 'var(--d-muted)';
    const dash = e.dep ? ' stroke-dasharray="5 4"' : '';
    const ia = o.interactive ? ` data-from="${esc(e.from)}" data-to="${esc(e.to)}"` : '';
    // 直线连到椭圆/火柴人身上
    edges.push(`<path d="M${r2(ax)} ${r2(ay)}L${r2(bx)} ${r2(by)}" fill="none" stroke="${stroke}" stroke-width="1.3"${dash}${ia}/>`);
    if (e.label) {
      const mx = (ax + bx) / 2;
      const my = (ay + by) / 2;
      const w = textW(e.label, 10.5) + 12;
      edges.push(
        `<rect x="${r2(mx - w / 2)}" y="${r2(my - 15)}" width="${r2(w)}" height="17" rx="5" fill="var(--d-bg)" fill-opacity="0.92"/>`,
        `<text x="${r2(mx)}" y="${r2(my - 3)}" text-anchor="middle" font-size="10.5" fill="var(--d-text)">${esc(e.label)}</text>`,
      );
    }
  }

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
  const bRaw = params.get('b');
  let boundary: { label: string; ids: string[] } | undefined;
  if (bRaw) {
    const i = bRaw.indexOf(';');
    if (i < 1) throw new ApiError(400, '"b" must be "label;id id …". Example: b=draw;uc1 uc2');
    const members = bRaw.slice(i + 1).trim().split(/\s+/).filter(Boolean);
    for (const m of members) if (!ids.has(m)) throw new ApiError(400, `"b" references unknown id "${m}"`);
    boundary = { label: bRaw.slice(0, i).trim(), ids: members };
  }
  const v = parseInt(params.get('v') ?? '1', 10) || 1;
  const skin = resolveSkin('sankey', params.get('t'), schemeParam(params));
  return renderUcCore({
    nodes, edges, boundary,
    title: params.get('title')?.trim() || undefined,
    interactive,
    version: v,
    cacheControl: 'public, max-age=300',
    skin,
    minW: clampInt(params, 'w', 0, 200, 2400),
    minH: clampInt(params, 'h', 0, 140, 2400),
  });
}
