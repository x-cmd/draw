---
x-title: combo kết hợp — x-cmd/draw
x-desc: Biểu đồ SVG cho thời đại AI: một endpoint `/draw?type=. type=combo.
x-sidebar: draw
x-keywords: draw, combo, kết hợp, svg, chart
---

# combo kết hợp

`GET /draw?type=combo&...` — vẽ biểu đồ

## Ví dụ

**base**

```text
https://x-cmd.com/draw?type=combo&labels=T2,T3,T4,T5,T6,T7,CN&series=T%E1%BA%A3i%20xu%E1%BB%91ng:120,180,150,210,240,200,260&line=T%C4%83ng%20tr%C6%B0%E1%BB%9Fng:3.1,3.4,3.2,3.8,4.1,3.9,4.5&title=T%E1%BA%A3i%20xu%E1%BB%91ng%20h%E1%BA%B1ng%20tu%E1%BA%A7n&unit=dl
```

![combo base](https://x-cmd.com/draw?type=combo&labels=T2,T3,T4,T5,T6,T7,CN&series=T%E1%BA%A3i%20xu%E1%BB%91ng:120,180,150,210,240,200,260&line=T%C4%83ng%20tr%C6%B0%E1%BB%9Fng:3.1,3.4,3.2,3.8,4.1,3.9,4.5&title=T%E1%BA%A3i%20xu%E1%BB%91ng%20h%E1%BA%B1ng%20tu%E1%BA%A7n&unit=dl)

**evil**

```text
https://x-cmd.com/draw?type=combo&t=evil&labels=T2,T3,T4&series=T%E1%BA%A3i%20xu%E1%BB%91ng:9,12,15&line=T%C4%83ng%20tr%C6%B0%E1%BB%9Fng:1.1,1.4,1.8&title=T%E1%BA%A3i%20xu%E1%BB%91ng%20h%E1%BA%B1ng%20tu%E1%BA%A7n
```

![combo evil](https://x-cmd.com/draw?type=combo&t=evil&labels=T2,T3,T4&series=T%E1%BA%A3i%20xu%E1%BB%91ng:9,12,15&line=T%C4%83ng%20tr%C6%B0%E1%BB%9Fng:1.1,1.4,1.8&title=T%E1%BA%A3i%20xu%E1%BB%91ng%20h%E1%BA%B1ng%20tu%E1%BA%A7n)

## Tham số

| Tham số | | |
|---|---|---|
| `labels=` | nhãn, cách nhau dấu phẩy | ✓ |
| `series=` | chuỗi `tên:giá trị`, lặp lại được | ✓ |
| `line=` | chuỗi đường `tên:giá trị` | ✗ |
| `stack=` | 1 = xếp chồng | ✗ |
| `title=` | tiêu đề | ✗ |
| `t=` | họ phong cách | ✗ |

## `t=`

| | |
|---|---|
| `base` |
| `evil` |

## Bẫy

- cột + đường; trục kép khi lệch 5×
- mã hóa khoảng trắng trong tiêu đề thành `%20`
