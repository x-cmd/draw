---
x-title: line línea — x-cmd/draw
x-desc: Gráficos SVG para la era de la IA: un único endpoint `/draw?type=. type=line.
x-sidebar: draw
x-keywords: draw, line, línea, svg, chart
---

# line línea

`GET /draw?type=line&...` — renderizar un gráfico

## Ejemplos

**shadcn**

```text
https://x-cmd.com/draw?type=line&labels=Ene,Feb,Mar,Abr,May,Jun&values=12,19,15,25,22,30&title=Estrellas%20por%20lenguaje
```

![line shadcn](https://x-cmd.com/draw?type=line&labels=Ene,Feb,Mar,Abr,May,Jun&values=12,19,15,25,22,30&title=Estrellas%20por%20lenguaje)

**evil**

```text
https://x-cmd.com/draw?type=line&t=evil&labels=Ene,Feb,Mar,Abr,May,Jun&series=Descargas:12,19,15,25,22,30&series=CI:8,11,9,14,12,10
```

![line evil](https://x-cmd.com/draw?type=line&t=evil&labels=Ene,Feb,Mar,Abr,May,Jun&series=Descargas:12,19,15,25,22,30&series=CI:8,11,9,14,12,10)

**evil-glow**

```text
https://x-cmd.com/draw?type=line&t=evil-glow&labels=Q1,Q2,Q3,Q4&values=3.1,3.4,3.2,3.8&title=Crecimiento
```

![line evil-glow](https://x-cmd.com/draw?type=line&t=evil-glow&labels=Q1,Q2,Q3,Q4&values=3.1,3.4,3.2,3.8&title=Crecimiento)

**opendata**

```text
https://x-cmd.com/draw?type=line&t=opendata&labels=v1,v2,v3&values=120,240,410&title=Descargas
```

![line opendata](https://x-cmd.com/draw?type=line&t=opendata&labels=v1,v2,v3&values=120,240,410&title=Descargas)

## Parámetros

| Parámetros | | |
|---|---|---|
| `labels=` | etiquetas, separadas por comas | ✓ |
| `values=` | valores, separados por comas | ✓ |
| `series=` | series `nombre:valores`, repetible | ✗ |
| `title=` | título | ✗ |
| `t=` | familia de estilo | ✗ |

## `t=`

| | |
|---|---|
| `shadcn` |
| `evil` |
| `evil-glow` |
| `evil-mono` |
| `opendata` |

## Errores comunes

- ≤60 puntos; con varias líneas solo se marca el pico de cada una
- codifica los espacios del título como `%20`
