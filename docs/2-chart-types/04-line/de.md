---
x-title: line Linie — x-cmd/draw
x-desc: SVG-Diagramme für das KI-Zeitalter: ein Endpunkt `/draw?type=. type=line.
x-sidebar: draw
x-keywords: draw, line, Linie, svg, chart
---

# line Linie

`GET /draw?type=line&...` — Diagramm rendern

## Beispiele

**shadcn**

```text
https://x-cmd.com/draw?type=line&labels=Jan,Feb,M%C3%A4r,Apr,Mai,Jun&values=12,19,15,25,22,30&title=Sterne%20nach%20Sprache
```

![line shadcn](https://x-cmd.com/draw?type=line&labels=Jan,Feb,M%C3%A4r,Apr,Mai,Jun&values=12,19,15,25,22,30&title=Sterne%20nach%20Sprache)

**evil**

```text
https://x-cmd.com/draw?type=line&t=evil&labels=Jan,Feb,M%C3%A4r,Apr,Mai,Jun&series=Downloads:12,19,15,25,22,30&series=CI:8,11,9,14,12,10
```

![line evil](https://x-cmd.com/draw?type=line&t=evil&labels=Jan,Feb,M%C3%A4r,Apr,Mai,Jun&series=Downloads:12,19,15,25,22,30&series=CI:8,11,9,14,12,10)

**evil-glow**

```text
https://x-cmd.com/draw?type=line&t=evil-glow&labels=Q1,Q2,Q3,Q4&values=3.1,3.4,3.2,3.8&title=Wachstum
```

![line evil-glow](https://x-cmd.com/draw?type=line&t=evil-glow&labels=Q1,Q2,Q3,Q4&values=3.1,3.4,3.2,3.8&title=Wachstum)

**opendata**

```text
https://x-cmd.com/draw?type=line&t=opendata&labels=v1,v2,v3&values=120,240,410&title=Downloads
```

![line opendata](https://x-cmd.com/draw?type=line&t=opendata&labels=v1,v2,v3&values=120,240,410&title=Downloads)

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
| `shadcn` |
| `evil` |
| `evil-glow` |
| `evil-mono` |
| `opendata` |

## Stolpersteine

- ≤60 Punkte; bei mehreren Linien wird nur je Spitzwert markiert
- Leerzeichen im Titel als `%20` kodieren
