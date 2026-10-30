---
x-title: hbar แท่งนอน — x-cmd/draw
x-desc: กราฟ SVG สำหรับยุค AI: endpoint เดียว `/draw?type=. type=hbar.
x-sidebar: draw
x-keywords: draw, hbar, แท่งนอน, svg, chart
---

# hbar แท่งนอน

`GET /draw?type=hbar&...` — เรนเดอร์กราฟ

## ตัวอย่าง

**base**

```text
https://x-cmd.com/draw?type=hbar&labels=CLI,%E0%B9%81%E0%B8%81%E0%B8%99,%E0%B9%80%E0%B8%AD%E0%B8%81%E0%B8%AA%E0%B8%B2%E0%B8%A3,UI&values=42,31,18,9&title=%E0%B8%84%E0%B8%AD%E0%B8%A1%E0%B8%A1%E0%B8%B4%E0%B8%95%E0%B9%81%E0%B8%A2%E0%B8%81%E0%B8%AA%E0%B9%88%E0%B8%A7%E0%B8%99
```

![hbar base](https://x-cmd.com/draw?type=hbar&labels=CLI,%E0%B9%81%E0%B8%81%E0%B8%99,%E0%B9%80%E0%B8%AD%E0%B8%81%E0%B8%AA%E0%B8%B2%E0%B8%A3,UI&values=42,31,18,9&title=%E0%B8%84%E0%B8%AD%E0%B8%A1%E0%B8%A1%E0%B8%B4%E0%B8%95%E0%B9%81%E0%B8%A2%E0%B8%81%E0%B8%AA%E0%B9%88%E0%B8%A7%E0%B8%99)

**opendata**

```text
https://x-cmd.com/draw?type=hbar&t=opendata&labels=CLI,%E0%B9%81%E0%B8%81%E0%B8%99,%E0%B9%80%E0%B8%AD%E0%B8%81%E0%B8%AA%E0%B8%B2%E0%B8%A3,UI&values=8,6,9,4&ref=7&reflabel=SLA&title=%E0%B8%84%E0%B8%AD%E0%B8%A1%E0%B8%A1%E0%B8%B4%E0%B8%95%E0%B9%81%E0%B8%A2%E0%B8%81%E0%B8%AA%E0%B9%88%E0%B8%A7%E0%B8%99
```

![hbar opendata](https://x-cmd.com/draw?type=hbar&t=opendata&labels=CLI,%E0%B9%81%E0%B8%81%E0%B8%99,%E0%B9%80%E0%B8%AD%E0%B8%81%E0%B8%AA%E0%B8%B2%E0%B8%A3,UI&values=8,6,9,4&ref=7&reflabel=SLA&title=%E0%B8%84%E0%B8%AD%E0%B8%A1%E0%B8%A1%E0%B8%B4%E0%B8%95%E0%B9%81%E0%B8%A2%E0%B8%81%E0%B8%AA%E0%B9%88%E0%B8%A7%E0%B8%99)

**xcmd**

```text
https://x-cmd.com/draw?type=hbar&t=xcmd&labels=%E0%B8%81%E0%B8%A3%E0%B8%B8%E0%B8%87%E0%B9%80%E0%B8%97%E0%B8%9E%E0%B8%A1%E0%B8%AB%E0%B8%B2%E0%B8%99%E0%B8%84%E0%B8%A3,%E0%B9%80%E0%B8%8A%E0%B8%B5%E0%B8%A2%E0%B8%87%E0%B9%83%E0%B8%AB%E0%B8%A1%E0%B9%88,%E0%B8%99%E0%B8%99%E0%B8%97%E0%B8%9A%E0%B8%B8%E0%B8%A3%E0%B8%B5&values=68,21,11&title=%E0%B9%80%E0%B8%A1%E0%B8%B7%E0%B8%AD%E0%B8%87%E0%B9%83%E0%B8%AB%E0%B8%8D%E0%B9%88%E0%B8%97%E0%B8%B5%E0%B9%88%E0%B8%AA%E0%B8%B8%E0%B8%94
```

![hbar xcmd](https://x-cmd.com/draw?type=hbar&t=xcmd&labels=%E0%B8%81%E0%B8%A3%E0%B8%B8%E0%B8%87%E0%B9%80%E0%B8%97%E0%B8%9E%E0%B8%A1%E0%B8%AB%E0%B8%B2%E0%B8%99%E0%B8%84%E0%B8%A3,%E0%B9%80%E0%B8%8A%E0%B8%B5%E0%B8%A2%E0%B8%87%E0%B9%83%E0%B8%AB%E0%B8%A1%E0%B9%88,%E0%B8%99%E0%B8%99%E0%B8%97%E0%B8%9A%E0%B8%B8%E0%B8%A3%E0%B8%B5&values=68,21,11&title=%E0%B9%80%E0%B8%A1%E0%B8%B7%E0%B8%AD%E0%B8%87%E0%B9%83%E0%B8%AB%E0%B8%8D%E0%B9%88%E0%B8%97%E0%B8%B5%E0%B9%88%E0%B8%AA%E0%B8%B8%E0%B8%94)

**xcmd-issue**

```text
https://x-cmd.com/draw?type=hbar&t=xcmd-issue&labels=CLI,%E0%B9%81%E0%B8%81%E0%B8%99,%E0%B9%80%E0%B8%AD%E0%B8%81%E0%B8%AA%E0%B8%B2%E0%B8%A3,ci,UI&series=%E0%B9%80%E0%B8%9B%E0%B8%B4%E0%B8%94:12,8,15,4,9&series=%E0%B8%9B%E0%B8%B4%E0%B8%94:38,52,20,11,26&title=issue%20%E0%B9%81%E0%B8%A2%E0%B8%81%E0%B8%AA%E0%B9%88%E0%B8%A7%E0%B8%99
```

![hbar xcmd-issue](https://x-cmd.com/draw?type=hbar&t=xcmd-issue&labels=CLI,%E0%B9%81%E0%B8%81%E0%B8%99,%E0%B9%80%E0%B8%AD%E0%B8%81%E0%B8%AA%E0%B8%B2%E0%B8%A3,ci,UI&series=%E0%B9%80%E0%B8%9B%E0%B8%B4%E0%B8%94:12,8,15,4,9&series=%E0%B8%9B%E0%B8%B4%E0%B8%94:38,52,20,11,26&title=issue%20%E0%B9%81%E0%B8%A2%E0%B8%81%E0%B8%AA%E0%B9%88%E0%B8%A7%E0%B8%99)

**rank**

```text
https://x-cmd.com/draw?type=hbar&t=rank&labels=%E0%B8%88,%E0%B8%AD,%E0%B8%9E&series=2025:80,95,110&series=2026:110,85,120&title=%E0%B8%94%E0%B8%B2%E0%B8%A7%E0%B8%99%E0%B9%8C%E0%B9%82%E0%B8%AB%E0%B8%A5%E0%B8%94%E0%B8%A3%E0%B8%B2%E0%B8%A2%E0%B8%AA%E0%B8%B1%E0%B8%9B%E0%B8%94%E0%B8%B2%E0%B8%AB%E0%B9%8C
```

![hbar rank](https://x-cmd.com/draw?type=hbar&t=rank&labels=%E0%B8%88,%E0%B8%AD,%E0%B8%9E&series=2025:80,95,110&series=2026:110,85,120&title=%E0%B8%94%E0%B8%B2%E0%B8%A7%E0%B8%99%E0%B9%8C%E0%B9%82%E0%B8%AB%E0%B8%A5%E0%B8%94%E0%B8%A3%E0%B8%B2%E0%B8%A2%E0%B8%AA%E0%B8%B1%E0%B8%9B%E0%B8%94%E0%B8%B2%E0%B8%AB%E0%B9%8C)

## พารามิเตอร์

| พารามิเตอร์ | | |
|---|---|---|
| `labels=` | ป้าย คั่นด้วยจุลภาค | ✓ |
| `values=` | ค่า คั่นด้วยจุลภาค | ✓ |
| `series=` | บางสไตล์เท่านั้น: 2 ชุด | ✗ |
| `ref=` | ค่าเส้นอ้างอิง | ✗ |
| `reflabel=` | ข้อความเส้นอ้างอิง | ✗ |
| `t=` | ตระกูลสไตล์ | ✗ |

## `t=`

| | |
|---|---|
| `base` |
| `opendata` |
| `xcmd` |
| `xcmd-issue` |
| `rank` |

## จุดที่ต้องระวัง

- ≤30 แท่ง ค่าตั้งต้นชุดเดียว
- สองชุดเฉพาะ `t=xcmd-issue` / `t=rank`
- เข้ารหัสช่องว่างในชื่อเรื่องเป็น `%20`
