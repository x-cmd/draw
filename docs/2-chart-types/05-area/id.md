---
x-title: area area — x-cmd/draw
x-desc: Grafik SVG untuk era AI: satu endpoint `/draw?type=. type=area.
x-sidebar: draw
x-keywords: draw, area, area, svg, chart
---

# area area

`GET /draw?type=area&...` — render grafik

## Contoh

**evil**

```text
https://x-cmd.com/draw?type=area&labels=Sen,Sel,Rab&series=dev:30,42,38&series=CI:12,18,9&title=Unduhan
```

![area evil](https://x-cmd.com/draw?type=area&labels=Sen,Sel,Rab&series=dev:30,42,38&series=CI:12,18,9&title=Unduhan)

**star**

```text
https://x-cmd.com/draw?type=area&t=star&labels=Sen,Sel,Rab&values=3,5,4&title=Pertumbuhan
```

![area star](https://x-cmd.com/draw?type=area&t=star&labels=Sen,Sel,Rab&values=3,5,4&title=Pertumbuhan)

**opendata**

```text
https://x-cmd.com/draw?type=area&t=opendata&labels=2019,2020,2021,2022&values=1.2,2.8,6.4,14.1&title=Pertumbuhan&source=x-cmd.com%2Fdraw
```

![area opendata](https://x-cmd.com/draw?type=area&t=opendata&labels=2019,2020,2021,2022&values=1.2,2.8,6.4,14.1&title=Pertumbuhan&source=x-cmd.com%2Fdraw)

**pixel**

```text
https://x-cmd.com/draw?type=area&t=pixel&labels=a,b,c,d&values=2,4,3,5&title=Pertumbuhan
```

![area pixel](https://x-cmd.com/draw?type=area&t=pixel&labels=a,b,c,d&values=2,4,3,5&title=Pertumbuhan)

## Parameter

| Parameter | | |
|---|---|---|
| `labels=` | label, dipisah koma | ✓ |
| `values=` | nilai, dipisah koma | ✓ |
| `series=` | seri `nama:nilai`, dapat diulang | ✗ |
| `source=` | sumber data (hanya area) | ✗ |
| `subtitle=` | subjudul editorial (area opendata) | ✗ |
| `t=` | keluarga gaya | ✗ |

## `t=`

| | |
|---|---|
| `evil` |
| `star` |
| `opendata` |
| `pixel` |
| `polka` |

## Jebakan

- ≤60 titik; multi-garis hanya menandai puncak tiap garis
- enkode spasi pada judul jadi `%20`
