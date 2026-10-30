---
x-title: combo комбинированный — x-cmd/draw
x-desc: SVG-графики для эпохи ИИ: один эндпоинт `/draw?type=. type=combo.
x-sidebar: draw
x-keywords: draw, combo, комбинированный, svg, chart
---

# combo комбинированный

`GET /draw?type=combo&...` — отрисовать график

## Примеры

**base**

```text
https://x-cmd.com/draw?type=combo&labels=%D0%9F%D0%BD,%D0%92%D1%82,%D0%A1%D1%80,%D0%A7%D1%82,%D0%9F%D1%82,%D0%A1%D0%B1,%D0%92%D1%81&series=%D0%97%D0%B0%D0%B3%D1%80%D1%83%D0%B7%D0%BA%D0%B8:120,180,150,210,240,200,260&line=%D0%A0%D0%BE%D1%81%D1%82:3.1,3.4,3.2,3.8,4.1,3.9,4.5&title=%D0%9D%D0%B5%D0%B4%D0%B5%D0%BB%D1%8C%D0%BD%D1%8B%D0%B5%20%D0%B7%D0%B0%D0%B3%D1%80%D1%83%D0%B7%D0%BA%D0%B8&unit=dl
```

![combo base](https://x-cmd.com/draw?type=combo&labels=%D0%9F%D0%BD,%D0%92%D1%82,%D0%A1%D1%80,%D0%A7%D1%82,%D0%9F%D1%82,%D0%A1%D0%B1,%D0%92%D1%81&series=%D0%97%D0%B0%D0%B3%D1%80%D1%83%D0%B7%D0%BA%D0%B8:120,180,150,210,240,200,260&line=%D0%A0%D0%BE%D1%81%D1%82:3.1,3.4,3.2,3.8,4.1,3.9,4.5&title=%D0%9D%D0%B5%D0%B4%D0%B5%D0%BB%D1%8C%D0%BD%D1%8B%D0%B5%20%D0%B7%D0%B0%D0%B3%D1%80%D1%83%D0%B7%D0%BA%D0%B8&unit=dl)

**evil**

```text
https://x-cmd.com/draw?type=combo&t=evil&labels=%D0%9F%D0%BD,%D0%92%D1%82,%D0%A1%D1%80&series=%D0%97%D0%B0%D0%B3%D1%80%D1%83%D0%B7%D0%BA%D0%B8:9,12,15&line=%D0%A0%D0%BE%D1%81%D1%82:1.1,1.4,1.8&title=%D0%9D%D0%B5%D0%B4%D0%B5%D0%BB%D1%8C%D0%BD%D1%8B%D0%B5%20%D0%B7%D0%B0%D0%B3%D1%80%D1%83%D0%B7%D0%BA%D0%B8
```

![combo evil](https://x-cmd.com/draw?type=combo&t=evil&labels=%D0%9F%D0%BD,%D0%92%D1%82,%D0%A1%D1%80&series=%D0%97%D0%B0%D0%B3%D1%80%D1%83%D0%B7%D0%BA%D0%B8:9,12,15&line=%D0%A0%D0%BE%D1%81%D1%82:1.1,1.4,1.8&title=%D0%9D%D0%B5%D0%B4%D0%B5%D0%BB%D1%8C%D0%BD%D1%8B%D0%B5%20%D0%B7%D0%B0%D0%B3%D1%80%D1%83%D0%B7%D0%BA%D0%B8)

## Параметры

| Параметры | | |
|---|---|---|
| `labels=` | метки, через запятую | ✓ |
| `series=` | серии `имя:значения`, можно повторять | ✓ |
| `line=` | линейная серия `имя:значения` | ✗ |
| `stack=` | 1 = в стопку | ✗ |
| `title=` | заголовок | ✗ |
| `t=` | семейство стиля | ✗ |

## `t=`

| | |
|---|---|
| `base` |
| `evil` |

## Подводные камни

- столбцы + линия; две оси от 5× разницы
- пробелы в заголовке кодируйте как `%20`
