---
x-title: combo 混合图 —— 柱 + 折线
x-desc: x-cmd/draw `type=combo` 用法速查。柱状图 + 折线图叠加（柱=总量 / 折线=趋势或比率）。参数：bar 系列 `series=A:...` + line 系列 `series=A:...&kind=line`。`kind` 区分柱/线。
x-sidebar: draw 混合图
x-keywords: combo chart, 混合图, draw, svg, bar + line
x-json-ld:
  '@context': https://schema.org
  '@graph':
    - '@type': TechArticle
      headline: 'draw combo 混合图'
      inLanguage: 'zh-CN'
      about: 'x-cmd/draw 混合图'
---

# combo 混合图 —— 柱 + 折线

## 示例（URL 即所得，点击图片进入交互页）

**柱+线（量级差自动双 y 轴）**

```text
https://x-cmd.com/draw?type=combo&labels=1%E6%9C%88%2C2%E6%9C%88%2C3%E6%9C%88%2C4%E6%9C%88%2C5%E6%9C%88&series=%E9%94%80%E5%94%AE%E9%A2%9D%3A100%2C150%2C120%2C180%2C200&line=%E8%BD%AC%E5%8C%96%E7%8E%87%3A3.2%2C4.1%2C3.8%2C4.5%2C5.2&title=%E6%BC%8F%E6%96%97
```

[![柱+线（量级差自动双 y 轴）](https://x-cmd.com/draw?type=combo&labels=1%E6%9C%88%2C2%E6%9C%88%2C3%E6%9C%88%2C4%E6%9C%88%2C5%E6%9C%88&series=%E9%94%80%E5%94%AE%E9%A2%9D%3A100%2C150%2C120%2C180%2C200&line=%E8%BD%AC%E5%8C%96%E7%8E%87%3A3.2%2C4.1%2C3.8%2C4.5%2C5.2&title=%E6%BC%8F%E6%96%97)](https://x-cmd.com/draw/explore?type=combo&labels=1%E6%9C%88%2C2%E6%9C%88%2C3%E6%9C%88%2C4%E6%9C%88%2C5%E6%9C%88&series=%E9%94%80%E5%94%AE%E9%A2%9D%3A100%2C150%2C120%2C180%2C200&line=%E8%BD%AC%E5%8C%96%E7%8E%87%3A3.2%2C4.1%2C3.8%2C4.5%2C5.2&title=%E6%BC%8F%E6%96%97)

**多柱+多线**

```text
https://x-cmd.com/draw?type=combo&labels=Q1,Q2,Q3,Q4&series=%E8%90%A5%E6%94%B6%3A52400%2C38900%2C24150%2C16300&series=Cost:31200,28700,19800,14500&line=%E5%88%A9%E6%B6%A6%E7%8E%87%3A39%2C26%2C18%2C11&unit=%25
```

[![多柱+多线](https://x-cmd.com/draw?type=combo&labels=Q1,Q2,Q3,Q4&series=%E8%90%A5%E6%94%B6%3A52400%2C38900%2C24150%2C16300&series=Cost:31200,28700,19800,14500&line=%E5%88%A9%E6%B6%A6%E7%8E%87%3A39%2C26%2C18%2C11&unit=%25)](https://x-cmd.com/draw/explore?type=combo&labels=Q1,Q2,Q3,Q4&series=%E8%90%A5%E6%94%B6%3A52400%2C38900%2C24150%2C16300&series=Cost:31200,28700,19800,14500&line=%E5%88%A9%E6%B6%A6%E7%8E%87%3A39%2C26%2C18%2C11&unit=%25)

**周下载 vs 星标增速**

```text
https://x-cmd.com/draw?type=combo&labels=%E5%91%A8%E4%B8%80%2C%E5%91%A8%E4%BA%8C%2C%E5%91%A8%E4%B8%89%2C%E5%91%A8%E5%9B%9B%2C%E5%91%A8%E4%BA%94%2C%E5%91%A8%E5%85%AD%2C%E5%91%A8%E6%97%A5&series=%E4%B8%8B%E8%BD%BD%E9%87%8F%3A120%2C180%2C150%2C210%2C240%2C200%2C260&line=Star%20%E5%A2%9E%E9%95%BF%3A3.1%2C3.4%2C3.2%2C3.8%2C4.1%2C3.9%2C4.5&title=%E6%AF%8F%E5%91%A8
```

[![周下载 vs 星标增速](https://x-cmd.com/draw?type=combo&labels=%E5%91%A8%E4%B8%80%2C%E5%91%A8%E4%BA%8C%2C%E5%91%A8%E4%B8%89%2C%E5%91%A8%E5%9B%9B%2C%E5%91%A8%E4%BA%94%2C%E5%91%A8%E5%85%AD%2C%E5%91%A8%E6%97%A5&series=%E4%B8%8B%E8%BD%BD%E9%87%8F%3A120%2C180%2C150%2C210%2C240%2C200%2C260&line=Star%20%E5%A2%9E%E9%95%BF%3A3.1%2C3.4%2C3.2%2C3.8%2C4.1%2C3.9%2C4.5&title=%E6%AF%8F%E5%91%A8)](https://x-cmd.com/draw/explore?type=combo&labels=%E5%91%A8%E4%B8%80%2C%E5%91%A8%E4%BA%8C%2C%E5%91%A8%E4%B8%89%2C%E5%91%A8%E5%9B%9B%2C%E5%91%A8%E4%BA%94%2C%E5%91%A8%E5%85%AD%2C%E5%91%A8%E6%97%A5&series=%E4%B8%8B%E8%BD%BD%E9%87%8F%3A120%2C180%2C150%2C210%2C240%2C200%2C260&line=Star%20%E5%A2%9E%E9%95%BF%3A3.1%2C3.4%2C3.2%2C3.8%2C4.1%2C3.9%2C4.5&title=%E6%AF%8F%E5%91%A8)

**堆叠柱+线（stack=1）**

```text
https://x-cmd.com/draw?type=combo&stack=1&labels=Q1,Q2,Q3&series=%E7%BD%91%E7%AB%99%3A3%2C4%2C2&series=cli:1,2,3&line=%E6%80%BB%E8%AE%A1%3A4%2C6%2C5&title=%E6%B7%B7%E5%90%88
```

[![堆叠柱+线（stack=1）](https://x-cmd.com/draw?type=combo&stack=1&labels=Q1,Q2,Q3&series=%E7%BD%91%E7%AB%99%3A3%2C4%2C2&series=cli:1,2,3&line=%E6%80%BB%E8%AE%A1%3A4%2C6%2C5&title=%E6%B7%B7%E5%90%88)](https://x-cmd.com/draw/explore?type=combo&stack=1&labels=Q1,Q2,Q3&series=%E7%BD%91%E7%AB%99%3A3%2C4%2C2&series=cli:1,2,3&line=%E6%80%BB%E8%AE%A1%3A4%2C6%2C5&title=%E6%B7%B7%E5%90%88)

**evil 风格**

```text
https://x-cmd.com/draw?type=combo&t=evil&labels=%E5%91%A8%E4%B8%80%2C%E5%91%A8%E4%BA%8C%2C%E5%91%A8%E4%B8%89&series=%E4%B8%8B%E8%BD%BD%3A9%2C12%2C15&line=%E5%A2%9E%E9%95%BF%3A1.1%2C1.4%2C1.8&title=%E6%AF%8F%E5%91%A8
```

[![evil 风格](https://x-cmd.com/draw?type=combo&t=evil&labels=%E5%91%A8%E4%B8%80%2C%E5%91%A8%E4%BA%8C%2C%E5%91%A8%E4%B8%89&series=%E4%B8%8B%E8%BD%BD%3A9%2C12%2C15&line=%E5%A2%9E%E9%95%BF%3A1.1%2C1.4%2C1.8&title=%E6%AF%8F%E5%91%A8)](https://x-cmd.com/draw/explore?type=combo&t=evil&labels=%E5%91%A8%E4%B8%80%2C%E5%91%A8%E4%BA%8C%2C%E5%91%A8%E4%B8%89&series=%E4%B8%8B%E8%BD%BD%3A9%2C12%2C15&line=%E5%A2%9E%E9%95%BF%3A1.1%2C1.4%2C1.8&title=%E6%AF%8F%E5%91%A8)

柱状图 + 折线图叠加。**典型用法**：柱=绝对值（销量），线=比率（转化率）。

---

## 参数

| 参数 | 含义 | 必填 |
| --- | --- | --- |
| `labels=` | X 轴 | ✓ |
| `series=A:v1,v2,...&kind=bar` | bar 系列 | ✓ |
| `series=B:v1,v2,...&kind=line` | line 系列（可多个） | ✓ |
| `title=` | 标题 | ✗ |
| `unit=` | 单位 | ✗ |

`kind` 区分柱 / 线：`bar` / `line`。每个 series 都可以独立指定 kind。

---



---

## 踩坑

- **bar / line 配对**：双 Y 轴自动适配，但注意量纲差异（如百分比 vs 美元）
- **多 series 时，每个都加 `kind`**：缺了会按默认（柱）
- **不是所有风格都支持 combo**：风格 `t=` 兼容性以单柱为准