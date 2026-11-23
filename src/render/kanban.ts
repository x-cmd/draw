// /draw/kanban —— 看板:列并排,列里是任务卡。
//
// 模型(扁平 URL 参数):
//   column=<列名>            可重复 —— 列,按出现顺序从左往右排
//   task=<列名>|<标题>[|<元信息>]   可重复 —— 一张任务卡
//   title= / subtitle=        图题与副题
//
// 画法:每列一个淡底竖条(列名在顶上),任务卡是带边框的白卡片(卡面用皮肤的
// card/border 中性色),标题一行,元信息(如果有)一行小字。列的强调色走皮肤
// 的 var(--d-sN),所以换皮即换色。
import { ApiError } from '../specs/index.js';
import { resolveSkin } from '../styles/index.js';
import { clampInt, schemeParam, type DrawResult } from './query.js';
import { card } from '../theme.js';
import { esc, r2, subtitleBlock, svgDoc, textW, titleBlock } from './svg.js';

const PAD = 26;
const COL_GAP = 18;      // 列间距
const COL_HEAD_H = 38;   // 列名条高度
const CARD_H = 46;       // 任务卡高(有元信息时高一点)
const CARD_GAP = 10;     // 任务卡之间的间距
const CARD_PAD = 12;     // 卡内边距
const COL_PAD = 10;      // 列底板内边距
const COL_MIN_W = 170;
const CARD_MAX_W = 300;
const TITLE_FS = 13;
const META_FS = 11;

const EXAMPLE = 'column=Todo&column=Doing&task=Todo|Implement the parser|high&task=Doing|Draw the chart|';

function bad(detail: string): never {
  throw new ApiError(400, `${detail}. Example: /draw/kanban?${EXAMPLE}`);
}

/** 一张任务卡 */
export interface KanbanTask {
  /** 所属列名 */
  column: string;
  /** 卡片标题 */
  title: string;
  /** 可选的元信息(小字) */
  meta?: string;
}

/** 看板规格 */
export interface KanbanSpec {
  title?: string;
  subtitle?: string;
  /** 列名,按顺序 */
  columns: string[];
  /** 任务卡 */
  tasks: KanbanTask[];
}

/** 从扁平 URL 参数造规格 */
export function kanbanSpecFromParams(params: URLSearchParams): KanbanSpec {
  const columns = params.getAll('column').map((c) => c.trim()).filter((c) => c !== '');
  const tasks: KanbanTask[] = [];
  params.getAll('task').forEach((raw, i) => {
    const f = raw.split('|').map((x) => x.trim());
    if (f.length < 2 || !f[0] || !f[1]) {
      bad(`"task" #${i + 1} must be "column|title[|meta]"`);
    }
    tasks.push({ column: f[0], title: f[1], ...(f[2] ? { meta: f[2] } : {}) });
  });
  const title = params.get('title')?.trim() || undefined;
  const subtitle = params.get('subtitle')?.trim() || undefined;
  return { ...(title ? { title } : {}), ...(subtitle ? { subtitle } : {}), columns, tasks };
}

/**
 * 解析并校验看板规格(JSON 形态,给 ?d= 用)。
 *
 * @throws ApiError(400) with a corrective example on bad input
 */
export function parseKanbanSpec(raw: string | null): KanbanSpec {
  if (raw === null || raw === '') {
    bad(`missing data. Use /draw/kanban?${EXAMPLE}`);
  }
  let obj: unknown;
  try {
    obj = JSON.parse(raw);
  } catch {
    bad(`"d" is not valid JSON. Use {"columns":["Todo"],"tasks":[{"column":"Todo","title":"Write the parser"}]}`);
  }
  const o = obj as Record<string, unknown>;
  if (!Array.isArray(o.columns) || o.columns.length === 0) {
    bad(`"columns" must be a non-empty array of column names`);
  }
  const columns: string[] = [];
  for (const c of o.columns as unknown[]) {
    if (typeof c !== 'string' || c.trim() === '') bad(`"columns" entries must be non-empty strings`);
    columns.push(c.trim());
  }
  if (!Array.isArray(o.tasks) || o.tasks.length === 0) {
    bad(`"tasks" must be a non-empty array of tasks`);
  }
  const tasks: KanbanTask[] = (o.tasks as unknown[]).map((t, i) => {
    if (typeof t !== 'object' || t === null) bad(`"tasks"[${i}] must be an object`);
    const tt = t as Record<string, unknown>;
    const column = typeof tt.column === 'string' ? tt.column : '';
    if (!column) bad(`"tasks"[${i}].column is required (a column name)`);
    if (!columns.includes(column)) bad(`"tasks"[${i}].column "${column}" is not one of the columns`);
    const title = typeof tt.title === 'string' ? tt.title : '';
    if (!title) bad(`"tasks"[${i}].title is required`);
    const meta = typeof tt.meta === 'string' && tt.meta !== '' ? tt.meta : undefined;
    return { column, title, ...(meta ? { meta } : {}) };
  });
  const title = typeof o.title === 'string' && o.title !== '' ? o.title : undefined;
  const subtitle = typeof o.subtitle === 'string' && o.subtitle !== '' ? o.subtitle : undefined;
  return { ...(title ? { title } : {}), ...(subtitle ? { subtitle } : {}), columns, tasks };
}

const COL_COLORS = ['var(--d-s1)', 'var(--d-s2)', 'var(--d-s3)', 'var(--d-s4)', 'var(--d-s5)', 'var(--d-s6)', 'var(--d-s7)', 'var(--d-s8)', 'var(--d-s9)', 'var(--d-s10)'];

/** 文字截到能放进 maxW(超了就加省略号)—— 卡面标题不许越出卡片 */
function fitText(s: string, fs: number, maxW: number): string {
  if (textW(s, fs) <= maxW) return s;
  let t = s;
  while (t.length > 1 && textW(`${t}…`, fs) > maxW) t = t.slice(0, -1);
  return `${t}…`;
}

/** 同上,但吃 undefined(标题/副标题可能没有) */
function fitTextOr(s: string | undefined, fs: number, maxW: number): string | undefined {
  return s === undefined ? undefined : fitText(s, fs, maxW);
}

/**
 * 右上角 Edit 角标占掉的宽度(照 svg.ts 里 editTag 的算法算)。
 * 标题是左对齐的,只要不撞上角标就行 —— 不用留满 TAG_RESERVE 那 150px。
 */
function editTagReserve(width: number): number {
  const fs = Math.max(10, Math.min(18, Math.round(width / 55)));
  const tw = textW('Edit @X-CMD', fs);
  const padX = Math.max(6, Math.round(fs * 0.55));
  return Math.round(tw + padX * 2 + 2) + 8 + PAD;
}

export interface KanbanOpts {
  spec: KanbanSpec;
  interactive: boolean;
  version: number;
  cacheControl: string;
  skin: ReturnType<typeof resolveSkin>;
  /** 画布宽度:?w= 给了就按它画(内容仍按自然尺寸排) */
  width?: number;
  /** 画布高度:?h= 给了就按它画 */
  height?: number;
  minW?: number;
  minH?: number;
  tagQuery?: string;
}

/**
 * 渲染看板。
 */
export function renderKanban(spec: KanbanSpec, o: KanbanOpts): DrawResult {
  if (!spec.columns.length) bad('at least one column is required');
  if (!spec.tasks.length) bad('at least one task is required');
  const colSet = new Set(spec.columns);
  for (const t of spec.tasks) {
    if (!colSet.has(t.column)) bad(`task "${t.title}" is in unknown column "${t.column}"`);
  }

  const perCol = new Map<string, KanbanTask[]>();
  for (const c of spec.columns) perCol.set(c, []);
  for (const t of spec.tasks) perCol.get(t.column)!.push(t);

  const titleH = spec.title || spec.subtitle ? 44 : 30; // 没标题也留一条带:右上角那枚角标在那儿
  const hasTitle = !!spec.title;

  // 列宽:由该列最宽的一张卡决定(卡宽有上限,列也不无限宽)
  const colW = spec.columns.map((c) => {
    const tasks = perCol.get(c) ?? [];
    let w = textW(c, 13) + 40; // 列名至少要放得下
    for (const t of tasks) {
      w = Math.max(w, textW(t.title, TITLE_FS) + CARD_PAD * 2 + 4);
      if (t.meta) w = Math.max(w, textW(t.meta, META_FS) + CARD_PAD * 2 + 4);
    }
    return Math.min(Math.max(w, COL_MIN_W), CARD_MAX_W);
  });

  const totalColsW = colW.reduce((a, b) => a + b, 0) + COL_GAP * (spec.columns.length - 1);
  const naturalW = PAD * 2 + totalColsW;
  // 列高:每列里最高的那摞决定列高(看板的列本来就一样高)
  let maxStack = 0;
  for (const c of spec.columns) {
    const tasks = perCol.get(c) ?? [];
    let h = 0;
    for (const t of tasks) h += (t.meta ? CARD_H + 8 : CARD_H) + CARD_GAP;
    h = Math.max(0, h - CARD_GAP);
    maxStack = Math.max(maxStack, h);
  }
  const naturalH = PAD * 2 + titleH + COL_HEAD_H + maxStack + COL_PAD;
  // 画布:?w=/?h= 给了就按它画(内容仍是自然尺寸,摆在左上角);没给就用自然尺寸
  let width = o.width !== undefined ? o.width : naturalW;
  let height = o.height !== undefined ? o.height : naturalH;
  width = Math.max(width, naturalW, o.minW ?? 0);
  height = Math.max(height, naturalH, o.minH ?? 0);

  const top = PAD + titleH;
  const parts: string[] = [];

  let x = PAD;
  spec.columns.forEach((name, ci) => {
    const w = colW[ci];
    const color = COL_COLORS[ci % COL_COLORS.length];
    const colH = COL_HEAD_H + maxStack + COL_PAD;
    // 列底板
    parts.push(
      `<g data-column="${esc(name)}">` +
      `<rect x="${r2(x)}" y="${r2(top)}" width="${r2(w)}" height="${r2(colH)}" rx="12" fill="${color}" fill-opacity="0.05" stroke="${color}" stroke-opacity="0.38" stroke-width="1.2"/>` +
      // 列名条:颜色块 + 名字
      `<rect x="${r2(x + COL_PAD)}" y="${r2(top + 10)}" width="4" height="18" rx="2" fill="${color}"/>` +
      `<text x="${r2(x + COL_PAD + 12)}" y="${r2(top + 24)}" font-size="13" font-weight="600" fill="var(--d-ink)">${esc(name)}</text>` +
      // 任务数(角标:几件事,一眼可见)
      `<text x="${r2(x + w - COL_PAD)}" y="${r2(top + 24)}" text-anchor="end" font-size="11" fill="var(--d-muted)">${(perCol.get(name) ?? []).length}</text>` +
      `</g>`,
    );

    // 任务卡
    let cy = top + COL_HEAD_H;
    for (const t of perCol.get(name) ?? []) {
      const ch = t.meta ? CARD_H + 8 : CARD_H;
      const tip = [t.title, t.meta, name].filter(Boolean).join(' · ');
      const ia = o.interactive ? ` data-node="${esc(t.title)}" data-tip="${esc(tip)}" tabindex="0" style="cursor:pointer"` : '';
      parts.push(
        `<g${ia}>` +
        `<rect x="${r2(x + COL_PAD)}" y="${r2(cy)}" width="${r2(w - COL_PAD * 2)}" height="${r2(ch)}" rx="9" fill="var(--d-card)" stroke="var(--d-border)" stroke-width="1"/>` +
        // 左侧强调条:列的颜色(极淡,只是提示归属)
        `<rect x="${r2(x + COL_PAD)}" y="${r2(cy)}" width="3" height="${r2(ch)}" rx="1.5" fill="${color}" fill-opacity="0.75"/>` +
        `</g>`,
      );
      // 卡面文字:标题一行(装不下就截到省略号),元信息一行小字
      const innerW = w - COL_PAD * 2 - CARD_PAD - 6;
      const titleText = fitText(t.title, TITLE_FS, innerW);
      parts.push(
        `<text x="${r2(x + COL_PAD + CARD_PAD)}" y="${r2(cy + (t.meta ? 20 : ch / 2 + 4))}" font-size="${TITLE_FS}" fill="var(--d-ink)"${o.interactive ? ` data-node="${esc(t.title)}" style="cursor:pointer"` : ''}>${esc(titleText)}</text>`,
      );
      if (t.meta) {
        parts.push(
          `<text x="${r2(x + COL_PAD + CARD_PAD)}" y="${r2(cy + 38)}" font-size="${META_FS}" fill="var(--d-muted)">${esc(fitText(t.meta, META_FS, innerW))}</text>`,
        );
      }
      cy += ch + CARD_GAP;
    }
    x += w + COL_GAP;
  });

  const titleMax = Math.max(60, width - PAD - editTagReserve(width));
  const head = titleBlock(fitTextOr(spec.title, 18, titleMax), PAD)
    + subtitleBlock(fitTextOr(spec.subtitle, 13, titleMax), PAD, hasTitle);
  const meta = o.interactive
    ? `<metadata id="ktasks">${esc(JSON.stringify(spec.tasks))}</metadata>`
    : '';
  const bg = card(width, height, o.skin.rules.canvas === 'plain');
  const svg = svgDoc(
    width, height, 'kanban', o.version,
    spec.title ?? `kanban board, ${spec.columns.length} columns, ${spec.tasks.length} tasks`,
    { type: 'kanban', ...spec },
    o.skin,
    bg + meta + `<g id="kb">${head + parts.join('')}</g>`,
    o.tagQuery, 'kanban',
  );
  return { svg, version: o.version, cacheControl: o.cacheControl };
}

/**
 * `/draw/kanban` 入口:GET ?column=…&task=…&title=…
 */
export function renderKanbanFromUrl(url: URL, interactive = false): DrawResult {
  const params = url.searchParams;
  const d = params.get('d');
  const spec = d !== null && d !== ''
    ? parseKanbanSpec(d)
    : kanbanSpecFromParams(params);
  const v = Number.parseInt(params.get('v') ?? '', 10);
  const version = Number.isInteger(v) && v >= 1 ? v : 1;
  const skin = resolveSkin('sankey', params.get('t'), schemeParam(params));
  const hasW = params.get('w') !== null && params.get('w') !== '';
  const hasH = params.get('h') !== null && params.get('h') !== '';
  return renderKanban(spec, {
    spec,
    interactive,
    version,
    cacheControl: 'public, max-age=300',
    skin,
    ...(hasW ? { width: clampInt(params, 'w', 0, 200, 2400) } : {}),
    ...(hasH ? { height: clampInt(params, 'h', 0, 140, 2400) } : {}),
    tagQuery: url.search,
  });
}
