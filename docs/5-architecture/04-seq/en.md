---
x-title: Sequence diagram — who talks to whom, and in what order
x-desc: 'x-cmd/draw sequence diagram (`/draw/seq`). Participants across the top, one message per line, time running down — the order of the `e=` parameters is the order of the messages. Params: `n=` participant, `e=` message (`from;to[;label][;dash]`), `title=`, `w=/h=`.'
x-sidebar: draw sequence diagram
x-keywords: sequence diagram, 时序图, draw, svg, uml, interaction, lifeline
x-json-ld:
  '@context': https://schema.org
  '@graph':
    - '@type': TechArticle
      headline: 'draw sequence diagram'
      inLanguage: 'en'
      about: 'x-cmd/draw 04-seq'
---

# Sequence diagram — who talks to whom, and in what order

A real sequence diagram: the participants sit across the top, every message
drops one line, time runs down. The **order of the `e=` parameters in the URL
is the order of the messages** — write them as they happen.

```text
https://x-cmd.com/draw/draw/seq?n=app;fe;Your%20app;;r0c0&n=worker;be;Worker;;r0c1&n=specs;be;specs/;parse%20%2B%20validate;r0c2&n=render;be;render/;draw%20the%20SVG;r0c3&e=app;worker;GET%20/draw%3Ftype=pie&e=worker;specs;parse%20the%20spec&e=specs;worker;spec;dash&e=worker;render;draw&e=render;worker;SVG;dash&e=worker;app;200%20with%20metadata;dash&title=One%20request
```

[![One request](https://x-cmd.com/draw/draw/seq?n=app;fe;Your%20app;;r0c0&n=worker;be;Worker;;r0c1&n=specs;be;specs/;parse%20%2B%20validate;r0c2&n=render;be;render/;draw%20the%20SVG;r0c3&e=app;worker;GET%20/draw%3Ftype=pie&e=worker;specs;parse%20the%20spec&e=specs;worker;spec;dash&e=worker;render;draw&e=render;worker;SVG;dash&e=worker;app;200%20with%20metadata;dash&title=One%20request)](https://x-cmd.com/draw/explore/seq?n=app;fe;Your%20app;;r0c0&n=worker;be;Worker;;r0c1&n=specs;be;specs/;parse%20%2B%20validate;r0c2&n=render;be;render/;draw%20the%20SVG;r0c3&e=app;worker;GET%20/draw%3Ftype=pie&e=worker;specs;parse%20the%20spec&e=specs;worker;spec;dash&e=worker;render;draw&e=render;worker;SVG;dash&e=worker;app;200%20with%20metadata;dash&title=One%20request)

## 1. Parameters

| param | meaning | default |
|---|---|---|
| `n=` | a participant: `id;type;label[;sub][;pos]` — one per participant | — |
| `e=` | a message: `from;to[;label][;dash]` — repeat in the order they happen | — |
| `title=` | diagram title | — |
| `w=` / `h=` | canvas size | natural size |
| `v=` | freeze the response at a version | latest |

The participant types are the same as everywhere else — `fe` (your app),
`be` (a service), `db` (a store), `cloud`, `ext`, `sec`, `bus`, `svc` — and
they colour the header box.

## 2. How it is drawn

- **Participants** sit in one row; `pos` (`r0c0`, `r0c1`, …) says which column.
- **Lifelines** drop from each participant box.
- **A message** is an arrow from one lifeline to the other, on its own line.
- **A return** is the same arrow dashed — write `dash` as the last field:
  `e=worker;app;200 with metadata;dash`.
- **Activation bars** — the thin bar on a lifeline — mark the stretch where
  that participant is busy: it runs from the message it received to the next
  message it sends.

## 3. Pitfalls

- **The URL order is the time order.** The engine does not sort; it draws
  message 1 on the first line, message 2 on the second.
- **A `+` in a label must be encoded** (`%2B`) — in a query string a bare
  `+` means a space.
- **A message to an unknown participant is a 400**, not a dropped arrow.
- **A participant needs a `pos`** (`r0c0`, `r0c1`, …) or it lands on top of
  another one.

