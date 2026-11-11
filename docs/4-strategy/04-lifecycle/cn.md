---
x-title: 生命周期图 —— 有哪些状态,怎么流转
x-desc: 'x-cmd/draw 生命周期图(`/draw/lifecycle`)。状态、判断、终态,每条边写明什么触发了这次流转。和架构图同一套 URL 模型。'
x-sidebar: draw 生命周期图
x-keywords: lifecycle diagram, 生命周期图, 状态机, draw, svg
x-json-ld:
  '@context': https://schema.org
  '@graph':
    - '@type': TechArticle
      headline: 'draw 生命周期图'
      inLanguage: 'cn'
      about: 'x-cmd/draw 04-lifecycle'
---

# 生命周期图 —— 有哪些状态,怎么流转

状态机按你画草图的样子画:状态、中间的判断,每根箭头上写着什么触发了这次流转。

```text
https://x-cmd.com/draw/lifecycle?n=open;state;Open;;r0c0&n=review;state;In%20review;;r1c0&n=ci;decision;CI%20green%3F;;r1c1&n=merged;terminal;Merged;;r2c0&n=closed;terminal;Closed;;r2c2&e=open;review;opened&e=review;ci&e=ci;merged;pass&e=ci;closed;fail&e=closed;open;reopen
```

[![生命周期](https://x-cmd.com/draw/lifecycle?n=open;state;Open;;r0c0&n=review;state;In%20review;;r1c0&n=ci;decision;CI%20green%3F;;r1c1&n=merged;terminal;Merged;;r2c0&n=closed;terminal;Closed;;r2c2&e=open;review;opened&e=review;ci&e=ci;merged;pass&e=ci;closed;fail&e=closed;open;reopen)](https://x-cmd.com/draw/explore/lifecycle?n=open;state;Open;;r0c0&n=review;state;In%20review;;r1c0&n=ci;decision;CI%20green%3F;;r1c1&n=merged;terminal;Merged;;r2c0&n=closed;terminal;Closed;;r2c2&e=open;review;opened&e=review;ci&e=ci;merged;pass&e=ci;closed;fail&e=closed;open;reopen)

这张画的是一个 PR 的一生:opened → in review → CI 说了算。

## 一、参数

| 参数 | 含义 | 默认 |
|---|---|---|
| `n=` | 节点:`id;类型;标签[;副标][;位置]` | — |
| `e=` | 一次流转:`起点;终点[;触发条件]` | — |
| `b=` | 一组:`名称;id id …` | — |
| `title=` | 图标题 | — |
| `w=` / `h=` | 画布尺寸 | 自然尺寸 |

## 二、词汇

| 类型 | 是什么 | 形状 |
|---|---|---|
| `state` | 它可以处在的一个状态 | 胶囊 |
| `decision` | 分叉的地方 | 菱形 |
| `terminal` | 开始或结束 | 胶囊 |

箭头上的字是触发条件 —— `payment ok`、`fail`、`reopen`。写了它,这张图才是
状态机,而不是流程图。

## 三、踩坑

- **类型只能是那三种** —— `state`、`decision`、`terminal`。
- **触发条件写在边上** —— 不写,读者就不知道这次流转是怎么来的。
- **可以有环** —— `e=closed;open;reopen` 会画一条回去的线,走线会自动绕开盒子。

