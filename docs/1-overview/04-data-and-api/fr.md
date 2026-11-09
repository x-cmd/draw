---
x-title: Français — draw data formats
x-desc: labels/values, series, ?d= JSON.
x-sidebar: draw
x-keywords: draw, data, json, csv
---

# draw — Transmettre les données

```text
https://x-cmd.com/draw?type=pie&labels=A,B&values=3,2
```

Libellés avec virgules : répétez le paramètre (`labels=Q1, 2024&labels=Q2`). Données complexes : `?d=` + JSON encodé URL :

```json
{"title":"...","data":[{"label":"A","value":1}]}
```

```json
{"labels":["A","B"],"series":[{"name":"x","values":[1,2]}]}
```

POST /draw — un body JSON/CSV crée un lien court permanent
