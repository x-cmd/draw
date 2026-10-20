---
x-title: radar เรดาร์ — x-cmd/draw
x-desc: กราฟ SVG สำหรับยุค AI: endpoint เดียว `/draw?type=. type=radar.
x-sidebar: draw
x-keywords: draw, radar, เรดาร์, svg, chart
---

# radar เรดาร์

`GET /draw?type=radar&...` — เรนเดอร์กราฟ

## ตัวอย่าง

**base**

```text
https://x-cmd.com/draw?type=radar&labels=%E0%B9%80%E0%B8%A3%E0%B8%B4%E0%B9%88%E0%B8%A1%E0%B8%A3%E0%B8%B0%E0%B8%9A%E0%B8%9A,%E0%B8%A3%E0%B8%B0%E0%B8%9A%E0%B8%9A%E0%B8%99%E0%B8%B4%E0%B9%80%E0%B8%A7%E0%B8%A8,%E0%B8%82%E0%B8%A2%E0%B8%B2%E0%B8%A2%E0%B9%84%E0%B8%94%E0%B9%89,%E0%B8%AB%E0%B8%99%E0%B9%88%E0%B8%A7%E0%B8%A2%E0%B8%84%E0%B8%A7%E0%B8%B2%E0%B8%A1%E0%B8%88%E0%B8%B3,%E0%B9%83%E0%B8%8A%E0%B9%89%E0%B8%87%E0%B9%88%E0%B8%B2%E0%B8%A2&values=85,90,70,80,95&title=%E0%B9%80%E0%B8%97%E0%B8%B5%E0%B8%A2%E0%B8%9A%E0%B9%80%E0%B8%AD%E0%B8%94%E0%B8%B4%E0%B9%80%E0%B8%95%E0%B8%AD%E0%B8%A3%E0%B9%8C
```

![radar base](https://x-cmd.com/draw?type=radar&labels=%E0%B9%80%E0%B8%A3%E0%B8%B4%E0%B9%88%E0%B8%A1%E0%B8%A3%E0%B8%B0%E0%B8%9A%E0%B8%9A,%E0%B8%A3%E0%B8%B0%E0%B8%9A%E0%B8%9A%E0%B8%99%E0%B8%B4%E0%B9%80%E0%B8%A7%E0%B8%A8,%E0%B8%82%E0%B8%A2%E0%B8%B2%E0%B8%A2%E0%B9%84%E0%B8%94%E0%B9%89,%E0%B8%AB%E0%B8%99%E0%B9%88%E0%B8%A7%E0%B8%A2%E0%B8%84%E0%B8%A7%E0%B8%B2%E0%B8%A1%E0%B8%88%E0%B8%B3,%E0%B9%83%E0%B8%8A%E0%B9%89%E0%B8%87%E0%B9%88%E0%B8%B2%E0%B8%A2&values=85,90,70,80,95&title=%E0%B9%80%E0%B8%97%E0%B8%B5%E0%B8%A2%E0%B8%9A%E0%B9%80%E0%B8%AD%E0%B8%94%E0%B8%B4%E0%B9%80%E0%B8%95%E0%B8%AD%E0%B8%A3%E0%B9%8C)

**evil**

```text
https://x-cmd.com/draw?type=radar&t=evil&labels=%E0%B9%80%E0%B8%A3%E0%B8%B4%E0%B9%88%E0%B8%A1%E0%B8%A3%E0%B8%B0%E0%B8%9A%E0%B8%9A,%E0%B8%A3%E0%B8%B0%E0%B8%9A%E0%B8%9A%E0%B8%99%E0%B8%B4%E0%B9%80%E0%B8%A7%E0%B8%A8,%E0%B8%82%E0%B8%A2%E0%B8%B2%E0%B8%A2%E0%B9%84%E0%B8%94%E0%B9%89,%E0%B8%AB%E0%B8%99%E0%B9%88%E0%B8%A7%E0%B8%A2%E0%B8%84%E0%B8%A7%E0%B8%B2%E0%B8%A1%E0%B8%88%E0%B8%B3,%E0%B9%83%E0%B8%8A%E0%B9%89%E0%B8%87%E0%B9%88%E0%B8%B2%E0%B8%A2&series=vscode:60,95,90,55,80&series=neovim:95,65,85,95,35&series=zed:92,50,55,90,60&title=%E0%B9%80%E0%B8%97%E0%B8%B5%E0%B8%A2%E0%B8%9A%E0%B9%80%E0%B8%AD%E0%B8%94%E0%B8%B4%E0%B9%80%E0%B8%95%E0%B8%AD%E0%B8%A3%E0%B9%8C
```

![radar evil](https://x-cmd.com/draw?type=radar&t=evil&labels=%E0%B9%80%E0%B8%A3%E0%B8%B4%E0%B9%88%E0%B8%A1%E0%B8%A3%E0%B8%B0%E0%B8%9A%E0%B8%9A,%E0%B8%A3%E0%B8%B0%E0%B8%9A%E0%B8%9A%E0%B8%99%E0%B8%B4%E0%B9%80%E0%B8%A7%E0%B8%A8,%E0%B8%82%E0%B8%A2%E0%B8%B2%E0%B8%A2%E0%B9%84%E0%B8%94%E0%B9%89,%E0%B8%AB%E0%B8%99%E0%B9%88%E0%B8%A7%E0%B8%A2%E0%B8%84%E0%B8%A7%E0%B8%B2%E0%B8%A1%E0%B8%88%E0%B8%B3,%E0%B9%83%E0%B8%8A%E0%B9%89%E0%B8%87%E0%B9%88%E0%B8%B2%E0%B8%A2&series=vscode:60,95,90,55,80&series=neovim:95,65,85,95,35&series=zed:92,50,55,90,60&title=%E0%B9%80%E0%B8%97%E0%B8%B5%E0%B8%A2%E0%B8%9A%E0%B9%80%E0%B8%AD%E0%B8%94%E0%B8%B4%E0%B9%80%E0%B8%95%E0%B8%AD%E0%B8%A3%E0%B9%8C)

**xcmd**

```text
https://x-cmd.com/draw?type=radar&t=xcmd&labels=%E0%B9%80%E0%B8%A3%E0%B8%B4%E0%B9%88%E0%B8%A1%E0%B8%A3%E0%B8%B0%E0%B8%9A%E0%B8%9A,%E0%B8%A3%E0%B8%B0%E0%B8%9A%E0%B8%9A%E0%B8%99%E0%B8%B4%E0%B9%80%E0%B8%A7%E0%B8%A8,%E0%B8%82%E0%B8%A2%E0%B8%B2%E0%B8%A2%E0%B9%84%E0%B8%94%E0%B9%89,%E0%B8%AB%E0%B8%99%E0%B9%88%E0%B8%A7%E0%B8%A2%E0%B8%84%E0%B8%A7%E0%B8%B2%E0%B8%A1%E0%B8%88%E0%B8%B3,%E0%B9%83%E0%B8%8A%E0%B9%89%E0%B8%87%E0%B9%88%E0%B8%B2%E0%B8%A2&values=8,6,9,7,5&title=%E0%B9%80%E0%B8%97%E0%B8%B5%E0%B8%A2%E0%B8%9A%E0%B9%80%E0%B8%AD%E0%B8%94%E0%B8%B4%E0%B9%80%E0%B8%95%E0%B8%AD%E0%B8%A3%E0%B9%8C
```

![radar xcmd](https://x-cmd.com/draw?type=radar&t=xcmd&labels=%E0%B9%80%E0%B8%A3%E0%B8%B4%E0%B9%88%E0%B8%A1%E0%B8%A3%E0%B8%B0%E0%B8%9A%E0%B8%9A,%E0%B8%A3%E0%B8%B0%E0%B8%9A%E0%B8%9A%E0%B8%99%E0%B8%B4%E0%B9%80%E0%B8%A7%E0%B8%A8,%E0%B8%82%E0%B8%A2%E0%B8%B2%E0%B8%A2%E0%B9%84%E0%B8%94%E0%B9%89,%E0%B8%AB%E0%B8%99%E0%B9%88%E0%B8%A7%E0%B8%A2%E0%B8%84%E0%B8%A7%E0%B8%B2%E0%B8%A1%E0%B8%88%E0%B8%B3,%E0%B9%83%E0%B8%8A%E0%B9%89%E0%B8%87%E0%B9%88%E0%B8%B2%E0%B8%A2&values=8,6,9,7,5&title=%E0%B9%80%E0%B8%97%E0%B8%B5%E0%B8%A2%E0%B8%9A%E0%B9%80%E0%B8%AD%E0%B8%94%E0%B8%B4%E0%B9%80%E0%B8%95%E0%B8%AD%E0%B8%A3%E0%B9%8C)

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
| `base` |
| `evil` |
| `xcmd` |

## จุดที่ต้องระวัง

- 3–12 แกน
- หลายชุดต้องใช้ `t=evil`
- เข้ารหัสช่องว่างในชื่อเรื่องเป็น `%20`
