---
x-title: gauge ukazatel — x-cmd/draw
x-desc: SVG grafy pro éru AI: jediný endpoint `/draw?type=. type=gauge.
x-sidebar: draw
x-keywords: draw, gauge, ukazatel, svg, chart
---

# gauge ukazatel

`GET /draw?type=gauge&...` — vykreslit graf

## Příklady

**base**

```text
https://x-cmd.com/draw?type=gauge&title=%C3%9Asp%C4%9B%C5%A1nost%20CI&value=87&max=100
```

![gauge base](https://x-cmd.com/draw?type=gauge&title=%C3%9Asp%C4%9B%C5%A1nost%20CI&value=87&max=100)

**gradient**

```text
https://x-cmd.com/draw?type=gauge&t=gradient&title=%C3%9Asp%C4%9B%C5%A1nost%20CI&value=87&max=100
```

![gauge gradient](https://x-cmd.com/draw?type=gauge&t=gradient&title=%C3%9Asp%C4%9B%C5%A1nost%20CI&value=87&max=100)

**reliability**

```text
https://x-cmd.com/draw?type=gauge&t=reliability&title=%C3%9Asp%C4%9B%C5%A1nost%20CI&value=99.9&max=100
```

![gauge reliability](https://x-cmd.com/draw?type=gauge&t=reliability&title=%C3%9Asp%C4%9B%C5%A1nost%20CI&value=99.9&max=100)

## Parametry

| Parametry | | |
|---|---|---|
| `value=` | aktuální hodnota | ✓ |
| `max=` | maximum (výchozí 100) | ✗ |
| `labels=` | popisky prstenců (více prstenců) | ✗ |
| `values=` | hodnoty prstenců (procenta) | ✗ |
| `title=` | název | ✗ |
| `t=` | rodina stylu | ✗ |

## `t=`

| | |
|---|---|
| `base` |
| `gradient` |
| `reliability` |

## Zádrhele

- jedna hodnota na graf; více hodnot → combo/line
- mezery v názvu kódujte jako `%20`
