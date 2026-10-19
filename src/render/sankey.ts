// 桑基图:节点高∝数值,封闭三次贝塞尔流带;最长路径分层,堆叠序跟随对端节点位置。
// 三变体(规范 sankey 1-3):basic 源色流带 / fund 每链渐变 / pipeline 蓝→紫→玫红叙事。
import { ApiError } from '../specs/index.js';
import type { SankeySpec, SankeyLink } from '../specs/index.js';
import { TAB, card } from '../theme.js';
import { esc, fmtFull, r2, sVar, trunc, type RenderOpts, svgDoc } from './svg.js';
import { C_sankeyPipeline } from '../styles/common.js';

interface LaidNode {
  name: string;
  value: number;
  col: number;
  x: number;
  y: number;
  w: number;
  h: number;
  colorIdx: number;
}
interface LaidLink {
  link: SankeyLink;
  d: string;
  from: LaidNode;
  to: LaidNode;
  /** 源端/目标端堆叠顶 y 与带宽(pipeline 拆半绘制用) */
  sy: number;
  ty: number;
  lh: number;
}

// 分层(最长路径)+ 节点量(in/out 较大者)+ 布局
function layoutSankey(
  spec: SankeySpec,
  left: number,
  right: number,
  top: number,
  bottom: number,
  nodeW: number,
  nodeWFor?: (col: number, cols: number) => number,
): { nodes: LaidNode[]; links: LaidLink[]; cols: number } {
  const names = spec.labels;
  const idx = new Map(names.map((n, i) => [n, i]));
  const inSum = names.map(() => 0);
  const outSum = names.map(() => 0);
  const col = names.map(() => 0);
  const outLinks: number[][] = names.map(() => []);
  const inDeg = names.map(() => 0);

  spec.links.forEach((l, li) => {
    const f = idx.get(l.from)!;
    const t = idx.get(l.to)!;
    outSum[f] += l.value;
    inSum[t] += l.value;
    outLinks[f].push(li);
    inDeg[t]++;
  });
  // 最长路径分层(Kahn);环 → 400
  const deg = [...inDeg];
  const queue = names.map((_, i) => i).filter((i) => deg[i] === 0);
  const order: number[] = [];
  while (queue.length) {
    const i = queue.shift()!;
    order.push(i);
    for (const li of outLinks[i]) {
      const t = idx.get(spec.links[li].to)!;
      col[t] = Math.max(col[t], col[i] + 1);
      if (--deg[t] === 0) queue.push(t);
    }
  }
  if (order.length < names.length) {
    throw new ApiError(400, 'sankey links must form a DAG (no cycles); check links= for a loop');
  }
  const cols = Math.max(...col) + 1;

  const value = names.map((_, i) => Math.max(inSum[i], outSum[i]));
  // 列总流量 → 缩放:最高列(含间隙)恰好铺满
  const colSum = Array.from({ length: cols }, (_, c) => names.reduce((s, _, i) => (col[i] === c ? s + value[i] : s), 0));
  const colCount = Array.from({ length: cols }, (_, c) => names.filter((_, i) => col[i] === c).length);
  const maxColSum = Math.max(...colSum);
  const gap = (bottom - top) * 0.052;
  const maxGapTotal = Math.max(...colCount.map((c) => (c - 1) * gap));
  const scale = maxColSum > 0 ? (bottom - top - maxGapTotal) / maxColSum : 0;

  // 节点位置:列内自顶堆叠,余量均分为间隙;列宽可逐列指定(规范 sankey-2 中列 120/端列 115)
  const wOf = (c: number) => (nodeWFor ? nodeWFor(c, cols) : nodeW);
  const nodes: LaidNode[] = names.map((name, i) => ({
    name,
    value: value[i],
    col: col[i],
    x: left + ((right - left - wOf(col[i])) * col[i]) / Math.max(cols - 1, 1),
    y: 0,
    w: wOf(col[i]),
    h: Math.max(value[i] * scale, 4),
    colorIdx: i,
  }));
  for (let c = 0; c < cols; c++) {
    const inCol = nodes.filter((n) => n.col === c);
    const used = inCol.reduce((s, n) => s + n.h, 0);
    const gapC = inCol.length > 1 ? (bottom - top - used) / (inCol.length - 1) : 0;
    let y = top;
    for (const n of inCol.sort((a, b) => b.value - a.value)) { // 规范:大值在上
      n.y = y;
      y += n.h + gapC;
    }
  }

  // 流带(控制点 52%):堆叠序跟随对端节点纵向位置,避免与值排序的列错位交叉
  const outCursor = names.map(() => 0);
  const inCursor = names.map(() => 0);
  const syOf = new Map<number, number>();
  const tyOf = new Map<number, number>();
  const linksOfSource: number[][] = names.map(() => []);
  const linksOfTarget: number[][] = names.map(() => []);
  spec.links.forEach((l, li) => {
    linksOfSource[idx.get(l.from)!].push(li);
    linksOfTarget[idx.get(l.to)!].push(li);
  });
  names.forEach((_, i) => {
    for (const li of linksOfSource[i].slice().sort((a, b) => nodes[idx.get(spec.links[a].to)!].y - nodes[idx.get(spec.links[b].to)!].y)) {
      syOf.set(li, nodes[i].y + outCursor[i]);
      outCursor[i] += spec.links[li].value * scale;
    }
    for (const li of linksOfTarget[i].slice().sort((a, b) => nodes[idx.get(spec.links[a].from)!].y - nodes[idx.get(spec.links[b].from)!].y)) {
      tyOf.set(li, nodes[i].y + inCursor[i]);
      inCursor[i] += spec.links[li].value * scale;
    }
  });
  const links: LaidLink[] = spec.links.map((l, li) => {
    const f = idx.get(l.from)!;
    const t = idx.get(l.to)!;
    const fn = nodes[f];
    const tn = nodes[t];
    const sy1 = syOf.get(li)!;
    const ty1 = tyOf.get(li)!;
    const lh = l.value * scale;
    const x1 = fn.x + fn.w;
    const x2 = tn.x;
    const c1 = x1 + (x2 - x1) * 0.52;
    const c2 = x2 - (x2 - x1) * 0.52;
    const d = `M${r2(x1)} ${r2(sy1)}C${r2(c1)} ${r2(sy1)} ${r2(c2)} ${r2(ty1)} ${r2(x2)} ${r2(ty1)}` +
      `L${r2(x2)} ${r2(ty1 + lh)}C${r2(c2)} ${r2(ty1 + lh)} ${r2(c1)} ${r2(sy1 + lh)} ${r2(x1)} ${r2(sy1 + lh)}Z`;
    return { link: l, d, from: fn, to: tn, sy: sy1, ty: ty1, lh };
  });
  return { nodes, links, cols };
}

// 节点/数值双行标签(外置:左列尾端锚,右列起始锚,内列贴节点右侧)
// style: two=名称+数值两行;one=单行"名称 数值"(节点密);skip=该节点不标(极密)
function nodeLabel(parts: string[], name: string, value: number, x: number, yMid: number, anchor: 'start' | 'end', muted: boolean, style: 'two' | 'one' | 'skip'): void {
  if (style === 'skip') return;
  const fill = muted ? 'var(--d-muted)' : 'var(--d-ink)';
  if (style === 'one') {
    parts.push(
      `<text x="${r2(x)}" y="${r2(yMid + 4)}" text-anchor="${anchor}" font-size="11" fill="${fill}">${esc(trunc(name, 16))} <tspan fill="var(--d-muted)" style="${TAB}">${fmtFull(value)}</tspan></text>`,
    );
    return;
  }
  parts.push(`<text x="${r2(x)}" y="${r2(yMid - 3)}" text-anchor="${anchor}" font-size="13" fill="${fill}">${esc(trunc(name, 16))}</text>`);
  parts.push(`<text x="${r2(x)}" y="${r2(yMid + 13)}" text-anchor="${anchor}" font-size="11" fill="var(--d-muted)" style="${TAB}">${fmtFull(value)}</text>`);
}

// 按列节点间距决定标签形态:≥26px 两行,≥13px 单行,更密则隔一个标
function labelStyles(nodes: LaidNode[], cols: number): Map<LaidNode, 'two' | 'one' | 'skip'> {
  const m = new Map<LaidNode, 'two' | 'one' | 'skip'>();
  for (let c = 0; c < cols; c++) {
    const col = nodes.filter((n) => n.col === c).sort((a, b) => a.y - b.y);
    let minGap = Infinity;
    for (let i = 1; i < col.length; i++) minGap = Math.min(minGap, col[i].y - (col[i - 1].y + col[i - 1].h));
    const style: 'two' | 'one' | 'skip' = minGap >= 26 ? 'two' : minGap >= 13 ? 'one' : 'one';
    const stride = minGap >= 13 ? 1 : Math.max(1, Math.ceil(13 / Math.max(minGap, 3)));
    col.forEach((n, i) => m.set(n, style === 'two' ? 'two' : i % stride === 0 ? 'one' : 'skip'));
  }
  return m;
}

/**
 * Sankey flow diagram with weighted bands.
 */
export function renderSankey(spec: SankeySpec, o: RenderOpts): string {
  const mode = o.skin.rules.sankeyMode;
  if (mode === 'fund') return renderSankeyFund(spec, o);
  if (mode === 'pipeline') return renderSankeyPipeline(spec, o);
  return renderSankeyBasic(spec, o);
}

// 桑基图 1 · 基础款(规范 sankey-1,720×420):细节点(14×h rx4)+ 源色流带 .46 + 外置标签
function renderSankeyBasic(spec: SankeySpec, o: RenderOpts): string {
  const { width, height, version, skin } = o;
  const nodeW = width * 0.0194; // 14/720
  const { nodes, links, cols } = layoutSankey(spec, width * 0.1667, width * 0.8806, height * 0.119, height * 0.871, nodeW);

  const styles = labelStyles(nodes, cols);
  const parts: string[] = [card(width, height, true)];
  for (const l of links) {
    parts.push(`<path d="${l.d}" fill="${sVar(l.from.colorIdx % skin.series.length)}" fill-opacity="0.46"/>`);
  }
  for (const n of nodes) {
    parts.push(`<rect x="${r2(n.x)}" y="${r2(n.y)}" width="${r2(nodeW)}" height="${r2(n.h)}" rx="${r2(nodeW * 0.286)}" fill="${sVar(n.colorIdx % skin.series.length)}"/>`);
    const last = n.col === cols - 1;
    const st = styles.get(n) ?? 'two';
    if (n.col === 0) nodeLabel(parts, n.name, n.value, n.x - 12, n.y + n.h / 2, 'end', false, st);
    else if (last) nodeLabel(parts, n.name, n.value, n.x + nodeW + 12, n.y + n.h / 2, 'start', false, st);
    else nodeLabel(parts, n.name, n.value, n.x + nodeW + 10, n.y + n.h / 2, 'start', true, st);
  }
  return svgDoc(width, height, 'sankey', version, spec.title ?? 'sankey', spec, skin, parts.join(''));
}

// 桑基图 2 · Fund Allocation(规范 sankey-2,760×460):
// 盒节点(标签内置)+ 渐变流带 .38 + 表头(标题+右注)+ 表尾三统计
function renderSankeyFund(spec: SankeySpec, o: RenderOpts): string {
  const { width, height, version, skin } = o;
  const nodeW = width * 0.1513; // 115/760
  // 规范 sankey-2:端列节点 115/760,中列 120/760
  const { nodes, links } = layoutSankey(
    spec, width * 0.046, width * 0.934, height * 0.15, height * 0.83, nodeW,
    (col, cols) => (col === 0 || col === cols - 1 ? nodeW : width * 0.1579),
  );
  const k = skin.series.length;

  const { cols: fundCols } = { cols: 0 };
  void fundCols;
  const parts: string[] = [
    card(width, height, true),
    `<defs>${links.map((l, i) =>
      `<linearGradient id="sk-${i}" x1="0" x2="1"><stop stop-color="${sVar(l.from.colorIdx % k)}"/><stop offset="1" stop-color="${sVar(l.to.colorIdx % k)}"/></linearGradient>`).join('')}</defs>`,
  ];
  // 表头:标题 + 右注(unit)
  if (spec.title) parts.push(`<text x="${r2(width * 0.033)}" y="${r2(height * 0.067)}" font-size="18" font-weight="600" letter-spacing="-0.02em" fill="var(--d-ink)">${esc(trunc(spec.title, 40))}</text>`);
  if (spec.unit) parts.push(`<text x="${r2(width * 0.967)}" y="${r2(height * 0.067)}" text-anchor="end" font-size="12" fill="var(--d-muted)">${esc(trunc(spec.unit, 24))}</text>`);
  for (const l of links) {
    parts.push(`<path d="${l.d}" fill="url(#sk-${links.indexOf(l)})" fill-opacity="0.38"/>`);
  }
  for (const n of nodes) {
    const c = sVar(n.colorIdx % k);
    parts.push(`<rect x="${r2(n.x)}" y="${r2(n.y)}" width="${r2(n.w)}" height="${r2(n.h)}" rx="${r2(height * 0.0174)}" fill="${c}" fill-opacity="0.42" stroke="${c}" stroke-width="1.5"/>`);
    if (n.h >= 34) {
      parts.push(`<text x="${r2(n.x + n.w / 2)}" y="${r2(n.y + n.h / 2 - 3)}" text-anchor="middle" font-size="12" font-weight="700" fill="var(--d-ink)">${esc(trunc(n.name, 12))}</text>`);
      parts.push(`<text x="${r2(n.x + n.w / 2)}" y="${r2(n.y + n.h / 2 + 14)}" text-anchor="middle" font-size="11" fill="var(--d-muted)" style="${TAB}">${fmtFull(n.value)}</text>`);
    } else {
      nodeLabel(parts, n.name, n.value, n.x + n.w + 10, n.y + n.h / 2, 'start', true, 'two');
    }
  }
  // 表尾三统计:总流量 / 节点数 / 链接数
  const total = spec.links.filter((l) => !spec.links.some((m) => m.to === l.from)).reduce((s, l) => s + l.value, 0);
  const stats: [string, string][] = [
    ['TOTAL FLOW', fmtFull(total)],
    ['NODES', String(nodes.length)],
    ['LINKS', String(links.length)],
  ];
  stats.forEach(([k2, v], i) => {
    const x = i === 0 ? width * 0.033 : i === 1 ? width / 2 : width * 0.967;
    const anchor = i === 0 ? 'start' : i === 1 ? 'middle' : 'end';
    parts.push(`<text x="${r2(x)}" y="${r2(height * 0.879)}" text-anchor="${anchor}" font-size="10" letter-spacing="1" fill="var(--d-muted)">${k2}</text>`);
    parts.push(`<text x="${r2(x)}" y="${r2(height * 0.951)}" text-anchor="${anchor}" font-size="25" font-weight="700" fill="var(--d-ink)" style="${TAB}">${v}</text>`);
  });
  return svgDoc(width, height, 'sankey', version, spec.title ?? 'fund flows', spec, skin, parts.join(''));
}

// 桑基图 3 · Revenue Pipeline(规范 sankey-3,760×400):
// 细节点 + 源→目标渐变流带 + 中央渐隐面板显示管线总额(源头之和)
function renderSankeyPipeline(spec: SankeySpec, o: RenderOpts): string {
  const { width, height, version, skin } = o;
  const nodeW = width * 0.0184; // 14/760
  const { nodes, links, cols } = layoutSankey(spec, width * 0.1816, width * 0.8, height * 0.145, height * 0.8475, nodeW);
  const P = C_sankeyPipeline;
  // 规范 sankey-3:整图是一条 蓝→紫→玫红 的叙事渐变——
  //   节点按列取族色(源=蓝系 / 中列=靛紫系 / 汇=玫红系,列内自上而下轮换)
  //   流带拆两半共享双渐变:pIn(蓝→紫)走左半,pOut(紫→玫红)走右半,中央留给渐隐面板
  const famOf = (col: number): string[] =>
    col === 0 ? [P.blue, P['blue-deep'], P.indigo, P['indigo-deep']]
      : col === cols - 1 ? [P.rose, P.red, P.pink, P.orange]
        : [P.purple, P['indigo-deep'], P.indigo];
  const colSeq = new Map<number, string[]>();
  for (let c = 0; c < cols; c++) {
    colSeq.set(c, nodes.filter((n) => n.col === c).sort((a, b) => a.y - b.y).map((n) => n.name));
  }
  const nodeColor = (n: LaidNode): string => {
    const fam = famOf(n.col);
    return fam[(colSeq.get(n.col) ?? []).indexOf(n.name) % fam.length] ?? fam[0];
  };
  const midX = width / 2;

  const parts: string[] = [
    card(width, height, true),
    `<defs>` +
    `<linearGradient id="sk-in" x1="0" x2="1"><stop stop-color="${P.blue}"/><stop offset="1" stop-color="${P.purple}"/></linearGradient>` +
    `<linearGradient id="sk-out" x1="0" x2="1"><stop stop-color="${P.purple}"/><stop offset="1" stop-color="${P.rose}"/></linearGradient>` +
    // 渐隐面板用 var(--d-card):auto 模式下随系统明暗切换(硬编码会在暗色图上留白带)
    `<linearGradient id="sk-fade" x1="0" x2="1"><stop stop-color="transparent"/><stop offset=".32" stop-color="var(--d-card)"/><stop offset=".68" stop-color="var(--d-card)"/><stop offset="1" stop-color="transparent"/></linearGradient>` +
    `</defs>`,
  ];
  // 流带两半:源端 → 中缝左沿(sk-in),中缝右沿 → 目标端(sk-out);
  // 中缝 = 中央面板各内缩 0.0395w(规范 760 宽下为 350/410)
  const xa = midX - width * 0.0395;
  const xb = midX + width * 0.0395;
  const half = (x1: number, x2: number, y1: number, y2: number, lh: number, fill: string): string => {
    const c1 = x1 + (x2 - x1) * 0.52;
    const c2 = x2 - (x2 - x1) * 0.52;
    return `<path d="M${r2(x1)} ${r2(y1)}C${r2(c1)} ${r2(y1)} ${r2(c2)} ${r2(y2)} ${r2(x2)} ${r2(y2)}` +
      `L${r2(x2)} ${r2(y2 + lh)}C${r2(c2)} ${r2(y2 + lh)} ${r2(c1)} ${r2(y1 + lh)} ${r2(x1)} ${r2(y1 + lh)}Z" fill="${fill}" fill-opacity="0.34"/>`;
  };
  for (const l of links) {
    parts.push(half(l.from.x + nodeW, xa, l.sy, l.ty, l.lh, 'url(#sk-in)'));
    parts.push(half(xb, l.to.x, l.sy, l.ty, l.lh, 'url(#sk-out)'));
  }
  for (const n of nodes) {
    parts.push(`<rect x="${r2(n.x)}" y="${r2(n.y)}" width="${r2(nodeW)}" height="${r2(n.h)}" rx="${r2(nodeW * 0.286)}" fill="${nodeColor(n)}"/>`);
    if (n.x < midX) nodeLabel(parts, n.name, n.value, n.x - 12, n.y + n.h / 2, 'end', false, 'two');
    else nodeLabel(parts, n.name, n.value, n.x + nodeW + 12, n.y + n.h / 2, 'start', false, 'two');
  }
  // 中央渐隐面板:总额(源头节点之和)+ N sources · M sinks
  const panelW = width * 0.25;
  const hasIn = new Set(spec.links.map((l) => l.to));
  const sources = nodes.filter((n) => !hasIn.has(n.name));
  const sinks = nodes.filter((n) => !spec.links.some((l) => l.from === n.name));
  const total = sources.reduce((s, n) => s + n.value, 0);
  parts.push(`<rect x="${r2(midX - panelW / 2)}" y="${r2(height * 0.105)}" width="${r2(panelW)}" height="${r2(height * 0.8125)}" fill="url(#sk-fade)"/>`); // 规范:42..367(0.8125h)
  parts.push(`<text x="${r2(midX)}" y="${r2(height * 0.495)}" text-anchor="middle" font-size="12" fill="var(--d-muted)">${esc(trunc(spec.title ?? 'Total booked', 20))}</text>`); // 规范 y=198/400
  parts.push(`<text x="${r2(midX)}" y="${r2(height * 0.59)}" text-anchor="middle" font-size="34" font-weight="700" fill="var(--d-ink)" style="${TAB}">${fmtFull(total)}</text>`); // 规范 y=236/400
  parts.push(`<text x="${r2(midX)}" y="${r2(height * 0.645)}" text-anchor="middle" font-size="12" fill="var(--d-muted)">${sources.length} sources · ${sinks.length} routes</text>`); // 规范 y=258/400
  return svgDoc(width, height, 'sankey', version, spec.title ?? 'revenue pipeline', spec, skin, parts.join(''));
}
