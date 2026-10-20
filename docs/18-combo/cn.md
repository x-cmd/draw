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

## 示例（URL 即所得，点击图片放大）

**柱+线（量级差自动双 y 轴）**

```text
https://x-cmd.com/draw?type=combo&labels=Jan,Feb,Mar,Apr,May&series=Sales:100,150,120,180,200&line=Conversion%20rate:3.2,4.1,3.8,4.5,5.2&title=Funnel
```

![柱+线（量级差自动双 y 轴）](https://x-cmd.com/draw?type=combo&labels=Jan,Feb,Mar,Apr,May&series=Sales:100,150,120,180,200&line=Conversion%20rate:3.2,4.1,3.8,4.5,5.2&title=Funnel)

**多柱+多线**

```text
https://x-cmd.com/draw?type=combo&labels=Q1,Q2,Q3,Q4&series=Revenue:52400,38900,24150,16300&series=Cost:31200,28700,19800,14500&line=Margin:39,26,18,11&unit=%25
```

![多柱+多线](https://x-cmd.com/draw?type=combo&labels=Q1,Q2,Q3,Q4&series=Revenue:52400,38900,24150,16300&series=Cost:31200,28700,19800,14500&line=Margin:39,26,18,11&unit=%25)

**周下载 vs 星标增速**

```text
https://x-cmd.com/draw?type=combo&labels=Mon,Tue,Wed,Thu,Fri,Sat,Sun&series=Downloads:120,180,150,210,240,200,260&line=Star%20growth:3.1,3.4,3.2,3.8,4.1,3.9,4.5&title=Weekly
```

![周下载 vs 星标增速](https://x-cmd.com/draw?type=combo&labels=Mon,Tue,Wed,Thu,Fri,Sat,Sun&series=Downloads:120,180,150,210,240,200,260&line=Star%20growth:3.1,3.4,3.2,3.8,4.1,3.9,4.5&title=Weekly)

**堆叠柱+线（stack=1）**

```text
https://x-cmd.com/draw?type=combo&stack=1&labels=Q1,Q2,Q3&series=web:3,4,2&series=cli:1,2,3&line=total:4,6,5&title=Mixed
```

![堆叠柱+线（stack=1）](https://x-cmd.com/draw?type=combo&stack=1&labels=Q1,Q2,Q3&series=web:3,4,2&series=cli:1,2,3&line=total:4,6,5&title=Mixed)

**evil 风格**

```text
https://x-cmd.com/draw?type=combo&t=evil&labels=Mon,Tue,Wed&series=dl:9,12,15&line=growth:1.1,1.4,1.8&title=Weekly
```

![evil 风格](https://x-cmd.com/draw?type=combo&t=evil&labels=Mon,Tue,Wed&series=dl:9,12,15&line=growth:1.1,1.4,1.8&title=Weekly)

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