---
x-title: radar radar — x-cmd/draw
x-desc: Yapay zekâ çağı için SVG grafikler: tek endpoint `/draw?type=. type=radar.
x-sidebar: draw
x-keywords: draw, radar, radar, svg, chart
---

# radar radar

`GET /draw?type=radar&...` — grafik çiz

## Örnekler

**base**

```text
https://x-cmd.com/draw?type=radar&labels=ba%C5%9Flang%C4%B1%C3%A7,ekosistem,geni%C5%9Fletilebilirlik,bellek,kolayl%C4%B1k&values=85,90,70,80,95&title=Edit%C3%B6r%20kar%C5%9F%C4%B1la%C5%9Ft%C4%B1rmas%C4%B1
```

![radar base](https://x-cmd.com/draw?type=radar&labels=ba%C5%9Flang%C4%B1%C3%A7,ekosistem,geni%C5%9Fletilebilirlik,bellek,kolayl%C4%B1k&values=85,90,70,80,95&title=Edit%C3%B6r%20kar%C5%9F%C4%B1la%C5%9Ft%C4%B1rmas%C4%B1)

**evil**

```text
https://x-cmd.com/draw?type=radar&t=evil&labels=ba%C5%9Flang%C4%B1%C3%A7,ekosistem,geni%C5%9Fletilebilirlik,bellek,kolayl%C4%B1k&series=vscode:60,95,90,55,80&series=neovim:95,65,85,95,35&series=zed:92,50,55,90,60&title=Edit%C3%B6r%20kar%C5%9F%C4%B1la%C5%9Ft%C4%B1rmas%C4%B1
```

![radar evil](https://x-cmd.com/draw?type=radar&t=evil&labels=ba%C5%9Flang%C4%B1%C3%A7,ekosistem,geni%C5%9Fletilebilirlik,bellek,kolayl%C4%B1k&series=vscode:60,95,90,55,80&series=neovim:95,65,85,95,35&series=zed:92,50,55,90,60&title=Edit%C3%B6r%20kar%C5%9F%C4%B1la%C5%9Ft%C4%B1rmas%C4%B1)

**xcmd**

```text
https://x-cmd.com/draw?type=radar&t=xcmd&labels=ba%C5%9Flang%C4%B1%C3%A7,ekosistem,geni%C5%9Fletilebilirlik,bellek,kolayl%C4%B1k&values=8,6,9,7,5&title=Edit%C3%B6r%20kar%C5%9F%C4%B1la%C5%9Ft%C4%B1rmas%C4%B1
```

![radar xcmd](https://x-cmd.com/draw?type=radar&t=xcmd&labels=ba%C5%9Flang%C4%B1%C3%A7,ekosistem,geni%C5%9Fletilebilirlik,bellek,kolayl%C4%B1k&values=8,6,9,7,5&title=Edit%C3%B6r%20kar%C5%9F%C4%B1la%C5%9Ft%C4%B1rmas%C4%B1)

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
| `base` |
| `evil` |
| `xcmd` |

## Tuzaklar

- 3–12 eksen
- çok seri için `t=evil` gerekir
- başlıktaki boşlukları `%20` olarak kodla
