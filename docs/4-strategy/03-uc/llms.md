---
name: docs/4-strategy/03-uc
description: 'x-cmd/draw use case diagram (/draw/uc). Stick-figure actors, oval use cases, system boundary, <<include>>/<<extend>> dependencies. Params: n (id;actor|label or id;uc|label), e (association), b (boundary), title, w/h.'
type: reference
---

# Core Content

core_features:

  - `/draw/uc` — actors as stick figures, use cases as ovals
  - `n=` element: `id;actor|label[;sub]` or `id;uc|label[;sub]`
  - `e=` association; `<<include>>` / `<<extend>>` make it a dashed dependency
  - `b=` draws the system boundary around the use cases
  - Actors in a column on the left, use cases in a grid on the right

# Key Information

highlights:

  - `/draw/uc` — actors as stick figures, use cases as ovals
  - `n=` element: `id;actor|label[;sub]` or `id;uc|label[;sub]`
  - `e=` association; `<<include>>` / `<<extend>>` make it a dashed dependency
  - `b=` draws the system boundary around the use cases
  - Actors in a column on the left, use cases in a grid on the right

# Use Cases

use_cases:

  - Product and requirement documents
  - Explaining what a service is for
  - Onboarding: who touches what
  - Design reviews of an API's surface

# Related Resources

official:
  endpoint: https://x-cmd.com/draw/uc
  repo: https://github.com/x-cmd/draw
related:
  overview: docs/1-overview/01-what-is-draw/cn.md
  chart_types: docs/2-data-charts/01-pie/cn.md
