---
name: docs/1-overview-07-params
description: 'x-cmd/draw parameters: one set of parameters across three entry points (URL, CLI, npm), the URL encoding rules, which endpoint each chart kind uses, and the difference between /draw (the image) and /draw/explore (the editor).'
type: reference
---

# Core Content

core_features:

  - One parameter set, three entry points: GET /draw?, the `draw` CLI, and `draw()` from npm
  - The encoding rules: space is %20, a real plus is %2B, `;` `=` `,` `:` `/` `@` stay raw
  - The endpoint per chart kind: core, echarts, arch2, archmap, mermaid, seq/uc/erd/class, gantt, mindmap, tokei
  - Two links, two jobs: /draw is the image, /draw/explore is the editor

# Key Information

highlights:

  - A CLI long flag is the query parameter name; unknown flags pass through
  - The demo page copies the bare /draw? URL, so an embedded image is one click away
  - Non-core kinds have their own endpoint — using the wrong one is the classic mistake

# Use Cases

  - An AI agent generating a draw URL and needing to get the encoding right
  - A user switching between the CLI and the hosted service

# Related Resources

official:
  endpoint: https://x-cmd.com/draw
related:
  overview: docs/1-overview/01-what-is-draw/cn.md
  quick_start: docs/1-overview/02-quick-start/cn.md
  diagram_urls: docs/1-overview/06-diagram-urls/cn.md
