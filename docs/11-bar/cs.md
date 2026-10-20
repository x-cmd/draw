---
x-title: bar sloupce — x-cmd/draw
x-desc: SVG grafy pro éru AI: jediný endpoint `/draw?type=. type=bar.
x-sidebar: draw
x-keywords: draw, bar, sloupce, svg, chart
---

# bar sloupce

`GET /draw?type=bar&...` — vykreslit graf

## Příklady

**evil**

```text
https://x-cmd.com/draw?type=bar&t=evil&labels=Po,%C3%9At,St,%C4%8Ct,P%C3%A1,So,Ne&series=Sta%C5%BEen%C3%AD:34,87,51,63,45,78,39&series=R%C5%AFst:18,49,29,39,31,45,23
```

![bar evil](https://x-cmd.com/draw?type=bar&t=evil&labels=Po,%C3%9At,St,%C4%8Ct,P%C3%A1,So,Ne&series=Sta%C5%BEen%C3%AD:34,87,51,63,45,78,39&series=R%C5%AFst:18,49,29,39,31,45,23)

**base**

```text
https://x-cmd.com/draw?type=bar&labels=Po,%C3%9At,St&series=dev:12,18,9&series=CI:8,11,6
```

![bar base](https://x-cmd.com/draw?type=bar&labels=Po,%C3%9At,St&series=dev:12,18,9&series=CI:8,11,6)

**grid**

```text
https://x-cmd.com/draw?type=bar&t=grid&labels=Po,%C3%9At,St&values=12,18,9
```

![bar grid](https://x-cmd.com/draw?type=bar&t=grid&labels=Po,%C3%9At,St&values=12,18,9)

**evil stack**

```text
https://x-cmd.com/draw?type=bar&stack=1&labels=Po,%C3%9At,St&series=dev:12,18,9&series=CI:8,11,6
```

![bar evil stack](https://x-cmd.com/draw?type=bar&stack=1&labels=Po,%C3%9At,St&series=dev:12,18,9&series=CI:8,11,6)

## Parametry

| Parametry | | |
|---|---|---|
| `labels=` | popisky, oddělené čárkami | ✓ |
| `values=` | hodnoty, oddělené čárkami | ✓ |
| `series=` | řady `název:hodnoty`, opakovatelné | ✗ |
| `stack=` | 1 = naskládané | ✗ |
| `title=` | název | ✗ |
| `t=` | rodina stylu | ✗ |

## `t=`

| | |
|---|---|
| `evil` |
| `base` |
| `grid` |

## Zádrhele

- ≤30 skupin, ≤6 řad
- při extrémních rozdílech automaticky procentuální skládání
- mezery v názvu kódujte jako `%20`
