---
x-title: Tiếng Việt — draw data formats
x-desc: labels/values, series, ?d= JSON.
x-sidebar: draw
x-keywords: draw, data, json, csv
---

# draw — Truyền dữ liệu

```text
https://x-cmd.com/draw?type=pie&labels=A,B&values=3,2
```

Nhãn chứa dấu phẩy: lặp tham số (`labels=Q1, 2024&labels=Q2`). Dữ liệu phức tạp: `?d=` + JSON mã hóa URL:

```json
{"title":"...","data":[{"label":"A","value":1}]}
```

```json
{"labels":["A","B"],"series":[{"name":"x","values":[1,2]}]}
```

POST /draw — body JSON/CSV tạo liên kết ngắn vĩnh viễn
