---
x-title: qr kode QR — x-cmd/draw
x-desc: Grafik SVG untuk era AI: satu endpoint `/draw?type=. type=qr.
x-sidebar: draw
x-keywords: draw, qr, kode QR, svg, chart
---

# qr kode QR

`GET /draw?type=qr&...` — render grafik

## Contoh

**base url**

```text
https://x-cmd.com/draw?type=qr&d=https%3A%2F%2Fgithub.com%2Fx-cmd%2Fdraw&title=pindai
```

![qr base url](https://x-cmd.com/draw?type=qr&d=https%3A%2F%2Fgithub.com%2Fx-cmd%2Fdraw&title=pindai)

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
| `d=` | teks/URL (≤1000 karakter) | ✓ |
| `fg=` | warna modul (hex) | ✗ |
| `bg=` | latar (hex) | ✗ |
| `title=` | kapsi di bawah kode | ✗ |
| `unit=` | baris kecil | ✗ |
| `t=` | keluarga gaya | ✗ |

## `t=`

| | |
|---|---|
| `base` |

## Jebakan

- teks ≤1000 karakter; enkode `#` jadi `%23`
- enkode spasi pada judul jadi `%20`
