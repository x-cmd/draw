---
x-title: 日本語 — draw self-hosting
x-desc: Cloudflare / Node / Deno.
x-sidebar: draw
x-keywords: draw, self-hosting, cloudflare, node
---

# draw — セルフホスト

```sh
curl -fsSL https://raw.githubusercontent.com/x-cmd/draw/main/scripts/setup.sh | bash
```

スクリプトはクローン→wrangler ログイン→デプロイ→`*.workers.dev` の URL を表示します。 ショートリンク(POST)は `DATA_REPO` + `GITHUB_TOKEN` で有効化。

## Node

```sh
git clone https://github.com/x-cmd/draw && cd draw && npm install
npm run serve
```

環境変数(Node): `PORT`(8787)· `BASE_PATH` · `DATA_REPO`/`DATA_BRANCH`/`GITHUB_TOKEN`(POST ショートリンクを有効化)。

## Deno

```sh
deno task serve
```

描画コアは純関数・ネットワーク不要 — ゼロ権限サンドボックスがそのままセキュリティ境界
