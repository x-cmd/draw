---
x-title: hbar 水平柱状图 —— 长 label 友好
x-desc: x-cmd/draw `type=hbar` 用法速查。水平柱状图，适合 label 文字较长（人名 / 项目名）。参数与 bar 相同：labels + values 或 series，title / unit / t / scheme / num / w/h。
x-sidebar: draw 水平柱状图
x-keywords: hbar, 水平柱状图, horizontal bar chart, draw, svg
x-json-ld:
  '@context': https://schema.org
  '@graph':
    - '@type': TechArticle
      headline: 'draw hbar 水平柱状图'
      inLanguage: 'zh-CN'
      about: 'x-cmd/draw 水平柱状图'
---

# hbar 水平柱状图 —— 长 label 友好

水平柱状图，柱子是横向的。**适合 label 文字很长**的场景（如人名 / 项目名 / 长分类名）。

---

## 参数

与 `bar` 完全相同：

| 参数 | 含义 | 必填 |
| --- | --- | --- |
| `labels=` | Y 轴标签（横向） | ✓ |
| `values=` | 单系列数值 | 单系列 ✓ |
| `series=A:...,B:...` | 多系列 | 多系列 ✓ |
| `title=` | 标题 | ✗ |
| `unit=` | 单位 | ✗ |
| `t=` | 风格 | — |

---

## 示例

```sh
# 单系列
curl "https://x-cmd.com/draw?type=hbar&labels=Alice,Bob,Charlie,Diana,Edward&values=120,98,150,76,135&title=Score%20by%20person"

# 多系列分组
curl "https://x-cmd.com/draw?type=hbar&labels=Project%20Alpha,Project%20Beta,Project%20Gamma&series=Q1:80,60,90&series=Q2:95,75,110&series=Q3:110,85,120"

# 堆叠
curl "https://x-cmd.com/draw?type=hbar&stack=1&labels=Region%20A,Region%20B,Region%20C&series=Desktop:300,250,400&series=Mobile:200,180,350&series=Tablet:50,30,80"
```

---

## 何时用 hbar vs bar

- **bar**（垂直）：时间序列（X 轴是时间，从左到右有"时间流动"的暗示）
- **hbar**（水平）：分类对比（Y 轴是分类，标签文字长）

例：项目名是中文 → hbar；月份 → bar。