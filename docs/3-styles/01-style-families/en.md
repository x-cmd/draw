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
| `pie` | `opendata` | `evil` `evil-mono` `market-mono` `progress` `revenue` | [pie](../../2-chart-types/01-data-charts/01-pie/en.md) |
| `bar` | `evil` | — | [bar](../../2-chart-types/01-data-charts/02-bar/en.md) |
| `hbar` | `evil` | — | [hbar](../../2-chart-types/01-data-charts/03-hbar/en.md) |
| `line` | `evil` | — | [line](../../2-chart-types/01-data-charts/04-line/en.md) |
| `area` | `evil` | — | [area](../../2-chart-types/01-data-charts/05-area/en.md) |
| `radar` | `evil` | — | [radar](../../2-chart-types/01-data-charts/06-radar/en.md) |
| `gauge` | default has color change | — | [gauge](../../2-chart-types/01-data-charts/07-gauge/en.md) |
| `scatter` | `evil` | — | [scatter](../../2-chart-types/01-data-charts/08-scatter/en.md) |
| `combo` | `evil` | — | [combo](../../2-chart-types/01-data-charts/09-combo/en.md) |
| `sankey` | `evil` | — | [sankey](../../2-chart-types/02-relations/01-sankey/en.md) |
| `qr` | default black-on-white | `invert=1` flips | [qr](../../2-chart-types/06-infographics/01-qr/en.md) |

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