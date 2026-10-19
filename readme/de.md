# draw — SVG-Diagramme, deren Daten in der URL leben

> [English](../README.md) | **Deutsch**

[![JSR score](https://img.shields.io/badge/dynamic/json?url=https%3A%2F%2Fapi.jsr.io%2Fscopes%2Fx-cmd%2Fpackages%2Fdraw&query=%24.score&label=JSR%20score&color=yellowgreen)](https://jsr.io/@x-cmd/draw/score)
[![OpenSSF Scorecard](https://api.securityscorecards.dev/projects/github.com/x-cmd/draw/badge)](https://securityscorecards.dev/viewer/?uri=github.com/x-cmd/draw)

SVG-Diagramme für das KI-Zeitalter: ein Endpunkt `/draw?type=...`, Daten in der URL, maschinenlesbarer `<metadata>` in jeder Ausgabe. Das Stilsystem folgt einer Designer-Spezifikation, mit mehreren Stilvarianten pro Diagrammtyp.

## Vorschau

Alle Daten stehen in der URL — im Browser öffnen, als `<img>` einbetten oder ins README einfügen: Das SVG wird sofort gerendert.

### Sankey — Pull-Request-Lebenszyklus (`type=sankey&t=pipeline`)

```text
https://x-cmd.com/draw?type=sankey&t=pipeline&labels=feat,fix,docs,chore,merged,closed,rejected,0-1y,1-2y,2y%2B&links=feat%3Emerged:38;feat%3Eclosed:12;feat%3Erejected:8;fix%3Emerged:33;fix%3Eclosed:6;fix%3Erejected:2;docs%3Emerged:16;docs%3Eclosed:4;chore%3Emerged:5;chore%3Eclosed:6;chore%3Erejected:6;merged%3E0-1y:52;merged%3E1-2y:28;merged%3E2y%2B:12;closed%3E0-1y:14;closed%3E1-2y:9;closed%3E2y%2B:5;rejected%3E0-1y:9;rejected%3E1-2y:5;rejected%3E2y%2B:2&title=Pull%20requests%20lifecycle&unit=prs
```

![Sankey — Pull-Request-Lebenszyklus](https://x-cmd.com/draw?type=sankey&t=pipeline&labels=feat,fix,docs,chore,merged,closed,rejected,0-1y,1-2y,2y%2B&links=feat%3Emerged:38;feat%3Eclosed:12;feat%3Erejected:8;fix%3Emerged:33;fix%3Eclosed:6;fix%3Erejected:2;docs%3Emerged:16;docs%3Eclosed:4;chore%3Emerged:5;chore%3Eclosed:6;chore%3Erejected:6;merged%3E0-1y:52;merged%3E1-2y:28;merged%3E2y%2B:12;closed%3E0-1y:14;closed%3E1-2y:9;closed%3E2y%2B:5;rejected%3E0-1y:9;rejected%3E1-2y:5;rejected%3E2y%2B:2&title=Pull%20requests%20lifecycle&unit=prs)

### Hbar — Laufzeit-Durchsatz (gemessen) (`type=hbar; draw() ops/s: deno 7238 · node 6553 · bun 4972, Apple Silicon`)

```text
https://x-cmd.com/draw?type=hbar&labels=deno,node,bun&values=7238,6553,4972&title=Runtime%20throughput&unit=ops%2Fs
```

![Hbar — Laufzeit-Durchsatz (gemessen)](https://x-cmd.com/draw?type=hbar&labels=deno,node,bun&values=7238,6553,4972&title=Runtime%20throughput&unit=ops%2Fs)

### Radar — Vergleich dreier Editoren (`type=radar&t=evil`)

```text
https://x-cmd.com/draw?type=radar&t=evil&labels=startup,ecosystem,extensibility,memory,ease&series=vscode:60,95,90,55,80&series=neovim:95,65,85,95,35&series=zed:92,50,55,90,60&title=Editor%20comparison
```

![Radar — Vergleich dreier Editoren](https://x-cmd.com/draw?type=radar&t=evil&labels=startup,ecosystem,extensibility,memory,ease&series=vscode:60,95,90,55,80&series=neovim:95,65,85,95,35&series=zed:92,50,55,90,60&title=Editor%20comparison)

### Kombination — Downloads vs. Wachstum (`type=combo`)

```text
https://x-cmd.com/draw?type=combo&labels=Mo,Di,Mi,Do,Fr,Sa,So&series=Downloads:120,180,150,210,240,200,260&line=Wachstum:3.1,3.4,3.2,3.8,4.1,3.9,4.5&title=W%C3%B6chentliche%20Downloads&unit=dl
```

![Kombination — Downloads vs. Wachstum](https://x-cmd.com/draw?type=combo&labels=Mo,Di,Mi,Do,Fr,Sa,So&series=Downloads:120,180,150,210,240,200,260&line=Wachstum:3.1,3.4,3.2,3.8,4.1,3.9,4.5&title=W%C3%B6chentliche%20Downloads&unit=dl)

### Hbar — offene/geschlossene Issues (Schmetterling) (`type=hbar&t=xcmd-issue`)

```text
https://x-cmd.com/draw?type=hbar&t=xcmd-issue&labels=cli,core,docs,ci,ui&series=offen:12,8,15,4,9&series=geschlossen:38,52,20,11,26&title=Issues%20nach%20Bereich
```

![Hbar — offene/geschlossene Issues (Schmetterling)](https://x-cmd.com/draw?type=hbar&t=xcmd-issue&labels=cli,core,docs,ci,ui&series=offen:12,8,15,4,9&series=geschlossen:38,52,20,11,26&title=Issues%20nach%20Bereich)

### Kreis — größte Städte (`type=pie&t=market-mono`)

```text
https://x-cmd.com/draw?type=pie&t=market-mono&title=Gr%C3%B6%C3%9Fte%20St%C3%A4dte&unit=Mio.&labels=Berlin,Hamburg,M%C3%BCnchen,K%C3%B6ln&values=3.6,1.8,1.5,1.1
```

![Kreis — größte Städte](https://x-cmd.com/draw?type=pie&t=market-mono&title=Gr%C3%B6%C3%9Fte%20St%C3%A4dte&unit=Mio.&labels=Berlin,Hamburg,M%C3%BCnchen,K%C3%B6ln&values=3.6,1.8,1.5,1.1)

## Drei Wege der Nutzung

**Hosted Service (null Installation)** — `https://x-cmd.com/draw?type=pie&labels=A,B&values=3,2`

**npm-Bibliothek + CLI (offline, synchron)** (`npm i -g @x-cmd/draw` / `npx`):

```sh
npm install @x-cmd/draw
```
```ts
import { draw } from '@x-cmd/draw';
const { svg } = draw({ type: 'pie', labels: 'A,B', values: '3,2', t: 'evil', scheme: 'dark' });
// auch Abfrage-String: draw('?type=bar&labels=Mo,Di&values=3,5')
// Arrays = wiederholte Parameter (Labels mit Kommas)
draw({ type: 'bar', labels: ['Q1, 2024', 'Q2'], values: [1, 2] })
```
```sh
draw --type pie --labels "A,B,C" --values "3,2,1" --out pie.svg
draw "?type=hbar&labels=a,b,c&values=3,2,1&t=xcmd"   # barer Abfrage-String
```

**Selbst-Hosting**:

```sh
git clone https://github.com/x-cmd/draw && cd draw && npm install
npm run serve      # lokaler Node-Server :8787 mit Demo-Seite
npm run dev        # wrangler dev
bash scripts/setup.sh   # Ein-Klick-Deploy auf dein Cloudflare-Konto
```

Umgebungsvariablen (Node): `PORT` (8787) · `BASE_PATH` · `DATA_REPO`/`DATA_BRANCH`/`GITHUB_TOKEN` (aktiviert POST-Kurzlinks).

**Deno** — reine Renderfunktion, kein Netzwerk — die Sandbox ohne Berechtigungen ist die Sicherheitsgrenze:

```ts
import { draw } from "jsr:@x-cmd/draw";
const { svg } = draw({ type: "pie", labels: "A,B", values: "3,2" });
```

## Endpunkte

**`GET /draw?type=<pie|bar|hbar|line|area|radar|gauge|scatter|combo|sankey|qr>`** — Diagramm rendern

| type | | |
|---|---|---|
| `pie` | Donut; `donut=0` = volle Kreis<br><br>**<u>≤100 Klassen (>9 → Other)</u>** | <a href="https://x-cmd.com/draw?type=pie&labels=TS,Py,Go,Rust&values=4821,2312,980,645&title=Sterne%20nach%20Sprache"><img src="https://x-cmd.com/draw?type=pie&labels=TS,Py,Go,Rust&values=4821,2312,980,645&title=Sterne%20nach%20Sprache" width="360" alt="example"></a> |
| `bar` | Gruppierte Säulen; `stack=1` gestapelt<br><br>**<u>≤30 Gruppen</u>** | <a href="https://x-cmd.com/draw?type=bar&labels=Mo,Di,Mi&series=dev:12,18,9&series=ci:8,11,6"><img src="https://x-cmd.com/draw?type=bar&labels=Mo,Di,Mi&series=dev:12,18,9&series=ci:8,11,6" width="360" alt="example"></a> |
| `hbar` | Horizontale Balken (Rankings)<br><br>**<u>≤30 Balken</u>** | <a href="https://x-cmd.com/draw?type=hbar&labels=cli,core,docs,ui&values=42,31,18,9&title=Commits%20nach%20Bereich"><img src="https://x-cmd.com/draw?type=hbar&labels=cli,core,docs,ui&values=42,31,18,9&title=Commits%20nach%20Bereich" width="360" alt="example"></a> |
| `line` | Glatte Linie + Verlauf / Mehrfachlinien<br><br>**<u>≤60 Punkte</u>** | <a href="https://x-cmd.com/draw?type=line&labels=Jan,Feb,M%C3%A4r,Apr,Mai,Jun&values=12,19,15,25,22,30&title=Sterne%20nach%20Sprache"><img src="https://x-cmd.com/draw?type=line&labels=Jan,Feb,M%C3%A4r,Apr,Mai,Jun&values=12,19,15,25,22,30&title=Sterne%20nach%20Sprache" width="360" alt="example"></a> |
| `area` | Fläche / Mehrfach-Flächen<br><br>**<u>≤60 Punkte</u>** | <a href="https://x-cmd.com/draw?type=area&labels=Q1,Q2,Q3,Q4&values=8,14,23,37&title=Downloads"><img src="https://x-cmd.com/draw?type=area&labels=Q1,Q2,Q3,Q4&values=8,14,23,37&title=Downloads" width="360" alt="example"></a> |
| `radar` | Radar<br><br>**<u>3–12 Achsen</u>** | <a href="https://x-cmd.com/draw?type=radar&t=evil&labels=startup,ecosystem,extensibility,memory,ease&series=vscode:60,95,90,55,80&series=neovim:95,65,85,95,35&series=zed:92,50,55,90,60&title=Editor%20comparison"><img src="https://x-cmd.com/draw?type=radar&t=evil&labels=startup,ecosystem,extensibility,memory,ease&series=vscode:60,95,90,55,80&series=neovim:95,65,85,95,35&series=zed:92,50,55,90,60&title=Editor%20comparison" width="360" alt="example"></a> |
| `gauge` | Messuhr (240°-Bogen, Mittelwert)<br><br>**<u>value+max; Ringe ≤8</u>** | <a href="https://x-cmd.com/draw?type=gauge&title=CI-Quote&value=87&max=100"><img src="https://x-cmd.com/draw?type=gauge&title=CI-Quote&value=87&max=100" width="360" alt="example"></a> |
| `scatter` | Streuung, zwei numerische Achsen, Negative ok<br><br>**<u>x=&y=, ≤200 Punkte</u>** | <a href="https://x-cmd.com/draw?type=scatter&x=1,2,3,4,5&y=4,5,3,6,5&title=Latenz"><img src="https://x-cmd.com/draw?type=scatter&x=1,2,3,4,5&y=4,5,3,6,5&title=Latenz" width="360" alt="example"></a> |
| `combo` | Säulen (`series=`) + Linie (`line=`); Doppelachse ab 5× Spanne<br><br>**<u>≤30 Gruppen, ≤6 Serien</u>** | <a href="https://x-cmd.com/draw?type=combo&labels=Mo,Di,Mi,Do,Fr,Sa,So&series=Downloads:120,180,150,210,240,200,260&line=Wachstum:3.1,3.4,3.2,3.8,4.1,3.9,4.5&title=W%C3%B6chentliche%20Downloads&unit=dl"><img src="https://x-cmd.com/draw?type=combo&labels=Mo,Di,Mi,Do,Fr,Sa,So&series=Downloads:120,180,150,210,240,200,260&line=Wachstum:3.1,3.4,3.2,3.8,4.1,3.9,4.5&title=W%C3%B6chentliche%20Downloads&unit=dl" width="360" alt="example"></a> |
| `sankey` | Flussdiagramm mit Bandbreiten<br><br>**<u>labels=+links=A>B:30, ≤24 Knoten</u>** | <a href="https://x-cmd.com/draw?type=sankey&t=pipeline&labels=feat,fix,docs,chore,merged,closed,rejected,0-1y,1-2y,2y%2B&links=feat%3Emerged:38;feat%3Eclosed:12;feat%3Erejected:8;fix%3Emerged:33;fix%3Eclosed:6;fix%3Erejected:2;docs%3Emerged:16;docs%3Eclosed:4;chore%3Emerged:5;chore%3Eclosed:6;chore%3Erejected:6;merged%3E0-1y:52;merged%3E1-2y:28;merged%3E2y%2B:12;closed%3E0-1y:14;closed%3E1-2y:9;closed%3E2y%2B:5;rejected%3E0-1y:9;rejected%3E1-2y:5;rejected%3E2y%2B:2&title=Pull%20requests%20lifecycle&unit=prs"><img src="https://x-cmd.com/draw?type=sankey&t=pipeline&labels=feat,fix,docs,chore,merged,closed,rejected,0-1y,1-2y,2y%2B&links=feat%3Emerged:38;feat%3Eclosed:12;feat%3Erejected:8;fix%3Emerged:33;fix%3Eclosed:6;fix%3Erejected:2;docs%3Emerged:16;docs%3Eclosed:4;chore%3Emerged:5;chore%3Eclosed:6;chore%3Erejected:6;merged%3E0-1y:52;merged%3E1-2y:28;merged%3E2y%2B:12;closed%3E0-1y:14;closed%3E1-2y:9;closed%3E2y%2B:5;rejected%3E0-1y:9;rejected%3E1-2y:5;rejected%3E2y%2B:2&title=Pull%20requests%20lifecycle&unit=prs" width="360" alt="example"></a> |
| `qr` | QR-Code<br><br>**<u>d≤1000 Zeichen, fg/bg, title/unit</u>** | <a href="https://x-cmd.com/draw?type=qr&d=https://github.com/x-cmd/draw&title=scannen"><img src="https://x-cmd.com/draw?type=qr&d=https://github.com/x-cmd/draw&title=scannen" width="360" alt="example"></a> |

**`GET /draw`** — Demo-Seite · **`POST /draw?type=...`** — JSON/CSV-Body erzeugt permanenten Kurzlink · **`GET /draw/c/<hash>`** — Kurzlink-Rendering (immutable)

## Stile (`?t=`)

| type | |
|---|---|
| `pie` | opendata (Standard) · evil · evil-mono · market-mono · progress · revenue |
| `bar` | evil (Standard) · base · grid |
| `hbar` | base (Standard) · opendata (ref=) · xcmd · xcmd-issue · rank |
| `line` | shadcn (Standard) · evil · evil-glow · evil-mono · opendata |
| `area` | evil (Standard) · star · opendata · pixel · polka |
| `radar` | base (Standard) · evil · xcmd |
| `sankey` | base (Standard) · fund · pipeline |
| `gauge` | base (Standard) · gradient · reliability |
| `scatter/combo/qr` | base (combo zusätzlich evil) |

## Daten übergeben

```text
https://x-cmd.com/draw?type=pie&title=Sterne%20nach%20Sprache&labels=TypeScript,Python,Go&values=4821,2312,980
```

Bei Labels mit Kommas: Parameter wiederholen (`labels=Q1, 2024&labels=Q2`). Komplexe Daten: `?d=` + URL-kodiertes JSON:

```json
{"title":"...","data":[{"label":"A","value":1}]}
```

## Kurzlinks

POST erzeugt einen inhaltsadressierten, permanenten Kurzlink (GitHub-Repo als Speicher):

- gleiche Daten → gleicher Hash (idempotent, dedupliziert)
- Rate-Limit 30 Anfragen/min/IP
- öffentlicher Datenspeicher — keine sensiblen Daten

## Versionierung

- ohne `v`: neueste Version, 300 s Cache
- `v=N`: Version angeheftet, 1 Tag Cache
- `immutable` nur für Kurzlinks `/c/<hash>`

## KI-freundlich

Jedes SVG bettet JSON ein: `{generator, template, version, spec}` — Daten und Parameter sind direkt round-trip-fähig; Text bleibt echtes `<text>`.

## Selbst-Hosting in einem Schritt

```sh
curl -fsSL https://raw.githubusercontent.com/x-cmd/draw/main/scripts/setup.sh | bash
```

Das Skript klont, meldet wrangler an, deployt und druckt deine `*.workers.dev`-URL. Kurzlinks (POST) aktivierst du per `DATA_REPO` + `GITHUB_TOKEN`.

## Entwicklung

```sh
npm install
npm run dev      # wrangler dev
npm test         # vitest (120)
npm run check    # tsc ×3
npm run build    # dist/
```

## Lizenz

Code Apache-2.0; Schriftarten OFL — [LICENSE](../LICENSE) · Vollständige Dokumentation: [README (EN)](../README.md)
