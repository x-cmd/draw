---
x-title: 日本語 — draw data formats
x-desc: labels/values, series, ?d= JSON.
x-sidebar: draw
x-keywords: draw, data, json, csv
---

# draw — データの渡し方

```text
https://x-cmd.com/draw?type=pie&labels=A,B&values=3,2
```

カンマを含むラベルはパラメータを繰り返し(`labels=Q1, 2024&labels=Q2`)。複雑なデータは `?d=` + URL エンコード JSON:

```json
{"title":"...","data":[{"label":"A","value":1}]}
```

```json
{"labels":["A","B"],"series":[{"name":"x","values":[1,2]}]}
```

POST /draw — JSON/CSV body で永久ショートリンクを作成
