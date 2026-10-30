---
x-title: pie tròn — x-cmd/draw
x-desc: Biểu đồ SVG cho thời đại AI: một endpoint `/draw?type=. type=pie.
x-sidebar: draw
x-keywords: draw, pie, tròn, svg, chart
---

# pie tròn

`GET /draw?type=pie&...` — vẽ biểu đồ

## Ví dụ

**opendata**

```text
https://x-cmd.com/draw?type=pie&title=Th%C3%A0nh%20ph%E1%BB%91%20l%E1%BB%9Bn%20nh%E1%BA%A5t&unit=tr&labels=TP.%20H%E1%BB%93%20Ch%C3%AD%20Minh,H%C3%A0%20N%E1%BB%99i,%C4%90%C3%A0%20N%E1%BA%B5ng,C%E1%BA%A7n%20Th%C6%A1&values=9.5,8.4,1.3,1.2
```

![pie opendata](https://x-cmd.com/draw?type=pie&title=Th%C3%A0nh%20ph%E1%BB%91%20l%E1%BB%9Bn%20nh%E1%BA%A5t&unit=tr&labels=TP.%20H%E1%BB%93%20Ch%C3%AD%20Minh,H%C3%A0%20N%E1%BB%99i,%C4%90%C3%A0%20N%E1%BA%B5ng,C%E1%BA%A7n%20Th%C6%A1&values=9.5,8.4,1.3,1.2)

**evil**

```text
https://x-cmd.com/draw?type=pie&t=evil&title=Th%C3%A0nh%20ph%E1%BB%91%20l%E1%BB%9Bn%20nh%E1%BA%A5t&unit=tr&labels=TP.%20H%E1%BB%93%20Ch%C3%AD%20Minh,H%C3%A0%20N%E1%BB%99i,%C4%90%C3%A0%20N%E1%BA%B5ng,C%E1%BA%A7n%20Th%C6%A1&values=9.5,8.4,1.3,1.2
```

![pie evil](https://x-cmd.com/draw?type=pie&t=evil&title=Th%C3%A0nh%20ph%E1%BB%91%20l%E1%BB%9Bn%20nh%E1%BA%A5t&unit=tr&labels=TP.%20H%E1%BB%93%20Ch%C3%AD%20Minh,H%C3%A0%20N%E1%BB%99i,%C4%90%C3%A0%20N%E1%BA%B5ng,C%E1%BA%A7n%20Th%C6%A1&values=9.5,8.4,1.3,1.2)

**evil-mono**

```text
https://x-cmd.com/draw?type=pie&t=evil-mono&title=Th%C3%A0nh%20ph%E1%BB%91%20l%E1%BB%9Bn%20nh%E1%BA%A5t&unit=tr&labels=TP.%20H%E1%BB%93%20Ch%C3%AD%20Minh,H%C3%A0%20N%E1%BB%99i,%C4%90%C3%A0%20N%E1%BA%B5ng,C%E1%BA%A7n%20Th%C6%A1&values=9.5,8.4,1.3,1.2
```

![pie evil-mono](https://x-cmd.com/draw?type=pie&t=evil-mono&title=Th%C3%A0nh%20ph%E1%BB%91%20l%E1%BB%9Bn%20nh%E1%BA%A5t&unit=tr&labels=TP.%20H%E1%BB%93%20Ch%C3%AD%20Minh,H%C3%A0%20N%E1%BB%99i,%C4%90%C3%A0%20N%E1%BA%B5ng,C%E1%BA%A7n%20Th%C6%A1&values=9.5,8.4,1.3,1.2)

**market-mono**

```text
https://x-cmd.com/draw?type=pie&t=market-mono&title=Th%C3%A0nh%20ph%E1%BB%91%20l%E1%BB%9Bn%20nh%E1%BA%A5t&unit=tr&labels=TP.%20H%E1%BB%93%20Ch%C3%AD%20Minh,H%C3%A0%20N%E1%BB%99i,%C4%90%C3%A0%20N%E1%BA%B5ng,C%E1%BA%A7n%20Th%C6%A1&values=9.5,8.4,1.3,1.2
```

![pie market-mono](https://x-cmd.com/draw?type=pie&t=market-mono&title=Th%C3%A0nh%20ph%E1%BB%91%20l%E1%BB%9Bn%20nh%E1%BA%A5t&unit=tr&labels=TP.%20H%E1%BB%93%20Ch%C3%AD%20Minh,H%C3%A0%20N%E1%BB%99i,%C4%90%C3%A0%20N%E1%BA%B5ng,C%E1%BA%A7n%20Th%C6%A1&values=9.5,8.4,1.3,1.2)

**progress**

```text
https://x-cmd.com/draw?type=pie&t=progress&title=Th%C3%A0nh%20ph%E1%BB%91%20l%E1%BB%9Bn%20nh%E1%BA%A5t&unit=tr&labels=TP.%20H%E1%BB%93%20Ch%C3%AD%20Minh,H%C3%A0%20N%E1%BB%99i,%C4%90%C3%A0%20N%E1%BA%B5ng,C%E1%BA%A7n%20Th%C6%A1&values=9.5,8.4,1.3,1.2
```

![pie progress](https://x-cmd.com/draw?type=pie&t=progress&title=Th%C3%A0nh%20ph%E1%BB%91%20l%E1%BB%9Bn%20nh%E1%BA%A5t&unit=tr&labels=TP.%20H%E1%BB%93%20Ch%C3%AD%20Minh,H%C3%A0%20N%E1%BB%99i,%C4%90%C3%A0%20N%E1%BA%B5ng,C%E1%BA%A7n%20Th%C6%A1&values=9.5,8.4,1.3,1.2)

**revenue**

```text
https://x-cmd.com/draw?type=pie&t=revenue&title=Th%C3%A0nh%20ph%E1%BB%91%20l%E1%BB%9Bn%20nh%E1%BA%A5t&unit=tr&labels=TP.%20H%E1%BB%93%20Ch%C3%AD%20Minh,H%C3%A0%20N%E1%BB%99i,%C4%90%C3%A0%20N%E1%BA%B5ng,C%E1%BA%A7n%20Th%C6%A1&values=9.5,8.4,1.3,1.2
```

![pie revenue](https://x-cmd.com/draw?type=pie&t=revenue&title=Th%C3%A0nh%20ph%E1%BB%91%20l%E1%BB%9Bn%20nh%E1%BA%A5t&unit=tr&labels=TP.%20H%E1%BB%93%20Ch%C3%AD%20Minh,H%C3%A0%20N%E1%BB%99i,%C4%90%C3%A0%20N%E1%BA%B5ng,C%E1%BA%A7n%20Th%C6%A1&values=9.5,8.4,1.3,1.2)

## Tham số

| Tham số | | |
|---|---|---|
| `labels=` | nhãn, cách nhau dấu phẩy | ✓ |
| `values=` | giá trị, cách nhau dấu phẩy | ✓ |
| `title=` | tiêu đề | ✗ |
| `unit=` | đơn vị | ✗ |
| `donut=` | 0 = tròn đặc | ✗ |
| `t=` | họ phong cách | ✗ |

## `t=`

| | |
|---|---|
| `opendata` |
| `evil` |
| `evil-mono` |
| `market-mono` |
| `progress` |
| `revenue` |

## Bẫy

- ≤100 lớp; hơn 9 gộp vào Other
- tròn đặc và vành chỉ khác `donut=` — đừng đổi kiểu
- tương phản một số kiểu đổi ở chế độ tối
- mã hóa khoảng trắng trong tiêu đề thành `%20`
