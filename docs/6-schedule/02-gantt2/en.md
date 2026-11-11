---
x-title: Gantt chart v2 — the same source, a different face
x-desc: 'x-cmd/draw Gantt chart v2 (`/draw/gantt2`). The same mermaid Gantt source as `/draw/gantt`, rendered in the architecture diagram house style: bars coloured by status, a type badge per row, a legend underneath.'
x-sidebar: draw gantt chart v2
x-keywords: gantt chart, 甘特图, draw, svg, project plan, milestone
x-json-ld:
  '@context': https://schema.org
  '@graph':
    - '@type': TechArticle
      headline: 'draw gantt chart v2'
      inLanguage: 'en'
      about: 'x-cmd/draw 02-gantt2'
---

# Gantt chart v2 — the same source, a different face

`/draw/gantt2` takes **exactly the same input** as `/draw/gantt` — a Mermaid
Gantt source in `m=` — and draws it in the house style the architecture
diagram uses: bars coloured by status, a badge on every row, a legend
underneath.

```text
https://x-cmd.com/draw/gantt2?m=dateFormat%20YYYY-MM-DD%0A%20%20section%20Dev%0A%20%20Design%20%3Adone%2C%20a1%2C%202026-11-01%2C%203d%0A%20%20Build%20%3Aactive%2C%20a2%2C%20after%20a1%2C%205d%0A%20%20Ship%20%3Amilestone%2C%20m1%2C%202026-11-10%2C%200d%0A%20%20section%20QA%0A%20%20Regression%20%3Acrit%2C%20b1%2C%20after%20a2%2C%203d&title=Sprint%20plan
```

[![Gantt v2](https://x-cmd.com/draw/gantt2?m=dateFormat%20YYYY-MM-DD%0A%20%20section%20Dev%0A%20%20Design%20%3Adone%2C%20a1%2C%202026-11-01%2C%203d%0A%20%20Build%20%3Aactive%2C%20a2%2C%20after%20a1%2C%205d%0A%20%20Ship%20%3Amilestone%2C%20m1%2C%202026-11-10%2C%200d%0A%20%20section%20QA%0A%20%20Regression%20%3Acrit%2C%20b1%2C%20after%20a2%2C%203d&title=Sprint%20plan)](https://x-cmd.com/draw/explore/gantt2?m=dateFormat%20YYYY-MM-DD%0A%20%20section%20Dev%0A%20%20Design%20%3Adone%2C%20a1%2C%202026-11-01%2C%203d%0A%20%20Build%20%3Aactive%2C%20a2%2C%20after%20a1%2C%205d%0A%20%20Ship%20%3Amilestone%2C%20m1%2C%202026-11-10%2C%200d%0A%20%20section%20QA%0A%20%20Regression%20%3Acrit%2C%20b1%2C%20after%20a2%2C%203d&title=Sprint%20plan)

## 1. Parameters

| param | meaning | default |
|---|---|---|
| `m=` | the Gantt source | — |
| `scale=` | time axis: `day`, `week` or `month` | auto |
| `t=` | skin (colour family) | — |
| `title=` | chart title | — |
| `w=` / `h=` | canvas size | natural size |

## 2. What is different from `/draw/gantt`

Same source, same tasks, same dates. What changed:

- **Bars are coloured by status** — done, active, critical — instead of a
  neutral grey, so the state of the plan reads at a glance.
- **Every row carries a badge** — `D` `A` `C` `M` — the same badge the
  architecture diagram puts on a node.
- **The legend counts the statuses**, like the architecture diagram's legend
  counts the node types.

The old `/draw/gantt` is untouched, and keeps its own look.

## 3. Pitfalls

- **The source is the same as the old endpoint's** — if it worked there, it
  works here.
- **Only `YYYY-MM-DD` dates parse** — the same rule as before.
- **A `+` in a task name must be encoded** (`%2B`) — in a query string a bare
  `+` means a space.

