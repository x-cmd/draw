---
x-title: hbar — horizontal bar chart, friendly to long labels
x-desc: x-cmd/draw `type=hbar` quick reference. Horizontal bar chart, ideal for long labels (names / projects / categories). Same params as bar: labels + values or series, title / unit / t / scheme / num / w/h.
x-sidebar: draw horizontal bar
x-keywords: hbar, horizontal bar, draw, svg
x-json-ld:
  '@context': https://schema.org
  '@graph':
    - '@type': TechArticle
      headline: 'draw hbar horizontal bar chart'
      inLanguage: 'en'
      about: 'x-cmd/draw horizontal bar chart'
---

# hbar — horizontal bar chart, friendly to long labels

Horizontal bar chart. **Ideal for long labels** (names, project names, long categories).

---

## Parameters

Same as `bar`:

| param | meaning | required |
| --- | --- | --- |
| `labels=` | Y-axis labels (horizontal) | ✓ |
| `values=` | single series values | single series ✓ |
| `series=A:...,B:...` | multiple series | multi-series ✓ |
| `title=` | chart title | ✗ |
| `unit=` | numeric unit | ✗ |
| `t=` | style | — |

---

## Examples

```sh
# Single series
curl "https://x-cmd.com/draw?type=hbar&labels=Alice,Bob,Charlie,Diana,Edward&values=120,98,150,76,135&title=Score%20by%20person"

# Multi-series grouped
curl "https://x-cmd.com/draw?type=hbar&labels=Project%20Alpha,Project%20Beta,Project%20Gamma&series=Q1:80,60,90&series=Q2:95,75,110&series=Q3:110,85,120"

# Stacked
curl "https://x-cmd.com/draw?type=hbar&stack=1&labels=Region%20A,Region%20B,Region%20C&series=Desktop:300,250,400&series=Mobile:200,180,350&series=Tablet:50,30,80"
```

---

## When to use hbar vs bar

- **bar** (vertical): time series — X axis is time, "left-to-right" suggests time flow
- **hbar** (horizontal): category comparison — Y axis is categories with long text

Example: project names in Chinese → hbar; months → bar.