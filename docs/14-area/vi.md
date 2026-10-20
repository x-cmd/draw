---
x-title: area diện tích — x-cmd/draw
x-desc: Biểu đồ SVG cho thời đại AI: một endpoint `/draw?type=. type=area.
x-sidebar: draw
x-keywords: draw, area, diện tích, svg, chart
---

# area diện tích

`GET /draw?type=area&...` — vẽ biểu đồ

## Ví dụ

**evil**

```text
https://x-cmd.com/draw?type=area&labels=T2,T3,T4&series=dev:30,42,38&series=CI:12,18,9&title=T%E1%BA%A3i%20xu%E1%BB%91ng
```

![area evil](https://x-cmd.com/draw?type=area&labels=T2,T3,T4&series=dev:30,42,38&series=CI:12,18,9&title=T%E1%BA%A3i%20xu%E1%BB%91ng)

**star**

```text
https://x-cmd.com/draw?type=area&t=star&labels=T2,T3,T4&values=3,5,4&title=T%C4%83ng%20tr%C6%B0%E1%BB%9Fng
```

![area star](https://x-cmd.com/draw?type=area&t=star&labels=T2,T3,T4&values=3,5,4&title=T%C4%83ng%20tr%C6%B0%E1%BB%9Fng)

**opendata**

```text
https://x-cmd.com/draw?type=area&t=opendata&labels=2019,2020,2021,2022&values=1.2,2.8,6.4,14.1&title=T%C4%83ng%20tr%C6%B0%E1%BB%9Fng&source=x-cmd.com%2Fdraw
```

![area opendata](https://x-cmd.com/draw?type=area&t=opendata&labels=2019,2020,2021,2022&values=1.2,2.8,6.4,14.1&title=T%C4%83ng%20tr%C6%B0%E1%BB%9Fng&source=x-cmd.com%2Fdraw)

**pixel**

```text
https://x-cmd.com/draw?type=area&t=pixel&labels=a,b,c,d&values=2,4,3,5&title=T%C4%83ng%20tr%C6%B0%E1%BB%9Fng
```

![area pixel](https://x-cmd.com/draw?type=area&t=pixel&labels=a,b,c,d&values=2,4,3,5&title=T%C4%83ng%20tr%C6%B0%E1%BB%9Fng)

## Tham số

| Tham số | | |
|---|---|---|
| `labels=` | nhãn, cách nhau dấu phẩy | ✓ |
| `values=` | giá trị, cách nhau dấu phẩy | ✓ |
| `series=` | chuỗi `tên:giá trị`, lặp lại được | ✗ |
| `source=` | nguồn dữ liệu (chỉ area) | ✗ |
| `subtitle=` | phụ đề tòa soạn (area opendata) | ✗ |
| `t=` | họ phong cách | ✗ |

## `t=`

| | |
|---|---|
| `evil` |
| `star` |
| `opendata` |
| `pixel` |
| `polka` |

## Bẫy

- ≤60 điểm; nhiều đường chỉ đánh đỉnh của từng đường
- mã hóa khoảng trắng trong tiêu đề thành `%20`
