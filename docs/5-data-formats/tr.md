---
x-title: Türkçe — draw data formats
x-desc: labels/values, series, ?d= JSON.
x-sidebar: draw
x-keywords: draw, data, json, csv
---

# draw — Veri geçirme

```text
https://x-cmd.com/draw?type=pie&labels=A,B&values=3,2
```

Virgüllü etiketler: parametreyi tekrarla (`labels=Q1, 2024&labels=Q2`). Karmaşık veri: `?d=` + URL kodlu JSON:

```json
{"title":"...","data":[{"label":"A","value":1}]}
```

```json
{"labels":["A","B"],"series":[{"name":"x","values":[1,2]}]}
```

POST /draw — JSON/CSV gövdesi kalıcı kısa bağlantı üretir
