---
name: 13-line
description: x-cmd/draw line chart (type=line). The default for time series. Params: x (time labels) + y (single) or series=A:...,B:... (multi). All series must have same length. Y axis auto-fits; use ymin/ymax to fix range.
type: reference
---

# Core Content

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
  overview: docs/2-overview/cn.md
  area: docs/14-area/cn.md