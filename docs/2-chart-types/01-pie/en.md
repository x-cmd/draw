---
x-title: pie chart — 6 styles (opendata / evil / evil-mono / market-mono / progress / revenue)
x-desc: 'x-cmd/draw `type=pie` quick reference. 6 styles: opendata (labels outside + editorial title), evil (rounded sectors + inline values), evil-mono (leader lines outside), market-mono (grayscale + center total), progress (dotted progress ring), revenue (gradient sectors + right legend). Full params: labels / values / title / unit / donut / t / scheme / num / w/h.'
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

## Examples (what you see is what the URL gives; click to enlarge)

**OpenData (default, labels outside)**

```text
https://x-cmd.com/draw?type=pie&t=opendata&title=Chrome%20holds&labels=Chrome,Safari,Firefox,Edge,Other&values=65,18,7,6,4
```

![OpenData (default, labels outside)](https://x-cmd.com/draw?type=pie&t=opendata&title=Chrome%20holds&labels=Chrome,Safari,Firefox,Edge,Other&values=65,18,7,6,4)

**Evil (rounded sectors, inline values)**

```text
https://x-cmd.com/draw?type=pie&t=evil&title=Browser%20market&labels=Chrome,Safari,Firefox,Edge,Other&values=275,200,187,173,90
```

![Evil (rounded sectors, inline values)](https://x-cmd.com/draw?type=pie&t=evil&title=Browser%20market&labels=Chrome,Safari,Firefox,Edge,Other&values=275,200,187,173,90)

**Evil-mono (leader lines, print)**

```text
https://x-cmd.com/draw?type=pie&t=evil-mono&title=Browser%20market&labels=Chrome,Safari,Firefox,Edge,Other&values=275,200,187,173,90
```

![Evil-mono (leader lines, print)](https://x-cmd.com/draw?type=pie&t=evil-mono&title=Browser%20market&labels=Chrome,Safari,Firefox,Edge,Other&values=275,200,187,173,90)

**Market Mono (grayscale + center total)**

```text
https://x-cmd.com/draw?type=pie&t=market-mono&unit=B&title=Market%20share&labels=Skyline,Datawell,Cloudpeak,Taskbridge,Streamforge&values=27,21,13,21,12
```

![Market Mono (grayscale + center total)](https://x-cmd.com/draw?type=pie&t=market-mono&unit=B&title=Market%20share&labels=Skyline,Datawell,Cloudpeak,Taskbridge,Streamforge&values=27,21,13,21,12)

**Progress (dotted ring)**

```text
https://x-cmd.com/draw?type=pie&t=progress&unit=responses&title=Where%20the%20workday%20leaks&labels=Additional%20support%20requests,Inaccurate%20forecasts&values=48,67
```

![Progress (dotted ring)](https://x-cmd.com/draw?type=pie&t=progress&unit=responses&title=Where%20the%20workday%20leaks&labels=Additional%20support%20requests,Inaccurate%20forecasts&values=48,67)

**Revenue (gradient + right legend)**

```text
https://x-cmd.com/draw?type=pie&t=revenue&unit=orders&title=Revenue&labels=Direct,Marketplace,Wholesale,Affiliate&values=52400,38900,24150,16300
```

![Revenue (gradient + right legend)](https://x-cmd.com/draw?type=pie&t=revenue&unit=orders&title=Revenue&labels=Direct,Marketplace,Wholesale,Affiliate&values=52400,38900,24150,16300)

**Solid pie (donut=0)**

```text
https://x-cmd.com/draw?type=pie&donut=0&title=Share&labels=TS,Py,Go&values=48,23,9
```

![Solid pie (donut=0)](https://x-cmd.com/draw?type=pie&donut=0&title=Share&labels=TS,Py,Go&values=48,23,9)

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

Common params (`scheme` / `num` / `w/h` / `v`) — see [2-overview](../../1-overview/01-what-is-draw/en.md) §2.

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



---

## 3. Solid vs donut

`donut=0` forces solid pie (no ring center):


> **Same template, one parameter switches form** — that's x-cmd/draw's core design: style is parameter-driven, not template-switching.

---

## 4. Pitfalls

- **Label count ≤ 100**, > 9 auto-collapsed into "Other"
- Solid vs donut is just `donut=` — don't switch style to "go solid"
- Color scheme: `scheme=dark\|light`. Some styles' contrast varies in dark mode
- Spaces in titles must be URL-encoded: use `%20`