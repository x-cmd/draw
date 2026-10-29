---
x-title: combo kombine — x-cmd/draw
x-desc: Yapay zekâ çağı için SVG grafikler: tek endpoint `/draw?type=. type=combo.
x-sidebar: draw
x-keywords: draw, combo, kombine, svg, chart
---

# combo kombine

`GET /draw?type=combo&...` — grafik çiz

## Örnekler

**base**

```text
https://x-cmd.com/draw?type=combo&labels=Pzt,Sal,%C3%87ar,Per,Cum,Cmt,Paz&series=%C4%B0ndirme:120,180,150,210,240,200,260&line=B%C3%BCy%C3%BCme:3.1,3.4,3.2,3.8,4.1,3.9,4.5&title=Haftal%C4%B1k%20indirmeler&unit=dl
```

![combo base](https://x-cmd.com/draw?type=combo&labels=Pzt,Sal,%C3%87ar,Per,Cum,Cmt,Paz&series=%C4%B0ndirme:120,180,150,210,240,200,260&line=B%C3%BCy%C3%BCme:3.1,3.4,3.2,3.8,4.1,3.9,4.5&title=Haftal%C4%B1k%20indirmeler&unit=dl)

**evil**

```text
https://x-cmd.com/draw?type=combo&t=evil&labels=Pzt,Sal,%C3%87ar&series=%C4%B0ndirme:9,12,15&line=B%C3%BCy%C3%BCme:1.1,1.4,1.8&title=Haftal%C4%B1k%20indirmeler
```

![combo evil](https://x-cmd.com/draw?type=combo&t=evil&labels=Pzt,Sal,%C3%87ar&series=%C4%B0ndirme:9,12,15&line=B%C3%BCy%C3%BCme:1.1,1.4,1.8&title=Haftal%C4%B1k%20indirmeler)

## Parametreler

| Parametreler | | |
|---|---|---|
| `labels=` | etiketler, virgülle ayrılmış | ✓ |
| `series=` | seriler `ad:değerler`, tekrarlanabilir | ✓ |
| `line=` | çizgi serisi `ad:değerler` | ✗ |
| `stack=` | 1 = istifli | ✗ |
| `title=` | başlık | ✗ |
| `t=` | stil ailesi | ✗ |

## `t=`

| | |
|---|---|
| `base` |
| `evil` |

## Tuzaklar

- kolon + çizgi; 5× farktan itibaren çift eksen
- başlıktaki boşlukları `%20` olarak kodla
