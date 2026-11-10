---
name: docs/5-architecture/01-archmap
description: 'x-cmd/draw architecture diagram (/draw/archmap). Grid-placed nodes, engine-routed edges, boundary groups. Params: n (id;type;label[;sub][;pos]), e (from;to[;label][;variant]), b (label;id id), t (base/mono/soft), grid, title, w/h.'
type: reference
---

# Core Content

core_features:

  - `/draw/archmap` — you place the cells, the engine routes the edges
  - `n=` node: `id;type;label[;sublabel][;position]`, one per node
  - node types: `fe` `be` `db` `cloud` `ext` `sec` `bus` `svc`
  - position: a grid cell `r0c1` (optionally `r0c1w2`) or pixels `p40,80`
  - `e=` edge: `from;to[;label][;variant]` (variant `main` / `dash`)
  - `b=` boundary: `label;id id …` boxes the named nodes together
  - `t=` style: `base` / `mono` / `soft`; `grid=` forces 1–12 columns

# Key Information

highlights:

  - `/draw/archmap` — you place the cells, the engine routes the edges
  - `n=` node: `id;type;label[;sublabel][;position]`, one per node
  - node types: `fe` `be` `db` `cloud` `ext` `sec` `bus` `svc`
  - position: a grid cell `r0c1` (optionally `r0c1w2`) or pixels `p40,80`
  - `e=` edge: `from;to[;label][;variant]` (variant `main` / `dash`)
  - `b=` boundary: `label;id id …` boxes the named nodes together
  - `t=` style: `base` / `mono` / `soft`; `grid=` forces 1–12 columns

# Use Cases

use_cases:

  - System and service topology, written by hand or by an AI agent
  - Three-tier web app (browser → CDN → gateway → services → data layer)
  - Kubernetes namespaces and other boundary groups
  - Release and deployment overviews

# Related Resources

official:
  endpoint: https://x-cmd.com/draw/archmap
  repo: https://github.com/x-cmd/draw
related:
  overview: docs/1-overview/01-what-is-draw/cn.md
  showcases: docs/9-showcases/01-github/cn.md
