---
x-title: ไทย — draw self-hosting
x-desc: Cloudflare / Node / Deno.
x-sidebar: draw
x-keywords: draw, self-hosting, cloudflare, node
---

# draw — Self-host

```sh
curl -fsSL https://raw.githubusercontent.com/x-cmd/draw/main/scripts/setup.sh | bash
```

สคริปต์ clone, ล็อกอิน wrangler, ดีพลอย และพิมพ์ URL `*.workers.dev` ของคุณ ลิงก์สั้น (POST) เปิดด้วย `DATA_REPO` + `GITHUB_TOKEN`

## Node

```sh
git clone https://github.com/x-cmd/draw && cd draw && npm install
npm run serve
```

ตัวแปรสภาพแวดล้อม (Node): `PORT` (8787) · `BASE_PATH` · `DATA_REPO`/`DATA_BRANCH`/`GITHUB_TOKEN` (เปิดลิงก์สั้น POST)

## Deno

```sh
deno task serve
```

แกนเรนเดอร์เป็นฟังก์ชันล้วน ไม่มีเครือข่าย — แซนด์บ็อกซ์ไร้สิทธิ์คือขอบเขตความปลอดภัย
