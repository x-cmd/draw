---
x-title: 金融风控 —— 配置、风险与交易漏斗
x-desc: 'x-cmd/draw 场景用例:金融风控。资产配置、收益对基准、收益对风险、收入与利润率、一条业务线的四个选项、交易漏斗的真实 URL。'
x-sidebar: draw 场景用例 金融风控
x-keywords: 金融图表, 组合报告, 风险图, draw 场景用例, svg
x-json-ld:
  '@context': https://schema.org
  '@graph':
    - '@type': TechArticle
      headline: 'draw 场景用例 金融风控'
      inLanguage: 'cn'
      about: 'x-cmd/draw showcase 09-finance'
---

# 金融风控 —— 配置、风险与交易漏斗

季度投委会的材料,以及决定一条业务线去留的那张图。

### 资产配置 —— 怎么分

```text
https://x-cmd.com/draw?type=pie&t=market-mono&title=%E8%B5%84%E4%BA%A7%E9%85%8D%E7%BD%AE&labels=%E8%82%A1%E7%A5%A8%2C%E5%80%BA%E5%88%B8%2C%E7%8E%B0%E9%87%91%2C%E6%88%BF%E4%BA%A7%2C%E5%A4%A7%E5%AE%97%E5%95%86%E5%93%81&values=42,28,12,10,8&unit=%25
```

[![Asset allocation](https://x-cmd.com/draw?type=pie&t=market-mono&title=%E8%B5%84%E4%BA%A7%E9%85%8D%E7%BD%AE&labels=%E8%82%A1%E7%A5%A8%2C%E5%80%BA%E5%88%B8%2C%E7%8E%B0%E9%87%91%2C%E6%88%BF%E4%BA%A7%2C%E5%A4%A7%E5%AE%97%E5%95%86%E5%93%81&values=42,28,12,10,8&unit=%25)](https://x-cmd.com/draw/explore?type=pie&t=market-mono&title=%E8%B5%84%E4%BA%A7%E9%85%8D%E7%BD%AE&labels=%E8%82%A1%E7%A5%A8%2C%E5%80%BA%E5%88%B8%2C%E7%8E%B0%E9%87%91%2C%E6%88%BF%E4%BA%A7%2C%E5%A4%A7%E5%AE%97%E5%95%86%E5%93%81&values=42,28,12,10,8&unit=%25)

一个环,五个格子;灰阶风格印得出来。

### 月度收益对基准

```text
https://x-cmd.com/draw?type=line&title=%E7%B4%AF%E8%AE%A1%E6%94%B6%E7%9B%8A%E5%AF%B9%E6%AF%94%E5%9F%BA%E5%87%86&labels=1%E6%9C%88%2C2%E6%9C%88%2C3%E6%9C%88%2C4%E6%9C%88%2C5%E6%9C%88%2C6%E6%9C%88%2C7%E6%9C%88%2C8%E6%9C%88%2C9%E6%9C%88%2C10%E6%9C%88%2C11%E6%9C%88%2C12%E6%9C%88&series=portfolio:100,102,105,106,109,108,110,113,112,115,117,120&series=benchmark:100,101,104,105,107,106,107,109,109,111,112,114&unit=index
```

[![Cumulative return vs benchmark](https://x-cmd.com/draw?type=line&title=%E7%B4%AF%E8%AE%A1%E6%94%B6%E7%9B%8A%E5%AF%B9%E6%AF%94%E5%9F%BA%E5%87%86&labels=1%E6%9C%88%2C2%E6%9C%88%2C3%E6%9C%88%2C4%E6%9C%88%2C5%E6%9C%88%2C6%E6%9C%88%2C7%E6%9C%88%2C8%E6%9C%88%2C9%E6%9C%88%2C10%E6%9C%88%2C11%E6%9C%88%2C12%E6%9C%88&series=portfolio:100,102,105,106,109,108,110,113,112,115,117,120&series=benchmark:100,101,104,105,107,106,107,109,109,111,112,114&unit=index)](https://x-cmd.com/draw/explore?type=line&title=%E7%B4%AF%E8%AE%A1%E6%94%B6%E7%9B%8A%E5%AF%B9%E6%AF%94%E5%9F%BA%E5%87%86&labels=1%E6%9C%88%2C2%E6%9C%88%2C3%E6%9C%88%2C4%E6%9C%88%2C5%E6%9C%88%2C6%E6%9C%88%2C7%E6%9C%88%2C8%E6%9C%88%2C9%E6%9C%88%2C10%E6%9C%88%2C11%E6%9C%88%2C12%E6%9C%88&series=portfolio:100,102,105,106,109,108,110,113,112,115,117,120&series=benchmark:100,101,104,105,107,106,107,109,109,111,112,114&unit=index)

两条线基本重合 —— 组合多出来一点点。

### 收益对风险 —— 有效边界在哪

```text
https://x-cmd.com/draw?type=scatter&title=%E6%94%B6%E7%9B%8A%E4%B8%8E%E6%B3%A2%E5%8A%A8&x=6,8,11,14,17,21,25,29&y=3,5,9,12,18,24,31,38&title=Return%20against%20risk
```

[![Return vs risk](https://x-cmd.com/draw?type=scatter&title=%E6%94%B6%E7%9B%8A%E4%B8%8E%E6%B3%A2%E5%8A%A8&x=6,8,11,14,17,21,25,29&y=3,5,9,12,18,24,31,38&title=Return%20against%20risk)](https://x-cmd.com/draw/explore?type=scatter&title=%E6%94%B6%E7%9B%8A%E4%B8%8E%E6%B3%A2%E5%8A%A8&x=6,8,11,14,17,21,25,29&y=3,5,9,12,18,24,31,38&title=Return%20against%20risk)

一个点一个组合;左上角那几个是有效前沿上的。

### 收入与利润率 —— 董事会要看的那一对

```text
https://x-cmd.com/draw?type=combo&t=evil&title=%E8%90%A5%E6%94%B6%E4%B8%8E%E5%88%A9%E6%B6%A6%E7%8E%87&labels=Q1,Q2,Q3,Q4&series=%E8%90%A5%E6%94%B6%3A1200%2C1800%2C1500%2C2400&line=margin:5,8,6,12
```

[![Revenue and margin](https://x-cmd.com/draw?type=combo&t=evil&title=%E8%90%A5%E6%94%B6%E4%B8%8E%E5%88%A9%E6%B6%A6%E7%8E%87&labels=Q1,Q2,Q3,Q4&series=%E8%90%A5%E6%94%B6%3A1200%2C1800%2C1500%2C2400&line=margin:5,8,6,12)](https://x-cmd.com/draw/explore?type=combo&t=evil&title=%E8%90%A5%E6%94%B6%E4%B8%8E%E5%88%A9%E6%B6%A6%E7%8E%87&labels=Q1,Q2,Q3,Q4&series=%E8%90%A5%E6%94%B6%3A1200%2C1800%2C1500%2C2400&line=margin:5,8,6,12)

柱子是收入,折线是利润率。

### 一条业务线的四个选项

```text
https://x-cmd.com/draw?type=compass&title=%E4%B8%9A%E5%8A%A1%E5%8D%95%E5%85%83%E7%9A%84%E5%9B%9B%E4%B8%AA%E9%80%89%E9%A1%B9&center=%E6%A0%B8%E5%BF%83%E4%B8%9A%E5%8A%A1&up=%E5%8A%A0%E5%A4%A7%E6%8A%95%E5%85%A5%3A%E6%8A%A2%E4%BB%BD%E9%A2%9D&right=%E7%BB%B4%E6%8C%81%E7%8E%B0%E7%8A%B6%3A%E5%AE%88%E7%8E%B0%E9%87%91%E6%B5%81&down=%E6%94%B6%E7%BC%A9%E8%A7%84%E6%A8%A1%3A%E9%99%8D%E6%88%90%E6%9C%AC&left=%E9%80%80%E5%87%BA%E5%B8%82%E5%9C%BA%3A%E8%85%BE%E8%B5%84%E6%BA%90
```

[![Four options](https://x-cmd.com/draw?type=compass&title=%E4%B8%9A%E5%8A%A1%E5%8D%95%E5%85%83%E7%9A%84%E5%9B%9B%E4%B8%AA%E9%80%89%E9%A1%B9&center=%E6%A0%B8%E5%BF%83%E4%B8%9A%E5%8A%A1&up=%E5%8A%A0%E5%A4%A7%E6%8A%95%E5%85%A5%3A%E6%8A%A2%E4%BB%BD%E9%A2%9D&right=%E7%BB%B4%E6%8C%81%E7%8E%B0%E7%8A%B6%3A%E5%AE%88%E7%8E%B0%E9%87%91%E6%B5%81&down=%E6%94%B6%E7%BC%A9%E8%A7%84%E6%A8%A1%3A%E9%99%8D%E6%88%90%E6%9C%AC&left=%E9%80%80%E5%87%BA%E5%B8%82%E5%9C%BA%3A%E8%85%BE%E8%B5%84%E6%BA%90)](https://x-cmd.com/draw/explore?type=compass&title=%E4%B8%9A%E5%8A%A1%E5%8D%95%E5%85%83%E7%9A%84%E5%9B%9B%E4%B8%AA%E9%80%89%E9%A1%B9&center=%E6%A0%B8%E5%BF%83%E4%B8%9A%E5%8A%A1&up=%E5%8A%A0%E5%A4%A7%E6%8A%95%E5%85%A5%3A%E6%8A%A2%E4%BB%BD%E9%A2%9D&right=%E7%BB%B4%E6%8C%81%E7%8E%B0%E7%8A%B6%3A%E5%AE%88%E7%8E%B0%E9%87%91%E6%B5%81&down=%E6%94%B6%E7%BC%A9%E8%A7%84%E6%A8%A1%3A%E9%99%8D%E6%88%90%E6%9C%AC&left=%E9%80%80%E5%87%BA%E5%B8%82%E5%9C%BA%3A%E8%85%BE%E8%B5%84%E6%BA%90)

四向箭头:加大投入、维持现状、收缩规模、退出市场,从中间往外。

### 交易漏斗 —— 漏在哪

```text
https://x-cmd.com/draw?type=sankey&t=fund&title=%E4%BA%A4%E6%98%93%E6%BC%8F%E6%96%97&labels=%E7%BA%BF%E7%B4%A2%2C%E5%90%88%E6%A0%BC%2C%E8%B7%AF%E6%BC%94%2C%E5%B0%BD%E8%B0%83%2CClosed&links=%E7%BA%BF%E7%B4%A2%3E%E5%90%88%E6%A0%BC%3A180%3B%E7%BA%BF%E7%B4%A2%3E%E8%B7%AF%E6%BC%94%3A40%3B%E5%90%88%E6%A0%BC%3E%E8%B7%AF%E6%BC%94%3A90%3B%E8%B7%AF%E6%BC%94%3E%E5%B0%BD%E8%B0%83%3A45%3B%E5%B0%BD%E8%B0%83%3EClosed%3A22
```

[![Deal funnel](https://x-cmd.com/draw?type=sankey&t=fund&title=%E4%BA%A4%E6%98%93%E6%BC%8F%E6%96%97&labels=%E7%BA%BF%E7%B4%A2%2C%E5%90%88%E6%A0%BC%2C%E8%B7%AF%E6%BC%94%2C%E5%B0%BD%E8%B0%83%2CClosed&links=%E7%BA%BF%E7%B4%A2%3E%E5%90%88%E6%A0%BC%3A180%3B%E7%BA%BF%E7%B4%A2%3E%E8%B7%AF%E6%BC%94%3A40%3B%E5%90%88%E6%A0%BC%3E%E8%B7%AF%E6%BC%94%3A90%3B%E8%B7%AF%E6%BC%94%3E%E5%B0%BD%E8%B0%83%3A45%3B%E5%B0%BD%E8%B0%83%3EClosed%3A22)](https://x-cmd.com/draw/explore?type=sankey&t=fund&title=%E4%BA%A4%E6%98%93%E6%BC%8F%E6%96%97&labels=%E7%BA%BF%E7%B4%A2%2C%E5%90%88%E6%A0%BC%2C%E8%B7%AF%E6%BC%94%2C%E5%B0%BD%E8%B0%83%2CClosed&links=%E7%BA%BF%E7%B4%A2%3E%E5%90%88%E6%A0%BC%3A180%3B%E7%BA%BF%E7%B4%A2%3E%E8%B7%AF%E6%BC%94%3A40%3B%E5%90%88%E6%A0%BC%3E%E8%B7%AF%E6%BC%94%3A90%3B%E8%B7%AF%E6%BC%94%3E%E5%B0%BD%E8%B0%83%3A45%3B%E5%B0%BD%E8%B0%83%3EClosed%3A22)

管道在哪一段变窄,窄了多少。


## 该用哪张图

| 问题 | 图种 | 参考 |
|---|---|---|
| 组合怎么分的? | 饼图 | [pie](../../2-data-charts/01-pie/cn.md) |
| 跑赢基准了吗? | 折线图 | [line](../../2-data-charts/04-line/cn.md) |
| 承担风险换来了多少? | 散点图 | [scatter](../../2-data-charts/08-scatter/cn.md) |
| 收入和利润率一起看 | 混合图 | [combo](../../2-data-charts/09-combo/cn.md) |
| 这条业务线怎么办? | 四向箭头 | [compass](../../4-strategy/02-compass/cn.md) |
| 管道漏在哪? | 桑基图 | [sankey](../../3-relations/01-sankey/cn.md) |
