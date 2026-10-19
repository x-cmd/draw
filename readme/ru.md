# draw — SVG-графики с данными в URL

> [English](../README.md) | **Русский**

[![JSR score](https://img.shields.io/badge/dynamic/json?url=https%3A%2F%2Fapi.jsr.io%2Fscopes%2Fx-cmd%2Fpackages%2Fdraw&query=%24.score&label=JSR%20score&color=yellowgreen)](https://jsr.io/@x-cmd/draw/score)
[![OpenSSF Scorecard](https://api.securityscorecards.dev/projects/github.com/x-cmd/draw/badge)](https://securityscorecards.dev/viewer/?uri=github.com/x-cmd/draw)

SVG-графики для эпохи ИИ: один эндпоинт `/draw?type=...`, данные в URL и машиночитаемый `<metadata>` в каждом ответе. Система стилей следует дизайн-спецификации, по несколько вариантов на тип графика.

## Превью

Все данные живут в URL — откройте в браузере, вставьте как `<img>` или добавьте в README: SVG отрисуется мгновенно.

### Санки — жизненный цикл PR (`type=sankey&t=pipeline`)

```text
https://x-cmd.com/draw?type=sankey&t=pipeline&labels=feat,fix,docs,chore,merged,closed,rejected,0-1y,1-2y,2y%2B&links=feat%3Emerged:38;feat%3Eclosed:12;feat%3Erejected:8;fix%3Emerged:33;fix%3Eclosed:6;fix%3Erejected:2;docs%3Emerged:16;docs%3Eclosed:4;chore%3Emerged:5;chore%3Eclosed:6;chore%3Erejected:6;merged%3E0-1y:52;merged%3E1-2y:28;merged%3E2y%2B:12;closed%3E0-1y:14;closed%3E1-2y:9;closed%3E2y%2B:5;rejected%3E0-1y:9;rejected%3E1-2y:5;rejected%3E2y%2B:2&title=Pull%20requests%20lifecycle&unit=prs
```

![Санки — жизненный цикл PR](https://x-cmd.com/draw?type=sankey&t=pipeline&labels=feat,fix,docs,chore,merged,closed,rejected,0-1y,1-2y,2y%2B&links=feat%3Emerged:38;feat%3Eclosed:12;feat%3Erejected:8;fix%3Emerged:33;fix%3Eclosed:6;fix%3Erejected:2;docs%3Emerged:16;docs%3Eclosed:4;chore%3Emerged:5;chore%3Eclosed:6;chore%3Erejected:6;merged%3E0-1y:52;merged%3E1-2y:28;merged%3E2y%2B:12;closed%3E0-1y:14;closed%3E1-2y:9;closed%3E2y%2B:5;rejected%3E0-1y:9;rejected%3E1-2y:5;rejected%3E2y%2B:2&title=Pull%20requests%20lifecycle&unit=prs)

### Полосы — производительность рантайма (замер) (`type=hbar; draw() ops/s: deno 7238 · node 6553 · bun 4972, Apple Silicon`)

```text
https://x-cmd.com/draw?type=hbar&labels=deno,node,bun&values=7238,6553,4972&title=Runtime%20throughput&unit=ops%2Fs
```

![Полосы — производительность рантайма (замер)](https://x-cmd.com/draw?type=hbar&labels=deno,node,bun&values=7238,6553,4972&title=Runtime%20throughput&unit=ops%2Fs)

### Радар — сравнение трёх редакторов (`type=radar&t=evil`)

```text
https://x-cmd.com/draw?type=radar&t=evil&labels=startup,ecosystem,extensibility,memory,ease&series=vscode:60,95,90,55,80&series=neovim:95,65,85,95,35&series=zed:92,50,55,90,60&title=Editor%20comparison
```

![Радар — сравнение трёх редакторов](https://x-cmd.com/draw?type=radar&t=evil&labels=startup,ecosystem,extensibility,memory,ease&series=vscode:60,95,90,55,80&series=neovim:95,65,85,95,35&series=zed:92,50,55,90,60&title=Editor%20comparison)

### Комбинированный — загрузки и рост (`type=combo`)

```text
https://x-cmd.com/draw?type=combo&labels=%D0%9F%D0%BD,%D0%92%D1%82,%D0%A1%D1%80,%D0%A7%D1%82,%D0%9F%D1%82,%D0%A1%D0%B1,%D0%92%D1%81&series=%D0%97%D0%B0%D0%B3%D1%80%D1%83%D0%B7%D0%BA%D0%B8:120,180,150,210,240,200,260&line=%D0%A0%D0%BE%D1%81%D1%82:3.1,3.4,3.2,3.8,4.1,3.9,4.5&title=%D0%9D%D0%B5%D0%B4%D0%B5%D0%BB%D1%8C%D0%BD%D1%8B%D0%B5%20%D0%B7%D0%B0%D0%B3%D1%80%D1%83%D0%B7%D0%BA%D0%B8&unit=dl
```

![Комбинированный — загрузки и рост](https://x-cmd.com/draw?type=combo&labels=%D0%9F%D0%BD,%D0%92%D1%82,%D0%A1%D1%80,%D0%A7%D1%82,%D0%9F%D1%82,%D0%A1%D0%B1,%D0%92%D1%81&series=%D0%97%D0%B0%D0%B3%D1%80%D1%83%D0%B7%D0%BA%D0%B8:120,180,150,210,240,200,260&line=%D0%A0%D0%BE%D1%81%D1%82:3.1,3.4,3.2,3.8,4.1,3.9,4.5&title=%D0%9D%D0%B5%D0%B4%D0%B5%D0%BB%D1%8C%D0%BD%D1%8B%D0%B5%20%D0%B7%D0%B0%D0%B3%D1%80%D1%83%D0%B7%D0%BA%D0%B8&unit=dl)

### Полосы — открытые/закрытые issues (бабочка) (`type=hbar&t=xcmd-issue`)

```text
https://x-cmd.com/draw?type=hbar&t=xcmd-issue&labels=cli,core,docs,ci,ui&series=%D0%BE%D1%82%D0%BA%D1%80%D1%8B%D1%82%D1%8B%D0%B5:12,8,15,4,9&series=%D0%B7%D0%B0%D0%BA%D1%80%D1%8B%D1%82%D1%8B%D0%B5:38,52,20,11,26&title=Issues%20%D0%BF%D0%BE%20%D0%BE%D0%B1%D0%BB%D0%B0%D1%81%D1%82%D1%8F%D0%BC
```

![Полосы — открытые/закрытые issues (бабочка)](https://x-cmd.com/draw?type=hbar&t=xcmd-issue&labels=cli,core,docs,ci,ui&series=%D0%BE%D1%82%D0%BA%D1%80%D1%8B%D1%82%D1%8B%D0%B5:12,8,15,4,9&series=%D0%B7%D0%B0%D0%BA%D1%80%D1%8B%D1%82%D1%8B%D0%B5:38,52,20,11,26&title=Issues%20%D0%BF%D0%BE%20%D0%BE%D0%B1%D0%BB%D0%B0%D1%81%D1%82%D1%8F%D0%BC)

### Круговая — крупнейшие города (`type=pie&t=market-mono`)

```text
https://x-cmd.com/draw?type=pie&t=market-mono&title=%D0%9A%D1%80%D1%83%D0%BF%D0%BD%D0%B5%D0%B9%D1%88%D0%B8%D0%B5%20%D0%B3%D0%BE%D1%80%D0%BE%D0%B4%D0%B0&unit=%D0%BC%D0%BB%D0%BD&labels=%D0%9C%D0%BE%D1%81%D0%BA%D0%B2%D0%B0,%D0%A1%D0%B0%D0%BD%D0%BA%D1%82-%D0%9F%D0%B5%D1%82%D0%B5%D1%80%D0%B1%D1%83%D1%80%D0%B3,%D0%9D%D0%BE%D0%B2%D0%BE%D1%81%D0%B8%D0%B1%D0%B8%D1%80%D1%81%D0%BA,%D0%95%D0%BA%D0%B0%D1%82%D0%B5%D1%80%D0%B8%D0%BD%D0%B1%D1%83%D1%80%D0%B3&values=12.6,5.4,1.6,1.5
```

![Круговая — крупнейшие города](https://x-cmd.com/draw?type=pie&t=market-mono&title=%D0%9A%D1%80%D1%83%D0%BF%D0%BD%D0%B5%D0%B9%D1%88%D0%B8%D0%B5%20%D0%B3%D0%BE%D1%80%D0%BE%D0%B4%D0%B0&unit=%D0%BC%D0%BB%D0%BD&labels=%D0%9C%D0%BE%D1%81%D0%BA%D0%B2%D0%B0,%D0%A1%D0%B0%D0%BD%D0%BA%D1%82-%D0%9F%D0%B5%D1%82%D0%B5%D1%80%D0%B1%D1%83%D1%80%D0%B3,%D0%9D%D0%BE%D0%B2%D0%BE%D1%81%D0%B8%D0%B1%D0%B8%D1%80%D1%81%D0%BA,%D0%95%D0%BA%D0%B0%D1%82%D0%B5%D1%80%D0%B8%D0%BD%D0%B1%D1%83%D1%80%D0%B3&values=12.6,5.4,1.6,1.5)

## Три способа использования

**Хостед-сервис (без установки)** — `https://x-cmd.com/draw?type=pie&labels=A,B&values=3,2`

**Библиотека npm + CLI (офлайн, синхронно)** (`npm i -g @x-cmd/draw` / `npx`):

```sh
npm install @x-cmd/draw
```
```ts
import { draw } from '@x-cmd/draw';
const { svg } = draw({ type: 'pie', labels: 'A,B', values: '3,2', t: 'evil', scheme: 'dark' });
// принимает и строку запроса: draw('?type=bar&labels=Пн,Вт&values=3,5')
// массивы = повторяющиеся параметры (метки с запятыми)
draw({ type: 'bar', labels: ['Q1, 2024', 'Q2'], values: [1, 2] })
```
```sh
draw --type pie --labels "A,B,C" --values "3,2,1" --out pie.svg
draw "?type=hbar&labels=a,b,c&values=3,2,1&t=xcmd"   # чистая строка запроса
```

**Самохостинг**:

```sh
git clone https://github.com/x-cmd/draw && cd draw && npm install
npm run serve      # локальный Node-сервер :8787 с демо-страницей
npm run dev        # wrangler dev
bash scripts/setup.sh   # деплой в один клик на ваш аккаунт Cloudflare
```

Переменные окружения (Node): `PORT` (8787) · `BASE_PATH` · `DATA_REPO`/`DATA_BRANCH`/`GITHUB_TOKEN` (включает POST-ссылки).

**Deno** — ядро рендера чистое, без сети — сандбокс без прав и есть граница безопасности:

```ts
import { draw } from "jsr:@x-cmd/draw";
const { svg } = draw({ type: "pie", labels: "A,B", values: "3,2" });
```

## Эндпоинты

**`GET /draw?type=<pie|bar|hbar|line|area|radar|gauge|scatter|combo|sankey|qr>`** — отрисовать график

| type | | |
|---|---|---|
| `pie` | Кольцо; `donut=0` = сплошной круг<br><br>**<u>≤100 классов (>9 → Other)</u>** | <a href="https://x-cmd.com/draw?type=pie&labels=TS,Py,Go,Rust&values=4821,2312,980,645&title=%D0%97%D0%B2%D1%91%D0%B7%D0%B4%D1%8B%20%D0%BF%D0%BE%20%D1%8F%D0%B7%D1%8B%D0%BA%D0%B0%D0%BC"><img src="https://x-cmd.com/draw?type=pie&labels=TS,Py,Go,Rust&values=4821,2312,980,645&title=%D0%97%D0%B2%D1%91%D0%B7%D0%B4%D1%8B%20%D0%BF%D0%BE%20%D1%8F%D0%B7%D1%8B%D0%BA%D0%B0%D0%BC" width="360" alt="example"></a> |
| `bar` | Групповые столбцы; `stack=1` в стопку<br><br>**<u>≤30 групп</u>** | <a href="https://x-cmd.com/draw?type=bar&labels=%D0%9F%D0%BD,%D0%92%D1%82,%D0%A1%D1%80&series=dev:12,18,9&series=ci:8,11,6"><img src="https://x-cmd.com/draw?type=bar&labels=%D0%9F%D0%BD,%D0%92%D1%82,%D0%A1%D1%80&series=dev:12,18,9&series=ci:8,11,6" width="360" alt="example"></a> |
| `hbar` | Горизонтальные полосы (рейтинги)<br><br>**<u>≤30 полос</u>** | <a href="https://x-cmd.com/draw?type=hbar&labels=cli,core,docs,ui&values=42,31,18,9&title=%D0%9A%D0%BE%D0%BC%D0%BC%D0%B8%D1%82%D1%8B%20%D0%BF%D0%BE%20%D0%BE%D0%B1%D0%BB%D0%B0%D1%81%D1%82%D1%8F%D0%BC"><img src="https://x-cmd.com/draw?type=hbar&labels=cli,core,docs,ui&values=42,31,18,9&title=%D0%9A%D0%BE%D0%BC%D0%BC%D0%B8%D1%82%D1%8B%20%D0%BF%D0%BE%20%D0%BE%D0%B1%D0%BB%D0%B0%D1%81%D1%82%D1%8F%D0%BC" width="360" alt="example"></a> |
| `line` | Гладкая линия + градиент / мультилинии<br><br>**<u>≤60 точек</u>** | <a href="https://x-cmd.com/draw?type=line&labels=%D0%AF%D0%BD%D0%B2,%D0%A4%D0%B5%D0%B2,%D0%9C%D0%B0%D1%80,%D0%90%D0%BF%D1%80,%D0%9C%D0%B0%D0%B9,%D0%98%D1%8E%D0%BD&values=12,19,15,25,22,30&title=%D0%97%D0%B2%D1%91%D0%B7%D0%B4%D1%8B%20%D0%BF%D0%BE%20%D1%8F%D0%B7%D1%8B%D0%BA%D0%B0%D0%BC"><img src="https://x-cmd.com/draw?type=line&labels=%D0%AF%D0%BD%D0%B2,%D0%A4%D0%B5%D0%B2,%D0%9C%D0%B0%D1%80,%D0%90%D0%BF%D1%80,%D0%9C%D0%B0%D0%B9,%D0%98%D1%8E%D0%BD&values=12,19,15,25,22,30&title=%D0%97%D0%B2%D1%91%D0%B7%D0%B4%D1%8B%20%D0%BF%D0%BE%20%D1%8F%D0%B7%D1%8B%D0%BA%D0%B0%D0%BC" width="360" alt="example"></a> |
| `area` | Область / мультиобласти<br><br>**<u>≤60 точек</u>** | <a href="https://x-cmd.com/draw?type=area&labels=Q1,Q2,Q3,Q4&values=8,14,23,37&title=%D0%97%D0%B0%D0%B3%D1%80%D1%83%D0%B7%D0%BA%D0%B8"><img src="https://x-cmd.com/draw?type=area&labels=Q1,Q2,Q3,Q4&values=8,14,23,37&title=%D0%97%D0%B0%D0%B3%D1%80%D1%83%D0%B7%D0%BA%D0%B8" width="360" alt="example"></a> |
| `radar` | Радар<br><br>**<u>3–12 осей</u>** | <a href="https://x-cmd.com/draw?type=radar&t=evil&labels=startup,ecosystem,extensibility,memory,ease&series=vscode:60,95,90,55,80&series=neovim:95,65,85,95,35&series=zed:92,50,55,90,60&title=Editor%20comparison"><img src="https://x-cmd.com/draw?type=radar&t=evil&labels=startup,ecosystem,extensibility,memory,ease&series=vscode:60,95,90,55,80&series=neovim:95,65,85,95,35&series=zed:92,50,55,90,60&title=Editor%20comparison" width="360" alt="example"></a> |
| `gauge` | Индикатор (дуга 240°, значение в центре)<br><br>**<u>value+max; колец ≤8</u>** | <a href="https://x-cmd.com/draw?type=gauge&title=%D0%9F%D1%80%D0%BE%D1%85%D0%BE%D0%B6%D0%B4%D0%B5%D0%BD%D0%B8%D0%B5%20CI&value=87&max=100"><img src="https://x-cmd.com/draw?type=gauge&title=%D0%9F%D1%80%D0%BE%D1%85%D0%BE%D0%B6%D0%B4%D0%B5%D0%BD%D0%B8%D0%B5%20CI&value=87&max=100" width="360" alt="example"></a> |
| `scatter` | Разброс, две числовые оси, отрицательные ок<br><br>**<u>x=&y=, ≤200 точек</u>** | <a href="https://x-cmd.com/draw?type=scatter&x=1,2,3,4,5&y=4,5,3,6,5&title=%D0%97%D0%B0%D0%B4%D0%B5%D1%80%D0%B6%D0%BA%D0%B0"><img src="https://x-cmd.com/draw?type=scatter&x=1,2,3,4,5&y=4,5,3,6,5&title=%D0%97%D0%B0%D0%B4%D0%B5%D1%80%D0%B6%D0%BA%D0%B0" width="360" alt="example"></a> |
| `combo` | Столбцы (`series=`) + линия (`line=`); две оси при разнице 5×<br><br>**<u>≤30 групп, ≤6 серий</u>** | <a href="https://x-cmd.com/draw?type=combo&labels=%D0%9F%D0%BD,%D0%92%D1%82,%D0%A1%D1%80,%D0%A7%D1%82,%D0%9F%D1%82,%D0%A1%D0%B1,%D0%92%D1%81&series=%D0%97%D0%B0%D0%B3%D1%80%D1%83%D0%B7%D0%BA%D0%B8:120,180,150,210,240,200,260&line=%D0%A0%D0%BE%D1%81%D1%82:3.1,3.4,3.2,3.8,4.1,3.9,4.5&title=%D0%9D%D0%B5%D0%B4%D0%B5%D0%BB%D1%8C%D0%BD%D1%8B%D0%B5%20%D0%B7%D0%B0%D0%B3%D1%80%D1%83%D0%B7%D0%BA%D0%B8&unit=dl"><img src="https://x-cmd.com/draw?type=combo&labels=%D0%9F%D0%BD,%D0%92%D1%82,%D0%A1%D1%80,%D0%A7%D1%82,%D0%9F%D1%82,%D0%A1%D0%B1,%D0%92%D1%81&series=%D0%97%D0%B0%D0%B3%D1%80%D1%83%D0%B7%D0%BA%D0%B8:120,180,150,210,240,200,260&line=%D0%A0%D0%BE%D1%81%D1%82:3.1,3.4,3.2,3.8,4.1,3.9,4.5&title=%D0%9D%D0%B5%D0%B4%D0%B5%D0%BB%D1%8C%D0%BD%D1%8B%D0%B5%20%D0%B7%D0%B0%D0%B3%D1%80%D1%83%D0%B7%D0%BA%D0%B8&unit=dl" width="360" alt="example"></a> |
| `sankey` | Диаграмма потоков с ширинами<br><br>**<u>labels=+links=A>B:30, ≤24 узлов</u>** | <a href="https://x-cmd.com/draw?type=sankey&t=pipeline&labels=feat,fix,docs,chore,merged,closed,rejected,0-1y,1-2y,2y%2B&links=feat%3Emerged:38;feat%3Eclosed:12;feat%3Erejected:8;fix%3Emerged:33;fix%3Eclosed:6;fix%3Erejected:2;docs%3Emerged:16;docs%3Eclosed:4;chore%3Emerged:5;chore%3Eclosed:6;chore%3Erejected:6;merged%3E0-1y:52;merged%3E1-2y:28;merged%3E2y%2B:12;closed%3E0-1y:14;closed%3E1-2y:9;closed%3E2y%2B:5;rejected%3E0-1y:9;rejected%3E1-2y:5;rejected%3E2y%2B:2&title=Pull%20requests%20lifecycle&unit=prs"><img src="https://x-cmd.com/draw?type=sankey&t=pipeline&labels=feat,fix,docs,chore,merged,closed,rejected,0-1y,1-2y,2y%2B&links=feat%3Emerged:38;feat%3Eclosed:12;feat%3Erejected:8;fix%3Emerged:33;fix%3Eclosed:6;fix%3Erejected:2;docs%3Emerged:16;docs%3Eclosed:4;chore%3Emerged:5;chore%3Eclosed:6;chore%3Erejected:6;merged%3E0-1y:52;merged%3E1-2y:28;merged%3E2y%2B:12;closed%3E0-1y:14;closed%3E1-2y:9;closed%3E2y%2B:5;rejected%3E0-1y:9;rejected%3E1-2y:5;rejected%3E2y%2B:2&title=Pull%20requests%20lifecycle&unit=prs" width="360" alt="example"></a> |
| `qr` | QR-код<br><br>**<u>d≤1000 символов, fg/bg, title/unit</u>** | <a href="https://x-cmd.com/draw?type=qr&d=https://github.com/x-cmd/draw&title=%D0%BE%D1%82%D1%81%D0%BA%D0%B0%D0%BD%D0%B8%D1%80%D1%83%D0%B9"><img src="https://x-cmd.com/draw?type=qr&d=https://github.com/x-cmd/draw&title=%D0%BE%D1%82%D1%81%D0%BA%D0%B0%D0%BD%D0%B8%D1%80%D1%83%D0%B9" width="360" alt="example"></a> |

**`GET /draw`** — демо-страница · **`POST /draw?type=...`** — JSON/CSV-тело создаёт постоянную короткую ссылку · **`GET /draw/c/<hash>`** — рендер короткой ссылки (immutable)

## Стили (`?t=`)

| type | |
|---|---|
| `pie` | opendata (по умолч.) · evil · evil-mono · market-mono · progress · revenue |
| `bar` | evil (по умолч.) · base · grid |
| `hbar` | base (по умолч.) · opendata (ref=) · xcmd · xcmd-issue · rank |
| `line` | shadcn (по умолч.) · evil · evil-glow · evil-mono · opendata |
| `area` | evil (по умолч.) · star · opendata · pixel · polka |
| `radar` | base (по умолч.) · evil · xcmd |
| `sankey` | base (по умолч.) · fund · pipeline |
| `gauge` | base (по умолч.) · gradient · reliability |
| `scatter/combo/qr` | base (combo также evil) |

## Передача данных

```text
https://x-cmd.com/draw?type=pie&title=%D0%97%D0%B2%D1%91%D0%B7%D0%B4%D1%8B%20%D0%BF%D0%BE%20%D1%8F%D0%B7%D1%8B%D0%BA%D0%B0%D0%BC&labels=TypeScript,Python,Go&values=4821,2312,980
```

Метки с запятыми: повторяйте параметр (`labels=Q1, 2024&labels=Q2`). Сложные данные: `?d=` + URL-кодированный JSON:

```json
{"title":"...","data":[{"label":"A","value":1}]}
```

## Короткие ссылки

POST создаёт постоянную короткую ссылку, адресуемую по содержимому (GitHub-репозиторий как хранилище):

- те же данные → тот же хэш (идемпотентно, дедупликация)
- лимит 30 запросов/мин/IP
- публичное хранилище — ничего чувствительного

## Версионирование

- без `v`: свежая версия, кеш 300 с
- `v=N`: закреплённая версия, кеш 1 день
- `immutable` только для `/c/<hash>`

## Дружелюбно к ИИ

Каждый SVG встраивает JSON: `{generator, template, version, spec}` — данные и параметры ходят туда-обратно напрямую; текст — настоящий `<text>`.

## Самохостинг в один шаг

```sh
curl -fsSL https://raw.githubusercontent.com/x-cmd/draw/main/scripts/setup.sh | bash
```

Скрипт клонирует, логинит wrangler, деплоит и печатает ваш URL `*.workers.dev`. Короткие ссылки (POST) включаются через `DATA_REPO` + `GITHUB_TOKEN`.

## Разработка

```sh
npm install
npm run dev      # wrangler dev
npm test         # vitest (120)
npm run check    # tsc ×3
npm run build    # dist/
```

## Лицензия

Код Apache-2.0; шрифты OFL — [LICENSE](../LICENSE) · Полная документация: [README (EN)](../README.md)
