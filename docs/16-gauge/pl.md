---
x-title: gauge wskaźnik — x-cmd/draw
x-desc: Wykresy SVG dla ery AI: jeden endpoint `/draw?type=. type=gauge.
x-sidebar: draw
x-keywords: draw, gauge, wskaźnik, svg, chart
---

# gauge wskaźnik

`GET /draw?type=gauge&...` — wyrenderować wykres

## Przykłady

**base**

```text
https://x-cmd.com/draw?type=gauge&title=Skuteczno%C5%9B%C4%87%20CI&value=87&max=100
```

![gauge base](https://x-cmd.com/draw?type=gauge&title=Skuteczno%C5%9B%C4%87%20CI&value=87&max=100)

**gradient**

```text
https://x-cmd.com/draw?type=gauge&t=gradient&title=Skuteczno%C5%9B%C4%87%20CI&value=87&max=100
```

![gauge gradient](https://x-cmd.com/draw?type=gauge&t=gradient&title=Skuteczno%C5%9B%C4%87%20CI&value=87&max=100)

**reliability**

```text
https://x-cmd.com/draw?type=gauge&t=reliability&title=Skuteczno%C5%9B%C4%87%20CI&value=99.9&max=100
```

![gauge reliability](https://x-cmd.com/draw?type=gauge&t=reliability&title=Skuteczno%C5%9B%C4%87%20CI&value=99.9&max=100)

## Parametry

| Parametry | | |
|---|---|---|
| `value=` | wartość bieżąca | ✓ |
| `max=` | maksimum (domyślnie 100) | ✗ |
| `labels=` | etykiety pierścieni (wielopierścieniowy) | ✗ |
| `values=` | wartości pierścieni (procenty) | ✗ |
| `title=` | tytuł | ✗ |
| `t=` | rodzina stylu | ✗ |

## `t=`

| | |
|---|---|
| `base` |
| `gradient` |
| `reliability` |

## Pułapki

- jedna wartość na wykres; więcej wartości → combo/line
- spacje w tytule koduj jako `%20`
