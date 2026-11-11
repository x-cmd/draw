---
x-title: draw — SVG chart endpoint quick reference (13 chart types + common params + data formats)
x-desc: 'x-cmd/draw is a single-endpoint SVG chart service: GET /draw?type=... returns SVG. Supports 14 chart types: pie / bar / hbar / line / area / radar / gauge / scatter / combo / sankey / qr / quadrant / compass. Common params: t= (style), scheme=dark|light, num=all|peak|none, v=1, w/h=. Two data formats: flat params vs ?d= JSON.'
x-sidebar: draw overview
x-keywords: draw, svg, chart, pie chart, bar chart, line chart, radar chart, gauge, scatter, sankey, qr code, svg endpoint, x-cmd/draw
x-json-ld:
  '@context': https://schema.org
  '@graph':
    - '@type': TechArticle
      headline: 'draw — SVG chart endpoint quick reference'
      inLanguage: 'en'
      about: 'x-cmd/draw endpoint spec and common parameters'
---

# draw — SVG chart endpoint quick reference (13 chart types + common params + data formats)

---

## 1. What the endpoint is

`x-cmd/draw` is a single-endpoint SVG chart service:

```
GET  /draw?type=<chart-type>&...     # returns SVG (image)
POST /draw?type=<chart-type>&...     # creates permanent short URL
```

Returned SVG embeds a `<metadata>` node — **pure text, not binary**. Greppable, diffable, version-controllable.

Supports 14 chart types:

| type | chart | detail |
| --- | --- | --- |
| `pie` | pie chart | see [pie](../../2-data-charts/01-pie/en.md) |
| `bar` | bar chart | see [bar](../../2-data-charts/02-bar/en.md) |
| `hbar` | horizontal bar | see [hbar](../../2-data-charts/03-hbar/en.md) |
| `line` | line chart | see [line](../../2-data-charts/04-line/en.md) |
| `area` | area chart | see [area](../../2-data-charts/05-area/en.md) |
| `radar` | radar chart | see [radar](../../2-data-charts/06-radar/en.md) |
| `gauge` | gauge dial | see [gauge](../../2-data-charts/07-gauge/en.md) |
| `scatter` | scatter plot | see [scatter](../../2-data-charts/08-scatter/en.md) |
| `combo` | combo (bar + line) | see [combo](../../2-data-charts/09-combo/en.md) |
| `sankey` | sankey diagram | see [sankey](../../3-relations/01-sankey/en.md) |
| `qr` | QR code | see [qr](../../7-infographics/01-qr/en.md) |
| `quadrant` | 2×2 decision matrix | see [quadrant](../../4-strategy/01-quadrant/en.md) |
| `butterfly` | butterfly chart — two series back to back | see [butterfly](../../2-data-charts/11-butterfly/en.md) |
| `compass` | four-arrow compass | see [compass](../../4-strategy/02-compass/en.md) |

Beyond the `type=` charts, the same service draws the diagram kinds — each on its own path:

| path | diagram | detail |
| --- | --- | --- |
| `/draw/archmap` | grid architecture diagram | see [archmap](../../5-architecture/01-archmap/en.md) |
| `/draw/mindmap` | mind map | see [mindmap](../../5-architecture/02-mindmap/en.md) |
| `/draw/mermaid` | flowchart from Mermaid source | see [mermaid](../../5-architecture/03-mermaid/en.md) |
| `/draw/gantt` | Gantt chart | see [gantt](../../6-schedule/01-gantt/en.md) |
| `/draw/echarts` | any ECharts option — heatmaps, boxplots, maps | see [maps](../../8-maps/01-maps/en.md) |

---

## 2. Common parameters

| param | meaning | default |
| --- | --- | --- |
| `t=` | style / theme (e.g., `evil` / `market-mono` / `progress` / `revenue`) | per-chart default |
| `scheme=dark\|light` | color scheme | follows system |
| `num=all\|peak\|none` | numeric label density (all / only peak / none) | `all` |
| `v=1` | freeze response (for debug / cache) | — |
| `w=` / `h=` | SVG width / height (px or CSS units) | per-chart default |
| `title=` | chart title | — |
| `unit=` | numeric unit (e.g., `B`, `responses`, `%`) | — |
| `labels=` / `values=` / `series=` | data (varies by chart) | — |

Full style / theme catalog in [styles](../03-styles/en.md); flat-vs-JSON data format comparison in [data formats](../04-data-and-api/en.md).

---

## 3. Two data formats

Every chart supports both formats — output is identical:

### Format A: flat params (URL always readable)

```
/draw?type=pie&title=Chrome%20holds&labels=Chrome,Safari,Firefox&values=65,18,7
```

### Format B: `?d=` JSON (cleaner for big data)

```
/draw?type=pie&d={"title":"Chrome holds","data":[{"label":"Chrome","value":65},{"label":"Safari","value":18},{"label":"Firefox","value":7}]}
```

**Which to use**:
- Small data (≤ 5 items) → **A**, URL short, shareable
- Big data / structured → **B**, URL still readable

Full comparison, JSON schema, edge cases in [data formats](../04-data-and-api/en.md).

---

## 4. GET vs POST

| Method | purpose | returns |
|---|---|---|
| `GET /draw?...` | one-shot SVG | `image/svg+xml` (or redirect to CDN) |
| `POST /draw?...` | create permanent short URL | `{ "id": "...", "url": "/d/abc123" }` |

POST short URLs are useful for:
- Charts embedded in docs (stable URL)
- README badges / issue comments
- Long-term sharing

---

## 5. What the SVG looks like

Every SVG looks like:

```xml
<svg viewBox="0 0 600 400" xmlns="...">
  <metadata>
    <title>Chrome holds the browser market</title>
    <desc>Generated by x-cmd/draw</desc>
    <source>/draw?type=pie&amp;labels=Chrome,Safari,Firefox</source>
  </metadata>
  <!-- actual graphic elements -->
</svg>
```

**Key point**: SVG is **pure text**, not PNG/JPEG binary. You can:
- `grep "<text>"` to find all labels
- `git diff` to see chart changes
- paste directly in issues / Slack

---

## 6. Quick start

```sh
# Pie chart
curl "https://x-cmd.com/draw?type=pie&labels=A,B,C&values=10,20,30"

# Line chart
curl "https://x-cmd.com/draw?type=line&x=Jan,Feb,Mar&y=10,20,15"

# QR code
curl "https://x-cmd.com/draw?type=qr&data=https://x-cmd.com"

# Switch to dark theme
curl "https://x-cmd.com/draw?type=pie&labels=A,B,C&values=10,20,30&scheme=dark"

# Freeze version (cache-friendly)
curl "https://x-cmd.com/draw?type=pie&labels=A,B,C&values=10,20,30&v=1"
```

Each chart's specifics in its dedicated article.