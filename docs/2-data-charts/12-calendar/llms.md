---
name: docs/2-data-charts-12-calendar
description: 'x-cmd/draw calendar (/draw?type=calendar): seven shapes — month, week, year, two months, three months, course timetable and schedule board. The URL carries the content: ev= per event, day= per holiday or make-up workday, note= per note.'
type: reference
---

# Core Content

core_features:

  - Month, week, year, two-month and three-month views on one grid engine
  - A course timetable (Monday-first, the periods are the rows)
  - A schedule board (rows are items with a date range, a red line marks today)
  - `ev=` per event, `day=` per holiday or make-up workday, `note=` per note
  - Apple's look: hairline rules, small day numbers, today in a red disc, weekend numbers in grey

# Key Information

highlights:

  - The content is in the URL, not in the code — change an item by changing the link
  - Holidays are data: the 2026 arrangement is a set of `day=` entries
  - Narrow cells get dots, not text; names live in the week view and the notes

# Use Cases

  - A course timetable that lives in a README
  - A release schedule in an issue
  - An on-call roster
  - The 2026 holiday calendar

# Related Resources

official:
  endpoint: https://x-cmd.com/draw
related:
  overview: docs/1-overview/01-what-is-draw/cn.md
  butterfly: docs/2-data-charts/11-butterfly/cn.md
  showcase: docs/9-showcases/13-calendar/cn.md
