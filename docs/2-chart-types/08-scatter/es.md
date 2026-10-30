---
x-title: scatter dispersión — x-cmd/draw
x-desc: Gráficos SVG para la era de la IA: un único endpoint `/draw?type=. type=scatter.
x-sidebar: draw
x-keywords: draw, scatter, dispersión, svg, chart
---

# scatter dispersión

`GET /draw?type=scatter&...` — renderizar un gráfico

## Ejemplos

**base**

```text
https://x-cmd.com/draw?type=scatter&x=1,2,3,4,5&y=4,5,3,6,5&title=Latencia
```

![scatter base](https://x-cmd.com/draw?type=scatter&x=1,2,3,4,5&y=4,5,3,6,5&title=Latencia)

**base neg**

```text
https://x-cmd.com/draw?type=scatter&x=-3,-1,0,1,3&y=2,-2,3,-3,1&title=Latencia
```

![scatter base neg](https://x-cmd.com/draw?type=scatter&x=-3,-1,0,1,3&y=2,-2,3,-3,1&title=Latencia)

**base num**

```text
https://x-cmd.com/draw?type=scatter&x=1,2,3&y=2,4,3&num=all&title=Latencia
```

![scatter base num](https://x-cmd.com/draw?type=scatter&x=1,2,3&y=2,4,3&num=all&title=Latencia)

## Parámetros

| Parámetros | | |
|---|---|---|
| `x=` | valores x | ✓ |
| `y=` | valores y | ✓ |
| `title=` | título | ✗ |
| `num=` | marcas de valor: all/peak/none | ✗ |
| `t=` | familia de estilo | ✗ |

## `t=`

| | |
|---|---|
| `base` |

## Errores comunes

- ≤200 puntos por serie; se permiten negativos
- codifica los espacios del título como `%20`
