---
name: docs/3-relations/02-dataflow
description: 'x-cmd/draw data flow diagram (/draw/dataflow). Processes, stores, sources and sinks; edges carry the data name. Params: n (node), e (flow), b (group), title, w/h.'
type: reference
---

# Core Content

core_features:

  - `/draw/dataflow` — processes, stores, sources and sinks
  - `n=` node: `id;type;label[;sub][;pos]`
  - `e=` flow: `from;to[;label]` — the label is the data
  - Stores are cylinders, sources and sinks are rounds
  - The legend counts each kind

# Key Information

highlights:

  - `/draw/dataflow` — processes, stores, sources and sinks
  - `n=` node: `id;type;label[;sub][;pos]`
  - `e=` flow: `from;to[;label]` — the label is the data
  - Stores are cylinders, sources and sinks are rounds
  - The legend counts each kind

# Use Cases

use_cases:

  - ETL and data pipelines
  - Where a request's data comes from and goes
  - Analytics and reporting flows
  - Privacy reviews: what touches what

# Related Resources

official:
  endpoint: https://x-cmd.com/draw/dataflow
  repo: https://github.com/x-cmd/draw
related:
  overview: docs/1-overview/01-what-is-draw/cn.md
  chart_types: docs/2-data-charts/01-pie/cn.md
