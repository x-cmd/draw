---
x-title: scatter nuage de points — x-cmd/draw
x-desc: Des graphiques SVG pour l’ère de l’IA : un seul endpoint `/draw?type=. type=scatter.
x-sidebar: draw
x-keywords: draw, scatter, nuage de points, svg, chart
---

# scatter nuage de points

`GET /draw?type=scatter&...` — rendre un graphique

## Exemples

**base**

```text
https://x-cmd.com/draw?type=scatter&x=1,2,3,4,5&y=4,5,3,6,5&title=Latence
```

![scatter base](https://x-cmd.com/draw?type=scatter&x=1,2,3,4,5&y=4,5,3,6,5&title=Latence)

**base neg**

```text
https://x-cmd.com/draw?type=scatter&x=-3,-1,0,1,3&y=2,-2,3,-3,1&title=Latence
```

![scatter base neg](https://x-cmd.com/draw?type=scatter&x=-3,-1,0,1,3&y=2,-2,3,-3,1&title=Latence)

**base num**

```text
https://x-cmd.com/draw?type=scatter&x=1,2,3&y=2,4,3&num=all&title=Latence
```

![scatter base num](https://x-cmd.com/draw?type=scatter&x=1,2,3&y=2,4,3&num=all&title=Latence)

## Paramètres

| Paramètres | | |
|---|---|---|
| `x=` | valeurs x | ✓ |
| `y=` | valeurs y | ✓ |
| `title=` | titre | ✗ |
| `num=` | marques de valeur : all/peak/none | ✗ |
| `t=` | famille de style | ✗ |

## `t=`

| | |
|---|---|
| `base` |

## Pièges

- ≤200 points par série ; négatifs autorisés
- encodez les espaces du titre en `%20`
