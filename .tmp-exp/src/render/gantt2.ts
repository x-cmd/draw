// /draw/gantt2 —— 甘特图 v2:同一份数据(mermaid 甘特源码),换成我们架构图的那张脸。
//
// 和 /draw/gantt 的关系:输入完全一样(m=<gantt 源码>),只是长相不同 ——
// 条按状态着色(和架构图一个调色板)、每行一个类型角标、底下多一行图例。
// 老路径 /draw/gantt 一行未动。
import { ApiError } from '../specs/index.js';
import { parseGantt, resolveSpans, type GanttDoc, type Span } from './gantt.js';
import { resolveSkin } from '../styles/index.js';
import { clampInt, schemeParam, type DrawResult } from './query.js';
import { esc, r2, svgDoc, textW } from './svg.js';

const DAY = 86400000;
const PAD = 44;
const AXIS_H = 34;
const SECTION_H = 30;
const ROW_H = 40;
const BAR_H = 22;
const LEGEND_H = 46;

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

/** 状态 → (展示名, 角标字母, 颜色序号) —— 和架构图共用一套色板 */
const STATUS: Record<string, { name: string; badge: string; color: number }> = {
  done: { name: 'Done', badge: 'D', color: 0 },
  active: { name: 'Active', badge: 'A', color: 3 },
  crit: { name: 'Critical', badge: 'C', color: 1 },
  milestone: { name: 'Milestone', badge: 'M', color: -1 },
};
const STATUS_ORDER = ['done', 'active', 'crit', 'milestone'];

const sVar = (i: number): string => `var(--d-s${i + 1})`;

interface Tick { t: number; label: string }

/** 时间轴刻度:跨度大按月,小按周 */
function makeTicks(minT: number, maxT: number): Tick[] {
  const days = (maxT - minT) / DAY;
  const ticks: Tick[] = [];
  if (days > 120) {
    const d = new Date(minT);
    d.setUTCDate(1); d.setUTCHours(0, 0, 0, 0);
    while (d.getTime() <= maxT) {
      ticks.push({ t: d.getTime(), label: `${MONTHS[d.getUTCMonth()]} ${String(d.getUTCFullYear()).slice(2)}` });
      d.setUTCMonth(d.getUTCMonth() + 1);
    }
    return ticks;
  }
  const d = new Date(minT);
  d.setUTCDate(d.getUTCDate() - d.getUTCDay());
  d.setUTCHours(0, 0, 0, 0);
  while (d.getTime() <= maxT) {
    ticks.push({ t: d.getTime(), label: `${d.getUTCMonth() + 1}/${d.getUTCDate()}` });
    d.setUTCDate(d.getUTCDate() + 7);
  }
  return ticks;
}

export interface Gantt2Opts {
  doc: GanttDoc;
  title?: string;
  version: number;
  cacheControl: string;
  skin: ReturnType<typeof resolveSkin>;
  interactive: boolean;
  width?: number;
  height?: number;
  aria?: string;
  /** 原始 URL 查询串:角标直链 explore 落地页用 */
  tagQuery?: string;
}

/**
 * 渲染甘特图 v2。
 */
export function renderGantt2Core(o: Gantt2Opts): DrawResult {
  const doc = o.doc;
  const spans = resolveSpans(doc);
  if (!spans.length) throw new ApiError(400, 'gantt: no tasks found');

  const minT = Math.min(...spans.map((s) => s.start));
  const maxT = Math.max(...spans.map((s) => Math.max(s.end, s.start)));
  const ticks = makeTicks(minT, maxT);

  // 左边一列放任务名(和架构图一样,标签是自己的东西)
  const labelW = Math.max(120, ...doc.sections.flatMap((s) => s.tasks.map((t) => textW(t.name, 13) + 34)));
  const x0 = PAD + labelW;
  const width = Math.max(560, o.width ?? 0, x0 + 120);
  const rightPad = 24;
  const span = Math.max(DAY, maxT - minT);
  const plotW = Math.max(160, width - x0 - rightPad);
  const xOf = (t: number): number => x0 + ((t - minT) / span) * plotW;

  const rowsTotal = doc.sections.reduce((n, s) => n + s.tasks.length, 0);
  const axisTop = o.title ? PAD + 34 : PAD;
  const bodyTop = axisTop + AXIS_H;
  const bodyH = doc.sections.length * SECTION_H + rowsTotal * ROW_H;
  const height = Math.max(o.height ?? 0, bodyTop + bodyH + LEGEND_H + PAD);

  const parts: string[] = [];

  // 分区色带(隔区铺)
  let bandY = bodyTop;
  doc.sections.forEach((sec, si) => {
    const h = SECTION_H + sec.tasks.length * ROW_H;
    if (si % 2 === 1) {
      parts.push(`<rect x="${PAD}" y="${r2(bandY)}" width="${r2(width - PAD - rightPad)}" height="${r2(h)}" rx="10" fill="var(--d-ink)" fill-opacity="0.035"/>`);
    }
    bandY += h;
  });

  // 细网格 + 刻度
  for (const tk of ticks) {
    const x = xOf(tk.t);
    parts.push(`<line x1="${r2(x)}" y1="${r2(bodyTop)}" x2="${r2(x)}" y2="${r2(bodyTop + bodyH)}" stroke="var(--d-grid)"/>`);
    parts.push(`<text x="${r2(x)}" y="${r2(bodyTop - 10)}" text-anchor="middle" font-size="11" fill="var(--d-muted)">${esc(tk.label)}</text>`);
  }
  parts.push(`<line x1="${r2(x0)}" y1="${r2(bodyTop - 26)}" x2="${r2(x0 + plotW)}" y2="${r2(bodyTop - 26)}" stroke="var(--d-border)"/>`);
  parts.push(`<line x1="${r2(x0)}" y1="${r2(bodyTop)}" x2="${r2(x0)}" y2="${r2(bodyTop + bodyH)}" stroke="var(--d-border)"/>`);

  // 行:分区名 + 任务条 + 类型角标
  let y = bodyTop;
  let ri = 0;
  const counts = new Map<string, number>();
  doc.sections.forEach((sec) => {
    parts.push(`<text x="${PAD}" y="${r2(y + 20)}" font-size="12" font-weight="600" fill="var(--d-ink)">${esc(sec.name)}</text>`);
    y += SECTION_H;
    for (const t of sec.tasks) {
      const sp = spans.find((s) => s.name === t.name)!;
      const st = statusOf(sp);
      const meta = STATUS[st] ?? { name: 'Task', badge: '?', color: -1 };
      counts.set(st, (counts.get(st) ?? 0) + 1);
      const cy = y + ROW_H / 2;
      const rowAttr = o.interactive ? ` data-row="${ri}"` : '';
      const nodeAttr = o.interactive
        ? ` data-node="${esc(t.id ?? t.name)}"${t.after ? ` data-after="${esc(t.after)}"` : ''}${rowAttr} data-tip="${esc(sp.tip)}"`
        : '';
      const color = meta.color >= 0 ? sVar(meta.color) : 'var(--d-ink)';
      // 角标:行首的小方块,和架构图的节点角标一个样式
      parts.push(
        `<rect x="${r2(PAD + 2)}" y="${r2(cy - 9)}" width="18" height="18" rx="5" fill="${color}" fill-opacity="${meta.color >= 0 ? 0.2 : 0.14}" stroke="${color}" stroke-opacity="0.55" stroke-width="1"/>`,
        `<text x="${r2(PAD + 11)}" y="${r2(cy + 3.5)}" text-anchor="middle" font-size="10" font-weight="700" fill="${color}">${esc(meta.badge)}</text>`,
      );
      // 任务名
      parts.push(`<text x="${r2(PAD + 28)}" y="${r2(cy + 4.5)}" font-size="13" fill="var(--d-ink)">${esc(t.name)}</text>`);
      // 条
      if (st === 'milestone') {
        const mx = xOf(sp.start);
        parts.push(`<polygon points="${r2(mx)},${r2(cy - 8)} ${r2(mx + 8)},${r2(cy)} ${r2(mx)},${r2(cy + 8)} ${r2(mx - 8)},${r2(cy)}" fill="${color}"${nodeAttr}/>`);
      } else {
        const bx = xOf(sp.start);
        const bw = Math.max(3, xOf(sp.end) - bx);
        parts.push(
          `<rect x="${r2(bx)}" y="${r2(cy - BAR_H / 2)}" width="${r2(bw)}" height="${BAR_H}" rx="6"` +
          ` fill="${color}" fill-opacity="${st === 'done' ? 0.32 : 0.92}"${nodeAttr}/>`,
        );
        // 进度(可选):条上叠一段更实的
        if (t.progress !== undefined && t.progress > 0) {
          parts.push(`<rect x="${r2(bx)}" y="${r2(cy - BAR_H / 2)}" width="${r2(bw * t.progress / 100)}" height="${BAR_H}" rx="6" fill="${color}"/>`);
        }
      }
      // 依赖箭头
      if (t.after) {
        const from = spans.find((s) => s.name === doc.sections.flatMap((x) => x.tasks).find((tt) => (tt.id ?? tt.name) === t.after)?.name);
        if (from) {
          const fx = xOf(Math.max(from.end, from.start));
          const tx = xOf(sp.start);
          parts.push(`<path d="M${r2(fx)} ${r2(cy - 6)}L${r2(tx - 6)} ${r2(cy - 6)}" fill="none" stroke="var(--d-border)" stroke-width="1.4" marker-end="url(#g2-arrow)"/>`);
        }
      }
      y += ROW_H;
      ri++;
    }
  });

  // 图例(架构图同款:色块 + 名字 + 个数)
  const legendTypes = STATUS_ORDER.filter((st) => counts.has(st));
  if (legendTypes.length) {
    let lx = PAD;
    const ly = bodyTop + bodyH + 26;
    const legend: string[] = [];
    for (const st of legendTypes) {
      const meta = STATUS[st];
      const color = meta.color >= 0 ? sVar(meta.color) : 'var(--d-ink)';
      const nw = textW(meta.name, 11.5);
      const cw = textW(String(counts.get(st)), 11.5);
      legend.push(
        `<rect x="${r2(lx)}" y="${r2(ly - 10)}" width="14" height="14" rx="4" fill="${color}" fill-opacity="${meta.color >= 0 ? 0.2 : 0.14}" stroke="${color}" stroke-opacity="0.55" stroke-width="1"/>`,
        `<text x="${r2(lx + 20)}" y="${r2(ly + 1)}" font-size="11.5" fill="var(--d-muted)">${esc(meta.name)}</text>`,
        `<text x="${r2(lx + 26 + nw)}" y="${r2(ly + 1)}" font-size="11.5" font-weight="700" fill="var(--d-ink)">${counts.get(st)}</text>`,
      );
      lx += 20 + nw + 8 + cw + 26;
    }
    parts.push(`<g data-legend="status">${legend.join('')}</g>`);
  }

  const titleSvg = o.title
    ? `<text x="${PAD}" y="${PAD + 16}" font-size="19" font-weight="600" letter-spacing="-0.02em" fill="var(--d-ink)">${esc(o.title)}</text>`
    : '';
  const defs = `<defs><marker id="g2-arrow" viewBox="0 0 10 10" refX="8.5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M0 0L10 5L0 10z" fill="var(--d-border)"/></marker></defs>`;
  const spec = { type: 'gantt2', title: o.title, sections: doc.sections };
  const svg = svgDoc(
    width, height, 'gantt2', o.version,
    o.aria ?? o.title ?? `gantt chart, ${spans.length} tasks`,
    spec, o.skin,
    titleSvg + defs + parts.join(''),
    o.tagQuery, 'gantt2',
  );
  return { svg, version: o.version, cacheControl: o.cacheControl };
}

function statusOf(sp: Span): string {
  if (sp.flags.has('milestone')) return 'milestone';
  if (sp.flags.has('crit')) return 'crit';
  if (sp.flags.has('active')) return 'active';
  if (sp.flags.has('done')) return 'done';
  return 'active';
}

/**
 * `/draw/gantt2` 入口:GET ?m=<gantt 源码>(和 /draw/gantt 同一套参数)。
 */
export function renderGantt2FromUrl(url: URL, interactive = false): DrawResult {
  const params = url.searchParams;
  const m = params.get('m') ?? '';
  const doc = parseGantt(/^\s*gantt\b/i.test(m) ? m : `gantt\n${m}`);
  const v = parseInt(params.get('v') ?? '1', 10) || 1;
  const skin = resolveSkin('sankey', params.get('t'), schemeParam(params));
  return renderGantt2Core({
    doc,
    title: params.get('title')?.trim() || doc.title,
    version: v,
    cacheControl: 'public, max-age=300',
    skin,
    interactive,
    width: clampInt(params, 'w', 0, 200, 2400),
    height: clampInt(params, 'h', 0, 140, 2400),
    tagQuery: url.search,
  });
}
