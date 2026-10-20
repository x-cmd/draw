---
x-title: line çizgi — x-cmd/draw
x-desc: Yapay zekâ çağı için SVG grafikler: tek endpoint `/draw?type=. type=line.
x-sidebar: draw
x-keywords: draw, line, çizgi, svg, chart
---

# line çizgi

`GET /draw?type=line&...` — grafik çiz

## Örnekler

**shadcn**

```text
https://x-cmd.com/draw?type=line&labels=Oca,%C5%9Eub,Mar,Nis,May,Haz&values=12,19,15,25,22,30&title=Dile%20g%C3%B6re%20y%C4%B1ld%C4%B1zlar
```

![line shadcn](https://x-cmd.com/draw?type=line&labels=Oca,%C5%9Eub,Mar,Nis,May,Haz&values=12,19,15,25,22,30&title=Dile%20g%C3%B6re%20y%C4%B1ld%C4%B1zlar)

**evil**

```text
https://x-cmd.com/draw?type=line&t=evil&labels=Oca,%C5%9Eub,Mar,Nis,May,Haz&series=%C4%B0ndirme:12,19,15,25,22,30&series=CI:8,11,9,14,12,10
```

![line evil](https://x-cmd.com/draw?type=line&t=evil&labels=Oca,%C5%9Eub,Mar,Nis,May,Haz&series=%C4%B0ndirme:12,19,15,25,22,30&series=CI:8,11,9,14,12,10)

**evil-glow**

```text
https://x-cmd.com/draw?type=line&t=evil-glow&labels=Q1,Q2,Q3,Q4&values=3.1,3.4,3.2,3.8&title=B%C3%BCy%C3%BCme
```

![line evil-glow](https://x-cmd.com/draw?type=line&t=evil-glow&labels=Q1,Q2,Q3,Q4&values=3.1,3.4,3.2,3.8&title=B%C3%BCy%C3%BCme)

**opendata**

```text
https://x-cmd.com/draw?type=line&t=opendata&labels=v1,v2,v3&values=120,240,410&title=%C4%B0ndirmeler
```

![line opendata](https://x-cmd.com/draw?type=line&t=opendata&labels=v1,v2,v3&values=120,240,410&title=%C4%B0ndirmeler)

## Parametreler

| Parametreler | | |
|---|---|---|
| `labels=` | etiketler, virgülle ayrılmış | ✓ |
| `values=` | değerler, virgülle ayrılmış | ✓ |
| `series=` | seriler `ad:değerler`, tekrarlanabilir | ✗ |
| `title=` | başlık | ✗ |
| `t=` | stil ailesi | ✗ |

## `t=`

| | |
|---|---|
| `shadcn` |
| `evil` |
| `evil-glow` |
| `evil-mono` |
| `opendata` |

## Tuzaklar

- ≤60 nokta; çok çizgide her birinin yalnızca zirvesi işaretlenir
- başlıktaki boşlukları `%20` olarak kodla
