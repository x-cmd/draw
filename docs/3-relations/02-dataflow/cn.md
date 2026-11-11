---
x-title: 数据流图 —— 数据往哪走
x-desc: 'x-cmd/draw 数据流图(`/draw/dataflow`)。节点是处理、存储、外部源汇,边上标着数据。和架构图同一套 URL 模型:`n=` / `e=` / `b=`。'
x-sidebar: draw 数据流图
x-keywords: data flow diagram, 数据流图, draw, svg, 流水线, etl
x-json-ld:
  '@context': https://schema.org
  '@graph':
    - '@type': TechArticle
      headline: 'draw 数据流图'
      inLanguage: 'cn'
      about: 'x-cmd/draw 02-dataflow'
---

# 数据流图 —— 数据往哪走

四种节点、一种边,边上写着数据。和架构图同一套 URL 模型:布局也在 URL 里。

```text
https://x-cmd.com/draw/dataflow?n=url;source;the%20URL;;r0c0&n=parse;process;parse%20the%20spec;specs/;r1c0&n=skin;process;pick%20a%20skin;styles/;r2c0&n=draw;process;draw%20the%20SVG;render/;r3c0&n=out;source;SVG%20%2B%20metadata;;r4c0&n=store;store;short%20link;charts/%20in%20a%20Git%20repo;r2c1&e=url;parse;query%20string&e=parse;skin&e=skin;draw&e=draw;out;image/svg%2Bxml&e=parse;store;POST%20/draw
```

[![数据流](https://x-cmd.com/draw/dataflow?n=url;source;the%20URL;;r0c0&n=parse;process;parse%20the%20spec;specs/;r1c0&n=skin;process;pick%20a%20skin;styles/;r2c0&n=draw;process;draw%20the%20SVG;render/;r3c0&n=out;source;SVG%20%2B%20metadata;;r4c0&n=store;store;short%20link;charts/%20in%20a%20Git%20repo;r2c1&e=url;parse;query%20string&e=parse;skin&e=skin;draw&e=draw;out;image/svg%2Bxml&e=parse;store;POST%20/draw)](https://x-cmd.com/draw/explore/dataflow?n=url;source;the%20URL;;r0c0&n=parse;process;parse%20the%20spec;specs/;r1c0&n=skin;process;pick%20a%20skin;styles/;r2c0&n=draw;process;draw%20the%20SVG;render/;r3c0&n=out;source;SVG%20%2B%20metadata;;r4c0&n=store;store;short%20link;charts/%20in%20a%20Git%20repo;r2c1&e=url;parse;query%20string&e=parse;skin&e=skin;draw&e=draw;out;image/svg%2Bxml&e=parse;store;POST%20/draw)

这张画的就是 draw 自己的管线:URL 进来 → 解析 → 挑皮肤 → 出 SVG;
另一条路存成短链。

## 一、参数

| 参数 | 含义 | 默认 |
|---|---|---|
| `n=` | 节点:`id;类型;标签[;副标][;位置]` | — |
| `e=` | 一条流:`起点;终点[;文字]` | — |
| `b=` | 一组:`名称;id id …` | — |
| `title=` | 图标题 | — |
| `w=` / `h=` | 画布尺寸 | 自然尺寸 |

## 二、词汇

| 类型 | 是什么 | 形状 |
|---|---|---|
| `process` | 处理数据的东西 | 方盒 |
| `store` | 数据落下来的地方 | 圆柱 |
| `source` | 数据进来的地方 | 胶囊 |
| `sink` | 数据出去的地方 | 胶囊 |

底部图例按类型计数,和架构图一个样式。

## 三、踩坑

- **类型只能是那四种** —— 别的会 400,报错里会列出来。
- **不给位置的节点引擎会自己排** —— 按行排,最多十二列。想放哪就写位置(`r0c1`)。
- **数据名写在边上**(`e=parse;store;write parquet`)—— 边上那句话,才是「数据流」
  而不是一条普通依赖。

