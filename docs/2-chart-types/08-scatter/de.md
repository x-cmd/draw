---
x-title: scatter Streudiagramm — x-cmd/draw
x-desc: SVG-Diagramme für das KI-Zeitalter: ein Endpunkt `/draw?type=. type=scatter.
x-sidebar: draw
x-keywords: draw, scatter, Streudiagramm, svg, chart
---

# scatter Streudiagramm

`GET /draw?type=scatter&...` — Diagramm rendern

## Beispiele

**base**

```text
https://x-cmd.com/draw?type=scatter&x=1,2,3,4,5&y=4,5,3,6,5&title=Latenz
```

![scatter base](https://x-cmd.com/draw?type=scatter&x=1,2,3,4,5&y=4,5,3,6,5&title=Latenz)

**base neg**

```text
https://x-cmd.com/draw?type=scatter&x=-3,-1,0,1,3&y=2,-2,3,-3,1&title=Latenz
```

![scatter base neg](https://x-cmd.com/draw?type=scatter&x=-3,-1,0,1,3&y=2,-2,3,-3,1&title=Latenz)

**base num**

```text
https://x-cmd.com/draw?type=scatter&x=1,2,3&y=2,4,3&num=all&title=Latenz
```

![scatter base num](https://x-cmd.com/draw?type=scatter&x=1,2,3&y=2,4,3&num=all&title=Latenz)

## Parameter

| Parameter | | |
|---|---|---|
| `x=` | x-Werte | ✓ |
| `y=` | y-Werte | ✓ |
| `title=` | Titel | ✗ |
| `num=` | Wertmarken: all/peak/none | ✗ |
| `t=` | Stil-Familie | ✗ |

## `t=`

| | |
|---|---|
| `base` |

## Stolpersteine

- ≤200 Punkte pro Serie; Negative erlaubt
- Leerzeichen im Titel als `%20` kodieren
