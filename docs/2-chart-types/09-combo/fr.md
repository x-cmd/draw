---
x-title: combo combiné — x-cmd/draw
x-desc: Des graphiques SVG pour l’ère de l’IA : un seul endpoint `/draw?type=. type=combo.
x-sidebar: draw
x-keywords: draw, combo, combiné, svg, chart
---

# combo combiné

`GET /draw?type=combo&...` — rendre un graphique

## Exemples

**base**

```text
https://x-cmd.com/draw?type=combo&labels=Lun,Mar,Mer,Jeu,Ven,Sam,Dim&series=T%C3%A9l%C3%A9chargements:120,180,150,210,240,200,260&line=Croissance:3.1,3.4,3.2,3.8,4.1,3.9,4.5&title=T%C3%A9l%C3%A9chargements%20hebdo&unit=dl
```

![combo base](https://x-cmd.com/draw?type=combo&labels=Lun,Mar,Mer,Jeu,Ven,Sam,Dim&series=T%C3%A9l%C3%A9chargements:120,180,150,210,240,200,260&line=Croissance:3.1,3.4,3.2,3.8,4.1,3.9,4.5&title=T%C3%A9l%C3%A9chargements%20hebdo&unit=dl)

**evil**

```text
https://x-cmd.com/draw?type=combo&t=evil&labels=Lun,Mar,Mer&series=T%C3%A9l%C3%A9chargements:9,12,15&line=Croissance:1.1,1.4,1.8&title=T%C3%A9l%C3%A9chargements%20hebdo
```

![combo evil](https://x-cmd.com/draw?type=combo&t=evil&labels=Lun,Mar,Mer&series=T%C3%A9l%C3%A9chargements:9,12,15&line=Croissance:1.1,1.4,1.8&title=T%C3%A9l%C3%A9chargements%20hebdo)

## Paramètres

| Paramètres | | |
|---|---|---|
| `labels=` | étiquettes, séparées par des virgules | ✓ |
| `series=` | séries `nom:valeurs`, répétable | ✓ |
| `line=` | série ligne `nom:valeurs` | ✗ |
| `stack=` | 1 = empilées | ✗ |
| `title=` | titre | ✗ |
| `t=` | famille de style | ✗ |

## `t=`

| | |
|---|---|
| `base` |
| `evil` |

## Pièges

- barres + ligne ; double axe au-delà de 5× d’écart
- encodez les espaces du titre en `%20`
