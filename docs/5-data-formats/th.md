---
x-title: ไทย — draw data formats
x-desc: labels/values, series, ?d= JSON.
x-sidebar: draw
x-keywords: draw, data, json, csv
---

# draw — การส่งข้อมูล

```text
https://x-cmd.com/draw?type=pie&labels=A,B&values=3,2
```

ป้ายที่มีจุลภาค: ทำซ้ำพารามิเตอร์ (`labels=Q1, 2024&labels=Q2`) ข้อมูลซับซ้อน: `?d=` + JSON เข้ารหัส URL:

```json
{"title":"...","data":[{"label":"A","value":1}]}
```

```json
{"labels":["A","B"],"series":[{"name":"x","values":[1,2]}]}
```

POST /draw — body JSON/CSV สร้างลิงก์สั้นถาวร
