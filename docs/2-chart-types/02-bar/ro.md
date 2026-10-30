---
x-title: bar coloane — x-cmd/draw
x-desc: Grafice SVG pentru era AI: un singur endpoint `/draw?type=. type=bar.
x-sidebar: draw
x-keywords: draw, bar, coloane, svg, chart
---

# bar coloane

`GET /draw?type=bar&...` — randează un grafic

## Exemple

**evil**

```text
https://x-cmd.com/draw?type=bar&t=evil&labels=Lun,Mar,Mie,Joi,Vin,S%C3%A2m,Dum&series=Desc%C4%83rc%C4%83ri:34,87,51,63,45,78,39&series=Cre%C8%99tere:18,49,29,39,31,45,23
```

![bar evil](https://x-cmd.com/draw?type=bar&t=evil&labels=Lun,Mar,Mie,Joi,Vin,S%C3%A2m,Dum&series=Desc%C4%83rc%C4%83ri:34,87,51,63,45,78,39&series=Cre%C8%99tere:18,49,29,39,31,45,23)

**base**

```text
https://x-cmd.com/draw?type=bar&labels=Lun,Mar,Mie&series=dev:12,18,9&series=CI:8,11,6
```

![bar base](https://x-cmd.com/draw?type=bar&labels=Lun,Mar,Mie&series=dev:12,18,9&series=CI:8,11,6)

**grid**

```text
https://x-cmd.com/draw?type=bar&t=grid&labels=Lun,Mar,Mie&values=12,18,9
```

![bar grid](https://x-cmd.com/draw?type=bar&t=grid&labels=Lun,Mar,Mie&values=12,18,9)

**evil stack**

```text
https://x-cmd.com/draw?type=bar&stack=1&labels=Lun,Mar,Mie&series=dev:12,18,9&series=CI:8,11,6
```

![bar evil stack](https://x-cmd.com/draw?type=bar&stack=1&labels=Lun,Mar,Mie&series=dev:12,18,9&series=CI:8,11,6)

## Parametri

| Parametri | | |
|---|---|---|
| `labels=` | etichete, separate prin virgule | ✓ |
| `values=` | valori, separate prin virgule | ✓ |
| `series=` | serii `nume:valori`, repetabile | ✗ |
| `stack=` | 1 = stivuite | ✗ |
| `title=` | titlu | ✗ |
| `t=` | familia stilului | ✗ |

## `t=`

| | |
|---|---|
| `evil` |
| `base` |
| `grid` |

## Capcane

- ≤30 grupuri, ≤6 serii
- la diferențe extreme se stivuiește procentual automat
- codează spațiile din titlu ca `%20`
