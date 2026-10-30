---
x-title: qr código QR — x-cmd/draw
x-desc: Gráficos SVG para la era de la IA: un único endpoint `/draw?type=. type=qr.
x-sidebar: draw
x-keywords: draw, qr, código QR, svg, chart
---

# qr código QR

`GET /draw?type=qr&...` — renderizar un gráfico

## Ejemplos

**base url**

```text
https://x-cmd.com/draw?type=qr&d=https%3A%2F%2Fgithub.com%2Fx-cmd%2Fdraw&title=escan%C3%A9ame
```

![qr base url](https://x-cmd.com/draw?type=qr&d=https%3A%2F%2Fgithub.com%2Fx-cmd%2Fdraw&title=escan%C3%A9ame)

**base wifi**

```text
https://x-cmd.com/draw?type=qr&d=WIFI%3AS%3AMyWiFi%3BT%3AWPA%3BP%3Apassword123%3B%3B&title=wifi
```

![qr base wifi](https://x-cmd.com/draw?type=qr&d=WIFI%3AS%3AMyWiFi%3BT%3AWPA%3BP%3Apassword123%3B%3B&title=wifi)

**base color**

```text
https://x-cmd.com/draw?type=qr&d=https%3A%2F%2Fx-cmd.com&fg=%236366f1&bg=%230f0f12&title=x-cmd
```

![qr base color](https://x-cmd.com/draw?type=qr&d=https%3A%2F%2Fx-cmd.com&fg=%236366f1&bg=%230f0f12&title=x-cmd)

## Parámetros

| Parámetros | | |
|---|---|---|
| `d=` | texto/URL (≤1000 caracteres) | ✓ |
| `fg=` | color de módulos (hex) | ✗ |
| `bg=` | fondo (hex) | ✗ |
| `title=` | leyenda bajo el código | ✗ |
| `unit=` | línea pequeña | ✗ |
| `t=` | familia de estilo | ✗ |

## `t=`

| | |
|---|---|
| `base` |

## Errores comunes

- texto ≤1000 caracteres; codifica `#` como `%23`
- codifica los espacios del título como `%20`
