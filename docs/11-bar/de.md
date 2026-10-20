---
x-title: bar Säulen — x-cmd/draw
x-desc: SVG-Diagramme für das KI-Zeitalter: ein Endpunkt `/draw?type=. type=bar.
x-sidebar: draw
x-keywords: draw, bar, Säulen, svg, chart
---

# bar Säulen

`GET /draw?type=bar&...` — Diagramm rendern

## Beispiele

**evil**

```text
https://x-cmd.com/draw?type=bar&t=evil&labels=Mo,Di,Mi,Do,Fr,Sa,So&series=Downloads:34,87,51,63,45,78,39&series=Wachstum:18,49,29,39,31,45,23
```

![bar evil](https://x-cmd.com/draw?type=bar&t=evil&labels=Mo,Di,Mi,Do,Fr,Sa,So&series=Downloads:34,87,51,63,45,78,39&series=Wachstum:18,49,29,39,31,45,23)

**base**

```text
https://x-cmd.com/draw?type=bar&labels=Mo,Di,Mi&series=dev:12,18,9&series=CI:8,11,6
```

![bar base](https://x-cmd.com/draw?type=bar&labels=Mo,Di,Mi&series=dev:12,18,9&series=CI:8,11,6)

**grid**

```text
https://x-cmd.com/draw?type=bar&t=grid&labels=Mo,Di,Mi&values=12,18,9
```

![bar grid](https://x-cmd.com/draw?type=bar&t=grid&labels=Mo,Di,Mi&values=12,18,9)

**evil stack**

```text
https://x-cmd.com/draw?type=bar&stack=1&labels=Mo,Di,Mi&series=dev:12,18,9&series=CI:8,11,6
```

![bar evil stack](https://x-cmd.com/draw?type=bar&stack=1&labels=Mo,Di,Mi&series=dev:12,18,9&series=CI:8,11,6)

## Parameter

| Parameter | | |
|---|---|---|
| `labels=` | Beschriftungen, kommagetrennt | ✓ |
| `values=` | Werte, kommagetrennt | ✓ |
| `series=` | Serien `name:werte`, wiederholbar | ✗ |
| `stack=` | 1 = gestapelt | ✗ |
| `title=` | Titel | ✗ |
| `t=` | Stil-Familie | ✗ |

## `t=`

| | |
|---|---|
| `evil` |
| `base` |
| `grid` |

## Stolpersteine

- ≤30 Gruppen, ≤6 Serien
- Bei extremen Größenunterschieden wird automatisch prozentual gestapelt
- Leerzeichen im Titel als `%20` kodieren
