---
x-title: hbar batang horizontal — x-cmd/draw
x-desc: Grafik SVG untuk era AI: satu endpoint `/draw?type=. type=hbar.
x-sidebar: draw
x-keywords: draw, hbar, batang horizontal, svg, chart
---

# hbar batang horizontal

`GET /draw?type=hbar&...` — render grafik

## Contoh

**base**

```text
https://x-cmd.com/draw?type=hbar&labels=CLI,inti,dokumentasi,UI&values=42,31,18,9&title=Commit%20per%20area
```

![hbar base](https://x-cmd.com/draw?type=hbar&labels=CLI,inti,dokumentasi,UI&values=42,31,18,9&title=Commit%20per%20area)

**opendata**

```text
https://x-cmd.com/draw?type=hbar&t=opendata&labels=CLI,inti,dokumentasi,UI&values=8,6,9,4&ref=7&reflabel=SLA&title=Commit%20per%20area
```

![hbar opendata](https://x-cmd.com/draw?type=hbar&t=opendata&labels=CLI,inti,dokumentasi,UI&values=8,6,9,4&ref=7&reflabel=SLA&title=Commit%20per%20area)

**xcmd**

```text
https://x-cmd.com/draw?type=hbar&t=xcmd&labels=Jakarta,Surabaya,Bandung&values=68,21,11&title=Kota%20terbesar
```

![hbar xcmd](https://x-cmd.com/draw?type=hbar&t=xcmd&labels=Jakarta,Surabaya,Bandung&values=68,21,11&title=Kota%20terbesar)

**xcmd-issue**

```text
https://x-cmd.com/draw?type=hbar&t=xcmd-issue&labels=CLI,inti,dokumentasi,ci,UI&series=terbuka:12,8,15,4,9&series=ditutup:38,52,20,11,26&title=Issue%20per%20area
```

![hbar xcmd-issue](https://x-cmd.com/draw?type=hbar&t=xcmd-issue&labels=CLI,inti,dokumentasi,ci,UI&series=terbuka:12,8,15,4,9&series=ditutup:38,52,20,11,26&title=Issue%20per%20area)

**rank**

```text
https://x-cmd.com/draw?type=hbar&t=rank&labels=Sen,Sel,Rab&series=2025:80,95,110&series=2026:110,85,120&title=Unduhan%20mingguan
```

![hbar rank](https://x-cmd.com/draw?type=hbar&t=rank&labels=Sen,Sel,Rab&series=2025:80,95,110&series=2026:110,85,120&title=Unduhan%20mingguan)

## Parameter

| Parameter | | |
|---|---|---|
| `labels=` | label, dipisah koma | ✓ |
| `values=` | nilai, dipisah koma | ✓ |
| `series=` | hanya gaya tertentu: 2 seri | ✗ |
| `ref=` | nilai garis referensi | ✗ |
| `reflabel=` | teks garis referensi | ✗ |
| `t=` | keluarga gaya | ✗ |

## `t=`

| | |
|---|---|
| `base` |
| `opendata` |
| `xcmd` |
| `xcmd-issue` |
| `rank` |

## Jebakan

- ≤30 batang, bawaan satu seri
- dua seri hanya dengan `t=xcmd-issue` / `t=rank`
- enkode spasi pada judul jadi `%20`
