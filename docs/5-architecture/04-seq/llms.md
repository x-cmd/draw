---
name: docs/5-architecture/04-seq
description: 'x-cmd/draw sequence diagram (/draw/seq). Participants across the top, one message per line, time down; URL order is message order. Params: n (participant), e (message: from;to[;label][;dash]), title, w/h.'
type: reference
---

# Core Content

core_features:

  - `/draw/seq` — participants across the top, one message per line, time down
  - `n=` participant: `id;type;label[;sub][;pos]`
  - `e=` message: `from;to[;label][;dash]` — URL order is time order
  - Lifelines drop from every participant box
  - Dashed arrows for replies; activation bars mark the busy stretch
  - A message naming an unknown participant is a 400

# Key Information

highlights:

  - `/draw/seq` — participants across the top, one message per line, time down
  - `n=` participant: `id;type;label[;sub][;pos]`
  - `e=` message: `from;to[;label][;dash]` — URL order is time order
  - Lifelines drop from every participant box
  - Dashed arrows for replies; activation bars mark the busy stretch
  - A message naming an unknown participant is a 400

# Use Cases

use_cases:

  - How one request travels through a service
  - API and protocol walkthroughs
  - Onboarding: what calls what
  - Incident reviews and post-mortems

# Related Resources

official:
  endpoint: https://x-cmd.com/draw/seq
  repo: https://github.com/x-cmd/draw
related:
  overview: docs/1-overview/01-what-is-draw/cn.md
  chart_types: docs/2-data-charts/01-pie/cn.md
