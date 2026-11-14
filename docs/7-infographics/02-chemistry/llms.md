---
name: docs/7-infographics-02-chemistry
description: 'x-cmd/draw chemistry (/draw/chem): SMILES to a structural formula, laid out by smilesdrawer (MIT) which ships with the service and loads lazily (~200 KB, only this endpoint pays it). Params: smiles= (required, alias s=), w= (120–1600, default 400), h= (120–1200, default 360), theme=dark|light (scheme=light also works). Invalid SMILES returns 400.'
type: reference
---

# Core Content

core_features:

  - SMILES string in, molecule diagram out — e.g. `?smiles=CCO` is ethanol
  - Layout by smilesdrawer (MIT), drawn server-side; no external chemistry API
  - The ~200 KB layout library loads lazily — only this endpoint pays the cost
  - Two site palettes: dark (default, padded dark card) and light
  - Element colours on atoms (oxygen red, nitrogen blue, sulfur yellow); atoms are clickable on the explore page

# Key Information

highlights:

  - One parameter carries the data: `smiles=` (alias `s=`); everything else is cosmetics
  - Invalid SMILES returns 400 with the parser's own error message
  - Big molecules (cholesterol, ATP) need a bigger canvas than the 400×360 default
  - URL-encode SMILES metacharacters: spaces, `#`, `%` (`%3DO` is `=O`)

# Use Cases

  - A molecule sketch in a README or a drug leaflet
  - Chemistry courseware where every compound is a link
  - Quick "what does this SMILES look like" while reading a paper

# Related Resources

official:
  endpoint: https://x-cmd.com/draw/chem
related:
  qr: docs/7-infographics/01-qr/cn.md
  terminal: docs/7-infographics/03-terminal/cn.md
  gallery: https://x-cmd.com/draw/demo/chem
