---
x-title: bar kolon — x-cmd/draw
x-desc: Yapay zekâ çağı için SVG grafikler: tek endpoint `/draw?type=. type=bar.
x-sidebar: draw
x-keywords: draw, bar, kolon, svg, chart
---

# bar kolon

`GET /draw?type=bar&...` — grafik çiz

## Örnekler

**evil**

```text
https://x-cmd.com/draw?type=bar&t=evil&labels=Pzt,Sal,%C3%87ar,Per,Cum,Cmt,Paz&series=%C4%B0ndirme:34,87,51,63,45,78,39&series=B%C3%BCy%C3%BCme:18,49,29,39,31,45,23
```

![bar evil](https://x-cmd.com/draw?type=bar&t=evil&labels=Pzt,Sal,%C3%87ar,Per,Cum,Cmt,Paz&series=%C4%B0ndirme:34,87,51,63,45,78,39&series=B%C3%BCy%C3%BCme:18,49,29,39,31,45,23)

**base**

```text
https://x-cmd.com/draw?type=bar&labels=Pzt,Sal,%C3%87ar&series=dev:12,18,9&series=CI:8,11,6
```

![bar base](https://x-cmd.com/draw?type=bar&labels=Pzt,Sal,%C3%87ar&series=dev:12,18,9&series=CI:8,11,6)

**grid**

```text
https://x-cmd.com/draw?type=bar&t=grid&labels=Pzt,Sal,%C3%87ar&values=12,18,9
```

![bar grid](https://x-cmd.com/draw?type=bar&t=grid&labels=Pzt,Sal,%C3%87ar&values=12,18,9)

**evil stack**

```text
https://x-cmd.com/draw?type=bar&stack=1&labels=Pzt,Sal,%C3%87ar&series=dev:12,18,9&series=CI:8,11,6
```

![bar evil stack](https://x-cmd.com/draw?type=bar&stack=1&labels=Pzt,Sal,%C3%87ar&series=dev:12,18,9&series=CI:8,11,6)

## Parametreler

| Parametreler | | |
|---|---|---|
| `labels=` | etiketler, virgülle ayrılmış | ✓ |
| `values=` | değerler, virgülle ayrılmış | ✓ |
| `series=` | seriler `ad:değerler`, tekrarlanabilir | ✗ |
| `stack=` | 1 = istifli | ✗ |
| `title=` | başlık | ✗ |
| `t=` | stil ailesi | ✗ |

## `t=`

| | |
|---|---|
| `evil` |
| `base` |
| `grid` |

## Tuzaklar

- ≤30 grup, ≤6 seri
- aşırı farklarda otomatik yüzde istif
- başlıktaki boşlukları `%20` olarak kodla
