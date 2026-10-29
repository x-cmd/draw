---
x-title: sankey sankey — x-cmd/draw
x-desc: Biểu đồ SVG cho thời đại AI: một endpoint `/draw?type=. type=sankey.
x-sidebar: draw
x-keywords: draw, sankey, sankey, svg, chart
---

# sankey sankey

`GET /draw?type=sankey&...` — vẽ biểu đồ

## Ví dụ

**pipeline**

```text
https://x-cmd.com/draw?type=sankey&t=pipeline&labels=t%C3%ADnh%20n%C4%83ng,s%E1%BB%ADa%20l%E1%BB%97i,t%C3%A0i%20li%E1%BB%87u,kh%C3%A1c,%C4%91%C3%A3%20g%E1%BB%99p,%C4%91%C3%A3%20%C4%91%C3%B3ng,t%E1%BB%AB%20ch%E1%BB%91i,%3C1n,1%E2%80%932n,%3E2n&links=t%C3%ADnh%20n%C4%83ng%3E%C4%91%C3%A3%20g%E1%BB%99p:38;t%C3%ADnh%20n%C4%83ng%3E%C4%91%C3%A3%20%C4%91%C3%B3ng:12;t%C3%ADnh%20n%C4%83ng%3Et%E1%BB%AB%20ch%E1%BB%91i:8;s%E1%BB%ADa%20l%E1%BB%97i%3E%C4%91%C3%A3%20g%E1%BB%99p:33;s%E1%BB%ADa%20l%E1%BB%97i%3E%C4%91%C3%A3%20%C4%91%C3%B3ng:6;s%E1%BB%ADa%20l%E1%BB%97i%3Et%E1%BB%AB%20ch%E1%BB%91i:2;t%C3%A0i%20li%E1%BB%87u%3E%C4%91%C3%A3%20g%E1%BB%99p:16;t%C3%A0i%20li%E1%BB%87u%3E%C4%91%C3%A3%20%C4%91%C3%B3ng:4;kh%C3%A1c%3E%C4%91%C3%A3%20g%E1%BB%99p:5;kh%C3%A1c%3E%C4%91%C3%A3%20%C4%91%C3%B3ng:6;kh%C3%A1c%3Et%E1%BB%AB%20ch%E1%BB%91i:6;%C4%91%C3%A3%20g%E1%BB%99p%3E%3C1n:52;%C4%91%C3%A3%20g%E1%BB%99p%3E1%E2%80%932n:28;%C4%91%C3%A3%20g%E1%BB%99p%3E%3E2n:12;%C4%91%C3%A3%20%C4%91%C3%B3ng%3E%3C1n:14;%C4%91%C3%A3%20%C4%91%C3%B3ng%3E1%E2%80%932n:9;%C4%91%C3%A3%20%C4%91%C3%B3ng%3E%3E2n:5;t%E1%BB%AB%20ch%E1%BB%91i%3E%3C1n:9;t%E1%BB%AB%20ch%E1%BB%91i%3E1%E2%80%932n:5;t%E1%BB%AB%20ch%E1%BB%91i%3E%3E2n:2&title=V%C3%B2ng%20%C4%91%E1%BB%9Di%20PR&unit=prs
```

![sankey pipeline](https://x-cmd.com/draw?type=sankey&t=pipeline&labels=t%C3%ADnh%20n%C4%83ng,s%E1%BB%ADa%20l%E1%BB%97i,t%C3%A0i%20li%E1%BB%87u,kh%C3%A1c,%C4%91%C3%A3%20g%E1%BB%99p,%C4%91%C3%A3%20%C4%91%C3%B3ng,t%E1%BB%AB%20ch%E1%BB%91i,%3C1n,1%E2%80%932n,%3E2n&links=t%C3%ADnh%20n%C4%83ng%3E%C4%91%C3%A3%20g%E1%BB%99p:38;t%C3%ADnh%20n%C4%83ng%3E%C4%91%C3%A3%20%C4%91%C3%B3ng:12;t%C3%ADnh%20n%C4%83ng%3Et%E1%BB%AB%20ch%E1%BB%91i:8;s%E1%BB%ADa%20l%E1%BB%97i%3E%C4%91%C3%A3%20g%E1%BB%99p:33;s%E1%BB%ADa%20l%E1%BB%97i%3E%C4%91%C3%A3%20%C4%91%C3%B3ng:6;s%E1%BB%ADa%20l%E1%BB%97i%3Et%E1%BB%AB%20ch%E1%BB%91i:2;t%C3%A0i%20li%E1%BB%87u%3E%C4%91%C3%A3%20g%E1%BB%99p:16;t%C3%A0i%20li%E1%BB%87u%3E%C4%91%C3%A3%20%C4%91%C3%B3ng:4;kh%C3%A1c%3E%C4%91%C3%A3%20g%E1%BB%99p:5;kh%C3%A1c%3E%C4%91%C3%A3%20%C4%91%C3%B3ng:6;kh%C3%A1c%3Et%E1%BB%AB%20ch%E1%BB%91i:6;%C4%91%C3%A3%20g%E1%BB%99p%3E%3C1n:52;%C4%91%C3%A3%20g%E1%BB%99p%3E1%E2%80%932n:28;%C4%91%C3%A3%20g%E1%BB%99p%3E%3E2n:12;%C4%91%C3%A3%20%C4%91%C3%B3ng%3E%3C1n:14;%C4%91%C3%A3%20%C4%91%C3%B3ng%3E1%E2%80%932n:9;%C4%91%C3%A3%20%C4%91%C3%B3ng%3E%3E2n:5;t%E1%BB%AB%20ch%E1%BB%91i%3E%3C1n:9;t%E1%BB%AB%20ch%E1%BB%91i%3E1%E2%80%932n:5;t%E1%BB%AB%20ch%E1%BB%91i%3E%3E2n:2&title=V%C3%B2ng%20%C4%91%E1%BB%9Di%20PR&unit=prs)

**fund**

```text
https://x-cmd.com/draw?type=sankey&t=fund&labels=t%C3%ADnh%20n%C4%83ng,s%E1%BB%ADa%20l%E1%BB%97i,%C4%91%C3%A3%20g%E1%BB%99p,%C4%91%C3%A3%20%C4%91%C3%B3ng,%3C1n,1%E2%80%932n&links=t%C3%ADnh%20n%C4%83ng%3E%C4%91%C3%A3%20g%E1%BB%99p:50;t%C3%ADnh%20n%C4%83ng%3E%C4%91%C3%A3%20%C4%91%C3%B3ng:20;s%E1%BB%ADa%20l%E1%BB%97i%3E%C4%91%C3%A3%20g%E1%BB%99p:30;s%E1%BB%ADa%20l%E1%BB%97i%3E%C4%91%C3%A3%20%C4%91%C3%B3ng:10;%C4%91%C3%A3%20g%E1%BB%99p%3E%3C1n:52;%C4%91%C3%A3%20g%E1%BB%99p%3E1%E2%80%932n:28;%C4%91%C3%A3%20%C4%91%C3%B3ng%3E%3C1n:14;%C4%91%C3%A3%20%C4%91%C3%B3ng%3E1%E2%80%932n:9&title=V%C3%B2ng%20%C4%91%E1%BB%9Di%20PR
```

![sankey fund](https://x-cmd.com/draw?type=sankey&t=fund&labels=t%C3%ADnh%20n%C4%83ng,s%E1%BB%ADa%20l%E1%BB%97i,%C4%91%C3%A3%20g%E1%BB%99p,%C4%91%C3%A3%20%C4%91%C3%B3ng,%3C1n,1%E2%80%932n&links=t%C3%ADnh%20n%C4%83ng%3E%C4%91%C3%A3%20g%E1%BB%99p:50;t%C3%ADnh%20n%C4%83ng%3E%C4%91%C3%A3%20%C4%91%C3%B3ng:20;s%E1%BB%ADa%20l%E1%BB%97i%3E%C4%91%C3%A3%20g%E1%BB%99p:30;s%E1%BB%ADa%20l%E1%BB%97i%3E%C4%91%C3%A3%20%C4%91%C3%B3ng:10;%C4%91%C3%A3%20g%E1%BB%99p%3E%3C1n:52;%C4%91%C3%A3%20g%E1%BB%99p%3E1%E2%80%932n:28;%C4%91%C3%A3%20%C4%91%C3%B3ng%3E%3C1n:14;%C4%91%C3%A3%20%C4%91%C3%B3ng%3E1%E2%80%932n:9&title=V%C3%B2ng%20%C4%91%E1%BB%9Di%20PR)

**base**

```text
https://x-cmd.com/draw?type=sankey&labels=t%C3%ADnh%20n%C4%83ng,%C4%91%C3%A3%20g%E1%BB%99p,%C4%91%C3%A3%20%C4%91%C3%B3ng,%3C1n,1%E2%80%932n&links=t%C3%ADnh%20n%C4%83ng%3E%C4%91%C3%A3%20g%E1%BB%99p:71;t%C3%ADnh%20n%C4%83ng%3E%C4%91%C3%A3%20%C4%91%C3%B3ng:22;%C4%91%C3%A3%20g%E1%BB%99p%3E%3C1n:52;%C4%91%C3%A3%20g%E1%BB%99p%3E1%E2%80%932n:19;%C4%91%C3%A3%20%C4%91%C3%B3ng%3E%3C1n:14;%C4%91%C3%A3%20%C4%91%C3%B3ng%3E1%E2%80%932n:8&title=V%C3%B2ng%20%C4%91%E1%BB%9Di%20PR
```

![sankey base](https://x-cmd.com/draw?type=sankey&labels=t%C3%ADnh%20n%C4%83ng,%C4%91%C3%A3%20g%E1%BB%99p,%C4%91%C3%A3%20%C4%91%C3%B3ng,%3C1n,1%E2%80%932n&links=t%C3%ADnh%20n%C4%83ng%3E%C4%91%C3%A3%20g%E1%BB%99p:71;t%C3%ADnh%20n%C4%83ng%3E%C4%91%C3%A3%20%C4%91%C3%B3ng:22;%C4%91%C3%A3%20g%E1%BB%99p%3E%3C1n:52;%C4%91%C3%A3%20g%E1%BB%99p%3E1%E2%80%932n:19;%C4%91%C3%A3%20%C4%91%C3%B3ng%3E%3C1n:14;%C4%91%C3%A3%20%C4%91%C3%B3ng%3E1%E2%80%932n:8&title=V%C3%B2ng%20%C4%91%E1%BB%9Di%20PR)

## Tham số

| Tham số | | |
|---|---|---|
| `labels=` | nút, cách nhau dấu phẩy | ✓ |
| `links=` | dòng `A>B:giá trị`, cách ; | ✓ |
| `title=` | tiêu đề | ✗ |
| `unit=` | đơn vị | ✗ |
| `t=` | họ phong cách | ✗ |

## `t=`

| | |
|---|---|
| `base` |
| `fund` |
| `pipeline` |

## Bẫy

- ≤24 nút / 60 dòng; chu trình bị từ chối
- dòng tạo DAG — tổng khớp với labels
- mã hóa khoảng trắng trong tiêu đề thành `%20`
