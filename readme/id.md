# draw — Grafik SVG dengan data di URL

> [English](../README.md) | **Bahasa Indonesia**

[![JSR score](https://img.shields.io/badge/dynamic/json?url=https%3A%2F%2Fapi.jsr.io%2Fscopes%2Fx-cmd%2Fpackages%2Fdraw&query=%24.score&label=JSR%20score&color=yellowgreen)](https://jsr.io/@x-cmd/draw/score)
[![OpenSSF Scorecard](https://api.securityscorecards.dev/projects/github.com/x-cmd/draw/badge)](https://securityscorecards.dev/viewer/?uri=github.com/x-cmd/draw)

Grafik SVG untuk era AI: satu endpoint `/draw?type=...`, data di URL, dan `<metadata>` yang dapat dibaca mesin di setiap keluaran. Sistem gaya mengikuti spesifikasi desain, dengan beberapa varian per jenis grafik.

## Pratinjau

Semua data hidup di URL — buka di browser, sematkan dengan `<img>` atau tempel di README: SVG langsung dirender.

### Sankey — siklus hidup PR (`type=sankey&t=pipeline`)

```text
https://x-cmd.com/draw?type=sankey&t=pipeline&labels=fitur,fix,dokumentasi,lainnya,digabungkan,ditutup,ditolak,%3C1th,1%E2%80%932th,%3E2th&links=fitur%3Edigabungkan:38;fitur%3Editutup:12;fitur%3Editolak:8;fix%3Edigabungkan:33;fix%3Editutup:6;fix%3Editolak:2;dokumentasi%3Edigabungkan:16;dokumentasi%3Editutup:4;lainnya%3Edigabungkan:5;lainnya%3Editutup:6;lainnya%3Editolak:6;digabungkan%3E%3C1th:52;digabungkan%3E1%E2%80%932th:28;digabungkan%3E%3E2th:12;ditutup%3E%3C1th:14;ditutup%3E1%E2%80%932th:9;ditutup%3E%3E2th:5;ditolak%3E%3C1th:9;ditolak%3E1%E2%80%932th:5;ditolak%3E%3E2th:2&title=Siklus%20hidup%20PR&unit=prs
```

![Sankey — siklus hidup PR](https://x-cmd.com/draw?type=sankey&t=pipeline&labels=fitur,fix,dokumentasi,lainnya,digabungkan,ditutup,ditolak,%3C1th,1%E2%80%932th,%3E2th&links=fitur%3Edigabungkan:38;fitur%3Editutup:12;fitur%3Editolak:8;fix%3Edigabungkan:33;fix%3Editutup:6;fix%3Editolak:2;dokumentasi%3Edigabungkan:16;dokumentasi%3Editutup:4;lainnya%3Edigabungkan:5;lainnya%3Editutup:6;lainnya%3Editolak:6;digabungkan%3E%3C1th:52;digabungkan%3E1%E2%80%932th:28;digabungkan%3E%3E2th:12;ditutup%3E%3C1th:14;ditutup%3E1%E2%80%932th:9;ditutup%3E%3E2th:5;ditolak%3E%3C1th:9;ditolak%3E1%E2%80%932th:5;ditolak%3E%3E2th:2&title=Siklus%20hidup%20PR&unit=prs)

### Hbar — throughput runtime (terukur) (`type=hbar; draw() ops/s: deno 7238 · node 6553 · bun 4972, Apple Silicon`)

```text
https://x-cmd.com/draw?type=hbar&labels=deno,node,bun&values=7238,6553,4972&title=Runtime%20throughput&unit=ops%2Fs
```

![Hbar — throughput runtime (terukur)](https://x-cmd.com/draw?type=hbar&labels=deno,node,bun&values=7238,6553,4972&title=Runtime%20throughput&unit=ops%2Fs)

### Radar — perbandingan tiga editor (`type=radar&t=evil`)

```text
https://x-cmd.com/draw?type=radar&t=evil&labels=startup,ekosistem,ekstensibilitas,memori,kemudahan&series=vscode:60,95,90,55,80&series=neovim:95,65,85,95,35&series=zed:92,50,55,90,60&title=Perbandingan%20editor
```

![Radar — perbandingan tiga editor](https://x-cmd.com/draw?type=radar&t=evil&labels=startup,ekosistem,ekstensibilitas,memori,kemudahan&series=vscode:60,95,90,55,80&series=neovim:95,65,85,95,35&series=zed:92,50,55,90,60&title=Perbandingan%20editor)

### Kombo — unduhan dan pertumbuhan (`type=combo`)

```text
https://x-cmd.com/draw?type=combo&labels=Sen,Sel,Rab,Kam,Jum,Sab,Min&series=Unduhan:120,180,150,210,240,200,260&line=Pertumbuhan:3.1,3.4,3.2,3.8,4.1,3.9,4.5&title=Unduhan%20mingguan&unit=dl
```

![Kombo — unduhan dan pertumbuhan](https://x-cmd.com/draw?type=combo&labels=Sen,Sel,Rab,Kam,Jum,Sab,Min&series=Unduhan:120,180,150,210,240,200,260&line=Pertumbuhan:3.1,3.4,3.2,3.8,4.1,3.9,4.5&title=Unduhan%20mingguan&unit=dl)

### Hbar — issue terbuka/ditutup (kupu-kupu) (`type=hbar&t=xcmd-issue`)

```text
https://x-cmd.com/draw?type=hbar&t=xcmd-issue&labels=CLI,inti,dokumentasi,ci,UI&series=terbuka:12,8,15,4,9&series=ditutup:38,52,20,11,26&title=Issue%20per%20area
```

![Hbar — issue terbuka/ditutup (kupu-kupu)](https://x-cmd.com/draw?type=hbar&t=xcmd-issue&labels=CLI,inti,dokumentasi,ci,UI&series=terbuka:12,8,15,4,9&series=ditutup:38,52,20,11,26&title=Issue%20per%20area)

### Pie — kota terbesar (`type=pie&t=market-mono`)

```text
https://x-cmd.com/draw?type=pie&t=market-mono&title=Kota%20terbesar&unit=jt&labels=Jakarta,Surabaya,Bandung,Medan&values=10.6,2.9,2.5,2.5
```

![Pie — kota terbesar](https://x-cmd.com/draw?type=pie&t=market-mono&title=Kota%20terbesar&unit=jt&labels=Jakarta,Surabaya,Bandung,Medan&values=10.6,2.9,2.5,2.5)

## Tiga cara pakai

**Layanan hosted (tanpa instalasi)** — `https://x-cmd.com/draw?type=pie&labels=A,B&values=3,2`

**Pustaka npm + CLI (offline, sinkron)** (`npm i -g @x-cmd/draw` / `npx`):

```sh
npm install @x-cmd/draw
```
```ts
import { draw } from '@x-cmd/draw';
const { svg } = draw({ type: 'pie', labels: 'A,B', values: '3,2', t: 'evil', scheme: 'dark' });
// menerima query string juga: draw('?type=bar&labels=Sen,Sel&values=3,5')
// array = parameter berulang (label berkoma)
draw({ type: 'bar', labels: ['Q1, 2024', 'Q2'], values: [1, 2] })
```
```sh
draw --type pie --labels "A,B,C" --values "3,2,1" --out pie.svg
draw "?type=hbar&labels=a,b,c&values=3,2,1&t=xcmd"   # query string polos
```

**Self-hosting**:

```sh
git clone https://github.com/x-cmd/draw && cd draw && npm install
npm run serve      # server Node lokal :8787 dengan halaman demo
npm run dev        # wrangler dev
bash scripts/setup.sh   # deploy sekali klik ke akun Cloudflare-mu
```

Variabel lingkungan (Node): `PORT` (8787) · `BASE_PATH` · `DATA_REPO`/`DATA_BRANCH`/`GITHUB_TOKEN` (mengaktifkan tautan pendek POST).

**Deno** — inti render murni, tanpa jaringan — sandbox tanpa izin adalah batas keamanan:

```ts
import { draw } from "jsr:@x-cmd/draw";
const { svg } = draw({ type: "pie", labels: "A,B", values: "3,2" });
```

## Endpoint

**`GET /draw?type=<pie|bar|hbar|line|area|radar|gauge|scatter|combo|sankey|qr>`** — render grafik

| type | | |
|---|---|---|
| `pie` | Donat; `donut=0` = pie penuh<br><br>**<u>≤100 kelas (>9 → Other)</u>** | <a href="https://x-cmd.com/draw?type=pie&labels=TS,Py,Go,Rust&values=4821,2312,980,645&title=Bintang%20per%20bahasa"><img src="https://x-cmd.com/draw?type=pie&labels=TS,Py,Go,Rust&values=4821,2312,980,645&title=Bintang%20per%20bahasa" width="360" alt="example"></a> |
| `bar` | Kolom berkelompok; `stack=1` bertumpuk<br><br>**<u>≤30 grup</u>** | <a href="https://x-cmd.com/draw?type=bar&labels=Sen,Sel,Rab&series=dev:12,18,9&series=ci:8,11,6"><img src="https://x-cmd.com/draw?type=bar&labels=Sen,Sel,Rab&series=dev:12,18,9&series=ci:8,11,6" width="360" alt="example"></a> |
| `hbar` | Batang horizontal (peringkat)<br><br>**<u>≤30 batang</u>** | <a href="https://x-cmd.com/draw?type=hbar&labels=CLI,inti,dokumentasi,UI&values=42,31,18,9&title=Commit%20per%20area"><img src="https://x-cmd.com/draw?type=hbar&labels=CLI,inti,dokumentasi,UI&values=42,31,18,9&title=Commit%20per%20area" width="360" alt="example"></a> |
| `line` | Garis halus + gradien / multigaris<br><br>**<u>≤60 titik</u>** | <a href="https://x-cmd.com/draw?type=line&labels=Jan,Feb,Mar,Apr,Mei,Jun&values=12,19,15,25,22,30&title=Bintang%20per%20bahasa"><img src="https://x-cmd.com/draw?type=line&labels=Jan,Feb,Mar,Apr,Mei,Jun&values=12,19,15,25,22,30&title=Bintang%20per%20bahasa" width="360" alt="example"></a> |
| `area` | Area / multi-area<br><br>**<u>≤60 titik</u>** | <a href="https://x-cmd.com/draw?type=area&labels=Q1,Q2,Q3,Q4&values=8,14,23,37&title=Unduhan"><img src="https://x-cmd.com/draw?type=area&labels=Q1,Q2,Q3,Q4&values=8,14,23,37&title=Unduhan" width="360" alt="example"></a> |
| `radar` | Radar<br><br>**<u>3–12 sumbu</u>** | <a href="https://x-cmd.com/draw?type=radar&t=evil&labels=startup,ekosistem,ekstensibilitas,memori,kemudahan&series=vscode:60,95,90,55,80&series=neovim:95,65,85,95,35&series=zed:92,50,55,90,60&title=Perbandingan%20editor"><img src="https://x-cmd.com/draw?type=radar&t=evil&labels=startup,ekosistem,ekstensibilitas,memori,kemudahan&series=vscode:60,95,90,55,80&series=neovim:95,65,85,95,35&series=zed:92,50,55,90,60&title=Perbandingan%20editor" width="360" alt="example"></a> |
| `gauge` | Meter (busur 240°, nilai tengah)<br><br>**<u>value+max; cincin ≤8</u>** | <a href="https://x-cmd.com/draw?type=gauge&title=Tingkat%20CI&value=87&max=100"><img src="https://x-cmd.com/draw?type=gauge&title=Tingkat%20CI&value=87&max=100" width="360" alt="example"></a> |
| `scatter` | Sebaran, dua sumbu angka, negatif ok<br><br>**<u>x=&y=, ≤200 titik</u>** | <a href="https://x-cmd.com/draw?type=scatter&x=1,2,3,4,5&y=4,5,3,6,5&title=Latensi"><img src="https://x-cmd.com/draw?type=scatter&x=1,2,3,4,5&y=4,5,3,6,5&title=Latensi" width="360" alt="example"></a> |
| `combo` | Kolom (`series=`) + garis (`line=`); sumbu ganda saat beda 5×<br><br>**<u>≤30 grup, ≤6 seri</u>** | <a href="https://x-cmd.com/draw?type=combo&labels=Sen,Sel,Rab,Kam,Jum,Sab,Min&series=Unduhan:120,180,150,210,240,200,260&line=Pertumbuhan:3.1,3.4,3.2,3.8,4.1,3.9,4.5&title=Unduhan%20mingguan&unit=dl"><img src="https://x-cmd.com/draw?type=combo&labels=Sen,Sel,Rab,Kam,Jum,Sab,Min&series=Unduhan:120,180,150,210,240,200,260&line=Pertumbuhan:3.1,3.4,3.2,3.8,4.1,3.9,4.5&title=Unduhan%20mingguan&unit=dl" width="360" alt="example"></a> |
| `sankey` | Diagram alur dengan lebar<br><br>**<u>labels=+links=A>B:30, ≤24 simpul</u>** | <a href="https://x-cmd.com/draw?type=sankey&t=pipeline&labels=fitur,fix,dokumentasi,lainnya,digabungkan,ditutup,ditolak,%3C1th,1%E2%80%932th,%3E2th&links=fitur%3Edigabungkan:38;fitur%3Editutup:12;fitur%3Editolak:8;fix%3Edigabungkan:33;fix%3Editutup:6;fix%3Editolak:2;dokumentasi%3Edigabungkan:16;dokumentasi%3Editutup:4;lainnya%3Edigabungkan:5;lainnya%3Editutup:6;lainnya%3Editolak:6;digabungkan%3E%3C1th:52;digabungkan%3E1%E2%80%932th:28;digabungkan%3E%3E2th:12;ditutup%3E%3C1th:14;ditutup%3E1%E2%80%932th:9;ditutup%3E%3E2th:5;ditolak%3E%3C1th:9;ditolak%3E1%E2%80%932th:5;ditolak%3E%3E2th:2&title=Siklus%20hidup%20PR&unit=prs"><img src="https://x-cmd.com/draw?type=sankey&t=pipeline&labels=fitur,fix,dokumentasi,lainnya,digabungkan,ditutup,ditolak,%3C1th,1%E2%80%932th,%3E2th&links=fitur%3Edigabungkan:38;fitur%3Editutup:12;fitur%3Editolak:8;fix%3Edigabungkan:33;fix%3Editutup:6;fix%3Editolak:2;dokumentasi%3Edigabungkan:16;dokumentasi%3Editutup:4;lainnya%3Edigabungkan:5;lainnya%3Editutup:6;lainnya%3Editolak:6;digabungkan%3E%3C1th:52;digabungkan%3E1%E2%80%932th:28;digabungkan%3E%3E2th:12;ditutup%3E%3C1th:14;ditutup%3E1%E2%80%932th:9;ditutup%3E%3E2th:5;ditolak%3E%3C1th:9;ditolak%3E1%E2%80%932th:5;ditolak%3E%3E2th:2&title=Siklus%20hidup%20PR&unit=prs" width="360" alt="example"></a> |
| `qr` | Kode QR<br><br>**<u>d≤1000 karakter, fg/bg, title/unit</u>** | <a href="https://x-cmd.com/draw?type=qr&d=https://github.com/x-cmd/draw&title=pindai"><img src="https://x-cmd.com/draw?type=qr&d=https://github.com/x-cmd/draw&title=pindai" width="360" alt="example"></a> |

**`GET /draw`** — halaman demo · **`POST /draw?type=...`** — body JSON/CSV membuat tautan pendek permanen · **`GET /draw/c/<hash>`** — render tautan pendek (immutable)

## Gaya (`?t=`)

| type | |
|---|---|
| `pie` | opendata (bawaan) · evil · evil-mono · market-mono · progress · revenue |
| `bar` | evil (bawaan) · base · grid |
| `hbar` | base (bawaan) · opendata (ref=) · xcmd · xcmd-issue · rank |
| `line` | shadcn (bawaan) · evil · evil-glow · evil-mono · opendata |
| `area` | evil (bawaan) · star · opendata · pixel · polka |
| `radar` | base (bawaan) · evil · xcmd |
| `sankey` | base (bawaan) · fund · pipeline |
| `gauge` | base (bawaan) · gradient · reliability |
| `scatter/combo/qr` | base (combo juga evil) |

## Mengirim data

```text
https://x-cmd.com/draw?type=pie&title=Bintang%20per%20bahasa&labels=TypeScript,Python,Go&values=4821,2312,980
```

Label berkoma: ulangi parameter (`labels=Q1, 2024&labels=Q2`). Data kompleks: `?d=` + JSON terenkode URL:

```json
{"title":"...","data":[{"label":"A","value":1}]}
```

## Tautan pendek

POST membuat tautan pendek permanen berbasis konten (repositori GitHub sebagai penyimpanan):

- data sama → hash sama (idempoten, dedup)
- batas 30 permintaan/menit/IP
- penyimpanan publik — jangan data sensitif

## Versi

- tanpa `v`: versi terbaru, cache 300 dtk
- `v=N`: versi terkunci, cache 1 hari
- `immutable` hanya untuk `/c/<hash>`

## Ramah AI

Setiap SVG menyematkan JSON: `{generator, template, version, spec}` — data dan parameter bolak-balik langsung; teks adalah `<text>` sungguhan.

## Self-hosting satu langkah

```sh
curl -fsSL https://raw.githubusercontent.com/x-cmd/draw/main/scripts/setup.sh | bash
```

Skrip meng-kloning, login wrangler, deploy, dan mencetak URL `*.workers.dev` milikmu. Tautan pendek (POST) diaktifkan lewat `DATA_REPO` + `GITHUB_TOKEN`.

## Pengembangan

```sh
npm install
npm run dev      # wrangler dev
npm test         # vitest (120)
npm run check    # tsc ×3
npm run build    # dist/
```

## Lisensi

Kode Apache-2.0; font OFL — [LICENSE](../LICENSE) · Dokumentasi lengkap: [README (EN)](../README.md)
