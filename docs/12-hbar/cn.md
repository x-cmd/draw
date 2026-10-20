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

## 示例（URL 即所得，点击图片放大）

**排行（默认 base）**

```text
https://x-cmd.com/draw?type=hbar&labels=cli,core,docs,ui&values=42,31,18,9&title=Commits%20by%20area
```

![排行（默认 base）](https://x-cmd.com/draw?type=hbar&labels=cli,core,docs,ui&values=42,31,18,9&title=Commits%20by%20area)

**单系列长标签**

```text
https://x-cmd.com/draw?type=hbar&labels=Alice,Bob,Charlie,Diana,Edward&values=120,98,150,75,60&title=Reviews
```

![单系列长标签](https://x-cmd.com/draw?type=hbar&labels=Alice,Bob,Charlie,Diana,Edward&values=120,98,150,75,60&title=Reviews)

**像素条%（t=xcmd）**

```text
https://x-cmd.com/draw?type=hbar&t=xcmd&labels=TypeScript,Python,Go,Other&values=68,21,9,2&title=Languages
```

![像素条%（t=xcmd）](https://x-cmd.com/draw?type=hbar&t=xcmd&labels=TypeScript,Python,Go,Other&values=68,21,9,2&title=Languages)

**双系列蝴蝶（t=xcmd-issue）**

```text
https://x-cmd.com/draw?type=hbar&t=xcmd-issue&labels=cli,core,docs,ci,ui&series=open:12,8,15,4,9&series=closed:38,52,20,11,26&title=Issues%20by%20area
```

![双系列蝴蝶（t=xcmd-issue）](https://x-cmd.com/draw?type=hbar&t=xcmd-issue&labels=cli,core,docs,ci,ui&series=open:12,8,15,4,9&series=closed:38,52,20,11,26&title=Issues%20by%20area)

**双系列斜纹（t=rank）**

```text
https://x-cmd.com/draw?type=hbar&t=rank&labels=Q1,Q2,Q3&series=2025:80,95,110&series=2026:110,85,120&title=Quarterly
```

![双系列斜纹（t=rank）](https://x-cmd.com/draw?type=hbar&t=rank&labels=Q1,Q2,Q3&series=2025:80,95,110&series=2026:110,85,120&title=Quarterly)

**参考线（t=opendata, ref=）**

```text
https://x-cmd.com/draw?type=hbar&t=opendata&labels=alpha,beta,gamma,delta&values=8,6,9,4&ref=7&reflabel=target&title=Sprint%20points
```

![参考线（t=opendata, ref=）](https://x-cmd.com/draw?type=hbar&t=opendata&labels=alpha,beta,gamma,delta&values=8,6,9,4&ref=7&reflabel=target&title=Sprint%20points)

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



---

## 何时用 hbar vs bar

- **bar**（垂直）：时间序列（X 轴是时间，从左到右有"时间流动"的暗示）
- **hbar**（水平）：分类对比（Y 轴是分类，标签文字长）

例：项目名是中文 → hbar；月份 → bar。