# draw — Wykresy SVG z danymi w URL

> [English](../README.md) | **Polski**

[![JSR score](https://img.shields.io/badge/dynamic/json?url=https%3A%2F%2Fapi.jsr.io%2Fscopes%2Fx-cmd%2Fpackages%2Fdraw&query=%24.score&label=JSR%20score&color=yellowgreen)](https://jsr.io/@x-cmd/draw/score)

Wszystkie dane żyją w URL — otwórz w przeglądarce, osadź przez `<img>` lub wklej do README: SVG wyrenderuje się od razu, a AI odczyta go bezpośrednio.

## Podgląd

### Kołowy — największe miasta

```text
https://x-cmd.com/draw?type=pie&title=Ludno%C5%9B%C4%87%20najwi%C4%99kszych%20miast&unit=mln&labels=Warszawa,Krak%C3%B3w,Wroc%C5%82aw,%C5%81%C3%B3d%C5%BA&values=1.9,0.8,0.7,0.7
```

![Kołowy — największe miasta](https://x-cmd.com/draw?type=pie&title=Ludno%C5%9B%C4%87%20najwi%C4%99kszych%20miast&unit=mln&labels=Warszawa,Krak%C3%B3w,Wroc%C5%82aw,%C5%81%C3%B3d%C5%BA&values=1.9,0.8,0.7,0.7)

### Słupki — ranking po obszarach

```text
https://x-cmd.com/draw?type=hbar&labels=cli,core,docs,ui&values=42,31,18,9&title=Commity%20po%20obszarach
```

![Słupki — ranking po obszarach](https://x-cmd.com/draw?type=hbar&labels=cli,core,docs,ui&values=42,31,18,9&title=Commity%20po%20obszarach)

### Kombinowany — pobrania i wzrost

```text
https://x-cmd.com/draw?type=combo&labels=Pon,Wt,%C5%9Ar,Czw,Pt,Sob,Nd&series=Pobrania:120,180,150,210,240,200,260&line=Wzrost:3.1,3.4,3.2,3.8,4.1,3.9,4.5&title=Tygodniowe%20pobrania&unit=dl
```

![Kombinowany — pobrania i wzrost](https://x-cmd.com/draw?type=combo&labels=Pon,Wt,%C5%9Ar,Czw,Pt,Sob,Nd&series=Pobrania:120,180,150,210,240,200,260&line=Wzrost:3.1,3.4,3.2,3.8,4.1,3.9,4.5&title=Tygodniowe%20pobrania&unit=dl)

### Sankey — cykl życia PR

```text
https://x-cmd.com/draw?type=sankey&t=pipeline&labels=feat,fix,docs,chore,merged,closed,rejected,0-1y,1-2y,2y%2B&links=feat%3Emerged:38;feat%3Eclosed:12;feat%3Erejected:8;fix%3Emerged:33;fix%3Eclosed:6;fix%3Erejected:2;docs%3Emerged:16;docs%3Eclosed:4;chore%3Emerged:5;chore%3Eclosed:6;chore%3Erejected:6;merged%3E0-1y:52;merged%3E1-2y:28;merged%3E2y%2B:12;closed%3E0-1y:14;closed%3E1-2y:9;closed%3E2y%2B:5;rejected%3E0-1y:9;rejected%3E1-2y:5;rejected%3E2y%2B:2&title=Pull%20requests%20lifecycle&unit=prs
```

![Sankey — cykl życia PR](https://x-cmd.com/draw?type=sankey&t=pipeline&labels=feat,fix,docs,chore,merged,closed,rejected,0-1y,1-2y,2y%2B&links=feat%3Emerged:38;feat%3Eclosed:12;feat%3Erejected:8;fix%3Emerged:33;fix%3Eclosed:6;fix%3Erejected:2;docs%3Emerged:16;docs%3Eclosed:4;chore%3Emerged:5;chore%3Eclosed:6;chore%3Erejected:6;merged%3E0-1y:52;merged%3E1-2y:28;merged%3E2y%2B:12;closed%3E0-1y:14;closed%3E1-2y:9;closed%3E2y%2B:5;rejected%3E0-1y:9;rejected%3E1-2y:5;rejected%3E2y%2B:2&title=Pull%20requests%20lifecycle&unit=prs)

## Trzy sposoby użycia

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

## Wszystkie typy wykresów

| type | | |
|---|---|---|
| `pie` | Pierścień; donut=0 = pełne koło | ≤100 klas |
| `bar` | Słupki grupowane; stack=1 | ≤30 grup |
| `hbar` | Poziome słupki (rankingi) | ≤30 słupków |
| `line` | Gładka linia + gradient | ≤60 punktów |
| `area` | Obszar / wieloobszarowe | ≤60 punktów |
| `radar` | Radar | 3–12 osi |
| `gauge` | Wskaźnik (łuk 240°) | value+max; pierścieni ≤8 |
| `scatter` | Rozrzut, ujemne ok | ≤200 punktów |
| `combo` | Słupki + linia, dwie osie | ≤6 serii |
| `sankey` | Diagram przepływów | ≤24 węzłów |
| `qr` | Kod QR | ≤1000 znaków |

---

Pełna dokumentacja (ang.): [README (EN)](../README.md) · [docs](../docs/) — Kod Apache-2.0; fonty OFL.
