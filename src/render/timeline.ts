// /draw/timeline —— 时间线:一条横轴,若干 section(时期),每个 section 挂着若干事件。
//
// 参数语法(扁平,可重复):
//   title=…            图题
//   subtitle=…         副标题
//   section=<时期名>   一个 section(按出现顺序);可重复
//   event=<段>|<事件>|<时期文字>   一个事件;可重复。段名必须是某个 section;
//                        时期文字可省(留空串即可)。竖线是分隔符,字段里不能再写竖线。
//   w= / h=            画布尺寸;t= 皮肤家族;scheme= 明暗;v= 版本
//
// 画法:一根横轴贯穿画布,section 依次排开;每个 section 一个淡色带(带自己的名字),
// 事件是轴上的一个圆点 + 标签(标签在轴上方/下方交替,免得挤在一起)。
// 事件的时期文字(若有)用小字贴在事件名旁边。
import { ApiError } from '../specs/index.js';
import { resolveVersion, type VersionInfo } from '../version.js';
import { resolveSkin, type Skin } from '../styles/index.js';
import { card } from '../theme.js';
import { esc, r2, sVar, svgDoc, textW, titleBlock, subtitleBlock } from './svg.js';
import { clampInt, schemeParam, type DrawResult } from './query.js';

const PAD = 26;
const AXIS_FS = 13;      // 事件名字号
const SUB_FS = 10;       // 时期文字字号
const SEC_FS = 12;       // section 名字号
const DOT_R = 6;         // 事件圆点半径
const MIN_SLOT = 96;     // 两个事件之间至少留这么宽(不然标签压在一起)

const TL_EXAMPLE =
  'section=2002&event=2002|LinkedIn|Founded&event=2002|Facebook|Founded&section=2004&event=2004|Google|Acquired YouTube&event=2004|Facebook|Launched';

/** 一个事件:名字 + 可选的时期文字 */
export interface TimelineEvent {
  /** 事件名 */
  name: string;
  /** 时期文字(可省)—— 事件的「副标」,例如 Founded */
  period?: string;
}

/** 一个 section(时期):名字 + 属于它的事件 */
export interface TimelineSection {
  /** 时期名 */
  name: string;
  events: TimelineEvent[];
}

/**
 * Timeline data: a title, ordered sections, and the events inside each.
 */
export interface TimelineSpec {
  title?: string;
  subtitle?: string;
  sections: TimelineSection[];
}

function bad(detail: string): never {
  throw new ApiError(400, `timeline: ${detail}. Example: /draw/timeline?${TL_EXAMPLE}`);
}

/** 把 event= 的一段拆成三段(段|事件|时期)。竖线是分隔符,字段里不能再有竖线。 */
const splitEvent = (raw: string): [string, string, string] => {
  const f = raw.split('|');
  if (f.length < 2 || f.length > 3) {
    bad(`"event" must be "section|event[|period]". Got: ${JSON.stringify(raw)}`);
  }
  return [f[0].trim(), f[1].trim(), (f[2] ?? '').trim()];
};

/**
 * Build a timeline spec from flat URL params.
 *
 * `section=` declares the periods (order matters); `event=` attaches an event
 * to one of them.
 *
 * @throws ApiError(400) with a corrective example on bad input
 */
export function timelineSpecFromParams(params: URLSearchParams): TimelineSpec {
  const sectionNames = params.getAll('section').map((s) => s.trim()).filter(Boolean);
  const spec: TimelineSpec = { sections: [] };
  const title = params.get('title')?.trim();
  const subtitle = params.get('subtitle')?.trim();
  if (title) spec.title = title;
  if (subtitle) spec.subtitle = subtitle;
  const byName = new Map<string, TimelineSection>();
  for (const name of sectionNames) {
    if (byName.has(name)) bad(`duplicate section ${JSON.stringify(name)}`);
    const sec: TimelineSection = { name, events: [] };
    byName.set(name, sec);
    spec.sections.push(sec);
  }
  for (const raw of params.getAll('event')) {
    const [secName, name, period] = splitEvent(raw);
    if (!name) bad(`"event" needs a name. Got: ${JSON.stringify(raw)}`);
    const sec = byName.get(secName);
    if (!sec) bad(`"event" refers to unknown section ${JSON.stringify(secName)}`);
    sec.events.push({ name, ...(period ? { period } : {}) });
  }
  if (!spec.sections.length) bad(`at least one "section=" is required`);
  if (!spec.sections.some((s) => s.events.length)) bad(`at least one "event=" is required`);
  return spec;
}

/**
 * Parse a timeline spec from JSON.
 *
 * @throws ApiError(400) with a corrective example on bad input
 */
export function parseTimelineSpec(raw: string): TimelineSpec {
  if (!raw.trim()) bad(`empty spec`);
  let obj: unknown;
  try {
    obj = JSON.parse(raw);
  } catch {
    bad(`"d" is not valid JSON`);
  }
  const o = obj as Record<string, unknown>;
  const spec: TimelineSpec = { sections: [] };
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
    const events: TimelineEvent[] = [];
    if (r.events !== undefined) {
      if (!Array.isArray(r.events)) bad(`section "${r.name}": "events" must be an array`);
      for (const e of r.events) {
        if (typeof e === 'string') {
          events.push({ name: e });
          continue;
        }
        if (typeof e !== 'object' || e === null) bad(`section "${r.name}": each event must be an object or a string`);
        const er = e as Record<string, unknown>;
        if (typeof er.name !== 'string' || !er.name.trim()) bad(`section "${r.name}": each event needs a "name"`);
        const period = er.period;
        if (period !== undefined && typeof period !== 'string') bad(`section "${r.name}": event "period" must be a string`);
        events.push({ name: er.name, ...(period ? { period } : {}) });
      }
    }
    spec.sections.push({ name: r.name.trim(), events });
  }
  if (!spec.sections.some((s) => s.events.length)) bad(`at least one event is required`);
  return spec;
}

/** 一个事件在轴上的落点与它的标签盒 */
interface Placed {
  sec: TimelineSection;
  ev: TimelineEvent;
  x: number;
  labelW: number;   // 标签文字宽(事件名)
  subW: number;     // 时期文字宽
  above: boolean;   // 标签在轴上方还是下方
}

/**
 * Render a timeline diagram.
 */
export function renderTimeline(spec: TimelineSpec, o: {
  v: VersionInfo;
  skin: Skin;
  interactive: boolean;
  width?: number;
  height?: number;
  tagQuery?: string;
}): DrawResult {
  const evs = spec.sections.flatMap((s) => s.events.map((e) => ({ sec: s, ev: e })));
  const nSeries = Math.max(1, o.skin.series.length);

  const hasTitle = !!spec.title;
  // 无标题也留 30px 角标带(Edit 胶囊在右上 y≈25–45,不留带会压住上排标签)
  const titleH = hasTitle ? 40 : 30;
  const subH = spec.subtitle ? 22 : 0;

  // 每个事件占多宽(按最宽的标签 + 余量),取最大者当统一槽宽 —— 均匀比挤在一头好读
  const slotW = Math.max(
    MIN_SLOT,
    ...evs.map(({ ev }) => Math.max(textW(ev.name, AXIS_FS), ev.period ? textW(ev.period, SUB_FS) : 0) + 28),
  );

  const axisY = 0; // 相对内容区的轴 y(下面再补)
  const needW = PAD * 2 + slotW * evs.length;
  const width = o.width !== undefined ? Math.max(200, Math.min(2400, o.width)) : Math.min(Math.max(needW, 560), 2400);
  // 标签上下两排:每排两行(事件名 + 时期文字)
  const rowH = AXIS_FS + SUB_FS + 16;
  const needH = titleH + subH + PAD + rowH * 2 + 56;
  const height = o.height !== undefined ? Math.max(140, Math.min(2000, o.height)) : Math.min(Math.max(needH, 220), 2000);

  // 轴的两端留出半个标签宽 —— 标签是居中挂在点上的,不然首尾标签会出画布
  const halfLabel = Math.ceil(slotW / 2) + 4;
  const x0 = Math.min(PAD + halfLabel, width / 2);
  const x1 = Math.max(width - PAD - halfLabel, width / 2);
  // 均匀铺开:事件按顺序等距落点(两端贴边)
  const step = evs.length > 1 ? (x1 - x0) / (evs.length - 1) : 0;
  const placed: Placed[] = evs.map((it, i) => {
    const x = evs.length > 1 ? x0 + i * step : (x0 + x1) / 2;
    return {
      sec: it.sec,
      ev: it.ev,
      x,
      labelW: textW(it.ev.name, AXIS_FS),
      subW: it.ev.period ? textW(it.ev.period, SUB_FS) : 0,
      above: i % 2 === 0,
    };
  });

  const axisYAbs = titleH + subH + PAD + rowH;  // 轴本身
  const bandTop = axisYAbs + rowH + 18;        // section 带
  const parts: string[] = [];

  // section 带:每个 section 一段淡色底(自己的一段),段名贴在自己的带子中间
  // 分段边界:按事件的段号切
  const secRanges: { sec: TimelineSection; from: number; to: number }[] = [];
  placed.forEach((p, i) => {
    const last = secRanges[secRanges.length - 1];
    if (last && last.sec === p.sec) last.to = i;
    else secRanges.push({ sec: p.sec, from: i, to: i });
  });
  const bandH = 26;
  secRanges.forEach((sr, i) => {
    const from = placed[sr.from].x;
    const to = placed[sr.to].x;
    const bx = Math.max(x0 - 22, from - 26);
    const bw = Math.min(x1 + 22, to + 26) - bx;
    if (bw <= 0) return;
    const c = sVar(i % nSeries);
    parts.push(
      `<rect x="${r2(bx)}" y="${r2(bandTop)}" width="${r2(bw)}" height="${bandH}" rx="6" fill="${c}" fill-opacity="0.07"/>`,
      // 段名下沿一条细线,把段和轴分开
      `<line x1="${r2(bx)}" y1="${r2(bandTop + bandH)}" x2="${r2(bx + bw)}" y2="${r2(bandTop + bandH)}" stroke="${c}" stroke-opacity="0.5" stroke-width="1.4"/>`,
    );
    // 段名:带子中间;太宽就压扁,窄了放不下就竖着写不现实 —— 改放带子上方一行
    const nameW = textW(sr.sec.name, SEC_FS);
    if (nameW + 12 <= bw) {
      parts.push(
        `<text x="${r2(bx + bw / 2)}" y="${r2(bandTop + bandH / 2 + 4)}" text-anchor="middle" font-size="${SEC_FS}" font-weight="600" fill="var(--d-ink)">${esc(sr.sec.name)}</text>`,
      );
    } else {
      parts.push(
        `<text x="${r2(bx + bw / 2)}" y="${r2(bandTop - 6)}" text-anchor="middle" font-size="${SEC_FS}" font-weight="600" fill="var(--d-ink)">${esc(sr.sec.name)}</text>`,
      );
    }
    // 段色的小方点:段名左边的色点,和带子同色(带子太淡,色点给个锚)
    parts.push(
      `<circle cx="${r2(bx + bw / 2 - nameW / 2 - 9)}" cy="${r2(bandTop + bandH / 2)}" r="3.5" fill="${c}"/>`,
    );
  });

  // 轴
  parts.push(
    `<line x1="${r2(x0)}" y1="${r2(axisYAbs)}" x2="${r2(x1)}" y2="${r2(axisYAbs)}" stroke="var(--d-baseline)" stroke-width="1.5"/>`,
  );

  // 事件:圆点 + 引线 + 标签(名字在上/下交替;时期文字在名字下面一行)
  placed.forEach((p, i) => {
    const color = sVar(secRanges.findIndex((sr) => sr.sec === p.sec) % nSeries);
    const tip = [p.ev.name, p.ev.period, p.sec.name].filter(Boolean).join(' · ');
    const ia = o.interactive ? ` data-node="${esc(p.ev.name)}" data-tip="${esc(tip)}" tabindex="0"` : '';
    // 标签两行:名字(粗)+ 时期文字(小、弱色)。两排都按「上到下 = 名字、时期」排 ——
    // 轴上方那一排是向上长的,所以名字在外(上)、时期靠轴。
    const dir = p.above ? -1 : 1;
    const gap = 16; // 轴到标签块的距离
    // 名字基线:上面一排的名字在最外侧,下面一排的名字在最内侧
    const nameY = p.above ? axisYAbs - gap - SUB_FS - 4 : axisYAbs + gap + AXIS_FS;
    const subY = p.above ? axisYAbs - gap : nameY + SUB_FS + 4;
    const totalW = Math.max(p.labelW, p.subW);
    // 引线:从点连到标签块的内侧边缘
    parts.push(
      `<line x1="${r2(p.x)}" y1="${r2(axisYAbs + dir * (DOT_R + 2))}" x2="${r2(p.x)}" y2="${r2(axisYAbs + dir * (gap - (p.above ? 1 : 0)))}" stroke="${color}" stroke-opacity="0.55" stroke-width="1.2"/>`,
    );
    // 名字
    parts.push(
      `<text x="${r2(p.x)}" y="${r2(nameY)}" text-anchor="middle" font-size="${AXIS_FS}" font-weight="600" fill="var(--d-ink)"${ia}>${esc(p.ev.name)}</text>`,
    );
    // 时期文字:名字下面那一行,居中挂在点上
    if (p.subW) {
      parts.push(
        `<text x="${r2(p.x)}" y="${r2(subY)}" text-anchor="middle" font-size="${SUB_FS}" fill="var(--d-muted)">${esc(p.ev.period!)}</text>`,
      );
    }
    // 圆点
    parts.push(
      `<circle cx="${r2(p.x)}" cy="${r2(axisYAbs)}" r="${DOT_R}" fill="${color}"${ia}/>`,
    );
    // 命中区:点的周围一块透明矩形(点太小,悬停不方便)
    if (o.interactive) {
      parts.push(
        `<rect x="${r2(p.x - Math.max(totalW / 2, 18))}" y="${r2(axisYAbs - 34)}" width="${r2(Math.max(totalW, 36))}" height="68" fill="transparent" pointer-events="all" data-tip="${esc(tip)}"/>`,
      );
    }
  });

  const titleSvg = titleBlock(spec.title, PAD) + subtitleBlock(spec.subtitle, PAD, hasTitle);
  const canvas = card(width, height, o.skin.rules.canvas !== 'card');

  // interactive:结构化数据(explore 详情卡的数据源)
  let metaSvg = '';
  if (o.interactive) {
    const data = {
      title: spec.title,
      sections: spec.sections.map((s) => ({
        name: s.name,
        events: s.events.map((e) => ({ name: e.name, ...(e.period ? { period: e.period } : {}) })),
      })),
    };
    metaSvg = `<metadata id="tevents">${esc(JSON.stringify(data))}</metadata>`;
  }
  const iStyle = o.interactive
    ? `<style>#tl [data-node]{cursor:pointer;transition:filter .12s ease}` +
      `#tl [data-node]:hover{filter:brightness(1.15)}</style>`
    : '';

  const specOut = {
    type: 'timeline' as const,
    ...(spec.title ? { title: spec.title } : {}),
    ...(spec.subtitle ? { subtitle: spec.subtitle } : {}),
    sections: spec.sections.map((s) => ({
      name: s.name,
      events: s.events.map((e) => ({ name: e.name, ...(e.period ? { period: e.period } : {}) })),
    })),
  };
  const svg = svgDoc(
    width, height, 'timeline', o.v.version,
    spec.title ?? `timeline, ${evs.length} events`,
    specOut, o.skin,
    `${canvas}${metaSvg}${iStyle}<g id="tl">${titleSvg}${parts.join('')}</g>`,
    o.tagQuery, 'timeline',
  );
  return { svg, version: o.v.version, cacheControl: o.v.cacheControl };
}

/**
 * `/draw/timeline` entry: GET ?title=…&section=…&event=…
 */
export function renderTimelineFromUrl(url: URL, interactive = false): DrawResult {
  const params = url.searchParams;
  const d = params.get('d');
  const spec = d !== null && d !== '' ? parseTimelineSpec(d) : timelineSpecFromParams(params);
  const v = resolveVersion(params.get('v'));
  const skin = resolveSkin('sankey', params.get('t'), schemeParam(params));
  const width = clampInt(params, 'w', 0, 200, 2400);
  const height = clampInt(params, 'h', 0, 140, 2000);
  return renderTimeline(spec, {
    v, skin, interactive,
    width: params.has('w') ? width : undefined,
    height: params.has('h') ? height : undefined,
    tagQuery: url.search,
  });
}
