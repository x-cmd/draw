---
x-title: Bahasa Indonesia — draw self-hosting
x-desc: Cloudflare / Node / Deno.
x-sidebar: draw
x-keywords: draw, self-hosting, cloudflare, node
---

# draw — Self-hosting

```sh
curl -fsSL https://raw.githubusercontent.com/x-cmd/draw/main/scripts/setup.sh | bash
```

Skrip meng-kloning, login wrangler, deploy, dan mencetak URL `*.workers.dev` milikmu. Tautan pendek (POST) diaktifkan lewat `DATA_REPO` + `GITHUB_TOKEN`.

## Node

```sh
git clone https://github.com/x-cmd/draw && cd draw && npm install
npm run serve
```

Variabel lingkungan (Node): `PORT` (8787) · `BASE_PATH` · `DATA_REPO`/`DATA_BRANCH`/`GITHUB_TOKEN` (mengaktifkan tautan pendek POST).

## Deno

```sh
deno task serve
```

inti render murni, tanpa jaringan — sandbox tanpa izin adalah batas keamanan
