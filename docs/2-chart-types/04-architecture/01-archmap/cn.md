---
x-title: 架构图 —— 自己排格子,引擎自动连线
x-desc: 'x-cmd/draw 架构图速查(`/draw/archmap`)。你把节点摆在格子上,引擎负责打包、走线、画分组边界。参数:`n=` 节点(`id;类型;标签[;副标][;位置]`),`e=` 连线(`起点;终点[;标签][;样式]`),`b=` 边界(`名称;id id …`),`t=` 风格(base/mono/soft),`title=`,`w=/h=`,`grid=`。'
x-sidebar: draw 架构图
x-keywords: 架构图, draw, svg, 拓扑图, 系统设计
x-json-ld:
  '@context': https://schema.org
  '@graph':
    - '@type': TechArticle
      headline: 'draw 架构图'
      inLanguage: 'cn'
      about: 'x-cmd/draw 01-archmap'
---

# 架构图 —— 你摆格子,引擎走线

> 本页还是草稿:下面的例子是真的可用,完整说明待补。

你把方块摆在格子上、点名连线,剩下的交给引擎:打包、走线、画分组边界。
不用手动画布局。

```text
https://x-cmd.com/draw/archmap?n=web;fe;Browser;r0c0&n=cdn;cloud;CDN;r0c1&n=gw;be;API%20Gateway;auth;r0c2&n=auth;be;Auth%20Service;r1c1&n=render;be;Chart%20Render;r1c2&n=pg;db;Postgres;r2c1&n=cache;db;Redis;r2c2&e=web;cdn&e=cdn;gw&e=gw;auth&e=gw;render&e=auth;pg&e=render;pg&e=render;cache&b=Data%20Layer;pg%20cache
```

[![三层 Web 应用](https://x-cmd.com/draw/archmap?n=web;fe;Browser;r0c0&n=cdn;cloud;CDN;r0c1&n=gw;be;API%20Gateway;auth;r0c2&n=auth;be;Auth%20Service;r1c1&n=render;be;Chart%20Render;r1c2&n=pg;db;Postgres;r2c1&n=cache;db;Redis;r2c2&e=web;cdn&e=cdn;gw&e=gw;auth&e=gw;render&e=auth;pg&e=render;pg&e=render;cache&b=Data%20Layer;pg%20cache)](https://x-cmd.com/draw/explore/archmap?n=web;fe;Browser;r0c0&n=cdn;cloud;CDN;r0c1&n=gw;be;API%20Gateway;auth;r0c2&n=auth;be;Auth%20Service;r1c1&n=render;be;Chart%20Render;r1c2&n=pg;db;Postgres;r2c1&n=cache;db;Redis;r2c2&e=web;cdn&e=cdn;gw&e=gw;auth&e=gw;render&e=auth;pg&e=render;pg&e=render;cache&b=Data%20Layer;pg%20cache)

带命名空间边界的 Kubernetes 拓扑:

```text
https://x-cmd.com/draw/archmap?n=ing;cloud;Ingress;r0c0&n=svc;cloud;Service;r0c1&n=p1;be;Pod%20api-a;r1c0&n=p2;be;Pod%20api-b;r1c1&n=db;db;StatefulSet;r2c0&n=tw;fe;Web%20UI;r0c2&e=tw;svc&e=ing;svc&e=svc;p1&e=svc;p2&e=p1;db&e=p2;db&b=Namespace;p1%20p2&title=Kubernetes%20topology&w=560
```

[![Kubernetes 拓扑](https://x-cmd.com/draw/archmap?n=ing;cloud;Ingress;r0c0&n=svc;cloud;Service;r0c1&n=p1;be;Pod%20api-a;r1c0&n=p2;be;Pod%20api-b;r1c1&n=db;db;StatefulSet;r2c0&n=tw;fe;Web%20UI;r0c2&e=tw;svc&e=ing;svc&e=svc;p1&e=svc;p2&e=p1;db&e=p2;db&b=Namespace;p1%20p2&title=Kubernetes%20topology&w=560)](https://x-cmd.com/draw/explore/archmap?n=ing;cloud;Ingress;r0c0&n=svc;cloud;Service;r0c1&n=p1;be;Pod%20api-a;r1c0&n=p2;be;Pod%20api-b;r1c1&n=db;db;StatefulSet;r2c0&n=tw;fe;Web%20UI;r0c2&e=tw;svc&e=ing;svc&e=svc;p1&e=svc;p2&e=p1;db&e=p2;db&b=Namespace;p1%20p2&title=Kubernetes%20topology&w=560)

## 一、参数

| 参数 | 含义 | 默认 |
| --- | --- | --- |
| `n=` | 一个节点:`id;类型;标签[;副标][;位置]` —— 每个节点写一次 | — |
| `e=` | 一条连线:`起点;终点[;标签][;样式]`,样式是 `main` 或 `dash` | — |
| `b=` | 一个边界:`名称;id id …` —— 列出来的节点会框在一起 | — |
| `t=` | 风格:`base`、`mono`(线框)或 `soft` | `base` |
| `title=` | 图标题 | — |
| `w=` / `h=` | 最小宽 / 高 | 自然尺寸 |
| `grid=` | 强制分成 1–12 列 | 自动 |

节点类型:`ext` `fe` `be` `db` `cloud` `sec` `bus` `svc`。
位置可写格位 `r0c1`(可加 `r0c1w2` 表示横跨两格)或像素 `p40,80`。

## 二、踩坑

- **连线只能指向已存在的节点** —— `e=` 里的 id 不存在会 400,不是悄悄少画一根线。
- **一个节点一条 `n=`** —— id 重复会 400,每个方块都要自己的 id。
- **边界成员用 id 列出**,空格分隔 —— 边界里没有成员也会 400。

