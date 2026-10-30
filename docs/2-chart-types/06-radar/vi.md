---
x-title: radar ra đa — x-cmd/draw
x-desc: Biểu đồ SVG cho thời đại AI: một endpoint `/draw?type=. type=radar.
x-sidebar: draw
x-keywords: draw, radar, ra đa, svg, chart
---

# radar ra đa

`GET /draw?type=radar&...` — vẽ biểu đồ

## Ví dụ

**base**

```text
https://x-cmd.com/draw?type=radar&labels=kh%E1%BB%9Fi%20%C4%91%E1%BB%99ng,h%E1%BB%87%20sinh%20th%C3%A1i,m%E1%BB%9F%20r%E1%BB%99ng,b%E1%BB%99%20nh%E1%BB%9B,d%E1%BB%85%20d%C3%B9ng&values=85,90,70,80,95&title=So%20s%C3%A1nh%20tr%C3%ACnh%20so%E1%BA%A1n%20th%E1%BA%A3o
```

![radar base](https://x-cmd.com/draw?type=radar&labels=kh%E1%BB%9Fi%20%C4%91%E1%BB%99ng,h%E1%BB%87%20sinh%20th%C3%A1i,m%E1%BB%9F%20r%E1%BB%99ng,b%E1%BB%99%20nh%E1%BB%9B,d%E1%BB%85%20d%C3%B9ng&values=85,90,70,80,95&title=So%20s%C3%A1nh%20tr%C3%ACnh%20so%E1%BA%A1n%20th%E1%BA%A3o)

**evil**

```text
https://x-cmd.com/draw?type=radar&t=evil&labels=kh%E1%BB%9Fi%20%C4%91%E1%BB%99ng,h%E1%BB%87%20sinh%20th%C3%A1i,m%E1%BB%9F%20r%E1%BB%99ng,b%E1%BB%99%20nh%E1%BB%9B,d%E1%BB%85%20d%C3%B9ng&series=vscode:60,95,90,55,80&series=neovim:95,65,85,95,35&series=zed:92,50,55,90,60&title=So%20s%C3%A1nh%20tr%C3%ACnh%20so%E1%BA%A1n%20th%E1%BA%A3o
```

![radar evil](https://x-cmd.com/draw?type=radar&t=evil&labels=kh%E1%BB%9Fi%20%C4%91%E1%BB%99ng,h%E1%BB%87%20sinh%20th%C3%A1i,m%E1%BB%9F%20r%E1%BB%99ng,b%E1%BB%99%20nh%E1%BB%9B,d%E1%BB%85%20d%C3%B9ng&series=vscode:60,95,90,55,80&series=neovim:95,65,85,95,35&series=zed:92,50,55,90,60&title=So%20s%C3%A1nh%20tr%C3%ACnh%20so%E1%BA%A1n%20th%E1%BA%A3o)

**xcmd**

```text
https://x-cmd.com/draw?type=radar&t=xcmd&labels=kh%E1%BB%9Fi%20%C4%91%E1%BB%99ng,h%E1%BB%87%20sinh%20th%C3%A1i,m%E1%BB%9F%20r%E1%BB%99ng,b%E1%BB%99%20nh%E1%BB%9B,d%E1%BB%85%20d%C3%B9ng&values=8,6,9,7,5&title=So%20s%C3%A1nh%20tr%C3%ACnh%20so%E1%BA%A1n%20th%E1%BA%A3o
```

![radar xcmd](https://x-cmd.com/draw?type=radar&t=xcmd&labels=kh%E1%BB%9Fi%20%C4%91%E1%BB%99ng,h%E1%BB%87%20sinh%20th%C3%A1i,m%E1%BB%9F%20r%E1%BB%99ng,b%E1%BB%99%20nh%E1%BB%9B,d%E1%BB%85%20d%C3%B9ng&values=8,6,9,7,5&title=So%20s%C3%A1nh%20tr%C3%ACnh%20so%E1%BA%A1n%20th%E1%BA%A3o)

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
| `base` |
| `evil` |
| `xcmd` |

## Bẫy

- 3–12 trục
- nhiều chuỗi cần `t=evil`
- mã hóa khoảng trắng trong tiêu đề thành `%20`
