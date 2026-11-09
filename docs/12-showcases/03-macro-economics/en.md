---
x-title: Macro economics — indicators, flows and maps
x-desc: 'x-cmd/draw showcase: macro economics. Real URLs for GDP per capita, inflation, unemployment, the policy rate, trade flows, the CPI basket and a regional GDP choropleth.'
x-sidebar: draw showcase macro economics
x-keywords: macro economics chart, gdp chart, inflation chart, draw showcase, svg
x-json-ld:
  '@context': https://schema.org
  '@graph':
    - '@type': TechArticle
      headline: 'draw showcase macro economics'
      inLanguage: 'en'
      about: 'x-cmd/draw showcase 03-macro-economics'
---

# Macro economics — indicators, flows and maps

The shapes that carry an economic brief: levels, rates, flows and geography.

### GDP per capita — the ranking

```text
https://x-cmd.com/draw?type=hbar&title=GDP%20per%20capita%202024&labels=Ireland,Switzerland,Singapore,United%20States,Japan,China&values=106000,100000,90500,87300,33800,12600&unit=USD
```

[![GDP per capita](https://x-cmd.com/draw?type=hbar&title=GDP%20per%20capita%202024&labels=Ireland,Switzerland,Singapore,United%20States,Japan,China&values=106000,100000,90500,87300,33800,12600&unit=USD)](https://x-cmd.com/draw/explore?type=hbar&title=GDP%20per%20capita%202024&labels=Ireland,Switzerland,Singapore,United%20States,Japan,China&values=106000,100000,90500,87300,33800,12600&unit=USD)

A horizontal bar, sorted, with the unit in the corner: the shape of the inequality
is the point, not the third decimal.

### Inflation — the trend line

```text
https://x-cmd.com/draw?type=line&title=Inflation%20rate&labels=2021,2022,2023,2024,2025,2026&values=4.7,8.0,4.1,2.9,2.4,2.2&unit=%25
```

[![Inflation rate](https://x-cmd.com/draw?type=line&title=Inflation%20rate&labels=2021,2022,2023,2024,2025,2026&values=4.7,8.0,4.1,2.9,2.4,2.2&unit=%25)](https://x-cmd.com/draw/explore?type=line&title=Inflation%20rate&labels=2021,2022,2023,2024,2025,2026&values=4.7,8.0,4.1,2.9,2.4,2.2&unit=%25)

A plain line for a rate over time. Add `unit=%25` and the axis carries the unit.

### Unemployment — the area under it

```text
https://x-cmd.com/draw?type=area&t=evil&title=Unemployment%20rate&labels=2021,2022,2023,2024,2025,2026&values=5.4,3.6,3.6,4.1,4.3,4.2&unit=%25
```

[![Unemployment rate](https://x-cmd.com/draw?type=area&t=evil&title=Unemployment%20rate&labels=2021,2022,2023,2024,2025,2026&values=5.4,3.6,3.6,4.1,4.3,4.2&unit=%25)](https://x-cmd.com/draw/explore?type=area&t=evil&title=Unemployment%20rate&labels=2021,2022,2023,2024,2025,2026&values=5.4,3.6,3.6,4.1,4.3,4.2&unit=%25)

The same numbers as a line, but filled — the shaded band reads as “how bad”, not just “how much”.

### The policy rate — where the committee moved

```text
https://x-cmd.com/draw?type=line&title=Policy%20rate&labels=2021,2022,2023,2024,2025,2026&values=0.25,4.50,5.50,5.00,4.25,3.75&unit=%25
```

[![Policy rate](https://x-cmd.com/draw?type=line&title=Policy%20rate&labels=2021,2022,2023,2024,2025,2026&values=0.25,4.50,5.50,5.00,4.25,3.75&unit=%25)](https://x-cmd.com/draw/explore?type=line&title=Policy%20rate&labels=2021,2022,2023,2024,2025,2026&values=0.25,4.50,5.50,5.00,4.25,3.75&unit=%25)

Flat-ish periods read clearly on a line; the label at each end does the rest.

### Trade flows — where the goods go

```text
https://x-cmd.com/draw?type=sankey&title=Trade%20flows&labels=China,ASEAN,EU,US&links=China>ASEAN:180;China>EU:210;China>US:140;ASEAN>US:60;EU>US:95
```

[![Trade flows](https://x-cmd.com/draw?type=sankey&title=Trade%20flows&labels=China,ASEAN,EU,US&links=China>ASEAN:180;China>EU:210;China>US:140;ASEAN>US:60;EU>US:95)](https://x-cmd.com/draw/explore?type=sankey&title=Trade%20flows&labels=China,ASEAN,EU,US&links=China>ASEAN:180;China>EU:210;China>US:140;ASEAN>US:60;EU>US:95)

A Sankey is the honest way to draw trade: the widths are the volumes.

### The CPI basket — what prices went up

```text
https://x-cmd.com/draw?type=pie&t=market-mono&title=CPI%20basket&labels=Housing,Food,Energy,Transport,Core&values=32,19,15,12,22&unit=%25
```

[![CPI basket](https://x-cmd.com/draw?type=pie&t=market-mono&title=CPI%20basket&labels=Housing,Food,Energy,Transport,Core&values=32,19,15,12,22&unit=%25)](https://x-cmd.com/draw/explore?type=pie&t=market-mono&title=CPI%20basket&labels=Housing,Food,Energy,Transport,Core&values=32,19,15,12,22&unit=%25)

The grayscale donut style prints cleanly in a black-and-white briefing.

### Regional GDP — the map

```text
https://x-cmd.com/draw/echarts?d=%7B%22title%22%3A%7B%22text%22%3A%22US%20states%20%C2%B7%20GDP%20per%20capita%202024%20%C2%B7%20thousand%20USD%22%7D%2C%22visualMap%22%3A%7B%22min%22%3A50%2C%22max%22%3A120%2C%22orient%22%3A%22horizontal%22%2C%22left%22%3A%22center%22%2C%22bottom%22%3A8%2C%22text%22%3A%5B%22high%22%2C%22low%22%5D%2C%22itemWidth%22%3A12%2C%22itemHeight%22%3A200%2C%22inRange%22%3A%7B%22color%22%3A%5B%22%23dbeafe%22%2C%22%2393c5fd%22%2C%22%233b82f6%22%2C%22%231d4ed8%22%5D%7D%7D%2C%22series%22%3A%5B%7B%22type%22%3A%22map%22%2C%22map%22%3A%22USA%22%2C%22roam%22%3Afalse%2C%22label%22%3A%7B%22show%22%3Atrue%2C%22fontSize%22%3A9%7D%2C%22labelLayout%22%3A%7B%22hideOverlap%22%3Atrue%7D%2C%22itemStyle%22%3A%7B%22areaColor%22%3A%22%23f1f5f9%22%2C%22borderColor%22%3A%22%23ffffff%22%2C%22borderWidth%22%3A0.6%7D%2C%22data%22%3A%5B%7B%22name%22%3A%22New%20York%22%2C%22value%22%3A117%7D%2C%7B%22name%22%3A%22Washington%22%2C%22value%22%3A108%7D%2C%7B%22name%22%3A%22California%22%2C%22value%22%3A103%7D%2C%7B%22name%22%3A%22Illinois%22%2C%22value%22%3A90%7D%2C%7B%22name%22%3A%22Texas%22%2C%22value%22%3A89%7D%2C%7B%22name%22%3A%22Florida%22%2C%22value%22%3A74%7D%2C%7B%22name%22%3A%22Mississippi%22%2C%22value%22%3A54%7D%5D%7D%5D%7D&w=760&h=520
```

[![US states · GDP per capita](https://x-cmd.com/draw/echarts?d=%7B%22title%22%3A%7B%22text%22%3A%22US%20states%20%C2%B7%20GDP%20per%20capita%202024%20%C2%B7%20thousand%20USD%22%7D%2C%22visualMap%22%3A%7B%22min%22%3A50%2C%22max%22%3A120%2C%22orient%22%3A%22horizontal%22%2C%22left%22%3A%22center%22%2C%22bottom%22%3A8%2C%22text%22%3A%5B%22high%22%2C%22low%22%5D%2C%22itemWidth%22%3A12%2C%22itemHeight%22%3A200%2C%22inRange%22%3A%7B%22color%22%3A%5B%22%23dbeafe%22%2C%22%2393c5fd%22%2C%22%233b82f6%22%2C%22%231d4ed8%22%5D%7D%7D%2C%22series%22%3A%5B%7B%22type%22%3A%22map%22%2C%22map%22%3A%22USA%22%2C%22roam%22%3Afalse%2C%22label%22%3A%7B%22show%22%3Atrue%2C%22fontSize%22%3A9%7D%2C%22labelLayout%22%3A%7B%22hideOverlap%22%3Atrue%7D%2C%22itemStyle%22%3A%7B%22areaColor%22%3A%22%23f1f5f9%22%2C%22borderColor%22%3A%22%23ffffff%22%2C%22borderWidth%22%3A0.6%7D%2C%22data%22%3A%5B%7B%22name%22%3A%22New%20York%22%2C%22value%22%3A117%7D%2C%7B%22name%22%3A%22Washington%22%2C%22value%22%3A108%7D%2C%7B%22name%22%3A%22California%22%2C%22value%22%3A103%7D%2C%7B%22name%22%3A%22Illinois%22%2C%22value%22%3A90%7D%2C%7B%22name%22%3A%22Texas%22%2C%22value%22%3A89%7D%2C%7B%22name%22%3A%22Florida%22%2C%22value%22%3A74%7D%2C%7B%22name%22%3A%22Mississippi%22%2C%22value%22%3A54%7D%5D%7D%5D%7D&w=760&h=520)](https://x-cmd.com/draw/explore/echarts?d=%7B%22title%22%3A%7B%22text%22%3A%22US%20states%20%C2%B7%20GDP%20per%20capita%202024%20%C2%B7%20thousand%20USD%22%7D%2C%22visualMap%22%3A%7B%22min%22%3A50%2C%22max%22%3A120%2C%22orient%22%3A%22horizontal%22%2C%22left%22%3A%22center%22%2C%22bottom%22%3A8%2C%22text%22%3A%5B%22high%22%2C%22low%22%5D%2C%22itemWidth%22%3A12%2C%22itemHeight%22%3A200%2C%22inRange%22%3A%7B%22color%22%3A%5B%22%23dbeafe%22%2C%22%2393c5fd%22%2C%22%233b82f6%22%2C%22%231d4ed8%22%5D%7D%7D%2C%22series%22%3A%5B%7B%22type%22%3A%22map%22%2C%22map%22%3A%22USA%22%2C%22roam%22%3Afalse%2C%22label%22%3A%7B%22show%22%3Atrue%2C%22fontSize%22%3A9%7D%2C%22labelLayout%22%3A%7B%22hideOverlap%22%3Atrue%7D%2C%22itemStyle%22%3A%7B%22areaColor%22%3A%22%23f1f5f9%22%2C%22borderColor%22%3A%22%23ffffff%22%2C%22borderWidth%22%3A0.6%7D%2C%22data%22%3A%5B%7B%22name%22%3A%22New%20York%22%2C%22value%22%3A117%7D%2C%7B%22name%22%3A%22Washington%22%2C%22value%22%3A108%7D%2C%7B%22name%22%3A%22California%22%2C%22value%22%3A103%7D%2C%7B%22name%22%3A%22Illinois%22%2C%22value%22%3A90%7D%2C%7B%22name%22%3A%22Texas%22%2C%22value%22%3A89%7D%2C%7B%22name%22%3A%22Florida%22%2C%22value%22%3A74%7D%2C%7B%22name%22%3A%22Mississippi%22%2C%22value%22%3A54%7D%5D%7D%5D%7D&w=760&h=520)

A choropleth over the GeoJSON that ships with the service — no map service, no API key.


## Which chart for what

| question | chart | reference |
|---|---|---|
| Which economies are richest? | hbar | [hbar](../../5-data-charts/03-hbar/en.md) |
| Is inflation coming down? | line | [line](../../5-data-charts/04-line/en.md) |
| How bad is the labour market? | area | [area](../../5-data-charts/05-area/en.md) |
| What did the central bank do? | line | [line](../../5-data-charts/04-line/en.md) |
| Where does the trade go? | sankey | [sankey](../../6-relations/01-sankey/en.md) |
| What is in the price basket? | pie | [pie](../../5-data-charts/01-pie/en.md) |
| How does it differ by region? | map | [maps](../../11-maps/01-maps/en.md) |
