---
x-title: Product and roadmap — what you build, when, and what first
x-desc: 'x-cmd/draw showcase: product and roadmap. Real URLs for the product mind map, the launch checklist, a sprint plan on a Gantt chart, a roadmap by quarter and a prioritisation quadrant.'
x-sidebar: draw showcase product roadmap
x-keywords: roadmap chart, gantt chart, product map, draw showcase, svg
x-json-ld:
  '@context': https://schema.org
  '@graph':
    - '@type': TechArticle
      headline: 'draw showcase product roadmap'
      inLanguage: 'en'
      about: 'x-cmd/draw showcase 05-product-roadmap'
---

# Product and roadmap — what you build, when, and what first

The three artefacts a product team keeps redrawing: the map, the schedule and
the priority order.

### The product map — what exists and where

```text
https://x-cmd.com/draw/mindmap?n=Product/Features/Speed&n=Product/Features/Privacy&n=Product/Features/Integrations&n=Product/Markets/EU&n=Product/Markets/US&n=Product/Pricing/Free&n=Product/Pricing/Pro&style=bubble&title=Product%20map&w=560
```

[![Product map](https://x-cmd.com/draw/mindmap?n=Product/Features/Speed&n=Product/Features/Privacy&n=Product/Features/Integrations&n=Product/Markets/EU&n=Product/Markets/US&n=Product/Pricing/Free&n=Product/Pricing/Pro&style=bubble&title=Product%20map&w=560)](https://x-cmd.com/draw/explore/mindmap?n=Product/Features/Speed&n=Product/Features/Privacy&n=Product/Features/Integrations&n=Product/Markets/EU&n=Product/Markets/US&n=Product/Pricing/Free&n=Product/Pricing/Pro&style=bubble&title=Product%20map&w=560)

Features, markets and pricing as one tree — the bubble style suits the many short labels.

### The launch checklist — who owns what

```text
https://x-cmd.com/draw/mindmap?n=Launch/Legal/Privacy%20check&n=Launch/Eng/Tests&n=Launch/Eng/Perf&n=Launch/Docs/Changelog&n=Launch/Docs/Post%20copy&style=tree&title=Launch%20checklist&w=560
```

[![Launch checklist](https://x-cmd.com/draw/mindmap?n=Launch/Legal/Privacy%20check&n=Launch/Eng/Tests&n=Launch/Eng/Perf&n=Launch/Docs/Changelog&n=Launch/Docs/Post%20copy&style=tree&title=Launch%20checklist&w=560)](https://x-cmd.com/draw/explore/mindmap?n=Launch/Legal/Privacy%20check&n=Launch/Eng/Tests&n=Launch/Eng/Perf&n=Launch/Docs/Changelog&n=Launch/Docs/Post%20copy&style=tree&title=Launch%20checklist&w=560)

The same engine, the tree style: tasks grouped by team.

### The sprint plan — the schedule

```text
https://x-cmd.com/draw/gantt?m=dateFormat%20YYYY-MM-DD%0A%20%20section%20Dev%0A%20%20Design%20%3Adone%2C%20a1%2C%202026-11-01%2C%203d%0A%20%20Build%20%3Aactive%2C%20a2%2C%20after%20a1%2C%205d%0A%20%20Ship%20%3Amilestone%2C%20m1%2C%202026-11-10%2C%200d%0A%20%20section%20QA%0A%20%20Regression%20%3Acrit%2C%20b1%2C%20after%20a2%2C%203d&title=Sprint%20plan&w=560
```

[![Sprint plan](https://x-cmd.com/draw/gantt?m=dateFormat%20YYYY-MM-DD%0A%20%20section%20Dev%0A%20%20Design%20%3Adone%2C%20a1%2C%202026-11-01%2C%203d%0A%20%20Build%20%3Aactive%2C%20a2%2C%20after%20a1%2C%205d%0A%20%20Ship%20%3Amilestone%2C%20m1%2C%202026-11-10%2C%200d%0A%20%20section%20QA%0A%20%20Regression%20%3Acrit%2C%20b1%2C%20after%20a2%2C%203d&title=Sprint%20plan&w=560)](https://x-cmd.com/draw/explore/gantt?m=dateFormat%20YYYY-MM-DD%0A%20%20section%20Dev%0A%20%20Design%20%3Adone%2C%20a1%2C%202026-11-01%2C%203d%0A%20%20Build%20%3Aactive%2C%20a2%2C%20after%20a1%2C%205d%0A%20%20Ship%20%3Amilestone%2C%20m1%2C%202026-11-10%2C%200d%0A%20%20section%20QA%0A%20%20Regression%20%3Acrit%2C%20b1%2C%20after%20a2%2C%203d&title=Sprint%20plan&w=560)

Sections, tasks, dependencies and a milestone — all of it in six lines of text.

### The roadmap by quarter — shipped against planned

```text
https://x-cmd.com/draw?type=bar&labels=Q1,Q2,Q3,Q4&series=shipped:12,18,9,15&series=planned:20,22,14,10&stack=1&title=Roadmap%20by%20quarter
```

[![Roadmap by quarter](https://x-cmd.com/draw?type=bar&labels=Q1,Q2,Q3,Q4&series=shipped:12,18,9,15&series=planned:20,22,14,10&stack=1&title=Roadmap%20by%20quarter)](https://x-cmd.com/draw/explore?type=bar&labels=Q1,Q2,Q3,Q4&series=shipped:12,18,9,15&series=planned:20,22,14,10&stack=1&title=Roadmap%20by%20quarter)

A stacked bar: what is already out against what is still planned.

### Prioritisation — value against cost

```text
https://x-cmd.com/draw?type=quadrant&frame=cross&title=Initiative%20priority&ylabel=Strategic%20value&xlabel=Cost%20to%20deliver&ylow=Low&yhigh=High&xlow=Low&xhigh=High&items=Platform%20rebuild%400.22%2C0.86%3BAI%20support%400.42%2C0.62%3BChannel%20partnerships%400.72%2C0.44%3BBrand%20campaigns%400.84%2C0.26
```

[![Initiative priority](https://x-cmd.com/draw?type=quadrant&frame=cross&title=Initiative%20priority&ylabel=Strategic%20value&xlabel=Cost%20to%20deliver&ylow=Low&yhigh=High&xlow=Low&xhigh=High&items=Platform%20rebuild%400.22%2C0.86%3BAI%20support%400.42%2C0.62%3BChannel%20partnerships%400.72%2C0.44%3BBrand%20campaigns%400.84%2C0.26)](https://x-cmd.com/draw/explore?type=quadrant&frame=cross&title=Initiative%20priority&ylabel=Strategic%20value&xlabel=Cost%20to%20deliver&ylow=Low&yhigh=High&xlow=Low&xhigh=High&items=Platform%20rebuild%400.22%2C0.86%3BAI%20support%400.42%2C0.62%3BChannel%20partnerships%400.72%2C0.44%3BBrand%20campaigns%400.84%2C0.26)

Every initiative is one point: strategic value up, investment cost across.


## Which chart for what

| question | chart | reference |
|---|---|---|
| What exists, and how it hangs together? | mind map | [mindmap](../../5-architecture/02-mindmap/en.md) |
| Who owns which task? | mind map | [mindmap](../../5-architecture/02-mindmap/en.md) |
| When does each piece ship? | Gantt chart | [gantt](../../6-schedule/01-gantt/en.md) |
| Shipped against planned? | bar | [bar](../../2-data-charts/02-bar/en.md) |
| What do we do first? | quadrant | [quadrant](../../4-strategy/01-quadrant/en.md) |
