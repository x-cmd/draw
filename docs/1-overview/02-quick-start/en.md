---
x-title: draw quick start — up and running in 3 minutes (URL / npm / Deno)
x-desc: 'Fastest paths into x-cmd/draw: build a URL and render, npm library + CLI offline, Deno zero-permission sandbox. Complete chart-type table at the end.'
x-sidebar: draw quick start
x-keywords: draw, quickstart, svg, chart, url, npm, deno, cli
x-json-ld:
  '@context': https://schema.org
  '@graph':
    - '@type': TechArticle
      headline: 'draw quick start'
      inLanguage: 'en'
      about: 'x-cmd/draw quick start'
---

# draw quick start — up and running in 3 minutes

All the data lives in the URL; rendering is just assembling params:

```text
https://x-cmd.com/draw?type=pie&labels=TS,Py,Go&values=48,23,9&title=Stars
```

Open it in a browser for the SVG; `<img src>` and Markdown `![]()` work the same way.

Every example on this page is a click-to-explore link — the image is the SVG, a click opens the `/explore` app to hover the data, tweak the params and edit the values.

## Three paths

**1. Hosted service (zero install)** — build a URL, done. See above.

**2. npm library + CLI (offline)**

```sh
npm install @x-cmd/draw
draw --type pie --labels "TS,Py,Go" --values "48,23,9" --out pie.svg
```

```ts
import { draw } from '@x-cmd/draw';
const { svg } = draw({ type: 'pie', labels: 'A,B', values: '3,2' });  // sync, no network
```

**3. Deno (JSR, zero-permission sandbox)**

```ts
import { draw } from "jsr:@x-cmd/draw";
const { svg } = draw({ type: "pie", labels: "A,B", values: "3,2" });
```

**PNG output** — any chart URL can rasterize instead: append `&format=png` (`scale=1–3` for retina; `scheme` is baked — omitting it means light; the embedded font subset is latin-only for now). The CLI picks it by extension: `--out chart.png`.

Deeper docs: [2-overview](../01-what-is-draw/en.md), [3-styles-themes](../../3-styles/01-style-families/en.md), [4-self-hosting](../../5-self-hosting/01-deploy/en.md), per-type references from [10-pie](../../2-chart-types/01-pie/en.md).

## The complete table (11 types)

| type | chart | example |
|---|---|---|
| `pie` | donut; `donut=0` for a solid pie<br><br>**<u>≤100 categories (>9 auto-merge into Other)</u>** | [![pie example](https://x-cmd.com/draw?type=pie&labels=TS,Py,Go,Rust&values=4821,2312,980,645&title=Stars%20by%20language&w=360)](https://x-cmd.com/draw/explore?type=pie&labels=TS,Py,Go,Rust&values=4821,2312,980,645&title=Stars%20by%20language) |
| `bar` | grouped columns; multi-series with `stack=1` for stacked<br><br>**<u>≤30 groups</u>** | [![bar example](https://x-cmd.com/draw?type=bar&labels=Mon,Tue,Wed&series=dev:12,18,9&series=ci:8,11,6&w=360)](https://x-cmd.com/draw/explore?type=bar&labels=Mon,Tue,Wed&series=dev:12,18,9&series=ci:8,11,6) |
| `hbar` | horizontal bars (rankings; labels left, values right)<br><br>**<u>≤30 bars, single series (some styles take two)</u>** | [![hbar example](https://x-cmd.com/draw?type=hbar&labels=cli,core,docs,ui&values=42,31,18,9&title=Commits%20by%20area&w=360)](https://x-cmd.com/draw/explore?type=hbar&labels=cli,core,docs,ui&values=42,31,18,9&title=Commits%20by%20area) |
| `line` | smooth line + gradient area / multi-line<br><br>**<u>≤60 points</u>** | [![line example](https://x-cmd.com/draw?type=line&labels=Jan,Feb,Mar,Apr,May,Jun&values=12,19,15,25,22,30&title=Stars&w=360)](https://x-cmd.com/draw/explore?type=line&labels=Jan,Feb,Mar,Apr,May,Jun&values=12,19,15,25,22,30&title=Stars) |
| `area` | area / multi-series area (gradient fill)<br><br>**<u>≤60 points</u>** | [![area example](https://x-cmd.com/draw?type=area&labels=Q1,Q2,Q3,Q4&values=8,14,23,37&title=Downloads&w=360)](https://x-cmd.com/draw/explore?type=area&labels=Q1,Q2,Q3,Q4&values=8,14,23,37&title=Downloads) |
| `radar` | radar chart<br><br>**<u>3–12 axes</u>** | [![radar example](https://x-cmd.com/draw?type=radar&t=evil&labels=perf,docs,tests,dx&series=v1:7,5,8,6&series=v2:8,8,9,8&w=360)](https://x-cmd.com/draw/explore?type=radar&t=evil&labels=perf,docs,tests,dx&series=v1:7,5,8,6&series=v2:8,8,9,8) |
| `gauge` | gauge (240° arc + center value)<br><br>**<u>`value`+`max` (default 100), value ≤ max; multi-ring ≤8</u>** | [![gauge example](https://x-cmd.com/draw?type=gauge&title=CI%20pass%20rate&value=87&max=100&w=360)](https://x-cmd.com/draw/explore?type=gauge&title=CI%20pass%20rate&value=87&max=100) |
| `scatter` | scatter (two numeric axes, negatives supported; no value labels by default)<br><br>**<u>`x=&y=`, ≤200 points</u>** | [![scatter example](https://x-cmd.com/draw?type=scatter&x=1,2,3,4,5&y=4,5,3,6,5&title=Latency&w=360)](https://x-cmd.com/draw/explore?type=scatter&x=1,2,3,4,5&y=4,5,3,6,5&title=Latency) |
| `combo` | bars (`series=`) + line (`line=`) in one chart; `stack=1` to stack the bars<br><br>**<u>≤30 groups, ≤6 series total</u>** | [![combo example](https://x-cmd.com/draw?type=combo&labels=Mon,Tue,Wed,Thu,Fri&series=dl:120,180,150,210,240&line=growth:3.1,3.4,3.2,3.8,4.1&title=Downloads&w=360)](https://x-cmd.com/draw/explore?type=combo&labels=Mon,Tue,Wed,Thu,Fri&series=dl:120,180,150,210,240&line=growth:3.1,3.4,3.2,3.8,4.1&title=Downloads) |
| `sankey` | flow diagram with weighted bands<br><br>**<u>`labels=`+`links=A>B:30`, ≤24 nodes/60 links</u>** | [![sankey example](https://x-cmd.com/draw?type=sankey&labels=Visitors,Stars,Forks,PRs,Merged&links=Visitors>Stars:84;Stars>Forks:17;Forks>PRs:9;PRs>Merged:7&title=Contributor%20funnel&w=360)](https://x-cmd.com/draw/explore?type=sankey&labels=Visitors,Stars,Forks,PRs,Merged&links=Visitors>Stars:84;Stars>Forks:17;Forks>PRs:9;PRs>Merged:7&title=Contributor%20funnel) |
| `qr` | QR code<br><br>**<u>`d`=text (≤1000 chars), `fg`/`bg` colors, `title`/`unit` captions</u>** | [![qr example](https://x-cmd.com/draw?type=qr&d=https://github.com/x-cmd/draw&title=scan%20me&w=360)](https://x-cmd.com/draw/explore?type=qr&d=https://github.com/x-cmd/draw&title=scan%20me) |
