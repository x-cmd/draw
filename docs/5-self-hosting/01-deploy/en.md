---
x-title: draw self-hosting — one-shot Cloudflare deploy / local Node server
x-desc: 'Run your own x-cmd/draw: one-shot Cloudflare Workers deploy (setup.sh), wrangler dev, or a dependency-free local Node server; short-link storage (DATA_REPO/GITHUB_TOKEN), BASE_PATH and custom domains included.'
x-sidebar: draw self-hosting
x-keywords: draw, self-hosted, cloudflare, workers, wrangler, node, setup
x-json-ld:
  '@context': https://schema.org
  '@graph':
    - '@type': TechArticle
      headline: 'draw self-hosting'
      inLanguage: 'en'
      about: 'x-cmd/draw self-hosting'
---

# draw self-hosting

One render core, three deployment shapes — pick any.

## 1. Cloudflare Workers (recommended; free tier works)

```sh
curl -fsSL https://raw.githubusercontent.com/x-cmd/draw/main/scripts/setup.sh | bash
```

The script: clones the repo → browser login for wrangler → deploys → smoke test → prints your `*.workers.dev` URL. All GET rendering (11 types, every style) works out of the box. Already cloned? Run `npm run setup` inside the repo (skips the clone).

- Path prefix auto-adapts: workers.dev root and a `/draw` sub-route both work with zero code changes; or pin it with the `BASE_PATH` var
- Custom domain: dashboard → Workers → Settings → Domains & Routes
- On Windows, run under WSL or Git Bash
- Local dev: `npm run dev` (wrangler dev)

## 2. Local Node server

```sh
git clone https://github.com/x-cmd/draw && cd draw && npm install
npm run serve        # http://localhost:8787/draw (demo page included)
```

Env vars: `PORT` (default 8787) · `BASE_PATH` · `DATA_REPO`/`DATA_BRANCH`/`GITHUB_TOKEN` (set to enable POST short links; unset degrades gracefully). Deno works too: `deno task serve`.

## 3. Enabling short links (POST /draw)

Not enabled by default on self-deploys — calls return a "not configured" message. To enable:

1. Create a public data repo (short-link data is public — do not store sensitive data)
2. Set `DATA_REPO=owner/name` in wrangler.jsonc vars (`DATA_BRANCH` optional, default main)
3. `npx wrangler secret put GITHUB_TOKEN` (fine-grained PAT, Contents: write on that repo only)
4. Redeploy

Data lives at `charts/<hash>.json` — content-addressed, never expires; reads go through raw (tokenless), quota is only spent on creates.

## 4. Embedded library (no deployment)

Don't want a service at all? `npm install @x-cmd/draw` or `jsr:@x-cmd/draw`, then `draw(params)` renders synchronously — see the [quick start](../../1-overview/02-quick-start/en.md).
