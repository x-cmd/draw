---
x-title: scatter plot — correlation analysis
x-desc: 'x-cmd/draw `type=scatter` quick reference. Two-dimension correlation (height vs weight / price vs sales). Params: `points=x1,y1;x2,y2;...` or `series=A:x1,y1;...&series=B:x1,y1;...`.'
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

## Examples (what you see is what the URL gives; click to enlarge)

**Single series**

```text
https://x-cmd.com/draw?type=scatter&x=1,2,3,4,5&y=4,5,3,6,5&title=Latency
```

![Single series](https://x-cmd.com/draw?type=scatter&x=1,2,3,4,5&y=4,5,3,6,5&title=Latency)

**Negative values**

```text
https://x-cmd.com/draw?type=scatter&x=-3,-1,0,1,3&y=2,-2,3,-3,1&title=Drift
```

![Negative values](https://x-cmd.com/draw?type=scatter&x=-3,-1,0,1,3&y=2,-2,3,-3,1&title=Drift)

**Multi-series (repeated x=/y=)**

```text
https://x-cmd.com/draw?type=scatter&x=1,2,3&y=4,5,6&x=4,5,6&y=1,2,3&title=Groups
```

![Multi-series (repeated x=/y=)](https://x-cmd.com/draw?type=scatter&x=1,2,3&y=4,5,6&x=4,5,6&y=1,2,3&title=Groups)

**All labels (num=all)**

```text
https://x-cmd.com/draw?type=scatter&x=1,2,3&y=2,4,3&num=all&title=Small%20set
```

![All labels (num=all)](https://x-cmd.com/draw?type=scatter&x=1,2,3&y=2,4,3&num=all&title=Small%20set)

Two-dimension correlation. **Typical use**: height vs weight / price vs sales / age vs income.

---


**Trend**

```text
https://x-cmd.com/draw?type=scatter&x=1,2,3,4,5,6,7,8&y=2,4,3,6,5,7,4,8&title=Trend
```

![Trend](https://x-cmd.com/draw?type=scatter&x=1,2,3,4,5,6,7,8&y=2,4,3,6,5,7,4,8&title=Trend)

**Peak label (num=peak)**

```text
https://x-cmd.com/draw?type=scatter&x=1,2,3,4&y=5,3,8,6&num=peak&title=Peak
```

![Peak label (num=peak)](https://x-cmd.com/draw?type=scatter&x=1,2,3,4&y=5,3,8,6&num=peak&title=Peak)

## Parameters

| param | meaning | required |
| --- | --- | --- |
| `points=x1,y1;x2,y2;...` | single group (semicolon between points, comma between coords) | single group ✓ |
| `series=A:x1,y1;x2,y2;...&series=B:...` | multiple groups | multi-group ✓ |
| `xlabel=` / `ylabel=` | axis labels | ✗ |
| `title=` | chart title | ✗ |

---



---

## Pitfalls

- **Data format**: `x1,y1;x2,y2;...` — semicolon between points, comma between coords. Easy to mix up
- **≤ 200 points** stays readable
- **No trend line / fit**: only draws points; not supported currently
- **Multi-group**: each group should have ≥ 5 points