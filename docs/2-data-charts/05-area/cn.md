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

## 示例（URL 即所得，点击图片进入交互页）

**双系列面积（默认 evil）**

```text
https://x-cmd.com/draw?type=area&labels=%E5%91%A8%E4%B8%80%2C%E5%91%A8%E4%BA%8C%2C%E5%91%A8%E4%B8%89%2C%E5%91%A8%E5%9B%9B&series=%E7%BD%91%E7%AB%99%3A30%2C42%2C38%2C50&series=cli:12,18,9,14&title=%E6%B3%A8%E5%86%8C%E9%87%8F
```

[![双系列面积（默认 evil）](https://x-cmd.com/draw?type=area&labels=%E5%91%A8%E4%B8%80%2C%E5%91%A8%E4%BA%8C%2C%E5%91%A8%E4%B8%89%2C%E5%91%A8%E5%9B%9B&series=%E7%BD%91%E7%AB%99%3A30%2C42%2C38%2C50&series=cli:12,18,9,14&title=%E6%B3%A8%E5%86%8C%E9%87%8F)](https://x-cmd.com/draw/explore?type=area&labels=%E5%91%A8%E4%B8%80%2C%E5%91%A8%E4%BA%8C%2C%E5%91%A8%E4%B8%89%2C%E5%91%A8%E5%9B%9B&series=%E7%BD%91%E7%AB%99%3A30%2C42%2C38%2C50&series=cli:12,18,9,14&title=%E6%B3%A8%E5%86%8C%E9%87%8F)

**单系列面积**

```text
https://x-cmd.com/draw?type=area&labels=1%E6%9C%88%2C2%E6%9C%88%2C3%E6%9C%88%2C4%E6%9C%88%2C5%E6%9C%88%2C6%E6%9C%88&values=10,30,25,50,40,70&title=%E7%B4%AF%E8%AE%A1
```

[![单系列面积](https://x-cmd.com/draw?type=area&labels=1%E6%9C%88%2C2%E6%9C%88%2C3%E6%9C%88%2C4%E6%9C%88%2C5%E6%9C%88%2C6%E6%9C%88&values=10,30,25,50,40,70&title=%E7%B4%AF%E8%AE%A1)](https://x-cmd.com/draw/explore?type=area&labels=1%E6%9C%88%2C2%E6%9C%88%2C3%E6%9C%88%2C4%E6%9C%88%2C5%E6%9C%88%2C6%E6%9C%88&values=10,30,25,50,40,70&title=%E7%B4%AF%E8%AE%A1)

**手绘风（t=star）**

```text
https://x-cmd.com/draw?type=area&t=star&labels=%E5%91%A8%E4%B8%80%2C%E5%91%A8%E4%BA%8C%2C%E5%91%A8%E4%B8%89%2C%E5%91%A8%E5%9B%9B&values=3,5,4,6&title=%E5%BF%83%E6%83%85
```

[![手绘风（t=star）](https://x-cmd.com/draw?type=area&t=star&labels=%E5%91%A8%E4%B8%80%2C%E5%91%A8%E4%BA%8C%2C%E5%91%A8%E4%B8%89%2C%E5%91%A8%E5%9B%9B&values=3,5,4,6&title=%E5%BF%83%E6%83%85)](https://x-cmd.com/draw/explore?type=area&t=star&labels=%E5%91%A8%E4%B8%80%2C%E5%91%A8%E4%BA%8C%2C%E5%91%A8%E4%B8%89%2C%E5%91%A8%E5%9B%9B&values=3,5,4,6&title=%E5%BF%83%E6%83%85)

**编辑式（t=opendata, source=）**

```text
https://x-cmd.com/draw?type=area&t=opendata&labels=2019,2020,2021,2022,2023,2024&values=1.2,2.8,6.4,14.1,28.6,51.0&title=AI%20%E6%99%AE%E5%8F%8A%E5%BA%A6&source=internal%20survey
```

[![编辑式（t=opendata, source=）](https://x-cmd.com/draw?type=area&t=opendata&labels=2019,2020,2021,2022,2023,2024&values=1.2,2.8,6.4,14.1,28.6,51.0&title=AI%20%E6%99%AE%E5%8F%8A%E5%BA%A6&source=internal%20survey)](https://x-cmd.com/draw/explore?type=area&t=opendata&labels=2019,2020,2021,2022,2023,2024&values=1.2,2.8,6.4,14.1,28.6,51.0&title=AI%20%E6%99%AE%E5%8F%8A%E5%BA%A6&source=internal%20survey)

**像素（t=pixel）**

```text
https://x-cmd.com/draw?type=area&t=pixel&labels=a,b,c,d,e&values=2,4,3,5,4&title=%E8%B4%9F%E8%BD%BD
```

[![像素（t=pixel）](https://x-cmd.com/draw?type=area&t=pixel&labels=a,b,c,d,e&values=2,4,3,5,4&title=%E8%B4%9F%E8%BD%BD)](https://x-cmd.com/draw/explore?type=area&t=pixel&labels=a,b,c,d,e&values=2,4,3,5,4&title=%E8%B4%9F%E8%BD%BD)

---

折线 + 下方填充，**强调累积 / 总量**（区别于 line 的"瞬时值"）。

参数与 `line` 完全相同：x / y / series / title / unit。

---



---

## area vs line

- **line**：突出每个时间点的**值**
- **area**：突出**累积**或**整体规模**

堆叠 area 特别适合看"占比随时间的变化"。