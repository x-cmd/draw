# draw

> English | [中文](README.cn.md)

[![JSR score](https://img.shields.io/badge/dynamic/json?url=https%3A%2F%2Fapi.jsr.io%2Fscopes%2Fx-cmd%2Fpackages%2Fdraw&query=%24.score&label=JSR%20score&color=yellowgreen)](https://jsr.io/@x-cmd/draw/score)
[![OpenSSF Scorecard](https://api.securityscorecards.dev/projects/github.com/x-cmd/draw/badge)](https://securityscorecards.dev/viewer/?uri=github.com/x-cmd/draw)

SVG chart generation for the AI era. One endpoint — `/draw?type=...` — with the data in the URL, machine-readable `<metadata>` embedded in every output, and SVG rendered directly by TypeScript. The style system mirrors a designer spec (13 SVGs), with multiple style variants per chart type.

## Sneak peek

All the data lives in the URL — open it in a browser, drop it into an `<img>`, paste it into your repo README: the SVG renders right away.

**Sankey — contributor funnel** (`type=sankey&t=pipeline`)

```text
https://x-cmd.com/draw?type=sankey&t=pipeline&labels=Visitors,Stars,Forks,PRs,Merged&links=Visitors>Stars:84;Visitors>Forks:18;Stars>Forks:17;Forks>PRs:9;Visitors>PRs:3;PRs>Merged:7&title=Contributor%20funnel&unit=users
```

![Sankey: contributor funnel](https://x-cmd.com/draw?type=sankey&t=pipeline&labels=Visitors,Stars,Forks,PRs,Merged&links=Visitors>Stars:84;Visitors>Forks:18;Stars>Forks:17;Forks>PRs:9;Visitors>PRs:3;PRs>Merged:7&title=Contributor%20funnel&unit=users)

**Combo — weekly downloads vs star-growth rate** (`type=combo`, dual y-axis on magnitude spread)

```text
https://x-cmd.com/draw?type=combo&labels=Mon,Tue,Wed,Thu,Fri,Sat,Sun&series=Downloads:120,180,150,210,240,200,260&line=Star%20growth:3.1,3.4,3.2,3.8,4.1,3.9,4.5&title=Weekly%20npm%20downloads&unit=dl
```

![Combo: downloads + star growth](https://x-cmd.com/draw?type=combo&labels=Mon,Tue,Wed,Thu,Fri,Sat,Sun&series=Downloads:120,180,150,210,240,200,260&line=Star%20growth:3.1,3.4,3.2,3.8,4.1,3.9,4.5&title=Weekly%20npm%20downloads&unit=dl)

**Hbar — open/closed issues by area, butterfly** (`type=hbar&t=xcmd-issue`)

```text
https://x-cmd.com/draw?type=hbar&t=xcmd-issue&labels=cli,core,docs,ci,ui&series=open:12,8,15,4,9&series=closed:38,52,20,11,26&title=Issues%20by%20area
```

![Hbar: issues by area](https://x-cmd.com/draw?type=hbar&t=xcmd-issue&labels=cli,core,docs,ci,ui&series=open:12,8,15,4,9&series=closed:38,52,20,11,26&title=Issues%20by%20area)

**Pie — language composition** (`type=pie&t=market-mono`)

```text
https://x-cmd.com/draw?type=pie&t=market-mono&title=Languages&unit=%25&labels=TypeScript,Shell,JavaScript,Rust,Other&values=68,14,9,6,3
```

![Pie: languages](https://x-cmd.com/draw?type=pie&t=market-mono&title=Languages&unit=%25&labels=TypeScript,Shell,JavaScript,Rust,Other&values=68,14,9,6,3)

## Three ways to use it (one render core)

**Hosted service** (zero install): just build a URL — `https://x-cmd.com/draw?type=pie&labels=A,B&values=3,2`

**npm library** (offline/embedded, synchronous, no network; params identical to the URL):

```sh
npm install @x-cmd/draw
```
```ts
import { draw } from '@x-cmd/draw';
const { svg } = draw({ type: 'pie', labels: 'A,B', values: '3,2', t: 'evil', scheme: 'dark' });
// also accepts a query string: draw('?type=bar&labels=Mon,Tue&values=3,5')
// array values = repeated params (when labels contain commas):
draw({ type: 'bar', labels: ['Q1, 2024', 'Q2'], values: [1, 2] })
```

**CLI** (after `npm i -g @x-cmd/draw`, or via `npx`):

```sh
draw --type pie --labels "TypeScript,Python,Go" --values "4821,2312,980" --out pie.svg
draw --type hbar --labels a,b,c --values 3,2,1 --theme xcmd                # long flags (--theme/--width/--height)
draw "?type=hbar&labels=a,b,c&values=3,2,1&t=xcmd"   # bare query string, same params as the URL
```

**Self-host** — pick any entry point:

```sh
git clone https://github.com/x-cmd/draw && cd draw && npm install
npm run serve                    # local Node server (http://localhost:8787/draw, demo page included)
npm run dev                      # Cloudflare wrangler local dev
bash scripts/setup.sh            # one-shot deploy to your own Cloudflare account
```

Environment variables (Node server): `PORT` (default 8787) · `BASE_PATH` · `DATA_REPO`/`DATA_BRANCH`/`GITHUB_TOKEN` (set these to enable POST short links; unset degrades gracefully, exactly like self-deployed workers).

**Deno** (native TS; the render core is pure — no network, no files — so the zero-permission sandbox is the security boundary):

```ts
import { draw } from "jsr:@x-cmd/draw";   // JSR (Deno's native registry)
// or npm: import { draw } from "npm:@x-cmd/draw";
const { svg } = draw({ type: "pie", labels: "A,B", values: "3,2" });
```

```sh
deno add jsr:@x-cmd/draw
# run straight from source inside the repo (no build):
deno task cli --type pie --labels A,B --values 3,2 --out pie.svg   # only needs --allow-write
deno task serve                                                    # local server (same as npm run serve)
# proof of zero permissions: deno eval defaults to no grants — importing and rendering just works
```

## Endpoints

**`GET /draw?type=<pie|bar|hbar|line|area|radar|gauge|scatter|combo|sankey|qr>`** — render a chart

| type | chart | example |
|---|---|---|
| `pie` | donut; `donut=0` for a solid pie<br>**≤100 categories (>9 auto-merge into Other)** | <a href="https://x-cmd.com/draw?type=pie&labels=TS,Py,Go,Rust&values=4821,2312,980,645&title=Stars%20by%20language"><img src="https://x-cmd.com/draw?type=pie&labels=TS,Py,Go,Rust&values=4821,2312,980,645&title=Stars%20by%20language" width="260" alt="pie example"></a> |
| `bar` | grouped columns; multi-series with `stack=1` for stacked<br>**≤30 groups** | <a href="https://x-cmd.com/draw?type=bar&labels=Mon,Tue,Wed&series=dev:12,18,9&series=ci:8,11,6"><img src="https://x-cmd.com/draw?type=bar&labels=Mon,Tue,Wed&series=dev:12,18,9&series=ci:8,11,6" width="260" alt="bar example"></a> |
| `hbar` | horizontal bars (rankings; labels left, values right)<br>**≤30 bars, single series (some styles take two)** | <a href="https://x-cmd.com/draw?type=hbar&labels=cli,core,docs,ui&values=42,31,18,9&title=Commits%20by%20area"><img src="https://x-cmd.com/draw?type=hbar&labels=cli,core,docs,ui&values=42,31,18,9&title=Commits%20by%20area" width="260" alt="hbar example"></a> |
| `line` | smooth line + gradient area / multi-line<br>**≤60 points** | <a href="https://x-cmd.com/draw?type=line&labels=Jan,Feb,Mar,Apr,May,Jun&values=12,19,15,25,22,30&title=Stars"><img src="https://x-cmd.com/draw?type=line&labels=Jan,Feb,Mar,Apr,May,Jun&values=12,19,15,25,22,30&title=Stars" width="260" alt="line example"></a> |
| `area` | area / multi-series area (gradient fill)<br>**≤60 points** | <a href="https://x-cmd.com/draw?type=area&labels=Q1,Q2,Q3,Q4&values=8,14,23,37&title=Downloads"><img src="https://x-cmd.com/draw?type=area&labels=Q1,Q2,Q3,Q4&values=8,14,23,37&title=Downloads" width="260" alt="area example"></a> |
| `radar` | radar chart<br>**3–12 axes** | <a href="https://x-cmd.com/draw?type=radar&t=evil&labels=perf,docs,tests,dx&series=v1:7,5,8,6&series=v2:8,8,9,8"><img src="https://x-cmd.com/draw?type=radar&t=evil&labels=perf,docs,tests,dx&series=v1:7,5,8,6&series=v2:8,8,9,8" width="260" alt="radar example"></a> |
| `gauge` | gauge (240° arc + center value)<br>**`value`+`max` (default 100), value ≤ max; multi-ring ≤8** | <a href="https://x-cmd.com/draw?type=gauge&title=CI%20pass%20rate&value=87&max=100"><img src="https://x-cmd.com/draw?type=gauge&title=CI%20pass%20rate&value=87&max=100" width="260" alt="gauge example"></a> |
| `scatter` | scatter (two numeric axes, negatives supported; no value labels by default)<br>**`x=&y=`, ≤200 points** | <a href="https://x-cmd.com/draw?type=scatter&x=1,2,3,4,5&y=4,5,3,6,5&title=Latency"><img src="https://x-cmd.com/draw?type=scatter&x=1,2,3,4,5&y=4,5,3,6,5&title=Latency" width="260" alt="scatter example"></a> |
| `combo` | bars (`series=`) + line (`line=`) in one chart; `stack=1` to stack the bars<br>**≤30 groups, ≤6 series total** | <a href="https://x-cmd.com/draw?type=combo&labels=Mon,Tue,Wed,Thu,Fri&series=dl:120,180,150,210,240&line=growth:3.1,3.4,3.2,3.8,4.1&title=Downloads"><img src="https://x-cmd.com/draw?type=combo&labels=Mon,Tue,Wed,Thu,Fri&series=dl:120,180,150,210,240&line=growth:3.1,3.4,3.2,3.8,4.1&title=Downloads" width="260" alt="combo example"></a> |
| `sankey` | flow diagram with weighted bands<br>**`labels=`+`links=A>B:30`, ≤24 nodes/60 links** | <a href="https://x-cmd.com/draw?type=sankey&labels=Visitors,Stars,Forks,PRs,Merged&links=Visitors>Stars:84;Stars>Forks:17;Forks>PRs:9;PRs>Merged:7&title=Contributor%20funnel"><img src="https://x-cmd.com/draw?type=sankey&labels=Visitors,Stars,Forks,PRs,Merged&links=Visitors>Stars:84;Stars>Forks:17;Forks>PRs:9;PRs>Merged:7&title=Contributor%20funnel" width="260" alt="sankey example"></a> |
| `qr` | QR code<br>**`d`=text (≤1000 chars), `fg`/`bg` colors, `title`/`unit` captions** | <a href="https://x-cmd.com/draw?type=qr&d=https://github.com/x-cmd/draw&title=scan%20me"><img src="https://x-cmd.com/draw?type=qr&d=https://github.com/x-cmd/draw&title=scan%20me" width="260" alt="qr example"></a> |

**`GET /draw`** (no params) or `?tab=pie` — the demo page (11 chart types, all style variants, dual URL forms)
**`POST /draw?type=...`** — submit a JSON/CSV body to create a permanent short link
**`GET /draw/c/<hash>`** — short-link render (immutable)

Common parameters:

- `t` style family (per chart type, see below; falls back to default when not built for that type)
- `scheme` `auto` (default, follows system) / `dark` / `light`
- `v` pin a version; `w`/`h` size (200–1600 / 140–1200; qr is 120–1000 / 140–1000)
- `num` value labels: `all` / `peak` (highest only) / `none`. Defaults follow the style; applies to pie/bar/hbar/line/area/scatter/combo (radar/gauge/sankey/qr ignore it)
- `subtitle` editorial subtitle (only rendered by area's editorial style `t=opendata`), `source` data-source footnote (area only, any `t`); other types parse but ignore these

## Styles (`?t=`)

Per chart type, with automatic light/dark palettes:

| type | available families |
|---|---|
| `pie` | `opendata` (default, all labels outside), `evil` (rounded ring + inner values), `evil-mono` (solid pie + leader lines), `market-mono` (grayscale + ring total), `progress` (dotted progress ring), `revenue` (gradient wedges + dashed inner ring) |
| `bar` | `evil` (default, grouped), `base` (card), `grid` (table bars) |
| `hbar` | `base` (default), `opendata` (supports `ref=`/`reflabel=` reference line), `xcmd` (pixel bars, %), `xcmd-issue` (two-series butterfly), `rank` (two-series solid + hatching) |
| `line` | `shadcn` (default), `evil`, `evil-glow` (glow), `evil-mono`, `opendata` (line-end labels) |
| `area` | `evil` (default, two-series dashed areas), `star` (hand-drawn), `opendata` (dense gradient + editorial title), `pixel`, `polka` |
| `radar` | `base` (default), `evil` (multi-series), `xcmd` |
| `sankey` | `base` (default), `fund`, `pipeline` |
| `gauge` | `base` (default), `gradient`, `reliability` (zoned ring gauge) |
| `scatter` / `combo` / `qr` | `base` (combo also has `evil`) |

## Two ways to pass data

**Flat params** (URL stays readable — recommended):

```
/draw?type=pie&title=Stars by language&unit=stars&labels=TypeScript,Python,Go,Rust&values=4821,2312,980,645
/draw?type=bar&title=Weekly downloads&labels=Mon,Tue&values=1200,1800
```

When labels contain commas, use repeated params: `labels=Q1, 2024&labels=Q2&values=1&values=2`

**Multi-series comparison** (type=bar grouped/stacked, type=line, type=area, ≤6 series):

```
/draw?type=area&labels=Mon,Tue,Wed&series=Desktop:120,180,150&series=Mobile:80,90,85
```

**JSON form** (complex data): `?d=` + URL-encoded JSON:

```json
{"title":"Stars by language","unit":"stars","data":[{"label":"TypeScript","value":4821},{"label":"Python","value":2312}]}
```

Multi-series JSON: `{"labels":["Mon","Tue"],"series":[{"name":"draw","values":[120,180]},{"name":"qc","values":[80,90]}]}`

QR code: `/draw?type=qr&d=https://github.com/tzw&fg=%236366f1`

Gauge: `/draw?type=gauge&title=Build pass rate&value=87&max=100`

Scatter: `/draw?type=scatter&x=10,20,30&y=5,8,7`

Combo: `/draw?type=combo&labels=Mon,Tue&series=dl:120,180&line=growth:5,8` (dual y-axes kick in automatically when bars and lines differ by >5×)

## Short links (data stored in a GitHub repo; content-addressed, never expires)

```
POST /draw?type=pie                body = chart spec JSON
POST /draw?type=bar&t=evil         body = CSV (text/csv, header row)
→ 201 {"hash":"a3f9c2d4e5f60718","url":"https://x-cmd.com/draw/c/a3f9c2d4e5f60718"}

GET /draw/c/<hash>                 → SVG, cached immutable forever
```

- The fingerprint is the first 16 hex chars of SHA-256 over canonicalized data (template+theme+spec, keys recursively sorted); identical data → identical short link (dedup, idempotent). On read the fingerprint is re-verified — tampered archives are rejected
- Multi-series is supported for bar/line/area/radar, plus hbar (only `t=xcmd-issue`/`t=rank`, exactly 2 series); other types reject multi-series bodies with 400. POST is rate-limited to 30/min/IP
- Server-side config: `DATA_REPO` (public repo, `owner/name`, in wrangler.jsonc) and `GITHUB_TOKEN` (secret; fine-grained PAT with **Contents: write** on that repo only — reads go through raw, tokenless). Data files live at `charts/<hash>.json`
- Visibility: the data repo is public and browsable — **do not create short links with sensitive data** (private storage is planned, as a paid feature)
- Compared to quickchart: their short links expire (6 months / days); ours never do

## Version semantics

- No `v`: renders the **latest** version, `Cache-Control: max-age=300` (output changes as the service upgrades)
- `?v=1`: pins a version, `Cache-Control: max-age=86400` (1 day; rendering still evolves with deploys — not frozen forever). `v` accepts 1..current; out of range → 400
- `immutable` is reserved for short links `/c/<hash>` (content-addressed, truly unchanging; `v` is ignored there)

## AI-friendly

Every SVG embeds `<metadata>` (escaped JSON): `{generator, template, version, spec}` — data and params round-trip directly. All text is real `<text>` elements.

## Project structure

A request flows **handler.ts (HTTP routing) → render/query.ts (params → render core) → specs/ (parse) → styles/ (pick skin) → render/ (geometry → SVG)**. The render core is pure functions shared by three runtimes: the Cloudflare Worker (index.ts thin shell), the Node server (node/server.ts), and the npm/JSR library + CLI (lib.ts + node/cli.ts).

```
src/
├── index.ts        Cloudflare Workers entry (thin shell: edge cache, rate-limit binding, waitUntil)
├── handler.ts      shared HTTP layer: routing, POST short-link creation, short-link render, demo page, error wrapper
├── lib.ts          npm/JSR library entry (barrel + high-level synchronous draw())
├── demo.ts         demo page (type tabs, style variants, dual URL forms)
├── theme.ts        skin → CSS variables (:root + dark media query)
├── store.ts        short-link storage (GitHub repo read/write, fingerprint, idempotency)
├── version.ts      version numbers and cache semantics
├── types.ts        cross-runtime structural types (DrawEnv/Platform)
│
├── specs/          [parse]     URL params → strongly-typed spec (validation, clipping, limits)
│   ├── base.ts       ChartSpec + both flat-params and JSON forms
│   ├── multi.ts      multi-series (series=) parsing
│   └── gauge/scatter/combo/csv.ts  per-type parsers
│
├── render/         [render]    spec + skin → SVG string (pure computation, no layout engine)
│   ├── svg.ts        shared helpers: layout geometry, scales, grid, legend, label collision, text measurement
│   ├── query.ts      params→SVG synchronous core (GET dispatch + short-link segment; shared by lib and HTTP)
│   ├── dispatch.ts   stored chart → renderer template dispatch
│   ├── pie/line/line-multi/area/…  one file per chart type (bar ×3, line ×2)
│   └── qr.ts         QR codes
│
├── styles/         [style]     designer-spec SVGs turned into rules
│   ├── types.ts      Rules vocabulary + defaults (orientation/radius/legend/dash/labels…)
│   ├── pie/line/area/…  per-type variants (light+dark palettes + rule deltas + spec canvas size)
│   ├── common.ts     spec palette constants
│   ├── handlee.ts    hand-drawn font, base64 (star style)
│   └── index.ts      resolveSkin: type + ?t= + scheme → skin
│
└── node/           [Node]      server.ts local server · cli.ts draw CLI

test/               vitest (parsing + renderers + shared HTTP layer + library API)
wrangler.jsonc      deploy config (route x-cmd.com/draw*)
deno.json           JSR publishing + Deno tasks
```

Adding a chart type = one file each in `specs/xxx.ts` + `render/xxx.ts` + `styles/xxx.ts`, plus one registration line each in `render/dispatch.ts` and `render/query.ts`.

## One-shot self-deploy

Deploy your own draw to your Cloudflare account (free tier works; you just need a CF account):

```sh
curl -fsSL https://raw.githubusercontent.com/x-cmd/draw/main/scripts/setup.sh | bash
```

The script: clones the repo → browser login for wrangler → deploys → smoke test → prints your `*.workers.dev` URL. All GET rendering (11 chart types, every style) works out of the box.

- **Short links (POST) are not enabled by default** — calls return a "not configured" message. To enable: create a public data repo → set `DATA_REPO=owner/name` in the local wrangler.jsonc vars → `npx wrangler secret put GITHUB_TOKEN` (fine-grained PAT, Contents: write on that repo only) → redeploy
- Already cloned the repo? Run `npm run setup` inside it (skips the clone)
- Path prefix auto-adapts: both the workers.dev root and a `/draw` sub-route work with zero code changes; or pin it explicitly with the `BASE_PATH` var
- Custom domain: dashboard → Workers → Settings → Domains & Routes, add a route (any path prefix)
- On Windows, run under WSL or Git Bash

## Development

```sh
npm install
npm run dev      # wrangler dev, local server
npm test         # vitest
npm run check    # tsc --noEmit × 3 (worker / node / build)
npm run build    # emit dist/ (npm library + CLI)
npm run deploy   # wrangler deploy
```

## License

Code is [Apache-2.0](LICENSE). Bundled fonts keep their own licenses: Inter (OFL, full text in `src/styles/inter-OFL.txt`) and Handlee (OFL).
