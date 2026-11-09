---
x-title: 产品与路线图 —— 做什么、什么时候做、先做哪个
x-desc: 'x-cmd/draw 场景用例:产品与路线图。产品导图、上线检查清单、甘特图迭代计划、按季度路线图、优先级四象限的真实 URL。'
x-sidebar: draw 场景用例 产品路线图
x-keywords: 路线图图表, 甘特图, 产品地图, draw 场景用例, svg
x-json-ld:
  '@context': https://schema.org
  '@graph':
    - '@type': TechArticle
      headline: 'draw 场景用例 产品路线图'
      inLanguage: 'cn'
      about: 'x-cmd/draw showcase 05-product-roadmap'
---

# 产品与路线图 —— 做什么、什么时候做、先做哪个

产品团队反复重画的三样东西:地图、排期、优先级。

### 产品地图 —— 有什么、在哪

```text
https://x-cmd.com/draw/mindmap?n=Product/Features/Speed&n=Product/Features/Privacy&n=Product/Features/Integrations&n=Product/Markets/EU&n=Product/Markets/US&n=Product/Pricing/Free&n=Product/Pricing/Pro&style=bubble&title=Product%20map&w=560
```

[![Product map](https://x-cmd.com/draw/mindmap?n=Product/Features/Speed&n=Product/Features/Privacy&n=Product/Features/Integrations&n=Product/Markets/EU&n=Product/Markets/US&n=Product/Pricing/Free&n=Product/Pricing/Pro&style=bubble&title=Product%20map&w=560)](https://x-cmd.com/draw/explore/mindmap?n=Product/Features/Speed&n=Product/Features/Privacy&n=Product/Features/Integrations&n=Product/Markets/EU&n=Product/Markets/US&n=Product/Pricing/Free&n=Product/Pricing/Pro&style=bubble&title=Product%20map&w=560)

功能、市场、定价画成一棵树 —— 标签都短,用 bubble 形态最合适。

### 上线检查清单 —— 谁负责什么

```text
https://x-cmd.com/draw/mindmap?n=Launch/Legal/Privacy%20check&n=Launch/Eng/Tests&n=Launch/Eng/Perf&n=Launch/Docs/Changelog&n=Launch/Docs/Post%20copy&style=tree&title=Launch%20checklist&w=560
```

[![Launch checklist](https://x-cmd.com/draw/mindmap?n=Launch/Legal/Privacy%20check&n=Launch/Eng/Tests&n=Launch/Eng/Perf&n=Launch/Docs/Changelog&n=Launch/Docs/Post%20copy&style=tree&title=Launch%20checklist&w=560)](https://x-cmd.com/draw/explore/mindmap?n=Launch/Legal/Privacy%20check&n=Launch/Eng/Tests&n=Launch/Eng/Perf&n=Launch/Docs/Changelog&n=Launch/Docs/Post%20copy&style=tree&title=Launch%20checklist&w=560)

同一个引擎,换 tree 形态:任务按团队分组。

### 迭代计划 —— 排期

```text
https://x-cmd.com/draw/gantt?m=dateFormat%20YYYY-MM-DD%0A%20%20section%20Dev%0A%20%20Design%20%3Adone%2C%20a1%2C%202026-11-01%2C%203d%0A%20%20Build%20%3Aactive%2C%20a2%2C%20after%20a1%2C%205d%0A%20%20Ship%20%3Amilestone%2C%20m1%2C%202026-11-10%2C%200d%0A%20%20section%20QA%0A%20%20Regression%20%3Acrit%2C%20b1%2C%20after%20a2%2C%203d&title=Sprint%20plan&w=560
```

[![Sprint plan](https://x-cmd.com/draw/gantt?m=dateFormat%20YYYY-MM-DD%0A%20%20section%20Dev%0A%20%20Design%20%3Adone%2C%20a1%2C%202026-11-01%2C%203d%0A%20%20Build%20%3Aactive%2C%20a2%2C%20after%20a1%2C%205d%0A%20%20Ship%20%3Amilestone%2C%20m1%2C%202026-11-10%2C%200d%0A%20%20section%20QA%0A%20%20Regression%20%3Acrit%2C%20b1%2C%20after%20a2%2C%203d&title=Sprint%20plan&w=560)](https://x-cmd.com/draw/explore/gantt?m=dateFormat%20YYYY-MM-DD%0A%20%20section%20Dev%0A%20%20Design%20%3Adone%2C%20a1%2C%202026-11-01%2C%203d%0A%20%20Build%20%3Aactive%2C%20a2%2C%20after%20a1%2C%205d%0A%20%20Ship%20%3Amilestone%2C%20m1%2C%202026-11-10%2C%200d%0A%20%20section%20QA%0A%20%20Regression%20%3Acrit%2C%20b1%2C%20after%20a2%2C%203d&title=Sprint%20plan&w=560)

分段、任务、依赖和一个里程碑 —— 一共六行文本。

### 按季度的路线图 —— 已交付对计划中

```text
https://x-cmd.com/draw?type=bar&labels=Q1,Q2,Q3,Q4&series=shipped:12,18,9,15&series=planned:20,22,14,10&stack=1&title=Roadmap%20by%20quarter
```

[![Roadmap by quarter](https://x-cmd.com/draw?type=bar&labels=Q1,Q2,Q3,Q4&series=shipped:12,18,9,15&series=planned:20,22,14,10&stack=1&title=Roadmap%20by%20quarter)](https://x-cmd.com/draw/explore?type=bar&labels=Q1,Q2,Q3,Q4&series=shipped:12,18,9,15&series=planned:20,22,14,10&stack=1&title=Roadmap%20by%20quarter)

堆叠柱:已经发出去的,和还在计划里的。

### 优先级 —— 价值对成本

```text
https://x-cmd.com/draw?type=quadrant&frame=cross&title=%E6%88%98%E7%95%A5%E4%B8%BE%E6%8E%AA%E4%BC%98%E5%85%88%E7%BA%A7&ylabel=%E6%88%98%E7%95%A5%E4%BB%B7%E5%80%BC&xlabel=%E6%8A%95%E5%85%A5%E6%88%90%E6%9C%AC&ylow=%E4%BD%8E&yhigh=%E9%AB%98&xlow=%E4%BD%8E&xhigh=%E9%AB%98&items=%E5%B9%B3%E5%8F%B0%E9%87%8D%E6%9E%84%400.22%2C0.86%3BAI+%E5%AE%A2%E6%9C%8D%400.42%2C0.62%3B%E6%B8%A0%E9%81%93%E5%90%88%E4%BD%9C%400.72%2C0.44%3B%E5%93%81%E7%89%8C%E6%8A%95%E6%94%BE%400.84%2C0.26
```

[![Initiative priority](https://x-cmd.com/draw?type=quadrant&frame=cross&title=%E6%88%98%E7%95%A5%E4%B8%BE%E6%8E%AA%E4%BC%98%E5%85%88%E7%BA%A7&ylabel=%E6%88%98%E7%95%A5%E4%BB%B7%E5%80%BC&xlabel=%E6%8A%95%E5%85%A5%E6%88%90%E6%9C%AC&ylow=%E4%BD%8E&yhigh=%E9%AB%98&xlow=%E4%BD%8E&xhigh=%E9%AB%98&items=%E5%B9%B3%E5%8F%B0%E9%87%8D%E6%9E%84%400.22%2C0.86%3BAI+%E5%AE%A2%E6%9C%8D%400.42%2C0.62%3B%E6%B8%A0%E9%81%93%E5%90%88%E4%BD%9C%400.72%2C0.44%3B%E5%93%81%E7%89%8C%E6%8A%95%E6%94%BE%400.84%2C0.26)](https://x-cmd.com/draw/explore?type=quadrant&frame=cross&title=%E6%88%98%E7%95%A5%E4%B8%BE%E6%8E%AA%E4%BC%98%E5%85%88%E7%BA%A7&ylabel=%E6%88%98%E7%95%A5%E4%BB%B7%E5%80%BC&xlabel=%E6%8A%95%E5%85%A5%E6%88%90%E6%9C%AC&ylow=%E4%BD%8E&yhigh=%E9%AB%98&xlow=%E4%BD%8E&xhigh=%E9%AB%98&items=%E5%B9%B3%E5%8F%B0%E9%87%8D%E6%9E%84%400.22%2C0.86%3BAI+%E5%AE%A2%E6%9C%8D%400.42%2C0.62%3B%E6%B8%A0%E9%81%93%E5%90%88%E4%BD%9C%400.72%2C0.44%3B%E5%93%81%E7%89%8C%E6%8A%95%E6%94%BE%400.84%2C0.26)

每个举措一个点:战略价值向上,投入成本向右。


## 该用哪张图

| 问题 | 图种 | 参考 |
|---|---|---|
| 现在有什么、怎么串起来? | 思维导图 | [mindmap](../../2-chart-types/04-architecture/02-mindmap/cn.md) |
| 每个任务归谁? | 思维导图 | [mindmap](../../2-chart-types/04-architecture/02-mindmap/cn.md) |
| 每块什么时候交付? | 甘特图 | [gantt](../../2-chart-types/05-schedule/01-gantt/cn.md) |
| 已交付对计划中? | 柱状图 | [bar](../../2-chart-types/01-data-charts/02-bar/cn.md) |
| 先做哪个? | 四象限图 | [quadrant](../../2-chart-types/03-strategy/01-quadrant/cn.md) |
