---
x-title: combo kombo — x-cmd/draw
x-desc: Grafik SVG untuk era AI: satu endpoint `/draw?type=. type=combo.
x-sidebar: draw
x-keywords: draw, combo, kombo, svg, chart
---

# combo kombo

`GET /draw?type=combo&...` — render grafik

## Contoh

**base**

```text
https://x-cmd.com/draw?type=combo&labels=Sen,Sel,Rab,Kam,Jum,Sab,Min&series=Unduhan:120,180,150,210,240,200,260&line=Pertumbuhan:3.1,3.4,3.2,3.8,4.1,3.9,4.5&title=Unduhan%20mingguan&unit=dl
```

![combo base](https://x-cmd.com/draw?type=combo&labels=Sen,Sel,Rab,Kam,Jum,Sab,Min&series=Unduhan:120,180,150,210,240,200,260&line=Pertumbuhan:3.1,3.4,3.2,3.8,4.1,3.9,4.5&title=Unduhan%20mingguan&unit=dl)

**evil**

```text
https://x-cmd.com/draw?type=combo&t=evil&labels=Sen,Sel,Rab&series=Unduhan:9,12,15&line=Pertumbuhan:1.1,1.4,1.8&title=Unduhan%20mingguan
```

![combo evil](https://x-cmd.com/draw?type=combo&t=evil&labels=Sen,Sel,Rab&series=Unduhan:9,12,15&line=Pertumbuhan:1.1,1.4,1.8&title=Unduhan%20mingguan)

## Parameter

| Parameter | | |
|---|---|---|
| `labels=` | label, dipisah koma | ✓ |
| `series=` | seri `nama:nilai`, dapat diulang | ✓ |
| `line=` | seri garis `nama:nilai` | ✗ |
| `stack=` | 1 = bertumpuk | ✗ |
| `title=` | judul | ✗ |
| `t=` | keluarga gaya | ✗ |

## `t=`

| | |
|---|---|
| `base` |
| `evil` |

## Jebakan

- kolom + garis; sumbu ganda saat beda 5×
- enkode spasi pada judul jadi `%20`
