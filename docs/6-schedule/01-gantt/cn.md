---
x-title: 甘特图 —— 几行字写完一份排期
x-desc: 'x-cmd/draw 甘特图(`/draw/gantt`)。排期用文本写:分段、任务、时长、依赖。参数:`m=` 源码,`scale=`(day/week/month),`t=`,`title=`,`w=/h=`。'
x-sidebar: draw 甘特图
x-keywords: 甘特图, draw, svg, 项目排期, 迭代计划, 里程碑
x-json-ld:
  '@context': https://schema.org
  '@graph':
    - '@type': TechArticle
      headline: 'draw 甘特图'
      inLanguage: 'cn'
      about: 'x-cmd/draw 01-gantt'
---

# 甘特图 —— 几行字写完一份排期

排期用文本写:分段、任务、时长、依赖,引擎画成图。

## 示例(URL 即所得,点击图片进入交互页)

### 迭代计划

```text
https://x-cmd.com/draw/gantt?m=dateFormat%20YYYY-MM-DD%0A%20%20section%20Dev%0A%20%20Design%20%3Adone%2C%20a1%2C%202026-11-01%2C%203d%0A%20%20Build%20%3Aactive%2C%20a2%2C%202026-11-04%2C%205d%0A%20%20Ship%20%3Amilestone%2C%20m1%2C%202026-11-10%2C%200d%0A%20%20section%20QA%0A%20%20Regression%20%3Acrit%2C%20b1%2C%202026-11-09%2C%203d&title=Sprint%20plan&w=560
```

[![迭代计划](https://x-cmd.com/draw/gantt?m=dateFormat%20YYYY-MM-DD%0A%20%20section%20Dev%0A%20%20Design%20%3Adone%2C%20a1%2C%202026-11-01%2C%203d%0A%20%20Build%20%3Aactive%2C%20a2%2C%202026-11-04%2C%205d%0A%20%20Ship%20%3Amilestone%2C%20m1%2C%202026-11-10%2C%200d%0A%20%20section%20QA%0A%20%20Regression%20%3Acrit%2C%20b1%2C%202026-11-09%2C%203d&title=Sprint%20plan&w=560)](https://x-cmd.com/draw/explore/gantt?m=dateFormat%20YYYY-MM-DD%0A%20%20section%20Dev%0A%20%20Design%20%3Adone%2C%20a1%2C%202026-11-01%2C%203d%0A%20%20Build%20%3Aactive%2C%20a2%2C%202026-11-04%2C%205d%0A%20%20Ship%20%3Amilestone%2C%20m1%2C%202026-11-10%2C%200d%0A%20%20section%20QA%0A%20%20Regression%20%3Acrit%2C%20b1%2C%202026-11-09%2C%203d&title=Sprint%20plan&w=560)

`Design` 已完成,`Build` 进行中且在 `a1` 之后开始,`Ship` 是里程碑,
`Regression` 在关键路径上。

### 跨两个分���的上线计划

```text
https://x-cmd.com/draw/gantt?m=dateFormat%20YYYY-MM-DD%0A%20%20section%20Design%0A%20%20Wireframes%20%3Adone%2C%20w1%2C%202026-09-01%2C%2010d%0A%20%20Visual%20design%20%3Acrit%2C%20w2%2C%202026-09-15%2C%2012d%0A%20%20section%20Build%0A%20%20Backend%20%3Aactive%2C%20b1%2C%202026-10-01%2C%2020d%0A%20%20Frontend%20%3Ab2%2C%202026-10-21%2C%2015d%0A%20%20Launch%20%3Amilestone%2C%20m1%2C%202026-11-20%2C%200d&title=Launch%20plan&w=560
```

[![上线计划](https://x-cmd.com/draw/gantt?m=dateFormat%20YYYY-MM-DD%0A%20%20section%20Design%0A%20%20Wireframes%20%3Adone%2C%20w1%2C%202026-09-01%2C%2010d%0A%20%20Visual%20design%20%3Acrit%2C%20w2%2C%202026-09-15%2C%2012d%0A%20%20section%20Build%0A%20%20Backend%20%3Aactive%2C%20b1%2C%202026-10-01%2C%2020d%0A%20%20Frontend%20%3Ab2%2C%202026-10-21%2C%2015d%0A%20%20Launch%20%3Amilestone%2C%20m1%2C%202026-11-20%2C%200d&title=Launch%20plan&w=560)](https://x-cmd.com/draw/explore/gantt?m=dateFormat%20YYYY-MM-DD%0A%20%20section%20Design%0A%20%20Wireframes%20%3Adone%2C%20w1%2C%202026-09-01%2C%2010d%0A%20%20Visual%20design%20%3Acrit%2C%20w2%2C%202026-09-15%2C%2012d%0A%20%20section%20Build%0A%20%20Backend%20%3Aactive%2C%20b1%2C%202026-10-01%2C%2020d%0A%20%20Frontend%20%3Ab2%2C%202026-10-21%2C%2015d%0A%20%20Launch%20%3Amilestone%2C%20m1%2C%202026-11-20%2C%200d&title=Launch%20plan&w=560)

## 一、参数

| 参数 | 含义 | 默认 |
|---|---|---|
| `m=` | 甘特源码 | — |
| `scale=` | 时间轴:`day`、`week`、`month` | 自动 |
| `t=` | 皮肤(配色族) | — |
| `title=` | 图标题 | — |
| `w=` / `h=` | 最小宽 / 高 | 自然尺寸 |
| `v=` | 固定输出版本 | 最新 |

## 二、源码格式

```
dateFormat YYYY-MM-DD
  section Dev
  Design :done, a1, 2026-11-01, 3d
  Build :active, a2, 2026-11-04, 5d
  Ship :milestone, m1, 2026-11-10, 0d
  section QA
  Regression :crit, b1, 2026-11-09, 3d
```

- **`dateFormat`** —— 只认 `YYYY-MM-DD`。写了别的格式会被忽略;日期本身仍必须是 `YYYY-MM-DD`。
- **`section <名字>`** —— 图上的一条任务带。
- **任务行** —— `名称 :状态, id, 开始, 时长`。冒号后的部分除任务名外都可省。

| 部分 | 含义 |
|---|---|
| 状态 | `done`、`active`、`crit`(或 `critical`)、`milestone` |
| id | 别的任务依赖它时用的名字 |
| 开始 | 日期(`2026-11-01`),或 `after <id>` 表示「等那个任务结束再开始」 |
| 时长 | `3d`、`2w`、`8h` —— 也可以直接写结束日期 |

状态和 id 的先后顺序随意;冒号后任何位置还能加一个完成百分比:

```
Wireframes :done, w1, 2026-09-01, 10d, 100%
Backend :active, b1, 2026-10-01, 20d, 40%
```

## 三、踩坑

- **源码要 URL 编码后放进 `m=`** —— 换行变 `%0A`、空格变 `%20`;
  任务名里没编码的 `&` 或 `,` 会让解析断掉。
- **任务 id 不能重复** —— `after <id>` 指的是前面定义过的任务。
- **`milestone` 长度是 0** —— 写 `0d`。
- **日期只认 `YYYY-MM-DD`** —— 别的写法会 400,不会帮你猜。
- **没有 id 的任务没法被依赖** —— 它照样画得出来,只是没人能指向它。
- **依赖来的任务自己也得写长度** —— `after <id>` 只定开始,结束日期也要写
  (`a2, 2026-11-04, 5d`),条子才是你要的长度。

## 四、相关

同一套引擎也能渲染交给[流程图入口](../../5-architecture/03-mermaid)的 Mermaid `gantt` 源码。

