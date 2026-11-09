---
name: docs/7-strategy/02-compass
description: 'x-cmd/draw four-arrow compass (type=compass). A centre point with four labelled arrows (up / right / down / left) — the other quadrant-style decision diagram, next to the 2×2 matrix. Params: up/right/down/left (label or label:note), center, title.'
type: reference
---

# Core Content

core_features:

  - `type=compass` — four-arrow compass / radiating labels
  - `up=` / `right=` / `down=` / `left=` — that direction's label (`label` or `label:note`)
  - `center=` — the word in the middle
  - Directions with no label are not drawn; at least one is required

# Key Information

highlights:

  - **Not the same as the quadrant** — the quadrant cuts a plane into four regions along two axes; the compass sends four arrows out of a centre
  - **`label:note`** — the colon separates the label from the second line, so a label cannot contain a colon
  - **Empty compass is a 400** — at least one direction is required

# Use Cases

use_cases:

  - Employee growth / training models (self / others, say / do)
  - Four-way strategy choices radiating from one decision point
  - "Who says what, who does what" communication maps
  - Blameless post-mortem style directions (self / system / process / people)

# Related Resources

official:
  endpoint: https://x-cmd.com/draw?type=compass
related:
  overview: docs/7-strategy/01-quadrant/en.md
