---
x-title: bar słupkowy — x-cmd/draw
x-desc: Wykresy SVG dla ery AI: jeden endpoint `/draw?type=. type=bar.
x-sidebar: draw
x-keywords: draw, bar, słupkowy, svg, chart
---

# bar słupkowy

`GET /draw?type=bar&...` — wyrenderować wykres

## Przykłady

**evil**

```text
https://x-cmd.com/draw?type=bar&t=evil&labels=Pon,Wt,%C5%9Ar,Czw,Pt,Sob,Nd&series=Pobrania:34,87,51,63,45,78,39&series=Wzrost:18,49,29,39,31,45,23
```

![bar evil](https://x-cmd.com/draw?type=bar&t=evil&labels=Pon,Wt,%C5%9Ar,Czw,Pt,Sob,Nd&series=Pobrania:34,87,51,63,45,78,39&series=Wzrost:18,49,29,39,31,45,23)

**base**

```text
https://x-cmd.com/draw?type=bar&labels=Pon,Wt,%C5%9Ar&series=dev:12,18,9&series=CI:8,11,6
```

![bar base](https://x-cmd.com/draw?type=bar&labels=Pon,Wt,%C5%9Ar&series=dev:12,18,9&series=CI:8,11,6)

**grid**

```text
https://x-cmd.com/draw?type=bar&t=grid&labels=Pon,Wt,%C5%9Ar&values=12,18,9
```

![bar grid](https://x-cmd.com/draw?type=bar&t=grid&labels=Pon,Wt,%C5%9Ar&values=12,18,9)

**evil stack**

```text
https://x-cmd.com/draw?type=bar&stack=1&labels=Pon,Wt,%C5%9Ar&series=dev:12,18,9&series=CI:8,11,6
```

![bar evil stack](https://x-cmd.com/draw?type=bar&stack=1&labels=Pon,Wt,%C5%9Ar&series=dev:12,18,9&series=CI:8,11,6)

## Parametry

| Parametry | | |
|---|---|---|
| `labels=` | etykiety, oddzielone przecinkami | ✓ |
| `values=` | wartości, oddzielone przecinkami | ✓ |
| `series=` | serie `nazwa:wartości`, powtarzalne | ✗ |
| `stack=` | 1 = skumulowane | ✗ |
| `title=` | tytuł | ✗ |
| `t=` | rodzina stylu | ✗ |

## `t=`

| | |
|---|---|
| `evil` |
| `base` |
| `grid` |

## Pułapki

- ≤30 grup, ≤6 serii
- przy ekstremalnych różnicach automatycznie procentowo
- spacje w tytule koduj jako `%20`
