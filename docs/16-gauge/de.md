---
x-title: gauge Messuhr — x-cmd/draw
x-desc: SVG-Diagramme für das KI-Zeitalter: ein Endpunkt `/draw?type=. type=gauge.
x-sidebar: draw
x-keywords: draw, gauge, Messuhr, svg, chart
---

# gauge Messuhr

`GET /draw?type=gauge&...` — Diagramm rendern

## Beispiele

**base**

```text
https://x-cmd.com/draw?type=gauge&title=CI-Quote&value=87&max=100
```

![gauge base](https://x-cmd.com/draw?type=gauge&title=CI-Quote&value=87&max=100)

**gradient**

```text
https://x-cmd.com/draw?type=gauge&t=gradient&title=CI-Quote&value=87&max=100
```

![gauge gradient](https://x-cmd.com/draw?type=gauge&t=gradient&title=CI-Quote&value=87&max=100)

**reliability**

```text
https://x-cmd.com/draw?type=gauge&t=reliability&title=CI-Quote&value=99.9&max=100
```

![gauge reliability](https://x-cmd.com/draw?type=gauge&t=reliability&title=CI-Quote&value=99.9&max=100)

## Parameter

| Parameter | | |
|---|---|---|
| `value=` | aktueller Wert | ✓ |
| `max=` | Maximum (Standard 100) | ✗ |
| `labels=` | Ring-Beschriftungen (Mehrfachring) | ✗ |
| `values=` | Ring-Werte (Prozent) | ✗ |
| `title=` | Titel | ✗ |
| `t=` | Stil-Familie | ✗ |

## `t=`

| | |
|---|---|
| `base` |
| `gradient` |
| `reliability` |

## Stolpersteine

- Ein Messwert pro Diagramm; mehrere Werte → combo/line
- Leerzeichen im Titel als `%20` kodieren
