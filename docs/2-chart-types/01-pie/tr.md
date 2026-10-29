---
x-title: pie pasta — x-cmd/draw
x-desc: Yapay zekâ çağı için SVG grafikler: tek endpoint `/draw?type=. type=pie.
x-sidebar: draw
x-keywords: draw, pie, pasta, svg, chart
---

# pie pasta

`GET /draw?type=pie&...` — grafik çiz

## Örnekler

**opendata**

```text
https://x-cmd.com/draw?type=pie&title=En%20b%C3%BCy%C3%BCk%20%C5%9Fehirler&unit=mn&labels=%C4%B0stanbul,Ankara,%C4%B0zmir,Bursa&values=15.8,5.8,4.4,2.1
```

![pie opendata](https://x-cmd.com/draw?type=pie&title=En%20b%C3%BCy%C3%BCk%20%C5%9Fehirler&unit=mn&labels=%C4%B0stanbul,Ankara,%C4%B0zmir,Bursa&values=15.8,5.8,4.4,2.1)

**evil**

```text
https://x-cmd.com/draw?type=pie&t=evil&title=En%20b%C3%BCy%C3%BCk%20%C5%9Fehirler&unit=mn&labels=%C4%B0stanbul,Ankara,%C4%B0zmir,Bursa&values=15.8,5.8,4.4,2.1
```

![pie evil](https://x-cmd.com/draw?type=pie&t=evil&title=En%20b%C3%BCy%C3%BCk%20%C5%9Fehirler&unit=mn&labels=%C4%B0stanbul,Ankara,%C4%B0zmir,Bursa&values=15.8,5.8,4.4,2.1)

**evil-mono**

```text
https://x-cmd.com/draw?type=pie&t=evil-mono&title=En%20b%C3%BCy%C3%BCk%20%C5%9Fehirler&unit=mn&labels=%C4%B0stanbul,Ankara,%C4%B0zmir,Bursa&values=15.8,5.8,4.4,2.1
```

![pie evil-mono](https://x-cmd.com/draw?type=pie&t=evil-mono&title=En%20b%C3%BCy%C3%BCk%20%C5%9Fehirler&unit=mn&labels=%C4%B0stanbul,Ankara,%C4%B0zmir,Bursa&values=15.8,5.8,4.4,2.1)

**market-mono**

```text
https://x-cmd.com/draw?type=pie&t=market-mono&title=En%20b%C3%BCy%C3%BCk%20%C5%9Fehirler&unit=mn&labels=%C4%B0stanbul,Ankara,%C4%B0zmir,Bursa&values=15.8,5.8,4.4,2.1
```

![pie market-mono](https://x-cmd.com/draw?type=pie&t=market-mono&title=En%20b%C3%BCy%C3%BCk%20%C5%9Fehirler&unit=mn&labels=%C4%B0stanbul,Ankara,%C4%B0zmir,Bursa&values=15.8,5.8,4.4,2.1)

**progress**

```text
https://x-cmd.com/draw?type=pie&t=progress&title=En%20b%C3%BCy%C3%BCk%20%C5%9Fehirler&unit=mn&labels=%C4%B0stanbul,Ankara,%C4%B0zmir,Bursa&values=15.8,5.8,4.4,2.1
```

![pie progress](https://x-cmd.com/draw?type=pie&t=progress&title=En%20b%C3%BCy%C3%BCk%20%C5%9Fehirler&unit=mn&labels=%C4%B0stanbul,Ankara,%C4%B0zmir,Bursa&values=15.8,5.8,4.4,2.1)

**revenue**

```text
https://x-cmd.com/draw?type=pie&t=revenue&title=En%20b%C3%BCy%C3%BCk%20%C5%9Fehirler&unit=mn&labels=%C4%B0stanbul,Ankara,%C4%B0zmir,Bursa&values=15.8,5.8,4.4,2.1
```

![pie revenue](https://x-cmd.com/draw?type=pie&t=revenue&title=En%20b%C3%BCy%C3%BCk%20%C5%9Fehirler&unit=mn&labels=%C4%B0stanbul,Ankara,%C4%B0zmir,Bursa&values=15.8,5.8,4.4,2.1)

## Parametreler

| Parametreler | | |
|---|---|---|
| `labels=` | etiketler, virgülle ayrılmış | ✓ |
| `values=` | değerler, virgülle ayrılmış | ✓ |
| `title=` | başlık | ✗ |
| `unit=` | birim | ✗ |
| `donut=` | 0 = dolu pasta | ✗ |
| `t=` | stil ailesi | ✗ |

## `t=`

| | |
|---|---|
| `opendata` |
| `evil` |
| `evil-mono` |
| `market-mono` |
| `progress` |
| `revenue` |

## Tuzaklar

- ≤100 sınıf; 9 üzeri Other’da birleşir
- dolu pasta ve halka farkı yalnızca `donut=` — stil değiştirme
- bazı stillerin kontrastı karanlık modda değişir
- başlıktaki boşlukları `%20` olarak kodla
