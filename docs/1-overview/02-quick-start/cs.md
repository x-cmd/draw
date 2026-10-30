---
x-title: Čeština — draw quick start
x-desc: SVG grafy pro éru AI: jediný endpoint `/draw?type=.
x-sidebar: draw
x-keywords: draw, quickstart, svg, chart
---

# draw — SVG grafy s daty v URL

SVG grafy pro éru AI: jediný endpoint `/draw?type=...`, data v URL a strojově čitelný `<metadata>` v každém výstupu. Systém stylů odpovídá designerské specifikaci, s více variantami pro každý typ grafu.

## Náhled

```text
https://x-cmd.com/draw?type=pie&labels=A,B&values=3,2
```

![pie](https://x-cmd.com/draw?type=pie&labels=A,B&values=3,2)

## Tři způsoby použití

**Hostovaná služba (nulová instalace)** · **Knihovna npm + CLI (offline, synchronní)** · Deno:

```ts
import { draw } from "jsr:@x-cmd/draw";
const { svg } = draw({ type: "pie", labels: "A,B", values: "3,2" });
```

## Endpointy

| type | | |
|---|---|---|
| `pie` | Donut; `donut=0` = plný koláč | ≤100 tříd (>9 → Other) |
| `bar` | Skupinové sloupce; `stack=1` naskládané | ≤30 skupin |
| `hbar` | Vodorovné pruhy (žebříčky) | ≤30 pruhů |
| `line` | Hladká čára + gradient / více čar | ≤60 bodů |
| `area` | Plocha / více ploch | ≤60 bodů |
| `radar` | Radar | 3–12 os |
| `gauge` | Ukazatel (oblouk 240°, středová hodnota) | value+max; prstenců ≤8 |
| `scatter` | Bodový, dvě číselné osy, záporné ok | x=&y=, ≤200 bodů |
| `combo` | Sloupce (`series=`) + čára (`line=`); dvě osy od 5× rozdílu | ≤30 skupin, ≤6 řad |
| `sankey` | Tokový diagram s šířkami | labels=+links=A>B:30, ≤24 uzlů |
| `qr` | QR kód | d≤1000 znaků, fg/bg, title/unit |

Kód Apache-2.0; fonty OFL — [README (EN)](../../../README.md)
