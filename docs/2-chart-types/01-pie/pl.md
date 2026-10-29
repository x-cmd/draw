---
x-title: pie kołowy — x-cmd/draw
x-desc: Wykresy SVG dla ery AI: jeden endpoint `/draw?type=. type=pie.
x-sidebar: draw
x-keywords: draw, pie, kołowy, svg, chart
---

# pie kołowy

`GET /draw?type=pie&...` — wyrenderować wykres

## Przykłady

**opendata**

```text
https://x-cmd.com/draw?type=pie&title=Najwi%C4%99ksze%20miasta&unit=mln&labels=Warszawa,Krak%C3%B3w,Wroc%C5%82aw,%C5%81%C3%B3d%C5%BA&values=1.9,0.8,0.7,0.7
```

![pie opendata](https://x-cmd.com/draw?type=pie&title=Najwi%C4%99ksze%20miasta&unit=mln&labels=Warszawa,Krak%C3%B3w,Wroc%C5%82aw,%C5%81%C3%B3d%C5%BA&values=1.9,0.8,0.7,0.7)

**evil**

```text
https://x-cmd.com/draw?type=pie&t=evil&title=Najwi%C4%99ksze%20miasta&unit=mln&labels=Warszawa,Krak%C3%B3w,Wroc%C5%82aw,%C5%81%C3%B3d%C5%BA&values=1.9,0.8,0.7,0.7
```

![pie evil](https://x-cmd.com/draw?type=pie&t=evil&title=Najwi%C4%99ksze%20miasta&unit=mln&labels=Warszawa,Krak%C3%B3w,Wroc%C5%82aw,%C5%81%C3%B3d%C5%BA&values=1.9,0.8,0.7,0.7)

**evil-mono**

```text
https://x-cmd.com/draw?type=pie&t=evil-mono&title=Najwi%C4%99ksze%20miasta&unit=mln&labels=Warszawa,Krak%C3%B3w,Wroc%C5%82aw,%C5%81%C3%B3d%C5%BA&values=1.9,0.8,0.7,0.7
```

![pie evil-mono](https://x-cmd.com/draw?type=pie&t=evil-mono&title=Najwi%C4%99ksze%20miasta&unit=mln&labels=Warszawa,Krak%C3%B3w,Wroc%C5%82aw,%C5%81%C3%B3d%C5%BA&values=1.9,0.8,0.7,0.7)

**market-mono**

```text
https://x-cmd.com/draw?type=pie&t=market-mono&title=Najwi%C4%99ksze%20miasta&unit=mln&labels=Warszawa,Krak%C3%B3w,Wroc%C5%82aw,%C5%81%C3%B3d%C5%BA&values=1.9,0.8,0.7,0.7
```

![pie market-mono](https://x-cmd.com/draw?type=pie&t=market-mono&title=Najwi%C4%99ksze%20miasta&unit=mln&labels=Warszawa,Krak%C3%B3w,Wroc%C5%82aw,%C5%81%C3%B3d%C5%BA&values=1.9,0.8,0.7,0.7)

**progress**

```text
https://x-cmd.com/draw?type=pie&t=progress&title=Najwi%C4%99ksze%20miasta&unit=mln&labels=Warszawa,Krak%C3%B3w,Wroc%C5%82aw,%C5%81%C3%B3d%C5%BA&values=1.9,0.8,0.7,0.7
```

![pie progress](https://x-cmd.com/draw?type=pie&t=progress&title=Najwi%C4%99ksze%20miasta&unit=mln&labels=Warszawa,Krak%C3%B3w,Wroc%C5%82aw,%C5%81%C3%B3d%C5%BA&values=1.9,0.8,0.7,0.7)

**revenue**

```text
https://x-cmd.com/draw?type=pie&t=revenue&title=Najwi%C4%99ksze%20miasta&unit=mln&labels=Warszawa,Krak%C3%B3w,Wroc%C5%82aw,%C5%81%C3%B3d%C5%BA&values=1.9,0.8,0.7,0.7
```

![pie revenue](https://x-cmd.com/draw?type=pie&t=revenue&title=Najwi%C4%99ksze%20miasta&unit=mln&labels=Warszawa,Krak%C3%B3w,Wroc%C5%82aw,%C5%81%C3%B3d%C5%BA&values=1.9,0.8,0.7,0.7)

## Parametry

| Parametry | | |
|---|---|---|
| `labels=` | etykiety, oddzielone przecinkami | ✓ |
| `values=` | wartości, oddzielone przecinkami | ✓ |
| `title=` | tytuł | ✗ |
| `unit=` | jednostka | ✗ |
| `donut=` | 0 = pełne koło | ✗ |
| `t=` | rodzina stylu | ✗ |

## `t=`

| | |
|---|---|
| `opendata` |
| `evil` |
| `evil-mono` |
| `market-mono` |
| `progress` |
| `revenue` |

## Pułapki

- ≤100 klas; powyżej 9 łączy w Other
- pełne koło vs pierścień to tylko `donut=` — nie zmieniaj stylu
- kontrast niektórych stylów zmienia się w trybie ciemnym
- spacje w tytule koduj jako `%20`
