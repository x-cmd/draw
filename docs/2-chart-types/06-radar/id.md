---
x-title: radar radar — x-cmd/draw
x-desc: Grafik SVG untuk era AI: satu endpoint `/draw?type=. type=radar.
x-sidebar: draw
x-keywords: draw, radar, radar, svg, chart
---

# radar radar

`GET /draw?type=radar&...` — render grafik

## Contoh

**base**

```text
https://x-cmd.com/draw?type=radar&labels=startup,ekosistem,ekstensibilitas,memori,kemudahan&values=85,90,70,80,95&title=Perbandingan%20editor
```

![radar base](https://x-cmd.com/draw?type=radar&labels=startup,ekosistem,ekstensibilitas,memori,kemudahan&values=85,90,70,80,95&title=Perbandingan%20editor)

**evil**

```text
https://x-cmd.com/draw?type=radar&t=evil&labels=startup,ekosistem,ekstensibilitas,memori,kemudahan&series=vscode:60,95,90,55,80&series=neovim:95,65,85,95,35&series=zed:92,50,55,90,60&title=Perbandingan%20editor
```

![radar evil](https://x-cmd.com/draw?type=radar&t=evil&labels=startup,ekosistem,ekstensibilitas,memori,kemudahan&series=vscode:60,95,90,55,80&series=neovim:95,65,85,95,35&series=zed:92,50,55,90,60&title=Perbandingan%20editor)

**xcmd**

```text
https://x-cmd.com/draw?type=radar&t=xcmd&labels=startup,ekosistem,ekstensibilitas,memori,kemudahan&values=8,6,9,7,5&title=Perbandingan%20editor
```

![radar xcmd](https://x-cmd.com/draw?type=radar&t=xcmd&labels=startup,ekosistem,ekstensibilitas,memori,kemudahan&values=8,6,9,7,5&title=Perbandingan%20editor)

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
| `base` |
| `evil` |
| `xcmd` |

## Jebakan

- 3–12 sumbu
- multi-seri butuh `t=evil`
- enkode spasi pada judul jadi `%20`
