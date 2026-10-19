---
name: 1-pie
description: x-cmd/draw pie chart (type=pie). 6 styles via t=: opendata (default, labels outside + editorial title), evil (rounded sectors + inline values), evil-mono (leader lines outside), market-mono (grayscale + center total), progress (dotted ring + large center percentage), revenue (gradient + dashed inner). donut=0 forces solid (no ring center).
type: reference
---

# Core Content

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
  styles: docs/13-styles-themes/cn.md
  formats: docs/14-data-formats/cn.md