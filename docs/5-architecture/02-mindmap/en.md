---
x-title: Mind map — a tree of paths, four shapes
x-desc: 'x-cmd/draw mind map (`/draw/mindmap`). The tree is written as slash-separated paths; the engine infers the parents. Params: `n=` path (`root/branch/leaf`), `style=` (organic/tree/radial/bubble), `t=`, `title=`, `w=/h=`.'
x-sidebar: draw mind map
x-keywords: mind map, 思维导图, draw, svg, tree diagram, roadmap, feature map
x-json-ld:
  '@context': https://schema.org
  '@graph':
    - '@type': TechArticle
      headline: 'draw mind map'
      inLanguage: 'en'
      about: 'x-cmd/draw 02-mindmap'
---

# Mind map — a tree of paths, four shapes

You write the tree as slash-separated paths. The engine works out the shared
parents and lays it out — in one of four shapes.

## Examples (what you see is what the URL gives; click to explore)

### A feature map

```text
https://x-cmd.com/draw/mindmap?n=draw/Charts/Pie&n=draw/Charts/Bar%20and%20Line&n=draw/Charts/Sankey&n=draw/Arch/Archmap&n=draw/Arch/Mindmap&n=draw/Ecosystem/Skill&n=draw/Ecosystem/Data%20link&w=560
```

[![draw feature map](https://x-cmd.com/draw/mindmap?n=draw/Charts/Pie&n=draw/Charts/Bar%20and%20Line&n=draw/Charts/Sankey&n=draw/Arch/Archmap&n=draw/Arch/Mindmap&n=draw/Ecosystem/Skill&n=draw/Ecosystem/Data%20link&w=560)](https://x-cmd.com/draw/explore/mindmap?n=draw/Charts/Pie&n=draw/Charts/Bar%20and%20Line&n=draw/Charts/Sankey&n=draw/Arch/Archmap&n=draw/Arch/Mindmap&n=draw/Ecosystem/Skill&n=draw/Ecosystem/Data%20link&w=560)

### The same tree as a checklist (`style=tree`)

```text
https://x-cmd.com/draw/mindmap?n=Launch/Legal/Privacy%20check&n=Launch/Eng/Tests&n=Launch/Eng/Perf&n=Launch/Docs/Changelog&n=Launch/Docs/Post%20copy&style=tree&title=Launch%20checklist&w=560
```

[![Launch checklist](https://x-cmd.com/draw/mindmap?n=Launch/Legal/Privacy%20check&n=Launch/Eng/Tests&n=Launch/Eng/Perf&n=Launch/Docs/Changelog&n=Launch/Docs/Post%20copy&style=tree&title=Launch%20checklist&w=560)](https://x-cmd.com/draw/explore/mindmap?n=Launch/Legal/Privacy%20check&n=Launch/Eng/Tests&n=Launch/Eng/Perf&n=Launch/Docs/Changelog&n=Launch/Docs/Post%20copy&style=tree&title=Launch%20checklist&w=560)

### A landscape as a radial map (`style=radial`)

```text
https://x-cmd.com/draw/mindmap?n=AI/Providers/OpenAI&n=AI/Providers/Anthropic&n=AI/Open/DeepSeek&n=AI/Agents/Claude%20Code&n=AI/Agents/Codex&style=radial&w=560
```

[![AI providers and agents](https://x-cmd.com/draw/mindmap?n=AI/Providers/OpenAI&n=AI/Providers/Anthropic&n=AI/Open/DeepSeek&n=AI/Agents/Claude%20Code&n=AI/Agents/Codex&style=radial&w=560)](https://x-cmd.com/draw/explore/mindmap?n=AI/Providers/OpenAI&n=AI/Providers/Anthropic&n=AI/Open/DeepSeek&n=AI/Agents/Claude%20Code&n=AI/Agents/Codex&style=radial&w=560)

### A map with many short labels (`style=bubble`)

```text
https://x-cmd.com/draw/mindmap?n=Product/Features/Speed&n=Product/Features/Privacy&n=Product/Features/Integrations&n=Product/Markets/EU&n=Product/Markets/US&n=Product/Pricing/Free&n=Product/Pricing/Pro&style=bubble&title=Product%20map&w=560
```

[![Product map](https://x-cmd.com/draw/mindmap?n=Product/Features/Speed&n=Product/Features/Privacy&n=Product/Features/Integrations&n=Product/Markets/EU&n=Product/Markets/US&n=Product/Pricing/Free&n=Product/Pricing/Pro&style=bubble&title=Product%20map&w=560)](https://x-cmd.com/draw/explore/mindmap?n=Product/Features/Speed&n=Product/Features/Privacy&n=Product/Features/Integrations&n=Product/Markets/EU&n=Product/Markets/US&n=Product/Pricing/Free&n=Product/Pricing/Pro&style=bubble&title=Product%20map&w=560)

## 1. Parameters

| param | meaning | default |
|---|---|---|
| `n=` | one path per leaf: `root/branch/leaf` — repeat for each leaf | — |
| `style=` | shape: `organic`, `tree`, `radial` or `bubble` | `organic` |
| `t=` | skin (colour family) | — |
| `title=` | diagram title | — |
| `w=` / `h=` | minimum width / height | natural size |
| `v=` | freeze the response at a version | latest |

## 2. How the tree is written

One `n=` per leaf, slash-separated:

```
n=Launch/Eng/Tests
n=Launch/Eng/Perf
n=Launch/Docs/Changelog
```

Paths that share a prefix share a parent. **You never write the parents** —
`Launch` and `Launch/Eng` are inferred, and the engine orders them by how
many children they have.

A leaf can also be written with its own `/` inside if you want the display
label to differ from the path — that is the one case where the path is not
the tree.

## 3. The four shapes

| `style=` | it looks like | use it for |
|---|---|---|
| `organic` | branches spreading out from a root on the left | a feature map, a landscape |
| `tree` | a top-down tree, parents above children | a checklist, an outline |
| `radial` | the root in the middle, branches radiating | a taxonomy, a mind map |
| `bubble` | rounded capsules, tight packing | many short labels |

## 4. Pitfalls

- **The root needs a branch** — a single path with no depth is a 400; the
  tree needs at least two levels.
- **All the paths share one root** — two different roots is a 400, not two
  trees. Start every path with the same first segment.
- **`style=` is not a theme** — it changes the layout. The colours come from
  `t=`.
- **Order does not matter** — the engine sorts by subtree size, not by the
  order you wrote the paths.

