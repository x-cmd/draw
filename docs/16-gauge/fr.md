---
x-title: gauge jauge — x-cmd/draw
x-desc: Des graphiques SVG pour l’ère de l’IA : un seul endpoint `/draw?type=. type=gauge.
x-sidebar: draw
x-keywords: draw, gauge, jauge, svg, chart
---

# gauge jauge

`GET /draw?type=gauge&...` — rendre un graphique

## Exemples

**base**

```text
https://x-cmd.com/draw?type=gauge&title=Taux%20de%20CI&value=87&max=100
```

![gauge base](https://x-cmd.com/draw?type=gauge&title=Taux%20de%20CI&value=87&max=100)

**gradient**

```text
https://x-cmd.com/draw?type=gauge&t=gradient&title=Taux%20de%20CI&value=87&max=100
```

![gauge gradient](https://x-cmd.com/draw?type=gauge&t=gradient&title=Taux%20de%20CI&value=87&max=100)

**reliability**

```text
https://x-cmd.com/draw?type=gauge&t=reliability&title=Taux%20de%20CI&value=99.9&max=100
```

![gauge reliability](https://x-cmd.com/draw?type=gauge&t=reliability&title=Taux%20de%20CI&value=99.9&max=100)

## Paramètres

| Paramètres | | |
|---|---|---|
| `value=` | valeur actuelle | ✓ |
| `max=` | maximum (défaut 100) | ✗ |
| `labels=` | étiquettes des anneaux (multi-anneaux) | ✗ |
| `values=` | valeurs des anneaux (pourcentage) | ✗ |
| `title=` | titre | ✗ |
| `t=` | famille de style | ✗ |

## `t=`

| | |
|---|---|
| `base` |
| `gradient` |
| `reliability` |

## Pièges

- une valeur par graphique ; plusieurs valeurs → combo/line
- encodez les espaces du titre en `%20`
