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

## 示例（URL 即所得，点击图片放大）

**单系列**

```text
https://x-cmd.com/draw?type=scatter&x=1,2,3,4,5&y=4,5,3,6,5&title=Latency
```

![单系列](https://x-cmd.com/draw?type=scatter&x=1,2,3,4,5&y=4,5,3,6,5&title=Latency)

**负值坐标**

```text
https://x-cmd.com/draw?type=scatter&x=-3,-1,0,1,3&y=2,-2,3,-3,1&title=Drift
```

![负值坐标](https://x-cmd.com/draw?type=scatter&x=-3,-1,0,1,3&y=2,-2,3,-3,1&title=Drift)

**多系列（重复 x=/y=）**

```text
https://x-cmd.com/draw?type=scatter&x=1,2,3&y=4,5,6&x=4,5,6&y=1,2,3&title=Groups
```

![多系列（重复 x=/y=）](https://x-cmd.com/draw?type=scatter&x=1,2,3&y=4,5,6&x=4,5,6&y=1,2,3&title=Groups)

**数值全标（num=all）**

```text
https://x-cmd.com/draw?type=scatter&x=1,2,3&y=2,4,3&num=all&title=Small%20set
```

![数值全标（num=all）](https://x-cmd.com/draw?type=scatter&x=1,2,3&y=2,4,3&num=all&title=Small%20set)

两维关联分析。**典型用法**：身高 vs 体重 / 价格 vs 销量 / 年龄 vs 收入。

---


**趋势散点**

```text
https://x-cmd.com/draw?type=scatter&x=1,2,3,4,5,6,7,8&y=2,4,3,6,5,7,4,8&title=Trend
```

![趋势散点](https://x-cmd.com/draw?type=scatter&x=1,2,3,4,5,6,7,8&y=2,4,3,6,5,7,4,8&title=Trend)

**峰值标注（num=peak）**

```text
https://x-cmd.com/draw?type=scatter&x=1,2,3,4&y=5,3,8,6&num=peak&title=Peak
```

![峰值标注（num=peak）](https://x-cmd.com/draw?type=scatter&x=1,2,3,4&y=5,3,8,6&num=peak&title=Peak)

## 参数

| 参数 | 含义 | 必填 |
| --- | --- | --- |
| `points=x1,y1;x2,y2;...` | 单组散点（分号分隔点，逗号分隔坐标） | 单组 ✓ |
| `series=A:x1,y1;x2,y2;...&series=B:...` | 多组 | 多组 ✓ |
| `xlabel=` / `ylabel=` | 轴标签 | ✗ |
| `title=` | 标题 | ✗ |

---



---

## 踩坑

- **数据格式**：`x1,y1;x2,y2;...` —— 分号隔点，逗号隔坐标。容易搞混
- **点数 ≤ 200** 比较清楚
- **加趋势线 / 拟合**：当前不支持，只画点
- **多组**：每组建议 ≥ 5 个点