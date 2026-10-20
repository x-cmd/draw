# draw — Grafici SVG con i dati nell’URL

> [English](../README.md) | **Italiano**

[![JSR score](https://img.shields.io/badge/dynamic/json?url=https%3A%2F%2Fapi.jsr.io%2Fscopes%2Fx-cmd%2Fpackages%2Fdraw&query=%24.score&label=JSR%20score&color=yellowgreen)](https://jsr.io/@x-cmd/draw/score)
[![OpenSSF Scorecard](https://api.securityscorecards.dev/projects/github.com/x-cmd/draw/badge)](https://securityscorecards.dev/viewer/?uri=github.com/x-cmd/draw)

Grafici SVG per l’era dell’IA: un solo endpoint `/draw?type=...`, dati nell’URL e `<metadata>` leggibile dalle macchine in ogni output. Il sistema di stili segue una specifica di design, con più varianti per tipo di grafico.

## Anteprima

Tutti i dati vivono nell’URL — aprila nel browser, incorporala con `<img>` o incollala nel README: l’SVG viene renderizzato subito.

### Sankey — ciclo di vita delle PR (`type=sankey&t=pipeline`)

```text
https://x-cmd.com/draw?type=sankey&t=pipeline&labels=funz.,fix,documentazione,varie,uniti,chiusi,rifiutati,%3C1a,1%E2%80%932a,%3E2a&links=funz.%3Euniti:38;funz.%3Echiusi:12;funz.%3Erifiutati:8;fix%3Euniti:33;fix%3Echiusi:6;fix%3Erifiutati:2;documentazione%3Euniti:16;documentazione%3Echiusi:4;varie%3Euniti:5;varie%3Echiusi:6;varie%3Erifiutati:6;uniti%3E%3C1a:52;uniti%3E1%E2%80%932a:28;uniti%3E%3E2a:12;chiusi%3E%3C1a:14;chiusi%3E1%E2%80%932a:9;chiusi%3E%3E2a:5;rifiutati%3E%3C1a:9;rifiutati%3E1%E2%80%932a:5;rifiutati%3E%3E2a:2&title=Ciclo%20di%20vita%20delle%20PR&unit=prs
```

![Sankey — ciclo di vita delle PR](https://x-cmd.com/draw?type=sankey&t=pipeline&labels=funz.,fix,documentazione,varie,uniti,chiusi,rifiutati,%3C1a,1%E2%80%932a,%3E2a&links=funz.%3Euniti:38;funz.%3Echiusi:12;funz.%3Erifiutati:8;fix%3Euniti:33;fix%3Echiusi:6;fix%3Erifiutati:2;documentazione%3Euniti:16;documentazione%3Echiusi:4;varie%3Euniti:5;varie%3Echiusi:6;varie%3Erifiutati:6;uniti%3E%3C1a:52;uniti%3E1%E2%80%932a:28;uniti%3E%3E2a:12;chiusi%3E%3C1a:14;chiusi%3E1%E2%80%932a:9;chiusi%3E%3E2a:5;rifiutati%3E%3C1a:9;rifiutati%3E1%E2%80%932a:5;rifiutati%3E%3E2a:2&title=Ciclo%20di%20vita%20delle%20PR&unit=prs)

### Hbar — throughput del runtime (misurato) (`type=hbar; draw() ops/s: deno 7238 · node 6553 · bun 4972, Apple Silicon`)

```text
https://x-cmd.com/draw?type=hbar&labels=deno,node,bun&values=7238,6553,4972&title=Runtime%20throughput&unit=ops%2Fs
```

![Hbar — throughput del runtime (misurato)](https://x-cmd.com/draw?type=hbar&labels=deno,node,bun&values=7238,6553,4972&title=Runtime%20throughput&unit=ops%2Fs)

### Radar — confronto tra tre editor (`type=radar&t=evil`)

```text
https://x-cmd.com/draw?type=radar&t=evil&labels=avvio,ecosistema,estendibilit%C3%A0,memoria,facilit%C3%A0&series=vscode:60,95,90,55,80&series=neovim:95,65,85,95,35&series=zed:92,50,55,90,60&title=Confronto%20editor
```

![Radar — confronto tra tre editor](https://x-cmd.com/draw?type=radar&t=evil&labels=avvio,ecosistema,estendibilit%C3%A0,memoria,facilit%C3%A0&series=vscode:60,95,90,55,80&series=neovim:95,65,85,95,35&series=zed:92,50,55,90,60&title=Confronto%20editor)

### Combinato — download e crescita (`type=combo`)

```text
https://x-cmd.com/draw?type=combo&labels=Lun,Mar,Mer,Gio,Ven,Sab,Dom&series=Download:120,180,150,210,240,200,260&line=Crescita:3.1,3.4,3.2,3.8,4.1,3.9,4.5&title=Download%20settimanali&unit=dl
```

![Combinato — download e crescita](https://x-cmd.com/draw?type=combo&labels=Lun,Mar,Mer,Gio,Ven,Sab,Dom&series=Download:120,180,150,210,240,200,260&line=Crescita:3.1,3.4,3.2,3.8,4.1,3.9,4.5&title=Download%20settimanali&unit=dl)

### Hbar — issue aperte/chiuse (farfalla) (`type=hbar&t=xcmd-issue`)

```text
https://x-cmd.com/draw?type=hbar&t=xcmd-issue&labels=CLI,core,documentazione,ci,UI&series=aperte:12,8,15,4,9&series=chiuse:38,52,20,11,26&title=Issue%20per%20area
```

![Hbar — issue aperte/chiuse (farfalla)](https://x-cmd.com/draw?type=hbar&t=xcmd-issue&labels=CLI,core,documentazione,ci,UI&series=aperte:12,8,15,4,9&series=chiuse:38,52,20,11,26&title=Issue%20per%20area)

### Torta — maggiori città (`type=pie&t=market-mono`)

```text
https://x-cmd.com/draw?type=pie&t=market-mono&title=Maggiori%20citt%C3%A0&unit=mln&labels=Roma,Milano,Napoli,Torino&values=2.8,1.4,1,0.9
```

![Torta — maggiori città](https://x-cmd.com/draw?type=pie&t=market-mono&title=Maggiori%20citt%C3%A0&unit=mln&labels=Roma,Milano,Napoli,Torino&values=2.8,1.4,1,0.9)

## Tre modi per usarlo

**Servizio ospitato (zero installazione)** — `https://x-cmd.com/draw?type=pie&labels=A,B&values=3,2`

**Libreria npm + CLI (offline, sincrona)** (`npm i -g @x-cmd/draw` / `npx`):

```sh
npm install @x-cmd/draw
```
```ts
import { draw } from '@x-cmd/draw';
const { svg } = draw({ type: 'pie', labels: 'A,B', values: '3,2', t: 'evil', scheme: 'dark' });
// accetta anche una query string: draw('?type=bar&labels=Lun,Mar&values=3,5')
// array = parametri ripetuti (etichette con virgole)
draw({ type: 'bar', labels: ['Q1, 2024', 'Q2'], values: [1, 2] })
```
```sh
draw --type pie --labels "A,B,C" --values "3,2,1" --out pie.svg
draw "?type=hbar&labels=a,b,c&values=3,2,1&t=xcmd"   # query string semplice
```

**Self-hosting**:

```sh
git clone https://github.com/x-cmd/draw && cd draw && npm install
npm run serve      # server Node locale :8787 con pagina demo
npm run dev        # wrangler dev
bash scripts/setup.sh   # deploy in un clic sul tuo account Cloudflare
```

Variabili d’ambiente (Node): `PORT` (8787) · `BASE_PATH` · `DATA_REPO`/`DATA_BRANCH`/`GITHUB_TOKEN` (attiva i link brevi POST).

**Deno** — il cuore di rendering è puro, senza rete — la sandbox senza permessi è il confine di sicurezza:

```ts
import { draw } from "jsr:@x-cmd/draw";
const { svg } = draw({ type: "pie", labels: "A,B", values: "3,2" });
```

## Endpoint

**`GET /draw?type=<pie|bar|hbar|line|area|radar|gauge|scatter|combo|sankey|qr>`** — renderizzare un grafico

| type | | |
|---|---|---|
| `pie` | Ciambella; `donut=0` = torta piena<br><br>**<u>≤100 classi (>9 → Other)</u>** | <a href="https://x-cmd.com/draw?type=pie&labels=TS,Py,Go,Rust&values=4821,2312,980,645&title=Stelle%20per%20linguaggio"><img src="https://x-cmd.com/draw?type=pie&labels=TS,Py,Go,Rust&values=4821,2312,980,645&title=Stelle%20per%20linguaggio" width="360" alt="example"></a> |
| `bar` | Colonne raggruppate; `stack=1` impilate<br><br>**<u>≤30 gruppi</u>** | <a href="https://x-cmd.com/draw?type=bar&labels=Lun,Mar,Mer&series=dev:12,18,9&series=ci:8,11,6"><img src="https://x-cmd.com/draw?type=bar&labels=Lun,Mar,Mer&series=dev:12,18,9&series=ci:8,11,6" width="360" alt="example"></a> |
| `hbar` | Barre orizzontali (classifiche)<br><br>**<u>≤30 barre</u>** | <a href="https://x-cmd.com/draw?type=hbar&labels=CLI,core,documentazione,UI&values=42,31,18,9&title=Commit%20per%20area"><img src="https://x-cmd.com/draw?type=hbar&labels=CLI,core,documentazione,UI&values=42,31,18,9&title=Commit%20per%20area" width="360" alt="example"></a> |
| `line` | Linea morbida + gradiente / multilinea<br><br>**<u>≤60 punti</u>** | <a href="https://x-cmd.com/draw?type=line&labels=Gen,Feb,Mar,Apr,Mag,Giu&values=12,19,15,25,22,30&title=Stelle%20per%20linguaggio"><img src="https://x-cmd.com/draw?type=line&labels=Gen,Feb,Mar,Apr,Mag,Giu&values=12,19,15,25,22,30&title=Stelle%20per%20linguaggio" width="360" alt="example"></a> |
| `area` | Area / multi-area<br><br>**<u>≤60 punti</u>** | <a href="https://x-cmd.com/draw?type=area&labels=Q1,Q2,Q3,Q4&values=8,14,23,37&title=Download"><img src="https://x-cmd.com/draw?type=area&labels=Q1,Q2,Q3,Q4&values=8,14,23,37&title=Download" width="360" alt="example"></a> |
| `radar` | Radar<br><br>**<u>3–12 assi</u>** | <a href="https://x-cmd.com/draw?type=radar&t=evil&labels=avvio,ecosistema,estendibilit%C3%A0,memoria,facilit%C3%A0&series=vscode:60,95,90,55,80&series=neovim:95,65,85,95,35&series=zed:92,50,55,90,60&title=Confronto%20editor"><img src="https://x-cmd.com/draw?type=radar&t=evil&labels=avvio,ecosistema,estendibilit%C3%A0,memoria,facilit%C3%A0&series=vscode:60,95,90,55,80&series=neovim:95,65,85,95,35&series=zed:92,50,55,90,60&title=Confronto%20editor" width="360" alt="example"></a> |
| `gauge` | Indicatore (arco 240°, valore centrale)<br><br>**<u>value+max; anelli ≤8</u>** | <a href="https://x-cmd.com/draw?type=gauge&title=Tasso%20di%20CI&value=87&max=100"><img src="https://x-cmd.com/draw?type=gauge&title=Tasso%20di%20CI&value=87&max=100" width="360" alt="example"></a> |
| `scatter` | Dispersione, due assi numerici, negativi ok<br><br>**<u>x=&y=, ≤200 punti</u>** | <a href="https://x-cmd.com/draw?type=scatter&x=1,2,3,4,5&y=4,5,3,6,5&title=Latenza"><img src="https://x-cmd.com/draw?type=scatter&x=1,2,3,4,5&y=4,5,3,6,5&title=Latenza" width="360" alt="example"></a> |
| `combo` | Colonne (`series=`) + linea (`line=`); doppio asse oltre 5× di scarto<br><br>**<u>≤30 gruppi, ≤6 serie</u>** | <a href="https://x-cmd.com/draw?type=combo&labels=Lun,Mar,Mer,Gio,Ven,Sab,Dom&series=Download:120,180,150,210,240,200,260&line=Crescita:3.1,3.4,3.2,3.8,4.1,3.9,4.5&title=Download%20settimanali&unit=dl"><img src="https://x-cmd.com/draw?type=combo&labels=Lun,Mar,Mer,Gio,Ven,Sab,Dom&series=Download:120,180,150,210,240,200,260&line=Crescita:3.1,3.4,3.2,3.8,4.1,3.9,4.5&title=Download%20settimanali&unit=dl" width="360" alt="example"></a> |
| `sankey` | Diagramma di flusso pesato<br><br>**<u>labels=+links=A>B:30, ≤24 nodi</u>** | <a href="https://x-cmd.com/draw?type=sankey&t=pipeline&labels=funz.,fix,documentazione,varie,uniti,chiusi,rifiutati,%3C1a,1%E2%80%932a,%3E2a&links=funz.%3Euniti:38;funz.%3Echiusi:12;funz.%3Erifiutati:8;fix%3Euniti:33;fix%3Echiusi:6;fix%3Erifiutati:2;documentazione%3Euniti:16;documentazione%3Echiusi:4;varie%3Euniti:5;varie%3Echiusi:6;varie%3Erifiutati:6;uniti%3E%3C1a:52;uniti%3E1%E2%80%932a:28;uniti%3E%3E2a:12;chiusi%3E%3C1a:14;chiusi%3E1%E2%80%932a:9;chiusi%3E%3E2a:5;rifiutati%3E%3C1a:9;rifiutati%3E1%E2%80%932a:5;rifiutati%3E%3E2a:2&title=Ciclo%20di%20vita%20delle%20PR&unit=prs"><img src="https://x-cmd.com/draw?type=sankey&t=pipeline&labels=funz.,fix,documentazione,varie,uniti,chiusi,rifiutati,%3C1a,1%E2%80%932a,%3E2a&links=funz.%3Euniti:38;funz.%3Echiusi:12;funz.%3Erifiutati:8;fix%3Euniti:33;fix%3Echiusi:6;fix%3Erifiutati:2;documentazione%3Euniti:16;documentazione%3Echiusi:4;varie%3Euniti:5;varie%3Echiusi:6;varie%3Erifiutati:6;uniti%3E%3C1a:52;uniti%3E1%E2%80%932a:28;uniti%3E%3E2a:12;chiusi%3E%3C1a:14;chiusi%3E1%E2%80%932a:9;chiusi%3E%3E2a:5;rifiutati%3E%3C1a:9;rifiutati%3E1%E2%80%932a:5;rifiutati%3E%3E2a:2&title=Ciclo%20di%20vita%20delle%20PR&unit=prs" width="360" alt="example"></a> |
| `qr` | QR code<br><br>**<u>d≤1000 caratteri, fg/bg, title/unit</u>** | <a href="https://x-cmd.com/draw?type=qr&d=https://github.com/x-cmd/draw&title=scansionami"><img src="https://x-cmd.com/draw?type=qr&d=https://github.com/x-cmd/draw&title=scansionami" width="360" alt="example"></a> |

**`GET /draw`** — pagina demo · **`POST /draw?type=...`** — un body JSON/CSV crea un link breve permanente · **`GET /draw/c/<hash>`** — render del link breve (immutabile)

## Stili (`?t=`)

| type | |
|---|---|
| `pie` | opendata (predef.) · evil · evil-mono · market-mono · progress · revenue |
| `bar` | evil (predef.) · base · grid |
| `hbar` | base (predef.) · opendata (ref=) · xcmd · xcmd-issue · rank |
| `line` | shadcn (predef.) · evil · evil-glow · evil-mono · opendata |
| `area` | evil (predef.) · star · opendata · pixel · polka |
| `radar` | base (predef.) · evil · xcmd |
| `sankey` | base (predef.) · fund · pipeline |
| `gauge` | base (predef.) · gradient · reliability |
| `scatter/combo/qr` | base (combo anche evil) |

## Passare i dati

```text
https://x-cmd.com/draw?type=pie&title=Stelle%20per%20linguaggio&labels=TypeScript,Python,Go&values=4821,2312,980
```

Etichette con virgole: ripeti il parametro (`labels=Q1, 2024&labels=Q2`). Dati complessi: `?d=` + JSON codificato URL:

```json
{"title":"...","data":[{"label":"A","value":1}]}
```

## Link brevi

POST genera un link breve permanente indirizzato dal contenuto (repository GitHub come archivio):

- stessi dati → stesso hash (idempotente, deduplicato)
- limite 30 richieste/min/IP
- archivio pubblico — niente di sensibile

## Versionamento

- senza `v`: ultima versione, cache 300 s
- `v=N`: versione fissata, cache 1 giorno
- `immutable` solo per `/c/<hash>`

## Adatto alle IA

Ogni SVG incorpora JSON: `{generator, template, version, spec}` — dati e parametri fanno round-trip diretto; il testo è vero `<text>`.

## Self-hosting in un passo

```sh
curl -fsSL https://raw.githubusercontent.com/x-cmd/draw/main/scripts/setup.sh | bash
```

Lo script clona, autentica wrangler, fa il deploy e stampa il tuo URL `*.workers.dev`. I link brevi (POST) si attivano con `DATA_REPO` + `GITHUB_TOKEN`.

## Sviluppo

```sh
npm install
npm run dev      # wrangler dev
npm test         # vitest (120)
npm run check    # tsc ×3
npm run build    # dist/
```

## Licenza

Codice Apache-2.0; fonti OFL — [LICENSE](../LICENSE) · Documentazione completa: [README (EN)](../README.md)
