---
x-title: gauge đồng hồ — x-cmd/draw
x-desc: Biểu đồ SVG cho thời đại AI: một endpoint `/draw?type=. type=gauge.
x-sidebar: draw
x-keywords: draw, gauge, đồng hồ, svg, chart
---

# gauge đồng hồ

`GET /draw?type=gauge&...` — vẽ biểu đồ

## Ví dụ

**base**

```text
https://x-cmd.com/draw?type=gauge&title=T%E1%BB%B7%20l%E1%BB%87%20CI&value=87&max=100
```

![gauge base](https://x-cmd.com/draw?type=gauge&title=T%E1%BB%B7%20l%E1%BB%87%20CI&value=87&max=100)

**gradient**

```text
https://x-cmd.com/draw?type=gauge&t=gradient&title=T%E1%BB%B7%20l%E1%BB%87%20CI&value=87&max=100
```

![gauge gradient](https://x-cmd.com/draw?type=gauge&t=gradient&title=T%E1%BB%B7%20l%E1%BB%87%20CI&value=87&max=100)

**reliability**

```text
https://x-cmd.com/draw?type=gauge&t=reliability&title=T%E1%BB%B7%20l%E1%BB%87%20CI&value=99.9&max=100
```

![gauge reliability](https://x-cmd.com/draw?type=gauge&t=reliability&title=T%E1%BB%B7%20l%E1%BB%87%20CI&value=99.9&max=100)

## Tham số

| Tham số | | |
|---|---|---|
| `value=` | giá trị hiện tại | ✓ |
| `max=` | tối đa (mặc định 100) | ✗ |
| `labels=` | nhãn vòng (đa vòng) | ✗ |
| `values=` | giá trị vòng (phần trăm) | ✗ |
| `title=` | tiêu đề | ✗ |
| `t=` | họ phong cách | ✗ |

## `t=`

| | |
|---|---|
| `base` |
| `gradient` |
| `reliability` |

## Bẫy

- một giá trị mỗi biểu đồ; nhiều giá trị → combo/line
- mã hóa khoảng trắng trong tiêu đề thành `%20`
