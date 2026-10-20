# draw — Gráficos SVG com os dados na URL

> [English](../README.md) | **Português**

[![JSR score](https://img.shields.io/badge/dynamic/json?url=https%3A%2F%2Fapi.jsr.io%2Fscopes%2Fx-cmd%2Fpackages%2Fdraw&query=%24.score&label=JSR%20score&color=yellowgreen)](https://jsr.io/@x-cmd/draw/score)
[![OpenSSF Scorecard](https://api.securityscorecards.dev/projects/github.com/x-cmd/draw/badge)](https://securityscorecards.dev/viewer/?uri=github.com/x-cmd/draw)

Gráficos SVG para a era da IA: um único endpoint `/draw?type=...`, dados na URL e `<metadata>` legível por máquinas em cada saída. O sistema de estilos segue uma especificação de design, com várias variantes por tipo de gráfico.

## Prévia

Todos os dados vivem na URL — abra no navegador, incorpore com `<img>` ou cole no seu README: o SVG renderiza na hora.

### Sankey — ciclo de vida dos PRs (`type=sankey&t=pipeline`)

```text
https://x-cmd.com/draw?type=sankey&t=pipeline&labels=fun%C3%A7%C3%A3o,fix,documenta%C3%A7%C3%A3o,tarefas,mesclados,fechados,rejeitados,%3C1a,1%E2%80%932a,%3E2a&links=fun%C3%A7%C3%A3o%3Emesclados:38;fun%C3%A7%C3%A3o%3Efechados:12;fun%C3%A7%C3%A3o%3Erejeitados:8;fix%3Emesclados:33;fix%3Efechados:6;fix%3Erejeitados:2;documenta%C3%A7%C3%A3o%3Emesclados:16;documenta%C3%A7%C3%A3o%3Efechados:4;tarefas%3Emesclados:5;tarefas%3Efechados:6;tarefas%3Erejeitados:6;mesclados%3E%3C1a:52;mesclados%3E1%E2%80%932a:28;mesclados%3E%3E2a:12;fechados%3E%3C1a:14;fechados%3E1%E2%80%932a:9;fechados%3E%3E2a:5;rejeitados%3E%3C1a:9;rejeitados%3E1%E2%80%932a:5;rejeitados%3E%3E2a:2&title=Ciclo%20de%20vida%20dos%20PRs&unit=prs
```

![Sankey — ciclo de vida dos PRs](https://x-cmd.com/draw?type=sankey&t=pipeline&labels=fun%C3%A7%C3%A3o,fix,documenta%C3%A7%C3%A3o,tarefas,mesclados,fechados,rejeitados,%3C1a,1%E2%80%932a,%3E2a&links=fun%C3%A7%C3%A3o%3Emesclados:38;fun%C3%A7%C3%A3o%3Efechados:12;fun%C3%A7%C3%A3o%3Erejeitados:8;fix%3Emesclados:33;fix%3Efechados:6;fix%3Erejeitados:2;documenta%C3%A7%C3%A3o%3Emesclados:16;documenta%C3%A7%C3%A3o%3Efechados:4;tarefas%3Emesclados:5;tarefas%3Efechados:6;tarefas%3Erejeitados:6;mesclados%3E%3C1a:52;mesclados%3E1%E2%80%932a:28;mesclados%3E%3E2a:12;fechados%3E%3C1a:14;fechados%3E1%E2%80%932a:9;fechados%3E%3E2a:5;rejeitados%3E%3C1a:9;rejeitados%3E1%E2%80%932a:5;rejeitados%3E%3E2a:2&title=Ciclo%20de%20vida%20dos%20PRs&unit=prs)

### Hbar — throughput do runtime (medido) (`type=hbar; draw() ops/s: deno 7238 · node 6553 · bun 4972, Apple Silicon`)

```text
https://x-cmd.com/draw?type=hbar&labels=deno,node,bun&values=7238,6553,4972&title=Runtime%20throughput&unit=ops%2Fs
```

![Hbar — throughput do runtime (medido)](https://x-cmd.com/draw?type=hbar&labels=deno,node,bun&values=7238,6553,4972&title=Runtime%20throughput&unit=ops%2Fs)

### Radar — comparação de três editores (`type=radar&t=evil`)

```text
https://x-cmd.com/draw?type=radar&t=evil&labels=in%C3%ADcio,ecossistema,extensibilidade,mem%C3%B3ria,facilidade&series=vscode:60,95,90,55,80&series=neovim:95,65,85,95,35&series=zed:92,50,55,90,60&title=Compara%C3%A7%C3%A3o%20de%20editores
```

![Radar — comparação de três editores](https://x-cmd.com/draw?type=radar&t=evil&labels=in%C3%ADcio,ecossistema,extensibilidade,mem%C3%B3ria,facilidade&series=vscode:60,95,90,55,80&series=neovim:95,65,85,95,35&series=zed:92,50,55,90,60&title=Compara%C3%A7%C3%A3o%20de%20editores)

### Combinado — downloads vs crescimento (`type=combo`)

```text
https://x-cmd.com/draw?type=combo&labels=Seg,Ter,Qua,Qui,Sex,S%C3%A1b,Dom&series=Downloads:120,180,150,210,240,200,260&line=Crescimento:3.1,3.4,3.2,3.8,4.1,3.9,4.5&title=Downloads%20semanais&unit=dl
```

![Combinado — downloads vs crescimento](https://x-cmd.com/draw?type=combo&labels=Seg,Ter,Qua,Qui,Sex,S%C3%A1b,Dom&series=Downloads:120,180,150,210,240,200,260&line=Crescimento:3.1,3.4,3.2,3.8,4.1,3.9,4.5&title=Downloads%20semanais&unit=dl)

### Hbar — issues abertas/fechadas (borboleta) (`type=hbar&t=xcmd-issue`)

```text
https://x-cmd.com/draw?type=hbar&t=xcmd-issue&labels=CLI,n%C3%BAcleo,documentaci%C3%B3n,ci,UI&series=abertas:12,8,15,4,9&series=fechadas:38,52,20,11,26&title=Issues%20por%20%C3%A1rea
```

![Hbar — issues abertas/fechadas (borboleta)](https://x-cmd.com/draw?type=hbar&t=xcmd-issue&labels=CLI,n%C3%BAcleo,documentaci%C3%B3n,ci,UI&series=abertas:12,8,15,4,9&series=fechadas:38,52,20,11,26&title=Issues%20por%20%C3%A1rea)

### Pizza — maiores cidades (`type=pie&t=market-mono`)

```text
https://x-cmd.com/draw?type=pie&t=market-mono&title=Maiores%20cidades&unit=mi&labels=S%C3%A3o%20Paulo,Rio%20de%20Janeiro,Bras%C3%ADlia,Salvador&values=12.3,6.7,3,2.9
```

![Pizza — maiores cidades](https://x-cmd.com/draw?type=pie&t=market-mono&title=Maiores%20cidades&unit=mi&labels=S%C3%A3o%20Paulo,Rio%20de%20Janeiro,Bras%C3%ADlia,Salvador&values=12.3,6.7,3,2.9)

## Três formas de usar

**Serviço hospedado (zero instalação)** — `https://x-cmd.com/draw?type=pie&labels=A,B&values=3,2`

**Biblioteca npm + CLI (offline, síncrona)** (`npm i -g @x-cmd/draw` / `npx`):

```sh
npm install @x-cmd/draw
```
```ts
import { draw } from '@x-cmd/draw';
const { svg } = draw({ type: 'pie', labels: 'A,B', values: '3,2', t: 'evil', scheme: 'dark' });
// também string de consulta: draw('?type=bar&labels=Seg,Ter&values=3,5')
// arrays = parâmetros repetidos (rótulos com vírgulas)
draw({ type: 'bar', labels: ['Q1, 2024', 'Q2'], values: [1, 2] })
```
```sh
draw --type pie --labels "A,B,C" --values "3,2,1" --out pie.svg
draw "?type=hbar&labels=a,b,c&values=3,2,1&t=xcmd"   # string de consulta crua
```

**Auto-hospedagem**:

```sh
git clone https://github.com/x-cmd/draw && cd draw && npm install
npm run serve      # servidor Node local :8787 com página demo
npm run dev        # wrangler dev
bash scripts/setup.sh   # deploy em um clique na sua conta Cloudflare
```

Variáveis de ambiente (Node): `PORT` (8787) · `BASE_PATH` · `DATA_REPO`/`DATA_BRANCH`/`GITHUB_TOKEN` (ativa links curtos POST).

**Deno** — o núcleo de render é puro, sem rede — o sandbox sem permissões é a fronteira de segurança:

```ts
import { draw } from "jsr:@x-cmd/draw";
const { svg } = draw({ type: "pie", labels: "A,B", values: "3,2" });
```

## Endpoints

**`GET /draw?type=<pie|bar|hbar|line|area|radar|gauge|scatter|combo|sankey|qr>`** — renderizar um gráfico

| type | | |
|---|---|---|
| `pie` | Donut; `donut=0` = pizza sólida<br><br>**<u>≤100 classes (>9 → Other)</u>** | <a href="https://x-cmd.com/draw?type=pie&labels=TS,Py,Go,Rust&values=4821,2312,980,645&title=Estrelas%20por%20linguagem"><img src="https://x-cmd.com/draw?type=pie&labels=TS,Py,Go,Rust&values=4821,2312,980,645&title=Estrelas%20por%20linguagem" width="360" alt="example"></a> |
| `bar` | Colunas agrupadas; `stack=1` empilhadas<br><br>**<u>≤30 grupos</u>** | <a href="https://x-cmd.com/draw?type=bar&labels=Seg,Ter,Qua&series=dev:12,18,9&series=ci:8,11,6"><img src="https://x-cmd.com/draw?type=bar&labels=Seg,Ter,Qua&series=dev:12,18,9&series=ci:8,11,6" width="360" alt="example"></a> |
| `hbar` | Barras horizontais (rankings)<br><br>**<u>≤30 barras</u>** | <a href="https://x-cmd.com/draw?type=hbar&labels=CLI,n%C3%BAcleo,documentaci%C3%B3n,UI&values=42,31,18,9&title=Commits%20por%20%C3%A1rea"><img src="https://x-cmd.com/draw?type=hbar&labels=CLI,n%C3%BAcleo,documentaci%C3%B3n,UI&values=42,31,18,9&title=Commits%20por%20%C3%A1rea" width="360" alt="example"></a> |
| `line` | Linha suave + gradiente / multilinha<br><br>**<u>≤60 pontos</u>** | <a href="https://x-cmd.com/draw?type=line&labels=Jan,Fev,Mar,Abr,Mai,Jun&values=12,19,15,25,22,30&title=Estrelas%20por%20linguagem"><img src="https://x-cmd.com/draw?type=line&labels=Jan,Fev,Mar,Abr,Mai,Jun&values=12,19,15,25,22,30&title=Estrelas%20por%20linguagem" width="360" alt="example"></a> |
| `area` | Área / multi-área<br><br>**<u>≤60 pontos</u>** | <a href="https://x-cmd.com/draw?type=area&labels=Q1,Q2,Q3,Q4&values=8,14,23,37&title=Downloads"><img src="https://x-cmd.com/draw?type=area&labels=Q1,Q2,Q3,Q4&values=8,14,23,37&title=Downloads" width="360" alt="example"></a> |
| `radar` | Radar<br><br>**<u>3–12 eixos</u>** | <a href="https://x-cmd.com/draw?type=radar&t=evil&labels=in%C3%ADcio,ecossistema,extensibilidade,mem%C3%B3ria,facilidade&series=vscode:60,95,90,55,80&series=neovim:95,65,85,95,35&series=zed:92,50,55,90,60&title=Compara%C3%A7%C3%A3o%20de%20editores"><img src="https://x-cmd.com/draw?type=radar&t=evil&labels=in%C3%ADcio,ecossistema,extensibilidade,mem%C3%B3ria,facilidade&series=vscode:60,95,90,55,80&series=neovim:95,65,85,95,35&series=zed:92,50,55,90,60&title=Compara%C3%A7%C3%A3o%20de%20editores" width="360" alt="example"></a> |
| `gauge` | Medidor (arco 240°, valor central)<br><br>**<u>value+max; anéis ≤8</u>** | <a href="https://x-cmd.com/draw?type=gauge&title=Taxa%20de%20CI&value=87&max=100"><img src="https://x-cmd.com/draw?type=gauge&title=Taxa%20de%20CI&value=87&max=100" width="360" alt="example"></a> |
| `scatter` | Dispersão, dois eixos numéricos, negativos ok<br><br>**<u>x=&y=, ≤200 pontos</u>** | <a href="https://x-cmd.com/draw?type=scatter&x=1,2,3,4,5&y=4,5,3,6,5&title=Lat%C3%AAncia"><img src="https://x-cmd.com/draw?type=scatter&x=1,2,3,4,5&y=4,5,3,6,5&title=Lat%C3%AAncia" width="360" alt="example"></a> |
| `combo` | Colunas (`series=`) + linha (`line=`); eixo duplo acima de 5× de diferença<br><br>**<u>≤30 grupos, ≤6 séries</u>** | <a href="https://x-cmd.com/draw?type=combo&labels=Seg,Ter,Qua,Qui,Sex,S%C3%A1b,Dom&series=Downloads:120,180,150,210,240,200,260&line=Crescimento:3.1,3.4,3.2,3.8,4.1,3.9,4.5&title=Downloads%20semanais&unit=dl"><img src="https://x-cmd.com/draw?type=combo&labels=Seg,Ter,Qua,Qui,Sex,S%C3%A1b,Dom&series=Downloads:120,180,150,210,240,200,260&line=Crescimento:3.1,3.4,3.2,3.8,4.1,3.9,4.5&title=Downloads%20semanais&unit=dl" width="360" alt="example"></a> |
| `sankey` | Diagrama de fluxo com larguras<br><br>**<u>labels=+links=A>B:30, ≤24 nós</u>** | <a href="https://x-cmd.com/draw?type=sankey&t=pipeline&labels=fun%C3%A7%C3%A3o,fix,documenta%C3%A7%C3%A3o,tarefas,mesclados,fechados,rejeitados,%3C1a,1%E2%80%932a,%3E2a&links=fun%C3%A7%C3%A3o%3Emesclados:38;fun%C3%A7%C3%A3o%3Efechados:12;fun%C3%A7%C3%A3o%3Erejeitados:8;fix%3Emesclados:33;fix%3Efechados:6;fix%3Erejeitados:2;documenta%C3%A7%C3%A3o%3Emesclados:16;documenta%C3%A7%C3%A3o%3Efechados:4;tarefas%3Emesclados:5;tarefas%3Efechados:6;tarefas%3Erejeitados:6;mesclados%3E%3C1a:52;mesclados%3E1%E2%80%932a:28;mesclados%3E%3E2a:12;fechados%3E%3C1a:14;fechados%3E1%E2%80%932a:9;fechados%3E%3E2a:5;rejeitados%3E%3C1a:9;rejeitados%3E1%E2%80%932a:5;rejeitados%3E%3E2a:2&title=Ciclo%20de%20vida%20dos%20PRs&unit=prs"><img src="https://x-cmd.com/draw?type=sankey&t=pipeline&labels=fun%C3%A7%C3%A3o,fix,documenta%C3%A7%C3%A3o,tarefas,mesclados,fechados,rejeitados,%3C1a,1%E2%80%932a,%3E2a&links=fun%C3%A7%C3%A3o%3Emesclados:38;fun%C3%A7%C3%A3o%3Efechados:12;fun%C3%A7%C3%A3o%3Erejeitados:8;fix%3Emesclados:33;fix%3Efechados:6;fix%3Erejeitados:2;documenta%C3%A7%C3%A3o%3Emesclados:16;documenta%C3%A7%C3%A3o%3Efechados:4;tarefas%3Emesclados:5;tarefas%3Efechados:6;tarefas%3Erejeitados:6;mesclados%3E%3C1a:52;mesclados%3E1%E2%80%932a:28;mesclados%3E%3E2a:12;fechados%3E%3C1a:14;fechados%3E1%E2%80%932a:9;fechados%3E%3E2a:5;rejeitados%3E%3C1a:9;rejeitados%3E1%E2%80%932a:5;rejeitados%3E%3E2a:2&title=Ciclo%20de%20vida%20dos%20PRs&unit=prs" width="360" alt="example"></a> |
| `qr` | QR Code<br><br>**<u>d≤1000 caracteres, fg/bg, title/unit</u>** | <a href="https://x-cmd.com/draw?type=qr&d=https://github.com/x-cmd/draw&title=escaneie"><img src="https://x-cmd.com/draw?type=qr&d=https://github.com/x-cmd/draw&title=escaneie" width="360" alt="example"></a> |

**`GET /draw`** — página demo · **`POST /draw?type=...`** — body JSON/CSV cria link curto permanente · **`GET /draw/c/<hash>`** — render do link curto (imutável)

## Estilos (`?t=`)

| type | |
|---|---|
| `pie` | opendata (padrão) · evil · evil-mono · market-mono · progress · revenue |
| `bar` | evil (padrão) · base · grid |
| `hbar` | base (padrão) · opendata (ref=) · xcmd · xcmd-issue · rank |
| `line` | shadcn (padrão) · evil · evil-glow · evil-mono · opendata |
| `area` | evil (padrão) · star · opendata · pixel · polka |
| `radar` | base (padrão) · evil · xcmd |
| `sankey` | base (padrão) · fund · pipeline |
| `gauge` | base (padrão) · gradient · reliability |
| `scatter/combo/qr` | base (combo também evil) |

## Passando dados

```text
https://x-cmd.com/draw?type=pie&title=Estrelas%20por%20linguagem&labels=TypeScript,Python,Go&values=4821,2312,980
```

Rótulos com vírgulas: repita o parâmetro (`labels=Q1, 2024&labels=Q2`). Dados complexos: `?d=` + JSON codificado em URL:

```json
{"title":"...","data":[{"label":"A","value":1}]}
```

## Links curtos

POST gera um link curto permanente endereçado por conteúdo (repositório GitHub como armazenamento):

- mesmos dados → mesmo hash (idempotente, deduplicado)
- limite de 30 requisições/min/IP
- armazenamento público — nada sensível

## Versionamento

- sem `v`: versão mais recente, cache 300 s
- `v=N`: versão fixada, cache 1 dia
- `immutable` só para `/c/<hash>`

## Amigável à IA

Cada SVG embute JSON: `{generator, template, version, spec}` — dados e parâmetros fazem round-trip direto; texto é `<text>` de verdade.

## Auto-hospedagem em um passo

```sh
curl -fsSL https://raw.githubusercontent.com/x-cmd/draw/main/scripts/setup.sh | bash
```

O script clona, autentica o wrangler, faz deploy e imprime sua URL `*.workers.dev`. Links curtos (POST) ativam-se com `DATA_REPO` + `GITHUB_TOKEN`.

## Desenvolvimento

```sh
npm install
npm run dev      # wrangler dev
npm test         # vitest (120)
npm run check    # tsc ×3
npm run build    # dist/
```

## Licença

Código Apache-2.0; fontes OFL — [LICENSE](../LICENSE) · Documentação completa: [README (EN)](../README.md)
