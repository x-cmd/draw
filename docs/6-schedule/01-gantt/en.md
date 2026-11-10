---
x-title: Gantt chart — a schedule in a handful of lines
x-desc: 'x-cmd/draw Gantt chart (`/draw/gantt`). The schedule is written as text: sections, tasks, durations, dependencies. Params: `m=` source, `scale=` (day/week/month), `t=`, `title=`, `w=/h=`.'
x-sidebar: draw gantt chart
x-keywords: gantt chart, 甘特图, draw, svg, project schedule, sprint plan, milestone
x-json-ld:
  '@context': https://schema.org
  '@graph':
    - '@type': TechArticle
      headline: 'draw gantt chart'
      inLanguage: 'en'
      about: 'x-cmd/draw 01-gantt'
---

# Gantt chart — a schedule in a handful of lines

The schedule is written as text: sections, tasks, durations and dependencies.
The engine turns it into a chart.

## Examples (what you see is what the URL gives; click to explore)

### A sprint plan

```text
https://x-cmd.com/draw/gantt?m=dateFormat%20YYYY-MM-DD%0A%20%20section%20Dev%0A%20%20Design%20%3Adone%2C%20a1%2C%202026-11-01%2C%203d%0A%20%20Build%20%3Aactive%2C%20a2%2C%20after%20a1%2C%205d%0A%20%20Ship%20%3Amilestone%2C%20m1%2C%202026-11-10%2C%200d%0A%20%20section%20QA%0A%20%20Regression%20%3Acrit%2C%20b1%2C%20after%20a2%2C%203d&title=Sprint%20plan&w=560
```

[![Sprint plan](https://x-cmd.com/draw/gantt?m=dateFormat%20YYYY-MM-DD%0A%20%20section%20Dev%0A%20%20Design%20%3Adone%2C%20a1%2C%202026-11-01%2C%203d%0A%20%20Build%20%3Aactive%2C%20a2%2C%20after%20a1%2C%205d%0A%20%20Ship%20%3Amilestone%2C%20m1%2C%202026-11-10%2C%200d%0A%20%20section%20QA%0A%20%20Regression%20%3Acrit%2C%20b1%2C%20after%20a2%2C%203d&title=Sprint%20plan&w=560)](https://x-cmd.com/draw/explore/gantt?m=dateFormat%20YYYY-MM-DD%0A%20%20section%20Dev%0A%20%20Design%20%3Adone%2C%20a1%2C%202026-11-01%2C%203d%0A%20%20Build%20%3Aactive%2C%20a2%2C%20after%20a1%2C%205d%0A%20%20Ship%20%3Amilestone%2C%20m1%2C%202026-11-10%2C%200d%0A%20%20section%20QA%0A%20%20Regression%20%3Acrit%2C%20b1%2C%20after%20a2%2C%203d&title=Sprint%20plan&w=560)

`Design` is done, `Build` is active and starts the moment `a1` ends, `Ship`
is a milestone, and `Regression` is the critical path.

### A launch plan across two sections

```text
https://x-cmd.com/draw/gantt?m=dateFormat%20YYYY-MM-DD%0A%20%20section%20Design%0A%20%20Wireframes%20%3Adone%2C%20w1%2C%202026-09-01%2C%2010d%0A%20%20Visual%20design%20%3Acrit%2C%20w2%2C%202026-09-15%2C%2012d%0A%20%20section%20Build%0A%20%20Backend%20%3Aactive%2C%20b1%2C%202026-10-01%2C%2020d%0A%20%20Frontend%20%3Ab2%2C%20after%20b1%2C%2015d%0A%20%20Launch%20%3Amilestone%2C%20m1%2C%202026-11-20%2C%200d&title=Launch%20plan&w=560
```

[![Launch plan](https://x-cmd.com/draw/gantt?m=dateFormat%20YYYY-MM-DD%0A%20%20section%20Design%0A%20%20Wireframes%20%3Adone%2C%20w1%2C%202026-09-01%2C%2010d%0A%20%20Visual%20design%20%3Acrit%2C%20w2%2C%202026-09-15%2C%2012d%0A%20%20section%20Build%0A%20%20Backend%20%3Aactive%2C%20b1%2C%202026-10-01%2C%2020d%0A%20%20Frontend%20%3Ab2%2C%20after%20b1%2C%2015d%0A%20%20Launch%20%3Amilestone%2C%20m1%2C%202026-11-20%2C%200d&title=Launch%20plan&w=560)](https://x-cmd.com/draw/explore/gantt?m=dateFormat%20YYYY-MM-DD%0A%20%20section%20Design%0A%20%20Wireframes%20%3Adone%2C%20w1%2C%202026-09-01%2C%2010d%0A%20%20Visual%20design%20%3Acrit%2C%20w2%2C%202026-09-15%2C%2012d%0A%20%20section%20Build%0A%20%20Backend%20%3Aactive%2C%20b1%2C%202026-10-01%2C%2020d%0A%20%20Frontend%20%3Ab2%2C%20after%20b1%2C%2015d%0A%20%20Launch%20%3Amilestone%2C%20m1%2C%202026-11-20%2C%200d&title=Launch%20plan&w=560)

## 1. Parameters

| param | meaning | default |
|---|---|---|
| `m=` | the Gantt source | — |
| `scale=` | time axis: `day`, `week` or `month` | auto |
| `t=` | skin (colour family) | — |
| `title=` | chart title | — |
| `w=` / `h=` | minimum width / height | natural size |
| `v=` | freeze the response at a version | latest |

## 2. The source format

```
dateFormat YYYY-MM-DD
  section Dev
  Design :done, a1, 2026-11-01, 3d
  Build :active, a2, after a1, 5d
  Ship :milestone, m1, 2026-11-10, 0d
  section QA
  Regression :crit, b1, after a2, 3d
```

- **`dateFormat`** — only `YYYY-MM-DD` is understood. Declaring another
  format is ignored; the dates themselves must still be `YYYY-MM-DD`.
- **`section <name>`** — a band of tasks in the chart.
- **A task line** — `Name :status, id, start, duration`. Every part after
  the colon is optional except the task itself.

| part | meaning |
|---|---|
| status | `done`, `active`, `crit` (or `critical`), `milestone` |
| id | the name other tasks use to depend on it |
| start | a date (`2026-11-01`), or `after <id>` to start when that task ends |
| duration | `3d`, `2w`, `8h` — or an end date |

The order of the flags and the id is flexible, and you can also add a
completion percentage anywhere after the colon:

```
Wireframes :done, w1, 2026-09-01, 10d, 100%
Backend :active, b1, 2026-10-01, 20d, 40%
```

## 3. Pitfalls

- **The source goes in `m=` URL-encoded** — newlines become `%0A` and
  spaces `%20`; a raw `&` or `,` in a task name breaks the parse.
- **Task ids must be unique** — `after <id>` refers to a task defined
  earlier.
- **A `milestone` has a zero length** — write `0d`.
- **Only `YYYY-MM-DD` dates parse** — anything else is a 400, not a guess.
- **A task with no id cannot be depended on** — it still draws, it just has
  no name to point at.

## 4. Related

The same engine renders a Mermaid `gantt` source handed to
[the flowchart endpoint](../03-mermaid).

