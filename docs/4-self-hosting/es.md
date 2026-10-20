---
x-title: Español — draw self-hosting
x-desc: Cloudflare / Node / Deno.
x-sidebar: draw
x-keywords: draw, self-hosting, cloudflare, node
---

# draw — Autoalojamiento

```sh
curl -fsSL https://raw.githubusercontent.com/x-cmd/draw/main/scripts/setup.sh | bash
```

El script clona, inicia wrangler, despliega e imprime tu URL `*.workers.dev`. Los enlaces cortos (POST) se activan con `DATA_REPO` + `GITHUB_TOKEN`.

## Node

```sh
git clone https://github.com/x-cmd/draw && cd draw && npm install
npm run serve
```

Variables de entorno (Node): `PORT` (8787) · `BASE_PATH` · `DATA_REPO`/`DATA_BRANCH`/`GITHUB_TOKEN` (activa los enlaces cortos POST).

## Deno

```sh
deno task serve
```

el núcleo de render es puro, sin red — el sandbox sin permisos es la frontera de seguridad
