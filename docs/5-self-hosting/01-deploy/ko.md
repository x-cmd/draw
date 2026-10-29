---
x-title: 한국어 — draw self-hosting
x-desc: Cloudflare / Node / Deno.
x-sidebar: draw
x-keywords: draw, self-hosting, cloudflare, node
---

# draw — 셀프 호스팅

```sh
curl -fsSL https://raw.githubusercontent.com/x-cmd/draw/main/scripts/setup.sh | bash
```

스크립트가 클론 → wrangler 로그인 → 배포 → `*.workers.dev` URL 출력. 짧은 링크(POST)는 `DATA_REPO` + `GITHUB_TOKEN`으로 활성화.

## Node

```sh
git clone https://github.com/x-cmd/draw && cd draw && npm install
npm run serve
```

환경 변수(Node): `PORT`(8787) · `BASE_PATH` · `DATA_REPO`/`DATA_BRANCH`/`GITHUB_TOKEN`(POST 짧은 링크 활성화).

## Deno

```sh
deno task serve
```

렌더 코어는 순수 함수·네트워크 없음 — 무권한 샌드박스가 곧 보안 경계
