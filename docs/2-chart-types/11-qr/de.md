---
x-title: qr QR-Code — x-cmd/draw
x-desc: SVG-Diagramme für das KI-Zeitalter: ein Endpunkt `/draw?type=. type=qr.
x-sidebar: draw
x-keywords: draw, qr, QR-Code, svg, chart
---

# qr QR-Code

`GET /draw?type=qr&...` — Diagramm rendern

## Beispiele

**base url**

```text
https://x-cmd.com/draw?type=qr&d=https%3A%2F%2Fgithub.com%2Fx-cmd%2Fdraw&title=scannen
```

![qr base url](https://x-cmd.com/draw?type=qr&d=https%3A%2F%2Fgithub.com%2Fx-cmd%2Fdraw&title=scannen)

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

## Parameter

| Parameter | | |
|---|---|---|
| `d=` | Text/URL (≤1000 Zeichen) | ✓ |
| `fg=` | Modulfarbe (Hex) | ✗ |
| `bg=` | Hintergrund (Hex) | ✗ |
| `title=` | Beschriftung unter dem Code | ✗ |
| `unit=` | kleine Unterzeile | ✗ |
| `t=` | Stil-Familie | ✗ |

## `t=`

| | |
|---|---|
| `base` |

## Stolpersteine

- Text ≤1000 Zeichen; `#` als `%23` kodieren
- Leerzeichen im Titel als `%20` kodieren
