---
x-title: Русский — draw self-hosting
x-desc: Cloudflare / Node / Deno.
x-sidebar: draw
x-keywords: draw, self-hosting, cloudflare, node
---

# draw — Самохостинг

```sh
curl -fsSL https://raw.githubusercontent.com/x-cmd/draw/main/scripts/setup.sh | bash
```

Скрипт клонирует, логинит wrangler, деплоит и печатает ваш URL `*.workers.dev`. Короткие ссылки (POST) включаются через `DATA_REPO` + `GITHUB_TOKEN`.

## Node

```sh
git clone https://github.com/x-cmd/draw && cd draw && npm install
npm run serve
```

Переменные окружения (Node): `PORT` (8787) · `BASE_PATH` · `DATA_REPO`/`DATA_BRANCH`/`GITHUB_TOKEN` (включает POST-ссылки).

## Deno

```sh
deno task serve
```

ядро рендера чистое, без сети — сандбокс без прав и есть граница безопасности
