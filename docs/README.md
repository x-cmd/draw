# draw — docs

One endpoint, every chart is a URL you can paste anywhere.
`https://x-cmd.com/draw?type=pie&labels=A,B,C&values=1,2,3` returns an SVG; the same URL with `/explore`
in front of it opens the interactive app, where you can hover the data, tweak the parameters and edit the values.

The pages here exist in 19 languages (English, 中文, 日本語, Deutsch, Español, 한국어, Français,
Italiano, Português, Polski, Русский, Українська, ไทย, Türkçe, Bahasa Indonesia, Čeština, Română,
Việt Nam) and carry their own `faq.yml` with the questions that page raises. Pages that have not been
written yet are in English and Chinese only.

Folder names carry a numeric prefix for ordering — the prefix is dropped when the site is published.

## 1 · Overview

| page | what it covers |
|---|---|
| [What is draw](1-overview/01-what-is-draw/en.md) | the endpoint, common parameters, the two data formats |
| [Quick start](1-overview/02-quick-start/en.md) | a first chart in three minutes, three ways to run it |

## 2 · Chart types

Seven families. The family tells you what the chart is *for*; the page tells you how to draw it.

### 2.1 · Data charts 数据图

| page | chart | good for |
|---|---|---|
| [01 pie](2-chart-types/01-data-charts/01-pie/en.md) | donut / pie, 6 styles | parts of a whole |
| [02 bar](2-chart-types/01-data-charts/02-bar/en.md) | grouped, stacked | comparison over time |
| [03 hbar](2-chart-types/01-data-charts/03-hbar/en.md) | horizontal bars, butterfly | rankings, long labels |
| [04 line](2-chart-types/01-data-charts/04-line/en.md) | time series | trends |
| [05 area](2-chart-types/01-data-charts/05-area/en.md) | line + fill | accumulation |
| [06 radar](2-chart-types/01-data-charts/06-radar/en.md) | multi-axis | comparing products |
| [07 gauge](2-chart-types/01-data-charts/07-gauge/en.md) | dial | one number, now |
| [08 scatter](2-chart-types/01-data-charts/08-scatter/en.md) | points | correlation |
| [09 combo](2-chart-types/01-data-charts/09-combo/en.md) | bars + line | two measures at once |

### 2.2 · Relations 关系图

| page | chart | good for |
|---|---|---|
| [01 sankey](2-chart-types/02-relations/01-sankey/en.md) | flow | where things go |

### 2.3 · Strategy and decision 战略与决策

| page | chart | good for |
|---|---|---|
| [01 quadrant](2-chart-types/03-strategy/01-quadrant/en.md) | 2×2 decision matrix | prioritisation, retro, portfolio |
| [02 compass](2-chart-types/03-strategy/02-compass/en.md) | four-arrow compass | directions radiating from a centre |

### 2.4 · Architecture 架构图

| page | chart | good for |
|---|---|---|
| [01 archmap](2-chart-types/04-architecture/01-archmap/en.md) | grid architecture diagram | systems, topology, boundaries |
| [02 mindmap](2-chart-types/04-architecture/02-mindmap/en.md) | mind map | feature maps, checklists |
| [03 mermaid](2-chart-types/04-architecture/03-mermaid/en.md) | flowchart from Mermaid | decision flows, pipelines |

### 2.5 · Schedule 日程与排布

| page | chart | good for |
|---|---|---|
| [01 gantt](2-chart-types/05-schedule/01-gantt/en.md) | Gantt chart | sprint plans, timelines, milestones |

### 2.6 · Infographics 信息图

| page | chart | good for |
|---|---|---|
| [01 qr](2-chart-types/06-infographics/01-qr/en.md) | QR code | links, WiFi, contact cards |

### 2.7 · Maps 地图

| page | chart | good for |
|---|---|---|
| [01 maps](2-chart-types/07-maps/01-maps/en.md) | choropleth over the shipped GeoJSON | regional comparisons |

## 3 · Styles

- [Style families](3-styles/01-style-families/en.md) — the `t=` catalog, dark and light

## 4 · Data and API

- [Data formats](4-data-and-api/01-data-formats/en.md) — flat parameters versus `?d=` JSON, per-type schemas

## 5 · Self-hosting

- [Deploy it yourself](5-self-hosting/01-deploy/en.md) — Cloudflare Workers, a local Node server, the npm library, short links

## 6 · Showcases 场景用例

Real scenarios, each one a set of ready URLs.

| page | scenario |
|---|---|
| [01 github](6-showcases/01-github/en.md) | GitHub and open source — stars, contributors, issues, the repo map |
| [02 analysis report](6-showcases/02-analysis-report/en.md) | analysis reports — latency, pass rates, scorecards, revenue and margin |
| [03 macro economics](6-showcases/03-macro-economics/en.md) | macro economics — GDP, inflation, trade flows, regional maps |
| [04 marketing](6-showcases/04-marketing/en.md) | marketing — funnels, channels, spend and ROI, customer segments |
| [05 product roadmap](6-showcases/05-product-roadmap/en.md) | product and roadmap — product maps, launch checklists, sprint plans |
| [06 ops and reliability](6-showcases/06-ops-reliability/en.md) | ops and reliability — uptime, storage, cluster topology, login flow |
