---
x-title: Tiếng Việt — draw quick start
x-desc: Biểu đồ SVG cho thời đại AI: một endpoint `/draw?type=.
x-sidebar: draw
x-keywords: draw, quickstart, svg, chart
---

# draw — Biểu đồ SVG với dữ liệu nằm trong URL

Biểu đồ SVG cho thời đại AI: một endpoint `/draw?type=...`, dữ liệu trong URL và `<metadata>` máy đọc được trong mỗi kết quả. Hệ phong cách theo spec thiết kế, nhiều biến thể cho mỗi loại biểu đồ.

## Xem nhanh

```text
https://x-cmd.com/draw?type=pie&labels=A,B&values=3,2
```

![pie](https://x-cmd.com/draw?type=pie&labels=A,B&values=3,2)

## Ba cách sử dụng

**Dịch vụ lưu trữ (không cần cài)** · **Thư viện npm + CLI (ngoại tuyến, đồng bộ)** · Deno:

```ts
import { draw } from "jsr:@x-cmd/draw";
const { svg } = draw({ type: "pie", labels: "A,B", values: "3,2" });
```

## Endpoint

| type | | |
|---|---|---|
| `pie` | Vành khuyên; `donut=0` = tròn đặc | ≤100 lớp (>9 → Other) |
| `bar` | Cột nhóm; `stack=1` xếp chồng | ≤30 nhóm |
| `hbar` | Thanh ngang (xếp hạng) | ≤30 thanh |
| `line` | Đường mượt + gradient / đa đường | ≤60 điểm |
| `area` | Diện tích / đa diện tích | ≤60 điểm |
| `radar` | Ra đa | 3–12 trục |
| `gauge` | Đồng hồ (cung 240°, giá trị giữa) | value+max; vòng ≤8 |
| `scatter` | Phân tán, hai trục số, âm được | x=&y=, ≤200 điểm |
| `combo` | Cột (`series=`) + đường (`line=`); trục kép khi lệch 5× | ≤30 nhóm, ≤6 chuỗi |
| `sankey` | Sơ đồ dòng chảy theo bề rộng | labels=+links=A>B:30, ≤24 nút |
| `qr` | Mã QR | d≤1000 ký tự, fg/bg, title/unit |

Mã nguồn Apache-2.0; phông OFL — [README (EN)](../readme/en.md)
