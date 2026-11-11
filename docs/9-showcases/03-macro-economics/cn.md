---
x-title: 宏观经济 —— 指标、流向与地图
x-desc: 'x-cmd/draw 场景用例:宏观经济。人均 GDP、通胀、失业率、政策利率、贸易流向、CPI 构成、地区 GDP 等值图的真实 URL。'
x-sidebar: draw 场景用例 宏观经济
x-keywords: 宏观经济图表, gdp 图, 通胀图, draw 场景用例, svg
x-json-ld:
  '@context': https://schema.org
  '@graph':
    - '@type': TechArticle
      headline: 'draw 场景用例 宏观经济'
      inLanguage: 'cn'
      about: 'x-cmd/draw showcase 03-macro-economics'
---

# 宏观经济 —— 指标、流向与地图

经济简报里最常用的几种图形:水平、比率、流向与地理。

### 人均 GDP —— 排个名

```text
https://x-cmd.com/draw?type=hbar&title=2024%20%E5%B9%B4%E4%BA%BA%E5%9D%87%20GDP&labels=%E7%88%B1%E5%B0%94%E5%85%B0%2C%E7%91%9E%E5%A3%AB%2C%E6%96%B0%E5%8A%A0%E5%9D%A1%2C%E7%BE%8E%E5%9B%BD%2C%E6%97%A5%E6%9C%AC%2C%E4%B8%AD%E5%9B%BD&values=106000,100000,90500,87300,33800,12600&unit=USD
```

[![GDP per capita](https://x-cmd.com/draw?type=hbar&title=2024%20%E5%B9%B4%E4%BA%BA%E5%9D%87%20GDP&labels=%E7%88%B1%E5%B0%94%E5%85%B0%2C%E7%91%9E%E5%A3%AB%2C%E6%96%B0%E5%8A%A0%E5%9D%A1%2C%E7%BE%8E%E5%9B%BD%2C%E6%97%A5%E6%9C%AC%2C%E4%B8%AD%E5%9B%BD&values=106000,100000,90500,87300,33800,12600&unit=USD)](https://x-cmd.com/draw/explore?type=hbar&title=2024%20%E5%B9%B4%E4%BA%BA%E5%9D%87%20GDP&labels=%E7%88%B1%E5%B0%94%E5%85%B0%2C%E7%91%9E%E5%A3%AB%2C%E6%96%B0%E5%8A%A0%E5%9D%A1%2C%E7%BE%8E%E5%9B%BD%2C%E6%97%A5%E6%9C%AC%2C%E4%B8%AD%E5%9B%BD&values=106000,100000,90500,87300,33800,12600&unit=USD)

排好序的横条图,单位放在角上:差距的形状才是重点,不是小数点后两位。

### 通胀 —— 趋势线

```text
https://x-cmd.com/draw?type=line&title=%E9%80%9A%E8%83%80%E7%8E%87&labels=2021,2022,2023,2024,2025,2026&values=4.7,8.0,4.1,2.9,2.4,2.2&unit=%25
```

[![Inflation rate](https://x-cmd.com/draw?type=line&title=%E9%80%9A%E8%83%80%E7%8E%87&labels=2021,2022,2023,2024,2025,2026&values=4.7,8.0,4.1,2.9,2.4,2.2&unit=%25)](https://x-cmd.com/draw/explore?type=line&title=%E9%80%9A%E8%83%80%E7%8E%87&labels=2021,2022,2023,2024,2025,2026&values=4.7,8.0,4.1,2.9,2.4,2.2&unit=%25)

比率随时间变化,一根干净的折线就够;加上 `unit=%25`,轴上就带着单位。

### 失业率 —— 涂满它

```text
https://x-cmd.com/draw?type=area&t=evil&title=%E5%A4%B1%E4%B8%9A%E7%8E%87&labels=2021,2022,2023,2024,2025,2026&values=5.4,3.6,3.6,4.1,4.3,4.2&unit=%25
```

[![Unemployment rate](https://x-cmd.com/draw?type=area&t=evil&title=%E5%A4%B1%E4%B8%9A%E7%8E%87&labels=2021,2022,2023,2024,2025,2026&values=5.4,3.6,3.6,4.1,4.3,4.2&unit=%25)](https://x-cmd.com/draw/explore?type=area&t=evil&title=%E5%A4%B1%E4%B8%9A%E7%8E%87&labels=2021,2022,2023,2024,2025,2026&values=5.4,3.6,3.6,4.1,4.3,4.2&unit=%25)

同样的数字,填上色:那块阴影读起来是「有多糟」,不只是「有多少」。

### 政策利率 —— 委员会动过几次

```text
https://x-cmd.com/draw?type=line&title=%E6%94%BF%E7%AD%96%E5%88%A9%E7%8E%87&labels=2021,2022,2023,2024,2025,2026&values=0.25,4.50,5.50,5.00,4.25,3.75&unit=%25
```

[![Policy rate](https://x-cmd.com/draw?type=line&title=%E6%94%BF%E7%AD%96%E5%88%A9%E7%8E%87&labels=2021,2022,2023,2024,2025,2026&values=0.25,4.50,5.50,5.00,4.25,3.75&unit=%25)](https://x-cmd.com/draw/explore?type=line&title=%E6%94%BF%E7%AD%96%E5%88%A9%E7%8E%87&labels=2021,2022,2023,2024,2025,2026&values=0.25,4.50,5.50,5.00,4.25,3.75&unit=%25)

横盘的那几段在折线上看得很清楚,两端标上名字就完整了。

### 贸易流向 —— 货往哪走

```text
https://x-cmd.com/draw?type=sankey&title=%E8%B4%B8%E6%98%93%E6%B5%81%E5%90%91&labels=%E4%B8%AD%E5%9B%BD%2C%E4%B8%9C%E7%9B%9F%2C%E6%AC%A7%E7%9B%9F%2CUS&links=%E4%B8%AD%E5%9B%BD%3E%E4%B8%9C%E7%9B%9F%3A180%3B%E4%B8%AD%E5%9B%BD%3E%E6%AC%A7%E7%9B%9F%3A210%3B%E4%B8%AD%E5%9B%BD%3EUS%3A140%3B%E4%B8%9C%E7%9B%9F%3EUS%3A60%3B%E6%AC%A7%E7%9B%9F%3EUS%3A95
```

[![Trade flows](https://x-cmd.com/draw?type=sankey&title=%E8%B4%B8%E6%98%93%E6%B5%81%E5%90%91&labels=%E4%B8%AD%E5%9B%BD%2C%E4%B8%9C%E7%9B%9F%2C%E6%AC%A7%E7%9B%9F%2CUS&links=%E4%B8%AD%E5%9B%BD%3E%E4%B8%9C%E7%9B%9F%3A180%3B%E4%B8%AD%E5%9B%BD%3E%E6%AC%A7%E7%9B%9F%3A210%3B%E4%B8%AD%E5%9B%BD%3EUS%3A140%3B%E4%B8%9C%E7%9B%9F%3EUS%3A60%3B%E6%AC%A7%E7%9B%9F%3EUS%3A95)](https://x-cmd.com/draw/explore?type=sankey&title=%E8%B4%B8%E6%98%93%E6%B5%81%E5%90%91&labels=%E4%B8%AD%E5%9B%BD%2C%E4%B8%9C%E7%9B%9F%2C%E6%AC%A7%E7%9B%9F%2CUS&links=%E4%B8%AD%E5%9B%BD%3E%E4%B8%9C%E7%9B%9F%3A180%3B%E4%B8%AD%E5%9B%BD%3E%E6%AC%A7%E7%9B%9F%3A210%3B%E4%B8%AD%E5%9B%BD%3EUS%3A140%3B%E4%B8%9C%E7%9B%9F%3EUS%3A60%3B%E6%AC%A7%E7%9B%9F%3EUS%3A95)

画贸易最诚实的办法就是桑基图:带宽就是量。

### CPI 篮子 —— 哪些东西涨价了

```text
https://x-cmd.com/draw?type=pie&t=market-mono&title=CPI%20%E6%9E%84%E6%88%90&labels=%E4%BD%8F%E6%88%BF%2C%E9%A3%9F%E5%93%81%2C%E8%83%BD%E6%BA%90%2C%E4%BA%A4%E9%80%9A%2C%E6%A0%B8%E5%BF%83&values=32,19,15,12,22&unit=%25
```

[![CPI basket](https://x-cmd.com/draw?type=pie&t=market-mono&title=CPI%20%E6%9E%84%E6%88%90&labels=%E4%BD%8F%E6%88%BF%2C%E9%A3%9F%E5%93%81%2C%E8%83%BD%E6%BA%90%2C%E4%BA%A4%E9%80%9A%2C%E6%A0%B8%E5%BF%83&values=32,19,15,12,22&unit=%25)](https://x-cmd.com/draw/explore?type=pie&t=market-mono&title=CPI%20%E6%9E%84%E6%88%90&labels=%E4%BD%8F%E6%88%BF%2C%E9%A3%9F%E5%93%81%2C%E8%83%BD%E6%BA%90%2C%E4%BA%A4%E9%80%9A%2C%E6%A0%B8%E5%BF%83&values=32,19,15,12,22&unit=%25)

灰阶环形图在黑白简报里也印得清楚。

### 分地区 GDP —— 用地图

```text
https://x-cmd.com/draw/echarts?d=%7B%22title%22%3A%7B%22text%22%3A%22%E7%BE%8E%E5%9B%BD%E5%90%84%E5%B7%9E%20%C2%B7%20%E4%BA%BA%E5%9D%87%20GDP%202024%20%C2%B7%20%E5%8D%83%E7%BE%8E%E5%85%83%22%7D%2C%22visualMap%22%3A%7B%22min%22%3A50%2C%22max%22%3A120%2C%22orient%22%3A%22horizontal%22%2C%22left%22%3A%22center%22%2C%22bottom%22%3A8%2C%22text%22%3A%5B%22%E9%AB%98%22%2C%22%E4%BD%8E%22%5D%2C%22itemWidth%22%3A12%2C%22itemHeight%22%3A200%2C%22inRange%22%3A%7B%22color%22%3A%5B%22%23dbeafe%22%2C%22%2393c5fd%22%2C%22%233b82f6%22%2C%22%231d4ed8%22%5D%7D%7D%2C%22series%22%3A%5B%7B%22type%22%3A%22map%22%2C%22map%22%3A%22USA%22%2C%22roam%22%3Afalse%2C%22label%22%3A%7B%22show%22%3Atrue%2C%22fontSize%22%3A9%7D%2C%22labelLayout%22%3A%7B%22hideOverlap%22%3Atrue%7D%2C%22itemStyle%22%3A%7B%22areaColor%22%3A%22%23f1f5f9%22%2C%22borderColor%22%3A%22%23ffffff%22%2C%22borderWidth%22%3A0.6%7D%2C%22data%22%3A%5B%7B%22name%22%3A%22New%20York%22%2C%22value%22%3A117%7D%2C%7B%22name%22%3A%22Washington%22%2C%22value%22%3A108%7D%2C%7B%22name%22%3A%22California%22%2C%22value%22%3A103%7D%2C%7B%22name%22%3A%22Illinois%22%2C%22value%22%3A90%7D%2C%7B%22name%22%3A%22Texas%22%2C%22value%22%3A89%7D%2C%7B%22name%22%3A%22Florida%22%2C%22value%22%3A74%7D%2C%7B%22name%22%3A%22Mississippi%22%2C%22value%22%3A54%7D%5D%7D%5D%7D&w=760&h=520
```

[![US states · GDP per capita](https://x-cmd.com/draw/echarts?d=%7B%22title%22%3A%7B%22text%22%3A%22%E7%BE%8E%E5%9B%BD%E5%90%84%E5%B7%9E%20%C2%B7%20%E4%BA%BA%E5%9D%87%20GDP%202024%20%C2%B7%20%E5%8D%83%E7%BE%8E%E5%85%83%22%7D%2C%22visualMap%22%3A%7B%22min%22%3A50%2C%22max%22%3A120%2C%22orient%22%3A%22horizontal%22%2C%22left%22%3A%22center%22%2C%22bottom%22%3A8%2C%22text%22%3A%5B%22%E9%AB%98%22%2C%22%E4%BD%8E%22%5D%2C%22itemWidth%22%3A12%2C%22itemHeight%22%3A200%2C%22inRange%22%3A%7B%22color%22%3A%5B%22%23dbeafe%22%2C%22%2393c5fd%22%2C%22%233b82f6%22%2C%22%231d4ed8%22%5D%7D%7D%2C%22series%22%3A%5B%7B%22type%22%3A%22map%22%2C%22map%22%3A%22USA%22%2C%22roam%22%3Afalse%2C%22label%22%3A%7B%22show%22%3Atrue%2C%22fontSize%22%3A9%7D%2C%22labelLayout%22%3A%7B%22hideOverlap%22%3Atrue%7D%2C%22itemStyle%22%3A%7B%22areaColor%22%3A%22%23f1f5f9%22%2C%22borderColor%22%3A%22%23ffffff%22%2C%22borderWidth%22%3A0.6%7D%2C%22data%22%3A%5B%7B%22name%22%3A%22New%20York%22%2C%22value%22%3A117%7D%2C%7B%22name%22%3A%22Washington%22%2C%22value%22%3A108%7D%2C%7B%22name%22%3A%22California%22%2C%22value%22%3A103%7D%2C%7B%22name%22%3A%22Illinois%22%2C%22value%22%3A90%7D%2C%7B%22name%22%3A%22Texas%22%2C%22value%22%3A89%7D%2C%7B%22name%22%3A%22Florida%22%2C%22value%22%3A74%7D%2C%7B%22name%22%3A%22Mississippi%22%2C%22value%22%3A54%7D%5D%7D%5D%7D&w=760&h=520)](https://x-cmd.com/draw/explore/echarts?d=%7B%22title%22%3A%7B%22text%22%3A%22US%20states%20%C2%B7%20GDP%20per%20capita%202024%20%C2%B7%20thousand%20USD%22%7D%2C%22visualMap%22%3A%7B%22min%22%3A50%2C%22max%22%3A120%2C%22orient%22%3A%22horizontal%22%2C%22left%22%3A%22center%22%2C%22bottom%22%3A8%2C%22text%22%3A%5B%22high%22%2C%22low%22%5D%2C%22itemWidth%22%3A12%2C%22itemHeight%22%3A200%2C%22inRange%22%3A%7B%22color%22%3A%5B%22%23dbeafe%22%2C%22%2393c5fd%22%2C%22%233b82f6%22%2C%22%231d4ed8%22%5D%7D%7D%2C%22series%22%3A%5B%7B%22type%22%3A%22map%22%2C%22map%22%3A%22USA%22%2C%22roam%22%3Afalse%2C%22label%22%3A%7B%22show%22%3Atrue%2C%22fontSize%22%3A9%7D%2C%22labelLayout%22%3A%7B%22hideOverlap%22%3Atrue%7D%2C%22itemStyle%22%3A%7B%22areaColor%22%3A%22%23f1f5f9%22%2C%22borderColor%22%3A%22%23ffffff%22%2C%22borderWidth%22%3A0.6%7D%2C%22data%22%3A%5B%7B%22name%22%3A%22New%20York%22%2C%22value%22%3A117%7D%2C%7B%22name%22%3A%22Washington%22%2C%22value%22%3A108%7D%2C%7B%22name%22%3A%22California%22%2C%22value%22%3A103%7D%2C%7B%22name%22%3A%22Illinois%22%2C%22value%22%3A90%7D%2C%7B%22name%22%3A%22Texas%22%2C%22value%22%3A89%7D%2C%7B%22name%22%3A%22Florida%22%2C%22value%22%3A74%7D%2C%7B%22name%22%3A%22Mississippi%22%2C%22value%22%3A54%7D%5D%7D%5D%7D&w=760&h=520)

用随服务分发的 GeoJSON 画等值图 —— 不用地图服务,不要 API key。


## 该用哪张图

| 问题 | 图种 | 参考 |
|---|---|---|
| 哪些经济体最富? | 横条图 | [hbar](../../2-data-charts/03-hbar/cn.md) |
| 通胀在回落吗? | 折线图 | [line](../../2-data-charts/04-line/cn.md) |
| 就业市场有多差? | 面积图 | [area](../../2-data-charts/05-area/cn.md) |
| 央行做了什么? | 折线图 | [line](../../2-data-charts/04-line/cn.md) |
| 贸易往哪走? | 桑基图 | [sankey](../../3-relations/01-sankey/cn.md) |
| 价格篮子里是什么? | 饼图 | [pie](../../2-data-charts/01-pie/cn.md) |
| 各地差别有多大? | 地图 | [maps](../../8-maps/01-maps/cn.md) |
