---
x-title: line čára — x-cmd/draw
x-desc: SVG grafy pro éru AI: jediný endpoint `/draw?type=. type=line.
x-sidebar: draw
x-keywords: draw, line, čára, svg, chart
---

# line čára

`GET /draw?type=line&...` — vykreslit graf

## Příklady

**shadcn**

```text
https://x-cmd.com/draw?type=line&labels=Led,%C3%9Ano,B%C5%99e,Dub,Kv%C4%9B,%C4%8Cer&values=12,19,15,25,22,30&title=Hv%C4%9Bzdy%20podle%20jazyka
```

![line shadcn](https://x-cmd.com/draw?type=line&labels=Led,%C3%9Ano,B%C5%99e,Dub,Kv%C4%9B,%C4%8Cer&values=12,19,15,25,22,30&title=Hv%C4%9Bzdy%20podle%20jazyka)

**evil**

```text
https://x-cmd.com/draw?type=line&t=evil&labels=Led,%C3%9Ano,B%C5%99e,Dub,Kv%C4%9B,%C4%8Cer&series=Sta%C5%BEen%C3%AD:12,19,15,25,22,30&series=CI:8,11,9,14,12,10
```

![line evil](https://x-cmd.com/draw?type=line&t=evil&labels=Led,%C3%9Ano,B%C5%99e,Dub,Kv%C4%9B,%C4%8Cer&series=Sta%C5%BEen%C3%AD:12,19,15,25,22,30&series=CI:8,11,9,14,12,10)

**evil-glow**

```text
https://x-cmd.com/draw?type=line&t=evil-glow&labels=Q1,Q2,Q3,Q4&values=3.1,3.4,3.2,3.8&title=R%C5%AFst
```

![line evil-glow](https://x-cmd.com/draw?type=line&t=evil-glow&labels=Q1,Q2,Q3,Q4&values=3.1,3.4,3.2,3.8&title=R%C5%AFst)

**opendata**

```text
https://x-cmd.com/draw?type=line&t=opendata&labels=v1,v2,v3&values=120,240,410&title=Sta%C5%BEen%C3%AD
```

![line opendata](https://x-cmd.com/draw?type=line&t=opendata&labels=v1,v2,v3&values=120,240,410&title=Sta%C5%BEen%C3%AD)

## Parametry

| Parametry | | |
|---|---|---|
| `labels=` | popisky, oddělené čárkami | ✓ |
| `values=` | hodnoty, oddělené čárkami | ✓ |
| `series=` | řady `název:hodnoty`, opakovatelné | ✗ |
| `title=` | název | ✗ |
| `t=` | rodina stylu | ✗ |

## `t=`

| | |
|---|---|
| `shadcn` |
| `evil` |
| `evil-glow` |
| `evil-mono` |
| `opendata` |

## Zádrhele

- ≤60 bodů; u více čar se značí jen peak každé
- mezery v názvu kódujte jako `%20`
