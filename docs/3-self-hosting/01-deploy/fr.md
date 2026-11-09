---
x-title: Français — draw self-hosting
x-desc: Cloudflare / Node / Deno.
x-sidebar: draw
x-keywords: draw, self-hosting, cloudflare, node
---

# draw — Auto-hébergement

```sh
curl -fsSL https://raw.githubusercontent.com/x-cmd/draw/main/scripts/setup.sh | bash
```

Le script clone, connecte wrangler, déploie et affiche votre URL `*.workers.dev`. Les liens courts (POST) s’activent via `DATA_REPO` + `GITHUB_TOKEN`.

## Node

```sh
git clone https://github.com/x-cmd/draw && cd draw && npm install
npm run serve
```

Variables d’environnement (Node) : `PORT` (8787) · `BASE_PATH` · `DATA_REPO`/`DATA_BRANCH`/`GITHUB_TOKEN` (active les liens courts POST).

## Deno

```sh
deno task serve
```

le cœur de rendu est pur, sans réseau — le sandbox sans permission est la frontière de sécurité
