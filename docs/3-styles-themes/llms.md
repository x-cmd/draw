---
name: 12-styles-themes
description: x-cmd/draw styles (`t=`) cross-chart index. Per-chart style support varies: pie has opendata/evil/evil-mono/market-mono/progress/revenue; bar/line/area default to evil. `scheme=dark|light` controls theme for all charts. Same `t=` produces visually different output per chart.
type: reference
---

# Core Content

core_features:

  - `t=` selects style; **same style name renders differently per chart**
  - Common styles: `opendata` (pie default, labels outside + editorial), `evil` (most charts default, modern + rounded), `evil-mono` (B&W), `market-mono` (grayscale business), `progress` (pie-only, dotted ring), `revenue` (pie-only, gradient)
  - `scheme=dark|light` controls theme; all charts support it
  - Style is parameter-driven, not template-switching — same chart, multiple styles
  - Per-chart `t=` list is in each chart's dedicated article

# Key Information

highlights:

  - **`evil` is default** for bar / hbar / line / area / radar / scatter / combo / sankey
  - **`opendata` is default** for pie (labels outside, editorial title)
  - **`progress`** is pie-only (dotted ring + large center percentage)
  - **`revenue`** is pie-only (diagonal gradient)
  - **`scheme=dark`** auto-adjusts: background darkens, text inverts, evil/revenue colors re-saturate

# Use Cases

use_cases:

  - Picking the right style for your chart type
  - Switching between light / dark theme
  - Building a consistent visual style across multiple charts in a doc
  - Avoiding the trap of switching `t=` expecting different chart type

# Related Resources

official:
  endpoint: https://x-cmd.com/draw
related:
  overview: docs/1-overview/cn.md
  pie: docs/2-chart-types/cn.md#pie
  bar: docs/2-chart-types/cn.md#bar
  formats: docs/4-data-formats/cn.md