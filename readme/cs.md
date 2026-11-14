# draw — SVG grafy s daty v URL

> [English](../README.md) | **Čeština**

[![JSR score](https://img.shields.io/badge/dynamic/json?url=https%3A%2F%2Fapi.jsr.io%2Fscopes%2Fx-cmd%2Fpackages%2Fdraw&query=%24.score&label=JSR%20score&color=yellowgreen)](https://jsr.io/@x-cmd/draw/score)
[![OpenSSF Scorecard](https://api.securityscorecards.dev/projects/github.com/x-cmd/draw/badge)](https://securityscorecards.dev/viewer/?uri=github.com/x-cmd/draw)

SVG grafy pro éru AI: jediný endpoint `/draw?type=...`, data v URL a strojově čitelný `<metadata>` v každém výstupu. Systém stylů odpovídá designerské specifikaci, s více variantami pro každý typ grafu.

## Náhled

Všechna data žijí v URL — otevřete v prohlížeči, vložte jako `<img>` nebo do README: SVG se vykreslí okamžitě.

### Sankey — životní cyklus PR (`type=sankey&t=pipeline`)

```text
https://x-cmd.com/draw?type=sankey&t=pipeline&labels=featury,fixy,dokumentace,jin%C3%A9,slou%C4%8Deno,zav%C5%99eno,zam%C3%ADtnuto,%3C1r,1%E2%80%932r,%3E2r&links=featury%3Eslou%C4%8Deno:38;featury%3Ezav%C5%99eno:12;featury%3Ezam%C3%ADtnuto:8;fixy%3Eslou%C4%8Deno:33;fixy%3Ezav%C5%99eno:6;fixy%3Ezam%C3%ADtnuto:2;dokumentace%3Eslou%C4%8Deno:16;dokumentace%3Ezav%C5%99eno:4;jin%C3%A9%3Eslou%C4%8Deno:5;jin%C3%A9%3Ezav%C5%99eno:6;jin%C3%A9%3Ezam%C3%ADtnuto:6;slou%C4%8Deno%3E%3C1r:52;slou%C4%8Deno%3E1%E2%80%932r:28;slou%C4%8Deno%3E%3E2r:12;zav%C5%99eno%3E%3C1r:14;zav%C5%99eno%3E1%E2%80%932r:9;zav%C5%99eno%3E%3E2r:5;zam%C3%ADtnuto%3E%3C1r:9;zam%C3%ADtnuto%3E1%E2%80%932r:5;zam%C3%ADtnuto%3E%3E2r:2&title=%C5%BDivotn%C3%AD%20cyklus%20PR&unit=prs
```

[![Sankey — životní cyklus PR](https://x-cmd.com/draw?type=sankey&t=pipeline&labels=featury,fixy,dokumentace,jin%C3%A9,slou%C4%8Deno,zav%C5%99eno,zam%C3%ADtnuto,%3C1r,1%E2%80%932r,%3E2r&links=featury%3Eslou%C4%8Deno:38;featury%3Ezav%C5%99eno:12;featury%3Ezam%C3%ADtnuto:8;fixy%3Eslou%C4%8Deno:33;fixy%3Ezav%C5%99eno:6;fixy%3Ezam%C3%ADtnuto:2;dokumentace%3Eslou%C4%8Deno:16;dokumentace%3Ezav%C5%99eno:4;jin%C3%A9%3Eslou%C4%8Deno:5;jin%C3%A9%3Ezav%C5%99eno:6;jin%C3%A9%3Ezam%C3%ADtnuto:6;slou%C4%8Deno%3E%3C1r:52;slou%C4%8Deno%3E1%E2%80%932r:28;slou%C4%8Deno%3E%3E2r:12;zav%C5%99eno%3E%3C1r:14;zav%C5%99eno%3E1%E2%80%932r:9;zav%C5%99eno%3E%3E2r:5;zam%C3%ADtnuto%3E%3C1r:9;zam%C3%ADtnuto%3E1%E2%80%932r:5;zam%C3%ADtnuto%3E%3E2r:2&title=%C5%BDivotn%C3%AD%20cyklus%20PR&unit=prs)](https://x-cmd.com/draw/explore?type=sankey&t=pipeline&labels=featury,fixy,dokumentace,jin%C3%A9,slou%C4%8Deno,zav%C5%99eno,zam%C3%ADtnuto,%3C1r,1%E2%80%932r,%3E2r&links=featury%3Eslou%C4%8Deno:38;featury%3Ezav%C5%99eno:12;featury%3Ezam%C3%ADtnuto:8;fixy%3Eslou%C4%8Deno:33;fixy%3Ezav%C5%99eno:6;fixy%3Ezam%C3%ADtnuto:2;dokumentace%3Eslou%C4%8Deno:16;dokumentace%3Ezav%C5%99eno:4;jin%C3%A9%3Eslou%C4%8Deno:5;jin%C3%A9%3Ezav%C5%99eno:6;jin%C3%A9%3Ezam%C3%ADtnuto:6;slou%C4%8Deno%3E%3C1r:52;slou%C4%8Deno%3E1%E2%80%932r:28;slou%C4%8Deno%3E%3E2r:12;zav%C5%99eno%3E%3C1r:14;zav%C5%99eno%3E1%E2%80%932r:9;zav%C5%99eno%3E%3E2r:5;zam%C3%ADtnuto%3E%3C1r:9;zam%C3%ADtnuto%3E1%E2%80%932r:5;zam%C3%ADtnuto%3E%3E2r:2&title=%C5%BDivotn%C3%AD%20cyklus%20PR&unit=prs)

### Hbar — propustnost runtime (měřeno) (`type=hbar; draw() ops/s: deno 7238 · node 6553 · bun 4972, Apple Silicon`)

```text
https://x-cmd.com/draw?type=hbar&labels=deno,node,bun&values=7238,6553,4972&title=Runtime%20throughput&unit=ops%2Fs
```

[![Hbar — propustnost runtime (měřeno)](https://x-cmd.com/draw?type=hbar&labels=deno,node,bun&values=7238,6553,4972&title=Runtime%20throughput&unit=ops%2Fs)](https://x-cmd.com/draw/explore?type=hbar&labels=deno,node,bun&values=7238,6553,4972&title=Runtime%20throughput&unit=ops%2Fs)

### Radar — srovnání tří editorů (`type=radar&t=evil`)

```text
https://x-cmd.com/draw?type=radar&t=evil&labels=start,ekosyst%C3%A9m,roz%C5%A1i%C5%99itelnost,pam%C4%9B%C5%A5,jednoduchost&series=vscode:60,95,90,55,80&series=neovim:95,65,85,95,35&series=zed:92,50,55,90,60&title=Porovn%C3%A1n%C3%AD%20editor%C5%AF
```

[![Radar — srovnání tří editorů](https://x-cmd.com/draw?type=radar&t=evil&labels=start,ekosyst%C3%A9m,roz%C5%A1i%C5%99itelnost,pam%C4%9B%C5%A5,jednoduchost&series=vscode:60,95,90,55,80&series=neovim:95,65,85,95,35&series=zed:92,50,55,90,60&title=Porovn%C3%A1n%C3%AD%20editor%C5%AF)](https://x-cmd.com/draw/explore?type=radar&t=evil&labels=start,ekosyst%C3%A9m,roz%C5%A1i%C5%99itelnost,pam%C4%9B%C5%A5,jednoduchost&series=vscode:60,95,90,55,80&series=neovim:95,65,85,95,35&series=zed:92,50,55,90,60&title=Porovn%C3%A1n%C3%AD%20editor%C5%AF)

### Kombinovaný — stažení a růst (`type=combo`)

```text
https://x-cmd.com/draw?type=combo&labels=Po,%C3%9At,St,%C4%8Ct,P%C3%A1,So,Ne&series=Sta%C5%BEen%C3%AD:120,180,150,210,240,200,260&line=R%C5%AFst:3.1,3.4,3.2,3.8,4.1,3.9,4.5&title=T%C3%BDdenn%C3%AD%20sta%C5%BEen%C3%AD&unit=dl
```

[![Kombinovaný — stažení a růst](https://x-cmd.com/draw?type=combo&labels=Po,%C3%9At,St,%C4%8Ct,P%C3%A1,So,Ne&series=Sta%C5%BEen%C3%AD:120,180,150,210,240,200,260&line=R%C5%AFst:3.1,3.4,3.2,3.8,4.1,3.9,4.5&title=T%C3%BDdenn%C3%AD%20sta%C5%BEen%C3%AD&unit=dl)](https://x-cmd.com/draw/explore?type=combo&labels=Po,%C3%9At,St,%C4%8Ct,P%C3%A1,So,Ne&series=Sta%C5%BEen%C3%AD:120,180,150,210,240,200,260&line=R%C5%AFst:3.1,3.4,3.2,3.8,4.1,3.9,4.5&title=T%C3%BDdenn%C3%AD%20sta%C5%BEen%C3%AD&unit=dl)

### Hbar — otevřené/zavřené issue (motýlek) (`type=hbar&t=xcmd-issue`)

```text
https://x-cmd.com/draw?type=hbar&t=xcmd-issue&labels=CLI,j%C3%A1dro,dokumentace,ci,UI&series=otev%C5%99en%C3%A9:12,8,15,4,9&series=zav%C5%99en%C3%A9:38,52,20,11,26&title=Issue%20podle%20oblasti
```

[![Hbar — otevřené/zavřené issue (motýlek)](https://x-cmd.com/draw?type=hbar&t=xcmd-issue&labels=CLI,j%C3%A1dro,dokumentace,ci,UI&series=otev%C5%99en%C3%A9:12,8,15,4,9&series=zav%C5%99en%C3%A9:38,52,20,11,26&title=Issue%20podle%20oblasti)](https://x-cmd.com/draw/explore?type=hbar&t=xcmd-issue&labels=CLI,j%C3%A1dro,dokumentace,ci,UI&series=otev%C5%99en%C3%A9:12,8,15,4,9&series=zav%C5%99en%C3%A9:38,52,20,11,26&title=Issue%20podle%20oblasti)

### Koláč — největší města (`type=pie&t=market-mono`)

```text
https://x-cmd.com/draw?type=pie&t=market-mono&title=Nejv%C4%9Bt%C5%A1%C3%AD%20m%C4%9Bsta&unit=mil.&labels=Praha,Brno,Ostrava,Plze%C5%88&values=1.4,0.4,0.3,0.2
```

[![Koláč — největší města](https://x-cmd.com/draw?type=pie&t=market-mono&title=Nejv%C4%9Bt%C5%A1%C3%AD%20m%C4%9Bsta&unit=mil.&labels=Praha,Brno,Ostrava,Plze%C5%88&values=1.4,0.4,0.3,0.2)](https://x-cmd.com/draw/explore?type=pie&t=market-mono&title=Nejv%C4%9Bt%C5%A1%C3%AD%20m%C4%9Bsta&unit=mil.&labels=Praha,Brno,Ostrava,Plze%C5%88&values=1.4,0.4,0.3,0.2)

## Prompt — zadání pro AI agenta (skill)

Nulová instalace: vložte tento prompt jednou do libovolného agenta připojeného k webu a poté přirozeným jazykem popište graf nebo diagram, který potřebujete:

```text
Read and follow https://raw.githubusercontent.com/x-cmd/draw/main/SKILL.md, and use x-cmd Draw whenever you need to draw a chart or diagram.
```

Poté můžete napsat například:

> Vykresli hvězdičky jednotlivých jazyků jako koláčový graf — TypeScript 4821, Python 2312, Go 980

Agenti s nativním načítáním skillů (Claude Code atd.): uložte [`SKILL.md`](../SKILL.md) jednou do složky skills (`~/.claude/skills/draw/SKILL.md`); poté stačí přímo požádat o graf nebo diagram, bez promptu nebo URL.

## Tři způsoby použití

**Hostovaná služba (nulová instalace)** — `https://x-cmd.com/draw?type=pie&labels=A,B&values=3,2`

**Knihovna npm + CLI (offline, synchronní)** (`npm i -g @x-cmd/draw` / `npx`):

```sh
npm install @x-cmd/draw
```
```ts
import { draw } from '@x-cmd/draw';
const { svg } = draw({ type: 'pie', labels: 'A,B', values: '3,2', t: 'evil', scheme: 'dark' });
// přijímá i query string: draw('?type=bar&labels=Po,Út&values=3,5')
// pole = opakované parametry (popisky s čárkami)
draw({ type: 'bar', labels: ['Q1, 2024', 'Q2'], values: [1, 2] })
```
```sh
draw --type pie --labels "A,B,C" --values "3,2,1" --out pie.svg
draw "?type=hbar&labels=a,b,c&values=3,2,1&t=xcmd"   # holý query string
```

**Self-hosting**:

```sh
git clone https://github.com/x-cmd/draw && cd draw && npm install
npm run serve      # lokální Node server :8787 s demo stránkou
npm run dev        # wrangler dev
bash scripts/setup.sh   # deploy na jedno kliknutí na váš Cloudflare účet
```

Proměnné prostředí (Node): `PORT` (8787) · `BASE_PATH` · `DATA_REPO`/`DATA_BRANCH`/`GITHUB_TOKEN` (aktivuje POST krátké odkazy).

**Deno** — renderovací jádro je čisté, bez sítě — sandbox bez oprávnění je bezpečnostní hranice:

```ts
import { draw } from "jsr:@x-cmd/draw";
const { svg } = draw({ type: "pie", labels: "A,B", values: "3,2" });
```

## Endpointy

**`GET /draw?type=<pie|bar|hbar|line|area|radar|gauge|scatter|combo|sankey|qr>`** — vykreslit graf

| type | | |
|---|---|---|
| `pie` | Donut; `donut=0` = plný koláč<br><br>**<u>≤100 tříd (>9 → Other)</u>** | [![example](https://x-cmd.com/draw?type=pie&labels=TS,Py,Go,Rust&values=4821,2312,980,645&title=Hv%C4%9Bzdy%20podle%20jazyka&w=360)](https://x-cmd.com/draw/explore?type=pie&labels=TS,Py,Go,Rust&values=4821,2312,980,645&title=Hv%C4%9Bzdy%20podle%20jazyka) |
| `bar` | Skupinové sloupce; `stack=1` naskládané<br><br>**<u>≤30 skupin</u>** | [![example](https://x-cmd.com/draw?type=bar&labels=Po,%C3%9At,St&series=dev:12,18,9&series=ci:8,11,6&w=360)](https://x-cmd.com/draw/explore?type=bar&labels=Po,%C3%9At,St&series=dev:12,18,9&series=ci:8,11,6) |
| `hbar` | Vodorovné pruhy (žebříčky)<br><br>**<u>≤30 pruhů</u>** | [![example](https://x-cmd.com/draw?type=hbar&labels=CLI,j%C3%A1dro,dokumentace,UI&values=42,31,18,9&title=Commity%20podle%20oblasti&w=360)](https://x-cmd.com/draw/explore?type=hbar&labels=CLI,j%C3%A1dro,dokumentace,UI&values=42,31,18,9&title=Commity%20podle%20oblasti) |
| `line` | Hladká čára + gradient / více čar<br><br>**<u>≤60 bodů</u>** | [![example](https://x-cmd.com/draw?type=line&labels=Led,%C3%9Ano,B%C5%99e,Dub,Kv%C4%9B,%C4%8Cer&values=12,19,15,25,22,30&title=Hv%C4%9Bzdy%20podle%20jazyka&w=360)](https://x-cmd.com/draw/explore?type=line&labels=Led,%C3%9Ano,B%C5%99e,Dub,Kv%C4%9B,%C4%8Cer&values=12,19,15,25,22,30&title=Hv%C4%9Bzdy%20podle%20jazyka) |
| `area` | Plocha / více ploch<br><br>**<u>≤60 bodů</u>** | [![example](https://x-cmd.com/draw?type=area&labels=Q1,Q2,Q3,Q4&values=8,14,23,37&title=Sta%C5%BEen%C3%AD&w=360)](https://x-cmd.com/draw/explore?type=area&labels=Q1,Q2,Q3,Q4&values=8,14,23,37&title=Sta%C5%BEen%C3%AD) |
| `radar` | Radar<br><br>**<u>3–12 os</u>** | [![example](https://x-cmd.com/draw?type=radar&t=evil&labels=start,ekosyst%C3%A9m,roz%C5%A1i%C5%99itelnost,pam%C4%9B%C5%A5,jednoduchost&series=vscode:60,95,90,55,80&series=neovim:95,65,85,95,35&series=zed:92,50,55,90,60&title=Porovn%C3%A1n%C3%AD%20editor%C5%AF&w=360)](https://x-cmd.com/draw/explore?type=radar&t=evil&labels=start,ekosyst%C3%A9m,roz%C5%A1i%C5%99itelnost,pam%C4%9B%C5%A5,jednoduchost&series=vscode:60,95,90,55,80&series=neovim:95,65,85,95,35&series=zed:92,50,55,90,60&title=Porovn%C3%A1n%C3%AD%20editor%C5%AF) |
| `gauge` | Ukazatel (oblouk 240°, středová hodnota)<br><br>**<u>value+max; prstenců ≤8</u>** | [![example](https://x-cmd.com/draw?type=gauge&title=%C3%9Asp%C4%9B%C5%A1nost%20CI&value=87&max=100&w=360)](https://x-cmd.com/draw/explore?type=gauge&title=%C3%9Asp%C4%9B%C5%A1nost%20CI&value=87&max=100) |
| `scatter` | Bodový, dvě číselné osy, záporné ok<br><br>**<u>x=&y=, ≤200 bodů</u>** | [![example](https://x-cmd.com/draw?type=scatter&x=1,2,3,4,5&y=4,5,3,6,5&title=Latence&w=360)](https://x-cmd.com/draw/explore?type=scatter&x=1,2,3,4,5&y=4,5,3,6,5&title=Latence) |
| `combo` | Sloupce (`series=`) + čára (`line=`); dvě osy od 5× rozdílu<br><br>**<u>≤30 skupin, ≤6 řad</u>** | [![example](https://x-cmd.com/draw?type=combo&labels=Po,%C3%9At,St,%C4%8Ct,P%C3%A1,So,Ne&series=Sta%C5%BEen%C3%AD:120,180,150,210,240,200,260&line=R%C5%AFst:3.1,3.4,3.2,3.8,4.1,3.9,4.5&title=T%C3%BDdenn%C3%AD%20sta%C5%BEen%C3%AD&unit=dl&w=360)](https://x-cmd.com/draw/explore?type=combo&labels=Po,%C3%9At,St,%C4%8Ct,P%C3%A1,So,Ne&series=Sta%C5%BEen%C3%AD:120,180,150,210,240,200,260&line=R%C5%AFst:3.1,3.4,3.2,3.8,4.1,3.9,4.5&title=T%C3%BDdenn%C3%AD%20sta%C5%BEen%C3%AD&unit=dl) |
| `sankey` | Tokový diagram s šířkami<br><br>**<u>labels=+links=A>B:30, ≤24 uzlů</u>** | [![example](https://x-cmd.com/draw?type=sankey&t=pipeline&labels=featury,fixy,dokumentace,jin%C3%A9,slou%C4%8Deno,zav%C5%99eno,zam%C3%ADtnuto,%3C1r,1%E2%80%932r,%3E2r&links=featury%3Eslou%C4%8Deno:38;featury%3Ezav%C5%99eno:12;featury%3Ezam%C3%ADtnuto:8;fixy%3Eslou%C4%8Deno:33;fixy%3Ezav%C5%99eno:6;fixy%3Ezam%C3%ADtnuto:2;dokumentace%3Eslou%C4%8Deno:16;dokumentace%3Ezav%C5%99eno:4;jin%C3%A9%3Eslou%C4%8Deno:5;jin%C3%A9%3Ezav%C5%99eno:6;jin%C3%A9%3Ezam%C3%ADtnuto:6;slou%C4%8Deno%3E%3C1r:52;slou%C4%8Deno%3E1%E2%80%932r:28;slou%C4%8Deno%3E%3E2r:12;zav%C5%99eno%3E%3C1r:14;zav%C5%99eno%3E1%E2%80%932r:9;zav%C5%99eno%3E%3E2r:5;zam%C3%ADtnuto%3E%3C1r:9;zam%C3%ADtnuto%3E1%E2%80%932r:5;zam%C3%ADtnuto%3E%3E2r:2&title=%C5%BDivotn%C3%AD%20cyklus%20PR&unit=prs&w=360)](https://x-cmd.com/draw/explore?type=sankey&t=pipeline&labels=featury,fixy,dokumentace,jin%C3%A9,slou%C4%8Deno,zav%C5%99eno,zam%C3%ADtnuto,%3C1r,1%E2%80%932r,%3E2r&links=featury%3Eslou%C4%8Deno:38;featury%3Ezav%C5%99eno:12;featury%3Ezam%C3%ADtnuto:8;fixy%3Eslou%C4%8Deno:33;fixy%3Ezav%C5%99eno:6;fixy%3Ezam%C3%ADtnuto:2;dokumentace%3Eslou%C4%8Deno:16;dokumentace%3Ezav%C5%99eno:4;jin%C3%A9%3Eslou%C4%8Deno:5;jin%C3%A9%3Ezav%C5%99eno:6;jin%C3%A9%3Ezam%C3%ADtnuto:6;slou%C4%8Deno%3E%3C1r:52;slou%C4%8Deno%3E1%E2%80%932r:28;slou%C4%8Deno%3E%3E2r:12;zav%C5%99eno%3E%3C1r:14;zav%C5%99eno%3E1%E2%80%932r:9;zav%C5%99eno%3E%3E2r:5;zam%C3%ADtnuto%3E%3C1r:9;zam%C3%ADtnuto%3E1%E2%80%932r:5;zam%C3%ADtnuto%3E%3E2r:2&title=%C5%BDivotn%C3%AD%20cyklus%20PR&unit=prs) |
| `qr` | QR kód<br><br>**<u>d≤1000 znaků, fg/bg, title/unit</u>** | [![example](https://x-cmd.com/draw?type=qr&d=https://github.com/x-cmd/draw&title=skenuj&w=360)](https://x-cmd.com/draw/explore?type=qr&d=https://github.com/x-cmd/draw&title=skenuj) |

**`GET /draw`** — demo stránka · **`POST /draw?type=...`** — JSON/CSV body vytvoří trvalý krátký odkaz · **`GET /draw/c/<hash>`** — vykreslení krátkého odkazu (immutable)

## Styly (`?t=`)

| type | |
|---|---|
| `pie` | opendata (výchozí) · evil · evil-mono · market-mono · progress · revenue |
| `bar` | evil (výchozí) · base · grid |
| `hbar` | base (výchozí) · opendata (ref=) · xcmd · xcmd-issue · rank |
| `line` | shadcn (výchozí) · evil · evil-glow · evil-mono · opendata |
| `area` | evil (výchozí) · star · opendata · pixel · polka |
| `radar` | base (výchozí) · evil · xcmd |
| `sankey` | base (výchozí) · fund · pipeline |
| `gauge` | base (výchozí) · gradient · reliability |
| `scatter/combo/qr` | base (combo i evil) |

## Předávání dat

```text
https://x-cmd.com/draw?type=pie&title=Hv%C4%9Bzdy%20podle%20jazyka&labels=TypeScript,Python,Go&values=4821,2312,980
```

Popisky s čárkami: opakujte parametr (`labels=Q1, 2024&labels=Q2`). Složitá data: `?d=` + URL-kódované JSON:

```json
{"title":"...","data":[{"label":"A","value":1}]}
```

## Krátké odkazy

POST vytvoří trvalý krátký odkaz adresovaný obsahem (GitHub repozitář jako úložiště):

- stejná data → stejný hash (idempotentní, deduplikace)
- limit 30 požadavků/min/IP
- veřejné úložiště — nic citlivého

## Verzování

- bez `v`: nejnovější verze, cache 300 s
- `v=N`: připnutá verze, cache 1 den
- `immutable` jen pro `/c/<hash>`

## AI-friendly

Každé SVG obsahuje JSON: `{generator, template, version, spec}` — data a parametry jdou přímo tam a zpět; text je skutečné `<text>`.

## Self-hosting na jeden krok

```sh
curl -fsSL https://raw.githubusercontent.com/x-cmd/draw/main/scripts/setup.sh | bash
```

Skript naklonuje, přihlásí wrangler, nasadí a vypíše vaši `*.workers.dev` URL. Krátké odkazy (POST) aktivujete přes `DATA_REPO` + `GITHUB_TOKEN`.

## Vývoj

```sh
npm install
npm run dev      # wrangler dev
npm test         # vitest (120)
npm run check    # tsc ×3
npm run build    # dist/
```

## Licence

Kód Apache-2.0; fonty OFL — [LICENSE](../LICENSE) · Kompletní dokumentace: [README (EN)](../README.md)
