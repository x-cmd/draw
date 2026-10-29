---
x-title: Română — draw quick start
x-desc: Grafice SVG pentru era AI: un singur endpoint `/draw?type=.
x-sidebar: draw
x-keywords: draw, quickstart, svg, chart
---

# draw — Grafice SVG cu datele în URL

Grafice SVG pentru era AI: un singur endpoint `/draw?type=...`, datele în URL și `<metadata>` lizibil de mașini în fiecare rezultat. Sistemul de stiluri urmează o specificație de design, cu mai multe variante pe tip de grafic.

## Previzualizare

```text
https://x-cmd.com/draw?type=pie&labels=A,B&values=3,2
```

![pie](https://x-cmd.com/draw?type=pie&labels=A,B&values=3,2)

## Trei moduri de utilizare

**Serviciu găzduit (zero instalare)** · **Bibliotecă npm + CLI (offline, sincron)** · Deno:

```ts
import { draw } from "jsr:@x-cmd/draw";
const { svg } = draw({ type: "pie", labels: "A,B", values: "3,2" });
```

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

Cod Apache-2.0; fonturi OFL — [README (EN)](../../../README.md)
