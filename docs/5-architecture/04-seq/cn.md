---
x-title: 时序图 —— 谁跟谁说话,按什么顺序
x-desc: 'x-cmd/draw 时序图(`/draw/seq`)。参与方排在最上面,一条消息一行,时间往下走 —— `e=` 的先后就是消息的先后。参数:`n=` 参与方,`e=` 消息(`起点;终点[;文字][;dash]`),`title=`,`w=/h=`。'
x-sidebar: draw 时序图
x-keywords: 时序图, draw, svg, uml, 交互图, 生命线
x-json-ld:
  '@context': https://schema.org
  '@graph':
    - '@type': TechArticle
      headline: 'draw 时序图'
      inLanguage: 'cn'
      about: 'x-cmd/draw 04-seq'
---

# 时序图 —— 谁跟谁说话,按什么顺序

真正的时序图:参与方排在最上面,每条消息落一行,时间往下走。
**URL 里 `e=` 的先后就是消息的先后** —— 按发生的顺序写。

```text
https://x-cmd.com/draw/draw/seq?n=app%3Bfe%3B%E4%BD%A0%E7%9A%84%E5%BA%94%E7%94%A8%3B%3Br0c0&n=worker;be;Worker;;r0c1&n=specs%3Bbe%3Bspecs%2F%3B%E8%A7%A3%E6%9E%90%20%2B%20%E6%A0%A1%E9%AA%8C%3Br0c2&n=render%3Bbe%3Brender%2F%3B%E7%BB%98%E5%88%B6%20SVG%3Br0c3&e=app;worker;GET%20/draw%3Ftype=pie&e=worker%3Bspecs%3B%E8%A7%A3%E6%9E%90%20spec&e=specs;worker;spec;dash&e=worker%3Brender%3B%E7%BB%98%E5%88%B6&e=render;worker;SVG;dash&e=worker%3Bapp%3B200%20%E5%90%AB%E5%85%83%E6%95%B0%E6%8D%AE%3Bdash&title=%E4%B8%80%E6%AC%A1%E8%AF%B7%E6%B1%82
```

[![一次请求](https://x-cmd.com/draw/draw/seq?n=app%3Bfe%3B%E4%BD%A0%E7%9A%84%E5%BA%94%E7%94%A8%3B%3Br0c0&n=worker;be;Worker;;r0c1&n=specs%3Bbe%3Bspecs%2F%3B%E8%A7%A3%E6%9E%90%20%2B%20%E6%A0%A1%E9%AA%8C%3Br0c2&n=render%3Bbe%3Brender%2F%3B%E7%BB%98%E5%88%B6%20SVG%3Br0c3&e=app;worker;GET%20/draw%3Ftype=pie&e=worker%3Bspecs%3B%E8%A7%A3%E6%9E%90%20spec&e=specs;worker;spec;dash&e=worker%3Brender%3B%E7%BB%98%E5%88%B6&e=render;worker;SVG;dash&e=worker%3Bapp%3B200%20%E5%90%AB%E5%85%83%E6%95%B0%E6%8D%AE%3Bdash&title=%E4%B8%80%E6%AC%A1%E8%AF%B7%E6%B1%82)](https://x-cmd.com/draw/explore/seq?n=app;fe;Your%20app;;r0c0&n=worker;be;Worker;;r0c1&n=specs;be;specs/;parse%20%2B%20validate;r0c2&n=render;be;render/;draw%20the%20SVG;r0c3&e=app;worker;GET%20/draw%3Ftype=pie&e=worker;specs;parse%20the%20spec&e=specs;worker;spec;dash&e=worker;render;draw&e=render;worker;SVG;dash&e=worker;app;200%20with%20metadata;dash&title=One%20request)

## 一、参数

| 参数 | 含义 | 默认 |
|---|---|---|
| `n=` | 一个参与方:`id;类型;标签[;副标][;位置]` —— 每个参与方一条 | — |
| `e=` | 一条消息:`起点;终点[;文字][;dash]` —— 按发生的顺序重复 | — |
| `f=` | 一个分支:`种类;守卫;起;止` —— 消息下标,含两端 | — |
| `title=` | 图标题 | — |
| `w=` / `h=` | 画布尺寸 | 自然尺寸 |
| `v=` | 固定输出版本 | 最新 |

参与方的类型和别处一样 —— `fe`(你的程序)、`be`(服务)、`db`(存储)、`cloud`、`ext`、
`sec`、`bus`、`svc` —— 决定标题盒的颜色。

## 二、怎么画的

- **参与方**排一行;`pos`(`r0c0`、`r0c1`……)说它在第几列。
- **生命线**从每个参与方盒子往下拖。
- **一条消息**是从一条生命线到另一条的箭头,自己占一行。
- **回信**是同样的箭头,画成虚线 —— 最后一个字段写 `dash`:
  `e=worker;app;200 with metadata;dash`。
- **激活条**(生命线上那根细条)标出这个参与方在忙的那一段:从它收到的消息
  到它下一次发消息。

## 三、分支框 —— alt / else / opt / loop

一个分支就是罩住它那几条消息的框。`f=种类;守卫;起;止` 说明罩的是哪几条 ——
**消息下标就是 `e=` 的顺序**,从 0 数起。

```text
f=alt;ok;0;2
f=else;overloaded;3;4
```

- **`alt`** 后面跟的 **`else`** 共用一个框,中间一条虚线分开两支 —— UML 里
  「这几条里发生一条」的说法。
- **`opt`**(可选)、**`loop`**、**`par`**、**`break`** 就是单独的框。
- 种类写第一个字段,所以框上读作 `alt [ok]`。

## 四、踩坑

- **URL 顺序就是时间顺序。** 引擎不排序:第一条消息在第一行,第二条在第二行。
- **文字里的 `+` 要编码**(`%2B`)—— query 里裸着的 `+` 会被当成空格。
- **消息指向不存在的参与方会 400**,不是少画一根箭头。
- **参与方要写 `pos`**(`r0c0`、`r0c1`……),否则会和别的叠在一起。
- **分支框的下标必须存在** —— 三条消息上写 `f=alt;ok;0;9` 会 400,不会悄悄截断。

