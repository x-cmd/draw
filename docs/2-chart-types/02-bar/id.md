---
x-title: bar kolom — x-cmd/draw
x-desc: Grafik SVG untuk era AI: satu endpoint `/draw?type=. type=bar.
x-sidebar: draw
x-keywords: draw, bar, kolom, svg, chart
---

# bar kolom

`GET /draw?type=bar&...` — render grafik

## Contoh

**evil**

```text
https://x-cmd.com/draw?type=bar&t=evil&labels=Sen,Sel,Rab,Kam,Jum,Sab,Min&series=Unduhan:34,87,51,63,45,78,39&series=Pertumbuhan:18,49,29,39,31,45,23
```

![bar evil](https://x-cmd.com/draw?type=bar&t=evil&labels=Sen,Sel,Rab,Kam,Jum,Sab,Min&series=Unduhan:34,87,51,63,45,78,39&series=Pertumbuhan:18,49,29,39,31,45,23)

**base**

```text
https://x-cmd.com/draw?type=bar&labels=Sen,Sel,Rab&series=dev:12,18,9&series=CI:8,11,6
```

![bar base](https://x-cmd.com/draw?type=bar&labels=Sen,Sel,Rab&series=dev:12,18,9&series=CI:8,11,6)

**grid**

```text
https://x-cmd.com/draw?type=bar&t=grid&labels=Sen,Sel,Rab&values=12,18,9
```

![bar grid](https://x-cmd.com/draw?type=bar&t=grid&labels=Sen,Sel,Rab&values=12,18,9)

**evil stack**

```text
https://x-cmd.com/draw?type=bar&stack=1&labels=Sen,Sel,Rab&series=dev:12,18,9&series=CI:8,11,6
```

![bar evil stack](https://x-cmd.com/draw?type=bar&stack=1&labels=Sen,Sel,Rab&series=dev:12,18,9&series=CI:8,11,6)

## Parameter

| Parameter | | |
|---|---|---|
| `labels=` | label, dipisah koma | ✓ |
| `values=` | nilai, dipisah koma | ✓ |
| `series=` | seri `nama:nilai`, dapat diulang | ✗ |
| `stack=` | 1 = bertumpuk | ✗ |
| `title=` | judul | ✗ |
| `t=` | keluarga gaya | ✗ |

## `t=`

| | |
|---|---|
| `evil` |
| `base` |
| `grid` |

## Jebakan

- ≤30 grup, ≤6 seri
- saat beda ekstrem otomatis bertumpuk persen
- enkode spasi pada judul jadi `%20`
