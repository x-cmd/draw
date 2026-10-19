# draw — Grafik SVG dengan data di URL

> [English](../README.md) | **Bahasa Indonesia**

[![JSR score](https://img.shields.io/badge/dynamic/json?url=https%3A%2F%2Fapi.jsr.io%2Fscopes%2Fx-cmd%2Fpackages%2Fdraw&query=%24.score&label=JSR%20score&color=yellowgreen)](https://jsr.io/@x-cmd/draw/score)

Semua data hidup di URL — buka di browser, sematkan dengan `<img>` atau tempel di README: SVG langsung dirender dan bisa dibaca AI secara langsung.

## Pratinjau

### Pie — kota terbesar

```text
https://x-cmd.com/draw?type=pie&title=Penduduk%20kota%20terbesar&unit=jt&labels=Jakarta,Surabaya,Bandung,Medan&values=10.6,2.9,2.5,2.5
```

![Pie — kota terbesar](https://x-cmd.com/draw?type=pie&title=Penduduk%20kota%20terbesar&unit=jt&labels=Jakarta,Surabaya,Bandung,Medan&values=10.6,2.9,2.5,2.5)

### Batang — peringkat per area

```text
https://x-cmd.com/draw?type=hbar&labels=cli,core,docs,ui&values=42,31,18,9&title=Commit%20per%20area
```

![Batang — peringkat per area](https://x-cmd.com/draw?type=hbar&labels=cli,core,docs,ui&values=42,31,18,9&title=Commit%20per%20area)

### Kombo — unduhan dan pertumbuhan

```text
https://x-cmd.com/draw?type=combo&labels=Sen,Sel,Rab,Kam,Jum,Sab,Min&series=Unduhan:120,180,150,210,240,200,260&line=Pertumbuhan:3.1,3.4,3.2,3.8,4.1,3.9,4.5&title=Unduhan%20mingguan&unit=dl
```

![Kombo — unduhan dan pertumbuhan](https://x-cmd.com/draw?type=combo&labels=Sen,Sel,Rab,Kam,Jum,Sab,Min&series=Unduhan:120,180,150,210,240,200,260&line=Pertumbuhan:3.1,3.4,3.2,3.8,4.1,3.9,4.5&title=Unduhan%20mingguan&unit=dl)

### Sankey — siklus hidup PR

```text
https://x-cmd.com/draw?type=sankey&t=pipeline&labels=feat,fix,docs,chore,merged,closed,rejected,0-1y,1-2y,2y%2B&links=feat%3Emerged:38;feat%3Eclosed:12;feat%3Erejected:8;fix%3Emerged:33;fix%3Eclosed:6;fix%3Erejected:2;docs%3Emerged:16;docs%3Eclosed:4;chore%3Emerged:5;chore%3Eclosed:6;chore%3Erejected:6;merged%3E0-1y:52;merged%3E1-2y:28;merged%3E2y%2B:12;closed%3E0-1y:14;closed%3E1-2y:9;closed%3E2y%2B:5;rejected%3E0-1y:9;rejected%3E1-2y:5;rejected%3E2y%2B:2&title=Pull%20requests%20lifecycle&unit=prs
```

![Sankey — siklus hidup PR](https://x-cmd.com/draw?type=sankey&t=pipeline&labels=feat,fix,docs,chore,merged,closed,rejected,0-1y,1-2y,2y%2B&links=feat%3Emerged:38;feat%3Eclosed:12;feat%3Erejected:8;fix%3Emerged:33;fix%3Eclosed:6;fix%3Erejected:2;docs%3Emerged:16;docs%3Eclosed:4;chore%3Emerged:5;chore%3Eclosed:6;chore%3Erejected:6;merged%3E0-1y:52;merged%3E1-2y:28;merged%3E2y%2B:12;closed%3E0-1y:14;closed%3E1-2y:9;closed%3E2y%2B:5;rejected%3E0-1y:9;rejected%3E1-2y:5;rejected%3E2y%2B:2&title=Pull%20requests%20lifecycle&unit=prs)

## Tiga cara pakai

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

## Semua jenis grafik

| type | | |
|---|---|---|
| `pie` | Donat; donut=0 = pie penuh | ≤100 kelas |
| `bar` | Kolom berkelompok; stack=1 | ≤30 grup |
| `hbar` | Batang horizontal (peringkat) | ≤30 batang |
| `line` | Garis halus + gradien | ≤60 titik |
| `area` | Area / multi-area | ≤60 titik |
| `radar` | Radar | 3–12 sumbu |
| `gauge` | Meter (busur 240°) | value+max; cincin ≤8 |
| `scatter` | Sebaran, negatif ok | ≤200 titik |
| `combo` | Kolom + garis, sumbu ganda | ≤6 seri |
| `sankey` | Diagram alur | ≤24 simpul |
| `qr` | Kode QR | ≤1000 karakter |

---

Dokumentasi lengkap (Inggris): [README (EN)](../README.md) · [docs](../docs/) — Kode Apache-2.0; font OFL.
