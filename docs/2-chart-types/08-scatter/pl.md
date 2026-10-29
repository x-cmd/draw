---
x-title: scatter rozrzutu — x-cmd/draw
x-desc: Wykresy SVG dla ery AI: jeden endpoint `/draw?type=. type=scatter.
x-sidebar: draw
x-keywords: draw, scatter, rozrzutu, svg, chart
---

# scatter rozrzutu

`GET /draw?type=scatter&...` — wyrenderować wykres

## Przykłady

**base**

```text
https://x-cmd.com/draw?type=scatter&x=1,2,3,4,5&y=4,5,3,6,5&title=Op%C3%B3%C5%BAnienie
```

![scatter base](https://x-cmd.com/draw?type=scatter&x=1,2,3,4,5&y=4,5,3,6,5&title=Op%C3%B3%C5%BAnienie)

**base neg**

```text
https://x-cmd.com/draw?type=scatter&x=-3,-1,0,1,3&y=2,-2,3,-3,1&title=Op%C3%B3%C5%BAnienie
```

![scatter base neg](https://x-cmd.com/draw?type=scatter&x=-3,-1,0,1,3&y=2,-2,3,-3,1&title=Op%C3%B3%C5%BAnienie)

**base num**

```text
https://x-cmd.com/draw?type=scatter&x=1,2,3&y=2,4,3&num=all&title=Op%C3%B3%C5%BAnienie
```

![scatter base num](https://x-cmd.com/draw?type=scatter&x=1,2,3&y=2,4,3&num=all&title=Op%C3%B3%C5%BAnienie)

## Parametry

| Parametry | | |
|---|---|---|
| `x=` | wartości x | ✓ |
| `y=` | wartości y | ✓ |
| `title=` | tytuł | ✗ |
| `num=` | znaczniki wartości: all/peak/none | ✗ |
| `t=` | rodzina stylu | ✗ |

## `t=`

| | |
|---|---|
| `base` |

## Pułapki

- ≤200 punktów na serię; ujemne dozwolone
- spacje w tytule koduj jako `%20`
