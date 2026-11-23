// /draw/requirement —— 需求图(requirementDiagram):需求与要素,边上写着关系。
//
// 需求盒子里是一张字段表(id / text / risk / verifymethod),要素盒子里是 type。
// 风险要看得见 —— 盒子上角挂一个徽章,颜色走皮肤色板(不是写死的红)。
//
// 参数语法:
//   req=<name>|<id>|<text>|<risk>|<verifymethod>   一条需求
//   el=<name>|<type>                              一个要素
//   rel=<from>|<to>|<type>                        一条关系(satisfies/verifies/…)
//   title=<标题>
import { ApiError } from '../specs/index.js';
import { resolveVersion } from '../version.js';
import { resolveSkin } from '../styles/index.js';
import { card } from '../theme.js';
import { clampInt, schemeParam, type DrawResult } from './query.js';
import { esc, r2, sVar, svgDoc, subtitleBlock, textW, titleBlock, trunc } from './svg.js';

const PAD = 24;
const BOX_W = 260;          // 盒子的自然宽
const BOX_MIN_W = 190;
const BOX_GAP_X = 110;      // 列间距(边与标签都走这里 —— 窄了就挤)
const BOX_GAP_Y = 66;       // 行间距
const HEAD_H = 34;          // 盒子的标题条高
const ROW_H = 20;           // 一行字段的高
const ROW_TOP = HEAD_H + 18;
const BADGE = 22;           // 风险徽章的边长
const N_EXAMPLE = 'req=test_req|1|the test text.|high|test&el=test_entity|simulation&rel=test_entity|test_req|satisfies';

/** 风险等级 */
export type RequirementRisk = 'high' | 'medium' | 'low';
export const RISKS: RequirementRisk[] = ['high', 'medium', 'low'];

/** 关系种类(认识的几种;别的也照画,只是不特别对待) */
export const REL_TYPES = ['satisfies', 'verifies', 'copies', 'derives'] as const;

/** 一条需求 */
export interface RequirementNode {
  name: string;
  /** 需求号 */
  id?: string;
  /** 需求正文 */
  text?: string;
  /** 风险等级 */
  risk?: RequirementRisk;
  /** 验证方法 */
  verifymethod?: string;
}

/** 一个要素 */
export interface RequirementElement {
  name: string;
  /** 要素类型 */
  type?: string;
}

/** 一条关系 */
export interface RequirementRel {
  from: string;
  to: string;
  /** 关系类型(satisfies / verifies / copies / derives / …) */
  type: string;
}

/** 需求图的规格 */
export interface RequirementSpec {
  title?: string;
  subtitle?: string;
  reqs: RequirementNode[];
  els: RequirementElement[];
  rels: RequirementRel[];
}

function bad(detail: string): never {
  throw new ApiError(400, `${detail} Example: /draw/requirement?${N_EXAMPLE}`);
}

/** 风险等级:认 high/medium/low,别的当 low(但不静默 —— 只是不强调) */
function riskOf(raw: string): RequirementRisk | undefined {
  const t = raw.trim().toLowerCase();
  if (!t) return undefined;
  if ((RISKS as string[]).includes(t)) return t as RequirementRisk;
  return undefined;
}

/** 规格的 JSON 形态 → 规格 */
export function parseRequirementSpec(raw: string): RequirementSpec {
  let obj: unknown;
  try {
    obj = JSON.parse(raw);
  } catch {
    bad(`requirement spec must be JSON, got ${JSON.stringify(raw.slice(0, 60))}`);
  }
  const o = (obj ?? {}) as Partial<RequirementSpec>;
  const reqs = Array.isArray(o.reqs) ? o.reqs : [];
  const els = Array.isArray(o.els) ? o.els : [];
  if (!reqs.length && !els.length) bad('requirement spec needs at least one requirement or element');
  return {
    ...(typeof o.title === 'string' && o.title.trim() ? { title: o.title.trim() } : {}),
    ...(typeof o.subtitle === 'string' && o.subtitle.trim() ? { subtitle: o.subtitle.trim() } : {}),
    reqs: reqs.map((r, i) => {
      const name = String((r as RequirementNode).name ?? '').trim();
      if (!name) bad(`req #${i + 1}: name is required`);
      const risk = riskOf(String((r as RequirementNode).risk ?? ''));
      return {
        name,
        ...((r as RequirementNode).id !== undefined && String((r as RequirementNode).id).trim() ? { id: String((r as RequirementNode).id).trim() } : {}),
        ...((r as RequirementNode).text !== undefined && String((r as RequirementNode).text).trim() ? { text: String((r as RequirementNode).text).trim() } : {}),
        ...(risk ? { risk } : {}),
        ...((r as RequirementNode).verifymethod !== undefined && String((r as RequirementNode).verifymethod).trim()
          ? { verifymethod: String((r as RequirementNode).verifymethod).trim() } : {}),
      };
    }),
    els: els.map((e, i) => {
      const name = String((e as RequirementElement).name ?? '').trim();
      if (!name) bad(`element #${i + 1}: name is required`);
      return {
        name,
        ...((e as RequirementElement).type !== undefined && String((e as RequirementElement).type).trim()
          ? { type: String((e as RequirementElement).type).trim() } : {}),
      };
    }),
    rels: (Array.isArray(o.rels) ? o.rels : []).map((r, i) => {
      const from = String((r as RequirementRel).from ?? '').trim();
      const to = String((r as RequirementRel).to ?? '').trim();
      const type = String((r as RequirementRel).type ?? '').trim();
      if (!from || !to) bad(`relation #${i + 1}: from and to are required`);
      return { from, to, type: type || 'relates' };
    }),
  };
}

/** URL 参数 → 规格 */
export function requirementSpecFromParams(params: URLSearchParams): RequirementSpec {
  const reqs = params.getAll('req').filter((v) => v.trim() !== '').map((v, i) => {
    const f = v.split('|').map((x) => x.trim());
    if (f.length < 2) bad(`"req" #${i + 1} must be "name|id|text|risk|verifymethod", got ${JSON.stringify(v)}`);
    const name = f[0];
    if (!name) bad(`"req" #${i + 1}: name is required`);
    const risk = riskOf(f[3] ?? '');
    return {
      name,
      ...(f[1] ? { id: f[1] } : {}),
      ...(f[2] ? { text: f[2] } : {}),
      ...(risk ? { risk } : {}),
      ...(f[4] ? { verifymethod: f[4] } : {}),
    };
  });
  const els = params.getAll('el').filter((v) => v.trim() !== '').map((v, i) => {
    const f = v.split('|').map((x) => x.trim());
    if (!f[0]) bad(`"el" #${i + 1}: name is required`);
    return { name: f[0], ...(f[1] ? { type: f[1] } : {}) };
  });
  if (!reqs.length && !els.length) {
    bad(`at least one "req" or "el" is required (e.g. req=test_req|1|the test text.|high|test)`);
  }
  const known = new Set([...reqs.map((r) => r.name), ...els.map((e) => e.name)]);
  const rels = params.getAll('rel').filter((v) => v.trim() !== '').map((v, i) => {
    const f = v.split('|').map((x) => x.trim());
    if (f.length < 2) bad(`"rel" #${i + 1} must be "from|to|type", got ${JSON.stringify(v)}`);
    if (!known.has(f[0])) bad(`"rel" #${i + 1}: unknown node "${f[0]}"`);
    if (!known.has(f[1])) bad(`"rel" #${i + 1}: unknown node "${f[1]}"`);
    return { from: f[0], to: f[1], type: f[2] || 'relates' };
  });
  const title = params.get('title')?.trim() || undefined;
  const subtitle = params.get('subtitle')?.trim() || undefined;
  return { ...(title ? { title } : {}), ...(subtitle ? { subtitle } : {}), reqs, els, rels };
}

/** 一个盒子(需求或要素) */
interface Box {
  name: string;
  x: number;
  y: number;
  w: number;
  h: number;
  /** 需求 or 要素 */
  kind: 'req' | 'el';
  /** 字段表的一行行 */
  rows: { label: string; value: string }[];
  risk?: RequirementRisk;
}

/** 盒子里的一行字段 */
function rowsOf(n: RequirementNode | RequirementElement): { label: string; value: string }[] {
  const out: { label: string; value: string }[] = [];
  const isReq = 'risk' in n || 'verifymethod' in n || 'text' in n;
  if (isReq) {
    const r = n as RequirementNode;
    if (r.id) out.push({ label: 'id', value: r.id });
    if (r.text) out.push({ label: 'text', value: r.text });
    if (r.verifymethod) out.push({ label: 'verify', value: r.verifymethod });
  } else {
    const e = n as RequirementElement;
    if (e.type) out.push({ label: 'type', value: e.type });
  }
  return out;
}

/** 盒子的尺寸:字段表最宽的一行 + 名字 */
function boxSize(n: RequirementNode | RequirementElement, kind: 'req' | 'el'): { w: number; h: number } {
  const rows = rowsOf(n);
  const nameW = textW(n.name, 13);
  const rowW = Math.max(0, ...rows.map((r) => textW(r.label, 11) + 14 + textW(r.value, 11)));
  const w = Math.max(BOX_MIN_W, nameW + 48, rowW + 30);
  const h = rows.length ? ROW_TOP + (rows.length - 1) * ROW_H + 14 : HEAD_H + 14;
  return { w, h };
}

const DEFS =
  `<defs>` +
  `<marker id="rq-a" viewBox="0 0 10 10" refX="8.5" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0L10 5L0 10z" fill="var(--d-muted)"/></marker>` +
  `</defs>`;

/**
 * 画一张需求图。
 *
 * 盒子摆成两列:需求一列、要素一列 —— 关系多是「要素满足需求」,同列排开就好读。
 * 风险徽章挂在需求盒子的右上角:high 用色板第一色(最重),medium 第二色,low 第三色。
 */
export function renderRequirement(spec: RequirementSpec, o: {
  width: number;
  height: number;
  version: number;
  skin: ReturnType<typeof resolveSkin>;
  interactive?: boolean;
}): string {
  const width = o.width;
  const height = o.height;
  const skin = o.skin;
  if (!spec.reqs.length && !spec.els.length) bad('requirement needs at least one requirement or element');

  const titleH = spec.title ? 40 : 30; // 没标题也留一条带:右上角那枚角标在那儿
  const subH = spec.subtitle ? 18 : 0;
  const top = PAD + titleH + subH;

  // 两列:需求在左、要素在右(没有需求就只放要素那一列)
  const all: { n: RequirementNode | RequirementElement; kind: 'req' | 'el' }[] = [
    ...spec.reqs.map((n) => ({ n, kind: 'req' as const })),
    ...spec.els.map((n) => ({ n, kind: 'el' as const })),
  ];
  // 列间距:边与标签都走这条空当。边多的时候空当要宽 ——
  // 每条边占一条通道,通道上还要放得下「satisfies」那样的词。
  const laneNeed = Math.max(0, spec.rels.length - 1) * 68;
  const gapX = Math.max(BOX_GAP_X, laneNeed + 60);
  const boxes: Box[] = [];
  const colX: number[] = [];
  let x = PAD;
  for (const kind of ['req', 'el'] as const) {
    const list = all.filter((a) => a.kind === kind);
    if (!list.length) continue;
    let colW = 0;
    for (const { n } of list) colW = Math.max(colW, boxSize(n, kind).w);
    colX.push(x);
    let y = top;
    for (const { n } of list) {
      const sz = boxSize(n, kind);
      boxes.push({
        name: n.name,
        x, y, w: colW, h: sz.h,
        kind,
        rows: rowsOf(n),
        ...('risk' in n && n.risk ? { risk: n.risk } : {}),
      });
      y += sz.h + BOX_GAP_Y;
    }
    x += colW + gapX;
  }
  const gridW = x - gapX + PAD;
  const gridH = Math.max(0, ...boxes.map((b) => b.y + b.h)) + PAD;
  const canvasW = Math.max(width, gridW);
  const canvasH = Math.max(height, gridH);

  const byName = new Map(boxes.map((b) => [b.name, b]));
  const parts: string[] = [];
  parts.push(DEFS);

  // 关系:从「谁」指向「谁」(方向跟作者写的一致 —— A 满足 B 就是 A → B)
  //
  // 走线:源盒 → 一条竖着的通道 → 目标盒。每条边占一条通道 ——
  // 都挤在同一个中线上,标签会叠成一堆(三条边就三个标签压在一处)。
  // 通道在两列之间的空当里横向分开,标签贴在自己那条边的水平段上。
  const edges = spec.rels
    .map((rel) => ({ rel, a: byName.get(rel.from), b: byName.get(rel.to) }))
    .filter((e): e is { rel: RequirementRel; a: Box; b: Box } => !!e.a && !!e.b);
  // 通道:空当里横向排开,每条边一条 —— 标签贴着各自的通道,互不重叠
  const gapLeft = Math.min(...boxes.map((b) => b.x + b.w)) + 14;
  const gapRight = Math.max(...boxes.map((b) => b.x)) - 14;
  const laneGap = gapRight > gapLeft ? (gapRight - gapLeft) / Math.max(1, edges.length) : 0;
  // 水平走的那一段上贴标签:挨着源盒子那一侧(读者先看到标签,再顺着线找目标)
  const labelSpots: { x: number; y: number; text: string; anchor: 'start' | 'middle' | 'end' }[] = [];
  edges.forEach((e, i) => {
    const { rel, a, b } = e;
    const ia = o.interactive ? ` data-from="${esc(rel.from)}" data-to="${esc(rel.to)}"` : '';
    const laneX = gapLeft + laneGap * (i + 0.5);
    const srcRight = a.x <= b.x;
    // 源盒的出边(朝目标那一侧)/ 目标盒的入边(朝源那一侧)
    const x1 = srcRight ? a.x + a.w : a.x;
    const y1 = a.y + a.h / 2;
    const x2 = srcRight ? b.x : b.x + b.w;
    const y2 = b.y + b.h / 2;
    let d: string;
    if (Math.abs(y1 - y2) < 2) {
      // 同一行:直线过去
      d = `M${r2(x1)} ${r2(y1)}L${r2(x2)} ${r2(y2)}`;
    } else {
      d = `M${r2(x1)} ${r2(y1)}L${r2(laneX)} ${r2(y1)}L${r2(laneX)} ${r2(y2)}L${r2(x2)} ${r2(y2)}`;
    }
    parts.push(`<path d="${d}"${ia} fill="none" stroke="var(--d-muted)" stroke-width="1.4" marker-end="url(#rq-a)"/>`);
    if (rel.type) {
      // 标签:贴在竖着那一段的**旁边**(不压在线上)——
      // 水平的那两段太短,塞不下「satisfies」这么长的词。
      const text = trunc(rel.type, 16);
      const lw = textW(text, 11) + 12;
      const ly = Math.abs(y1 - y2) < 2 ? y1 - 9 : (y1 + y2) / 2;
      // 往哪边偏:哪边空就往哪边 —— 标签落在的那条水平带上,
      // 左右两边各到最近的盒子边缘还有多远。
      const freeRight = Math.min(
        canvasW - PAD,
        ...boxes.filter((bx) => bx.y - 4 <= ly && bx.y + bx.h + 4 >= ly).map((bx) => bx.x),
      );
      const freeLeft = Math.max(
        PAD,
        ...boxes.filter((bx) => bx.y - 4 <= ly && bx.y + bx.h + 4 >= ly).map((bx) => bx.x + bx.w),
      );
      const sameRow = Math.abs(y1 - y2) < 2;
      const lx = sameRow ? (x1 + x2) / 2 : laneX + 9 + lw <= freeRight ? laneX + 9 : laneX - 9;
      const anchor: 'start' | 'middle' | 'end' = sameRow ? 'middle' : laneX + 9 + lw <= freeRight ? 'start' : 'end';
      // 往左偏也放不下(左边的空当比标签还窄)→ 干脆把标签横过来盖在竖线上
      const fits = anchor === 'end' ? laneX - 9 - lw >= freeLeft : true;
      labelSpots.push({
        x: fits ? lx : (x1 + x2) / 2,
        y: fits ? ly : y1 - 9,
        text,
        anchor: fits ? anchor : 'middle',
      });
    }
  });
  // 标签最后画(压在边上面),并且互相让开
  const taken: { x: number; y: number; w: number; h: number }[] = [];
  for (const l of labelSpots) {
    const w = textW(l.text, 11) + 12;
    const h = 16;
    const x0 = l.anchor === 'middle' ? l.x - w / 2 : l.anchor === 'end' ? l.x - w : l.x;
    let lx = l.x;
    let ly = l.y;
    const hits = (x: number, y: number): boolean =>
      taken.some((t) => x < t.x + t.w && x + w > t.x && y < t.y + t.h && y + h > t.y);
    if (hits(x0, ly - h / 2)) {
      for (const dy of [h + 3, -(h + 3), 2 * (h + 3), -2 * (h + 3), 3 * (h + 3)]) {
        if (!hits(x0, ly + dy - h / 2)) {
          ly = ly + dy;
          break;
        }
      }
    }
    const fx = l.anchor === 'middle' ? lx - w / 2 : l.anchor === 'end' ? lx - w : lx;
    taken.push({ x: fx, y: ly - h / 2, w, h });
    parts.push(
      `<rect x="${r2(fx)}" y="${r2(ly - h / 2)}" width="${r2(w)}" height="${h}" rx="5" fill="var(--d-card)" stroke="var(--d-border)" stroke-width="1"/>`,
      `<text x="${r2(lx)}" y="${r2(ly + 4)}" text-anchor="${l.anchor}" font-size="11" fill="var(--d-text)">${esc(l.text)}</text>`,
    );
  }

  // 盒子
  boxes.forEach((b, i) => {
    const color = sVar(b.kind === 'req' ? 0 : 3);
    const tip = o.interactive
      ? ` data-tip="${esc(b.name)}" tabindex="0"`
      : '';
    const bx = b.x + 12;
    const by = b.y + (HEAD_H - BADGE) / 2;
    // 标题条:上圆角、下直角
    parts.push(
      `<g${tip}>` +
      `<rect x="${r2(b.x)}" y="${r2(b.y)}" width="${r2(b.w)}" height="${r2(b.h)}" rx="10" fill="var(--d-card)" stroke="var(--d-border)" stroke-width="1"/>` +
      `<path d="M${r2(b.x)} ${r2(b.y + 10)}A10 10 0 0 1 ${r2(b.x + 10)} ${r2(b.y)}` +
      `H${r2(b.x + b.w - 10)}A10 10 0 0 1 ${r2(b.x + b.w)} ${r2(b.y + 10)}` +
      `V${r2(b.y + HEAD_H)}H${r2(b.x)}Z" fill="${color}" fill-opacity="0.14"/>` +
      `<rect x="${r2(b.x)}" y="${r2(b.y)}" width="3.5" height="${r2(b.h)}" rx="1.5" fill="${color}"/>` +
      `<text x="${r2(b.x + 14)}" y="${r2(b.y + HEAD_H / 2 + 5)}" font-size="13" font-weight="600" fill="var(--d-ink)">${esc(trunc(b.name, 22))}</text>` +
      `</g>`,
    );
    // 字段行
    b.rows.forEach((r, ri) => {
      const y = b.y + ROW_TOP + ri * ROW_H;
      parts.push(
        `<text x="${r2(b.x + 14)}" y="${r2(y)}" font-size="11" fill="var(--d-muted)">${esc(r.label)}</text>`,
        `<text x="${r2(b.x + b.w - 12)}" y="${r2(y)}" text-anchor="end" font-size="11" fill="var(--d-text)">${esc(trunc(r.value, 26))}</text>`,
      );
    });
    // 风险徽章:右上角一个圆点 + 等级字(颜色走色板,不写死红)
    if (b.risk) {
      const idx = b.risk === 'high' ? 0 : b.risk === 'medium' ? 1 : 2;
      const rc = sVar(idx);
      const rx = b.x + b.w - 12;
      const ry = b.y + 12;
      parts.push(
        `<circle cx="${r2(rx)}" cy="${r2(ry)}" r="${BADGE / 2}" fill="${rc}" fill-opacity="0.18" stroke="${rc}" stroke-opacity="0.7" stroke-width="1"/>`,
        `<text x="${r2(rx)}" y="${r2(ry + 3.5)}" text-anchor="middle" font-size="9" font-weight="700" fill="${rc}">${esc(b.risk === 'high' ? 'H' : b.risk === 'medium' ? 'M' : 'L')}</text>`,
      );
    }
  });

  const iStyle = o.interactive
    ? `<style>#rq g[data-tip]{cursor:pointer;transition:filter .12s ease}#rq g[data-tip]:hover{filter:brightness(1.2)}</style>`
    : '';
  parts.unshift(iStyle);

  const head = titleBlock(spec.title, PAD) + subtitleBlock(spec.subtitle, PAD, !!spec.title);
  const bg = skin.rules.canvas === 'card' ? card(canvasW, canvasH) : '';
  const meta = o.interactive
    ? `<metadata id="rreqs">${esc(JSON.stringify(spec))}</metadata>`
    : '';
  const aria = spec.title ?? `requirement diagram, ${spec.reqs.length} requirements, ${spec.els.length} elements`;
  return svgDoc(canvasW, canvasH, 'requirement', o.version, aria, spec, skin, bg + meta + head + `<g id="rq">${parts.join('')}</g>`);
}

/**
 * `/draw/requirement` 入口:GET ?req=…&el=…&rel=…&title=…
 */
export function renderRequirementFromUrl(url: URL, interactive = false): DrawResult {
  const params = url.searchParams;
  const spec = requirementSpecFromParams(params);
  const v = resolveVersion(params.get('v'));
  const skin = resolveSkin('sankey', params.get('t'), schemeParam(params));
  const width = clampInt(params, 'w', 760, 200, 2400);
  const height = clampInt(params, 'h', 340, 140, 2400);
  const svg = renderRequirement(spec, { width, height, version: v.version, skin, interactive });
  return { svg, version: v.version, cacheControl: v.cacheControl };
}
