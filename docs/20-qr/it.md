---
x-title: qr QR code — x-cmd/draw
x-desc: Grafici SVG per l’era dell’IA: un solo endpoint `/draw?type=. type=qr.
x-sidebar: draw
x-keywords: draw, qr, QR code, svg, chart
---

# qr QR code

`GET /draw?type=qr&...` — renderizzare un grafico

## Esempi

**base url**

```text
https://x-cmd.com/draw?type=qr&d=https%3A%2F%2Fgithub.com%2Fx-cmd%2Fdraw&title=scansionami
```

![qr base url](https://x-cmd.com/draw?type=qr&d=https%3A%2F%2Fgithub.com%2Fx-cmd%2Fdraw&title=scansionami)

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

## Parametri

| Parametri | | |
|---|---|---|
| `d=` | testo/URL (≤1000 caratteri) | ✓ |
| `fg=` | colore dei moduli (hex) | ✗ |
| `bg=` | sfondo (hex) | ✗ |
| `title=` | didascalia sotto il codice | ✗ |
| `unit=` | riga piccola | ✗ |
| `t=` | famiglia di stile | ✗ |

## `t=`

| | |
|---|---|
| `base` |

## Insidie

- testo ≤1000 caratteri; codifica `#` come `%23`
- codifica gli spazi del titolo come `%20`
