---
name: docs/8-maps/01-maps
description: 'x-cmd/draw map (/draw/echarts?d=). Choropleths over the GeoJSON shipped with the service: USA, CN, EU, JP, BR, AU, DE, KR. Params: d (ECharts option JSON), w/h.'
type: reference
---

# Core Content

core_features:

  - `/draw/echarts?d=` — ECharts option rendered server-side
  - Regions that ship with the service: `USA` `CN` `EU` `JP` `BR` `AU` `DE` `KR`
  - `series[].map` names the region; `data[].name` matches the GeoJSON names
  - The projection is baked in — keep `aspectScale: 1`

# Key Information

highlights:

  - `/draw/echarts?d=` — ECharts option rendered server-side
  - Regions that ship with the service: `USA` `CN` `EU` `JP` `BR` `AU` `DE` `KR`
  - `series[].map` names the region; `data[].name` matches the GeoJSON names
  - The projection is baked in — keep `aspectScale: 1`

# Use Cases

use_cases:

  - Regional GDP, population or growth choropleths
  - Country and province comparisons
  - Coverage maps for reports and decks
  - Geographic breakdowns of survey or sales data

# Related Resources

official:
  endpoint: https://x-cmd.com/draw/echarts?d=
  repo: https://github.com/x-cmd/draw
related:
  overview: docs/1-overview/01-what-is-draw/cn.md
  showcases: docs/9-showcases/01-github/cn.md
