---
x-title: Tiếng Việt — draw self-hosting
x-desc: Cloudflare / Node / Deno.
x-sidebar: draw
x-keywords: draw, self-hosting, cloudflare, node
---

# draw — Tự lưu trữ

```sh
curl -fsSL https://raw.githubusercontent.com/x-cmd/draw/main/scripts/setup.sh | bash
```

Script clone, đăng nhập wrangler, triển khai và in URL `*.workers.dev` của bạn. Liên kết ngắn (POST) bật qua `DATA_REPO` + `GITHUB_TOKEN`.

## Node

```sh
git clone https://github.com/x-cmd/draw && cd draw && npm install
npm run serve
```

Biến môi trường (Node): `PORT` (8787) · `BASE_PATH` · `DATA_REPO`/`DATA_BRANCH`/`GITHUB_TOKEN` (bật liên kết ngắn POST).

## Deno

```sh
deno task serve
```

lõi render thuần, không mạng — sandbox không quyền hạn chính là ranh giới bảo mật
