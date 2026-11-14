---
name: docs/5-architecture-08-arch3d
description: 'x-cmd/draw 3D architecture (/draw/arch3d): the same n=/e=/b= grammar as arch2, drawn as a rotatable isometric 3D scene. The height axis is flow depth — sources on the SOURCE tier, sinks on the SINK tier, layered automatically per connected component. view=flat renders the flat version; bstyle=/planes=/aux= control the guides.'
type: reference
---

# Core Content

core_features:

  - The same `n=`/`e=`/`b=` grammar as arch2 and archmap, drawn as an isometric 3D scene of tiles
  - The height axis is flow depth: sources (SOURCE) on top, sinks (SINK) at the bottom, the rest in MID
  - Tiers are derived, not placed: each connected component is cycle-broken and layered along the longest path
  - `view=flat` renders the flat version — one plane per tier, side by side
  - `bstyle=` (plain/tint/dash), `planes=1` and `aux=1` draw the group frames, tier planes and floor grid
  - The sixth node field `icon` (`provider:name`, e.g. `aws:cloudfront`) puts a vendor icon on the tile

# Key Information

highlights:

  - The position field (`r0c1`, pixels) is ignored in the 3D version — change edges to change tiers
  - The static SVG is always the default isometric camera; rotation lives on the explore page
  - Every connected component is layered independently — disconnected pieces are not height-aligned
  - Guides are off by default; turn them on only when the picture explains the layout itself

# Use Cases

  - A conference-slide version of a deployment architecture — "where the flow ends up" at a glance
  - An onboarding doc that shows request path depth instead of listing services
  - Comparing the flat and 3D renderings of the same graph with `view=flat`

# Related Resources

official:
  endpoint: https://x-cmd.com/draw/arch3d
related:
  overview: docs/1-overview/06-diagram-urls/cn.md
  archmap: docs/5-architecture/01-archmap/cn.md
  globe: docs/8-maps/02-globe/cn.md
  showcase: docs/9-showcases/14-cloud-architecture/cn.md
