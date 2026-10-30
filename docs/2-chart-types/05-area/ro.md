---
x-title: area arie — x-cmd/draw
x-desc: Grafice SVG pentru era AI: un singur endpoint `/draw?type=. type=area.
x-sidebar: draw
x-keywords: draw, area, arie, svg, chart
---

# area arie

`GET /draw?type=area&...` — randează un grafic

## Exemple

**evil**

```text
https://x-cmd.com/draw?type=area&labels=Lun,Mar,Mie&series=dev:30,42,38&series=CI:12,18,9&title=Desc%C4%83rc%C4%83ri
```

![area evil](https://x-cmd.com/draw?type=area&labels=Lun,Mar,Mie&series=dev:30,42,38&series=CI:12,18,9&title=Desc%C4%83rc%C4%83ri)

**star**

```text
https://x-cmd.com/draw?type=area&t=star&labels=Lun,Mar,Mie&values=3,5,4&title=Cre%C8%99tere
```

![area star](https://x-cmd.com/draw?type=area&t=star&labels=Lun,Mar,Mie&values=3,5,4&title=Cre%C8%99tere)

**opendata**

```text
https://x-cmd.com/draw?type=area&t=opendata&labels=2019,2020,2021,2022&values=1.2,2.8,6.4,14.1&title=Cre%C8%99tere&source=x-cmd.com%2Fdraw
```

![area opendata](https://x-cmd.com/draw?type=area&t=opendata&labels=2019,2020,2021,2022&values=1.2,2.8,6.4,14.1&title=Cre%C8%99tere&source=x-cmd.com%2Fdraw)

**pixel**

```text
https://x-cmd.com/draw?type=area&t=pixel&labels=a,b,c,d&values=2,4,3,5&title=Cre%C8%99tere
```

![area pixel](https://x-cmd.com/draw?type=area&t=pixel&labels=a,b,c,d&values=2,4,3,5&title=Cre%C8%99tere)

## Parametri

| Parametri | | |
|---|---|---|
| `labels=` | etichete, separate prin virgule | ✓ |
| `values=` | valori, separate prin virgule | ✓ |
| `series=` | serii `nume:valori`, repetabile | ✗ |
| `source=` | sursa datelor (doar area) | ✗ |
| `subtitle=` | subtitlu editorial (area opendata) | ✗ |
| `t=` | familia stilului | ✗ |

## `t=`

| | |
|---|---|
| `evil` |
| `star` |
| `opendata` |
| `pixel` |
| `polka` |

## Capcane

- ≤60 puncte; la mai multe linii se marchează doar vârful fiecăreia
- codează spațiile din titlu ca `%20`
