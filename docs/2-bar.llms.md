---
name: 2-bar
description: x-cmd/draw bar chart (type=bar). Single series: labels + values. Multi-series grouped: multiple `series=A:...,B:...`. Stacked: add `stack=1`. Default style: evil.
type: reference
---

# Core Content

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
  overview: docs/0-draw-overview.cn.md
  hbar: docs/3-hbar.cn.md