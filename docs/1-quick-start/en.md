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

Deeper docs: [2-overview](../2-overview/en.md), [3-styles-themes](../3-styles-themes/en.md), [4-self-hosting](../4-self-hosting/en.md), per-type references from [10-pie](../10-pie/en.md).

## The complete table (11 types)

| type | chart | example |
|---|---|---|
| `pie` | donut; `donut=0` for a solid pie<br><br>**<u>≤100 categories (>9 auto-merge into Other)</u>** | <a href="https://x-cmd.com/draw?type=pie&labels=TS,Py,Go,Rust&values=4821,2312,980,645&title=Stars%20by%20language"><img src="https://x-cmd.com/draw?type=pie&labels=TS,Py,Go,Rust&values=4821,2312,980,645&title=Stars%20by%20language" width="360" alt="pie example"></a> |
| `bar` | grouped columns; multi-series with `stack=1` for stacked<br><br>**<u>≤30 groups</u>** | <a href="https://x-cmd.com/draw?type=bar&labels=Mon,Tue,Wed&series=dev:12,18,9&series=ci:8,11,6"><img src="https://x-cmd.com/draw?type=bar&labels=Mon,Tue,Wed&series=dev:12,18,9&series=ci:8,11,6" width="360" alt="bar example"></a> |
| `hbar` | horizontal bars (rankings; labels left, values right)<br><br>**<u>≤30 bars, single series (some styles take two)</u>** | <a href="https://x-cmd.com/draw?type=hbar&labels=cli,core,docs,ui&values=42,31,18,9&title=Commits%20by%20area"><img src="https://x-cmd.com/draw?type=hbar&labels=cli,core,docs,ui&values=42,31,18,9&title=Commits%20by%20area" width="360" alt="hbar example"></a> |
| `line` | smooth line + gradient area / multi-line<br><br>**<u>≤60 points</u>** | <a href="https://x-cmd.com/draw?type=line&labels=Jan,Feb,Mar,Apr,May,Jun&values=12,19,15,25,22,30&title=Stars"><img src="https://x-cmd.com/draw?type=line&labels=Jan,Feb,Mar,Apr,May,Jun&values=12,19,15,25,22,30&title=Stars" width="360" alt="line example"></a> |
| `area` | area / multi-series area (gradient fill)<br><br>**<u>≤60 points</u>** | <a href="https://x-cmd.com/draw?type=area&labels=Q1,Q2,Q3,Q4&values=8,14,23,37&title=Downloads"><img src="https://x-cmd.com/draw?type=area&labels=Q1,Q2,Q3,Q4&values=8,14,23,37&title=Downloads" width="360" alt="area example"></a> |
| `radar` | radar chart<br><br>**<u>3–12 axes</u>** | <a href="https://x-cmd.com/draw?type=radar&t=evil&labels=perf,docs,tests,dx&series=v1:7,5,8,6&series=v2:8,8,9,8"><img src="https://x-cmd.com/draw?type=radar&t=evil&labels=perf,docs,tests,dx&series=v1:7,5,8,6&series=v2:8,8,9,8" width="360" alt="radar example"></a> |
| `gauge` | gauge (240° arc + center value)<br><br>**<u>`value`+`max` (default 100), value ≤ max; multi-ring ≤8</u>** | <a href="https://x-cmd.com/draw?type=gauge&title=CI%20pass%20rate&value=87&max=100"><img src="https://x-cmd.com/draw?type=gauge&title=CI%20pass%20rate&value=87&max=100" width="360" alt="gauge example"></a> |
| `scatter` | scatter (two numeric axes, negatives supported; no value labels by default)<br><br>**<u>`x=&y=`, ≤200 points</u>** | <a href="https://x-cmd.com/draw?type=scatter&x=1,2,3,4,5&y=4,5,3,6,5&title=Latency"><img src="https://x-cmd.com/draw?type=scatter&x=1,2,3,4,5&y=4,5,3,6,5&title=Latency" width="360" alt="scatter example"></a> |
| `combo` | bars (`series=`) + line (`line=`) in one chart; `stack=1` to stack the bars<br><br>**<u>≤30 groups, ≤6 series total</u>** | <a href="https://x-cmd.com/draw?type=combo&labels=Mon,Tue,Wed,Thu,Fri&series=dl:120,180,150,210,240&line=growth:3.1,3.4,3.2,3.8,4.1&title=Downloads"><img src="https://x-cmd.com/draw?type=combo&labels=Mon,Tue,Wed,Thu,Fri&series=dl:120,180,150,210,240&line=growth:3.1,3.4,3.2,3.8,4.1&title=Downloads" width="360" alt="combo example"></a> |
| `sankey` | flow diagram with weighted bands<br><br>**<u>`labels=`+`links=A>B:30`, ≤24 nodes/60 links</u>** | <a href="https://x-cmd.com/draw?type=sankey&labels=Visitors,Stars,Forks,PRs,Merged&links=Visitors>Stars:84;Stars>Forks:17;Forks>PRs:9;PRs>Merged:7&title=Contributor%20funnel"><img src="https://x-cmd.com/draw?type=sankey&labels=Visitors,Stars,Forks,PRs,Merged&links=Visitors>Stars:84;Stars>Forks:17;Forks>PRs:9;PRs>Merged:7&title=Contributor%20funnel" width="360" alt="sankey example"></a> |
| `qr` | QR code<br><br>**<u>`d`=text (≤1000 chars), `fg`/`bg` colors, `title`/`unit` captions</u>** | <a href="https://x-cmd.com/draw?type=qr&d=https://github.com/x-cmd/draw&title=scan%20me"><img src="https://x-cmd.com/draw?type=qr&d=https://github.com/x-cmd/draw&title=scan%20me" width="360" alt="qr example"></a> |
