---
x-title: 한국어 — draw data formats
x-desc: labels/values, series, ?d= JSON.
x-sidebar: draw
x-keywords: draw, data, json, csv
---

# draw — 데이터 전달

```text
https://x-cmd.com/draw?type=pie&labels=A,B&values=3,2
```

쉼표 포함 라벨은 파라미터 반복(`labels=Q1, 2024&labels=Q2`). 복잡한 데이터는 `?d=` + URL 인코딩 JSON:

```json
{"title":"...","data":[{"label":"A","value":1}]}
```

```json
{"labels":["A","B"],"series":[{"name":"x","values":[1,2]}]}
```

POST /draw — JSON/CSV body로 영구 짧은 링크 생성
