---
name: docs/5-architecture/02-mindmap
description: 'x-cmd/draw mind map (/draw/mindmap). The tree is written as slash-separated paths; the engine infers the parents. Params: n (root/branch/leaf), style (organic/tree/radial/bubble), t, title, w/h.'
type: reference
---

# Core Content

core_features:

  - `/draw/mindmap` — the tree from slash-separated paths
  - `n=` one path per leaf: `root/branch/leaf`
  - Parents are inferred — paths sharing a prefix share a parent
  - `style=` shape: `organic` / `tree` / `radial` / `bubble`
  - `t=` skin (colour family) — the colour, not the layout

# Key Information

highlights:

  - `/draw/mindmap` — the tree from slash-separated paths
  - `n=` one path per leaf: `root/branch/leaf`
  - Parents are inferred — paths sharing a prefix share a parent
  - `style=` shape: `organic` / `tree` / `radial` / `bubble`
  - `t=` skin (colour family) — the colour, not the layout

# Use Cases

use_cases:

  - Feature and product maps
  - Launch checklists grouped by team
  - Technology landscapes and taxonomies
  - Reading-group notes and course outlines

# Related Resources

official:
  endpoint: https://x-cmd.com/draw/mindmap
  repo: https://github.com/x-cmd/draw
related:
  overview: docs/1-overview/01-what-is-draw/cn.md
  showcases: docs/9-showcases/01-github/cn.md
