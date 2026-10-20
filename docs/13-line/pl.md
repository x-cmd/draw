---
x-title: line liniowy — x-cmd/draw
x-desc: Wykresy SVG dla ery AI: jeden endpoint `/draw?type=. type=line.
x-sidebar: draw
x-keywords: draw, line, liniowy, svg, chart
---

# line liniowy

`GET /draw?type=line&...` — wyrenderować wykres

## Przykłady

**shadcn**

```text
https://x-cmd.com/draw?type=line&labels=Sty,Lut,Mar,Kwi,Maj,Cze&values=12,19,15,25,22,30&title=Gwiazdki%20wg%20j%C4%99zyka
```

![line shadcn](https://x-cmd.com/draw?type=line&labels=Sty,Lut,Mar,Kwi,Maj,Cze&values=12,19,15,25,22,30&title=Gwiazdki%20wg%20j%C4%99zyka)

**evil**

```text
https://x-cmd.com/draw?type=line&t=evil&labels=Sty,Lut,Mar,Kwi,Maj,Cze&series=Pobrania:12,19,15,25,22,30&series=CI:8,11,9,14,12,10
```

![line evil](https://x-cmd.com/draw?type=line&t=evil&labels=Sty,Lut,Mar,Kwi,Maj,Cze&series=Pobrania:12,19,15,25,22,30&series=CI:8,11,9,14,12,10)

**evil-glow**

```text
https://x-cmd.com/draw?type=line&t=evil-glow&labels=Q1,Q2,Q3,Q4&values=3.1,3.4,3.2,3.8&title=Wzrost
```

![line evil-glow](https://x-cmd.com/draw?type=line&t=evil-glow&labels=Q1,Q2,Q3,Q4&values=3.1,3.4,3.2,3.8&title=Wzrost)

**opendata**

```text
https://x-cmd.com/draw?type=line&t=opendata&labels=v1,v2,v3&values=120,240,410&title=Pobrania
```

![line opendata](https://x-cmd.com/draw?type=line&t=opendata&labels=v1,v2,v3&values=120,240,410&title=Pobrania)

## Parametry

| Parametry | | |
|---|---|---|
| `labels=` | etykiety, oddzielone przecinkami | ✓ |
| `values=` | wartości, oddzielone przecinkami | ✓ |
| `series=` | serie `nazwa:wartości`, powtarzalne | ✗ |
| `title=` | tytuł | ✗ |
| `t=` | rodzina stylu | ✗ |

## `t=`

| | |
|---|---|
| `shadcn` |
| `evil` |
| `evil-glow` |
| `evil-mono` |
| `opendata` |

## Pułapki

- ≤60 punktów; przy wielu liniach oznaczany tylko peak każdej
- spacje w tytule koduj jako `%20`
