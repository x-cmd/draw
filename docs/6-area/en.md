---
x-title: area chart — line + fill, emphasizes accumulation
x-desc: x-cmd/draw `type=area` quick reference. Line + fill below, emphasizes accumulation / totals (vs line's "instantaneous"). Same params as line: x + y or series.
x-sidebar: draw area chart
x-keywords: area chart, draw, svg
x-json-ld:
  '@context': https://schema.org
  '@graph':
    - '@type': TechArticle
      headline: 'draw area chart'
      inLanguage: 'en'
      about: 'x-cmd/draw area chart'
---

# area chart — line + fill, emphasizes accumulation

Line + fill below, **emphasizes accumulation / totals** (vs line's "instantaneous values").

Same params as `line`: x / y / series / title / unit.

---

## Examples

```sh
# Single series
curl "https://x-cmd.com/draw?type=area&x=Jan,Feb,Mar,Apr,May,Jun&y=10,30,25,50,40,70&title=Cumulative%20users"

# Multi-series stacked
curl "https://x-cmd.com/draw?type=area&x=2019,2020,2021,2022,2023,2024&series=Mobile:100,150,220,300,400,520&series=Desktop:200,180,160,140,120,90"
```

---

## area vs line

- **line**: emphasizes **value at each time point**
- **area**: emphasizes **accumulation** or **overall magnitude**

Stacked area is especially good for "share changes over time".