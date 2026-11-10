---
name: docs/2-data-charts/10-tokei
description: 'x-cmd/draw code composition chart (/draw/tokei). Takes tokei --output json and draws one stacked column per language: code, comments, blanks. Params: d (the tokei json), title, unit, w/h, t, scheme.'
type: reference
---

# Core Content

core_features:

  - `/draw/tokei` — the tokei JSON drawn as a stacked bar
  - `d=` the tokei JSON: `language → {code, comments, blanks}`
  - The per-file detail in tokei's output is read and ignored
  - The `Total` row is not drawn; languages sort largest first
  - POST accepts the same JSON as the body — pipe tokei straight in
  - Run tokei over the changed files to get a PR's increment

# Key Information

highlights:

  - `/draw/tokei` — the tokei JSON drawn as a stacked bar
  - `d=` the tokei JSON: `language → {code, comments, blanks}`
  - The per-file detail in tokei's output is read and ignored
  - The `Total` row is not drawn; languages sort largest first
  - POST accepts the same JSON as the body — pipe tokei straight in
  - Run tokei over the changed files to get a PR's increment

# Use Cases

use_cases:

  - Release notes: how the codebase is composed
  - Pull request descriptions: what the diff added
  - Repository dashboards: languages, comments, blanks
  - Auditing comment-to-code ratios across a project

# Related Resources

official:
  endpoint: https://x-cmd.com/draw/tokei
  repo: https://github.com/x-cmd/draw
related:
  overview: docs/1-overview/01-what-is-draw/cn.md
  chart_types: docs/2-data-charts/02-bar/cn.md
