---
x-title: styles quick reference — `t=` catalog per chart
x-desc: x-cmd/draw style (`t=`) cross-chart quick reference. Same style name renders differently per chart (e.g., `evil` is rounded sectors in pie, thick line in line). Per-chart dedicated articles have full examples; this is the cross-chart index.
x-sidebar: styles
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
| `pie` | `opendata` | `evil` `evil-mono` `market-mono` `progress` `revenue` `macaron` `wabi-sabi` `primer` `morandi` `nordic` `salmon` `neon` | [pie](../../2-data-charts/01-pie/en.md) |
| `bar` | `evil` | `macaron` `wabi-sabi` `primer` `morandi` `nordic` `salmon` `neon` | [bar](../../2-data-charts/02-bar/en.md) |
| `hbar` | `evil` | `macaron` `wabi-sabi` `primer` `morandi` `nordic` `salmon` `neon` | [hbar](../../2-data-charts/03-hbar/en.md) |
| `line` | `evil` | `macaron` `wabi-sabi` `primer` `morandi` `nordic` `salmon` `neon` | [line](../../2-data-charts/04-line/en.md) |
| `area` | `evil` | — | [area](../../2-data-charts/05-area/en.md) |
| `radar` | `evil` | — | [radar](../../2-data-charts/06-radar/en.md) |
| `gauge` | default has color change | — | [gauge](../../2-data-charts/07-gauge/en.md) |
| `scatter` | `evil` | — | [scatter](../../2-data-charts/08-scatter/en.md) |
| `combo` | `evil` | — | [combo](../../2-data-charts/09-combo/en.md) |
| `sankey` | `evil` | `macaron` `wabi-sabi` `primer` `morandi` `nordic` `salmon` `neon` | [sankey](../../3-relations/01-sankey/en.md) |
| `butterfly` | `base` (clean: no track, no vertical lines) | `track` (adds the track) `grid` (adds the tick lines) `scale` (both) | [butterfly](../../2-data-charts/11-butterfly/en.md) |
| `calendar` | `base` (Apple-like: white card, hairline rules, today in a red disc) | `mono` (greyscale, for print) | [calendar](../../2-data-charts/12-calendar/en.md) |
| `qr` | default black-on-white | `invert=1` flips | [qr](../../7-infographics/01-qr/en.md) |

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
| `macaron` | candy hues on a lightness ladder, cream card, big rounded corners, no gridlines | consumer apps, food & drink, kids, onboarding |
| `wabi-sabi` | earth tones — moss/bark/clay/sand, lime-plaster card, near-square corners | craft, interiors, slow living, food brands |
| `primer` | GitHub Primer functional accents, transparent canvas, hairline solid grid | READMEs, issues, PRs — anything embedded in github.com |
| `morandi` | every hue pulled toward grey, paper card, sage/mist-blue/dusty-mauve | restrained content products, culture, reading |
| `nordic` | cool snow/frost/fjord blues with terracotta & mustard accents | minimal products, home, nordic brands |
| `salmon` | salmon paper with claret/oxford/teal, editorial title | financial pages, research briefs |
| `neon` | near-black void with fluorescent cyan/magenta/lime, glowing lines | dev tools, terminals, cyber pages |

> These seven are **cross-chart skins**: one family name shares palette and neutrals (ink/card/grid) across pie/bar/hbar/line, with a matching dark set; architecture diagrams (`/draw/arch2`, `/draw/cloud`) take the same `t=` too. Palette source: [x-cmd/color](https://www.x-cmd.com/color/). A chart without that family silently falls back to its default (no error).

---

## 2.5. Semantic colors (`colors=` slots + `highlight=`)

Color decisions split in three layers: structural (axes/grid/ink — system), series defaults (positional — system), and **semantic (the data author names a slot; the system resolves it against the current `t=`)**. Each `colors=` item may be any of:

| form | meaning | example |
| --- | --- | --- |
| role slot | `primary` `success` `warning` `danger` `info` `accent` — resolved per `t=` | `colors=success,info,danger` |
| positional slot | `s1`..`s10` — the family palette's Nth color | `colors=s3,s1,s2` |
| hex | `#RRGGBB` literal (the human escape hatch; exits the theme) | `colors=%23FF0000` |

**Semantic survives skin changes**: `danger` is GitHub red `#CF222E` under `t=primer` and deep coral under `t=macaron`. Empty items keep positional alignment (`colors=primary,,info`). On multi-series charts (bar/line) `colors=` runs parallel to series; on pie/hbar parallel to categories. Legacy families without role tables (evil etc.) reject slot names with a 400 listing the families that support them — no silent fallback.

```sh
curl "https://www.x-cmd.com/draw?type=hbar&t=primer&labels=Stable,Beta,EOL&values=80,15,5&colors=success,info,danger"
```

`highlight=<label>` (comma-separate for several): named items keep their color, everything else drops to the family's own grey ladder — one signal, no new color.

```sh
curl "https://www.x-cmd.com/draw?type=pie&t=macaron&labels=...&highlight=Chrome"
```

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