---
x-title: hbar thanh ngang — x-cmd/draw
x-desc: Biểu đồ SVG cho thời đại AI: một endpoint `/draw?type=. type=hbar.
x-sidebar: draw
x-keywords: draw, hbar, thanh ngang, svg, chart
---

# hbar thanh ngang

`GET /draw?type=hbar&...` — vẽ biểu đồ

## Ví dụ

**base**

```text
https://x-cmd.com/draw?type=hbar&labels=CLI,l%C3%B5i,t%C3%A0i%20li%E1%BB%87u,UI&values=42,31,18,9&title=Commit%20theo%20khu%20v%E1%BB%B1c
```

![hbar base](https://x-cmd.com/draw?type=hbar&labels=CLI,l%C3%B5i,t%C3%A0i%20li%E1%BB%87u,UI&values=42,31,18,9&title=Commit%20theo%20khu%20v%E1%BB%B1c)

**opendata**

```text
https://x-cmd.com/draw?type=hbar&t=opendata&labels=CLI,l%C3%B5i,t%C3%A0i%20li%E1%BB%87u,UI&values=8,6,9,4&ref=7&reflabel=SLA&title=Commit%20theo%20khu%20v%E1%BB%B1c
```

![hbar opendata](https://x-cmd.com/draw?type=hbar&t=opendata&labels=CLI,l%C3%B5i,t%C3%A0i%20li%E1%BB%87u,UI&values=8,6,9,4&ref=7&reflabel=SLA&title=Commit%20theo%20khu%20v%E1%BB%B1c)

**xcmd**

```text
https://x-cmd.com/draw?type=hbar&t=xcmd&labels=TP.%20H%E1%BB%93%20Ch%C3%AD%20Minh,H%C3%A0%20N%E1%BB%99i,%C4%90%C3%A0%20N%E1%BA%B5ng&values=68,21,11&title=Th%C3%A0nh%20ph%E1%BB%91%20l%E1%BB%9Bn%20nh%E1%BA%A5t
```

![hbar xcmd](https://x-cmd.com/draw?type=hbar&t=xcmd&labels=TP.%20H%E1%BB%93%20Ch%C3%AD%20Minh,H%C3%A0%20N%E1%BB%99i,%C4%90%C3%A0%20N%E1%BA%B5ng&values=68,21,11&title=Th%C3%A0nh%20ph%E1%BB%91%20l%E1%BB%9Bn%20nh%E1%BA%A5t)

**xcmd-issue**

```text
https://x-cmd.com/draw?type=hbar&t=xcmd-issue&labels=CLI,l%C3%B5i,t%C3%A0i%20li%E1%BB%87u,ci,UI&series=m%E1%BB%9F:12,8,15,4,9&series=%C4%91%C3%B3ng:38,52,20,11,26&title=Issue%20theo%20khu%20v%E1%BB%B1c
```

![hbar xcmd-issue](https://x-cmd.com/draw?type=hbar&t=xcmd-issue&labels=CLI,l%C3%B5i,t%C3%A0i%20li%E1%BB%87u,ci,UI&series=m%E1%BB%9F:12,8,15,4,9&series=%C4%91%C3%B3ng:38,52,20,11,26&title=Issue%20theo%20khu%20v%E1%BB%B1c)

**rank**

```text
https://x-cmd.com/draw?type=hbar&t=rank&labels=T2,T3,T4&series=2025:80,95,110&series=2026:110,85,120&title=T%E1%BA%A3i%20xu%E1%BB%91ng%20h%E1%BA%B1ng%20tu%E1%BA%A7n
```

![hbar rank](https://x-cmd.com/draw?type=hbar&t=rank&labels=T2,T3,T4&series=2025:80,95,110&series=2026:110,85,120&title=T%E1%BA%A3i%20xu%E1%BB%91ng%20h%E1%BA%B1ng%20tu%E1%BA%A7n)

## Tham số

| Tham số | | |
|---|---|---|
| `labels=` | nhãn, cách nhau dấu phẩy | ✓ |
| `values=` | giá trị, cách nhau dấu phẩy | ✓ |
| `series=` | chỉ một số kiểu: 2 chuỗi | ✗ |
| `ref=` | giá trị đường tham chiếu | ✗ |
| `reflabel=` | nhãn đường tham chiếu | ✗ |
| `t=` | họ phong cách | ✗ |

## `t=`

| | |
|---|---|
| `base` |
| `opendata` |
| `xcmd` |
| `xcmd-issue` |
| `rank` |

## Bẫy

- ≤30 thanh, mặc định một chuỗi
- hai chuỗi chỉ với `t=xcmd-issue` / `t=rank`
- mã hóa khoảng trắng trong tiêu đề thành `%20`
