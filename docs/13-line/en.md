---
x-title: line chart — the default for time series
x-desc: 'x-cmd/draw `type=line` quick reference. The default for time series. Params: `x=` time labels / `y=` single series / `series=A:...,B:...` multi-series / `title=` / `unit=`. Points and lines styled separately.'
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

## Examples (what you see is what the URL gives; click to enlarge)

**Single line (shadcn default)**

```text
https://x-cmd.com/draw?type=line&labels=Jan,Feb,Mar,Apr,May,Jun&values=12,19,15,25,22,30&title=Stars
```

![Single line (shadcn default)](https://x-cmd.com/draw?type=line&labels=Jan,Feb,Mar,Apr,May,Jun&values=12,19,15,25,22,30&title=Stars)

**Multi-line (series=)**

```text
https://x-cmd.com/draw?type=line&labels=Mon,Tue,Wed,Thu&series=day:12,18,9,14&series=night:8,7,9,8&title=Traffic
```

![Multi-line (series=)](https://x-cmd.com/draw?type=line&labels=Mon,Tue,Wed,Thu&series=day:12,18,9,14&series=night:8,7,9,8&title=Traffic)

**Glow (t=evil-glow)**

```text
https://x-cmd.com/draw?type=line&t=evil-glow&labels=Q1,Q2,Q3,Q4&values=3.1,3.4,3.2,3.8&title=Growth
```

![Glow (t=evil-glow)](https://x-cmd.com/draw?type=line&t=evil-glow&labels=Q1,Q2,Q3,Q4&values=3.1,3.4,3.2,3.8&title=Growth)

**Line-end labels (t=opendata)**

```text
https://x-cmd.com/draw?type=line&t=opendata&labels=v0.1,v0.2,v0.3&values=120,240,410&title=Downloads
```

![Line-end labels (t=opendata)](https://x-cmd.com/draw?type=line&t=opendata&labels=v0.1,v0.2,v0.3&values=120,240,410&title=Downloads)

**Mono (t=evil-mono)**

```text
https://x-cmd.com/draw?type=line&t=evil-mono&labels=Mon,Tue,Wed,Thu,Fri&values=42,38,50,46,58&title=Builds
```

![Mono (t=evil-mono)](https://x-cmd.com/draw?type=line&t=evil-mono&labels=Mon,Tue,Wed,Thu,Fri&values=42,38,50,46,58&title=Builds)

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



---

## Pitfalls

- **Points vs X labels**: X labels ≥ data points, otherwise missing values; X labels < data points takes first N
- **Multi-series alignment**: all series must have the same length, otherwise drawn to shortest
- **Extremes**: Y axis auto-fits; use `ymin=` / `ymax=` to fix range