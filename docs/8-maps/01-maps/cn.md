---
x-title: 地图 —— 随包分发的 GeoJSON 画等值图
x-desc: 'x-cmd/draw 地图(`/draw/echarts?d=`)。用随服务分发的 GeoJSON 画等值图:美国、中国、欧盟、日本、巴西、澳大利亚、德国、韩国。参数:`d=` ECharts option 的 JSON,`w=/h=`。'
x-sidebar: draw 地图
x-keywords: 地图, draw, svg, 等值图, 地理, 区域
x-json-ld:
  '@context': https://schema.org
  '@graph':
    - '@type': TechArticle
      headline: 'draw 地图'
      inLanguage: 'cn'
      about: 'x-cmd/draw 01-maps'
---

# 地图 —— 随包分发的 GeoJSON 画等值图

地图走 ECharts 层:`d=` 放一份纯 JSON option,地区轮廓随服务一起分发 ——
不用地图服务,不要 API key,也不拉瓦片。

## 示例(URL 即所得,点击图片进入交互页)

### 美国各州 · 人均 GDP

```text
https://x-cmd.com/draw/echarts?d=%7B%22title%22%3A%7B%22text%22%3A%22%E7%BE%8E%E5%9B%BD%E5%90%84%E5%B7%9E%20%C2%B7%20%E4%BA%BA%E5%9D%87%20GDP%202024%20%C2%B7%20%E5%8D%83%E7%BE%8E%E5%85%83%22%7D%2C%22visualMap%22%3A%7B%22min%22%3A50%2C%22max%22%3A120%2C%22orient%22%3A%22horizontal%22%2C%22left%22%3A%22center%22%2C%22bottom%22%3A8%2C%22text%22%3A%5B%22%E9%AB%98%22%2C%22%E4%BD%8E%22%5D%2C%22itemWidth%22%3A12%2C%22itemHeight%22%3A200%2C%22inRange%22%3A%7B%22color%22%3A%5B%22%23dbeafe%22%2C%22%2393c5fd%22%2C%22%233b82f6%22%2C%22%231d4ed8%22%5D%7D%7D%2C%22series%22%3A%5B%7B%22type%22%3A%22map%22%2C%22map%22%3A%22USA%22%2C%22roam%22%3Afalse%2C%22label%22%3A%7B%22show%22%3Atrue%2C%22fontSize%22%3A9%7D%2C%22labelLayout%22%3A%7B%22hideOverlap%22%3Atrue%7D%2C%22itemStyle%22%3A%7B%22areaColor%22%3A%22%23f1f5f9%22%2C%22borderColor%22%3A%22%23ffffff%22%2C%22borderWidth%22%3A0.6%7D%2C%22data%22%3A%5B%7B%22name%22%3A%22New%20York%22%2C%22value%22%3A117%7D%2C%7B%22name%22%3A%22Washington%22%2C%22value%22%3A108%7D%2C%7B%22name%22%3A%22California%22%2C%22value%22%3A103%7D%2C%7B%22name%22%3A%22Illinois%22%2C%22value%22%3A90%7D%2C%7B%22name%22%3A%22Texas%22%2C%22value%22%3A89%7D%2C%7B%22name%22%3A%22Florida%22%2C%22value%22%3A74%7D%2C%7B%22name%22%3A%22Mississippi%22%2C%22value%22%3A54%7D%5D%7D%5D%7D&w=760&h=520
```

[![美国各州 · 人均 GDP](https://x-cmd.com/draw/echarts?d=%7B%22title%22%3A%7B%22text%22%3A%22%E7%BE%8E%E5%9B%BD%E5%90%84%E5%B7%9E%20%C2%B7%20%E4%BA%BA%E5%9D%87%20GDP%202024%20%C2%B7%20%E5%8D%83%E7%BE%8E%E5%85%83%22%7D%2C%22visualMap%22%3A%7B%22min%22%3A50%2C%22max%22%3A120%2C%22orient%22%3A%22horizontal%22%2C%22left%22%3A%22center%22%2C%22bottom%22%3A8%2C%22text%22%3A%5B%22%E9%AB%98%22%2C%22%E4%BD%8E%22%5D%2C%22itemWidth%22%3A12%2C%22itemHeight%22%3A200%2C%22inRange%22%3A%7B%22color%22%3A%5B%22%23dbeafe%22%2C%22%2393c5fd%22%2C%22%233b82f6%22%2C%22%231d4ed8%22%5D%7D%7D%2C%22series%22%3A%5B%7B%22type%22%3A%22map%22%2C%22map%22%3A%22USA%22%2C%22roam%22%3Afalse%2C%22label%22%3A%7B%22show%22%3Atrue%2C%22fontSize%22%3A9%7D%2C%22labelLayout%22%3A%7B%22hideOverlap%22%3Atrue%7D%2C%22itemStyle%22%3A%7B%22areaColor%22%3A%22%23f1f5f9%22%2C%22borderColor%22%3A%22%23ffffff%22%2C%22borderWidth%22%3A0.6%7D%2C%22data%22%3A%5B%7B%22name%22%3A%22New%20York%22%2C%22value%22%3A117%7D%2C%7B%22name%22%3A%22Washington%22%2C%22value%22%3A108%7D%2C%7B%22name%22%3A%22California%22%2C%22value%22%3A103%7D%2C%7B%22name%22%3A%22Illinois%22%2C%22value%22%3A90%7D%2C%7B%22name%22%3A%22Texas%22%2C%22value%22%3A89%7D%2C%7B%22name%22%3A%22Florida%22%2C%22value%22%3A74%7D%2C%7B%22name%22%3A%22Mississippi%22%2C%22value%22%3A54%7D%5D%7D%5D%7D&w=760&h=520)](https://x-cmd.com/draw/explore/echarts?d=%7B%22title%22%3A%7B%22text%22%3A%22US%20states%20%C2%B7%20GDP%20per%20capita%202024%20%C2%B7%20thousand%20USD%22%7D%2C%22visualMap%22%3A%7B%22min%22%3A50%2C%22max%22%3A120%2C%22orient%22%3A%22horizontal%22%2C%22left%22%3A%22center%22%2C%22bottom%22%3A8%2C%22text%22%3A%5B%22high%22%2C%22low%22%5D%2C%22itemWidth%22%3A12%2C%22itemHeight%22%3A200%2C%22inRange%22%3A%7B%22color%22%3A%5B%22%23dbeafe%22%2C%22%2393c5fd%22%2C%22%233b82f6%22%2C%22%231d4ed8%22%5D%7D%7D%2C%22series%22%3A%5B%7B%22type%22%3A%22map%22%2C%22map%22%3A%22USA%22%2C%22roam%22%3Afalse%2C%22label%22%3A%7B%22show%22%3Atrue%2C%22fontSize%22%3A9%7D%2C%22labelLayout%22%3A%7B%22hideOverlap%22%3Atrue%7D%2C%22itemStyle%22%3A%7B%22areaColor%22%3A%22%23f1f5f9%22%2C%22borderColor%22%3A%22%23ffffff%22%2C%22borderWidth%22%3A0.6%7D%2C%22data%22%3A%5B%7B%22name%22%3A%22New%20York%22%2C%22value%22%3A117%7D%2C%7B%22name%22%3A%22Washington%22%2C%22value%22%3A108%7D%2C%7B%22name%22%3A%22California%22%2C%22value%22%3A103%7D%2C%7B%22name%22%3A%22Illinois%22%2C%22value%22%3A90%7D%2C%7B%22name%22%3A%22Texas%22%2C%22value%22%3A89%7D%2C%7B%22name%22%3A%22Florida%22%2C%22value%22%3A74%7D%2C%7B%22name%22%3A%22Mississippi%22%2C%22value%22%3A54%7D%5D%7D%5D%7D&w=760&h=520)

### 中国各省市

```text
https://x-cmd.com/draw/echarts?d=%7B%22title%22%3A%7B%22text%22%3A%22%E4%B8%AD%E5%9B%BD%E5%90%84%E7%9C%81%E5%B8%82%20%C2%B7%20%E4%BA%BA%E5%9D%87%20GDP%28%E7%A4%BA%E4%BE%8B%29%22%7D%2C%22visualMap%22%3A%7B%22min%22%3A40%2C%22max%22%3A130%2C%22orient%22%3A%22vertical%22%2C%22left%22%3A10%2C%22bottom%22%3A16%2C%22text%22%3A%5B%22%E9%AB%98%22%2C%22%E4%BD%8E%22%5D%2C%22itemWidth%22%3A12%2C%22itemHeight%22%3A150%2C%22inRange%22%3A%7B%22color%22%3A%5B%22%23dbeafe%22%2C%22%2393c5fd%22%2C%22%233b82f6%22%2C%22%231d4ed8%22%5D%7D%7D%2C%22series%22%3A%5B%7B%22type%22%3A%22map%22%2C%22map%22%3A%22CN%22%2C%22roam%22%3Afalse%2C%22label%22%3A%7B%22show%22%3Atrue%2C%22fontSize%22%3A9%2C%22color%22%3A%22%230f172a%22%7D%2C%22labelLayout%22%3A%7B%22hideOverlap%22%3Atrue%7D%2C%22itemStyle%22%3A%7B%22areaColor%22%3A%22%23f1f5f9%22%2C%22borderColor%22%3A%22%23ffffff%22%2C%22borderWidth%22%3A0.6%7D%2C%22data%22%3A%5B%7B%22name%22%3A%22%E5%8C%97%E4%BA%AC%22%2C%22value%22%3A118%7D%2C%7B%22name%22%3A%22%E4%B8%8A%E6%B5%B7%22%2C%22value%22%3A121%7D%2C%7B%22name%22%3A%22%E5%B9%BF%E4%B8%9C%22%2C%22value%22%3A104%7D%2C%7B%22name%22%3A%22%E6%B1%9F%E8%8B%8F%22%2C%22value%22%3A101%7D%2C%7B%22name%22%3A%22%E6%B5%99%E6%B1%9F%22%2C%22value%22%3A108%7D%2C%7B%22name%22%3A%22%E5%9B%9B%E5%B7%9D%22%2C%22value%22%3A70%7D%2C%7B%22name%22%3A%22%E6%B2%B3%E5%8D%97%22%2C%22value%22%3A63%7D%2C%7B%22name%22%3A%22%E7%94%98%E8%82%83%22%2C%22value%22%3A48%7D%5D%7D%5D%7D&w=560&h=700
```

[![中国各省市 · 人均 GDP](https://x-cmd.com/draw/echarts?d=%7B%22title%22%3A%7B%22text%22%3A%22%E4%B8%AD%E5%9B%BD%E5%90%84%E7%9C%81%E5%B8%82%20%C2%B7%20%E4%BA%BA%E5%9D%87%20GDP%28%E7%A4%BA%E4%BE%8B%29%22%7D%2C%22visualMap%22%3A%7B%22min%22%3A40%2C%22max%22%3A130%2C%22orient%22%3A%22vertical%22%2C%22left%22%3A10%2C%22bottom%22%3A16%2C%22text%22%3A%5B%22%E9%AB%98%22%2C%22%E4%BD%8E%22%5D%2C%22itemWidth%22%3A12%2C%22itemHeight%22%3A150%2C%22inRange%22%3A%7B%22color%22%3A%5B%22%23dbeafe%22%2C%22%2393c5fd%22%2C%22%233b82f6%22%2C%22%231d4ed8%22%5D%7D%7D%2C%22series%22%3A%5B%7B%22type%22%3A%22map%22%2C%22map%22%3A%22CN%22%2C%22roam%22%3Afalse%2C%22label%22%3A%7B%22show%22%3Atrue%2C%22fontSize%22%3A9%2C%22color%22%3A%22%230f172a%22%7D%2C%22labelLayout%22%3A%7B%22hideOverlap%22%3Atrue%7D%2C%22itemStyle%22%3A%7B%22areaColor%22%3A%22%23f1f5f9%22%2C%22borderColor%22%3A%22%23ffffff%22%2C%22borderWidth%22%3A0.6%7D%2C%22data%22%3A%5B%7B%22name%22%3A%22%E5%8C%97%E4%BA%AC%22%2C%22value%22%3A118%7D%2C%7B%22name%22%3A%22%E4%B8%8A%E6%B5%B7%22%2C%22value%22%3A121%7D%2C%7B%22name%22%3A%22%E5%B9%BF%E4%B8%9C%22%2C%22value%22%3A104%7D%2C%7B%22name%22%3A%22%E6%B1%9F%E8%8B%8F%22%2C%22value%22%3A101%7D%2C%7B%22name%22%3A%22%E6%B5%99%E6%B1%9F%22%2C%22value%22%3A108%7D%2C%7B%22name%22%3A%22%E5%9B%9B%E5%B7%9D%22%2C%22value%22%3A70%7D%2C%7B%22name%22%3A%22%E6%B2%B3%E5%8D%97%22%2C%22value%22%3A63%7D%2C%7B%22name%22%3A%22%E7%94%98%E8%82%83%22%2C%22value%22%3A48%7D%5D%7D%5D%7D&w=560&h=700)](https://x-cmd.com/draw/explore/echarts?d=%7B%22title%22%3A%7B%22text%22%3A%22%E4%B8%AD%E5%9B%BD%E5%90%84%E7%9C%81%E5%B8%82%20%C2%B7%20%E4%BA%BA%E5%9D%87%20GDP%28%E7%A4%BA%E4%BE%8B%29%22%7D%2C%22visualMap%22%3A%7B%22min%22%3A40%2C%22max%22%3A130%2C%22orient%22%3A%22vertical%22%2C%22left%22%3A10%2C%22bottom%22%3A16%2C%22text%22%3A%5B%22%E9%AB%98%22%2C%22%E4%BD%8E%22%5D%2C%22itemWidth%22%3A12%2C%22itemHeight%22%3A150%2C%22inRange%22%3A%7B%22color%22%3A%5B%22%23dbeafe%22%2C%22%2393c5fd%22%2C%22%233b82f6%22%2C%22%231d4ed8%22%5D%7D%7D%2C%22series%22%3A%5B%7B%22type%22%3A%22map%22%2C%22map%22%3A%22CN%22%2C%22roam%22%3Afalse%2C%22label%22%3A%7B%22show%22%3Atrue%2C%22fontSize%22%3A9%2C%22color%22%3A%22%230f172a%22%7D%2C%22labelLayout%22%3A%7B%22hideOverlap%22%3Atrue%7D%2C%22itemStyle%22%3A%7B%22areaColor%22%3A%22%23f1f5f9%22%2C%22borderColor%22%3A%22%23ffffff%22%2C%22borderWidth%22%3A0.6%7D%2C%22data%22%3A%5B%7B%22name%22%3A%22%E5%8C%97%E4%BA%AC%22%2C%22value%22%3A118%7D%2C%7B%22name%22%3A%22%E4%B8%8A%E6%B5%B7%22%2C%22value%22%3A121%7D%2C%7B%22name%22%3A%22%E5%B9%BF%E4%B8%9C%22%2C%22value%22%3A104%7D%2C%7B%22name%22%3A%22%E6%B1%9F%E8%8B%8F%22%2C%22value%22%3A101%7D%2C%7B%22name%22%3A%22%E6%B5%99%E6%B1%9F%22%2C%22value%22%3A108%7D%2C%7B%22name%22%3A%22%E5%9B%9B%E5%B7%9D%22%2C%22value%22%3A70%7D%2C%7B%22name%22%3A%22%E6%B2%B3%E5%8D%97%22%2C%22value%22%3A63%7D%2C%7B%22name%22%3A%22%E7%94%98%E8%82%83%22%2C%22value%22%3A48%7D%5D%7D%5D%7D&w=560&h=700)

## 一、参数

| 参数 | 含义 | 默认 |
|---|---|---|
| `d=` | ECharts option 的 JSON | — |
| `w=` / `h=` | 画布尺寸 | 自然尺寸 |
| `v=` | 固定输出版本 | 最新 |

option 就是普通 ECharts:`series[].type` 填 `map`,`series[].map` 写区域名,
`series[].data` 放数值。

## 二、随服务分发的区域

| `map=` | 区域 | `data[].name` 用什么写 |
|---|---|---|
| `USA` | 美国 50 州 + DC | 英文 —— `California`、`New York` |
| `CN` | 中国各省市 | 中文简称 —— `北京`、`广东` |
| `EU` | 欧盟 27 国 | 英文 —— `Sweden`、`Spain` |
| `JP` | 日本 47 都道府县 | 英文 —— `Hokkaido`、`Aomori` |
| `BR` | 巴西各州 | 葡萄牙语 —— `Acre`、`Amazonas` |
| `AU` | 澳大利亚各州 | 英文 —— `Northern Territory` |
| `DE` | 德国 16 个联邦州 | 德语 —— `Hamburg`、`Niedersachsen` |
| `KR` | 韩国 17 个行政区 | 英文 —— `Gyeonggi-do` |

## 三、怎么才好读

- **`visualMap`** 把数值变成色带。`inRange.color` 必须写具体的 hex ——
  ECharts 没法对 CSS 变量做插值。
- **`series[].label`** 打开地名标注;`labelLayout.hideOverlap` 会丢掉挤不下的那些,
  这是地图还能看清的关键。
- **单个地区可以覆盖设置** —— 某个州可以带自己的文字和颜色,深色块就用白字:

```json
{"name":"California","value":103,"label":{"formatter":"CA","color":"#ffffff"}}
```

- **投影已经做好了。** 渲染器会替你设 `aspectScale: 1`,因为随包的 GeoJSON
  是投影过的平面坐标,不是原始经纬度。别动它。

## 四、踩坑

- **`series[].map` 填区域名**,不是国家名:`USA`、`CN`、`EU` …… 名字不认识会 400。
- **`data[].name` 要和 GeoJSON 完全一致** —— 是 `California` 不是 `CA`,
  是 `北京` 不是 `北京市`。对不上的名字直接不画。
- **`visualMap` 要 hex 颜色** —— `inRange.color` 里写 CSS 变量会渲染成坏掉的色带。
- **`w=` / `h=` 定的是画布不是地图** —— 地图会缩进剩下的空间,两边都留一点。

