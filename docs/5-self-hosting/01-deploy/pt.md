---
x-title: Português — draw self-hosting
x-desc: Cloudflare / Node / Deno.
x-sidebar: draw
x-keywords: draw, self-hosting, cloudflare, node
---

# draw — Auto-hospedagem

```sh
curl -fsSL https://raw.githubusercontent.com/x-cmd/draw/main/scripts/setup.sh | bash
```

O script clona, autentica o wrangler, faz deploy e imprime sua URL `*.workers.dev`. Links curtos (POST) ativam-se com `DATA_REPO` + `GITHUB_TOKEN`.

## Node

```sh
git clone https://github.com/x-cmd/draw && cd draw && npm install
npm run serve
```

Variáveis de ambiente (Node): `PORT` (8787) · `BASE_PATH` · `DATA_REPO`/`DATA_BRANCH`/`GITHUB_TOKEN` (ativa links curtos POST).

## Deno

```sh
deno task serve
```

o núcleo de render é puro, sem rede — o sandbox sem permissões é a fronteira de segurança
