---
x-title: scatter împrăștiere — x-cmd/draw
x-desc: Grafice SVG pentru era AI: un singur endpoint `/draw?type=. type=scatter.
x-sidebar: draw
x-keywords: draw, scatter, împrăștiere, svg, chart
---

# scatter împrăștiere

`GET /draw?type=scatter&...` — randează un grafic

## Exemple

**base**

```text
https://x-cmd.com/draw?type=scatter&x=1,2,3,4,5&y=4,5,3,6,5&title=Laten%C8%9B%C4%83
```

![scatter base](https://x-cmd.com/draw?type=scatter&x=1,2,3,4,5&y=4,5,3,6,5&title=Laten%C8%9B%C4%83)

**base neg**

```text
https://x-cmd.com/draw?type=scatter&x=-3,-1,0,1,3&y=2,-2,3,-3,1&title=Laten%C8%9B%C4%83
```

![scatter base neg](https://x-cmd.com/draw?type=scatter&x=-3,-1,0,1,3&y=2,-2,3,-3,1&title=Laten%C8%9B%C4%83)

**base num**

```text
https://x-cmd.com/draw?type=scatter&x=1,2,3&y=2,4,3&num=all&title=Laten%C8%9B%C4%83
```

![scatter base num](https://x-cmd.com/draw?type=scatter&x=1,2,3&y=2,4,3&num=all&title=Laten%C8%9B%C4%83)

## Parametri

| Parametri | | |
|---|---|---|
| `x=` | valori x | ✓ |
| `y=` | valori y | ✓ |
| `title=` | titlu | ✗ |
| `num=` | mărci de valoare: all/peak/none | ✗ |
| `t=` | familia stilului | ✗ |

## `t=`

| | |
|---|---|
| `base` |

## Capcane

- ≤200 puncte per serie; negative permise
- codează spațiile din titlu ca `%20`
