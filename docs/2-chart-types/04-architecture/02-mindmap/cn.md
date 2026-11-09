---
x-title: 思维导图 —— 一串路径,四种形态
x-desc: 'x-cmd/draw 思维导图速查(`/draw/mindmap`)。树用斜杠路径写,每个叶子一条,引擎自己推父节点并排版。参数:`n=` 路径(`根/枝/叶`),`style=`(organic/tree/radial/bubble),`t=`,`title=`,`w=/h=`。'
x-sidebar: draw 思维导图
x-keywords: 思维导图, draw, svg, 树状图, 路线图
x-json-ld:
  '@context': https://schema.org
  '@graph':
    - '@type': TechArticle
      headline: 'draw 思维导图'
      inLanguage: 'cn'
      about: 'x-cmd/draw 02-mindmap'
---

# 思维导图 —— 一串路径,四种形态

> 本页还是草稿:下面的例子是真的可用,完整说明待补。

树用斜杠路径写。叶子写一条,引擎自己推出公共父节点并排版。

```text
https://x-cmd.com/draw/mindmap?n=draw/Charts/Pie&n=draw/Charts/Bar%20and%20Line&n=draw/Charts/Sankey&n=draw/Arch/Archmap&n=draw/Arch/Mindmap&n=draw/Ecosystem/Skill&n=draw/Ecosystem/Data%20link&w=560
```

[![draw 功能地图](https://x-cmd.com/draw/mindmap?n=draw/Charts/Pie&n=draw/Charts/Bar%20and%20Line&n=draw/Charts/Sankey&n=draw/Arch/Archmap&n=draw/Arch/Mindmap&n=draw/Ecosystem/Skill&n=draw/Ecosystem/Data%20link&w=560)](https://x-cmd.com/draw/explore/mindmap?n=draw/Charts/Pie&n=draw/Charts/Bar%20and%20Line&n=draw/Charts/Sankey&n=draw/Arch/Archmap&n=draw/Arch/Mindmap&n=draw/Ecosystem/Skill&n=draw/Ecosystem/Data%20link&w=560)

同一棵树换个形态:

```text
https://x-cmd.com/draw/mindmap?n=Launch/Legal/Privacy%20check&n=Launch/Eng/Tests&n=Launch/Eng/Perf&n=Launch/Docs/Changelog&n=Launch/Docs/Post%20copy&style=tree&title=Launch%20checklist&w=560
```

[![上线检查清单](https://x-cmd.com/draw/mindmap?n=Launch/Legal/Privacy%20check&n=Launch/Eng/Tests&n=Launch/Eng/Perf&n=Launch/Docs/Changelog&n=Launch/Docs/Post%20copy&style=tree&title=Launch%20checklist&w=560)](https://x-cmd.com/draw/explore/mindmap?n=Launch/Legal/Privacy%20check&n=Launch/Eng/Tests&n=Launch/Eng/Perf&n=Launch/Docs/Changelog&n=Launch/Docs/Post%20copy&style=tree&title=Launch%20checklist&w=560)

## 一、参数

| 参数 | 含义 | 默认 |
| --- | --- | --- |
| `n=` | 一条路径一个节点:`根/枝/叶` —— 每个叶子写一次 | — |
| `style=` | 形态:`organic`、`tree`、`radial`、`bubble` | `organic` |
| `t=` | 皮肤(配色族) | — |
| `title=` | 图标题 | — |
| `w=` / `h=` | 最小宽 / 高 | 自然尺寸 |

## 二、踩坑

- **根节点至少要有一条枝** —— 只有一层路径会 400,树至少要两层。
- **路径就是全部输入**:和别的路径没有公共前缀的节点会变成第二个根,这通常不是本意。

