---
x-title: bar cột — x-cmd/draw
x-desc: Biểu đồ SVG cho thời đại AI: một endpoint `/draw?type=. type=bar.
x-sidebar: draw
x-keywords: draw, bar, cột, svg, chart
---

# bar cột

`GET /draw?type=bar&...` — vẽ biểu đồ

## Ví dụ

**evil**

```text
https://x-cmd.com/draw?type=bar&t=evil&labels=T2,T3,T4,T5,T6,T7,CN&series=T%E1%BA%A3i%20xu%E1%BB%91ng:34,87,51,63,45,78,39&series=T%C4%83ng%20tr%C6%B0%E1%BB%9Fng:18,49,29,39,31,45,23
```

![bar evil](https://x-cmd.com/draw?type=bar&t=evil&labels=T2,T3,T4,T5,T6,T7,CN&series=T%E1%BA%A3i%20xu%E1%BB%91ng:34,87,51,63,45,78,39&series=T%C4%83ng%20tr%C6%B0%E1%BB%9Fng:18,49,29,39,31,45,23)

**base**

```text
https://x-cmd.com/draw?type=bar&labels=T2,T3,T4&series=dev:12,18,9&series=CI:8,11,6
```

![bar base](https://x-cmd.com/draw?type=bar&labels=T2,T3,T4&series=dev:12,18,9&series=CI:8,11,6)

**grid**

```text
https://x-cmd.com/draw?type=bar&t=grid&labels=T2,T3,T4&values=12,18,9
```

![bar grid](https://x-cmd.com/draw?type=bar&t=grid&labels=T2,T3,T4&values=12,18,9)

**evil stack**

```text
https://x-cmd.com/draw?type=bar&stack=1&labels=T2,T3,T4&series=dev:12,18,9&series=CI:8,11,6
```

![bar evil stack](https://x-cmd.com/draw?type=bar&stack=1&labels=T2,T3,T4&series=dev:12,18,9&series=CI:8,11,6)

## Tham số

| Tham số | | |
|---|---|---|
| `labels=` | nhãn, cách nhau dấu phẩy | ✓ |
| `values=` | giá trị, cách nhau dấu phẩy | ✓ |
| `series=` | chuỗi `tên:giá trị`, lặp lại được | ✗ |
| `stack=` | 1 = xếp chồng | ✗ |
| `title=` | tiêu đề | ✗ |
| `t=` | họ phong cách | ✗ |

## `t=`

| | |
|---|---|
| `evil` |
| `base` |
| `grid` |

## Bẫy

- ≤30 nhóm, ≤6 chuỗi
- chênh lệch cực đoan thì tự xếp chồng theo phần trăm
- mã hóa khoảng trắng trong tiêu đề thành `%20`
