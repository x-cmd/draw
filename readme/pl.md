# draw — Wykresy SVG z danymi w URL

> [English](../README.md) | **Polski**

[![JSR score](https://img.shields.io/badge/dynamic/json?url=https%3A%2F%2Fapi.jsr.io%2Fscopes%2Fx-cmd%2Fpackages%2Fdraw&query=%24.score&label=JSR%20score&color=yellowgreen)](https://jsr.io/@x-cmd/draw/score)
[![OpenSSF Scorecard](https://api.securityscorecards.dev/projects/github.com/x-cmd/draw/badge)](https://securityscorecards.dev/viewer/?uri=github.com/x-cmd/draw)

Wykresy SVG dla ery AI: jeden endpoint `/draw?type=...`, dane w URL i maszynowo czytelny `<metadata>` w każdym wyniku. System stylów zgodny ze specyfikacją projektową, po kilka wariantów na typ wykresu.

## Podgląd

Wszystkie dane żyją w URL — otwórz w przeglądarce, osadź przez `<img>` lub wklej do README: SVG wyrenderuje się od razu.

### Sankey — cykl życia PR (`type=sankey&t=pipeline`)

```text
https://x-cmd.com/draw?type=sankey&t=pipeline&labels=ficzery,fixy,dokumentacja,inne,scalone,zamkni%C4%99te,odrzucone,%3C1r,1%E2%80%932r,%3E2r&links=ficzery%3Escalone:38;ficzery%3Ezamkni%C4%99te:12;ficzery%3Eodrzucone:8;fixy%3Escalone:33;fixy%3Ezamkni%C4%99te:6;fixy%3Eodrzucone:2;dokumentacja%3Escalone:16;dokumentacja%3Ezamkni%C4%99te:4;inne%3Escalone:5;inne%3Ezamkni%C4%99te:6;inne%3Eodrzucone:6;scalone%3E%3C1r:52;scalone%3E1%E2%80%932r:28;scalone%3E%3E2r:12;zamkni%C4%99te%3E%3C1r:14;zamkni%C4%99te%3E1%E2%80%932r:9;zamkni%C4%99te%3E%3E2r:5;odrzucone%3E%3C1r:9;odrzucone%3E1%E2%80%932r:5;odrzucone%3E%3E2r:2&title=Cykl%20%C5%BCycia%20PR&unit=prs
```

![Sankey — cykl życia PR](https://x-cmd.com/draw?type=sankey&t=pipeline&labels=ficzery,fixy,dokumentacja,inne,scalone,zamkni%C4%99te,odrzucone,%3C1r,1%E2%80%932r,%3E2r&links=ficzery%3Escalone:38;ficzery%3Ezamkni%C4%99te:12;ficzery%3Eodrzucone:8;fixy%3Escalone:33;fixy%3Ezamkni%C4%99te:6;fixy%3Eodrzucone:2;dokumentacja%3Escalone:16;dokumentacja%3Ezamkni%C4%99te:4;inne%3Escalone:5;inne%3Ezamkni%C4%99te:6;inne%3Eodrzucone:6;scalone%3E%3C1r:52;scalone%3E1%E2%80%932r:28;scalone%3E%3E2r:12;zamkni%C4%99te%3E%3C1r:14;zamkni%C4%99te%3E1%E2%80%932r:9;zamkni%C4%99te%3E%3E2r:5;odrzucone%3E%3C1r:9;odrzucone%3E1%E2%80%932r:5;odrzucone%3E%3E2r:2&title=Cykl%20%C5%BCycia%20PR&unit=prs)

### Hbar — przepustowość runtime (pomiar) (`type=hbar; draw() ops/s: deno 7238 · node 6553 · bun 4972, Apple Silicon`)

```text
https://x-cmd.com/draw?type=hbar&labels=deno,node,bun&values=7238,6553,4972&title=Runtime%20throughput&unit=ops%2Fs
```

![Hbar — przepustowość runtime (pomiar)](https://x-cmd.com/draw?type=hbar&labels=deno,node,bun&values=7238,6553,4972&title=Runtime%20throughput&unit=ops%2Fs)

### Radar — porównanie trzech edytorów (`type=radar&t=evil`)

```text
https://x-cmd.com/draw?type=radar&t=evil&labels=start,ekosystem,rozszerzalno%C5%9B%C4%87,pami%C4%99%C4%87,%C5%82atwo%C5%9B%C4%87&series=vscode:60,95,90,55,80&series=neovim:95,65,85,95,35&series=zed:92,50,55,90,60&title=Por%C3%B3wnanie%20edytor%C3%B3w
```

![Radar — porównanie trzech edytorów](https://x-cmd.com/draw?type=radar&t=evil&labels=start,ekosystem,rozszerzalno%C5%9B%C4%87,pami%C4%99%C4%87,%C5%82atwo%C5%9B%C4%87&series=vscode:60,95,90,55,80&series=neovim:95,65,85,95,35&series=zed:92,50,55,90,60&title=Por%C3%B3wnanie%20edytor%C3%B3w)

### Kombinowany — pobrania i wzrost (`type=combo`)

```text
https://x-cmd.com/draw?type=combo&labels=Pon,Wt,%C5%9Ar,Czw,Pt,Sob,Nd&series=Pobrania:120,180,150,210,240,200,260&line=Wzrost:3.1,3.4,3.2,3.8,4.1,3.9,4.5&title=Tygodniowe%20pobrania&unit=dl
```

![Kombinowany — pobrania i wzrost](https://x-cmd.com/draw?type=combo&labels=Pon,Wt,%C5%9Ar,Czw,Pt,Sob,Nd&series=Pobrania:120,180,150,210,240,200,260&line=Wzrost:3.1,3.4,3.2,3.8,4.1,3.9,4.5&title=Tygodniowe%20pobrania&unit=dl)

### Hbar — otwarte/zamknięte issues (motyl) (`type=hbar&t=xcmd-issue`)

```text
https://x-cmd.com/draw?type=hbar&t=xcmd-issue&labels=CLI,rdze%C5%84,dokumentacja,ci,UI&series=otwarte:12,8,15,4,9&series=zamkni%C4%99te:38,52,20,11,26&title=Issues%20po%20obszarach
```

![Hbar — otwarte/zamknięte issues (motyl)](https://x-cmd.com/draw?type=hbar&t=xcmd-issue&labels=CLI,rdze%C5%84,dokumentacja,ci,UI&series=otwarte:12,8,15,4,9&series=zamkni%C4%99te:38,52,20,11,26&title=Issues%20po%20obszarach)

### Kołowy — największe miasta (`type=pie&t=market-mono`)

```text
https://x-cmd.com/draw?type=pie&t=market-mono&title=Najwi%C4%99ksze%20miasta&unit=mln&labels=Warszawa,Krak%C3%B3w,Wroc%C5%82aw,%C5%81%C3%B3d%C5%BA&values=1.9,0.8,0.7,0.7
```

![Kołowy — największe miasta](https://x-cmd.com/draw?type=pie&t=market-mono&title=Najwi%C4%99ksze%20miasta&unit=mln&labels=Warszawa,Krak%C3%B3w,Wroc%C5%82aw,%C5%81%C3%B3d%C5%BA&values=1.9,0.8,0.7,0.7)

## Trzy sposoby użycia

**Serwis hostowany (zero instalacji)** — `https://x-cmd.com/draw?type=pie&labels=A,B&values=3,2`

**Biblioteka npm + CLI (offline, synchroniczna)** (`npm i -g @x-cmd/draw` / `npx`):

```sh
npm install @x-cmd/draw
```
```ts
import { draw } from '@x-cmd/draw';
const { svg } = draw({ type: 'pie', labels: 'A,B', values: '3,2', t: 'evil', scheme: 'dark' });
// przyjmuje też query string: draw('?type=bar&labels=Pon,Wt&values=3,5')
// tablice = powtórzone parametry (etykiety z przecinkami)
draw({ type: 'bar', labels: ['Q1, 2024', 'Q2'], values: [1, 2] })
```
```sh
draw --type pie --labels "A,B,C" --values "3,2,1" --out pie.svg
draw "?type=hbar&labels=a,b,c&values=3,2,1&t=xcmd"   # goły query string
```

**Self-hosting**:

```sh
git clone https://github.com/x-cmd/draw && cd draw && npm install
npm run serve      # lokalny serwer Node :8787 ze stroną demo
npm run dev        # wrangler dev
bash scripts/setup.sh   # deploy jednym kliknięciem na konto Cloudflare
```

Zmienne środowiskowe (Node): `PORT` (8787) · `BASE_PATH` · `DATA_REPO`/`DATA_BRANCH`/`GITHUB_TOKEN` (włącza krótkie linki POST).

**Deno** — rdzeń renderu jest czysty, bez sieci — sandbox bez uprawnień to granica bezpieczeństwa:

```ts
import { draw } from "jsr:@x-cmd/draw";
const { svg } = draw({ type: "pie", labels: "A,B", values: "3,2" });
```

## Endpointy

**`GET /draw?type=<pie|bar|hbar|line|area|radar|gauge|scatter|combo|sankey|qr>`** — wyrenderować wykres

| type | | |
|---|---|---|
| `pie` | Pierścień; `donut=0` = pełne koło<br><br>**<u>≤100 klas (>9 → Other)</u>** | <a href="https://x-cmd.com/draw?type=pie&labels=TS,Py,Go,Rust&values=4821,2312,980,645&title=Gwiazdki%20wg%20j%C4%99zyka"><img src="https://x-cmd.com/draw?type=pie&labels=TS,Py,Go,Rust&values=4821,2312,980,645&title=Gwiazdki%20wg%20j%C4%99zyka" width="360" alt="example"></a> |
| `bar` | Słupki grupowane; `stack=1` skumulowane<br><br>**<u>≤30 grup</u>** | <a href="https://x-cmd.com/draw?type=bar&labels=Pon,Wt,%C5%9Ar&series=dev:12,18,9&series=ci:8,11,6"><img src="https://x-cmd.com/draw?type=bar&labels=Pon,Wt,%C5%9Ar&series=dev:12,18,9&series=ci:8,11,6" width="360" alt="example"></a> |
| `hbar` | Poziome słupki (rankingi)<br><br>**<u>≤30 słupków</u>** | <a href="https://x-cmd.com/draw?type=hbar&labels=CLI,rdze%C5%84,dokumentacja,UI&values=42,31,18,9&title=Commity%20po%20obszarach"><img src="https://x-cmd.com/draw?type=hbar&labels=CLI,rdze%C5%84,dokumentacja,UI&values=42,31,18,9&title=Commity%20po%20obszarach" width="360" alt="example"></a> |
| `line` | Gładka linia + gradient / wielolinie<br><br>**<u>≤60 punktów</u>** | <a href="https://x-cmd.com/draw?type=line&labels=Sty,Lut,Mar,Kwi,Maj,Cze&values=12,19,15,25,22,30&title=Gwiazdki%20wg%20j%C4%99zyka"><img src="https://x-cmd.com/draw?type=line&labels=Sty,Lut,Mar,Kwi,Maj,Cze&values=12,19,15,25,22,30&title=Gwiazdki%20wg%20j%C4%99zyka" width="360" alt="example"></a> |
| `area` | Obszar / wieloobszarowe<br><br>**<u>≤60 punktów</u>** | <a href="https://x-cmd.com/draw?type=area&labels=Q1,Q2,Q3,Q4&values=8,14,23,37&title=Pobrania"><img src="https://x-cmd.com/draw?type=area&labels=Q1,Q2,Q3,Q4&values=8,14,23,37&title=Pobrania" width="360" alt="example"></a> |
| `radar` | Radar<br><br>**<u>3–12 osi</u>** | <a href="https://x-cmd.com/draw?type=radar&t=evil&labels=start,ekosystem,rozszerzalno%C5%9B%C4%87,pami%C4%99%C4%87,%C5%82atwo%C5%9B%C4%87&series=vscode:60,95,90,55,80&series=neovim:95,65,85,95,35&series=zed:92,50,55,90,60&title=Por%C3%B3wnanie%20edytor%C3%B3w"><img src="https://x-cmd.com/draw?type=radar&t=evil&labels=start,ekosystem,rozszerzalno%C5%9B%C4%87,pami%C4%99%C4%87,%C5%82atwo%C5%9B%C4%87&series=vscode:60,95,90,55,80&series=neovim:95,65,85,95,35&series=zed:92,50,55,90,60&title=Por%C3%B3wnanie%20edytor%C3%B3w" width="360" alt="example"></a> |
| `gauge` | Wskaźnik (łuk 240°, wartość centralna)<br><br>**<u>value+max; pierścieni ≤8</u>** | <a href="https://x-cmd.com/draw?type=gauge&title=Skuteczno%C5%9B%C4%87%20CI&value=87&max=100"><img src="https://x-cmd.com/draw?type=gauge&title=Skuteczno%C5%9B%C4%87%20CI&value=87&max=100" width="360" alt="example"></a> |
| `scatter` | Rozrzut, dwie osie liczbowe, ujemne ok<br><br>**<u>x=&y=, ≤200 punktów</u>** | <a href="https://x-cmd.com/draw?type=scatter&x=1,2,3,4,5&y=4,5,3,6,5&title=Op%C3%B3%C5%BAnienie"><img src="https://x-cmd.com/draw?type=scatter&x=1,2,3,4,5&y=4,5,3,6,5&title=Op%C3%B3%C5%BAnienie" width="360" alt="example"></a> |
| `combo` | Słupki (`series=`) + linia (`line=`); dwie osie od 5× różnicy<br><br>**<u>≤30 grup, ≤6 serii</u>** | <a href="https://x-cmd.com/draw?type=combo&labels=Pon,Wt,%C5%9Ar,Czw,Pt,Sob,Nd&series=Pobrania:120,180,150,210,240,200,260&line=Wzrost:3.1,3.4,3.2,3.8,4.1,3.9,4.5&title=Tygodniowe%20pobrania&unit=dl"><img src="https://x-cmd.com/draw?type=combo&labels=Pon,Wt,%C5%9Ar,Czw,Pt,Sob,Nd&series=Pobrania:120,180,150,210,240,200,260&line=Wzrost:3.1,3.4,3.2,3.8,4.1,3.9,4.5&title=Tygodniowe%20pobrania&unit=dl" width="360" alt="example"></a> |
| `sankey` | Diagram przepływów z szerokościami<br><br>**<u>labels=+links=A>B:30, ≤24 węzłów</u>** | <a href="https://x-cmd.com/draw?type=sankey&t=pipeline&labels=ficzery,fixy,dokumentacja,inne,scalone,zamkni%C4%99te,odrzucone,%3C1r,1%E2%80%932r,%3E2r&links=ficzery%3Escalone:38;ficzery%3Ezamkni%C4%99te:12;ficzery%3Eodrzucone:8;fixy%3Escalone:33;fixy%3Ezamkni%C4%99te:6;fixy%3Eodrzucone:2;dokumentacja%3Escalone:16;dokumentacja%3Ezamkni%C4%99te:4;inne%3Escalone:5;inne%3Ezamkni%C4%99te:6;inne%3Eodrzucone:6;scalone%3E%3C1r:52;scalone%3E1%E2%80%932r:28;scalone%3E%3E2r:12;zamkni%C4%99te%3E%3C1r:14;zamkni%C4%99te%3E1%E2%80%932r:9;zamkni%C4%99te%3E%3E2r:5;odrzucone%3E%3C1r:9;odrzucone%3E1%E2%80%932r:5;odrzucone%3E%3E2r:2&title=Cykl%20%C5%BCycia%20PR&unit=prs"><img src="https://x-cmd.com/draw?type=sankey&t=pipeline&labels=ficzery,fixy,dokumentacja,inne,scalone,zamkni%C4%99te,odrzucone,%3C1r,1%E2%80%932r,%3E2r&links=ficzery%3Escalone:38;ficzery%3Ezamkni%C4%99te:12;ficzery%3Eodrzucone:8;fixy%3Escalone:33;fixy%3Ezamkni%C4%99te:6;fixy%3Eodrzucone:2;dokumentacja%3Escalone:16;dokumentacja%3Ezamkni%C4%99te:4;inne%3Escalone:5;inne%3Ezamkni%C4%99te:6;inne%3Eodrzucone:6;scalone%3E%3C1r:52;scalone%3E1%E2%80%932r:28;scalone%3E%3E2r:12;zamkni%C4%99te%3E%3C1r:14;zamkni%C4%99te%3E1%E2%80%932r:9;zamkni%C4%99te%3E%3E2r:5;odrzucone%3E%3C1r:9;odrzucone%3E1%E2%80%932r:5;odrzucone%3E%3E2r:2&title=Cykl%20%C5%BCycia%20PR&unit=prs" width="360" alt="example"></a> |
| `qr` | Kod QR<br><br>**<u>d≤1000 znaków, fg/bg, title/unit</u>** | <a href="https://x-cmd.com/draw?type=qr&d=https://github.com/x-cmd/draw&title=zeskanuj"><img src="https://x-cmd.com/draw?type=qr&d=https://github.com/x-cmd/draw&title=zeskanuj" width="360" alt="example"></a> |

**`GET /draw`** — strona demo · **`POST /draw?type=...`** — body JSON/CSV tworzy trwały krótki link · **`GET /draw/c/<hash>`** — render krótkiego linku (immutable)

## Style (`?t=`)

| type | |
|---|---|
| `pie` | opendata (domyślny) · evil · evil-mono · market-mono · progress · revenue |
| `bar` | evil (domyślny) · base · grid |
| `hbar` | base (domyślny) · opendata (ref=) · xcmd · xcmd-issue · rank |
| `line` | shadcn (domyślny) · evil · evil-glow · evil-mono · opendata |
| `area` | evil (domyślny) · star · opendata · pixel · polka |
| `radar` | base (domyślny) · evil · xcmd |
| `sankey` | base (domyślny) · fund · pipeline |
| `gauge` | base (domyślny) · gradient · reliability |
| `scatter/combo/qr` | base (combo dodatkowo evil) |

## Przekazywanie danych

```text
https://x-cmd.com/draw?type=pie&title=Gwiazdki%20wg%20j%C4%99zyka&labels=TypeScript,Python,Go&values=4821,2312,980
```

Etykiety z przecinkami: powtórz parametr (`labels=Q1, 2024&labels=Q2`). Złożone dane: `?d=` + JSON zakodowany w URL:

```json
{"title":"...","data":[{"label":"A","value":1}]}
```

## Krótkie linki

POST tworzy trwały krótki link adresowany treścią (repozytorium GitHub jako magazyn):

- te same dane → ten sam hash (idempotentnie, deduplikacja)
- limit 30 żądań/min/IP
- publiczny magazyn — nic wrażliwego

## Wersjonowanie

- bez `v`: najnowsza wersja, cache 300 s
- `v=N`: przypięta wersja, cache 1 dzień
- `immutable` tylko dla `/c/<hash>`

## Przyjazne AI

Każdy SVG osadza JSON: `{generator, template, version, spec}` — dane i parametry krążą bezpośrednio; tekst to prawdziwe `<text>`.

## Self-hosting w jeden krok

```sh
curl -fsSL https://raw.githubusercontent.com/x-cmd/draw/main/scripts/setup.sh | bash
```

Skrypt klonuje, loguje wrangler, wdraża i wypisuje URL `*.workers.dev`. Krótkie linki (POST) włącza `DATA_REPO` + `GITHUB_TOKEN`.

## Rozwój

```sh
npm install
npm run dev      # wrangler dev
npm test         # vitest (120)
npm run check    # tsc ×3
npm run build    # dist/
```

## Licencja

Kod Apache-2.0; fonty OFL — [LICENSE](../LICENSE) · Pełna dokumentacja: [README (EN)](../README.md)
