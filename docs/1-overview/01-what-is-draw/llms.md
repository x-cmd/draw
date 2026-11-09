---
name: docs/1-overview/01-what-is-draw
description: 'x-cmd/draw SVG chart endpoint — single GET / POST endpoint supporting 13 chart types (pie / bar / hbar / line / area / radar / gauge / scatter / combo / sankey / qr / quadrant / compass). Common params: t= (style), scheme=dark|light, num=all|peak|none, v=1, w/h=. Two data formats: flat params vs ?d= JSON. Returned SVG embeds <metadata> and is pure text (not binary).'
type: reference
---

# Core Content

core_features:

  - Single SVG chart endpoint at `/draw?type=...` — returns SVG with embedded `<metadata>` (pure text)
  - 13 chart types: pie / bar / hbar / line / area / radar / gauge / scatter / combo / sankey / qr / quadrant / compass
  - Diagram paths beyond `type=`: `/draw/archmap`, `/draw/mindmap`, `/draw/mermaid`, `/draw/gantt`, `/draw/echarts`
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
  pie: docs/2-chart-types/01-data-charts/01-pie/cn.md
  bar: docs/2-chart-types/01-data-charts/02-bar/cn.md
  line: docs/2-chart-types/01-data-charts/04-line/cn.md
  styles: docs/3-styles/01-style-families/cn.md
  formats: docs/4-data-and-api/01-data-formats/cn.md