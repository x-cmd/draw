---
x-title: Analysis reports — the numbers a report is made of
x-desc: 'x-cmd/draw showcase: analysis reports. Real URLs for latency against load, the CI pass rate gauge, a radar scorecard, volume against rate, revenue against margin, and test duration spread.'
x-sidebar: draw showcase analysis report
x-keywords: analysis report chart, dashboard, draw showcase, svg, metrics
x-json-ld:
  '@context': https://schema.org
  '@graph':
    - '@type': TechArticle
      headline: 'draw showcase analysis report'
      inLanguage: 'en'
      about: 'x-cmd/draw showcase 02-analysis-report'
---

# Analysis reports — the numbers a report is made of

The handful of shapes a quarterly report, a health dashboard or a design review
keeps reaching for.

### Latency against load — where the curve bends

```text
https://x-cmd.com/draw?type=scatter&x=5,12,18,25,31,38,44,52,58,63,71,78,84,92&y=42,38,51,47,60,55,68,63,75,70,82,78,90,86&title=Latency%20vs%20load
```

[![Latency vs load](https://x-cmd.com/draw?type=scatter&x=5,12,18,25,31,38,44,52,58,63,71,78,84,92&y=42,38,51,47,60,55,68,63,75,70,82,78,90,86&title=Latency%20vs%20load)](https://x-cmd.com/draw/explore?type=scatter&x=5,12,18,25,31,38,44,52,58,63,71,78,84,92&y=42,38,51,47,60,55,68,63,75,70,82,78,90,86&title=Latency%20vs%20load)

Every point is one measurement; the shape of the cloud tells you whether latency
degrades gracefully or falls off a cliff.

### One number, right now — the CI pass rate

```text
https://x-cmd.com/draw?type=gauge&title=CI%20pass%20rate&value=87&max=100
```

[![CI pass rate](https://x-cmd.com/draw?type=gauge&title=CI%20pass%20rate&value=87&max=100)](https://x-cmd.com/draw/explore?type=gauge&title=CI%20pass%20rate&value=87&max=100)

A gauge is the right shape for a single figure you want read at a glance.

### A scorecard — five axes, one picture

```text
https://x-cmd.com/draw?type=radar&title=Build%20quality&labels=Speed,Tests,Coverage,Docs,Release&values=7,8,6,7,9
```

[![Build quality](https://x-cmd.com/draw?type=radar&title=Build%20quality&labels=Speed,Tests,Coverage,Docs,Release&values=7,8,6,7,9)](https://x-cmd.com/draw/explore?type=radar&title=Build%20quality&labels=Speed,Tests,Coverage,Docs,Release&values=7,8,6,7,9)

Radar for a profile: speed, tests, coverage, docs, release — one picture instead of a table.

### Volume and rate — two measures, one chart

```text
https://x-cmd.com/draw?type=combo&title=Downloads%20%26%20growth&labels=Jan,Feb,Mar,Apr,May,Jun,Jul,Aug,Sep,Oct,Nov,Dec&series=downloads:900,1200,1050,1600,1400,1800,2100,1950,2200,2500,2300,2700&line=growth:5,8,6,12,10,15,18,16,20,23,21,26
```

[![Downloads and growth](https://x-cmd.com/draw?type=combo&title=Downloads%20%26%20growth&labels=Jan,Feb,Mar,Apr,May,Jun,Jul,Aug,Sep,Oct,Nov,Dec&series=downloads:900,1200,1050,1600,1400,1800,2100,1950,2200,2500,2300,2700&line=growth:5,8,6,12,10,15,18,16,20,23,21,26)](https://x-cmd.com/draw/explore?type=combo&title=Downloads%20%26%20growth&labels=Jan,Feb,Mar,Apr,May,Jun,Jul,Aug,Sep,Oct,Nov,Dec&series=downloads:900,1200,1050,1600,1400,1800,2100,1950,2200,2500,2300,2700&line=growth:5,8,6,12,10,15,18,16,20,23,21,26)

Bars for the absolute count, the line for the rate — the combo chart keeps both in one frame.

### Revenue and margin — the classic pair

```text
https://x-cmd.com/draw?type=combo&t=evil&title=Revenue%20%26%20margin&labels=Q1,Q2,Q3,Q4&series=revenue:1200,1800,1500,2400&line=margin:5,8,6,12
```

[![Revenue and margin](https://x-cmd.com/draw?type=combo&t=evil&title=Revenue%20%26%20margin&labels=Q1,Q2,Q3,Q4&series=revenue:1200,1800,1500,2400&line=margin:5,8,6,12)](https://x-cmd.com/draw/explore?type=combo&t=evil&title=Revenue%20%26%20margin&labels=Q1,Q2,Q3,Q4&series=revenue:1200,1800,1500,2400&line=margin:5,8,6,12)

The same combo shape, styled for print: revenue in columns, margin as a line.

### Test duration — spread, not just the average

```text
https://x-cmd.com/draw?type=hbar&t=rank&labels=unit,integration,e2e,docs&series=p50:12,34,88,6&series=p95:28,96,240,14&title=Test%20duration
```

[![Test duration](https://x-cmd.com/draw?type=hbar&t=rank&labels=unit,integration,e2e,docs&series=p50:12,34,88,6&series=p95:28,96,240,14&title=Test%20duration)](https://x-cmd.com/draw/explore?type=hbar&t=rank&labels=unit,integration,e2e,docs&series=p50:12,34,88,6&series=p95:28,96,240,14&title=Test%20duration)

Two bars per suite (p50 and p95) so the tail is visible next to the typical case.


## Which chart for what

| question | chart | reference |
|---|---|---|
| Does it degrade under load? | scatter | [scatter](../../2-data-charts/08-scatter/en.md) |
| What is the one number right now? | gauge | [gauge](../../2-data-charts/07-gauge/en.md) |
| How do we score on five axes? | radar | [radar](../../2-data-charts/06-radar/en.md) |
| A count and a rate together | combo | [combo](../../2-data-charts/09-combo/en.md) |
| A value and a percentage together | combo | [combo](../../2-data-charts/09-combo/en.md) |
| Median and tail | hbar | [hbar](../../2-data-charts/03-hbar/en.md) |
