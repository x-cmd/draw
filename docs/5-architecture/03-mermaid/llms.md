---
name: docs/5-architecture/03-mermaid
description: 'x-cmd/draw flowchart (/draw/mermaid). Mermaid syntax in, SVG out. Params: m (source), t (mono/soft), title, w/h. The supported subset is graph/flowchart with node shapes, edge labels and subgraphs.'
type: reference
---

# Core Content

core_features:

  - `/draw/mermaid` — Mermaid source rendered server-side
  - `m=` the source: `graph LR …` / `flowchart TD …`, URL-encoded
  - Node shapes: `[box]`, `{{diamond}}`, `([round])`, `[(cylinder)]`
  - Edges: `-->`, `---`, `-.->`, `==>`, and `-->|label|`
  - `subgraph Name … end` becomes a boundary group

# Key Information

highlights:

  - `/draw/mermaid` — Mermaid source rendered server-side
  - `m=` the source: `graph LR …` / `flowchart TD …`, URL-encoded
  - Node shapes: `[box]`, `{{diamond}}`, `([round])`, `[(cylinder)]`
  - Edges: `-->`, `---`, `-.->`, `==>`, and `-->|label|`
  - `subgraph Name … end` becomes a boundary group

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
  showcases: docs/9-showcases/01-github/cn.md
