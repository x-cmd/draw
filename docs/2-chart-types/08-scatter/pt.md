---
x-title: scatter dispersão — x-cmd/draw
x-desc: Gráficos SVG para a era da IA: um único endpoint `/draw?type=. type=scatter.
x-sidebar: draw
x-keywords: draw, scatter, dispersão, svg, chart
---

# scatter dispersão

`GET /draw?type=scatter&...` — renderizar um gráfico

## Exemplos

**base**

```text
https://x-cmd.com/draw?type=scatter&x=1,2,3,4,5&y=4,5,3,6,5&title=Lat%C3%AAncia
```

![scatter base](https://x-cmd.com/draw?type=scatter&x=1,2,3,4,5&y=4,5,3,6,5&title=Lat%C3%AAncia)

**base neg**

```text
https://x-cmd.com/draw?type=scatter&x=-3,-1,0,1,3&y=2,-2,3,-3,1&title=Lat%C3%AAncia
```

![scatter base neg](https://x-cmd.com/draw?type=scatter&x=-3,-1,0,1,3&y=2,-2,3,-3,1&title=Lat%C3%AAncia)

**base num**

```text
https://x-cmd.com/draw?type=scatter&x=1,2,3&y=2,4,3&num=all&title=Lat%C3%AAncia
```

![scatter base num](https://x-cmd.com/draw?type=scatter&x=1,2,3&y=2,4,3&num=all&title=Lat%C3%AAncia)

## Parâmetros

| Parâmetros | | |
|---|---|---|
| `x=` | valores x | ✓ |
| `y=` | valores y | ✓ |
| `title=` | título | ✗ |
| `num=` | marcas de valor: all/peak/none | ✗ |
| `t=` | família de estilo | ✗ |

## `t=`

| | |
|---|---|
| `base` |

## Armadilhas

- ≤200 pontos por série; negativos permitidos
- codifique espaços do título como `%20`
