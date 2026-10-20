---
name: 14-area
description: x-cmd/draw area chart (type=area). Same params as line but with filled area below the line. Emphasizes accumulation / magnitude (vs line's instantaneous values). Stacked area for share changes over time.
type: reference
---

# Core Content

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
  overview: docs/2-overview/zh.md
  line: docs/13-line/zh.md