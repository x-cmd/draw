// /draw/seq —— 时序图:参与方在上一行,消息一行一条,时间往下走。
//
// 模型(和 archmap 同一套 n= 语法;e= 里的边按 URL 里的顺序就是时间顺序):
//   n=id;type;label[;sub][;pos]   参与方(位置一般写 r0c0 / r0c1 / …)
//   e=from;to[;label][;dash]       一条消息;URL 里的先后就是发生的先后
//   b=label;id id …                框:把一组参与方圈成一条「泳道」(可写多次)
//
// 画法:参与方一行,下面拖出生命线;每条消息在下一行,从发方生命线画一条箭头到收方,
// 收方在这段时间画一根激活条(细竖条)。回信写 dash → 虚线箭头。
import { ApiError } from '../specs/index.js';
import type { ArchBoundary, ArchNode } from './archmap.js';
import { packGrid, parseBoundaries, parseNodes } from './archmap.js';
import { resolveSkin } from '../styles/index.js';
import { clampInt, schemeParam, type DrawResult } from './query.js';
import { esc, r2, svgDoc, textW } from './svg.js';

const PAD = 40;
const HEADER_H = 56;      // 参与方标题盒高
const MSG_GAP = 78;       // 两条消息之间的行距(要给分支框的标签留位置)
const ARROW = 10;         // 箭头长度
const LABEL_FS = 12;
const LANE_TOP = 30;      // 有 b= 时,给泳道标签留出来的那一行

interface Msg { from: string; to: string; label?: string; dash: boolean }

/** 一个分支框:kind=alt|else|opt|loop|par|break,label=守卫文字,start/end=消息下标(含两端) */
interface Frag { kind: string; label: string; start: number; end: number }

/** f=kind;label;start;end —— 分支框罩住第 start..end 条消息(含两端) */
function parseFrags(raw: string[], msgCount: number): Frag[] {
  return raw.map((v, i) => {
    const f = v.split(';').map((x) => x.trim());
    if (f.length < 4) {
      throw new ApiError(400, `"f" #${i + 1} must be "kind;label;start;end". Example: f=alt;ok;0;2`);
    }
    const kind = f[0].toLowerCase();
    if (!['alt', 'else', 'opt', 'loop', 'par', 'break'].includes(kind)) {
      throw new ApiError(400, `"f" #${i + 1}: kind must be one of alt, else, opt, loop, par, break`);
    }
    const start = Number(f[2]);
    const end = Number(f[3]);
    if (!Number.isInteger(start) || !Number.isInteger(end) || start < 0 || end < start || end >= msgCount) {
      throw new ApiError(400, `"f" #${i + 1}: start/end must be message indexes within 0..${msgCount - 1}`);
    }
    return { kind, label: f[1], start, end };
  });
}

/** e=from;to[;label][;dash] —— 按 URL 里的顺序就是时间顺序 */
function parseMessages(raw: string[]): Msg[] {
  return raw.map((v, i) => {
    const f = v.split(';').map((x) => x.trim());
    if (f.length < 2 || !f[0] || !f[1]) {
      throw new ApiError(400, `"e" #${i + 1} must be "from;to[;label][;dash]". Example: e=app;worker;GET /draw?type=pie`);
    }
    const last = f[f.length - 1];
    const dash = f.length > 2 && last.toLowerCase() === 'dash';
    const rest = dash ? f.slice(0, -1) : f;
    return { from: rest[0], to: rest[1], label: rest[2] || undefined, dash };
  });
}

/** 参与方标题盒:和 archmap 一样的底子,但自己画(时序图里它是「头顶」不是方块) */
function headerBox(x: number, y: number, w: number, label: string, sub: string | undefined, color: number, interactive = false, id = ''): string {
  const c = color >= 0 ? `var(--d-s${color + 1})` : 'var(--d-muted)';
  const fill = color >= 0 ? c : 'var(--d-muted)';
  const labelY = sub ? y + 26 : y + HEADER_H / 2 + 5;
  const ia = interactive ? ` data-node="${esc(id)}" data-tip="${esc(sub ? `${label} · ${sub}` : label)}" tabindex="0"` : '';
  return (
    `<g${ia}>` +
    `<rect x="${r2(x)}" y="${r2(y)}" width="${r2(w)}" height="${HEADER_H}" rx="10"` +
    ` fill="${fill}" fill-opacity="${color >= 0 ? 0.12 : 0.06}" stroke="${c}" stroke-opacity="0.55" stroke-width="1.2"/>` +
    `<text x="${r2(x + w / 2)}" y="${r2(labelY)}" text-anchor="middle" font-size="14" font-weight="600" fill="var(--d-ink)">${esc(label)}</text>` +
    (sub ? `<text x="${r2(x + w / 2)}" y="${r2(y + 44)}" text-anchor="middle" font-size="11" fill="var(--d-muted)">${esc(sub)}</text>` : '') +
    `</g>`
  );
}

export interface SeqOpts {
  nodes: ArchNode[];
  msgs: Msg[];
  frags: Frag[];
  /** b= 画出来的泳道(可以有多条) */
  boundaries: ArchBoundary[];
  /** 原始 URL 查询串:角标直链 explore 落地页用 */
  tagQuery?: string;
  title?: string;
  interactive: boolean;
  version: number;
  cacheControl: string;
  skin: ReturnType<typeof resolveSkin>;
  minW?: number;
  minH?: number;
}

/**
 * 渲染时序图。
 */
export function renderSeqCore(o: SeqOpts): DrawResult {
  const { placed } = packGrid(o.nodes, 0, { gapX: 56, gapY: 40, pad: PAD, sizeOf: (n) => {
    const w = Math.max(150, textW(n.label, 14) + 44, n.sub ? textW(n.sub, 11) + 44 : 0);
    return { w: Math.min(w, 320), h: HEADER_H };
  } });
  const titleH = o.title ? 40 : 0;
  if (titleH) for (const p of placed) p.box.y += titleH; // 有标题就往下挪一格,别压住
  // 有泳道就整体往下挪一行,给泳道标签腾地方(所有参与方一起挪,标题行才对齐)
  if (o.boundaries.length) for (const p of placed) p.box.y += LANE_TOP;
  const byId = new Map(placed.map((p) => [p.id, p]));
  for (const m of o.msgs) {
    if (!byId.has(m.from)) throw new ApiError(400, `message references unknown participant "${m.from}"`);
    if (!byId.has(m.to)) throw new ApiError(400, `message references unknown participant "${m.to}"`);
  }
  // 参与方的中心 x(生命线所在)
  const cxOf = (id: string): number => {
    const b = byId.get(id)!.box;
    return b.x + b.w / 2;
  };
  const headerBottom = Math.max(...placed.map((p) => p.box.y + p.box.h));
  const rowY = (i: number): number => headerBottom + 58 + i * MSG_GAP;

  let width = Math.max(320, ...placed.map((p) => p.box.x + p.box.w + PAD));
  let height = rowY(Math.max(0, o.msgs.length - 1)) + 34 + PAD;
  width = Math.max(width, o.minW ?? 0);
  height = Math.max(height, o.minH ?? 0);

  const parts: string[] = [];

  // 生命线:从标题盒底到最后一条消息
  const lastY = o.msgs.length ? rowY(o.msgs.length - 1) : headerBottom;

  // 泳道(b=):把一组参与方圈起来 —— 虚线框 + 框内左上角的标签。
  // 框从参与方标题盒上面开始(那一行留给标签),一直到生命线底下。
  const laneSvg = (): string => {
    const out: string[] = [];
    for (const b of o.boundaries) {
      const ms = b.ids.map((id) => byId.get(id)!).filter(Boolean);
      if (!ms.length) continue;
      const x0 = Math.min(...ms.map((m) => m.box.x)) - 16;
      const x1 = Math.max(...ms.map((m) => m.box.x + m.box.w)) + 16;
      const y0 = Math.min(...ms.map((m) => m.box.y)) - LANE_TOP;
      const y1 = Math.max(lastY + 18, ...ms.map((m) => m.box.y + m.box.h));
      const label = b.label.toUpperCase();
      const lw = textW(label, 10) + b.label.length * 1.2 + 20;
      out.push(
        `<g data-boundary="${esc(b.ids.join(' '))}">` +
        `<rect x="${r2(x0)}" y="${r2(y0)}" width="${r2(x1 - x0)}" height="${r2(y1 - y0)}" rx="12" fill="none" stroke="var(--d-border)" stroke-width="1.2" stroke-dasharray="7 5"/>` +
        `<rect x="${r2(x0 + 10)}" y="${r2(y0 + 5)}" width="${r2(lw)}" height="19" rx="6" fill="var(--d-card)"/>` +
        `<text x="${r2(x0 + 10 + lw / 2)}" y="${r2(y0 + 18)}" text-anchor="middle" font-size="10" font-weight="600" letter-spacing="1.2" fill="var(--d-faint)">${esc(label)}</text>` +
        `</g>`,
      );
    }
    return out.join('');
  };
  parts.push(laneSvg());

  for (const p of placed) {
    const x = cxOf(p.id);
    parts.push(
      `<line x1="${r2(x)}" y1="${r2(p.box.y + p.box.h)}" x2="${r2(x)}" y2="${r2(lastY + 18)}" stroke="var(--d-border)" stroke-width="1.4"/>`,
    );
  }

  // 激活条:收到消息的一方,到它下一次发消息为止
  const act = new Map<string, { from: number; to: number }>();
  o.msgs.forEach((m, i) => {
    const cur = act.get(m.to);
    if (!cur) act.set(m.to, { from: i, to: rowY(i) + 16 });
    else cur.to = rowY(i) + 16;
  });

  // 消息
  o.msgs.forEach((m, i) => {
    const y = rowY(i);
    const x1 = cxOf(m.from);
    const x2 = cxOf(m.to);
    const dir = x2 >= x1 ? 1 : -1;
    const ax = x2 - dir * ARROW;
    const stroke = m.dash ? 'var(--d-faint)' : 'var(--d-muted)';
    const dash = m.dash ? ' stroke-dasharray="5 4"' : '';
    const ia = o.interactive ? ` data-from="${esc(m.from)}" data-to="${esc(m.to)}"` : '';
    parts.push(
      `<path d="M${r2(x1)} ${r2(y)}L${r2(ax)} ${r2(y)}" fill="none" stroke="${stroke}" stroke-width="1.4"${dash}${ia}/>`,
      `<path d="M${r2(x2)} ${r2(y)}L${r2(ax)} ${r2(y)}L${r2(x2 - dir * 4)} ${r2(y - 4)}M${r2(x2)} ${r2(y)}L${r2(x2 - dir * 4)} ${r2(y + 4)}" fill="none" stroke="${stroke}" stroke-width="1.4"${dash}/>`,
    );
    if (m.label) {
      const w = textW(m.label, LABEL_FS) + 14;
      const lx = (x1 + x2) / 2;
      parts.push(
        `<rect x="${r2(lx - w / 2)}" y="${r2(y - LABEL_FS - 12)}" width="${r2(w)}" height="${LABEL_FS + 7}" rx="5" fill="var(--d-card)" stroke="var(--d-border)" stroke-width="1"/>`,
        `<text x="${r2(lx)}" y="${r2(y - 7)}" text-anchor="middle" font-size="${LABEL_FS}" fill="var(--d-text)">${esc(m.label)}</text>`,
      );
    }
  });

  // 激活条画在消息之上(盖住生命线)
  for (const [id, r] of act) {
    const x = cxOf(id);
    parts.push(
      `<rect x="${r2(x - 3)}" y="${r2(rowY(r.from) - 12)}" width="6" height="${r2(r.to - rowY(r.from) + 24)}" rx="3" fill="var(--d-ink)" fill-opacity="0.85"/>`,
    );
  }

  // 分支框(alt / else / opt / loop / par / break):
  // 一个 alt 后面连续的 else 归成一组,共用一个外框,中间一条虚线分开两支。
  const fragSvg = (): string => {
    if (!o.frags.length) return '';
    const groups: { frags: Frag[] }[] = [];
    for (const f of o.frags) {
      const last = groups[groups.length - 1];
      const join = last && ((last.frags[0].kind === 'alt' && f.kind === 'else') || (last.frags[0].kind !== 'alt' && f.kind === last.frags[0].kind && f.kind !== 'else'));
      if (join) last.frags.push(f);
      else groups.push({ frags: [f] });
    }
    const out: string[] = [];
    for (const g of groups) {
      const first = g.frags[0];
      const lastF = g.frags[g.frags.length - 1];
      const rows: number[] = [];
      for (let i = first.start; i <= lastF.end; i++) rows.push(i);
      const xs = rows.flatMap((i) => [cxOf(o.msgs[i].from), cxOf(o.msgs[i].to)]);
      const x0 = Math.min(...xs) - 18;
      const x1 = Math.max(...xs) + 18;
      const y0 = rowY(first.start) - 50;
      const y1 = rowY(lastF.end) + 24;
      out.push(
        `<rect x="${r2(x0)}" y="${r2(y0)}" width="${r2(x1 - x0)}" height="${r2(y1 - y0)}" rx="8" fill="var(--d-muted)" fill-opacity="0.06" stroke="var(--d-border)" stroke-width="1.2"/>`,
      );
      // 标签:alt [ok] / else [fail] / loop [each]
      g.frags.forEach((f, i) => {
        const text = f.label ? `${f.kind} [${f.label}]` : f.kind;
        const w = textW(text, 10.5) + 12;
        const lx = x0 + 12;
        // 第一支的标签贴在框顶;后面的支(else)贴在分隔线上
        const ly = i === 0 ? y0 + 14 : rowY(f.start) - 34 + 4;
        if (i > 0) {
          const dy = rowY(f.start) - 34;
          out.push(
            `<line x1="${r2(x0)}" y1="${r2(dy)}" x2="${r2(x1)}" y2="${r2(dy)}" stroke="var(--d-border)" stroke-width="1.2" stroke-dasharray="5 4"/>`,
          );
        }
        out.push(
          `<rect x="${r2(lx - 6)}" y="${r2(ly - 11)}" width="${r2(w)}" height="17" rx="5" fill="var(--d-card)" stroke="var(--d-border)" stroke-width="1"/>`,
          `<text x="${r2(lx)}" y="${r2(ly + 1)}" font-size="10.5" font-weight="600" letter-spacing="0.4" fill="var(--d-muted)">${esc(text)}</text>`,
        );
      });
    }
    return out.join('');
  };

  const titleSvg = o.title
    ? `<text x="${PAD}" y="${PAD + 16}" font-size="18" font-weight="600" letter-spacing="-0.02em" fill="var(--d-ink)">${esc(o.title)}</text>`
    : '';
  const headSvg = placed.map((p) => headerBox(p.box.x, p.box.y, p.box.w, p.label, p.sub, p.color, o.interactive, p.id)).join('');
  const spec = { type: 'seq', title: o.title, participants: o.nodes, messages: o.msgs };
  const svg = svgDoc(
    width, height, 'seq', o.version,
    o.title ?? `sequence diagram, ${o.msgs.length} messages`,
    spec, o.skin,
    titleSvg + headSvg + fragSvg() + parts.join(''),
    o.tagQuery, 'seq',
  );
  return { svg, version: o.version, cacheControl: o.cacheControl };
}

/**
 * `/draw/seq` 入口:GET ?n=…&e=…(n= 参与方,e= 消息,顺序即时间)。
 */
export function renderSeqFromUrl(url: URL, interactive = false): DrawResult {
  const params = url.searchParams;
  const nRaw = params.getAll('n');
  if (!nRaw.length) {
    throw new ApiError(400, `at least one participant is required. Example: /draw/seq?n=app;fe;Your app;r0c0&n=worker;be;Worker;r0c1&e=app;worker;GET /draw?type=pie`);
  }
  const nodes = parseNodes(nRaw);
  const seen = new Set<string>();
  for (const n of nodes) {
    if (seen.has(n.id)) throw new ApiError(400, `duplicate participant id "${n.id}"`);
    seen.add(n.id);
  }
  const msgs = parseMessages(params.getAll('e'));
  const frags = parseFrags(params.getAll('f'), msgs.length);
  const boundaries = parseBoundaries(params.getAll('b'), seen);
  const v = parseInt(params.get('v') ?? '1', 10) || 1;
  const skin = resolveSkin('sankey', params.get('t'), schemeParam(params));
  return renderSeqCore({
    nodes, msgs, frags, boundaries, tagQuery: url.search,
    title: params.get('title')?.trim() || undefined,
    interactive,
    version: v,
    cacheControl: 'public, max-age=300',
    skin,
    minW: clampInt(params, 'w', 0, 200, 2400),
    minH: clampInt(params, 'h', 0, 140, 2400),
  });
}
