---
x-title: Deutsch — draw self-hosting
x-desc: Cloudflare / Node / Deno.
x-sidebar: draw
x-keywords: draw, self-hosting, cloudflare, node
---

# draw — Selbst-Hosting

```sh
curl -fsSL https://raw.githubusercontent.com/x-cmd/draw/main/scripts/setup.sh | bash
```

Das Skript klont, meldet wrangler an, deployt und druckt deine `*.workers.dev`-URL. Kurzlinks (POST) aktivierst du per `DATA_REPO` + `GITHUB_TOKEN`.

## Node

```sh
git clone https://github.com/x-cmd/draw && cd draw && npm install
npm run serve
```

Umgebungsvariablen (Node): `PORT` (8787) · `BASE_PATH` · `DATA_REPO`/`DATA_BRANCH`/`GITHUB_TOKEN` (aktiviert POST-Kurzlinks).

## Deno

```sh
deno task serve
```

reine Renderfunktion, kein Netzwerk — die Sandbox ohne Berechtigungen ist die Sicherheitsgrenze
