---
x-title: gauge medidor — x-cmd/draw
x-desc: Gráficos SVG para la era de la IA: un único endpoint `/draw?type=. type=gauge.
x-sidebar: draw
x-keywords: draw, gauge, medidor, svg, chart
---

# gauge medidor

`GET /draw?type=gauge&...` — renderizar un gráfico

## Ejemplos

**base**

```text
https://x-cmd.com/draw?type=gauge&title=Tasa%20de%20CI&value=87&max=100
```

![gauge base](https://x-cmd.com/draw?type=gauge&title=Tasa%20de%20CI&value=87&max=100)

**gradient**

```text
https://x-cmd.com/draw?type=gauge&t=gradient&title=Tasa%20de%20CI&value=87&max=100
```

![gauge gradient](https://x-cmd.com/draw?type=gauge&t=gradient&title=Tasa%20de%20CI&value=87&max=100)

**reliability**

```text
https://x-cmd.com/draw?type=gauge&t=reliability&title=Tasa%20de%20CI&value=99.9&max=100
```

![gauge reliability](https://x-cmd.com/draw?type=gauge&t=reliability&title=Tasa%20de%20CI&value=99.9&max=100)

## Parámetros

| Parámetros | | |
|---|---|---|
| `value=` | valor actual | ✓ |
| `max=` | máximo (por defecto 100) | ✗ |
| `labels=` | etiquetas de anillos (multianillo) | ✗ |
| `values=` | valores de anillos (porcentaje) | ✗ |
| `title=` | título | ✗ |
| `t=` | familia de estilo | ✗ |

## `t=`

| | |
|---|---|
| `base` |
| `gradient` |
| `reliability` |

## Errores comunes

- un valor por gráfico; varios valores → combo/line
- codifica los espacios del título como `%20`
