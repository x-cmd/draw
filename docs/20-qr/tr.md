---
x-title: qr QR kod — x-cmd/draw
x-desc: Yapay zekâ çağı için SVG grafikler: tek endpoint `/draw?type=. type=qr.
x-sidebar: draw
x-keywords: draw, qr, QR kod, svg, chart
---

# qr QR kod

`GET /draw?type=qr&...` — grafik çiz

## Örnekler

**base url**

```text
https://x-cmd.com/draw?type=qr&d=https%3A%2F%2Fgithub.com%2Fx-cmd%2Fdraw&title=tarat
```

![qr base url](https://x-cmd.com/draw?type=qr&d=https%3A%2F%2Fgithub.com%2Fx-cmd%2Fdraw&title=tarat)

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

## Parametreler

| Parametreler | | |
|---|---|---|
| `d=` | metin/URL (≤1000 karakter) | ✓ |
| `fg=` | modül rengi (hex) | ✗ |
| `bg=` | arka plan (hex) | ✗ |
| `title=` | kod altındaki açıklama | ✗ |
| `unit=` | küçük satır | ✗ |
| `t=` | stil ailesi | ✗ |

## `t=`

| | |
|---|---|
| `base` |

## Tuzaklar

- metin ≤1000 karakter; `#`’yi `%23` olarak kodla
- başlıktaki boşlukları `%20` olarak kodla
