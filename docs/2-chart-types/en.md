---
x-title: Chart types — the complete reference
x-desc: All x-cmd/draw chart types in one long article: params tables, styles, curl examples and pitfalls for pie / bar / hbar / line / area / radar / gauge / scatter / combo / sankey / qr.
x-sidebar: draw chart types
x-keywords: pie chart, draw, svg, opendata, evil, market-mono, progress, revenue, donut, bar chart, grouped bar, stacked bar, hbar, horizontal bar, line chart, time series, area chart, radar chart, multi-dimension, gauge, gauge dial, single-value monitoring, scatter plot, correlation, combo chart, bar + line, sankey, sankey diagram, flow, conversion path, qr code, qr, wifi qr, vcard qr
x-json-ld:
  '@context': https://schema.org
  '@graph':
    - '@type': TechArticle
      headline: 'draw chart types'
      inLanguage: 'en'
      about: 'x-cmd/draw chart type reference'
---

# Chart types — the complete reference

One long article covering all 11 chart types; common params (`scheme`/`num`/`w`/`h`/`v`), the style system, and data formats live in their own docs.
## pie chart — 6 styles (opendata / evil / evil-mono / market-mono / progress / revenue)

---

### 1. Parameters

| param | meaning | required |
| --- | --- | --- |
| `labels=` | sector labels, comma-separated | ✓ |
| `values=` | sector values, comma-separated | ✓ |
| `title=` | chart title | ✗ |
| `unit=` | numeric unit (e.g., `B`, `responses`, `%`) | ✗ |
| `donut=` | `0` solid / `>0` ring width | ✗ |
| `t=` | style (see table below) | ✗ |

Common params (`scheme` / `num` / `w/h` / `v`) — see [0-draw-overview](../1-overview/en.md) §2.

---

### 2. The 6 styles (`t=`)

| style (`t=`) | visual | use case |
| --- | --- | --- |
| `opendata` (default) | labels outside, editorial title | general, browser market |
| `evil` | rounded sectors, white gap, inline values | revenue / market share |
| `evil-mono` | solid + leader lines outside, name gray / value ink | B&W print |
| `market-mono` | grayscale by share depth, center total, 2-col legend | business reports |
| `progress` | dotted progress ring, large center percentage | surveys / polls |
| `revenue` | diagonal gradient, dashed inner, right legend with values | revenue analysis |

#### Examples

```sh
## OpenData (default)
curl "https://x-cmd.com/draw?type=pie&t=opendata&title=Chrome%20holds&labels=Chrome,Safari,Firefox,Edge,Other&values=65,18,7,6,4"

## Evil
curl "https://x-cmd.com/draw?type=pie&t=evil&title=Browser%20market&labels=Chrome,Safari,Firefox,Edge,Other&values=275,200,187,173,90"

## Evil outside-labels
curl "https://x-cmd.com/draw?type=pie&t=evil-mono&title=Browser%20market&labels=Chrome,Safari,Firefox,Edge,Other&values=275,200,187,173,90"

## Market Mono (with unit)
curl "https://x-cmd.com/draw?type=pie&t=market-mono&unit=B&title=Market%20share&labels=Skyline,Datawell,Cloudpeak,Taskbridge,Streamforge&values=27,21,13,21,12"

## Progress (dotted ring)
curl "https://x-cmd.com/draw?type=pie&t=progress&unit=responses&title=Where%20the%20workday%20leaks&labels=Additional%20support%20requests,Inaccurate%20forecasts&values=48,67"

## Revenue (gradient)
curl "https://x-cmd.com/draw?type=pie&t=revenue&unit=orders&title=Revenue&labels=Direct,Marketplace,Wholesale,Affiliate&values=52400,38900,24150,16300"
```

---

### 3. Solid vs donut

`donut=0` forces solid pie (no ring center):

```sh
curl "https://x-cmd.com/draw?type=pie&donut=0&title=Share&labels=TS,Py,Go&values=48,23,9"
```

> **Same template, one parameter switches form** — that's x-cmd/draw's core design: style is parameter-driven, not template-switching.

---

### 4. Pitfalls

- **Label count ≤ 100**, > 9 auto-collapsed into "Other"
- Solid vs donut is just `donut=` — don't switch style to "go solid"
- Color scheme: `scheme=dark\|light`. Some styles' contrast varies in dark mode
- Spaces in titles must be URL-encoded: use `%20`

---

## bar chart — grouped / stacked / single series

---

### 1. Parameters

| param | meaning | required |
| --- | --- | --- |
| `labels=` | X-axis labels, comma-separated | ✓ |
| `values=` | single series values (Y-axis) | single series ✓ |
| `series=A:v1,v2,...&series=B:v1,v2,...` | multiple series (grouped or stacked) | grouped multi-series ✓ |
| `title=` | chart title | ✗ |
| `unit=` | numeric unit | ✗ |
| `t=` | style (default `evil`) | — |

---

### 2. Three modes

#### Single series

`values=` for one series:

```sh
curl "https://x-cmd.com/draw?type=bar&labels=Jan,Feb,Mar,Apr,May&values=100,150,120,180,200"
```

#### Grouped (multi-series side-by-side)

Multiple `series=A:...,B:...,C:...`:

```sh
curl "https://x-cmd.com/draw?type=bar&t=evil&labels=Jan,Feb,Mar,Apr,May,Jun,Jul,Aug,Sep,Oct,Nov,Dec&series=Desktop:34,87,51,63,45,78,39,92,65,53,80,27&series=Mobile:18,49,29,39,31,45,23,56,37,36,51,14"
```

#### Stacked (multi-series stacked)

Add `stack=1`:

```sh
curl "https://x-cmd.com/draw?type=bar&stack=1&labels=Jan,Feb,Mar&series=A:10,20,30&series=B:5,15,25"
```

---

### 3. Pitfalls

- **Grouped vs stacked**: grouped by default; add `stack=1` for stacked
- **X-axis labels**: ≤ 50 stays readable
- **Multi-series naming**: `series=A:...` — `A` is legend name (can be Chinese)
- **Zero values**: skipped (zero-height bar not drawn) — by design

---

## hbar — horizontal bar chart, friendly to long labels

Horizontal bar chart. **Ideal for long labels** (names, project names, long categories).

---

### Parameters

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

### Examples

```sh
## Single series
curl "https://x-cmd.com/draw?type=hbar&labels=Alice,Bob,Charlie,Diana,Edward&values=120,98,150,76,135&title=Score%20by%20person"

## Multi-series grouped
curl "https://x-cmd.com/draw?type=hbar&labels=Project%20Alpha,Project%20Beta,Project%20Gamma&series=Q1:80,60,90&series=Q2:95,75,110&series=Q3:110,85,120"

## Stacked
curl "https://x-cmd.com/draw?type=hbar&stack=1&labels=Region%20A,Region%20B,Region%20C&series=Desktop:300,250,400&series=Mobile:200,180,350&series=Tablet:50,30,80"
```

---

### When to use hbar vs bar

- **bar** (vertical): time series — X axis is time, "left-to-right" suggests time flow
- **hbar** (horizontal): category comparison — Y axis is categories with long text

Example: project names in Chinese → hbar; months → bar.

---

## line chart — the default for time series

---

### Parameters

| param | meaning | required |
| --- | --- | --- |
| `x=` | X-axis labels (time / category) | ✓ |
| `y=` | single series values | single series ✓ |
| `series=A:v1,v2,...&series=B:v1,v2,...` | multiple series | multi-series ✓ |
| `title=` / `unit=` | title / unit | ✗ |
| `t=` | style | — |

---

### Examples

```sh
## Single series
curl "https://x-cmd.com/draw?type=line&x=Jan,Feb,Mar,Apr,May,Jul&y=10,20,15,30,25,40&title=Monthly%20growth"

## Multi-series
curl "https://x-cmd.com/draw?type=line&x=Mon,Tue,Wed,Thu,Fri,Sat,Sun&series=Daytime:120,140,135,150,180,200,170&series=Nighttime:80,75,90,85,95,110,100"

## With unit
curl "https://x-cmd.com/draw?type=line&x=Q1,Q2,Q3,Q4&series=Revenue:52400,38900,24150,16300&series=Cost:31200,28700,19800,14500&unit=USD&title=Quarterly%20P&L"
```

---

### Pitfalls

- **Points vs X labels**: X labels ≥ data points, otherwise missing values; X labels < data points takes first N
- **Multi-series alignment**: all series must have the same length, otherwise drawn to shortest
- **Extremes**: Y axis auto-fits; use `ymin=` / `ymax=` to fix range

---

## area chart — line + fill, emphasizes accumulation

Line + fill below, **emphasizes accumulation / totals** (vs line's "instantaneous values").

Same params as `line`: x / y / series / title / unit.

---

### Examples

```sh
## Single series
curl "https://x-cmd.com/draw?type=area&x=Jan,Feb,Mar,Apr,May,Jun&y=10,30,25,50,40,70&title=Cumulative%20users"

## Multi-series stacked
curl "https://x-cmd.com/draw?type=area&x=2019,2020,2021,2022,2023,2024&series=Mobile:100,150,220,300,400,520&series=Desktop:200,180,160,140,120,90"
```

---

### area vs line

- **line**: emphasizes **value at each time point**
- **area**: emphasizes **accumulation** or **overall magnitude**

Stacked area is especially good for "share changes over time".

---

## radar chart — multi-dimension comparison

The default for multi-dimension comparison. **Typical use**: products / candidates / plans scored across multiple axes.

---

### Parameters

| param | meaning | required |
| --- | --- | --- |
| `labels=` | dimension names (axis labels) | ✓ |
| `values=` | single object scores per dimension | single object ✓ |
| `series=A:v1,v2,...&series=B:v1,v2,...` | multiple objects (overlay) | multi-object ✓ |
| `title=` | chart title | ✗ |

Value range usually 0-100 (or 0-10). **All dimensions must use the same value range** for fair comparison.

---

### Examples

```sh
## Single object
curl "https://x-cmd.com/draw?type=radar&labels=Speed,Quality,Price,Support,UX&values=85,90,70,80,95&title=Product%20A"

## Multi-object comparison
curl "https://x-cmd.com/draw?type=radar&labels=Speed,Quality,Price,Support,UX&series=A:85,90,70,80,95&series=B:75,85,90,70,80&series=C:90,80,60,85,75&title=Product%20comparison"
```

---

### Pitfalls

- **3-7 dimensions optimal**: < 3 hard to see shape; > 7 too dense
- **All dimensions same value range**: mixing 0-100 and 0-10 distorts the comparison
- **Multi-object legend = series name**: A/B/C are series IDs — change to meaningful names

---

## gauge dial — single-value monitoring

Single-value "progress dial". **Typical use**: CPU / memory / SLA / completion rate / current vs target.

---

### Parameters

| param | meaning | default |
| --- | --- | --- |
| `value=` | current value | ✓ |
| `max=` | max (full scale) | 100 |
| `label=` | gauge name | — |
| `t=` | style (default has color change) | — |
| `unit=` | unit | — |

---

### Examples

```sh
## CPU usage
curl "https://x-cmd.com/draw?type=gauge&value=72&max=100&label=CPU%25&title=Server%20load"

## Memory
curl "https://x-cmd.com/draw?type=gauge&value=4.2&max=8&label=Memory%20(GB)&title=Memory%20usage"

## Progress
curl "https://x-cmd.com/draw?type=gauge&value=340&max=500&label=Tickets%20resolved&title=Sprint%20progress"

## SLA
curl "https://x-cmd.com/draw?type=gauge&value=99.95&max=100&label=SLA%25&unit=%25"
```

---

### Pitfalls

- **One gauge per chart**: don't draw multiple; use [9-combo](#combo) or [4-line](#line) for multiple values
- **`max` not too small**: pointer pegged at max loses precision
- **Dark theme**: gauge color change is more visible in dark mode

---

## scatter plot — correlation analysis

Two-dimension correlation. **Typical use**: height vs weight / price vs sales / age vs income.

---

### Parameters

| param | meaning | required |
| --- | --- | --- |
| `points=x1,y1;x2,y2;...` | single group (semicolon between points, comma between coords) | single group ✓ |
| `series=A:x1,y1;x2,y2;...&series=B:...` | multiple groups | multi-group ✓ |
| `xlabel=` / `ylabel=` | axis labels | ✗ |
| `title=` | chart title | ✗ |

---

### Examples

```sh
## Single group
curl "https://x-cmd.com/draw?type=scatter&points=1.5,60;1.7,65;1.8,72;1.6,58;1.75,68&xlabel=Height%20(m)&ylabel=Weight%20(kg)&title=Sample%20population"

## Multi-group
curl "https://x-cmd.com/draw?type=scatter&series=A:1.5,60;1.7,65;1.8,72&series=B:1.8,75;1.9,80;1.85,78&xlabel=H&ylabel=W&title=A%20vs%20B%20population"
```

---

### Pitfalls

- **Data format**: `x1,y1;x2,y2;...` — semicolon between points, comma between coords. Easy to mix up
- **≤ 200 points** stays readable
- **No trend line / fit**: only draws points; not supported currently
- **Multi-group**: each group should have ≥ 5 points

---

## combo chart — bar + line overlay

Bar + line overlay. **Typical use**: bar = absolute value (sales), line = rate (conversion).

---

### Parameters

| param | meaning | required |
| --- | --- | --- |
| `labels=` | X axis | ✓ |
| `series=A:v1,v2,...&kind=bar` | bar series | ✓ |
| `series=B:v1,v2,...&kind=line` | line series (can be multiple) | ✓ |
| `title=` | chart title | ✗ |
| `unit=` | unit | ✗ |

`kind` distinguishes bar / line: `bar` / `line`. Each series can independently specify kind.

---

### Examples

```sh
## Bar (sales) + line (conversion rate)
curl "https://x-cmd.com/draw?type=combo&labels=Jan,Feb,Mar,Apr,May&series=Sales:100,150,120,180,200&kind=bar&series=Conversion%20rate:3.2,4.1,3.8,4.5,5.2&kind=line"

## Multi-bar + multi-line
curl "https://x-cmd.com/draw?type=combo&labels=Q1,Q2,Q3,Q4&series=Revenue:52400,38900,24150,16300&kind=bar&series=Cost:31200,28700,19800,14500&kind=bar&series=Margin:39,26,18,11&kind=line&unit=%25"
```

---

### Pitfalls

- **bar / line dual Y axis**: auto-adapts, but watch for unit-mismatch (e.g., percentage vs USD)
- **Multi-series**: each needs `kind` — missing falls back to bar
- **Not all styles support combo**: `t=` compatibility matches single-bar

---

## sankey diagram — flow / conversion path

**Typical use**: flow from source → middle steps → endpoint (e.g., users from search → landing → signup → paid).

---

### Parameters

| param | meaning | required |
| --- | --- | --- |
| `nodes=` | node list, comma-separated | ✓ |
| `links=source,target,value;...` | connections: source → target → value; semicolon between | ✓ |
| `title=` | chart title | ✗ |

---

### Examples

```sh
## User conversion funnel
curl "https://x-cmd.com/draw?type=sankey&nodes=Visitor,Signup,Active,Paid,Churn&links=Visitor,Signup,1000;Signup,Active,600;Active,Paid,200;Active,Churn,300&title=User%20conversion"

## Energy flow (multi-source → multi-sink)
curl "https://x-cmd.com/draw?type=sankey&nodes=Solar,Wind,Nuclear,Grid,Home,Industry&links=Solar,Grid,500;Wind,Grid,800;Nuclear,Grid,300;Grid,Home,400;Grid,Industry,1200&title=Energy%20flow"
```

---

### Pitfalls

- **Node name reference**: `source`/`target` in links must **exactly match** strings in `nodes`
- **≤ 20 nodes**: chart gets crowded; consider grouping beyond
- **Zero-value links not drawn**: useful for hiding less-important paths
- **JSON format better for big data**: many nodes / complex connections → use `?d=` JSON

---

## QR code — URL / WiFi / contact card

Generate QR codes for any content (URL, text, WiFi config, vCard). Returned SVG is print/embed-ready.

---

### Parameters

| param | meaning | default |
| --- | --- | --- |
| `data=` | content (required) | — |
| `size=` | QR module pixel size | — |
| `ec=` | error correction L/M/Q/H | M |

Error correction = how much of QR can be damaged and still read: L ~7% / M ~15% / Q ~25% / H ~30%.

---

### Examples

```sh
## URL
curl "https://x-cmd.com/draw?type=qr&data=https://x-cmd.com/draw"

## WiFi (phone scans → connects)
curl "https://x-cmd.com/draw?type=qr&data=WIFI:S:MyWiFi;T:WPA;P:password123;;"

## vCard
curl "https://x-cmd.com/draw?type=qr&data=BEGIN:VCARD%0AVERSION:3.0%0AFN:Alice%0AORG:x-cmd%0AEMAIL:alice@example.com%0AEND:VCARD"

## Plain text
curl "https://x-cmd.com/draw?type=qr&data=Hello%20from%20x-cmd"

## High error correction (logo in middle still scannable)
curl "https://x-cmd.com/draw?type=qr&data=https://x-cmd.com&ec=H&size=10"
```

---

### Content formats

#### URL
Direct: `data=https://...`

#### WiFi
```
WIFI:S:<SSID>;T:<WPA|WEP|>;H:<true|false|>;P:<password>;;
```

#### vCard
Full vCard format (URL-encode newlines as `\n%0A`).

---

### Pitfalls

- **Content length**: QR max ~2953 bytes (version 40 + low EC); URL-encoded Chinese counts 3 bytes/char
- **`data=` must be URL-encoded**: especially `:` `;` `#` `%`
- **Dark theme QR**: default is dark on light; `invert=1` flips (good for dark backgrounds)
- **Embedded logo**: QR engine treats the SVG center as "logo area" automatically; EC level H
