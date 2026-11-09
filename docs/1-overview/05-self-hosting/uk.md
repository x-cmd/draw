---
x-title: Українська — draw self-hosting
x-desc: Cloudflare / Node / Deno.
x-sidebar: draw
x-keywords: draw, self-hosting, cloudflare, node
---

# draw — Самохостинг

```sh
curl -fsSL https://raw.githubusercontent.com/x-cmd/draw/main/scripts/setup.sh | bash
```

Скрипт клонує, логінить wrangler, розгортає і друкує вашу URL `*.workers.dev`. Короткі посилання (POST) вмикаються через `DATA_REPO` + `GITHUB_TOKEN`.

## Node

```sh
git clone https://github.com/x-cmd/draw && cd draw && npm install
npm run serve
```

Змінні середовища (Node): `PORT` (8787) · `BASE_PATH` · `DATA_REPO`/`DATA_BRANCH`/`GITHUB_TOKEN` (вмикає POST-короткі посилання).

## Deno

```sh
deno task serve
```

ядро рендеру чисте, без мережі — пісочниця без дозволів і є межею безпеки
