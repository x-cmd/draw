---
x-title: qr QR Code — x-cmd/draw
x-desc: Gráficos SVG para a era da IA: um único endpoint `/draw?type=. type=qr.
x-sidebar: draw
x-keywords: draw, qr, QR Code, svg, chart
---

# qr QR Code

`GET /draw?type=qr&...` — renderizar um gráfico

## Exemplos

**base url**

```text
https://x-cmd.com/draw?type=qr&d=https%3A%2F%2Fgithub.com%2Fx-cmd%2Fdraw&title=escaneie
```

![qr base url](https://x-cmd.com/draw?type=qr&d=https%3A%2F%2Fgithub.com%2Fx-cmd%2Fdraw&title=escaneie)

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

## Parâmetros

| Parâmetros | | |
|---|---|---|
| `d=` | texto/URL (≤1000 caracteres) | ✓ |
| `fg=` | cor dos módulos (hex) | ✗ |
| `bg=` | fundo (hex) | ✗ |
| `title=` | legenda sob o código | ✗ |
| `unit=` | linha pequena | ✗ |
| `t=` | família de estilo | ✗ |

## `t=`

| | |
|---|---|
| `base` |

## Armadilhas

- texto ≤1000 caracteres; codifique `#` como `%23`
- codifique espaços do título como `%20`
