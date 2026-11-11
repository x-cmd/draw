---
x-title: Parameters — one set, three entry points (URL / CLI / npm)
x-desc: 'x-cmd/draw parameter reference: the same chart in three forms, plus the URL encoding rules and which endpoint each chart kind uses.'
x-sidebar: draw parameters
x-keywords: parameters, URL, CLI, npm, encoding, draw
x-json-ld:
  '@context': https://schema.org
  '@graph':
    - '@type': TechArticle
      headline: 'draw parameters'
      inLanguage: 'en'
      about: 'x-cmd/draw 07-params'
---

# Parameters — one set, three entry points (URL / CLI / npm)

**The same parameters, three ways to say them.** The semantics and the output are
identical — switching entry point shouldn't cost you any thought.

## Three entry points

| entry | how | good for |
|---|---|---|
| **URL** | `GET https://x-cmd.com/draw?type=pie&labels=A,B&values=3,2` | pasting into a README, issue or PR; `format=png` to save the image |
| **CLI** | `draw --type pie --labels "A,B" --values "3,2" --out pie.svg` | rendering locally; a `.png` suffix rasterizes for you |
| **npm** | `import { draw } from '@x-cmd/draw';`<br>`const { svg } = draw({ type: 'pie', labels: 'A,B', values: '3,2' });` | drawing inside your own program; no network |

## The same chart, three ways

| parameter | URL | CLI | npm |
|---|---|---|---|
| chart kind | `type=pie` | `--type pie` | `{ type: 'pie' }` |
| categories | `labels=A,B` | `--labels "A,B"` | `{ labels: 'A,B' }` |
| values | `values=3,2` | `--values "3,2"` | `{ values: '3,2' }` |
| title | `title=Stars` | `--title "Stars"` | `{ title: 'Stars' }` |
| unit | `unit=stars` | `--unit stars` | `{ unit: 'stars' }` |
| style | `t=evil` | `--theme evil` (or `--t evil`) | `{ t: 'evil' }` |
| light/dark | `scheme=dark` | `--scheme dark` | `{ scheme: 'dark' }` |
| size | `w=560&h=320` | `--width 560 --height 320` | `{ w: 560, h: 320 }` |
| value labels | `num=all` | `--num all` | `{ num: 'all' }` |
| repeated params | `series=a:1,2&series=b:3,4` | `--series "a:1,2" --series "b:3,4"` | `{ series: ['a:1,2', 'b:3,4'] }` |

> A CLI long flag is the query parameter name (`--theme` = `t=`, `--width` = `w=`),
> and an unknown flag passes straight through as a query parameter; a repeated flag
> is a repeated parameter. The CLI also takes a bare query string:
> `draw "?type=bar&labels=Mon,Tue&values=3,5"`.

## URL encoding rules

| character | write it as | why |
|---|---|---|
| space | `%20` | not `+` — a `+` in a query string reads as a space |
| `+` (a real plus) | `%2B` | when a name starts with one (`C++`) |
| `&` | `%26` | it separates parameters |
| `=` | `%3D` | it separates key from value |
| `;` | `%3B` | the architecture node syntax uses semicolons; escape them inside names |
| `#` | `%23` | it starts the fragment |
| `<` `>` | `%3C` `%3E` | for UML notation like `<<include>>` |
| Chinese | percent-encoded | browsers do it for you; hand-written URLs need UTF-8 |

`;` `=` `,` `:` `/` `@` need no escaping — the `n=` `e=` `b=` architecture syntax
relies on them to split fields.

## Which endpoint each chart kind uses

| entry | endpoint | kinds |
|---|---|---|
| **core** | `/draw?type=…` | pie, bar, hbar, line, area, radar, gauge, scatter, combo, sankey, qr, quadrant, compass, butterfly, calendar |
| **echarts** | `/draw/echarts?d=…` | the ECharts overlay: force graph, circular relations, sunburst, treemap, funnel, theme river, maps… |
| **arch2** | `/draw/arch2?n=…&e=…` | architecture v2 (type-coloured, with a legend) |
| **archmap** | `/draw/archmap?n=…&e=…` | architecture (plain boxes) |
| **mermaid** | `/draw/mermaid?m=…` | Mermaid flowcharts |
| **seq / uc / erd / class / dataflow / lifecycle** | `/draw/<kind>?n=…&e=…` | sequence, use case, ERD, class, data flow, lifecycle |
| **gantt / gantt2** | `/draw/gantt?…` | Gantt |
| **mindmap** | `/draw/mindmap?n=…` | mind map |
| **tokei** | `/draw/tokei?langs=…` | code composition |

## Two links, two jobs

| link | what it is |
|---|---|
| `https://x-cmd.com/draw?type=…` | **the image** — SVG/PNG, ready to embed |
| `https://x-cmd.com/draw/explore?type=…` | **the editor** — the chart beside a table, change a cell and it redraws, then copy the image URL |

Every card on the demo page (`/draw/demo`) has a "Copy image URL" button, and it
copies the first one.
