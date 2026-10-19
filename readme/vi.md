# draw — Biểu đồ SVG với dữ liệu nằm trong URL

> [English](../README.md) | **Tiếng Việt**

[![JSR score](https://img.shields.io/badge/dynamic/json?url=https%3A%2F%2Fapi.jsr.io%2Fscopes%2Fx-cmd%2Fpackages%2Fdraw&query=%24.score&label=JSR%20score&color=yellowgreen)](https://jsr.io/@x-cmd/draw/score)

Toàn bộ dữ liệu nằm trong URL — mở bằng trình duyệt, nhúng qua `<img>` hoặc dán vào README: SVG hiển thị ngay và AI đọc được trực tiếp.

## Xem nhanh

### Tròn — thành phố lớn nhất

```text
https://x-cmd.com/draw?type=pie&title=D%C3%A2n%20s%E1%BB%91%20th%C3%A0nh%20ph%E1%BB%91%20l%E1%BB%9Bn%20nh%E1%BA%A5t&unit=tr&labels=TP.%20H%E1%BB%93%20Ch%C3%AD%20Minh,H%C3%A0%20N%E1%BB%99i,%C4%90%C3%A0%20N%E1%BA%B5ng,C%E1%BA%A7n%20Th%C6%A1&values=9.5,8.4,1.3,1.2
```

![Tròn — thành phố lớn nhất](https://x-cmd.com/draw?type=pie&title=D%C3%A2n%20s%E1%BB%91%20th%C3%A0nh%20ph%E1%BB%91%20l%E1%BB%9Bn%20nh%E1%BA%A5t&unit=tr&labels=TP.%20H%E1%BB%93%20Ch%C3%AD%20Minh,H%C3%A0%20N%E1%BB%99i,%C4%90%C3%A0%20N%E1%BA%B5ng,C%E1%BA%A7n%20Th%C6%A1&values=9.5,8.4,1.3,1.2)

### Thanh ngang — xếp hạng theo khu vực

```text
https://x-cmd.com/draw?type=hbar&labels=cli,core,docs,ui&values=42,31,18,9&title=Commit%20theo%20khu%20v%E1%BB%B1c
```

![Thanh ngang — xếp hạng theo khu vực](https://x-cmd.com/draw?type=hbar&labels=cli,core,docs,ui&values=42,31,18,9&title=Commit%20theo%20khu%20v%E1%BB%B1c)

### Kết hợp — tải xuống và tăng trưởng

```text
https://x-cmd.com/draw?type=combo&labels=T2,T3,T4,T5,T6,T7,CN&series=T%E1%BA%A3i%20xu%E1%BB%91ng:120,180,150,210,240,200,260&line=T%C4%83ng%20tr%C6%B0%E1%BB%9Fng:3.1,3.4,3.2,3.8,4.1,3.9,4.5&title=T%E1%BA%A3i%20xu%E1%BB%91ng%20h%E1%BA%B1ng%20tu%E1%BA%A7n&unit=dl
```

![Kết hợp — tải xuống và tăng trưởng](https://x-cmd.com/draw?type=combo&labels=T2,T3,T4,T5,T6,T7,CN&series=T%E1%BA%A3i%20xu%E1%BB%91ng:120,180,150,210,240,200,260&line=T%C4%83ng%20tr%C6%B0%E1%BB%9Fng:3.1,3.4,3.2,3.8,4.1,3.9,4.5&title=T%E1%BA%A3i%20xu%E1%BB%91ng%20h%E1%BA%B1ng%20tu%E1%BA%A7n&unit=dl)

### Sankey — vòng đời PR

```text
https://x-cmd.com/draw?type=sankey&t=pipeline&labels=feat,fix,docs,chore,merged,closed,rejected,0-1y,1-2y,2y%2B&links=feat%3Emerged:38;feat%3Eclosed:12;feat%3Erejected:8;fix%3Emerged:33;fix%3Eclosed:6;fix%3Erejected:2;docs%3Emerged:16;docs%3Eclosed:4;chore%3Emerged:5;chore%3Eclosed:6;chore%3Erejected:6;merged%3E0-1y:52;merged%3E1-2y:28;merged%3E2y%2B:12;closed%3E0-1y:14;closed%3E1-2y:9;closed%3E2y%2B:5;rejected%3E0-1y:9;rejected%3E1-2y:5;rejected%3E2y%2B:2&title=Pull%20requests%20lifecycle&unit=prs
```

![Sankey — vòng đời PR](https://x-cmd.com/draw?type=sankey&t=pipeline&labels=feat,fix,docs,chore,merged,closed,rejected,0-1y,1-2y,2y%2B&links=feat%3Emerged:38;feat%3Eclosed:12;feat%3Erejected:8;fix%3Emerged:33;fix%3Eclosed:6;fix%3Erejected:2;docs%3Emerged:16;docs%3Eclosed:4;chore%3Emerged:5;chore%3Eclosed:6;chore%3Erejected:6;merged%3E0-1y:52;merged%3E1-2y:28;merged%3E2y%2B:12;closed%3E0-1y:14;closed%3E1-2y:9;closed%3E2y%2B:5;rejected%3E0-1y:9;rejected%3E1-2y:5;rejected%3E2y%2B:2&title=Pull%20requests%20lifecycle&unit=prs)

## Ba cách sử dụng

```text
https://x-cmd.com/draw?type=pie&labels=A,B&values=3,2
```

```sh
npm install @x-cmd/draw
draw --type pie --labels "A,B" --values "3,2" --out pie.svg
```

```ts
import { draw } from "jsr:@x-cmd/draw";   // or npm:@x-cmd/draw
const { svg } = draw({ type: "pie", labels: "A,B", values: "3,2" });
```

## Tất cả các loại biểu đồ

| type | | |
|---|---|---|
| `pie` | Vành khuyên; donut=0 = tròn đặc | ≤100 lớp |
| `bar` | Cột nhóm; stack=1 xếp chồng | ≤30 nhóm |
| `hbar` | Thanh ngang (xếp hạng) | ≤30 thanh |
| `line` | Đường mượt + gradient | ≤60 điểm |
| `area` | Diện tích / đa diện tích | ≤60 điểm |
| `radar` | Rađa | 3–12 trục |
| `gauge` | Đồng hồ (cung 240°) | value+max; vòng ≤8 |
| `scatter` | Phân tán, âm được | ≤200 điểm |
| `combo` | Cột + đường, trục kép | ≤6 chuỗi |
| `sankey` | Sơ đồ dòng chảy | ≤24 nút |
| `qr` | Mã QR | ≤1000 ký tự |

---

Tài liệu đầy đủ (tiếng Anh): [README (EN)](../README.md) · [docs](../docs/) — Mã nguồn Apache-2.0; phông OFL.
