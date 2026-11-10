---
x-title: Maps — choropleths over the GeoJSON that ships with the service
x-desc: 'x-cmd/draw maps (`/draw/echarts?d=`). Choropleths over the GeoJSON shipped with the service: USA, CN, EU, JP, BR, AU, DE, KR. Params: `d=` the ECharts option as JSON, `w=/h=`.'
x-sidebar: draw map
x-keywords: map chart, 地图, draw, svg, choropleth, geo, region
x-json-ld:
  '@context': https://schema.org
  '@graph':
    - '@type': TechArticle
      headline: 'draw map'
      inLanguage: 'en'
      about: 'x-cmd/draw 01-maps'
---

# Maps — choropleths over the GeoJSON that ships with the service

Maps go through the ECharts layer: `d=` carries a plain JSON option, and the
region outlines come with the service — no map service, no API key, no tile
requests.

## Examples (what you see is what the URL gives; click to explore)

### US states, GDP per capita

```text
https://x-cmd.com/draw/echarts?d=%7B%22title%22%3A%7B%22text%22%3A%22US%20states%20%C2%B7%20GDP%20per%20capita%202024%20%C2%B7%20thousand%20USD%22%7D%2C%22visualMap%22%3A%7B%22min%22%3A50%2C%22max%22%3A120%2C%22orient%22%3A%22horizontal%22%2C%22left%22%3A%22center%22%2C%22bottom%22%3A8%2C%22text%22%3A%5B%22high%22%2C%22low%22%5D%2C%22itemWidth%22%3A12%2C%22itemHeight%22%3A200%2C%22inRange%22%3A%7B%22color%22%3A%5B%22%23dbeafe%22%2C%22%2393c5fd%22%2C%22%233b82f6%22%2C%22%231d4ed8%22%5D%7D%7D%2C%22series%22%3A%5B%7B%22type%22%3A%22map%22%2C%22map%22%3A%22USA%22%2C%22roam%22%3Afalse%2C%22label%22%3A%7B%22show%22%3Atrue%2C%22fontSize%22%3A9%7D%2C%22labelLayout%22%3A%7B%22hideOverlap%22%3Atrue%7D%2C%22itemStyle%22%3A%7B%22areaColor%22%3A%22%23f1f5f9%22%2C%22borderColor%22%3A%22%23ffffff%22%2C%22borderWidth%22%3A0.6%7D%2C%22data%22%3A%5B%7B%22name%22%3A%22New%20York%22%2C%22value%22%3A117%7D%2C%7B%22name%22%3A%22Washington%22%2C%22value%22%3A108%7D%2C%7B%22name%22%3A%22California%22%2C%22value%22%3A103%7D%2C%7B%22name%22%3A%22Illinois%22%2C%22value%22%3A90%7D%2C%7B%22name%22%3A%22Texas%22%2C%22value%22%3A89%7D%2C%7B%22name%22%3A%22Florida%22%2C%22value%22%3A74%7D%2C%7B%22name%22%3A%22Mississippi%22%2C%22value%22%3A54%7D%5D%7D%5D%7D&w=760&h=520
```

[![US states · GDP per capita](https://x-cmd.com/draw/echarts?d=%7B%22title%22%3A%7B%22text%22%3A%22US%20states%20%C2%B7%20GDP%20per%20capita%202024%20%C2%B7%20thousand%20USD%22%7D%2C%22visualMap%22%3A%7B%22min%22%3A50%2C%22max%22%3A120%2C%22orient%22%3A%22horizontal%22%2C%22left%22%3A%22center%22%2C%22bottom%22%3A8%2C%22text%22%3A%5B%22high%22%2C%22low%22%5D%2C%22itemWidth%22%3A12%2C%22itemHeight%22%3A200%2C%22inRange%22%3A%7B%22color%22%3A%5B%22%23dbeafe%22%2C%22%2393c5fd%22%2C%22%233b82f6%22%2C%22%231d4ed8%22%5D%7D%7D%2C%22series%22%3A%5B%7B%22type%22%3A%22map%22%2C%22map%22%3A%22USA%22%2C%22roam%22%3Afalse%2C%22label%22%3A%7B%22show%22%3Atrue%2C%22fontSize%22%3A9%7D%2C%22labelLayout%22%3A%7B%22hideOverlap%22%3Atrue%7D%2C%22itemStyle%22%3A%7B%22areaColor%22%3A%22%23f1f5f9%22%2C%22borderColor%22%3A%22%23ffffff%22%2C%22borderWidth%22%3A0.6%7D%2C%22data%22%3A%5B%7B%22name%22%3A%22New%20York%22%2C%22value%22%3A117%7D%2C%7B%22name%22%3A%22Washington%22%2C%22value%22%3A108%7D%2C%7B%22name%22%3A%22California%22%2C%22value%22%3A103%7D%2C%7B%22name%22%3A%22Illinois%22%2C%22value%22%3A90%7D%2C%7B%22name%22%3A%22Texas%22%2C%22value%22%3A89%7D%2C%7B%22name%22%3A%22Florida%22%2C%22value%22%3A74%7D%2C%7B%22name%22%3A%22Mississippi%22%2C%22value%22%3A54%7D%5D%7D%5D%7D&w=760&h=520)](https://x-cmd.com/draw/explore/echarts?d=%7B%22title%22%3A%7B%22text%22%3A%22US%20states%20%C2%B7%20GDP%20per%20capita%202024%20%C2%B7%20thousand%20USD%22%7D%2C%22visualMap%22%3A%7B%22min%22%3A50%2C%22max%22%3A120%2C%22orient%22%3A%22horizontal%22%2C%22left%22%3A%22center%22%2C%22bottom%22%3A8%2C%22text%22%3A%5B%22high%22%2C%22low%22%5D%2C%22itemWidth%22%3A12%2C%22itemHeight%22%3A200%2C%22inRange%22%3A%7B%22color%22%3A%5B%22%23dbeafe%22%2C%22%2393c5fd%22%2C%22%233b82f6%22%2C%22%231d4ed8%22%5D%7D%7D%2C%22series%22%3A%5B%7B%22type%22%3A%22map%22%2C%22map%22%3A%22USA%22%2C%22roam%22%3Afalse%2C%22label%22%3A%7B%22show%22%3Atrue%2C%22fontSize%22%3A9%7D%2C%22labelLayout%22%3A%7B%22hideOverlap%22%3Atrue%7D%2C%22itemStyle%22%3A%7B%22areaColor%22%3A%22%23f1f5f9%22%2C%22borderColor%22%3A%22%23ffffff%22%2C%22borderWidth%22%3A0.6%7D%2C%22data%22%3A%5B%7B%22name%22%3A%22New%20York%22%2C%22value%22%3A117%7D%2C%7B%22name%22%3A%22Washington%22%2C%22value%22%3A108%7D%2C%7B%22name%22%3A%22California%22%2C%22value%22%3A103%7D%2C%7B%22name%22%3A%22Illinois%22%2C%22value%22%3A90%7D%2C%7B%22name%22%3A%22Texas%22%2C%22value%22%3A89%7D%2C%7B%22name%22%3A%22Florida%22%2C%22value%22%3A74%7D%2C%7B%22name%22%3A%22Mississippi%22%2C%22value%22%3A54%7D%5D%7D%5D%7D&w=760&h=520)

### China, provinces

```text
https://x-cmd.com/draw/echarts?d=%7B%22title%22%3A%7B%22text%22%3A%22%E4%B8%AD%E5%9B%BD%E5%90%84%E7%9C%81%E5%B8%82%20%C2%B7%20%E4%BA%BA%E5%9D%87%20GDP%28%E7%A4%BA%E4%BE%8B%29%22%7D%2C%22visualMap%22%3A%7B%22min%22%3A40%2C%22max%22%3A130%2C%22orient%22%3A%22vertical%22%2C%22left%22%3A10%2C%22bottom%22%3A16%2C%22text%22%3A%5B%22%E9%AB%98%22%2C%22%E4%BD%8E%22%5D%2C%22itemWidth%22%3A12%2C%22itemHeight%22%3A150%2C%22inRange%22%3A%7B%22color%22%3A%5B%22%23dbeafe%22%2C%22%2393c5fd%22%2C%22%233b82f6%22%2C%22%231d4ed8%22%5D%7D%7D%2C%22series%22%3A%5B%7B%22type%22%3A%22map%22%2C%22map%22%3A%22CN%22%2C%22roam%22%3Afalse%2C%22label%22%3A%7B%22show%22%3Atrue%2C%22fontSize%22%3A9%2C%22color%22%3A%22%230f172a%22%7D%2C%22labelLayout%22%3A%7B%22hideOverlap%22%3Atrue%7D%2C%22itemStyle%22%3A%7B%22areaColor%22%3A%22%23f1f5f9%22%2C%22borderColor%22%3A%22%23ffffff%22%2C%22borderWidth%22%3A0.6%7D%2C%22data%22%3A%5B%7B%22name%22%3A%22%E5%8C%97%E4%BA%AC%22%2C%22value%22%3A118%7D%2C%7B%22name%22%3A%22%E4%B8%8A%E6%B5%B7%22%2C%22value%22%3A121%7D%2C%7B%22name%22%3A%22%E5%B9%BF%E4%B8%9C%22%2C%22value%22%3A104%7D%2C%7B%22name%22%3A%22%E6%B1%9F%E8%8B%8F%22%2C%22value%22%3A101%7D%2C%7B%22name%22%3A%22%E6%B5%99%E6%B1%9F%22%2C%22value%22%3A108%7D%2C%7B%22name%22%3A%22%E5%9B%9B%E5%B7%9D%22%2C%22value%22%3A70%7D%2C%7B%22name%22%3A%22%E6%B2%B3%E5%8D%97%22%2C%22value%22%3A63%7D%2C%7B%22name%22%3A%22%E7%94%98%E8%82%83%22%2C%22value%22%3A48%7D%5D%7D%5D%7D&w=560&h=700
```

[![中国各省市 · 人均 GDP](https://x-cmd.com/draw/echarts?d=%7B%22title%22%3A%7B%22text%22%3A%22%E4%B8%AD%E5%9B%BD%E5%90%84%E7%9C%81%E5%B8%82%20%C2%B7%20%E4%BA%BA%E5%9D%87%20GDP%28%E7%A4%BA%E4%BE%8B%29%22%7D%2C%22visualMap%22%3A%7B%22min%22%3A40%2C%22max%22%3A130%2C%22orient%22%3A%22vertical%22%2C%22left%22%3A10%2C%22bottom%22%3A16%2C%22text%22%3A%5B%22%E9%AB%98%22%2C%22%E4%BD%8E%22%5D%2C%22itemWidth%22%3A12%2C%22itemHeight%22%3A150%2C%22inRange%22%3A%7B%22color%22%3A%5B%22%23dbeafe%22%2C%22%2393c5fd%22%2C%22%233b82f6%22%2C%22%231d4ed8%22%5D%7D%7D%2C%22series%22%3A%5B%7B%22type%22%3A%22map%22%2C%22map%22%3A%22CN%22%2C%22roam%22%3Afalse%2C%22label%22%3A%7B%22show%22%3Atrue%2C%22fontSize%22%3A9%2C%22color%22%3A%22%230f172a%22%7D%2C%22labelLayout%22%3A%7B%22hideOverlap%22%3Atrue%7D%2C%22itemStyle%22%3A%7B%22areaColor%22%3A%22%23f1f5f9%22%2C%22borderColor%22%3A%22%23ffffff%22%2C%22borderWidth%22%3A0.6%7D%2C%22data%22%3A%5B%7B%22name%22%3A%22%E5%8C%97%E4%BA%AC%22%2C%22value%22%3A118%7D%2C%7B%22name%22%3A%22%E4%B8%8A%E6%B5%B7%22%2C%22value%22%3A121%7D%2C%7B%22name%22%3A%22%E5%B9%BF%E4%B8%9C%22%2C%22value%22%3A104%7D%2C%7B%22name%22%3A%22%E6%B1%9F%E8%8B%8F%22%2C%22value%22%3A101%7D%2C%7B%22name%22%3A%22%E6%B5%99%E6%B1%9F%22%2C%22value%22%3A108%7D%2C%7B%22name%22%3A%22%E5%9B%9B%E5%B7%9D%22%2C%22value%22%3A70%7D%2C%7B%22name%22%3A%22%E6%B2%B3%E5%8D%97%22%2C%22value%22%3A63%7D%2C%7B%22name%22%3A%22%E7%94%98%E8%82%83%22%2C%22value%22%3A48%7D%5D%7D%5D%7D&w=560&h=700)](https://x-cmd.com/draw/explore/echarts?d=%7B%22title%22%3A%7B%22text%22%3A%22%E4%B8%AD%E5%9B%BD%E5%90%84%E7%9C%81%E5%B8%82%20%C2%B7%20%E4%BA%BA%E5%9D%87%20GDP%28%E7%A4%BA%E4%BE%8B%29%22%7D%2C%22visualMap%22%3A%7B%22min%22%3A40%2C%22max%22%3A130%2C%22orient%22%3A%22vertical%22%2C%22left%22%3A10%2C%22bottom%22%3A16%2C%22text%22%3A%5B%22%E9%AB%98%22%2C%22%E4%BD%8E%22%5D%2C%22itemWidth%22%3A12%2C%22itemHeight%22%3A150%2C%22inRange%22%3A%7B%22color%22%3A%5B%22%23dbeafe%22%2C%22%2393c5fd%22%2C%22%233b82f6%22%2C%22%231d4ed8%22%5D%7D%7D%2C%22series%22%3A%5B%7B%22type%22%3A%22map%22%2C%22map%22%3A%22CN%22%2C%22roam%22%3Afalse%2C%22label%22%3A%7B%22show%22%3Atrue%2C%22fontSize%22%3A9%2C%22color%22%3A%22%230f172a%22%7D%2C%22labelLayout%22%3A%7B%22hideOverlap%22%3Atrue%7D%2C%22itemStyle%22%3A%7B%22areaColor%22%3A%22%23f1f5f9%22%2C%22borderColor%22%3A%22%23ffffff%22%2C%22borderWidth%22%3A0.6%7D%2C%22data%22%3A%5B%7B%22name%22%3A%22%E5%8C%97%E4%BA%AC%22%2C%22value%22%3A118%7D%2C%7B%22name%22%3A%22%E4%B8%8A%E6%B5%B7%22%2C%22value%22%3A121%7D%2C%7B%22name%22%3A%22%E5%B9%BF%E4%B8%9C%22%2C%22value%22%3A104%7D%2C%7B%22name%22%3A%22%E6%B1%9F%E8%8B%8F%22%2C%22value%22%3A101%7D%2C%7B%22name%22%3A%22%E6%B5%99%E6%B1%9F%22%2C%22value%22%3A108%7D%2C%7B%22name%22%3A%22%E5%9B%9B%E5%B7%9D%22%2C%22value%22%3A70%7D%2C%7B%22name%22%3A%22%E6%B2%B3%E5%8D%97%22%2C%22value%22%3A63%7D%2C%7B%22name%22%3A%22%E7%94%98%E8%82%83%22%2C%22value%22%3A48%7D%5D%7D%5D%7D&w=560&h=700)

## 1. Parameters

| param | meaning | default |
|---|---|---|
| `d=` | the ECharts option as JSON | — |
| `w=` / `h=` | canvas size | natural size |
| `v=` | freeze the response at a version | latest |

The option is plain ECharts: `series[].type` is `map`, `series[].map` names
the region, `series[].data` carries the values.

## 2. The regions that ship with the service

| `map=` | region | `data[].name` is written in |
|---|---|---|
| `USA` | the 50 states + DC | English — `California`, `New York` |
| `CN` | the Chinese provinces | Chinese short forms — `北京`, `广东` |
| `EU` | the 27 EU member states | English — `Sweden`, `Spain` |
| `JP` | the 47 prefectures | English — `Hokkaido`, `Aomori` |
| `BR` | the Brazilian states | Portuguese — `Acre`, `Amazonas` |
| `AU` | the Australian states | English — `Northern Territory` |
| `DE` | the 16 German Länder | German — `Hamburg`, `Niedersachsen` |
| `KR` | the 17 Korean regions | English — `Gyeonggi-do` |

## 3. Making it readable

- **`visualMap`** turns the numbers into a colour ramp. `inRange.color` must
  be concrete hex values — ECharts cannot interpolate a CSS variable.
- **`series[].label`** turns the labels on. `labelLayout.hideOverlap` drops
  the ones that do not fit, which is what keeps a dense map readable.
- **One label can override the rest** — a state can carry its own text and
  colour, which is how you keep a dark state white-texted:

```json
{"name":"California","value":103,"label":{"formatter":"CA","color":"#ffffff"}}
```

- **The projection is already applied.** The renderer sets `aspectScale: 1`
  for you, because the shipped GeoJSON is projected rather than raw
  lat/long. Leave it alone.

## 4. Pitfalls

- **`series[].map` names the region**, not the country: `USA`, `CN`, `EU` …
  An unknown name is a 400.
- **`data[].name` must match the GeoJSON exactly** — `California`, not
  `CA`; `北京`, not `北京市`. A name that does not match is simply not drawn.
- **`visualMap` needs hex colours** — a CSS variable in `inRange.color`
  renders as a broken ramp.
- **`w=` / `h=` set the canvas, not the map** — the map is fitted into
  whatever room is left, so leave some of both.

