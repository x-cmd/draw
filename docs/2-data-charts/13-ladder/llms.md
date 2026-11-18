---
name: docs/2-data-charts/13-ladder
description: 'The ladder (type=ladder) and butterfly ladder (type=butterfly-ladder) in x-cmd/draw — a hardware ranking where each row can carry two models (NVIDIA on the left, AMD/Intel on the right) and a tier (S/A/B/C) groups consecutive rows. The data model is a per-side list of {label, value, tier}; the spec can also be fetched from a file with src=, so a thousand rows do not blow the URL length.'
type: reference
---

# Core Content

core_features:

  - Two chart types: **ladder** (one side, ranked) and **butterfly ladder** (two sides, two models per row)
  - Per-side data model: `items[]` of `{label, value, tier}` — names and values no longer live apart
  - **Tiers group consecutive rows**, with a separator between tiers and the tier name in a column on the left
  - The ordering is **global** — both wings form one ladder — but split into two groups
  - Two ways to sort: `match=rank` (fully offset: one ladder, each row holds a single card on its own side) and `match=value` (close values on the same row, both wings)
  - When one side has fewer rows the extra rows stay empty — **nothing shifts**
  - `src=<url>` fetches the spec from a file — a thousand rows fit in a link
  - Short form (`left=NVIDIA:3264,2851&llabels=…`) as well as the JSON form

# Key Information

highlights:

  - Different from `type=butterfly`: butterfly is a general two-series chart whose
    sides **share one set of row labels**; a ladder needs two models per row and tiers
  - `tier` is a property of the row, not part of the name — read the chart tier first, strength second
  - `match=value` answers "these two are about equal, which is faster?"; `match=rank`
    answers "who is the strongest on each side?"
  - In `rank` mode the two wings share one scale, so lengths are comparable across them
  - `src=` follows onepage's rules: github blob links convert to raw, loopback and
    private addresses are refused, 1MB maximum

# Use Cases

  - A GPU ladder with NVIDIA on the left and AMD/Intel on the right
  - Grouping a ranking into tiers so the reader sees the band before the order
  - Ranking data that is too long for a URL — put it in a file and link it

# Related Resources

official:
  endpoint: https://x-cmd.com/draw
related:
  butterfly: docs/2-data-charts/11-butterfly/en.md
  hbar: docs/2-data-charts/03-hbar/en.md
