# draw — SVG-діаграми з даними в URL

> [English](../README.md) | **Українська**

[![JSR score](https://img.shields.io/badge/dynamic/json?url=https%3A%2F%2Fapi.jsr.io%2Fscopes%2Fx-cmd%2Fpackages%2Fdraw&query=%24.score&label=JSR%20score&color=yellowgreen)](https://jsr.io/@x-cmd/draw/score)
[![OpenSSF Scorecard](https://api.securityscorecards.dev/projects/github.com/x-cmd/draw/badge)](https://securityscorecards.dev/viewer/?uri=github.com/x-cmd/draw)

SVG-діаграми для епохи ШІ: один ендпоінт `/draw?type=...`, дані в URL і машинно-читабельний `<metadata>` у кожному результаті. Система стилів відповідає дизайн-специфікації, з кількома варіантами для кожного типу.

## Швидкий перегляд

Усі дані — в URL: відкрийте в браузері, вбудуйте через `<img>` чи вставте в README — SVG зрендериться одразу.

### Санкі — життєвий цикл PR (`type=sankey&t=pipeline`)

```text
https://x-cmd.com/draw?type=sankey&t=pipeline&labels=feat,fix,docs,chore,merged,closed,rejected,0-1y,1-2y,2y%2B&links=feat%3Emerged:38;feat%3Eclosed:12;feat%3Erejected:8;fix%3Emerged:33;fix%3Eclosed:6;fix%3Erejected:2;docs%3Emerged:16;docs%3Eclosed:4;chore%3Emerged:5;chore%3Eclosed:6;chore%3Erejected:6;merged%3E0-1y:52;merged%3E1-2y:28;merged%3E2y%2B:12;closed%3E0-1y:14;closed%3E1-2y:9;closed%3E2y%2B:5;rejected%3E0-1y:9;rejected%3E1-2y:5;rejected%3E2y%2B:2&title=Pull%20requests%20lifecycle&unit=prs
```

![Санкі — життєвий цикл PR](https://x-cmd.com/draw?type=sankey&t=pipeline&labels=feat,fix,docs,chore,merged,closed,rejected,0-1y,1-2y,2y%2B&links=feat%3Emerged:38;feat%3Eclosed:12;feat%3Erejected:8;fix%3Emerged:33;fix%3Eclosed:6;fix%3Erejected:2;docs%3Emerged:16;docs%3Eclosed:4;chore%3Emerged:5;chore%3Eclosed:6;chore%3Erejected:6;merged%3E0-1y:52;merged%3E1-2y:28;merged%3E2y%2B:12;closed%3E0-1y:14;closed%3E1-2y:9;closed%3E2y%2B:5;rejected%3E0-1y:9;rejected%3E1-2y:5;rejected%3E2y%2B:2&title=Pull%20requests%20lifecycle&unit=prs)

### Стовпчики — пропускна здатність рантайму (вимір) (`type=hbar; draw() ops/s: deno 7238 · node 6553 · bun 4972, Apple Silicon`)

```text
https://x-cmd.com/draw?type=hbar&labels=deno,node,bun&values=7238,6553,4972&title=Runtime%20throughput&unit=ops%2Fs
```

![Стовпчики — пропускна здатність рантайму (вимір)](https://x-cmd.com/draw?type=hbar&labels=deno,node,bun&values=7238,6553,4972&title=Runtime%20throughput&unit=ops%2Fs)

### Радар — порівняння трьох редакторів (`type=radar&t=evil`)

```text
https://x-cmd.com/draw?type=radar&t=evil&labels=startup,ecosystem,extensibility,memory,ease&series=vscode:60,95,90,55,80&series=neovim:95,65,85,95,35&series=zed:92,50,55,90,60&title=Editor%20comparison
```

![Радар — порівняння трьох редакторів](https://x-cmd.com/draw?type=radar&t=evil&labels=startup,ecosystem,extensibility,memory,ease&series=vscode:60,95,90,55,80&series=neovim:95,65,85,95,35&series=zed:92,50,55,90,60&title=Editor%20comparison)

### Комбінована — завантаження і зростання (`type=combo`)

```text
https://x-cmd.com/draw?type=combo&labels=%D0%9F%D0%BD,%D0%92%D1%82,%D0%A1%D1%80,%D0%A7%D1%82,%D0%9F%D1%82,%D0%A1%D0%B1,%D0%9D%D0%B4&series=%D0%97%D0%B0%D0%B2%D0%B0%D0%BD%D1%82%D0%B0%D0%B6%D0%B5%D0%BD%D0%BD%D1%8F:120,180,150,210,240,200,260&line=%D0%97%D1%80%D0%BE%D1%81%D1%82%D0%B0%D0%BD%D0%BD%D1%8F:3.1,3.4,3.2,3.8,4.1,3.9,4.5&title=%D0%A2%D0%B8%D0%B6%D0%BD%D0%B5%D0%B2%D1%96%20%D0%B7%D0%B0%D0%B2%D0%B0%D0%BD%D1%82%D0%B0%D0%B6%D0%B5%D0%BD%D0%BD%D1%8F&unit=dl
```

![Комбінована — завантаження і зростання](https://x-cmd.com/draw?type=combo&labels=%D0%9F%D0%BD,%D0%92%D1%82,%D0%A1%D1%80,%D0%A7%D1%82,%D0%9F%D1%82,%D0%A1%D0%B1,%D0%9D%D0%B4&series=%D0%97%D0%B0%D0%B2%D0%B0%D0%BD%D1%82%D0%B0%D0%B6%D0%B5%D0%BD%D0%BD%D1%8F:120,180,150,210,240,200,260&line=%D0%97%D1%80%D0%BE%D1%81%D1%82%D0%B0%D0%BD%D0%BD%D1%8F:3.1,3.4,3.2,3.8,4.1,3.9,4.5&title=%D0%A2%D0%B8%D0%B6%D0%BD%D0%B5%D0%B2%D1%96%20%D0%B7%D0%B0%D0%B2%D0%B0%D0%BD%D1%82%D0%B0%D0%B6%D0%B5%D0%BD%D0%BD%D1%8F&unit=dl)

### Стовпчики — відкриті/закриті issue (метелик) (`type=hbar&t=xcmd-issue`)

```text
https://x-cmd.com/draw?type=hbar&t=xcmd-issue&labels=cli,core,docs,ci,ui&series=%D0%B2%D1%96%D0%B4%D0%BA%D1%80%D0%B8%D1%82%D1%96:12,8,15,4,9&series=%D0%B7%D0%B0%D0%BA%D1%80%D0%B8%D1%82%D1%96:38,52,20,11,26&title=Issue%20%D0%B7%D0%B0%20%D0%BE%D0%B1%D0%BB%D0%B0%D1%81%D1%82%D1%8F%D0%BC%D0%B8
```

![Стовпчики — відкриті/закриті issue (метелик)](https://x-cmd.com/draw?type=hbar&t=xcmd-issue&labels=cli,core,docs,ci,ui&series=%D0%B2%D1%96%D0%B4%D0%BA%D1%80%D0%B8%D1%82%D1%96:12,8,15,4,9&series=%D0%B7%D0%B0%D0%BA%D1%80%D0%B8%D1%82%D1%96:38,52,20,11,26&title=Issue%20%D0%B7%D0%B0%20%D0%BE%D0%B1%D0%BB%D0%B0%D1%81%D1%82%D1%8F%D0%BC%D0%B8)

### Кругова — найбільші міста (`type=pie&t=market-mono`)

```text
https://x-cmd.com/draw?type=pie&t=market-mono&title=%D0%9D%D0%B0%D0%B9%D0%B1%D1%96%D0%BB%D1%8C%D1%88%D1%96%20%D0%BC%D1%96%D1%81%D1%82%D0%B0&unit=%D0%BC%D0%BB%D0%BD&labels=%D0%9A%D0%B8%D1%97%D0%B2,%D0%A5%D0%B0%D1%80%D0%BA%D1%96%D0%B2,%D0%9E%D0%B4%D0%B5%D1%81%D0%B0,%D0%94%D0%BD%D1%96%D0%BF%D1%80%D0%BE&values=3,1.4,1,1
```

![Кругова — найбільші міста](https://x-cmd.com/draw?type=pie&t=market-mono&title=%D0%9D%D0%B0%D0%B9%D0%B1%D1%96%D0%BB%D1%8C%D1%88%D1%96%20%D0%BC%D1%96%D1%81%D1%82%D0%B0&unit=%D0%BC%D0%BB%D0%BD&labels=%D0%9A%D0%B8%D1%97%D0%B2,%D0%A5%D0%B0%D1%80%D0%BA%D1%96%D0%B2,%D0%9E%D0%B4%D0%B5%D1%81%D0%B0,%D0%94%D0%BD%D1%96%D0%BF%D1%80%D0%BE&values=3,1.4,1,1)

## Три способи використання

**Хостований сервіс (нуль установки)** — `https://x-cmd.com/draw?type=pie&labels=A,B&values=3,2`

**Бібліотека npm + CLI (офлайн, синхронно)** (`npm i -g @x-cmd/draw` / `npx`):

```sh
npm install @x-cmd/draw
```
```ts
import { draw } from '@x-cmd/draw';
const { svg } = draw({ type: 'pie', labels: 'A,B', values: '3,2', t: 'evil', scheme: 'dark' });
// приймає і query-рядок: draw('?type=bar&labels=Пн,Вт&values=3,5')
// масиви = повторені параметри (мітки з комами)
draw({ type: 'bar', labels: ['Q1, 2024', 'Q2'], values: [1, 2] })
```
```sh
draw --type pie --labels "A,B,C" --values "3,2,1" --out pie.svg
draw "?type=hbar&labels=a,b,c&values=3,2,1&t=xcmd"   # голий query-рядок
```

**Самохостинг**:

```sh
git clone https://github.com/x-cmd/draw && cd draw && npm install
npm run serve      # локальний Node-сервер :8787 з демо-сторінкою
npm run dev        # wrangler dev
bash scripts/setup.sh   # деплой в один клік на ваш Cloudflare-акаунт
```

Змінні середовища (Node): `PORT` (8787) · `BASE_PATH` · `DATA_REPO`/`DATA_BRANCH`/`GITHUB_TOKEN` (вмикає POST-короткі посилання).

**Deno** — ядро рендеру чисте, без мережі — пісочниця без дозволів і є межею безпеки:

```ts
import { draw } from "jsr:@x-cmd/draw";
const { svg } = draw({ type: "pie", labels: "A,B", values: "3,2" });
```

## Ендпоінти

**`GET /draw?type=<pie|bar|hbar|line|area|radar|gauge|scatter|combo|sankey|qr>`** — відрендерити діаграму

| type | | |
|---|---|---|
| `pie` | Кільце; `donut=0` = суцільний<br><br>**<u>≤100 класів (>9 → Other)</u>** | <a href="https://x-cmd.com/draw?type=pie&labels=TS,Py,Go,Rust&values=4821,2312,980,645&title=%D0%97%D1%96%D1%80%D0%BA%D0%B8%20%D0%B7%D0%B0%20%D0%BC%D0%BE%D0%B2%D0%B0%D0%BC%D0%B8"><img src="https://x-cmd.com/draw?type=pie&labels=TS,Py,Go,Rust&values=4821,2312,980,645&title=%D0%97%D1%96%D1%80%D0%BA%D0%B8%20%D0%B7%D0%B0%20%D0%BC%D0%BE%D0%B2%D0%B0%D0%BC%D0%B8" width="360" alt="example"></a> |
| `bar` | Груповані стовпчики; `stack=1`<br><br>**<u>≤30 груп</u>** | <a href="https://x-cmd.com/draw?type=bar&labels=%D0%9F%D0%BD,%D0%92%D1%82,%D0%A1%D1%80&series=dev:12,18,9&series=ci:8,11,6"><img src="https://x-cmd.com/draw?type=bar&labels=%D0%9F%D0%BD,%D0%92%D1%82,%D0%A1%D1%80&series=dev:12,18,9&series=ci:8,11,6" width="360" alt="example"></a> |
| `hbar` | Горизонтальні стовпчики (рейтинги)<br><br>**<u>≤30 смуг</u>** | <a href="https://x-cmd.com/draw?type=hbar&labels=cli,core,docs,ui&values=42,31,18,9&title=%D0%9A%D0%BE%D0%BC%D1%96%D1%82%D0%B8%20%D0%B7%D0%B0%20%D0%BE%D0%B1%D0%BB%D0%B0%D1%81%D1%82%D1%8F%D0%BC%D0%B8"><img src="https://x-cmd.com/draw?type=hbar&labels=cli,core,docs,ui&values=42,31,18,9&title=%D0%9A%D0%BE%D0%BC%D1%96%D1%82%D0%B8%20%D0%B7%D0%B0%20%D0%BE%D0%B1%D0%BB%D0%B0%D1%81%D1%82%D1%8F%D0%BC%D0%B8" width="360" alt="example"></a> |
| `line` | Гладка лінія + градієнт / мультилінія<br><br>**<u>≤60 точок</u>** | <a href="https://x-cmd.com/draw?type=line&labels=%D0%A1%D1%96%D1%87,%D0%9B%D1%8E%D1%82,%D0%91%D0%B5%D1%80,%D0%9A%D0%B2%D1%96,%D0%A2%D1%80%D0%B0,%D0%A7%D0%B5%D1%80&values=12,19,15,25,22,30&title=%D0%97%D1%96%D1%80%D0%BA%D0%B8%20%D0%B7%D0%B0%20%D0%BC%D0%BE%D0%B2%D0%B0%D0%BC%D0%B8"><img src="https://x-cmd.com/draw?type=line&labels=%D0%A1%D1%96%D1%87,%D0%9B%D1%8E%D1%82,%D0%91%D0%B5%D1%80,%D0%9A%D0%B2%D1%96,%D0%A2%D1%80%D0%B0,%D0%A7%D0%B5%D1%80&values=12,19,15,25,22,30&title=%D0%97%D1%96%D1%80%D0%BA%D0%B8%20%D0%B7%D0%B0%20%D0%BC%D0%BE%D0%B2%D0%B0%D0%BC%D0%B8" width="360" alt="example"></a> |
| `area` | Площина / мультиплощина<br><br>**<u>≤60 точок</u>** | <a href="https://x-cmd.com/draw?type=area&labels=Q1,Q2,Q3,Q4&values=8,14,23,37&title=%D0%97%D0%B0%D0%B2%D0%B0%D0%BD%D1%82%D0%B0%D0%B6%D0%B5%D0%BD%D0%BD%D1%8F"><img src="https://x-cmd.com/draw?type=area&labels=Q1,Q2,Q3,Q4&values=8,14,23,37&title=%D0%97%D0%B0%D0%B2%D0%B0%D0%BD%D1%82%D0%B0%D0%B6%D0%B5%D0%BD%D0%BD%D1%8F" width="360" alt="example"></a> |
| `radar` | Радар<br><br>**<u>3–12 осей</u>** | <a href="https://x-cmd.com/draw?type=radar&t=evil&labels=startup,ecosystem,extensibility,memory,ease&series=vscode:60,95,90,55,80&series=neovim:95,65,85,95,35&series=zed:92,50,55,90,60&title=Editor%20comparison"><img src="https://x-cmd.com/draw?type=radar&t=evil&labels=startup,ecosystem,extensibility,memory,ease&series=vscode:60,95,90,55,80&series=neovim:95,65,85,95,35&series=zed:92,50,55,90,60&title=Editor%20comparison" width="360" alt="example"></a> |
| `gauge` | Індикатор (дуга 240°, значення в центрі)<br><br>**<u>value+max; кілець ≤8</u>** | <a href="https://x-cmd.com/draw?type=gauge&title=%D0%A7%D0%B0%D1%81%D1%82%D0%BA%D0%B0%20CI&value=87&max=100"><img src="https://x-cmd.com/draw?type=gauge&title=%D0%A7%D0%B0%D1%81%D1%82%D0%BA%D0%B0%20CI&value=87&max=100" width="360" alt="example"></a> |
| `scatter` | Розсіювання, дві числові осі, відємні ок<br><br>**<u>x=&y=, ≤200 точок</u>** | <a href="https://x-cmd.com/draw?type=scatter&x=1,2,3,4,5&y=4,5,3,6,5&title=%D0%97%D0%B0%D1%82%D1%80%D0%B8%D0%BC%D0%BA%D0%B0"><img src="https://x-cmd.com/draw?type=scatter&x=1,2,3,4,5&y=4,5,3,6,5&title=%D0%97%D0%B0%D1%82%D1%80%D0%B8%D0%BC%D0%BA%D0%B0" width="360" alt="example"></a> |
| `combo` | Стовпчики (`series=`) + лінія (`line=`); дві осі від 5× різниці<br><br>**<u>≤30 груп, ≤6 серій</u>** | <a href="https://x-cmd.com/draw?type=combo&labels=%D0%9F%D0%BD,%D0%92%D1%82,%D0%A1%D1%80,%D0%A7%D1%82,%D0%9F%D1%82,%D0%A1%D0%B1,%D0%9D%D0%B4&series=%D0%97%D0%B0%D0%B2%D0%B0%D0%BD%D1%82%D0%B0%D0%B6%D0%B5%D0%BD%D0%BD%D1%8F:120,180,150,210,240,200,260&line=%D0%97%D1%80%D0%BE%D1%81%D1%82%D0%B0%D0%BD%D0%BD%D1%8F:3.1,3.4,3.2,3.8,4.1,3.9,4.5&title=%D0%A2%D0%B8%D0%B6%D0%BD%D0%B5%D0%B2%D1%96%20%D0%B7%D0%B0%D0%B2%D0%B0%D0%BD%D1%82%D0%B0%D0%B6%D0%B5%D0%BD%D0%BD%D1%8F&unit=dl"><img src="https://x-cmd.com/draw?type=combo&labels=%D0%9F%D0%BD,%D0%92%D1%82,%D0%A1%D1%80,%D0%A7%D1%82,%D0%9F%D1%82,%D0%A1%D0%B1,%D0%9D%D0%B4&series=%D0%97%D0%B0%D0%B2%D0%B0%D0%BD%D1%82%D0%B0%D0%B6%D0%B5%D0%BD%D0%BD%D1%8F:120,180,150,210,240,200,260&line=%D0%97%D1%80%D0%BE%D1%81%D1%82%D0%B0%D0%BD%D0%BD%D1%8F:3.1,3.4,3.2,3.8,4.1,3.9,4.5&title=%D0%A2%D0%B8%D0%B6%D0%BD%D0%B5%D0%B2%D1%96%20%D0%B7%D0%B0%D0%B2%D0%B0%D0%BD%D1%82%D0%B0%D0%B6%D0%B5%D0%BD%D0%BD%D1%8F&unit=dl" width="360" alt="example"></a> |
| `sankey` | Діаграма потоків з ширинами<br><br>**<u>labels=+links=A>B:30, ≤24 вузли</u>** | <a href="https://x-cmd.com/draw?type=sankey&t=pipeline&labels=feat,fix,docs,chore,merged,closed,rejected,0-1y,1-2y,2y%2B&links=feat%3Emerged:38;feat%3Eclosed:12;feat%3Erejected:8;fix%3Emerged:33;fix%3Eclosed:6;fix%3Erejected:2;docs%3Emerged:16;docs%3Eclosed:4;chore%3Emerged:5;chore%3Eclosed:6;chore%3Erejected:6;merged%3E0-1y:52;merged%3E1-2y:28;merged%3E2y%2B:12;closed%3E0-1y:14;closed%3E1-2y:9;closed%3E2y%2B:5;rejected%3E0-1y:9;rejected%3E1-2y:5;rejected%3E2y%2B:2&title=Pull%20requests%20lifecycle&unit=prs"><img src="https://x-cmd.com/draw?type=sankey&t=pipeline&labels=feat,fix,docs,chore,merged,closed,rejected,0-1y,1-2y,2y%2B&links=feat%3Emerged:38;feat%3Eclosed:12;feat%3Erejected:8;fix%3Emerged:33;fix%3Eclosed:6;fix%3Erejected:2;docs%3Emerged:16;docs%3Eclosed:4;chore%3Emerged:5;chore%3Eclosed:6;chore%3Erejected:6;merged%3E0-1y:52;merged%3E1-2y:28;merged%3E2y%2B:12;closed%3E0-1y:14;closed%3E1-2y:9;closed%3E2y%2B:5;rejected%3E0-1y:9;rejected%3E1-2y:5;rejected%3E2y%2B:2&title=Pull%20requests%20lifecycle&unit=prs" width="360" alt="example"></a> |
| `qr` | QR-код<br><br>**<u>d≤1000 символів, fg/bg, title/unit</u>** | <a href="https://x-cmd.com/draw?type=qr&d=https://github.com/x-cmd/draw&title=%D1%81%D0%BA%D0%B0%D0%BD%D1%83%D0%B9"><img src="https://x-cmd.com/draw?type=qr&d=https://github.com/x-cmd/draw&title=%D1%81%D0%BA%D0%B0%D0%BD%D1%83%D0%B9" width="360" alt="example"></a> |

**`GET /draw`** — демо-сторінка · **`POST /draw?type=...`** — JSON/CSV body створює постійне коротке посилання · **`GET /draw/c/<hash>`** — рендер короткого посилання (immutable)

## Стилі (`?t=`)

| type | |
|---|---|
| `pie` | opendata (типово) · evil · evil-mono · market-mono · progress · revenue |
| `bar` | evil (типово) · base · grid |
| `hbar` | base (типово) · opendata (ref=) · xcmd · xcmd-issue · rank |
| `line` | shadcn (типово) · evil · evil-glow · evil-mono · opendata |
| `area` | evil (типово) · star · opendata · pixel · polka |
| `radar` | base (типово) · evil · xcmd |
| `sankey` | base (типово) · fund · pipeline |
| `gauge` | base (типово) · gradient · reliability |
| `scatter/combo/qr` | base (combo ще й evil) |

## Передача даних

```text
https://x-cmd.com/draw?type=pie&title=%D0%97%D1%96%D1%80%D0%BA%D0%B8%20%D0%B7%D0%B0%20%D0%BC%D0%BE%D0%B2%D0%B0%D0%BC%D0%B8&labels=TypeScript,Python,Go&values=4821,2312,980
```

Мітки з комами: повторюйте параметр (`labels=Q1, 2024&labels=Q2`). Складні дані: `?d=` + URL-кодований JSON:

```json
{"title":"...","data":[{"label":"A","value":1}]}
```

## Короткі посилання

POST створює постійне коротке посилання, адресоване за вмістом (GitHub-репозиторій як сховище):

- ті самі дані → той самий хеш (ідемпотентно, дедуплікація)
- ліміт 30 запитів/хв/IP
- публічне сховище — нічого конфіденційного

## Версіювання

- без `v`: найновіша версія, кеш 300 с
- `v=N`: зафіксована версія, кеш 1 день
- `immutable` лише для `/c/<hash>`

## Дружньо до ШІ

Кожен SVG вбудовує JSON: `{generator, template, version, spec}` — дані й параметри ходять туди-назад напряму; текст — справжній `<text>`.

## Самохостинг за один крок

```sh
curl -fsSL https://raw.githubusercontent.com/x-cmd/draw/main/scripts/setup.sh | bash
```

Скрипт клонує, логінить wrangler, розгортає і друкує вашу URL `*.workers.dev`. Короткі посилання (POST) вмикаються через `DATA_REPO` + `GITHUB_TOKEN`.

## Розробка

```sh
npm install
npm run dev      # wrangler dev
npm test         # vitest (120)
npm run check    # tsc ×3
npm run build    # dist/
```

## Ліцензія

Код Apache-2.0; шрифти OFL — [LICENSE](../LICENSE) · Повна документація: [README (EN)](../README.md)
