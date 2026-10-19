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

## Examples (what you see is what the URL gives; click to enlarge)

**Ranking (base)**

```text
https://x-cmd.com/draw?type=hbar&labels=cli,core,docs,ui&values=42,31,18,9&title=Commits%20by%20area
```

![Ranking (base)](https://x-cmd.com/draw?type=hbar&labels=cli,core,docs,ui&values=42,31,18,9&title=Commits%20by%20area)

**Long labels**

```text
https://x-cmd.com/draw?type=hbar&labels=Alice,Bob,Charlie,Diana,Edward&values=120,98,150,75,60&title=Reviews
```

![Long labels](https://x-cmd.com/draw?type=hbar&labels=Alice,Bob,Charlie,Diana,Edward&values=120,98,150,75,60&title=Reviews)

**Pixel bars (t=xcmd, %)**

```text
https://x-cmd.com/draw?type=hbar&t=xcmd&labels=TypeScript,Python,Go,Other&values=68,21,9,2&title=Languages
```

![Pixel bars (t=xcmd, %)](https://x-cmd.com/draw?type=hbar&t=xcmd&labels=TypeScript,Python,Go,Other&values=68,21,9,2&title=Languages)

**Butterfly (t=xcmd-issue)**

```text
https://x-cmd.com/draw?type=hbar&t=xcmd-issue&labels=cli,core,docs,ci,ui&series=open:12,8,15,4,9&series=closed:38,52,20,11,26&title=Issues%20by%20area
```

![Butterfly (t=xcmd-issue)](https://x-cmd.com/draw?type=hbar&t=xcmd-issue&labels=cli,core,docs,ci,ui&series=open:12,8,15,4,9&series=closed:38,52,20,11,26&title=Issues%20by%20area)

**Two-series rank (t=rank)**

```text
https://x-cmd.com/draw?type=hbar&t=rank&labels=Q1,Q2,Q3&series=2025:80,95,110&series=2026:110,85,120&title=Quarterly
```

![Two-series rank (t=rank)](https://x-cmd.com/draw?type=hbar&t=rank&labels=Q1,Q2,Q3&series=2025:80,95,110&series=2026:110,85,120&title=Quarterly)

**Reference line (t=opendata)**

```text
https://x-cmd.com/draw?type=hbar&t=opendata&labels=alpha,beta,gamma,delta&values=8,6,9,4&ref=7&reflabel=target&title=Sprint%20points
```

![Reference line (t=opendata)](https://x-cmd.com/draw?type=hbar&t=opendata&labels=alpha,beta,gamma,delta&values=8,6,9,4&ref=7&reflabel=target&title=Sprint%20points)

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



---

## When to use hbar vs bar

- **bar** (vertical): time series — X axis is time, "left-to-right" suggests time flow
- **hbar** (horizontal): category comparison — Y axis is categories with long text

Example: project names in Chinese → hbar; months → bar.