---
x-title: scatter разброс — x-cmd/draw
x-desc: SVG-графики для эпохи ИИ: один эндпоинт `/draw?type=. type=scatter.
x-sidebar: draw
x-keywords: draw, scatter, разброс, svg, chart
---

# scatter разброс

`GET /draw?type=scatter&...` — отрисовать график

## Примеры

**base**

```text
https://x-cmd.com/draw?type=scatter&x=1,2,3,4,5&y=4,5,3,6,5&title=%D0%97%D0%B0%D0%B4%D0%B5%D1%80%D0%B6%D0%BA%D0%B0
```

![scatter base](https://x-cmd.com/draw?type=scatter&x=1,2,3,4,5&y=4,5,3,6,5&title=%D0%97%D0%B0%D0%B4%D0%B5%D1%80%D0%B6%D0%BA%D0%B0)

**base neg**

```text
https://x-cmd.com/draw?type=scatter&x=-3,-1,0,1,3&y=2,-2,3,-3,1&title=%D0%97%D0%B0%D0%B4%D0%B5%D1%80%D0%B6%D0%BA%D0%B0
```

![scatter base neg](https://x-cmd.com/draw?type=scatter&x=-3,-1,0,1,3&y=2,-2,3,-3,1&title=%D0%97%D0%B0%D0%B4%D0%B5%D1%80%D0%B6%D0%BA%D0%B0)

**base num**

```text
https://x-cmd.com/draw?type=scatter&x=1,2,3&y=2,4,3&num=all&title=%D0%97%D0%B0%D0%B4%D0%B5%D1%80%D0%B6%D0%BA%D0%B0
```

![scatter base num](https://x-cmd.com/draw?type=scatter&x=1,2,3&y=2,4,3&num=all&title=%D0%97%D0%B0%D0%B4%D0%B5%D1%80%D0%B6%D0%BA%D0%B0)

## Параметры

| Параметры | | |
|---|---|---|
| `x=` | значения x | ✓ |
| `y=` | значения y | ✓ |
| `title=` | заголовок | ✗ |
| `num=` | метки значений: all/peak/none | ✗ |
| `t=` | семейство стиля | ✗ |

## `t=`

| | |
|---|---|
| `base` |

## Подводные камни

- ≤200 точек на серию; отрицательные можно
- пробелы в заголовке кодируйте как `%20`
