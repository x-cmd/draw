---
x-title: Ladder and butterfly ladder — two models per row
x-desc: 'The ladder (type=ladder) and butterfly ladder (type=butterfly-ladder) in x-cmd/draw: two models per row, with tiers (S/A/B/C) grouping consecutive rows. The data can live in a file (src=), so a thousand rows do not blow the URL length.'
x-sidebar: Ladder
x-keywords: ladder, butterfly ladder, tier, hardware ranking, src, draw, svg
x-json-ld:
  '@context': https://schema.org
  '@graph':
    - '@type': TechArticle
      headline: 'Ladder and butterfly ladder — two models per row'
      inLanguage: 'en'
      about: 'x-cmd/draw 2-data-charts 12-ladder'
---

# Ladder and butterfly ladder — two models per row

## Two charts

| Chart | Shape | When |
|---|---|---|
| **Ladder** `type=ladder` | one side, ranked | one vendor's ranking (GPUs, CPUs) |
| **Butterfly ladder** `type=butterfly-ladder` | both wings form one ladder | two vendors head to head (NVIDIA vs AMD/Intel) |

The difference from `type=butterfly`: butterfly is a **general** two-series chart
(population pyramids, "on vs off" by age) whose two sides **share one set of row
labels**. A ladder needs **two models per row** and can be **tiered** — that is a
different set of semantics and a different way of reading.

## The data model: each side is a list of name + value

Names and values no longer live apart (the old `labels=` was a parallel array, so
one row could only show one name):

```json
{
  "type": "butterfly-ladder",
  "title": "NVIDIA vs AMD/Intel · GPU index",
  "left":  {"name": "NVIDIA",    "items": [{"label": "GeForce RTX 5090", "value": 3264, "tier": "S"}]},
  "right": {"name": "AMD/Intel", "items": [{"label": "Radeon RX 7900 XTX", "value": 2095, "tier": "S"}]}
}
```

- `label` / `value` are required on each item, `tier` is optional
- There is a short form too (names and values comma-separated; avoid commas
  inside names):

```
?type=butterfly-ladder
&left=NVIDIA:3264,2851&right=AMD/Intel:2095,1875
&llabels=GeForce RTX 5090,GeForce RTX 4090
&rlabels=Radeon RX 7900 XTX,Radeon RX 7900 XT
&ltiers=S,S&rtiers=S,S
```

## Tiers: a property of the row

`tier` is not part of the name — rows with the same tier **sit together**, a
separator line runs between tiers, and the tier name (S / A / B / C) is printed
in the column on the left.

So you read it as "first the tier, then who is stronger inside it".

## The ordering is global, but it splits into two groups

The cards of both wings form **one ladder** — sorted **overall** by strength, not
two separate rankings:

| `match=` | How it is sorted | What you read |
|---|---|---|
| `rank` (default) | **fully offset**: one ladder, strongest first; **each row holds a single card**, on its own side, the other side empty | one ladder you can scan top to bottom |
| `value` | **matched**: each card on the right is **lifted** to the row whose left card is just stronger (`left[n] >= right > left[n+1]`); the right stays in order | "these two are about equal — which is faster?" |
| `tier` | **by tier**: everything is sorted overall first, then the right wing is lifted **block by block**, so cards of the same tier share a row; a block takes as many rows as its longer side, so **either wing can leave gaps** | "same tier, side by side — and where one wing has nothing, the row stays empty" |

In `rank` mode the two wings **share one scale**, so their lengths are comparable
across them.

## Data in a file: `src=`

A ladder can have a thousand rows — too many for a URL (browsers cap at a few
thousand characters, proxies at a few KB). So the spec can live in a JSON file
and the URL carries only the link:

```
?type=butterfly-ladder&src=https://raw.githubusercontent.com/x-cmd/draw/main/examples/ladder-gpu.json
```

Same rules as onepage's `?src=`: github blob links are converted to raw
automatically; loopback and private addresses are refused; 1MB maximum.

## Related

- [Butterfly chart](../11-butterfly/en.md) — the general two-series chart
- [Horizontal bar](../03-hbar/en.md) — a one-sided ranking
