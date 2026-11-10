---
name: docs/4-strategy/04-lifecycle
description: 'x-cmd/draw lifecycle diagram (/draw/lifecycle). States, decisions and terminals; edges carry the trigger. Params: n (node), e (transition), b (group), title, w/h.'
type: reference
---

# Core Content

core_features:

  - `/draw/lifecycle` — states, decisions and terminals
  - `n=` node: `id;type;label[;sub][;pos]`
  - `e=` transition: `from;to[;trigger]`
  - States are rounds, decisions are diamonds
  - Cycles are fine — the router routes around

# Key Information

highlights:

  - `/draw/lifecycle` — states, decisions and terminals
  - `n=` node: `id;type;label[;sub][;pos]`
  - `e=` transition: `from;to[;trigger]`
  - States are rounds, decisions are diamonds
  - Cycles are fine — the router routes around

# Use Cases

use_cases:

  - Order and ticket lifecycles
  - State machines in a design doc
  - CI and release flows
  - Account states and moderation

# Related Resources

official:
  endpoint: https://x-cmd.com/draw/lifecycle
  repo: https://github.com/x-cmd/draw
related:
  overview: docs/1-overview/01-what-is-draw/cn.md
  chart_types: docs/2-data-charts/01-pie/cn.md
