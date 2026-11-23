// /draw/journey —— 用户旅程:section 分段,每段一排任务(卡片)。
//
// 参数语法(扁平,可重复):
//   title=…            图题
//   subtitle=…         副标题
//   section=<段名>     一个段(按出现顺序);可重复
//   task=<段>|<任务>|<分数>|<参与者,…>  一个任务;可重复。
//                        分数是 1–5 的整数;参与者用逗号分隔(可省)。
//                        竖线是分隔符,字段里不能再写竖线。
//   w= / h=            画布尺寸;t= 皮肤家族;scheme= 明暗;v= 版本
//
// 画法:每个 section 一行(行首是段名),行里一排任务卡;卡上写任务名,
// 分数画成一个圆点 —— 圆点的大小随分数变大(1 分最小、5 分最大),颜色取皮肤色板;
// 参与者列在卡底(小字、弱色)。
import { ApiError } from '../specs/index.js';
import { resolveVersion, type VersionInfo } from '../version.js';
import { resolveSkin, type Skin } from '../styles/index.js';
import { card } from '../theme.js';
import { esc, r2, sVar, svgDoc, textW, titleBlock, subtitleBlock } from './svg.js';
import { clampInt, schemeParam, type DrawResult } from './query.js';

const PAD = 26;
const SEC_W = 96;      // 行首段名列宽(下限;实际按内容加宽)
const SEC_W_MAX = 168; // 行首段名列宽上限(名字太长就截断)
const CARD_H = 92;     // 任务卡高
const CARD_W = 176;    // 任务卡宽(基准)
const CARD_GAP = 16;
const SEC_GAP = 22;    // 段与段之间
const NAME_FS = 13;
const ACTOR_FS = 11;
const SEC_FS = 13;

const JR_EXAMPLE = 'section=Go to work&task=Go to work|Make tea|5|Me&task=Go to work|Go upstairs|3|Me&task=Go to work|Do work|1|Me,Cat';

/** 一个任务:名字 + 满意度分数(1–5)+ 参与者 */
export interface JourneyTask {
  name: string;
  /** 满意度分数 1–5 */
  score: number;
  /** 参与者 */
  actors: string[];
}

/** 一个段:名字 + 属于它的任务 */
export interface JourneySection {
  name: string;
  tasks: JourneyTask[];
}

/**
 * Journey data: a title, ordered sections, and the tasks inside each.
 */
export interface JourneySpec {
  title?: string;
  subtitle?: string;
  sections: JourneySection[];
}

function bad(detail: string): never {
  throw new ApiError(400, `journey: ${detail}. Example: /draw/journey?${JR_EXAMPLE}`);
}

/** task= 的一段拆成四段(段|任务|分数|参与者)。 */
const splitTask = (raw: string): [string, string, string, string] => {
  const f = raw.split('|');
  if (f.length < 3 || f.length > 4) {
    bad(`"task" must be "section|task|score[|actors]". Got: ${JSON.stringify(raw)}`);
  }
  return [f[0].trim(), f[1].trim(), f[2].trim(), (f[3] ?? '').trim()];
};

/**
 * Build a journey spec from flat URL params.
 *
 * `section=` declares the segments; `task=` attaches a task to one of them
 * with a satisfaction score of 1–5 and an optional actor list.
 *
 * @throws ApiError(400) with a corrective example on bad input
 */
export function journeySpecFromParams(params: URLSearchParams): JourneySpec {
  const spec: JourneySpec = { sections: [] };
  const title = params.get('title')?.trim();
  const subtitle = params.get('subtitle')?.trim();
  if (title) spec.title = title;
  if (subtitle) spec.subtitle = subtitle;
  const byName = new Map<string, JourneySection>();
  for (const name of params.getAll('section').map((s) => s.trim()).filter(Boolean)) {
    if (byName.has(name)) bad(`duplicate section ${JSON.stringify(name)}`);
    const sec: JourneySection = { name, tasks: [] };
    byName.set(name, sec);
    spec.sections.push(sec);
  }
  for (const raw of params.getAll('task')) {
    const [secName, name, scoreRaw, actorsRaw] = splitTask(raw);
    if (!name) bad(`"task" needs a name. Got: ${JSON.stringify(raw)}`);
    const sec = byName.get(secName);
    if (!sec) bad(`"task" refers to unknown section ${JSON.stringify(secName)}`);
    const score = Number(scoreRaw);
    if (!Number.isInteger(score) || score < 1 || score > 5) {
      bad(`"task" score must be an integer 1-5. Got: ${JSON.stringify(scoreRaw)}`);
    }
    const actors = actorsRaw.split(',').map((a) => a.trim()).filter(Boolean);
    sec.tasks.push({ name, score, actors });
  }
  if (!spec.sections.length) bad(`at least one "section=" is required`);
  if (!spec.sections.some((s) => s.tasks.length)) bad(`at least one "task=" is required`);
  return spec;
}

/**
 * Parse a journey spec from JSON.
 *
 * @throws ApiError(400) with a corrective example on bad input
 */
export function parseJourneySpec(raw: string): JourneySpec {
  if (!raw.trim()) bad(`empty spec`);
  let obj: unknown;
  try {
    obj = JSON.parse(raw);
  } catch {
    bad(`"d" is not valid JSON`);
  }
  const o = obj as Record<string, unknown>;
  const spec: JourneySpec = { sections: [] };
  if (o.title !== undefined) {
    if (typeof o.title !== 'string') bad(`"title" must be a string`);
    spec.title = o.title;
  }
  if (o.subtitle !== undefined) {
    if (typeof o.subtitle !== 'string') bad(`"subtitle" must be a string`);
    spec.subtitle = o.subtitle;
  }
  const secs = o.sections;
  if (!Array.isArray(secs) || !secs.length) bad(`"sections" must be a non-empty array`);
  for (const s of secs) {
    if (typeof s !== 'object' || s === null) bad(`each section must be an object`);
    const r = s as Record<string, unknown>;
    if (typeof r.name !== 'string' || !r.name.trim()) bad(`each section needs a "name"`);
    const tasks: JourneyTask[] = [];
    if (r.tasks !== undefined) {
      if (!Array.isArray(r.tasks)) bad(`section "${r.name}": "tasks" must be an array`);
      for (const t of r.tasks) {
        if (typeof t !== 'object' || t === null) bad(`section "${r.name}": each task must be an object`);
        const tr = t as Record<string, unknown>;
        if (typeof tr.name !== 'string' || !tr.name.trim()) bad(`section "${r.name}": each task needs a "name"`);
        const score = Number(tr.score);
        if (!Number.isInteger(score) || score < 1 || score > 5) {
          bad(`section "${r.name}": task score must be an integer 1-5 (got ${JSON.stringify(tr.score)})`);
        }
        let actors: string[] = [];
        if (tr.actors !== undefined) {
          if (!Array.isArray(tr.actors)) bad(`section "${r.name}": task "actors" must be an array`);
          actors = tr.actors.map((a) => String(a).trim()).filter(Boolean);
        }
        tasks.push({ name: tr.name, score, actors });
      }
    }
    spec.sections.push({ name: r.name.trim(), tasks });
  }
  if (!spec.sections.some((s) => s.tasks.length)) bad(`at least one task is required`);
  return spec;
}

/** 分数 → 圆点半径(1 分最小、5 分最大) */
const scoreR = (score: number): number => 5 + (score - 1) * 2.6;

/**
 * Render a journey diagram.
 */
export function renderJourney(spec: JourneySpec, o: {
  v: VersionInfo;
  skin: Skin;
  interactive: boolean;
  width?: number;
  height?: number;
  tagQuery?: string;
}): DrawResult {
  const nSeries = Math.max(1, o.skin.series.length);
  const hasTitle = !!spec.title;
  // 无标题也留 30px 角标带(Edit 胶囊在右上 y≈25–45,不留带会压住第一行卡片)
  const titleH = hasTitle ? 40 : 30;
  const subH = spec.subtitle ? 22 : 0;

  // 每段一行;行里的任务数最多是多少 → 卡宽按最挤的那行定
  const maxTasks = Math.max(1, ...spec.sections.map((s) => s.tasks.length));
  // 卡宽:至少装得下最宽的任务名(分两行)
  let cardW = CARD_W;
  for (const s of spec.sections) {
    for (const t of s.tasks) {
      const w = textW(t.name, NAME_FS);
      cardW = Math.max(cardW, Math.min(260, w + 32));
    }
  }
  // 段名列宽:按内容加宽,但封顶(名字太长就截断,不然卡片被挤到画布外)
  const secW = Math.min(
    SEC_W_MAX,
    Math.max(SEC_W, ...spec.sections.map((s) => textW(s.name, SEC_FS) + 24)),
  );

  const needW = PAD * 2 + secW + cardW * maxTasks + CARD_GAP * (maxTasks - 1);
  const width = o.width !== undefined ? Math.max(200, Math.min(2400, o.width)) : Math.min(Math.max(needW, 560), 2400);
  const rows = spec.sections.length;
  const needH = titleH + subH + PAD + rows * (CARD_H + SEC_GAP) + PAD;
  const height = o.height !== undefined ? Math.max(140, Math.min(2000, o.height)) : Math.min(Math.max(needH, 220), 2000);

  const parts: string[] = [];
  let y = titleH + subH + PAD;

  spec.sections.forEach((sec, si) => {
    const color = sVar(si % nSeries);
    // 段名:行首一列,竖直居中于这行任务
    const rowH = CARD_H;
    // 段名太长就截断(段名列宽是固定的,不能让字爬到卡片上去)
    let secName = sec.name;
    const maxSecW = secW - 20;
    if (textW(secName, SEC_FS) > maxSecW) {
      while (secName.length > 1 && textW(secName + '…', SEC_FS) > maxSecW) secName = secName.slice(0, -1);
      secName += '…';
    }
    // 段色的小竖条(在段名左边,不压字)
    parts.push(
      `<rect x="${PAD}" y="${r2(y + rowH / 2 - 18)}" width="4" height="36" rx="2" fill="${color}"/>`,
      `<text x="${r2(PAD + 12)}" y="${r2(y + rowH / 2 + SEC_FS / 3)}" font-size="${SEC_FS}" font-weight="600" fill="var(--d-ink)">${esc(secName)}</text>`,
      // 段行底下的一条细线(到这一行末尾),把段和卡片分开
      `<line x1="${PAD}" y1="${r2(y + rowH + 8)}" x2="${r2(width - PAD)}" y2="${r2(y + rowH + 8)}" stroke="var(--d-grid)" stroke-width="1"/>`,
    );

    sec.tasks.forEach((t, ti) => {
      const cx = PAD + secW + ti * (cardW + CARD_GAP);
      const tip = [t.name, `score ${t.score}/5`, ...t.actors].filter(Boolean).join(' · ');
      const ia = o.interactive ? ` data-node="${esc(t.name)}" data-tip="${esc(tip)}" tabindex="0"` : '';
      // 卡:白底 + 细边(与 gantt 的条不同,这里是「卡片」)
      parts.push(
        `<rect x="${r2(cx)}" y="${r2(y)}" width="${r2(cardW)}" height="${CARD_H}" rx="10" fill="var(--d-card)" stroke="var(--d-border)" stroke-width="1"${ia}/>`,
      );
      // 任务名(左对齐,超宽就截断);右边给分数圆点留一格
      const dotR = 13;
      const maxNameW = cardW - 28 - dotR * 2 - 12;
      let name = t.name;
      if (textW(name, NAME_FS) > maxNameW) {
        while (name.length > 1 && textW(name + '…', NAME_FS) > maxNameW) name = name.slice(0, -1);
        name += '…';
      }
      parts.push(
        `<text x="${r2(cx + 14)}" y="${r2(y + 26)}" font-size="${NAME_FS}" font-weight="600" fill="var(--d-ink)"${ia}>${esc(name)}</text>`,
      );
      // 分数圆点:大小随分数;颜色取皮肤色板(不硬编码红绿)
      const r = scoreR(t.score);
      const dotCx = cx + cardW - 14 - dotR;
      const dotCy = y + 26;
      // 底圈:把 1–5 的量程画出来(灰底),点落在量程上
      parts.push(
        `<circle cx="${r2(dotCx)}" cy="${r2(dotCy)}" r="${dotR}" fill="none" stroke="var(--d-grid)" stroke-width="1"/>`,
      );
      parts.push(
        `<circle cx="${r2(dotCx)}" cy="${r2(dotCy)}" r="${r2(r)}" fill="${color}"${ia}/>`,
      );
      // 分数数字:圆点下面一行(贴着卡右边,不越出卡)
      parts.push(
        `<text x="${r2(dotCx)}" y="${r2(y + 26 + dotR + 14)}" text-anchor="middle" font-size="11" fill="var(--d-muted)">${t.score}/5</text>`,
      );
      // 参与者:卡底一行(小字、弱色),多个用「·」隔开
      if (t.actors.length) {
        const actors = t.actors.join(' · ');
        parts.push(
          `<text x="${r2(cx + 14)}" y="${r2(y + CARD_H - 16)}" font-size="${ACTOR_FS}" fill="var(--d-muted)">${esc(actors)}</text>`,
        );
      }
    });
    y += CARD_H + SEC_GAP;
  });

  const titleSvg = titleBlock(spec.title, PAD) + subtitleBlock(spec.subtitle, PAD, hasTitle);
  const canvas = card(width, height, o.skin.rules.canvas !== 'card');

  let metaSvg = '';
  if (o.interactive) {
    const data = {
      title: spec.title,
      sections: spec.sections.map((s) => ({
        name: s.name,
        tasks: s.tasks.map((t) => ({ name: t.name, score: t.score, actors: t.actors })),
      })),
    };
    metaSvg = `<metadata id="jtasks">${esc(JSON.stringify(data))}</metadata>`;
  }
  const iStyle = o.interactive
    ? `<style>#jr [data-node]{cursor:pointer;transition:filter .12s ease}` +
      `#jr [data-node]:hover{filter:brightness(1.05)}</style>`
    : '';

  const specOut = {
    type: 'journey' as const,
    ...(spec.title ? { title: spec.title } : {}),
    ...(spec.subtitle ? { subtitle: spec.subtitle } : {}),
    sections: spec.sections.map((s) => ({
      name: s.name,
      tasks: s.tasks.map((t) => ({ name: t.name, score: t.score, actors: t.actors })),
    })),
  };
  const svg = svgDoc(
    width, height, 'journey', o.v.version,
    spec.title ?? `journey, ${spec.sections.reduce((a, s) => a + s.tasks.length, 0)} tasks`,
    specOut, o.skin,
    `${canvas}${metaSvg}${iStyle}<g id="jr">${titleSvg}${parts.join('')}</g>`,
    o.tagQuery, 'journey',
  );
  return { svg, version: o.v.version, cacheControl: o.v.cacheControl };
}

/**
 * `/draw/journey` entry: GET ?title=…&section=…&task=…
 */
export function renderJourneyFromUrl(url: URL, interactive = false): DrawResult {
  const params = url.searchParams;
  const d = params.get('d');
  const spec = d !== null && d !== '' ? parseJourneySpec(d) : journeySpecFromParams(params);
  const v = resolveVersion(params.get('v'));
  const skin = resolveSkin('sankey', params.get('t'), schemeParam(params));
  const width = clampInt(params, 'w', 0, 200, 2400);
  const height = clampInt(params, 'h', 0, 140, 2000);
  return renderJourney(spec, {
    v, skin, interactive,
    width: params.has('w') ? width : undefined,
    height: params.has('h') ? height : undefined,
    tagQuery: url.search,
  });
}
