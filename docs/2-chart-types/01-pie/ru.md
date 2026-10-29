---
x-title: pie круговая — x-cmd/draw
x-desc: SVG-графики для эпохи ИИ: один эндпоинт `/draw?type=. type=pie.
x-sidebar: draw
x-keywords: draw, pie, круговая, svg, chart
---

# pie круговая

`GET /draw?type=pie&...` — отрисовать график

## Примеры

**opendata**

```text
https://x-cmd.com/draw?type=pie&title=%D0%9A%D1%80%D1%83%D0%BF%D0%BD%D0%B5%D0%B9%D1%88%D0%B8%D0%B5%20%D0%B3%D0%BE%D1%80%D0%BE%D0%B4%D0%B0&unit=%D0%BC%D0%BB%D0%BD&labels=%D0%9C%D0%BE%D1%81%D0%BA%D0%B2%D0%B0,%D0%A1%D0%B0%D0%BD%D0%BA%D1%82-%D0%9F%D0%B5%D1%82%D0%B5%D1%80%D0%B1%D1%83%D1%80%D0%B3,%D0%9D%D0%BE%D0%B2%D0%BE%D1%81%D0%B8%D0%B1%D0%B8%D1%80%D1%81%D0%BA,%D0%95%D0%BA%D0%B0%D1%82%D0%B5%D1%80%D0%B8%D0%BD%D0%B1%D1%83%D1%80%D0%B3&values=12.6,5.4,1.6,1.5
```

![pie opendata](https://x-cmd.com/draw?type=pie&title=%D0%9A%D1%80%D1%83%D0%BF%D0%BD%D0%B5%D0%B9%D1%88%D0%B8%D0%B5%20%D0%B3%D0%BE%D1%80%D0%BE%D0%B4%D0%B0&unit=%D0%BC%D0%BB%D0%BD&labels=%D0%9C%D0%BE%D1%81%D0%BA%D0%B2%D0%B0,%D0%A1%D0%B0%D0%BD%D0%BA%D1%82-%D0%9F%D0%B5%D1%82%D0%B5%D1%80%D0%B1%D1%83%D1%80%D0%B3,%D0%9D%D0%BE%D0%B2%D0%BE%D1%81%D0%B8%D0%B1%D0%B8%D1%80%D1%81%D0%BA,%D0%95%D0%BA%D0%B0%D1%82%D0%B5%D1%80%D0%B8%D0%BD%D0%B1%D1%83%D1%80%D0%B3&values=12.6,5.4,1.6,1.5)

**evil**

```text
https://x-cmd.com/draw?type=pie&t=evil&title=%D0%9A%D1%80%D1%83%D0%BF%D0%BD%D0%B5%D0%B9%D1%88%D0%B8%D0%B5%20%D0%B3%D0%BE%D1%80%D0%BE%D0%B4%D0%B0&unit=%D0%BC%D0%BB%D0%BD&labels=%D0%9C%D0%BE%D1%81%D0%BA%D0%B2%D0%B0,%D0%A1%D0%B0%D0%BD%D0%BA%D1%82-%D0%9F%D0%B5%D1%82%D0%B5%D1%80%D0%B1%D1%83%D1%80%D0%B3,%D0%9D%D0%BE%D0%B2%D0%BE%D1%81%D0%B8%D0%B1%D0%B8%D1%80%D1%81%D0%BA,%D0%95%D0%BA%D0%B0%D1%82%D0%B5%D1%80%D0%B8%D0%BD%D0%B1%D1%83%D1%80%D0%B3&values=12.6,5.4,1.6,1.5
```

![pie evil](https://x-cmd.com/draw?type=pie&t=evil&title=%D0%9A%D1%80%D1%83%D0%BF%D0%BD%D0%B5%D0%B9%D1%88%D0%B8%D0%B5%20%D0%B3%D0%BE%D1%80%D0%BE%D0%B4%D0%B0&unit=%D0%BC%D0%BB%D0%BD&labels=%D0%9C%D0%BE%D1%81%D0%BA%D0%B2%D0%B0,%D0%A1%D0%B0%D0%BD%D0%BA%D1%82-%D0%9F%D0%B5%D1%82%D0%B5%D1%80%D0%B1%D1%83%D1%80%D0%B3,%D0%9D%D0%BE%D0%B2%D0%BE%D1%81%D0%B8%D0%B1%D0%B8%D1%80%D1%81%D0%BA,%D0%95%D0%BA%D0%B0%D1%82%D0%B5%D1%80%D0%B8%D0%BD%D0%B1%D1%83%D1%80%D0%B3&values=12.6,5.4,1.6,1.5)

**evil-mono**

```text
https://x-cmd.com/draw?type=pie&t=evil-mono&title=%D0%9A%D1%80%D1%83%D0%BF%D0%BD%D0%B5%D0%B9%D1%88%D0%B8%D0%B5%20%D0%B3%D0%BE%D1%80%D0%BE%D0%B4%D0%B0&unit=%D0%BC%D0%BB%D0%BD&labels=%D0%9C%D0%BE%D1%81%D0%BA%D0%B2%D0%B0,%D0%A1%D0%B0%D0%BD%D0%BA%D1%82-%D0%9F%D0%B5%D1%82%D0%B5%D1%80%D0%B1%D1%83%D1%80%D0%B3,%D0%9D%D0%BE%D0%B2%D0%BE%D1%81%D0%B8%D0%B1%D0%B8%D1%80%D1%81%D0%BA,%D0%95%D0%BA%D0%B0%D1%82%D0%B5%D1%80%D0%B8%D0%BD%D0%B1%D1%83%D1%80%D0%B3&values=12.6,5.4,1.6,1.5
```

![pie evil-mono](https://x-cmd.com/draw?type=pie&t=evil-mono&title=%D0%9A%D1%80%D1%83%D0%BF%D0%BD%D0%B5%D0%B9%D1%88%D0%B8%D0%B5%20%D0%B3%D0%BE%D1%80%D0%BE%D0%B4%D0%B0&unit=%D0%BC%D0%BB%D0%BD&labels=%D0%9C%D0%BE%D1%81%D0%BA%D0%B2%D0%B0,%D0%A1%D0%B0%D0%BD%D0%BA%D1%82-%D0%9F%D0%B5%D1%82%D0%B5%D1%80%D0%B1%D1%83%D1%80%D0%B3,%D0%9D%D0%BE%D0%B2%D0%BE%D1%81%D0%B8%D0%B1%D0%B8%D1%80%D1%81%D0%BA,%D0%95%D0%BA%D0%B0%D1%82%D0%B5%D1%80%D0%B8%D0%BD%D0%B1%D1%83%D1%80%D0%B3&values=12.6,5.4,1.6,1.5)

**market-mono**

```text
https://x-cmd.com/draw?type=pie&t=market-mono&title=%D0%9A%D1%80%D1%83%D0%BF%D0%BD%D0%B5%D0%B9%D1%88%D0%B8%D0%B5%20%D0%B3%D0%BE%D1%80%D0%BE%D0%B4%D0%B0&unit=%D0%BC%D0%BB%D0%BD&labels=%D0%9C%D0%BE%D1%81%D0%BA%D0%B2%D0%B0,%D0%A1%D0%B0%D0%BD%D0%BA%D1%82-%D0%9F%D0%B5%D1%82%D0%B5%D1%80%D0%B1%D1%83%D1%80%D0%B3,%D0%9D%D0%BE%D0%B2%D0%BE%D1%81%D0%B8%D0%B1%D0%B8%D1%80%D1%81%D0%BA,%D0%95%D0%BA%D0%B0%D1%82%D0%B5%D1%80%D0%B8%D0%BD%D0%B1%D1%83%D1%80%D0%B3&values=12.6,5.4,1.6,1.5
```

![pie market-mono](https://x-cmd.com/draw?type=pie&t=market-mono&title=%D0%9A%D1%80%D1%83%D0%BF%D0%BD%D0%B5%D0%B9%D1%88%D0%B8%D0%B5%20%D0%B3%D0%BE%D1%80%D0%BE%D0%B4%D0%B0&unit=%D0%BC%D0%BB%D0%BD&labels=%D0%9C%D0%BE%D1%81%D0%BA%D0%B2%D0%B0,%D0%A1%D0%B0%D0%BD%D0%BA%D1%82-%D0%9F%D0%B5%D1%82%D0%B5%D1%80%D0%B1%D1%83%D1%80%D0%B3,%D0%9D%D0%BE%D0%B2%D0%BE%D1%81%D0%B8%D0%B1%D0%B8%D1%80%D1%81%D0%BA,%D0%95%D0%BA%D0%B0%D1%82%D0%B5%D1%80%D0%B8%D0%BD%D0%B1%D1%83%D1%80%D0%B3&values=12.6,5.4,1.6,1.5)

**progress**

```text
https://x-cmd.com/draw?type=pie&t=progress&title=%D0%9A%D1%80%D1%83%D0%BF%D0%BD%D0%B5%D0%B9%D1%88%D0%B8%D0%B5%20%D0%B3%D0%BE%D1%80%D0%BE%D0%B4%D0%B0&unit=%D0%BC%D0%BB%D0%BD&labels=%D0%9C%D0%BE%D1%81%D0%BA%D0%B2%D0%B0,%D0%A1%D0%B0%D0%BD%D0%BA%D1%82-%D0%9F%D0%B5%D1%82%D0%B5%D1%80%D0%B1%D1%83%D1%80%D0%B3,%D0%9D%D0%BE%D0%B2%D0%BE%D1%81%D0%B8%D0%B1%D0%B8%D1%80%D1%81%D0%BA,%D0%95%D0%BA%D0%B0%D1%82%D0%B5%D1%80%D0%B8%D0%BD%D0%B1%D1%83%D1%80%D0%B3&values=12.6,5.4,1.6,1.5
```

![pie progress](https://x-cmd.com/draw?type=pie&t=progress&title=%D0%9A%D1%80%D1%83%D0%BF%D0%BD%D0%B5%D0%B9%D1%88%D0%B8%D0%B5%20%D0%B3%D0%BE%D1%80%D0%BE%D0%B4%D0%B0&unit=%D0%BC%D0%BB%D0%BD&labels=%D0%9C%D0%BE%D1%81%D0%BA%D0%B2%D0%B0,%D0%A1%D0%B0%D0%BD%D0%BA%D1%82-%D0%9F%D0%B5%D1%82%D0%B5%D1%80%D0%B1%D1%83%D1%80%D0%B3,%D0%9D%D0%BE%D0%B2%D0%BE%D1%81%D0%B8%D0%B1%D0%B8%D1%80%D1%81%D0%BA,%D0%95%D0%BA%D0%B0%D1%82%D0%B5%D1%80%D0%B8%D0%BD%D0%B1%D1%83%D1%80%D0%B3&values=12.6,5.4,1.6,1.5)

**revenue**

```text
https://x-cmd.com/draw?type=pie&t=revenue&title=%D0%9A%D1%80%D1%83%D0%BF%D0%BD%D0%B5%D0%B9%D1%88%D0%B8%D0%B5%20%D0%B3%D0%BE%D1%80%D0%BE%D0%B4%D0%B0&unit=%D0%BC%D0%BB%D0%BD&labels=%D0%9C%D0%BE%D1%81%D0%BA%D0%B2%D0%B0,%D0%A1%D0%B0%D0%BD%D0%BA%D1%82-%D0%9F%D0%B5%D1%82%D0%B5%D1%80%D0%B1%D1%83%D1%80%D0%B3,%D0%9D%D0%BE%D0%B2%D0%BE%D1%81%D0%B8%D0%B1%D0%B8%D1%80%D1%81%D0%BA,%D0%95%D0%BA%D0%B0%D1%82%D0%B5%D1%80%D0%B8%D0%BD%D0%B1%D1%83%D1%80%D0%B3&values=12.6,5.4,1.6,1.5
```

![pie revenue](https://x-cmd.com/draw?type=pie&t=revenue&title=%D0%9A%D1%80%D1%83%D0%BF%D0%BD%D0%B5%D0%B9%D1%88%D0%B8%D0%B5%20%D0%B3%D0%BE%D1%80%D0%BE%D0%B4%D0%B0&unit=%D0%BC%D0%BB%D0%BD&labels=%D0%9C%D0%BE%D1%81%D0%BA%D0%B2%D0%B0,%D0%A1%D0%B0%D0%BD%D0%BA%D1%82-%D0%9F%D0%B5%D1%82%D0%B5%D1%80%D0%B1%D1%83%D1%80%D0%B3,%D0%9D%D0%BE%D0%B2%D0%BE%D1%81%D0%B8%D0%B1%D0%B8%D1%80%D1%81%D0%BA,%D0%95%D0%BA%D0%B0%D1%82%D0%B5%D1%80%D0%B8%D0%BD%D0%B1%D1%83%D1%80%D0%B3&values=12.6,5.4,1.6,1.5)

## Параметры

| Параметры | | |
|---|---|---|
| `labels=` | метки, через запятую | ✓ |
| `values=` | значения, через запятую | ✓ |
| `title=` | заголовок | ✗ |
| `unit=` | единица | ✗ |
| `donut=` | 0 = сплошной круг | ✗ |
| `t=` | семейство стиля | ✗ |

## `t=`

| | |
|---|---|
| `opendata` |
| `evil` |
| `evil-mono` |
| `market-mono` |
| `progress` |
| `revenue` |

## Подводные камни

- ≤100 классов; больше 9 объединяются в Other
- сплошной круг и кольцо — разница только `donut=`, не меняйте стиль
- контраст некоторых стилей меняется в тёмной теме
- пробелы в заголовке кодируйте как `%20`
