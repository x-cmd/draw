---
x-title: radar chart — multi-dimension comparison
x-desc: x-cmd/draw `type=radar` quick reference. Multi-dimension comparison (products / candidates / plans scored on multiple axes). Params: labels=`dimensions` + values=`scores` or series=`multiple objects`. Value range usually 0-100.
x-sidebar: draw radar chart
x-keywords: radar chart, draw, svg, multi-dimension
x-json-ld:
  '@context': https://schema.org
  '@graph':
    - '@type': TechArticle
      headline: 'draw radar chart'
      inLanguage: 'en'
      about: 'x-cmd/draw radar chart'
---

# radar chart — multi-dimension comparison

The default for multi-dimension comparison. **Typical use**: products / candidates / plans scored across multiple axes.

---

## Parameters

| param | meaning | required |
| --- | --- | --- |
| `labels=` | dimension names (axis labels) | ✓ |
| `values=` | single object scores per dimension | single object ✓ |
| `series=A:v1,v2,...&series=B:v1,v2,...` | multiple objects (overlay) | multi-object ✓ |
| `title=` | chart title | ✗ |

Value range usually 0-100 (or 0-10). **All dimensions must use the same value range** for fair comparison.

---

## Examples

```sh
# Single object
curl "https://x-cmd.com/draw?type=radar&labels=Speed,Quality,Price,Support,UX&values=85,90,70,80,95&title=Product%20A"

# Multi-object comparison
curl "https://x-cmd.com/draw?type=radar&labels=Speed,Quality,Price,Support,UX&series=A:85,90,70,80,95&series=B:75,85,90,70,80&series=C:90,80,60,85,75&title=Product%20comparison"
```

---

## Pitfalls

- **3-7 dimensions optimal**: < 3 hard to see shape; > 7 too dense
- **All dimensions same value range**: mixing 0-100 and 0-10 distorts the comparison
- **Multi-object legend = series name**: A/B/C are series IDs — change to meaningful names