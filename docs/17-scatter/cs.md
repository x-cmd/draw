---
x-title: scatter bodový — x-cmd/draw
x-desc: SVG grafy pro éru AI: jediný endpoint `/draw?type=. type=scatter.
x-sidebar: draw
x-keywords: draw, scatter, bodový, svg, chart
---

# scatter bodový

`GET /draw?type=scatter&...` — vykreslit graf

## Příklady

**base**

```text
https://x-cmd.com/draw?type=scatter&x=1,2,3,4,5&y=4,5,3,6,5&title=Latence
```

![scatter base](https://x-cmd.com/draw?type=scatter&x=1,2,3,4,5&y=4,5,3,6,5&title=Latence)

**base neg**

```text
https://x-cmd.com/draw?type=scatter&x=-3,-1,0,1,3&y=2,-2,3,-3,1&title=Latence
```

![scatter base neg](https://x-cmd.com/draw?type=scatter&x=-3,-1,0,1,3&y=2,-2,3,-3,1&title=Latence)

**base num**

```text
https://x-cmd.com/draw?type=scatter&x=1,2,3&y=2,4,3&num=all&title=Latence
```

![scatter base num](https://x-cmd.com/draw?type=scatter&x=1,2,3&y=2,4,3&num=all&title=Latence)

## Parametry

| Parametry | | |
|---|---|---|
| `x=` | hodnoty x | ✓ |
| `y=` | hodnoty y | ✓ |
| `title=` | název | ✗ |
| `num=` | značky hodnot: all/peak/none | ✗ |
| `t=` | rodina stylu | ✗ |

## `t=`

| | |
|---|---|
| `base` |

## Zádrhele

- ≤200 bodů na řadu; záporné povoleny
- mezery v názvu kódujte jako `%20`
