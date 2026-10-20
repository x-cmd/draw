---
x-title: Deutsch — draw data formats
x-desc: labels/values, series, ?d= JSON.
x-sidebar: draw
x-keywords: draw, data, json, csv
---

# draw — Daten übergeben

```text
https://x-cmd.com/draw?type=pie&labels=A,B&values=3,2
```

Bei Labels mit Kommas: Parameter wiederholen (`labels=Q1, 2024&labels=Q2`). Komplexe Daten: `?d=` + URL-kodiertes JSON:

```json
{"title":"...","data":[{"label":"A","value":1}]}
```

```json
{"labels":["A","B"],"series":[{"name":"x","values":[1,2]}]}
```

POST /draw — JSON/CSV-Body erzeugt permanenten Kurzlink
