---
x-title: line chart — the default for time series
x-desc: x-cmd/draw `type=line` quick reference. The default for time series. Params: `x=` time labels / `y=` single series / `series=A:...,B:...` multi-series / `title=` / `unit=`. Points and lines styled separately.
x-sidebar: draw line chart
x-keywords: line chart, draw, svg, time series
x-json-ld:
  '@context': https://schema.org
  '@graph':
    - '@type': TechArticle
      headline: 'draw line chart'
      inLanguage: 'en'
      about: 'x-cmd/draw line chart'
---

# line chart — the default for time series

---

## Parameters

| param | meaning | required |
| --- | --- | --- |
| `x=` | X-axis labels (time / category) | ✓ |
| `y=` | single series values | single series ✓ |
| `series=A:v1,v2,...&series=B:v1,v2,...` | multiple series | multi-series ✓ |
| `title=` / `unit=` | title / unit | ✗ |
| `t=` | style | — |

---

## Examples

```sh
# Single series
curl "https://x-cmd.com/draw?type=line&x=Jan,Feb,Mar,Apr,May,Jul&y=10,20,15,30,25,40&title=Monthly%20growth"

# Multi-series
curl "https://x-cmd.com/draw?type=line&x=Mon,Tue,Wed,Thu,Fri,Sat,Sun&series=Daytime:120,140,135,150,180,200,170&series=Nighttime:80,75,90,85,95,110,100"

# With unit
curl "https://x-cmd.com/draw?type=line&x=Q1,Q2,Q3,Q4&series=Revenue:52400,38900,24150,16300&series=Cost:31200,28700,19800,14500&unit=USD&title=Quarterly%20P&L"
```

---

## Pitfalls

- **Points vs X labels**: X labels ≥ data points, otherwise missing values; X labels < data points takes first N
- **Multi-series alignment**: all series must have the same length, otherwise drawn to shortest
- **Extremes**: Y axis auto-fits; use `ymin=` / `ymax=` to fix range