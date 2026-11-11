---
x-title: 思维导图 —— 一串路径,四种形态
x-desc: 'x-cmd/draw 思维导图(`/draw/mindmap`)。树用斜杠路径写,父节点由引擎推断。参数:`n=` 路径(`根/枝/叶`),`style=`(organic/tree/radial/bubble),`t=`,`title=`,`w=/h=`。'
x-sidebar: draw 思维导图
x-keywords: 思维导图, draw, svg, 树状图, 路线图, 功能地图
x-json-ld:
  '@context': https://schema.org
  '@graph':
    - '@type': TechArticle
      headline: 'draw 思维导图'
      inLanguage: 'cn'
      about: 'x-cmd/draw 02-mindmap'
---

# 思维导图 —— 一串路径,四种形态

树用斜杠路径写,引擎自己推出公共父节点并排版 —— 四种形态任选。

## 示例(URL 即所得,点击图片进入交互页)

### 功能地图

```text
https://x-cmd.com/draw/mindmap?n=%E7%BB%98%E5%88%B6%2FCharts%2FPie&n=%E7%BB%98%E5%88%B6%2FCharts%2FBar%20and%20Line&n=%E7%BB%98%E5%88%B6%2FCharts%2FSankey&n=%E7%BB%98%E5%88%B6%2FArch%2FArchmap&n=%E7%BB%98%E5%88%B6%2FArch%2FMindmap&n=%E7%BB%98%E5%88%B6%2FEcosystem%2FSkill&n=%E7%BB%98%E5%88%B6%2FEcosystem%2FData%20link&w=560
```

[![draw 功能地图](https://x-cmd.com/draw/mindmap?n=%E7%BB%98%E5%88%B6%2FCharts%2FPie&n=%E7%BB%98%E5%88%B6%2FCharts%2FBar%20and%20Line&n=%E7%BB%98%E5%88%B6%2FCharts%2FSankey&n=%E7%BB%98%E5%88%B6%2FArch%2FArchmap&n=%E7%BB%98%E5%88%B6%2FArch%2FMindmap&n=%E7%BB%98%E5%88%B6%2FEcosystem%2FSkill&n=%E7%BB%98%E5%88%B6%2FEcosystem%2FData%20link&w=560)](https://x-cmd.com/draw/explore/mindmap?n=draw/Charts/Pie&n=draw/Charts/Bar%20and%20Line&n=draw/Charts/Sankey&n=draw/Arch/Archmap&n=draw/Arch/Mindmap&n=draw/Ecosystem/Skill&n=draw/Ecosystem/Data%20link&w=560)

### 同一棵树换个形态(`style=tree`)

```text
https://x-cmd.com/draw/mindmap?n=%E5%8F%91%E5%B8%83%2F%E6%B3%95%E5%8A%A1%2F%E9%9A%90%E7%A7%81%E6%A3%80%E6%9F%A5&n=%E5%8F%91%E5%B8%83%2F%E5%B7%A5%E7%A8%8B%2F%E6%B5%8B%E8%AF%95&n=%E5%8F%91%E5%B8%83%2F%E5%B7%A5%E7%A8%8B%2F%E6%80%A7%E8%83%BD&n=%E5%8F%91%E5%B8%83%2F%E6%96%87%E6%A1%A3%2F%E6%9B%B4%E6%96%B0%E6%97%A5%E5%BF%97&n=%E5%8F%91%E5%B8%83%2F%E6%96%87%E6%A1%A3%2F%E5%AE%A3%E4%BC%A0%E6%96%87%E6%A1%88&style=tree&title=%E5%8F%91%E5%B8%83%E6%B8%85%E5%8D%95&w=560
```

[![上线检查清单](https://x-cmd.com/draw/mindmap?n=%E5%8F%91%E5%B8%83%2F%E6%B3%95%E5%8A%A1%2F%E9%9A%90%E7%A7%81%E6%A3%80%E6%9F%A5&n=%E5%8F%91%E5%B8%83%2F%E5%B7%A5%E7%A8%8B%2F%E6%B5%8B%E8%AF%95&n=%E5%8F%91%E5%B8%83%2F%E5%B7%A5%E7%A8%8B%2F%E6%80%A7%E8%83%BD&n=%E5%8F%91%E5%B8%83%2F%E6%96%87%E6%A1%A3%2F%E6%9B%B4%E6%96%B0%E6%97%A5%E5%BF%97&n=%E5%8F%91%E5%B8%83%2F%E6%96%87%E6%A1%A3%2F%E5%AE%A3%E4%BC%A0%E6%96%87%E6%A1%88&style=tree&title=%E5%8F%91%E5%B8%83%E6%B8%85%E5%8D%95&w=560)](https://x-cmd.com/draw/explore/mindmap?n=Launch/Legal/Privacy%20check&n=Launch/Eng/Tests&n=Launch/Eng/Perf&n=Launch/Docs/Changelog&n=Launch/Docs/Post%20copy&style=tree&title=Launch%20checklist&w=560)

### 径向的生态图(`style=radial`)

```text
https://x-cmd.com/draw/mindmap?n=AI%2F%E6%9C%8D%E5%8A%A1%E5%95%86%2FOpenAI&n=AI%2F%E6%9C%8D%E5%8A%A1%E5%95%86%2FAnthropic&n=AI%2F%E5%BC%80%E6%BA%90%2FDeepSeek&n=AI%2F%E6%99%BA%E8%83%BD%E4%BD%93%2FClaude%20Code&n=AI%2F%E6%99%BA%E8%83%BD%E4%BD%93%2FCodex&style=radial&w=560
```

[![AI 厂商与工具](https://x-cmd.com/draw/mindmap?n=AI%2F%E6%9C%8D%E5%8A%A1%E5%95%86%2FOpenAI&n=AI%2F%E6%9C%8D%E5%8A%A1%E5%95%86%2FAnthropic&n=AI%2F%E5%BC%80%E6%BA%90%2FDeepSeek&n=AI%2F%E6%99%BA%E8%83%BD%E4%BD%93%2FClaude%20Code&n=AI%2F%E6%99%BA%E8%83%BD%E4%BD%93%2FCodex&style=radial&w=560)](https://x-cmd.com/draw/explore/mindmap?n=AI/Providers/OpenAI&n=AI/Providers/Anthropic&n=AI/Open/DeepSeek&n=AI/Agents/Claude%20Code&n=AI/Agents/Codex&style=radial&w=560)

### 标签都很短时用 bubble

```text
https://x-cmd.com/draw/mindmap?n=%E4%BA%A7%E5%93%81%2F%E5%8A%9F%E8%83%BD%2F%E6%80%A7%E8%83%BD&n=%E4%BA%A7%E5%93%81%2F%E5%8A%9F%E8%83%BD%2F%E9%9A%90%E7%A7%81&n=%E4%BA%A7%E5%93%81%2F%E5%8A%9F%E8%83%BD%2F%E9%9B%86%E6%88%90&n=%E4%BA%A7%E5%93%81%2F%E5%B8%82%E5%9C%BA%2F%E6%AC%A7%E7%9B%9F&n=%E4%BA%A7%E5%93%81%2F%E5%B8%82%E5%9C%BA%2F%E7%BE%8E%E5%9B%BD&n=%E4%BA%A7%E5%93%81%2F%E5%AE%9A%E4%BB%B7%2F%E5%85%8D%E8%B4%B9&n=%E4%BA%A7%E5%93%81%2F%E5%AE%9A%E4%BB%B7%2FPro&style=bubble&title=%E4%BA%A7%E5%93%81%E5%9C%B0%E5%9B%BE&w=560
```

[![产品地图](https://x-cmd.com/draw/mindmap?n=%E4%BA%A7%E5%93%81%2F%E5%8A%9F%E8%83%BD%2F%E6%80%A7%E8%83%BD&n=%E4%BA%A7%E5%93%81%2F%E5%8A%9F%E8%83%BD%2F%E9%9A%90%E7%A7%81&n=%E4%BA%A7%E5%93%81%2F%E5%8A%9F%E8%83%BD%2F%E9%9B%86%E6%88%90&n=%E4%BA%A7%E5%93%81%2F%E5%B8%82%E5%9C%BA%2F%E6%AC%A7%E7%9B%9F&n=%E4%BA%A7%E5%93%81%2F%E5%B8%82%E5%9C%BA%2F%E7%BE%8E%E5%9B%BD&n=%E4%BA%A7%E5%93%81%2F%E5%AE%9A%E4%BB%B7%2F%E5%85%8D%E8%B4%B9&n=%E4%BA%A7%E5%93%81%2F%E5%AE%9A%E4%BB%B7%2FPro&style=bubble&title=%E4%BA%A7%E5%93%81%E5%9C%B0%E5%9B%BE&w=560)](https://x-cmd.com/draw/explore/mindmap?n=Product/Features/Speed&n=Product/Features/Privacy&n=Product/Features/Integrations&n=Product/Markets/EU&n=Product/Markets/US&n=Product/Pricing/Free&n=Product/Pricing/Pro&style=bubble&title=Product%20map&w=560)

## 一、参数

| 参数 | 含义 | 默认 |
|---|---|---|
| `n=` | 一条路径一个叶子:`根/枝/叶` —— 每个叶子写一次 | — |
| `style=` | 形态:`organic`、`tree`、`radial`、`bubble` | `organic` |
| `t=` | 皮肤(配色族) | — |
| `title=` | 图标题 | — |
| `w=` / `h=` | 最小宽 / 高 | 自然尺寸 |
| `v=` | 固定输出版本 | 最新 |

## 二、树怎么写

每个叶子一条 `n=`,用斜杠分层:

```
n=Launch/Eng/Tests
n=Launch/Eng/Perf
n=Launch/Docs/Changelog
```

有公共前缀的路径就是同一个父节点。**父节点不用你写** —— `Launch` 和
`Launch/Eng` 由引擎推出来,再按子节点多少排序。

如果想让显示出来的名字和路径不一样,可以在叶子里再写一段带 `/` 的显示名 ——
这是路径不等于树的唯一一种情况。

## 三、四种形态

| `style=` | 长相 | 适合 |
|---|---|---|
| `organic` | 根在左,枝条向外散开 | 功能地图、生态图 |
| `tree` | 上下颠倒的树,父在上 | 清单、大纲 |
| `radial` | 根在中间,枝条四散放射 | 分类体系、思维导图 |
| `bubble` | 圆角胶囊,排得紧 | 标签都很短的时候 |

## 四、踩坑

- **根节点至少要有一条枝** —— 只有一层路径会 400,树至少要两层。
- **路径就是全部输入**:和别的路径没有公共前缀的节点会变成第二个根,这通常不是本意。
- **`style=` 不是主题** —— 它改的是布局;颜色来自 `t=`。
- **顺序不影响结果** —— 引擎按子树大小排,不是按你写的先后。

