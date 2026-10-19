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

## 示例（URL 即所得，点击图片放大）

**双系列面积（默认 evil）**

```text
https://x-cmd.com/draw?type=area&labels=Mon,Tue,Wed,Thu&series=web:30,42,38,50&series=cli:12,18,9,14&title=Signups
```

![双系列面积（默认 evil）](https://x-cmd.com/draw?type=area&labels=Mon,Tue,Wed,Thu&series=web:30,42,38,50&series=cli:12,18,9,14&title=Signups)

**单系列面积**

```text
https://x-cmd.com/draw?type=area&labels=Jan,Feb,Mar,Apr,May,Jun&values=10,30,25,50,40,70&title=Cumulative
```

![单系列面积](https://x-cmd.com/draw?type=area&labels=Jan,Feb,Mar,Apr,May,Jun&values=10,30,25,50,40,70&title=Cumulative)

**手绘风（t=star）**

```text
https://x-cmd.com/draw?type=area&t=star&labels=Mon,Tue,Wed,Thu&values=3,5,4,6&title=Mood
```

![手绘风（t=star）](https://x-cmd.com/draw?type=area&t=star&labels=Mon,Tue,Wed,Thu&values=3,5,4,6&title=Mood)

**编辑式（t=opendata, source=）**

```text
https://x-cmd.com/draw?type=area&t=opendata&labels=2019,2020,2021,2022,2023,2024&values=1.2,2.8,6.4,14.1,28.6,51.0&title=AI%20adoption&source=internal%20survey
```

![编辑式（t=opendata, source=）](https://x-cmd.com/draw?type=area&t=opendata&labels=2019,2020,2021,2022,2023,2024&values=1.2,2.8,6.4,14.1,28.6,51.0&title=AI%20adoption&source=internal%20survey)

**像素（t=pixel）**

```text
https://x-cmd.com/draw?type=area&t=pixel&labels=a,b,c,d,e&values=2,4,3,5,4&title=Load
```

![像素（t=pixel）](https://x-cmd.com/draw?type=area&t=pixel&labels=a,b,c,d,e&values=2,4,3,5,4&title=Load)

---

折线 + 下方填充，**强调累积 / 总量**（区别于 line 的"瞬时值"）。

参数与 `line` 完全相同：x / y / series / title / unit。

---



---

## area vs line

- **line**：突出每个时间点的**值**
- **area**：突出**累积**或**整体规模**

堆叠 area 特别适合看"占比随时间的变化"。