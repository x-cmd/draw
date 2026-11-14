// 日历(calendar):一个月/一周/一年/两个月的格子,格子里放事件。
//
// 排版参照 Apple 的日历:白底、细线、日期号小而克制,
// 今天是红底白字,周末的号是灰的,事件是一行一个小圆点加名字。
// 图例坐标题基线(和其它图一样),单位/类别只在图例里说。
import type { CalendarSpec, CalDay, CalItem, CalLayout } from '../specs/calendar.js';
import { dayIso, daysInMonth, firstWeekday, isoDay, isoParts, isoWeekday } from '../specs/calendar.js';
import { TAB, card } from '../theme.js';
import { esc, r2, svgDoc, textW, titleBlock, topLegend, trunc, type RenderOpts } from './svg.js';
import { footerUnit, headerMeta, tipHeight, tipUnit } from './units.js';

const PAD = 24;
const HEAD_FS = 12;
const NUM_FS = 13;
const EV_FS = 12;

/** 事件类别 → 色板序号 + 名字(中英) */
const KINDS: Record<string, { c: number; zh: string; en: string }> = {
  work: { c: 1, zh: '工作', en: 'Work' },
  meeting: { c: 2, zh: '会议', en: 'Meeting' },
  review: { c: 3, zh: '评审', en: 'Review' },
  release: { c: 4, zh: '发布', en: 'Release' },
  focus: { c: 5, zh: '专注', en: 'Focus' },
  travel: { c: 6, zh: '出行', en: 'Travel' },
  health: { c: 7, zh: '健康', en: 'Health' },
  personal: { c: 8, zh: '个人', en: 'Personal' },
  class: { c: 9, zh: '课程', en: 'Class' },
  oncall: { c: 10, zh: '值班', en: 'On call' },
};

const WEEK_CN = ['日', '一', '二', '三', '四', '五', '六'];
const WEEK_EN = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTH_CN = ['一', '二', '三', '四', '五', '六', '七', '八', '九', '十', '十一', '十二'];
const MONTH_EN = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

const DEFAULT_PERIODS = ['08:00', '09:40', '11:20', '14:00', '15:40', '17:20', '19:00'];

interface Ctx {
  spec: CalendarSpec;
  skin: RenderOpts['skin'];
  /** 事件类别的颜色(按皮肤色板) */
  colorOf: (kind: string) => string;
  /** 某一天的事件(按时间排) */
  itemsOn: (date: string) => CalItem[];
  /** 某一天的性质 */
  dayOf: (date: string) => CalDay | undefined;
  /** 今天 */
  today: string;
  /** 一周从哪天开始:0=周日 */
  ws: number;
  /** 主体里没画下的东西(格子装不下的日程与备注)—— 交给提示单元列出来 */
  overflow: { date: string; label: string; time?: string; kind: string }[];
}

const colorVar = (ctx: Ctx, kind: string): string => {
  const k = KINDS[kind];
  return k ? `var(--d-s${k.c})` : 'var(--d-muted)';
};

/** 事件按时间排,没时间的按原样 */
function sortItems(items: CalItem[]): CalItem[] {
  return [...items].sort((a, b) => (a.time ?? '99:99').localeCompare(b.time ?? '99:99'));
}

/** 按像素宽度截断(挤的格子里文字不能串到隔壁格) */
function fitText(s: string, maxW: number, fs: number): string {
  if (maxW <= 8) return trunc(s, 2);
  if (textW(s, fs) <= maxW) return s;
  let t = s;
  while (t.length > 1 && textW(t + '…', fs) > maxW) t = t.slice(0, -1);
  return t + '…';
}

/** 某一天是休息日吗(默认:周末) */
function isRest(ctx: Ctx, date: string): boolean {
  const d = ctx.dayOf(date);
  if (d) return d.kind === 'rest' || d.kind === 'holiday';
  const w = isoWeekday(date);
  return w === 0 || w === 6;
}

/** 某一天是法定假日吗 */
function isHoliday(ctx: Ctx, date: string): boolean {
  return ctx.dayOf(date)?.kind === 'holiday';
}

function buildCtx(spec: CalendarSpec, o: RenderOpts, ws: number): Ctx {
  const byDate = new Map<string, CalItem[]>();
  for (const it of spec.items) {
    const arr = byDate.get(it.date) ?? [];
    arr.push(it);
    byDate.set(it.date, arr);
  }
  const days = new Map<string, CalDay>();
  for (const d of spec.days) days.set(d.date, d);
  const today = dayIso(Math.floor(Date.now() / 86400000));
  const ctx: Ctx = {
    spec,
    skin: o.skin,
    colorOf: (kind) => colorVar(ctx, kind),
    itemsOn: (date) => sortItems(byDate.get(date) ?? []),
    dayOf: (date) => days.get(date),
    today,
    ws,
    overflow: [],
  };
  return ctx;
}

/* ---------------------------------------------------------------- 网格 */

/** 一个月的格子:7 列 × n 行,外加周头 */
function monthGrid(
  ctx: Ctx,
  y: number,
  m: number,
  x: number,
  y0: number,
  w: number,
  h: number,
  dense = false,
  headY?: number,
): string {
  const parts: string[] = [];
  const cols = 7;
  const cw = w / cols;
  const first = firstWeekday(y, m);
  const dim = daysInMonth(y, m);
  const rows = Math.ceil((first + dim) / 7);
  const ch = h / rows;
  // 周头
  for (let c = 0; c < cols; c++) {
    const wd = (c + ctx.ws) % 7;
    const label = dense ? WEEK_CN[wd] : (ctx.skin.rules.title === 'editorial' ? WEEK_EN[wd] : WEEK_CN[wd]);
    parts.push(
      `<text x="${r2(x + c * cw + cw / 2)}" y="${r2(headY ?? y0 - 8)}" text-anchor="middle" font-size="${HEAD_FS}" fill="var(--d-muted)">${esc(label)}</text>`,
    );
  }
  // 格子
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const idx = r * 7 + c;
      const dayNum = idx - first + 1;
      const cx = x + c * cw;
      const cy = y0 + r * ch;
      const outside = dayNum < 1 || dayNum > dim;
      const date = dayIso(Date.UTC(y, m - 1, dayNum) / 86400000);
      // 线:只画横线(Apple 的月视图是横线分隔,竖线没有)
      parts.push(`<line x1="${r2(cx)}" y1="${r2(cy)}" x2="${r2(cx + cw)}" y2="${r2(cy)}" stroke="var(--d-grid)" stroke-width="1"/>`);
      if (outside) {
        // 上/下个月的日子:淡淡地摆在那儿(Apple 的月视图)
        const nd = Number(date.slice(8));
        parts.push(
          `<text x="${r2(cx + cw - 8)}" y="${r2(cy + 16)}" text-anchor="end" font-size="${NUM_FS}" fill="var(--d-faint)" style="${TAB}">${nd}</text>`,
        );
        continue;
      }
      const iso = date;
      const holiday = isHoliday(ctx, iso);
      const rest = isRest(ctx, iso);
      const today = iso === ctx.today;
      // 日期号:今天红底白字,假日红字,休息灰字
      const nx = cx + cw - 8;
      const ny = cy + 16;
      if (today) {
        // 圆圈要正好套住数字:数字是右对齐的,圆心得跟着数字的宽度走
        const nw = textW(String(dayNum), NUM_FS);
        parts.push(`<circle cx="${r2(nx - nw / 2)}" cy="${r2(ny - NUM_FS * 0.35)}" r="10" fill="var(--d-mark)"/>`);
      }
      const fill = today ? '#ffffff' : holiday ? 'var(--d-mark)' : rest ? 'var(--d-muted)' : 'var(--d-ink)';
      parts.push(`<text x="${r2(nx)}" y="${r2(ny)}" text-anchor="end" font-size="${NUM_FS}" font-weight="${today || holiday ? 600 : 400}" fill="${fill}" style="${TAB}">${dayNum}</text>`);
      // 假日的名字
      const dl = ctx.dayOf(iso)?.label;
      if (dl) {
        const dfill = holiday ? 'var(--d-mark)' : 'var(--d-text)';
        parts.push(`<text x="${r2(cx + 6)}" y="${r2(cy + 16)}" font-size="${EV_FS}" fill="${dfill}">${esc(fitText(dl, cw - 30, EV_FS))}</text>`);
      }
      // 事件
      const items = ctx.itemsOn(iso);
      const room = cw - 26;   // 小圆点 + 边距
      if (dense) {
        // 格子窄:只摆小圆点(哪些天有事),名字留给周历/备注
        items.slice(0, 8).forEach((it, i) => {
          const dx = cx + 8 + (i % 4) * 9;
          const dy = cy + 30 + Math.floor(i / 4) * 11;
          parts.push(`<circle cx="${r2(dx)}" cy="${r2(dy)}" r="3" fill="${ctx.colorOf(it.kind)}"/>`);
        });
      } else {
        const maxRows = Math.max(1, Math.floor((ch - 22) / 15));
        items.slice(0, maxRows).forEach((it, i) => {
          const ey = cy + 32 + i * 15;
          parts.push(`<circle cx="${r2(cx + 9)}" cy="${r2(ey - 4)}" r="3" fill="${ctx.colorOf(it.kind)}"/>`);
          // 月历不写时间(苹果的月视图也不写)—— 格子窄,时间会把名字挤没
          const label = it.label;
          parts.push(`<text x="${r2(cx + 16)}" y="${r2(ey)}" font-size="${EV_FS}" fill="var(--d-text)">${esc(fitText(label, room, EV_FS))}</text>`);
        });
        // 下一行:先是「+N」(自己占一行),再排备注 —— 备注跟「+N」挤一行会被盖住
        let row = maxRows;
        if (items.length > maxRows) {
          parts.push(`<text x="${r2(cx + 6)}" y="${r2(cy + 32 + row * 15)}" font-size="11" fill="var(--d-muted)">+${items.length - maxRows}</text>`);
          // 没画出来的别丢 —— 提示单元会把它们列出来
          for (const it of items.slice(maxRows)) ctx.overflow.push({ date: iso, label: it.label, time: it.time, kind: it.kind });
          row++;
        }
        // 当天的备注
        const notes = ctx.spec.notes.filter((n) => n.date === iso);
        notes.forEach((n, i) => {
          const ny2 = cy + 32 + (row + i) * 15;
          if (ny2 > cy + ch - 4) {
            // 格子装不下:也别压到下一格 —— 交给提示单元
            ctx.overflow.push({ date: iso, label: n.text, kind: 'note' });
            return;
          }
          parts.push(`<text x="${r2(cx + 6)}" y="${r2(ny2)}" font-size="11" fill="var(--d-muted)">${esc(fitText(n.text, cw - 12, 11))}</text>`);
        });
      }
    }
  }
  // 底边
  parts.push(`<line x1="${r2(x)}" y1="${r2(y0 + rows * ch)}" x2="${r2(x + w)}" y2="${r2(y0 + rows * ch)}" stroke="var(--d-grid)" stroke-width="1"/>`);
  return parts.join('');
}

/** 月份的大标题(2026年11月) */
function monthLabel(ctx: Ctx, y: number, m: number): string {
  const en = ctx.skin.rules.title === 'editorial';
  return en ? `${MONTH_EN[m - 1]} ${y}` : `${y}年${m}月`;
}
/* ---------------------------------------------------------------- 周/课程表 */

/** 时间网格:列 = 几天,行 = 时段 */
function timeGrid(
  ctx: Ctx,
  days: string[],
  periods: string[],
  x: number,
  y0: number,
  w: number,
  h: number,
  dense = false,
): string {
  const parts: string[] = [];
  const timeW = 46;
  const cols = days.length;
  const cw = (w - timeW) / cols;
  const rows = periods.length;
  const ch = h / rows;
  // 周头
  days.forEach((d, c) => {
    const wd = isoWeekday(d);
    const label = dense ? WEEK_CN[wd] : (ctx.skin.rules.title === 'editorial' ? WEEK_EN[wd] : WEEK_CN[wd]);
    parts.push(
      `<text x="${r2(x + timeW + c * cw + cw / 2)}" y="${r2(y0 - 8)}" text-anchor="middle" font-size="${HEAD_FS}" fill="var(--d-muted)">${esc(label)}</text>`,
    );
    const dn = Number(d.slice(8));
    const holiday = isHoliday(ctx, d);
    parts.push(
      `<text x="${r2(x + timeW + c * cw + cw / 2)}" y="${r2(y0 - 24)}" text-anchor="middle" font-size="${NUM_FS}" font-weight="600" fill="${holiday ? 'var(--d-mark)' : d === ctx.today ? 'var(--d-ink)' : 'var(--d-muted)'}">${dn}</text>`,
    );
  });
  // 行:时间标签 + 横线
  periods.forEach((p, r) => {
    const py = y0 + r * ch;
    parts.push(`<text x="${r2(x + timeW - 8)}" y="${r2(py + ch / 2 + 4)}" text-anchor="end" font-size="11" fill="var(--d-muted)" style="${TAB}">${esc(p)}</text>`);
    parts.push(`<line x1="${r2(x + timeW)}" y1="${r2(py)}" x2="${r2(x + w)}" y2="${r2(py)}" stroke="var(--d-grid)" stroke-width="1"/>`);
  });
  // 竖线(每天之间)
  for (let c = 0; c <= cols; c++) {
    parts.push(`<line x1="${r2(x + timeW + c * cw)}" y1="${r2(y0)}" x2="${r2(x + timeW + c * cw)}" y2="${r2(y0 + rows * ch)}" stroke="var(--d-grid)" stroke-width="1"/>`);
  }
  // 事件:按时间落格
  for (const d of days) {
    const c = days.indexOf(d);
    const items = ctx.itemsOn(d);
    for (const it of items) {
      const t = it.time ?? periods[0];
      // 落在最后一个「开始时间 ≤ 事件时间」的槽里
      let r = -1;
      periods.forEach((pp, i) => { if (pp <= t) r = i; });
      if (r < 0) r = 0;
      const bx = x + timeW + c * cw + 3;
      const by = y0 + r * ch + 3;
      const bw = cw - 6;
      const bh = Math.max(16, ch - 6);
      parts.push(
        `<rect x="${r2(bx)}" y="${r2(by)}" width="${r2(bw)}" height="${r2(bh)}" rx="6" fill="${ctx.colorOf(it.kind)}" fill-opacity="0.14"/>`,
        `<rect x="${r2(bx)}" y="${r2(by)}" width="3" height="${r2(bh)}" rx="1.5" fill="${ctx.colorOf(it.kind)}"/>`,
        `<text x="${r2(bx + 8)}" y="${r2(by + 14)}" font-size="11" fill="var(--d-ink)">${esc(trunc(it.label, 14))}</text>`,
      );
    }
  }
  return parts.join('');
}

/* ---------------------------------------------------------------- 排期表 */

/** 排期表:行 = 事项(带区间),列 = 天 */
function planBoard(ctx: Ctx, start: string, days: number, x: number, y0: number, w: number, rowH: number): string {
  const parts: string[] = [];
  const labelW = 150;
  const axisW = w - labelW;
  const per = axisW / days;
  const d0 = isoDay(start);
  const rows = ctx.spec.items;
  // 天头(每 7 天一个刻度)
  for (let i = 0; i <= days; i += 7) {
    const gx = x + labelW + i * per;
    parts.push(`<line x1="${r2(gx)}" y1="${r2(y0 - 14)}" x2="${r2(gx)}" y2="${r2(y0 + rows.length * rowH)}" stroke="var(--d-grid)" stroke-width="1"/>`);
    const dd = dayIso(d0 + i);
    if (gx + 40 < x + w) {
      parts.push(`<text x="${r2(gx + 4)}" y="${r2(y0 - 18)}" font-size="11" fill="var(--d-muted)" style="${TAB}">${esc(dd.slice(5))}</text>`);
    }
  }
  rows.forEach((it, r) => {
    const ry = y0 + r * rowH;
    parts.push(`<line x1="${r2(x)}" y1="${r2(ry)}" x2="${r2(x + w)}" y2="${r2(ry)}" stroke="var(--d-grid)" stroke-width="1"/>`);
    parts.push(`<text x="${r2(x + 4)}" y="${r2(ry + rowH / 2 + 4)}" font-size="12" fill="var(--d-ink)">${esc(trunc(it.label, 20))}</text>`);
    const s = isoDay(it.date);
    const e = isoDay(it.until ?? it.date);
    const bx = x + labelW + (s - d0) * per;
    const bw = Math.max(per * 0.6, (e - s + 1) * per - 4);
    parts.push(
      `<rect x="${r2(bx + 2)}" y="${r2(ry + rowH / 2 - 9)}" width="${r2(bw)}" height="18" rx="5" fill="${ctx.colorOf(it.kind)}" fill-opacity="0.85"/>`,
    );
  });
  const by = y0 + rows.length * rowH;
  parts.push(`<line x1="${r2(x)}" y1="${r2(by)}" x2="${r2(x + w)}" y2="${r2(by)}" stroke="var(--d-grid)" stroke-width="1"/>`);
  // 今天那根线
  const tx = x + labelW + (isoDay(ctx.today) - d0) * per;
  if (tx > x + labelW && tx < x + w) {
    parts.push(`<line x1="${r2(tx)}" y1="${r2(y0 - 14)}" x2="${r2(tx)}" y2="${r2(by)}" stroke="var(--d-mark)" stroke-width="1.5"/>`);
  }
  return parts.join('');
}

/* ---------------------------------------------------------------- 主入口 */

/**
 * Render a calendar (month / week / year / bi-month / quarter / course / plan).
 */
export function renderCalendar(spec: CalendarSpec, o: RenderOpts): string {
  const { width, height, version, skin } = o;
  const ws = spec.weekStart === 1 ? 1 : 0;
  const ctx = buildCtx(spec, o, ws);

  const start = spec.start ?? ctx.today;
  const p = isoParts(start)!;
  let title = spec.title ?? '';

  // 图例:出现过的类别(坐底部一行 —— 类别多的时候放标题那行会压住标题)
  const kinds = [...new Set(spec.items.map((i) => i.kind))];
  const legendItems = kinds.map((k) => ({
    name: KINDS[k] ? (skin.rules.title === 'editorial' ? KINDS[k].en : KINDS[k].zh) : k,
    color: ctx.colorOf(k),
  }));
  const legendH = legendItems.length ? 26 : 0;
  const bodyTop = 62;
  // 页脚(统计/来源)—— 底部一行;提示单元在它上面
  const footerH = 24;
  const bodyW = width - PAD * 2;

  // 标题:与格子高度无关,先定下来
  if (!title) {
    if (spec.layout === 'month') {
      title = skin.rules.title === 'editorial' ? `${MONTH_EN[p.m - 1]} ${p.y}` : `${p.y}年${p.m}月`;
    } else if (spec.layout === 'year') {
      title = `${p.y}`;
    } else if (spec.layout === 'plan') {
      title = '排期';
    }
  }

  /** 主体:按给定的高度画一遍(高度会被提示单元挤掉一点,所以可能要画两遍) */
  const drawBody = (bodyH: number): string[] => {
  const parts: string[] = [];
  if (spec.layout === 'month') {
    parts.push(monthGrid(ctx, p.y, p.m, PAD, bodyTop, bodyW, bodyH));
  } else if (spec.layout === 'bimonth' || spec.layout === 'quarter') {
    const n = spec.layout === 'bimonth' ? 2 : 3;
    const months = spec.months?.length
      ? spec.months.slice(0, n).map((mm) => isoParts(`${mm}-01`)!)
      : Array.from({ length: n }, (_, i) => {
        const d = new Date(Date.UTC(p.y, p.m - 1 + i, 1));
        return { y: d.getUTCFullYear(), m: d.getUTCMonth() + 1 };
      });
    const gap = 24;
    const mw = (width - PAD * 2 - gap * (n - 1)) / n;
    const headY = bodyTop + 20;    // 周头
    const gridY = bodyTop + 28;   // 网格顶
    months.forEach((mm, i) => {
      const mx = PAD + i * (mw + gap);
      parts.push(`<text x="${r2(mx)}" y="${r2(bodyTop)}" font-size="15" font-weight="600" fill="var(--d-ink)">${esc(monthLabel(ctx, mm.y, mm.m))}</text>`);
      const noteH = 56;
      parts.push(monthGrid(ctx, mm.y, mm.m, mx, gridY, mw, bodyH - 28 - noteH, n === 3, headY));
      // 这个月的注意事项(横向:放在下面;纵向:放在右边)
      const mkey = `${mm.y}-${String(mm.m).padStart(2, '0')}`;
      const notes = ctx.spec.notes.filter((nt) => !nt.date || nt.date.startsWith(mkey));
      if (notes.length) {
        const vertical = spec.notesPos === 'right' || spec.notesPos === 'left';
        if (vertical) {
          const nx = spec.notesPos === 'left' ? mx - 120 : mx + mw + 6;
          notes.slice(0, 6).forEach((nt, k) => {
            parts.push(`<circle cx="${r2(nx + 3)}" cy="${r2(bodyTop + 6 + k * 16)}" r="2.5" fill="var(--d-faint)"/>`);
            parts.push(`<text x="${r2(nx + 10)}" y="${r2(bodyTop + 10 + k * 16)}" font-size="11" fill="var(--d-muted)">${esc(trunc(nt.text, 16))}</text>`);
          });
        } else {
          notes.slice(0, 3).forEach((nt, k) => {
            parts.push(`<text x="${r2(mx + 4)}" y="${r2(bodyTop + bodyH - noteH + 18 + k * 16)}" font-size="11" fill="var(--d-muted)">${esc(trunc(nt.text, n === 3 ? 22 : 34))}</text>`);
          });
        }
      }
    });
  } else if (spec.layout === 'year') {
    title = title || `${p.y}`;
    const cols = 4;
    const rows = 3;
    const gap = 14;
    const mw = (width - PAD * 2 - gap * (cols - 1)) / cols;
    const mh = (bodyH - gap * (rows - 1)) / rows;
    for (let i = 0; i < 12; i++) {
      const r = Math.floor(i / cols);
      const c = i % cols;
      const mx = PAD + c * (mw + gap);
      const my = bodyTop + r * (mh + gap);
      const mm = { y: p.y, m: i + 1 };
      parts.push(`<text x="${r2(mx)}" y="${r2(my + 12)}" font-size="12" font-weight="600" fill="var(--d-ink)">${esc(skin.rules.title === 'editorial' ? MONTH_EN[i] : `${i + 1}月`)}</text>`);
      parts.push(yearMini(ctx, mm.y, mm.m, mx, my + 20, mw, mh - 26));
    }
  } else if (spec.layout === 'week' || spec.layout === 'course') {
    const d0 = isoDay(start);
    const wd = isoWeekday(start);
    const back = (wd - ws + 7) % 7;
    const days = Array.from({ length: 7 }, (_, i) => dayIso(d0 - back + i));
    const periods = spec.periods?.length ? spec.periods : DEFAULT_PERIODS;
    if (!title) title = spec.layout === 'course' ? '课程表' : `${days[0].slice(5)} – ${days[6].slice(5)}`;
    parts.push(timeGrid(ctx, days, periods, PAD, bodyTop + 18, width - PAD * 2, bodyH - 18));
  } else {
    // plan
    const days = 56;
    parts.push(planBoard(ctx, start, days, PAD, bodyTop + 18, width - PAD * 2, Math.max(22, (bodyH - 18) / Math.max(1, spec.items.length))));
  }

  return parts;
  };

  // 先按「没有提示单元」画一遍:看看有没有塞不下的东西
  ctx.overflow.length = 0;
  let parts = drawBody(height - bodyTop - legendH - footerH - 14);
  let tipH = 0;
  if (ctx.overflow.length) {
    // 有塞不下的 → 页脚上方加一块提示,把明细列清楚;主体相应矮一点(重画一遍)
    tipH = tipHeight(ctx.overflow.length, bodyW);
    ctx.overflow.length = 0;
    parts = drawBody(height - bodyTop - legendH - footerH - tipH - 14);
  }

  // 页头:标题 + 右边一句摘要
  const nItems = spec.items.length;
  const nDays = spec.days.length;
  const nNotes = spec.notes.length;
  const meta = [nItems ? `${nItems} 个日程` : '', nNotes ? `${nNotes} 条备注` : ''].filter(Boolean).join(' · ');
  // 右边让开 Edit @X-CMD 角标(它占右上角那一块,最多 ~100px)
  const badgeRoom = Math.min(108, bodyW * 0.32);
  const titleSvg = titleBlock(title) + headerMeta(meta, PAD, 38, bodyW - badgeRoom);
  // 图例:出现过的类别(坐底部一行 —— 类别多的时候放标题那行会压住标题)
  const legendSvg = legendItems.length
    ? `<g transform="translate(0 ${r2(height - footerH - 18)})">${topLegend(legendItems, PAD, 0, 'left', 'circle')}</g>`
    : '';
  // 提示单元:主体里没画下的明细(格子太密时装不下的日程)
  const tipRows = ctx.overflow.map((o) => ({
    text: o.label,
    sub: o.time ? `${o.date.slice(5)} ${o.time}` : o.date.slice(5),
    color: o.kind === 'note' ? 'var(--d-faint)' : ctx.colorOf(o.kind),
  }));
  const tipSvg = tipRows.length
    ? tipUnit(tipRows, PAD, height - footerH - 18 - (legendH ? 26 : 0) - tipHeight(tipRows.length, bodyW) - 6, bodyW, '下面这些没画进格子')
    : '';
  // 页脚:统计 + 来源
  const footerSvg = footerUnit(
    [
      { label: '日程', value: String(nItems) },
      ...(nDays ? [{ label: '标记', value: String(nDays) }] : []),
      ...(nNotes ? [{ label: '备注', value: String(nNotes) }] : []),
    ],
    spec.source,
    PAD,
    height - 10,
    bodyW,
  );
  const bg = card(width, height, skin.rules.canvas === 'plain');
  const svg = svgDoc(width, height, 'calendar', version, title || 'calendar', spec, skin, bg + titleSvg + legendSvg + tipSvg + footerSvg + parts.join(''));
  return svg;
}

/** 年历里的迷你月:只有日期号,有事的日子带一个小点 */
function yearMini(ctx: Ctx, y: number, m: number, x: number, y0: number, w: number, h: number): string {
  const parts: string[] = [];
  const cols = 7;
  const cw = w / cols;
  const first = firstWeekday(y, m);
  const dim = daysInMonth(y, m);
  const rows = Math.ceil((first + dim) / 7);
  const ch = h / rows;
  const fs = Math.max(7, Math.min(10, Math.floor(cw * 0.62)));
  for (let i = 0; i < dim; i++) {
    const r = Math.floor((first + i) / 7);
    const c = (first + i) % 7;
    const iso = dayIso(Date.UTC(y, m - 1, i + 1) / 86400000);
    const rest = isRest(ctx, iso);
    const holiday = isHoliday(ctx, iso);
    const nx = x + c * cw + cw / 2;
    const ny = y0 + r * ch + ch / 2 + 3;
    parts.push(
      `<text x="${r2(nx)}" y="${r2(ny)}" text-anchor="middle" font-size="${fs}" fill="${holiday ? 'var(--d-mark)' : rest ? 'var(--d-faint)' : 'var(--d-text)'}">${i + 1}</text>`,
    );
    if (ctx.itemsOn(iso).length) {
      parts.push(`<circle cx="${r2(nx)}" cy="${r2(ny + 4)}" r="1.6" fill="var(--d-s2)"/>`);
    }
  }
  return parts.join('');
}
