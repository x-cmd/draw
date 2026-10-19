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

## 示例

```sh
# 柱（销量）+ 线（转化率）
curl "https://x-cmd.com/draw?type=combo&labels=Jan,Feb,Mar,Apr,May&series=Sales:100,150,120,180,200&kind=bar&series=Conversion%20rate:3.2,4.1,3.8,4.5,5.2&kind=line"

# 多柱 + 多线
curl "https://x-cmd.com/draw?type=combo&labels=Q1,Q2,Q3,Q4&series=Revenue:52400,38900,24150,16300&kind=bar&series=Cost:31200,28700,19800,14500&kind=bar&series=Margin:39,26,18,11&kind=line&unit=%25"
```

---

## 踩坑

- **bar / line 配对**：双 Y 轴自动适配，但注意量纲差异（如百分比 vs 美元）
- **多 series 时，每个都加 `kind`**：缺了会按默认（柱）
- **不是所有风格都支持 combo**：风格 `t=` 兼容性以单柱为准