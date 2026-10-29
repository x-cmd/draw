---
x-title: scatter phân tán — x-cmd/draw
x-desc: Biểu đồ SVG cho thời đại AI: một endpoint `/draw?type=. type=scatter.
x-sidebar: draw
x-keywords: draw, scatter, phân tán, svg, chart
---

# scatter phân tán

`GET /draw?type=scatter&...` — vẽ biểu đồ

## Ví dụ

**base**

```text
https://x-cmd.com/draw?type=scatter&x=1,2,3,4,5&y=4,5,3,6,5&title=%C4%90%E1%BB%99%20tr%E1%BB%85
```

![scatter base](https://x-cmd.com/draw?type=scatter&x=1,2,3,4,5&y=4,5,3,6,5&title=%C4%90%E1%BB%99%20tr%E1%BB%85)

**base neg**

```text
https://x-cmd.com/draw?type=scatter&x=-3,-1,0,1,3&y=2,-2,3,-3,1&title=%C4%90%E1%BB%99%20tr%E1%BB%85
```

![scatter base neg](https://x-cmd.com/draw?type=scatter&x=-3,-1,0,1,3&y=2,-2,3,-3,1&title=%C4%90%E1%BB%99%20tr%E1%BB%85)

**base num**

```text
https://x-cmd.com/draw?type=scatter&x=1,2,3&y=2,4,3&num=all&title=%C4%90%E1%BB%99%20tr%E1%BB%85
```

![scatter base num](https://x-cmd.com/draw?type=scatter&x=1,2,3&y=2,4,3&num=all&title=%C4%90%E1%BB%99%20tr%E1%BB%85)

## Tham số

| Tham số | | |
|---|---|---|
| `x=` | giá trị x | ✓ |
| `y=` | giá trị y | ✓ |
| `title=` | tiêu đề | ✗ |
| `num=` | đánh dấu giá trị: all/peak/none | ✗ |
| `t=` | họ phong cách | ✗ |

## `t=`

| | |
|---|---|
| `base` |

## Bẫy

- ≤200 điểm mỗi chuỗi; âm được
- mã hóa khoảng trắng trong tiêu đề thành `%20`
