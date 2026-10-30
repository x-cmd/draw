---
x-title: Українська — draw data formats
x-desc: labels/values, series, ?d= JSON.
x-sidebar: draw
x-keywords: draw, data, json, csv
---

# draw — Передача даних

```text
https://x-cmd.com/draw?type=pie&labels=A,B&values=3,2
```

Мітки з комами: повторюйте параметр (`labels=Q1, 2024&labels=Q2`). Складні дані: `?d=` + URL-кодований JSON:

```json
{"title":"...","data":[{"label":"A","value":1}]}
```

```json
{"labels":["A","B"],"series":[{"name":"x","values":[1,2]}]}
```

POST /draw — JSON/CSV body створює постійне коротке посилання
