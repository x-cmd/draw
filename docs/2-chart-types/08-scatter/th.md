---
x-title: scatter กระจาย — x-cmd/draw
x-desc: กราฟ SVG สำหรับยุค AI: endpoint เดียว `/draw?type=. type=scatter.
x-sidebar: draw
x-keywords: draw, scatter, กระจาย, svg, chart
---

# scatter กระจาย

`GET /draw?type=scatter&...` — เรนเดอร์กราฟ

## ตัวอย่าง

**base**

```text
https://x-cmd.com/draw?type=scatter&x=1,2,3,4,5&y=4,5,3,6,5&title=%E0%B8%84%E0%B8%A7%E0%B8%B2%E0%B8%A1%E0%B8%AB%E0%B8%99%E0%B9%88%E0%B8%A7%E0%B8%87
```

![scatter base](https://x-cmd.com/draw?type=scatter&x=1,2,3,4,5&y=4,5,3,6,5&title=%E0%B8%84%E0%B8%A7%E0%B8%B2%E0%B8%A1%E0%B8%AB%E0%B8%99%E0%B9%88%E0%B8%A7%E0%B8%87)

**base neg**

```text
https://x-cmd.com/draw?type=scatter&x=-3,-1,0,1,3&y=2,-2,3,-3,1&title=%E0%B8%84%E0%B8%A7%E0%B8%B2%E0%B8%A1%E0%B8%AB%E0%B8%99%E0%B9%88%E0%B8%A7%E0%B8%87
```

![scatter base neg](https://x-cmd.com/draw?type=scatter&x=-3,-1,0,1,3&y=2,-2,3,-3,1&title=%E0%B8%84%E0%B8%A7%E0%B8%B2%E0%B8%A1%E0%B8%AB%E0%B8%99%E0%B9%88%E0%B8%A7%E0%B8%87)

**base num**

```text
https://x-cmd.com/draw?type=scatter&x=1,2,3&y=2,4,3&num=all&title=%E0%B8%84%E0%B8%A7%E0%B8%B2%E0%B8%A1%E0%B8%AB%E0%B8%99%E0%B9%88%E0%B8%A7%E0%B8%87
```

![scatter base num](https://x-cmd.com/draw?type=scatter&x=1,2,3&y=2,4,3&num=all&title=%E0%B8%84%E0%B8%A7%E0%B8%B2%E0%B8%A1%E0%B8%AB%E0%B8%99%E0%B9%88%E0%B8%A7%E0%B8%87)

## พารามิเตอร์

| พารามิเตอร์ | | |
|---|---|---|
| `x=` | ค่า x | ✓ |
| `y=` | ค่า y | ✓ |
| `title=` | ชื่อเรื่อง | ✗ |
| `num=` | ป้ายค่า: all/peak/none | ✗ |
| `t=` | ตระกูลสไตล์ | ✗ |

## `t=`

| | |
|---|---|
| `base` |

## จุดที่ต้องระวัง

- ≤200 จุดต่อชุด ค่าลบได้
- เข้ารหัสช่องว่างในชื่อเรื่องเป็น `%20`
