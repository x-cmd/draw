---
x-title: pie pie — x-cmd/draw
x-desc: Grafik SVG untuk era AI: satu endpoint `/draw?type=. type=pie.
x-sidebar: draw
x-keywords: draw, pie, pie, svg, chart
---

# pie pie

`GET /draw?type=pie&...` — render grafik

## Contoh

**opendata**

```text
https://x-cmd.com/draw?type=pie&title=Kota%20terbesar&unit=jt&labels=Jakarta,Surabaya,Bandung,Medan&values=10.6,2.9,2.5,2.5
```

![pie opendata](https://x-cmd.com/draw?type=pie&title=Kota%20terbesar&unit=jt&labels=Jakarta,Surabaya,Bandung,Medan&values=10.6,2.9,2.5,2.5)

**evil**

```text
https://x-cmd.com/draw?type=pie&t=evil&title=Kota%20terbesar&unit=jt&labels=Jakarta,Surabaya,Bandung,Medan&values=10.6,2.9,2.5,2.5
```

![pie evil](https://x-cmd.com/draw?type=pie&t=evil&title=Kota%20terbesar&unit=jt&labels=Jakarta,Surabaya,Bandung,Medan&values=10.6,2.9,2.5,2.5)

**evil-mono**

```text
https://x-cmd.com/draw?type=pie&t=evil-mono&title=Kota%20terbesar&unit=jt&labels=Jakarta,Surabaya,Bandung,Medan&values=10.6,2.9,2.5,2.5
```

![pie evil-mono](https://x-cmd.com/draw?type=pie&t=evil-mono&title=Kota%20terbesar&unit=jt&labels=Jakarta,Surabaya,Bandung,Medan&values=10.6,2.9,2.5,2.5)

**market-mono**

```text
https://x-cmd.com/draw?type=pie&t=market-mono&title=Kota%20terbesar&unit=jt&labels=Jakarta,Surabaya,Bandung,Medan&values=10.6,2.9,2.5,2.5
```

![pie market-mono](https://x-cmd.com/draw?type=pie&t=market-mono&title=Kota%20terbesar&unit=jt&labels=Jakarta,Surabaya,Bandung,Medan&values=10.6,2.9,2.5,2.5)

**progress**

```text
https://x-cmd.com/draw?type=pie&t=progress&title=Kota%20terbesar&unit=jt&labels=Jakarta,Surabaya,Bandung,Medan&values=10.6,2.9,2.5,2.5
```

![pie progress](https://x-cmd.com/draw?type=pie&t=progress&title=Kota%20terbesar&unit=jt&labels=Jakarta,Surabaya,Bandung,Medan&values=10.6,2.9,2.5,2.5)

**revenue**

```text
https://x-cmd.com/draw?type=pie&t=revenue&title=Kota%20terbesar&unit=jt&labels=Jakarta,Surabaya,Bandung,Medan&values=10.6,2.9,2.5,2.5
```

![pie revenue](https://x-cmd.com/draw?type=pie&t=revenue&title=Kota%20terbesar&unit=jt&labels=Jakarta,Surabaya,Bandung,Medan&values=10.6,2.9,2.5,2.5)

## Parameter

| Parameter | | |
|---|---|---|
| `labels=` | label, dipisah koma | ✓ |
| `values=` | nilai, dipisah koma | ✓ |
| `title=` | judul | ✗ |
| `unit=` | satuan | ✗ |
| `donut=` | 0 = pie penuh | ✗ |
| `t=` | keluarga gaya | ✗ |

## `t=`

| | |
|---|---|
| `opendata` |
| `evil` |
| `evil-mono` |
| `market-mono` |
| `progress` |
| `revenue` |

## Jebakan

- ≤100 kelas; lebih dari 9 digabung ke Other
- pie penuh vs donat hanya soal `donut=` — jangan ganti gaya
- kontras beberapa gaya berubah di mode gelap
- enkode spasi pada judul jadi `%20`
