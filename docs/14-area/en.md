---
x-title: area chart — line + fill, emphasizes accumulation
x-desc: x-cmd/draw `type=area` quick reference. Line + fill below, emphasizes accumulation / totals (vs line's "instantaneous"). Same params as line: x + y or series.
x-sidebar: draw area chart
x-keywords: area chart, draw, svg
x-json-ld:
  '@context': https://schema.org
  '@graph':
    - '@type': TechArticle
      headline: 'draw area chart'
      inLanguage: 'en'
      about: 'x-cmd/draw area chart'
---

# area chart — line + fill, emphasizes accumulation

## Examples (what you see is what the URL gives; click to enlarge)

**Two-series area (evil default)**

```text
https://x-cmd.com/draw?type=area&labels=Mon,Tue,Wed,Thu&series=web:30,42,38,50&series=cli:12,18,9,14&title=Signups
```

![Two-series area (evil default)](https://x-cmd.com/draw?type=area&labels=Mon,Tue,Wed,Thu&series=web:30,42,38,50&series=cli:12,18,9,14&title=Signups)

**Single series**

```text
https://x-cmd.com/draw?type=area&labels=Jan,Feb,Mar,Apr,May,Jun&values=10,30,25,50,40,70&title=Cumulative
```

![Single series](https://x-cmd.com/draw?type=area&labels=Jan,Feb,Mar,Apr,May,Jun&values=10,30,25,50,40,70&title=Cumulative)

**Hand-drawn (t=star)**

```text
https://x-cmd.com/draw?type=area&t=star&labels=Mon,Tue,Wed,Thu&values=3,5,4,6&title=Mood
```

![Hand-drawn (t=star)](https://x-cmd.com/draw?type=area&t=star&labels=Mon,Tue,Wed,Thu&values=3,5,4,6&title=Mood)

**Editorial (t=opendata, source=)**

```text
https://x-cmd.com/draw?type=area&t=opendata&labels=2019,2020,2021,2022,2023,2024&values=1.2,2.8,6.4,14.1,28.6,51.0&title=AI%20adoption&source=internal%20survey
```

![Editorial (t=opendata, source=)](https://x-cmd.com/draw?type=area&t=opendata&labels=2019,2020,2021,2022,2023,2024&values=1.2,2.8,6.4,14.1,28.6,51.0&title=AI%20adoption&source=internal%20survey)

**Pixel (t=pixel)**

```text
https://x-cmd.com/draw?type=area&t=pixel&labels=a,b,c,d,e&values=2,4,3,5,4&title=Load
```

![Pixel (t=pixel)](https://x-cmd.com/draw?type=area&t=pixel&labels=a,b,c,d,e&values=2,4,3,5,4&title=Load)

Line + fill below, **emphasizes accumulation / totals** (vs line's "instantaneous values").

Same params as `line`: x / y / series / title / unit.

---



---

## area vs line

- **line**: emphasizes **value at each time point**
- **area**: emphasizes **accumulation** or **overall magnitude**

Stacked area is especially good for "share changes over time".