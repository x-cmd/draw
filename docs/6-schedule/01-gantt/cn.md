---
x-title: 甘特图 —— 几行字写完一份排期
x-desc: 'x-cmd/draw 甘特图速查(`/draw/gantt`)。排期用文本写:分段、任务、时长、依赖。参数:`m=` 甘特源码,`scale=`(day/week/month),`t=`,`title=`,`w=/h=`。'
x-sidebar: draw 甘特图
x-keywords: 甘特图, draw, svg, 项目排期, 路线图
x-json-ld:
  '@context': https://schema.org
  '@graph':
    - '@type': TechArticle
      headline: 'draw 甘特图'
      inLanguage: 'cn'
      about: 'x-cmd/draw 01-gantt'
---

# 甘特图 —— 几行字写完一份排期

> 本页还是草稿:下面的例子是真的可用,完整说明待补。

排期用文本写:分段、任务、时长、依赖。

```text
https://x-cmd.com/draw/gantt?m=dateFormat%20YYYY-MM-DD%0A%20%20section%20Dev%0A%20%20Design%20%3Adone%2C%20a1%2C%202026-11-01%2C%203d%0A%20%20Build%20%3Aactive%2C%20a2%2C%20after%20a1%2C%205d%0A%20%20Ship%20%3Amilestone%2C%20m1%2C%202026-11-10%2C%200d%0A%20%20section%20QA%0A%20%20Regression%20%3Acrit%2C%20b1%2C%20after%20a2%2C%203d&title=Sprint%20plan&w=560
```

[![迭代计划](https://x-cmd.com/draw/gantt?m=dateFormat%20YYYY-MM-DD%0A%20%20section%20Dev%0A%20%20Design%20%3Adone%2C%20a1%2C%202026-11-01%2C%203d%0A%20%20Build%20%3Aactive%2C%20a2%2C%20after%20a1%2C%205d%0A%20%20Ship%20%3Amilestone%2C%20m1%2C%202026-11-10%2C%200d%0A%20%20section%20QA%0A%20%20Regression%20%3Acrit%2C%20b1%2C%20after%20a2%2C%203d&title=Sprint%20plan&w=560)](https://x-cmd.com/draw/explore/gantt?m=dateFormat%20YYYY-MM-DD%0A%20%20section%20Dev%0A%20%20Design%20%3Adone%2C%20a1%2C%202026-11-01%2C%203d%0A%20%20Build%20%3Aactive%2C%20a2%2C%20after%20a1%2C%205d%0A%20%20Ship%20%3Amilestone%2C%20m1%2C%202026-11-10%2C%200d%0A%20%20section%20QA%0A%20%20Regression%20%3Acrit%2C%20b1%2C%20after%20a2%2C%203d&title=Sprint%20plan&w=560)

## 一、参数

| 参数 | 含义 | 默认 |
| --- | --- | --- |
| `m=` | 甘特源码 —— `dateFormat …`,然后 `section …`,一行一个任务 | — |
| `scale=` | 时间轴:`day`、`week`、`month` | 自动 |
| `t=` | 皮肤(配色族) | — |
| `title=` | 图标题 | — |
| `w=` / `h=` | 最小宽 / 高 | 自然尺寸 |

任务行是 `名称 :状态, id, 开始, 时长` —— 状态是 `done`、`active`、`crit` 或
`milestone`,开始可以写 `after <id>`。

## 二、踩坑

- **源码要 URL 编码后放进 `m=`** —— 换行变 `%0A`、空格变 `%20`;
  任务名里没编码的 `&` 或 `,` 会让解析断掉。
- **任务 id 不能重复** —— `after <id>` 指的是前面定义过的任务。

