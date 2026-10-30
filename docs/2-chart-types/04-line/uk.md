---
x-title: line лінія — x-cmd/draw
x-desc: SVG-діаграми для епохи ШІ: один ендпоінт `/draw?type=. type=line.
x-sidebar: draw
x-keywords: draw, line, лінія, svg, chart
---

# line лінія

`GET /draw?type=line&...` — відрендерити діаграму

## Приклади

**shadcn**

```text
https://x-cmd.com/draw?type=line&labels=%D0%A1%D1%96%D1%87,%D0%9B%D1%8E%D1%82,%D0%91%D0%B5%D1%80,%D0%9A%D0%B2%D1%96,%D0%A2%D1%80%D0%B0,%D0%A7%D0%B5%D1%80&values=12,19,15,25,22,30&title=%D0%97%D1%96%D1%80%D0%BA%D0%B8%20%D0%B7%D0%B0%20%D0%BC%D0%BE%D0%B2%D0%B0%D0%BC%D0%B8
```

![line shadcn](https://x-cmd.com/draw?type=line&labels=%D0%A1%D1%96%D1%87,%D0%9B%D1%8E%D1%82,%D0%91%D0%B5%D1%80,%D0%9A%D0%B2%D1%96,%D0%A2%D1%80%D0%B0,%D0%A7%D0%B5%D1%80&values=12,19,15,25,22,30&title=%D0%97%D1%96%D1%80%D0%BA%D0%B8%20%D0%B7%D0%B0%20%D0%BC%D0%BE%D0%B2%D0%B0%D0%BC%D0%B8)

**evil**

```text
https://x-cmd.com/draw?type=line&t=evil&labels=%D0%A1%D1%96%D1%87,%D0%9B%D1%8E%D1%82,%D0%91%D0%B5%D1%80,%D0%9A%D0%B2%D1%96,%D0%A2%D1%80%D0%B0,%D0%A7%D0%B5%D1%80&series=%D0%97%D0%B0%D0%B2%D0%B0%D0%BD%D1%82%D0%B0%D0%B6%D0%B5%D0%BD%D0%BD%D1%8F:12,19,15,25,22,30&series=CI:8,11,9,14,12,10
```

![line evil](https://x-cmd.com/draw?type=line&t=evil&labels=%D0%A1%D1%96%D1%87,%D0%9B%D1%8E%D1%82,%D0%91%D0%B5%D1%80,%D0%9A%D0%B2%D1%96,%D0%A2%D1%80%D0%B0,%D0%A7%D0%B5%D1%80&series=%D0%97%D0%B0%D0%B2%D0%B0%D0%BD%D1%82%D0%B0%D0%B6%D0%B5%D0%BD%D0%BD%D1%8F:12,19,15,25,22,30&series=CI:8,11,9,14,12,10)

**evil-glow**

```text
https://x-cmd.com/draw?type=line&t=evil-glow&labels=Q1,Q2,Q3,Q4&values=3.1,3.4,3.2,3.8&title=%D0%97%D1%80%D0%BE%D1%81%D1%82%D0%B0%D0%BD%D0%BD%D1%8F
```

![line evil-glow](https://x-cmd.com/draw?type=line&t=evil-glow&labels=Q1,Q2,Q3,Q4&values=3.1,3.4,3.2,3.8&title=%D0%97%D1%80%D0%BE%D1%81%D1%82%D0%B0%D0%BD%D0%BD%D1%8F)

**opendata**

```text
https://x-cmd.com/draw?type=line&t=opendata&labels=v1,v2,v3&values=120,240,410&title=%D0%97%D0%B0%D0%B2%D0%B0%D0%BD%D1%82%D0%B0%D0%B6%D0%B5%D0%BD%D0%BD%D1%8F
```

![line opendata](https://x-cmd.com/draw?type=line&t=opendata&labels=v1,v2,v3&values=120,240,410&title=%D0%97%D0%B0%D0%B2%D0%B0%D0%BD%D1%82%D0%B0%D0%B6%D0%B5%D0%BD%D0%BD%D1%8F)

## Параметри

| Параметри | | |
|---|---|---|
| `labels=` | мітки, через кому | ✓ |
| `values=` | значення, через кому | ✓ |
| `series=` | серії `назва:значення`, можна повторювати | ✗ |
| `title=` | заголовок | ✗ |
| `t=` | сімейство стилю | ✗ |

## `t=`

| | |
|---|---|
| `shadcn` |
| `evil` |
| `evil-glow` |
| `evil-mono` |
| `opendata` |

## Підводні камені

- ≤60 точок; за кількох ліній позначається лише пік кожної
- пробіли в заголовку кодуйте як `%20`
