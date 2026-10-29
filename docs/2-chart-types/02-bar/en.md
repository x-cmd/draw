---
x-title: bar chart — grouped / stacked / single series
x-desc: 'x-cmd/draw `type=bar` quick reference. Grouped: `labels=` + multiple `series=A:...,B:...`. Stacked: same plus `stack=1`. Single series: `labels=` + `values=`. Style `t=` includes `evil` etc.'
x-sidebar: draw bar chart
x-keywords: bar chart, draw, evil, grouped bar, stacked bar
x-json-ld:
  '@context': https://schema.org
  '@graph':
    - '@type': TechArticle
      headline: 'draw bar chart'
      inLanguage: 'en'
      about: 'x-cmd/draw bar chart usage'
---

# bar chart — grouped / stacked / single series

## Examples (what you see is what the URL gives; click to enlarge)

**Single series**

```text
https://x-cmd.com/draw?type=bar&labels=Jan,Feb,Mar,Apr,May&values=100,150,120,180,200
```

![Single series](https://x-cmd.com/draw?type=bar&labels=Jan,Feb,Mar,Apr,May&values=100,150,120,180,200)

**evil default (12 months)**

```text
https://x-cmd.com/draw?type=bar&t=evil&labels=Jan,Feb,Mar,Apr,May,Jun,Jul,Aug,Sep,Oct,Nov,Dec&series=Desktop:34,87,51,63,45,78,39,92,65,53,80,27&series=Mobile:18,49,29,39,31,45,23,56,37,36,51,14
```

![evil default (12 months)](https://x-cmd.com/draw?type=bar&t=evil&labels=Jan,Feb,Mar,Apr,May,Jun,Jul,Aug,Sep,Oct,Nov,Dec&series=Desktop:34,87,51,63,45,78,39,92,65,53,80,27&series=Mobile:18,49,29,39,31,45,23,56,37,36,51,14)

**Grouped two series**

```text
https://x-cmd.com/draw?type=bar&labels=Mon,Tue,Wed&series=dev:12,18,9&series=ci:8,11,6
```

![Grouped two series](https://x-cmd.com/draw?type=bar&labels=Mon,Tue,Wed&series=dev:12,18,9&series=ci:8,11,6)

**Stacked (stack=1)**

```text
https://x-cmd.com/draw?type=bar&stack=1&labels=Q1,Q2,Q3&series=web:30,42,55&series=cli:12,18,9
```

![Stacked (stack=1)](https://x-cmd.com/draw?type=bar&stack=1&labels=Q1,Q2,Q3&series=web:30,42,55&series=cli:12,18,9)

**Table bars (t=grid)**

```text
https://x-cmd.com/draw?type=bar&t=grid&labels=Mon,Tue,Wed,Thu&values=120,180,150,210
```

![Table bars (t=grid)](https://x-cmd.com/draw?type=bar&t=grid&labels=Mon,Tue,Wed,Thu&values=120,180,150,210)

---

## 1. Parameters

| param | meaning | required |
| --- | --- | --- |
| `labels=` | X-axis labels, comma-separated | ✓ |
| `values=` | single series values (Y-axis) | single series ✓ |
| `series=A:v1,v2,...&series=B:v1,v2,...` | multiple series (grouped or stacked) | grouped multi-series ✓ |
| `title=` | chart title | ✗ |
| `unit=` | numeric unit | ✗ |
| `t=` | style (default `evil`) | — |

---

## 2. Three modes

### Single series

`values=` for one series:


### Grouped (multi-series side-by-side)

Multiple `series=A:...,B:...,C:...`:


### Stacked (multi-series stacked)

Add `stack=1`:


---

## 3. Pitfalls

- **Grouped vs stacked**: grouped by default; add `stack=1` for stacked
- **X-axis labels**: ≤ 50 stays readable
- **Multi-series naming**: `series=A:...` — `A` is legend name (can be Chinese)
- **Zero values**: skipped (zero-height bar not drawn) — by design