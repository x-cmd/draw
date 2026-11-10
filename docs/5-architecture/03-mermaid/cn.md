---
x-title: 流程图 —— 写 Mermaid,出图
x-desc: 'x-cmd/draw 流程图(`/draw/mermaid`)。Mermaid 语法进,SVG 出。参数:`m=` 源码,`t=` 风格(mono/soft),`title=`,`w=/h=`。'
x-sidebar: draw 流程图
x-keywords: 流程图, mermaid, draw, svg, 决策树, 图示
x-json-ld:
  '@context': https://schema.org
  '@graph':
    - '@type': TechArticle
      headline: 'draw 流程图'
      inLanguage: 'cn'
      about: 'x-cmd/draw 03-mermaid'
---

# 流程图 —— 写 Mermaid,出图

用 Mermaid 语法写图,引擎直接画出来 —— 不用浏览器,不用截图,出来的还是和其他图一样的 SVG。

## 示例(URL 即所得,点击图片进入交互页)

### 登录决策流程

```text
https://x-cmd.com/draw/mermaid?m=graph%20TD%0A%20%20Login%5BUser%20login%5D%20--%3E%20MFA%7BMFA%20enabled%3F%7D%0A%20%20MFA%20--%3E%7Cyes%7C%20Code%5BSend%20code%5D%0A%20%20Code%20--%3E%20Verify%5BVerify%5D%0A%20%20Verify%20--%3E%7Cpass%7C%20Session%5BIssue%20session%5D%0A%20%20Verify%20--%3E%7Cfail%7C%20Lock%5BLock%20account%5D%0A%20%20MFA%20--%3E%7Cno%7C%20Session&t=mono&title=Login%20flow&w=560
```

[![登录流程](https://x-cmd.com/draw/mermaid?m=graph%20TD%0A%20%20Login%5BUser%20login%5D%20--%3E%20MFA%7BMFA%20enabled%3F%7D%0A%20%20MFA%20--%3E%7Cyes%7C%20Code%5BSend%20code%5D%0A%20%20Code%20--%3E%20Verify%5BVerify%5D%0A%20%20Verify%20--%3E%7Cpass%7C%20Session%5BIssue%20session%5D%0A%20%20Verify%20--%3E%7Cfail%7C%20Lock%5BLock%20account%5D%0A%20%20MFA%20--%3E%7Cno%7C%20Session&t=mono&title=Login%20flow&w=560)](https://x-cmd.com/draw/explore/mermaid?m=graph%20TD%0A%20%20Login%5BUser%20login%5D%20--%3E%20MFA%7BMFA%20enabled%3F%7D%0A%20%20MFA%20--%3E%7Cyes%7C%20Code%5BSend%20code%5D%0A%20%20Code%20--%3E%20Verify%5BVerify%5D%0A%20%20Verify%20--%3E%7Cpass%7C%20Session%5BIssue%20session%5D%0A%20%20Verify%20--%3E%7Cfail%7C%20Lock%5BLock%20account%5D%0A%20%20MFA%20--%3E%7Cno%7C%20Session&t=mono&title=Login%20flow&w=560)

`{MFA enabled?}` 是判断框,`[Send code]` 是普通框,`|yes|` 是线上的文字。

### 订单流程

```text
https://x-cmd.com/draw/mermaid?m=graph%20LR%0A%20%20Order%5BOrder%20placed%5D%20--%3E%20Pay%7BPayment%20ok%3F%7D%0A%20%20Pay%20--%3E%7Cyes%7C%20Pack%5BPack%20%26%20ship%5D%0A%20%20Pay%20--%3E%7Cno%7C%20Retry%5BRetry%20later%5D%0A%20%20Pack%20--%3E%20Track%5BTracking%20sent%5D&w=560
```

[![订单流程](https://x-cmd.com/draw/mermaid?m=graph%20LR%0A%20%20Order%5BOrder%20placed%5D%20--%3E%20Pay%7BPayment%20ok%3F%7D%0A%20%20Pay%20--%3E%7Cyes%7C%20Pack%5BPack%20%26%20ship%5D%0A%20%20Pay%20--%3E%7Cno%7C%20Retry%5BRetry%20later%5D%0A%20%20Pack%20--%3E%20Track%5BTracking%20sent%5D&w=560)](https://x-cmd.com/draw/explore/mermaid?m=graph%20LR%0A%20%20Order%5BOrder%20placed%5D%20--%3E%20Pay%7BPayment%20ok%3F%7D%0A%20%20Pay%20--%3E%7Cyes%7C%20Pack%5BPack%20%26%20ship%5D%0A%20%20Pay%20--%3E%7Cno%7C%20Retry%5BRetry%20later%5D%0A%20%20Pack%20--%3E%20Track%5BTracking%20sent%5D&w=560)

## 一、参数

| 参数 | 含义 | 默认 |
|---|---|---|
| `m=` | Mermaid 源码 | — |
| `t=` | 风格:`mono` 线框,`soft` 柔和 | — |
| `title=` | 图标题 | — |
| `w=` / `h=` | 最小宽 / 高 | 自然尺寸 |
| `v=` | 固定输出版本 | 最新 |

## 二、语法支持到哪

这是图形渲染器,不是完整的 Mermaid 运行时。支持的子集:

- `graph LR` / `graph TD` / `flowchart LR` / `flowchart TD` —— 方向。
  `LR` 从左到右,`TD` 从上到下;`RL`、`BT` 也行。
- **节点形状** —— `[方框]`、`{菱形}`、`([圆角])`、`[(圆柱)]`、
  `([胶囊])`、`[[子流程]]`。
- **连线** —— `-->` 带箭头,`---` 直线,`-.->` 虚线,`==>` 粗线;
  `-->|文字|` 在线��写字。
- **subgraph** —— `subgraph 名字 … end` 变成包住里面节点的边界框。

这里也接受 `gantt` 源码,走的是[甘特图](../../6-schedule/01-gantt)那套引擎。

## 三、踩坑

- **源码要 URL 编码后放进 `m=`** —— `>` 变 `%3E`,空格 `%20`,换行 `%0A`;
  源码里没编码的 `&` 会把参数截断。
- **只认 `graph` / `flowchart` / `gantt`** —— `sequenceDiagram`、`pieChart`
  这些会 400,不会静默忽略。
- **`subgraph` 块就是一个组** —— 块里的节点(连同块内的连线)会被框在一起;
  出块的连线也算这个组的。
- **形状写法很挑** —— 菱形是 `{…}`,圆柱是 `[(…)]`;括号错一个就换形状或解析失败。

## 四、相关

同一套引擎也能画[架构图](../01-archmap) —— 想自己把方块摆到格子上,
就写 `n=` / `e=`,别写 Mermaid。

