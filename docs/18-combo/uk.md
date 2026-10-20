---
x-title: combo комбінована — x-cmd/draw
x-desc: SVG-діаграми для епохи ШІ: один ендпоінт `/draw?type=. type=combo.
x-sidebar: draw
x-keywords: draw, combo, комбінована, svg, chart
---

# combo комбінована

`GET /draw?type=combo&...` — відрендерити діаграму

## Приклади

**base**

```text
https://x-cmd.com/draw?type=combo&labels=%D0%9F%D0%BD,%D0%92%D1%82,%D0%A1%D1%80,%D0%A7%D1%82,%D0%9F%D1%82,%D0%A1%D0%B1,%D0%9D%D0%B4&series=%D0%97%D0%B0%D0%B2%D0%B0%D0%BD%D1%82%D0%B0%D0%B6%D0%B5%D0%BD%D0%BD%D1%8F:120,180,150,210,240,200,260&line=%D0%97%D1%80%D0%BE%D1%81%D1%82%D0%B0%D0%BD%D0%BD%D1%8F:3.1,3.4,3.2,3.8,4.1,3.9,4.5&title=%D0%A2%D0%B8%D0%B6%D0%BD%D0%B5%D0%B2%D1%96%20%D0%B7%D0%B0%D0%B2%D0%B0%D0%BD%D1%82%D0%B0%D0%B6%D0%B5%D0%BD%D0%BD%D1%8F&unit=dl
```

![combo base](https://x-cmd.com/draw?type=combo&labels=%D0%9F%D0%BD,%D0%92%D1%82,%D0%A1%D1%80,%D0%A7%D1%82,%D0%9F%D1%82,%D0%A1%D0%B1,%D0%9D%D0%B4&series=%D0%97%D0%B0%D0%B2%D0%B0%D0%BD%D1%82%D0%B0%D0%B6%D0%B5%D0%BD%D0%BD%D1%8F:120,180,150,210,240,200,260&line=%D0%97%D1%80%D0%BE%D1%81%D1%82%D0%B0%D0%BD%D0%BD%D1%8F:3.1,3.4,3.2,3.8,4.1,3.9,4.5&title=%D0%A2%D0%B8%D0%B6%D0%BD%D0%B5%D0%B2%D1%96%20%D0%B7%D0%B0%D0%B2%D0%B0%D0%BD%D1%82%D0%B0%D0%B6%D0%B5%D0%BD%D0%BD%D1%8F&unit=dl)

**evil**

```text
https://x-cmd.com/draw?type=combo&t=evil&labels=%D0%9F%D0%BD,%D0%92%D1%82,%D0%A1%D1%80&series=%D0%97%D0%B0%D0%B2%D0%B0%D0%BD%D1%82%D0%B0%D0%B6%D0%B5%D0%BD%D0%BD%D1%8F:9,12,15&line=%D0%97%D1%80%D0%BE%D1%81%D1%82%D0%B0%D0%BD%D0%BD%D1%8F:1.1,1.4,1.8&title=%D0%A2%D0%B8%D0%B6%D0%BD%D0%B5%D0%B2%D1%96%20%D0%B7%D0%B0%D0%B2%D0%B0%D0%BD%D1%82%D0%B0%D0%B6%D0%B5%D0%BD%D0%BD%D1%8F
```

![combo evil](https://x-cmd.com/draw?type=combo&t=evil&labels=%D0%9F%D0%BD,%D0%92%D1%82,%D0%A1%D1%80&series=%D0%97%D0%B0%D0%B2%D0%B0%D0%BD%D1%82%D0%B0%D0%B6%D0%B5%D0%BD%D0%BD%D1%8F:9,12,15&line=%D0%97%D1%80%D0%BE%D1%81%D1%82%D0%B0%D0%BD%D0%BD%D1%8F:1.1,1.4,1.8&title=%D0%A2%D0%B8%D0%B6%D0%BD%D0%B5%D0%B2%D1%96%20%D0%B7%D0%B0%D0%B2%D0%B0%D0%BD%D1%82%D0%B0%D0%B6%D0%B5%D0%BD%D0%BD%D1%8F)

## Параметри

| Параметри | | |
|---|---|---|
| `labels=` | мітки, через кому | ✓ |
| `series=` | серії `назва:значення`, можна повторювати | ✓ |
| `line=` | лінійна серія `назва:значення` | ✗ |
| `stack=` | 1 = стос | ✗ |
| `title=` | заголовок | ✗ |
| `t=` | сімейство стилю | ✗ |

## `t=`

| | |
|---|---|
| `base` |
| `evil` |

## Підводні камені

- стовпчики + лінія; дві осі від 5× різниці
- пробіли в заголовку кодуйте як `%20`
