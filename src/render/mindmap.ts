// /draw/mindmap(x-cmd-hub/draw#17/#20):树形导图 — 结构图家族"树→自动布局"侧。
// 与 archmap(布局外置)相反:邻接即全部语义,坐标纯属噪音 → 引擎布局严格更优。
// 参数:重复 n=<根/枝/叶 路径>(文件树式,读者扫路径即重建整棵树);style 三形态:
//   organic(缺省)— 有机贝塞尔 + 文字节点 + 根胶囊(XMind 经典)
//   tree       — 盒节点 + 直角肘形连线(逻辑树;一级分支实心着色盒)
//   radial     — 根居中,叶在外圈均匀分角,扇形辐射(泡泡/辐射导图)
// 布局:叶顺序取槽位(线性)或均匀分角(辐射),父节点居中于子代均值;列距按各深度最大标签宽错落。
import { ApiError } from '../specs/index.js';
import { resolveVersion } from '../version.js';
import { resolveSkin } from '../styles/index.js';
import { esc, r2, sVar, onVar, svgDoc, textW } from './svg.js';
import { clampInt, schemeParam, type DrawResult } from './query.js';

const PAD = 26;
const COL_GAP = 44;   // 列间距(父文字尾 → 子文字头)
const LEAF_STEP = 27; // 叶槽位步进(13px 文本行高+呼吸)
const ROOT_FS = 15;
const NODE_FS = 13;
const BOX_PAD = 10;   // tree 形态盒内边距
const BOX_H = 24;     // tree 形态盒高
const RAD_GAP = 56;   // radial 形态环间距
const LEAF_SIDE_NEED = 24; // radial 侧面叶的切向占位(径向排版只需行高+呼吸)
const MAX_DEPTH = 8;
const MAX_NODES = 500;
const STYLES = ['organic', 'tree', 'radial'] as const;
type MindStyle = (typeof STYLES)[number];
const N_EXAMPLE = 'n=Product/Features/Speed&n=Product/Markets/EU';

interface MindNode {
  label: string;
  children: MindNode[]; // 保序(按路径出现序)
  depth: number;
  branch: number;       // 一级分支序号(着色),根 = -1
  x: number;
  y: number;
  w: number;            // 本节点文本宽
  anchor: 'start' | 'middle' | 'end';
  angle: number;        // radial 专属:扇区分角(线性形态不消费)
}

function bad(detail: string): never {
  throw new ApiError(400, `${detail} Example: /draw/mindmap?${N_EXAMPLE}`);
}

// 路径集 → 前缀树;公共前缀自动合并
function buildTree(paths: string[]): MindNode {
  const root: MindNode = { label: '', children: [], depth: 0, branch: -1, x: 0, y: 0, w: 0, anchor: 'start', angle: 0 };
  let count = 0;
  for (const p of paths) {
    if (!p.trim()) bad('every n= path must be non-empty');
    const segs = p.split('/').map(s => s.trim());
    if (segs.some(s => !s)) bad(`"${p}": path segments must be non-empty (no "//" or leading/trailing "/")`);
    if (segs.length > MAX_DEPTH) bad(`"${p}": deeper than ${MAX_DEPTH} levels`);
    if (root.label === '') root.label = segs[0];
    else if (segs[0] !== root.label) bad(`"${p}": mindmap takes one tree — root "${segs[0]}" differs from "${root.label}"`);
    let cur = root;
    for (let d = 1; d < segs.length; d++) {
      let next = cur.children.find(c => c.label === segs[d]);
      if (!next) {
        if (++count > MAX_NODES) bad(`too many nodes (>${MAX_NODES})`);
        next = { label: segs[d], children: [], depth: d, branch: -1, x: 0, y: 0, w: 0, anchor: 'start', angle: 0 };
        cur.children.push(next);
      }
      cur = next;
    }
  }
  return root;
}

// 文本宽度 + 分支着色(一级分支按序轮转,后代继承)
function measure(root: MindNode, boxed: boolean): number[] {
  const colW: number[] = [];
  const walk = (n: MindNode): void => {
    n.w = textW(n.label, n.depth === 0 ? ROOT_FS : NODE_FS) + (boxed ? BOX_PAD * 2 : 0);
    colW[n.depth] = Math.max(colW[n.depth] ?? 0, n.w);
    n.children.forEach(walk);
  };
  walk(root);
  root.children.forEach((c, i) => {
    const paint = (m: MindNode): void => {
      m.branch = i;
      m.children.forEach(paint);
    };
    paint(c);
  });
  return colW;
}

// 线性布局(organic/tree):叶顺序取槽位,父 = 子代均值;列 x 按各深度最大宽错落
function layoutLinear(root: MindNode, colW: number[]): { W: number; H: number } {
  const colX: number[] = [];
  let x = PAD;
  for (let d = 0; d < colW.length; d++) {
    colX[d] = d === 0 ? PAD : x + COL_GAP / 2;
    x = colX[d] + (colW[d] ?? 0) + COL_GAP / 2;
  }
  let nextY = PAD + LEAF_STEP / 2;
  let maxY = 0;
  const place = (n: MindNode): void => {
    n.x = colX[n.depth];
    if (!n.children.length) {
      n.y = nextY;
      nextY += LEAF_STEP;
    } else {
      n.children.forEach(place);
      n.y = (n.children[0].y + n.children[n.children.length - 1].y) / 2;
    }
    maxY = Math.max(maxY, n.y);
  };
  place(root);
  return { W: colX[colW.length - 1] + (colW[colW.length - 1] ?? 0) + PAD, H: maxY + LEAF_STEP / 2 + PAD / 2 };
}

// 辐射布局:叶在外圈全局均匀分角(分支扇区自动 ∝ 叶数),父 = 子代角均值;半径按环累计
function layoutRadial(root: MindNode, colW: number[]): { W: number; H: number; dx: number; dy: number } {
  const radius: number[] = [];
  let r = 0;
  for (let d = 0; d < colW.length; d++) {
    radius[d] = d === 0 ? 0 : r + RAD_GAP / 2;
    r = radius[d] + (colW[d] ?? 0) + RAD_GAP / 2;
  }
  const leaves: MindNode[] = [];
  const collect = (n: MindNode): void => {
    if (!n.children.length) leaves.push(n);
    n.children.forEach(collect);
  };
  collect(root);
  const L = Math.max(leaves.length, 1);
  let minX = 0, maxX = 0, minY = 0, maxY = 0;
  // 第一遍:均匀分角,只为判定每个叶落在侧面(径向排版,占角小)还是顶底(水平排版,占角=字宽/半径)
  let li = 0;
  const placeUniform = (n: MindNode): void => {
    if (!n.children.length) {
      n.angle = -Math.PI / 2 + (2 * Math.PI * li++) / L;
    } else {
      n.children.forEach(placeUniform);
      n.angle = (n.children[0].angle + n.children[n.children.length - 1].angle) / 2;
    }
  };
  placeUniform(root);
  root.angle = -Math.PI / 2;
  // 第二遍:叶槽位按占角需求分配(比例归一铺满整圈),溢出则整体放大半径
  const angularNeed = (leaf: MindNode): number => {
    const r = radius[leaf.depth] || 120;
    const c = Math.cos(leaf.angle);
    return c > 0.35 || c < -0.35 ? LEAF_SIDE_NEED / r : (leaf.w + 26) / r;
  };
  const needs = leaves.map(angularNeed);
  const total = needs.reduce((a, b) => a + b, 0);
  const BUDGET = Math.PI * 2 * 0.92; // 全局留 8% 呼吸
  if (total > BUDGET) {
    const grow = total / BUDGET;
    for (let d = 1; d < radius.length; d++) radius[d] *= grow;
  }
  let a = -Math.PI / 2;
  leaves.forEach((leaf, i) => {
    const slot = (needs[i] / total) * Math.PI * 2;
    leaf.angle = a + slot / 2; // 槽位中心
    a += slot;
  });
  const reCenter = (n: MindNode): void => {
    if (n.children.length) {
      n.children.forEach(reCenter);
      n.angle = (n.children[0].angle + n.children[n.children.length - 1].angle) / 2;
    }
  };
  reCenter(root);
  root.angle = -Math.PI / 2;
  const project = (n: MindNode): void => {
    const a = n.angle;
    const rr = radius[n.depth];
    const cosA = Math.cos(a); // 右侧左对齐/左侧右对齐,正上下方居中
    n.anchor = cosA > 0.35 ? 'start' : cosA < -0.35 ? 'end' : 'middle';
    n.x = rr * Math.cos(a);
    n.y = rr * Math.sin(a);
    const w = n.depth === 0 ? n.w + 20 : n.w;
    const x0 = n.anchor === 'start' ? n.x : n.x - w;
    minX = Math.min(minX, x0); maxX = Math.max(maxX, x0 + w);
    minY = Math.min(minY, n.y - 14); maxY = Math.max(maxY, n.y + 14);
    n.children.forEach(project);
  };
  project(root);
  return { W: maxX - minX + PAD * 2, H: maxY - minY + PAD * 2, dx: PAD - minX, dy: PAD - minY };
}

// ── organic ────────────────────────────────────────────────────────────────
function drawOrganic(root: MindNode): { svg: string; W: number; H: number } {
  const { W, H } = layoutLinear(root, measure(root, false));
  const out: string[] = [];
  const walk = (n: MindNode): void => {
    for (const c of n.children) {
      const x1 = n.x + n.w;
      const mx = (x1 + c.x) / 2;
      const width = Math.max(1.2, 2.4 - c.depth * 0.4);
      out.push(`<path d="M${r2(x1)} ${r2(n.y)}C${r2(mx)} ${r2(n.y)},${r2(mx)} ${r2(c.y)},${r2(c.x)} ${r2(c.y)}" fill="none" stroke="${sVar(c.branch % 10)}" stroke-width="${r2(width)}" stroke-linecap="round"/>`);
      walk(c);
    }
  };
  walk(root);
  out.push(
    `<rect x="${r2(root.x - 10)}" y="${r2(root.y - 13)}" width="${r2(root.w + 20)}" height="26" rx="13" fill="var(--d-ink)"/>` +
    `<text x="${r2(root.x)}" y="${r2(root.y)}" dominant-baseline="middle" font-size="${ROOT_FS}" font-weight="600" fill="var(--d-card)">${esc(root.label)}</text>`,
  );
  const walkText = (n: MindNode): void => {
    for (const c of n.children) {
      const attrs = c.depth === 1 ? `font-weight="600" fill="${sVar(c.branch % 10)}"` : `fill="var(--d-text)"`;
      out.push(`<text x="${r2(c.x)}" y="${r2(c.y)}" dominant-baseline="middle" font-size="${NODE_FS}" ${attrs}>${esc(c.label)}</text>`);
      walkText(c);
    }
  };
  walkText(root);
  return { svg: out.join(''), W, H };
}

// ── tree:盒节点 + 直角肘形 ────────────────────────────────────────────────
function drawTree(root: MindNode): { svg: string; W: number; H: number } {
  const { W, H } = layoutLinear(root, measure(root, true));
  const out: string[] = [];
  const right = (n: MindNode): number => n.x + n.w; // 盒右缘(x 已含 BOX_PAD*2)
  const left = (n: MindNode): number => n.x;
  const walk = (n: MindNode): void => {
    for (const c of n.children) {
      const midX = (right(n) + left(c)) / 2;
      const d = `M${r2(right(n))} ${r2(n.y)}H${r2(midX)}V${r2(c.y)}H${r2(left(c))}`;
      out.push(`<path d="${d}" fill="none" stroke="${sVar(c.branch % 10)}" stroke-width="1.4"/>`);
      walk(c);
    }
  };
  walk(root);
  const box = (n: MindNode, fill: string, stroke: string, textFill: string, bold: boolean): void => {
    out.push(`<rect x="${r2(n.x)}" y="${r2(n.y - BOX_H / 2)}" width="${r2(n.w)}" height="${BOX_H}" rx="6" fill="${fill}" stroke="${stroke}" stroke-width="1"/>`);
    out.push(`<text x="${r2(n.x + n.w / 2)}" y="${r2(n.y)}" dominant-baseline="middle" text-anchor="middle" font-size="${NODE_FS}"${bold ? ' font-weight="600"' : ''} fill="${textFill}">${esc(n.label)}</text>`);
  };
  // 根:大号 ink 胶囊
  out.push(
    `<rect x="${r2(root.x)}" y="${r2(root.y - 16)}" width="${r2(root.w)}" height="32" rx="16" fill="var(--d-ink)"/>` +
    `<text x="${r2(root.x + root.w / 2)}" y="${r2(root.y)}" dominant-baseline="middle" text-anchor="middle" font-size="${ROOT_FS}" font-weight="600" fill="var(--d-card)">${esc(root.label)}</text>`,
  );
  const walkBox = (n: MindNode): void => {
    for (const c of n.children) {
      if (c.depth === 1) box(c, sVar(c.branch % 10), 'none', onVar(c.branch % 10), true);
      else box(c, 'var(--d-card)', 'var(--d-border)', 'var(--d-text)', false);
      walkBox(c);
    }
  };
  walkBox(root);
  return { svg: out.join(''), W, H };
}

// ── radial:根居中,扇形辐射 ────────────────────────────────────────────────
function drawRadial(root: MindNode): { svg: string; W: number; H: number } {
  const colW = measure(root, false);
  const { W, H, dx, dy } = layoutRadial(root, colW);
  const out: string[] = [];
  const walk = (n: MindNode): void => {
    for (const c of n.children) {
      // 控制点取两代半径中点、各自角度 → 螺旋感平滑曲线
      const rr = (d: number): number => (d === 0 ? 0 : radiusOf(colW, d));
      const aP = n.depth === 0 ? c.angle : n.angle;
      const midR = (rr(n.depth) + rr(c.depth)) / 2;
      const c1 = pol(midR, aP);
      const c2 = pol(midR, c.angle);
      const p0 = pol(rr(n.depth), aP);
      const p1 = pol(rr(c.depth), c.angle);
      const width = Math.max(1.2, 2.4 - c.depth * 0.4);
      out.push(`<path d="M${r2(p0[0])} ${r2(p0[1])}C${r2(c1[0])} ${r2(c1[1])},${r2(c2[0])} ${r2(c2[1])},${r2(p1[0])} ${r2(p1[1])}" fill="none" stroke="${sVar(c.branch % 10)}" stroke-width="${r2(width)}" stroke-linecap="round"/>`);
      walk(c);
    }
  };
  walk(root);
  out.push(
    `<rect x="${r2(root.x - 10)}" y="${r2(root.y - 13)}" width="${r2(root.w + 20)}" height="26" rx="13" fill="var(--d-ink)"/>` +
    `<text x="${r2(root.x)}" y="${r2(root.y)}" dominant-baseline="middle" font-size="${ROOT_FS}" font-weight="600" fill="var(--d-card)">${esc(root.label)}</text>`,
  );
  const walkText = (n: MindNode): void => {
    for (const c of n.children) {
      const attrs = c.depth === 1 ? `font-weight="600" fill="${sVar(c.branch % 10)}"` : `fill="var(--d-text)"`;
      out.push(`<text x="${r2(c.x)}" y="${r2(c.y)}" text-anchor="${c.anchor}" dominant-baseline="middle" font-size="${NODE_FS}" ${attrs}>${esc(c.label)}</text>`);
      walkText(c);
    }
  };
  walkText(root);
  // 角度→坐标在 layoutRadial 已完成;此处的 pol 只服务连线控制点
  return { svg: `<g transform="translate(${r2(dx)} ${r2(dy)})">${out.join('')}</g>`, W, H };
}

const pol = (r: number, a: number): [number, number] => [r * Math.cos(a), r * Math.sin(a)];
function radiusOf(colW: number[], d: number): number {
  let r = 0;
  for (let k = 1; k <= d; k++) r += (colW[k - 1] ?? 0) + RAD_GAP;
  return r;
}

/**
 * Render a mindmap from a URL's query params (`/draw/mindmap`).
 *
 * Each repeated `n=` carries one root-to-leaf path (`Product/Features/Speed`);
 * shared prefixes merge. `style` picks the form: `organic` (bezier + text,
 * default), `tree` (boxes + elbows), `radial` (root-centred fan). Throws
 * ApiError(400) with a corrective example on malformed params.
 */
export function renderMindmapFromUrl(url: URL): DrawResult {
  const params = url.searchParams;
  const paths = params.getAll('n');
  if (!paths.length) bad('at least one n=<path> is required');
  const styleParam = params.get('style') ?? 'organic';
  if (!(STYLES as readonly string[]).includes(styleParam)) bad(`unknown style "${styleParam}" (one of ${STYLES.join('|')})`);
  const style = styleParam as MindStyle;
  const root = buildTree(paths);
  if (!root.children.length) bad('the root needs at least one branch (path depth ≥ 2)');
  const title = params.get('title')?.trim() || undefined;
  const v = resolveVersion(params.get('v'));
  const skin = resolveSkin('sankey', params.get('t'), schemeParam(params));
  const { svg: body, W, H } = style === 'tree' ? drawTree(root) : style === 'radial' ? drawRadial(root) : drawOrganic(root);
  const titleH = title ? 40 : 0;
  const width = Math.max(W, clampInt(params, 'w', 0, 200, 2400));
  const height = Math.max(H + titleH, clampInt(params, 'h', 0, 140, 2000));
  const titleSvg = title
    ? `<text x="${PAD}" y="${PAD + 14}" font-size="18" font-weight="500" letter-spacing="-0.02em" fill="var(--d-ink)">${esc(title)}</text>`
    : '';
  const children = (titleH ? titleSvg + `<g transform="translate(0 ${titleH})">` + body + `</g>` : body);
  const spec = { type: 'mindmap' as const, style, ...(title ? { title } : {}), paths };
  const svg = svgDoc(width, height, 'mindmap', v.version, title ?? `mindmap: ${root.label}`, spec, skin, children);
  return { svg, version: v.version, cacheControl: v.cacheControl };
}
