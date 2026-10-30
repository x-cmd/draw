---
x-title: pie anneau — x-cmd/draw
x-desc: Des graphiques SVG pour l’ère de l’IA : un seul endpoint `/draw?type=. type=pie.
x-sidebar: draw
x-keywords: draw, pie, anneau, svg, chart
---

# pie anneau

`GET /draw?type=pie&...` — rendre un graphique

## Exemples

**opendata**

```text
https://x-cmd.com/draw?type=pie&title=Plus%20grandes%20villes&unit=M%20hab.&labels=Paris,Marseille,Lyon,Toulouse&values=2.1,0.9,0.5,0.5
```

![pie opendata](https://x-cmd.com/draw?type=pie&title=Plus%20grandes%20villes&unit=M%20hab.&labels=Paris,Marseille,Lyon,Toulouse&values=2.1,0.9,0.5,0.5)

**evil**

```text
https://x-cmd.com/draw?type=pie&t=evil&title=Plus%20grandes%20villes&unit=M%20hab.&labels=Paris,Marseille,Lyon,Toulouse&values=2.1,0.9,0.5,0.5
```

![pie evil](https://x-cmd.com/draw?type=pie&t=evil&title=Plus%20grandes%20villes&unit=M%20hab.&labels=Paris,Marseille,Lyon,Toulouse&values=2.1,0.9,0.5,0.5)

**evil-mono**

```text
https://x-cmd.com/draw?type=pie&t=evil-mono&title=Plus%20grandes%20villes&unit=M%20hab.&labels=Paris,Marseille,Lyon,Toulouse&values=2.1,0.9,0.5,0.5
```

![pie evil-mono](https://x-cmd.com/draw?type=pie&t=evil-mono&title=Plus%20grandes%20villes&unit=M%20hab.&labels=Paris,Marseille,Lyon,Toulouse&values=2.1,0.9,0.5,0.5)

**market-mono**

```text
https://x-cmd.com/draw?type=pie&t=market-mono&title=Plus%20grandes%20villes&unit=M%20hab.&labels=Paris,Marseille,Lyon,Toulouse&values=2.1,0.9,0.5,0.5
```

![pie market-mono](https://x-cmd.com/draw?type=pie&t=market-mono&title=Plus%20grandes%20villes&unit=M%20hab.&labels=Paris,Marseille,Lyon,Toulouse&values=2.1,0.9,0.5,0.5)

**progress**

```text
https://x-cmd.com/draw?type=pie&t=progress&title=Plus%20grandes%20villes&unit=M%20hab.&labels=Paris,Marseille,Lyon,Toulouse&values=2.1,0.9,0.5,0.5
```

![pie progress](https://x-cmd.com/draw?type=pie&t=progress&title=Plus%20grandes%20villes&unit=M%20hab.&labels=Paris,Marseille,Lyon,Toulouse&values=2.1,0.9,0.5,0.5)

**revenue**

```text
https://x-cmd.com/draw?type=pie&t=revenue&title=Plus%20grandes%20villes&unit=M%20hab.&labels=Paris,Marseille,Lyon,Toulouse&values=2.1,0.9,0.5,0.5
```

![pie revenue](https://x-cmd.com/draw?type=pie&t=revenue&title=Plus%20grandes%20villes&unit=M%20hab.&labels=Paris,Marseille,Lyon,Toulouse&values=2.1,0.9,0.5,0.5)

## Paramètres

| Paramètres | | |
|---|---|---|
| `labels=` | étiquettes, séparées par des virgules | ✓ |
| `values=` | valeurs, séparées par des virgules | ✓ |
| `title=` | titre | ✗ |
| `unit=` | unité | ✗ |
| `donut=` | 0 = camembert plein | ✗ |
| `t=` | famille de style | ✗ |

## `t=`

| | |
|---|---|
| `opendata` |
| `evil` |
| `evil-mono` |
| `market-mono` |
| `progress` |
| `revenue` |

## Pièges

- ≤100 classes ; au-delà de 9, regroupement en Other
- camembert plein vs anneau, c’est seulement `donut=` — ne changez pas de style
- le contraste de certains styles change en mode sombre
- encodez les espaces du titre en `%20`
