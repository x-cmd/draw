import { describe, it, expect } from 'vitest';
import { renderFromUrl } from '../src/render/query.js';
import { parseCalendarSpec, calendarSpecFromParams, isoDay, dayIso, isoWeekday } from '../src/specs/calendar.js';

const url = (q: string): URL => new URL('https://x-cmd.com/draw?' + q);
const texts = (svg: string): string[] =>
  [...svg.matchAll(/<text[^>]*>([^<]*)<\/text>/g)].map((m) => m[1]);

describe('calendar(日历)', () => {
  it('扁平参数 → 规范形态', () => {
    const spec = parseCalendarSpec(calendarSpecFromParams(new URLSearchParams(
      'layout=month&start=2026-11-02&ev=2026-11-03;meeting;需求评审;14:00&day=2026-11-07;holiday;国庆&note=2026-11;本月提醒',
    )));
    expect(spec.layout).toBe('month');
    expect(spec.start).toBe('2026-11-02');
    expect(spec.items).toEqual([{ date: '2026-11-03', kind: 'meeting', label: '需求评审', time: '14:00' }]);
    expect(spec.days).toEqual([{ date: '2026-11-07', kind: 'holiday', label: '国庆' }]);
    expect(spec.notes[0].text).toBe('本月提醒');
  });

  it('ev 的第四段:时间(HH:MM)或结束日期(排期表用)', () => {
    const withTime = parseCalendarSpec(calendarSpecFromParams(new URLSearchParams('ev=2026-11-03;work;A;14:00')));
    expect(withTime.items[0].time).toBe('14:00');
    const withUntil = parseCalendarSpec(calendarSpecFromParams(new URLSearchParams('ev=2026-11-03;work;A;2026-11-09')));
    expect(withUntil.items[0].until).toBe('2026-11-09');
    expect(withUntil.items[0].time).toBeUndefined();
  });

  it('写错就报错(布局/日期/时间)', () => {
    expect(() => parseCalendarSpec(calendarSpecFromParams(new URLSearchParams('layout=nope')))).toThrow(/layout/);
    expect(() => parseCalendarSpec(calendarSpecFromParams(new URLSearchParams('start=2026-13-01')))).toThrow(/start/);
    expect(() => parseCalendarSpec(calendarSpecFromParams(new URLSearchParams('ev=2026-02-30;work;A')))).toThrow(/date/);
    expect(() => parseCalendarSpec(calendarSpecFromParams(new URLSearchParams('ev=2026-11-03;work;A;25:00')))).toThrow(/time|end date/);
  });

  it('月历:该月的每一天都在,事件落在对的那天', () => {
    const { svg } = renderFromUrl(url('type=calendar&layout=month&start=2026-11-01&ev=2026-11-03;meeting;需求评审'));
    const t = texts(svg);
    expect(t).toContain('需求评审');
    expect(t).toContain('2026年11月');
    // 11 月有 30 天:1..30 都要出现
    for (const d of [1, 15, 30]) expect(t).toContain(String(d));
    // 下个月的日子是淡的(12 月 1..5)
    expect(svg).toContain('var(--d-faint)');
  });

  it('放假:日期号是红的,假日的名字写在格子里', () => {
    const { svg } = renderFromUrl(url('type=calendar&layout=month&start=2026-10-01&day=2026-10-01;holiday;国庆节'));
    expect(texts(svg)).toContain('国庆节');
    expect(svg).toContain('var(--d-mark)');
  });

  it('周历:事件落在自己那一列、那一行', () => {
    const { svg } = renderFromUrl(url(
      'type=calendar&layout=week&start=2026-11-09&periods=09:00,14:00&ev=2026-11-11;meeting;评审;14:00',
    ));
    expect(texts(svg)).toContain('评审');
    // 14:00 的那一行 y 要比 09:00 的那一行大(事件在下面那格)
    const y09 = Number(/y="([\d.]+)"[^>]*>09:00</.exec(svg)![1]);
    const y14 = Number(/y="([\d.]+)"[^>]*>14:00</.exec(svg)![1]);
    expect(y14).toBeGreaterThan(y09);
  });

  it('课程表:一周从周一开始(ws=1),课落在对应的那天', () => {
    const { svg } = renderFromUrl(url(
      'type=calendar&layout=course&start=2026-11-02&ws=1&ev=2026-11-02;class;算法设计;08:00',
    ));
    expect(texts(svg)).toContain('算法设计');
    // 表头第一个是「一」(周一)
    expect(texts(svg)).toContain('一');
  });

  it('年历:12 个月都在', () => {
    const { svg } = renderFromUrl(url('type=calendar&layout=year&start=2026-01-01'));
    for (let m = 1; m <= 12; m++) expect(svg).toContain(`${m}月`);
  });

  it('三月历:三个月 + 每个月的备注', () => {
    const { svg } = renderFromUrl(url(
      'type=calendar&layout=quarter&start=2026-10-01&note=2026-10;国庆后复盘&note=2026-11;双周迭代',
    ));
    expect(texts(svg)).toContain('2026年10月');
    expect(texts(svg)).toContain('2026年11月');
    expect(texts(svg)).toContain('2026年12月');
    expect(texts(svg)).toContain('国庆后复盘');
    expect(texts(svg)).toContain('双周迭代');
  });

  it('排期表:事项是一根横条,带区间', () => {
    const { svg } = renderFromUrl(url(
      'type=calendar&layout=plan&start=2026-11-01&ev=2026-11-02;work;需求梳理;2026-11-06',
    ));
    expect(texts(svg)).toContain('需求梳理');
    expect(svg).toContain('rx="5"');
  });

  it('日期换算:闰年、周几', () => {
    expect(isoDay('2026-01-01')).toBe(isoDay('2025-12-31') + 1);
    expect(dayIso(isoDay('2026-02-28'))).toBe('2026-02-28');
    expect(dayIso(isoDay('2026-02-28') + 1)).toBe('2026-03-01'); // 2026 不是闰年
    expect(isoWeekday('2026-11-11')).toBe(3);            // 星期三
    expect(isoWeekday('2026-10-01')).toBe(4);            // 星期四
  });
});
