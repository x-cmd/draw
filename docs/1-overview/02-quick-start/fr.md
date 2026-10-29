---
x-title: Français — draw quick start
x-desc: Des graphiques SVG pour l’ère de l’IA : un seul endpoint `/draw?type=.
x-sidebar: draw
x-keywords: draw, quickstart, svg, chart
---

# draw — Des graphiques SVG avec les données dans l’URL

Des graphiques SVG pour l’ère de l’IA : un seul endpoint `/draw?type=...`, les données dans l’URL et un `<metadata>` lisible par machine dans chaque sortie. Le système de styles suit une spec de design, avec plusieurs variantes par type de graphique.

## Aperçu

```text
https://x-cmd.com/draw?type=pie&labels=A,B&values=3,2
```

![pie](https://x-cmd.com/draw?type=pie&labels=A,B&values=3,2)

## Trois façons de l’utiliser

**Service hébergé (zéro installation)** · **Bibliothèque npm + CLI (hors ligne, synchrone)** · Deno:

```ts
import { draw } from "jsr:@x-cmd/draw";
const { svg } = draw({ type: "pie", labels: "A,B", values: "3,2" });
```

## Endpoints

| type | | |
|---|---|---|
| `pie` | Donut ; `donut=0` = camembert plein | ≤100 classes (>9 → Other) |
| `bar` | Colonnes groupées ; `stack=1` empilées | ≤30 groupes |
| `hbar` | Barres horizontales (classements) | ≤30 barres |
| `line` | Courbe lisse + dégradé / multicourbes | ≤60 points |
| `area` | Aire / multi-aires | ≤60 points |
| `radar` | Radar | 3–12 axes |
| `gauge` | Jauge (arc 240°, valeur centrale) | value+max ; anneaux ≤8 |
| `scatter` | Nuage de points, deux axes numériques, négatifs ok | x=&y=, ≤200 points |
| `combo` | Colonnes (`series=`) + ligne (`line=`) ; double axe au-delà de 5× d’écart | ≤30 groupes, ≤6 séries |
| `sankey` | Diagramme de flux pondéré | labels=+links=A>B:30, ≤24 nœuds |
| `qr` | QR code | d≤1000 caractères, fg/bg, title/unit |

Code Apache-2.0 ; polices OFL — [README (EN)](../../../README.md)
