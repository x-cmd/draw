---
x-title: 运维与可靠性 —— 值班室的那面墙
x-desc: 'x-cmd/draw 场景用例:运维与可靠性。可用性 SLA 仪表盘、存储占用、Kubernetes 拓扑、登录决策流程、周活跃用户的真实 URL。'
x-sidebar: draw 场景用例 运维可靠性
x-keywords: sre 看板, 可用性图, k8s 拓扑, draw 场景用例, svg
x-json-ld:
  '@context': https://schema.org
  '@graph':
    - '@type': TechArticle
      headline: 'draw 场景用例 运维可靠性'
      inLanguage: 'cn'
      about: 'x-cmd/draw showcase 06-ops-reliability'
---

# 运维与可靠性 —— 值班室的那面墙

一个服务看板由哪几块拼起来。

### 可用性 —— 挂在墙上的那个数

```text
https://x-cmd.com/draw?type=gauge&t=reliability&title=Uptime%20SLA&value=99.95&max=100
```

[![Uptime SLA](https://x-cmd.com/draw?type=gauge&t=reliability&title=Uptime%20SLA&value=99.95&max=100)](https://x-cmd.com/draw/explore?type=gauge&t=reliability&title=Uptime%20SLA&value=99.95&max=100)

reliability 风格:分区环加刻度,99.95 不会看着像 100。

### 存储 —— 用了多少

```text
https://x-cmd.com/draw?type=gauge&t=gradient&title=Storage%20used&value=68&max=100
```

[![Storage used](https://x-cmd.com/draw?type=gauge&t=gradient&title=Storage%20used&value=68&max=100)](https://x-cmd.com/draw/explore?type=gauge&t=gradient&title=Storage%20used&value=68&max=100)

渐变环,数字越大填得越满。

### 集群 —— 谁和谁通信

```text
https://x-cmd.com/draw/archmap?n=ing;cloud;Ingress;r0c0&n=svc;cloud;Service;r0c1&n=p1;be;Pod%20api-a;r1c0&n=p2;be;Pod%20api-b;r1c1&n=db;db;StatefulSet;r2c0&n=tw;fe;Web%20UI;r0c2&e=tw;svc&e=ing;svc&e=svc;p1&e=svc;p2&e=p1;db&e=p2;db&b=Namespace;p1%20p2&title=Kubernetes%20topology&w=560
```

[![Kubernetes topology](https://x-cmd.com/draw/archmap?n=ing;cloud;Ingress;r0c0&n=svc;cloud;Service;r0c1&n=p1;be;Pod%20api-a;r1c0&n=p2;be;Pod%20api-b;r1c1&n=db;db;StatefulSet;r2c0&n=tw;fe;Web%20UI;r0c2&e=tw;svc&e=ing;svc&e=svc;p1&e=svc;p2&e=p1;db&e=p2;db&b=Namespace;p1%20p2&title=Kubernetes%20topology&w=560)](https://x-cmd.com/draw/explore/archmap?n=ing;cloud;Ingress;r0c0&n=svc;cloud;Service;r0c1&n=p1;be;Pod%20api-a;r1c0&n=p2;be;Pod%20api-b;r1c1&n=db;db;StatefulSet;r2c0&n=tw;fe;Web%20UI;r0c2&e=tw;svc&e=ing;svc&e=svc;p1&e=svc;p2&e=p1;db&e=p2;db&b=Namespace;p1%20p2&title=Kubernetes%20topology&w=560)

入口、服务、Pod 和有状态服务,命名空间把 Pod 框在一起。

### 登录路径 —— 一棵决策树

```text
https://x-cmd.com/draw/mermaid?m=graph%20TD%0A%20%20Login%5BUser%20login%5D%20--%3E%20MFA%7BMFA%20enabled%3F%7D%0A%20%20MFA%20--%3E%7Cyes%7C%20Code%5BSend%20code%5D%0A%20%20Code%20--%3E%20Verify%5BVerify%5D%0A%20%20Verify%20--%3E%7Cpass%7C%20Session%5BIssue%20session%5D%0A%20%20Verify%20--%3E%7Cfail%7C%20Lock%5BLock%20account%5D%0A%20%20MFA%20--%3E%7Cno%7C%20Session&t=mono&title=Login%20flow&w=560
```

[![Login flow](https://x-cmd.com/draw/mermaid?m=graph%20TD%0A%20%20Login%5BUser%20login%5D%20--%3E%20MFA%7BMFA%20enabled%3F%7D%0A%20%20MFA%20--%3E%7Cyes%7C%20Code%5BSend%20code%5D%0A%20%20Code%20--%3E%20Verify%5BVerify%5D%0A%20%20Verify%20--%3E%7Cpass%7C%20Session%5BIssue%20session%5D%0A%20%20Verify%20--%3E%7Cfail%7C%20Lock%5BLock%20account%5D%0A%20%20MFA%20--%3E%7Cno%7C%20Session&t=mono&title=Login%20flow&w=560)](https://x-cmd.com/draw/explore/mermaid?m=graph%20TD%0A%20%20Login%5BUser%20login%5D%20--%3E%20MFA%7BMFA%20enabled%3F%7D%0A%20%20MFA%20--%3E%7Cyes%7C%20Code%5BSend%20code%5D%0A%20%20Code%20--%3E%20Verify%5BVerify%5D%0A%20%20Verify%20--%3E%7Cpass%7C%20Session%5BIssue%20session%5D%0A%20%20Verify%20--%3E%7Cfail%7C%20Lock%5BLock%20account%5D%0A%20%20MFA%20--%3E%7Cno%7C%20Session&t=mono&title=Login%20flow&w=560)

写 Mermaid、出图:MFA 开不开、验证码过不过。

### 活跃用户 —— 两个端

```text
https://x-cmd.com/draw?type=line&t=opendata&labels=W1,W2,W3,W4,W5,W6,W7,W8&series=App:120,145,138,170,165,198,210,230&series=Web:80,95,110,140,170,190,220,250&title=Weekly%20active%20users
```

[![Weekly active users](https://x-cmd.com/draw?type=line&t=opendata&labels=W1,W2,W3,W4,W5,W6,W7,W8&series=App:120,145,138,170,165,198,210,230&series=Web:80,95,110,140,170,190,220,250&title=Weekly%20active%20users)](https://x-cmd.com/draw/explore?type=line&t=opendata&labels=W1,W2,W3,W4,W5,W6,W7,W8&series=App:120,145,138,170,165,198,210,230&series=Web:80,95,110,140,170,190,220,250&title=Weekly%20active%20users)

八周两条线;opendata 风格是其中最素净的一个。


## 该用哪张图

| 问题 | 图种 | 参考 |
|---|---|---|
| 此刻可用率多少? | 仪表盘 | [gauge](../../5-data-charts/07-gauge/cn.md) |
| 磁盘用了多少? | 仪表盘 | [gauge](../../5-data-charts/07-gauge/cn.md) |
| 集群里谁和谁通信? | 架构图 | [archmap](../../8-architecture/01-archmap/cn.md) |
| 用户登录时发生了什么? | 流程图 | [mermaid](../../8-architecture/03-mermaid/cn.md) |
| 有多少人在用? | 折线图 | [line](../../5-data-charts/04-line/cn.md) |
