---
x-title: bar colonnes — x-cmd/draw
x-desc: Des graphiques SVG pour l’ère de l’IA : un seul endpoint `/draw?type=. type=bar.
x-sidebar: draw
x-keywords: draw, bar, colonnes, svg, chart
---

# bar colonnes

`GET /draw?type=bar&...` — rendre un graphique

## Exemples

**evil**

```text
https://x-cmd.com/draw?type=bar&t=evil&labels=Lun,Mar,Mer,Jeu,Ven,Sam,Dim&series=T%C3%A9l%C3%A9chargements:34,87,51,63,45,78,39&series=Croissance:18,49,29,39,31,45,23
```

![bar evil](https://x-cmd.com/draw?type=bar&t=evil&labels=Lun,Mar,Mer,Jeu,Ven,Sam,Dim&series=T%C3%A9l%C3%A9chargements:34,87,51,63,45,78,39&series=Croissance:18,49,29,39,31,45,23)

**base**

```text
https://x-cmd.com/draw?type=bar&labels=Lun,Mar,Mer&series=dev:12,18,9&series=CI:8,11,6
```

![bar base](https://x-cmd.com/draw?type=bar&labels=Lun,Mar,Mer&series=dev:12,18,9&series=CI:8,11,6)

**grid**

```text
https://x-cmd.com/draw?type=bar&t=grid&labels=Lun,Mar,Mer&values=12,18,9
```

![bar grid](https://x-cmd.com/draw?type=bar&t=grid&labels=Lun,Mar,Mer&values=12,18,9)

**evil stack**

```text
https://x-cmd.com/draw?type=bar&stack=1&labels=Lun,Mar,Mer&series=dev:12,18,9&series=CI:8,11,6
```

![bar evil stack](https://x-cmd.com/draw?type=bar&stack=1&labels=Lun,Mar,Mer&series=dev:12,18,9&series=CI:8,11,6)

## Paramètres

| Paramètres | | |
|---|---|---|
| `labels=` | étiquettes, séparées par des virgules | ✓ |
| `values=` | valeurs, séparées par des virgules | ✓ |
| `series=` | séries `nom:valeurs`, répétable | ✗ |
| `stack=` | 1 = empilées | ✗ |
| `title=` | titre | ✗ |
| `t=` | famille de style | ✗ |

## `t=`

| | |
|---|---|
| `evil` |
| `base` |
| `grid` |

## Pièges

- ≤30 groupes, ≤6 séries
- avec des écarts extrêmes, empilement en pourcentage automatique
- encodez les espaces du titre en `%20`
