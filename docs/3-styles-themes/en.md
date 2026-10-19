---
x-title: styles quick reference — `t=` catalog per chart
x-desc: x-cmd/draw style (`t=`) cross-chart quick reference. Same style name renders differently per chart (e.g., `evil` is rounded sectors in pie, thick line in line). Per-chart dedicated articles have full examples; this is the cross-chart index.
x-sidebar: draw styles
x-keywords: draw styles, t=, evil, opendata, market-mono, progress, revenue
x-json-ld:
  '@context': https://schema.org
  '@graph':
    - '@type': TechArticle
      headline: 'draw styles quick reference'
      inLanguage: 'en'
      about: 'x-cmd/draw t= cross-chart index'
---

# styles quick reference — `t=` catalog per chart

---

Styles (`t=`) control chart visuals. **Same style renders differently per chart** — `evil` in pie is rounded sectors, in line is thick bold line.

---

## 1. Per-chart lookup

Each chart has its own default style and available `t=` list. See dedicated articles for full examples.

| chart | default `t=` | other available | dedicated article |
| --- | --- | --- | --- |
| `pie` | `opendata` | `evil` `evil-mono` `market-mono` `progress` `revenue` | [1-pie](../2-chart-types/en.md#pie) |
| `bar` | `evil` | — | [2-bar](../2-chart-types/en.md#bar) |
| `hbar` | `evil` | — | [3-hbar](../2-chart-types/en.md#hbar) |
| `line` | `evil` | — | [4-line](../2-chart-types/en.md#line) |
| `area` | `evil` | — | [5-area](../2-chart-types/en.md#area) |
| `radar` | `evil` | — | [6-radar](../2-chart-types/en.md#radar) |
| `gauge` | default has color change | — | [7-gauge](../2-chart-types/en.md#gauge) |
| `scatter` | `evil` | — | [8-scatter](../2-chart-types/en.md#scatter) |
| `combo` | `evil` | — | [9-combo](../2-chart-types/en.md#combo) |
| `sankey` | `evil` | — | [10-sankey](../2-chart-types/en.md#sankey) |
| `qr` | default black-on-white | `invert=1` flips | [11-qr](../2-chart-types/en.md#qr) |

---

## 2. Style catalog (by visual character)

| `t=` | visual | use case |
| --- | --- | --- |
| `opendata` | labels outside, editorial title, colored | general, market share, reports |
| `evil` | rounded, contrasting, white gaps | modern, strong visual |
| `evil-mono` | solid + leader lines outside, monochrome | B&W print, monochrome docs |
| `market-mono` | grayscale by share depth | business reports, formal |
| `progress` | dotted progress ring, center percentage | surveys, polls |
| `revenue` | diagonal gradient, right legend | revenue analysis, colorful |

---

## 3. Dark / light

Theme via `scheme=dark|light`. **All charts support it**.

```sh
# Force dark
curl "https://x-cmd.com/draw?type=pie&scheme=dark&labels=A,B,C&values=10,20,30"

# Default follows system
curl "https://x-cmd.com/draw?type=pie&labels=A,B,C&values=10,20,30"
```

When `scheme=dark`:
- Background darkens
- Text inverts
- Some styles (evil, revenue) auto-adjust color saturation

---

## 4. Pitfalls

- **Styles not universal**: not every chart supports all `t=` values — see per-chart article
- **Same `t=` renders very differently per chart**: `evil` is rounded sectors in pie, thick bold line in line
- **`scheme` affects color, not structure**