---
x-title: Gantt chart — a schedule in a handful of lines
x-desc: 'x-cmd/draw Gantt chart quick reference (`/draw/gantt`). The schedule is written as text: sections, tasks, durations and dependencies. Params: `m=` Gantt source, `scale=` (day/week/month), `t=`, `title=`, `w=/h=`.'
x-sidebar: draw gantt chart
x-keywords: gantt chart, 甘特图, draw, svg, project schedule, roadmap
x-json-ld:
  '@context': https://schema.org
  '@graph':
    - '@type': TechArticle
      headline: 'draw gantt chart'
      inLanguage: 'en'
      about: 'x-cmd/draw 01-gantt'
---

# Gantt chart — a schedule in a handful of lines

> This page is a stub: the examples below are live, the full write-up is still to come.

The schedule is written as text: sections, tasks, durations and dependencies.

```text
https://x-cmd.com/draw/gantt?m=dateFormat%20YYYY-MM-DD%0A%20%20section%20Dev%0A%20%20Design%20%3Adone%2C%20a1%2C%202026-11-01%2C%203d%0A%20%20Build%20%3Aactive%2C%20a2%2C%20after%20a1%2C%205d%0A%20%20Ship%20%3Amilestone%2C%20m1%2C%202026-11-10%2C%200d%0A%20%20section%20QA%0A%20%20Regression%20%3Acrit%2C%20b1%2C%20after%20a2%2C%203d&title=Sprint%20plan&w=560
```

[![Sprint plan](https://x-cmd.com/draw/gantt?m=dateFormat%20YYYY-MM-DD%0A%20%20section%20Dev%0A%20%20Design%20%3Adone%2C%20a1%2C%202026-11-01%2C%203d%0A%20%20Build%20%3Aactive%2C%20a2%2C%20after%20a1%2C%205d%0A%20%20Ship%20%3Amilestone%2C%20m1%2C%202026-11-10%2C%200d%0A%20%20section%20QA%0A%20%20Regression%20%3Acrit%2C%20b1%2C%20after%20a2%2C%203d&title=Sprint%20plan&w=560)](https://x-cmd.com/draw/explore/gantt?m=dateFormat%20YYYY-MM-DD%0A%20%20section%20Dev%0A%20%20Design%20%3Adone%2C%20a1%2C%202026-11-01%2C%203d%0A%20%20Build%20%3Aactive%2C%20a2%2C%20after%20a1%2C%205d%0A%20%20Ship%20%3Amilestone%2C%20m1%2C%202026-11-10%2C%200d%0A%20%20section%20QA%0A%20%20Regression%20%3Acrit%2C%20b1%2C%20after%20a2%2C%203d&title=Sprint%20plan&w=560)

## 1. Parameters

| param | meaning | default |
| --- | --- | --- |
| `m=` | the Gantt source — `dateFormat …`, then `section …` and one line per task | — |
| `scale=` | time axis: `day`, `week` or `month` | auto |
| `t=` | skin (colour family) | — |
| `title=` | chart title | — |
| `w=` / `h=` | minimum width / height | natural size |

A task line is `Name :status, id, start, duration` — status is `done`,
`active`, `crit` or `milestone`, and `start` may be `after <id>`.

## 2. Pitfalls

- **The source goes in `m=` URL-encoded** — newlines become `%0A` and spaces
  `%20`; a raw `&` or `,` in a task name will break the parse.
- **Task ids must be unique** — `after <id>` refers to a task defined earlier.

