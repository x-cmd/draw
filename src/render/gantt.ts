// mermaid gantt 渲染器(#20 v1.1):vendored jison 解析 + 自绘时间轴/行条/里程碑。
// 入口 /draw/gantt?m=<源码>(首行 gantt 关键字可省;/draw/mermaid 的 gantt 分派保留兼容)。
// 支持:gantt 头、title、dateFormat YYYY-MM-DD(缺省)、section 分组、
// 任务 flags(done/active/crit/milestone)、显式日期或 after 链、时长 Nd/Nw/Nh、today 线。
// 不做(明确口径):依赖箭头、excludes 周末剔除、多 dateFormat 模板。
import { ApiError } from '../specs/index.js';
import { resolveVersion, type VersionInfo } from '../version.js';
import { resolveSkin, type Skin } from '../styles/index.js';
import { esc, r2, svgDoc, textW, sVar } from './svg.js';
import { schemeParam, type DrawResult } from './query.js';
import { mermaidGanttParser } from './vendor/mermaid-gantt-parser.js';

const N_EXAMPLE = 'm=' + encodeURIComponent('gantt\n  dateFormat YYYY-MM-DD\n  section Dev\n  Design :done, a1, 2026-11-01, 3d\n  Build :a2, after a1, 5d');

interface GTask {
  name: string;
  id?: string;
  flags: string[]; // done | active | crit | milestone
  start?: string; // 'YYYY-MM-DD'
  after?: string;
  endOrDur?: string; // 'YYYY-MM-DD' | '3d'/'2w'/'8h'
  progress?: number; // 0-100(语法扩展尾参,mermaid 标准之外)
}
export interface GanttDoc {
  title?: string;
  sections: { name: string; tasks: GTask[] }[];
}

const DAY = 86400000;
const parseISO = (s: string): number => {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(s.trim());
  if (!m) throw new ApiError(400, `gantt: cannot parse date "${s}" — v1 supports YYYY-MM-DD. Example: /draw/gantt?${N_EXAMPLE}`);
  return Date.UTC(+m[1], +m[2] - 1, +m[3]);
};
const durMs = (s: string): number => {
  const m = /^(\d+(?:\.\d+)?)([hdw])$/.exec(s.trim());
  if (!m) throw new ApiError(400, `gantt: cannot parse duration "${s}" — use like 3d/2w/8h`);
  const unit: Record<string, number> = { h: 3600000, d: DAY, w: 7 * DAY };
  return +m[1]! * unit[m[2]!]!;
};
const fmtDay = (t: number): string => {
  const d = new Date(t);
  return `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, '0')}-${String(d.getUTCDate()).padStart(2, '0')}`;
};

/** 解析 mermaid gantt 源码 → GanttDoc(addTask 收到的是 ":flags, id, start, 时长" 原始串,自行拆) */
export function parseGantt(text: string): GanttDoc {
  const doc: GanttDoc = { sections: [] };
  let cur: GanttDoc['sections'][number] | undefined;
  const yy = {
    setDiagramTitle(t: string) { doc.title = t.trim(); },
    setAccTitle() {}, setAccDescription() {}, setClickEvent() {}, setLink() {},
    setAxisFormat() {}, setExcludes() {}, setIncludes() {}, setTodayMarker() {},
    setWeekday() {}, setWeekend() {}, setTickInterval() {}, setTopAxis() {},
    enableInclusiveEndDates() {}, setDisplayMode() {}, setShowTaskTooltip() {},
    setDateFormat() {}, // v1 只认 YYYY-MM-DD,声明了别的按缺省处理
    addSection(name: string) {
      cur = { name: name.trim() || 'Tasks', tasks: [] };
      doc.sections.push(cur);
    },
    addTask(name: string, raw: string) {
      if (!cur) { cur = { name: 'Tasks', tasks: [] }; doc.sections.push(cur); }
      const meta = String(raw ?? '').replace(/^:/, '').split(',').map(x => x.trim()).filter(Boolean);
      const flags: string[] = [];
      let id: string | undefined;
      let start: string | undefined;
      let after: string | undefined;
      let endOrDur: string | undefined;
      let progress: number | undefined;
      let consumedFlags = true;
      for (const tk of meta) {
        if (consumedFlags && /^(done|active|crit|critical|milestone)$/i.test(tk)) { flags.push(tk.toLowerCase() === 'critical' ? 'crit' : tk.toLowerCase()); continue; }
        consumedFlags = false;
        const pm = /^(\d+(?:\.\d+)?)%$/.exec(tk);
        if (pm) { progress = Math.min(100, Math.max(0, +pm[1])); continue; } // 语法扩展:可选完成百分比
        if (tk.startsWith('after ')) { after = tk.slice(6).trim(); continue; }
        if (id === undefined) { id = tk; continue; }
        if (start === undefined) { start = tk; continue; }
        if (endOrDur === undefined) { endOrDur = tk; }
      }
      cur.tasks.push({ name: name.trim(), id, flags, start, after, endOrDur, ...(progress !== undefined ? { progress } : {}) });
    },
  };
  mermaidGanttParser.yy = yy as unknown as typeof mermaidGanttParser.yy;
  try {
    mermaidGanttParser.parse(text);
  } catch (e) {
    throw new ApiError(400, `gantt syntax error: ${e instanceof Error ? e.message.split('\n')[0] : String(e)}. Example: /draw/gantt?${N_EXAMPLE}`);
  }
  if (!doc.sections.some(s => s.tasks.length)) {
    throw new ApiError(400, `gantt: no tasks found. Example: /draw/gantt?${N_EXAMPLE}`);
  }
  return doc;
}

interface Span { name: string; start: number; end: number; flags: Set<string>; sectionIdx: number; tip: string }

/** 展开任务:日期解析、after 链、里程碑零宽 → 统一 Span 列表 */
function resolveSpans(doc: GanttDoc): Span[] {
  const byId = new Map<string, GTask>();
  doc.sections.forEach(s => s.tasks.forEach(t => { if (t.id) byId.set(t.id, t); }));
  const resolved = new Map<string, { start: number; end: number }>();
  const resolve = (t: GTask): { start: number; end: number } => {
    const key = t.id ?? t.name;
    if (resolved.has(key)) return resolved.get(key)!;
    let start: number;
    if (t.after) {
      const dep = byId.get(t.after);
      if (!dep) throw new ApiError(400, `gantt: "after ${t.after}" references unknown task id`);
      start = resolve(dep).end;
    } else if (t.start) {
      start = parseISO(t.start);
    } else {
      throw new ApiError(400, `gantt: task "${t.name}" needs a start date or "after <id>"`);
    }
    let end: number;
    const dur = t.endOrDur ?? '1d';
    if (/^\d{4}-\d{2}-\d{2}$/.test(dur)) end = parseISO(dur); // 显式结束日
    else end = start + Math.max(durMs(dur), 3600000); // 时长
    if (end < start) end = start + DAY;
    const r = { start, end: Math.max(end, start + DAY) };
    resolved.set(key, r);
    return r;
  };
  const spans: Span[] = [];
  doc.sections.forEach((s, si) => {
    for (const t of s.tasks) {
      const { start, end } = resolve(t);
      const flags = new Set(t.flags);
      const isMs = flags.has('milestone');
      const s2 = isMs ? start : start;
      const e2 = isMs ? start : end;
      spans.push({
        name: t.name, start: s2, end: e2, flags, sectionIdx: si,
        tip: isMs ? `${t.name} · ${fmtDay(start)} · milestone` : `${t.name} · ${fmtDay(start)} → ${fmtDay(end)} · ${Math.round((e2 - s2) / DAY)}d${t.progress !== undefined ? ` · ${Math.round(t.progress)}%` : ''}`,
      });
    }
  });
  return spans;
}

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

/** 渲染(视觉 2.0,对齐行业惯例):双行轴(月/年带+日/周/月刻度)、实线 hairline 网格、
 *  section 交替色带、周末底纹、today 实线;状态色 done=实色灰 / crit=淡红+描边 / active=满色+墨描边。
 *  opts.scale 显式时间粒度(缺省按跨度自适应);任务可带语法扩展的完成百分比(条内深色进度段) */
export function renderGantt(doc: GanttDoc, opts: { v: VersionInfo; skin: Skin; interactive: boolean; width?: number; height?: number; scale?: 'day' | 'week' | 'month' }): DrawResult {
  const spans = resolveSpans(doc);
  const minT = Math.min(...spans.map(s => s.start));
  const maxT = Math.max(...spans.map(s => s.end));
  const spanDays = Math.max(1, Math.round((maxT - minT) / DAY));

  const PAD = 26;
  const titleH = doc.title ? 40 : 0;
  const upperH = 20; // 上行轴:月/年带
  const lowerH = 24; // 下行轴:日/周/月刻度
  const axisH = upperH + lowerH;
  let sectionH = 26;
  let rowH = 28;
  let barH = 16;
  let labelW = 0;
  doc.sections.forEach(s => { labelW = Math.max(labelW, textW(s.name, 12) + 18); s.tasks.forEach(t => { labelW = Math.max(labelW, textW(t.name, 12) + 18); }); });
  labelW = Math.min(Math.max(labelW, 150), 300);

  const rows = doc.sections.reduce((a, s) => a + 1 + s.tasks.length, 0);
  // 尺寸语义与图表家族一致:显式 w/h = 精确画布(行高自适应分配,7:4 画框),
  // 缺省 = 自然尺寸(needW/needH 兜底,与旧版逐字节一致)
  const needW = labelW + PAD * 2 + Math.max(spanDays * 14, 240);
  const width = opts.width !== undefined ? Math.max(200, Math.min(2400, opts.width)) : Math.min(Math.max(needW, 560), 2400);
  if (width < labelW + PAD * 2 + 80) labelW = Math.max(70, width - PAD * 2 - 80); // 窄画布压缩标签列,保时间轴最小可用
  let height = opts.height !== undefined ? Math.max(140, Math.min(2000, opts.height)) : Math.min(Math.max(titleH + axisH + rows * rowH + PAD * 2, 200), 2000);
  let topOff = 0;
  if (opts.height !== undefined) {
    const bodyH = opts.height - PAD * 2 - titleH - axisH;
    const unit = Math.min(48, Math.max(22, bodyH / rows));
    rowH = Math.floor(unit); // floor 保证内容不超高;余量进 topOff 垂直居中
    sectionH = Math.max(22, Math.round(unit * 0.92));
    barH = Math.min(20, Math.max(14, Math.round(rowH * 0.57)));
    const contentH = rows * rowH;
    topOff = Math.max(0, Math.round((bodyH - contentH) / 2));
    height = Math.max(height, titleH + axisH + topOff + contentH + PAD * 2); // 行过多时允许超高(画框 contain 兜底)
  }

  const x0 = PAD + labelW;
  const x1 = width - PAD;
  const bodyTop = titleH + axisH;
  const bodyBottom = height - PAD;
  const pxPerDay = (x1 - x0) / spanDays;
  const xOf = (t: number): number => x0 + ((t - minT) / DAY) * pxPerDay;

  // 下行刻度粒度:显式 scale 优先,缺省按跨度自适应(≤35d 日、≤130d 周、否则月)
  const mode: 'day' | 'week' | 'month' = opts.scale ?? (spanDays <= 35 ? 'day' : spanDays <= 130 ? 'week' : 'month');
  const daily = mode === 'day';
  const ticks: { t: number; label: string }[] = [];
  const d0 = new Date(minT);
  const day = new Date(Date.UTC(d0.getUTCFullYear(), d0.getUTCMonth(), d0.getUTCDate()));
  if (daily) {
    // 列太窄时按步长抽稀标签(网格线保留)
    const step = pxPerDay >= 8 ? 1 : Math.ceil(8 / pxPerDay);
    for (let i = 0; i <= spanDays + 1; i++) {
      const t = day.getTime() + i * DAY;
      if (t > maxT) break;
      if (i % step === 0) ticks.push({ t, label: String(new Date(t).getUTCDate()).padStart(2, '0') });
    }
  } else if (mode === 'week') {
    while (day.getUTCDay() !== 1) day.setUTCDate(day.getUTCDate() + 1);
    for (let t = day.getTime(); t <= maxT; t += 7 * DAY) {
      const d = new Date(t);
      ticks.push({ t, label: `${MONTHS[d.getUTCMonth()]} ${String(d.getUTCDate()).padStart(2, '0')}` });
    }
  } else {
    day.setUTCDate(1);
    for (let t = day.getTime(); t <= maxT; t = new Date(t).getUTCMonth() === 11 ? Date.UTC(new Date(t).getUTCFullYear() + 1, 0, 1) : Date.UTC(new Date(t).getUTCFullYear(), new Date(t).getUTCMonth() + 1, 1)) {
      const d = new Date(t);
      ticks.push({ t, label: `${MONTHS[d.getUTCMonth()]} ${d.getUTCFullYear()}` });
    }
  }

  // 上行带:日/周粒度=自然月,月粒度=自然年(首段/跨年带年份)
  const upperSpans: { start: number; end: number; label: string }[] = [];
  {
    const byMonth = mode !== 'month';
    let u = byMonth ? Date.UTC(d0.getUTCFullYear(), d0.getUTCMonth(), 1) : Date.UTC(d0.getUTCFullYear(), 0, 1);
    while (u <= maxT) {
      const d = new Date(u);
      const next = byMonth
        ? d.getUTCMonth() === 11 ? Date.UTC(d.getUTCFullYear() + 1, 0, 1) : Date.UTC(d.getUTCFullYear(), d.getUTCMonth() + 1, 1)
        : Date.UTC(d.getUTCFullYear() + 1, 0, 1);
      const label = byMonth
        ? d.getUTCMonth() === 0 || upperSpans.length === 0 ? `${MONTHS[d.getUTCMonth()]} ${d.getUTCFullYear()}` : MONTHS[d.getUTCMonth()]
        : String(d.getUTCFullYear());
      upperSpans.push({ start: u, end: next, label });
      u = next;
    }
  }

  const parts: string[] = [];
  // 表头带(轴两行+标签列同铺浅底,"表格+时间轴"结构感)+ 标签列|时间线竖分隔
  parts.push(`<rect x="${PAD}" y="${titleH}" width="${r2(x1 - PAD)}" height="${axisH}" fill="var(--d-ink)" fill-opacity="0.03"/>`);
  parts.push(`<line x1="${x0}" y1="${titleH}" x2="${x0}" y2="${bodyBottom}" stroke="var(--d-border)" data-x0="${x0}"/>`);
  // 周末底纹(日粒度、每列足够宽才铺,否则成噪点)
  if (pxPerDay >= 8) {
    for (let t = minT; t <= maxT; t += DAY) {
      const wd = new Date(t).getUTCDay();
      if (wd !== 0 && wd !== 6) continue;
      const bx = Math.max(xOf(t), x0);
      const bw = Math.min(xOf(t + DAY), x1) - bx;
      if (bw > 0.5) parts.push(`<rect x="${r2(bx)}" y="${bodyTop}" width="${r2(bw)}" height="${r2(bodyBottom - bodyTop)}" fill="var(--d-grid)"/>`);
    }
  }

  // section 交替色带(隔区铺,含标签列,行追踪)
  let bandY = bodyTop + topOff;
  doc.sections.forEach((sec, si) => {
    const h = sectionH + sec.tasks.length * rowH;
    if (si % 2 === 1) parts.push(`<rect x="${PAD}" y="${r2(bandY)}" width="${r2(x1 - PAD)}" height="${r2(h)}" fill="var(--d-ink)" fill-opacity="0.035"/>`);
    bandY += h;
  });

  // 下行刻度 + 细网格(实线 hairline;日粒度下周末数字弱化;无标题时右缘让位 Edit 角标)
  for (const tk of ticks) {
    const x = Math.min(xOf(tk.t), x1);
    parts.push(`<line x1="${r2(x)}" y1="${bodyTop}" x2="${r2(x)}" y2="${bodyBottom}" stroke="var(--d-grid)"/>`);
    if (!doc.title && x > width - 110) continue; // 角标区(约85px),只画线不画字
    const weekend = daily && (new Date(tk.t).getUTCDay() === 0 || new Date(tk.t).getUTCDay() === 6);
    parts.push(`<text x="${r2(x)}" y="${titleH + upperH + 16}" text-anchor="middle" font-size="${daily ? 10 : 11}" fill="${weekend ? 'var(--d-faint)' : 'var(--d-muted)'}">${esc(tk.label)}</text>`);
  }
  // 上行带标签 + 加强边界线(画在细网格之上)+ 上下轴分隔线
  for (const us of upperSpans) {
    const bx = Math.min(Math.max(xOf(us.start), x0), x1);
    const cx = (Math.max(xOf(us.start), x0) + Math.min(xOf(us.end), x1)) / 2;
    parts.push(`<line x1="${r2(bx)}" y1="${bodyTop}" x2="${r2(bx)}" y2="${bodyBottom}" stroke="var(--d-border)"/>`);
    parts.push(`<text x="${r2(cx)}" y="${titleH + 14}" text-anchor="middle" font-size="11" font-weight="500" fill="var(--d-text)">${esc(us.label)}</text>`);
  }
  parts.push(`<line x1="${x0}" y1="${titleH + upperH}" x2="${x1}" y2="${titleH + upperH}" stroke="var(--d-border)"/>`);
  parts.push(`<line x1="${x0}" y1="${bodyBottom}" x2="${x1}" y2="${bodyBottom}" stroke="var(--d-baseline)" stroke-width="1"/>`);

  // 行与时间条(interactive:数据带 data-row=行号/data-node=任务 id/data-after=前置,
  // 行尾铺透明命中 rect——悬停/点击的命中区是整行而非 16px 条,与竞品一致。
  // 标签文本统一收进 #gl 组:explore 页克隆裁剪做 sticky 任务列)
  let y = bodyTop + topOff;
  let ri = 0;
  const labels: string[] = [];
  const nSeries = Math.max(1, opts.skin.series.length);
  doc.sections.forEach((sec, si) => {
    labels.push(`<text x="${PAD}" y="${r2(y + 17)}" font-size="12" font-weight="600" fill="var(--d-ink)">${esc(sec.name)}</text>`);
    y += sectionH;
    const color = sVar(si % nSeries);
    for (const t of sec.tasks) {
      const sp = spans.find(s => s.name === t.name && s.sectionIdx === si)!;
      const rowAttr = opts.interactive ? ` data-row="${ri}"` : '';
      const nodeAttr = opts.interactive
        ? ` data-node="${esc(t.id ?? t.name)}"${t.after ? ` data-after="${esc(t.after)}"` : ''}${rowAttr} data-tip="${esc(sp.tip)}"`
        : '';
      labels.push(`<text x="${r2(x0 - 10)}" y="${r2(y + rowH / 2 + 4)}" text-anchor="end" font-size="12" fill="var(--d-text)"${rowAttr}>${esc(t.name)}</text>`);
      const cy = y + rowH / 2;
      if (sp.flags.has('milestone')) {
        parts.push(`<polygon points="${r2(xOf(sp.start))},${r2(cy - 7)} ${r2(xOf(sp.start) + 7)},${r2(cy)} ${r2(xOf(sp.start))},${r2(cy + 7)} ${r2(xOf(sp.start) - 7)},${r2(cy)}" fill="var(--d-ink)"${nodeAttr}/>`);
        // 里程碑日期(右侧放不下换左侧)
        const mx = xOf(sp.start);
        const dTxt = fmtDay(sp.start);
        if (mx + 14 + textW(dTxt, 10) <= x1) parts.push(`<text x="${r2(mx + 12)}" y="${r2(cy + 3.5)}" font-size="10" fill="var(--d-muted)">${dTxt}</text>`);
        else parts.push(`<text x="${r2(mx - 12)}" y="${r2(cy + 3.5)}" text-anchor="end" font-size="10" fill="var(--d-muted)">${dTxt}</text>`);
      } else {
        const bx = xOf(sp.start);
        const bw = Math.max(4, xOf(sp.end) - bx);
        const done = sp.flags.has('done');
        const active = sp.flags.has('active');
        const crit = sp.flags.has('crit');
        const fill = done ? 'var(--d-faint)' : crit ? 'var(--d-mark)' : color;
        // 完成进度(语法扩展):底条降不透明度,左侧实色进度段(dhtmlx/Frappe 惯例)
        const p = t.progress;
        const baseOp = crit ? 0.16 : p !== undefined ? 0.35 : 1;
        parts.push(`<rect x="${r2(bx)}" y="${r2(cy - barH / 2)}" width="${r2(bw)}" height="${barH}" rx="4" fill="${fill}"${baseOp !== 1 ? ` fill-opacity="${baseOp}"` : ''} stroke="${crit ? 'var(--d-mark)' : active ? 'var(--d-ink)' : 'none'}" stroke-width="${crit || active ? 1.5 : 0}"${nodeAttr}/>`);
        if (p !== undefined && p > 0) {
          const pw = Math.max(3, bw * p / 100);
          parts.push(`<rect x="${r2(bx)}" y="${r2(cy - barH / 2)}" width="${r2(Math.min(pw, bw))}" height="${barH}" rx="4" fill="${fill}" fill-opacity="${crit ? 0.45 : 1}"${nodeAttr ? ` data-row="${ri}"` : ''}/>`);
        }
      }
      if (opts.interactive) parts.push(`<rect class="rowhit" x="${PAD}" y="${r2(y)}" width="${r2(x1 - PAD)}" height="${rowH}" fill="transparent"${rowAttr} data-tip="${esc(sp.tip)}"/>`);
      y += rowH;
      ri += 1;
    }
  });
  parts.push(`<g id="gl">${labels.join('')}</g>`);

  // today 线(实线,贯穿内容区;data-today 供 explore 页 Today 按钮定位滚动)
  const today = Date.now();
  if (today >= minT && today <= maxT) {
    const tx = xOf(today);
    parts.push(`<line x1="${r2(tx)}" y1="${bodyTop}" x2="${r2(tx)}" y2="${bodyBottom}" stroke="var(--d-mark)" stroke-width="1.5" data-today=""/>`);
  }

  // 状态图例(只画图里出现过的 flag;惯例放底部一行)
  {
    const flagSet = new Set<string>();
    spans.forEach(s => s.flags.forEach(f => flagSet.add(f)));
    const legendItems: [string, string][] = ([['done', 'Done'], ['active', 'Active'], ['crit', 'Critical'], ['milestone', 'Milestone']] as [string, string][]).filter(([k]) => flagSet.has(k));
    if (legendItems.length) {
      let lx = PAD;
      const ly = bodyBottom + 7;
      for (const [k, label] of legendItems) {
        if (k === 'milestone') parts.push(`<polygon points="${r2(lx + 5)},${r2(ly)} ${r2(lx + 10)},${r2(ly + 5)} ${r2(lx + 5)},${r2(ly + 10)} ${r2(lx)},${r2(ly + 5)}" fill="var(--d-ink)"/>`);
        else if (k === 'done') parts.push(`<rect x="${r2(lx)}" y="${r2(ly)}" width="10" height="10" rx="2" fill="var(--d-faint)"/>`);
        else if (k === 'active') parts.push(`<rect x="${r2(lx)}" y="${r2(ly)}" width="10" height="10" rx="2" fill="${sVar(0)}" stroke="var(--d-ink)" stroke-width="1"/>`);
        else parts.push(`<rect x="${r2(lx)}" y="${r2(ly)}" width="10" height="10" rx="2" fill="var(--d-mark)" fill-opacity="0.16" stroke="var(--d-mark)" stroke-width="1.2"/>`);
        lx += 14;
        parts.push(`<text x="${r2(lx)}" y="${r2(ly + 9)}" font-size="10" fill="var(--d-muted)">${label}</text>`);
        lx += textW(label, 10) + 18;
      }
    }
  }

  const titleSvg = doc.title
    ? `<text x="${PAD}" y="${PAD + 14}" font-size="18" font-weight="500" letter-spacing="-0.02em" fill="var(--d-ink)">${esc(doc.title)}</text>`
    : '';
  // interactive:内嵌解析后的任务元数据(explore 详情卡数据源:起止/时长/状态/进度/依赖)
  let gtasksSvg = '';
  if (opts.interactive) {
    const next = new Map<string, string[]>();
    doc.sections.forEach(s => s.tasks.forEach(t => {
      if (!t.after) return;
      const a = next.get(t.after) ?? [];
      a.push(t.id ?? t.name);
      next.set(t.after, a);
    }));
    const tasks = doc.sections.flatMap(sec => sec.tasks.map(t => {
      const sp = spans.find(s => s.name === t.name && s.sectionIdx === doc.sections.indexOf(sec))!;
      return {
        id: t.id ?? t.name, name: t.name, sec: sec.name,
        start: fmtDay(sp.start), end: fmtDay(sp.end), days: Math.round((sp.end - sp.start) / DAY),
        st: [...sp.flags], ...(t.progress !== undefined ? { p: t.progress } : {}),
        ...(t.after ? { after: t.after } : {}), ...(next.get(t.id ?? t.name)?.length ? { next: next.get(t.id ?? t.name)! } : {}),
      };
    }));
    gtasksSvg = `<metadata id="gtasks">${esc(JSON.stringify(tasks))}</metadata>`;
  }
  // interactive:包 #am 根容器(复用 explore 页 tooltip/缩放脚本)+ 行高亮/依赖链 CSS
  const interStyle = opts.interactive
    ? `<style>#am [data-node]{cursor:pointer;transition:filter .12s ease,opacity .15s ease}` +
      `#am [data-node]:hover{filter:brightness(1.15)}` +
      `#am rect.rowhit{cursor:default}` +
      `#am text.rh{fill:var(--d-ink);font-weight:600}` +
      `#am rect.rh{filter:brightness(1.12)}` +
      `#am rect.rowhit.rh{filter:none;fill:var(--d-ink);fill-opacity:.05}` +
      `#am.hl [data-node],#am.hl text[data-row]{opacity:.3}` +
      `#am.hl [data-node].on,#am.hl text[data-row].on{opacity:1}</style>`
    : '';
  const svg = svgDoc(width, height, 'gantt', opts.v.version, doc.title ?? `gantt, ${spans.length} tasks`, { type: 'gantt', doc }, opts.skin, interStyle + gtasksSvg + `<g id="am" data-scale="${mode}">${titleSvg + parts.join('')}</g>`);
  return { svg, version: opts.v.version, cacheControl: opts.v.cacheControl };
}

/** /draw/gantt?m=... 入口(m 可省首行 gantt 关键字;/draw/mermaid 的 gantt 分派亦走此) */
export function renderGanttFromUrl(url: URL, interactive = false): DrawResult {
  const params = url.searchParams;
  const m = params.get('m') ?? '';
  const doc = parseGantt(/^\s*gantt\b/i.test(m) ? m : `gantt\n${m}`);
  if (!doc.title) doc.title = params.get('title')?.trim() || undefined; // 与 flowchart 入口一致:?title= 回退
  const v = resolveVersion(params.get('v'));
  const skin = resolveSkin('sankey', params.get('t'), schemeParam(params));
  const width = /(\d+)/.test(params.get('w') ?? '') ? Math.max(200, Math.min(2400, +params.get('w')!)) : undefined;
  const height = /(\d+)/.test(params.get('h') ?? '') ? Math.max(140, Math.min(2000, +params.get('h')!)) : undefined;
  const sv = params.get('scale');
  const scale = sv === 'day' || sv === 'week' || sv === 'month' ? sv : undefined;
  return renderGantt(doc, { v, skin, interactive, width, height, ...(scale ? { scale } : {}) });
}
