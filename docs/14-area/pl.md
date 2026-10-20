---
x-title: area powierzchniowy — x-cmd/draw
x-desc: Wykresy SVG dla ery AI: jeden endpoint `/draw?type=. type=area.
x-sidebar: draw
x-keywords: draw, area, powierzchniowy, svg, chart
---

# area powierzchniowy

`GET /draw?type=area&...` — wyrenderować wykres

## Przykłady

**evil**

```text
https://x-cmd.com/draw?type=area&labels=Pon,Wt,%C5%9Ar&series=dev:30,42,38&series=CI:12,18,9&title=Pobrania
```

![area evil](https://x-cmd.com/draw?type=area&labels=Pon,Wt,%C5%9Ar&series=dev:30,42,38&series=CI:12,18,9&title=Pobrania)

**star**

```text
https://x-cmd.com/draw?type=area&t=star&labels=Pon,Wt,%C5%9Ar&values=3,5,4&title=Wzrost
```

![area star](https://x-cmd.com/draw?type=area&t=star&labels=Pon,Wt,%C5%9Ar&values=3,5,4&title=Wzrost)

**opendata**

```text
https://x-cmd.com/draw?type=area&t=opendata&labels=2019,2020,2021,2022&values=1.2,2.8,6.4,14.1&title=Wzrost&source=x-cmd.com%2Fdraw
```

![area opendata](https://x-cmd.com/draw?type=area&t=opendata&labels=2019,2020,2021,2022&values=1.2,2.8,6.4,14.1&title=Wzrost&source=x-cmd.com%2Fdraw)

**pixel**

```text
https://x-cmd.com/draw?type=area&t=pixel&labels=a,b,c,d&values=2,4,3,5&title=Wzrost
```

![area pixel](https://x-cmd.com/draw?type=area&t=pixel&labels=a,b,c,d&values=2,4,3,5&title=Wzrost)

## Parametry

| Parametry | | |
|---|---|---|
| `labels=` | etykiety, oddzielone przecinkami | ✓ |
| `values=` | wartości, oddzielone przecinkami | ✓ |
| `series=` | serie `nazwa:wartości`, powtarzalne | ✗ |
| `source=` | źródło danych (tylko area) | ✗ |
| `subtitle=` | podtytuł redakcyjny (area opendata) | ✗ |
| `t=` | rodzina stylu | ✗ |

## `t=`

| | |
|---|---|
| `evil` |
| `star` |
| `opendata` |
| `pixel` |
| `polka` |

## Pułapki

- ≤60 punktów; przy wielu liniach oznaczany tylko peak każdej
- spacje w tytule koduj jako `%20`
