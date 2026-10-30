---
x-title: combo kombinovaný — x-cmd/draw
x-desc: SVG grafy pro éru AI: jediný endpoint `/draw?type=. type=combo.
x-sidebar: draw
x-keywords: draw, combo, kombinovaný, svg, chart
---

# combo kombinovaný

`GET /draw?type=combo&...` — vykreslit graf

## Příklady

**base**

```text
https://x-cmd.com/draw?type=combo&labels=Po,%C3%9At,St,%C4%8Ct,P%C3%A1,So,Ne&series=Sta%C5%BEen%C3%AD:120,180,150,210,240,200,260&line=R%C5%AFst:3.1,3.4,3.2,3.8,4.1,3.9,4.5&title=T%C3%BDdenn%C3%AD%20sta%C5%BEen%C3%AD&unit=dl
```

![combo base](https://x-cmd.com/draw?type=combo&labels=Po,%C3%9At,St,%C4%8Ct,P%C3%A1,So,Ne&series=Sta%C5%BEen%C3%AD:120,180,150,210,240,200,260&line=R%C5%AFst:3.1,3.4,3.2,3.8,4.1,3.9,4.5&title=T%C3%BDdenn%C3%AD%20sta%C5%BEen%C3%AD&unit=dl)

**evil**

```text
https://x-cmd.com/draw?type=combo&t=evil&labels=Po,%C3%9At,St&series=Sta%C5%BEen%C3%AD:9,12,15&line=R%C5%AFst:1.1,1.4,1.8&title=T%C3%BDdenn%C3%AD%20sta%C5%BEen%C3%AD
```

![combo evil](https://x-cmd.com/draw?type=combo&t=evil&labels=Po,%C3%9At,St&series=Sta%C5%BEen%C3%AD:9,12,15&line=R%C5%AFst:1.1,1.4,1.8&title=T%C3%BDdenn%C3%AD%20sta%C5%BEen%C3%AD)

## Parametry

| Parametry | | |
|---|---|---|
| `labels=` | popisky, oddělené čárkami | ✓ |
| `series=` | řady `název:hodnoty`, opakovatelné | ✓ |
| `line=` | řada čáry `název:hodnoty` | ✗ |
| `stack=` | 1 = naskládané | ✗ |
| `title=` | název | ✗ |
| `t=` | rodina stylu | ✗ |

## `t=`

| | |
|---|---|
| `base` |
| `evil` |

## Zádrhele

- sloupce + čára; dvě osy od 5× rozdílu
- mezery v názvu kódujte jako `%20`
