---
x-title: 图的 URL —— 一套语法,八种图
x-desc: '怎么写 draw 的图的 URL:`n=` 节点(`id;type;label[;sub][;pos]`)、`e=` 边(`from;to[;label][;variant]`)、`b=` 分组(`label;id id`)。archmap、arch2、seq、uc、dataflow、lifecycle、erd、class 共用这一套 —— 外加每种图的节点类型对照表。'
x-sidebar: draw 图的 URL
x-keywords: 图的 URL, 架构图, 时序图, 用例图, ERD, 类图, 生命周期, 数据流, 节点语法, diagram url
x-json-ld:
  '@context': https://schema.org
  '@graph':
    - '@type': TechArticle
      headline: 'draw 图的 URL —— 一套语法,八种图'
      inLanguage: 'cn'
      about: 'x-cmd/draw 01-overview-06-diagram-urls'
---

# 图的 URL —— 一套语法,八种图

数据图用扁平参数(`labels=`、`values=`、`series=`);图用**属性表**:每个节点、
每条边、每个分组,都是一行用分号隔开的 `id;type;label`。

这一页的重点是:**只需要学一遍。** 架构图、时序图、用例图、数据流、生命周期、
ERD、类图,读的都是同样三个参数、同样的顺序、同样的分隔符。变的只有**词汇** ——
每种图各认各的节点类型名。

## 1. 三行参数

```text
n=id;type;label[;sub][;pos]     一个节点    (可重复)
e=from;to[;label][;variant]      一条边      (可重复)
b=label;id id …                  一个分组    (可重复)
```

### n= —— 节点

| 字段 | 必填 | 是什么 |
|---|---|---|
| `id` | 是 | 你在 `e=`、`b=` 里用的名字。字母、数字、点、横线、下划线;不能以标点开头 |
| `type` | 是 | 节点**是什么** —— 决定颜色、角标和形状。每种图各有一套词汇(见 §3) |
| `label` | 是 | 节点上的大字 |
| `sub` | 否 | 第二行小字。里面写 `%0A` 可以再分行 —— ERD 的字段表就是这么来的 |
| `pos` | 否 | 摆在哪儿。格子 `r0c1`、跨格 `r0c1w2`,或像素 `p40,80[,120x48]`。不写就由引擎自己排 |

```text
n=api;be;API Gateway;auth;r1c0w2
```

`id` = `api`,`type` = `be`,`label` = `API Gateway`,`sub` = `auth`,
位置 = 第 1 行第 0 列,横跨两列。

末尾多写的分号会被忽略 —— `n=api;be;API Gateway;;` 和前面那个是同一个节点。

### e= —— 边

```text
e=from;to[;label][;variant]
```

`from` / `to` 是节点 id,两个都必须存在,否则 400。`label` 是线上的字。
`variant` 决定线怎么画:

| 图种 | variant | 画出来是什么 |
|---|---|---|
| archmap、arch2、dataflow、lifecycle、erd、class | `main` | 承载主流程的那条线(更深、更粗) |
| 同上 | `dash` | 次要的一条线(虚线) |
| seq | `dash` | 回信 —— 写在消息行的最后一段 |
| uc | —— | 标签写成 `<<include>>` / `<<extend>>` 就画成虚线 |

```text
e=web;api;GET /draw?type=pie
e=api;api;main flow;main
```

### b= —— 分组

```text
b=label;id id …
```

分号后面的 id 会被框在一起、归到这个名字下:架构图里是系统边界,时序图里是
泳道,用例图里是系统框。id 必须先存在 —— 分组不会替你建节点。`b=` 可以写
多次,画多个分组。

```text
b=Data Layer;pg cache
b=Namespace;p1 p2
```

第三段可以**指定框的颜色** —— 写色板编号 1–10(\`b=AWS Region;cdn lb api;9\`)。
不写的话,draw 会挑一个这套图里节点类型没用到的颜色,框就不会和它圈住的
盒子混在一起。

## 2. 位置

| 写法 | 意思 |
|---|---|
| `r0c1` | 第 0 行第 1 列 |
| `r0c1w2` | 第 0 行第 1 列,横跨两列 |
| `r1c0h2` | 第 1 行第 0 列,纵跨两行 |
| `p40,80` | 离左边 40 像素、离上边 80 像素 |
| `p40,80,120x48` | 同上,并指定 120×48 的框 |

格子从 0 开始数。两个节点占同一格是 400。没写位置的节点由引擎按你写的顺序
依次放进空格子。

**时序图**里位置指参与方站在第几列(`r0c0`、`r0c1`…… 一行多列)。**用例图**
里位置可省:不写就是参与方在左、用例在右排成两列。

## 3. 每种图的词汇

语法一样,类型名不一样。这是唯一需要按图种查的东西。

| 图种 | 路径 | 节点类型 | 长什么样 |
|---|---|---|---|
| 架构图 | `/draw/arch2` | `fe` `be` `db` `cloud` `sec` `bus` `svc` `ext` | 带色 + 类型角标的方块 |
| 架构图(旧版) | `/draw/archmap` | `fe` `be` `db` `cloud` `sec` `bus` `svc` `ext` | 素方块 |
| 时序图 | `/draw/seq` | `fe` `be` `db` `cloud` `sec` `bus` `svc` `ext` | 生命线上方的标题盒 |
| 用例图 | `/draw/uc` | `actor` `uc` | 火柴人 / 椭圆 |
| 数据流 | `/draw/dataflow` | `process` `store` `source` `sink` | 方框 / 圆柱 / 圆 |
| 生命周期 | `/draw/lifecycle` | `state` `decision` `terminal` | 圆 / 菱形 / 圆 |
| ERD | `/draw/erd` | `table` `view` | 带字段表的方框 |
| 类图 | `/draw/class` | `class` `iface` `enum` | 带成员表的方框 |

架构图那八种类型:

| 类型 | 是什么 |
|---|---|
| `fe` | 前端 —— 浏览器、App、界面 |
| `be` | 后端 —— 服务、Worker、API |
| `db` | 数据库 —— Postgres、Redis、存储 |
| `cloud` | 云服务或托管服务 |
| `sec` | 安全 —— 认证、网关、WAF |
| `bus` | 消息 —— 队列、主题、流 |
| `svc` | 通用服务 |
| `ext` | 外部系统 —— 第三方 |

用了这张图不认识的类型会得到 400,错误里带着它认识的那几个 —— 照着改就行。

## 4. 一个完整的例子

数据流:四个节点、三条边、一个存储。

```text
https://x-cmd.com/draw/dataflow?n=raw;source;raw/orders.csv;;r0c0&n=extract;process;Extract rows;read %2B validate;r1c0&n=store;store;warehouse/orders;parquet;r2c0&n=dash;process;BI dashboard;;r2c1&e=raw;extract;rows&e=extract;store;write parquet&e=store;dash;query
```

- `n=raw;source;raw/orders.csv;;r0c0` —— source,没有第二行,放在第 0 行第 0 列。
- `n=extract;process;Extract rows;read %2B validate;r1c0` —— process,带一行小字。
- `e=raw;extract;rows` —— 带标签的边。两个 id 都存在,所以画得出来。
- `store` 是 `store`,所以画成圆柱;`dash` 是 `process`,所以画成方块。

同样的语法换个词汇,就是用例图:

```text
https://x-cmd.com/draw/uc?n=dev;actor;Developer&n=chart;uc;Render a chart&e=dev;chart&b=draw;chart
```

## 5. 多行文字

`sub` 里的 `%0A` 用来断行。ERD 的字段表、类图的成员表都靠它:

```text
n=users;table;users;id:int (pk)%0Aname:text%0Acreated_at:timestamp;r0c0
n=user;class;User;id:int%0Aname:string%0Agreet(): void;r0c0
```

**ERD** 和 **class** 的每一行画成一条:名字靠左,类型靠右(等宽字体,一列类型
上下对齐),前面带键标记。分界取**括号外**的第一个冒号,所以方法带着自己的参数 ——
`charge(amount: Money): Result` 是成员 `charge(amount: Money)`,类型 `Result`。

| 写法 | 读作 |
|---|---|
| `id:int (pk)` | 名字 `id`,类型 `int`,主键 |
| `user_id:int (fk)` | 名字 `user_id`,类型 `int`,外键 |
| `slug:text (uk)` | 名字 `slug`,类型 `text`,唯一键 |
| `greet(): void` | 名字 `greet()`,类型 `void` |
| `+ id:int` | 开头的 `+` 是 UML 可见性标记(URL 里写 `%2B`) |

## 6. 转义

分隔符 `;` `=` `,` `:` `/` `@` `-` 保持原样。其余在 URL 里有意义的字符都要转义:

| 字符 | 写成 | 为什么 |
|---|---|---|
| 空格 | `%20` | 查询串里 `+` 也是空格,所以别写裸的 `+` |
| `+` | `%2B` | 这才是真的加号 |
| `&` | `%26` | 它是参数分隔符 |
| `#` | `%23` | 它是 fragment 的开头 |
| `<` `>` | `%3C` `%3E` | 写 `<<include>>` 时用 |
| 换行 | `%0A` | 写多行文字时用 |

## 7. 画图开关

| 参数 | 做什么 |
|---|---|
| `legend=0` | 不要底部图例 |
| `paper=1` | 底下铺一层很淡的方格 —— 大图有了「纸」垫着,不那么空 |
| `title=` | 图的标题 |
| `w=` / `h=` | 最小宽 / 高 |
| `v=N` | 钉住版本 |

## 8. 另外几种图,另外的语法

有三个路径不用属性表,因为它们有自己的标准:

| 路径 | 参数 | 收什么 |
|---|---|---|
| `/draw/mindmap` | `n=` | 一条路径:`n=根/子/孙`,每个分支一条 |
| `/draw/mermaid` | `m=` | Mermaid 流程图源码 |
| `/draw/gantt`、`/draw/gantt2` | `m=` | Mermaid Gantt 源码 |

## 9. 坑

- **边只能指向存在的节点。** id 写错是 400,不会悄悄少画一条线。
- **一个节点一条 `n=`。** id 重复是 400。
- **分组只列 id,不替你建节点。**
- **位置是格子,不是像素** —— 除非你写 `p` 那种写法。
- **类型词汇按图种走。** `process` 在架构图里不是类型;`fe` 在数据流里也不是。
- **标签比两个节点之间的空档还宽时,引擎会把那一列撑开** —— 给标签腾地方,
  而不是让标签压在节点上。
