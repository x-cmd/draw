---
x-title: scatter 散点图 —— 关联分析
x-desc: x-cmd/draw `type=scatter` 用法速查。两维关联分析（高度 vs 体重 / 价格 vs 销量）。参数：`points=x1,y1;x2,y2;...` 或 `series=A:x1,y1;...&series=B:x1,y1;...`。
x-sidebar: draw 散点图
x-keywords: scatter plot, 散点图, draw, svg, 关联分析
x-json-ld:
  '@context': https://schema.org
  '@graph':
    - '@type': TechArticle
      headline: 'draw scatter 散点图'
      inLanguage: 'zh-CN'
      about: 'x-cmd/draw 散点图'
---

# scatter 散点图 —— 关联分析

两维关联分析。**典型用法**：身高 vs 体重 / 价格 vs 销量 / 年龄 vs 收入。

---

## 参数

| 参数 | 含义 | 必填 |
| --- | --- | --- |
| `points=x1,y1;x2,y2;...` | 单组散点（分号分隔点，逗号分隔坐标） | 单组 ✓ |
| `series=A:x1,y1;x2,y2;...&series=B:...` | 多组 | 多组 ✓ |
| `xlabel=` / `ylabel=` | 轴标签 | ✗ |
| `title=` | 标题 | ✗ |

---

## 示例

```sh
# 单组
curl "https://x-cmd.com/draw?type=scatter&points=1.5,60;1.7,65;1.8,72;1.6,58;1.75,68&xlabel=Height%20(m)&ylabel=Weight%20(kg)&title=Sample%20population"

# 多组
curl "https://x-cmd.com/draw?type=scatter&series=A:1.5,60;1.7,65;1.8,72&series=B:1.8,75;1.9,80;1.85,78&xlabel=H&ylabel=W&title=A%20vs%20B%20population"
```

---

## 踩坑

- **数据格式**：`x1,y1;x2,y2;...` —— 分号隔点，逗号隔坐标。容易搞混
- **点数 ≤ 200** 比较清楚
- **加趋势线 / 拟合**：当前不支持，只画点
- **多组**：每组建议 ≥ 5 个点