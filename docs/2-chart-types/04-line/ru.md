---
x-title: line линия — x-cmd/draw
x-desc: SVG-графики для эпохи ИИ: один эндпоинт `/draw?type=. type=line.
x-sidebar: draw
x-keywords: draw, line, линия, svg, chart
---

# line линия

`GET /draw?type=line&...` — отрисовать график

## Примеры

**shadcn**

```text
https://x-cmd.com/draw?type=line&labels=%D0%AF%D0%BD%D0%B2,%D0%A4%D0%B5%D0%B2,%D0%9C%D0%B0%D1%80,%D0%90%D0%BF%D1%80,%D0%9C%D0%B0%D0%B9,%D0%98%D1%8E%D0%BD&values=12,19,15,25,22,30&title=%D0%97%D0%B2%D1%91%D0%B7%D0%B4%D1%8B%20%D0%BF%D0%BE%20%D1%8F%D0%B7%D1%8B%D0%BA%D0%B0%D0%BC
```

![line shadcn](https://x-cmd.com/draw?type=line&labels=%D0%AF%D0%BD%D0%B2,%D0%A4%D0%B5%D0%B2,%D0%9C%D0%B0%D1%80,%D0%90%D0%BF%D1%80,%D0%9C%D0%B0%D0%B9,%D0%98%D1%8E%D0%BD&values=12,19,15,25,22,30&title=%D0%97%D0%B2%D1%91%D0%B7%D0%B4%D1%8B%20%D0%BF%D0%BE%20%D1%8F%D0%B7%D1%8B%D0%BA%D0%B0%D0%BC)

**evil**

```text
https://x-cmd.com/draw?type=line&t=evil&labels=%D0%AF%D0%BD%D0%B2,%D0%A4%D0%B5%D0%B2,%D0%9C%D0%B0%D1%80,%D0%90%D0%BF%D1%80,%D0%9C%D0%B0%D0%B9,%D0%98%D1%8E%D0%BD&series=%D0%97%D0%B0%D0%B3%D1%80%D1%83%D0%B7%D0%BA%D0%B8:12,19,15,25,22,30&series=CI:8,11,9,14,12,10
```

![line evil](https://x-cmd.com/draw?type=line&t=evil&labels=%D0%AF%D0%BD%D0%B2,%D0%A4%D0%B5%D0%B2,%D0%9C%D0%B0%D1%80,%D0%90%D0%BF%D1%80,%D0%9C%D0%B0%D0%B9,%D0%98%D1%8E%D0%BD&series=%D0%97%D0%B0%D0%B3%D1%80%D1%83%D0%B7%D0%BA%D0%B8:12,19,15,25,22,30&series=CI:8,11,9,14,12,10)

**evil-glow**

```text
https://x-cmd.com/draw?type=line&t=evil-glow&labels=Q1,Q2,Q3,Q4&values=3.1,3.4,3.2,3.8&title=%D0%A0%D0%BE%D1%81%D1%82
```

![line evil-glow](https://x-cmd.com/draw?type=line&t=evil-glow&labels=Q1,Q2,Q3,Q4&values=3.1,3.4,3.2,3.8&title=%D0%A0%D0%BE%D1%81%D1%82)

**opendata**

```text
https://x-cmd.com/draw?type=line&t=opendata&labels=v1,v2,v3&values=120,240,410&title=%D0%97%D0%B0%D0%B3%D1%80%D1%83%D0%B7%D0%BA%D0%B8
```

![line opendata](https://x-cmd.com/draw?type=line&t=opendata&labels=v1,v2,v3&values=120,240,410&title=%D0%97%D0%B0%D0%B3%D1%80%D1%83%D0%B7%D0%BA%D0%B8)

## Параметры

| Параметры | | |
|---|---|---|
| `labels=` | метки, через запятую | ✓ |
| `values=` | значения, через запятую | ✓ |
| `series=` | серии `имя:значения`, можно повторять | ✗ |
| `title=` | заголовок | ✗ |
| `t=` | семейство стиля | ✗ |

## `t=`

| | |
|---|---|
| `shadcn` |
| `evil` |
| `evil-glow` |
| `evil-mono` |
| `opendata` |

## Подводные камни

- ≤60 точек; при нескольких линиях marked только пик каждой
- пробелы в заголовке кодируйте как `%20`
