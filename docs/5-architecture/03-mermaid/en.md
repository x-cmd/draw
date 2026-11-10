---
x-title: Flowchart — Mermaid source in, diagram out
x-desc: 'x-cmd/draw flowchart (`/draw/mermaid`). Mermaid syntax in, SVG out. Params: `m=` source, `t=` style (mono/soft), `title=`, `w=/h=`.'
x-sidebar: draw flowchart
x-keywords: flowchart, 流程图, mermaid, draw, svg, decision tree, diagram
x-json-ld:
  '@context': https://schema.org
  '@graph':
    - '@type': TechArticle
      headline: 'draw flowchart'
      inLanguage: 'en'
      about: 'x-cmd/draw 03-mermaid'
---

# Flowchart — Mermaid source in, diagram out

Write the chart in Mermaid syntax and the engine draws it — no browser, no
screenshot step, and the result is the same SVG machinery as every other
chart.

## Examples (what you see is what the URL gives; click to explore)

### A login decision flow

```text
https://x-cmd.com/draw/mermaid?m=graph%20TD%0A%20%20Login%5BUser%20login%5D%20--%3E%20MFA%7BMFA%20enabled%3F%7D%0A%20%20MFA%20--%3E%7Cyes%7C%20Code%5BSend%20code%5D%0A%20%20Code%20--%3E%20Verify%5BVerify%5D%0A%20%20Verify%20--%3E%7Cpass%7C%20Session%5BIssue%20session%5D%0A%20%20Verify%20--%3E%7Cfail%7C%20Lock%5BLock%20account%5D%0A%20%20MFA%20--%3E%7Cno%7C%20Session&t=mono&title=Login%20flow&w=560
```

[![Login flow](https://x-cmd.com/draw/mermaid?m=graph%20TD%0A%20%20Login%5BUser%20login%5D%20--%3E%20MFA%7BMFA%20enabled%3F%7D%0A%20%20MFA%20--%3E%7Cyes%7C%20Code%5BSend%20code%5D%0A%20%20Code%20--%3E%20Verify%5BVerify%5D%0A%20%20Verify%20--%3E%7Cpass%7C%20Session%5BIssue%20session%5D%0A%20%20Verify%20--%3E%7Cfail%7C%20Lock%5BLock%20account%5D%0A%20%20MFA%20--%3E%7Cno%7C%20Session&t=mono&title=Login%20flow&w=560)](https://x-cmd.com/draw/explore/mermaid?m=graph%20TD%0A%20%20Login%5BUser%20login%5D%20--%3E%20MFA%7BMFA%20enabled%3F%7D%0A%20%20MFA%20--%3E%7Cyes%7C%20Code%5BSend%20code%5D%0A%20%20Code%20--%3E%20Verify%5BVerify%5D%0A%20%20Verify%20--%3E%7Cpass%7C%20Session%5BIssue%20session%5D%0A%20%20Verify%20--%3E%7Cfail%7C%20Lock%5BLock%20account%5D%0A%20%20MFA%20--%3E%7Cno%7C%20Session&t=mono&title=Login%20flow&w=560)

`{MFA enabled?}` is a decision, `[Send code]` a box, `|yes|` an edge label.

### An order flow

```text
https://x-cmd.com/draw/mermaid?m=graph%20LR%0A%20%20Order%5BOrder%20placed%5D%20--%3E%20Pay%7BPayment%20ok%3F%7D%0A%20%20Pay%20--%3E%7Cyes%7C%20Pack%5BPack%20%26%20ship%5D%0A%20%20Pay%20--%3E%7Cno%7C%20Retry%5BRetry%20later%5D%0A%20%20Pack%20--%3E%20Track%5BTracking%20sent%5D&w=560
```

[![Order flow](https://x-cmd.com/draw/mermaid?m=graph%20LR%0A%20%20Order%5BOrder%20placed%5D%20--%3E%20Pay%7BPayment%20ok%3F%7D%0A%20%20Pay%20--%3E%7Cyes%7C%20Pack%5BPack%20%26%20ship%5D%0A%20%20Pay%20--%3E%7Cno%7C%20Retry%5BRetry%20later%5D%0A%20%20Pack%20--%3E%20Track%5BTracking%20sent%5D&w=560)](https://x-cmd.com/draw/explore/mermaid?m=graph%20LR%0A%20%20Order%5BOrder%20placed%5D%20--%3E%20Pay%7BPayment%20ok%3F%7D%0A%20%20Pay%20--%3E%7Cyes%7C%20Pack%5BPack%20%26%20ship%5D%0A%20%20Pay%20--%3E%7Cno%7C%20Retry%5BRetry%20later%5D%0A%20%20Pack%20--%3E%20Track%5BTracking%20sent%5D&w=560)

### A group of nodes

```text
https://x-cmd.com/draw/mermaid?m=graph%20TD%0A%20%20subgraph%20Edge%0A%20%20%20%20CDN%5BCDN%5D%20--%3E%20GW%5BGateway%5D%0A%20%20end%0A%20%20GW%20--%3E%20API%5BAPI%5D&w=560
```

[![Edge group](https://x-cmd.com/draw/mermaid?m=graph%20TD%0A%20%20subgraph%20Edge%0A%20%20%20%20CDN%5BCDN%5D%20--%3E%20GW%5BGateway%5D%0A%20%20end%0A%20%20GW%20--%3E%20API%5BAPI%5D&w=560)](https://x-cmd.com/draw/explore/mermaid?m=graph%20TD%0A%20%20subgraph%20Edge%0A%20%20%20%20CDN%5BCDN%5D%20--%3E%20GW%5BGateway%5D%0A%20%20end%0A%20%20GW%20--%3E%20API%5BAPI%5D&w=560)

The `subgraph` block became the `EDGE` box around the two nodes.

## 1. Parameters

| param | meaning | default |
|---|---|---|
| `m=` | the Mermaid source | — |
| `t=` | style: `mono` for line art, `soft` for pastel | — |
| `title=` | diagram title | — |
| `w=` / `h=` | minimum width / height | natural size |
| `v=` | freeze the response at a version | latest |

## 2. What the syntax supports

This is a diagram renderer, not a full Mermaid runtime. The subset:

- `graph LR` / `graph TD` / `flowchart LR` / `flowchart TD` — the direction.
  `LR` runs left to right, `TD` top down. `RL` and `BT` work too.
- **Node shapes** — `[Box]`, `{Diamond}`, `([Round])`, `[(Cylinder)]`,
  `([Stadium])`, `[[Subroutine]]`.
- **Edges** — `-->` for an arrow, `---` for a plain line, `-.->` dotted,
  `==>` thick. `-->|label|` puts text on the edge.
- **Subgraphs** — `subgraph Name … end` becomes a boundary group around the
  nodes inside it.

A `gantt` source is also accepted here and is rendered by the
[Gantt chart](../01-gantt) page's engine.

## 3. Pitfalls

- **The source goes in `m=` URL-encoded** — `>` becomes `%3E`, a space `%20`,
  a newline `%0A`. A raw `&` inside the source splits the parameter.
- **Only `graph` / `flowchart` / `gantt` are accepted** — a `sequenceDiagram`
  or a `pieChart` is a 400, not a silent no-op.
- **A `subgraph` block is one group** — the nodes inside it are boxed
  together, edges and all; an edge that leaves the block still counts as
  belonging to it.
- **Shape syntax is strict** — `{…}` for a diamond, `[(…)]` for a
  cylinder; a stray bracket changes the shape or the parse.

## 4. Related

The same engine draws the [architecture diagram](../01-archmap) — if you
want to place the boxes on a grid yourself, write `n=` / `e=` instead of
Mermaid.

