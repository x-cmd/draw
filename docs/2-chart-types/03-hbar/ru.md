---
x-title: hbar горизонтальные полосы — x-cmd/draw
x-desc: SVG-графики для эпохи ИИ: один эндпоинт `/draw?type=. type=hbar.
x-sidebar: draw
x-keywords: draw, hbar, горизонтальные полосы, svg, chart
---

# hbar горизонтальные полосы

`GET /draw?type=hbar&...` — отрисовать график

## Примеры

**base**

```text
https://x-cmd.com/draw?type=hbar&labels=CLI,%D1%8F%D0%B4%D1%80%D0%BE,%D0%B4%D0%BE%D0%BA%D0%B8,UI&values=42,31,18,9&title=%D0%9A%D0%BE%D0%BC%D0%BC%D0%B8%D1%82%D1%8B%20%D0%BF%D0%BE%20%D0%BE%D0%B1%D0%BB%D0%B0%D1%81%D1%82%D1%8F%D0%BC
```

![hbar base](https://x-cmd.com/draw?type=hbar&labels=CLI,%D1%8F%D0%B4%D1%80%D0%BE,%D0%B4%D0%BE%D0%BA%D0%B8,UI&values=42,31,18,9&title=%D0%9A%D0%BE%D0%BC%D0%BC%D0%B8%D1%82%D1%8B%20%D0%BF%D0%BE%20%D0%BE%D0%B1%D0%BB%D0%B0%D1%81%D1%82%D1%8F%D0%BC)

**opendata**

```text
https://x-cmd.com/draw?type=hbar&t=opendata&labels=CLI,%D1%8F%D0%B4%D1%80%D0%BE,%D0%B4%D0%BE%D0%BA%D0%B8,UI&values=8,6,9,4&ref=7&reflabel=SLA&title=%D0%9A%D0%BE%D0%BC%D0%BC%D0%B8%D1%82%D1%8B%20%D0%BF%D0%BE%20%D0%BE%D0%B1%D0%BB%D0%B0%D1%81%D1%82%D1%8F%D0%BC
```

![hbar opendata](https://x-cmd.com/draw?type=hbar&t=opendata&labels=CLI,%D1%8F%D0%B4%D1%80%D0%BE,%D0%B4%D0%BE%D0%BA%D0%B8,UI&values=8,6,9,4&ref=7&reflabel=SLA&title=%D0%9A%D0%BE%D0%BC%D0%BC%D0%B8%D1%82%D1%8B%20%D0%BF%D0%BE%20%D0%BE%D0%B1%D0%BB%D0%B0%D1%81%D1%82%D1%8F%D0%BC)

**xcmd**

```text
https://x-cmd.com/draw?type=hbar&t=xcmd&labels=%D0%9C%D0%BE%D1%81%D0%BA%D0%B2%D0%B0,%D0%A1%D0%B0%D0%BD%D0%BA%D1%82-%D0%9F%D0%B5%D1%82%D0%B5%D1%80%D0%B1%D1%83%D1%80%D0%B3,%D0%9D%D0%BE%D0%B2%D0%BE%D1%81%D0%B8%D0%B1%D0%B8%D1%80%D1%81%D0%BA&values=68,21,11&title=%D0%9A%D1%80%D1%83%D0%BF%D0%BD%D0%B5%D0%B9%D1%88%D0%B8%D0%B5%20%D0%B3%D0%BE%D1%80%D0%BE%D0%B4%D0%B0
```

![hbar xcmd](https://x-cmd.com/draw?type=hbar&t=xcmd&labels=%D0%9C%D0%BE%D1%81%D0%BA%D0%B2%D0%B0,%D0%A1%D0%B0%D0%BD%D0%BA%D1%82-%D0%9F%D0%B5%D1%82%D0%B5%D1%80%D0%B1%D1%83%D1%80%D0%B3,%D0%9D%D0%BE%D0%B2%D0%BE%D1%81%D0%B8%D0%B1%D0%B8%D1%80%D1%81%D0%BA&values=68,21,11&title=%D0%9A%D1%80%D1%83%D0%BF%D0%BD%D0%B5%D0%B9%D1%88%D0%B8%D0%B5%20%D0%B3%D0%BE%D1%80%D0%BE%D0%B4%D0%B0)

**xcmd-issue**

```text
https://x-cmd.com/draw?type=hbar&t=xcmd-issue&labels=CLI,%D1%8F%D0%B4%D1%80%D0%BE,%D0%B4%D0%BE%D0%BA%D0%B8,ci,UI&series=%D0%BE%D1%82%D0%BA%D1%80%D1%8B%D1%82%D1%8B%D0%B5:12,8,15,4,9&series=%D0%B7%D0%B0%D0%BA%D1%80%D1%8B%D1%82%D1%8B%D0%B5:38,52,20,11,26&title=Issues%20%D0%BF%D0%BE%20%D0%BE%D0%B1%D0%BB%D0%B0%D1%81%D1%82%D1%8F%D0%BC
```

![hbar xcmd-issue](https://x-cmd.com/draw?type=hbar&t=xcmd-issue&labels=CLI,%D1%8F%D0%B4%D1%80%D0%BE,%D0%B4%D0%BE%D0%BA%D0%B8,ci,UI&series=%D0%BE%D1%82%D0%BA%D1%80%D1%8B%D1%82%D1%8B%D0%B5:12,8,15,4,9&series=%D0%B7%D0%B0%D0%BA%D1%80%D1%8B%D1%82%D1%8B%D0%B5:38,52,20,11,26&title=Issues%20%D0%BF%D0%BE%20%D0%BE%D0%B1%D0%BB%D0%B0%D1%81%D1%82%D1%8F%D0%BC)

**rank**

```text
https://x-cmd.com/draw?type=hbar&t=rank&labels=%D0%9F%D0%BD,%D0%92%D1%82,%D0%A1%D1%80&series=2025:80,95,110&series=2026:110,85,120&title=%D0%9D%D0%B5%D0%B4%D0%B5%D0%BB%D1%8C%D0%BD%D1%8B%D0%B5%20%D0%B7%D0%B0%D0%B3%D1%80%D1%83%D0%B7%D0%BA%D0%B8
```

![hbar rank](https://x-cmd.com/draw?type=hbar&t=rank&labels=%D0%9F%D0%BD,%D0%92%D1%82,%D0%A1%D1%80&series=2025:80,95,110&series=2026:110,85,120&title=%D0%9D%D0%B5%D0%B4%D0%B5%D0%BB%D1%8C%D0%BD%D1%8B%D0%B5%20%D0%B7%D0%B0%D0%B3%D1%80%D1%83%D0%B7%D0%BA%D0%B8)

## Параметры

| Параметры | | |
|---|---|---|
| `labels=` | метки, через запятую | ✓ |
| `values=` | значения, через запятую | ✓ |
| `series=` | только некоторые стили: 2 серии | ✗ |
| `ref=` | значение опорной линии | ✗ |
| `reflabel=` | подпись опорной линии | ✗ |
| `t=` | семейство стиля | ✗ |

## `t=`

| | |
|---|---|
| `base` |
| `opendata` |
| `xcmd` |
| `xcmd-issue` |
| `rank` |

## Подводные камни

- ≤30 полос, по умолчанию одна серия
- две серии только с `t=xcmd-issue` / `t=rank`
- пробелы в заголовке кодируйте как `%20`
