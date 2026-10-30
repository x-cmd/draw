---
x-title: Español — draw data formats
x-desc: labels/values, series, ?d= JSON.
x-sidebar: draw
x-keywords: draw, data, json, csv
---

# draw — Pasar datos

```text
https://x-cmd.com/draw?type=pie&labels=A,B&values=3,2
```

Etiquetas con comas: repite el parámetro (`labels=Q1, 2024&labels=Q2`). Datos complejos: `?d=` + JSON codificado en URL:

```json
{"title":"...","data":[{"label":"A","value":1}]}
```

```json
{"labels":["A","B"],"series":[{"name":"x","values":[1,2]}]}
```

POST /draw — body JSON/CSV crea un enlace corto permanente
