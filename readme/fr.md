# draw — Des graphiques SVG avec les données dans l’URL

> [English](../README.md) | **Français**

[![JSR score](https://img.shields.io/badge/dynamic/json?url=https%3A%2F%2Fapi.jsr.io%2Fscopes%2Fx-cmd%2Fpackages%2Fdraw&query=%24.score&label=JSR%20score&color=yellowgreen)](https://jsr.io/@x-cmd/draw/score)

Toutes les données vivent dans l’URL — ouvrez-la dans un navigateur, intégrez-la en `<img>` ou collez-la dans votre README : le SVG se génère aussitôt et reste lisible par les IA.

## Aperçu

### Anneau — plus grandes villes

```text
https://x-cmd.com/draw?type=pie&title=Population%20des%20plus%20grandes%20villes&unit=M%20hab.&labels=Paris,Marseille,Lyon,Toulouse&values=2.1,0.9,0.5,0.5
```

![Anneau — plus grandes villes](https://x-cmd.com/draw?type=pie&title=Population%20des%20plus%20grandes%20villes&unit=M%20hab.&labels=Paris,Marseille,Lyon,Toulouse&values=2.1,0.9,0.5,0.5)

### Barres — classement par domaine

```text
https://x-cmd.com/draw?type=hbar&labels=cli,core,docs,ui&values=42,31,18,9&title=Commits%20par%20domaine
```

![Barres — classement par domaine](https://x-cmd.com/draw?type=hbar&labels=cli,core,docs,ui&values=42,31,18,9&title=Commits%20par%20domaine)

### Combiné — téléchargements et croissance

```text
https://x-cmd.com/draw?type=combo&labels=Lun,Mar,Mer,Jeu,Ven,Sam,Dim&series=T%C3%A9l%C3%A9chargements:120,180,150,210,240,200,260&line=Croissance:3.1,3.4,3.2,3.8,4.1,3.9,4.5&title=T%C3%A9l%C3%A9chargements%20hebdomadaires&unit=dl
```

![Combiné — téléchargements et croissance](https://x-cmd.com/draw?type=combo&labels=Lun,Mar,Mer,Jeu,Ven,Sam,Dim&series=T%C3%A9l%C3%A9chargements:120,180,150,210,240,200,260&line=Croissance:3.1,3.4,3.2,3.8,4.1,3.9,4.5&title=T%C3%A9l%C3%A9chargements%20hebdomadaires&unit=dl)

### Sankey — cycle de vie des PR

```text
https://x-cmd.com/draw?type=sankey&t=pipeline&labels=feat,fix,docs,chore,merged,closed,rejected,0-1y,1-2y,2y%2B&links=feat%3Emerged:38;feat%3Eclosed:12;feat%3Erejected:8;fix%3Emerged:33;fix%3Eclosed:6;fix%3Erejected:2;docs%3Emerged:16;docs%3Eclosed:4;chore%3Emerged:5;chore%3Eclosed:6;chore%3Erejected:6;merged%3E0-1y:52;merged%3E1-2y:28;merged%3E2y%2B:12;closed%3E0-1y:14;closed%3E1-2y:9;closed%3E2y%2B:5;rejected%3E0-1y:9;rejected%3E1-2y:5;rejected%3E2y%2B:2&title=Pull%20requests%20lifecycle&unit=prs
```

![Sankey — cycle de vie des PR](https://x-cmd.com/draw?type=sankey&t=pipeline&labels=feat,fix,docs,chore,merged,closed,rejected,0-1y,1-2y,2y%2B&links=feat%3Emerged:38;feat%3Eclosed:12;feat%3Erejected:8;fix%3Emerged:33;fix%3Eclosed:6;fix%3Erejected:2;docs%3Emerged:16;docs%3Eclosed:4;chore%3Emerged:5;chore%3Eclosed:6;chore%3Erejected:6;merged%3E0-1y:52;merged%3E1-2y:28;merged%3E2y%2B:12;closed%3E0-1y:14;closed%3E1-2y:9;closed%3E2y%2B:5;rejected%3E0-1y:9;rejected%3E1-2y:5;rejected%3E2y%2B:2&title=Pull%20requests%20lifecycle&unit=prs)

## Trois façons de l’utiliser

```text
https://x-cmd.com/draw?type=pie&labels=A,B&values=3,2
```

```sh
npm install @x-cmd/draw
draw --type pie --labels "A,B" --values "3,2" --out pie.svg
```

```ts
import { draw } from "jsr:@x-cmd/draw";   // or npm:@x-cmd/draw
const { svg } = draw({ type: "pie", labels: "A,B", values: "3,2" });
```

## Tous les types de graphiques

| type | | |
|---|---|---|
| `pie` | Donut ; donut=0 = camembert | ≤100 classes |
| `bar` | Colonnes groupées ; stack=1 empilées | ≤30 groupes |
| `hbar` | Barres horizontales (classements) | ≤30 barres |
| `line` | Courbe lisse + dégradé | ≤60 points |
| `area` | Aire / multi-aires | ≤60 points |
| `radar` | Radar | 3–12 axes |
| `gauge` | Jauge (arc 240°) | value+max ; anneaux ≤8 |
| `scatter` | Nuage de points, négatifs ok | ≤200 points |
| `combo` | Barres + ligne, double axe | ≤6 séries |
| `sankey` | Diagramme de flux | ≤24 nœuds |
| `qr` | QR code | ≤1000 caractères |

---

Documentation complète (anglais): [README (EN)](../README.md) · [docs](../docs/) — Code Apache-2.0 ; polices OFL.
