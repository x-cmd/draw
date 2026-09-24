---
x-title: combo chart — bar + line overlay
x-desc: x-cmd/draw `type=combo` quick reference. Bar + line overlay (bar = absolute / line = trend or ratio). Params: bar series `series=A:...` + line series `series=B:...&kind=line`. `kind` distinguishes bar from line.
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

## Examples

```sh
# Bar (sales) + line (conversion rate)
curl "https://x-cmd.com/draw?type=combo&labels=Jan,Feb,Mar,Apr,May&series=Sales:100,150,120,180,200&kind=bar&series=Conversion%20rate:3.2,4.1,3.8,4.5,5.2&kind=line"

# Multi-bar + multi-line
curl "https://x-cmd.com/draw?type=combo&labels=Q1,Q2,Q3,Q4&series=Revenue:52400,38900,24150,16300&kind=bar&series=Cost:31200,28700,19800,14500&kind=bar&series=Margin:39,26,18,11&kind=line&unit=%25"
```

---

## Pitfalls

- **bar / line dual Y axis**: auto-adapts, but watch for unit-mismatch (e.g., percentage vs USD)
- **Multi-series**: each needs `kind` — missing falls back to bar
- **Not all styles support combo**: `t=` compatibility matches single-bar