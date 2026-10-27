// /draw/mindmap(x-cmd-hub/draw#17/#20):树形导图 — 结构图家族"树→自动布局"侧。
// 与 archmap(布局外置)相反:邻接即全部语义,坐标纯属噪音 → 引擎布局严格更优。
// 参数:重复 n=<根/枝/叶 路径>(文件树式,读者扫路径即重建整棵树);
// 布局 = 叶节点顺序取槽位、父节点居中于子代均值(经典 mindmap 布局,零依赖、确定性);
// 分支着色:一级分支轮转系列色,后代继承;连接线为有机三次贝塞尔,线宽随深度收窄。
import { ApiError } from '../specs/index.js';
import { resolveVersion } from '../version.js';
import { resolveSkin } from '../styles/index.js';
import { esc, r2, sVar, svgDoc, textW } from './svg.js';
import { clampInt, schemeParam, type DrawResult } from './query.js';

const PAD = 26;
const COL_GAP = 44;   // 列间距(父文字尾 → 子文字头)
const LEAF_STEP = 27; // 叶槽位步进(13px 文本行高+呼吸)
const ROOT_FS = 15;
const NODE_FS = 13;
const MAX_DEPTH = 8;
const MAX_NODES = 500;
const N_EXAMPLE = 'n=Product/Features/Speed&n=Product/Markets/EU';

interface MindNode {
  label: string;
  children: MindNode[]; // 保序(按路径出现序)
  depth: number;
  branch: number;       // 一级分支序号(着色),根 = -1
  x: number;
  y: number;
  w: number;            // 本节点文本宽
}

function bad(detail: string): never {
  throw new ApiError(400, `${detail} Example: /draw/mindmap?${N_EXAMPLE}`);
}

// 路径集 → 前缀树;公共前缀自动合并
function buildTree(paths: string[]): MindNode {
  const root: MindNode = { label: '', children: [], depth: 0, branch: -1, x: 0, y: 0, w: 0 };
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
        next = { label: segs[d], children: [], depth: d, branch: -1, x: 0, y: 0, w: 0 };
        cur.children.push(next);
      }
      cur = next;
    }
  }
  return root;
}

// 布局:叶顺序取槽位,父 = 子代均值;列 x 按各深度最大文本宽错落
function layout(root: MindNode): { W: number; H: number } {
  const colW: number[] = [];
  const measure = (n: MindNode): void => {
    n.w = textW(n.label, n.depth === 0 ? ROOT_FS : NODE_FS);
    colW[n.depth] = Math.max(colW[n.depth] ?? 0, n.w);
    n.children.forEach(measure);
  };
  measure(root);
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
  // 分支着色:一级分支按序轮转,后代继承
  root.children.forEach((c, i) => {
    const paint = (n: MindNode): void => {
      n.branch = i;
      n.children.forEach(paint);
    };
    paint(c);
  });
  return { W: colX[colW.length - 1] + (colW[colW.length - 1] ?? 0) + PAD, H: maxY + LEAF_STEP / 2 + PAD / 2 };
}

function connector(p: MindNode, c: MindNode, color: string): string {
  const x1 = p.x + p.w;
  const y1 = p.y;
  const x2 = c.x;
  const y2 = c.y;
  const mx = (x1 + x2) / 2;
  const width = Math.max(1.2, 2.4 - c.depth * 0.4);
  const d = `M${r2(x1)} ${r2(y1)}C${r2(mx)} ${r2(y1)},${r2(mx)} ${r2(y2)},${r2(x2)} ${r2(y2)}`;
  return `<path d="${d}" fill="none" stroke="${color}" stroke-width="${r2(width)}" stroke-linecap="round"/>`;
}

function draw(root: MindNode, title?: string): { svg: string; W: number; H: number } {
  const { W, H } = layout(root);
  const out: string[] = [];
  const walk = (n: MindNode): void => {
    for (const c of n.children) {
      out.push(connector(n, c, sVar(c.branch % 10)));
      walk(c);
    }
  };
  walk(root);
  // 根:强调胶囊(ink 底 + 反色字);一级分支粗体着色;更深层常规字色
  out.push(
    `<rect x="${r2(root.x - 10)}" y="${r2(root.y - 13)}" width="${r2(root.w + 20)}" height="26" rx="13" fill="var(--d-ink)"/>` +
    `<text x="${r2(root.x)}" y="${r2(root.y)}" dominant-baseline="middle" font-size="${ROOT_FS}" font-weight="600" fill="var(--d-card)">${esc(root.label)}</text>`,
  );
  const walkText = (n: MindNode): void => {
    for (const c of n.children) {
      const attrs = c.depth === 1
        ? `font-weight="600" fill="${sVar(c.branch % 10)}"`
        : `fill="var(--d-text)"`;
      out.push(`<text x="${r2(c.x)}" y="${r2(c.y)}" dominant-baseline="middle" font-size="${NODE_FS}" ${attrs}>${esc(c.label)}</text>`);
      walkText(c);
    }
  };
  walkText(root);
  return { svg: out.join(''), W, H };
}

/**
 * Render a mindmap from a URL's query params (`/draw/mindmap`).
 *
 * Each repeated `n=` carries one root-to-leaf path (`Product/Features/Speed`);
 * shared prefixes merge, the engine lays the tidy tree out (leaves take
 * sequential slots, parents centre on their children) and colours branches
 * from the series palette. Throws ApiError(400) with a corrective example
 * on malformed params.
 */
export function renderMindmapFromUrl(url: URL): DrawResult {
  const params = url.searchParams;
  const paths = params.getAll('n');
  if (!paths.length) bad('at least one n=<path> is required');
  const root = buildTree(paths);
  if (!root.children.length) bad('the root needs at least one branch (path depth ≥ 2)');
  const title = params.get('title')?.trim() || undefined;
  const v = resolveVersion(params.get('v'));
  const skin = resolveSkin('sankey', params.get('t'), schemeParam(params));
  const { svg: body, W, H } = draw(root, title);
  const titleH = title ? 40 : 0;
  const width = Math.max(W, clampInt(params, 'w', 0, 200, 2400));
  const height = Math.max(H + titleH, clampInt(params, 'h', 0, 140, 2000));
  const titleSvg = title
    ? `<text x="${PAD}" y="${PAD + 14}" font-size="18" font-weight="500" letter-spacing="-0.02em" fill="var(--d-ink)">${esc(title)}</text>`
    : '';
  const children = (titleH ? titleSvg + `<g transform="translate(0 ${titleH})">` + body + `</g>` : body);
  const spec = { type: 'mindmap' as const, ...(title ? { title } : {}), paths };
  const svg = svgDoc(width, height, 'mindmap', v.version, title ?? `mindmap: ${root.label}`, spec, skin, children);
  return { svg, version: v.version, cacheControl: v.cacheControl };
}
