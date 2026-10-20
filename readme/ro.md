# draw — Grafice SVG cu datele în URL

> [English](../README.md) | **Română**

[![JSR score](https://img.shields.io/badge/dynamic/json?url=https%3A%2F%2Fapi.jsr.io%2Fscopes%2Fx-cmd%2Fpackages%2Fdraw&query=%24.score&label=JSR%20score&color=yellowgreen)](https://jsr.io/@x-cmd/draw/score)
[![OpenSSF Scorecard](https://api.securityscorecards.dev/projects/github.com/x-cmd/draw/badge)](https://securityscorecards.dev/viewer/?uri=github.com/x-cmd/draw)

Grafice SVG pentru era AI: un singur endpoint `/draw?type=...`, datele în URL și `<metadata>` lizibil de mașini în fiecare rezultat. Sistemul de stiluri urmează o specificație de design, cu mai multe variante pe tip de grafic.

## Previzualizare

Toate datele trăiesc în URL — deschide în browser, inserează cu `<img>` sau lipește în README: SVG se randează instant.

### Sankey — ciclul de viață al PR (`type=sankey&t=pipeline`)

```text
https://x-cmd.com/draw?type=sankey&t=pipeline&labels=func%C8%9Bii,fixuri,documenta%C8%9Bie,altele,combinate,%C3%AEnchise,respinse,%3C1a,1%E2%80%932a,%3E2a&links=func%C8%9Bii%3Ecombinate:38;func%C8%9Bii%3E%C3%AEnchise:12;func%C8%9Bii%3Erespinse:8;fixuri%3Ecombinate:33;fixuri%3E%C3%AEnchise:6;fixuri%3Erespinse:2;documenta%C8%9Bie%3Ecombinate:16;documenta%C8%9Bie%3E%C3%AEnchise:4;altele%3Ecombinate:5;altele%3E%C3%AEnchise:6;altele%3Erespinse:6;combinate%3E%3C1a:52;combinate%3E1%E2%80%932a:28;combinate%3E%3E2a:12;%C3%AEnchise%3E%3C1a:14;%C3%AEnchise%3E1%E2%80%932a:9;%C3%AEnchise%3E%3E2a:5;respinse%3E%3C1a:9;respinse%3E1%E2%80%932a:5;respinse%3E%3E2a:2&title=Ciclul%20de%20via%C8%9B%C4%83%20al%20PR&unit=prs
```

![Sankey — ciclul de viață al PR](https://x-cmd.com/draw?type=sankey&t=pipeline&labels=func%C8%9Bii,fixuri,documenta%C8%9Bie,altele,combinate,%C3%AEnchise,respinse,%3C1a,1%E2%80%932a,%3E2a&links=func%C8%9Bii%3Ecombinate:38;func%C8%9Bii%3E%C3%AEnchise:12;func%C8%9Bii%3Erespinse:8;fixuri%3Ecombinate:33;fixuri%3E%C3%AEnchise:6;fixuri%3Erespinse:2;documenta%C8%9Bie%3Ecombinate:16;documenta%C8%9Bie%3E%C3%AEnchise:4;altele%3Ecombinate:5;altele%3E%C3%AEnchise:6;altele%3Erespinse:6;combinate%3E%3C1a:52;combinate%3E1%E2%80%932a:28;combinate%3E%3E2a:12;%C3%AEnchise%3E%3C1a:14;%C3%AEnchise%3E1%E2%80%932a:9;%C3%AEnchise%3E%3E2a:5;respinse%3E%3C1a:9;respinse%3E1%E2%80%932a:5;respinse%3E%3E2a:2&title=Ciclul%20de%20via%C8%9B%C4%83%20al%20PR&unit=prs)

### Hbar — debitul runtime (măsurat) (`type=hbar; draw() ops/s: deno 7238 · node 6553 · bun 4972, Apple Silicon`)

```text
https://x-cmd.com/draw?type=hbar&labels=deno,node,bun&values=7238,6553,4972&title=Runtime%20throughput&unit=ops%2Fs
```

![Hbar — debitul runtime (măsurat)](https://x-cmd.com/draw?type=hbar&labels=deno,node,bun&values=7238,6553,4972&title=Runtime%20throughput&unit=ops%2Fs)

### Radar — comparație a trei editoare (`type=radar&t=evil`)

```text
https://x-cmd.com/draw?type=radar&t=evil&labels=pornire,ecosistem,extensibilitate,memorie,u%C8%99urin%C8%9B%C4%83&series=vscode:60,95,90,55,80&series=neovim:95,65,85,95,35&series=zed:92,50,55,90,60&title=Comparare%20editoare
```

![Radar — comparație a trei editoare](https://x-cmd.com/draw?type=radar&t=evil&labels=pornire,ecosistem,extensibilitate,memorie,u%C8%99urin%C8%9B%C4%83&series=vscode:60,95,90,55,80&series=neovim:95,65,85,95,35&series=zed:92,50,55,90,60&title=Comparare%20editoare)

### Combinat — descărcări și creștere (`type=combo`)

```text
https://x-cmd.com/draw?type=combo&labels=Lun,Mar,Mie,Joi,Vin,S%C3%A2m,Dum&series=Desc%C4%83rc%C4%83ri:120,180,150,210,240,200,260&line=Cre%C8%99tere:3.1,3.4,3.2,3.8,4.1,3.9,4.5&title=Desc%C4%83rc%C4%83ri%20s%C4%83pt%C4%83m%C3%A2nale&unit=dl
```

![Combinat — descărcări și creștere](https://x-cmd.com/draw?type=combo&labels=Lun,Mar,Mie,Joi,Vin,S%C3%A2m,Dum&series=Desc%C4%83rc%C4%83ri:120,180,150,210,240,200,260&line=Cre%C8%99tere:3.1,3.4,3.2,3.8,4.1,3.9,4.5&title=Desc%C4%83rc%C4%83ri%20s%C4%83pt%C4%83m%C3%A2nale&unit=dl)

### Hbar — issue-uri deschise/închise (fluture) (`type=hbar&t=xcmd-issue`)

```text
https://x-cmd.com/draw?type=hbar&t=xcmd-issue&labels=CLI,nucleu,documenta%C8%9Bie,ci,UI&series=deschise:12,8,15,4,9&series=%C3%AEnchise:38,52,20,11,26&title=Issue-uri%20pe%20zone
```

![Hbar — issue-uri deschise/închise (fluture)](https://x-cmd.com/draw?type=hbar&t=xcmd-issue&labels=CLI,nucleu,documenta%C8%9Bie,ci,UI&series=deschise:12,8,15,4,9&series=%C3%AEnchise:38,52,20,11,26&title=Issue-uri%20pe%20zone)

### Circular — cele mai mari orașe (`type=pie&t=market-mono`)

```text
https://x-cmd.com/draw?type=pie&t=market-mono&title=Cele%20mai%20mari%20ora%C8%99e&unit=mil.&labels=Bucure%C8%99ti,Cluj-Napoca,Timi%C8%99oara,Ia%C8%99i&values=1.8,0.3,0.3,0.3
```

![Circular — cele mai mari orașe](https://x-cmd.com/draw?type=pie&t=market-mono&title=Cele%20mai%20mari%20ora%C8%99e&unit=mil.&labels=Bucure%C8%99ti,Cluj-Napoca,Timi%C8%99oara,Ia%C8%99i&values=1.8,0.3,0.3,0.3)

## Trei moduri de utilizare

**Serviciu găzduit (zero instalare)** — `https://x-cmd.com/draw?type=pie&labels=A,B&values=3,2`

**Bibliotecă npm + CLI (offline, sincron)** (`npm i -g @x-cmd/draw` / `npx`):

```sh
npm install @x-cmd/draw
```
```ts
import { draw } from '@x-cmd/draw';
const { svg } = draw({ type: 'pie', labels: 'A,B', values: '3,2', t: 'evil', scheme: 'dark' });
// acceptă și query string: draw('?type=bar&labels=Lun,Mar&values=3,5')
// array-uri = parametri repetați (etichete cu virgule)
draw({ type: 'bar', labels: ['Q1, 2024', 'Q2'], values: [1, 2] })
```
```sh
draw --type pie --labels "A,B,C" --values "3,2,1" --out pie.svg
draw "?type=hbar&labels=a,b,c&values=3,2,1&t=xcmd"   # query string simplu
```

**Self-hosting**:

```sh
git clone https://github.com/x-cmd/draw && cd draw && npm install
npm run serve      # server Node local :8787 cu pagină demo
npm run dev        # wrangler dev
bash scripts/setup.sh   # deploy într-un click pe contul tău Cloudflare
```

Variabile de mediu (Node): `PORT` (8787) · `BASE_PATH` · `DATA_REPO`/`DATA_BRANCH`/`GITHUB_TOKEN` (activează linkuri scurte POST).

**Deno** — nucleul de randare e pur, fără rețea — sandbox-ul fără permisiuni este granița de securitate:

```ts
import { draw } from "jsr:@x-cmd/draw";
const { svg } = draw({ type: "pie", labels: "A,B", values: "3,2" });
```

## Endpoint-uri

**`GET /draw?type=<pie|bar|hbar|line|area|radar|gauge|scatter|combo|sankey|qr>`** — randează un grafic

| type | | |
|---|---|---|
| `pie` | Inel; `donut=0` = plin<br><br>**<u>≤100 clase (>9 → Other)</u>** | <a href="https://x-cmd.com/draw?type=pie&labels=TS,Py,Go,Rust&values=4821,2312,980,645&title=Stele%20pe%20limbaj"><img src="https://x-cmd.com/draw?type=pie&labels=TS,Py,Go,Rust&values=4821,2312,980,645&title=Stele%20pe%20limbaj" width="360" alt="example"></a> |
| `bar` | Coloane grupate; `stack=1` stivuite<br><br>**<u>≤30 grupuri</u>** | <a href="https://x-cmd.com/draw?type=bar&labels=Lun,Mar,Mie&series=dev:12,18,9&series=ci:8,11,6"><img src="https://x-cmd.com/draw?type=bar&labels=Lun,Mar,Mie&series=dev:12,18,9&series=ci:8,11,6" width="360" alt="example"></a> |
| `hbar` | Bare orizontale (clasamente)<br><br>**<u>≤30 bare</u>** | <a href="https://x-cmd.com/draw?type=hbar&labels=CLI,nucleu,documenta%C8%9Bie,UI&values=42,31,18,9&title=Commit-uri%20pe%20zone"><img src="https://x-cmd.com/draw?type=hbar&labels=CLI,nucleu,documenta%C8%9Bie,UI&values=42,31,18,9&title=Commit-uri%20pe%20zone" width="360" alt="example"></a> |
| `line` | Linie netedă + gradient / multilinie<br><br>**<u>≤60 puncte</u>** | <a href="https://x-cmd.com/draw?type=line&labels=Ian,Feb,Mar,Apr,Mai,Iun&values=12,19,15,25,22,30&title=Stele%20pe%20limbaj"><img src="https://x-cmd.com/draw?type=line&labels=Ian,Feb,Mar,Apr,Mai,Iun&values=12,19,15,25,22,30&title=Stele%20pe%20limbaj" width="360" alt="example"></a> |
| `area` | Arie / multi-arii<br><br>**<u>≤60 puncte</u>** | <a href="https://x-cmd.com/draw?type=area&labels=Q1,Q2,Q3,Q4&values=8,14,23,37&title=Desc%C4%83rc%C4%83ri"><img src="https://x-cmd.com/draw?type=area&labels=Q1,Q2,Q3,Q4&values=8,14,23,37&title=Desc%C4%83rc%C4%83ri" width="360" alt="example"></a> |
| `radar` | Radar<br><br>**<u>3–12 axe</u>** | <a href="https://x-cmd.com/draw?type=radar&t=evil&labels=pornire,ecosistem,extensibilitate,memorie,u%C8%99urin%C8%9B%C4%83&series=vscode:60,95,90,55,80&series=neovim:95,65,85,95,35&series=zed:92,50,55,90,60&title=Comparare%20editoare"><img src="https://x-cmd.com/draw?type=radar&t=evil&labels=pornire,ecosistem,extensibilitate,memorie,u%C8%99urin%C8%9B%C4%83&series=vscode:60,95,90,55,80&series=neovim:95,65,85,95,35&series=zed:92,50,55,90,60&title=Comparare%20editoare" width="360" alt="example"></a> |
| `gauge` | Indicator (arc 240°, valoare centrală)<br><br>**<u>value+max; inele ≤8</u>** | <a href="https://x-cmd.com/draw?type=gauge&title=Rat%C4%83%20CI&value=87&max=100"><img src="https://x-cmd.com/draw?type=gauge&title=Rat%C4%83%20CI&value=87&max=100" width="360" alt="example"></a> |
| `scatter` | Împrăștiere, două axe numerice, negative ok<br><br>**<u>x=&y=, ≤200 puncte</u>** | <a href="https://x-cmd.com/draw?type=scatter&x=1,2,3,4,5&y=4,5,3,6,5&title=Laten%C8%9B%C4%83"><img src="https://x-cmd.com/draw?type=scatter&x=1,2,3,4,5&y=4,5,3,6,5&title=Laten%C8%9B%C4%83" width="360" alt="example"></a> |
| `combo` | Coloane (`series=`) + linie (`line=`); dublă axă de la 5× diferență<br><br>**<u>≤30 grupuri, ≤6 serii</u>** | <a href="https://x-cmd.com/draw?type=combo&labels=Lun,Mar,Mie,Joi,Vin,S%C3%A2m,Dum&series=Desc%C4%83rc%C4%83ri:120,180,150,210,240,200,260&line=Cre%C8%99tere:3.1,3.4,3.2,3.8,4.1,3.9,4.5&title=Desc%C4%83rc%C4%83ri%20s%C4%83pt%C4%83m%C3%A2nale&unit=dl"><img src="https://x-cmd.com/draw?type=combo&labels=Lun,Mar,Mie,Joi,Vin,S%C3%A2m,Dum&series=Desc%C4%83rc%C4%83ri:120,180,150,210,240,200,260&line=Cre%C8%99tere:3.1,3.4,3.2,3.8,4.1,3.9,4.5&title=Desc%C4%83rc%C4%83ri%20s%C4%83pt%C4%83m%C3%A2nale&unit=dl" width="360" alt="example"></a> |
| `sankey` | Diagramă de flux cu lățimi<br><br>**<u>labels=+links=A>B:30, ≤24 noduri</u>** | <a href="https://x-cmd.com/draw?type=sankey&t=pipeline&labels=func%C8%9Bii,fixuri,documenta%C8%9Bie,altele,combinate,%C3%AEnchise,respinse,%3C1a,1%E2%80%932a,%3E2a&links=func%C8%9Bii%3Ecombinate:38;func%C8%9Bii%3E%C3%AEnchise:12;func%C8%9Bii%3Erespinse:8;fixuri%3Ecombinate:33;fixuri%3E%C3%AEnchise:6;fixuri%3Erespinse:2;documenta%C8%9Bie%3Ecombinate:16;documenta%C8%9Bie%3E%C3%AEnchise:4;altele%3Ecombinate:5;altele%3E%C3%AEnchise:6;altele%3Erespinse:6;combinate%3E%3C1a:52;combinate%3E1%E2%80%932a:28;combinate%3E%3E2a:12;%C3%AEnchise%3E%3C1a:14;%C3%AEnchise%3E1%E2%80%932a:9;%C3%AEnchise%3E%3E2a:5;respinse%3E%3C1a:9;respinse%3E1%E2%80%932a:5;respinse%3E%3E2a:2&title=Ciclul%20de%20via%C8%9B%C4%83%20al%20PR&unit=prs"><img src="https://x-cmd.com/draw?type=sankey&t=pipeline&labels=func%C8%9Bii,fixuri,documenta%C8%9Bie,altele,combinate,%C3%AEnchise,respinse,%3C1a,1%E2%80%932a,%3E2a&links=func%C8%9Bii%3Ecombinate:38;func%C8%9Bii%3E%C3%AEnchise:12;func%C8%9Bii%3Erespinse:8;fixuri%3Ecombinate:33;fixuri%3E%C3%AEnchise:6;fixuri%3Erespinse:2;documenta%C8%9Bie%3Ecombinate:16;documenta%C8%9Bie%3E%C3%AEnchise:4;altele%3Ecombinate:5;altele%3E%C3%AEnchise:6;altele%3Erespinse:6;combinate%3E%3C1a:52;combinate%3E1%E2%80%932a:28;combinate%3E%3E2a:12;%C3%AEnchise%3E%3C1a:14;%C3%AEnchise%3E1%E2%80%932a:9;%C3%AEnchise%3E%3E2a:5;respinse%3E%3C1a:9;respinse%3E1%E2%80%932a:5;respinse%3E%3E2a:2&title=Ciclul%20de%20via%C8%9B%C4%83%20al%20PR&unit=prs" width="360" alt="example"></a> |
| `qr` | Cod QR<br><br>**<u>d≤1000 caractere, fg/bg, title/unit</u>** | <a href="https://x-cmd.com/draw?type=qr&d=https://github.com/x-cmd/draw&title=scaneaz%C4%83"><img src="https://x-cmd.com/draw?type=qr&d=https://github.com/x-cmd/draw&title=scaneaz%C4%83" width="360" alt="example"></a> |

**`GET /draw`** — pagina demo · **`POST /draw?type=...`** — un body JSON/CSV creează un link scurt permanent · **`GET /draw/c/<hash>`** — randarea linkului scurt (immutable)

## Stiluri (`?t=`)

| type | |
|---|---|
| `pie` | opendata (implicit) · evil · evil-mono · market-mono · progress · revenue |
| `bar` | evil (implicit) · base · grid |
| `hbar` | base (implicit) · opendata (ref=) · xcmd · xcmd-issue · rank |
| `line` | shadcn (implicit) · evil · evil-glow · evil-mono · opendata |
| `area` | evil (implicit) · star · opendata · pixel · polka |
| `radar` | base (implicit) · evil · xcmd |
| `sankey` | base (implicit) · fund · pipeline |
| `gauge` | base (implicit) · gradient · reliability |
| `scatter/combo/qr` | base (combo are și evil) |

## Transmiterea datelor

```text
https://x-cmd.com/draw?type=pie&title=Stele%20pe%20limbaj&labels=TypeScript,Python,Go&values=4821,2312,980
```

Etichete cu virgule: repetă parametrul (`labels=Q1, 2024&labels=Q2`). Date complexe: `?d=` + JSON codificat URL:

```json
{"title":"...","data":[{"label":"A","value":1}]}
```

## Linkuri scurte

POST generează un link scurt permanent adresat de conținut (repo GitHub ca stocare):

- aceleași date → același hash (idempotent, deduplicare)
- limită 30 cereri/min/IP
- stocare publică — nimic sensibil

## Versionare

- fără `v`: versiunea recentă, cache 300 s
- `v=N`: versiune fixată, cache 1 zi
- `immutable` doar pentru `/c/<hash>`

## Prietenos cu AI

Fiecare SVG include JSON: `{generator, template, version, spec}` — datele și parametrii fac round-trip direct; textul este `<text>` real.

## Self-hosting într-un pas

```sh
curl -fsSL https://raw.githubusercontent.com/x-cmd/draw/main/scripts/setup.sh | bash
```

Scriptul clonează, autentifică wrangler, face deploy și printează URL-ul `*.workers.dev`. Linkurile scurte (POST) se activează cu `DATA_REPO` + `GITHUB_TOKEN`.

## Dezvoltare

```sh
npm install
npm run dev      # wrangler dev
npm test         # vitest (120)
npm run check    # tsc ×3
npm run build    # dist/
```

## Licență

Cod Apache-2.0; fonturi OFL — [LICENSE](../LICENSE) · Documentație completă: [README (EN)](../README.md)
