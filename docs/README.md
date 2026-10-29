# draw — docs

One endpoint, eleven chart types, and every chart is a URL you can paste anywhere.
`https://x-cmd.com/draw?type=pie&labels=A,B,C&values=1,2,3` returns an SVG; the same URL with `/explore`
in front of it opens the interactive app, where you can hover the data, tweak the parameters and edit the values.

Every page below exists in 19 languages (English, 中文, 日本語, Deutsch, Español, 한국어, Français,
Italiano, Português, Polski, Русский, Українська, ไทย, Türkçe, Bahasa Indonesia, Čeština, Română,
Việt Nam) and carries its own `faq.yml` with the questions that page raises.

## 1 · Overview

| page | what it covers |
|---|---|
| [What is draw](1-overview/01-what-is-draw/en.md) | the endpoint, common parameters, the two data formats |
| [Quick start](1-overview/02-quick-start/en.md) | a first chart in three minutes, three ways to run it |

## 2 · Chart types

| page | chart | good for |
|---|---|---|
| [01 pie](2-chart-types/01-pie/en.md) | donut / pie, 6 styles | parts of a whole |
| [02 bar](2-chart-types/02-bar/en.md) | grouped, stacked | comparison over time |
| [03 hbar](2-chart-types/03-hbar/en.md) | horizontal bars, butterfly | rankings, long labels |
| [04 line](2-chart-types/04-line/en.md) | time series | trends |
| [05 area](2-chart-types/05-area/en.md) | line + fill | accumulation |
| [06 radar](2-chart-types/06-radar/en.md) | multi-axis | comparing products |
| [07 gauge](2-chart-types/07-gauge/en.md) | dial | one number, now |
| [08 scatter](2-chart-types/08-scatter/en.md) | points | correlation |
| [09 combo](2-chart-types/09-combo/en.md) | bars + line | two measures at once |
| [10 sankey](2-chart-types/10-sankey/en.md) | flow | where things go |
| [11 qr](2-chart-types/11-qr/en.md) | QR code | links, WiFi, contact cards |

## 3 · Styles

- [Style families](3-styles/01-style-families/en.md) — the `t=` catalog, dark and light

## 4 · Data and API

- [Data formats](4-data-and-api/01-data-formats/en.md) — flat parameters versus `?d=` JSON, per-type schemas

## 5 · Self-hosting

- [Deploy it yourself](5-self-hosting/01-deploy/en.md) — Cloudflare Workers, a local Node server, the npm library, short links
