---
x-title: line đường — x-cmd/draw
x-desc: Biểu đồ SVG cho thời đại AI: một endpoint `/draw?type=. type=line.
x-sidebar: draw
x-keywords: draw, line, đường, svg, chart
---

# line đường

`GET /draw?type=line&...` — vẽ biểu đồ

## Ví dụ

**shadcn**

```text
https://x-cmd.com/draw?type=line&labels=T1,T2,T3,T4,T5,T6&values=12,19,15,25,22,30&title=Sao%20theo%20ng%C3%B4n%20ng%E1%BB%AF
```

![line shadcn](https://x-cmd.com/draw?type=line&labels=T1,T2,T3,T4,T5,T6&values=12,19,15,25,22,30&title=Sao%20theo%20ng%C3%B4n%20ng%E1%BB%AF)

**evil**

```text
https://x-cmd.com/draw?type=line&t=evil&labels=T1,T2,T3,T4,T5,T6&series=T%E1%BA%A3i%20xu%E1%BB%91ng:12,19,15,25,22,30&series=CI:8,11,9,14,12,10
```

![line evil](https://x-cmd.com/draw?type=line&t=evil&labels=T1,T2,T3,T4,T5,T6&series=T%E1%BA%A3i%20xu%E1%BB%91ng:12,19,15,25,22,30&series=CI:8,11,9,14,12,10)

**evil-glow**

```text
https://x-cmd.com/draw?type=line&t=evil-glow&labels=Q1,Q2,Q3,Q4&values=3.1,3.4,3.2,3.8&title=T%C4%83ng%20tr%C6%B0%E1%BB%9Fng
```

![line evil-glow](https://x-cmd.com/draw?type=line&t=evil-glow&labels=Q1,Q2,Q3,Q4&values=3.1,3.4,3.2,3.8&title=T%C4%83ng%20tr%C6%B0%E1%BB%9Fng)

**opendata**

```text
https://x-cmd.com/draw?type=line&t=opendata&labels=v1,v2,v3&values=120,240,410&title=T%E1%BA%A3i%20xu%E1%BB%91ng
```

![line opendata](https://x-cmd.com/draw?type=line&t=opendata&labels=v1,v2,v3&values=120,240,410&title=T%E1%BA%A3i%20xu%E1%BB%91ng)

## Tham số

| Tham số | | |
|---|---|---|
| `labels=` | nhãn, cách nhau dấu phẩy | ✓ |
| `values=` | giá trị, cách nhau dấu phẩy | ✓ |
| `series=` | chuỗi `tên:giá trị`, lặp lại được | ✗ |
| `title=` | tiêu đề | ✗ |
| `t=` | họ phong cách | ✗ |

## `t=`

| | |
|---|---|
| `shadcn` |
| `evil` |
| `evil-glow` |
| `evil-mono` |
| `opendata` |

## Bẫy

- ≤60 điểm; nhiều đường chỉ đánh đỉnh của từng đường
- mã hóa khoảng trắng trong tiêu đề thành `%20`
