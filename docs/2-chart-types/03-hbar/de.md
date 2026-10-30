---
x-title: hbar Horizontalbalken — x-cmd/draw
x-desc: SVG-Diagramme für das KI-Zeitalter: ein Endpunkt `/draw?type=. type=hbar.
x-sidebar: draw
x-keywords: draw, hbar, Horizontalbalken, svg, chart
---

# hbar Horizontalbalken

`GET /draw?type=hbar&...` — Diagramm rendern

## Beispiele

**base**

```text
https://x-cmd.com/draw?type=hbar&labels=CLI,Kern,Doku,UI&values=42,31,18,9&title=Commits%20nach%20Bereich
```

![hbar base](https://x-cmd.com/draw?type=hbar&labels=CLI,Kern,Doku,UI&values=42,31,18,9&title=Commits%20nach%20Bereich)

**opendata**

```text
https://x-cmd.com/draw?type=hbar&t=opendata&labels=CLI,Kern,Doku,UI&values=8,6,9,4&ref=7&reflabel=SLA&title=Commits%20nach%20Bereich
```

![hbar opendata](https://x-cmd.com/draw?type=hbar&t=opendata&labels=CLI,Kern,Doku,UI&values=8,6,9,4&ref=7&reflabel=SLA&title=Commits%20nach%20Bereich)

**xcmd**

```text
https://x-cmd.com/draw?type=hbar&t=xcmd&labels=Berlin,Hamburg,M%C3%BCnchen&values=68,21,11&title=Gr%C3%B6%C3%9Fte%20St%C3%A4dte
```

![hbar xcmd](https://x-cmd.com/draw?type=hbar&t=xcmd&labels=Berlin,Hamburg,M%C3%BCnchen&values=68,21,11&title=Gr%C3%B6%C3%9Fte%20St%C3%A4dte)

**xcmd-issue**

```text
https://x-cmd.com/draw?type=hbar&t=xcmd-issue&labels=CLI,Kern,Doku,ci,UI&series=offen:12,8,15,4,9&series=geschlossen:38,52,20,11,26&title=Issues%20nach%20Bereich
```

![hbar xcmd-issue](https://x-cmd.com/draw?type=hbar&t=xcmd-issue&labels=CLI,Kern,Doku,ci,UI&series=offen:12,8,15,4,9&series=geschlossen:38,52,20,11,26&title=Issues%20nach%20Bereich)

**rank**

```text
https://x-cmd.com/draw?type=hbar&t=rank&labels=Mo,Di,Mi&series=2025:80,95,110&series=2026:110,85,120&title=W%C3%B6chentliche%20Downloads
```

![hbar rank](https://x-cmd.com/draw?type=hbar&t=rank&labels=Mo,Di,Mi&series=2025:80,95,110&series=2026:110,85,120&title=W%C3%B6chentliche%20Downloads)

## Parameter

| Parameter | | |
|---|---|---|
| `labels=` | Beschriftungen, kommagetrennt | ✓ |
| `values=` | Werte, kommagetrennt | ✓ |
| `series=` | nur bestimmte Stile: 2 Serien | ✗ |
| `ref=` | Referenzlinienwert | ✗ |
| `reflabel=` | Referenzlinien-Text | ✗ |
| `t=` | Stil-Familie | ✗ |

## `t=`

| | |
|---|---|
| `base` |
| `opendata` |
| `xcmd` |
| `xcmd-issue` |
| `rank` |

## Stolpersteine

- ≤30 Balken, Standard einserie
- Zwei Serien nur mit `t=xcmd-issue` / `t=rank`
- Leerzeichen im Titel als `%20` kodieren
