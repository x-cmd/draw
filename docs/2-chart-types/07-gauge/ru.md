---
x-title: gauge индикатор — x-cmd/draw
x-desc: SVG-графики для эпохи ИИ: один эндпоинт `/draw?type=. type=gauge.
x-sidebar: draw
x-keywords: draw, gauge, индикатор, svg, chart
---

# gauge индикатор

`GET /draw?type=gauge&...` — отрисовать график

## Примеры

**base**

```text
https://x-cmd.com/draw?type=gauge&title=%D0%9F%D1%80%D0%BE%D1%85%D0%BE%D0%B6%D0%B4%D0%B5%D0%BD%D0%B8%D0%B5%20CI&value=87&max=100
```

![gauge base](https://x-cmd.com/draw?type=gauge&title=%D0%9F%D1%80%D0%BE%D1%85%D0%BE%D0%B6%D0%B4%D0%B5%D0%BD%D0%B8%D0%B5%20CI&value=87&max=100)

**gradient**

```text
https://x-cmd.com/draw?type=gauge&t=gradient&title=%D0%9F%D1%80%D0%BE%D1%85%D0%BE%D0%B6%D0%B4%D0%B5%D0%BD%D0%B8%D0%B5%20CI&value=87&max=100
```

![gauge gradient](https://x-cmd.com/draw?type=gauge&t=gradient&title=%D0%9F%D1%80%D0%BE%D1%85%D0%BE%D0%B6%D0%B4%D0%B5%D0%BD%D0%B8%D0%B5%20CI&value=87&max=100)

**reliability**

```text
https://x-cmd.com/draw?type=gauge&t=reliability&title=%D0%9F%D1%80%D0%BE%D1%85%D0%BE%D0%B6%D0%B4%D0%B5%D0%BD%D0%B8%D0%B5%20CI&value=99.9&max=100
```

![gauge reliability](https://x-cmd.com/draw?type=gauge&t=reliability&title=%D0%9F%D1%80%D0%BE%D1%85%D0%BE%D0%B6%D0%B4%D0%B5%D0%BD%D0%B8%D0%B5%20CI&value=99.9&max=100)

## Параметры

| Параметры | | |
|---|---|---|
| `value=` | текущее значение | ✓ |
| `max=` | максимум (по умолч. 100) | ✗ |
| `labels=` | метки колец (многокольцевой) | ✗ |
| `values=` | значения колец (проценты) | ✗ |
| `title=` | заголовок | ✗ |
| `t=` | семейство стиля | ✗ |

## `t=`

| | |
|---|---|
| `base` |
| `gradient` |
| `reliability` |

## Подводные камни

- одно значение на график; несколько → combo/line
- пробелы в заголовке кодируйте как `%20`
