---
x-title: qr QR kód — x-cmd/draw
x-desc: SVG grafy pro éru AI: jediný endpoint `/draw?type=. type=qr.
x-sidebar: draw
x-keywords: draw, qr, QR kód, svg, chart
---

# qr QR kód

`GET /draw?type=qr&...` — vykreslit graf

## Příklady

**base url**

```text
https://x-cmd.com/draw?type=qr&d=https%3A%2F%2Fgithub.com%2Fx-cmd%2Fdraw&title=skenuj
```

![qr base url](https://x-cmd.com/draw?type=qr&d=https%3A%2F%2Fgithub.com%2Fx-cmd%2Fdraw&title=skenuj)

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
| `d=` | text/URL (≤1000 znaků) | ✓ |
| `fg=` | barva modulů (hex) | ✗ |
| `bg=` | pozadí (hex) | ✗ |
| `title=` | popisek pod kódem | ✗ |
| `unit=` | malý řádek | ✗ |
| `t=` | rodina stylu | ✗ |

## `t=`

| | |
|---|---|
| `base` |

## Zádrhele

- text ≤1000 znaků; `#` kódujte jako `%23`
- mezery v názvu kódujte jako `%20`
