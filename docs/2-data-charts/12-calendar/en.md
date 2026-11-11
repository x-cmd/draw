---
x-title: Calendar — a month, a week, a year, plus timetables and schedules
x-desc: 'x-cmd/draw calendar (`/draw?type=calendar`): month, week, year, two-month, three-month, course timetable and project schedule — the URL carries the content.'
x-sidebar: draw calendar
x-keywords: calendar, month view, week view, year view, timetable, course schedule, gantt-like, draw
x-json-ld:
  '@context': https://schema.org
  '@graph':
    - '@type': TechArticle
      headline: 'draw calendar'
      inLanguage: 'en'
      about: 'x-cmd/draw 12-calendar'
---

# Calendar — a month, a week, a year, plus timetables and schedules

Course timetables, work schedules, week and month views — they are all
**a span of time × a cell** tables. draw makes them one chart type: the same
grid machinery, the content in the URL.

The layout follows Apple's calendar: white card, hairline rules, a small
restrained day number, **today in a red disc**, weekend numbers in grey, and
one coloured dot plus a name per event. With many categories the legend moves
to the bottom row.

## Seven shapes

| `layout=` | what | look |
|---|---|---|
| `month` | month view | one month, 7 columns, the events of each day in its cell |
| `week` | week view | a time grid: columns are days, rows are slots |
| `year` | year view | 12 mini months, a dot on the days that have something |
| `bimonth` | two months | side by side (narrow cells, dots only) |
| `quarter` | three months | side by side, notes below (`npos=right` puts them on the side) |
| `course` | course timetable | the week grid, but Monday-first (`ws=1`) and the rows are periods |
| `plan` | schedule board | rows are items with a date range, columns are days, a red line marks today |

## Parameters

| param | meaning |
|---|---|
| `layout=` | one of the seven above |
| `start=` | the anchor date (`YYYY-MM-DD`) — which month, week or year |
| `ev=` | an event: `date;kind;label[;time or end date]`, repeatable |
| `day=` | a day's own kind: `date;work\|rest\|holiday[;name]`, repeatable |
| `note=` | a note: `date (or YYYY-MM);text`, repeatable |
| `months=` | which months the two/three-month view shows (`2026-10,2026-11`) |
| `periods=` | the rows of the week/course grid (slot start times) |
| `ws=` | which day the week starts on: `0`=Sunday (default), `1`=Monday |
| `npos=` | where the notes go in the three-month view: `below` (default)/`right`/`left` |
| `title=` `w=` `h=` `t=` | title, size, style |

The event kind picks the colour and shows up in the legend: `work`, `meeting`,
`review`, `release`, `focus`, `travel`, `health`, `personal`, `class`, `oncall`.

## Examples

### A month

```text
https://x-cmd.com/draw?type=calendar&layout=month&start=2026-11-01&w=760&h=520&ev=2026-11-02;meeting;%E5%9B%A2%E9%98%9F%E5%91%A8%E4%BC%9A;09:30&ev=2026-11-02;review;%E9%9C%80%E6%B1%82%E8%AF%84%E5%AE%A1;14:00&ev=2026-11-03;review;%E4%BB%A3%E7%A0%81%E8%AF%84%E5%AE%A1;10:00&ev=2026-11-03;focus;%E5%86%99%E6%96%87%E6%A1%A3;15:00&ev=2026-11-04;meeting;%E5%9B%A2%E9%98%9F%E5%91%A8%E4%BC%9A;09:30&ev=2026-11-04;meeting;%E5%AE%A2%E6%88%B7%E6%B2%9F%E9%80%9A;16:00&ev=2026-11-05;release;%E5%8F%91%20v0.3.1;11:00&ev=2026-11-05;oncall;%E5%80%BC%E7%8F%AD%E4%BA%A4%E6%8E%A5;14:30&ev=2026-11-06;work;%E5%8F%8C%E5%91%A8%E8%BF%AD%E4%BB%A3%E8%AE%A1%E5%88%92;10:00&ev=2026-11-06;health;%E7%9C%8B%E7%89%99%E5%8C%BB;16:00&ev=2026-11-09;meeting;%E5%9B%A2%E9%98%9F%E5%91%A8%E4%BC%9A;09:30&ev=2026-11-09;review;%E6%9E%B6%E6%9E%84%E8%AF%84%E5%AE%A1;15:00&ev=2026-11-10;travel;%E5%87%BA%E5%B7%AE%E4%B8%8A%E6%B5%B7;08:00&ev=2026-11-10;oncall;%E5%80%BC%E7%8F%AD;20:00&ev=2026-11-11;class;%E7%AE%97%E6%B3%95%E8%AF%BE;19:00&ev=2026-11-12;meeting;%E5%9B%A2%E9%98%9F%E5%91%A8%E4%BC%9A;09:30&ev=2026-11-12;release;%E5%8F%91%20v0.3.2;11:00&ev=2026-11-13;meeting;%E4%B8%8E%E8%AE%BE%E8%AE%A1%E5%AF%B9%E4%B8%80%E7%89%88;10:00&ev=2026-11-13;focus;%E6%80%A7%E8%83%BD%E4%BC%98%E5%8C%96;14:00&ev=2026-11-16;meeting;%E5%9B%A2%E9%98%9F%E5%91%A8%E4%BC%9A;09:30&ev=2026-11-16;review;%E5%AD%A3%E5%BA%A6%E5%9B%9E%E9%A1%BE;15:00&ev=2026-11-17;meeting;%E5%AE%A2%E6%88%B7%E6%B2%9F%E9%80%9A;10:00&ev=2026-11-17;oncall;%E5%80%BC%E7%8F%AD;11:00&ev=2026-11-18;meeting;%E5%9B%A2%E9%98%9F%E5%91%A8%E4%BC%9A;09:30&ev=2026-11-18;review;%E7%81%B0%E5%BA%A6%E8%AF%84%E5%AE%A1;14:00&ev=2026-11-19;release;%E5%8F%91%20v0.4.0;10:00&ev=2026-11-19;health;%E4%BD%93%E6%A3%80;16:00&ev=2026-11-20;meeting;%E5%9B%A2%E9%98%9F%E5%91%A8%E4%BC%9A;09:30&ev=2026-11-20;focus;%E6%8A%80%E6%9C%AF%E5%80%BA;14:00&ev=2026-11-23;meeting;%E5%9B%A2%E9%98%9F%E5%91%A8%E4%BC%9A;09:30&ev=2026-11-23;meeting;%E9%9D%A2%E8%AF%95;11:00&ev=2026-11-24;oncall;%E5%80%BC%E7%8F%AD;10:00&ev=2026-11-24;focus;%E6%96%87%E6%A1%A3%E5%86%B2%E5%88%BA;15:00&ev=2026-11-25;meeting;%E5%9B%A2%E9%98%9F%E5%91%A8%E4%BC%9A;09:30&ev=2026-11-25;work;%E8%B7%AF%E7%BA%BF%E5%9B%BE;14:00&ev=2026-11-26;meeting;%E5%AE%A2%E6%88%B7%E6%B2%9F%E9%80%9A;10:00&ev=2026-11-26;oncall;%E5%80%BC%E7%8F%AD;16:00&ev=2026-11-27;meeting;%E5%9B%A2%E9%98%9F%E5%91%A8%E4%BC%9A;09:30&ev=2026-11-27;release;%E5%8F%91%20v0.4.1;15:00
```

[![A team in November](https://x-cmd.com/draw?type=calendar&layout=month&start=2026-11-01&w=760&h=520&ev=2026-11-02;meeting;%E5%9B%A2%E9%98%9F%E5%91%A8%E4%BC%9A;09:30&ev=2026-11-02;review;%E9%9C%80%E6%B1%82%E8%AF%84%E5%AE%A1;14:00&ev=2026-11-03;review;%E4%BB%A3%E7%A0%81%E8%AF%84%E5%AE%A1;10:00&ev=2026-11-03;focus;%E5%86%99%E6%96%87%E6%A1%A3;15:00&ev=2026-11-04;meeting;%E5%9B%A2%E9%98%9F%E5%91%A8%E4%BC%9A;09:30&ev=2026-11-04;meeting;%E5%AE%A2%E6%88%B7%E6%B2%9F%E9%80%9A;16:00&ev=2026-11-05;release;%E5%8F%91%20v0.3.1;11:00&ev=2026-11-05;oncall;%E5%80%BC%E7%8F%AD%E4%BA%A4%E6%8E%A5;14:30&ev=2026-11-06;work;%E5%8F%8C%E5%91%A8%E8%BF%AD%E4%BB%A3%E8%AE%A1%E5%88%92;10:00&ev=2026-11-06;health;%E7%9C%8B%E7%89%99%E5%8C%BB;16:00&ev=2026-11-09;meeting;%E5%9B%A2%E9%98%9F%E5%91%A8%E4%BC%9A;09:30&ev=2026-11-09;review;%E6%9E%B6%E6%9E%84%E8%AF%84%E5%AE%A1;15:00&ev=2026-11-10;travel;%E5%87%BA%E5%B7%AE%E4%B8%8A%E6%B5%B7;08:00&ev=2026-11-10;oncall;%E5%80%BC%E7%8F%AD;20:00&ev=2026-11-11;class;%E7%AE%97%E6%B3%95%E8%AF%BE;19:00&ev=2026-11-12;meeting;%E5%9B%A2%E9%98%9F%E5%91%A8%E4%BC%9A;09:30&ev=2026-11-12;release;%E5%8F%91%20v0.3.2;11:00&ev=2026-11-13;meeting;%E4%B8%8E%E8%AE%BE%E8%AE%A1%E5%AF%B9%E4%B8%80%E7%89%88;10:00&ev=2026-11-13;focus;%E6%80%A7%E8%83%BD%E4%BC%98%E5%8C%96;14:00&ev=2026-11-16;meeting;%E5%9B%A2%E9%98%9F%E5%91%A8%E4%BC%9A;09:30&ev=2026-11-16;review;%E5%AD%A3%E5%BA%A6%E5%9B%9E%E9%A1%BE;15:00&ev=2026-11-17;meeting;%E5%AE%A2%E6%88%B7%E6%B2%9F%E9%80%9A;10:00&ev=2026-11-17;oncall;%E5%80%BC%E7%8F%AD;11:00&ev=2026-11-18;meeting;%E5%9B%A2%E9%98%9F%E5%91%A8%E4%BC%9A;09:30&ev=2026-11-18;review;%E7%81%B0%E5%BA%A6%E8%AF%84%E5%AE%A1;14:00&ev=2026-11-19;release;%E5%8F%91%20v0.4.0;10:00&ev=2026-11-19;health;%E4%BD%93%E6%A3%80;16:00&ev=2026-11-20;meeting;%E5%9B%A2%E9%98%9F%E5%91%A8%E4%BC%9A;09:30&ev=2026-11-20;focus;%E6%8A%80%E6%9C%AF%E5%80%BA;14:00&ev=2026-11-23;meeting;%E5%9B%A2%E9%98%9F%E5%91%A8%E4%BC%9A;09:30&ev=2026-11-23;meeting;%E9%9D%A2%E8%AF%95;11:00&ev=2026-11-24;oncall;%E5%80%BC%E7%8F%AD;10:00&ev=2026-11-24;focus;%E6%96%87%E6%A1%A3%E5%86%B2%E5%88%BA;15:00&ev=2026-11-25;meeting;%E5%9B%A2%E9%98%9F%E5%91%A8%E4%BC%9A;09:30&ev=2026-11-25;work;%E8%B7%AF%E7%BA%BF%E5%9B%BE;14:00&ev=2026-11-26;meeting;%E5%AE%A2%E6%88%B7%E6%B2%9F%E9%80%9A;10:00&ev=2026-11-26;oncall;%E5%80%BC%E7%8F%AD;16:00&ev=2026-11-27;meeting;%E5%9B%A2%E9%98%9F%E5%91%A8%E4%BC%9A;09:30&ev=2026-11-27;release;%E5%8F%91%20v0.4.1;15:00)](https://x-cmd.com/draw/explore?type=calendar&layout=month&start=2026-11-01&w=760&h=520&ev=2026-11-02;meeting;%E5%9B%A2%E9%98%9F%E5%91%A8%E4%BC%9A;09:30&ev=2026-11-02;review;%E9%9C%80%E6%B1%82%E8%AF%84%E5%AE%A1;14:00&ev=2026-11-03;review;%E4%BB%A3%E7%A0%81%E8%AF%84%E5%AE%A1;10:00&ev=2026-11-03;focus;%E5%86%99%E6%96%87%E6%A1%A3;15:00&ev=2026-11-04;meeting;%E5%9B%A2%E9%98%9F%E5%91%A8%E4%BC%9A;09:30&ev=2026-11-04;meeting;%E5%AE%A2%E6%88%B7%E6%B2%9F%E9%80%9A;16:00&ev=2026-11-05;release;%E5%8F%91%20v0.3.1;11:00&ev=2026-11-05;oncall;%E5%80%BC%E7%8F%AD%E4%BA%A4%E6%8E%A5;14:30&ev=2026-11-06;work;%E5%8F%8C%E5%91%A8%E8%BF%AD%E4%BB%A3%E8%AE%A1%E5%88%92;10:00&ev=2026-11-06;health;%E7%9C%8B%E7%89%99%E5%8C%BB;16:00&ev=2026-11-09;meeting;%E5%9B%A2%E9%98%9F%E5%91%A8%E4%BC%9A;09:30&ev=2026-11-09;review;%E6%9E%B6%E6%9E%84%E8%AF%84%E5%AE%A1;15:00&ev=2026-11-10;travel;%E5%87%BA%E5%B7%AE%E4%B8%8A%E6%B5%B7;08:00&ev=2026-11-10;oncall;%E5%80%BC%E7%8F%AD;20:00&ev=2026-11-11;class;%E7%AE%97%E6%B3%95%E8%AF%BE;19:00&ev=2026-11-12;meeting;%E5%9B%A2%E9%98%9F%E5%91%A8%E4%BC%9A;09:30&ev=2026-11-12;release;%E5%8F%91%20v0.3.2;11:00&ev=2026-11-13;meeting;%E4%B8%8E%E8%AE%BE%E8%AE%A1%E5%AF%B9%E4%B8%80%E7%89%88;10:00&ev=2026-11-13;focus;%E6%80%A7%E8%83%BD%E4%BC%98%E5%8C%96;14:00&ev=2026-11-16;meeting;%E5%9B%A2%E9%98%9F%E5%91%A8%E4%BC%9A;09:30&ev=2026-11-16;review;%E5%AD%A3%E5%BA%A6%E5%9B%9E%E9%A1%BE;15:00&ev=2026-11-17;meeting;%E5%AE%A2%E6%88%B7%E6%B2%9F%E9%80%9A;10:00&ev=2026-11-17;oncall;%E5%80%BC%E7%8F%AD;11:00&ev=2026-11-18;meeting;%E5%9B%A2%E9%98%9F%E5%91%A8%E4%BC%9A;09:30&ev=2026-11-18;review;%E7%81%B0%E5%BA%A6%E8%AF%84%E5%AE%A1;14:00&ev=2026-11-19;release;%E5%8F%91%20v0.4.0;10:00&ev=2026-11-19;health;%E4%BD%93%E6%A3%80;16:00&ev=2026-11-20;meeting;%E5%9B%A2%E9%98%9F%E5%91%A8%E4%BC%9A;09:30&ev=2026-11-20;focus;%E6%8A%80%E6%9C%AF%E5%80%BA;14:00&ev=2026-11-23;meeting;%E5%9B%A2%E9%98%9F%E5%91%A8%E4%BC%9A;09:30&ev=2026-11-23;meeting;%E9%9D%A2%E8%AF%95;11:00&ev=2026-11-24;oncall;%E5%80%BC%E7%8F%AD;10:00&ev=2026-11-24;focus;%E6%96%87%E6%A1%A3%E5%86%B2%E5%88%BA;15:00&ev=2026-11-25;meeting;%E5%9B%A2%E9%98%9F%E5%91%A8%E4%BC%9A;09:30&ev=2026-11-25;work;%E8%B7%AF%E7%BA%BF%E5%9B%BE;14:00&ev=2026-11-26;meeting;%E5%AE%A2%E6%88%B7%E6%B2%9F%E9%80%9A;10:00&ev=2026-11-26;oncall;%E5%80%BC%E7%8F%AD;16:00&ev=2026-11-27;meeting;%E5%9B%A2%E9%98%9F%E5%91%A8%E4%BC%9A;09:30&ev=2026-11-27;release;%E5%8F%91%20v0.4.1;15:00)

The month view leaves the time out — the cells are too narrow for it, and the
name matters more. Times live in the week view.

### A week

```text
https://x-cmd.com/draw?type=calendar&layout=week&start=2026-11-09&w=760&h=460&periods=09:00,10:00,11:00,14:00,15:00,16:00,17:00&ev=2026-11-09;meeting;%E5%9B%A2%E9%98%9F%E5%91%A8%E4%BC%9A;09:30&ev=2026-11-09;review;%E6%9E%B6%E6%9E%84%E8%AF%84%E5%AE%A1;15:00&ev=2026-11-10;travel;%E5%87%BA%E5%B7%AE%E4%B8%8A%E6%B5%B7;08:00&ev=2026-11-10;oncall;%E5%80%BC%E7%8F%AD;20:00&ev=2026-11-11;class;%E7%AE%97%E6%B3%95%E8%AF%BE;19:00&ev=2026-11-12;meeting;%E5%9B%A2%E9%98%9F%E5%91%A8%E4%BC%9A;09:30&ev=2026-11-12;release;%E5%8F%91%20v0.3.2;11:00&ev=2026-11-13;meeting;%E4%B8%8E%E8%AE%BE%E8%AE%A1%E5%AF%B9%E4%B8%80%E7%89%88;10:00&ev=2026-11-13;focus;%E6%80%A7%E8%83%BD%E4%BC%98%E5%8C%96;14:00
```

[![One work week](https://x-cmd.com/draw?type=calendar&layout=week&start=2026-11-09&w=760&h=460&periods=09:00,10:00,11:00,14:00,15:00,16:00,17:00&ev=2026-11-09;meeting;%E5%9B%A2%E9%98%9F%E5%91%A8%E4%BC%9A;09:30&ev=2026-11-09;review;%E6%9E%B6%E6%9E%84%E8%AF%84%E5%AE%A1;15:00&ev=2026-11-10;travel;%E5%87%BA%E5%B7%AE%E4%B8%8A%E6%B5%B7;08:00&ev=2026-11-10;oncall;%E5%80%BC%E7%8F%AD;20:00&ev=2026-11-11;class;%E7%AE%97%E6%B3%95%E8%AF%BE;19:00&ev=2026-11-12;meeting;%E5%9B%A2%E9%98%9F%E5%91%A8%E4%BC%9A;09:30&ev=2026-11-12;release;%E5%8F%91%20v0.3.2;11:00&ev=2026-11-13;meeting;%E4%B8%8E%E8%AE%BE%E8%AE%A1%E5%AF%B9%E4%B8%80%E7%89%88;10:00&ev=2026-11-13;focus;%E6%80%A7%E8%83%BD%E4%BC%98%E5%8C%96;14:00)](https://x-cmd.com/draw/explore?type=calendar&layout=week&start=2026-11-09&w=760&h=460&periods=09:00,10:00,11:00,14:00,15:00,16:00,17:00&ev=2026-11-09;meeting;%E5%9B%A2%E9%98%9F%E5%91%A8%E4%BC%9A;09:30&ev=2026-11-09;review;%E6%9E%B6%E6%9E%84%E8%AF%84%E5%AE%A1;15:00&ev=2026-11-10;travel;%E5%87%BA%E5%B7%AE%E4%B8%8A%E6%B5%B7;08:00&ev=2026-11-10;oncall;%E5%80%BC%E7%8F%AD;20:00&ev=2026-11-11;class;%E7%AE%97%E6%B3%95%E8%AF%BE;19:00&ev=2026-11-12;meeting;%E5%9B%A2%E9%98%9F%E5%91%A8%E4%BC%9A;09:30&ev=2026-11-12;release;%E5%8F%91%20v0.3.2;11:00&ev=2026-11-13;meeting;%E4%B8%8E%E8%AE%BE%E8%AE%A1%E5%AF%B9%E4%B8%80%E7%89%88;10:00&ev=2026-11-13;focus;%E6%80%A7%E8%83%BD%E4%BC%98%E5%8C%96;14:00)

In the week view an event lands in the column of its day and the row of its slot.

## Pitfalls

- **Narrow cells get no text.** In the two- and three-month views a cell is
  about fifty pixels wide, so only dots are drawn; the names live in the week
  view and in the notes.
- **A holiday's name takes room.** The third field of `day=` is the holiday's
  name ("国庆"); a long one crowds the day number.
- **Is the fourth field of `ev=` a time or an end date?** By content: `14:00` is
  a time, `2026-11-09` is an end date (the schedule board uses it). The two
  never collide.
