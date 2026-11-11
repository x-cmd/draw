---
x-title: 甘特图 v2 —— 同一份源码,另一张脸
x-desc: 'x-cmd/draw 甘特图 v2(`/draw/gantt2`)。和 `/draw/gantt` 同一份 mermaid 甘特源码,换成架构图那张脸:条按状态着色、每行一个角标、底下有图例。'
x-sidebar: draw 甘特图 v2
x-keywords: gantt chart, 甘特图, draw, svg, 项目计划, 里程碑
x-json-ld:
  '@context': https://schema.org
  '@graph':
    - '@type': TechArticle
      headline: 'draw 甘特图 v2'
      inLanguage: 'cn'
      about: 'x-cmd/draw 02-gantt2'
---

# 甘特图 v2 —— 同一份源码,另一张脸

`/draw/gantt2` 的输入和 `/draw/gantt` **完全一样** —— `m=` 里放一段 Mermaid 甘特源码;
画出来的是架构图那张脸:条按状态着色、每行一个角标、底下有图例。

```text
https://x-cmd.com/draw/gantt2?m=dateFormat%20YYYY-MM-DD%0A%20%20section%20Dev%0A%20%20Design%20%3Adone%2C%20a1%2C%202026-11-01%2C%203d%0A%20%20Build%20%3Aactive%2C%20a2%2C%20after%20a1%2C%205d%0A%20%20Ship%20%3Amilestone%2C%20m1%2C%202026-11-10%2C%200d%0A%20%20section%20QA%0A%20%20Regression%20%3Acrit%2C%20b1%2C%20after%20a2%2C%203d&title=Sprint%20plan
```

[![甘特图 v2](https://x-cmd.com/draw/gantt2?m=dateFormat%20YYYY-MM-DD%0A%20%20section%20Dev%0A%20%20Design%20%3Adone%2C%20a1%2C%202026-11-01%2C%203d%0A%20%20Build%20%3Aactive%2C%20a2%2C%20after%20a1%2C%205d%0A%20%20Ship%20%3Amilestone%2C%20m1%2C%202026-11-10%2C%200d%0A%20%20section%20QA%0A%20%20Regression%20%3Acrit%2C%20b1%2C%20after%20a2%2C%203d&title=Sprint%20plan)](https://x-cmd.com/draw/explore/gantt2?m=dateFormat%20YYYY-MM-DD%0A%20%20section%20Dev%0A%20%20Design%20%3Adone%2C%20a1%2C%202026-11-01%2C%203d%0A%20%20Build%20%3Aactive%2C%20a2%2C%20after%20a1%2C%205d%0A%20%20Ship%20%3Amilestone%2C%20m1%2C%202026-11-10%2C%200d%0A%20%20section%20QA%0A%20%20Regression%20%3Acrit%2C%20b1%2C%20after%20a2%2C%203d&title=Sprint%20plan)

## 一、参数

| 参数 | 含义 | 默认 |
|---|---|---|
| `m=` | 甘特源码 | — |
| `scale=` | 时间轴:`day`、`week`、`month` | 自动 |
| `t=` | 皮肤(配色族) | — |
| `title=` | 图标题 | — |
| `w=` / `h=` | 画布尺寸 | 自然尺寸 |

## 二、和 `/draw/gantt` 差在哪

源码一样、任务一样、日期一样。变的是:

- **条按状态着色** —— done / active / critical,不再是中性灰,计划的状态一眼就看出来;
- **每行一个角标** —— `D` `A` `C` `M`,和架构图节点上的角标一个样式;
- **图例按状态计数**,和架构图的图例按类型计数一个道理。

老的 `/draw/gantt` 一行未动,还是它自己那张脸。

## 三、踩坑

- **源码和老端点一样** —— 在那边能用,这边就能用。
- **日期只认 `YYYY-MM-DD`** —— 和以前一条规则。
- **任务名里的 `+` 要编码**(`%2B`)—— query 里裸着的 `+` 是空格。

