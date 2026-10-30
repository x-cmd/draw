---
x-title: combo kombinowany — x-cmd/draw
x-desc: Wykresy SVG dla ery AI: jeden endpoint `/draw?type=. type=combo.
x-sidebar: draw
x-keywords: draw, combo, kombinowany, svg, chart
---

# combo kombinowany

`GET /draw?type=combo&...` — wyrenderować wykres

## Przykłady

**base**

```text
https://x-cmd.com/draw?type=combo&labels=Pon,Wt,%C5%9Ar,Czw,Pt,Sob,Nd&series=Pobrania:120,180,150,210,240,200,260&line=Wzrost:3.1,3.4,3.2,3.8,4.1,3.9,4.5&title=Tygodniowe%20pobrania&unit=dl
```

![combo base](https://x-cmd.com/draw?type=combo&labels=Pon,Wt,%C5%9Ar,Czw,Pt,Sob,Nd&series=Pobrania:120,180,150,210,240,200,260&line=Wzrost:3.1,3.4,3.2,3.8,4.1,3.9,4.5&title=Tygodniowe%20pobrania&unit=dl)

**evil**

```text
https://x-cmd.com/draw?type=combo&t=evil&labels=Pon,Wt,%C5%9Ar&series=Pobrania:9,12,15&line=Wzrost:1.1,1.4,1.8&title=Tygodniowe%20pobrania
```

![combo evil](https://x-cmd.com/draw?type=combo&t=evil&labels=Pon,Wt,%C5%9Ar&series=Pobrania:9,12,15&line=Wzrost:1.1,1.4,1.8&title=Tygodniowe%20pobrania)

## Parametry

| Parametry | | |
|---|---|---|
| `labels=` | etykiety, oddzielone przecinkami | ✓ |
| `series=` | serie `nazwa:wartości`, powtarzalne | ✓ |
| `line=` | seria liniowa `nazwa:wartości` | ✗ |
| `stack=` | 1 = skumulowane | ✗ |
| `title=` | tytuł | ✗ |
| `t=` | rodzina stylu | ✗ |

## `t=`

| | |
|---|---|
| `base` |
| `evil` |

## Pułapki

- słupki + linia; dwie osie od 5× różnicy
- spacje w tytule koduj jako `%20`
