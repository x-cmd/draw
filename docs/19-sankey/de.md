---
x-title: sankey Sankey — x-cmd/draw
x-desc: SVG-Diagramme für das KI-Zeitalter: ein Endpunkt `/draw?type=. type=sankey.
x-sidebar: draw
x-keywords: draw, sankey, Sankey, svg, chart
---

# sankey Sankey

`GET /draw?type=sankey&...` — Diagramm rendern

## Beispiele

**pipeline**

```text
https://x-cmd.com/draw?type=sankey&t=pipeline&labels=Feature,Fix,Doku,Chores,gemerged,geschlossen,abgelehnt,%3C1J,1%E2%80%932J,%3E2J&links=Feature%3Egemerged:38;Feature%3Egeschlossen:12;Feature%3Eabgelehnt:8;Fix%3Egemerged:33;Fix%3Egeschlossen:6;Fix%3Eabgelehnt:2;Doku%3Egemerged:16;Doku%3Egeschlossen:4;Chores%3Egemerged:5;Chores%3Egeschlossen:6;Chores%3Eabgelehnt:6;gemerged%3E%3C1J:52;gemerged%3E1%E2%80%932J:28;gemerged%3E%3E2J:12;geschlossen%3E%3C1J:14;geschlossen%3E1%E2%80%932J:9;geschlossen%3E%3E2J:5;abgelehnt%3E%3C1J:9;abgelehnt%3E1%E2%80%932J:5;abgelehnt%3E%3E2J:2&title=Pull-Request-Lebenszyklus&unit=prs
```

![sankey pipeline](https://x-cmd.com/draw?type=sankey&t=pipeline&labels=Feature,Fix,Doku,Chores,gemerged,geschlossen,abgelehnt,%3C1J,1%E2%80%932J,%3E2J&links=Feature%3Egemerged:38;Feature%3Egeschlossen:12;Feature%3Eabgelehnt:8;Fix%3Egemerged:33;Fix%3Egeschlossen:6;Fix%3Eabgelehnt:2;Doku%3Egemerged:16;Doku%3Egeschlossen:4;Chores%3Egemerged:5;Chores%3Egeschlossen:6;Chores%3Eabgelehnt:6;gemerged%3E%3C1J:52;gemerged%3E1%E2%80%932J:28;gemerged%3E%3E2J:12;geschlossen%3E%3C1J:14;geschlossen%3E1%E2%80%932J:9;geschlossen%3E%3E2J:5;abgelehnt%3E%3C1J:9;abgelehnt%3E1%E2%80%932J:5;abgelehnt%3E%3E2J:2&title=Pull-Request-Lebenszyklus&unit=prs)

**fund**

```text
https://x-cmd.com/draw?type=sankey&t=fund&labels=Feature,Fix,gemerged,geschlossen,%3C1J,1%E2%80%932J&links=Feature%3Egemerged:50;Feature%3Egeschlossen:20;Fix%3Egemerged:30;Fix%3Egeschlossen:10;gemerged%3E%3C1J:52;gemerged%3E1%E2%80%932J:28;geschlossen%3E%3C1J:14;geschlossen%3E1%E2%80%932J:9&title=Pull-Request-Lebenszyklus
```

![sankey fund](https://x-cmd.com/draw?type=sankey&t=fund&labels=Feature,Fix,gemerged,geschlossen,%3C1J,1%E2%80%932J&links=Feature%3Egemerged:50;Feature%3Egeschlossen:20;Fix%3Egemerged:30;Fix%3Egeschlossen:10;gemerged%3E%3C1J:52;gemerged%3E1%E2%80%932J:28;geschlossen%3E%3C1J:14;geschlossen%3E1%E2%80%932J:9&title=Pull-Request-Lebenszyklus)

**base**

```text
https://x-cmd.com/draw?type=sankey&labels=Feature,gemerged,geschlossen,%3C1J,1%E2%80%932J&links=Feature%3Egemerged:71;Feature%3Egeschlossen:22;gemerged%3E%3C1J:52;gemerged%3E1%E2%80%932J:19;geschlossen%3E%3C1J:14;geschlossen%3E1%E2%80%932J:8&title=Pull-Request-Lebenszyklus
```

![sankey base](https://x-cmd.com/draw?type=sankey&labels=Feature,gemerged,geschlossen,%3C1J,1%E2%80%932J&links=Feature%3Egemerged:71;Feature%3Egeschlossen:22;gemerged%3E%3C1J:52;gemerged%3E1%E2%80%932J:19;geschlossen%3E%3C1J:14;geschlossen%3E1%E2%80%932J:8&title=Pull-Request-Lebenszyklus)

## Parameter

| Parameter | | |
|---|---|---|
| `labels=` | Knoten, kommagetrennt | ✓ |
| `links=` | Flüsse `A>B:wert`;-getrennt | ✓ |
| `title=` | Titel | ✗ |
| `unit=` | Einheit | ✗ |
| `t=` | Stil-Familie | ✗ |

## `t=`

| | |
|---|---|
| `base` |
| `fund` |
| `pipeline` |

## Stolpersteine

- ≤24 Knoten / 60 Flüsse; Zyklen werden abgelehnt
- Flüsse bilden ein DAG — Prüfsumme stimmt mit labels überein
- Leerzeichen im Titel als `%20` kodieren
