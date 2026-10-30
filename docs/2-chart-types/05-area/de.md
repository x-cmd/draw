---
x-title: area Fläche — x-cmd/draw
x-desc: SVG-Diagramme für das KI-Zeitalter: ein Endpunkt `/draw?type=. type=area.
x-sidebar: draw
x-keywords: draw, area, Fläche, svg, chart
---

# area Fläche

`GET /draw?type=area&...` — Diagramm rendern

## Beispiele

**evil**

```text
https://x-cmd.com/draw?type=area&labels=Mo,Di,Mi&series=dev:30,42,38&series=CI:12,18,9&title=Downloads
```

![area evil](https://x-cmd.com/draw?type=area&labels=Mo,Di,Mi&series=dev:30,42,38&series=CI:12,18,9&title=Downloads)

**star**

```text
https://x-cmd.com/draw?type=area&t=star&labels=Mo,Di,Mi&values=3,5,4&title=Wachstum
```

![area star](https://x-cmd.com/draw?type=area&t=star&labels=Mo,Di,Mi&values=3,5,4&title=Wachstum)

**opendata**

```text
https://x-cmd.com/draw?type=area&t=opendata&labels=2019,2020,2021,2022&values=1.2,2.8,6.4,14.1&title=Wachstum&source=x-cmd.com%2Fdraw
```

![area opendata](https://x-cmd.com/draw?type=area&t=opendata&labels=2019,2020,2021,2022&values=1.2,2.8,6.4,14.1&title=Wachstum&source=x-cmd.com%2Fdraw)

**pixel**

```text
https://x-cmd.com/draw?type=area&t=pixel&labels=a,b,c,d&values=2,4,3,5&title=Wachstum
```

![area pixel](https://x-cmd.com/draw?type=area&t=pixel&labels=a,b,c,d&values=2,4,3,5&title=Wachstum)

## Parameter

| Parameter | | |
|---|---|---|
| `labels=` | Beschriftungen, kommagetrennt | ✓ |
| `values=` | Werte, kommagetrennt | ✓ |
| `series=` | Serien `name:werte`, wiederholbar | ✗ |
| `source=` | Quellenangabe (nur area) | ✗ |
| `subtitle=` | Redaktioneller Untertitel (area opendata) | ✗ |
| `t=` | Stil-Familie | ✗ |

## `t=`

| | |
|---|---|
| `evil` |
| `star` |
| `opendata` |
| `pixel` |
| `polka` |

## Stolpersteine

- ≤60 Punkte; bei mehreren Linien wird nur je Spitzwert markiert
- Leerzeichen im Titel als `%20` kodieren
