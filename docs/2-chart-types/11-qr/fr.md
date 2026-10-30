---
x-title: qr QR code — x-cmd/draw
x-desc: Des graphiques SVG pour l’ère de l’IA : un seul endpoint `/draw?type=. type=qr.
x-sidebar: draw
x-keywords: draw, qr, QR code, svg, chart
---

# qr QR code

`GET /draw?type=qr&...` — rendre un graphique

## Exemples

**base url**

```text
https://x-cmd.com/draw?type=qr&d=https%3A%2F%2Fgithub.com%2Fx-cmd%2Fdraw&title=scannez
```

![qr base url](https://x-cmd.com/draw?type=qr&d=https%3A%2F%2Fgithub.com%2Fx-cmd%2Fdraw&title=scannez)

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

## Paramètres

| Paramètres | | |
|---|---|---|
| `d=` | texte/URL (≤1000 caractères) | ✓ |
| `fg=` | couleur des modules (hex) | ✗ |
| `bg=` | fond (hex) | ✗ |
| `title=` | légende sous le code | ✗ |
| `unit=` | petite ligne | ✗ |
| `t=` | famille de style | ✗ |

## `t=`

| | |
|---|---|
| `base` |

## Pièges

- texte ≤1000 caractères ; encodez `#` en `%23`
- encodez les espaces du titre en `%20`
