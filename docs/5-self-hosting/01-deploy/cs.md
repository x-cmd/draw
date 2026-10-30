---
x-title: Čeština — draw self-hosting
x-desc: Cloudflare / Node / Deno.
x-sidebar: draw
x-keywords: draw, self-hosting, cloudflare, node
---

# draw — Self-hosting

```sh
curl -fsSL https://raw.githubusercontent.com/x-cmd/draw/main/scripts/setup.sh | bash
```

Skript naklonuje, přihlásí wrangler, nasadí a vypíše vaši `*.workers.dev` URL. Krátké odkazy (POST) aktivujete přes `DATA_REPO` + `GITHUB_TOKEN`.

## Node

```sh
git clone https://github.com/x-cmd/draw && cd draw && npm install
npm run serve
```

Proměnné prostředí (Node): `PORT` (8787) · `BASE_PATH` · `DATA_REPO`/`DATA_BRANCH`/`GITHUB_TOKEN` (aktivuje POST krátké odkazy).

## Deno

```sh
deno task serve
```

renderovací jádro je čisté, bez sítě — sandbox bez oprávnění je bezpečnostní hranice
