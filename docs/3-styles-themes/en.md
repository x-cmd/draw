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
| `pie` | `opendata` | `evil` `evil-mono` `market-mono` `progress` `revenue` | [10-pie](10-pie) |
| `bar` | `evil` | — | [11-bar](11-bar) |
| `hbar` | `evil` | — | [12-hbar](12-hbar) |
| `line` | `evil` | — | [13-line](13-line) |
| `area` | `evil` | — | [14-area](14-area) |
| `radar` | `evil` | — | [15-radar](15-radar) |
| `gauge` | default has color change | — | [16-gauge](16-gauge) |
| `scatter` | `evil` | — | [17-scatter](17-scatter) |
| `combo` | `evil` | — | [18-combo](18-combo) |
| `sankey` | `evil` | — | [19-sankey](19-sankey) |
| `qr` | default black-on-white | `invert=1` flips | [20-qr](20-qr) |

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