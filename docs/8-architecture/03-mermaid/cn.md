---
x-title: 流程图 —— 写 Mermaid,出图
x-desc: 'x-cmd/draw 流程图速查(`/draw/mermaid`)。用 Mermaid 语法写图,引擎在服务端直接渲染。参数:`m=` Mermaid 源码,`t=` 风格(mono),`title=`,`w=/h=`。'
x-sidebar: draw 流程图
x-keywords: 流程图, mermaid, draw, svg, 决策树
x-json-ld:
  '@context': https://schema.org
  '@graph':
    - '@type': TechArticle
      headline: 'draw 流程图'
      inLanguage: 'cn'
      about: 'x-cmd/draw 03-mermaid'
---

# 流程图 —— 写 Mermaid,出图

> 本页还是草稿:下面的例子是真的可用,完整说明待补。

用 Mermaid 语法写图,引擎直接画出来 —— 不用浏览器,不用截图。

```text
https://x-cmd.com/draw/mermaid?m=graph%20TD%0A%20%20Login%5BUser%20login%5D%20--%3E%20MFA%7BMFA%20enabled%3F%7D%0A%20%20MFA%20--%3E%7Cyes%7C%20Code%5BSend%20code%5D%0A%20%20Code%20--%3E%20Verify%5BVerify%5D%0A%20%20Verify%20--%3E%7Cpass%7C%20Session%5BIssue%20session%5D%0A%20%20Verify%20--%3E%7Cfail%7C%20Lock%5BLock%20account%5D%0A%20%20MFA%20--%3E%7Cno%7C%20Session&t=mono&title=Login%20flow&w=560
```

[![登录流程](https://x-cmd.com/draw/mermaid?m=graph%20TD%0A%20%20Login%5BUser%20login%5D%20--%3E%20MFA%7BMFA%20enabled%3F%7D%0A%20%20MFA%20--%3E%7Cyes%7C%20Code%5BSend%20code%5D%0A%20%20Code%20--%3E%20Verify%5BVerify%5D%0A%20%20Verify%20--%3E%7Cpass%7C%20Session%5BIssue%20session%5D%0A%20%20Verify%20--%3E%7Cfail%7C%20Lock%5BLock%20account%5D%0A%20%20MFA%20--%3E%7Cno%7C%20Session&t=mono&title=Login%20flow&w=560)](https://x-cmd.com/draw/explore/mermaid?m=graph%20TD%0A%20%20Login%5BUser%20login%5D%20--%3E%20MFA%7BMFA%20enabled%3F%7D%0A%20%20MFA%20--%3E%7Cyes%7C%20Code%5BSend%20code%5D%0A%20%20Code%20--%3E%20Verify%5BVerify%5D%0A%20%20Verify%20--%3E%7Cpass%7C%20Session%5BIssue%20session%5D%0A%20%20Verify%20--%3E%7Cfail%7C%20Lock%5BLock%20account%5D%0A%20%20MFA%20--%3E%7Cno%7C%20Session&t=mono&title=Login%20flow&w=560)

## 一、参数

| 参数 | 含义 | 默认 |
| --- | --- | --- |
| `m=` | Mermaid 源码(`graph LR …`、`flowchart TD …`) | — |
| `t=` | 风格:`mono` 是线框 | — |
| `title=` | 图标题 | — |
| `w=` / `h=` | 最小宽 / 高 | 自然尺寸 |

## 二、踩坑

- **源码要 URL 编码后放进 `m=`** —— `>` 变 `%3E`,空格 `%20`,换行 `%0A`。
  源码里没编码的 `&` 会把参数截断。
- **只画流程图这一部分** —— 这是图形渲染器,不是完整的 Mermaid 运行时,冷门图种不支持。

