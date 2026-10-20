---
x-title: scatter sebaran — x-cmd/draw
x-desc: Grafik SVG untuk era AI: satu endpoint `/draw?type=. type=scatter.
x-sidebar: draw
x-keywords: draw, scatter, sebaran, svg, chart
---

# scatter sebaran

`GET /draw?type=scatter&...` — render grafik

## Contoh

**base**

```text
https://x-cmd.com/draw?type=scatter&x=1,2,3,4,5&y=4,5,3,6,5&title=Latensi
```

![scatter base](https://x-cmd.com/draw?type=scatter&x=1,2,3,4,5&y=4,5,3,6,5&title=Latensi)

**base neg**

```text
https://x-cmd.com/draw?type=scatter&x=-3,-1,0,1,3&y=2,-2,3,-3,1&title=Latensi
```

![scatter base neg](https://x-cmd.com/draw?type=scatter&x=-3,-1,0,1,3&y=2,-2,3,-3,1&title=Latensi)

**base num**

```text
https://x-cmd.com/draw?type=scatter&x=1,2,3&y=2,4,3&num=all&title=Latensi
```

![scatter base num](https://x-cmd.com/draw?type=scatter&x=1,2,3&y=2,4,3&num=all&title=Latensi)

## Parameter

| Parameter | | |
|---|---|---|
| `x=` | nilai x | ✓ |
| `y=` | nilai y | ✓ |
| `title=` | judul | ✗ |
| `num=` | penanda nilai: all/peak/none | ✗ |
| `t=` | keluarga gaya | ✗ |

## `t=`

| | |
|---|---|
| `base` |

## Jebakan

- ≤200 titik per seri; negatif boleh
- enkode spasi pada judul jadi `%20`
