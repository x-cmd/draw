---
name: docs/9-showcases/11-ai-coding-era
description: 'x-cmd/draw showcase: the AI-coding era — one person wearing the architect, product and project manager hats needs the macro view of their project handed back. Code composition and file counts of a repository and of a diff, the architecture, the folders, the sprint plan, the issue life — each one a URL.'
type: reference
---

# Core Content

core_features:

  - The premise: code arrives fast, the shape of the project does not stay in anyone's head
  - The repository's composition — `tokei`, with the file count as a line on its own axis
  - Files against lines — `tokei?layout=files`, two sides with two scales
  - The architecture of the code — `arch2`
  - Where the code lives — `mindmap`, the module tree
  - What one change touched — the composition of the diff (`tokei`) and the files (`mindmap`)
  - Where the project is going — `gantt2` for the plan, `lifecycle` for the issue's life
  - Every case uses draw's own repository, so the numbers are real

# Key Information

highlights:

  - **Charts, not code**: what you need back is the macro view of the project
  - Files and lines are different measures — never one axis
  - The output is URLs, so the picture can be pasted straight into an issue or a release note
  - Works the same for a solo builder and a small team

# Use Cases

use_cases:

  - A solo maintainer who needs to see what the agent actually changed
  - A release note that needs the code composition of the release
  - A README that needs the architecture and the module tree

# Related Resources

official:
  endpoint: https://x-cmd.com/draw
related:
  overview: docs/1-overview/01-what-is-draw/cn.md
  tokei: docs/2-data-charts/10-tokei/cn.md
  butterfly: docs/2-data-charts/11-butterfly/cn.md
  github: docs/9-showcases/01-github/cn.md
