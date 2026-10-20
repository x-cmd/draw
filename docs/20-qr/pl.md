---
x-title: qr kod QR — x-cmd/draw
x-desc: Wykresy SVG dla ery AI: jeden endpoint `/draw?type=. type=qr.
x-sidebar: draw
x-keywords: draw, qr, kod QR, svg, chart
---

# qr kod QR

`GET /draw?type=qr&...` — wyrenderować wykres

## Przykłady

**base url**

```text
https://x-cmd.com/draw?type=qr&d=https%3A%2F%2Fgithub.com%2Fx-cmd%2Fdraw&title=zeskanuj
```

![qr base url](https://x-cmd.com/draw?type=qr&d=https%3A%2F%2Fgithub.com%2Fx-cmd%2Fdraw&title=zeskanuj)

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

## Parametry

| Parametry | | |
|---|---|---|
| `d=` | tekst/URL (≤1000 znaków) | ✓ |
| `fg=` | kolor modułów (hex) | ✗ |
| `bg=` | tło (hex) | ✗ |
| `title=` | podpis pod kodem | ✗ |
| `unit=` | mały wiersz | ✗ |
| `t=` | rodzina stylu | ✗ |

## `t=`

| | |
|---|---|
| `base` |

## Pułapki

- tekst ≤1000 znaków; `#` koduj jako `%23`
- spacje w tytule koduj jako `%20`
