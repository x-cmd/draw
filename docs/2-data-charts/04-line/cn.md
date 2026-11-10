---
x-title: line 折线图 —— 时间序列标配
x-desc: x-cmd/draw `type=line` 用法速查。时间序列标配。参数：`x=` 时间标签 / `y=` 单系列 / `series=A:...,B:...` 多系列 / `title=` / `unit=`。点和线可分别控制样式。
x-sidebar: draw 折线图
x-keywords: line chart, 折线图, draw, svg, 时间序列, time series
x-json-ld:
  '@context': https://schema.org
  '@graph':
    - '@type': TechArticle
      headline: 'draw line 折线图'
      inLanguage: 'zh-CN'
      about: 'x-cmd/draw 折线图'
---

# line 折线图 —— 时间序列标配

## 示例（URL 即所得，点击图片进入交互页）

**单折线（默认 shadcn）**

```text
https://x-cmd.com/draw?type=line&labels=1%E6%9C%88%2C2%E6%9C%88%2C3%E6%9C%88%2C4%E6%9C%88%2C5%E6%9C%88%2C6%E6%9C%88&values=12,19,15,25,22,30&title=Star%20%E6%95%B0
```

[![单折线（默认 shadcn）](https://x-cmd.com/draw?type=line&labels=1%E6%9C%88%2C2%E6%9C%88%2C3%E6%9C%88%2C4%E6%9C%88%2C5%E6%9C%88%2C6%E6%9C%88&values=12,19,15,25,22,30&title=Star%20%E6%95%B0)](https://x-cmd.com/draw/explore?type=line&labels=1%E6%9C%88%2C2%E6%9C%88%2C3%E6%9C%88%2C4%E6%9C%88%2C5%E6%9C%88%2C6%E6%9C%88&values=12,19,15,25,22,30&title=Star%20%E6%95%B0)

**多折线（series=）**

```text
https://x-cmd.com/draw?type=line&labels=%E5%91%A8%E4%B8%80%2C%E5%91%A8%E4%BA%8C%2C%E5%91%A8%E4%B8%89%2C%E5%91%A8%E5%9B%9B&series=day:12,18,9,14&series=night:8,7,9,8&title=%E8%AE%BF%E9%97%AE%E9%87%8F
```

[![多折线（series=）](https://x-cmd.com/draw?type=line&labels=%E5%91%A8%E4%B8%80%2C%E5%91%A8%E4%BA%8C%2C%E5%91%A8%E4%B8%89%2C%E5%91%A8%E5%9B%9B&series=day:12,18,9,14&series=night:8,7,9,8&title=%E8%AE%BF%E9%97%AE%E9%87%8F)](https://x-cmd.com/draw/explore?type=line&labels=%E5%91%A8%E4%B8%80%2C%E5%91%A8%E4%BA%8C%2C%E5%91%A8%E4%B8%89%2C%E5%91%A8%E5%9B%9B&series=day:12,18,9,14&series=night:8,7,9,8&title=%E8%AE%BF%E9%97%AE%E9%87%8F)

**发光（t=evil-glow）**

```text
https://x-cmd.com/draw?type=line&t=evil-glow&labels=Q1,Q2,Q3,Q4&values=3.1,3.4,3.2,3.8&title=%E5%A2%9E%E9%95%BF
```

[![发光（t=evil-glow）](https://x-cmd.com/draw?type=line&t=evil-glow&labels=Q1,Q2,Q3,Q4&values=3.1,3.4,3.2,3.8&title=%E5%A2%9E%E9%95%BF)](https://x-cmd.com/draw/explore?type=line&t=evil-glow&labels=Q1,Q2,Q3,Q4&values=3.1,3.4,3.2,3.8&title=%E5%A2%9E%E9%95%BF)

**线端标签（t=opendata）**

```text
https://x-cmd.com/draw?type=line&t=opendata&labels=v0.1,v0.2,v0.3&values=120,240,410&title=%E4%B8%8B%E8%BD%BD%E9%87%8F
```

[![线端标签（t=opendata）](https://x-cmd.com/draw?type=line&t=opendata&labels=v0.1,v0.2,v0.3&values=120,240,410&title=%E4%B8%8B%E8%BD%BD%E9%87%8F)](https://x-cmd.com/draw/explore?type=line&t=opendata&labels=v0.1,v0.2,v0.3&values=120,240,410&title=%E4%B8%8B%E8%BD%BD%E9%87%8F)

**黑白（t=evil-mono）**

```text
https://x-cmd.com/draw?type=line&t=evil-mono&labels=%E5%91%A8%E4%B8%80%2C%E5%91%A8%E4%BA%8C%2C%E5%91%A8%E4%B8%89%2C%E5%91%A8%E5%9B%9B%2C%E5%91%A8%E4%BA%94&values=42,38,50,46,58&title=%E6%9E%84%E5%BB%BA%E6%AC%A1%E6%95%B0
```

[![黑白（t=evil-mono）](https://x-cmd.com/draw?type=line&t=evil-mono&labels=%E5%91%A8%E4%B8%80%2C%E5%91%A8%E4%BA%8C%2C%E5%91%A8%E4%B8%89%2C%E5%91%A8%E5%9B%9B%2C%E5%91%A8%E4%BA%94&values=42,38,50,46,58&title=%E6%9E%84%E5%BB%BA%E6%AC%A1%E6%95%B0)](https://x-cmd.com/draw/explore?type=line&t=evil-mono&labels=%E5%91%A8%E4%B8%80%2C%E5%91%A8%E4%BA%8C%2C%E5%91%A8%E4%B8%89%2C%E5%91%A8%E5%9B%9B%2C%E5%91%A8%E4%BA%94&values=42,38,50,46,58&title=%E6%9E%84%E5%BB%BA%E6%AC%A1%E6%95%B0)

---

## 参数

| 参数 | 含义 | 必填 |
| --- | --- | --- |
| `x=` | X 轴标签（时间 / 类别） | ✓ |
| `y=` | 单系列数值 | 单系列 ✓ |
| `series=A:v1,v2,...&series=B:v1,v2,...` | 多系列 | 多系列 ✓ |
| `title=` / `unit=` | 标题 / 单位 | ✗ |
| `t=` | 风格 | — |

---



---

## 踩坑

- **点数 vs X 轴标签数**：X 标签 ≥ 数据点数，否则缺值；X 标签 < 数据点数则取前 N 个
- **多系列对齐**：所有系列必须长度相同，否则只画到最短的为止
- **极值**：Y 轴自动适配；如需固定范围，用 `ymin=` / `ymax=`