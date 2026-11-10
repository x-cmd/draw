---
x-title: 架构图 —— 你摆格子,引擎走线
x-desc: 'x-cmd/draw 架构图(`/draw/archmap`)。节点摆格子、连线自动走、边界自动成组。参数:`n=` 节点(`id;类型;标签[;副标][;位置]`),`e=` 连线(`起点;终点[;标签][;样式]`),`b=` 边界(`名称;id id`),`t=` 风格(base/mono/soft),`grid=`,`title=`,`w=/h=`。'
x-sidebar: draw 架构图
x-keywords: 架构图, draw, svg, 拓扑图, 系统设计, kubernetes
x-json-ld:
  '@context': https://schema.org
  '@graph':
    - '@type': TechArticle
      headline: 'draw 架构图'
      inLanguage: 'cn'
      about: 'x-cmd/draw 01-archmap'
---

# 架构图 —— 你摆格子,引擎走线

你给方块起名字、点名谁指向谁,剩下的交给引擎:量盒子、按你给的格子摆好、
把线绕开走、画出分组边界。位置不用手算。

## 示例(URL 即所得,点击图片进入交互页)

### 三层 Web 应用

```text
https://x-cmd.com/draw/archmap?n=web;fe;Browser;r0c0&n=cdn;cloud;CDN;r0c1&n=gw;be;API%20Gateway;auth;r0c2&n=auth;be;Auth%20Service;r1c1&n=render;be;Chart%20Render;r1c2&n=pg;db;Postgres;r2c1&n=cache;db;Redis;r2c2&e=web;cdn&e=cdn;gw&e=gw;auth&e=gw;render&e=auth;pg&e=render;pg&e=render;cache&b=Data%20Layer;pg%20cache
```

[![三层 Web 应用](https://x-cmd.com/draw/archmap?n=web;fe;Browser;r0c0&n=cdn;cloud;CDN;r0c1&n=gw;be;API%20Gateway;auth;r0c2&n=auth;be;Auth%20Service;r1c1&n=render;be;Chart%20Render;r1c2&n=pg;db;Postgres;r2c1&n=cache;db;Redis;r2c2&e=web;cdn&e=cdn;gw&e=gw;auth&e=gw;render&e=auth;pg&e=render;pg&e=render;cache&b=Data%20Layer;pg%20cache)](https://x-cmd.com/draw/explore/archmap?n=web;fe;Browser;r0c0&n=cdn;cloud;CDN;r0c1&n=gw;be;API%20Gateway;auth;r0c2&n=auth;be;Auth%20Service;r1c1&n=render;be;Chart%20Render;r1c2&n=pg;db;Postgres;r2c1&n=cache;db;Redis;r2c2&e=web;cdn&e=cdn;gw&e=gw;auth&e=gw;render&e=auth;pg&e=render;pg&e=render;cache&b=Data%20Layer;pg%20cache)

图里的 `Data Layer` 框是**边界**:被点名的两个节点框在一起,读者一眼看出哪层归谁管。

### 同一张图换个风格

```text
https://x-cmd.com/draw/archmap?t=mono&n=web;fe;Browser;r0c0&n=cdn;cloud;CDN;r0c1&n=gw;be;API%20Gateway;auth;r0c2&n=auth;be;Auth%20Service;r1c1&n=render;be;Chart%20Render;r1c2&n=pg;db;Postgres;r2c1&n=cache;db;Redis;r2c2&e=web;cdn&e=cdn;gw&e=gw;auth&e=gw;render&e=auth;pg&e=render;pg&e=render;cache&b=Data%20Layer;pg%20cache
```

[![三层 Web 应用 · mono](https://x-cmd.com/draw/archmap?t=mono&n=web;fe;Browser;r0c0&n=cdn;cloud;CDN;r0c1&n=gw;be;API%20Gateway;auth;r0c2&n=auth;be;Auth%20Service;r1c1&n=render;be;Chart%20Render;r1c2&n=pg;db;Postgres;r2c1&n=cache;db;Redis;r2c2&e=web;cdn&e=cdn;gw&e=gw;auth&e=gw;render&e=auth;pg&e=render;pg&e=render;cache&b=Data%20Layer;pg%20cache)](https://x-cmd.com/draw/explore/archmap?t=mono&n=web;fe;Browser;r0c0&n=cdn;cloud;CDN;r0c1&n=gw;be;API%20Gateway;auth;r0c2&n=auth;be;Auth%20Service;r1c1&n=render;be;Chart%20Render;r1c2&n=pg;db;Postgres;r2c1&n=cache;db;Redis;r2c2&e=web;cdn&e=cdn;gw&e=gw;auth&e=gw;render&e=auth;pg&e=render;pg&e=render;cache&b=Data%20Layer;pg%20cache)

`mono` 去掉填色只留线条 —— 复印也不糊。`soft` 是同图的柔和版:

```text
https://x-cmd.com/draw/archmap?t=soft&n=web;fe;Browser;r0c0&n=cdn;cloud;CDN;r0c1&n=gw;be;API%20Gateway;auth;r0c2&n=auth;be;Auth%20Service;r1c1&n=render;be;Chart%20Render;r1c2&n=pg;db;Postgres;r2c1&n=cache;db;Redis;r2c2&e=web;cdn&e=cdn;gw&e=gw;auth&e=gw;render&e=auth;pg&e=render;pg&e=render;cache&b=Data%20Layer;pg%20cache
```

[![三层 Web 应用 · soft](https://x-cmd.com/draw/archmap?t=soft&n=web;fe;Browser;r0c0&n=cdn;cloud;CDN;r0c1&n=gw;be;API%20Gateway;auth;r0c2&n=auth;be;Auth%20Service;r1c1&n=render;be;Chart%20Render;r1c2&n=pg;db;Postgres;r2c1&n=cache;db;Redis;r2c2&e=web;cdn&e=cdn;gw&e=gw;auth&e=gw;render&e=auth;pg&e=render;pg&e=render;cache&b=Data%20Layer;pg%20cache)](https://x-cmd.com/draw/explore/archmap?t=soft&n=web;fe;Browser;r0c0&n=cdn;cloud;CDN;r0c1&n=gw;be;API%20Gateway;auth;r0c2&n=auth;be;Auth%20Service;r1c1&n=render;be;Chart%20Render;r1c2&n=pg;db;Postgres;r2c1&n=cache;db;Redis;r2c2&e=web;cdn&e=cdn;gw&e=gw;auth&e=gw;render&e=auth;pg&e=render;pg&e=render;cache&b=Data%20Layer;pg%20cache)

### 带命名空间边界的 Kubernetes 拓扑

```text
https://x-cmd.com/draw/archmap?n=ing;cloud;Ingress;r0c0&n=svc;cloud;Service;r0c1&n=p1;be;Pod%20api-a;r1c0&n=p2;be;Pod%20api-b;r1c1&n=db;db;StatefulSet;r2c0&n=tw;fe;Web%20UI;r0c2&e=tw;svc&e=ing;svc&e=svc;p1&e=svc;p2&e=p1;db&e=p2;db&b=Namespace;p1%20p2&title=Kubernetes%20topology&w=560
```

[![Kubernetes 拓扑](https://x-cmd.com/draw/archmap?n=ing;cloud;Ingress;r0c0&n=svc;cloud;Service;r0c1&n=p1;be;Pod%20api-a;r1c0&n=p2;be;Pod%20api-b;r1c1&n=db;db;StatefulSet;r2c0&n=tw;fe;Web%20UI;r0c2&e=tw;svc&e=ing;svc&e=svc;p1&e=svc;p2&e=p1;db&e=p2;db&b=Namespace;p1%20p2&title=Kubernetes%20topology&w=560)](https://x-cmd.com/draw/explore/archmap?n=ing;cloud;Ingress;r0c0&n=svc;cloud;Service;r0c1&n=p1;be;Pod%20api-a;r1c0&n=p2;be;Pod%20api-b;r1c1&n=db;db;StatefulSet;r2c0&n=tw;fe;Web%20UI;r0c2&e=tw;svc&e=ing;svc&e=svc;p1&e=svc;p2&e=p1;db&e=p2;db&b=Namespace;p1%20p2&title=Kubernetes%20topology&w=560)

## 一、参数

| 参数 | 含义 | 默认 |
|---|---|---|
| `n=` | 一个节点:`id;类型;标签[;副标][;位置]` —— 每个节点写一次 | — |
| `e=` | 一条连线:`起点;终点[;标签][;样式]` | — |
| `b=` | 一个边界:`名称;id id …` | — |
| `t=` | 风格:`base`、`mono`(线框)或 `soft`(柔和) | `base` |
| `grid=` | 强制分成 1–12 列 | 自动 |
| `title=` | 图标题 | — |
| `w=` / `h=` | 最小宽 / 高 | 自然尺寸 |
| `v=` | 固定输出版本 | 最新 |

## 二、节点怎么写

```
n=id;类型;标签[;副标][;位置]
```

- **id** —— 你在 `e=` 和 `b=` 里引用的名字。字母、数字、点、横线、下划线;不能以数字或标点开头。
- **类型** —— 方块是什么,决定颜色和图标:

| 类型 | 是什么 |
|---|---|
| `fe` | 前端 —— 浏览器、App、界面 |
| `be` | 后端 —— 服务、worker、API |
| `db` | 数据库 —— Postgres、Redis、存储 |
| `cloud` | 云服务或托管服务 |
| `ext` | 外部系统 —— 第三方 |
| `sec` | 安全 —— 认证、网关、WAF |
| `bus` | 消息 —— 队列、主题、流 |
| `svc` | 通用服务 |

- **标签** —— 方块里的字。
- **副标** —— 第二行小字,可省。
- **位置** —— 方块摆哪,可省。格位 `r0c1`(第 0 行第 1 列)或 `r0c1w2` 横跨两列;
  也可以写像素 `p40,80` 或 `p40,80,120x48` 指定大小。

不写位置,引擎按你给的顺序自己打包。

## 三、连线怎么写

```
e=起点;终点[;标签][;样式]
```

- **起点** / **终点** —— 节点 id,两个都得存在。
- **标签** —— 线上的字。
- **样式** —— `main` 走主线,`dash` 走次要分支。

## 四、边界怎么写

```
b=名称;id id …
```

分号后面点名的节点会被框在一起,归到这个名字下。边界里没有成员会 400。

## 五、踩坑

- **连线只能指向存在的节点** —— id 写错是 400,不是悄悄少画一根线。
- **一个节点一条 `n=`** —— id 重复会 400,每个方块都要自己的 id。
- **边界成员用 id 列出**,空格分隔 —— 它不会替你建节点。
- **位置默认是格位不是像素**,除非写 `p` 形式;不写位置就由引擎打包。
- **`grid=` 定的是列数**(1–12);写死了格位的节点不动。

