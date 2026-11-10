---
name: docs/8-maps/01-maps
description: 'x-cmd/draw map (/draw/echarts?d=). Choropleths over the GeoJSON shipped with the service: USA, CN, EU, JP, BR, AU, DE, KR. Params: d (the ECharts option as JSON), w/h.'
type: reference
---

# Core Content

core_features:

  - `/draw/echarts?d=` — an ECharts option rendered server-side
  - Regions that ship with the service: `USA` `CN` `EU` `JP` `BR` `AU` `DE` `KR`
  - `series[].map` names the region; `data[].name` matches the GeoJSON
  - `visualMap` with concrete hex colours turns numbers into a ramp
  - `labelLayout.hideOverlap` keeps a dense map readable

# Key Information

highlights:

  - `/draw/echarts?d=` — an ECharts option rendered server-side
  - Regions that ship with the service: `USA` `CN` `EU` `JP` `BR` `AU` `DE` `KR`
  - `series[].map` names the region; `data[].name` matches the GeoJSON
  - `visualMap` with concrete hex colours turns numbers into a ramp
  - `labelLayout.hideOverlap` keeps a dense map readable

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
