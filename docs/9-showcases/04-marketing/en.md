---
x-title: Marketing — funnels, channels and the numbers behind them
x-desc: 'x-cmd/draw showcase: marketing. Real URLs for the signup funnel, browser market share, channel attribution, spend against ROI, the CAC trend and customer segments.'
x-sidebar: draw showcase marketing
x-keywords: marketing chart, funnel chart, campaign report, draw showcase, svg
x-json-ld:
  '@context': https://schema.org
  '@graph':
    - '@type': TechArticle
      headline: 'draw showcase marketing'
      inLanguage: 'en'
      about: 'x-cmd/draw showcase 04-marketing'
---

# Marketing — funnels, channels and the numbers behind them

The charts a growth or campaign review is assembled from.

### The signup funnel — where the budget leaks

```text
https://x-cmd.com/draw?type=sankey&t=fund&title=Signup%20funnel&labels=Ads,Web,Newsletter,Signup,Buy&links=Ads>Signup:30;Web>Signup:20;Newsletter>Signup:10;Signup>Buy:45
```

[![Signup funnel](https://x-cmd.com/draw?type=sankey&t=fund&title=Signup%20funnel&labels=Ads,Web,Newsletter,Signup,Buy&links=Ads>Signup:30;Web>Signup:20;Newsletter>Signup:10;Signup>Buy:45)](https://x-cmd.com/draw/explore?type=sankey&t=fund&title=Signup%20funnel&labels=Ads,Web,Newsletter,Signup,Buy&links=Ads>Signup:30;Web>Signup:20;Newsletter>Signup:10;Signup>Buy:45)

Traffic in from three channels, out to signups and purchases. The width of each band is
the number of people.

### Browser market share — the headline number

```text
https://x-cmd.com/draw?type=pie&t=evil&labels=Chrome,Safari,Firefox,Edge,Other&values=65,18,7,6,4&title=Browser%20market%20share
```

[![Browser market share](https://x-cmd.com/draw?type=pie&t=evil&labels=Chrome,Safari,Firefox,Edge,Other&values=65,18,7,6,4&title=Browser%20market%20share)](https://x-cmd.com/draw/explore?type=pie&t=evil&labels=Chrome,Safari,Firefox,Edge,Other&values=65,18,7,6,4&title=Browser%20market%20share)

The evil style: rounded sectors, values inside the ring.

### Channel attribution — this year against last

```text
https://x-cmd.com/draw?type=hbar&t=rank&labels=Ads,Email,Social,SEO,Referral&series=2025:42,31,18,9,6&series=2026:51,44,22,15,11&title=Signups%20by%20channel
```

[![Signups by channel](https://x-cmd.com/draw?type=hbar&t=rank&labels=Ads,Email,Social,SEO,Referral&series=2025:42,31,18,9,6&series=2026:51,44,22,15,11&title=Signups%20by%20channel)](https://x-cmd.com/draw/explore?type=hbar&t=rank&labels=Ads,Email,Social,SEO,Referral&series=2025:42,31,18,9,6&series=2026:51,44,22,15,11&title=Signups%20by%20channel)

Two bars per channel, this year and last. The rank style is built for exactly this.

### Spend and ROI — the pair the CFO asks for

```text
https://x-cmd.com/draw?type=combo&title=Spend%20%26%20ROI&labels=Jan,Feb,Mar,Apr,May,Jun&series=spend:120,140,135,160,175,190&line=roi:2.1,2.4,2.2,3.0,3.4,3.8
```

[![Spend and ROI](https://x-cmd.com/draw?type=combo&title=Spend%20%26%20ROI&labels=Jan,Feb,Mar,Apr,May,Jun&series=spend:120,140,135,160,175,190&line=roi:2.1,2.4,2.2,3.0,3.4,3.8)](https://x-cmd.com/draw/explore?type=combo&title=Spend%20%26%20ROI&labels=Jan,Feb,Mar,Apr,May,Jun&series=spend:120,140,135,160,175,190&line=roi:2.1,2.4,2.2,3.0,3.4,3.8)

Columns for the spend, a line for the return on it.

### Customer acquisition cost — is it coming down?

```text
https://x-cmd.com/draw?type=line&title=CAC%20trend&labels=Jan,Feb,Mar,Apr,May,Jun&values=68,72,65,61,58,54&unit=USD
```

[![CAC trend](https://x-cmd.com/draw?type=line&title=CAC%20trend&labels=Jan,Feb,Mar,Apr,May,Jun&values=68,72,65,61,58,54&unit=USD)](https://x-cmd.com/draw/explore?type=line&title=CAC%20trend&labels=Jan,Feb,Mar,Apr,May,Jun&values=68,72,65,61,58,54&unit=USD)

A single falling line is the most persuasive slide in a growth review.

### Segments — value against cost of service

```text
https://x-cmd.com/draw?type=quadrant&frame=cross&title=Customer%20tiers&ylabel=Cost&xlabel=Cost%20to%20act&ylow=Low&yhigh=High&xlow=Low&xhigh=High&items=Repeat%20buyers%400.32%2C0.78%3BNew%20customers%400.22%2C0.35%3BKey%20accounts%400.82%2C0.44%3BEstablished%20customers%400.55%2C0.88
```

[![Customer segments](https://x-cmd.com/draw?type=quadrant&frame=cross&title=Customer%20tiers&ylabel=Cost&xlabel=Cost%20to%20act&ylow=Low&yhigh=High&xlow=Low&xhigh=High&items=Repeat%20buyers%400.32%2C0.78%3BNew%20customers%400.22%2C0.35%3BKey%20accounts%400.82%2C0.44%3BEstablished%20customers%400.55%2C0.88)](https://x-cmd.com/draw/explore?type=quadrant&frame=cross&title=Customer%20tiers&ylabel=Cost&xlabel=Cost%20to%20act&ylow=Low&yhigh=High&xlow=Low&xhigh=High&items=Repeat%20buyers%400.32%2C0.78%3BNew%20customers%400.22%2C0.35%3BKey%20accounts%400.82%2C0.44%3BEstablished%20customers%400.55%2C0.88)

The cross frame: two axes, one point per segment, no boxes to fill in.


## Which chart for what

| question | chart | reference |
|---|---|---|
| Where do signups come from and where do they go? | sankey | [sankey](../../3-relations/01-sankey/en.md) |
| What is our share of the market? | pie | [pie](../../2-data-charts/01-pie/en.md) |
| Which channel is growing? | hbar | [hbar](../../2-data-charts/03-hbar/en.md) |
| What is the return on the spend? | combo | [combo](../../2-data-charts/09-combo/en.md) |
| Is acquisition getting cheaper? | line | [line](../../2-data-charts/04-line/en.md) |
| Which segment deserves the budget? | quadrant | [quadrant](../../4-strategy/01-quadrant/en.md) |
