---
x-title: bar стовпчики — x-cmd/draw
x-desc: SVG-діаграми для епохи ШІ: один ендпоінт `/draw?type=. type=bar.
x-sidebar: draw
x-keywords: draw, bar, стовпчики, svg, chart
---

# bar стовпчики

`GET /draw?type=bar&...` — відрендерити діаграму

## Приклади

**evil**

```text
https://x-cmd.com/draw?type=bar&t=evil&labels=%D0%9F%D0%BD,%D0%92%D1%82,%D0%A1%D1%80,%D0%A7%D1%82,%D0%9F%D1%82,%D0%A1%D0%B1,%D0%9D%D0%B4&series=%D0%97%D0%B0%D0%B2%D0%B0%D0%BD%D1%82%D0%B0%D0%B6%D0%B5%D0%BD%D0%BD%D1%8F:34,87,51,63,45,78,39&series=%D0%97%D1%80%D0%BE%D1%81%D1%82%D0%B0%D0%BD%D0%BD%D1%8F:18,49,29,39,31,45,23
```

![bar evil](https://x-cmd.com/draw?type=bar&t=evil&labels=%D0%9F%D0%BD,%D0%92%D1%82,%D0%A1%D1%80,%D0%A7%D1%82,%D0%9F%D1%82,%D0%A1%D0%B1,%D0%9D%D0%B4&series=%D0%97%D0%B0%D0%B2%D0%B0%D0%BD%D1%82%D0%B0%D0%B6%D0%B5%D0%BD%D0%BD%D1%8F:34,87,51,63,45,78,39&series=%D0%97%D1%80%D0%BE%D1%81%D1%82%D0%B0%D0%BD%D0%BD%D1%8F:18,49,29,39,31,45,23)

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

## Параметри

| Параметри | | |
|---|---|---|
| `labels=` | мітки, через кому | ✓ |
| `values=` | значення, через кому | ✓ |
| `series=` | серії `назва:значення`, можна повторювати | ✗ |
| `stack=` | 1 = стос | ✗ |
| `title=` | заголовок | ✗ |
| `t=` | сімейство стилю | ✗ |

## `t=`

| | |
|---|---|
| `evil` |
| `base` |
| `grid` |

## Підводні камені

- ≤30 груп, ≤6 серій
- при екстремальних різницях автоматично процентний стос
- пробіли в заголовку кодуйте як `%20`
