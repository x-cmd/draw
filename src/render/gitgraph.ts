// /draw/gitgraph —— 提交图:分支是泳道,提交是泳道上的点,时间往下走。
//
// 模型(扁平 URL 参数,手写也能写对):
//   branch=<名字>            可重复 —— 分支(泳道),按出现顺序自上而下排
//   commit=<id>|<lane>|<label>|<p1>|<p2>   可重复 —— 一个提交
//        id     提交 id(可省,省了自动编号)
//        lane   所在分支(必须是某个 branch= 的名字)
//        label  提交信息(可省)
//        p1/p2  父提交的 id(可省;两个都有 = 合并提交)
//   title= / subtitle=        图题与副题
//
// 画法:每个分支一条横向泳道(带名字的框),提交画成点;
// 普通父子关系 = 竖线;合并的第二父 = 一条弯过去的曲线(虚线 + 箭头),
// 一眼能看出「谁并进了谁」。
import { ApiError } from '../specs/index.js';
import { BASELINE } from '../styles/baseline.js';
import { resolveSkin } from '../styles/index.js';
import { clampInt, schemeParam, type DrawResult } from './query.js';
import { card } from '../theme.js';
import { esc, r2, subtitleBlock, svgDoc, textW, titleBlock } from './svg.js';

const PAD = 26;
const LANE_H = 76;        // 一条泳道(一个分支)的高度
const HEAD_H = 34;        // 泳道名字条的高度
const DOT_R = 7;          // 提交点的半径
const ROW_GAP = 14;       // 同一泳道里两个提交点之间的额外间距
const LABEL_FS = BASELINE.pointName;
const LABEL_GAP = 12;     // 提交文字离点的距离
const CHANNEL_MIN = 26;   // 绕行通道的最小宽度(跨泳道的曲线走这里)

const EXAMPLE =
  'branch=main&branch=develop&commit=one|main|First commit||&commit=two|develop|Feature work||&commit=three|main|Merge develop|one|two';

function bad(detail: string): never {
  throw new ApiError(400, `${detail}. Example: /draw/gitgraph?${EXAMPLE}`);
}

/** 一个提交 */
export interface GitCommit {
  id: string;
  /** 所在分支(泳道)名 */
  lane: string;
  /** 提交信息 */
  label?: string;
  /** 父提交 id(第一个) */
  parent?: string;
  /** 第二父(合并提交才有) */
  parent2?: string;
}

/** 提交图规格 */
export interface GitGraphSpec {
  title?: string;
  subtitle?: string;
  /** 分支名(泳道),按顺序 */
  branches: string[];
  /** 提交(按时间顺序) */
  commits: GitCommit[];
}

/** 从扁平 URL 参数造规格(参数已 decode) */
export function gitGraphSpecFromParams(params: URLSearchParams): GitGraphSpec {
  const branches = params.getAll('branch').map((b) => b.trim()).filter((b) => b !== '');
  const commits: GitCommit[] = [];
  params.getAll('commit').forEach((raw, i) => {
    const f = raw.split('|').map((x) => x.trim());
    if (f.length < 2) {
      bad(`"commit" #${i + 1} must be "id|lane[|label][|parent][|parent2]"`);
    }
    commits.push({
      id: f[0] || `c${i + 1}`,
      lane: f[1],
      ...(f[2] ? { label: f[2] } : {}),
      ...(f[3] ? { parent: f[3] } : {}),
      ...(f[4] ? { parent2: f[4] } : {}),
    });
  });
  const title = params.get('title')?.trim() || undefined;
  const subtitle = params.get('subtitle')?.trim() || undefined;
  return { ...(title ? { title } : {}), ...(subtitle ? { subtitle } : {}), branches, commits };
}

/**
 * 解析并校验提交图规格(JSON 形态,给 ?d= 用)。
 *
 * @throws ApiError(400) with a corrective example on bad input
 */
export function parseGitGraphSpec(raw: string | null): GitGraphSpec {
  if (raw === null || raw === '') {
    bad(`missing data. Use /draw/gitgraph?${EXAMPLE}`);
  }
  let obj: unknown;
  try {
    obj = JSON.parse(raw);
  } catch {
    bad(`"d" is not valid JSON. Use {"branches":["main"],"commits":[{"id":"a","lane":"main"}]}`);
  }
  const o = obj as Record<string, unknown>;
  if (!Array.isArray(o.branches) || o.branches.length === 0) {
    bad(`"branches" must be a non-empty array of branch names`);
  }
  const branches: string[] = [];
  for (const b of o.branches as unknown[]) {
    if (typeof b !== 'string' || b.trim() === '') bad(`"branches" entries must be non-empty strings`);
    branches.push(b.trim());
  }
  if (!Array.isArray(o.commits) || o.commits.length === 0) {
    bad(`"commits" must be a non-empty array of commits`);
  }
  const commits: GitCommit[] = (o.commits as unknown[]).map((c, i) => {
    if (typeof c !== 'object' || c === null) bad(`"commits"[${i}] must be an object`);
    const cc = c as Record<string, unknown>;
    const id = typeof cc.id === 'string' && cc.id !== '' ? cc.id : `c${i + 1}`;
    const lane = typeof cc.lane === 'string' ? cc.lane : '';
    if (!lane) bad(`"commits"[${i}].lane is required (a branch name)`);
    if (!branches.includes(lane)) bad(`"commits"[${i}].lane "${lane}" is not one of the branches`);
    const label = typeof cc.label === 'string' && cc.label !== '' ? cc.label : undefined;
    const parent = typeof cc.parent === 'string' && cc.parent !== '' ? cc.parent : undefined;
    const parent2 = typeof cc.parent2 === 'string' && cc.parent2 !== '' ? cc.parent2 : undefined;
    return { id, lane, ...(label ? { label } : {}), ...(parent ? { parent } : {}), ...(parent2 ? { parent2 } : {}) };
  });
  const ids = new Set(commits.map((c) => c.id));
  for (const c of commits) {
    for (const p of [c.parent, c.parent2]) {
      if (p && !ids.has(p)) bad(`commit "${c.id}" references unknown parent "${p}"`);
    }
  }
  const title = typeof o.title === 'string' && o.title !== '' ? o.title : undefined;
  const subtitle = typeof o.subtitle === 'string' && o.subtitle !== '' ? o.subtitle : undefined;
  return { ...(title ? { title } : {}), ...(subtitle ? { subtitle } : {}), branches, commits };
}

/** 泳道布局:每个分支一条带子,提交点自上而下 */
interface Lane {
  name: string;
  index: number;
  y: number;         // 泳道顶
  h: number;         // 泳道高
  axisX: number;     // 泳道中轴(提交点所在的 x)
  color: string;
}

interface Placed extends GitCommit {
  x: number;
  y: number;
  row: number;       // 在本泳道里的第几行
}

const LANE_COLORS = ['var(--d-s1)', 'var(--d-s2)', 'var(--d-s3)', 'var(--d-s4)', 'var(--d-s5)', 'var(--d-s6)', 'var(--d-s7)', 'var(--d-s8)', 'var(--d-s9)', 'var(--d-s10)'];

/** 文字截到能放进 maxW(超了就加省略号)—— 标题不许压到右上角的 Edit 角标 */
function fitText(s: string | undefined, fs: number, maxW: number): string | undefined {
  if (!s) return s;
  if (textW(s, fs) <= maxW) return s;
  let t = s;
  while (t.length > 1 && textW(`${t}…`, fs) > maxW) t = t.slice(0, -1);
  return `${t}…`;
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

export interface GitGraphOpts {
  spec: GitGraphSpec;
  interactive: boolean;
  version: number;
  cacheControl: string;
  skin: ReturnType<typeof resolveSkin>;
  /** 画布宽度上限:?w= 给了就按它画(内容仍按自然尺寸排) */
  width?: number;
  /** 画布高度上限:?h= 给了就按它画 */
  height?: number;
  minW?: number;
  minH?: number;
  tagQuery?: string;
}

/**
 * 渲染提交图。
 */
export function renderGitGraph(spec: GitGraphSpec, o: GitGraphOpts): DrawResult {
  if (!spec.branches.length) bad('at least one branch is required');
  if (!spec.commits.length) bad('at least one commit is required');
  const laneNames = new Set(spec.branches);
  for (const c of spec.commits) {
    if (!laneNames.has(c.lane)) bad(`commit "${c.id}" is on unknown branch "${c.lane}"`);
  }

  // 泳道高度:每个分支里最多几个提交 → 决定这条泳道要多高
  const perLane = new Map<string, GitCommit[]>();
  for (const c of spec.commits) {
    const arr = perLane.get(c.lane) ?? [];
    arr.push(c);
    perLane.set(c.lane, arr);
  }

  const titleH = spec.title || spec.subtitle ? 44 : 30; // 没标题也留一条带:右上角那枚角标在那儿
  const hasTitle = !!spec.title;

  // 泳道的左右留白:
  //   左边 = 分支名槽(名字贴在最左)
  //   再往右 = 「绕行通道」(合并曲线走这里,不压文字)
  //   再往右 = 提交轴(点在这一列) + 提交文字
  const laneNameW = Math.max(56, ...spec.branches.map((b) => textW(b, 12) + 26));
  const laneTextW = Math.max(
    0,
    ...spec.commits.map((c) => (c.label ? textW(c.label, LABEL_FS) : 0)),
  );
  const gutterR = PAD + laneNameW;         // 名字槽的右缘

  // 绕行通道要站得下几条曲线:先数一数有几条「跨泳道」的边(普通边 + 合并边),
  // 通道按条数加宽,每条曲线在通道里各占一格(不压在彼此身上)。
  const crossEdges = spec.commits.filter((c) => {
    const from = c.parent ? spec.commits.find((x) => x.id === c.parent) : undefined;
    return !!from && from.lane !== c.lane;
  }).length + spec.commits.filter((c) => !!c.parent2).length;
  const channelSlots = Math.max(1, crossEdges);
  const channelW = Math.max(CHANNEL_MIN, channelSlots * 11 + 8);

  const channelX = gutterR + channelW / 2; // 绕行通道的中线
  const axisX = gutterR + channelW + DOT_R;
  const laneW = Math.max(
    220,
    axisX + DOT_R + LABEL_GAP + laneTextW + PAD,
  );

  const lanes: Lane[] = [];
  let y = PAD + titleH;
  spec.branches.forEach((name, i) => {
    const n = perLane.get(name)?.length ?? 0;
    const h = HEAD_H + Math.max(n, 1) * (DOT_R * 2 + ROW_GAP) + 10;
    lanes.push({
      name,
      index: i,
      y,
      h,
      axisX,
      color: LANE_COLORS[i % LANE_COLORS.length],
    });
    y += h + 12;
  });
  const bodyBottom = y - 12;

  // 提交点:每个泳道里自上而下排
  const placed: Placed[] = [];
  for (const lane of lanes) {
    const list = perLane.get(lane.name) ?? [];
    list.forEach((c, row) => {
      placed.push({
        ...c,
        x: lane.axisX,
        y: lane.y + HEAD_H + DOT_R + 6 + row * (DOT_R * 2 + ROW_GAP),
        row,
      });
    });
  }
  const posOf = new Map(placed.map((p) => [p.id, p]));
  const laneOf = new Map(lanes.map((l) => [l.name, l]));

  // 画布:?w=/?h= 给了就按它画(内容仍是自然尺寸,摆在左上角);
  // 没给就用自然尺寸。
  let width = o.width !== undefined ? o.width : PAD * 2 + laneW;
  let height = o.height !== undefined ? o.height : bodyBottom + PAD;
  width = Math.max(width, PAD * 2 + laneW, o.minW ?? 0);
  height = Math.max(height, bodyBottom + PAD, o.minH ?? 0);

  const parts: string[] = [];

  // 泳道:淡底 + 边框 + 左侧的名字槽
  for (const lane of lanes) {
    const lw = laneNameW - 16;
    parts.push(
      `<g data-lane="${esc(lane.name)}">` +
      `<rect x="${r2(PAD)}" y="${r2(lane.y)}" width="${r2(laneW)}" height="${r2(lane.h)}" rx="12" fill="${lane.color}" fill-opacity="0.05" stroke="${lane.color}" stroke-opacity="0.42" stroke-width="1.2"/>` +
      // 名字槽:一条竖线分界,名字在竖线左边(线只画上半截 —— 名字在那儿)
      `<line x1="${r2(gutterR)}" y1="${r2(lane.y + 8)}" x2="${r2(gutterR)}" y2="${r2(lane.y + 34)}" stroke="${lane.color}" stroke-opacity="0.32" stroke-width="1"/>` +
      `<rect x="${r2(PAD + 8)}" y="${r2(lane.y + 9)}" width="${r2(lw)}" height="21" rx="6" fill="${lane.color}" fill-opacity="0.16"/>` +
      `<text x="${r2(PAD + 8 + lw / 2)}" y="${r2(lane.y + 24)}" text-anchor="middle" font-size="12" font-weight="600" fill="${lane.color}">${esc(lane.name)}</text>` +
      `</g>`,
    );
  }

  // 跨泳道的曲线各占通道里的一格(两条线不许压在同一条道上)。
  // 按「垂直跨度」分格:不相交的曲线可以共用一格,相交的才分开。
  const slots: { y0: number; y1: number; x: number }[] = [];
  const slotW = channelSlots > 1 ? (channelW - 16) / (channelSlots - 1) : 0;
  const slotLeft = channelX - (channelSlots > 1 ? (channelSlots - 1) * slotW : 0) / 2;
  /** 给一条跨泳道曲线找一格:找一条与它垂直跨度不相交的现成格,没有就新开一格 */
  const slotX = (y0: number, y1: number): number => {
    const lo = Math.min(y0, y1);
    const hi = Math.max(y0, y1);
    for (const s of slots) {
      if (hi < s.y0 - 4 || lo > s.y1 + 4) return s.x; // 垂直跨度不相交 → 共用
    }
    const x = slotLeft + slotW * slots.length;
    slots.push({ y0: lo, y1: hi, x });
    return x;
  };

  // 合并边(第二父):先画,压在普通边下面。
  // 走「绕行通道」:从源点左侧出发、贴着通道往下走、再从目标点左边进箭头。
  // 通道是专属的空档 —— 从点与点之间直穿会把竖线和文字全划乱。
  for (const c of placed) {
    if (!c.parent2) continue;
    const from = posOf.get(c.parent2);
    const lane = laneOf.get(c.lane)!;
    if (!from) continue;
    const to = c;
    const cx = slotX(from.y, to.y);
    const d =
      `M${r2(from.x - DOT_R - 1)} ${r2(from.y)}` +
      `C${r2(cx)} ${r2(from.y)},${r2(cx)} ${r2(to.y)},${r2(to.x - DOT_R - 4)} ${r2(to.y)}`;
    const stroke = lane.color;
    const ia = ` data-from="${esc(from.id)}" data-to="${esc(to.id)}" data-merge="1"`;
    parts.push(
      `<path d="${d}" fill="none" stroke="${stroke}" stroke-opacity="0.9" stroke-width="1.8" stroke-dasharray="7 4" stroke-linecap="round"${ia}/>`,
      // 箭头(指向目标)
      `<path d="M${r2(to.x - DOT_R - 5)} ${r2(to.y)}L${r2(to.x - DOT_R)} ${r2(to.y - 4)}M${r2(to.x - DOT_R - 5)} ${r2(to.y)}L${r2(to.x - DOT_R)} ${r2(to.y + 4)}" fill="none" stroke="${stroke}" stroke-opacity="0.9" stroke-width="1.6"/>`,
    );
  }

  // 普通父子边:同泳道内是竖线,跨泳道是走通道的曲线(避开右侧的文字)
  for (const c of placed) {
    if (!c.parent) continue;
    const from = posOf.get(c.parent);
    if (!from) continue;
    const lane = laneOf.get(c.lane)!;
    const stroke = lane.color;
    const ia = o.interactive ? ` data-from="${esc(from.id)}" data-to="${esc(c.id)}"` : '';
    if (from.lane === c.lane) {
      parts.push(
        `<line x1="${r2(from.x)}" y1="${r2(from.y + DOT_R)}" x2="${r2(c.x)}" y2="${r2(c.y - DOT_R)}" stroke="${stroke}" stroke-opacity="0.8" stroke-width="1.6"${ia}/>`,
      );
    } else {
      const cx = slotX(from.y, c.y);
      const d = `M${r2(from.x - DOT_R - 1)} ${r2(from.y)}C${r2(cx)} ${r2(from.y)},${r2(cx)} ${r2(c.y)},${r2(c.x - DOT_R - 4)} ${r2(c.y)}`;
      parts.push(
        `<path d="${d}" fill="none" stroke="${stroke}" stroke-opacity="0.7" stroke-width="1.4" stroke-linecap="round"${ia}/>`,
        `<path d="M${r2(c.x - DOT_R - 5)} ${r2(c.y)}L${r2(c.x - DOT_R)} ${r2(c.y - 4)}M${r2(c.x - DOT_R - 5)} ${r2(c.y)}L${r2(c.x - DOT_R)} ${r2(c.y + 4)}" fill="none" stroke="${stroke}" stroke-opacity="0.7" stroke-width="1.4"/>`,
      );
    }
  }

  // 提交点 + 文字
  for (const c of placed) {
    const lane = laneOf.get(c.lane)!;
    const isMerge = !!c.parent2;
    const tip = [c.id, c.label, c.lane].filter(Boolean).join(' · ');
    const ia = o.interactive ? ` data-node="${esc(c.id)}" data-tip="${esc(tip)}" tabindex="0" style="cursor:pointer"` : '';
    parts.push(
      `<g${ia}>` +
      `<circle cx="${r2(c.x)}" cy="${r2(c.y)}" r="${DOT_R}" fill="${lane.color}" stroke="var(--d-card)" stroke-width="2"/>` +
      (isMerge ? `<circle cx="${r2(c.x)}" cy="${r2(c.y)}" r="${DOT_R - 3.5}" fill="var(--d-card)"/>` : '') +
      `</g>`,
    );
    if (c.label) {
      parts.push(
        `<text x="${r2(c.x + DOT_R + LABEL_GAP)}" y="${r2(c.y + 4)}" font-size="${LABEL_FS}" fill="var(--d-text)"${o.interactive ? ` data-node="${esc(c.id)}" style="cursor:pointer"` : ''}>${esc(c.label)}</text>`,
      );
    }
  }

  const titleMax = Math.max(60, width - PAD - editTagReserve(width));
  const head = titleBlock(fitText(spec.title, 18, titleMax), PAD)
    + subtitleBlock(fitText(spec.subtitle, 13, titleMax), PAD, hasTitle);
  const meta = o.interactive
    ? `<metadata id="gcommits">${esc(JSON.stringify(spec.commits))}</metadata>`
    : '';
  const bg = card(width, height, o.skin.rules.canvas === 'plain');
  const svg = svgDoc(
    width, height, 'gitgraph', o.version,
    spec.title ?? `git graph, ${spec.branches.length} branches, ${spec.commits.length} commits`,
    { type: 'gitgraph', ...spec },
    o.skin,
    bg + meta + `<g id="gg">${head + parts.join('')}</g>`,
    o.tagQuery, 'gitgraph',
  );
  return { svg, version: o.version, cacheControl: o.cacheControl };
}

/**
 * `/draw/gitgraph` 入口:GET ?branch=…&commit=…&title=…
 */
export function renderGitGraphFromUrl(url: URL, interactive = false): DrawResult {
  const params = url.searchParams;
  const d = params.get('d');
  const spec = d !== null && d !== ''
    ? parseGitGraphSpec(d)
    : gitGraphSpecFromParams(params);
  const v = Number.parseInt(params.get('v') ?? '', 10);
  const version = Number.isInteger(v) && v >= 1 ? v : 1;
  const skin = resolveSkin('sankey', params.get('t'), schemeParam(params));
  const hasW = params.get('w') !== null && params.get('w') !== '';
  const hasH = params.get('h') !== null && params.get('h') !== '';
  return renderGitGraph(spec, {
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
