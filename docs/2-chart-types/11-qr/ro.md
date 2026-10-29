---
x-title: qr cod QR — x-cmd/draw
x-desc: Grafice SVG pentru era AI: un singur endpoint `/draw?type=. type=qr.
x-sidebar: draw
x-keywords: draw, qr, cod QR, svg, chart
---

# qr cod QR

`GET /draw?type=qr&...` — randează un grafic

## Exemple

**base url**

```text
https://x-cmd.com/draw?type=qr&d=https%3A%2F%2Fgithub.com%2Fx-cmd%2Fdraw&title=scaneaz%C4%83
```

![qr base url](https://x-cmd.com/draw?type=qr&d=https%3A%2F%2Fgithub.com%2Fx-cmd%2Fdraw&title=scaneaz%C4%83)

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
| `d=` | text/URL (≤1000 caractere) | ✓ |
| `fg=` | culoarea modulelor (hex) | ✗ |
| `bg=` | fundal (hex) | ✗ |
| `title=` | legendă sub cod | ✗ |
| `unit=` | rând mic | ✗ |
| `t=` | familia stilului | ✗ |

## `t=`

| | |
|---|---|
| `base` |

## Capcane

- text ≤1000 caractere; codează `#` ca `%23`
- codează spațiile din titlu ca `%20`
