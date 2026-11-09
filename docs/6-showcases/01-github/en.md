---
x-title: GitHub and open source — the charts a repo owner actually needs
x-desc: 'x-cmd/draw showcase: GitHub and open source. Real URLs for stars by language, the contributor funnel, commits by day, issues by area, the repo mind map and an install QR code.'
x-sidebar: draw showcase github
x-keywords: github chart, github dashboard, draw showcase, svg, open source metrics
x-json-ld:
  '@context': https://schema.org
  '@graph':
    - '@type': TechArticle
      headline: 'draw showcase github'
      inLanguage: 'en'
      about: 'x-cmd/draw showcase 01-github'
---

# GitHub and open source — the charts a repo owner actually needs

What a maintainer, a conference speaker or a README author needs to show about a project —
and the URL that renders each one.

### Stars by language — the share

```text
https://x-cmd.com/draw?type=pie&t=market-mono&title=Stars%20by%20language&labels=TypeScript,Python,Go,Rust,Java&values=4821,2312,980,645,520
```

[![Stars by language](https://x-cmd.com/draw?type=pie&t=market-mono&title=Stars%20by%20language&labels=TypeScript,Python,Go,Rust,Java&values=4821,2312,980,645,520)](https://x-cmd.com/draw/explore?type=pie&t=market-mono&title=Stars%20by%20language&labels=TypeScript,Python,Go,Rust,Java&values=4821,2312,980,645,520)

A donut answers “what share of the stars sits in each language” in one glance.

### The same numbers as a ranking — the count

```text
https://x-cmd.com/draw?type=hbar&title=Stars%20by%20language&labels=TypeScript,Python,Go,Rust,Java&values=4821,2312,980,645,520&unit=stars
```

[![Stars by language](https://x-cmd.com/draw?type=hbar&title=Stars%20by%20language&labels=TypeScript,Python,Go,Rust,Java&values=4821,2312,980,645,520&unit=stars)](https://x-cmd.com/draw/explore?type=hbar&title=Stars%20by%20language&labels=TypeScript,Python,Go,Rust,Java&values=4821,2312,980,645,520&unit=stars)

Horizontal bars put the labels on the left and the counts on the right — better when the
names are long or you want to read the exact numbers.

### The contributor funnel — where readers drop off

```text
https://x-cmd.com/draw?type=sankey&t=fund&title=Contributor%20funnel&labels=Docs,Blog,Talks,Issue,PR,Merged&links=Docs>Issue:40;Blog>Issue:25;Talks>Issue:15;Issue>PR:32;PR>Merged:18
```

[![Contributor funnel](https://x-cmd.com/draw?type=sankey&t=fund&title=Contributor%20funnel&labels=Docs,Blog,Talks,Issue,PR,Merged&links=Docs>Issue:40;Blog>Issue:25;Talks>Issue:15;Issue>PR:32;PR>Merged:18)](https://x-cmd.com/draw/explore?type=sankey&t=fund&title=Contributor%20funnel&labels=Docs,Blog,Talks,Issue,PR,Merged&links=Docs>Issue:40;Blog>Issue:25;Talks>Issue:15;Issue>PR:32;PR>Merged:18)

A Sankey shows the whole chain — read → star → fork → PR → merged — and where it narrows.

### Commits by day — who works when

```text
https://x-cmd.com/draw?type=bar&labels=Mon,Tue,Wed,Thu,Fri,Sat,Sun&series=dev:12,18,9,15,21,8,17&series=ci:8,11,6,13,16,5,12&title=Commits%20by%20day
```

[![Commits by day](https://x-cmd.com/draw?type=bar&labels=Mon,Tue,Wed,Thu,Fri,Sat,Sun&series=dev:12,18,9,15,21,8,17&series=ci:8,11,6,13,16,5,12&title=Commits%20by%20day)](https://x-cmd.com/draw/explore?type=bar&labels=Mon,Tue,Wed,Thu,Fri,Sat,Sun&series=dev:12,18,9,15,21,8,17&series=ci:8,11,6,13,16,5,12&title=Commits%20by%20day)

Two series (feature work and CI) per weekday; a grouped bar keeps the comparison honest.

### Stars over time — the growth curve

```text
https://x-cmd.com/draw?type=area&t=star&labels=Jan,Feb,Mar,Apr,May,Jun,Jul&values=120,180,150,260,310,420,560&title=Stars%20over%20time
```

[![Stars over time](https://x-cmd.com/draw?type=area&t=star&labels=Jan,Feb,Mar,Apr,May,Jun,Jul&values=120,180,150,260,310,420,560&title=Stars%20over%20time)](https://x-cmd.com/draw/explore?type=area&t=star&labels=Jan,Feb,Mar,Apr,May,Jun,Jul&values=120,180,150,260,310,420,560&title=Stars%20over%20time)

The area style fills under the line, which reads well for a cumulative number like stars.

### Issues by area — open against closed

```text
https://x-cmd.com/draw?type=hbar&t=xcmd-issue&labels=cli,core,docs,ci,ui&series=open:12,8,15,4,9&series=closed:38,52,20,11,26&title=Issues%20by%20area
```

[![Issues by area](https://x-cmd.com/draw?type=hbar&t=xcmd-issue&labels=cli,core,docs,ci,ui&series=open:12,8,15,4,9&series=closed:38,52,20,11,26&title=Issues%20by%20area)](https://x-cmd.com/draw/explore?type=hbar&t=xcmd-issue&labels=cli,core,docs,ci,ui&series=open:12,8,15,4,9&series=closed:38,52,20,11,26&title=Issues%20by%20area)

Two series per area, one bar each: what is still open against what is already done.

### The repo map — what lives where

```text
https://x-cmd.com/draw/mindmap?n=draw/Charts/Pie&n=draw/Charts/Bar%20and%20Line&n=draw/Charts/Sankey&n=draw/Arch/Archmap&n=draw/Arch/Mindmap&n=draw/Ecosystem/Skill&n=draw/Ecosystem/Data%20link&w=560
```

[![draw feature map](https://x-cmd.com/draw/mindmap?n=draw/Charts/Pie&n=draw/Charts/Bar%20and%20Line&n=draw/Charts/Sankey&n=draw/Arch/Archmap&n=draw/Arch/Mindmap&n=draw/Ecosystem/Skill&n=draw/Ecosystem/Data%20link&w=560)](https://x-cmd.com/draw/explore/mindmap?n=draw/Charts/Pie&n=draw/Charts/Bar%20and%20Line&n=draw/Charts/Sankey&n=draw/Arch/Archmap&n=draw/Arch/Mindmap&n=draw/Ecosystem/Skill&n=draw/Ecosystem/Data%20link&w=560)

A mind map of the repository: the features, the drawing kinds, the ecosystem.

### A QR to the repo — for slides and print

```text
https://x-cmd.com/draw?type=qr&d=https://github.com/x-cmd/draw&title=scan%20me
```

[![QR code](https://x-cmd.com/draw?type=qr&d=https://github.com/x-cmd/draw&title=scan%20me)](https://x-cmd.com/draw/explore?type=qr&d=https://github.com/x-cmd/draw&title=scan%20me)

A QR code pointing at the repository, straight into a slide.


## Which chart for what

| question | chart | reference |
|---|---|---|
| Which languages do people use? | pie | [pie](../../2-chart-types/01-data-charts/01-pie/en.md) |
| Who ranks highest, with long labels? | hbar | [hbar](../../2-chart-types/01-data-charts/03-hbar/en.md) |
| Where do readers drop off? | sankey | [sankey](../../2-chart-types/02-relations/01-sankey/en.md) |
| How much work happens each day? | bar | [bar](../../2-chart-types/01-data-charts/02-bar/en.md) |
| How fast is it growing? | area | [area](../../2-chart-types/01-data-charts/05-area/en.md) |
| What is still open? | hbar | [hbar](../../2-chart-types/01-data-charts/03-hbar/en.md) |
| What lives where in the repo? | mind map | [mindmap](../../2-chart-types/04-architecture/02-mindmap/en.md) |
| How do people install it? | QR code | [qr](../../2-chart-types/06-infographics/01-qr/en.md) |
