---
x-title: 类图 —— 有哪些类型,怎么搭在一起
x-desc: 'x-cmd/draw 类图(`/draw/class`)。类、接口、枚举,成员写在节点里,一行一个。和架构图同一套 URL 模型。'
x-sidebar: draw 类图
x-keywords: class diagram, 类图, draw, svg, uml, 类型
x-json-ld:
  '@context': https://schema.org
  '@graph':
    - '@type': TechArticle
      headline: 'draw 类图'
      inLanguage: 'cn'
      about: 'x-cmd/draw 06-class'
---

# 类图 —— 有哪些类型,怎么搭在一起

一个库对外的类型,按你写设计文档的样子画:成员在盒子里,关系在箭头上。

```text
https://x-cmd.com/draw/class?n=draw;class;draw;spec:%20object%250Areturns:%20DrawResult;r0c0&n=arch;class;renderArch;url:%20URL%250Areturns:%20DrawResult;r1c0&n=result;class;DrawResult;svg:%20string%250Aversion:%20number%250AcacheControl:%20string;r1c1&e=draw;result&e=arch;result
```

[![类图](https://x-cmd.com/draw/class?n=draw;class;draw;spec:%20object%250Areturns:%20DrawResult;r0c0&n=arch;class;renderArch;url:%20URL%250Areturns:%20DrawResult;r1c0&n=result;class;DrawResult;svg:%20string%250Aversion:%20number%250AcacheControl:%20string;r1c1&e=draw;result&e=arch;result)](https://x-cmd.com/draw/explore/class?n=draw;class;draw;spec:%20object%250Areturns:%20DrawResult;r0c0&n=arch;class;renderArch;url:%20URL%250Areturns:%20DrawResult;r1c0&n=result;class;DrawResult;svg:%20string%250Aversion:%20number%250AcacheControl:%20string;r1c1&e=draw;result&e=arch;result)

这是 draw 自己的入口:`draw()`、各个图种的渲染器,以及它们共同返回的
`DrawResult`。

## 一、参数

| 参数 | 含义 | 默认 |
|---|---|---|
| `n=` | 一个类:`id;类型;类名;成员表;位置` | — |
| `e=` | 一条关系:`起点;终点[;文字]` | — |
| `b=` | 一组:`名称;id id …` | — |
| `title=` | 图标题 | — |
| `w=` / `h=` | 画布尺寸 | 自然尺寸 |

## 二、成员表怎么写

成员表是节点的第四个字段,**一行一个,之间用 `%0A`**:

```
n=draw;class;draw;spec: object%0Areturns: DrawResult;r0c0
```

两行:`spec: object` 和 `returns: DrawResult`。方法就按你写代码的样子写 ——
`greet(): void`。

每一行画成一条**成员行**:名字靠左,类型靠右(等宽字体,一列类型上下对齐)。
分界取的是**括号外**的第一个冒号,所以方法带着自己的参数:
`charge(amount: Money): Result` 是成员 `charge(amount: Money)`,类型 `Result`。

**可见性** —— 行首写 `+`、`-` 或 `#`,draw 就在前面画上这个标记。
真的加号要写成 `%2B`(查询串里裸的 `+` 是空格)。

## 三、词汇

| 类型 | 是什么 |
|---|---|
| `class` | 类 |
| `iface` | 接口 |
| `enum` | 枚举 |

## 四、踩坑

- **成员表是第四个字段** —— `id;类型;类名;成员表;位置`。
- **`%0A` 是换行** —— 写成空格,整个列表挤一行。
- **URL 里的 `+` 是空格** —— 可见性标记 `+` 得写成 `%2B`。
- **关系是边,文字你自己写** —— `e=user;repo;implements`。draw 不知道你语言里的关键字。

