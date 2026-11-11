---
name: docs/5-architecture-07-icons
description: 'x-cmd/draw icons: the open-source diagrams library (Apache-2.0) vendored into the repo, scaled to 48×48 and embedded as data URIs. Architecture nodes take an optional icon field — n=id;type;label[;subtitle][;position][;icon], e.g. aws:ec2.'
type: reference
---

# Core Content

core_features:

  - 62 icons from the diagrams library: 47 AWS, 7 Azure, 8 GCP
  - One optional node field: `n=id;type;label[;subtitle][;position][;icon]`
  - The icon replaces the type badge in the corner of the node
  - `scripts/vendor-icons.mjs` downloads, scales, quantises and regenerates the module

# Key Information

highlights:

  - Embedded as data URIs, so the PNG output keeps the icons
  - The field order is forgiving: the icon is recognised by its `provider:name` shape
  - The library is open source — one line of script adds another service

# Use Cases

  - A cloud architecture diagram where the reader must recognise the services
  - A README that embeds the architecture as a PNG

# Related Resources

official:
  endpoint: https://x-cmd.com/draw
related:
  archmap: docs/5-architecture/01-archmap/cn.md
  diagram_urls: docs/1-overview/06-diagram-urls/cn.md
  showcase: docs/9-showcases/14-cloud-architecture/cn.md
