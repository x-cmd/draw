---
name: docs/3-relations-03-chord
description: 'x-cmd/draw chord diagram (/draw/chord): one links=from,to,value;… parameter is the whole spec — nodes grow out of the link names, each owns an arc whose length is proportional to total flow, and each link pulls a band between its two arcs. Self-drawn because the ECharts chord needs a renderItem function that URL JSON cannot carry. Params: links=, title=, w=/h=.'
type: reference
---

# Core Content

core_features:

  - A ring of arcs — one per entity, arc length proportional to total in + out flow
  - Bands between arcs, one per link, width proportional to the value
  - Nodes are derived: every name in `links=` becomes a node, ordered by total flow
  - Self-drawn SVG — the ECharts chord needs a `renderItem` function that a URL cannot carry
  - `title=` top-left, `w=`/`h=` canvas size

# Key Information

highlights:

  - One parameter carries the data: `links=Rock,Pop,28;Pop,Metal,12` — no node list needed
  - Entries with value ≤ 0 or non-numeric are silently skipped
  - About 20 nodes is the comfortable ceiling; past that a sankey scales better
  - Bands read as two-way — for directed conversion, use `type=sankey`

# Use Cases

  - Music genres or teams influencing each other
  - Module-to-module call volumes in a codebase
  - Passenger or trade flows between cities and countries

# Related Resources

official:
  endpoint: https://x-cmd.com/draw/chord
related:
  sankey: docs/3-relations/01-sankey/cn.md
  pie: docs/2-data-charts/01-pie/cn.md
  gallery: https://x-cmd.com/draw/demo/sankey
