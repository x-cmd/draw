# draw — Gráficos SVG con los datos en la URL

> [English](../README.md) | **Español**

[![JSR score](https://img.shields.io/badge/dynamic/json?url=https%3A%2F%2Fapi.jsr.io%2Fscopes%2Fx-cmd%2Fpackages%2Fdraw&query=%24.score&label=JSR%20score&color=yellowgreen)](https://jsr.io/@x-cmd/draw/score)
[![OpenSSF Scorecard](https://api.securityscorecards.dev/projects/github.com/x-cmd/draw/badge)](https://securityscorecards.dev/viewer/?uri=github.com/x-cmd/draw)

Gráficos SVG para la era de la IA: un único endpoint `/draw?type=...`, los datos en la URL y `<metadata>` legible por máquinas en cada salida. El sistema de estilos sigue una especificación de diseño, con varias variantes por tipo de gráfico.

## Vista rápida

Todos los datos viven en la URL — ábrela en el navegador, insértala con `<img>` o pégala en tu README: el SVG se renderiza al instante.

### Sankey — ciclo de vida de los PR (`type=sankey&t=pipeline`)

```text
https://x-cmd.com/draw?type=sankey&t=pipeline&labels=funci%C3%B3n,correcci%C3%B3n,documentaci%C3%B3n,tareas,fusionados,cerrados,rechazados,%3C1a,1%E2%80%932a,%3E2a&links=funci%C3%B3n%3Efusionados:38;funci%C3%B3n%3Ecerrados:12;funci%C3%B3n%3Erechazados:8;correcci%C3%B3n%3Efusionados:33;correcci%C3%B3n%3Ecerrados:6;correcci%C3%B3n%3Erechazados:2;documentaci%C3%B3n%3Efusionados:16;documentaci%C3%B3n%3Ecerrados:4;tareas%3Efusionados:5;tareas%3Ecerrados:6;tareas%3Erechazados:6;fusionados%3E%3C1a:52;fusionados%3E1%E2%80%932a:28;fusionados%3E%3E2a:12;cerrados%3E%3C1a:14;cerrados%3E1%E2%80%932a:9;cerrados%3E%3E2a:5;rechazados%3E%3C1a:9;rechazados%3E1%E2%80%932a:5;rechazados%3E%3E2a:2&title=Ciclo%20de%20vida%20de%20los%20PR&unit=prs
```

![Sankey — ciclo de vida de los PR](https://x-cmd.com/draw?type=sankey&t=pipeline&labels=funci%C3%B3n,correcci%C3%B3n,documentaci%C3%B3n,tareas,fusionados,cerrados,rechazados,%3C1a,1%E2%80%932a,%3E2a&links=funci%C3%B3n%3Efusionados:38;funci%C3%B3n%3Ecerrados:12;funci%C3%B3n%3Erechazados:8;correcci%C3%B3n%3Efusionados:33;correcci%C3%B3n%3Ecerrados:6;correcci%C3%B3n%3Erechazados:2;documentaci%C3%B3n%3Efusionados:16;documentaci%C3%B3n%3Ecerrados:4;tareas%3Efusionados:5;tareas%3Ecerrados:6;tareas%3Erechazados:6;fusionados%3E%3C1a:52;fusionados%3E1%E2%80%932a:28;fusionados%3E%3E2a:12;cerrados%3E%3C1a:14;cerrados%3E1%E2%80%932a:9;cerrados%3E%3E2a:5;rechazados%3E%3C1a:9;rechazados%3E1%E2%80%932a:5;rechazados%3E%3E2a:2&title=Ciclo%20de%20vida%20de%20los%20PR&unit=prs)

### Hbar — rendimiento del runtime (medido) (`type=hbar; draw() ops/s: deno 7238 · node 6553 · bun 4972, Apple Silicon`)

```text
https://x-cmd.com/draw?type=hbar&labels=deno,node,bun&values=7238,6553,4972&title=Runtime%20throughput&unit=ops%2Fs
```

![Hbar — rendimiento del runtime (medido)](https://x-cmd.com/draw?type=hbar&labels=deno,node,bun&values=7238,6553,4972&title=Runtime%20throughput&unit=ops%2Fs)

### Radar — comparación de tres editores (`type=radar&t=evil`)

```text
https://x-cmd.com/draw?type=radar&t=evil&labels=arranque,ecosistema,extensibilidad,memoria,facilidad&series=vscode:60,95,90,55,80&series=neovim:95,65,85,95,35&series=zed:92,50,55,90,60&title=Comparaci%C3%B3n%20de%20editores
```

![Radar — comparación de tres editores](https://x-cmd.com/draw?type=radar&t=evil&labels=arranque,ecosistema,extensibilidad,memoria,facilidad&series=vscode:60,95,90,55,80&series=neovim:95,65,85,95,35&series=zed:92,50,55,90,60&title=Comparaci%C3%B3n%20de%20editores)

### Combinado — descargas vs crecimiento (`type=combo`)

```text
https://x-cmd.com/draw?type=combo&labels=Lun,Mar,Mi%C3%A9,Jue,Vie,S%C3%A1b,Dom&series=Descargas:120,180,150,210,240,200,260&line=Crecimiento:3.1,3.4,3.2,3.8,4.1,3.9,4.5&title=Descargas%20semanales&unit=dl
```

![Combinado — descargas vs crecimiento](https://x-cmd.com/draw?type=combo&labels=Lun,Mar,Mi%C3%A9,Jue,Vie,S%C3%A1b,Dom&series=Descargas:120,180,150,210,240,200,260&line=Crecimiento:3.1,3.4,3.2,3.8,4.1,3.9,4.5&title=Descargas%20semanales&unit=dl)

### Hbar — issues abiertos/cerrados (mariposa) (`type=hbar&t=xcmd-issue`)

```text
https://x-cmd.com/draw?type=hbar&t=xcmd-issue&labels=CLI,n%C3%BAcleo,documentaci%C3%B3n,ci,UI&series=abiertos:12,8,15,4,9&series=cerrados:38,52,20,11,26&title=Issues%20por%20%C3%A1rea
```

![Hbar — issues abiertos/cerrados (mariposa)](https://x-cmd.com/draw?type=hbar&t=xcmd-issue&labels=CLI,n%C3%BAcleo,documentaci%C3%B3n,ci,UI&series=abiertos:12,8,15,4,9&series=cerrados:38,52,20,11,26&title=Issues%20por%20%C3%A1rea)

### Pastel — mayores ciudades (`type=pie&t=market-mono`)

```text
https://x-cmd.com/draw?type=pie&t=market-mono&title=Mayores%20ciudades&unit=mill.&labels=Madrid,Barcelona,Valencia,Sevilla&values=3.3,1.6,0.8,0.7
```

![Pastel — mayores ciudades](https://x-cmd.com/draw?type=pie&t=market-mono&title=Mayores%20ciudades&unit=mill.&labels=Madrid,Barcelona,Valencia,Sevilla&values=3.3,1.6,0.8,0.7)

## Tres formas de usarlo

**Servicio alojado (cero instalación)** — `https://x-cmd.com/draw?type=pie&labels=A,B&values=3,2`

**Biblioteca npm + CLI (offline, síncrona)** (`npm i -g @x-cmd/draw` / `npx`):

```sh
npm install @x-cmd/draw
```
```ts
import { draw } from '@x-cmd/draw';
const { svg } = draw({ type: 'pie', labels: 'A,B', values: '3,2', t: 'evil', scheme: 'dark' });
// también cadena de consulta: draw('?type=bar&labels=Lun,Mar&values=3,5')
// arrays = parámetros repetidos (etiquetas con comas)
draw({ type: 'bar', labels: ['Q1, 2024', 'Q2'], values: [1, 2] })
```
```sh
draw --type pie --labels "A,B,C" --values "3,2,1" --out pie.svg
draw "?type=hbar&labels=a,b,c&values=3,2,1&t=xcmd"   # cadena de consulta desnuda
```

**Autoalojamiento**:

```sh
git clone https://github.com/x-cmd/draw && cd draw && npm install
npm run serve      # servidor Node local :8787 con página demo
npm run dev        # wrangler dev
bash scripts/setup.sh   # despliegue en un clic a tu cuenta de Cloudflare
```

Variables de entorno (Node): `PORT` (8787) · `BASE_PATH` · `DATA_REPO`/`DATA_BRANCH`/`GITHUB_TOKEN` (activa los enlaces cortos POST).

**Deno** — el núcleo de render es puro, sin red — el sandbox sin permisos es la frontera de seguridad:

```ts
import { draw } from "jsr:@x-cmd/draw";
const { svg } = draw({ type: "pie", labels: "A,B", values: "3,2" });
```

## Endpoints

**`GET /draw?type=<pie|bar|hbar|line|area|radar|gauge|scatter|combo|sankey|qr>`** — renderizar un gráfico

| type | | |
|---|---|---|
| `pie` | Donut; `donut=0` = pastel sólido<br><br>**<u>≤100 clases (>9 → Other)</u>** | <a href="https://x-cmd.com/draw?type=pie&labels=TS,Py,Go,Rust&values=4821,2312,980,645&title=Estrellas%20por%20lenguaje"><img src="https://x-cmd.com/draw?type=pie&labels=TS,Py,Go,Rust&values=4821,2312,980,645&title=Estrellas%20por%20lenguaje" width="360" alt="example"></a> |
| `bar` | Columnas agrupadas; `stack=1` apiladas<br><br>**<u>≤30 grupos</u>** | <a href="https://x-cmd.com/draw?type=bar&labels=Lun,Mar,Mi%C3%A9&series=dev:12,18,9&series=ci:8,11,6"><img src="https://x-cmd.com/draw?type=bar&labels=Lun,Mar,Mi%C3%A9&series=dev:12,18,9&series=ci:8,11,6" width="360" alt="example"></a> |
| `hbar` | Barras horizontales (rankings)<br><br>**<u>≤30 barras</u>** | <a href="https://x-cmd.com/draw?type=hbar&labels=CLI,n%C3%BAcleo,documentaci%C3%B3n,UI&values=42,31,18,9&title=Commits%20por%20%C3%A1rea"><img src="https://x-cmd.com/draw?type=hbar&labels=CLI,n%C3%BAcleo,documentaci%C3%B3n,UI&values=42,31,18,9&title=Commits%20por%20%C3%A1rea" width="360" alt="example"></a> |
| `line` | Línea suave + degradado / multilínea<br><br>**<u>≤60 puntos</u>** | <a href="https://x-cmd.com/draw?type=line&labels=Ene,Feb,Mar,Abr,May,Jun&values=12,19,15,25,22,30&title=Estrellas%20por%20lenguaje"><img src="https://x-cmd.com/draw?type=line&labels=Ene,Feb,Mar,Abr,May,Jun&values=12,19,15,25,22,30&title=Estrellas%20por%20lenguaje" width="360" alt="example"></a> |
| `area` | Área / multi-área<br><br>**<u>≤60 puntos</u>** | <a href="https://x-cmd.com/draw?type=area&labels=Q1,Q2,Q3,Q4&values=8,14,23,37&title=Descargas"><img src="https://x-cmd.com/draw?type=area&labels=Q1,Q2,Q3,Q4&values=8,14,23,37&title=Descargas" width="360" alt="example"></a> |
| `radar` | Radar<br><br>**<u>3–12 ejes</u>** | <a href="https://x-cmd.com/draw?type=radar&t=evil&labels=arranque,ecosistema,extensibilidad,memoria,facilidad&series=vscode:60,95,90,55,80&series=neovim:95,65,85,95,35&series=zed:92,50,55,90,60&title=Comparaci%C3%B3n%20de%20editores"><img src="https://x-cmd.com/draw?type=radar&t=evil&labels=arranque,ecosistema,extensibilidad,memoria,facilidad&series=vscode:60,95,90,55,80&series=neovim:95,65,85,95,35&series=zed:92,50,55,90,60&title=Comparaci%C3%B3n%20de%20editores" width="360" alt="example"></a> |
| `gauge` | Medidor (arco 240°, valor central)<br><br>**<u>value+max; anillos ≤8</u>** | <a href="https://x-cmd.com/draw?type=gauge&title=Tasa%20de%20CI&value=87&max=100"><img src="https://x-cmd.com/draw?type=gauge&title=Tasa%20de%20CI&value=87&max=100" width="360" alt="example"></a> |
| `scatter` | Dispersión, dos ejes numéricos, negativos ok<br><br>**<u>x=&y=, ≤200 puntos</u>** | <a href="https://x-cmd.com/draw?type=scatter&x=1,2,3,4,5&y=4,5,3,6,5&title=Latencia"><img src="https://x-cmd.com/draw?type=scatter&x=1,2,3,4,5&y=4,5,3,6,5&title=Latencia" width="360" alt="example"></a> |
| `combo` | Columnas (`series=`) + línea (`line=`); doble eje desde 5× de diferencia<br><br>**<u>≤30 grupos, ≤6 series</u>** | <a href="https://x-cmd.com/draw?type=combo&labels=Lun,Mar,Mi%C3%A9,Jue,Vie,S%C3%A1b,Dom&series=Descargas:120,180,150,210,240,200,260&line=Crecimiento:3.1,3.4,3.2,3.8,4.1,3.9,4.5&title=Descargas%20semanales&unit=dl"><img src="https://x-cmd.com/draw?type=combo&labels=Lun,Mar,Mi%C3%A9,Jue,Vie,S%C3%A1b,Dom&series=Descargas:120,180,150,210,240,200,260&line=Crecimiento:3.1,3.4,3.2,3.8,4.1,3.9,4.5&title=Descargas%20semanales&unit=dl" width="360" alt="example"></a> |
| `sankey` | Diagrama de flujo con anchos<br><br>**<u>labels=+links=A>B:30, ≤24 nodos</u>** | <a href="https://x-cmd.com/draw?type=sankey&t=pipeline&labels=funci%C3%B3n,correcci%C3%B3n,documentaci%C3%B3n,tareas,fusionados,cerrados,rechazados,%3C1a,1%E2%80%932a,%3E2a&links=funci%C3%B3n%3Efusionados:38;funci%C3%B3n%3Ecerrados:12;funci%C3%B3n%3Erechazados:8;correcci%C3%B3n%3Efusionados:33;correcci%C3%B3n%3Ecerrados:6;correcci%C3%B3n%3Erechazados:2;documentaci%C3%B3n%3Efusionados:16;documentaci%C3%B3n%3Ecerrados:4;tareas%3Efusionados:5;tareas%3Ecerrados:6;tareas%3Erechazados:6;fusionados%3E%3C1a:52;fusionados%3E1%E2%80%932a:28;fusionados%3E%3E2a:12;cerrados%3E%3C1a:14;cerrados%3E1%E2%80%932a:9;cerrados%3E%3E2a:5;rechazados%3E%3C1a:9;rechazados%3E1%E2%80%932a:5;rechazados%3E%3E2a:2&title=Ciclo%20de%20vida%20de%20los%20PR&unit=prs"><img src="https://x-cmd.com/draw?type=sankey&t=pipeline&labels=funci%C3%B3n,correcci%C3%B3n,documentaci%C3%B3n,tareas,fusionados,cerrados,rechazados,%3C1a,1%E2%80%932a,%3E2a&links=funci%C3%B3n%3Efusionados:38;funci%C3%B3n%3Ecerrados:12;funci%C3%B3n%3Erechazados:8;correcci%C3%B3n%3Efusionados:33;correcci%C3%B3n%3Ecerrados:6;correcci%C3%B3n%3Erechazados:2;documentaci%C3%B3n%3Efusionados:16;documentaci%C3%B3n%3Ecerrados:4;tareas%3Efusionados:5;tareas%3Ecerrados:6;tareas%3Erechazados:6;fusionados%3E%3C1a:52;fusionados%3E1%E2%80%932a:28;fusionados%3E%3E2a:12;cerrados%3E%3C1a:14;cerrados%3E1%E2%80%932a:9;cerrados%3E%3E2a:5;rechazados%3E%3C1a:9;rechazados%3E1%E2%80%932a:5;rechazados%3E%3E2a:2&title=Ciclo%20de%20vida%20de%20los%20PR&unit=prs" width="360" alt="example"></a> |
| `qr` | Código QR<br><br>**<u>d≤1000 caracteres, fg/bg, title/unit</u>** | <a href="https://x-cmd.com/draw?type=qr&d=https://github.com/x-cmd/draw&title=escan%C3%A9ame"><img src="https://x-cmd.com/draw?type=qr&d=https://github.com/x-cmd/draw&title=escan%C3%A9ame" width="360" alt="example"></a> |

**`GET /draw`** — página demo · **`POST /draw?type=...`** — body JSON/CSV crea un enlace corto permanente · **`GET /draw/c/<hash>`** — render del enlace corto (inmutable)

## Estilos (`?t=`)

| type | |
|---|---|
| `pie` | opendata (pred.) · evil · evil-mono · market-mono · progress · revenue |
| `bar` | evil (pred.) · base · grid |
| `hbar` | base (pred.) · opendata (ref=) · xcmd · xcmd-issue · rank |
| `line` | shadcn (pred.) · evil · evil-glow · evil-mono · opendata |
| `area` | evil (pred.) · star · opendata · pixel · polka |
| `radar` | base (pred.) · evil · xcmd |
| `sankey` | base (pred.) · fund · pipeline |
| `gauge` | base (pred.) · gradient · reliability |
| `scatter/combo/qr` | base (combo también evil) |

## Pasar datos

```text
https://x-cmd.com/draw?type=pie&title=Estrellas%20por%20lenguaje&labels=TypeScript,Python,Go&values=4821,2312,980
```

Etiquetas con comas: repite el parámetro (`labels=Q1, 2024&labels=Q2`). Datos complejos: `?d=` + JSON codificado en URL:

```json
{"title":"...","data":[{"label":"A","value":1}]}
```

## Enlaces cortos

POST genera un enlace corto permanente direccionado por contenido (repositorio GitHub como almacén):

- mismos datos → mismo hash (idempotente, deduplicado)
- límite de 30 peticiones/min/IP
- almacén público de datos — nada sensible

## Versionado

- sin `v`: última versión, caché 300 s
- `v=N`: versión fijada, caché 1 día
- `immutable` solo para `/c/<hash>`

## Adaptado a la IA

Cada SVG incrusta JSON: `{generator, template, version, spec}` — datos y parámetros van y vienen directamente; el texto es `<text>` real.

## Autoalojamiento en un paso

```sh
curl -fsSL https://raw.githubusercontent.com/x-cmd/draw/main/scripts/setup.sh | bash
```

El script clona, inicia wrangler, despliega e imprime tu URL `*.workers.dev`. Los enlaces cortos (POST) se activan con `DATA_REPO` + `GITHUB_TOKEN`.

## Desarrollo

```sh
npm install
npm run dev      # wrangler dev
npm test         # vitest (120)
npm run check    # tsc ×3
npm run build    # dist/
```

## Licencia

Código Apache-2.0; fuentes OFL — [LICENSE](../LICENSE) · Documentación completa: [README (EN)](../README.md)
