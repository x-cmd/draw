---
x-title: 市场营销 —— 漏斗、渠道与背后的数字
x-desc: 'x-cmd/draw 场景用例:市场营销。注册漏斗、浏览器市场份额、渠道归因、投放与 ROI、获客成本趋势、客户分层的真实 URL。'
x-sidebar: draw 场景用例 市场营销
x-keywords: 营销图表, 漏斗图, 投放报告, draw 场景用例, svg
x-json-ld:
  '@context': https://schema.org
  '@graph':
    - '@type': TechArticle
      headline: 'draw 场景用例 市场营销'
      inLanguage: 'cn'
      about: 'x-cmd/draw showcase 04-marketing'
---

# 市场营销 —— 漏斗、渠道与背后的数字

增长复盘、投放复盘里拼出来的那几张图。

### 注册漏斗 —— 预算漏在哪

```text
https://x-cmd.com/draw?type=sankey&t=fund&title=Signup%20funnel&labels=Ads,Web,Newsletter,Signup,Buy&links=Ads>Signup:30;Web>Signup:20;Newsletter>Signup:10;Signup>Buy:45
```

[![Signup funnel](https://x-cmd.com/draw?type=sankey&t=fund&title=Signup%20funnel&labels=Ads,Web,Newsletter,Signup,Buy&links=Ads>Signup:30;Web>Signup:20;Newsletter>Signup:10;Signup>Buy:45)](https://x-cmd.com/draw/explore?type=sankey&t=fund&title=Signup%20funnel&labels=Ads,Web,Newsletter,Signup,Buy&links=Ads>Signup:30;Web>Signup:20;Newsletter>Signup:10;Signup>Buy:45)

三个渠道进来,注册和付费出去。每条带的宽度就是人数。

### 浏览器市场份额 —— 门面数字

```text
https://x-cmd.com/draw?type=pie&t=evil&labels=Chrome,Safari,Firefox,Edge,Other&values=65,18,7,6,4&title=Browser%20market%20share
```

[![Browser market share](https://x-cmd.com/draw?type=pie&t=evil&labels=Chrome,Safari,Firefox,Edge,Other&values=65,18,7,6,4&title=Browser%20market%20share)](https://x-cmd.com/draw/explore?type=pie&t=evil&labels=Chrome,Safari,Firefox,Edge,Other&values=65,18,7,6,4&title=Browser%20market%20share)

evil 风格:圆角扇区,数值直接印在环里。

### 渠道归因 —— 今年对去年

```text
https://x-cmd.com/draw?type=hbar&t=rank&labels=Ads,Email,Social,SEO,Referral&series=2025:42,31,18,9,6&series=2026:51,44,22,15,11&title=Signups%20by%20channel
```

[![Signups by channel](https://x-cmd.com/draw?type=hbar&t=rank&labels=Ads,Email,Social,SEO,Referral&series=2025:42,31,18,9,6&series=2026:51,44,22,15,11&title=Signups%20by%20channel)](https://x-cmd.com/draw/explore?type=hbar&t=rank&labels=Ads,Email,Social,SEO,Referral&series=2025:42,31,18,9,6&series=2026:51,44,22,15,11&title=Signups%20by%20channel)

每个渠道两根条,今年和去年。排名风格就是为这种图做的。

### 投放与 ROI —— CFO 每次都要的那一对

```text
https://x-cmd.com/draw?type=combo&title=Spend%20%26%20ROI&labels=Jan,Feb,Mar,Apr,May,Jun&series=spend:120,140,135,160,175,190&line=roi:2.1,2.4,2.2,3.0,3.4,3.8
```

[![Spend and ROI](https://x-cmd.com/draw?type=combo&title=Spend%20%26%20ROI&labels=Jan,Feb,Mar,Apr,May,Jun&series=spend:120,140,135,160,175,190&line=roi:2.1,2.4,2.2,3.0,3.4,3.8)](https://x-cmd.com/draw/explore?type=combo&title=Spend%20%26%20ROI&labels=Jan,Feb,Mar,Apr,May,Jun&series=spend:120,140,135,160,175,190&line=roi:2.1,2.4,2.2,3.0,3.4,3.8)

柱子是花费,折线是回报。

### 获客成本 —— 在降吗?

```text
https://x-cmd.com/draw?type=line&title=CAC%20trend&labels=Jan,Feb,Mar,Apr,May,Jun&values=68,72,65,61,58,54&unit=USD
```

[![CAC trend](https://x-cmd.com/draw?type=line&title=CAC%20trend&labels=Jan,Feb,Mar,Apr,May,Jun&values=68,72,65,61,58,54&unit=USD)](https://x-cmd.com/draw/explore?type=line&title=CAC%20trend&labels=Jan,Feb,Mar,Apr,May,Jun&values=68,72,65,61,58,54&unit=USD)

一根往下走的线,是增长复盘里最有说服力的一张幻灯片。

### 客户分层 —— 价值对服务成本

```text
https://x-cmd.com/draw?type=quadrant&frame=cross&title=%E5%AE%A2%E6%88%B7%E5%88%86%E5%B1%82&ylabel=%E6%88%90%E6%9C%AC&xlabel=%E8%A1%8C%E5%8A%A8%E6%88%90%E6%9C%AC&ylow=%E4%BD%8E&yhigh=%E9%AB%98&xlow=%E4%BD%8E&xhigh=%E9%AB%98&items=%E9%87%8D%E5%A4%8D%E8%B4%AD%E4%B9%B0%400.32%2C0.78%3B%E6%96%B0%E5%AE%A2%400.22%2C0.35%3B%E5%A4%A7%E5%AE%A2%E6%88%B7%400.82%2C0.44%3B%E6%88%90%E7%86%9F%E5%AE%A2%400.55%2C0.88
```

[![Customer segments](https://x-cmd.com/draw?type=quadrant&frame=cross&title=%E5%AE%A2%E6%88%B7%E5%88%86%E5%B1%82&ylabel=%E6%88%90%E6%9C%AC&xlabel=%E8%A1%8C%E5%8A%A8%E6%88%90%E6%9C%AC&ylow=%E4%BD%8E&yhigh=%E9%AB%98&xlow=%E4%BD%8E&xhigh=%E9%AB%98&items=%E9%87%8D%E5%A4%8D%E8%B4%AD%E4%B9%B0%400.32%2C0.78%3B%E6%96%B0%E5%AE%A2%400.22%2C0.35%3B%E5%A4%A7%E5%AE%A2%E6%88%B7%400.82%2C0.44%3B%E6%88%90%E7%86%9F%E5%AE%A2%400.55%2C0.88)](https://x-cmd.com/draw/explore?type=quadrant&frame=cross&title=%E5%AE%A2%E6%88%B7%E5%88%86%E5%B1%82&ylabel=%E6%88%90%E6%9C%AC&xlabel=%E8%A1%8C%E5%8A%A8%E6%88%90%E6%9C%AC&ylow=%E4%BD%8E&yhigh=%E9%AB%98&xlow=%E4%BD%8E&xhigh=%E9%AB%98&items=%E9%87%8D%E5%A4%8D%E8%B4%AD%E4%B9%B0%400.32%2C0.78%3B%E6%96%B0%E5%AE%A2%400.22%2C0.35%3B%E5%A4%A7%E5%AE%A2%E6%88%B7%400.82%2C0.44%3B%E6%88%90%E7%86%9F%E5%AE%A2%400.55%2C0.88)

十字式:两条轴,一个点代表一个客群,不用填格子。


## 该用哪张图

| 问题 | 图种 | 参考 |
|---|---|---|
| 注册从哪来、又到哪去? | 桑基图 | [sankey](../../2-chart-types/02-relations/01-sankey/cn.md) |
| 我们占多少份额? | 饼图 | [pie](../../2-chart-types/01-data-charts/01-pie/cn.md) |
| 哪个渠道在涨? | 横条图 | [hbar](../../2-chart-types/01-data-charts/03-hbar/cn.md) |
| 投放的回报是多少? | 混合图 | [combo](../../2-chart-types/01-data-charts/09-combo/cn.md) |
| 获客在变便宜吗? | 折线图 | [line](../../2-chart-types/01-data-charts/04-line/cn.md) |
| 预算该给哪个客群? | 四象限图 | [quadrant](../../2-chart-types/03-strategy/01-quadrant/cn.md) |
