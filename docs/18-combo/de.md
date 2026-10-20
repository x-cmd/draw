---
x-title: combo Kombination — x-cmd/draw
x-desc: SVG-Diagramme für das KI-Zeitalter: ein Endpunkt `/draw?type=. type=combo.
x-sidebar: draw
x-keywords: draw, combo, Kombination, svg, chart
---

# combo Kombination

`GET /draw?type=combo&...` — Diagramm rendern

## Beispiele

**base**

```text
https://x-cmd.com/draw?type=combo&labels=Mo,Di,Mi,Do,Fr,Sa,So&series=Downloads:120,180,150,210,240,200,260&line=Wachstum:3.1,3.4,3.2,3.8,4.1,3.9,4.5&title=W%C3%B6chentliche%20Downloads&unit=dl
```

![combo base](https://x-cmd.com/draw?type=combo&labels=Mo,Di,Mi,Do,Fr,Sa,So&series=Downloads:120,180,150,210,240,200,260&line=Wachstum:3.1,3.4,3.2,3.8,4.1,3.9,4.5&title=W%C3%B6chentliche%20Downloads&unit=dl)

**evil**

```text
https://x-cmd.com/draw?type=combo&t=evil&labels=Mo,Di,Mi&series=Downloads:9,12,15&line=Wachstum:1.1,1.4,1.8&title=W%C3%B6chentliche%20Downloads
```

![combo evil](https://x-cmd.com/draw?type=combo&t=evil&labels=Mo,Di,Mi&series=Downloads:9,12,15&line=Wachstum:1.1,1.4,1.8&title=W%C3%B6chentliche%20Downloads)

## Parameter

| Parameter | | |
|---|---|---|
| `labels=` | Beschriftungen, kommagetrennt | ✓ |
| `series=` | Serien `name:werte`, wiederholbar | ✓ |
| `line=` | Linienserie `name:werte` | ✗ |
| `stack=` | 1 = gestapelt | ✗ |
| `title=` | Titel | ✗ |
| `t=` | Stil-Familie | ✗ |

## `t=`

| | |
|---|---|
| `base` |
| `evil` |

## Stolpersteine

- Balken + Linie; Doppelachse ab 5× Größenunterschied
- Leerzeichen im Titel als `%20` kodieren
