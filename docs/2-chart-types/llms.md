---
name: chart-types
description: All x-cmd/draw chart types in one reference — pie, bar, hbar, line, area, radar, gauge, scatter, combo, sankey, qr: params, styles, examples, pitfalls.
type: reference
---

# Core Content

all_chart_types:

  - pie: x-cmd/draw pie chart (type=pie). 6 styles via t=: opendata (default, labels outside + editorial title), evil (rounded sectors + inline values), evil-mono (leader lines outside), market-mono (grayscale + center total), progress (dotted ring + large center percentage), revenue (gradient + dashed inner). donut=0 forces solid (no ring center).
  - bar: x-cmd/draw bar chart (type=bar). Single series: labels + values. Multi-series grouped: multiple `series=A:...,B:...`. Stacked: add `stack=1`. Default style: evil.
  - hbar: x-cmd/draw horizontal bar (type=hbar). Same params as bar but bars go horizontal. Best for long labels (names, project names). Use when label text is long or when comparing categories rather than time.
  - line: x-cmd/draw line chart (type=line). The default for time series. Params: x (time labels) + y (single) or series=A:...,B:... (multi). All series must have same length. Y axis auto-fits; use ymin/ymax to fix range.
  - area: x-cmd/draw area chart (type=area). Same params as line but with filled area below the line. Emphasizes accumulation / magnitude (vs line's instantaneous values). Stacked area for share changes over time.
  - radar: x-cmd/draw radar chart (type=radar). Multi-dimension comparison: products / candidates / plans scored across multiple axes. Params: labels (dimensions) + values (scores) or series (multiple objects). Value range usually 0-100. All dimensions must use the same range for fair comparison.
  - gauge: x-cmd/draw gauge dial (type=gauge). Single-value monitoring: CPU / memory / SLA / progress. Params: value (current), max (full scale, default 100), label, unit, t (style).
  - scatter: x-cmd/draw scatter plot (type=scatter). Two-dimension correlation: height vs weight / price vs sales / age vs income. Params: points=x1,y1;x2,y2;... (single group) or series=A:...;B:... (multi-group). Format: semicolon between points, comma between coords.
  - combo: x-cmd/draw combo chart (type=combo). Bar + line overlay. Bar = absolute (sales), line = rate (conversion). Params: labels + series=A:...&kind=bar + series=B:...&kind=line. kind distinguishes bar from line.
  - sankey: x-cmd/draw sankey diagram (type=sankey). Flow / conversion path visualization: source → middle → endpoint. Params: nodes + links (source,target,value). Node names must exactly match in nodes/ and links/.
  - qr: x-cmd/draw QR code (type=qr). Generate QR for URL / WiFi / vCard / any text. Params: data (content), size (module pixel size), ec (error correction L/M/Q/H, default M). Returned SVG is print/embed-ready.
## pie (type=pie)

core_features:

  - `type=pie` chart with `labels=` + `values=` required
  - 6 styles via `t=` param: opendata (default) / evil / evil-mono / market-mono / progress / revenue
  - `donut=0` forces solid pie (no ring center); default is donut
  - `unit=` for numeric unit display (e.g., `B`, `responses`, `%`)
  - Label count ≤ 100; > 9 auto-collapsed into "Other"
  - Common params (`scheme`, `num`, `w/h`, `v`) inherited from overview

# Key Information

highlights:

  - **Same template, one parameter switches form** — donut=0 toggles solid/donut without changing style
  - **opendata** is the default; labels outside the ring + editorial-style title
  - **evil** — rounded sectors, white gaps, values printed inside the ring
  - **evil-mono** — solid pie + leader lines, name gray / value ink (B&W print friendly)
  - **market-mono** — grayscale by share depth, center total, 2-col legend
  - **progress** — dotted progress ring, large center percentage
  - **revenue** — diagonal gradient, dashed inner ring, right legend with values

# Use Cases

use_cases:

  - Browser / OS market share visualization (opendata)
  - Revenue breakdown by channel (revenue, market-mono)
  - Survey response share (progress)
  - Quick data source distribution in docs / README
  - B&W print-friendly charts (evil-mono, market-mono)

# Related Resources

official:
  endpoint: https://x-cmd.com/draw?type=pie
  repo: https://github.com/x-cmd/draw
related:
  overview: docs/1-overview/cn.md
  styles: docs/3-styles-themes/cn.md
  formats: docs/4-data-formats/cn.md

## bar (type=bar)

core_features:

  - `type=bar` with `labels=` + either `values=` (single) or `series=A:...,B:...` (multi)
  - Multi-series default: grouped (side-by-side). Add `stack=1` for stacked
  - Default style: `evil` (rounded, contrasting, white gaps)
  - X-axis labels ≤ 50 stays readable
  - Zero values skipped (zero-height bars not drawn) — by design

# Key Information

highlights:

  - **`stack=1`** toggles grouped vs stacked without changing style
  - **`series=A:...,B:...`** — `A` / `B` are legend labels (can be Chinese)
  - X labels can be any text (months, project names, etc.)
  - Y axis auto-scales

# Use Cases

use_cases:

  - Monthly / quarterly / yearly metric with single series
  - Multi-series comparison (Desktop vs Mobile, Product A vs B)
  - Stacked totals (revenue = product + service + ads)

# Related Resources

official:
  endpoint: https://x-cmd.com/draw?type=bar
related:
  overview: docs/1-overview/cn.md
  hbar: docs/2-chart-types/cn.md#hbar

## hbar (type=hbar)

core_features:

  - `type=hbar` — horizontal bars, Y axis has labels (categories)
  - Same params as bar: `labels=` + `values=` or `series=A:...,B:...`
  - Best for: long labels (Chinese names, project names), category comparisons
  - `stack=1` for stacked horizontal bars

# Key Information

highlights:

  - **hbar > bar when labels are long** — vertical text is hard to read
  - Categories on Y axis (no time-flow implication)
  - Use bar for time series (left → right = time flow)
  - Use hbar for category comparison

# Use Cases

use_cases:

  - Personnel scoreboard with long names
  - Project comparison with full project names
  - Region/category breakdown

# Related Resources

official:
  endpoint: https://x-cmd.com/draw?type=hbar
related:
  overview: docs/1-overview/cn.md
  bar: docs/2-chart-types/cn.md#bar

## line (type=line)

core_features:

  - `type=line` — line chart, primary use is time series
  - `x=` for X axis labels (time / category), `y=` for single series
  - Multi-series: `series=A:v1,v2,...&series=B:v1,v2,...`
  - All series must have same length, otherwise truncated to shortest
  - Y axis auto-fits; `ymin=` / `ymax=` for fixed range

# Key Information

highlights:

  - **`x=` length matters**: ≥ data points (else missing values), < takes first N
  - Multi-series alignment required
  - Default style `evil` (bold line)
  - Stacked area for "share changes over time" — use type=area instead

# Use Cases

use_cases:

  - Time series trends (sales, traffic, users)
  - Multi-series comparison over time (Desktop vs Mobile, multiple SKUs)
  - Quarterly P&L with bar (revenue/cost) + line (margin)

# Related Resources

official:
  endpoint: https://x-cmd.com/draw?type=line
related:
  overview: docs/1-overview/cn.md
  area: docs/2-chart-types/cn.md#area

## area (type=area)

core_features:

  - `type=area` — line + fill below
  - Same params as `type=line`: x / y / series / title / unit
  - Stacked area for multi-series

# Key Information

highlights:

  - **area emphasizes accumulation**; line emphasizes instantaneous values
  - Stacked area = "share changes over time" visualization
  - For single series, area vs line is mostly aesthetic

# Use Cases

use_cases:

  - Cumulative metrics over time (cumulative users, cumulative downloads)
  - Share changes over time (mobile vs desktop trend)
  - Showing magnitude emphasis (vs line's value emphasis)

# Related Resources

official:
  endpoint: https://x-cmd.com/draw?type=area
related:
  overview: docs/1-overview/cn.md
  line: docs/2-chart-types/cn.md#line

## radar (type=radar)

core_features:

  - `type=radar` — radar / spider chart
  - `labels=` dimension names, `values=` scores (single object)
  - Multi-object overlay: `series=A:v1,v2,...&series=B:v1,v2,...`
  - 3-7 dimensions optimal
  - All dimensions same value range

# Key Information

highlights:

  - **Optimal 3-7 dimensions**: < 3 hard to see shape; > 7 too dense
  - **Same value range across all dimensions** — mixing 0-100 and 0-10 distorts
  - Multi-object overlay compares side-by-side
  - Series name = legend label (can be Chinese)

# Use Cases

use_cases:

  - Product comparison across multiple dimensions
  - Candidate evaluation
  - Skill assessment
  - Multi-criteria decision making

# Related Resources

official:
  endpoint: https://x-cmd.com/draw?type=radar
related:
  overview: docs/1-overview/cn.md

## gauge (type=gauge)

core_features:

  - `type=gauge` — single-value dial / progress meter
  - `value=` current value (required)
  - `max=` max (full scale), default 100
  - `label=` gauge name, `unit=` numeric unit
  - Default style includes color change based on value

# Key Information

highlights:

  - **One gauge per chart** — use [9-combo](9-combo) or [4-line](4-line) for multiple values
  - **`max` not too small** — pointer pegs at max loses precision
  - Works well in dark mode (color contrast more visible)

# Use Cases

use_cases:

  - CPU / memory / disk usage monitoring dashboards
  - SLA reporting (99.95%)
  - Sprint progress (340/500 tickets resolved)
  - Single-metric status indicators

# Related Resources

official:
  endpoint: https://x-cmd.com/draw?type=gauge
related:
  overview: docs/1-overview/cn.md

## scatter (type=scatter)

core_features:

  - `type=scatter` — scatter plot for correlation
  - `points=x1,y1;x2,y2;...` — single group; semicolon between points, comma between coords
  - `series=A:...;...&series=B:...;...` — multiple groups
  - `xlabel=` / `ylabel=` axis labels

# Key Information

highlights:

  - **Data format tricky**: `x1,y1;x2,y2;...` — semicolon between points, comma between coords
  - ≤ 200 points readable
  - No trend line / fit yet — points only
  - Multi-group: each group ≥ 5 points for meaningful pattern

# Use Cases

use_cases:

  - Height vs weight scatter (population data)
  - Price vs sales scatter (product portfolio)
  - Age vs income distribution
  - A/B test metric distribution

# Related Resources

official:
  endpoint: https://x-cmd.com/draw?type=scatter
related:
  overview: docs/1-overview/cn.md

## combo (type=combo)

core_features:

  - `type=combo` — bar + line overlay (dual Y axis)
  - `series=A:v1,v2,...&kind=bar` — bar series
  - `series=B:v1,v2,...&kind=line` — line series (can be multiple)
  - Each series can independently specify `kind`
  - Multiple bar series + multiple line series supported

# Key Information

highlights:

  - **kind** distinguishes bar from line — missing kind falls back to bar
  - **Dual Y axis** auto-adapts — watch unit-mismatch (e.g., percentage vs USD)
  - Not all `t=` styles support combo — compatibility matches single-bar
  - Typical: bar for absolute, line for rate / trend

# Use Cases

use_cases:

  - Sales (bar) + conversion rate (line)
  - Revenue (bar) + margin % (line)
  - Production (bar) + defect rate (line)
  - Any absolute + rate pair

# Related Resources

official:
  endpoint: https://x-cmd.com/draw?type=combo
related:
  overview: docs/1-overview/cn.md
  bar: docs/2-chart-types/cn.md#bar
  line: docs/2-chart-types/cn.md#line

## sankey (type=sankey)

core_features:

  - `type=sankey` — sankey diagram for flow / conversion paths
  - `nodes=` node list, comma-separated
  - `links=source,target,value;...` — connections; semicolon between
  - Node names in `links` must **exactly match** strings in `nodes`

# Key Information

highlights:

  - **Node name matching** is strict — typos cause empty diagram
  - ≤ 20 nodes stays readable; > 20 consider grouping
  - Zero-value links not drawn (useful for hiding paths)
  - Complex sankey benefits from JSON format

# Use Cases

use_cases:

  - User conversion funnel (visitor → signup → active → paid)
  - Energy flow (sources → grid → consumers)
  - Budget allocation (sources → departments → projects)
  - Multi-stage process flows

# Related Resources

official:
  endpoint: https://x-cmd.com/draw?type=sankey
related:
  overview: docs/1-overview/cn.md
  formats: docs/4-data-formats/cn.md

## qr (type=qr)

core_features:

  - `type=qr` — QR code generator
  - `data=` content (required) — URL, text, WiFi config, vCard, anything
  - `size=` module pixel size (optional)
  - `ec=` error correction L/M/Q/H, default M
  - Returned SVG is print/embed-ready

# Key Information

highlights:

  - **Error correction**: L ~7% / M ~15% / Q ~25% / H ~30% tolerance
  - **Content formats**:
    - URL: `data=https://...`
    - WiFi: `data=WIFI:S:<SSID>;T:<WPA>;P:<password>;;`
    - vCard: full vCard with URL-encoded newlines (`%0A`)
  - **Data must be URL-encoded** — especially `:` `;` `#` `%`
  - **Max content**: ~2953 bytes (version 40 + low EC)
  - **`invert=1`** flips colors (good for dark backgrounds)
  - **Embedded logo**: QR engine treats center as logo area; use EC=H

# Use Cases

use_cases:

  - URL QR codes for print/poster
  - WiFi QR (scan to connect)
  - vCard QR (business card)
  - Plain text QR (notes, references)
  - QR with logo overlay (use EC=H)

# Related Resources

official:
  endpoint: https://x-cmd.com/draw?type=qr
related:
  overview: docs/1-overview/cn.md
