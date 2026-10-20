---
x-title: Português — draw data formats
x-desc: labels/values, series, ?d= JSON.
x-sidebar: draw
x-keywords: draw, data, json, csv
---

# draw — Passando dados

```text
https://x-cmd.com/draw?type=pie&labels=A,B&values=3,2
```

Rótulos com vírgulas: repita o parâmetro (`labels=Q1, 2024&labels=Q2`). Dados complexos: `?d=` + JSON codificado em URL:

```json
{"title":"...","data":[{"label":"A","value":1}]}
```

```json
{"labels":["A","B"],"series":[{"name":"x","values":[1,2]}]}
```

POST /draw — body JSON/CSV cria link curto permanente
