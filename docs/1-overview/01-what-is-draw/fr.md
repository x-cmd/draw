---
x-title: Français — draw overview
x-desc: Des graphiques SVG pour l’ère de l’IA : un seul endpoint `/draw?type=.
x-sidebar: draw
x-keywords: draw, overview, svg, chart, api
---

# draw — Des graphiques SVG avec les données dans l’URL

Des graphiques SVG pour l’ère de l’IA : un seul endpoint `/draw?type=...`, les données dans l’URL et un `<metadata>` lisible par machine dans chaque sortie. Le système de styles suit une spec de design, avec plusieurs variantes par type de graphique.

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

## Versionnage

- sans `v` : dernière version, cache 300 s
- `v=N` : version épinglée, cache 1 jour
- `immutable` uniquement pour `/c/<hash>`

## Adapté à l’IA

Chaque SVG embarque du JSON : `{generator, template, version, spec}` — données et paramètres font l’aller-retour directement ; le texte est du vrai `<text>`.
