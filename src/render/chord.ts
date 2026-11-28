// 和弦图:一圈弧 + 弧与弧之间的带子。
//
// 为什么自己画:ECharts 的和弦图要靠自定义系列(renderItem 函数),
// 而 URL 里传的是纯 JSON —— 带不了函数。桑基的圆形摆法 SSR 也不认
// (nodeAlign:'circular' 在服务端渲染里被忽略,出来还是横的)。
//
// 参数:links=<源>,<目标>,<值>;<源>,<目标>,<值>…
//   例:/draw/chord?links=Rock,Pop,28;Pop,Metal,12
//
// 画法(经典的和弦图):
//   每个节点占一段圆弧,弧长 ∝ 它的总流量;
//   每条连接从源弧上切一段、在目标弧上切一段,两段之间拉一条带子。

import { esc } from './svg.js';

export interface ChordLink {
  from: string;
  to: string;
  value: number;
}

export interface ChordOpts {
  width?: number;
  height?: number;
  /** 标题(画在左上) */
  title?: string;
  /** 弧的粗细占半径的比例 */
  thickness?: number;
}

const PALETTE = ['#34D399', '#F87171', '#A78BFA', '#22D3EE', '#60A5FA', '#FB923C', '#FACC15', '#FB7185'];

const r2 = (v: number): number => Math.round(v * 100) / 100;

/** links= 串 → 连接列表 */
export function parseChordLinks(raw: string): ChordLink[] {
  const out: ChordLink[] = [];
  for (const part of raw.split(';')) {
    const f = part.split(',').map((s) => s.trim());
    if (f.length < 3) continue;
    const value = Number(f[2]);
    if (!f[0] || !f[1] || !Number.isFinite(value) || value <= 0) continue;
    out.push({ from: f[0], to: f[1], value });
  }
  return out;
}

/** 和弦图 → SVG */
export function renderChord(links: ChordLink[], opts: ChordOpts = {}): string {
  const width = opts.width ?? 560;
  const height = opts.height ?? 460;
  if (!links.length) return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}"></svg>`;

  // 节点:名字 → 总流量(进 + 出)
  const nodes = new Map<string, number>();
  for (const l of links) {
    nodes.set(l.from, (nodes.get(l.from) ?? 0) + l.value);
    nodes.set(l.to, (nodes.get(l.to) ?? 0) + l.value);
  }
  const names = [...nodes.keys()].sort();
  const total = [...nodes.values()].reduce((a, b) => a + b, 0) || 1;

  const titleH = opts.title ? 34 : 12;
  const cx = width / 2;
  const cy = titleH + (height - titleH) / 2;
  const R = Math.min(width, height - titleH) / 2 - 34;   // 弧的中线半径
  const maxArc = Math.min(26, R * 0.16);                 // 最粗的一段弧
  const maxV = Math.max(...nodes.values());           // 最大的那个节点(比例尺的基准)

  // 每个节点的弧:角度范围 + 颜色 + 在弧上占的「宽度」(按流量)
  const arcs = new Map<string, { a0: number; a1: number; w: number; color: string }>();
  let angle = -Math.PI / 2;                               // 从十二点开始
  const gap = 0.03;                                       // 节点之间的缝
  names.forEach((name, i) => {
    const v = nodes.get(name) ?? 0;
    const span = (v / total) * Math.PI * 2 - gap;
    const w = Math.max(3, (v / maxV) * maxArc);
    arcs.set(name, { a0: angle + gap / 2, a1: angle + gap / 2 + span, w, color: PALETTE[i % PALETTE.length] });
    angle += (v / total) * Math.PI * 2;
  });

  const p = (a: number, r: number): [number, number] => [cx + r * Math.cos(a), cy + r * Math.sin(a)];

  const parts: string[] = [];

  // 带子(先画,弧压在上面)
  // 每个节点的弧分成两半:出边那半、进边那半;各条连接在里面按值切。
  const outSum = new Map<string, number>();
  const inSum = new Map<string, number>();
  for (const l of links) {
    outSum.set(l.from, (outSum.get(l.from) ?? 0) + l.value);
    inSum.set(l.to, (inSum.get(l.to) ?? 0) + l.value);
  }
  const usedOut = new Map<string, number>();
  const usedIn = new Map<string, number>();

  for (const l of links) {
    const a = arcs.get(l.from);
    const b = arcs.get(l.to);
    if (!a || !b) continue;
    const oTotal = outSum.get(l.from) ?? 1;
    const iTotal = inSum.get(l.to) ?? 1;
    // 源弧上:出边那半从弧头开始,按值切
    const outPart = (a.a1 - a.a0) * (oTotal / (nodes.get(l.from) ?? 1));
    const inPart = (b.a1 - b.a0) * (iTotal / (nodes.get(l.to) ?? 1));
    const o0 = usedOut.get(l.from) ?? 0;
    const i0 = usedIn.get(l.to) ?? 0;
    usedOut.set(l.from, o0 + l.value);
    usedIn.set(l.to, i0 + l.value);

    const s0 = a.a0 + (o0 / oTotal) * outPart;
    const s1 = a.a0 + ((o0 + l.value) / oTotal) * outPart;
    const t0 = b.a0 + (b.a1 - b.a0 - inPart) + (i0 / iTotal) * inPart;
    const t1 = b.a0 + (b.a1 - b.a0 - inPart) + ((i0 + l.value) / iTotal) * inPart;

    // 带子的粗细:这一条连接的值占全图的比例(弧的粗细也是同一个比例尺,
    // 所以带子在两头一样宽 —— 经典和弦图就是这样)
    const hw = ((l.value / maxV) * maxArc) / 2;
    const arcTo = (from: number, to: number, r: number): string => {
      const large = Math.abs(to - from) > Math.PI ? 1 : 0;
      const sweep = to > from ? 1 : 0;
      const [x, y] = p(to, r);
      return `A${r2(r)} ${r2(r)} 0 ${large} ${sweep} ${r2(x)} ${r2(y)}`;
    };
    const [s0x, s0y] = p(s0, R + hw);
    const [t0x, t0y] = p(t0, R + hw);
    const [s1x, s1y] = p(s1, R - hw);
    const path =
      `M${r2(s0x)} ${r2(s0y)}` +
      arcTo(s0, s1, R + hw) +                       // 源弧上那一段
      `Q${r2(cx)} ${r2(cy)} ${r2(t0x)} ${r2(t0y)}` + // 外沿:从源到目标(往圆心鼓)
      arcTo(t0, t1, R + hw) +                       // 目标弧上那一段
      `Q${r2(cx)} ${r2(cy)} ${r2(s1x)} ${r2(s1y)}` + // 内沿:从目标回源
      arcTo(s1, s0, R - hw) +
      'Z';
    parts.push(
      `<path d="${path}" fill="${a.color}" fill-opacity="0.4" data-from="${esc(l.from)}" data-to="${esc(l.to)}"` +
      ` data-tip="${esc(`${l.from} → ${l.to} · ${l.value}`)}"/>`,
    );
  }

  // 弧:粗一点的圆弧段(用 stroke 画 —— 那就是弦图里的「弦」)
  // 节点是一组(弧 + 名字):带 data-node,点一下高亮它与相连的带子
  for (const [name, a] of arcs) {
    const [x0, y0] = p(a.a0, R);
    const [x1, y1] = p(a.a1, R);
    const large = a.a1 - a.a0 > Math.PI ? 1 : 0;
    const total = nodes.get(name) ?? 0;
    const mid = (a.a0 + a.a1) / 2;
    const [lx, ly] = p(mid, R + a.w / 2 + 14);
    const anchor = Math.cos(mid) > 0.25 ? 'start' : Math.cos(mid) < -0.25 ? 'end' : 'middle';
    parts.push(
      `<g data-node="${esc(name)}" data-tip="${esc(`${name} · ${total}`)}">` +
      `<path d="M${r2(x0)} ${r2(y0)}A${r2(R)} ${r2(R)} 0 ${large} 1 ${r2(x1)} ${r2(y1)}" fill="none" stroke="${a.color}" stroke-width="${r2(a.w)}" stroke-linecap="butt"/>` +
      `<text x="${r2(lx)}" y="${r2(ly + 4)}" text-anchor="${anchor}" font-size="12" fill="#D4D4D8">${esc(name)}</text>` +
      `</g>`,
    );
  }

  const titleSvg = opts.title
    ? `<text x="16" y="24" font-size="15" font-weight="500" fill="#FAFAFA">${esc(opts.title)}</text>`
    : '';

  return (
    `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" ` +
    `font-family="ui-sans-serif,-apple-system,BlinkMacSystemFont,'Segoe UI','PingFang SC','Hiragino Sans GB','Microsoft YaHei',sans-serif" ` +
    `role="img" aria-label="chord diagram">` +
    // 选中一个节点:别的淡下去,连着的带子留着
    `<style>#am.hl g[data-node]{opacity:.22}#am.hl g[data-node].on{opacity:1}` +
    `#am.hl path[data-from]{opacity:.08}#am.hl path[data-from].on{opacity:.9}</style>` +
    `<rect width="${width}" height="${height}" fill="#0E0F11"/>` +
    titleSvg +
    `<g id="am">${parts.join('')}</g>` +
    `</svg>`
  );
}
