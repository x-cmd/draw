---
name: 13-data-formats
description: x-cmd/draw data formats comparison. Flat params (URL always readable, simple) vs `?d=` JSON (cleaner for big/nested data). Both formats produce identical SVG output. JSON schema varies per chart type. Pick by situation: ≤ 5 items → flat; > 5 or nested → JSON.
type: reference
---

# Core Content

core_features:

  - Two equivalent formats: flat params (URL readable) vs `?d=` JSON
  - Output SVG is **identical** regardless of format
  - Flat params: `?labels=A,B,C&values=10,20,30` (URL always human-readable)
  - JSON: `?d={"data":[{"label":"A","value":10},...]}` (cleaner for big/nested data)
  - Per-chart JSON schema varies: pie/hbar/gauge use `{data:[{label,value}]}`, bar/line/area use `{labels,series}`, sankey uses `{nodes,links}`, scatter uses `{data:[{x,y}]}`
  - JSON must be URL-encoded (`%7B` for `{`, etc.) when used in URL
  - Flat params cache-friendly (stable cache key); JSON varies cache key

# Key Information

highlights:

  - **Pick by situation**: ≤ 5 items → flat; > 5 or nested → JSON
  - Flat params: comma-separated, semicolons not used (except scatter points)
  - JSON: must be URL-encoded — `&d={"data":[...]}` won't work; use `&d=%7B...%7D`
  - Don't mix the two formats in one project — confusing for URL reviewers
  - Service worker caches work better with flat params (stable keys)

# Use Cases

use_cases:

  - Choosing between flat params and JSON for a given use case
  - URL-encoding JSON properly for query string
  - Writing JSON schemas for each chart type
  - Building cache-friendly URLs

# Related Resources

official:
  endpoint: https://x-cmd.com/draw
related:
  overview: docs/1-overview/cn.md
  pie: docs/2-chart-types/cn.md#pie
  styles: docs/3-styles-themes/cn.md