---
x-title: pie кругова — x-cmd/draw
x-desc: SVG-діаграми для епохи ШІ: один ендпоінт `/draw?type=. type=pie.
x-sidebar: draw
x-keywords: draw, pie, кругова, svg, chart
---

# pie кругова

`GET /draw?type=pie&...` — відрендерити діаграму

## Приклади

**opendata**

```text
https://x-cmd.com/draw?type=pie&title=%D0%9D%D0%B0%D0%B9%D0%B1%D1%96%D0%BB%D1%8C%D1%88%D1%96%20%D0%BC%D1%96%D1%81%D1%82%D0%B0&unit=%D0%BC%D0%BB%D0%BD&labels=%D0%9A%D0%B8%D1%97%D0%B2,%D0%A5%D0%B0%D1%80%D0%BA%D1%96%D0%B2,%D0%9E%D0%B4%D0%B5%D1%81%D0%B0,%D0%94%D0%BD%D1%96%D0%BF%D1%80%D0%BE&values=3,1.4,1,1
```

![pie opendata](https://x-cmd.com/draw?type=pie&title=%D0%9D%D0%B0%D0%B9%D0%B1%D1%96%D0%BB%D1%8C%D1%88%D1%96%20%D0%BC%D1%96%D1%81%D1%82%D0%B0&unit=%D0%BC%D0%BB%D0%BD&labels=%D0%9A%D0%B8%D1%97%D0%B2,%D0%A5%D0%B0%D1%80%D0%BA%D1%96%D0%B2,%D0%9E%D0%B4%D0%B5%D1%81%D0%B0,%D0%94%D0%BD%D1%96%D0%BF%D1%80%D0%BE&values=3,1.4,1,1)

**evil**

```text
https://x-cmd.com/draw?type=pie&t=evil&title=%D0%9D%D0%B0%D0%B9%D0%B1%D1%96%D0%BB%D1%8C%D1%88%D1%96%20%D0%BC%D1%96%D1%81%D1%82%D0%B0&unit=%D0%BC%D0%BB%D0%BD&labels=%D0%9A%D0%B8%D1%97%D0%B2,%D0%A5%D0%B0%D1%80%D0%BA%D1%96%D0%B2,%D0%9E%D0%B4%D0%B5%D1%81%D0%B0,%D0%94%D0%BD%D1%96%D0%BF%D1%80%D0%BE&values=3,1.4,1,1
```

![pie evil](https://x-cmd.com/draw?type=pie&t=evil&title=%D0%9D%D0%B0%D0%B9%D0%B1%D1%96%D0%BB%D1%8C%D1%88%D1%96%20%D0%BC%D1%96%D1%81%D1%82%D0%B0&unit=%D0%BC%D0%BB%D0%BD&labels=%D0%9A%D0%B8%D1%97%D0%B2,%D0%A5%D0%B0%D1%80%D0%BA%D1%96%D0%B2,%D0%9E%D0%B4%D0%B5%D1%81%D0%B0,%D0%94%D0%BD%D1%96%D0%BF%D1%80%D0%BE&values=3,1.4,1,1)

**evil-mono**

```text
https://x-cmd.com/draw?type=pie&t=evil-mono&title=%D0%9D%D0%B0%D0%B9%D0%B1%D1%96%D0%BB%D1%8C%D1%88%D1%96%20%D0%BC%D1%96%D1%81%D1%82%D0%B0&unit=%D0%BC%D0%BB%D0%BD&labels=%D0%9A%D0%B8%D1%97%D0%B2,%D0%A5%D0%B0%D1%80%D0%BA%D1%96%D0%B2,%D0%9E%D0%B4%D0%B5%D1%81%D0%B0,%D0%94%D0%BD%D1%96%D0%BF%D1%80%D0%BE&values=3,1.4,1,1
```

![pie evil-mono](https://x-cmd.com/draw?type=pie&t=evil-mono&title=%D0%9D%D0%B0%D0%B9%D0%B1%D1%96%D0%BB%D1%8C%D1%88%D1%96%20%D0%BC%D1%96%D1%81%D1%82%D0%B0&unit=%D0%BC%D0%BB%D0%BD&labels=%D0%9A%D0%B8%D1%97%D0%B2,%D0%A5%D0%B0%D1%80%D0%BA%D1%96%D0%B2,%D0%9E%D0%B4%D0%B5%D1%81%D0%B0,%D0%94%D0%BD%D1%96%D0%BF%D1%80%D0%BE&values=3,1.4,1,1)

**market-mono**

```text
https://x-cmd.com/draw?type=pie&t=market-mono&title=%D0%9D%D0%B0%D0%B9%D0%B1%D1%96%D0%BB%D1%8C%D1%88%D1%96%20%D0%BC%D1%96%D1%81%D1%82%D0%B0&unit=%D0%BC%D0%BB%D0%BD&labels=%D0%9A%D0%B8%D1%97%D0%B2,%D0%A5%D0%B0%D1%80%D0%BA%D1%96%D0%B2,%D0%9E%D0%B4%D0%B5%D1%81%D0%B0,%D0%94%D0%BD%D1%96%D0%BF%D1%80%D0%BE&values=3,1.4,1,1
```

![pie market-mono](https://x-cmd.com/draw?type=pie&t=market-mono&title=%D0%9D%D0%B0%D0%B9%D0%B1%D1%96%D0%BB%D1%8C%D1%88%D1%96%20%D0%BC%D1%96%D1%81%D1%82%D0%B0&unit=%D0%BC%D0%BB%D0%BD&labels=%D0%9A%D0%B8%D1%97%D0%B2,%D0%A5%D0%B0%D1%80%D0%BA%D1%96%D0%B2,%D0%9E%D0%B4%D0%B5%D1%81%D0%B0,%D0%94%D0%BD%D1%96%D0%BF%D1%80%D0%BE&values=3,1.4,1,1)

**progress**

```text
https://x-cmd.com/draw?type=pie&t=progress&title=%D0%9D%D0%B0%D0%B9%D0%B1%D1%96%D0%BB%D1%8C%D1%88%D1%96%20%D0%BC%D1%96%D1%81%D1%82%D0%B0&unit=%D0%BC%D0%BB%D0%BD&labels=%D0%9A%D0%B8%D1%97%D0%B2,%D0%A5%D0%B0%D1%80%D0%BA%D1%96%D0%B2,%D0%9E%D0%B4%D0%B5%D1%81%D0%B0,%D0%94%D0%BD%D1%96%D0%BF%D1%80%D0%BE&values=3,1.4,1,1
```

![pie progress](https://x-cmd.com/draw?type=pie&t=progress&title=%D0%9D%D0%B0%D0%B9%D0%B1%D1%96%D0%BB%D1%8C%D1%88%D1%96%20%D0%BC%D1%96%D1%81%D1%82%D0%B0&unit=%D0%BC%D0%BB%D0%BD&labels=%D0%9A%D0%B8%D1%97%D0%B2,%D0%A5%D0%B0%D1%80%D0%BA%D1%96%D0%B2,%D0%9E%D0%B4%D0%B5%D1%81%D0%B0,%D0%94%D0%BD%D1%96%D0%BF%D1%80%D0%BE&values=3,1.4,1,1)

**revenue**

```text
https://x-cmd.com/draw?type=pie&t=revenue&title=%D0%9D%D0%B0%D0%B9%D0%B1%D1%96%D0%BB%D1%8C%D1%88%D1%96%20%D0%BC%D1%96%D1%81%D1%82%D0%B0&unit=%D0%BC%D0%BB%D0%BD&labels=%D0%9A%D0%B8%D1%97%D0%B2,%D0%A5%D0%B0%D1%80%D0%BA%D1%96%D0%B2,%D0%9E%D0%B4%D0%B5%D1%81%D0%B0,%D0%94%D0%BD%D1%96%D0%BF%D1%80%D0%BE&values=3,1.4,1,1
```

![pie revenue](https://x-cmd.com/draw?type=pie&t=revenue&title=%D0%9D%D0%B0%D0%B9%D0%B1%D1%96%D0%BB%D1%8C%D1%88%D1%96%20%D0%BC%D1%96%D1%81%D1%82%D0%B0&unit=%D0%BC%D0%BB%D0%BD&labels=%D0%9A%D0%B8%D1%97%D0%B2,%D0%A5%D0%B0%D1%80%D0%BA%D1%96%D0%B2,%D0%9E%D0%B4%D0%B5%D1%81%D0%B0,%D0%94%D0%BD%D1%96%D0%BF%D1%80%D0%BE&values=3,1.4,1,1)

## Параметри

| Параметри | | |
|---|---|---|
| `labels=` | мітки, через кому | ✓ |
| `values=` | значення, через кому | ✓ |
| `title=` | заголовок | ✗ |
| `unit=` | одиниця | ✗ |
| `donut=` | 0 = суцільне коло | ✗ |
| `t=` | сімейство стилю | ✗ |

## `t=`

| | |
|---|---|
| `opendata` |
| `evil` |
| `evil-mono` |
| `market-mono` |
| `progress` |
| `revenue` |

## Підводні камені

- ≤100 класів; понад 9 обʼєднуються в Other
- суцільне коло проти кільця — це лише `donut=`, не міняйте стиль
- контраст деяких стилів змінюється в темному режимі
- пробіли в заголовку кодуйте як `%20`
