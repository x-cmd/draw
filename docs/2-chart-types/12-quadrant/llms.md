---
name: 12-quadrant
description: 'x-cmd/draw quadrant chart (type=quadrant). A 2×2 decision matrix: Eisenhower, BCG, the Atlassian 4Ls retro. Params: quadrants (four cell names, top-left/top-right/bottom-left/bottom-right), quaddescs (four notes), xlabel/ylabel (axis titles), xlow/xhigh/ylow/yhigh (axis ends), items (points name@x,y, 0..1).'
type: reference
---

# Core Content

core_features:

  - `type=quadrant` — 2×2 quadrant / decision matrix
  - `quadrants=` four cell names (required) — **top-left, top-right, bottom-left, bottom-right**
  - `quaddescs=` four cell notes (same order)
  - `xlabel=` / `ylabel=` axis titles
  - `xlow=` / `xhigh=` / `ylow=` / `yhigh=` axis end labels (default 低 / 高)
  - `items=` points: `name@x,y`, semicolon separated, coordinates 0..1

# Key Information

highlights:

  - **Cell order is fixed** — top-left, top-right, bottom-left, bottom-right (reading order)
  - **Exactly four cells** — fewer or more is a 400, never a silent truncation
  - **Point coordinates are 0..1** — 0 = low end of the axis, 1 = high end; out-of-range values are clamped
  - **Axis ends default to 低/高** — set them for a non-Chinese audience
  - Matrix is drawn square (2×2 cells), the chart canvas may be wider

# Use Cases

use_cases:

  - Eisenhower matrix (urgent / important)
  - BCG matrix (growth / share)
  - Atlassian 4Ls retrospective (liked / learned / lacked / longed for)
  - Prioritisation frames (impact / effort)
  - Portfolio and option reviews

# Related Resources

official:
  endpoint: https://x-cmd.com/draw?type=quadrant
related:
  overview: docs/2-overview/cn.md
