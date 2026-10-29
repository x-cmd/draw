---
x-title: gauge เกจ — x-cmd/draw
x-desc: กราฟ SVG สำหรับยุค AI: endpoint เดียว `/draw?type=. type=gauge.
x-sidebar: draw
x-keywords: draw, gauge, เกจ, svg, chart
---

# gauge เกจ

`GET /draw?type=gauge&...` — เรนเดอร์กราฟ

## ตัวอย่าง

**base**

```text
https://x-cmd.com/draw?type=gauge&title=%E0%B8%AD%E0%B8%B1%E0%B8%95%E0%B8%A3%E0%B8%B2%20CI&value=87&max=100
```

![gauge base](https://x-cmd.com/draw?type=gauge&title=%E0%B8%AD%E0%B8%B1%E0%B8%95%E0%B8%A3%E0%B8%B2%20CI&value=87&max=100)

**gradient**

```text
https://x-cmd.com/draw?type=gauge&t=gradient&title=%E0%B8%AD%E0%B8%B1%E0%B8%95%E0%B8%A3%E0%B8%B2%20CI&value=87&max=100
```

![gauge gradient](https://x-cmd.com/draw?type=gauge&t=gradient&title=%E0%B8%AD%E0%B8%B1%E0%B8%95%E0%B8%A3%E0%B8%B2%20CI&value=87&max=100)

**reliability**

```text
https://x-cmd.com/draw?type=gauge&t=reliability&title=%E0%B8%AD%E0%B8%B1%E0%B8%95%E0%B8%A3%E0%B8%B2%20CI&value=99.9&max=100
```

![gauge reliability](https://x-cmd.com/draw?type=gauge&t=reliability&title=%E0%B8%AD%E0%B8%B1%E0%B8%95%E0%B8%A3%E0%B8%B2%20CI&value=99.9&max=100)

## พารามิเตอร์

| พารามิเตอร์ | | |
|---|---|---|
| `value=` | ค่าปัจจุบัน | ✓ |
| `max=` | สูงสุด (ค่าตั้งต้น 100) | ✗ |
| `labels=` | ป้ายวง (หลายวง) | ✗ |
| `values=` | ค่าวง (เปอร์เซ็นต์) | ✗ |
| `title=` | ชื่อเรื่อง | ✗ |
| `t=` | ตระกูลสไตล์ | ✗ |

## `t=`

| | |
|---|---|
| `base` |
| `gradient` |
| `reliability` |

## จุดที่ต้องระวัง

- กราฟละค่าเดียว หลายค่า → combo/line
- เข้ารหัสช่องว่างในชื่อเรื่องเป็น `%20`
