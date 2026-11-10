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

## 示例（URL 即所得，点击图片进入交互页）

**排行（默认 base）**

```text
https://x-cmd.com/draw?type=hbar&labels=CLI%2C%E6%A0%B8%E5%BF%83%2C%E6%96%87%E6%A1%A3%2CUI&values=42,31,18,9&title=%E5%90%84%E6%A8%A1%E5%9D%97%E6%8F%90%E4%BA%A4%E9%87%8F
```

[![排行（默认 base）](https://x-cmd.com/draw?type=hbar&labels=CLI%2C%E6%A0%B8%E5%BF%83%2C%E6%96%87%E6%A1%A3%2CUI&values=42,31,18,9&title=%E5%90%84%E6%A8%A1%E5%9D%97%E6%8F%90%E4%BA%A4%E9%87%8F)](https://x-cmd.com/draw/explore?type=hbar&labels=CLI%2C%E6%A0%B8%E5%BF%83%2C%E6%96%87%E6%A1%A3%2CUI&values=42,31,18,9&title=%E5%90%84%E6%A8%A1%E5%9D%97%E6%8F%90%E4%BA%A4%E9%87%8F)

**单系列长标签**

```text
https://x-cmd.com/draw?type=hbar&labels=%E7%94%B2%2C%E4%B9%99%2C%E4%B8%99%2C%E4%B8%81%2C%E6%88%8A&values=120,98,150,75,60&title=%E8%AF%84%E5%AE%A1%E6%95%B0
```

[![单系列长标签](https://x-cmd.com/draw?type=hbar&labels=%E7%94%B2%2C%E4%B9%99%2C%E4%B8%99%2C%E4%B8%81%2C%E6%88%8A&values=120,98,150,75,60&title=%E8%AF%84%E5%AE%A1%E6%95%B0)](https://x-cmd.com/draw/explore?type=hbar&labels=%E7%94%B2%2C%E4%B9%99%2C%E4%B8%99%2C%E4%B8%81%2C%E6%88%8A&values=120,98,150,75,60&title=%E8%AF%84%E5%AE%A1%E6%95%B0)

**像素条%（t=xcmd）**

```text
https://x-cmd.com/draw?type=hbar&t=xcmd&labels=TypeScript%2CPython%2CGo%2C%E5%85%B6%E4%BB%96&values=68,21,9,2&title=%E8%AF%AD%E8%A8%80%E5%8D%A0%E6%AF%94
```

[![像素条%（t=xcmd）](https://x-cmd.com/draw?type=hbar&t=xcmd&labels=TypeScript%2CPython%2CGo%2C%E5%85%B6%E4%BB%96&values=68,21,9,2&title=%E8%AF%AD%E8%A8%80%E5%8D%A0%E6%AF%94)](https://x-cmd.com/draw/explore?type=hbar&t=xcmd&labels=TypeScript%2CPython%2CGo%2C%E5%85%B6%E4%BB%96&values=68,21,9,2&title=%E8%AF%AD%E8%A8%80%E5%8D%A0%E6%AF%94)

**双系列蝴蝶（t=xcmd-issue）**

```text
https://x-cmd.com/draw?type=hbar&t=xcmd-issue&labels=CLI%2C%E6%A0%B8%E5%BF%83%2C%E6%96%87%E6%A1%A3%2CCI%2CUI&series=%E6%9C%AA%E8%A7%A3%E5%86%B3%3A12%2C8%2C15%2C4%2C9&series=closed:38,52,20,11,26&title=%E5%90%84%E6%A8%A1%E5%9D%97%20issue
```

[![双系列蝴蝶（t=xcmd-issue）](https://x-cmd.com/draw?type=hbar&t=xcmd-issue&labels=CLI%2C%E6%A0%B8%E5%BF%83%2C%E6%96%87%E6%A1%A3%2CCI%2CUI&series=%E6%9C%AA%E8%A7%A3%E5%86%B3%3A12%2C8%2C15%2C4%2C9&series=closed:38,52,20,11,26&title=%E5%90%84%E6%A8%A1%E5%9D%97%20issue)](https://x-cmd.com/draw/explore?type=hbar&t=xcmd-issue&labels=CLI%2C%E6%A0%B8%E5%BF%83%2C%E6%96%87%E6%A1%A3%2CCI%2CUI&series=%E6%9C%AA%E8%A7%A3%E5%86%B3%3A12%2C8%2C15%2C4%2C9&series=closed:38,52,20,11,26&title=%E5%90%84%E6%A8%A1%E5%9D%97%20issue)

**双系列斜纹（t=rank）**

```text
https://x-cmd.com/draw?type=hbar&t=rank&labels=Q1,Q2,Q3&series=2025:80,95,110&series=2026:110,85,120&title=%E5%AD%A3%E5%BA%A6%E5%AF%B9%E6%AF%94
```

[![双系列斜纹（t=rank）](https://x-cmd.com/draw?type=hbar&t=rank&labels=Q1,Q2,Q3&series=2025:80,95,110&series=2026:110,85,120&title=%E5%AD%A3%E5%BA%A6%E5%AF%B9%E6%AF%94)](https://x-cmd.com/draw/explore?type=hbar&t=rank&labels=Q1,Q2,Q3&series=2025:80,95,110&series=2026:110,85,120&title=%E5%AD%A3%E5%BA%A6%E5%AF%B9%E6%AF%94)

**参考线（t=opendata, ref=）**

```text
https://x-cmd.com/draw?type=hbar&t=opendata&labels=alpha,beta,gamma,delta&values=8,6,9,4&ref=7&reflabel=target&title=%E5%86%B2%E5%88%BA%E7%82%B9%E6%95%B0
```

[![参考线（t=opendata, ref=）](https://x-cmd.com/draw?type=hbar&t=opendata&labels=alpha,beta,gamma,delta&values=8,6,9,4&ref=7&reflabel=target&title=%E5%86%B2%E5%88%BA%E7%82%B9%E6%95%B0)](https://x-cmd.com/draw/explore?type=hbar&t=opendata&labels=alpha,beta,gamma,delta&values=8,6,9,4&ref=7&reflabel=target&title=%E5%86%B2%E5%88%BA%E7%82%B9%E6%95%B0)

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