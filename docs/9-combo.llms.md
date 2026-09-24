---
name: 9-combo
description: x-cmd/draw combo chart (type=combo). Bar + line overlay. Bar = absolute (sales), line = rate (conversion). Params: labels + series=A:...&kind=bar + series=B:...&kind=line. kind distinguishes bar from line.
type: reference
---

# Core Content

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
  overview: docs/0-draw-overview.cn.md
  bar: docs/2-bar.cn.md
  line: docs/4-line.cn.md