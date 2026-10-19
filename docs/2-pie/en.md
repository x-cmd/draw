---
x-title: pie chart — 6 styles (opendata / evil / evil-mono / market-mono / progress / revenue)
x-desc: x-cmd/draw `type=pie` quick reference. 6 styles: opendata (labels outside + editorial title), evil (rounded sectors + inline values), evil-mono (leader lines outside), market-mono (grayscale + center total), progress (dotted progress ring), revenue (gradient sectors + right legend). Full params: labels / values / title / unit / donut / t / scheme / num / w/h.
x-sidebar: draw pie chart
x-keywords: pie chart, draw, svg, opendata, evil, market-mono, progress, revenue, donut
x-json-ld:
  '@context': https://schema.org
  '@graph':
    - '@type': TechArticle
      headline: 'draw pie chart'
      inLanguage: 'en'
      about: 'x-cmd/draw pie chart usage'
---

# pie chart — 6 styles (opendata / evil / evil-mono / market-mono / progress / revenue)

---

## 1. Parameters

| param | meaning | required |
| --- | --- | --- |
| `labels=` | sector labels, comma-separated | ✓ |
| `values=` | sector values, comma-separated | ✓ |
| `title=` | chart title | ✗ |
| `unit=` | numeric unit (e.g., `B`, `responses`, `%`) | ✗ |
| `donut=` | `0` solid / `>0` ring width | ✗ |
| `t=` | style (see table below) | ✗ |

Common params (`scheme` / `num` / `w/h` / `v`) — see [0-draw-overview](0-draw-overview) §2.

---

## 2. The 6 styles (`t=`)

| style (`t=`) | visual | use case |
| --- | --- | --- |
| `opendata` (default) | labels outside, editorial title | general, browser market |
| `evil` | rounded sectors, white gap, inline values | revenue / market share |
| `evil-mono` | solid + leader lines outside, name gray / value ink | B&W print |
| `market-mono` | grayscale by share depth, center total, 2-col legend | business reports |
| `progress` | dotted progress ring, large center percentage | surveys / polls |
| `revenue` | diagonal gradient, dashed inner, right legend with values | revenue analysis |

### Examples

```sh
# OpenData (default)
curl "https://x-cmd.com/draw?type=pie&t=opendata&title=Chrome%20holds&labels=Chrome,Safari,Firefox,Edge,Other&values=65,18,7,6,4"

# Evil
curl "https://x-cmd.com/draw?type=pie&t=evil&title=Browser%20market&labels=Chrome,Safari,Firefox,Edge,Other&values=275,200,187,173,90"

# Evil outside-labels
curl "https://x-cmd.com/draw?type=pie&t=evil-mono&title=Browser%20market&labels=Chrome,Safari,Firefox,Edge,Other&values=275,200,187,173,90"

# Market Mono (with unit)
curl "https://x-cmd.com/draw?type=pie&t=market-mono&unit=B&title=Market%20share&labels=Skyline,Datawell,Cloudpeak,Taskbridge,Streamforge&values=27,21,13,21,12"

# Progress (dotted ring)
curl "https://x-cmd.com/draw?type=pie&t=progress&unit=responses&title=Where%20the%20workday%20leaks&labels=Additional%20support%20requests,Inaccurate%20forecasts&values=48,67"

# Revenue (gradient)
curl "https://x-cmd.com/draw?type=pie&t=revenue&unit=orders&title=Revenue&labels=Direct,Marketplace,Wholesale,Affiliate&values=52400,38900,24150,16300"
```

---

## 3. Solid vs donut

`donut=0` forces solid pie (no ring center):

```sh
curl "https://x-cmd.com/draw?type=pie&donut=0&title=Share&labels=TS,Py,Go&values=48,23,9"
```

> **Same template, one parameter switches form** — that's x-cmd/draw's core design: style is parameter-driven, not template-switching.

---

## 4. Pitfalls

- **Label count ≤ 100**, > 9 auto-collapsed into "Other"
- Solid vs donut is just `donut=` — don't switch style to "go solid"
- Color scheme: `scheme=dark\|light`. Some styles' contrast varies in dark mode
- Spaces in titles must be URL-encoded: use `%20`