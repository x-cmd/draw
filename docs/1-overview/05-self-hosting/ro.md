---
x-title: Română — draw self-hosting
x-desc: Cloudflare / Node / Deno.
x-sidebar: draw
x-keywords: draw, self-hosting, cloudflare, node
---

# draw — Self-hosting

```sh
curl -fsSL https://raw.githubusercontent.com/x-cmd/draw/main/scripts/setup.sh | bash
```

Scriptul clonează, autentifică wrangler, face deploy și printează URL-ul `*.workers.dev`. Linkurile scurte (POST) se activează cu `DATA_REPO` + `GITHUB_TOKEN`.

## Node

```sh
git clone https://github.com/x-cmd/draw && cd draw && npm install
npm run serve
```

Variabile de mediu (Node): `PORT` (8787) · `BASE_PATH` · `DATA_REPO`/`DATA_BRANCH`/`GITHUB_TOKEN` (activează linkuri scurte POST).

## Deno

```sh
deno task serve
```

nucleul de randare e pur, fără rețea — sandbox-ul fără permisiuni este granița de securitate
