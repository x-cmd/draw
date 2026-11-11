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

## 示例（URL 即所得，点击图片进入交互页）

**单系列**

```text
https://x-cmd.com/draw?type=scatter&x=1,2,3,4,5&y=4,5,3,6,5&title=%E5%BB%B6%E8%BF%9F
```

[![单系列](https://x-cmd.com/draw?type=scatter&x=1,2,3,4,5&y=4,5,3,6,5&title=%E5%BB%B6%E8%BF%9F)](https://x-cmd.com/draw/explore?type=scatter&x=1,2,3,4,5&y=4,5,3,6,5&title=%E5%BB%B6%E8%BF%9F)

**负值坐标**

```text
https://x-cmd.com/draw?type=scatter&x=-3,-1,0,1,3&y=2,-2,3,-3,1&title=%E6%BC%82%E7%A7%BB
```

[![负值坐标](https://x-cmd.com/draw?type=scatter&x=-3,-1,0,1,3&y=2,-2,3,-3,1&title=%E6%BC%82%E7%A7%BB)](https://x-cmd.com/draw/explore?type=scatter&x=-3,-1,0,1,3&y=2,-2,3,-3,1&title=%E6%BC%82%E7%A7%BB)

**多系列（重复 x=/y=）**

```text
https://x-cmd.com/draw?type=scatter&x=1,2,3&y=4,5,6&x=4,5,6&y=1,2,3&title=%E5%88%86%E7%BB%84
```

[![多系列（重复 x=/y=）](https://x-cmd.com/draw?type=scatter&x=1,2,3&y=4,5,6&x=4,5,6&y=1,2,3&title=%E5%88%86%E7%BB%84)](https://x-cmd.com/draw/explore?type=scatter&x=1,2,3&y=4,5,6&x=4,5,6&y=1,2,3&title=%E5%88%86%E7%BB%84)

**数值全标（num=all）**

```text
https://x-cmd.com/draw?type=scatter&x=1,2,3&y=2,4,3&num=all&title=%E5%B0%8F%E6%A0%B7%E6%9C%AC
```

[![数值全标（num=all）](https://x-cmd.com/draw?type=scatter&x=1,2,3&y=2,4,3&num=all&title=%E5%B0%8F%E6%A0%B7%E6%9C%AC)](https://x-cmd.com/draw/explore?type=scatter&x=1,2,3&y=2,4,3&num=all&title=%E5%B0%8F%E6%A0%B7%E6%9C%AC)

两维关联分析。**典型用法**：身高 vs 体重 / 价格 vs 销量 / 年龄 vs 收入。

---


**趋势散点**

```text
https://x-cmd.com/draw?type=scatter&x=1,2,3,4,5,6,7,8&y=2,4,3,6,5,7,4,8&title=%E8%B6%8B%E5%8A%BF
```

[![趋势散点](https://x-cmd.com/draw?type=scatter&x=1,2,3,4,5,6,7,8&y=2,4,3,6,5,7,4,8&title=%E8%B6%8B%E5%8A%BF)](https://x-cmd.com/draw/explore?type=scatter&x=1,2,3,4,5,6,7,8&y=2,4,3,6,5,7,4,8&title=%E8%B6%8B%E5%8A%BF)

**峰值标注（num=peak）**

```text
https://x-cmd.com/draw?type=scatter&x=1,2,3,4&y=5,3,8,6&num=peak&title=%E5%B3%B0%E5%80%BC
```

[![峰值标注（num=peak）](https://x-cmd.com/draw?type=scatter&x=1,2,3,4&y=5,3,8,6&num=peak&title=%E5%B3%B0%E5%80%BC)](https://x-cmd.com/draw/explore?type=scatter&x=1,2,3,4&y=5,3,8,6&num=peak&title=%E5%B3%B0%E5%80%BC)

## 参数

| 参数 | 含义 | 必填 |
| --- | --- | --- |
| `points=x1,y1;x2,y2;...` | 单组散点（分号分隔点，逗号分隔坐标） | 单组 ✓ |
| `series=A:x1,y1;x2,y2;...&series=B:...` | 多组 | 多组 ✓ |
| `names=` | 每个点的名字(逗号分隔,个数与点数一致)—— 榜单类散点没有名字就分不清谁是谁 | ✗ |
| `xname=` / `yname=` | 两条轴叫什么 | ✗ |
| `logx=1` | X 轴取对数(量级差得远时:1 块和 20 块挤在一起就分不开) | ✗ |
| `title=` | 标题 | ✗ |

---



---

## 踩坑

- **数据格式**：`x1,y1;x2,y2;...` —— 分号隔点，逗号隔坐标。容易搞混
- **点数 ≤ 200** 比较清楚
- **加趋势线 / 拟合**：当前不支持，只画点
- **多组**：每组建议 ≥ 5 个点