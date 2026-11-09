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
https://x-cmd.com/draw?type=quadrant&title=BCG+%E5%A2%9E%E9%95%BF-%E4%BB%BD%E9%A2%9D%E7%9F%A9%E9%98%B5&quadrants=%E9%97%AE%E9%A2%98%E4%B8%9A%E5%8A%A1%2C%E6%98%8E%E6%98%9F%E4%B8%9A%E5%8A%A1%2C%E7%98%A6%E7%8B%97%E4%B8%9A%E5%8A%A1%2C%E7%8E%B0%E9%87%91%E7%89%9B&quaddescs=%E9%AB%98%E5%A2%9E%E9%95%BF+%C2%B7+%E4%BD%8E%E4%BB%BD%E9%A2%9D+%E2%80%94%E2%80%94+%E8%A6%81%E4%B9%88%E6%8A%95%E9%92%B1%E7%BF%BB%E7%9B%98%2C%E8%A6%81%E4%B9%88%E5%8F%8A%E6%97%B6%E6%AD%A2%E6%8D%9F%3B%E9%AB%98%E5%A2%9E%E9%95%BF+%C2%B7+%E9%AB%98%E4%BB%BD%E9%A2%9D+%E2%80%94%E2%80%94+%E5%8A%A0%E6%8A%95%E8%B5%84%E6%BA%90%E5%AE%88%E4%BD%8F%E4%BB%BD%E9%A2%9D%3B%E4%BD%8E%E5%A2%9E%E9%95%BF+%C2%B7+%E4%BD%8E%E4%BB%BD%E9%A2%9D+%E2%80%94%E2%80%94+%E6%94%B6%E7%BC%A9%E6%88%96%E5%89%A5%E7%A6%BB%2C%E5%88%AB%E5%86%8D%E6%8A%95%E9%92%B1%3B%E4%BD%8E%E5%A2%9E%E9%95%BF+%C2%B7+%E9%AB%98%E4%BB%BD%E9%A2%9D+%E2%80%94%E2%80%94+%E6%94%B6%E5%89%B2%E7%8E%B0%E9%87%91%2C%E5%8F%8D%E5%93%BA%E4%B8%BB%E4%B8%9A&xlabel=%E7%9B%B8%E5%AF%B9%E5%B8%82%E5%9C%BA%E4%BB%BD%E9%A2%9D&ylabel=%E5%B8%82%E5%9C%BA%E5%A2%9E%E9%95%BF%E7%8E%87&xlow=%E4%BD%8E&xhigh=%E9%AB%98&ylow=%E4%BD%8E&yhigh=%E9%AB%98
```

[![BCG matrix](https://x-cmd.com/draw?type=quadrant&title=BCG+%E5%A2%9E%E9%95%BF-%E4%BB%BD%E9%A2%9D%E7%9F%A9%E9%98%B5&quadrants=%E9%97%AE%E9%A2%98%E4%B8%9A%E5%8A%A1%2C%E6%98%8E%E6%98%9F%E4%B8%9A%E5%8A%A1%2C%E7%98%A6%E7%8B%97%E4%B8%9A%E5%8A%A1%2C%E7%8E%B0%E9%87%91%E7%89%9B&quaddescs=%E9%AB%98%E5%A2%9E%E9%95%BF+%C2%B7+%E4%BD%8E%E4%BB%BD%E9%A2%9D+%E2%80%94%E2%80%94+%E8%A6%81%E4%B9%88%E6%8A%95%E9%92%B1%E7%BF%BB%E7%9B%98%2C%E8%A6%81%E4%B9%88%E5%8F%8A%E6%97%B6%E6%AD%A2%E6%8D%9F%3B%E9%AB%98%E5%A2%9E%E9%95%BF+%C2%B7+%E9%AB%98%E4%BB%BD%E9%A2%9D+%E2%80%94%E2%80%94+%E5%8A%A0%E6%8A%95%E8%B5%84%E6%BA%90%E5%AE%88%E4%BD%8F%E4%BB%BD%E9%A2%9D%3B%E4%BD%8E%E5%A2%9E%E9%95%BF+%C2%B7+%E4%BD%8E%E4%BB%BD%E9%A2%9D+%E2%80%94%E2%80%94+%E6%94%B6%E7%BC%A9%E6%88%96%E5%89%A5%E7%A6%BB%2C%E5%88%AB%E5%86%8D%E6%8A%95%E9%92%B1%3B%E4%BD%8E%E5%A2%9E%E9%95%BF+%C2%B7+%E9%AB%98%E4%BB%BD%E9%A2%9D+%E2%80%94%E2%80%94+%E6%94%B6%E5%89%B2%E7%8E%B0%E9%87%91%2C%E5%8F%8D%E5%93%BA%E4%B8%BB%E4%B8%9A&xlabel=%E7%9B%B8%E5%AF%B9%E5%B8%82%E5%9C%BA%E4%BB%BD%E9%A2%9D&ylabel=%E5%B8%82%E5%9C%BA%E5%A2%9E%E9%95%BF%E7%8E%87&xlow=%E4%BD%8E&xhigh=%E9%AB%98&ylow=%E4%BD%8E&yhigh=%E9%AB%98)](https://x-cmd.com/draw/explore?type=quadrant&title=BCG+%E5%A2%9E%E9%95%BF-%E4%BB%BD%E9%A2%9D%E7%9F%A9%E9%98%B5&quadrants=%E9%97%AE%E9%A2%98%E4%B8%9A%E5%8A%A1%2C%E6%98%8E%E6%98%9F%E4%B8%9A%E5%8A%A1%2C%E7%98%A6%E7%8B%97%E4%B8%9A%E5%8A%A1%2C%E7%8E%B0%E9%87%91%E7%89%9B&quaddescs=%E9%AB%98%E5%A2%9E%E9%95%BF+%C2%B7+%E4%BD%8E%E4%BB%BD%E9%A2%9D+%E2%80%94%E2%80%94+%E8%A6%81%E4%B9%88%E6%8A%95%E9%92%B1%E7%BF%BB%E7%9B%98%2C%E8%A6%81%E4%B9%88%E5%8F%8A%E6%97%B6%E6%AD%A2%E6%8D%9F%3B%E9%AB%98%E5%A2%9E%E9%95%BF+%C2%B7+%E9%AB%98%E4%BB%BD%E9%A2%9D+%E2%80%94%E2%80%94+%E5%8A%A0%E6%8A%95%E8%B5%84%E6%BA%90%E5%AE%88%E4%BD%8F%E4%BB%BD%E9%A2%9D%3B%E4%BD%8E%E5%A2%9E%E9%95%BF+%C2%B7+%E4%BD%8E%E4%BB%BD%E9%A2%9D+%E2%80%94%E2%80%94+%E6%94%B6%E7%BC%A9%E6%88%96%E5%89%A5%E7%A6%BB%2C%E5%88%AB%E5%86%8D%E6%8A%95%E9%92%B1%3B%E4%BD%8E%E5%A2%9E%E9%95%BF+%C2%B7+%E9%AB%98%E4%BB%BD%E9%A2%9D+%E2%80%94%E2%80%94+%E6%94%B6%E5%89%B2%E7%8E%B0%E9%87%91%2C%E5%8F%8D%E5%93%BA%E4%B8%BB%E4%B8%9A&xlabel=%E7%9B%B8%E5%AF%B9%E5%B8%82%E5%9C%BA%E4%BB%BD%E9%A2%9D&ylabel=%E5%B8%82%E5%9C%BA%E5%A2%9E%E9%95%BF%E7%8E%87&xlow=%E4%BD%8E&xhigh=%E9%AB%98&ylow=%E4%BD%8E&yhigh=%E9%AB%98)

The Eisenhower urgent-important matrix:

```text
https://x-cmd.com/draw?type=quadrant&title=%E8%89%BE%E6%A3%AE%E8%B1%AA%E5%A8%81%E5%B0%94+%E9%87%8D%E8%A6%81-%E7%B4%A7%E6%80%A5%E7%9F%A9%E9%98%B5&quadrants=%E7%AB%8B%E5%8D%B3%E5%A4%84%E7%90%86%2C%E9%87%8D%E7%82%B9%E6%8A%95%E5%85%A5%2C%E5%A7%94%E6%89%98%E4%BB%96%E4%BA%BA%2C%E8%AE%A1%E5%88%92%E5%AE%89%E6%8E%92&quaddescs=%E9%87%8D%E8%A6%81%E4%B8%8D%E7%B4%A7%E6%80%A5+%E2%80%94%E2%80%94+%E6%8E%92%E8%BF%9B%E6%97%A5%E7%A8%8B%2C%E5%9B%BA%E5%AE%9A%E6%97%B6%E9%97%B4%E5%81%9A%3B%E9%87%8D%E8%A6%81%E4%B8%94%E7%B4%A7%E6%80%A5+%E2%80%94%E2%80%94+%E9%A9%AC%E4%B8%8A%E5%81%9A%2C%E7%BB%99%E8%B6%B3%E8%B5%84%E6%BA%90%3B%E7%B4%A7%E6%80%A5%E4%B8%8D%E9%87%8D%E8%A6%81+%E2%80%94%E2%80%94+%E6%8E%88%E6%9D%83%E4%B8%8B%E5%B1%9E%2C%E6%88%96%E6%89%B9%E6%88%90%E6%B5%81%E7%A8%8B%3B%E9%83%BD%E4%B8%8D%E7%B4%A7%E6%80%A5+%E2%80%94%E2%80%94+%E5%B0%91%E5%81%9A%2C%E5%AE%9A%E6%9C%9F%E5%9B%9E%E9%A1%BE&xlabel=%E9%87%8D%E8%A6%81%E7%A8%8B%E5%BA%A6&ylabel=%E7%B4%A7%E6%80%A5%E7%A8%8B%E5%BA%A6&xlow=%E4%BD%8E&xhigh=%E9%AB%98&ylow=%E4%BD%8E&yhigh=%E9%AB%98
```

[![Eisenhower matrix](https://x-cmd.com/draw?type=quadrant&title=%E8%89%BE%E6%A3%AE%E8%B1%AA%E5%A8%81%E5%B0%94+%E9%87%8D%E8%A6%81-%E7%B4%A7%E6%80%A5%E7%9F%A9%E9%98%B5&quadrants=%E7%AB%8B%E5%8D%B3%E5%A4%84%E7%90%86%2C%E9%87%8D%E7%82%B9%E6%8A%95%E5%85%A5%2C%E5%A7%94%E6%89%98%E4%BB%96%E4%BA%BA%2C%E8%AE%A1%E5%88%92%E5%AE%89%E6%8E%92&quaddescs=%E9%87%8D%E8%A6%81%E4%B8%8D%E7%B4%A7%E6%80%A5+%E2%80%94%E2%80%94+%E6%8E%92%E8%BF%9B%E6%97%A5%E7%A8%8B%2C%E5%9B%BA%E5%AE%9A%E6%97%B6%E9%97%B4%E5%81%9A%3B%E9%87%8D%E8%A6%81%E4%B8%94%E7%B4%A7%E6%80%A5+%E2%80%94%E2%80%94+%E9%A9%AC%E4%B8%8A%E5%81%9A%2C%E7%BB%99%E8%B6%B3%E8%B5%84%E6%BA%90%3B%E7%B4%A7%E6%80%A5%E4%B8%8D%E9%87%8D%E8%A6%81+%E2%80%94%E2%80%94+%E6%8E%88%E6%9D%83%E4%B8%8B%E5%B1%9E%2C%E6%88%96%E6%89%B9%E6%88%90%E6%B5%81%E7%A8%8B%3B%E9%83%BD%E4%B8%8D%E7%B4%A7%E6%80%A5+%E2%80%94%E2%80%94+%E5%B0%91%E5%81%9A%2C%E5%AE%9A%E6%9C%9F%E5%9B%9E%E9%A1%BE&xlabel=%E9%87%8D%E8%A6%81%E7%A8%8B%E5%BA%A6&ylabel=%E7%B4%A7%E6%80%A5%E7%A8%8B%E5%BA%A6&xlow=%E4%BD%8E&xhigh=%E9%AB%98&ylow=%E4%BD%8E&yhigh=%E9%AB%98)](https://x-cmd.com/draw/explore?type=quadrant&title=%E8%89%BE%E6%A3%AE%E8%B1%AA%E5%A8%81%E5%B0%94+%E9%87%8D%E8%A6%81-%E7%B4%A7%E6%80%A5%E7%9F%A9%E9%98%B5&quadrants=%E7%AB%8B%E5%8D%B3%E5%A4%84%E7%90%86%2C%E9%87%8D%E7%82%B9%E6%8A%95%E5%85%A5%2C%E5%A7%94%E6%89%98%E4%BB%96%E4%BA%BA%2C%E8%AE%A1%E5%88%92%E5%AE%89%E6%8E%92&quaddescs=%E9%87%8D%E8%A6%81%E4%B8%8D%E7%B4%A7%E6%80%A5+%E2%80%94%E2%80%94+%E6%8E%92%E8%BF%9B%E6%97%A5%E7%A8%8B%2C%E5%9B%BA%E5%AE%9A%E6%97%B6%E9%97%B4%E5%81%9A%3B%E9%87%8D%E8%A6%81%E4%B8%94%E7%B4%A7%E6%80%A5+%E2%80%94%E2%80%94+%E9%A9%AC%E4%B8%8A%E5%81%9A%2C%E7%BB%99%E8%B6%B3%E8%B5%84%E6%BA%90%3B%E7%B4%A7%E6%80%A5%E4%B8%8D%E9%87%8D%E8%A6%81+%E2%80%94%E2%80%94+%E6%8E%88%E6%9D%83%E4%B8%8B%E5%B1%9E%2C%E6%88%96%E6%89%B9%E6%88%90%E6%B5%81%E7%A8%8B%3B%E9%83%BD%E4%B8%8D%E7%B4%A7%E6%80%A5+%E2%80%94%E2%80%94+%E5%B0%91%E5%81%9A%2C%E5%AE%9A%E6%9C%9F%E5%9B%9E%E9%A1%BE&xlabel=%E9%87%8D%E8%A6%81%E7%A8%8B%E5%BA%A6&ylabel=%E7%B4%A7%E6%80%A5%E7%A8%8B%E5%BA%A6&xlow=%E4%BD%8E&xhigh=%E9%AB%98&ylow=%E4%BD%8E&yhigh=%E9%AB%98)

**Cross frame** (`frame=cross`) — just the two arrowed axes crossing at the
centre, labels on the four ends, points placed by coordinate. Use it when
there are no cells, only axes and items — e.g. ranking initiatives by cost
against strategic value:

```text
https://x-cmd.com/draw?type=quadrant&frame=cross&title=%E6%88%98%E7%95%A5%E4%B8%BE%E6%8E%AA%E4%BC%98%E5%85%88%E7%BA%A7&ylabel=%E6%88%98%E7%95%A5%E4%BB%B7%E5%80%BC&xlabel=%E6%8A%95%E5%85%A5%E6%88%90%E6%9C%AC&ylow=%E4%BD%8E&yhigh=%E9%AB%98&xlow=%E4%BD%8E&xhigh=%E9%AB%98&items=%E5%B9%B3%E5%8F%B0%E9%87%8D%E6%9E%84%400.22%2C0.86%3BAI+%E5%AE%A2%E6%9C%8D%400.42%2C0.62%3B%E6%B8%A0%E9%81%93%E5%90%88%E4%BD%9C%400.72%2C0.44%3B%E5%93%81%E7%89%8C%E6%8A%95%E6%94%BE%400.84%2C0.26
```

[![Prioritisation](https://x-cmd.com/draw?type=quadrant&frame=cross&title=%E6%88%98%E7%95%A5%E4%B8%BE%E6%8E%AA%E4%BC%98%E5%85%88%E7%BA%A7&ylabel=%E6%88%98%E7%95%A5%E4%BB%B7%E5%80%BC&xlabel=%E6%8A%95%E5%85%A5%E6%88%90%E6%9C%AC&ylow=%E4%BD%8E&yhigh=%E9%AB%98&xlow=%E4%BD%8E&xhigh=%E9%AB%98&items=%E5%B9%B3%E5%8F%B0%E9%87%8D%E6%9E%84%400.22%2C0.86%3BAI+%E5%AE%A2%E6%9C%8D%400.42%2C0.62%3B%E6%B8%A0%E9%81%93%E5%90%88%E4%BD%9C%400.72%2C0.44%3B%E5%93%81%E7%89%8C%E6%8A%95%E6%94%BE%400.84%2C0.26)](https://x-cmd.com/draw/explore?type=quadrant&frame=cross&title=%E6%88%98%E7%95%A5%E4%B8%BE%E6%8E%AA%E4%BC%98%E5%85%88%E7%BA%A7&ylabel=%E6%88%98%E7%95%A5%E4%BB%B7%E5%80%BC&xlabel=%E6%8A%95%E5%85%A5%E6%88%90%E6%9C%AC&ylow=%E4%BD%8E&yhigh=%E9%AB%98&xlow=%E4%BD%8E&xhigh=%E9%AB%98&items=%E5%B9%B3%E5%8F%B0%E9%87%8D%E6%9E%84%400.22%2C0.86%3BAI+%E5%AE%A2%E6%9C%8D%400.42%2C0.62%3B%E6%B8%A0%E9%81%93%E5%90%88%E4%BD%9C%400.72%2C0.44%3B%E5%93%81%E7%89%8C%E6%8A%95%E6%94%BE%400.84%2C0.26)

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
