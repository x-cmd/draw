---
x-title: GitHub —— issue、PR 与 release
x-desc: 'x-cmd/draw 场景用例:GitHub 的 issue、pull request 与 release。值得贴的图:用例图、时序图、一次改动的代码构成、PR 碰到的文件、代码库的架构与关键文件夹。'
x-sidebar: draw 场景用例 github
x-keywords: github issue, pull request, release 说明, draw 场景用例, 从代码出架构图
x-json-ld:
  '@context': https://schema.org
  '@graph':
    - '@type': TechArticle
      headline: 'draw 场景用例 github'
      inLanguage: 'cn'
      about: 'x-cmd/draw 01-github'
---

# GitHub —— issue、PR 与 release

没人爱看 star 数的图。读者在 issue、pull request、release 上真正想看的,
是这件事本身的样子:它做什么、改了什么、代码现在长什么样。

## 一个 issue —— 它应该怎么表现?

### 用例图

左边是参与者,里面是用例,系统本身用一个边界圈起来:

```text
https://x-cmd.com/draw/archmap?n=caller;ext;Your%20app;r0c0&n=uc1;be;Render%20a%20chart;r1c0&n=uc2;be;Store%20it%20as%20a%20short%20link;r1c1&n=uc3;be;Deploy%20it%20yourself;r1c2&e=caller;uc1&e=caller;uc2&e=caller;uc3&b=draw;uc1%20uc2%20uc3
```

[![用例图](https://x-cmd.com/draw/archmap?n=caller;ext;Your%20app;r0c0&n=uc1;be;Render%20a%20chart;r1c0&n=uc2;be;Store%20it%20as%20a%20short%20link;r1c1&n=uc3;be;Deploy%20it%20yourself;r1c2&e=caller;uc1&e=caller;uc2&e=caller;uc3&b=draw;uc1%20uc2%20uc3)](https://x-cmd.com/draw/explore/archmap?n=caller;ext;Your%20app;r0c0&n=uc1;be;Render%20a%20chart;r1c0&n=uc2;be;Store%20it%20as%20a%20short%20link;r1c1&n=uc3;be;Deploy%20it%20yourself;r1c2&e=caller;uc1&e=caller;uc2&e=caller;uc3&b=draw;uc1%20uc2%20uc3)

### 时序图

时间从左往右:方块是对象,箭头是消息。

```text
https://x-cmd.com/draw/mermaid?m=graph%20LR%0A%20%20App%5BYour%20app%5D%20--%3E%7CGET%20%2Fdraw%3Ftype%3Dpie%7C%20Edge%5BEdge%20worker%5D%0A%20%20Edge%20--%3E%7Cparse%20the%20spec%7C%20Spec%5Bspecs%2F%5D%0A%20%20Edge%20--%3E%7Crender%7C%20Render%5Brender%2F%5D%0A%20%20Render%20--%3E%7CSVG%7C%20Edge%0A%20%20Edge%20--%3E%7C200%20OK%7C%20App&w=560
```

[![时序图](https://x-cmd.com/draw/mermaid?m=graph%20LR%0A%20%20App%5BYour%20app%5D%20--%3E%7CGET%20%2Fdraw%3Ftype%3Dpie%7C%20Edge%5BEdge%20worker%5D%0A%20%20Edge%20--%3E%7Cparse%20the%20spec%7C%20Spec%5Bspecs%2F%5D%0A%20%20Edge%20--%3E%7Crender%7C%20Render%5Brender%2F%5D%0A%20%20Render%20--%3E%7CSVG%7C%20Edge%0A%20%20Edge%20--%3E%7C200%20OK%7C%20App&w=560)](https://x-cmd.com/draw/explore/mermaid?m=graph%20LR%0A%20%20App%5BYour%20app%5D%20--%3E%7CGET%20%2Fdraw%3Ftype%3Dpie%7C%20Edge%5BEdge%20worker%5D%0A%20%20Edge%20--%3E%7Cparse%20the%20spec%7C%20Spec%5Bspecs%2F%5D%0A%20%20Edge%20--%3E%7Crender%7C%20Render%5Brender%2F%5D%0A%20%20Render%20--%3E%7CSVG%7C%20Edge%0A%20%20Edge%20--%3E%7C200%20OK%7C%20App&w=560)

## 一个 PR —— 改了什么?

### 代码构成

把 tokei 跑在这次改动碰到的文件上,直接画出来:

```text
https://x-cmd.com/draw/tokei?d=%7B%22TypeScript%22%3A%7B%22code%22%3A4820%2C%22comments%22%3A1180%2C%22blanks%22%3A940%7D%2C%22JavaScript%22%3A%7B%22code%22%3A1687%2C%22comments%22%3A298%2C%22blanks%22%3A71%7D%2C%22Shell%22%3A%7B%22code%22%3A640%2C%22comments%22%3A120%2C%22blanks%22%3A88%7D%2C%22CSS%22%3A%7B%22code%22%3A210%2C%22comments%22%3A40%2C%22blanks%22%3A35%7D%2C%22Markdown%22%3A%7B%22code%22%3A180%2C%22comments%22%3A760%2C%22blanks%22%3A120%7D%2C%22JSON%22%3A%7B%22code%22%3A95%2C%22comments%22%3A0%2C%22blanks%22%3A12%7D%7D&title=Code%20composition%20%C2%B7%20v0.3.0&w=760&h=440
```

[![代码构成](https://x-cmd.com/draw/tokei?d=%7B%22TypeScript%22%3A%7B%22code%22%3A4820%2C%22comments%22%3A1180%2C%22blanks%22%3A940%7D%2C%22JavaScript%22%3A%7B%22code%22%3A1687%2C%22comments%22%3A298%2C%22blanks%22%3A71%7D%2C%22Shell%22%3A%7B%22code%22%3A640%2C%22comments%22%3A120%2C%22blanks%22%3A88%7D%2C%22CSS%22%3A%7B%22code%22%3A210%2C%22comments%22%3A40%2C%22blanks%22%3A35%7D%2C%22Markdown%22%3A%7B%22code%22%3A180%2C%22comments%22%3A760%2C%22blanks%22%3A120%7D%2C%22JSON%22%3A%7B%22code%22%3A95%2C%22comments%22%3A0%2C%22blanks%22%3A12%7D%7D&title=Code%20composition%20%C2%B7%20v0.3.0&w=760&h=440)](https://x-cmd.com/draw/explore/tokei?d=%7B%22TypeScript%22%3A%7B%22code%22%3A4820%2C%22comments%22%3A1180%2C%22blanks%22%3A940%7D%2C%22JavaScript%22%3A%7B%22code%22%3A1687%2C%22comments%22%3A298%2C%22blanks%22%3A71%7D%2C%22Shell%22%3A%7B%22code%22%3A640%2C%22comments%22%3A120%2C%22blanks%22%3A88%7D%2C%22CSS%22%3A%7B%22code%22%3A210%2C%22comments%22%3A40%2C%22blanks%22%3A35%7D%2C%22Markdown%22%3A%7B%22code%22%3A180%2C%22comments%22%3A760%2C%22blanks%22%3A120%7D%2C%22JSON%22%3A%7B%22code%22%3A95%2C%22comments%22%3A0%2C%22blanks%22%3A12%7D%7D&title=Code%20composition%20%C2%B7%20v0.3.0&w=760&h=440)

柱子分成代码、注释、空行 —— 是 reviewer 真正想看的增量,不是整个仓库。

### 这次碰了哪些文件

```text
https://x-cmd.com/draw/mindmap?n=draw/src/render/tokei.ts&n=draw/src/handler.ts&n=draw/test/tokei.test.ts&n=draw/docs/2-data-charts/10-tokei/en.md&style=tree&title=Files%20changed%20in%20%2331&w=560
```

[![改动的文件](https://x-cmd.com/draw/mindmap?n=draw/src/render/tokei.ts&n=draw/src/handler.ts&n=draw/test/tokei.test.ts&n=draw/docs/2-data-charts/10-tokei/en.md&style=tree&title=Files%20changed%20in%20%2331&w=560)](https://x-cmd.com/draw/explore/mindmap?n=draw/src/render/tokei.ts&n=draw/src/handler.ts&n=draw/test/tokei.test.ts&n=draw/docs/2-data-charts/10-tokei/en.md&style=tree&title=Files%20changed%20in%20%2331&w=560)

## 一个 release —— 代码现在长什么样?

### 架构图

读一遍代码,把方块摆到格子上、点名连线:

```text
https://x-cmd.com/draw/archmap?n=edge;fe;Edge%20worker;r0c0&n=specs;be;specs/;r1c0&n=render;be;render/;r1c1&n=styles;be;styles/;r1c2&n=store;db;store.ts;r2c0&n=fonts;db;fonts;r2c1&n=geo;db;vendor%20geojson;r2c2&e=edge;specs&e=edge;render&e=edge;styles&e=render;store&e=render;fonts&e=render;geo&b=Draw%20core;specs%20render%20styles
```

[![架构图](https://x-cmd.com/draw/archmap?n=edge;fe;Edge%20worker;r0c0&n=specs;be;specs/;r1c0&n=render;be;render/;r1c1&n=styles;be;styles/;r1c2&n=store;db;store.ts;r2c0&n=fonts;db;fonts;r2c1&n=geo;db;vendor%20geojson;r2c2&e=edge;specs&e=edge;render&e=edge;styles&e=render;store&e=render;fonts&e=render;geo&b=Draw%20core;specs%20render%20styles)](https://x-cmd.com/draw/explore/archmap?n=edge;fe;Edge%20worker;r0c0&n=specs;be;specs/;r1c0&n=render;be;render/;r1c1&n=styles;be;styles/;r1c2&n=store;db;store.ts;r2c0&n=fonts;db;fonts;r2c1&n=geo;db;vendor%20geojson;r2c2&e=edge;specs&e=edge;render&e=edge;styles&e=render;store&e=render;fonts&e=render;geo&b=Draw%20core;specs%20render%20styles)

### 关键的文件夹

```text
https://x-cmd.com/draw/mindmap?n=draw/src/specs&n=draw/src/render&n=draw/src/styles&n=draw/src/store.ts&n=draw/src/handler.ts&n=draw/test&n=draw/docs&style=tree&title=Repository%20layout&w=560
```

[![仓库结构](https://x-cmd.com/draw/mindmap?n=draw/src/specs&n=draw/src/render&n=draw/src/styles&n=draw/src/store.ts&n=draw/src/handler.ts&n=draw/test&n=draw/docs&style=tree&title=Repository%20layout&w=560)](https://x-cmd.com/draw/explore/mindmap?n=draw/src/specs&n=draw/src/render&n=draw/src/styles&n=draw/src/store.ts&n=draw/src/handler.ts&n=draw/test&n=draw/docs&style=tree&title=Repository%20layout&w=560)

## 该用哪张图

| 问题 | 图种 | 参考 |
|---|---|---|
| 这东西是干什么的、给谁用?", "架构图", [archmap](../../5-architecture/01-archmap/cn.md) |
| 谁做什么?", "用例图", [archmap](../../5-architecture/01-archmap/cn.md) |
| 先发生什么、后发生什么?", "流程图", [mermaid](../../5-architecture/03-mermaid/cn.md) |
| 这个 PR 加了多少?", "代码构成图", [tokei](../../2-data-charts/10-tokei/cn.md) |
| 它碰了哪些文件?", "思维导图", [mindmap](../../5-architecture/02-mindmap/cn.md) |
| 这个项目整体长什么样?", "架构图", [archmap](../../5-architecture/01-archmap/cn.md) |
| 项目怎么分目录?", "思维导图", [mindmap](../../5-architecture/02-mindmap/cn.md) |

