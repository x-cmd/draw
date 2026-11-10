---
x-title: Finance — allocation, risk and the deal funnel
x-desc: 'x-cmd/draw showcase: finance. Real URLs for asset allocation, return against benchmark, return against risk, revenue and margin, the four options for a business line and the deal funnel.'
x-sidebar: draw showcase finance
x-keywords: finance chart, portfolio report, risk chart, draw showcase, svg
x-json-ld:
  '@context': https://schema.org
  '@graph':
    - '@type': TechArticle
      headline: 'draw showcase finance'
      inLanguage: 'en'
      about: 'x-cmd/draw showcase 09-finance'
---

# Finance — allocation, risk and the deal funnel

The charts a quarterly investment review is made of, and the one diagram
that decides what happens to a business line.

### Asset allocation — the split

```text
https://x-cmd.com/draw?type=pie&t=market-mono&title=Asset%20allocation&labels=Equities,Bonds,Cash,Real%20estate,Commodities&values=42,28,12,10,8&unit=%25
```

[![Asset allocation](https://x-cmd.com/draw?type=pie&t=market-mono&title=Asset%20allocation&labels=Equities,Bonds,Cash,Real%20estate,Commodities&values=42,28,12,10,8&unit=%25)](https://x-cmd.com/draw/explore?type=pie&t=market-mono&title=Asset%20allocation&labels=Equities,Bonds,Cash,Real%20estate,Commodities&values=42,28,12,10,8&unit=%25)

One ring, five buckets; the grayscale style prints.

### Cumulative return against the benchmark

```text
https://x-cmd.com/draw?type=line&title=Cumulative%20return%20vs%20benchmark&labels=Jan,Feb,Mar,Apr,May,Jun,Jul,Aug,Sep,Oct,Nov,Dec&series=portfolio:100,102,105,106,109,108,110,113,112,115,117,120&series=benchmark:100,101,104,105,107,106,107,109,109,111,112,114&unit=index
```

[![Cumulative return vs benchmark](https://x-cmd.com/draw?type=line&title=Cumulative%20return%20vs%20benchmark&labels=Jan,Feb,Mar,Apr,May,Jun,Jul,Aug,Sep,Oct,Nov,Dec&series=portfolio:100,102,105,106,109,108,110,113,112,115,117,120&series=benchmark:100,101,104,105,107,106,107,109,109,111,112,114&unit=index)](https://x-cmd.com/draw/explore?type=line&title=Cumulative%20return%20vs%20benchmark&labels=Jan,Feb,Mar,Apr,May,Jun,Jul,Aug,Sep,Oct,Nov,Dec&series=portfolio:100,102,105,106,109,108,110,113,112,115,117,120&series=benchmark:100,101,104,105,107,106,107,109,109,111,112,114&unit=index)

Two lines that mostly overlap — the portfolio adds a little.

### Return against risk — where the efficient edge is

```text
https://x-cmd.com/draw?type=scatter&title=Return%20vs%20volatility&x=6,8,11,14,17,21,25,29&y=3,5,9,12,18,24,31,38&title=Return%20against%20risk
```

[![Return vs risk](https://x-cmd.com/draw?type=scatter&title=Return%20vs%20volatility&x=6,8,11,14,17,21,25,29&y=3,5,9,12,18,24,31,38&title=Return%20against%20risk)](https://x-cmd.com/draw/explore?type=scatter&title=Return%20vs%20volatility&x=6,8,11,14,17,21,25,29&y=3,5,9,12,18,24,31,38&title=Return%20against%20risk)

Each point is a portfolio; the upper-left ones are the efficient ones.

### Revenue and margin — the pair the board asks for

```text
https://x-cmd.com/draw?type=combo&t=evil&title=Revenue%20%26%20margin&labels=Q1,Q2,Q3,Q4&series=revenue:1200,1800,1500,2400&line=margin:5,8,6,12
```

[![Revenue and margin](https://x-cmd.com/draw?type=combo&t=evil&title=Revenue%20%26%20margin&labels=Q1,Q2,Q3,Q4&series=revenue:1200,1800,1500,2400&line=margin:5,8,6,12)](https://x-cmd.com/draw/explore?type=combo&t=evil&title=Revenue%20%26%20margin&labels=Q1,Q2,Q3,Q4&series=revenue:1200,1800,1500,2400&line=margin:5,8,6,12)

Columns for revenue, a line for margin.

### The four options for a business line

```text
https://x-cmd.com/draw?type=compass&title=Four%20options%20for%20a%20business%20unit&center=Core%20business&up=Invest%3A%20grow%20share&right=Hold%3A%20protect%20cash&down=Shrink%3A%20cut%20cost&left=Exit%3A%20free%20resources
```

[![Four options](https://x-cmd.com/draw?type=compass&title=Four%20options%20for%20a%20business%20unit&center=Core%20business&up=Invest%3A%20grow%20share&right=Hold%3A%20protect%20cash&down=Shrink%3A%20cut%20cost&left=Exit%3A%20free%20resources)](https://x-cmd.com/draw/explore?type=compass&title=Four%20options%20for%20a%20business%20unit&center=Core%20business&up=Invest%3A%20grow%20share&right=Hold%3A%20protect%20cash&down=Shrink%3A%20cut%20cost&left=Exit%3A%20free%20resources)

The compass: invest, hold, shrink or exit, radiating from the middle.

### The deal funnel — where it leaks

```text
https://x-cmd.com/draw?type=sankey&t=fund&title=Deal%20funnel&labels=Leads,Qualified,Pitch,DueDiligence,Closed&links=Leads>Qualified:180;Leads>Pitch:40;Qualified>Pitch:90;Pitch>DueDiligence:45;DueDiligence>Closed:22
```

[![Deal funnel](https://x-cmd.com/draw?type=sankey&t=fund&title=Deal%20funnel&labels=Leads,Qualified,Pitch,DueDiligence,Closed&links=Leads>Qualified:180;Leads>Pitch:40;Qualified>Pitch:90;Pitch>DueDiligence:45;DueDiligence>Closed:22)](https://x-cmd.com/draw/explore?type=sankey&t=fund&title=Deal%20funnel&labels=Leads,Qualified,Pitch,DueDiligence,Closed&links=Leads>Qualified:180;Leads>Pitch:40;Qualified>Pitch:90;Pitch>DueDiligence:45;DueDiligence>Closed:22)

Where the pipeline narrows, and by how much.


## Which chart for what

| question | chart | reference |
|---|---|---|
| How is the portfolio split? | pie | [pie](../../2-data-charts/01-pie/en.md) |
| Are we beating the benchmark? | line | [line](../../2-data-charts/04-line/en.md) |
| What do we get for the risk? | scatter | [scatter](../../2-data-charts/08-scatter/en.md) |
| Revenue and margin together | combo | [combo](../../2-data-charts/09-combo/en.md) |
| What do we do with this line? | compass | [compass](../../4-strategy/02-compass/en.md) |
| Where does the pipeline leak? | sankey | [sankey](../../3-relations/01-sankey/en.md) |
