---
x-title: scatter dispersione — x-cmd/draw
x-desc: Grafici SVG per l’era dell’IA: un solo endpoint `/draw?type=. type=scatter.
x-sidebar: draw
x-keywords: draw, scatter, dispersione, svg, chart
---

# scatter dispersione

`GET /draw?type=scatter&...` — renderizzare un grafico

## Esempi

**base**

```text
https://x-cmd.com/draw?type=scatter&x=1,2,3,4,5&y=4,5,3,6,5&title=Latenza
```

![scatter base](https://x-cmd.com/draw?type=scatter&x=1,2,3,4,5&y=4,5,3,6,5&title=Latenza)

**base neg**

```text
https://x-cmd.com/draw?type=scatter&x=-3,-1,0,1,3&y=2,-2,3,-3,1&title=Latenza
```

![scatter base neg](https://x-cmd.com/draw?type=scatter&x=-3,-1,0,1,3&y=2,-2,3,-3,1&title=Latenza)

**base num**

```text
https://x-cmd.com/draw?type=scatter&x=1,2,3&y=2,4,3&num=all&title=Latenza
```

![scatter base num](https://x-cmd.com/draw?type=scatter&x=1,2,3&y=2,4,3&num=all&title=Latenza)

## Parametri

| Parametri | | |
|---|---|---|
| `x=` | valori x | ✓ |
| `y=` | valori y | ✓ |
| `title=` | titolo | ✗ |
| `num=` | marcatori di valore: all/peak/none | ✗ |
| `t=` | famiglia di stile | ✗ |

## `t=`

| | |
|---|---|
| `base` |

## Insidie

- ≤200 punti per serie; negativi ammessi
- codifica gli spazi del titolo come `%20`
