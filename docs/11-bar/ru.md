---
x-title: bar столбцы — x-cmd/draw
x-desc: SVG-графики для эпохи ИИ: один эндпоинт `/draw?type=. type=bar.
x-sidebar: draw
x-keywords: draw, bar, столбцы, svg, chart
---

# bar столбцы

`GET /draw?type=bar&...` — отрисовать график

## Примеры

**evil**

```text
https://x-cmd.com/draw?type=bar&t=evil&labels=%D0%9F%D0%BD,%D0%92%D1%82,%D0%A1%D1%80,%D0%A7%D1%82,%D0%9F%D1%82,%D0%A1%D0%B1,%D0%92%D1%81&series=%D0%97%D0%B0%D0%B3%D1%80%D1%83%D0%B7%D0%BA%D0%B8:34,87,51,63,45,78,39&series=%D0%A0%D0%BE%D1%81%D1%82:18,49,29,39,31,45,23
```

![bar evil](https://x-cmd.com/draw?type=bar&t=evil&labels=%D0%9F%D0%BD,%D0%92%D1%82,%D0%A1%D1%80,%D0%A7%D1%82,%D0%9F%D1%82,%D0%A1%D0%B1,%D0%92%D1%81&series=%D0%97%D0%B0%D0%B3%D1%80%D1%83%D0%B7%D0%BA%D0%B8:34,87,51,63,45,78,39&series=%D0%A0%D0%BE%D1%81%D1%82:18,49,29,39,31,45,23)

**base**

```text
https://x-cmd.com/draw?type=bar&labels=%D0%9F%D0%BD,%D0%92%D1%82,%D0%A1%D1%80&series=dev:12,18,9&series=CI:8,11,6
```

![bar base](https://x-cmd.com/draw?type=bar&labels=%D0%9F%D0%BD,%D0%92%D1%82,%D0%A1%D1%80&series=dev:12,18,9&series=CI:8,11,6)

**grid**

```text
https://x-cmd.com/draw?type=bar&t=grid&labels=%D0%9F%D0%BD,%D0%92%D1%82,%D0%A1%D1%80&values=12,18,9
```

![bar grid](https://x-cmd.com/draw?type=bar&t=grid&labels=%D0%9F%D0%BD,%D0%92%D1%82,%D0%A1%D1%80&values=12,18,9)

**evil stack**

```text
https://x-cmd.com/draw?type=bar&stack=1&labels=%D0%9F%D0%BD,%D0%92%D1%82,%D0%A1%D1%80&series=dev:12,18,9&series=CI:8,11,6
```

![bar evil stack](https://x-cmd.com/draw?type=bar&stack=1&labels=%D0%9F%D0%BD,%D0%92%D1%82,%D0%A1%D1%80&series=dev:12,18,9&series=CI:8,11,6)

## Параметры

| Параметры | | |
|---|---|---|
| `labels=` | метки, через запятую | ✓ |
| `values=` | значения, через запятую | ✓ |
| `series=` | серии `имя:значения`, можно повторять | ✗ |
| `stack=` | 1 = в стопку | ✗ |
| `title=` | заголовок | ✗ |
| `t=` | семейство стиля | ✗ |

## `t=`

| | |
|---|---|
| `evil` |
| `base` |
| `grid` |

## Подводные камни

- ≤30 групп, ≤6 серий
- при экстремальных разбросах — автоматом в процентах
- пробелы в заголовке кодируйте как `%20`
