---
name: docs/9-showcases/12-reference-examples
description: 'x-cmd/draw showcase: seven public reference charts checked one by one — an AI-coding agent leaderboard as a scatter with named points on a log cost axis, the same data as a ranking, a home network topology, a CI pipeline with decision branches, a character network through the ECharts overlay, and an animated illustration that is deliberately out of scope.'
type: reference
---

# Core Content

core_features:

  - The agent leaderboard as a scatter: one named point per harness, pass rate against median cost
  - `names=` names each point, `logx=1` puts the cost axis on a log scale, `xname=`/`yname=` name the axes
  - The same data as a horizontal bar ranking
  - A home network topology in `arch2`, with subnets as boundary frames
  - A CI pipeline in `lifecycle`: states, decisions, terminals, 是/否 on the edges
  - A character network through the ECharts overlay, trimmed to keep the URL under GitHub's Camo limit
  - Animated SVG illustrations: explicitly not draw's job

# Key Information

highlights:

  - A reference is a question first and a style second — sort out which kind before drawing
  - Real data convinces: published evaluation results, a published dataset
  - The data lives in the link, so the numbers stay editable
  - The URL is the price of "the chart is the data" — long URLs break GitHub embeds

# Use Cases

  - A benchmark write-up that needs pass rate against cost
  - A runbook that needs the shape of the pipeline
  - A README that needs the topology of a home lab

# Related Resources

official:
  endpoint: https://x-cmd.com/draw
related:
  overview: docs/1-overview/01-what-is-draw/cn.md
  scatter: docs/2-data-charts/08-scatter/cn.md
  diagram_urls: docs/1-overview/06-diagram-urls/cn.md
  ai_coding_era: docs/9-showcases/11-ai-coding-era/cn.md
