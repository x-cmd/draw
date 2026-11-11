---
name: docs/5-architecture/06-class
description: 'x-cmd/draw class diagram (/draw/class). Classes, interfaces and enums; members inside the node, one per line. Params: n (class), e (relation), b (group), title, w/h.'
type: reference
---

# Core Content

core_features:

  - `/draw/class` — one node per class
  - `n=` class: `id;type;name;members;pos`
  - Member lines separated by `%0A`
  - `e=` relation: `from;to[;label]`
  - Classes, interfaces and enums each get their own colour

# Key Information

highlights:

  - `/draw/class` — one node per class
  - `n=` class: `id;type;name;members;pos`
  - Member lines separated by `%0A`
  - `e=` relation: `from;to[;label]`
  - Classes, interfaces and enums each get their own colour

# Use Cases

use_cases:

  - Public API docs
  - Design reviews of a library's surface
  - Onboarding: which types fit together
  - Refactoring: what breaks if this changes

# Related Resources

official:
  endpoint: https://x-cmd.com/draw/class
  repo: https://github.com/x-cmd/draw
related:
  overview: docs/1-overview/01-what-is-draw/cn.md
  chart_types: docs/2-data-charts/01-pie/cn.md
