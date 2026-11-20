# JSON、POST 与 ECharts

特殊字符多、结构复杂或扁平参数不足时读取。先构造合法 JSON，再用当前环境的 URL 编码函数整体编码一次，不手写百分号。

## 1. `?d=` 的两种含义

- `type=qr`：`d=` 是二维码承载的纯文本（≤1000 字符），不要包成 JSON；颜色用独立 `fg` / `bg`。
- 其他支持 JSON 的图种：`d=` 是 URL 编码后的 JSON。

## 2. 扩展：ECharts（`/draw/echarts`）

原生图表与专用 endpoint 没覆盖的图（热力图、箱线、烛台、旭日、漏斗、关系图、美国各州地图等），把 ECharts option 放进 `?d=`：

```
https://x-cmd.com/draw/echarts?d=%7B%22xAxis%22%3A%7B%22type%22%3A%22category%22%2C%22data%22%3A%5B%22A%22%2C%22B%22%5D%7D%2C%22yAxis%22%3A%7B%22type%22%3A%22value%22%7D%2C%22series%22%3A%5B%7B%22type%22%3A%22bar%22%2C%22data%22%3A%5B1%2C2%5D%7D%5D%7D
```

- 最简 option 即可出图，bar/line/scatter/boxplot 裸 option 自动补轴；`?d=` 之外共用 `w` / `h` / `t` / `scheme` / `v`。
- 风格自动注入系列色板、轴中性色、Inter 字体、明暗 auto；option 显式写的样式恒优先；`?d=` ≤16000 字符。
- 输出同嵌 `<metadata>`，保存 option 原文，可解析还原。
- 不要用 ECharts 重复实现原生图种；大体积 option 走本地渲染。

地图：随包带 US 各州 GeoJSON（50 州 + DC，Albers 投影），`"type":"map","map":"USA"` 即得 choropleth。`data[].name` 用州全名（California / New York 等），配 `visualMap` 上色；州上写数字用 `series.label.show` + `series.labelLayout.hideOverlap`，浅底深字、深底白字。

## 3. JSON 形态（`?d=`，URL 编码；15 种数据图表）

| 适用 | 结构 |
|---|---|
| 单系列（pie/bar/hbar/line/area/radar） | `{"title":"","data":[{"label":"A","value":1}]}` |
| 多系列（bar/line/area/radar） | `{"labels":["A","B"],"series":[{"name":"x","values":[1,2]}]}` |
| gauge 单值 | `{"value":87,"max":100}` |
| gauge 多环 | `{"max":100,"data":[{"label":"A","value":86}]}` |
| scatter | `{"points":[[1,4]]}` 或 `{"series":[{"name":"","points":[[1,4]]}]}` |
| combo | `{"labels":[],"series":[{"name":"","values":[]},{"name":"","values":[],"type":"line"}]}` |
| sankey | `{"labels":[],"links":[{"from":"A","to":"B","value":30}]}` |
| butterfly | `{"labels":["A"],"left":{"name":"","values":[7]},"right":{"name":"","values":[5]}}` |
| quadrant | `{"groups":[{"name":"A"},{"name":"B"},{"name":"C"},{"name":"D"}]}` 或 `{"items":[{"name":"A","x":0.2,"y":0.8}]}` |
| compass | `{"up":"自己","right":"他人","down":"组织","left":"环境"}` |

QR 没有 JSON 形态：`d=` 只收纯文本；颜色用 `fg` / `bg` 参数，或 POST body `{"text":"…","fg":"#333333","bg":"#ffffff"}`。

## 4. 创建短链（POST）

`POST /draw?type=<数据图种>`，body 与 `?d=` 同一套结构（JSON 或 CSV）；`type` / `t` / `scheme` / `w` / `h` / `num` 放 URL，不进 body：

POST 限 30 次/分钟/IP。

```sh
curl -X POST 'https://x-cmd.com/draw?type=pie&title=Stars' \
  -H 'content-type: application/json' \
  --data '{"data":[{"label":"TypeScript","value":4821},{"label":"Python","value":2312}]}'
# → 201 {"hash":"5168...","url":"https://x-cmd.com/draw/c/5168...","template":"pie"}
```

也接受 CSV（`text/csv`，首行表头，表头即系列名）：

```
label,Desktop,Mobile
Mon,120,80
Tue,180,90
```

QR 的 POST body 是 `{"text":"https://…","fg":"#333333","bg":"#ffffff"}`。同数据重复 POST 返回同 hash，幂等且不重复存储；创建时即校验，坏风格或坏结构不会入库成永久坏链。
