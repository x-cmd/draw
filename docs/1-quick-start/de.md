---
x-title: Deutsch — draw quick start
x-desc: SVG-Diagramme für das KI-Zeitalter: ein Endpunkt `/draw?type=.
x-sidebar: draw
x-keywords: draw, quickstart, svg, chart
---

# draw — SVG-Diagramme, deren Daten in der URL leben

SVG-Diagramme für das KI-Zeitalter: ein Endpunkt `/draw?type=...`, Daten in der URL, maschinenlesbarer `<metadata>` in jeder Ausgabe. Das Stilsystem folgt einer Designer-Spezifikation, mit mehreren Stilvarianten pro Diagrammtyp.

## Vorschau

```text
https://x-cmd.com/draw?type=pie&labels=A,B&values=3,2
```

![pie](https://x-cmd.com/draw?type=pie&labels=A,B&values=3,2)

## Drei Wege der Nutzung

**Hosted Service (null Installation)** · **npm-Bibliothek + CLI (offline, synchron)** · Deno:

```ts
import { draw } from "jsr:@x-cmd/draw";
const { svg } = draw({ type: "pie", labels: "A,B", values: "3,2" });
```

## Endpunkte

| type | | |
|---|---|---|
| `pie` | Donut; `donut=0` = volle Kreis | ≤100 Klassen (>9 → Other) |
| `bar` | Gruppierte Säulen; `stack=1` gestapelt | ≤30 Gruppen |
| `hbar` | Horizontale Balken (Rankings) | ≤30 Balken |
| `line` | Glatte Linie + Verlauf / Mehrfachlinien | ≤60 Punkte |
| `area` | Fläche / Mehrfach-Flächen | ≤60 Punkte |
| `radar` | Radar | 3–12 Achsen |
| `gauge` | Messuhr (240°-Bogen, Mittelwert) | value+max; Ringe ≤8 |
| `scatter` | Streuung, zwei numerische Achsen, Negative ok | x=&y=, ≤200 Punkte |
| `combo` | Säulen (`series=`) + Linie (`line=`); Doppelachse ab 5× Spanne | ≤30 Gruppen, ≤6 Serien |
| `sankey` | Flussdiagramm mit Bandbreiten | labels=+links=A>B:30, ≤24 Knoten |
| `qr` | QR-Code | d≤1000 Zeichen, fg/bg, title/unit |

Code Apache-2.0; Schriftarten OFL — [README (EN)](../readme/en.md)
