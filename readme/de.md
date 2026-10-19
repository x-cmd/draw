# draw — SVG-Diagramme, deren Daten in der URL leben

> [English](../README.md) | **Deutsch**

[![JSR score](https://img.shields.io/badge/dynamic/json?url=https%3A%2F%2Fapi.jsr.io%2Fscopes%2Fx-cmd%2Fpackages%2Fdraw&query=%24.score&label=JSR%20score&color=yellowgreen)](https://jsr.io/@x-cmd/draw/score)

Alle Daten stehen in der URL — im Browser öffnen, als `<img>` einbetten oder ins README einfügen: Das SVG wird sofort gerendert und ist direkt von KI lesbar.

## Vorschau

### Kuchendiagramm — größte Städte

```text
https://x-cmd.com/draw?type=pie&title=Einwohner%20der%20gr%C3%B6%C3%9Ften%20St%C3%A4dte&unit=Mio.&labels=Berlin,Hamburg,M%C3%BCnchen,K%C3%B6ln&values=3.6,1.8,1.5,1.1
```

![Kuchendiagramm — größte Städte](https://x-cmd.com/draw?type=pie&title=Einwohner%20der%20gr%C3%B6%C3%9Ften%20St%C3%A4dte&unit=Mio.&labels=Berlin,Hamburg,M%C3%BCnchen,K%C3%B6ln&values=3.6,1.8,1.5,1.1)

### Balken — Ranking nach Bereich

```text
https://x-cmd.com/draw?type=hbar&labels=cli,core,docs,ui&values=42,31,18,9&title=Commits%20nach%20Bereich
```

![Balken — Ranking nach Bereich](https://x-cmd.com/draw?type=hbar&labels=cli,core,docs,ui&values=42,31,18,9&title=Commits%20nach%20Bereich)

### Kombination — Downloads vs. Wachstum

```text
https://x-cmd.com/draw?type=combo&labels=Mo,Di,Mi,Do,Fr,Sa,So&series=Downloads:120,180,150,210,240,200,260&line=Wachstum:3.1,3.4,3.2,3.8,4.1,3.9,4.5&title=W%C3%B6chentliche%20Downloads&unit=dl
```

![Kombination — Downloads vs. Wachstum](https://x-cmd.com/draw?type=combo&labels=Mo,Di,Mi,Do,Fr,Sa,So&series=Downloads:120,180,150,210,240,200,260&line=Wachstum:3.1,3.4,3.2,3.8,4.1,3.9,4.5&title=W%C3%B6chentliche%20Downloads&unit=dl)

### Sankey — Pull-Request-Lebenszyklus

```text
https://x-cmd.com/draw?type=sankey&t=pipeline&labels=feat,fix,docs,chore,merged,closed,rejected,0-1y,1-2y,2y%2B&links=feat%3Emerged:38;feat%3Eclosed:12;feat%3Erejected:8;fix%3Emerged:33;fix%3Eclosed:6;fix%3Erejected:2;docs%3Emerged:16;docs%3Eclosed:4;chore%3Emerged:5;chore%3Eclosed:6;chore%3Erejected:6;merged%3E0-1y:52;merged%3E1-2y:28;merged%3E2y%2B:12;closed%3E0-1y:14;closed%3E1-2y:9;closed%3E2y%2B:5;rejected%3E0-1y:9;rejected%3E1-2y:5;rejected%3E2y%2B:2&title=Pull%20requests%20lifecycle&unit=prs
```

![Sankey — Pull-Request-Lebenszyklus](https://x-cmd.com/draw?type=sankey&t=pipeline&labels=feat,fix,docs,chore,merged,closed,rejected,0-1y,1-2y,2y%2B&links=feat%3Emerged:38;feat%3Eclosed:12;feat%3Erejected:8;fix%3Emerged:33;fix%3Eclosed:6;fix%3Erejected:2;docs%3Emerged:16;docs%3Eclosed:4;chore%3Emerged:5;chore%3Eclosed:6;chore%3Erejected:6;merged%3E0-1y:52;merged%3E1-2y:28;merged%3E2y%2B:12;closed%3E0-1y:14;closed%3E1-2y:9;closed%3E2y%2B:5;rejected%3E0-1y:9;rejected%3E1-2y:5;rejected%3E2y%2B:2&title=Pull%20requests%20lifecycle&unit=prs)

## Drei Wege der Nutzung

```text
https://x-cmd.com/draw?type=pie&labels=A,B&values=3,2
```

```sh
npm install @x-cmd/draw
draw --type pie --labels "A,B" --values "3,2" --out pie.svg
```

```ts
import { draw } from "jsr:@x-cmd/draw";   // or npm:@x-cmd/draw
const { svg } = draw({ type: "pie", labels: "A,B", values: "3,2" });
```

## Alle Diagrammtypen

| type | | |
|---|---|---|
| `pie` | Donut; donut=0 = volle Kreis | ≤100 Klassen |
| `bar` | Gruppierte Säulen; stack=1 gestapelt | ≤30 Gruppen |
| `hbar` | Horizontale Balken (Rankings) | ≤30 Balken |
| `line` | Glatte Linie + Farbverlauf | ≤60 Punkte |
| `area` | Fläche / Mehrfach-Flächen | ≤60 Punkte |
| `radar` | Radar | 3–12 Achsen |
| `gauge` | Messuhr (240°-Bogen) | value+max; Ringe ≤8 |
| `scatter` | StreuDiagramm, Negativwerte ok | ≤200 Punkte |
| `combo` | Säulen + Linie, Doppelachse | ≤6 Serien |
| `sankey` | Flussdiagramm | ≤24 Knoten |
| `qr` | QR-Code | ≤1000 Zeichen |

---

Vollständige Dokumentation (Englisch): [README (EN)](../README.md) · [docs](../docs/) — Code Apache-2.0; Schriftarten OFL.
