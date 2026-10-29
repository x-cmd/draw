---
x-title: gauge індикатор — x-cmd/draw
x-desc: SVG-діаграми для епохи ШІ: один ендпоінт `/draw?type=. type=gauge.
x-sidebar: draw
x-keywords: draw, gauge, індикатор, svg, chart
---

# gauge індикатор

`GET /draw?type=gauge&...` — відрендерити діаграму

## Приклади

**base**

```text
https://x-cmd.com/draw?type=gauge&title=%D0%A7%D0%B0%D1%81%D1%82%D0%BA%D0%B0%20CI&value=87&max=100
```

![gauge base](https://x-cmd.com/draw?type=gauge&title=%D0%A7%D0%B0%D1%81%D1%82%D0%BA%D0%B0%20CI&value=87&max=100)

**gradient**

```text
https://x-cmd.com/draw?type=gauge&t=gradient&title=%D0%A7%D0%B0%D1%81%D1%82%D0%BA%D0%B0%20CI&value=87&max=100
```

![gauge gradient](https://x-cmd.com/draw?type=gauge&t=gradient&title=%D0%A7%D0%B0%D1%81%D1%82%D0%BA%D0%B0%20CI&value=87&max=100)

**reliability**

```text
https://x-cmd.com/draw?type=gauge&t=reliability&title=%D0%A7%D0%B0%D1%81%D1%82%D0%BA%D0%B0%20CI&value=99.9&max=100
```

![gauge reliability](https://x-cmd.com/draw?type=gauge&t=reliability&title=%D0%A7%D0%B0%D1%81%D1%82%D0%BA%D0%B0%20CI&value=99.9&max=100)

## Параметри

| Параметри | | |
|---|---|---|
| `value=` | поточне значення | ✓ |
| `max=` | максимум (типово 100) | ✗ |
| `labels=` | мітки кілець (багатокільцевий) | ✗ |
| `values=` | значення кілець (відсотки) | ✗ |
| `title=` | заголовок | ✗ |
| `t=` | сімейство стилю | ✗ |

## `t=`

| | |
|---|---|
| `base` |
| `gradient` |
| `reliability` |

## Підводні камені

- одне значення на діаграму; кілька значень → combo/line
- пробіли в заголовку кодуйте як `%20`
