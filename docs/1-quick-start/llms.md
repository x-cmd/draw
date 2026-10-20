---
name: quick-start
description: Fastest paths into x-cmd/draw - URL rendering, npm library + CLI, Deno sandbox; ends with the complete 11-type table.
type: reference
---

# Core Content

three_paths:

  - hosted: build `https://x-cmd.com/draw?type=...` URLs, render in browser/img/markdown
  - npm: `npm install @x-cmd/draw`; CLI `x-draw --type pie --labels A,B --values 3,2 --out pie.svg`; lib `draw({type,labels,values})` sync no-network
  - deno: `import { draw } from "jsr:@x-cmd/draw"` - zero-permission sandbox render

complete_table:

  - pie / bar / hbar / line / area / radar / gauge / scatter / combo / sankey / qr - limits + live thumbnails in zh.md / en.md
