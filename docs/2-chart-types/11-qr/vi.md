---
x-title: qr mã QR — x-cmd/draw
x-desc: Biểu đồ SVG cho thời đại AI: một endpoint `/draw?type=. type=qr.
x-sidebar: draw
x-keywords: draw, qr, mã QR, svg, chart
---

# qr mã QR

`GET /draw?type=qr&...` — vẽ biểu đồ

## Ví dụ

**base url**

```text
https://x-cmd.com/draw?type=qr&d=https%3A%2F%2Fgithub.com%2Fx-cmd%2Fdraw&title=qu%C3%A9t
```

![qr base url](https://x-cmd.com/draw?type=qr&d=https%3A%2F%2Fgithub.com%2Fx-cmd%2Fdraw&title=qu%C3%A9t)

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

## Tham số

| Tham số | | |
|---|---|---|
| `d=` | văn bản/URL (≤1000 ký tự) | ✓ |
| `fg=` | màu module (hex) | ✗ |
| `bg=` | nền (hex) | ✗ |
| `title=` | chú thích dưới mã | ✗ |
| `unit=` | dòng nhỏ | ✗ |
| `t=` | họ phong cách | ✗ |

## `t=`

| | |
|---|---|
| `base` |

## Bẫy

- văn bản ≤1000 ký tự; mã hóa `#` thành `%23`
- mã hóa khoảng trắng trong tiêu đề thành `%20`
