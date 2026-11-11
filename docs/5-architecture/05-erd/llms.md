---
name: docs/5-architecture/05-erd
description: 'x-cmd/draw ERD (/draw/erd). One node per table, field list inside the node (lines separated by %0A), relationships on the edges. Params: n (table), e (relationship), b (group), title, w/h.'
type: reference
---

# Core Content

core_features:

  - `/draw/erd` — one node per table
  - `n=` table: `id;type;name;fields;pos`
  - Field list lines separated by `%0A`
  - `e=` relationship: `from;to[;cardinality]`
  - Keys are written by hand — `(pk)`, `(fk)`

# Key Information

highlights:

  - `/draw/erd` — one node per table
  - `n=` table: `id;type;name;fields;pos`
  - Field list lines separated by `%0A`
  - `e=` relationship: `from;to[;cardinality]`
  - Keys are written by hand — `(pk)`, `(fk)`

# Use Cases

use_cases:

  - Schema docs in a README
  - Reviewing a data model change
  - Onboarding: how the tables fit
  - Migration planning

# Related Resources

official:
  endpoint: https://x-cmd.com/draw/erd
  repo: https://github.com/x-cmd/draw
related:
  overview: docs/1-overview/01-what-is-draw/cn.md
  chart_types: docs/2-data-charts/01-pie/cn.md
