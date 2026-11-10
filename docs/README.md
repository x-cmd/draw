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
| [Style families](1-overview/03-styles/en.md) | the `t=` catalog, dark and light |
| [Data formats](1-overview/04-data-and-api/en.md) | flat parameters versus `?d=` JSON, per-type schemas |
| [Deploy it yourself](1-overview/05-self-hosting/en.md) | Cloudflare Workers, a local Node server, the npm library, short links |

## 2 · Data charts 数据图

| page | chart | good for |
|---|---|---|
| [01 pie](2-data-charts/01-pie/en.md) | donut / pie, 6 styles | parts of a whole |
| [02 bar](2-data-charts/02-bar/en.md) | grouped, stacked | comparison over time |
| [03 hbar](2-data-charts/03-hbar/en.md) | horizontal bars, butterfly | rankings, long labels |
| [04 line](2-data-charts/04-line/en.md) | time series | trends |
| [05 area](2-data-charts/05-area/en.md) | line + fill | accumulation |
| [06 radar](2-data-charts/06-radar/en.md) | multi-axis | comparing products |
| [07 gauge](2-data-charts/07-gauge/en.md) | dial | one number, now |
| [08 scatter](2-data-charts/08-scatter/en.md) | points | correlation |
| [09 combo](2-data-charts/09-combo/en.md) | bars + line | two measures at once |
| [10 tokei](2-data-charts/10-tokei/en.md) | code composition | code, comments and blanks per language |

## 3 · Relations 关系图

| page | chart | good for |
|---|---|---|
| [01 sankey](3-relations/01-sankey/en.md) | flow | where things go |
| [02 dataflow](3-relations/02-dataflow/en.md) | data flow | processes, stores, what flows between |

## 4 · Strategy and decision 战略与决策

| page | chart | good for |
|---|---|---|
| [01 quadrant](4-strategy/01-quadrant/en.md) | 2×2 decision matrix | prioritisation, retro, portfolio |
| [02 compass](4-strategy/02-compass/en.md) | four-arrow compass | directions radiating from a centre |
| [03 uc](4-strategy/03-uc/en.md) | use case diagram | who uses it, and for what |
| [04 lifecycle](4-strategy/04-lifecycle/en.md) | lifecycle diagram | the states, and the moves between them |

## 5 · Architecture 架构图

| page | chart | good for |
|---|---|---|
| [01 archmap](5-architecture/01-archmap/en.md) | grid architecture diagram | systems, topology, boundaries |
| [02 mindmap](5-architecture/02-mindmap/en.md) | mind map | feature maps, checklists |
| [03 mermaid](5-architecture/03-mermaid/en.md) | flowchart from Mermaid | decision flows, pipelines |
| [04 seq](5-architecture/04-seq/en.md) | sequence diagram | who talks to whom, in what order |
| [05 erd](5-architecture/05-erd/en.md) | ERD | the tables, their fields, how they relate |
| [06 class](5-architecture/06-class/en.md) | class diagram | the types, and how they hang together |

## 6 · Schedule 日程与排布

| page | chart | good for |
|---|---|---|
| [01 gantt](6-schedule/01-gantt/en.md) | Gantt chart | sprint plans, timelines, milestones |
| [02 gantt2](6-schedule/02-gantt2/en.md) | Gantt chart v2 | the same source, the house style |

## 7 · Infographics 信息图

| page | chart | good for |
|---|---|---|
| [01 qr](7-infographics/01-qr/en.md) | QR code | links, WiFi, contact cards |

## 8 · Maps 地图

| page | chart | good for |
|---|---|---|
| [01 maps](8-maps/01-maps/en.md) | choropleth over the shipped GeoJSON | regional comparisons |

## 9 · Showcases 场景用例

Real scenarios, each one a set of ready URLs.

| page | scenario |
|---|---|
| [01 github](9-showcases/01-github/en.md) | GitHub — issues, PRs and releases: use cases, sequences, code composition, architecture |
| [02 analysis report](9-showcases/02-analysis-report/en.md) | analysis reports — latency, pass rates, scorecards, revenue and margin |
| [03 macro economics](9-showcases/03-macro-economics/en.md) | macro economics — GDP, inflation, trade flows, regional maps |
| [04 marketing](9-showcases/04-marketing/en.md) | marketing — funnels, channels, spend and ROI, customer segments |
| [05 product roadmap](9-showcases/05-product-roadmap/en.md) | product and roadmap — product maps, launch checklists, sprint plans |
| [06 ops and reliability](9-showcases/06-ops-reliability/en.md) | ops and reliability — uptime, storage, cluster topology, login flow |
| [07 education](9-showcases/07-education/en.md) | education — enrolment, scores, the course map, the term plan |
| [08 healthcare](9-showcases/08-healthcare/en.md) | healthcare — waiting times, bed occupancy, case mix, patient pathways |
| [09 finance](9-showcases/09-finance/en.md) | finance — allocation, return against risk, the deal funnel |
| [10 logistics](9-showcases/10-logistics/en.md) | logistics — throughput, warehouse fill, the fulfilment network |
