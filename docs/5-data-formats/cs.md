---
x-title: Čeština — draw data formats
x-desc: labels/values, series, ?d= JSON.
x-sidebar: draw
x-keywords: draw, data, json, csv
---

# draw — Předávání dat

```text
https://x-cmd.com/draw?type=pie&labels=A,B&values=3,2
```

Popisky s čárkami: opakujte parametr (`labels=Q1, 2024&labels=Q2`). Složitá data: `?d=` + URL-kódované JSON:

```json
{"title":"...","data":[{"label":"A","value":1}]}
```

```json
{"labels":["A","B"],"series":[{"name":"x","values":[1,2]}]}
```

POST /draw — JSON/CSV body vytvoří trvalý krátký odkaz
