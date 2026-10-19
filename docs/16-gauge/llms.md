---
name: 16-gauge
description: x-cmd/draw gauge dial (type=gauge). Single-value monitoring: CPU / memory / SLA / progress. Params: value (current), max (full scale, default 100), label, unit, t (style).
type: reference
---

# Core Content

core_features:

  - `type=gauge` — single-value dial / progress meter
  - `value=` current value (required)
  - `max=` max (full scale), default 100
  - `label=` gauge name, `unit=` numeric unit
  - Default style includes color change based on value

# Key Information

highlights:

  - **One gauge per chart** — use [18-combo](18-combo) or [13-line](13-line) for multiple values
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
  overview: docs/2-overview/cn.md