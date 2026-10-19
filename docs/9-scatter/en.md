---
x-title: scatter plot — correlation analysis
x-desc: x-cmd/draw `type=scatter` quick reference. Two-dimension correlation (height vs weight / price vs sales). Params: `points=x1,y1;x2,y2;...` or `series=A:x1,y1;...&series=B:x1,y1;...`.
x-sidebar: draw scatter plot
x-keywords: scatter plot, draw, svg, correlation
x-json-ld:
  '@context': https://schema.org
  '@graph':
    - '@type': TechArticle
      headline: 'draw scatter plot'
      inLanguage: 'en'
      about: 'x-cmd/draw scatter plot'
---

# scatter plot — correlation analysis

Two-dimension correlation. **Typical use**: height vs weight / price vs sales / age vs income.

---

## Parameters

| param | meaning | required |
| --- | --- | --- |
| `points=x1,y1;x2,y2;...` | single group (semicolon between points, comma between coords) | single group ✓ |
| `series=A:x1,y1;x2,y2;...&series=B:...` | multiple groups | multi-group ✓ |
| `xlabel=` / `ylabel=` | axis labels | ✗ |
| `title=` | chart title | ✗ |

---

## Examples

```sh
# Single group
curl "https://x-cmd.com/draw?type=scatter&points=1.5,60;1.7,65;1.8,72;1.6,58;1.75,68&xlabel=Height%20(m)&ylabel=Weight%20(kg)&title=Sample%20population"

# Multi-group
curl "https://x-cmd.com/draw?type=scatter&series=A:1.5,60;1.7,65;1.8,72&series=B:1.8,75;1.9,80;1.85,78&xlabel=H&ylabel=W&title=A%20vs%20B%20population"
```

---

## Pitfalls

- **Data format**: `x1,y1;x2,y2;...` — semicolon between points, comma between coords. Easy to mix up
- **≤ 200 points** stays readable
- **No trend line / fit**: only draws points; not supported currently
- **Multi-group**: each group should have ≥ 5 points