---
x-title: Chord diagram — a ring of arcs, bands between them
x-desc: 'x-cmd/draw chord diagram (`/draw/chord`): a single `links=from,to,value;…` is enough — nodes grow out of the links, each owns an arc (length ∝ total flow), and each link pulls a band between the two arcs. Params: `links=`, `title=`, `w=`/`h=`.'
x-sidebar: chord
x-keywords: chord diagram, 和弦图, draw, svg, pairwise relations, flow, proportions
x-json-ld:
  '@context': https://schema.org
  '@graph':
    - '@type': TechArticle
      headline: 'draw chord diagram'
      inLanguage: 'en'
      about: 'x-cmd/draw 03-chord'
---

# Chord diagram — a ring of arcs, bands between them

A chord diagram shows **pairwise flows inside a group of entities**. Each entity
owns an arc of the ring, its length proportional to the entity's total flow
(in + out); every link cuts a slice from the source arc and a slice from the
target arc, and pulls a band between the two. The wider the band, the bigger the
flow — who deals with whom, and how much, in one sweep of the eye.

draw draws this one itself: the ECharts chord needs a custom series (a
`renderItem` function), and a URL can only carry plain JSON, no functions; the
circular sankey layout is ignored by SSR anyway. So the chord is a standalone
implementation.

**Typical cases**: music genres influencing each other, teams reviewing each
other's work, modules calling each other, passenger flows between cities — any
"everyone deals with everyone" relation, the more symmetric counterpart of a
sankey.

## Parameters

| param | meaning | default |
|---|---|---|
| `links=` | links: `from,to,value;from,to,value;…` (semicolon-separated, value must be > 0) | — |
| `title=` | title (drawn top-left) | — |
| `w=` / `h=` | canvas size | 560×460 |

**No node list needed**: every name that appears in `links=` becomes a node
automatically, ordered by total flow, coloured from a rotating 8-colour palette.

## Examples

### Music genres influencing each other

```text
https://x-cmd.com/draw/chord?links=Rock,Pop,28;Rock,Metal,34;Rock,Folk,12;Rock,Jazz,9;Pop,Electronic,31;Pop,Hip%20hop,22;Jazz,Classical,16;Classical,Folk,9;Hip%20hop,Electronic,26;Electronic,Metal,13;Metal,Classical,21&w=560&h=460
```

[![Chord · genres](https://x-cmd.com/draw/chord?links=Rock,Pop,28;Rock,Metal,34;Rock,Folk,12;Rock,Jazz,9;Pop,Electronic,31;Pop,Hip%20hop,22;Jazz,Classical,16;Classical,Folk,9;Hip%20hop,Electronic,26;Electronic,Metal,13;Metal,Classical,21&w=560&h=460)](https://x-cmd.com/draw/explore/chord?links=Rock,Pop,28;Rock,Metal,34;Rock,Folk,12;Rock,Jazz,9;Pop,Electronic,31;Pop,Hip%20hop,22;Jazz,Classical,16;Classical,Folk,9;Hip%20hop,Electronic,26;Electronic,Metal,13;Metal,Classical,21&w=560&h=460)

The Rock → Metal band is the widest single link (34), and Classical's arc shows
three inbound bands (Metal 21, Jazz 16, Folk 9) with little going back — who
influences whom is visible in the bands.

### With a title, at another size

Same data, plus `title=`, on a 760×620 canvas:

```text
https://x-cmd.com/draw/chord?links=Rock,Pop,28;Rock,Metal,34;Rock,Folk,12;Rock,Jazz,9;Pop,Electronic,31;Pop,Hip%20hop,22;Jazz,Classical,16;Classical,Folk,9;Hip%20hop,Electronic,26;Electronic,Metal,13;Metal,Classical,21&title=Music%20genres&w=760&h=620
```

[![Chord · genres with a title](https://x-cmd.com/draw/chord?links=Rock,Pop,28;Rock,Metal,34;Rock,Folk,12;Rock,Jazz,9;Pop,Electronic,31;Pop,Hip%20hop,22;Jazz,Classical,16;Classical,Folk,9;Hip%20hop,Electronic,26;Electronic,Metal,13;Metal,Classical,21&title=Music%20genres&w=760&h=620)](https://x-cmd.com/draw/explore/chord?links=Rock,Pop,28;Rock,Metal,34;Rock,Folk,12;Rock,Jazz,9;Pop,Electronic,31;Pop,Hip%20hop,22;Jazz,Classical,16;Classical,Folk,9;Hip%20hop,Electronic,26;Electronic,Metal,13;Metal,Classical,21&title=Music%20genres&w=760&h=620)

## Limits

- **Values must be > 0.** Entries with a zero, negative or non-numeric value are
  silently skipped — no error, they just do not draw.
- **Keep it to about 20 nodes.** Node names are collected from `links=`; past 20
  the arcs get thin and the names crowd. For denser relations use a sankey
  (`type=sankey`) — its left-to-right structure scales better.
- **Weaker direction than a sankey.** Bands read as two-way; for "conversion from
  A to B" the sankey's left-to-right flow is clearer. The chord is about
  "between A and B".
- **No commas inside names** — the comma is the field separator; a name with a
  comma gets split.

## How it differs from the other kinds

- **`type=sankey`**: directed, left-to-right, stages in between — funnels,
  conversions, energy flows, anything with a clear upstream/downstream. The chord
  is round and symmetric; it speaks in pairwise relations.
- **`type=pie`**: a pie says how one whole splits up; a chord says how the members
  of a group trade with each other.

More in the gallery: [/draw/demo/sankey](https://x-cmd.com/draw/demo/sankey).
