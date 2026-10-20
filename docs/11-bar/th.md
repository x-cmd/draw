---
x-title: bar แท่งตั้ง — x-cmd/draw
x-desc: กราฟ SVG สำหรับยุค AI: endpoint เดียว `/draw?type=. type=bar.
x-sidebar: draw
x-keywords: draw, bar, แท่งตั้ง, svg, chart
---

# bar แท่งตั้ง

`GET /draw?type=bar&...` — เรนเดอร์กราฟ

## ตัวอย่าง

**evil**

```text
https://x-cmd.com/draw?type=bar&t=evil&labels=%E0%B8%88,%E0%B8%AD,%E0%B8%9E,%E0%B8%9E%E0%B8%A4,%E0%B8%A8,%E0%B8%AA,%E0%B8%AD%E0%B8%B2&series=%E0%B8%94%E0%B8%B2%E0%B8%A7%E0%B8%99%E0%B9%8C%E0%B9%82%E0%B8%AB%E0%B8%A5%E0%B8%94:34,87,51,63,45,78,39&series=%E0%B8%81%E0%B8%B2%E0%B8%A3%E0%B9%80%E0%B8%95%E0%B8%B4%E0%B8%9A%E0%B9%82%E0%B8%95:18,49,29,39,31,45,23
```

![bar evil](https://x-cmd.com/draw?type=bar&t=evil&labels=%E0%B8%88,%E0%B8%AD,%E0%B8%9E,%E0%B8%9E%E0%B8%A4,%E0%B8%A8,%E0%B8%AA,%E0%B8%AD%E0%B8%B2&series=%E0%B8%94%E0%B8%B2%E0%B8%A7%E0%B8%99%E0%B9%8C%E0%B9%82%E0%B8%AB%E0%B8%A5%E0%B8%94:34,87,51,63,45,78,39&series=%E0%B8%81%E0%B8%B2%E0%B8%A3%E0%B9%80%E0%B8%95%E0%B8%B4%E0%B8%9A%E0%B9%82%E0%B8%95:18,49,29,39,31,45,23)

**base**

```text
https://x-cmd.com/draw?type=bar&labels=%E0%B8%88,%E0%B8%AD,%E0%B8%9E&series=dev:12,18,9&series=CI:8,11,6
```

![bar base](https://x-cmd.com/draw?type=bar&labels=%E0%B8%88,%E0%B8%AD,%E0%B8%9E&series=dev:12,18,9&series=CI:8,11,6)

**grid**

```text
https://x-cmd.com/draw?type=bar&t=grid&labels=%E0%B8%88,%E0%B8%AD,%E0%B8%9E&values=12,18,9
```

![bar grid](https://x-cmd.com/draw?type=bar&t=grid&labels=%E0%B8%88,%E0%B8%AD,%E0%B8%9E&values=12,18,9)

**evil stack**

```text
https://x-cmd.com/draw?type=bar&stack=1&labels=%E0%B8%88,%E0%B8%AD,%E0%B8%9E&series=dev:12,18,9&series=CI:8,11,6
```

![bar evil stack](https://x-cmd.com/draw?type=bar&stack=1&labels=%E0%B8%88,%E0%B8%AD,%E0%B8%9E&series=dev:12,18,9&series=CI:8,11,6)

## พารามิเตอร์

| พารามิเตอร์ | | |
|---|---|---|
| `labels=` | ป้าย คั่นด้วยจุลภาค | ✓ |
| `values=` | ค่า คั่นด้วยจุลภาค | ✓ |
| `series=` | ชุด `ชื่อ:ค่า` ซ้ำได้ | ✗ |
| `stack=` | 1 = ซ้อนกัน | ✗ |
| `title=` | ชื่อเรื่อง | ✗ |
| `t=` | ตระกูลสไตล์ | ✗ |

## `t=`

| | |
|---|---|
| `evil` |
| `base` |
| `grid` |

## จุดที่ต้องระวัง

- ≤30 กลุ่ม, ≤6 ชุด
- ห่างกันมากจะซ้อนแบบเปอร์เซ็นต์อัตโนมัติ
- เข้ารหัสช่องว่างในชื่อเรื่องเป็น `%20`
