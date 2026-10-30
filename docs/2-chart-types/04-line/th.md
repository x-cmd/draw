---
x-title: line เส้น — x-cmd/draw
x-desc: กราฟ SVG สำหรับยุค AI: endpoint เดียว `/draw?type=. type=line.
x-sidebar: draw
x-keywords: draw, line, เส้น, svg, chart
---

# line เส้น

`GET /draw?type=line&...` — เรนเดอร์กราฟ

## ตัวอย่าง

**shadcn**

```text
https://x-cmd.com/draw?type=line&labels=%E0%B8%A1.%E0%B8%84.,%E0%B8%81.%E0%B8%9E.,%E0%B8%A1%E0%B8%B5.%E0%B8%84.,%E0%B9%80%E0%B8%A1.%E0%B8%A2.,%E0%B8%9E.%E0%B8%84.,%E0%B8%A1%E0%B8%B4.%E0%B8%A2.&values=12,19,15,25,22,30&title=%E0%B8%94%E0%B8%B2%E0%B8%A7%E0%B8%95%E0%B8%B2%E0%B8%A1%E0%B8%A0%E0%B8%B2%E0%B8%A9%E0%B8%B2
```

![line shadcn](https://x-cmd.com/draw?type=line&labels=%E0%B8%A1.%E0%B8%84.,%E0%B8%81.%E0%B8%9E.,%E0%B8%A1%E0%B8%B5.%E0%B8%84.,%E0%B9%80%E0%B8%A1.%E0%B8%A2.,%E0%B8%9E.%E0%B8%84.,%E0%B8%A1%E0%B8%B4.%E0%B8%A2.&values=12,19,15,25,22,30&title=%E0%B8%94%E0%B8%B2%E0%B8%A7%E0%B8%95%E0%B8%B2%E0%B8%A1%E0%B8%A0%E0%B8%B2%E0%B8%A9%E0%B8%B2)

**evil**

```text
https://x-cmd.com/draw?type=line&t=evil&labels=%E0%B8%A1.%E0%B8%84.,%E0%B8%81.%E0%B8%9E.,%E0%B8%A1%E0%B8%B5.%E0%B8%84.,%E0%B9%80%E0%B8%A1.%E0%B8%A2.,%E0%B8%9E.%E0%B8%84.,%E0%B8%A1%E0%B8%B4.%E0%B8%A2.&series=%E0%B8%94%E0%B8%B2%E0%B8%A7%E0%B8%99%E0%B9%8C%E0%B9%82%E0%B8%AB%E0%B8%A5%E0%B8%94:12,19,15,25,22,30&series=CI:8,11,9,14,12,10
```

![line evil](https://x-cmd.com/draw?type=line&t=evil&labels=%E0%B8%A1.%E0%B8%84.,%E0%B8%81.%E0%B8%9E.,%E0%B8%A1%E0%B8%B5.%E0%B8%84.,%E0%B9%80%E0%B8%A1.%E0%B8%A2.,%E0%B8%9E.%E0%B8%84.,%E0%B8%A1%E0%B8%B4.%E0%B8%A2.&series=%E0%B8%94%E0%B8%B2%E0%B8%A7%E0%B8%99%E0%B9%8C%E0%B9%82%E0%B8%AB%E0%B8%A5%E0%B8%94:12,19,15,25,22,30&series=CI:8,11,9,14,12,10)

**evil-glow**

```text
https://x-cmd.com/draw?type=line&t=evil-glow&labels=Q1,Q2,Q3,Q4&values=3.1,3.4,3.2,3.8&title=%E0%B8%81%E0%B8%B2%E0%B8%A3%E0%B9%80%E0%B8%95%E0%B8%B4%E0%B8%9A%E0%B9%82%E0%B8%95
```

![line evil-glow](https://x-cmd.com/draw?type=line&t=evil-glow&labels=Q1,Q2,Q3,Q4&values=3.1,3.4,3.2,3.8&title=%E0%B8%81%E0%B8%B2%E0%B8%A3%E0%B9%80%E0%B8%95%E0%B8%B4%E0%B8%9A%E0%B9%82%E0%B8%95)

**opendata**

```text
https://x-cmd.com/draw?type=line&t=opendata&labels=v1,v2,v3&values=120,240,410&title=%E0%B8%94%E0%B8%B2%E0%B8%A7%E0%B8%99%E0%B9%8C%E0%B9%82%E0%B8%AB%E0%B8%A5%E0%B8%94
```

![line opendata](https://x-cmd.com/draw?type=line&t=opendata&labels=v1,v2,v3&values=120,240,410&title=%E0%B8%94%E0%B8%B2%E0%B8%A7%E0%B8%99%E0%B9%8C%E0%B9%82%E0%B8%AB%E0%B8%A5%E0%B8%94)

## พารามิเตอร์

| พารามิเตอร์ | | |
|---|---|---|
| `labels=` | ป้าย คั่นด้วยจุลภาค | ✓ |
| `values=` | ค่า คั่นด้วยจุลภาค | ✓ |
| `series=` | ชุด `ชื่อ:ค่า` ซ้ำได้ | ✗ |
| `title=` | ชื่อเรื่อง | ✗ |
| `t=` | ตระกูลสไตล์ | ✗ |

## `t=`

| | |
|---|---|
| `shadcn` |
| `evil` |
| `evil-glow` |
| `evil-mono` |
| `opendata` |

## จุดที่ต้องระวัง

- ≤60 จุด หลายเส้นจะแสดงเฉพาะจุดสูงสุดของแต่ละเส้น
- เข้ารหัสช่องว่างในชื่อเรื่องเป็น `%20`
