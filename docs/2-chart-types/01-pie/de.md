---
x-title: pie Kreis — x-cmd/draw
x-desc: SVG-Diagramme für das KI-Zeitalter: ein Endpunkt `/draw?type=. type=pie.
x-sidebar: draw
x-keywords: draw, pie, Kreis, svg, chart
---

# pie Kreis

`GET /draw?type=pie&...` — Diagramm rendern

## Beispiele

**opendata**

```text
https://x-cmd.com/draw?type=pie&title=Gr%C3%B6%C3%9Fte%20St%C3%A4dte&unit=Mio.&labels=Berlin,Hamburg,M%C3%BCnchen,K%C3%B6ln&values=3.6,1.8,1.5,1.1
```

![pie opendata](https://x-cmd.com/draw?type=pie&title=Gr%C3%B6%C3%9Fte%20St%C3%A4dte&unit=Mio.&labels=Berlin,Hamburg,M%C3%BCnchen,K%C3%B6ln&values=3.6,1.8,1.5,1.1)

**evil**

```text
https://x-cmd.com/draw?type=pie&t=evil&title=Gr%C3%B6%C3%9Fte%20St%C3%A4dte&unit=Mio.&labels=Berlin,Hamburg,M%C3%BCnchen,K%C3%B6ln&values=3.6,1.8,1.5,1.1
```

![pie evil](https://x-cmd.com/draw?type=pie&t=evil&title=Gr%C3%B6%C3%9Fte%20St%C3%A4dte&unit=Mio.&labels=Berlin,Hamburg,M%C3%BCnchen,K%C3%B6ln&values=3.6,1.8,1.5,1.1)

**evil-mono**

```text
https://x-cmd.com/draw?type=pie&t=evil-mono&title=Gr%C3%B6%C3%9Fte%20St%C3%A4dte&unit=Mio.&labels=Berlin,Hamburg,M%C3%BCnchen,K%C3%B6ln&values=3.6,1.8,1.5,1.1
```

![pie evil-mono](https://x-cmd.com/draw?type=pie&t=evil-mono&title=Gr%C3%B6%C3%9Fte%20St%C3%A4dte&unit=Mio.&labels=Berlin,Hamburg,M%C3%BCnchen,K%C3%B6ln&values=3.6,1.8,1.5,1.1)

**market-mono**

```text
https://x-cmd.com/draw?type=pie&t=market-mono&title=Gr%C3%B6%C3%9Fte%20St%C3%A4dte&unit=Mio.&labels=Berlin,Hamburg,M%C3%BCnchen,K%C3%B6ln&values=3.6,1.8,1.5,1.1
```

![pie market-mono](https://x-cmd.com/draw?type=pie&t=market-mono&title=Gr%C3%B6%C3%9Fte%20St%C3%A4dte&unit=Mio.&labels=Berlin,Hamburg,M%C3%BCnchen,K%C3%B6ln&values=3.6,1.8,1.5,1.1)

**progress**

```text
https://x-cmd.com/draw?type=pie&t=progress&title=Gr%C3%B6%C3%9Fte%20St%C3%A4dte&unit=Mio.&labels=Berlin,Hamburg,M%C3%BCnchen,K%C3%B6ln&values=3.6,1.8,1.5,1.1
```

![pie progress](https://x-cmd.com/draw?type=pie&t=progress&title=Gr%C3%B6%C3%9Fte%20St%C3%A4dte&unit=Mio.&labels=Berlin,Hamburg,M%C3%BCnchen,K%C3%B6ln&values=3.6,1.8,1.5,1.1)

**revenue**

```text
https://x-cmd.com/draw?type=pie&t=revenue&title=Gr%C3%B6%C3%9Fte%20St%C3%A4dte&unit=Mio.&labels=Berlin,Hamburg,M%C3%BCnchen,K%C3%B6ln&values=3.6,1.8,1.5,1.1
```

![pie revenue](https://x-cmd.com/draw?type=pie&t=revenue&title=Gr%C3%B6%C3%9Fte%20St%C3%A4dte&unit=Mio.&labels=Berlin,Hamburg,M%C3%BCnchen,K%C3%B6ln&values=3.6,1.8,1.5,1.1)

## Parameter

| Parameter | | |
|---|---|---|
| `labels=` | Beschriftungen, kommagetrennt | ✓ |
| `values=` | Werte, kommagetrennt | ✓ |
| `title=` | Titel | ✗ |
| `unit=` | Einheit | ✗ |
| `donut=` | 0 = volle Kreis | ✗ |
| `t=` | Stil-Familie | ✗ |

## `t=`

| | |
|---|---|
| `opendata` |
| `evil` |
| `evil-mono` |
| `market-mono` |
| `progress` |
| `revenue` |

## Stolpersteine

- ≤100 Klassen; über 9 werden automatisch zu Other zusammengefasst
- Vollkreis vs. Ring ist nur `donut=` — dafür keinen Stil wechseln
- Die Kontraste mancher Stile ändern sich im Dark Mode
- Leerzeichen im Titel als `%20` kodieren
