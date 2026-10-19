---
name: 17-scatter
description: x-cmd/draw scatter plot (type=scatter). Two-dimension correlation: height vs weight / price vs sales / age vs income. Params: points=x1,y1;x2,y2;... (single group) or series=A:...;B:... (multi-group). Format: semicolon between points, comma between coords.
type: reference
---

# Core Content

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
  overview: docs/2-overview/cn.md