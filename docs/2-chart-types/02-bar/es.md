---
x-title: bar columnas — x-cmd/draw
x-desc: Gráficos SVG para la era de la IA: un único endpoint `/draw?type=. type=bar.
x-sidebar: draw
x-keywords: draw, bar, columnas, svg, chart
---

# bar columnas

`GET /draw?type=bar&...` — renderizar un gráfico

## Ejemplos

**evil**

```text
https://x-cmd.com/draw?type=bar&t=evil&labels=Lun,Mar,Mi%C3%A9,Jue,Vie,S%C3%A1b,Dom&series=Descargas:34,87,51,63,45,78,39&series=Crecimiento:18,49,29,39,31,45,23
```

![bar evil](https://x-cmd.com/draw?type=bar&t=evil&labels=Lun,Mar,Mi%C3%A9,Jue,Vie,S%C3%A1b,Dom&series=Descargas:34,87,51,63,45,78,39&series=Crecimiento:18,49,29,39,31,45,23)

**base**

```text
https://x-cmd.com/draw?type=bar&labels=Lun,Mar,Mi%C3%A9&series=dev:12,18,9&series=CI:8,11,6
```

![bar base](https://x-cmd.com/draw?type=bar&labels=Lun,Mar,Mi%C3%A9&series=dev:12,18,9&series=CI:8,11,6)

**grid**

```text
https://x-cmd.com/draw?type=bar&t=grid&labels=Lun,Mar,Mi%C3%A9&values=12,18,9
```

![bar grid](https://x-cmd.com/draw?type=bar&t=grid&labels=Lun,Mar,Mi%C3%A9&values=12,18,9)

**evil stack**

```text
https://x-cmd.com/draw?type=bar&stack=1&labels=Lun,Mar,Mi%C3%A9&series=dev:12,18,9&series=CI:8,11,6
```

![bar evil stack](https://x-cmd.com/draw?type=bar&stack=1&labels=Lun,Mar,Mi%C3%A9&series=dev:12,18,9&series=CI:8,11,6)

## Parámetros

| Parámetros | | |
|---|---|---|
| `labels=` | etiquetas, separadas por comas | ✓ |
| `values=` | valores, separados por comas | ✓ |
| `series=` | series `nombre:valores`, repetible | ✗ |
| `stack=` | 1 = apiladas | ✗ |
| `title=` | título | ✗ |
| `t=` | familia de estilo | ✗ |

## `t=`

| | |
|---|---|
| `evil` |
| `base` |
| `grid` |

## Errores comunes

- ≤30 grupos, ≤6 series
- con diferencias extremas se apila en porcentaje automáticamente
- codifica los espacios del título como `%20`
