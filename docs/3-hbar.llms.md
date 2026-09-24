---
name: 3-hbar
description: x-cmd/draw horizontal bar (type=hbar). Same params as bar but bars go horizontal. Best for long labels (names, project names). Use when label text is long or when comparing categories rather than time.
type: reference
---

# Core Content

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
  overview: docs/0-draw-overview.cn.md
  bar: docs/2-bar.cn.md