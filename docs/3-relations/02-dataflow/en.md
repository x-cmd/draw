---
x-title: Data flow diagram — where the data goes
x-desc: 'x-cmd/draw data flow diagram (`/draw/dataflow`). Nodes are processes, stores, sources and sinks; edges carry the data. Same URL model as the architecture diagram: `n=` / `e=` / `b=`.'
x-sidebar: draw data flow diagram
x-keywords: data flow diagram, 数据流图, draw, svg, pipeline, etl
x-json-ld:
  '@context': https://schema.org
  '@graph':
    - '@type': TechArticle
      headline: 'draw data flow diagram'
      inLanguage: 'en'
      about: 'x-cmd/draw 02-dataflow'
---

# Data flow diagram — where the data goes

Four kinds of node, one edge style, and the data named on the edge. Same URL
model as the architecture diagram: the layout is in the URL.

```text
https://x-cmd.com/draw/dataflow?n=url;source;the%20URL;;r0c0&n=parse;process;parse%20the%20spec;specs/;r1c0&n=skin;process;pick%20a%20skin;styles/;r2c0&n=draw;process;draw%20the%20SVG;render/;r3c0&n=out;source;SVG%20%2B%20metadata;;r4c0&n=store;store;short%20link;charts/%20in%20a%20Git%20repo;r2c1&e=url;parse;query%20string&e=parse;skin&e=skin;draw&e=draw;out;image/svg%2Bxml&e=parse;store;POST%20/draw
```

[![Data flow](https://x-cmd.com/draw/dataflow?n=url;source;the%20URL;;r0c0&n=parse;process;parse%20the%20spec;specs/;r1c0&n=skin;process;pick%20a%20skin;styles/;r2c0&n=draw;process;draw%20the%20SVG;render/;r3c0&n=out;source;SVG%20%2B%20metadata;;r4c0&n=store;store;short%20link;charts/%20in%20a%20Git%20repo;r2c1&e=url;parse;query%20string&e=parse;skin&e=skin;draw&e=draw;out;image/svg%2Bxml&e=parse;store;POST%20/draw)](https://x-cmd.com/draw/explore/dataflow?n=url;source;the%20URL;;r0c0&n=parse;process;parse%20the%20spec;specs/;r1c0&n=skin;process;pick%20a%20skin;styles/;r2c0&n=draw;process;draw%20the%20SVG;render/;r3c0&n=out;source;SVG%20%2B%20metadata;;r4c0&n=store;store;short%20link;charts/%20in%20a%20Git%20repo;r2c1&e=url;parse;query%20string&e=parse;skin&e=skin;draw&e=draw;out;image/svg%2Bxml&e=parse;store;POST%20/draw)

This one is draw's own pipeline: a URL comes in, gets parsed, picks a skin,
becomes an SVG — or goes to the short-link store.

## 1. Parameters

| param | meaning | default |
|---|---|---|
| `n=` | a node: `id;type;label[;sub][;pos]` | — |
| `e=` | a flow: `from;to[;label]` | — |
| `b=` | a group: `label;id id …` | — |
| `title=` | diagram title | — |
| `w=` / `h=` | canvas size | natural size |

## 2. The vocabulary

| type | it is | shape |
|---|---|---|
| `process` | something that transforms data | box |
| `store` | somewhere data comes to rest | cylinder |
| `source` | where data enters | round |
| `sink` | where data leaves | round |

The legend at the bottom counts each kind, the same as the architecture
diagram.

## 3. Pitfalls

- **The type must be one of the four** — anything else is a 400 that lists
  them.
- **A node without a position is packed for you** — row by row, up to twelve
  columns. Give a position (`r0c1`) when you want a specific spot.
- **Put the data name on the edge** (`e=parse;store;write parquet`) — the edge
  label is what makes it a *data flow* rather than a plain dependency.

