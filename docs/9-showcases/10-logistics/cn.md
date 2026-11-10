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
https://x-cmd.com/draw?type=hbar&t=xcmd-issue&labels=East,North,South,West,Central&series=on%20time:62,48,71,55,44&series=late:14,26,11,21,33&title=Deliveries%20on%20time%20by%20region
```

[![On-time by region](https://x-cmd.com/draw?type=hbar&t=xcmd-issue&labels=East,North,South,West,Central&series=on%20time:62,48,71,55,44&series=late:14,26,11,21,33&title=Deliveries%20on%20time%20by%20region)](https://x-cmd.com/draw/explore?type=hbar&t=xcmd-issue&labels=East,North,South,West,Central&series=on%20time:62,48,71,55,44&series=late:14,26,11,21,33&title=Deliveries%20on%20time%20by%20region)

每个区域两根条:准时的,和延误的。

### 每周吞吐 —— 件数与托盘数

```text
https://x-cmd.com/draw?type=line&t=opendata&labels=W1,W2,W3,W4,W5,W6,W7,W8&series=Parcels:1200,1340,1280,1510,1620,1740,1810,1930&series=Pallets:340,380,360,420,455,470,505,530&title=Weekly%20throughput
```

[![Weekly throughput](https://x-cmd.com/draw?type=line&t=opendata&labels=W1,W2,W3,W4,W5,W6,W7,W8&series=Parcels:1200,1340,1280,1510,1620,1740,1810,1930&series=Pallets:340,380,360,420,455,470,505,530&title=Weekly%20throughput)](https://x-cmd.com/draw/explore?type=line&t=opendata&labels=W1,W2,W3,W4,W5,W6,W7,W8&series=Parcels:1200,1340,1280,1510,1620,1740,1810,1930&series=Pallets:340,380,360,420,455,470,505,530&title=Weekly%20throughput)

八周两条线。

### 仓库占用 —— 用了多少

```text
https://x-cmd.com/draw?type=gauge&t=gradient&title=Warehouse%20fill&value=72&max=100
```

[![Warehouse fill](https://x-cmd.com/draw?type=gauge&t=gradient&title=Warehouse%20fill&value=72&max=100)](https://x-cmd.com/draw/explore?type=gauge&t=gradient&title=Warehouse%20fill&value=72&max=100)

渐变环,数字越大填得越满。

### 运输方式 —— 怎么分的

```text
https://x-cmd.com/draw?type=pie&title=Shipments%20by%20mode&labels=Road,Rail,Sea,Air&values=48,26,19,7&unit=%25
```

[![Shipments by mode](https://x-cmd.com/draw?type=pie&title=Shipments%20by%20mode&labels=Road,Rail,Sea,Air&values=48,26,19,7&unit=%25)](https://x-cmd.com/draw/explore?type=pie&title=Shipments%20by%20mode&labels=Road,Rail,Sea,Air&values=48,26,19,7&unit=%25)

公路、铁路、海运、空运 —— 网络的形状在一个环里。

### 从下单到送达 —— 时间花在哪

```text
https://x-cmd.com/draw?type=sankey&t=fund&title=Order%20to%20door&labels=Order,Pick,Pack,Ship,Deliver&links=Order>Pick:420;Order>Ship:60;Pick>Pack:380;Pack>Ship:360;Ship>Deliver:340
```

[![Order to door](https://x-cmd.com/draw?type=sankey&t=fund&title=Order%20to%20door&labels=Order,Pick,Pack,Ship,Deliver&links=Order>Pick:420;Order>Ship:60;Pick>Pack:380;Pack>Ship:360;Ship>Deliver:340)](https://x-cmd.com/draw/explore?type=sankey&t=fund&title=Order%20to%20door&labels=Order,Pick,Pack,Ship,Deliver&links=Order>Pick:420;Order>Ship:60;Pick>Pack:380;Pack>Ship:360;Ship>Deliver:340)

每个环节,以及那些直接跳过某个环节的订单。

### 履约网络

```text
https://x-cmd.com/draw/archmap?n=hub;sec;Sorting%20hub;r0c0&n=depot;be;Regional%20depot;r1c0&n=van;fe;Delivery%20van;r2c0&n=scanner;db;WMS;r1c1&e=hub;depot&e=depot;van&e=depot;scanner&b=Fulfilment;hub%20depot%20scanner
```

[![Fulfilment network](https://x-cmd.com/draw/archmap?n=hub;sec;Sorting%20hub;r0c0&n=depot;be;Regional%20depot;r1c0&n=van;fe;Delivery%20van;r2c0&n=scanner;db;WMS;r1c1&e=hub;depot&e=depot;van&e=depot;scanner&b=Fulfilment;hub%20depot%20scanner)](https://x-cmd.com/draw/explore/archmap?n=hub;sec;Sorting%20hub;r0c0&n=depot;be;Regional%20depot;r1c0&n=van;fe;Delivery%20van;r2c0&n=scanner;db;WMS;r1c1&e=hub;depot&e=depot;van&e=depot;scanner&b=Fulfilment;hub%20depot%20scanner)

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
