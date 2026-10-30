---
x-title: Română — draw overview
x-desc: Grafice SVG pentru era AI: un singur endpoint `/draw?type=.
x-sidebar: draw
x-keywords: draw, overview, svg, chart, api
---

# draw — Grafice SVG cu datele în URL

Grafice SVG pentru era AI: un singur endpoint `/draw?type=...`, datele în URL și `<metadata>` lizibil de mașini în fiecare rezultat. Sistemul de stiluri urmează o specificație de design, cu mai multe variante pe tip de grafic.

## Endpoint-uri

| type | | |
|---|---|---|
| `pie` | Inel; `donut=0` = plin | ≤100 clase (>9 → Other) |
| `bar` | Coloane grupate; `stack=1` stivuite | ≤30 grupuri |
| `hbar` | Bare orizontale (clasamente) | ≤30 bare |
| `line` | Linie netedă + gradient / multilinie | ≤60 puncte |
| `area` | Arie / multi-arii | ≤60 puncte |
| `radar` | Radar | 3–12 axe |
| `gauge` | Indicator (arc 240°, valoare centrală) | value+max; inele ≤8 |
| `scatter` | Împrăștiere, două axe numerice, negative ok | x=&y=, ≤200 puncte |
| `combo` | Coloane (`series=`) + linie (`line=`); dublă axă de la 5× diferență | ≤30 grupuri, ≤6 serii |
| `sankey` | Diagramă de flux cu lățimi | labels=+links=A>B:30, ≤24 noduri |
| `qr` | Cod QR | d≤1000 caractere, fg/bg, title/unit |

## Versionare

- fără `v`: versiunea recentă, cache 300 s
- `v=N`: versiune fixată, cache 1 zi
- `immutable` doar pentru `/c/<hash>`

## Prietenos cu AI

Fiecare SVG include JSON: `{generator, template, version, spec}` — datele și parametrii fac round-trip direct; textul este `<text>` real.
