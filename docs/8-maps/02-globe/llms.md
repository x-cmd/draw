---
name: docs/8-maps-02-globe
description: 'x-cmd/draw globe (/draw/globe) and sphere (/draw/sphere): landmasses ship with the service, cities pin at p<lat>,<lon>, edges draw as great-circle arcs, hl= rings named nodes. The sphere kind force-lays a relation graph on the ball (no continents, fixed seed). Static SVG is one fixed camera; the explore page rotates the same scene.'
type: reference
---

# Core Content

core_features:

  - A real globe: continent outlines ship with the service — no map provider, no API key, no tiles
  - Nodes pin at `p<lat>,<lon>` (lat ±90, lon ±180); unpinned nodes join a force layout
  - Edges draw as great-circle arcs, arched slightly so they stay visible
  - The translucent sphere shows the far side faint (X-ray), so nothing is hidden
  - `hl=<id,id>` rings named nodes — bigger dot plus a circle
  - `/draw/sphere`: the same ball without continents, positions purely force-laid (fixed seed)

# Key Information

highlights:

  - The globe's `p` field pins a node; the sphere kind ignores positions entirely
  - Force-layout sweet spot is 30–200 nodes; out-of-range coordinates fall back to the layout
  - The dark look is fixed for this family — `scheme=light` does not apply
  - Static SVG is one fixed camera (yaw 20°, pitch −18°); rotation lives on the explore page

# Use Cases

  - A CDN or anycast map — PoPs around the world arcing back to two origins
  - A data-center footprint with regions (`db`) and cities (`ext`) on one ball
  - A relation graph wrapped on a sphere to see its shape from every side

# Related Resources

official:
  endpoint: https://x-cmd.com/draw/globe
related:
  diagram-urls: docs/1-overview/06-diagram-urls/cn.md
  maps: docs/8-maps/01-maps/cn.md
  arch3d: docs/5-architecture/08-arch3d/cn.md
  gallery: https://x-cmd.com/draw/demo/map
