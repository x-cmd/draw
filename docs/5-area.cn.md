---
x-title: area 面积图 —— 折线 + 填充
x-desc: x-cmd/draw `type=area` 用法速查。折线 + 下方填充，强调累积 / 总量。参数与 line 相同：x + y 或 series。
x-sidebar: draw area chart
x-keywords: area chart, 面积图, draw, svg
x-json-ld:
  '@context': https://schema.org
  '@graph':
    - '@type': TechArticle
      headline: 'draw area 面积图'
      inLanguage: 'zh-CN'
      about: 'x-cmd/draw 面积图'
---

# area 面积图 —— 折线 + 填充

---

折线 + 下方填充，**强调累积 / 总量**（区别于 line 的"瞬时值"）。

参数与 `line` 完全相同：x / y / series / title / unit。

---

## 示例

```sh
# 单系列
curl "https://x-cmd.com/draw?type=area&x=Jan,Feb,Mar,Apr,May,Jun&y=10,30,25,50,40,70&title=Cumulative%20users"

# 多系列堆叠
curl "https://x-cmd.com/draw?type=area&x=2019,2020,2021,2022,2023,2024&series=Mobile:100,150,220,300,400,520&series=Desktop:200,180,160,140,120,90"
```

---

## area vs line

- **line**：突出每个时间点的**值**
- **area**：突出**累积**或**整体规模**

堆叠 area 特别适合看"占比随时间的变化"。