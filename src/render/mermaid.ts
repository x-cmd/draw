// mermaid 语法糖 → archmap(#20 方案 A′):只吃 flowchart(graph/flowchart)子集。
// 解析 = vendored jison 产物(官方 flow.jison 编译);布局 = dagre(纯 JS);
// 渲染 = renderArchmapCore(三风格/交互/PNG/缓存全继承)。
// 时序图/甘特等其余图型不在 v1 范围,给出明确 400。
import type { Dagre } from '../types/dagre.js';
// dagre 无官方类型:类型用本仓自绘的最小面(普通模块,非 ambient 声明 ——
// ambient 属全局类型改动,JSR 不许发布)
// @ts-types="../types/dagre.ts"
import dagreRaw from 'dagre';
const dagre = dagreRaw as unknown as Dagre;
import { ApiError } from '../specs/index.js';
import { resolveVersion } from '../version.js';
import { resolveSkin, type Skin } from '../styles/index.js';
import { clampInt, schemeParam, type DrawResult } from './query.js';
import { mermaidFlowParser } from './vendor/mermaid-flow-parser.js';
import { renderGanttFromUrl } from './gantt.js';
import { renderArchmapCore, naturalSize, type ArchNode, type ArchEdge, type ArchBoundary, type ArchmapCoreOpts, type ArchStyle } from './archmap.js';

const M_MAX = 6000;
const N_EXAMPLE = 'm=' + encodeURIComponent('graph LR\n  A[Browser] --> B{Gateway}\n  B --> C[API]');

interface FlowDoc {
  direction: string;
  nodes: { id: string; label: string; shape: string }[];
  edges: { from: string; to: string; label: string; dotted: boolean; thick: boolean }[];
  groups: { title: string; nodes: string[] }[];
}

const asText = (v: unknown, fb = ''): string => {
  if (v == null) return fb;
  if (typeof v === 'string') return v.trim();
  if (Array.isArray(v)) return v.map((x) => asText(x)).filter(Boolean).join(' '); // 分组成员是嵌套单元素数组
  if (typeof v === 'object') return String((v as { text?: unknown }).text ?? '').trim();
  return String(v).trim();
};

/** mermaid 顶点形状 → archmap 形状/语义色:菱形=判定,圆柱=存储,其余盒型 */
function toShape(type: string): { shape: NonNullable<ArchNode['shape']>; nodeType: ArchNode['type'] } {
  switch (type) {
    case 'diamond': case 'hexagon': case 'question':
      return { shape: 'diamond', nodeType: 'be' };
    case 'cylinder':
      return { shape: 'cylinder', nodeType: 'db' };
    case 'round': case 'stadium': case 'circle': case 'ellipse': case 'doublecircle':
      return { shape: 'round', nodeType: 'fe' };
    default:
      return { shape: 'rect', nodeType: 'be' };
  }
}

/** jison 收集器:挂 yy 回调,解析产出 FlowDoc(冒烟已验证的接线:yy.lex.firstGraph / addLink 笛卡尔积 / link.text.text) */
export function parseFlow(text: string): FlowDoc {
  const doc: FlowDoc = { direction: 'TD', nodes: [], edges: [], groups: [] };
  const byId = new Map<string, FlowDoc['nodes'][number]>();
  const pending: { stroke: string }[] = [];
  let first = true;

  const endInfo = (str: unknown): { type: string; stroke: string; length: number } => {
    const s = String(str);
    return {
      type: s.includes('>') || s.includes('<') ? 'arrow_point' : 'arrow_open',
      stroke: s.includes('.') ? 'dotted' : s.includes('=') ? 'thick' : 'normal',
      length: 1,
    };
  };

  // 连线两端可能从没作为独立节点声明过(subgraph 里的写法)——补一个占位节点,
  // 免得布局阶段查不到盒子。
  const ensureVertex = (id: string): void => {
    if (byId.has(id)) return;
    const n = { id, label: id, shape: 'rect' };
    byId.set(id, n);
    doc.nodes.push(n);
  };

  const yy = {
    // mermaid FlowDB 约定:lexer 通过 yy.lex.firstGraph 区分首行方向
    lex: { firstGraph(): boolean { const r = first; first = false; return r; } },
    setDirection(d: string) { doc.direction = (d ?? 'TD').trim().toUpperCase(); },
    addVertex(id: string, text: unknown, type: unknown) {
      if (byId.has(id)) return;
      const n = { id, label: asText(text, id) || id, shape: typeof type === 'string' ? type : 'rect' };
      byId.set(id, n);
      doc.nodes.push(n);
    },
    destructLink(endStr: unknown, startStr?: unknown) {
      const info = endInfo(endStr);
      if (startStr !== undefined && startStr !== null && String(startStr).trim() !== '') {
        const si = endInfo(startStr);
        if (si.stroke !== info.stroke) return { type: 'INVALID', stroke: 'INVALID' };
      }
      pending.push(info);
      return info;
    },
    addLink(sources: string[], targets: string[], link: { text?: unknown } | undefined) {
      const label = asText(link && (link as { text?: unknown }).text);
      for (const s of sources) for (const t of targets) {
        // subgraph 里写的连线不会先触发 addVertex —— 两端自己补上,
        // 否则布局阶段找不到节点就炸了(500)。
        ensureVertex(s);
        ensureVertex(t);
        const info = pending[0] ?? { stroke: 'normal' };
        doc.edges.push({ from: s, to: t, label, dotted: info.stroke === 'dotted', thick: info.stroke === 'thick' });
      }
      pending.length = 0;
    },
    addSubGraph(id: unknown, list: unknown[]) {
      const title = asText(id) || 'group';
      // 成员可能是嵌套数组,也可能是「GW CDN」这样一整行文本 —— 摊平后按空白切开,
      // 再只留下确实是节点的 id(否则边界框找不到节点,渲染时 500)。
      const nodes = (Array.isArray(list) ? list : [list])
        .flatMap((x) => asText(x).split(/\s+/))
        .filter(Boolean)
        .filter((nid) => byId.has(nid));
      if (nodes.length) doc.groups.push({ title, nodes });
    },
    // 以下均为渲染态/交互态特性,v1 不消费,静默吞掉
    setClass() {}, setClickEvent() {}, setTooltip() {}, setLink() {},
    setAccTitle() {}, setAccDescription() {}, addClass() {},
    updateLink() {}, updateLinkInterpolate() {},
  };

  const p = mermaidFlowParser;
  p.yy = yy as unknown as typeof p.yy;
  try {
    p.parse(text);
  } catch (e) {
    throw new ApiError(400, `mermaid syntax error: ${e instanceof Error ? e.message.split('\n')[0] : String(e)}. Example: /draw/mermaid?${N_EXAMPLE}`);
  }
  if (!doc.nodes.length) throw new ApiError(400, `no nodes found — is it a flowchart? Only "graph/flowchart" is supported in v1. Example: /draw/mermaid?${N_EXAMPLE}`);
  return doc;
}

/** dagre 层次布局 → 每个节点的像素盒(左上角);W/H 为内容外沿 */
function layout(doc: FlowDoc, sizes: Map<string, { w: number; h: number }>): { boxes: Map<string, { x: number; y: number; w: number; h: number }>; W: number; H: number } {
  const g = new dagre.graphlib.Graph();
  g.setGraph({ rankdir: doc.direction === 'LR' || doc.direction === 'RL' ? 'LR' : 'TB', nodesep: 56, ranksep: 72, marginx: 24, marginy: 24 });
  g.setDefaultEdgeLabel(() => ({}));
  for (const n of doc.nodes) {
    const sz = sizes.get(n.id) ?? { w: 120, h: 40 };
    g.setNode(n.id, { width: sz.w, height: sz.h });
  }
  for (const e of doc.edges) g.setEdge(e.from, e.to);
  dagre.layout(g);
  // 同层对齐 + 层重心平滑:mermaid 观感的关键——dagre 按"总弯曲最小"摆位,
  // 单节点层的中心仍会漂(被分支拉偏),主流向呈 S 弯。两步修:
  // ① 层内平移到共同中心(保留层内相对分布);② 层中心向父/子层中心靠拢
  // (两轮迭代)→ 主流纯直线,分支围绕主流张开。
  const lr = doc.direction === 'LR' || doc.direction === 'RL';
  const rankOf = (id: string): string => {
    const nd = g.node(id);
    return String(Math.round(lr ? nd.x : nd.y));
  };
  const rankIds = new Map<string, string[]>();
  for (const id of g.nodes()) {
    const k = rankOf(id);
    (rankIds.get(k) ?? rankIds.set(k, []).get(k)!).push(id);
  }
  const memberMean = new Map<string, number>();
  for (const [k, ids] of rankIds) {
    const arr = ids.map(id => (lr ? g.node(id).y : g.node(id).x));
    memberMean.set(k, arr.reduce((a, b) => a + b, 0) / arr.length);
  }
  // 主链对齐:最长路径(忽略回边)上的节点 = 主流,全部钉到同一轴线(主流纯水平/垂直);
  // 含主链节点的层整体平移(保留层内分支展开),纯分支层沿用平滑结果
  const adj = new Map<string, string[]>();
  for (const e of doc.edges) {
    (adj.get(e.from) ?? adj.set(e.from, []).get(e.from)!).push(e.to);
  }
  const dp = new Map<string, number>();
  const next = new Map<string, string>();
  const onStack = new Set<string>();
  const visit = (id: string): number => {
    if (dp.has(id)) return dp.get(id)!;
    if (onStack.has(id)) return 0; // 回边,断链
    onStack.add(id);
    let best = 0;
    for (const t of adj.get(id) ?? []) {
      const v = visit(t) + 1;
      if (v > best) { best = v; next.set(id, t); }
    }
    onStack.delete(id);
    dp.set(id, best);
    return best;
  };
  let head: string | undefined = doc.nodes[0]?.id;
  for (const n of doc.nodes) if (visit(n.id) > (head ? (dp.get(head) ?? 0) : -1)) head = n.id;
  const chain = new Set<string>();
  for (let cur: string | undefined = head; cur && !chain.has(cur); cur = next.get(cur)) {
    chain.add(cur);
  }
  const axisVals = [...chain].map(id => (lr ? g.node(id).y : g.node(id).x));
  const axis = axisVals.length ? axisVals.reduce((a, b) => a + b, 0) / axisVals.length : (memberMean.values().next().value ?? 0);
  const chainRank = new Map<string, string>();
  for (const id of chain) chainRank.set(rankOf(id), id);
  const centers = new Map(memberMean);
  for (const [k, ids] of rankIds) {
    const mainId = chainRank.get(k);
    if (mainId) {
      const mainVal = lr ? g.node(mainId).y : g.node(mainId).x;
      centers.set(k, (memberMean.get(k) ?? mainVal) + (axis - mainVal));
    }
  }
  const boxes = new Map<string, { x: number; y: number; w: number; h: number }>();
  let W = 0, H = 0;
  for (const id of g.nodes()) {
    const nd = g.node(id);
    const sz = sizes.get(id) ?? { w: 120, h: 40 };
    const key = rankOf(id);
    const aligned = centers.get(key) ?? (lr ? nd.y : nd.x);
    const own = lr ? nd.y : nd.x;
    const shifted = aligned + (own - (memberMean.get(key) ?? own));
    const cx = lr ? nd.x : shifted;
    const cy = lr ? shifted : nd.y;
    const x = Math.round(cx - sz.w / 2), y = Math.round(cy - sz.h / 2);
    boxes.set(id, { x, y, w: sz.w, h: sz.h });
    W = Math.max(W, x + sz.w);
    H = Math.max(H, y + sz.h);
  }
  return { boxes, W, H };
}

/**
 * Render a mermaid flowchart from URL params (`/draw/mermaid?m=<code>`).
 * v1 subset: graph/flowchart with node shapes, edge styles/labels and
 * subgraphs (→ boundary groups). Everything renders through the archmap
 * engine — styles, interactivity, PNG and caching all inherited.
 */
export function renderMermaidFromUrl(url: URL, interactive = false): DrawResult {
  const params = url.searchParams;
  const m = params.get('m');
  if (m === null || m.trim() === '') throw new ApiError(400, `"m" (mermaid source) is required. Example: /draw/mermaid?${N_EXAMPLE}`);
  if (m.length > M_MAX) throw new ApiError(400, `"m" too long: ${m.length} > ${M_MAX}`);
  const head = m.trim().split(/\s+/)[0]?.toLowerCase() ?? '';
  if (head === 'gantt') return renderGanttFromUrl(url, interactive);
  if (head !== 'graph' && head !== 'flowchart') {
    throw new ApiError(400, `only "graph/flowchart" and "gantt" are supported, got "${head || '(empty)'}"`);
  }

  const doc = parseFlow(m);
  const v = resolveVersion(params.get('v'));
  const tParam = params.get('t');
  const style: ArchStyle = tParam === 'mono' || tParam === 'soft' ? tParam : 'base';
  const skin: Skin = resolveSkin('sankey', style === 'base' ? tParam : null, schemeParam(params));
  const title = params.get('title')?.trim() || undefined;

  // 尺寸测量与 archmap 同源(naturalSize),布局后转 archmap 像素节点
  const archNodes: ArchNode[] = doc.nodes.map((n) => ({ id: n.id, type: toShape(n.shape).nodeType, label: n.label, shape: toShape(n.shape).shape }));
  const sizes = new Map(archNodes.map((n) => [n.id, naturalSize(n)]));
  const { boxes } = layout(doc, sizes);
  const placedNodes: ArchNode[] = archNodes.map((n) => {
    const b = boxes.get(n.id)!;
    return { ...n, px: { x: b.x + 26, y: b.y + 26 } }; // +PAD 对齐 archmap 画布留白
  });

  const edges: ArchEdge[] = doc.edges.map((e) => ({
    from: e.from, to: e.to, label: e.label || undefined,
    variant: e.dotted ? 'dash' : 'plain',
  }));

  const boundaries: ArchBoundary[] = doc.groups.map((g) => ({ label: g.title, ids: [...g.nodes] }));

  const opts: ArchmapCoreOpts = {
    nodes: placedNodes, edges, boundaries, title, style, interactive,
    gridCols: 0,
    minW: clampInt(params, 'w', 0, 200, 2400),
    minH: clampInt(params, 'h', 0, 140, 2000),
    v, skin,
    aria: title ?? `mermaid flowchart, ${doc.nodes.length} nodes`,
    edgeMode: 'straight',
    straightDir: doc.direction === 'LR' || doc.direction === 'RL' ? 'LR' : 'TB',
  };
  return renderArchmapCore(opts);
}
