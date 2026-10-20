---
x-title: Italiano — draw quick start
x-desc: Grafici SVG per l’era dell’IA: un solo endpoint `/draw?type=.
x-sidebar: draw
x-keywords: draw, quickstart, svg, chart
---

# draw — Grafici SVG con i dati nell’URL

Grafici SVG per l’era dell’IA: un solo endpoint `/draw?type=...`, dati nell’URL e `<metadata>` leggibile dalle macchine in ogni output. Il sistema di stili segue una specifica di design, con più varianti per tipo di grafico.

## Anteprima

```text
https://x-cmd.com/draw?type=pie&labels=A,B&values=3,2
```

![pie](https://x-cmd.com/draw?type=pie&labels=A,B&values=3,2)

## Tre modi per usarlo

**Servizio ospitato (zero installazione)** · **Libreria npm + CLI (offline, sincrona)** · Deno:

```ts
import { draw } from "jsr:@x-cmd/draw";
const { svg } = draw({ type: "pie", labels: "A,B", values: "3,2" });
```

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

Codice Apache-2.0; fonti OFL — [README (EN)](../readme/en.md)
