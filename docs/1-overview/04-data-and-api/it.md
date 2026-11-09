---
x-title: Italiano — draw data formats
x-desc: labels/values, series, ?d= JSON.
x-sidebar: draw
x-keywords: draw, data, json, csv
---

# draw — Passare i dati

```text
https://x-cmd.com/draw?type=pie&labels=A,B&values=3,2
```

Etichette con virgole: ripeti il parametro (`labels=Q1, 2024&labels=Q2`). Dati complessi: `?d=` + JSON codificato URL:

```json
{"title":"...","data":[{"label":"A","value":1}]}
```

```json
{"labels":["A","B"],"series":[{"name":"x","values":[1,2]}]}
```

POST /draw — un body JSON/CSV crea un link breve permanente
