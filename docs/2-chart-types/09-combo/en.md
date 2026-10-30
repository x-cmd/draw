---
x-title: combo chart — bar + line overlay
x-desc: 'x-cmd/draw `type=combo` quick reference. Bar + line overlay (bar = absolute / line = trend or ratio). Params: bar series `series=A:...` + line series `series=B:...&kind=line`. `kind` distinguishes bar from line.'
x-sidebar: draw combo chart
x-keywords: combo chart, draw, svg, bar + line
x-json-ld:
  '@context': https://schema.org
  '@graph':
    - '@type': TechArticle
      headline: 'draw combo chart'
      inLanguage: 'en'
      about: 'x-cmd/draw combo chart'
---

# combo chart — bar + line overlay

## Examples (what you see is what the URL gives; click to enlarge)

**Bars + line (auto dual y-axis)**

```text
https://x-cmd.com/draw?type=combo&labels=Jan,Feb,Mar,Apr,May&series=Sales:100,150,120,180,200&line=Conversion%20rate:3.2,4.1,3.8,4.5,5.2&title=Funnel
```

![Bars + line (auto dual y-axis)](https://x-cmd.com/draw?type=combo&labels=Jan,Feb,Mar,Apr,May&series=Sales:100,150,120,180,200&line=Conversion%20rate:3.2,4.1,3.8,4.5,5.2&title=Funnel)

**Multi bars + multi lines**

```text
https://x-cmd.com/draw?type=combo&labels=Q1,Q2,Q3,Q4&series=Revenue:52400,38900,24150,16300&series=Cost:31200,28700,19800,14500&line=Margin:39,26,18,11&unit=%25
```

![Multi bars + multi lines](https://x-cmd.com/draw?type=combo&labels=Q1,Q2,Q3,Q4&series=Revenue:52400,38900,24150,16300&series=Cost:31200,28700,19800,14500&line=Margin:39,26,18,11&unit=%25)

**Downloads vs star growth**

```text
https://x-cmd.com/draw?type=combo&labels=Mon,Tue,Wed,Thu,Fri,Sat,Sun&series=Downloads:120,180,150,210,240,200,260&line=Star%20growth:3.1,3.4,3.2,3.8,4.1,3.9,4.5&title=Weekly
```

![Downloads vs star growth](https://x-cmd.com/draw?type=combo&labels=Mon,Tue,Wed,Thu,Fri,Sat,Sun&series=Downloads:120,180,150,210,240,200,260&line=Star%20growth:3.1,3.4,3.2,3.8,4.1,3.9,4.5&title=Weekly)

**Stacked bars + line**

```text
https://x-cmd.com/draw?type=combo&stack=1&labels=Q1,Q2,Q3&series=web:3,4,2&series=cli:1,2,3&line=total:4,6,5&title=Mixed
```

![Stacked bars + line](https://x-cmd.com/draw?type=combo&stack=1&labels=Q1,Q2,Q3&series=web:3,4,2&series=cli:1,2,3&line=total:4,6,5&title=Mixed)

**evil style**

```text
https://x-cmd.com/draw?type=combo&t=evil&labels=Mon,Tue,Wed&series=dl:9,12,15&line=growth:1.1,1.4,1.8&title=Weekly
```

![evil style](https://x-cmd.com/draw?type=combo&t=evil&labels=Mon,Tue,Wed&series=dl:9,12,15&line=growth:1.1,1.4,1.8&title=Weekly)

Bar + line overlay. **Typical use**: bar = absolute value (sales), line = rate (conversion).

---

## Parameters

| param | meaning | required |
| --- | --- | --- |
| `labels=` | X axis | ✓ |
| `series=A:v1,v2,...&kind=bar` | bar series | ✓ |
| `series=B:v1,v2,...&kind=line` | line series (can be multiple) | ✓ |
| `title=` | chart title | ✗ |
| `unit=` | unit | ✗ |

`kind` distinguishes bar / line: `bar` / `line`. Each series can independently specify kind.

---



---

## Pitfalls

- **bar / line dual Y axis**: auto-adapts, but watch for unit-mismatch (e.g., percentage vs USD)
- **Multi-series**: each needs `kind` — missing falls back to bar
- **Not all styles support combo**: `t=` compatibility matches single-bar