---
x-title: Bahasa Indonesia — draw quick start
x-desc: Grafik SVG untuk era AI: satu endpoint `/draw?type=.
x-sidebar: draw
x-keywords: draw, quickstart, svg, chart
---

# draw — Grafik SVG dengan data di URL

Grafik SVG untuk era AI: satu endpoint `/draw?type=...`, data di URL, dan `<metadata>` yang dapat dibaca mesin di setiap keluaran. Sistem gaya mengikuti spesifikasi desain, dengan beberapa varian per jenis grafik.

## Pratinjau

```text
https://x-cmd.com/draw?type=pie&labels=A,B&values=3,2
```

![pie](https://x-cmd.com/draw?type=pie&labels=A,B&values=3,2)

## Tiga cara pakai

**Layanan hosted (tanpa instalasi)** · **Pustaka npm + CLI (offline, sinkron)** · Deno:

```ts
import { draw } from "jsr:@x-cmd/draw";
const { svg } = draw({ type: "pie", labels: "A,B", values: "3,2" });
```

## Endpoint

| type | | |
|---|---|---|
| `pie` | Donat; `donut=0` = pie penuh | ≤100 kelas (>9 → Other) |
| `bar` | Kolom berkelompok; `stack=1` bertumpuk | ≤30 grup |
| `hbar` | Batang horizontal (peringkat) | ≤30 batang |
| `line` | Garis halus + gradien / multigaris | ≤60 titik |
| `area` | Area / multi-area | ≤60 titik |
| `radar` | Radar | 3–12 sumbu |
| `gauge` | Meter (busur 240°, nilai tengah) | value+max; cincin ≤8 |
| `scatter` | Sebaran, dua sumbu angka, negatif ok | x=&y=, ≤200 titik |
| `combo` | Kolom (`series=`) + garis (`line=`); sumbu ganda saat beda 5× | ≤30 grup, ≤6 seri |
| `sankey` | Diagram alur dengan lebar | labels=+links=A>B:30, ≤24 simpul |
| `qr` | Kode QR | d≤1000 karakter, fg/bg, title/unit |

Kode Apache-2.0; font OFL — [README (EN)](../readme/en.md)
