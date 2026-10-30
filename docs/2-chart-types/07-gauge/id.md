---
x-title: gauge meter — x-cmd/draw
x-desc: Grafik SVG untuk era AI: satu endpoint `/draw?type=. type=gauge.
x-sidebar: draw
x-keywords: draw, gauge, meter, svg, chart
---

# gauge meter

`GET /draw?type=gauge&...` — render grafik

## Contoh

**base**

```text
https://x-cmd.com/draw?type=gauge&title=Tingkat%20CI&value=87&max=100
```

![gauge base](https://x-cmd.com/draw?type=gauge&title=Tingkat%20CI&value=87&max=100)

**gradient**

```text
https://x-cmd.com/draw?type=gauge&t=gradient&title=Tingkat%20CI&value=87&max=100
```

![gauge gradient](https://x-cmd.com/draw?type=gauge&t=gradient&title=Tingkat%20CI&value=87&max=100)

**reliability**

```text
https://x-cmd.com/draw?type=gauge&t=reliability&title=Tingkat%20CI&value=99.9&max=100
```

![gauge reliability](https://x-cmd.com/draw?type=gauge&t=reliability&title=Tingkat%20CI&value=99.9&max=100)

## Parameter

| Parameter | | |
|---|---|---|
| `value=` | nilai saat ini | ✓ |
| `max=` | maksimum (bawaan 100) | ✗ |
| `labels=` | label cincin (multi-cincin) | ✗ |
| `values=` | nilai cincin (persen) | ✗ |
| `title=` | judul | ✗ |
| `t=` | keluarga gaya | ✗ |

## `t=`

| | |
|---|---|
| `base` |
| `gradient` |
| `reliability` |

## Jebakan

- satu nilai per grafik; nilai lain → combo/line
- enkode spasi pada judul jadi `%20`
