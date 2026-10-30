---
x-title: line garis — x-cmd/draw
x-desc: Grafik SVG untuk era AI: satu endpoint `/draw?type=. type=line.
x-sidebar: draw
x-keywords: draw, line, garis, svg, chart
---

# line garis

`GET /draw?type=line&...` — render grafik

## Contoh

**shadcn**

```text
https://x-cmd.com/draw?type=line&labels=Jan,Feb,Mar,Apr,Mei,Jun&values=12,19,15,25,22,30&title=Bintang%20per%20bahasa
```

![line shadcn](https://x-cmd.com/draw?type=line&labels=Jan,Feb,Mar,Apr,Mei,Jun&values=12,19,15,25,22,30&title=Bintang%20per%20bahasa)

**evil**

```text
https://x-cmd.com/draw?type=line&t=evil&labels=Jan,Feb,Mar,Apr,Mei,Jun&series=Unduhan:12,19,15,25,22,30&series=CI:8,11,9,14,12,10
```

![line evil](https://x-cmd.com/draw?type=line&t=evil&labels=Jan,Feb,Mar,Apr,Mei,Jun&series=Unduhan:12,19,15,25,22,30&series=CI:8,11,9,14,12,10)

**evil-glow**

```text
https://x-cmd.com/draw?type=line&t=evil-glow&labels=Q1,Q2,Q3,Q4&values=3.1,3.4,3.2,3.8&title=Pertumbuhan
```

![line evil-glow](https://x-cmd.com/draw?type=line&t=evil-glow&labels=Q1,Q2,Q3,Q4&values=3.1,3.4,3.2,3.8&title=Pertumbuhan)

**opendata**

```text
https://x-cmd.com/draw?type=line&t=opendata&labels=v1,v2,v3&values=120,240,410&title=Unduhan
```

![line opendata](https://x-cmd.com/draw?type=line&t=opendata&labels=v1,v2,v3&values=120,240,410&title=Unduhan)

## Parameter

| Parameter | | |
|---|---|---|
| `labels=` | label, dipisah koma | ✓ |
| `values=` | nilai, dipisah koma | ✓ |
| `series=` | seri `nama:nilai`, dapat diulang | ✗ |
| `title=` | judul | ✗ |
| `t=` | keluarga gaya | ✗ |

## `t=`

| | |
|---|---|
| `shadcn` |
| `evil` |
| `evil-glow` |
| `evil-mono` |
| `opendata` |

## Jebakan

- ≤60 titik; multi-garis hanya menandai puncak tiap garis
- enkode spasi pada judul jadi `%20`
