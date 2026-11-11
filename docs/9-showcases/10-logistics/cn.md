---
x-title: 物流供应链 —— 吞吐、占用与网络
x-desc: 'x-cmd/draw 场景用例:物流供应链。各区域准时率、每周吞吐、仓库占用、运输方式构成、订单到交付流程、履约网络的真实 URL。'
x-sidebar: draw 场景用例 物流供应链
x-keywords: 物流图表, 供应链看板, draw 场景用例, svg
x-json-ld:
  '@context': https://schema.org
  '@graph':
    - '@type': TechArticle
      headline: 'draw 场景用例 物流供应链'
      inLanguage: 'cn'
      about: 'x-cmd/draw showcase 10-logistics'
---

# 物流供应链 —— 吞吐、占用与网络

配送网络的日常:走了多少量、仓库多满、这张网络图长什么样。

### 各区域准时率

```text
https://x-cmd.com/draw?type=hbar&t=xcmd-issue&labels=%E4%B8%9C%E5%8C%BA%2C%E5%8C%97%E5%8C%BA%2C%E5%8D%97%E5%8C%BA%2C%E8%A5%BF%E5%8C%BA%2C%E4%B8%AD%E5%8C%BA&series=%E5%87%86%E6%97%B6%3A62%2C48%2C71%2C55%2C44&series=%E5%BB%B6%E8%AF%AF%3A14%2C26%2C11%2C21%2C33&title=%E5%90%84%E5%9C%B0%E5%8C%BA%E5%87%86%E6%97%B6%E9%80%81%E8%BE%BE%E7%8E%87
```

[![On-time by region](https://x-cmd.com/draw?type=hbar&t=xcmd-issue&labels=%E4%B8%9C%E5%8C%BA%2C%E5%8C%97%E5%8C%BA%2C%E5%8D%97%E5%8C%BA%2C%E8%A5%BF%E5%8C%BA%2C%E4%B8%AD%E5%8C%BA&series=%E5%87%86%E6%97%B6%3A62%2C48%2C71%2C55%2C44&series=%E5%BB%B6%E8%AF%AF%3A14%2C26%2C11%2C21%2C33&title=%E5%90%84%E5%9C%B0%E5%8C%BA%E5%87%86%E6%97%B6%E9%80%81%E8%BE%BE%E7%8E%87)](https://x-cmd.com/draw/explore?type=hbar&t=xcmd-issue&labels=%E4%B8%9C%E5%8C%BA%2C%E5%8C%97%E5%8C%BA%2C%E5%8D%97%E5%8C%BA%2C%E8%A5%BF%E5%8C%BA%2C%E4%B8%AD%E5%8C%BA&series=%E5%87%86%E6%97%B6%3A62%2C48%2C71%2C55%2C44&series=%E5%BB%B6%E8%AF%AF%3A14%2C26%2C11%2C21%2C33&title=%E5%90%84%E5%9C%B0%E5%8C%BA%E5%87%86%E6%97%B6%E9%80%81%E8%BE%BE%E7%8E%87)

每个区域两根条:准时的,和延误的。

### 每周吞吐 —— 件数与托盘数

```text
https://x-cmd.com/draw?type=line&t=opendata&labels=W1,W2,W3,W4,W5,W6,W7,W8&series=%E5%8C%85%E8%A3%B9%3A1200%2C1340%2C1280%2C1510%2C1620%2C1740%2C1810%2C1930&series=%E6%89%98%E7%9B%98%3A340%2C380%2C360%2C420%2C455%2C470%2C505%2C530&title=%E6%AF%8F%E5%91%A8%E5%90%9E%E5%90%90%E9%87%8F
```

[![Weekly throughput](https://x-cmd.com/draw?type=line&t=opendata&labels=W1,W2,W3,W4,W5,W6,W7,W8&series=%E5%8C%85%E8%A3%B9%3A1200%2C1340%2C1280%2C1510%2C1620%2C1740%2C1810%2C1930&series=%E6%89%98%E7%9B%98%3A340%2C380%2C360%2C420%2C455%2C470%2C505%2C530&title=%E6%AF%8F%E5%91%A8%E5%90%9E%E5%90%90%E9%87%8F)](https://x-cmd.com/draw/explore?type=line&t=opendata&labels=W1,W2,W3,W4,W5,W6,W7,W8&series=%E5%8C%85%E8%A3%B9%3A1200%2C1340%2C1280%2C1510%2C1620%2C1740%2C1810%2C1930&series=%E6%89%98%E7%9B%98%3A340%2C380%2C360%2C420%2C455%2C470%2C505%2C530&title=%E6%AF%8F%E5%91%A8%E5%90%9E%E5%90%90%E9%87%8F)

八周两条线。

### 仓库占用 —— 用了多少

```text
https://x-cmd.com/draw?type=gauge&t=gradient&title=%E4%BB%93%E5%BA%93%E5%88%A9%E7%94%A8%E7%8E%87&value=72&max=100
```

[![Warehouse fill](https://x-cmd.com/draw?type=gauge&t=gradient&title=%E4%BB%93%E5%BA%93%E5%88%A9%E7%94%A8%E7%8E%87&value=72&max=100)](https://x-cmd.com/draw/explore?type=gauge&t=gradient&title=%E4%BB%93%E5%BA%93%E5%88%A9%E7%94%A8%E7%8E%87&value=72&max=100)

渐变环,数字越大填得越满。

### 运输方式 —— 怎么分的

```text
https://x-cmd.com/draw?type=pie&title=%E5%90%84%E8%BF%90%E8%BE%93%E6%96%B9%E5%BC%8F%E5%8D%A0%E6%AF%94&labels=%E5%85%AC%E8%B7%AF%2C%E9%93%81%E8%B7%AF%2C%E6%B5%B7%E8%BF%90%2C%E7%A9%BA%E8%BF%90&values=48,26,19,7&unit=%25
```

[![Shipments by mode](https://x-cmd.com/draw?type=pie&title=%E5%90%84%E8%BF%90%E8%BE%93%E6%96%B9%E5%BC%8F%E5%8D%A0%E6%AF%94&labels=%E5%85%AC%E8%B7%AF%2C%E9%93%81%E8%B7%AF%2C%E6%B5%B7%E8%BF%90%2C%E7%A9%BA%E8%BF%90&values=48,26,19,7&unit=%25)](https://x-cmd.com/draw/explore?type=pie&title=%E5%90%84%E8%BF%90%E8%BE%93%E6%96%B9%E5%BC%8F%E5%8D%A0%E6%AF%94&labels=%E5%85%AC%E8%B7%AF%2C%E9%93%81%E8%B7%AF%2C%E6%B5%B7%E8%BF%90%2C%E7%A9%BA%E8%BF%90&values=48,26,19,7&unit=%25)

公路、铁路、海运、空运 —— 网络的形状在一个环里。

### 从下单到送达 —— 时间花在哪

```text
https://x-cmd.com/draw?type=sankey&t=fund&title=%E4%B8%8B%E5%8D%95%E5%88%B0%E7%AD%BE%E6%94%B6&labels=%E4%B8%8B%E5%8D%95%2C%E6%8B%A3%E8%B4%A7%2C%E6%89%93%E5%8C%85%2C%E5%8F%91%E8%B4%A7%2C%E7%AD%BE%E6%94%B6&links=%E4%B8%8B%E5%8D%95%3E%E6%8B%A3%E8%B4%A7%3A420%3B%E4%B8%8B%E5%8D%95%3E%E5%8F%91%E8%B4%A7%3A60%3B%E6%8B%A3%E8%B4%A7%3E%E6%89%93%E5%8C%85%3A380%3B%E6%89%93%E5%8C%85%3E%E5%8F%91%E8%B4%A7%3A360%3B%E5%8F%91%E8%B4%A7%3E%E7%AD%BE%E6%94%B6%3A340
```

[![Order to door](https://x-cmd.com/draw?type=sankey&t=fund&title=%E4%B8%8B%E5%8D%95%E5%88%B0%E7%AD%BE%E6%94%B6&labels=%E4%B8%8B%E5%8D%95%2C%E6%8B%A3%E8%B4%A7%2C%E6%89%93%E5%8C%85%2C%E5%8F%91%E8%B4%A7%2C%E7%AD%BE%E6%94%B6&links=%E4%B8%8B%E5%8D%95%3E%E6%8B%A3%E8%B4%A7%3A420%3B%E4%B8%8B%E5%8D%95%3E%E5%8F%91%E8%B4%A7%3A60%3B%E6%8B%A3%E8%B4%A7%3E%E6%89%93%E5%8C%85%3A380%3B%E6%89%93%E5%8C%85%3E%E5%8F%91%E8%B4%A7%3A360%3B%E5%8F%91%E8%B4%A7%3E%E7%AD%BE%E6%94%B6%3A340)](https://x-cmd.com/draw/explore?type=sankey&t=fund&title=%E4%B8%8B%E5%8D%95%E5%88%B0%E7%AD%BE%E6%94%B6&labels=%E4%B8%8B%E5%8D%95%2C%E6%8B%A3%E8%B4%A7%2C%E6%89%93%E5%8C%85%2C%E5%8F%91%E8%B4%A7%2C%E7%AD%BE%E6%94%B6&links=%E4%B8%8B%E5%8D%95%3E%E6%8B%A3%E8%B4%A7%3A420%3B%E4%B8%8B%E5%8D%95%3E%E5%8F%91%E8%B4%A7%3A60%3B%E6%8B%A3%E8%B4%A7%3E%E6%89%93%E5%8C%85%3A380%3B%E6%89%93%E5%8C%85%3E%E5%8F%91%E8%B4%A7%3A360%3B%E5%8F%91%E8%B4%A7%3E%E7%AD%BE%E6%94%B6%3A340)

每个环节,以及那些直接跳过某个环节的订单。

### 履约网络

```text
https://x-cmd.com/draw/archmap?n=hub%3Bsec%3B%E5%88%86%E6%8B%A3%E4%B8%AD%E5%BF%83%3Br0c0&n=depot%3Bbe%3B%E5%8C%BA%E5%9F%9F%E7%AB%99%E7%82%B9%3Br1c0&n=van%3Bfe%3B%E9%85%8D%E9%80%81%E8%BD%A6%3Br2c0&n=scanner;db;WMS;r1c1&e=hub;depot&e=depot;van&e=depot;scanner&b=%E5%B1%A5%E7%BA%A6%3Bhub%20depot%20scanner
```

[![Fulfilment network](https://x-cmd.com/draw/archmap?n=hub%3Bsec%3B%E5%88%86%E6%8B%A3%E4%B8%AD%E5%BF%83%3Br0c0&n=depot%3Bbe%3B%E5%8C%BA%E5%9F%9F%E7%AB%99%E7%82%B9%3Br1c0&n=van%3Bfe%3B%E9%85%8D%E9%80%81%E8%BD%A6%3Br2c0&n=scanner;db;WMS;r1c1&e=hub;depot&e=depot;van&e=depot;scanner&b=%E5%B1%A5%E7%BA%A6%3Bhub%20depot%20scanner)](https://x-cmd.com/draw/explore/archmap?n=hub;sec;Sorting%20hub;r0c0&n=depot;be;Regional%20depot;r1c0&n=van;fe;Delivery%20van;r2c0&n=scanner;db;WMS;r1c1&e=hub;depot&e=depot;van&e=depot;scanner&b=Fulfilment;hub%20depot%20scanner)

架构图:分拣中心、区域仓、派送车,以及喂给它们的系统。


## 该用哪张图

| 问题 | 图种 | 参考 |
|---|---|---|
| 哪个区域延误多? | 横条图 | [hbar](../../2-data-charts/03-hbar/cn.md) |
| 这周走了多少? | 折线图 | [line](../../2-data-charts/04-line/cn.md) |
| 仓库有多满? | 仪表盘 | [gauge](../../2-data-charts/07-gauge/cn.md) |
| 都怎么运? | 饼图 | [pie](../../2-data-charts/01-pie/cn.md) |
| 时间花在哪? | 桑基图 | [sankey](../../3-relations/01-sankey/cn.md) |
| 网络长什么样? | 架构图 | [archmap](../../5-architecture/01-archmap/cn.md) |
