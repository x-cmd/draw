---
x-title: Italiano — draw self-hosting
x-desc: Cloudflare / Node / Deno.
x-sidebar: draw
x-keywords: draw, self-hosting, cloudflare, node
---

# draw — Self-hosting

```sh
curl -fsSL https://raw.githubusercontent.com/x-cmd/draw/main/scripts/setup.sh | bash
```

Lo script clona, autentica wrangler, fa il deploy e stampa il tuo URL `*.workers.dev`. I link brevi (POST) si attivano con `DATA_REPO` + `GITHUB_TOKEN`.

## Node

```sh
git clone https://github.com/x-cmd/draw && cd draw && npm install
npm run serve
```

Variabili d’ambiente (Node): `PORT` (8787) · `BASE_PATH` · `DATA_REPO`/`DATA_BRANCH`/`GITHUB_TOKEN` (attiva i link brevi POST).

## Deno

```sh
deno task serve
```

il cuore di rendering è puro, senza rete — la sandbox senza permessi è il confine di sicurezza
