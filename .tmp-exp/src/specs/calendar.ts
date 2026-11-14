// 日历(calendar):一个能画日子的图种。
//
// 为什么单独一种:课程表、排期表、周历、月历、年历、双月历、三月历 ——
// 它们都是「一段时间 × 一格」的表,画法是同一套:格子 + 每格的事件。
// ECharts 也有日历,但那是图表里的一个部件;这里要的是「整张表」。
//
// URL 控图(和架构图一个思路):内容在 URL 里,不是画死了的。
//   type=calendar&layout=month&start=2026-11-01
//   &ev=2026-11-02;meeting;需求评审;14:00      事件(可重复)
//   &day=2026-11-07;holiday;元旦              某一天的性质(可重复)
//   &note=2026-11-02;发版窗口                 备注(可重复)
//   &months=2026-10,2026-11                   双月/三月历显示哪几个月
//   &periods=08:00,09:00,10:00                课程表/周历的行(时间槽)
import { ApiError, LIMITS, clip } from './base.js';

// ===== 日历(calendar) =====

/** 一天的「格子」布局 */
export type CalLayout = 'month' | 'week' | 'year' | 'bimonth' | 'quarter' | 'course' | 'plan';

/**
 * One item on a day: a date, a category, a label and an optional time.
 */
export interface CalItem {
  /** ISO 日期 YYYY-MM-DD */
  date: string;
  /** 类别:work / meeting / review / release / …(决定颜色与图例) */
  kind: string;
  /** 显示的文字 */
  label: string;
  /** 时间(HH:MM)—— 周历/课程表按它落行 */
  time?: string;
  /** 排期表用:这一条占的日期区间(到 date 为止) */
  until?: string;
}

/**
 * A day's own kind: a workday, a rest day, a holiday.
 */
export interface CalDay {
  date: string;
  /** work / rest / holiday */
  kind: string;
  /** 假日的名字(例如「国庆」) */
  label?: string;
}

/**
 * A note pinned to a day (or to the side of a month).
 */
export interface CalNote {
  /** 哪一天;空 = 整张图的备注 */
  date?: string;
  text: string;
}

/**
 * Calendar data.
 */
export interface CalendarSpec {
  /** 哪种表 */
  layout: CalLayout;
  title?: string;
  /** 来源(页脚右边那一句) */
  source?: string;
  /** 一周从哪天开始:0=周日(缺省),1=周一(课程表/工作周用) */
  weekStart?: 0 | 1;
  /** 三月历的备注位置:below(缺省,横向)/right/left(纵向) */
  notesPos?: 'below' | 'right' | 'left';
  /** 锚点日期(ISO)—— 月历看哪个月、周历看哪周、年历看哪年 */
  start?: string;
  /** 双月/三月历显示哪几个月(YYYY-MM) */
  months?: string[];
  /** 周历/课程表的行:时间槽起点(HH:MM) */
  periods?: string[];
  /** 事件 */
  items: CalItem[];
  /** 某一天的性质 */
  days: CalDay[];
  /** 备注 */
  notes: CalNote[];
}

export const CAL_LAYOUTS: CalLayout[] = ['month', 'week', 'year', 'bimonth', 'quarter', 'course', 'plan'];

const CAL_EXAMPLE = 'type=calendar&layout=month&start=2026-11-01&ev=2026-11-02;meeting;需求评审;14:00';

/** ISO 日期 → { y, m, d } */
export function isoParts(iso: string): { y: number; m: number; d: number } | null {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso);
  if (!m) return null;
  const y = Number(m[1]);
  const mo = Number(m[2]);
  const d = Number(m[3]);
  if (mo < 1 || mo > 12 || d < 1 || d > 31) return null;
  // 真日期要存在(2026-02-30 不存在)
  const probe = new Date(Date.UTC(y, mo - 1, d));
  if (probe.getUTCFullYear() !== y || probe.getUTCMonth() !== mo - 1 || probe.getUTCDate() !== d) return null;
  return { y, m: mo, d };
}

/** ISO 日期 → 距 1970-01-01 的天数(UTC,不受时区影响) */
export function isoDay(iso: string): number {
  const p = isoParts(iso)!;
  return Math.round(Date.UTC(p.y, p.m - 1, p.d) / 86400000);
}

/** 天数 → ISO 日期 */
export function dayIso(day: number): string {
  const d = new Date(day * 86400000);
  return `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, '0')}-${String(d.getUTCDate()).padStart(2, '0')}`;
}

/** ISO 日期 → 星期(0=周日) */
export function isoWeekday(iso: string): number {
  return new Date(isoDay(iso) * 86400000).getUTCDay();
}

/** 该月的天数 */
export function daysInMonth(y: number, m: number): number {
  return new Date(Date.UTC(y, m, 0)).getUTCDate();
}

/** 该月 1 号是星期几 */
export function firstWeekday(y: number, m: number): number {
  return new Date(Date.UTC(y, m - 1, 1)).getUTCDay();
}

const TIME_RE = /^([01]?\d|2[0-3]):([0-5]\d)$/;

/**
 * Build calendar JSON from flat params; null when nothing was given.
 *
 * @throws ApiError(400) with a corrective example on bad input
 */
export function calendarSpecFromParams(params: URLSearchParams): string | null {
  const d = params.get('d');
  if (d !== null && d !== '') return d;
  const layout = (params.get('layout') ?? 'month').toLowerCase();
  if (!CAL_LAYOUTS.includes(layout as CalLayout)) {
    throw new ApiError(400, `"layout" must be one of ${CAL_LAYOUTS.join(', ')}. Got: ${JSON.stringify(layout)}`);
  }
  const start = params.get('start') ?? '';
  if (start && !isoParts(start)) {
    throw new ApiError(400, `"start" must be a date like 2026-11-01. Example: ${CAL_EXAMPLE}`);
  }
  const months = (params.get('months') ?? '').split(',').map((s) => s.trim()).filter(Boolean);
  for (const mm of months) {
    if (!/^\d{4}-\d{2}$/.test(mm)) {
      throw new ApiError(400, `"months" must be YYYY-MM, comma separated. Got: ${JSON.stringify(mm)}`);
    }
  }
  const periods = (params.get('periods') ?? '').split(',').map((s) => s.trim()).filter(Boolean);
  for (const p of periods) {
    if (!TIME_RE.test(p)) {
      throw new ApiError(400, `"periods" must be times like 08:00,09:40. Got: ${JSON.stringify(p)}`);
    }
  }
  const ws = params.get('ws');
  if (ws !== null && ws !== '' && ws !== '0' && ws !== '1') {
    throw new ApiError(400, `"ws" must be 0 (Sunday) or 1 (Monday). Got: ${JSON.stringify(ws)}`);
  }
  const npos = (params.get('npos') ?? 'below').toLowerCase();
  if (!['below', 'right', 'left'].includes(npos)) {
    throw new ApiError(400, `"npos" must be below, right or left. Got: ${JSON.stringify(npos)}`);
  }
  const items: CalItem[] = [];
  for (const raw of params.getAll('ev')) {
    const f = raw.split(';');
    if (f.length < 3) {
      throw new ApiError(400, `"ev" must be date;kind;label[;time]. Example: ev=2026-11-02;meeting;需求评审;14:00`);
    }
    if (!isoParts(f[0])) {
      throw new ApiError(400, `"ev" needs a date like 2026-11-02, got ${JSON.stringify(f[0])}`);
    }
    const it: CalItem = { date: f[0], kind: clip(f[1], 24) || 'work', label: clip(f[2], 60) };
    // 第四段:时间(HH:MM,周历/课程表)或结束日期(排期表)—— 两种写法不会撞
    if (f[3]) {
      const t3 = f[3].trim();
      if (TIME_RE.test(t3)) {
        it.time = t3;
      } else if (isoParts(t3)) {
        it.until = t3;
      } else {
        throw new ApiError(400, `"ev" needs a time (HH:MM) or an end date, got ${JSON.stringify(f[3])}`);
      }
    }
    if (f[4]) {
      if (!isoParts(f[4])) {
        throw new ApiError(400, `"ev" until must be a date like 2026-11-05, got ${JSON.stringify(f[4])}`);
      }
      it.until = f[4];
    }
    items.push(it);
  }
  const days: CalDay[] = [];
  for (const raw of params.getAll('day')) {
    const f = raw.split(';');
    if (!isoParts(f[0])) {
      throw new ApiError(400, `"day" needs a date like 2026-10-01, got ${JSON.stringify(f[0])}`);
    }
    const dd: CalDay = { date: f[0], kind: clip(f[1] ?? 'work', 16) || 'work' };
    if (f[2]) dd.label = clip(f[2], 40);
    days.push(dd);
  }
  const notes: CalNote[] = [];
  for (const raw of params.getAll('note')) {
    const f = raw.split(';');
    const n: CalNote = { text: clip(f[1] ?? f[0], 80) };
    // 日期可以写整天(2026-11-02)或整个月(2026-11 —— 三月历的月度备注)
    if (f[0] && /^\d{4}-\d{2}(-\d{2})?$/.test(f[0])) n.date = f[0];
    notes.push(n);
  }
  if (!start && !months.length && !items.length && !days.length && !notes.length) return null;
  return JSON.stringify({
    layout,
    ...(ws ? { weekStart: Number(ws) as 0 | 1 } : {}),
    ...(npos !== 'below' ? { notesPos: npos } : {}),
    ...(start ? { start } : {}),
    ...(months.length ? { months } : {}),
    ...(periods.length ? { periods } : {}),
    items,
    days,
    notes,
    ...(params.get('title') ? { title: params.get('title') } : {}),
    ...(params.get('source') ? { source: params.get('source') } : {}),
  });
}

/**
 * Parse and validate calendar JSON.
 *
 * @throws ApiError(400) with a corrective example on bad input
 */
export function parseCalendarSpec(raw: string | null): CalendarSpec {
  if (raw === null || raw === '') {
    throw new ApiError(400, `Missing data. Use ?type=calendar&layout=month&start=2026-11-01 — or ?d= with {"layout":"month"}`);
  }
  let obj: unknown;
  try {
    obj = JSON.parse(raw);
  } catch {
    throw new ApiError(400, `"d" is not valid JSON. Example: {"layout":"month","start":"2026-11-01"}`);
  }
  const o = obj as Record<string, unknown>;
  const layout = String(o.layout ?? 'month').toLowerCase() as CalLayout;
  if (!CAL_LAYOUTS.includes(layout)) {
    throw new ApiError(400, `"layout" must be one of ${CAL_LAYOUTS.join(', ')}. Got: ${JSON.stringify(o.layout)}`);
  }
  const spec: CalendarSpec = { layout, items: [], days: [], notes: [] };
  if (o.title !== undefined) {
    if (typeof o.title !== 'string') throw new ApiError(400, `"title" must be a string`);
    spec.title = clip(o.title, LIMITS.title);
  }
  if (o.source !== undefined) {
    if (typeof o.source !== 'string') throw new ApiError(400, `"source" must be a string`);
    spec.source = clip(o.source, LIMITS.title);
  }
  if (o.start !== undefined && o.start !== '') {
    if (typeof o.start !== 'string' || !isoParts(o.start)) {
      throw new ApiError(400, `"start" must be a date like 2026-11-01`);
    }
    spec.start = o.start;
  }
  if (o.weekStart !== undefined) {
    if (o.weekStart !== 0 && o.weekStart !== 1) throw new ApiError(400, `"weekStart" must be 0 or 1`);
    spec.weekStart = o.weekStart;
  }
  if (o.notesPos !== undefined) {
    if (o.notesPos !== 'below' && o.notesPos !== 'right' && o.notesPos !== 'left') {
      throw new ApiError(400, `"notesPos" must be below, right or left`);
    }
    spec.notesPos = o.notesPos;
  }
  if (o.months !== undefined) {
    if (!Array.isArray(o.months)) throw new ApiError(400, `"months" must be an array like ["2026-10","2026-11"]`);
    spec.months = o.months.map((m) => {
      if (typeof m !== 'string' || !/^\d{4}-\d{2}$/.test(m)) {
        throw new ApiError(400, `"months" entries must be YYYY-MM, got ${JSON.stringify(m)}`);
      }
      return m;
    });
  }
  if (o.periods !== undefined) {
    if (!Array.isArray(o.periods)) throw new ApiError(400, `"periods" must be an array like ["08:00","09:40"]`);
    spec.periods = o.periods.map((p) => {
      if (typeof p !== 'string' || !TIME_RE.test(p)) {
        throw new ApiError(400, `"periods" entries must be HH:MM, got ${JSON.stringify(p)}`);
      }
      return p;
    });
  }
  if (o.items !== undefined) {
    if (!Array.isArray(o.items)) throw new ApiError(400, `"items" must be an array`);
    if (o.items.length > LIMITS.maxLine) {
      throw new ApiError(400, `"items" has ${o.items.length} entries; calendar supports at most ${LIMITS.maxLine}`);
    }
    spec.items = o.items.map((it, i) => {
      if (typeof it !== 'object' || it === null) throw new ApiError(400, `"items[${i}] must be an object`);
      const r = it as Record<string, unknown>;
      if (typeof r.date !== 'string' || !isoParts(r.date)) {
        throw new ApiError(400, `"items[${i}].date" must be a date like 2026-11-02`);
      }
      const out: CalItem = {
        date: r.date,
        kind: typeof r.kind === 'string' && r.kind ? clip(r.kind, 24) : 'work',
        label: typeof r.label === 'string' ? clip(r.label, 60) : '',
      };
      if (typeof r.time === 'string' && r.time) {
        if (!TIME_RE.test(r.time)) throw new ApiError(400, `"items[${i}].time" must be HH:MM`);
        out.time = r.time;
      }
      if (typeof r.until === 'string' && r.until) {
        if (!isoParts(r.until)) throw new ApiError(400, `"items[${i}].until" must be a date`);
        out.until = r.until;
      }
      return out;
    });
  }
  if (o.days !== undefined) {
    if (!Array.isArray(o.days)) throw new ApiError(400, `"days" must be an array`);
    spec.days = o.days.map((it, i) => {
      if (typeof it !== 'object' || it === null) throw new ApiError(400, `"days[${i}] must be an object`);
      const r = it as Record<string, unknown>;
      if (typeof r.date !== 'string' || !isoParts(r.date)) {
        throw new ApiError(400, `"days[${i}].date" must be a date like 2026-10-01`);
      }
      const d: CalDay = { date: r.date, kind: typeof r.kind === 'string' && r.kind ? clip(r.kind, 16) : 'work' };
      if (typeof r.label === 'string' && r.label) d.label = clip(r.label, 40);
      return d;
    });
  }
  if (o.notes !== undefined) {
    if (!Array.isArray(o.notes)) throw new ApiError(400, `"notes" must be an array`);
    spec.notes = o.notes.map((it, i) => {
      if (typeof it === 'string') return { text: clip(it, 80) };
      if (typeof it !== 'object' || it === null) throw new ApiError(400, `"notes[${i}] must be a string or an object`);
      const r = it as Record<string, unknown>;
      const n: CalNote = { text: typeof r.text === 'string' ? clip(r.text, 80) : '' };
      if (typeof r.date === 'string' && r.date) {
        if (!/^\d{4}-\d{2}(-\d{2})?$/.test(r.date)) {
          throw new ApiError(400, `"notes[${i}].date" must be 2026-11-02 or 2026-11`);
        }
        n.date = r.date;
      }
      return n;
    });
  }
  return spec;
}
