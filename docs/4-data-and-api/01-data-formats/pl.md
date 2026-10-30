---
x-title: Polski — draw data formats
x-desc: labels/values, series, ?d= JSON.
x-sidebar: draw
x-keywords: draw, data, json, csv
---

# draw — Przekazywanie danych

```text
https://x-cmd.com/draw?type=pie&labels=A,B&values=3,2
```

Etykiety z przecinkami: powtórz parametr (`labels=Q1, 2024&labels=Q2`). Złożone dane: `?d=` + JSON zakodowany w URL:

```json
{"title":"...","data":[{"label":"A","value":1}]}
```

```json
{"labels":["A","B"],"series":[{"name":"x","values":[1,2]}]}
```

POST /draw — body JSON/CSV tworzy trwały krótki link
