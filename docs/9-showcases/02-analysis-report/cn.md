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
https://x-cmd.com/draw?type=scatter&x=5,12,18,25,31,38,44,52,58,63,71,78,84,92&y=42,38,51,47,60,55,68,63,75,70,82,78,90,86&title=%E5%BB%B6%E8%BF%9F%E4%B8%8E%E8%B4%9F%E8%BD%BD
```

[![Latency vs load](https://x-cmd.com/draw?type=scatter&x=5,12,18,25,31,38,44,52,58,63,71,78,84,92&y=42,38,51,47,60,55,68,63,75,70,82,78,90,86&title=%E5%BB%B6%E8%BF%9F%E4%B8%8E%E8%B4%9F%E8%BD%BD)](https://x-cmd.com/draw/explore?type=scatter&x=5,12,18,25,31,38,44,52,58,63,71,78,84,92&y=42,38,51,47,60,55,68,63,75,70,82,78,90,86&title=%E5%BB%B6%E8%BF%9F%E4%B8%8E%E8%B4%9F%E8%BD%BD)

每个点是一次测量;点的形状说明延迟是缓慢劣化还是断崖下跌。

### 就一个数,现在 —— CI 通过率

```text
https://x-cmd.com/draw?type=gauge&title=CI%20%E9%80%9A%E8%BF%87%E7%8E%87&value=87&max=100
```

[![CI pass rate](https://x-cmd.com/draw?type=gauge&title=CI%20%E9%80%9A%E8%BF%87%E7%8E%87&value=87&max=100)](https://x-cmd.com/draw/explore?type=gauge&title=CI%20%E9%80%9A%E8%BF%87%E7%8E%87&value=87&max=100)

只有一个数字、而且要一眼读到,用仪表盘就对了。

### 记分卡 —— 五条轴,一张图

```text
https://x-cmd.com/draw?type=radar&title=%E6%9E%84%E5%BB%BA%E8%B4%A8%E9%87%8F&labels=%E9%80%9F%E5%BA%A6%2CTests%2CCoverage%2CDocs%2CRelease&values=7,8,6,7,9
```

[![Build quality](https://x-cmd.com/draw?type=radar&title=%E6%9E%84%E5%BB%BA%E8%B4%A8%E9%87%8F&labels=%E9%80%9F%E5%BA%A6%2CTests%2CCoverage%2CDocs%2CRelease&values=7,8,6,7,9)](https://x-cmd.com/draw/explore?type=radar&title=%E6%9E%84%E5%BB%BA%E8%B4%A8%E9%87%8F&labels=%E9%80%9F%E5%BA%A6%2CTests%2CCoverage%2CDocs%2CRelease&values=7,8,6,7,9)

雷达图适合画像:速度、测试、覆盖、文档、发布 —— 一张图代替一张表。

### 量与率 —— 两个指标,一张图

```text
https://x-cmd.com/draw?type=combo&title=Downloads%20%26%20growth&labels=1%E6%9C%88%2C2%E6%9C%88%2C3%E6%9C%88%2C4%E6%9C%88%2C5%E6%9C%88%2C6%E6%9C%88%2C7%E6%9C%88%2C8%E6%9C%88%2C9%E6%9C%88%2C10%E6%9C%88%2C11%E6%9C%88%2C12%E6%9C%88&series=%E4%B8%8B%E8%BD%BD%E9%87%8F%3A900%2C1200%2C1050%2C1600%2C1400%2C1800%2C2100%2C1950%2C2200%2C2500%2C2300%2C2700&line=%E5%A2%9E%E9%95%BF%3A5%2C8%2C6%2C12%2C10%2C15%2C18%2C16%2C20%2C23%2C21%2C26
```

[![Downloads and growth](https://x-cmd.com/draw?type=combo&title=Downloads%20%26%20growth&labels=1%E6%9C%88%2C2%E6%9C%88%2C3%E6%9C%88%2C4%E6%9C%88%2C5%E6%9C%88%2C6%E6%9C%88%2C7%E6%9C%88%2C8%E6%9C%88%2C9%E6%9C%88%2C10%E6%9C%88%2C11%E6%9C%88%2C12%E6%9C%88&series=%E4%B8%8B%E8%BD%BD%E9%87%8F%3A900%2C1200%2C1050%2C1600%2C1400%2C1800%2C2100%2C1950%2C2200%2C2500%2C2300%2C2700&line=%E5%A2%9E%E9%95%BF%3A5%2C8%2C6%2C12%2C10%2C15%2C18%2C16%2C20%2C23%2C21%2C26)](https://x-cmd.com/draw/explore?type=combo&title=Downloads%20%26%20growth&labels=1%E6%9C%88%2C2%E6%9C%88%2C3%E6%9C%88%2C4%E6%9C%88%2C5%E6%9C%88%2C6%E6%9C%88%2C7%E6%9C%88%2C8%E6%9C%88%2C9%E6%9C%88%2C10%E6%9C%88%2C11%E6%9C%88%2C12%E6%9C%88&series=%E4%B8%8B%E8%BD%BD%E9%87%8F%3A900%2C1200%2C1050%2C1600%2C1400%2C1800%2C2100%2C1950%2C2200%2C2500%2C2300%2C2700&line=%E5%A2%9E%E9%95%BF%3A5%2C8%2C6%2C12%2C10%2C15%2C18%2C16%2C20%2C23%2C21%2C26)

柱子是绝对量,折线是比率 —— 混合图把两者放在同一张画布里。

### 收入与利润率 —— 经典搭配

```text
https://x-cmd.com/draw?type=combo&t=evil&title=%E8%90%A5%E6%94%B6%E4%B8%8E%E5%88%A9%E6%B6%A6%E7%8E%87&labels=Q1,Q2,Q3,Q4&series=%E8%90%A5%E6%94%B6%3A1200%2C1800%2C1500%2C2400&line=margin:5,8,6,12
```

[![Revenue and margin](https://x-cmd.com/draw?type=combo&t=evil&title=%E8%90%A5%E6%94%B6%E4%B8%8E%E5%88%A9%E6%B6%A6%E7%8E%87&labels=Q1,Q2,Q3,Q4&series=%E8%90%A5%E6%94%B6%3A1200%2C1800%2C1500%2C2400&line=margin:5,8,6,12)](https://x-cmd.com/draw/explore?type=combo&t=evil&title=%E8%90%A5%E6%94%B6%E4%B8%8E%E5%88%A9%E6%B6%A6%E7%8E%87&labels=Q1,Q2,Q3,Q4&series=%E8%90%A5%E6%94%B6%3A1200%2C1800%2C1500%2C2400&line=margin:5,8,6,12)

同样的混合图,换成适合印的配色:收入是柱,利润率是线。

### 测试耗时 —— 看分布,不是只看平均

```text
https://x-cmd.com/draw?type=hbar&t=rank&labels=%E5%8D%95%E5%85%83%2C%E9%9B%86%E6%88%90%2C%E7%AB%AF%E5%88%B0%E7%AB%AF%2C%E6%96%87%E6%A1%A3&series=P50%3A12%2C34%2C88%2C6&series=P95%3A28%2C96%2C240%2C14&title=%E6%B5%8B%E8%AF%95%E8%80%97%E6%97%B6
```

[![Test duration](https://x-cmd.com/draw?type=hbar&t=rank&labels=%E5%8D%95%E5%85%83%2C%E9%9B%86%E6%88%90%2C%E7%AB%AF%E5%88%B0%E7%AB%AF%2C%E6%96%87%E6%A1%A3&series=P50%3A12%2C34%2C88%2C6&series=P95%3A28%2C96%2C240%2C14&title=%E6%B5%8B%E8%AF%95%E8%80%97%E6%97%B6)](https://x-cmd.com/draw/explore?type=hbar&t=rank&labels=%E5%8D%95%E5%85%83%2C%E9%9B%86%E6%88%90%2C%E7%AB%AF%E5%88%B0%E7%AB%AF%2C%E6%96%87%E6%A1%A3&series=P50%3A12%2C34%2C88%2C6&series=P95%3A28%2C96%2C240%2C14&title=%E6%B5%8B%E8%AF%95%E8%80%97%E6%97%B6)

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
