---
name: 19-sankey
description: x-cmd/draw sankey diagram (type=sankey). Flow / conversion path visualization: source → middle → endpoint. Params: nodes + links (source,target,value). Node names must exactly match in nodes/ and links/.
type: reference
---

# Core Content

core_features:

  - `type=sankey` — sankey diagram for flow / conversion paths
  - `nodes=` node list, comma-separated
  - `links=source,target,value;...` — connections; semicolon between
  - Node names in `links` must **exactly match** strings in `nodes`

# Key Information

highlights:

  - **Node name matching** is strict — typos cause empty diagram
  - ≤ 20 nodes stays readable; > 20 consider grouping
  - Zero-value links not drawn (useful for hiding paths)
  - Complex sankey benefits from JSON format

# Use Cases

use_cases:

  - User conversion funnel (visitor → signup → active → paid)
  - Energy flow (sources → grid → consumers)
  - Budget allocation (sources → departments → projects)
  - Multi-stage process flows

# Related Resources

official:
  endpoint: https://x-cmd.com/draw?type=sankey
related:
  overview: docs/2-overview/cn.md
  formats: docs/5-data-formats/cn.md