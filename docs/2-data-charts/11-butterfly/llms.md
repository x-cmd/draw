---
name: docs/2-data-charts/11-butterfly
description: 'x-cmd/draw butterfly chart (/draw?type=butterfly). Two bar series mirrored around a shared centre axis; each side may stack segments; either side may carry a line on its own scale; dir=tb stands the chart up. Params: labels, left, right, line, lineside, dir, title, unit, w/h, scheme, d (JSON).'
type: reference
---

# Core Content

core_features:

  - `/draw?type=butterfly` — two bar series back to back around one centre axis
  - Also called a tornado chart (ranked categories) or a population pyramid (age × sex)
  - `labels=` the categories (rows in `lr`, columns in `tb`)
  - `left=` / `right=` one side each: `Name:v,v,v`; `name:v,v;name:v,v` stacks segments
  - `line=` a line on its own scale; `lineside=` which half it sits in (default right)
  - `dir=tb` — bars grow up and down instead of left and right
  - `d=` the JSON form: `{labels, left, right, line, dir}`
  - The bars on both sides share one scale; a line always has its own
  - The explore page edits it as a table: one row per category, one column per segment

# Key Information

highlights:

  - **Both sides share the bar scale** — that is what makes the lengths comparable
  - **The unit belongs in the legend**, not on the axis: `left=peak memory (GB):…`
  - A `+` in a URL is a space; a name starting with a plus must be written `%2B`
  - Naming the two sides well (`Opened` / `Closed`) matters more than the colours

# Use Cases

use_cases:

  - Two comparable measures per category (memory vs disk, plan vs actual, opened vs closed)
  - Stacked comparison (code vs comments + blanks)
  - Age × sex population pyramids and other standing-up comparisons
  - Bars against a line of a different unit (memory vs report time)

# Related Resources

official:
  endpoint: https://x-cmd.com/draw
related:
  overview: docs/1-overview/01-what-is-draw/cn.md
  data_formats: docs/1-overview/04-data-and-api/cn.md
  tokei: docs/2-data-charts/10-tokei/cn.md
