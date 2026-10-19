# draw — Grafici SVG con i dati nell’URL

> [English](../README.md) | **Italiano**

[![JSR score](https://img.shields.io/badge/dynamic/json?url=https%3A%2F%2Fapi.jsr.io%2Fscopes%2Fx-cmd%2Fpackages%2Fdraw&query=%24.score&label=JSR%20score&color=yellowgreen)](https://jsr.io/@x-cmd/draw/score)

Tutti i dati vivono nell’URL — aprila nel browser, incorporala con `<img>` o incollala nel README: l’SVG viene renderizzato subito e le IA possono leggerlo direttamente.

## Anteprima

### Torta — maggiori città

```text
https://x-cmd.com/draw?type=pie&title=Abitanti%20delle%20maggiori%20citt%C3%A0&unit=mln&labels=Roma,Milano,Napoli,Torino&values=2.8,1.4,1,0.9
```

![Torta — maggiori città](https://x-cmd.com/draw?type=pie&title=Abitanti%20delle%20maggiori%20citt%C3%A0&unit=mln&labels=Roma,Milano,Napoli,Torino&values=2.8,1.4,1,0.9)

### Barre — classifica per area

```text
https://x-cmd.com/draw?type=hbar&labels=cli,core,docs,ui&values=42,31,18,9&title=Commit%20per%20area
```

![Barre — classifica per area](https://x-cmd.com/draw?type=hbar&labels=cli,core,docs,ui&values=42,31,18,9&title=Commit%20per%20area)

### Combinato — download e crescita

```text
https://x-cmd.com/draw?type=combo&labels=Lun,Mar,Mer,Gio,Ven,Sab,Dom&series=Download:120,180,150,210,240,200,260&line=Crescita:3.1,3.4,3.2,3.8,4.1,3.9,4.5&title=Download%20settimanali&unit=dl
```

![Combinato — download e crescita](https://x-cmd.com/draw?type=combo&labels=Lun,Mar,Mer,Gio,Ven,Sab,Dom&series=Download:120,180,150,210,240,200,260&line=Crescita:3.1,3.4,3.2,3.8,4.1,3.9,4.5&title=Download%20settimanali&unit=dl)

### Sankey — ciclo di vita delle PR

```text
https://x-cmd.com/draw?type=sankey&t=pipeline&labels=feat,fix,docs,chore,merged,closed,rejected,0-1y,1-2y,2y%2B&links=feat%3Emerged:38;feat%3Eclosed:12;feat%3Erejected:8;fix%3Emerged:33;fix%3Eclosed:6;fix%3Erejected:2;docs%3Emerged:16;docs%3Eclosed:4;chore%3Emerged:5;chore%3Eclosed:6;chore%3Erejected:6;merged%3E0-1y:52;merged%3E1-2y:28;merged%3E2y%2B:12;closed%3E0-1y:14;closed%3E1-2y:9;closed%3E2y%2B:5;rejected%3E0-1y:9;rejected%3E1-2y:5;rejected%3E2y%2B:2&title=Pull%20requests%20lifecycle&unit=prs
```

![Sankey — ciclo di vita delle PR](https://x-cmd.com/draw?type=sankey&t=pipeline&labels=feat,fix,docs,chore,merged,closed,rejected,0-1y,1-2y,2y%2B&links=feat%3Emerged:38;feat%3Eclosed:12;feat%3Erejected:8;fix%3Emerged:33;fix%3Eclosed:6;fix%3Erejected:2;docs%3Emerged:16;docs%3Eclosed:4;chore%3Emerged:5;chore%3Eclosed:6;chore%3Erejected:6;merged%3E0-1y:52;merged%3E1-2y:28;merged%3E2y%2B:12;closed%3E0-1y:14;closed%3E1-2y:9;closed%3E2y%2B:5;rejected%3E0-1y:9;rejected%3E1-2y:5;rejected%3E2y%2B:2&title=Pull%20requests%20lifecycle&unit=prs)

## Tre modi per usarlo

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

## Tutti i tipi di grafico

| type | | |
|---|---|---|
| `pie` | Ciambella; donut=0 = torta piena | ≤100 classi |
| `bar` | Colonne raggruppate; stack=1 | ≤30 gruppi |
| `hbar` | Barre orizzontali (classifiche) | ≤30 barre |
| `line` | Linea morbida + gradiente | ≤60 punti |
| `area` | Area / multi-area | ≤60 punti |
| `radar` | Radar | 3–12 assi |
| `gauge` | Indicatore (arco 240°) | value+max; anelli ≤8 |
| `scatter` | Dispersione, negativi ok | ≤200 punti |
| `combo` | Barre + linea, doppio asse | ≤6 serie |
| `sankey` | Diagramma di flusso | ≤24 nodi |
| `qr` | QR code | ≤1000 caratteri |

---

Documentazione completa (inglese): [README (EN)](../README.md) · [docs](../docs/) — Codice Apache-2.0; fonti OFL.
