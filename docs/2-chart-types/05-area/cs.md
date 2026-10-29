---
x-title: area plocha — x-cmd/draw
x-desc: SVG grafy pro éru AI: jediný endpoint `/draw?type=. type=area.
x-sidebar: draw
x-keywords: draw, area, plocha, svg, chart
---

# area plocha

`GET /draw?type=area&...` — vykreslit graf

## Příklady

**evil**

```text
https://x-cmd.com/draw?type=area&labels=Po,%C3%9At,St&series=dev:30,42,38&series=CI:12,18,9&title=Sta%C5%BEen%C3%AD
```

![area evil](https://x-cmd.com/draw?type=area&labels=Po,%C3%9At,St&series=dev:30,42,38&series=CI:12,18,9&title=Sta%C5%BEen%C3%AD)

**star**

```text
https://x-cmd.com/draw?type=area&t=star&labels=Po,%C3%9At,St&values=3,5,4&title=R%C5%AFst
```

![area star](https://x-cmd.com/draw?type=area&t=star&labels=Po,%C3%9At,St&values=3,5,4&title=R%C5%AFst)

**opendata**

```text
https://x-cmd.com/draw?type=area&t=opendata&labels=2019,2020,2021,2022&values=1.2,2.8,6.4,14.1&title=R%C5%AFst&source=x-cmd.com%2Fdraw
```

![area opendata](https://x-cmd.com/draw?type=area&t=opendata&labels=2019,2020,2021,2022&values=1.2,2.8,6.4,14.1&title=R%C5%AFst&source=x-cmd.com%2Fdraw)

**pixel**

```text
https://x-cmd.com/draw?type=area&t=pixel&labels=a,b,c,d&values=2,4,3,5&title=R%C5%AFst
```

![area pixel](https://x-cmd.com/draw?type=area&t=pixel&labels=a,b,c,d&values=2,4,3,5&title=R%C5%AFst)

## Parametry

| Parametry | | |
|---|---|---|
| `labels=` | popisky, oddělené čárkami | ✓ |
| `values=` | hodnoty, oddělené čárkami | ✓ |
| `series=` | řady `název:hodnoty`, opakovatelné | ✗ |
| `source=` | zdroj dat (jen area) | ✗ |
| `subtitle=` | redakční podtitul (area opendata) | ✗ |
| `t=` | rodina stylu | ✗ |

## `t=`

| | |
|---|---|
| `evil` |
| `star` |
| `opendata` |
| `pixel` |
| `polka` |

## Zádrhele

- ≤60 bodů; u více čar se značí jen peak každé
- mezery v názvu kódujte jako `%20`
