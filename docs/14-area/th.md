---
x-title: area พื้นที่ — x-cmd/draw
x-desc: กราฟ SVG สำหรับยุค AI: endpoint เดียว `/draw?type=. type=area.
x-sidebar: draw
x-keywords: draw, area, พื้นที่, svg, chart
---

# area พื้นที่

`GET /draw?type=area&...` — เรนเดอร์กราฟ

## ตัวอย่าง

**evil**

```text
https://x-cmd.com/draw?type=area&labels=%E0%B8%88,%E0%B8%AD,%E0%B8%9E&series=dev:30,42,38&series=CI:12,18,9&title=%E0%B8%94%E0%B8%B2%E0%B8%A7%E0%B8%99%E0%B9%8C%E0%B9%82%E0%B8%AB%E0%B8%A5%E0%B8%94
```

![area evil](https://x-cmd.com/draw?type=area&labels=%E0%B8%88,%E0%B8%AD,%E0%B8%9E&series=dev:30,42,38&series=CI:12,18,9&title=%E0%B8%94%E0%B8%B2%E0%B8%A7%E0%B8%99%E0%B9%8C%E0%B9%82%E0%B8%AB%E0%B8%A5%E0%B8%94)

**star**

```text
https://x-cmd.com/draw?type=area&t=star&labels=%E0%B8%88,%E0%B8%AD,%E0%B8%9E&values=3,5,4&title=%E0%B8%81%E0%B8%B2%E0%B8%A3%E0%B9%80%E0%B8%95%E0%B8%B4%E0%B8%9A%E0%B9%82%E0%B8%95
```

![area star](https://x-cmd.com/draw?type=area&t=star&labels=%E0%B8%88,%E0%B8%AD,%E0%B8%9E&values=3,5,4&title=%E0%B8%81%E0%B8%B2%E0%B8%A3%E0%B9%80%E0%B8%95%E0%B8%B4%E0%B8%9A%E0%B9%82%E0%B8%95)

**opendata**

```text
https://x-cmd.com/draw?type=area&t=opendata&labels=2019,2020,2021,2022&values=1.2,2.8,6.4,14.1&title=%E0%B8%81%E0%B8%B2%E0%B8%A3%E0%B9%80%E0%B8%95%E0%B8%B4%E0%B8%9A%E0%B9%82%E0%B8%95&source=x-cmd.com%2Fdraw
```

![area opendata](https://x-cmd.com/draw?type=area&t=opendata&labels=2019,2020,2021,2022&values=1.2,2.8,6.4,14.1&title=%E0%B8%81%E0%B8%B2%E0%B8%A3%E0%B9%80%E0%B8%95%E0%B8%B4%E0%B8%9A%E0%B9%82%E0%B8%95&source=x-cmd.com%2Fdraw)

**pixel**

```text
https://x-cmd.com/draw?type=area&t=pixel&labels=a,b,c,d&values=2,4,3,5&title=%E0%B8%81%E0%B8%B2%E0%B8%A3%E0%B9%80%E0%B8%95%E0%B8%B4%E0%B8%9A%E0%B9%82%E0%B8%95
```

![area pixel](https://x-cmd.com/draw?type=area&t=pixel&labels=a,b,c,d&values=2,4,3,5&title=%E0%B8%81%E0%B8%B2%E0%B8%A3%E0%B9%80%E0%B8%95%E0%B8%B4%E0%B8%9A%E0%B9%82%E0%B8%95)

## พารามิเตอร์

| พารามิเตอร์ | | |
|---|---|---|
| `labels=` | ป้าย คั่นด้วยจุลภาค | ✓ |
| `values=` | ค่า คั่นด้วยจุลภาค | ✓ |
| `series=` | ชุด `ชื่อ:ค่า` ซ้ำได้ | ✗ |
| `source=` | แหล่งข้อมูล (เฉพาะ area) | ✗ |
| `subtitle=` | ชื่อรองเชิงบรรณาธิการ (area opendata) | ✗ |
| `t=` | ตระกูลสไตล์ | ✗ |

## `t=`

| | |
|---|---|
| `evil` |
| `star` |
| `opendata` |
| `pixel` |
| `polka` |

## จุดที่ต้องระวัง

- ≤60 จุด หลายเส้นจะแสดงเฉพาะจุดสูงสุดของแต่ละเส้น
- เข้ารหัสช่องว่างในชื่อเรื่องเป็น `%20`
