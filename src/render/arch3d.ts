// arch3d —— 结构图的三维版(等轴测 + 能转)。
//
// URL 语言和 arch2 一模一样(n= 节点、e= 边、b= 分组),画出来是同一个图,
// 只是从「平面的架构图」换成「三维的场景」。
//
// 摆位与投影在 scene3d.ts(服务端与浏览器端共用),这里只管:
//   1. 解析 URL → 场景
//   2. 场景 → SVG(静态图:默认相机,一眼等轴测)
//
// 交互(转)由浏览器端做:它拿同一份场景,换相机再投影一遍 ——
// 公式只有一处,两边算出来的画面才是一张。

import { parseNodes, parseEdges, parseBoundaries, type ArchNode, type ArchEdge, type ArchBoundary } from './archmap.js';
import { esc } from './svg.js';
import { iconOf } from './icons.js';
import { buildScene, projectScene, DEFAULT_CAMERA, type Camera, type Scene, type ProjScene } from './scene3d.js';

/** 语义类型 → 色板序号(跟库那套一致:ext 中性,其余各有各的色) */
const TYPE_COLOR: Record<string, number> = {
  fe: 0, be: 1, db: 2, cloud: 3, sec: 4, bus: 5, svc: 6,
};

const TIER_NAME_EN = ['SOURCE', 'MID', 'SINK'];

/** 板砖的尺寸:扁正的方板 */
const TILE_W = 46;   // 边长(正方形)
const TILE_H = 10;   // 厚度(薄板)

export interface Arch3dOpts {
  /** 相机(默认等轴测那一眼) */
  camera?: Partial<Camera>;
  /** 要不要带交互标记(data-node/data-from) */
  interactive?: boolean;
  /** 画布宽(高按场景比例算) */
  width?: number;
  /** 分组的辅助线怎么画:plain(默认,只留牌子)/ tint / dash */
  bstyle?: 'plain' | 'tint' | 'dash';
  /** 各层的平面要不要画(默认不要 —— 那些板是多余的) */
  planes?: boolean;
  /** 辅助线(地板网格 + 分组的线框)要不要画(默认不要) */
  aux?: boolean;
}

/**
 * 节点在场景里的板砖:**扁正**的一块方板(不是长条)——
 * 图标贴在板上,标签在板下,长条会把图标撑得很远。
 */
function tileOf(n: ArchNode): { w: number; d: number; h: number } {
  void n;
  return { w: TILE_W, d: TILE_W, h: TILE_H };
}

/** 类型色(CSS 变量名) */
function colorOf(type: string): string {
  const i = TYPE_COLOR[type];
  return i === undefined ? 'var(--d-muted)' : `var(--d-s${i + 1})`;
}

/**
 * 解析 URL → 场景。
 */
/** 分组的辅助线怎么画:plain(默认,只留牌子)/ tint / dash —— 那些线框是多余的,要做再要 */
export function bstyleOf(url: URL): 'plain' | 'tint' | 'dash' {
  const v = (url.searchParams.get('bstyle') || '').trim().toLowerCase();
  return v === 'dash' || v === 'tint' ? v : 'plain';
}

/** 各层的平面要不要画(默认不要):planes=1 才有 */
export function planesOf(url: URL): boolean {
  const v = (url.searchParams.get('planes') || '').trim().toLowerCase();
  return v === '1' || v === 'true' || v === 'on';
}

/** 辅助线(地板网格 + 分组的线框)要不要画(默认不要):aux=1 才有 */
export function auxOf(url: URL): boolean {
  const v = (url.searchParams.get('aux') || '').trim().toLowerCase();
  return v === '1' || v === 'true' || v === 'on';
}

export function sceneFromUrl(url: URL): Scene {
  const nodes = parseNodes(url.searchParams.getAll('n'));
  const ids = new Set(nodes.map((n) => n.id));
  const edges = parseEdges(url.searchParams.getAll('e'), ids);
  const groups = parseBoundaries(url.searchParams.getAll('b'), ids);
  return sceneOf(nodes, edges, groups);
}

/** 节点/边/分组 → 场景 */
export function sceneOf(nodes: ArchNode[], edges: ArchEdge[], groups: ArchBoundary[]): Scene {
  return buildScene({
    nodes: nodes.map((n) => {
      const t = tileOf(n);
      // 图标:库里的图标库按名字取(公司/机构那族在私有仓,取不到就算了)
      const icon = n.icon ? iconOf(n.icon) : undefined;
      return { id: n.id, label: n.label, sub: n.sub, color: colorOf(n.type), icon, ...t };
    }),
    edges: edges.map((e) => ({ from: e.from, to: e.to, label: e.label })),
    groups: groups.map((g) => ({ label: g.label, ids: g.ids })),
  });
}

/** 场景 → SVG(默认相机) */
export function renderArch3d(scene: Scene, opts: Arch3dOpts = {}): string {
  const cam: Camera = { ...DEFAULT_CAMERA, ...(opts.camera ?? {}) };
  const bstyle = opts.bstyle ?? 'plain';
  const planes = opts.planes ?? false;
  const aux = opts.aux ?? false;
  const proj = projectScene(scene, cam);
  const pad = 40;
  const vb = {
    x: proj.bbox.x - pad,
    y: proj.bbox.y - pad,
    w: proj.bbox.w + pad * 2,
    h: proj.bbox.h + pad * 2,
  };
  const width = opts.width ?? Math.round(vb.w);
  const height = Math.round((vb.h / vb.w) * width);
  const body = sceneSvg(proj, scene, opts.interactive ?? false, bstyle, planes, aux);
  return (
    `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" ` +
    `viewBox="${r2(vb.x)} ${r2(vb.y)} ${r2(vb.w)} ${r2(vb.h)}" ` +
    `font-family="ui-sans-serif,-apple-system,BlinkMacSystemFont,'Segoe UI','PingFang SC','Hiragino Sans GB','Microsoft YaHei',sans-serif" ` +
    `role="img" aria-label="3D architecture diagram">` +
    style() +
    `<g id="am">${body}</g>` +
    `</svg>`
  );
}

/** 场景里所有节点的提示文案(悬停用) */
function tipOf(scene: Scene, id: string): string {
  const n = scene.nodes.find((x) => x.id === id);
  if (!n) return id;
  const tier = TIER_NAME_EN[n.tier];
  return n.sub ? `${n.label} · ${n.sub} · ${tier}` : `${n.label} · ${tier}`;
}

/** SVG 的骨架:地面网格 → 板台 → 分组盒 → 边 → 节点 */
function sceneSvg(
  p: ProjScene, scene: Scene, interactive: boolean,
  bstyle: 'plain' | 'tint' | 'dash', planes: boolean, aux: boolean,
): string {
  const parts: string[] = [];

  // 地面网格(辅助线之一 —— 默认不画)
  if (aux && p.grid.length) {
    const d = p.grid.map((l) => `M${r2(l[0][0])} ${r2(l[0][1])}L${r2(l[1][0])} ${r2(l[1][1])}`).join('');
    parts.push(`<path class="a3d-grid" d="${d}" fill="none" stroke="var(--d-grid)" stroke-width="1"/>`);
  }

  // 平面(每一层一块地坪):有厚度的板 —— 顶面 + 两个侧面;开关说不要就不要
  for (const t of planes ? p.tiers : []) {
    const pts = t.pts.map((q) => `${r2(q[0])},${r2(q[1])}`).join(' ');
    const nameEn = TIER_NAME_EN[t.tier];
    const sides = t.sides.map((sp) =>
      `<polygon class="a3d-tier-side" points="${sp.map((q) => `${r2(q[0])},${r2(q[1])}`).join(' ')}" fill="var(--d-s${t.tier === 0 ? 4 : t.tier === 1 ? 5 : 6})" fill-opacity="0.10"/>`).join('');
    parts.push(
      `<g class="a3d-tier" data-tier="${t.tier}">` +
      sides +
      `<polygon class="a3d-tier-top" points="${pts}" fill="var(--d-s${t.tier === 0 ? 4 : t.tier === 1 ? 5 : 6})" fill-opacity="0.07" stroke="var(--d-grid)" stroke-width="1"/>` +
      `<text class="a3d-tier-name" x="${r2(t.lx)}" y="${r2(t.ly)}" font-size="10" fill="var(--d-faint)" text-anchor="middle">${esc(nameEn)}</text>` +
      `</g>`
    );
  }

  // 分组的辅助线:默认只留个牌子(那些线框是多余的,要做再要)
  for (const g of p.groups) {
    const d = g.lines.map((l) => `M${r2(l[0][0])} ${r2(l[0][1])}L${r2(l[1][0])} ${r2(l[1][1])}`).join('');
    const ia = interactive ? ` data-boundary="${esc(g.ids.join(' '))}"` : '';
    const box = !aux || bstyle === 'plain' ? '' :
      bstyle === 'tint'
        ? `<path class="a3d-group-box" d="${d}" fill="none" stroke="var(--d-faint)" stroke-opacity="0.35" stroke-width="1"/>`
        : `<path class="a3d-group-box" d="${d}" fill="none" stroke="var(--d-faint)" stroke-opacity="0.5" stroke-width="1" stroke-dasharray="4 4"/>`;
    parts.push(
      `<g class="a3d-group"${ia}>` +
      box +
      `<text x="${r2(g.lx)}" y="${r2(g.ly)}" font-size="11" fill="var(--d-muted)" text-anchor="middle">${esc(g.label)}</text>` +
      `</g>`
    );
  }

  // 边
  for (const e of p.edges) {
    const ia = interactive ? ` data-from="${esc(e.from)}" data-to="${esc(e.to)}"` : '';
    const d = e.pts.map((q, i) => `${i === 0 ? 'M' : 'L'}${r2(q[0])} ${r2(q[1])}`).join('');
    parts.push(
      `<g class="a3d-edge"${ia}>` +
      // data-from/data-to 也要落在 path 上 —— explore 那套点击高亮找的是 path[data-from]
      `<path class="a3d-edge-path" d="${d}"${ia} fill="none"/>` +
      (e.label ? `<text class="a3d-edge-label" data-edge-label="${esc(e.from)} ${esc(e.to)}" x="${r2(e.lx)}" y="${r2(e.ly)}" font-size="10" fill="var(--d-muted)" text-anchor="middle">${esc(e.label)}</text>` : '') +
      `</g>`
    );
  }

  // 节点:顶面 + 四个侧面(看不见的那些不透明度 0)
  // 单独一层(a3d-layer)—— 浏览器端转视角时要按远近重排(远的先画)
  const order = [...p.nodes].sort((a, b) => b.depth - a.depth);
  const nodeParts: string[] = [];
  for (const n of order) {
    const s = scene.nodes.find((x) => x.id === n.id)!;
    const ia = interactive ? ` data-node="${esc(n.id)}" data-tip="${esc(tipOf(scene, n.id))}" tabindex="0"` : '';
    const sides = n.sides.map((sp, i) =>
      `<polygon class="a3d-side" data-side="${i}" points="${sp.pts.map((q) => `${r2(q[0])},${r2(q[1])}`).join(' ')}" fill="${s.color}" fill-opacity="${sp.vis ? 0.28 : 0}"/>`).join('');
    // 底面:从下往上看的时候露出来的那一面(没有它,块就是缺一块的)
    const bottom = `<polygon class="a3d-bottom" points="${n.bottom.map((q) => `${r2(q[0])},${r2(q[1])}`).join(' ')}" fill="${s.color}" fill-opacity="${n.topVis ? 0 : 0.22}"/>`;
    nodeParts.push(
      `<g class="a3d-node"${ia}>` +
      `<polygon class="a3d-shadow" points="${n.shadow.map((q) => `${r2(q[0])},${r2(q[1])}`).join(' ')}" fill="#000" fill-opacity="0.28"/>` +
      `<polygon class="a3d-top" points="${n.top.map((q) => `${r2(q[0])},${r2(q[1])}`).join(' ')}" fill="${s.color}" fill-opacity="${n.topVis ? 0.55 : 0}" stroke="${s.color}" stroke-opacity="0.9" stroke-width="1"/>` +
      bottom + sides +
      (n.icon
        ? `<image class="a3d-icon" href="${s.icon}" x="${r2(n.icon!.x - 17)}" y="${r2(n.icon!.y - 17)}" width="34" height="34" preserveAspectRatio="xMidYMid meet"/>`
        : '') +
      `<text class="a3d-label" x="${r2(n.lx)}" y="${r2(n.ly)}" font-size="12" fill="var(--d-ink)" text-anchor="middle">${esc(s.label)}</text>` +
      `</g>`
    );
  }

  parts.push(`<g class="a3d-layer">${nodeParts.join('')}</g>`);
  return parts.join('');
}

/** 场景的配色(跟站上那套暗色一致) */
function style(): string {
  return (
    `<style>:root{color-scheme:dark;` +
    `--d-s1:#34D399;--d-s2:#F87171;--d-s3:#A78BFA;--d-s4:#22D3EE;--d-s5:#60A5FA;--d-s6:#FB923C;` +
    `--d-s7:#4ADE80;--d-s8:#FB7185;--d-s9:#F59E0B;--d-s10:#0EA5E9;` +
    `--d-ink:#FAFAFA;--d-text:#D4D4D8;--d-muted:#A1A1AA;--d-faint:#71717A;--d-grid:#29292E;--d-card:#0E0F11;--d-link:#60A5FA;` +
    `#am .a3d-edge-path{stroke:#7DD3FC;stroke-opacity:.8;stroke-width:1.5}` +
    `#am g[data-node]{cursor:pointer;transition:filter .12s ease,opacity .15s ease}` +
    `#am g[data-node]:focus{outline:none}` +
    `#am g[data-node]:hover,#am g[data-node]:focus-visible{filter:brightness(1.25)}` +
    `#am g[data-node].on{filter:brightness(1.25)}` +
    `#am.hl g[data-node]{opacity:.4}#am.hl g[data-node].on{opacity:1}` +
    `#am.hl g[data-boundary]{opacity:.35}#am.hl g[data-boundary].on{opacity:1}` +
    `#am.hl path[data-from]{opacity:.22}#am.hl path[data-from].on{opacity:1}` +
    `#am.hl [data-edge-label]{opacity:.3}#am.hl [data-edge-label].on{opacity:1}` +
    `}</style>`
  );
}

const r2 = (v: number): number => Math.round(v * 100) / 100;

/* ---------------------------------------------------------------- 二维(平面图)

   三维那套的「平面版」:每一层摊成一张平面图,并排放 ——
   源层 / 中层 / 汇层,层内的边是直线,层与层之间的边画成弧(跨过面板)。

   节点在平面上的位置就是它在三维场景里的 (x, y) —— 层内那一套布局,
   跟三维的完全一致(只是没有高度了)。 */

export function renderArch3dFlat(scene: Scene, opts: Arch3dOpts = {}): string {
  const r2 = (v: number): number => Math.round(v * 100) / 100;
  const GAP = 60;
  const PANEL_TITLE = ['SOURCE', 'MID', 'SINK'];

  // 每层一块:节点的 (x,y) 范围 + 面板原点
  // 三块面板**共用一条基线**(各自居中)—— 不然面板会互相压
  const panels: { tier: number; x0: number; y0: number; w: number; h: number; minX: number; ids: Set<string> }[] = [];
  const boxes = [0, 1, 2].map((tier) => {
    const members = scene.nodes.filter((n) => n.tier === tier);
    if (!members.length) return null;
    let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
    for (const n of members) {
      minX = Math.min(minX, n.p.x - n.w / 2);
      maxX = Math.max(maxX, n.p.x + n.w / 2);
      minY = Math.min(minY, n.p.y - n.d / 2);
      maxY = Math.max(maxY, n.p.y + n.d / 2);
    }
    return { tier, minX, maxX, minY, maxY };
  });
  const live = boxes.filter(Boolean) as { tier: number; minX: number; maxX: number; minY: number; maxY: number }[];
  const baseY = live.length ? Math.min(...live.map((b) => b.minY)) : 0;
  let cursor = 0;
  for (const b of live) {
    const members = scene.nodes.filter((n) => n.tier === b.tier);
    const w = b.maxX - b.minX;
    const h = b.maxY - b.minY;
    panels.push({
      tier: b.tier, x0: cursor, y0: baseY - b.minY, w, h, minX: b.minX,
      ids: new Set(members.map((n) => n.id)),
    });
    cursor += w + GAP;
  }
  if (!panels.length) return '';
  const totalW = cursor - GAP;
  const totalH = Math.max(...panels.map((p) => p.h)) + 60;
  const parts: string[] = [];

  // 面板(层)的底
  {   // 二维这版就是三张图,面板永远画(不受三维的平面开关管)
    for (const p of panels) {
      parts.push(
        `<rect class="a3d-panel" x="${r2(p.x0 - 24)}" y="${r2(p.y0 - 44)}" width="${r2(p.w + 48)}" height="${r2(p.h + 68)}" rx="14" fill="var(--d-s${p.tier === 0 ? 4 : p.tier === 1 ? 5 : 6})" fill-opacity="0.05" stroke="var(--d-grid)" stroke-width="1"/>` +
        `<text class="a3d-panel-title" x="${r2(p.x0 - 24)}" y="${r2(p.y0 - 22)}" font-size="11" fill="var(--d-faint)">${esc(PANEL_TITLE[p.tier])}</text>`
      );
    }
  }

  // 边:层内的直线,层与层之间的弧
  for (const e of scene.edges) {
    const a = scene.nodes.find((n) => n.id === e.from);
    const b = scene.nodes.find((n) => n.id === e.to);
    if (!a || !b) continue;
    const pa = panels.find((p) => p.ids.has(a.id));
    const pb = panels.find((p) => p.ids.has(b.id));
    if (!pa || !pb) continue;
    const ax = a.p.x - pa.minX + pa.x0;
    const ay = a.p.y + pa.y0;
    const bx = b.p.x - pb.minX + pb.x0;
    const by = b.p.y + pb.y0;
    const ia = opts.interactive ? ` data-from="${esc(e.from)}" data-to="${esc(e.to)}"` : '';
    let d: string;
    if (pa === pb) {
      d = `M${r2(ax)} ${r2(ay)}L${r2(bx)} ${r2(by)}`;
    } else {
      // 跨面板:拱一下,别直着穿过去
      const mx = (ax + bx) / 2;
      const my = Math.min(ay, by) - 40;
      d = `M${r2(ax)} ${r2(ay)}Q${r2(mx)} ${r2(my)} ${r2(bx)} ${r2(by)}`;
    }
    parts.push(
      `<g class="a3d-edge"${ia}>` +
      `<path class="a3d-edge-path" d="${d}"${ia} fill="none"/>` +
      (e.label ? `<text class="a3d-edge-label" x="${r2((ax + bx) / 2)}" y="${r2((ay + by) / 2 - 6)}" font-size="10" fill="var(--d-muted)" text-anchor="middle">${esc(e.label)}</text>` : '') +
      `</g>`
    );
  }

  // 节点
  for (const p of panels) {
    for (const n of scene.nodes.filter((x) => p.ids.has(x.id))) {
      const x = n.p.x - p.minX + p.x0;
      const y = n.p.y + p.y0;
      const attr = opts.interactive ? ` data-node="${esc(n.id)}" data-tip="${esc(n.sub ? n.label + ' · ' + n.sub : n.label)}" tabindex="0"` : '';
      parts.push(
        `<g class="a3d-node"${attr}>` +
        `<rect class="a3d-tile" x="${r2(x - n.w / 2)}" y="${r2(y - n.d / 2)}" width="${r2(n.w)}" height="${r2(n.d)}" rx="8" fill="${n.color}" fill-opacity="0.35" stroke="${n.color}" stroke-opacity="0.9" stroke-width="1"/>` +
        `<text class="a3d-label" x="${r2(x)}" y="${r2(y + 4)}" font-size="11" fill="var(--d-ink)" text-anchor="middle">${esc(n.label)}</text>` +
        `</g>`
      );
    }
  }

  const width = opts.width ?? Math.round(totalW + 80);
  const height = Math.round((totalH / (totalW + 80)) * width);
  return (
    `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" ` +
    `viewBox="${r2(-40)} ${r2(baseY - 40)} ${r2(totalW + 80)} ${r2(totalH + 100)}" ` +
    `font-family="ui-sans-serif,-apple-system,BlinkMacSystemFont,'Segoe UI','PingFang SC','Hiragino Sans GB','Microsoft YaHei',sans-serif" ` +
    `role="img" aria-label="3D architecture diagram (flat)">` +
    style() +
    `<g id="am">${parts.join('')}</g>` +
    `</svg>`
  );
}

