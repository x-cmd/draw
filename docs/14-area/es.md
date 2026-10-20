---
x-title: area área — x-cmd/draw
x-desc: Gráficos SVG para la era de la IA: un único endpoint `/draw?type=. type=area.
x-sidebar: draw
x-keywords: draw, area, área, svg, chart
---

# area área

`GET /draw?type=area&...` — renderizar un gráfico

## Ejemplos

**evil**

```text
https://x-cmd.com/draw?type=area&labels=Lun,Mar,Mi%C3%A9&series=dev:30,42,38&series=CI:12,18,9&title=Descargas
```

![area evil](https://x-cmd.com/draw?type=area&labels=Lun,Mar,Mi%C3%A9&series=dev:30,42,38&series=CI:12,18,9&title=Descargas)

**star**

```text
https://x-cmd.com/draw?type=area&t=star&labels=Lun,Mar,Mi%C3%A9&values=3,5,4&title=Crecimiento
```

![area star](https://x-cmd.com/draw?type=area&t=star&labels=Lun,Mar,Mi%C3%A9&values=3,5,4&title=Crecimiento)

**opendata**

```text
https://x-cmd.com/draw?type=area&t=opendata&labels=2019,2020,2021,2022&values=1.2,2.8,6.4,14.1&title=Crecimiento&source=x-cmd.com%2Fdraw
```

![area opendata](https://x-cmd.com/draw?type=area&t=opendata&labels=2019,2020,2021,2022&values=1.2,2.8,6.4,14.1&title=Crecimiento&source=x-cmd.com%2Fdraw)

**pixel**

```text
https://x-cmd.com/draw?type=area&t=pixel&labels=a,b,c,d&values=2,4,3,5&title=Crecimiento
```

![area pixel](https://x-cmd.com/draw?type=area&t=pixel&labels=a,b,c,d&values=2,4,3,5&title=Crecimiento)

## Parámetros

| Parámetros | | |
|---|---|---|
| `labels=` | etiquetas, separadas por comas | ✓ |
| `values=` | valores, separados por comas | ✓ |
| `series=` | series `nombre:valores`, repetible | ✗ |
| `source=` | fuente de datos (solo area) | ✗ |
| `subtitle=` | subtítulo editorial (area opendata) | ✗ |
| `t=` | familia de estilo | ✗ |

## `t=`

| | |
|---|---|
| `evil` |
| `star` |
| `opendata` |
| `pixel` |
| `polka` |

## Errores comunes

- ≤60 puntos; con varias líneas solo se marca el pico de cada una
- codifica los espacios del título como `%20`
