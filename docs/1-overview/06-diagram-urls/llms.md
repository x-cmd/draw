---
name: docs/1-overview/06-diagram-urls
description: 'How to write draw diagram URLs — one grammar for eight kinds. `n=` node (`id;type;label[;sub][;pos]`), `e=` edge (`from;to[;label][;variant]`), `b=` group (`label;id id`). Grid positions `r0c1` / `r0c1w2` or pixels `p40,80[,120x48]`. Multi-line text via `%0A`. Per-kind node-type vocabulary for archmap, arch2, seq, uc, dataflow, lifecycle, erd, class.'
type: reference
---

# Core Content

core_features:

  - One property-table grammar for every diagram kind: `n=` / `e=` / `b=`
  - `n=id;type;label[;sub][;pos]` — id is the handle used in `e=` and `b=`; type picks colour/badge/shape; sub is a second line; pos is optional
  - `e=from;to[;label][;variant]` — both ids must exist; variant is `main` / `dash` (seq uses a trailing `dash` for replies; uc uses `<<include>>` labels)
  - `b=label;id id …` — groups existing nodes under a label; repeatable
  - Positions: grid cell `r0c1`, span `r0c1w2` / `r1c0h2`, or pixels `p40,80[,120x48]`. Omit and the engine lays the graph out in layers (ranked by dependency, crossings reduced, nodes aligned with their neighbours)
  - Trailing semicolons in `n=` are ignored
  - Multi-line text: `%0A` inside the `sub` field (ERD field lists, class member lists)
  - Per-kind vocabulary: archmap/arch2/seq use `fe be db cloud sec bus svc ext`; uc uses `actor uc`; dataflow uses `process store source sink`; lifecycle uses `state decision terminal`; erd uses `table view`; class uses `class iface enum`
  - Automatic layout: `dir=lr` (default, layers side by side) or `dir=tb` (layers stacked); `grid=N` forces the grid instead (N per row); partially positioned nodes leave the rest next to their neighbours
  - Three kinds use their own syntax: `/draw/mindmap` (`n=Root/Child`), `/draw/mermaid` (`m=`), `/draw/gantt` and `/draw/gantt2` (`m=`)

# Key Information

highlights:

  - **Learn the grammar once** — only the type vocabulary changes per kind
  - Separators `;` `=` `,` `:` `/` `@` stay raw; escape space as `%20`, `+` as `%2B`, `&` as `%26`, `#` as `%23`, `<` `>` as `%3C` `%3E`, newline as `%0A`
  - A wrong id is a 400 with a corrective example, never a silently dropped line
  - Two nodes in one grid cell is a 400; repeated node ids are a 400
  - A label wider than the gap between two nodes widens the column — the engine makes room instead of stacking the label on a node

# Use Cases

use_cases:

  - Writing an architecture, sequence, use case, data flow, lifecycle, ERD or class diagram as a single URL
  - Teaching an agent the diagram grammar once instead of per chart kind
  - Keeping diagrams readable: type badges, group boxes, edge labels that never overlap

# Related Resources

official:
  endpoint: https://x-cmd.com/draw
related:
  overview: docs/1-overview/01-what-is-draw/cn.md
  data_formats: docs/1-overview/04-data-and-api/cn.md
  archmap: docs/5-architecture/01-archmap/cn.md
  seq: docs/5-architecture/04-seq/cn.md
  uc: docs/4-strategy/03-uc/cn.md
