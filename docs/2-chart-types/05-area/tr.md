---
x-title: area alan — x-cmd/draw
x-desc: Yapay zekâ çağı için SVG grafikler: tek endpoint `/draw?type=. type=area.
x-sidebar: draw
x-keywords: draw, area, alan, svg, chart
---

# area alan

`GET /draw?type=area&...` — grafik çiz

## Örnekler

**evil**

```text
https://x-cmd.com/draw?type=area&labels=Pzt,Sal,%C3%87ar&series=dev:30,42,38&series=CI:12,18,9&title=%C4%B0ndirmeler
```

![area evil](https://x-cmd.com/draw?type=area&labels=Pzt,Sal,%C3%87ar&series=dev:30,42,38&series=CI:12,18,9&title=%C4%B0ndirmeler)

**star**

```text
https://x-cmd.com/draw?type=area&t=star&labels=Pzt,Sal,%C3%87ar&values=3,5,4&title=B%C3%BCy%C3%BCme
```

![area star](https://x-cmd.com/draw?type=area&t=star&labels=Pzt,Sal,%C3%87ar&values=3,5,4&title=B%C3%BCy%C3%BCme)

**opendata**

```text
https://x-cmd.com/draw?type=area&t=opendata&labels=2019,2020,2021,2022&values=1.2,2.8,6.4,14.1&title=B%C3%BCy%C3%BCme&source=x-cmd.com%2Fdraw
```

![area opendata](https://x-cmd.com/draw?type=area&t=opendata&labels=2019,2020,2021,2022&values=1.2,2.8,6.4,14.1&title=B%C3%BCy%C3%BCme&source=x-cmd.com%2Fdraw)

**pixel**

```text
https://x-cmd.com/draw?type=area&t=pixel&labels=a,b,c,d&values=2,4,3,5&title=B%C3%BCy%C3%BCme
```

![area pixel](https://x-cmd.com/draw?type=area&t=pixel&labels=a,b,c,d&values=2,4,3,5&title=B%C3%BCy%C3%BCme)

## Parametreler

| Parametreler | | |
|---|---|---|
| `labels=` | etiketler, virgülle ayrılmış | ✓ |
| `values=` | değerler, virgülle ayrılmış | ✓ |
| `series=` | seriler `ad:değerler`, tekrarlanabilir | ✗ |
| `source=` | veri kaynağı (yalnız area) | ✗ |
| `subtitle=` | editoryal alt başlık (area opendata) | ✗ |
| `t=` | stil ailesi | ✗ |

## `t=`

| | |
|---|---|
| `evil` |
| `star` |
| `opendata` |
| `pixel` |
| `polka` |

## Tuzaklar

- ≤60 nokta; çok çizgide her birinin yalnızca zirvesi işaretlenir
- başlıktaki boşlukları `%20` olarak kodla
