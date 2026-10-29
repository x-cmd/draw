---
x-title: radar Radar — x-cmd/draw
x-desc: SVG-Diagramme für das KI-Zeitalter: ein Endpunkt `/draw?type=. type=radar.
x-sidebar: draw
x-keywords: draw, radar, Radar, svg, chart
---

# radar Radar

`GET /draw?type=radar&...` — Diagramm rendern

## Beispiele

**base**

```text
https://x-cmd.com/draw?type=radar&labels=Start,%C3%96kosystem,Erweiterbarkeit,Speicher,Einfachheit&values=85,90,70,80,95&title=Editor-Vergleich
```

![radar base](https://x-cmd.com/draw?type=radar&labels=Start,%C3%96kosystem,Erweiterbarkeit,Speicher,Einfachheit&values=85,90,70,80,95&title=Editor-Vergleich)

**evil**

```text
https://x-cmd.com/draw?type=radar&t=evil&labels=Start,%C3%96kosystem,Erweiterbarkeit,Speicher,Einfachheit&series=vscode:60,95,90,55,80&series=neovim:95,65,85,95,35&series=zed:92,50,55,90,60&title=Editor-Vergleich
```

![radar evil](https://x-cmd.com/draw?type=radar&t=evil&labels=Start,%C3%96kosystem,Erweiterbarkeit,Speicher,Einfachheit&series=vscode:60,95,90,55,80&series=neovim:95,65,85,95,35&series=zed:92,50,55,90,60&title=Editor-Vergleich)

**xcmd**

```text
https://x-cmd.com/draw?type=radar&t=xcmd&labels=Start,%C3%96kosystem,Erweiterbarkeit,Speicher,Einfachheit&values=8,6,9,7,5&title=Editor-Vergleich
```

![radar xcmd](https://x-cmd.com/draw?type=radar&t=xcmd&labels=Start,%C3%96kosystem,Erweiterbarkeit,Speicher,Einfachheit&values=8,6,9,7,5&title=Editor-Vergleich)

## Parameter

| Parameter | | |
|---|---|---|
| `labels=` | Beschriftungen, kommagetrennt | ✓ |
| `values=` | Werte, kommagetrennt | ✓ |
| `series=` | Serien `name:werte`, wiederholbar | ✗ |
| `title=` | Titel | ✗ |
| `t=` | Stil-Familie | ✗ |

## `t=`

| | |
|---|---|
| `base` |
| `evil` |
| `xcmd` |

## Stolpersteine

- 3–12 Achsen
- Mehrere Serien erfordern `t=evil`
- Leerzeichen im Titel als `%20` kodieren
