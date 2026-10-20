---
x-title: combo ผสม — x-cmd/draw
x-desc: กราฟ SVG สำหรับยุค AI: endpoint เดียว `/draw?type=. type=combo.
x-sidebar: draw
x-keywords: draw, combo, ผสม, svg, chart
---

# combo ผสม

`GET /draw?type=combo&...` — เรนเดอร์กราฟ

## ตัวอย่าง

**base**

```text
https://x-cmd.com/draw?type=combo&labels=%E0%B8%88,%E0%B8%AD,%E0%B8%9E,%E0%B8%9E%E0%B8%A4,%E0%B8%A8,%E0%B8%AA,%E0%B8%AD%E0%B8%B2&series=%E0%B8%94%E0%B8%B2%E0%B8%A7%E0%B8%99%E0%B9%8C%E0%B9%82%E0%B8%AB%E0%B8%A5%E0%B8%94:120,180,150,210,240,200,260&line=%E0%B8%81%E0%B8%B2%E0%B8%A3%E0%B9%80%E0%B8%95%E0%B8%B4%E0%B8%9A%E0%B9%82%E0%B8%95:3.1,3.4,3.2,3.8,4.1,3.9,4.5&title=%E0%B8%94%E0%B8%B2%E0%B8%A7%E0%B8%99%E0%B9%8C%E0%B9%82%E0%B8%AB%E0%B8%A5%E0%B8%94%E0%B8%A3%E0%B8%B2%E0%B8%A2%E0%B8%AA%E0%B8%B1%E0%B8%9B%E0%B8%94%E0%B8%B2%E0%B8%AB%E0%B9%8C&unit=dl
```

![combo base](https://x-cmd.com/draw?type=combo&labels=%E0%B8%88,%E0%B8%AD,%E0%B8%9E,%E0%B8%9E%E0%B8%A4,%E0%B8%A8,%E0%B8%AA,%E0%B8%AD%E0%B8%B2&series=%E0%B8%94%E0%B8%B2%E0%B8%A7%E0%B8%99%E0%B9%8C%E0%B9%82%E0%B8%AB%E0%B8%A5%E0%B8%94:120,180,150,210,240,200,260&line=%E0%B8%81%E0%B8%B2%E0%B8%A3%E0%B9%80%E0%B8%95%E0%B8%B4%E0%B8%9A%E0%B9%82%E0%B8%95:3.1,3.4,3.2,3.8,4.1,3.9,4.5&title=%E0%B8%94%E0%B8%B2%E0%B8%A7%E0%B8%99%E0%B9%8C%E0%B9%82%E0%B8%AB%E0%B8%A5%E0%B8%94%E0%B8%A3%E0%B8%B2%E0%B8%A2%E0%B8%AA%E0%B8%B1%E0%B8%9B%E0%B8%94%E0%B8%B2%E0%B8%AB%E0%B9%8C&unit=dl)

**evil**

```text
https://x-cmd.com/draw?type=combo&t=evil&labels=%E0%B8%88,%E0%B8%AD,%E0%B8%9E&series=%E0%B8%94%E0%B8%B2%E0%B8%A7%E0%B8%99%E0%B9%8C%E0%B9%82%E0%B8%AB%E0%B8%A5%E0%B8%94:9,12,15&line=%E0%B8%81%E0%B8%B2%E0%B8%A3%E0%B9%80%E0%B8%95%E0%B8%B4%E0%B8%9A%E0%B9%82%E0%B8%95:1.1,1.4,1.8&title=%E0%B8%94%E0%B8%B2%E0%B8%A7%E0%B8%99%E0%B9%8C%E0%B9%82%E0%B8%AB%E0%B8%A5%E0%B8%94%E0%B8%A3%E0%B8%B2%E0%B8%A2%E0%B8%AA%E0%B8%B1%E0%B8%9B%E0%B8%94%E0%B8%B2%E0%B8%AB%E0%B9%8C
```

![combo evil](https://x-cmd.com/draw?type=combo&t=evil&labels=%E0%B8%88,%E0%B8%AD,%E0%B8%9E&series=%E0%B8%94%E0%B8%B2%E0%B8%A7%E0%B8%99%E0%B9%8C%E0%B9%82%E0%B8%AB%E0%B8%A5%E0%B8%94:9,12,15&line=%E0%B8%81%E0%B8%B2%E0%B8%A3%E0%B9%80%E0%B8%95%E0%B8%B4%E0%B8%9A%E0%B9%82%E0%B8%95:1.1,1.4,1.8&title=%E0%B8%94%E0%B8%B2%E0%B8%A7%E0%B8%99%E0%B9%8C%E0%B9%82%E0%B8%AB%E0%B8%A5%E0%B8%94%E0%B8%A3%E0%B8%B2%E0%B8%A2%E0%B8%AA%E0%B8%B1%E0%B8%9B%E0%B8%94%E0%B8%B2%E0%B8%AB%E0%B9%8C)

## พารามิเตอร์

| พารามิเตอร์ | | |
|---|---|---|
| `labels=` | ป้าย คั่นด้วยจุลภาค | ✓ |
| `series=` | ชุด `ชื่อ:ค่า` ซ้ำได้ | ✓ |
| `line=` | ชุดเส้น `ชื่อ:ค่า` | ✗ |
| `stack=` | 1 = ซ้อนกัน | ✗ |
| `title=` | ชื่อเรื่อง | ✗ |
| `t=` | ตระกูลสไตล์ | ✗ |

## `t=`

| | |
|---|---|
| `base` |
| `evil` |

## จุดที่ต้องระวัง

- แท่ง + เส้น สองแกนเมื่อต่าง 5×
- เข้ารหัสช่องว่างในชื่อเรื่องเป็น `%20`
