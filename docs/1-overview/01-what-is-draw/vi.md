---
x-title: Tiếng Việt — draw overview
x-desc: Biểu đồ SVG cho thời đại AI: một endpoint `/draw?type=.
x-sidebar: draw
x-keywords: draw, overview, svg, chart, api
---

# draw — Biểu đồ SVG với dữ liệu nằm trong URL

Biểu đồ SVG cho thời đại AI: một endpoint `/draw?type=...`, dữ liệu trong URL và `<metadata>` máy đọc được trong mỗi kết quả. Hệ phong cách theo spec thiết kế, nhiều biến thể cho mỗi loại biểu đồ.

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

## Phiên bản

- không `v`: bản mới nhất, cache 300 giây
- `v=N`: ghim phiên bản, cache 1 ngày
- `immutable` chỉ cho `/c/<hash>`

## Thân thiện AI

Mỗi SVG nhúng JSON: `{generator, template, version, spec}` — dữ liệu và tham số qua lại trực tiếp; chữ là `<text>` thật.
