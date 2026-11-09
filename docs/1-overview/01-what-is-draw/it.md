---
x-title: Italiano — draw overview
x-desc: Grafici SVG per l’era dell’IA: un solo endpoint `/draw?type=.
x-sidebar: draw
x-keywords: draw, overview, svg, chart, api
---

# draw — Grafici SVG con i dati nell’URL

Grafici SVG per l’era dell’IA: un solo endpoint `/draw?type=...`, dati nell’URL e `<metadata>` leggibile dalle macchine in ogni output. Il sistema di stili segue una specifica di design, con più varianti per tipo di grafico.

## Endpoint

| type | | |
|---|---|---|
| `pie` | Ciambella; `donut=0` = torta piena | ≤100 classi (>9 → Other) |
| `bar` | Colonne raggruppate; `stack=1` impilate | ≤30 gruppi |
| `hbar` | Barre orizzontali (classifiche) | ≤30 barre |
| `line` | Linea morbida + gradiente / multilinea | ≤60 punti |
| `area` | Area / multi-area | ≤60 punti |
| `radar` | Radar | 3–12 assi |
| `gauge` | Indicatore (arco 240°, valore centrale) | value+max; anelli ≤8 |
| `scatter` | Dispersione, due assi numerici, negativi ok | x=&y=, ≤200 punti |
| `combo` | Colonne (`series=`) + linea (`line=`); doppio asse oltre 5× di scarto | ≤30 gruppi, ≤6 serie |
| `sankey` | Diagramma di flusso pesato | labels=+links=A>B:30, ≤24 nodi |
| `qr` | QR code | d≤1000 caratteri, fg/bg, title/unit |

## Versionamento

- senza `v`: ultima versione, cache 300 s
- `v=N`: versione fissata, cache 1 giorno
- `immutable` solo per `/c/<hash>`

## Adatto alle IA

Ogni SVG incorpora JSON: `{generator, template, version, spec}` — dati e parametri fanno round-trip diretto; il testo è vero `<text>`.
