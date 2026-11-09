---
x-title: Quadrant chart — 2×2 decision matrix
x-desc: 'x-cmd/draw `type=quadrant` quick reference. A family of decision diagrams: the 2×2 matrix (Eisenhower, BCG, value-net) and the two-axis cross (attention gap, UX change). Params: `quadrants=` four cell names, `quaddescs=` four notes, `quadlabels=` extra labels per cell, `frame=box|cross`, `xlabel=`/`ylabel=` axis titles, `xlow=`/`xhigh=`/`ylow=`/`yhigh=` axis ends, `items=` points (`name@x,y`, 0..1).'
x-sidebar: draw quadrant chart
x-keywords: quadrant chart, 四象限图, draw, svg, eisenhower matrix, bcg matrix, decision matrix, 2x2 matrix, cross axes
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

**Matrix frame** (`frame=box`, the default when the cells are given) — a 2×2
box, four labelled cells, two arrowed axes.

```text
https://x-cmd.com/draw?type=quadrant&title=%E4%BB%B7%E5%80%BC%E7%BD%91%E7%9F%A9%E9%98%B5%E6%A0%BC%E5%9B%BE&quadrants=Q3.%E6%96%B0%E5%B8%82%E5%9C%BA%E5%88%9B%E6%96%B0%2CQ4.%E8%A7%84%E6%A8%A1%E5%BC%8F%E5%88%9B%E6%96%B0%2CQ2.%E9%80%89%E6%8B%A9%E6%80%A7%E6%8A%80%E6%9C%AF%2CQ1.%E7%AA%81%E7%A0%B4%E6%80%A7%E6%8A%80%E6%9C%AF&xlabel=%E6%8A%80%E6%9C%AF%2F%E4%BA%A7%E5%93%81&ylabel=%E5%B8%82%E5%9C%BA%2F%E5%AE%A2%E6%88%B7&xlow=%E6%88%90%E7%86%9F%E6%8A%80%E6%9C%AF%E4%BA%A7%E5%93%81&xhigh=%E6%96%B0%E6%8A%80%E6%9C%AF%E4%BA%A7%E5%93%81&ylow=%E4%B8%BB%E6%B5%81%E5%B8%82%E5%9C%BA&yhigh=%E6%96%B0%E5%85%B4%E5%B8%82%E5%9C%BA
```

[![Quadrant matrix](https://x-cmd.com/draw?type=quadrant&title=%E4%BB%B7%E5%80%BC%E7%BD%91%E7%9F%A9%E9%98%B5%E6%A0%BC%E5%9B%BE&quadrants=Q3.%E6%96%B0%E5%B8%82%E5%9C%BA%E5%88%9B%E6%96%B0%2CQ4.%E8%A7%84%E6%A8%A1%E5%BC%8F%E5%88%9B%E6%96%B0%2CQ2.%E9%80%89%E6%8B%A9%E6%80%A7%E6%8A%80%E6%9C%AF%2CQ1.%E7%AA%81%E7%A0%B4%E6%80%A7%E6%8A%80%E6%9C%AF&xlabel=%E6%8A%80%E6%9C%AF%2F%E4%BA%A7%E5%93%81&ylabel=%E5%B8%82%E5%9C%BA%2F%E5%AE%A2%E6%88%B7&xlow=%E6%88%90%E7%86%9F%E6%8A%80%E6%9C%AF%E4%BA%A7%E5%93%81&xhigh=%E6%96%B0%E6%8A%80%E6%9C%AF%E4%BA%A7%E5%93%81&ylow=%E4%B8%BB%E6%B5%81%E5%B8%82%E5%9C%BA&yhigh=%E6%96%B0%E5%85%B4%E5%B8%82%E5%9C%BA)](https://x-cmd.com/draw/explore?type=quadrant&title=%E4%BB%B7%E5%80%BC%E7%BD%91%E7%9F%A9%E9%98%B5%E6%A0%BC%E5%9B%BE&quadrants=Q3.%E6%96%B0%E5%B8%82%E5%9C%BA%E5%88%9B%E6%96%B0%2CQ4.%E8%A7%84%E6%A8%A1%E5%BC%8F%E5%88%9B%E6%96%B0%2CQ2.%E9%80%89%E6%8B%A9%E6%80%A7%E6%8A%80%E6%9C%AF%2CQ1.%E7%AA%81%E7%A0%B4%E6%80%A7%E6%8A%80%E6%9C%AF&xlabel=%E6%8A%80%E6%9C%AF%2F%E4%BA%A7%E5%93%81&ylabel=%E5%B8%82%E5%9C%BA%2F%E5%AE%A2%E6%88%B7&xlow=%E6%88%90%E7%86%9F%E6%8A%80%E6%9C%AF%E4%BA%A7%E5%93%81&xhigh=%E6%96%B0%E6%8A%80%E6%9C%AF%E4%BA%A7%E5%93%81&ylow=%E4%B8%BB%E6%B5%81%E5%B8%82%E5%9C%BA&yhigh=%E6%96%B0%E5%85%B4%E5%B8%82%E5%9C%BA)

**Cross frame** (`frame=cross`) — just the two arrowed axes crossing at the
centre, labels on the four ends. Use it when there are no cells, only axes
and side labels.

```text
https://x-cmd.com/draw?type=quadrant&frame=cross&title=%E5%AE%A1%E7%BE%8E%E9%B8%BF%E6%B2%9F%E6%A8%A1%E5%9E%8B&ylabel=%E6%B3%A8%E6%84%8F%E5%8A%9B&xlabel=%E7%86%9F%E6%82%89%E5%BA%A6&ylow=%E4%B8%8D%E5%85%B3%E6%B3%A8&yhigh=%E5%85%B3%E6%B3%A8&xlow=%E9%99%8C%E7%94%9F&xhigh=%E7%86%9F%E6%82%89
```

[![Axis cross](https://x-cmd.com/draw?type=quadrant&frame=cross&title=%E5%AE%A1%E7%BE%8E%E9%B8%BF%E6%B2%9F%E6%A8%A1%E5%9E%8B&ylabel=%E6%B3%A8%E6%84%8F%E5%8A%9B&xlabel=%E7%86%9F%E6%82%89%E5%BA%A6&ylow=%E4%B8%8D%E5%85%B3%E6%B3%A8&yhigh=%E5%85%B3%E6%B3%A8&xlow=%E9%99%8C%E7%94%9F&xhigh=%E7%86%9F%E6%82%89)](https://x-cmd.com/draw/explore?type=quadrant&frame=cross&title=%E5%AE%A1%E7%BE%8E%E9%B8%BF%E6%B2%9F%E6%A8%A1%E5%9E%8B&ylabel=%E6%B3%A8%E6%84%8F%E5%8A%9B&xlabel=%E7%86%9F%E6%82%89%E5%BA%A6&ylow=%E4%B8%8D%E5%85%B3%E6%B3%A8&yhigh=%E5%85%B3%E6%B3%A8&xlow=%E9%99%8C%E7%94%9F&xhigh=%E7%86%9F%E6%82%89)

---

## Parameters

| param | meaning | default |
| --- | --- | --- |
| `quadrants=` | four cell names, comma separated — **top-left, top-right, bottom-left, bottom-right** | — |
| `quaddescs=` | four cell notes, comma separated (same order) | — |
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
  "title": "价值网矩阵格图",
  "frame": "box",
  "xlabel": "技术/产品", "ylabel": "市场/客户",
  "xlow": "成熟技术产品", "xhigh": "新技术产品",
  "ylow": "主流市场", "yhigh": "新兴市场",
  "groups": [
    { "name": "Q3.新市场创新" },
    { "name": "Q4.规模式创新" },
    { "name": "Q2.选择性技术" },
    { "name": "Q1.突破性技术" }
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
- **Point coordinates are 0..1** (0 = low end of the axis, 1 = high end);
  out-of-range values are clamped, not rejected.
- **Axis end labels default to 低/高** — set `xlow`/`xhigh`/`ylow`/`yhigh` for a
  non-Chinese audience.
