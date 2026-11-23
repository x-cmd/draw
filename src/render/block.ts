// /draw/block —— 方块图(block-beta):一格一格的方块,箭头从一块指向另一块。
//
// 方块图不是流程图:没有自动布局引擎,作者摆好格子,引擎照着画。
//   cols=<列数>                  每行放几块(超过就换行)
//   item=<id>|<col>|<label>|<groupId>   一块:在哪一列(从 0 起)、叫什么、属于哪个组
//   block=<id>|<col>|<col>|…|<label>     一个组:罩住哪几列、叫什么
//   edge=<from>|<to>             一条箭头
//   title=<标题>
//
// 组的框罩在它罩住的那几列上(横跨整行的格子),标签挂在上沿。
// 组的框会盖住箭头 —— 所以框画在箭头底下,箭头压在上面。
import { ApiError } from '../specs/index.js';
import { resolveVersion } from '../version.js';
import { resolveSkin } from '../styles/index.js';
import { card } from '../theme.js';
import { clampInt, schemeParam, type DrawResult } from './query.js';
import { esc, r2, sVar, svgDoc, subtitleBlock, textW, titleBlock, trunc } from './svg.js';

const PAD = 24;
const CELL_W = 132;         // 一格的自然宽(标签比这宽就撑开)
const CELL_H = 52;          // 一格的高
const GAP_X = 28;           // 列间距
const GAP_Y = 40;           // 行间距
const GROUP_PAD = 16;       // 组的框离成员格的空当
// 组的标签牌骑在框的上沿(一半在框里、一半在框外)——
// 框的上沿只比成员高 GROUP_PAD,所以牌子不会碰到上面那一行的方块。
const CHIP_H = 20;
const N_EXAMPLE = 'cols=3&item=a|0|A&item=b|1|B&item=c|2|C&edge=a|b';

/** 一块方块 */
export interface BlockItem {
  id: string;
  /** 所在列(从 0 起) */
  col: number;
  /** 显示的名字 */
  label: string;
  /** 属于哪个组(空 = 不在组里) */
  group?: string;
}

/** 一个组(罩住几列) */
export interface BlockGroup {
  id: string;
  /** 罩住的列(从 0 起,升序) */
  cols: number[];
  /** 组的名字(挂在上沿) */
  label: string;
}

/** 一条箭头 */
export interface BlockEdge {
  from: string;
  to: string;
}

/** 方块图的规格 */
export interface BlockSpec {
  title?: string;
  subtitle?: string;
  /** 列数(每行放几块) */
  cols: number;
  items: BlockItem[];
  groups: BlockGroup[];
  edges: BlockEdge[];
}

function bad(detail: string): never {
  throw new ApiError(400, `${detail} Example: /draw/block?${N_EXAMPLE}`);
}

/** 切 item= 的一段:`id|col|label|groupId`(groupId 可省) */
function parseItem(raw: string, i: number): BlockItem {
  const f = raw.split('|');
  if (f.length < 3) {
    bad(`"item" #${i + 1} must be "id|col|label[|groupId]", got ${JSON.stringify(raw)}`);
  }
  const id = f[0].trim();
  const col = Number(f[1].trim());
  const label = f[2].trim();
  const group = f.length > 3 ? f[3].trim() : '';
  if (!id) bad(`"item" #${i + 1}: id is required`);
  if (!Number.isInteger(col) || col < 0) {
    bad(`"item" #${i + 1}: col must be a non-negative integer, got ${JSON.stringify(f[1])}`);
  }
  if (!label) bad(`"item" #${i + 1}: label is required`);
  return { id, col, label, ...(group ? { group } : {}) };
}

/** 切 block= 的一段:`id|col|col|…|label`(至少一列 + 一个名字) */
function parseGroup(raw: string, i: number): BlockGroup {
  const f = raw.split('|');
  if (f.length < 3) {
    bad(`"block" #${i + 1} must be "id|col|col|…|label" (the columns it spans and a label), got ${JSON.stringify(raw)}`);
  }
  const id = f[0].trim();
  const label = f[f.length - 1].trim();
  const cols = f.slice(1, -1).map((c) => Number(c.trim()));
  if (!id) bad(`"block" #${i + 1}: id is required`);
  if (!label) bad(`"block" #${i + 1}: label is required`);
  if (!cols.length || cols.some((c) => !Number.isInteger(c) || c < 0)) {
    bad(`"block" #${i + 1}: the columns must be non-negative integers, got ${JSON.stringify(f.slice(1, -1).join(','))}`);
  }
  return { id, cols: [...new Set(cols)].sort((a, b) => a - b), label };
}

/** 规格的 JSON 形态 → 规格 */
export function parseBlockSpec(raw: string): BlockSpec {
  let obj: unknown;
  try {
    obj = JSON.parse(raw);
  } catch {
    bad(`block spec must be JSON, got ${JSON.stringify(raw.slice(0, 60))}`);
  }
  const o = (obj ?? {}) as Partial<BlockSpec>;
  const items = Array.isArray(o.items) ? o.items : [];
  if (!items.length) bad('block spec needs at least one item');
  const cols = Number(o.cols ?? 0) || Math.max(...items.map((it) => Number((it as BlockItem).col) + 1));
  return {
    ...(typeof o.title === 'string' && o.title.trim() ? { title: o.title.trim() } : {}),
    ...(typeof o.subtitle === 'string' && o.subtitle.trim() ? { subtitle: o.subtitle.trim() } : {}),
    cols,
    items: items.map((it, i) => {
      const id = String((it as BlockItem).id ?? '').trim();
      const col = Number((it as BlockItem).col);
      const label = String((it as BlockItem).label ?? '').trim();
      const group = String((it as BlockItem).group ?? '').trim();
      if (!id) bad(`item #${i + 1}: id is required`);
      if (!Number.isInteger(col) || col < 0) bad(`item #${i + 1}: col must be a non-negative integer`);
      if (!label) bad(`item #${i + 1}: label is required`);
      return { id, col, label, ...(group ? { group } : {}) };
    }),
    groups: (Array.isArray(o.groups) ? o.groups : []).map((g, i) => {
      const id = String((g as BlockGroup).id ?? '').trim();
      const label = String((g as BlockGroup).label ?? '').trim();
      const cs = ((g as BlockGroup).cols ?? []).map(Number);
      if (!id) bad(`group #${i + 1}: id is required`);
      if (!label) bad(`group #${i + 1}: label is required`);
      if (!cs.length || cs.some((c) => !Number.isInteger(c) || c < 0)) bad(`group #${i + 1}: cols must be non-negative integers`);
      return { id, cols: [...new Set(cs)].sort((a, b) => a - b), label };
    }),
    edges: (Array.isArray(o.edges) ? o.edges : []).map((e, i) => {
      const from = String((e as BlockEdge).from ?? '').trim();
      const to = String((e as BlockEdge).to ?? '').trim();
      if (!from || !to) bad(`edge #${i + 1}: from and to are required`);
      return { from, to };
    }),
  };
}

/** URL 参数 → 规格 */
export function blockSpecFromParams(params: URLSearchParams): BlockSpec {
  const itemRaw = params.getAll('item').filter((v) => v.trim() !== '');
  if (!itemRaw.length) {
    bad(`at least one "item" is required (e.g. item=a|0|A)`);
  }
  const items = itemRaw.map(parseItem);
  const groups = params.getAll('block').filter((v) => v.trim() !== '').map(parseGroup);
  const ids = new Set<string>();
  for (const it of items) {
    if (ids.has(it.id)) bad(`duplicate item id "${it.id}"`);
    ids.add(it.id);
  }
  const groupIds = new Set(groups.map((g) => g.id));
  for (const it of items) {
    if (it.group && !groupIds.has(it.group)) {
      bad(`item "${it.id}" points at unknown group "${it.group}"`);
    }
  }
  const edges = params.getAll('edge').filter((v) => v.trim() !== '').map((e, i) => {
    const f = e.split('|').map((x) => x.trim());
    if (f.length < 2) bad(`"edge" #${i + 1} must be "from|to", got ${JSON.stringify(e)}`);
    if (!ids.has(f[0])) bad(`"edge" #${i + 1}: unknown item "${f[0]}"`);
    if (!ids.has(f[1])) bad(`"edge" #${i + 1}: unknown item "${f[1]}"`);
    return { from: f[0], to: f[1] };
  });
  const cols = clampInt(params, 'cols', 0, 1, 12);
  const maxCol = Math.max(...items.map((it) => it.col));
  const title = params.get('title')?.trim() || undefined;
  const subtitle = params.get('subtitle')?.trim() || undefined;
  return {
    ...(title ? { title } : {}),
    ...(subtitle ? { subtitle } : {}),
    // cols= 没给就按最右边那列 +1 算(一行放得下)
    cols: cols > 0 ? cols : maxCol + 1,
    items,
    groups,
    edges,
  };
}

interface Cell {
  x: number;
  y: number;
  w: number;
  h: number;
  row: number;
  col: number;
}

const DEFS =
  `<defs>` +
  `<marker id="bl-a" viewBox="0 0 10 10" refX="8.5" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0L10 5L0 10z" fill="var(--d-muted)"/></marker>` +
  `</defs>`;

/**
 * 画一张方块图。
 *
 * 格子按 item= 的列号摆(同一列的方块上下排一行 —— 作者说了算,引擎不挪)。
 * 每列的宽度按那一列最宽的标签算;组的框罩住它那几列。
 */
export function renderBlock(spec: BlockSpec, o: {
  width: number;
  height: number;
  version: number;
  skin: ReturnType<typeof resolveSkin>;
  interactive?: boolean;
}): string {
  const width = o.width;
  const height = o.height;
  const skin = o.skin;
  const items = spec.items;
  if (!items.length) bad('block needs at least one item');

  const titleH = spec.title ? 40 : 30; // 没标题也留一条带:右上角那枚角标在那儿
  const subH = spec.subtitle ? 18 : 0;
  const top = PAD + titleH + subH;

  // 每列的宽度:那一列所有方块里最宽的标签(组标签不算 —— 它挂在框上,不受列宽管)
  const colCount = Math.max(spec.cols, ...items.map((it) => it.col + 1));
  const colW: number[] = new Array(colCount).fill(0);
  for (const it of items) {
    const w = Math.max(CELL_W, textW(trunc(it.label, 22), 13) + 40);
    colW[it.col] = Math.max(colW[it.col], w);
  }
  // 空列也有宽度(不然列号与画出来的位置对不上)
  for (let c = 0; c < colCount; c++) if (!colW[c]) colW[c] = CELL_W;

  // 列位置
  const colX: number[] = new Array(colCount).fill(0);
  let x = PAD;
  for (let c = 0; c < colCount; c++) {
    colX[c] = x;
    x += colW[c] + GAP_X;
  }
  const gridW = x - GAP_X + PAD;

  // 行:同一列里出现的方块按顺序往下排
  const rowsPerCol: BlockItem[][] = Array.from({ length: colCount }, () => []);
  for (const it of items) rowsPerCol[it.col].push(it);
  const rowCount = Math.max(1, ...rowsPerCol.map((r) => r.length));

  // 每行的高度:那一行最高的一格(标签可能两行)
  const rowH: number[] = new Array(rowCount).fill(0);
  const rowOf = new Map<string, number>();
  const cells = new Map<string, Cell>();
  const labelLines = new Map<string, string[]>();
  rowsPerCol.forEach((list, col) => {
    list.forEach((it, i) => {
      const lines = wrapLabel(it.label, colW[col] - 24);
      labelLines.set(it.id, lines);
      const h = Math.max(CELL_H, lines.length * 16 + 22);
      rowH[i] = Math.max(rowH[i], h);
      rowOf.set(it.id, i);
    });
  });
  const rowY: number[] = new Array(rowCount).fill(0);
  let y = top;
  for (let r = 0; r < rowCount; r++) {
    rowY[r] = y;
    y += rowH[r] + GAP_Y;
  }
  const gridH = y - GAP_Y + PAD;

  // 落盒:同一行的方块(不同列)顶部对齐
  rowsPerCol.forEach((list, col) => {
    list.forEach((it, i) => {
      const h = Math.max(CELL_H, (labelLines.get(it.id) ?? []).length * 16 + 22);
      cells.set(it.id, { x: colX[col], y: rowY[i], w: colW[col], h, row: i, col });
    });
  });

  const canvasW = Math.max(width, gridW);
  const canvasH = Math.max(height, gridH);

  const parts: string[] = [];
  parts.push(DEFS);
  // 组的标签牌:最后画(它挂在框上沿,可能被上面那一行的方块盖住)
  const groupChips: string[] = [];

  // 组的框:罩住它的成员(上下都留 GROUP_PAD),标签挂在上沿
  for (const g of spec.groups) {
    const members = items.filter((it) => it.group === g.id);
    const mboxes = members.map((it) => cells.get(it.id)!).filter(Boolean);
    if (!mboxes.length) continue;
    // 左右缘:成员盒子的最左/最右(列号只作退路 —— 跨行的组列号会绕回)
    const gx = Math.min(...mboxes.map((b) => b.x)) - GROUP_PAD;
    const gw = Math.max(...mboxes.map((b) => b.x + b.w)) - gx + GROUP_PAD;
    // 上下缘:成员盒子的上下沿
    const gy = Math.min(...mboxes.map((b) => b.y)) - GROUP_PAD;
    const gh = Math.max(...mboxes.map((b) => b.y + b.h)) - Math.min(...mboxes.map((b) => b.y)) + GROUP_PAD * 2;
    const color = sVar((spec.groups.indexOf(g) + 3) % 10);
    // 框:中性虚线(跟 archmap 的分组框一个样)—— 框是「区域」,不是数据
    parts.push(
      `<rect x="${r2(gx)}" y="${r2(gy)}" width="${r2(gw)}" height="${r2(gh)}" rx="12" fill="none" stroke="var(--d-border)" stroke-width="1.2" stroke-dasharray="6 4"/>`,
    );
    // 组的标签:骑在框的上沿(像图例)—— 牌子一半在框里、一半在框外
    const lw = textW(g.label, 11) + 20;
    const chipY = gy - CHIP_H / 2;
    groupChips.push(
      `<rect x="${r2(gx + 10)}" y="${r2(chipY)}" width="${r2(lw)}" height="${CHIP_H}" rx="6" fill="var(--d-card)" stroke="${color}" stroke-opacity="0.65" stroke-width="1"/>`,
      `<text x="${r2(gx + 10 + lw / 2)}" y="${r2(chipY + 14)}" text-anchor="middle" font-size="11" font-weight="700" letter-spacing="0.6" fill="${color}">${esc(g.label)}</text>`,
    );
  }

  // 箭头:从源块的右边出、目标块的左边进(同一列就上下走)
  const byId = new Map(items.map((it) => [it.id, cells.get(it.id)!]));
  for (const e of spec.edges) {
    const a = byId.get(e.from);
    const b = byId.get(e.to);
    if (!a || !b) continue;
    const ia = o.interactive ? ` data-from="${esc(e.from)}" data-to="${esc(e.to)}"` : '';
    let d: string;
    if (a.row === b.row && a.col < b.col) {
      // 同行:右边 → 左边,中间那一段走直线
      const x1 = a.x + a.w;
      const x2 = b.x;
      const cy = a.y + a.h / 2;
      d = `M${r2(x1)} ${r2(cy)}L${r2(x2 - 6)} ${r2(cy)}`;
    } else if (a.row === b.row && a.col > b.col) {
      // 同行反向:绕到下面走(不穿别的盒子)
      const x1 = a.x;
      const x2 = b.x + b.w;
      const yb = a.y + a.h + 18;
      d = `M${r2(x1)} ${r2(a.y + a.h / 2)}L${r2(x1 - 12)} ${r2(a.y + a.h / 2)}L${r2(x1 - 12)} ${r2(yb)}L${r2(x2 + 12)} ${r2(yb)}L${r2(x2 + 12)} ${r2(b.y + b.h / 2)}L${r2(x2)} ${r2(b.y + b.h / 2)}`;
    } else {
      // 跨行:出底/右边 → 进顶/左边,走一段折线
      const fromRight = b.x >= a.x + a.w;
      const x1 = fromRight ? a.x + a.w : a.x + a.w / 2;
      const y1 = fromRight ? a.y + a.h / 2 : a.y + a.h;
      const x2 = fromRight ? b.x : b.x + b.w / 2;
      const y2 = fromRight ? b.y + b.h / 2 : b.y;
      const midX = (x1 + x2) / 2;
      d = `M${r2(x1)} ${r2(y1)}L${r2(midX)} ${r2(y1)}L${r2(midX)} ${r2(y2)}L${r2(x2 - (fromRight ? 6 : 0))} ${r2(y2)}`;
    }
    parts.push(`<path d="${d}"${ia} fill="none" stroke="var(--d-muted)" stroke-width="1.4" marker-end="url(#bl-a)"/>`);
  }

  // 方块:圆角盒子 + 左侧色条 + 名字(archmap 那张脸)
  items.forEach((it, i) => {
    const b = cells.get(it.id)!;
    const color = sVar(i % 10);
    const lines = labelLines.get(it.id) ?? [it.label];
    const tip = o.interactive
      ? ` data-tip="${esc(`${it.label}${it.group ? ` · ${it.group}` : ''}`)}" tabindex="0"`
      : '';
    const textY = lines.length === 1
      ? b.y + b.h / 2 + 4.5
      : b.y + b.h / 2 - (lines.length - 1) * 8 + 4.5;
    parts.push(
      `<g${tip}>` +
      `<rect x="${r2(b.x)}" y="${r2(b.y)}" width="${r2(b.w)}" height="${r2(b.h)}" rx="9" fill="var(--d-card)" stroke="var(--d-border)" stroke-width="1"/>` +
      `<rect x="${r2(b.x)}" y="${r2(b.y)}" width="3.5" height="${r2(b.h)}" rx="1.5" fill="${color}"/>` +
      lines.map((l, li) => `<text x="${r2(b.x + b.w / 2 + 2)}" y="${r2(textY + li * 16)}" text-anchor="middle" font-size="13" font-weight="500" fill="var(--d-ink)">${esc(l)}</text>`).join('') +
      `</g>`,
    );
  });

  const iStyle = o.interactive
    ? `<style>#bl g[data-tip]{cursor:pointer;transition:filter .12s ease}#bl g[data-tip]:hover{filter:brightness(1.2)}</style>`
    : '';
  parts.unshift(iStyle);
  // 组的标签牌压在最上(不能被方块盖住)
  parts.push(...groupChips);

  const head = titleBlock(spec.title, PAD) + subtitleBlock(spec.subtitle, PAD, !!spec.title);
  const bg = skin.rules.canvas === 'card' ? card(canvasW, canvasH) : '';
  const meta = o.interactive
    ? `<metadata id="bitems">${esc(JSON.stringify(spec))}</metadata>`
    : '';
  const aria = spec.title ?? `block diagram, ${items.length} blocks`;
  return svgDoc(canvasW, canvasH, 'block', o.version, aria, spec, skin, bg + meta + head + `<g id="bl">${parts.join('')}</g>`);
}

/** 标签按格子宽度折行(中文逐字、拉丁按词) */
function wrapLabel(label: string, maxW: number): string[] {
  if (textW(label, 13) <= maxW) return [label];
  const atoms = label.match(/[A-Za-z0-9'’\-]+\s*|[^\s]/g) ?? [...label];
  const lines: string[] = [];
  let cur = '';
  for (const a of atoms) {
    if (textW(cur + a, 13) <= maxW) {
      cur += a;
      continue;
    }
    if (cur.trim()) lines.push(cur.trimEnd());
    cur = a.trimStart();
    if (lines.length >= 2) break;
  }
  if (cur.trim() && lines.length < 2) lines.push(cur.trimEnd());
  return lines.length ? lines : [trunc(label, 22)];
}

/**
 * `/draw/block` 入口:GET ?cols=…&item=…&block=…&edge=…
 */
export function renderBlockFromUrl(url: URL, interactive = false): DrawResult {
  const params = url.searchParams;
  const spec = blockSpecFromParams(params);
  const v = resolveVersion(params.get('v'));
  const skin = resolveSkin('sankey', params.get('t'), schemeParam(params));
  const width = clampInt(params, 'w', 720, 200, 2400);
  const height = clampInt(params, 'h', 320, 140, 2400);
  const svg = renderBlock(spec, { width, height, version: v.version, skin, interactive });
  return { svg, version: v.version, cacheControl: v.cacheControl };
}
