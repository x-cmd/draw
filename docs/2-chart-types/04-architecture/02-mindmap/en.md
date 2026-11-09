---
x-title: Mind map — a tree of paths, four shapes
x-desc: 'x-cmd/draw mind map quick reference (`/draw/mindmap`). The tree is given as slash-separated paths, one per leaf; the engine infers the parents and lays it out. Params: `n=` path (`root/branch/leaf`), `style=` (organic/tree/radial/bubble), `t=`, `title=`, `w=/h=`.'
x-sidebar: draw mind map
x-keywords: mind map, 思维导图, draw, svg, tree diagram, roadmap
x-json-ld:
  '@context': https://schema.org
  '@graph':
    - '@type': TechArticle
      headline: 'draw mind map'
      inLanguage: 'en'
      about: 'x-cmd/draw 02-mindmap'
---

# Mind map — a tree of paths, four shapes

> This page is a stub: the examples below are live, the full write-up is still to come.

Give the tree as slash-separated paths. One path per leaf; the engine infers
the shared parents and lays the tree out.

```text
https://x-cmd.com/draw/mindmap?n=draw/Charts/Pie&n=draw/Charts/Bar%20and%20Line&n=draw/Charts/Sankey&n=draw/Arch/Archmap&n=draw/Arch/Mindmap&n=draw/Ecosystem/Skill&n=draw/Ecosystem/Data%20link&w=560
```

[![draw feature map](https://x-cmd.com/draw/mindmap?n=draw/Charts/Pie&n=draw/Charts/Bar%20and%20Line&n=draw/Charts/Sankey&n=draw/Arch/Archmap&n=draw/Arch/Mindmap&n=draw/Ecosystem/Skill&n=draw/Ecosystem/Data%20link&w=560)](https://x-cmd.com/draw/explore/mindmap?n=draw/Charts/Pie&n=draw/Charts/Bar%20and%20Line&n=draw/Charts/Sankey&n=draw/Arch/Archmap&n=draw/Arch/Mindmap&n=draw/Ecosystem/Skill&n=draw/Ecosystem/Data%20link&w=560)

The same tree in a different shape:

```text
https://x-cmd.com/draw/mindmap?n=Launch/Legal/Privacy%20check&n=Launch/Eng/Tests&n=Launch/Eng/Perf&n=Launch/Docs/Changelog&n=Launch/Docs/Post%20copy&style=tree&title=Launch%20checklist&w=560
```

[![Launch checklist](https://x-cmd.com/draw/mindmap?n=Launch/Legal/Privacy%20check&n=Launch/Eng/Tests&n=Launch/Eng/Perf&n=Launch/Docs/Changelog&n=Launch/Docs/Post%20copy&style=tree&title=Launch%20checklist&w=560)](https://x-cmd.com/draw/explore/mindmap?n=Launch/Legal/Privacy%20check&n=Launch/Eng/Tests&n=Launch/Eng/Perf&n=Launch/Docs/Changelog&n=Launch/Docs/Post%20copy&style=tree&title=Launch%20checklist&w=560)

## 1. Parameters

| param | meaning | default |
| --- | --- | --- |
| `n=` | one path per node: `root/branch/leaf` — repeat for each leaf | — |
| `style=` | shape: `organic`, `tree`, `radial` or `bubble` | `organic` |
| `t=` | skin (colour family) | — |
| `title=` | diagram title | — |
| `w=` / `h=` | minimum width / height | natural size |

## 2. Pitfalls

- **The root needs a branch** — a single path with no depth is a 400; the tree
  needs at least two levels.
- **Paths are the whole input**: a node that shares no prefix with another path
  becomes a second root, which is not what people expect.

