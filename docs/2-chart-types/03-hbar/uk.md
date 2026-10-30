---
x-title: hbar горизонтальні стовпчики — x-cmd/draw
x-desc: SVG-діаграми для епохи ШІ: один ендпоінт `/draw?type=. type=hbar.
x-sidebar: draw
x-keywords: draw, hbar, горизонтальні стовпчики, svg, chart
---

# hbar горизонтальні стовпчики

`GET /draw?type=hbar&...` — відрендерити діаграму

## Приклади

**base**

```text
https://x-cmd.com/draw?type=hbar&labels=CLI,%D1%8F%D0%B4%D1%80%D0%BE,%D0%B4%D0%BE%D0%BA%D0%B8,UI&values=42,31,18,9&title=%D0%9A%D0%BE%D0%BC%D1%96%D1%82%D0%B8%20%D0%B7%D0%B0%20%D0%BE%D0%B1%D0%BB%D0%B0%D1%81%D1%82%D1%8F%D0%BC%D0%B8
```

![hbar base](https://x-cmd.com/draw?type=hbar&labels=CLI,%D1%8F%D0%B4%D1%80%D0%BE,%D0%B4%D0%BE%D0%BA%D0%B8,UI&values=42,31,18,9&title=%D0%9A%D0%BE%D0%BC%D1%96%D1%82%D0%B8%20%D0%B7%D0%B0%20%D0%BE%D0%B1%D0%BB%D0%B0%D1%81%D1%82%D1%8F%D0%BC%D0%B8)

**opendata**

```text
https://x-cmd.com/draw?type=hbar&t=opendata&labels=CLI,%D1%8F%D0%B4%D1%80%D0%BE,%D0%B4%D0%BE%D0%BA%D0%B8,UI&values=8,6,9,4&ref=7&reflabel=SLA&title=%D0%9A%D0%BE%D0%BC%D1%96%D1%82%D0%B8%20%D0%B7%D0%B0%20%D0%BE%D0%B1%D0%BB%D0%B0%D1%81%D1%82%D1%8F%D0%BC%D0%B8
```

![hbar opendata](https://x-cmd.com/draw?type=hbar&t=opendata&labels=CLI,%D1%8F%D0%B4%D1%80%D0%BE,%D0%B4%D0%BE%D0%BA%D0%B8,UI&values=8,6,9,4&ref=7&reflabel=SLA&title=%D0%9A%D0%BE%D0%BC%D1%96%D1%82%D0%B8%20%D0%B7%D0%B0%20%D0%BE%D0%B1%D0%BB%D0%B0%D1%81%D1%82%D1%8F%D0%BC%D0%B8)

**xcmd**

```text
https://x-cmd.com/draw?type=hbar&t=xcmd&labels=%D0%9A%D0%B8%D1%97%D0%B2,%D0%A5%D0%B0%D1%80%D0%BA%D1%96%D0%B2,%D0%9E%D0%B4%D0%B5%D1%81%D0%B0&values=68,21,11&title=%D0%9D%D0%B0%D0%B9%D0%B1%D1%96%D0%BB%D1%8C%D1%88%D1%96%20%D0%BC%D1%96%D1%81%D1%82%D0%B0
```

![hbar xcmd](https://x-cmd.com/draw?type=hbar&t=xcmd&labels=%D0%9A%D0%B8%D1%97%D0%B2,%D0%A5%D0%B0%D1%80%D0%BA%D1%96%D0%B2,%D0%9E%D0%B4%D0%B5%D1%81%D0%B0&values=68,21,11&title=%D0%9D%D0%B0%D0%B9%D0%B1%D1%96%D0%BB%D1%8C%D1%88%D1%96%20%D0%BC%D1%96%D1%81%D1%82%D0%B0)

**xcmd-issue**

```text
https://x-cmd.com/draw?type=hbar&t=xcmd-issue&labels=CLI,%D1%8F%D0%B4%D1%80%D0%BE,%D0%B4%D0%BE%D0%BA%D0%B8,ci,UI&series=%D0%B2%D1%96%D0%B4%D0%BA%D1%80%D0%B8%D1%82%D1%96:12,8,15,4,9&series=%D0%B7%D0%B0%D0%BA%D1%80%D0%B8%D1%82%D1%96:38,52,20,11,26&title=Issue%20%D0%B7%D0%B0%20%D0%BE%D0%B1%D0%BB%D0%B0%D1%81%D1%82%D1%8F%D0%BC%D0%B8
```

![hbar xcmd-issue](https://x-cmd.com/draw?type=hbar&t=xcmd-issue&labels=CLI,%D1%8F%D0%B4%D1%80%D0%BE,%D0%B4%D0%BE%D0%BA%D0%B8,ci,UI&series=%D0%B2%D1%96%D0%B4%D0%BA%D1%80%D0%B8%D1%82%D1%96:12,8,15,4,9&series=%D0%B7%D0%B0%D0%BA%D1%80%D0%B8%D1%82%D1%96:38,52,20,11,26&title=Issue%20%D0%B7%D0%B0%20%D0%BE%D0%B1%D0%BB%D0%B0%D1%81%D1%82%D1%8F%D0%BC%D0%B8)

**rank**

```text
https://x-cmd.com/draw?type=hbar&t=rank&labels=%D0%9F%D0%BD,%D0%92%D1%82,%D0%A1%D1%80&series=2025:80,95,110&series=2026:110,85,120&title=%D0%A2%D0%B8%D0%B6%D0%BD%D0%B5%D0%B2%D1%96%20%D0%B7%D0%B0%D0%B2%D0%B0%D0%BD%D1%82%D0%B0%D0%B6%D0%B5%D0%BD%D0%BD%D1%8F
```

![hbar rank](https://x-cmd.com/draw?type=hbar&t=rank&labels=%D0%9F%D0%BD,%D0%92%D1%82,%D0%A1%D1%80&series=2025:80,95,110&series=2026:110,85,120&title=%D0%A2%D0%B8%D0%B6%D0%BD%D0%B5%D0%B2%D1%96%20%D0%B7%D0%B0%D0%B2%D0%B0%D0%BD%D1%82%D0%B0%D0%B6%D0%B5%D0%BD%D0%BD%D1%8F)

## Параметри

| Параметри | | |
|---|---|---|
| `labels=` | мітки, через кому | ✓ |
| `values=` | значення, через кому | ✓ |
| `series=` | лише деякі стилі: 2 серії | ✗ |
| `ref=` | значення лінії відліку | ✗ |
| `reflabel=` | підпис лінії відліку | ✗ |
| `t=` | сімейство стилю | ✗ |

## `t=`

| | |
|---|---|
| `base` |
| `opendata` |
| `xcmd` |
| `xcmd-issue` |
| `rank` |

## Підводні камені

- ≤30 смуг, типово одна серія
- дві серії лише з `t=xcmd-issue` / `t=rank`
- пробіли в заголовку кодуйте як `%20`
