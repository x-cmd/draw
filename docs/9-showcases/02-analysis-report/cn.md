---
x-title: 分析报告 —— 一份报告由哪些数字组成
x-desc: 'x-cmd/draw 场景用例:分析报告。延迟与负载、CI 通过率仪表盘、雷达记分卡、量与率、收入与利润率、测试耗时分布的真实 URL。'
x-sidebar: draw 场景用例 分析报告
x-keywords: 分析报告图表, 指标看板, draw 场景用例, svg, 数据指标
x-json-ld:
  '@context': https://schema.org
  '@graph':
    - '@type': TechArticle
      headline: 'draw 场景用例 分析报告'
      inLanguage: 'cn'
      about: 'x-cmd/draw showcase 02-analysis-report'
---

# 分析报告 —— 一份报告由哪些数字组成

季度报告、健康看板、设计评审里最常用到的几种图形。

### 延迟与负载 —— 曲线在哪里拐弯

```text
https://x-cmd.com/draw?type=scatter&x=5,12,18,25,31,38,44,52,58,63,71,78,84,92&y=42,38,51,47,60,55,68,63,75,70,82,78,90,86&title=Latency%20vs%20load
```

[![Latency vs load](https://x-cmd.com/draw?type=scatter&x=5,12,18,25,31,38,44,52,58,63,71,78,84,92&y=42,38,51,47,60,55,68,63,75,70,82,78,90,86&title=Latency%20vs%20load)](https://x-cmd.com/draw/explore?type=scatter&x=5,12,18,25,31,38,44,52,58,63,71,78,84,92&y=42,38,51,47,60,55,68,63,75,70,82,78,90,86&title=Latency%20vs%20load)

每个点是一次测量;点的形状说明延迟是缓慢劣化还是断崖下跌。

### 就一个数,现在 —— CI 通过率

```text
https://x-cmd.com/draw?type=gauge&title=CI%20pass%20rate&value=87&max=100
```

[![CI pass rate](https://x-cmd.com/draw?type=gauge&title=CI%20pass%20rate&value=87&max=100)](https://x-cmd.com/draw/explore?type=gauge&title=CI%20pass%20rate&value=87&max=100)

只有一个数字、而且要一眼读到,用仪表盘就对了。

### 记分卡 —— 五条轴,一张图

```text
https://x-cmd.com/draw?type=radar&title=Build%20quality&labels=Speed,Tests,Coverage,Docs,Release&values=7,8,6,7,9
```

[![Build quality](https://x-cmd.com/draw?type=radar&title=Build%20quality&labels=Speed,Tests,Coverage,Docs,Release&values=7,8,6,7,9)](https://x-cmd.com/draw/explore?type=radar&title=Build%20quality&labels=Speed,Tests,Coverage,Docs,Release&values=7,8,6,7,9)

雷达图适合画像:速度、测试、覆盖、文档、发布 —— 一张图代替一张表。

### 量与率 —— 两个指标,一张图

```text
https://x-cmd.com/draw?type=combo&title=Downloads%20%26%20growth&labels=Jan,Feb,Mar,Apr,May,Jun,Jul,Aug,Sep,Oct,Nov,Dec&series=downloads:900,1200,1050,1600,1400,1800,2100,1950,2200,2500,2300,2700&line=growth:5,8,6,12,10,15,18,16,20,23,21,26
```

[![Downloads and growth](https://x-cmd.com/draw?type=combo&title=Downloads%20%26%20growth&labels=Jan,Feb,Mar,Apr,May,Jun,Jul,Aug,Sep,Oct,Nov,Dec&series=downloads:900,1200,1050,1600,1400,1800,2100,1950,2200,2500,2300,2700&line=growth:5,8,6,12,10,15,18,16,20,23,21,26)](https://x-cmd.com/draw/explore?type=combo&title=Downloads%20%26%20growth&labels=Jan,Feb,Mar,Apr,May,Jun,Jul,Aug,Sep,Oct,Nov,Dec&series=downloads:900,1200,1050,1600,1400,1800,2100,1950,2200,2500,2300,2700&line=growth:5,8,6,12,10,15,18,16,20,23,21,26)

柱子是绝对量,折线是比率 —— 混合图把两者放在同一张画布里。

### 收入与利润率 —— 经典搭配

```text
https://x-cmd.com/draw?type=combo&t=evil&title=Revenue%20%26%20margin&labels=Q1,Q2,Q3,Q4&series=revenue:1200,1800,1500,2400&line=margin:5,8,6,12
```

[![Revenue and margin](https://x-cmd.com/draw?type=combo&t=evil&title=Revenue%20%26%20margin&labels=Q1,Q2,Q3,Q4&series=revenue:1200,1800,1500,2400&line=margin:5,8,6,12)](https://x-cmd.com/draw/explore?type=combo&t=evil&title=Revenue%20%26%20margin&labels=Q1,Q2,Q3,Q4&series=revenue:1200,1800,1500,2400&line=margin:5,8,6,12)

同样的混合图,换成适合印的配色:收入是柱,利润率是线。

### 测试耗时 —— 看分布,不是只看平均

```text
https://x-cmd.com/draw?type=hbar&t=rank&labels=unit,integration,e2e,docs&series=p50:12,34,88,6&series=p95:28,96,240,14&title=Test%20duration
```

[![Test duration](https://x-cmd.com/draw?type=hbar&t=rank&labels=unit,integration,e2e,docs&series=p50:12,34,88,6&series=p95:28,96,240,14&title=Test%20duration)](https://x-cmd.com/draw/explore?type=hbar&t=rank&labels=unit,integration,e2e,docs&series=p50:12,34,88,6&series=p95:28,96,240,14&title=Test%20duration)

每个套件两根条(p50 与 p95),长尾和典型值能一起看见。


## 该用哪张图

| 问题 | 图种 | 参考 |
|---|---|---|
| 负载上来会不会劣化? | 散点图 | [scatter](../../2-data-charts/08-scatter/cn.md) |
| 此刻就一个数,是什么? | 仪表盘 | [gauge](../../2-data-charts/07-gauge/cn.md) |
| 五条轴上我们各打多少分? | 雷达图 | [radar](../../2-data-charts/06-radar/cn.md) |
| 量和率放一起 | 混合图 | [combo](../../2-data-charts/09-combo/cn.md) |
| 金额和比例放一起 | 混合图 | [combo](../../2-data-charts/09-combo/cn.md) |
| 中位数与长尾 | 横条图 | [hbar](../../2-data-charts/03-hbar/cn.md) |
