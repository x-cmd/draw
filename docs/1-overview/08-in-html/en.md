---
x-title: Charts in an HTML report — one `<script>` line
x-desc: draw's browser entry: include one script and the chart draws itself — **no backend request**. The parameters are exactly the ones /draw takes — what is in the URL is the whole chart.
x-sidebar: Charts in reports
x-keywords: html report, script tag, client side rendering, csr, data-draw, embed chart, draw
x-json-ld:
  '@context': https://schema.org
  '@graph':
    - '@type': TechArticle
      headline: 'Charts in an HTML report — draw browser entry'
      inLanguage: 'en'
      about: 'x-cmd/draw client-side rendering (CSR) library'
---

# Charts in an HTML report

---

Include one script and the chart draws itself — **no backend request**.

```html
<script src="https://cdn.jsdelivr.net/npm/@x-cmd/draw@latest/client"></script>

<div data-draw="type=bar&labels=Jan,Feb,Mar&values=120,145,138&title=Monthly"></div>
```

That's all: open the page and the chart is there. The report can be a plain static HTML file — no server, no waiting for the network.

---

## 1. Two ways to use it

### A. Parameters on the element (simplest)

```html
<div data-draw="type=line&labels=W1,W2,W3&series=App:120,145,138&series=Web:80,95,110"></div>
```

The script scans `[data-draw]` on load and draws each one; **elements added later are drawn too** (useful for reports generated at runtime).

### B. Call it yourself (when you need to do something first)

```js
import { renderChartTo, autoRender } from '@x-cmd/draw/client';

renderChartTo(document.querySelector('#chart'), 'type=pie&labels=A,B&values=1,2');
autoRender(document);   // scans [data-draw]
```

---

## 2. The parameters are **exactly** the ones `/draw` takes

This is the important part: **the URL is the data**. Whatever is in the address bar *is* the chart — copy it into the report.

| Parameter | Example | Meaning |
|---|---|---|
| `type` | `type=bar` | chart kind (see below) |
| `labels` / `values` | `labels=Jan,Feb&values=1,2` | data for simple charts |
| `series` | `series=App:1,2&series=Web:3,4` | several series (name after the colon) |
| `title` / `unit` | `title=Monthly` | the title and unit on the chart |
| `t` | `t=macaron` | style family (same as `?t=`) |
| `scheme` | `scheme=light` | light/dark (default: follow the system) |
| `w` / `h` | `w=760&h=420` | canvas size (defaults come from the kind) |

⇒ The same parameters in an address bar (`/draw?type=bar&…`) and on an element
(`data-draw="type=bar&…"`) produce **the same chart**.

Kinds in v1 (the chart family):

`pie` `bar` `hbar` `line` `area` `gauge` `scatter` `combo` `sankey` `radar`
`qr` `quadrant` `compass` `butterfly` `calendar` `ladder` `butterfly-ladder`

---

## 3. It is interactive, not a picture

- **Hover** shows the value / the name / the row
- **Click a legend item** hides that series
- **Hover a legend item** lights up the whole series

⇒ a chart in a report you can read and query, not a screenshot.

---

## 4. It won't dirty your page

- The skin's colour variables live on `svg.chart` — they **don't** leak into the page
- No "Edit @X-CMD" badge (that belongs to the site's own pages)
- Style it however you like: the container is yours

---

## 5. Host it yourself (offline / intranet)

```sh
npm pack @x-cmd/draw        # or just copy dist/draw-client.iife.js (255 KB, minified IIFE)
```

```html
<script src="./draw-client.iife.js"></script>
<div data-draw="type=bar&labels=A,B&values=1,2"></div>
```

⇒ Draws fine with no internet.

---

## 6. Build your own (when you change the renderers)

```sh
git clone https://github.com/x-cmd/draw
cd draw && npm i && npm run build:client
# ⇒ dist/draw-client.iife.js
```

The renderers live in `src/render/` — they build strings, so they are environment
agnostic (a small DOM shim in the Worker, the real DOM in the browser).

---

**See also**: [parameters](/draw/docs/1-overview/07-params/) · [data formats](/draw/docs/1-overview/04-data-and-api/)
