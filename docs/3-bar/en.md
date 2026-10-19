---
x-title: bar chart — grouped / stacked / single series
x-desc: x-cmd/draw `type=bar` quick reference. Grouped: `labels=` + multiple `series=A:...,B:...`. Stacked: same plus `stack=1`. Single series: `labels=` + `values=`. Style `t=` includes `evil` etc.
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

```sh
curl "https://x-cmd.com/draw?type=bar&labels=Jan,Feb,Mar,Apr,May&values=100,150,120,180,200"
```

### Grouped (multi-series side-by-side)

Multiple `series=A:...,B:...,C:...`:

```sh
curl "https://x-cmd.com/draw?type=bar&t=evil&labels=Jan,Feb,Mar,Apr,May,Jun,Jul,Aug,Sep,Oct,Nov,Dec&series=Desktop:34,87,51,63,45,78,39,92,65,53,80,27&series=Mobile:18,49,29,39,31,45,23,56,37,36,51,14"
```

### Stacked (multi-series stacked)

Add `stack=1`:

```sh
curl "https://x-cmd.com/draw?type=bar&stack=1&labels=Jan,Feb,Mar&series=A:10,20,30&series=B:5,15,25"
```

---

## 3. Pitfalls

- **Grouped vs stacked**: grouped by default; add `stack=1` for stacked
- **X-axis labels**: ≤ 50 stays readable
- **Multi-series naming**: `series=A:...` — `A` is legend name (can be Chinese)
- **Zero values**: skipped (zero-height bar not drawn) — by design