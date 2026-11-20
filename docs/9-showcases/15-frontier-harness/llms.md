---
name: docs/9-showcases-15-frontier-harness
description: 'x-cmd/draw showcase: reading the FrontierHarness v1.1 benchmark — 22 AI coding agents crossed with 5 models over 62 Terminal-Bench tasks, 27,280 scored runs. An overall pass-rate leaderboard, a cost-versus-pass-rate scatter with the Pareto frontier, a variance decomposition showing models explain 93% of cost, and a per-model ranking heatmap — each chart an ECharts URL.'
type: reference
---

# Core Content

core_features:

  - The benchmark setup: 22 agents (harnesses) × 5 models × 62 Terminal-Bench tasks × 4 runs = 27,280 scored tests, 57.67% overall pass rate
  - Cost-versus-pass-rate scatter of all 22 agents with the Pareto frontier line
  - Overall pass-rate leaderboard — a horizontal bar chart; the top four agents are clustered within 1.94pp and Exo is last at 50.65%
  - Cost decomposition by model — two-factor variance analysis on log cost: model 93%, agent 2%, interaction 5%
  - Cross-model ranking heatmap — every agent's rank on each of the five models, showing there is no all-rounder
  - All four charts are pasteable `x-cmd.com/draw/echarts` URLs, each linking to an interactive explore page

# Key Information

highlights:

  - Mainstream agents are statistically tied: 1,240 runs per agent give a 95% confidence interval of about ±2.7 percentage points
  - Models set the cost tier — a 6.3x cost spread between models versus 1.65x between agents
  - 64.5% of inference spend went to tasks that did not pass (52.7% failures, 11.8% timeouts)
  - No harness wins on every model; Claude Code ranges from 2nd to 17th place depending on the model
  - Codex CLI is the stability pick: ranks 3–4 on every model, the lowest pooled timeout rate (7.18%) and the lowest cost per pass ($0.935)

# Use Cases

use_cases:

  - A team choosing a default AI coding agent under a fixed model budget
  - A cost review that counts failure and timeout spend, not just token unit price
  - A benchmark-style report showing how to turn a public CSV into scatter, bar and heatmap URLs

# Related Resources

official:
  endpoint: https://x-cmd.com/draw
related:
  source_data: https://frontierharness.org/live/
  analysis_report: docs/9-showcases/02-analysis-report/cn.md
  ai_coding: docs/9-showcases/11-ai-coding-era/cn.md
  reference: docs/9-showcases/12-reference-examples/cn.md
