# draw — Grafice SVG cu datele în URL

> [English](../README.md) | **Română**

[![JSR score](https://img.shields.io/badge/dynamic/json?url=https%3A%2F%2Fapi.jsr.io%2Fscopes%2Fx-cmd%2Fpackages%2Fdraw&query=%24.score&label=JSR%20score&color=yellowgreen)](https://jsr.io/@x-cmd/draw/score)

Toate datele trăiesc în URL — deschide în browser, inserează cu `<img>` sau lipește în README: SVG se randează instant, iar AI îl citește direct.

## Previzualizare

### Circular — cele mai mari orașe

```text
https://x-cmd.com/draw?type=pie&title=Popula%C8%9Bia%20celor%20mai%20mari%20ora%C8%99e&unit=mil.&labels=Bucure%C8%99ti,Cluj-Napoca,Timi%C8%99oara,Ia%C8%99i&values=1.8,0.3,0.3,0.3
```

![Circular — cele mai mari orașe](https://x-cmd.com/draw?type=pie&title=Popula%C8%9Bia%20celor%20mai%20mari%20ora%C8%99e&unit=mil.&labels=Bucure%C8%99ti,Cluj-Napoca,Timi%C8%99oara,Ia%C8%99i&values=1.8,0.3,0.3,0.3)

### Bare — clasament pe zone

```text
https://x-cmd.com/draw?type=hbar&labels=cli,core,docs,ui&values=42,31,18,9&title=Commit-uri%20pe%20zone
```

![Bare — clasament pe zone](https://x-cmd.com/draw?type=hbar&labels=cli,core,docs,ui&values=42,31,18,9&title=Commit-uri%20pe%20zone)

### Combinat — descărcări și creștere

```text
https://x-cmd.com/draw?type=combo&labels=Lun,Mar,Mie,Joi,Vin,S%C3%A2m,Dum&series=Desc%C4%83rc%C4%83ri:120,180,150,210,240,200,260&line=Cre%C8%99tere:3.1,3.4,3.2,3.8,4.1,3.9,4.5&title=Desc%C4%83rc%C4%83ri%20s%C4%83pt%C4%83m%C3%A2nale&unit=dl
```

![Combinat — descărcări și creștere](https://x-cmd.com/draw?type=combo&labels=Lun,Mar,Mie,Joi,Vin,S%C3%A2m,Dum&series=Desc%C4%83rc%C4%83ri:120,180,150,210,240,200,260&line=Cre%C8%99tere:3.1,3.4,3.2,3.8,4.1,3.9,4.5&title=Desc%C4%83rc%C4%83ri%20s%C4%83pt%C4%83m%C3%A2nale&unit=dl)

### Sankey — ciclul de viață al PR

```text
https://x-cmd.com/draw?type=sankey&t=pipeline&labels=feat,fix,docs,chore,merged,closed,rejected,0-1y,1-2y,2y%2B&links=feat%3Emerged:38;feat%3Eclosed:12;feat%3Erejected:8;fix%3Emerged:33;fix%3Eclosed:6;fix%3Erejected:2;docs%3Emerged:16;docs%3Eclosed:4;chore%3Emerged:5;chore%3Eclosed:6;chore%3Erejected:6;merged%3E0-1y:52;merged%3E1-2y:28;merged%3E2y%2B:12;closed%3E0-1y:14;closed%3E1-2y:9;closed%3E2y%2B:5;rejected%3E0-1y:9;rejected%3E1-2y:5;rejected%3E2y%2B:2&title=Pull%20requests%20lifecycle&unit=prs
```

![Sankey — ciclul de viață al PR](https://x-cmd.com/draw?type=sankey&t=pipeline&labels=feat,fix,docs,chore,merged,closed,rejected,0-1y,1-2y,2y%2B&links=feat%3Emerged:38;feat%3Eclosed:12;feat%3Erejected:8;fix%3Emerged:33;fix%3Eclosed:6;fix%3Erejected:2;docs%3Emerged:16;docs%3Eclosed:4;chore%3Emerged:5;chore%3Eclosed:6;chore%3Erejected:6;merged%3E0-1y:52;merged%3E1-2y:28;merged%3E2y%2B:12;closed%3E0-1y:14;closed%3E1-2y:9;closed%3E2y%2B:5;rejected%3E0-1y:9;rejected%3E1-2y:5;rejected%3E2y%2B:2&title=Pull%20requests%20lifecycle&unit=prs)

## Trei moduri de utilizare

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

## Toate tipurile de grafice

| type | | |
|---|---|---|
| `pie` | Inel; donut=0 = plin | ≤100 clase |
| `bar` | Coloane grupate; stack=1 | ≤30 grupuri |
| `hbar` | Bare orizontale (clasamente) | ≤30 bare |
| `line` | Linie netedă + gradient | ≤60 puncte |
| `area` | Arie / multi-arie | ≤60 puncte |
| `radar` | Radar | 3–12 axe |
| `gauge` | Indicator (arc 240°) | value+max; inele ≤8 |
| `scatter` | Împrăștiere, negative ok | ≤200 puncte |
| `combo` | Coloane + linie, dublă axă | ≤6 serii |
| `sankey` | Diagramă de flux | ≤24 noduri |
| `qr` | Cod QR | ≤1000 caractere |

---

Documentație completă (engleză): [README (EN)](../README.md) · [docs](../docs/) — Cod Apache-2.0; fonturi OFL.
