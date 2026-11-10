---
x-title: Quadrant chart — 2×2 decision matrix
x-desc: 'x-cmd/draw `type=quadrant` quick reference. A family of business decision diagrams: the 2×2 matrix (BCG, Eisenhower) and the two-axis cross (prioritisation). Params: `quadrants=` four cell names, `quaddescs=` four notes, `quadlabels=` extra labels per cell, `frame=box|cross`, `xlabel=`/`ylabel=` axis titles, `xlow=`/`xhigh=`/`ylow=`/`yhigh=` axis ends, `items=` points (`name@x,y`, 0..1).'
x-sidebar: draw quadrant chart
x-keywords: quadrant chart, 四象限图, draw, svg, bcg matrix, eisenhower matrix, decision matrix, 2x2 matrix, prioritisation
x-json-ld:
  '@context': https://schema.org
  '@graph':
    - '@type': TechArticle
      headline: 'draw quadrant chart'
      inLanguage: 'en'
      about: 'x-cmd/draw quadrant chart'
---

# Quadrant chart — 2×2 decision matrix

Two frames, one chart type.

**Matrix frame** (`frame=box`, the default when the cells are given) — four
labelled cells in a rounded panel, two arrowed axes. The BCG growth-share
matrix:

```text
https://x-cmd.com/draw?type=quadrant&title=BCG%20growth-share%20matrix&quadrants=Question%20marks%2CStars%2CDogs%2CCash%20cows&quaddescs=High%20growth%20%C2%B7%20low%20share%20%E2%80%94%20double%20down%20or%20walk%20away%3BHigh%20growth%20%C2%B7%20high%20share%20%E2%80%94%20invest%20to%20defend%20share%3BLow%20growth%20%C2%B7%20low%20share%20%E2%80%94%20cut%20or%20divest%2C%20stop%20funding%3BLow%20growth%20%C2%B7%20high%20share%20%E2%80%94%20harvest%20cash%2C%20feed%20the%20core&xlabel=Relative%20market%20share&ylabel=Market%20growth%20rate&xlow=Low&xhigh=High&ylow=Low&yhigh=High
```

[![BCG matrix](https://x-cmd.com/draw?type=quadrant&title=BCG%20growth-share%20matrix&quadrants=Question%20marks%2CStars%2CDogs%2CCash%20cows&quaddescs=High%20growth%20%C2%B7%20low%20share%20%E2%80%94%20double%20down%20or%20walk%20away%3BHigh%20growth%20%C2%B7%20high%20share%20%E2%80%94%20invest%20to%20defend%20share%3BLow%20growth%20%C2%B7%20low%20share%20%E2%80%94%20cut%20or%20divest%2C%20stop%20funding%3BLow%20growth%20%C2%B7%20high%20share%20%E2%80%94%20harvest%20cash%2C%20feed%20the%20core&xlabel=Relative%20market%20share&ylabel=Market%20growth%20rate&xlow=Low&xhigh=High&ylow=Low&yhigh=High)](https://x-cmd.com/draw/explore?type=quadrant&title=BCG%20growth-share%20matrix&quadrants=Question%20marks%2CStars%2CDogs%2CCash%20cows&quaddescs=High%20growth%20%C2%B7%20low%20share%20%E2%80%94%20double%20down%20or%20walk%20away%3BHigh%20growth%20%C2%B7%20high%20share%20%E2%80%94%20invest%20to%20defend%20share%3BLow%20growth%20%C2%B7%20low%20share%20%E2%80%94%20cut%20or%20divest%2C%20stop%20funding%3BLow%20growth%20%C2%B7%20high%20share%20%E2%80%94%20harvest%20cash%2C%20feed%20the%20core&xlabel=Relative%20market%20share&ylabel=Market%20growth%20rate&xlow=Low&xhigh=High&ylow=Low&yhigh=High)

The Eisenhower urgent-important matrix:

```text
https://x-cmd.com/draw?type=quadrant&title=Eisenhower%20urgency-importance%20matrix&quadrants=Do%20first%2CSchedule%2CDelegate%2CEliminate&quaddescs=Important%2C%20not%20urgent%20%E2%80%94%20schedule%20fixed%20time%3BImportant%20and%20urgent%20%E2%80%94%20do%20now%2C%20fully%20staffed%3BUrgent%2C%20not%20important%20%E2%80%94%20delegate%20or%20automate%3BNeither%20%E2%80%94%20do%20less%2C%20review%20regularly&xlabel=Importance&ylabel=Urgency&xlow=Low&xhigh=High&ylow=Low&yhigh=High
```

[![Eisenhower matrix](https://x-cmd.com/draw?type=quadrant&title=Eisenhower%20urgency-importance%20matrix&quadrants=Do%20first%2CSchedule%2CDelegate%2CEliminate&quaddescs=Important%2C%20not%20urgent%20%E2%80%94%20schedule%20fixed%20time%3BImportant%20and%20urgent%20%E2%80%94%20do%20now%2C%20fully%20staffed%3BUrgent%2C%20not%20important%20%E2%80%94%20delegate%20or%20automate%3BNeither%20%E2%80%94%20do%20less%2C%20review%20regularly&xlabel=Importance&ylabel=Urgency&xlow=Low&xhigh=High&ylow=Low&yhigh=High)](https://x-cmd.com/draw/explore?type=quadrant&title=Eisenhower%20urgency-importance%20matrix&quadrants=Do%20first%2CSchedule%2CDelegate%2CEliminate&quaddescs=Important%2C%20not%20urgent%20%E2%80%94%20schedule%20fixed%20time%3BImportant%20and%20urgent%20%E2%80%94%20do%20now%2C%20fully%20staffed%3BUrgent%2C%20not%20important%20%E2%80%94%20delegate%20or%20automate%3BNeither%20%E2%80%94%20do%20less%2C%20review%20regularly&xlabel=Importance&ylabel=Urgency&xlow=Low&xhigh=High&ylow=Low&yhigh=High)

**Cross frame** (`frame=cross`) — just the two arrowed axes crossing at the
centre, labels on the four ends, points placed by coordinate. Use it when
there are no cells, only axes and items — e.g. ranking initiatives by cost
against strategic value:

```text
https://x-cmd.com/draw?type=quadrant&frame=cross&title=Initiative%20priority&ylabel=Strategic%20value&xlabel=Cost%20to%20deliver&ylow=Low&yhigh=High&xlow=Low&xhigh=High&items=Platform%20rebuild%400.22%2C0.86%3BAI%20support%400.42%2C0.62%3BChannel%20partnerships%400.72%2C0.44%3BBrand%20campaigns%400.84%2C0.26
```

[![Prioritisation](https://x-cmd.com/draw?type=quadrant&frame=cross&title=Initiative%20priority&ylabel=Strategic%20value&xlabel=Cost%20to%20deliver&ylow=Low&yhigh=High&xlow=Low&xhigh=High&items=Platform%20rebuild%400.22%2C0.86%3BAI%20support%400.42%2C0.62%3BChannel%20partnerships%400.72%2C0.44%3BBrand%20campaigns%400.84%2C0.26)](https://x-cmd.com/draw/explore?type=quadrant&frame=cross&title=Initiative%20priority&ylabel=Strategic%20value&xlabel=Cost%20to%20deliver&ylow=Low&yhigh=High&xlow=Low&xhigh=High&items=Platform%20rebuild%400.22%2C0.86%3BAI%20support%400.42%2C0.62%3BChannel%20partnerships%400.72%2C0.44%3BBrand%20campaigns%400.84%2C0.26)

---

## Parameters

| param | meaning | default |
| --- | --- | --- |
| `quadrants=` | four cell names, comma separated — **top-left, top-right, bottom-left, bottom-right** | — |
| `quaddescs=` | four cell notes, **semicolon** separated (same order) | — |
| `quadlabels=` | extra labels per cell: four groups separated by `;`, labels inside a group by `\|` | — |
| `frame=` | `box` (matrix) or `cross` (axes only) | `box` when cells are given, else `cross` |
| `xlabel=` / `ylabel=` | axis titles, drawn beside the positive end | — |
| `xlow=` / `xhigh=` | horizontal axis end labels | `低` / `高` |
| `ylow=` / `yhigh=` | vertical axis end labels | `低` / `高` |
| `items=` | points: `name@x,y`, semicolon separated; `x`/`y` are 0..1 | — |
| `d=` | the whole spec as JSON | — |
| `title=` | chart title | — |

Cells are **optional**: a chart with only axis labels draws the cross frame,
and one with only `items=` draws axes plus points.

## The `d=` form

```json
{
  "title": "BCG 增长-份额矩阵",
  "xlabel": "相对市场份额", "ylabel": "市场增长率",
  "xlow": "低", "xhigh": "高", "ylow": "低", "yhigh": "高",
  "groups": [
    { "name": "问题业务", "note": "高增长 · 低份额 —— 要么投钱翻盘,要么及时止损" },
    { "name": "明星业务", "note": "高增长 · 高份额 —— 加投资源守住份额" },
    { "name": "瘦狗业务", "note": "低增长 · 低份额 —— 收缩或剥离,别再投钱" },
    { "name": "现金牛", "note": "低增长 · 高份额 —— 收割现金,反哺主业" }
  ],
  "items": [{ "name": "新业务", "x": 0.82, "y": 0.86 }]
}
```

A cell may carry a name, a note and extra side labels:

```json
{ "name": "Q3.新市场创新", "note": "新兴市场", "labels": ["新兴市场", "早期采用者"] }
```

---

## Pitfalls

- **Cell order is fixed**: top-left, top-right, bottom-left, bottom-right — the
  order you read them in. A wrong order is not an error, just a different chart.
- **Exactly four cells when you give cells**: fewer or more is a 400. With no
  cells at all you get the cross frame (axes only).
- **`quaddescs=` is semicolon separated** — notes often contain commas, and the
  comma is reserved for the cell names.
- **Point coordinates are 0..1** (0 = low end of the axis, 1 = high end);
  out-of-range values are clamped, not rejected.
- **Axis end labels default to 低/高** — set `xlow`/`xhigh`/`ylow`/`yhigh` for a
  non-Chinese audience.
