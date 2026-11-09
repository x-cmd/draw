---
x-title: Türkçe — draw self-hosting
x-desc: Cloudflare / Node / Deno.
x-sidebar: draw
x-keywords: draw, self-hosting, cloudflare, node
---

# draw — Self-host

```sh
curl -fsSL https://raw.githubusercontent.com/x-cmd/draw/main/scripts/setup.sh | bash
```

Betik klonlar, wrangler’ı oturumlar, dağıtır ve `*.workers.dev` URL’ni yazdırır. Kısa bağlantılar (POST) `DATA_REPO` + `GITHUB_TOKEN` ile açılır.

## Node

```sh
git clone https://github.com/x-cmd/draw && cd draw && npm install
npm run serve
```

Ortam değişkenleri (Node): `PORT` (8787) · `BASE_PATH` · `DATA_REPO`/`DATA_BRANCH`/`GITHUB_TOKEN` (POST kısa bağlantılarını etkinleştirir).

## Deno

```sh
deno task serve
```

işleme çekirdeği saf, ağ yok — izinsiz sandbox güvenlik sınırdır
