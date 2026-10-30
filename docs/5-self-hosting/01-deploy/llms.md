---
name: self-hosting
description: Deploy your own x-cmd/draw - one-shot Cloudflare Workers setup.sh, wrangler dev, local Node serve; short-link storage via DATA_REPO/GITHUB_TOKEN; BASE_PATH and custom domains.
type: reference
---

# Core Content

deployment:

  - cloudflare: `curl -fsSL https://raw.githubusercontent.com/x-cmd/draw/main/scripts/setup.sh | bash` - free tier, prints a *.workers.dev URL; `npm run setup` inside a clone
  - node: `npm install && npm run serve` on :8787 (demo page included); Deno: `deno task serve`
  - embedded: npm/jsr library, `draw(params)` sync render, no service needed

short_links:

  - create a public data repo, set DATA_REPO=owner/name in wrangler.jsonc vars
  - `npx wrangler secret put GITHUB_TOKEN` (fine-grained PAT, Contents:write)
  - data at charts/<hash>.json - content-addressed, never expires, reads tokenless via raw

notes: BASE_PATH pins the path prefix; custom domains via Workers settings; public repo = do not store sensitive data.
