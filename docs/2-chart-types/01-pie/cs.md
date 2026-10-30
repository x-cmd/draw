---
x-title: pie koláč — x-cmd/draw
x-desc: SVG grafy pro éru AI: jediný endpoint `/draw?type=. type=pie.
x-sidebar: draw
x-keywords: draw, pie, koláč, svg, chart
---

# pie koláč

`GET /draw?type=pie&...` — vykreslit graf

## Příklady

**opendata**

```text
https://x-cmd.com/draw?type=pie&title=Nejv%C4%9Bt%C5%A1%C3%AD%20m%C4%9Bsta&unit=mil.&labels=Praha,Brno,Ostrava,Plze%C5%88&values=1.4,0.4,0.3,0.2
```

![pie opendata](https://x-cmd.com/draw?type=pie&title=Nejv%C4%9Bt%C5%A1%C3%AD%20m%C4%9Bsta&unit=mil.&labels=Praha,Brno,Ostrava,Plze%C5%88&values=1.4,0.4,0.3,0.2)

**evil**

```text
https://x-cmd.com/draw?type=pie&t=evil&title=Nejv%C4%9Bt%C5%A1%C3%AD%20m%C4%9Bsta&unit=mil.&labels=Praha,Brno,Ostrava,Plze%C5%88&values=1.4,0.4,0.3,0.2
```

![pie evil](https://x-cmd.com/draw?type=pie&t=evil&title=Nejv%C4%9Bt%C5%A1%C3%AD%20m%C4%9Bsta&unit=mil.&labels=Praha,Brno,Ostrava,Plze%C5%88&values=1.4,0.4,0.3,0.2)

**evil-mono**

```text
https://x-cmd.com/draw?type=pie&t=evil-mono&title=Nejv%C4%9Bt%C5%A1%C3%AD%20m%C4%9Bsta&unit=mil.&labels=Praha,Brno,Ostrava,Plze%C5%88&values=1.4,0.4,0.3,0.2
```

![pie evil-mono](https://x-cmd.com/draw?type=pie&t=evil-mono&title=Nejv%C4%9Bt%C5%A1%C3%AD%20m%C4%9Bsta&unit=mil.&labels=Praha,Brno,Ostrava,Plze%C5%88&values=1.4,0.4,0.3,0.2)

**market-mono**

```text
https://x-cmd.com/draw?type=pie&t=market-mono&title=Nejv%C4%9Bt%C5%A1%C3%AD%20m%C4%9Bsta&unit=mil.&labels=Praha,Brno,Ostrava,Plze%C5%88&values=1.4,0.4,0.3,0.2
```

![pie market-mono](https://x-cmd.com/draw?type=pie&t=market-mono&title=Nejv%C4%9Bt%C5%A1%C3%AD%20m%C4%9Bsta&unit=mil.&labels=Praha,Brno,Ostrava,Plze%C5%88&values=1.4,0.4,0.3,0.2)

**progress**

```text
https://x-cmd.com/draw?type=pie&t=progress&title=Nejv%C4%9Bt%C5%A1%C3%AD%20m%C4%9Bsta&unit=mil.&labels=Praha,Brno,Ostrava,Plze%C5%88&values=1.4,0.4,0.3,0.2
```

![pie progress](https://x-cmd.com/draw?type=pie&t=progress&title=Nejv%C4%9Bt%C5%A1%C3%AD%20m%C4%9Bsta&unit=mil.&labels=Praha,Brno,Ostrava,Plze%C5%88&values=1.4,0.4,0.3,0.2)

**revenue**

```text
https://x-cmd.com/draw?type=pie&t=revenue&title=Nejv%C4%9Bt%C5%A1%C3%AD%20m%C4%9Bsta&unit=mil.&labels=Praha,Brno,Ostrava,Plze%C5%88&values=1.4,0.4,0.3,0.2
```

![pie revenue](https://x-cmd.com/draw?type=pie&t=revenue&title=Nejv%C4%9Bt%C5%A1%C3%AD%20m%C4%9Bsta&unit=mil.&labels=Praha,Brno,Ostrava,Plze%C5%88&values=1.4,0.4,0.3,0.2)

## Parametry

| Parametry | | |
|---|---|---|
| `labels=` | popisky, oddělené čárkami | ✓ |
| `values=` | hodnoty, oddělené čárkami | ✓ |
| `title=` | název | ✗ |
| `unit=` | jednotka | ✗ |
| `donut=` | 0 = plný koláč | ✗ |
| `t=` | rodina stylu | ✗ |

## `t=`

| | |
|---|---|
| `opendata` |
| `evil` |
| `evil-mono` |
| `market-mono` |
| `progress` |
| `revenue` |

## Zádrhele

- ≤100 tříd; přes 9 se sloučí do Other
- plný koláč vs prstenec je jen `donut=` — neměňte styl
- kontrast některých stylů se v tmavém režimu mění
- mezery v názvu kódujte jako `%20`
