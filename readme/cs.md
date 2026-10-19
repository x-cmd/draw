# draw — SVG grafy s daty v URL

> [English](../README.md) | **Čeština**

[![JSR score](https://img.shields.io/badge/dynamic/json?url=https%3A%2F%2Fapi.jsr.io%2Fscopes%2Fx-cmd%2Fpackages%2Fdraw&query=%24.score&label=JSR%20score&color=yellowgreen)](https://jsr.io/@x-cmd/draw/score)

Všechna data žijí v URL — otevřete v prohlížeči, vložte jako `<img>` nebo vložte do README: SVG se vykreslí okamžitě a AI si ho přečte přímo.

## Náhled

### Koláč — největší města

```text
https://x-cmd.com/draw?type=pie&title=Obyvatelstvo%20nejv%C4%9Bt%C5%A1%C3%ADch%20m%C4%9Bst&unit=mil.&labels=Praha,Brno,Ostrava,Plze%C5%88&values=1.4,0.4,0.3,0.2
```

![Koláč — největší města](https://x-cmd.com/draw?type=pie&title=Obyvatelstvo%20nejv%C4%9Bt%C5%A1%C3%ADch%20m%C4%9Bst&unit=mil.&labels=Praha,Brno,Ostrava,Plze%C5%88&values=1.4,0.4,0.3,0.2)

### Pruhy — pořadí podle oblasti

```text
https://x-cmd.com/draw?type=hbar&labels=cli,core,docs,ui&values=42,31,18,9&title=Commity%20podle%20oblasti
```

![Pruhy — pořadí podle oblasti](https://x-cmd.com/draw?type=hbar&labels=cli,core,docs,ui&values=42,31,18,9&title=Commity%20podle%20oblasti)

### Kombinovaný — stažení a růst

```text
https://x-cmd.com/draw?type=combo&labels=Po,%C3%9At,St,%C4%8Ct,P%C3%A1,So,Ne&series=Sta%C5%BEen%C3%AD:120,180,150,210,240,200,260&line=R%C5%AFst:3.1,3.4,3.2,3.8,4.1,3.9,4.5&title=T%C3%BDdenn%C3%AD%20sta%C5%BEen%C3%AD&unit=dl
```

![Kombinovaný — stažení a růst](https://x-cmd.com/draw?type=combo&labels=Po,%C3%9At,St,%C4%8Ct,P%C3%A1,So,Ne&series=Sta%C5%BEen%C3%AD:120,180,150,210,240,200,260&line=R%C5%AFst:3.1,3.4,3.2,3.8,4.1,3.9,4.5&title=T%C3%BDdenn%C3%AD%20sta%C5%BEen%C3%AD&unit=dl)

### Sankey — životní cyklus PR

```text
https://x-cmd.com/draw?type=sankey&t=pipeline&labels=feat,fix,docs,chore,merged,closed,rejected,0-1y,1-2y,2y%2B&links=feat%3Emerged:38;feat%3Eclosed:12;feat%3Erejected:8;fix%3Emerged:33;fix%3Eclosed:6;fix%3Erejected:2;docs%3Emerged:16;docs%3Eclosed:4;chore%3Emerged:5;chore%3Eclosed:6;chore%3Erejected:6;merged%3E0-1y:52;merged%3E1-2y:28;merged%3E2y%2B:12;closed%3E0-1y:14;closed%3E1-2y:9;closed%3E2y%2B:5;rejected%3E0-1y:9;rejected%3E1-2y:5;rejected%3E2y%2B:2&title=Pull%20requests%20lifecycle&unit=prs
```

![Sankey — životní cyklus PR](https://x-cmd.com/draw?type=sankey&t=pipeline&labels=feat,fix,docs,chore,merged,closed,rejected,0-1y,1-2y,2y%2B&links=feat%3Emerged:38;feat%3Eclosed:12;feat%3Erejected:8;fix%3Emerged:33;fix%3Eclosed:6;fix%3Erejected:2;docs%3Emerged:16;docs%3Eclosed:4;chore%3Emerged:5;chore%3Eclosed:6;chore%3Erejected:6;merged%3E0-1y:52;merged%3E1-2y:28;merged%3E2y%2B:12;closed%3E0-1y:14;closed%3E1-2y:9;closed%3E2y%2B:5;rejected%3E0-1y:9;rejected%3E1-2y:5;rejected%3E2y%2B:2&title=Pull%20requests%20lifecycle&unit=prs)

## Tři způsoby použití

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

## Všechny typy grafů

| type | | |
|---|---|---|
| `pie` | Donut; donut=0 = plný koláč | ≤100 tříd |
| `bar` | Skupinové sloupce; stack=1 | ≤30 skupin |
| `hbar` | Vodorovné pruhy (žebříčky) | ≤30 pruhů |
| `line` | Hladká čára + gradient | ≤60 bodů |
| `area` | Plocha / více ploch | ≤60 bodů |
| `radar` | Radar | 3–12 os |
| `gauge` | Ukazatel (oblouk 240°) | value+max; prstenců ≤8 |
| `scatter` | Bodový, záporné ok | ≤200 bodů |
| `combo` | Sloupce + čára, dvě osy | ≤6 řad |
| `sankey` | Tokový diagram | ≤24 uzlů |
| `qr` | QR kód | ≤1000 znaků |

---

Kompletní dokumentace (anglicky): [README (EN)](../README.md) · [docs](../docs/) — Kód Apache-2.0; fonty OFL.
