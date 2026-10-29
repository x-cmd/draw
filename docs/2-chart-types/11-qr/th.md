---
x-title: qr คิวอาร์โค้ด — x-cmd/draw
x-desc: กราฟ SVG สำหรับยุค AI: endpoint เดียว `/draw?type=. type=qr.
x-sidebar: draw
x-keywords: draw, qr, คิวอาร์โค้ด, svg, chart
---

# qr คิวอาร์โค้ด

`GET /draw?type=qr&...` — เรนเดอร์กราฟ

## ตัวอย่าง

**base url**

```text
https://x-cmd.com/draw?type=qr&d=https%3A%2F%2Fgithub.com%2Fx-cmd%2Fdraw&title=%E0%B8%AA%E0%B9%81%E0%B8%81%E0%B8%99
```

![qr base url](https://x-cmd.com/draw?type=qr&d=https%3A%2F%2Fgithub.com%2Fx-cmd%2Fdraw&title=%E0%B8%AA%E0%B9%81%E0%B8%81%E0%B8%99)

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

## พารามิเตอร์

| พารามิเตอร์ | | |
|---|---|---|
| `d=` | ข้อความ/URL (≤1000 อักขระ) | ✓ |
| `fg=` | สีโมดูล (hex) | ✗ |
| `bg=` | พื้นหลัง (hex) | ✗ |
| `title=` | คำบรรยายใต้โค้ด | ✗ |
| `unit=` | บรรทัดเล็ก | ✗ |
| `t=` | ตระกูลสไตล์ | ✗ |

## `t=`

| | |
|---|---|
| `base` |

## จุดที่ต้องระวัง

- ข้อความ ≤1000 อักขระ เข้ารหัส `#` เป็น `%23`
- เข้ารหัสช่องว่างในชื่อเรื่องเป็น `%20`
