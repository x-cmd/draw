---
name: 2-overview
description: 'x-cmd/draw SVG chart endpoint — single GET / POST endpoint supporting 11 chart types (pie / bar / hbar / line / area / radar / gauge / scatter / combo / sankey / qr). Common params: t= (style), scheme=dark|light, num=all|peak|none, v=1, w/h=. Two data formats: flat params vs ?d= JSON. Returned SVG embeds <metadata> and is pure text (not binary).'
type: reference
---

# Core Content

core_features:

  - Single SVG chart endpoint at `/draw?type=...` — returns SVG with embedded `<metadata>` (pure text)
  - 11 chart types: pie / bar / hbar / line / area / radar / gauge / scatter / combo / sankey / qr
  - Two data formats supported for every chart: flat params (URL readable) OR `?d=` JSON
  - Common params: `t=` style, `scheme=dark|light`, `num=all|peak|none`, `v=1` freeze, `w/h=` size
  - `GET /draw?...` for one-shot SVG; `POST /draw?...` creates permanent short URL (`/d/<id>`)
  - SVG output is **pure text**, not binary — grep / diff / paste-friendly

# Key Information

highlights:

  - URL-driven, no SDK needed — just `curl "https://x-cmd.com/draw?type=pie&labels=A,B,C&values=10,20,30"`
  - Two equivalent data formats: flat params (URL readable, ≤ 5 items) vs `?d=` JSON (cleaner for big data)
  - Each SVG embeds `<metadata>` with title / desc / source URL — fully self-describing
  - `scheme=dark|light` defaults to follow system; explicit override for theme consistency
  - `v=1` freezes response (debug / cache-friendly); `num=all|peak|none` controls label density
  - POST creates stable short URLs for docs / README badges / long-term sharing

# Use Cases

use_cases:

  - Generating SVG charts for documentation via URL (no JS / build step)
  - Embedding stable charts in README / issues / Slack (pure text SVG, paste-able)
  - Building dashboards from data files (flat params or JSON in `?d=`)
  - Creating permanent short URLs for charts via POST (stable IDs for shared docs)
  - Generating QR codes for URLs / WiFi / contact cards
  - Building sankey / radar / gauge / scatter visualizations via simple URL params

# Related Resources

official:
  endpoint: https://x-cmd.com/draw
  repo: https://github.com/x-cmd/draw
related:
  pie: docs/10-pie/cn.md
  bar: docs/11-bar/cn.md
  line: docs/13-line/cn.md
  styles: docs/3-styles-themes/cn.md
  formats: docs/5-data-formats/cn.md