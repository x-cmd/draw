---
x-title: Polski — draw self-hosting
x-desc: Cloudflare / Node / Deno.
x-sidebar: draw
x-keywords: draw, self-hosting, cloudflare, node
---

# draw — Self-hosting

```sh
curl -fsSL https://raw.githubusercontent.com/x-cmd/draw/main/scripts/setup.sh | bash
```

Skrypt klonuje, loguje wrangler, wdraża i wypisuje URL `*.workers.dev`. Krótkie linki (POST) włącza `DATA_REPO` + `GITHUB_TOKEN`.

## Node

```sh
git clone https://github.com/x-cmd/draw && cd draw && npm install
npm run serve
```

Zmienne środowiskowe (Node): `PORT` (8787) · `BASE_PATH` · `DATA_REPO`/`DATA_BRANCH`/`GITHUB_TOKEN` (włącza krótkie linki POST).

## Deno

```sh
deno task serve
```

rdzeń renderu jest czysty, bez sieci — sandbox bez uprawnień to granica bezpieczeństwa
