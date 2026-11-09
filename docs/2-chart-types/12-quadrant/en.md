---
x-title: Quadrant chart — 2×2 decision matrix
x-desc: 'x-cmd/draw `type=quadrant` quick reference. A 2×2 matrix for decision charts: Eisenhower, BCG, the Atlassian 4Ls retro. Params: `quadrants=` four cell names (top-left, top-right, bottom-left, bottom-right), `quaddescs=` four notes, `xlabel=`/`ylabel=` axis titles, `xlow=`/`xhigh=`/`ylow=`/`yhigh=` axis ends, `items=` points (`name@x,y`, 0..1).'
x-sidebar: draw quadrant chart
x-keywords: quadrant chart, 四象限图, draw, svg, eisenhower matrix, bcg matrix, decision matrix, 2x2 matrix
x-json-ld:
  '@context': https://schema.org
  '@graph':
    - '@type': TechArticle
      headline: 'draw quadrant chart'
      inLanguage: 'en'
      about: 'x-cmd/draw quadrant chart'
---

# Quadrant chart — 2×2 decision matrix

## Examples (what you see is what the URL gives; click to explore)

**Four cells with notes and points**

```text
https://x-cmd.com/draw?type=quadrant&title=%E5%9B%9B%E8%B1%A1%E9%99%90%E5%86%B3%E7%AD%96&quadrants=%E5%BF%AB%E8%B5%A2%2C%E6%88%98%E7%95%A5%2C%E5%A1%AB%E5%9D%91%2C%E6%94%BE%E5%BC%83&quaddescs=%E5%BF%AB%E9%80%9F%E5%BD%93%E4%B8%8B%2C%E9%95%BF%E6%9C%9F%E6%8A%95%E5%85%A5%2C%E8%A1%A5%E5%8D%95%2C%E6%97%A0%E5%90%88%E8%A1%8C&xlabel=%E6%8A%95%E5%85%A5&ylabel=%E5%9B%9E%E6%8A%A5&items=%E6%96%B0%E4%B8%9A%E5%8A%A1%400.82%2C0.86%3BAI+%E8%B0%83%E6%9F%A5%400.74%2C0.68%3B%E6%97%A7%E7%B3%BB%E7%BB%9F%400.22%2C0.28%3B%E5%85%AC%E5%8F%B8%E6%94%BF%E7%AD%96%400.18%2C0.74
```

[![Quadrant chart](https://x-cmd.com/draw?type=quadrant&title=%E5%9B%9B%E8%B1%A1%E9%99%90%E5%86%B3%E7%AD%96&quadrants=%E5%BF%AB%E8%B5%A2%2C%E6%88%98%E7%95%A5%2C%E5%A1%AB%E5%9D%91%2C%E6%94%BE%E5%BC%83&quaddescs=%E5%BF%AB%E9%80%9F%E5%BD%93%E4%B8%8B%2C%E9%95%BF%E6%9C%9F%E6%8A%95%E5%85%A5%2C%E8%A1%A5%E5%8D%95%2C%E6%97%A0%E5%90%88%E8%A1%8C&xlabel=%E6%8A%95%E5%85%A5&ylabel=%E5%9B%9E%E6%8A%A5&items=%E6%96%B0%E4%B8%9A%E5%8A%A1%400.82%2C0.86%3BAI+%E8%B0%83%E6%9F%A5%400.74%2C0.68%3B%E6%97%A7%E7%B3%BB%E7%BB%9F%400.22%2C0.28%3B%E5%85%AC%E5%8F%B8%E6%94%BF%E7%AD%96%400.18%2C0.74)](https://x-cmd.com/draw/explore?type=quadrant&title=%E5%9B%9B%E8%B1%A1%E9%99%90%E5%86%B3%E7%AD%96&quadrants=%E5%BF%AB%E8%B5%A2%2C%E6%88%98%E7%95%A5%2C%E5%A1%AB%E5%9D%91%2C%E6%94%BE%E5%BC%83&quaddescs=%E5%BF%AB%E9%80%9F%E5%BD%93%E4%B8%8B%2C%E9%95%BF%E6%9C%9F%E6%8A%95%E5%85%A5%2C%E8%A1%A5%E5%8D%95%2C%E6%97%A0%E5%90%88%E8%A1%8C&xlabel=%E6%8A%95%E5%85%A5&ylabel=%E5%9B%9E%E6%8A%A5&items=%E6%96%B0%E4%B8%9A%E5%8A%A1%400.82%2C0.86%3BAI+%E8%B0%83%E6%9F%A5%400.74%2C0.68%3B%E6%97%A7%E7%B3%BB%E7%BB%9F%400.22%2C0.28%3B%E5%85%AC%E5%8F%B8%E6%94%BF%E7%AD%96%400.18%2C0.74)

A 2×2 matrix: two axes split into low/high, four cells named (and optionally
annotated), points placed by their coordinates. The classic home of the
Eisenhower matrix, the BCG matrix and the Atlassian 4Ls retrospective.

---

## Parameters

| param | meaning | default |
| --- | --- | --- |
| `quadrants=` | four cell names, comma separated — **top-left, top-right, bottom-left, bottom-right** (required) | — |
| `quaddescs=` | four cell notes, comma separated (same order) | — |
| `xlabel=` / `ylabel=` | axis titles | — |
| `xlow=` / `xhigh=` | horizontal axis end labels | `低` / `高` |
| `ylow=` / `yhigh=` | vertical axis end labels | `低` / `高` |
| `items=` | points: `name@x,y`, semicolon separated; `x`/`y` are 0..1 | — |
| `d=` | the whole spec as JSON | — |
| `title=` | chart title | — |

## The `d=` form

```json
{
  "title": "四象限决策",
  "xlabel": "投入",
  "ylabel": "回报",
  "xlow": "低", "xhigh": "高", "ylow": "低", "yhigh": "高",
  "quadrants": [
    { "name": "快赢", "desc": "快速当下" },
    { "name": "战略", "desc": "长期投入" },
    { "name": "填坑", "desc": "补单" },
    { "name": "放弃", "desc": "无合行" }
  ],
  "items": [{ "name": "新业务", "x": 0.82, "y": 0.86 }]
}
```

---

## Pitfalls

- **Cell order is fixed**: top-left, top-right, bottom-left, bottom-right — the
  order you read them in. A wrong order is not an error, just a different chart.
- **Exactly four cells**: fewer or more is a 400, not a silent truncation.
- **Point coordinates are 0..1** (0 = low end of the axis, 1 = high end);
  out-of-range values are clamped, not rejected.
- **Axis end labels default to 低/高** — set `xlow`/`xhigh`/`ylow`/`yhigh` for a
  non-Chinese audience.
