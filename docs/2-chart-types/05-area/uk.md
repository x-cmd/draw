---
x-title: area площина — x-cmd/draw
x-desc: SVG-діаграми для епохи ШІ: один ендпоінт `/draw?type=. type=area.
x-sidebar: draw
x-keywords: draw, area, площина, svg, chart
---

# area площина

`GET /draw?type=area&...` — відрендерити діаграму

## Приклади

**evil**

```text
https://x-cmd.com/draw?type=area&labels=%D0%9F%D0%BD,%D0%92%D1%82,%D0%A1%D1%80&series=dev:30,42,38&series=CI:12,18,9&title=%D0%97%D0%B0%D0%B2%D0%B0%D0%BD%D1%82%D0%B0%D0%B6%D0%B5%D0%BD%D0%BD%D1%8F
```

![area evil](https://x-cmd.com/draw?type=area&labels=%D0%9F%D0%BD,%D0%92%D1%82,%D0%A1%D1%80&series=dev:30,42,38&series=CI:12,18,9&title=%D0%97%D0%B0%D0%B2%D0%B0%D0%BD%D1%82%D0%B0%D0%B6%D0%B5%D0%BD%D0%BD%D1%8F)

**star**

```text
https://x-cmd.com/draw?type=area&t=star&labels=%D0%9F%D0%BD,%D0%92%D1%82,%D0%A1%D1%80&values=3,5,4&title=%D0%97%D1%80%D0%BE%D1%81%D1%82%D0%B0%D0%BD%D0%BD%D1%8F
```

![area star](https://x-cmd.com/draw?type=area&t=star&labels=%D0%9F%D0%BD,%D0%92%D1%82,%D0%A1%D1%80&values=3,5,4&title=%D0%97%D1%80%D0%BE%D1%81%D1%82%D0%B0%D0%BD%D0%BD%D1%8F)

**opendata**

```text
https://x-cmd.com/draw?type=area&t=opendata&labels=2019,2020,2021,2022&values=1.2,2.8,6.4,14.1&title=%D0%97%D1%80%D0%BE%D1%81%D1%82%D0%B0%D0%BD%D0%BD%D1%8F&source=x-cmd.com%2Fdraw
```

![area opendata](https://x-cmd.com/draw?type=area&t=opendata&labels=2019,2020,2021,2022&values=1.2,2.8,6.4,14.1&title=%D0%97%D1%80%D0%BE%D1%81%D1%82%D0%B0%D0%BD%D0%BD%D1%8F&source=x-cmd.com%2Fdraw)

**pixel**

```text
https://x-cmd.com/draw?type=area&t=pixel&labels=a,b,c,d&values=2,4,3,5&title=%D0%97%D1%80%D0%BE%D1%81%D1%82%D0%B0%D0%BD%D0%BD%D1%8F
```

![area pixel](https://x-cmd.com/draw?type=area&t=pixel&labels=a,b,c,d&values=2,4,3,5&title=%D0%97%D1%80%D0%BE%D1%81%D1%82%D0%B0%D0%BD%D0%BD%D1%8F)

## Параметри

| Параметри | | |
|---|---|---|
| `labels=` | мітки, через кому | ✓ |
| `values=` | значення, через кому | ✓ |
| `series=` | серії `назва:значення`, можна повторювати | ✗ |
| `source=` | джерело даних (лише area) | ✗ |
| `subtitle=` | редакційний підзаголовок (area opendata) | ✗ |
| `t=` | сімейство стилю | ✗ |

## `t=`

| | |
|---|---|
| `evil` |
| `star` |
| `opendata` |
| `pixel` |
| `polka` |

## Підводні камені

- ≤60 точок; за кількох ліній позначається лише пік кожної
- пробіли в заголовку кодуйте як `%20`
