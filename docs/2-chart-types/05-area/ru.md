---
x-title: area область — x-cmd/draw
x-desc: SVG-графики для эпохи ИИ: один эндпоинт `/draw?type=. type=area.
x-sidebar: draw
x-keywords: draw, area, область, svg, chart
---

# area область

`GET /draw?type=area&...` — отрисовать график

## Примеры

**evil**

```text
https://x-cmd.com/draw?type=area&labels=%D0%9F%D0%BD,%D0%92%D1%82,%D0%A1%D1%80&series=dev:30,42,38&series=CI:12,18,9&title=%D0%97%D0%B0%D0%B3%D1%80%D1%83%D0%B7%D0%BA%D0%B8
```

![area evil](https://x-cmd.com/draw?type=area&labels=%D0%9F%D0%BD,%D0%92%D1%82,%D0%A1%D1%80&series=dev:30,42,38&series=CI:12,18,9&title=%D0%97%D0%B0%D0%B3%D1%80%D1%83%D0%B7%D0%BA%D0%B8)

**star**

```text
https://x-cmd.com/draw?type=area&t=star&labels=%D0%9F%D0%BD,%D0%92%D1%82,%D0%A1%D1%80&values=3,5,4&title=%D0%A0%D0%BE%D1%81%D1%82
```

![area star](https://x-cmd.com/draw?type=area&t=star&labels=%D0%9F%D0%BD,%D0%92%D1%82,%D0%A1%D1%80&values=3,5,4&title=%D0%A0%D0%BE%D1%81%D1%82)

**opendata**

```text
https://x-cmd.com/draw?type=area&t=opendata&labels=2019,2020,2021,2022&values=1.2,2.8,6.4,14.1&title=%D0%A0%D0%BE%D1%81%D1%82&source=x-cmd.com%2Fdraw
```

![area opendata](https://x-cmd.com/draw?type=area&t=opendata&labels=2019,2020,2021,2022&values=1.2,2.8,6.4,14.1&title=%D0%A0%D0%BE%D1%81%D1%82&source=x-cmd.com%2Fdraw)

**pixel**

```text
https://x-cmd.com/draw?type=area&t=pixel&labels=a,b,c,d&values=2,4,3,5&title=%D0%A0%D0%BE%D1%81%D1%82
```

![area pixel](https://x-cmd.com/draw?type=area&t=pixel&labels=a,b,c,d&values=2,4,3,5&title=%D0%A0%D0%BE%D1%81%D1%82)

## Параметры

| Параметры | | |
|---|---|---|
| `labels=` | метки, через запятую | ✓ |
| `values=` | значения, через запятую | ✓ |
| `series=` | серии `имя:значения`, можно повторять | ✗ |
| `source=` | источник данных (только area) | ✗ |
| `subtitle=` | редакционный подзаголовок (area opendata) | ✗ |
| `t=` | семейство стиля | ✗ |

## `t=`

| | |
|---|---|
| `evil` |
| `star` |
| `opendata` |
| `pixel` |
| `polka` |

## Подводные камни

- ≤60 точек; при нескольких линиях marked только пик каждой
- пробелы в заголовке кодируйте как `%20`
