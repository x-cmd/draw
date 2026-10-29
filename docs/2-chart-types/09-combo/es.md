---
x-title: combo combinado — x-cmd/draw
x-desc: Gráficos SVG para la era de la IA: un único endpoint `/draw?type=. type=combo.
x-sidebar: draw
x-keywords: draw, combo, combinado, svg, chart
---

# combo combinado

`GET /draw?type=combo&...` — renderizar un gráfico

## Ejemplos

**base**

```text
https://x-cmd.com/draw?type=combo&labels=Lun,Mar,Mi%C3%A9,Jue,Vie,S%C3%A1b,Dom&series=Descargas:120,180,150,210,240,200,260&line=Crecimiento:3.1,3.4,3.2,3.8,4.1,3.9,4.5&title=Descargas%20semanales&unit=dl
```

![combo base](https://x-cmd.com/draw?type=combo&labels=Lun,Mar,Mi%C3%A9,Jue,Vie,S%C3%A1b,Dom&series=Descargas:120,180,150,210,240,200,260&line=Crecimiento:3.1,3.4,3.2,3.8,4.1,3.9,4.5&title=Descargas%20semanales&unit=dl)

**evil**

```text
https://x-cmd.com/draw?type=combo&t=evil&labels=Lun,Mar,Mi%C3%A9&series=Descargas:9,12,15&line=Crecimiento:1.1,1.4,1.8&title=Descargas%20semanales
```

![combo evil](https://x-cmd.com/draw?type=combo&t=evil&labels=Lun,Mar,Mi%C3%A9&series=Descargas:9,12,15&line=Crecimiento:1.1,1.4,1.8&title=Descargas%20semanales)

## Parámetros

| Parámetros | | |
|---|---|---|
| `labels=` | etiquetas, separadas por comas | ✓ |
| `series=` | series `nombre:valores`, repetible | ✓ |
| `line=` | serie de línea `nombre:valores` | ✗ |
| `stack=` | 1 = apiladas | ✗ |
| `title=` | título | ✗ |
| `t=` | familia de estilo | ✗ |

## `t=`

| | |
|---|---|
| `base` |
| `evil` |

## Errores comunes

- barras + línea; doble eje desde 5× de diferencia
- codifica los espacios del título como `%20`
