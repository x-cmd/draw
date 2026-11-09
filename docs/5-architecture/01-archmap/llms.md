---
name: docs/5-architecture/01-archmap
description: 'x-cmd/draw architecture diagram (/draw/archmap). Grid-placed nodes with auto-routed edges and boundary groups. Params: n (id;type;label[;sub][;pos]), e (from;to[;label][;variant]), b (label;id id), t (base/mono/soft), grid, title, w/h.'
type: reference
---

# Core Content

core_features:

  - `/draw/archmap` — grid-placed nodes, engine-routed edges
  - `n=` node: `id;type;label[;sublabel][;position]`, one per node
  - `e=` edge: `from;to[;label][;variant]` (variant `main` / `dash`)
  - `b=` boundary: `label;id id …` boxes the named nodes together
  - `t=` style: `base` / `mono` / `soft`

# Key Information

highlights:

  - `/draw/archmap` — grid-placed nodes, engine-routed edges
  - `n=` node: `id;type;label[;sublabel][;position]`, one per node
  - `e=` edge: `from;to[;label][;variant]` (variant `main` / `dash`)
  - `b=` boundary: `label;id id …` boxes the named nodes together
  - `t=` style: `base` / `mono` / `soft`

# Use Cases

use_cases:

  - System / service topology written by hand or by an AI agent
  - Three-tier web app (browser → CDN → gateway → services → data layer)
  - Kubernetes namespace grouping
  - Release and deployment overviews

# Related Resources

official:
  endpoint: https://x-cmd.com/draw/archmap
  repo: https://github.com/x-cmd/draw
related:
  overview: docs/1-overview/01-what-is-draw/cn.md
  showcases: docs/9-showcases/01-github/cn.md
