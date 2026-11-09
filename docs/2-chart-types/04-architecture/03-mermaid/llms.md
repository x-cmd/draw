---
name: docs/2-chart-types/04-architecture/03-mermaid
description: 'x-cmd/draw flowchart (/draw/mermaid). Mermaid syntax in, SVG out. Params: m (source), t (mono), title, w/h.'
type: reference
---

# Core Content

core_features:

  - `/draw/mermaid` — Mermaid source rendered server-side
  - `m=` the source: `graph LR …` / `flowchart TD …`, URL-encoded
  - `t=` style: `mono` for line art
  - The source must be URL-encoded (`>` → `%3E`, newline → `%0A`)

# Key Information

highlights:

  - `/draw/mermaid` — Mermaid source rendered server-side
  - `m=` the source: `graph LR …` / `flowchart TD …`, URL-encoded
  - `t=` style: `mono` for line art
  - The source must be URL-encoded (`>` → `%3E`, newline → `%0A`)

# Use Cases

use_cases:

  - Release and CI/CD flows
  - Login and authentication decision trees
  - Onboarding and escalation paths
  - Process diagrams for documentation

# Related Resources

official:
  endpoint: https://x-cmd.com/draw/mermaid
  repo: https://github.com/x-cmd/draw
related:
  overview: docs/1-overview/01-what-is-draw/cn.md
  showcases: docs/6-showcases/01-github/cn.md
