---
x-title: Română — draw data formats
x-desc: labels/values, series, ?d= JSON.
x-sidebar: draw
x-keywords: draw, data, json, csv
---

# draw — Transmiterea datelor

```text
https://x-cmd.com/draw?type=pie&labels=A,B&values=3,2
```

Etichete cu virgule: repetă parametrul (`labels=Q1, 2024&labels=Q2`). Date complexe: `?d=` + JSON codificat URL:

```json
{"title":"...","data":[{"label":"A","value":1}]}
```

```json
{"labels":["A","B"],"series":[{"name":"x","values":[1,2]}]}
```

POST /draw — un body JSON/CSV creează un link scurt permanent
