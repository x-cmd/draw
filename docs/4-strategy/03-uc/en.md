---
x-title: Use case diagram — who uses it, and for what
x-desc: 'x-cmd/draw use case diagram (`/draw/uc`). Stick-figure actors, oval use cases, a system boundary, and `<<include>>` / `<<extend>>` dependencies. Params: `n=` element (`id;actor|label` or `id;uc|label`), `e=` association, `b=` boundary, `title=`, `w=/h=`.'
x-sidebar: draw use case diagram
x-keywords: use case diagram, 用例图, draw, svg, uml, actor, system boundary
x-json-ld:
  '@context': https://schema.org
  '@graph':
    - '@type': TechArticle
      headline: 'draw use case diagram'
      inLanguage: 'en'
      about: 'x-cmd/draw 03-uc'
---

# Use case diagram — who uses it, and for what

Actors on the left as stick figures, use cases on the right as ovals, the
system itself boxed around them.

```text
https://x-cmd.com/draw/draw/uc?n=caller;actor;Your%20app%20or%20CI&n=agent;actor;AI%20agent&n=writer;actor;README%20or%20docs&n=ops;actor;Self-host%20operator&n=uc1;uc;Render%20a%20chart;GET%20/draw%3Ftype=...&n=uc2;uc;Store%20a%20short%20link;POST%20/draw&n=uc3;uc;Embed%20the%20SVG;markdown%20%2B%20img&n=uc4;uc;Run%20it%20yourself;npm%20%2B%20wrangler&e=caller;uc1&e=caller;uc2&e=agent;uc1&e=writer;uc3&e=ops;uc4&e=uc1;uc2;%3C%3Cinclude%3E%3E&b=draw;uc1%20uc2%20uc3%20uc4&title=What%20draw%20is%20for
```

[![What draw is for](https://x-cmd.com/draw/draw/uc?n=caller;actor;Your%20app%20or%20CI&n=agent;actor;AI%20agent&n=writer;actor;README%20or%20docs&n=ops;actor;Self-host%20operator&n=uc1;uc;Render%20a%20chart;GET%20/draw%3Ftype=...&n=uc2;uc;Store%20a%20short%20link;POST%20/draw&n=uc3;uc;Embed%20the%20SVG;markdown%20%2B%20img&n=uc4;uc;Run%20it%20yourself;npm%20%2B%20wrangler&e=caller;uc1&e=caller;uc2&e=agent;uc1&e=writer;uc3&e=ops;uc4&e=uc1;uc2;%3C%3Cinclude%3E%3E&b=draw;uc1%20uc2%20uc3%20uc4&title=What%20draw%20is%20for)](https://x-cmd.com/draw/explore/uc?n=caller;actor;Your%20app%20or%20CI&n=agent;actor;AI%20agent&n=writer;actor;README%20or%20docs&n=ops;actor;Self-host%20operator&n=uc1;uc;Render%20a%20chart;GET%20/draw%3Ftype=...&n=uc2;uc;Store%20a%20short%20link;POST%20/draw&n=uc3;uc;Embed%20the%20SVG;markdown%20%2B%20img&n=uc4;uc;Run%20it%20yourself;npm%20%2B%20wrangler&e=caller;uc1&e=caller;uc2&e=agent;uc1&e=writer;uc3&e=ops;uc4&e=uc1;uc2;%3C%3Cinclude%3E%3E&b=draw;uc1%20uc2%20uc3%20uc4&title=What%20draw%20is%20for)

## 1. Parameters

| param | meaning | default |
|---|---|---|
| `n=` | an element: `id;actor\|label[;sub]` or `id;uc\|label[;sub]` | — |
| `e=` | an association: `from;to[;label]` | — |
| `b=` | the system boundary: `label;id id …` | — |
| `actors=` | put the actors on the right instead of the left | `left` |
| `title=` | diagram title | — |
| `w=` / `h=` | canvas size | natural size |
| `v=` | freeze the response at a version | latest |

## 2. How it is drawn

- **Actors** are stick figures in a column; **use cases** are ovals in a
  column of their own. `actors=right` swaps the two sides.
- **Associations are orthogonal** — they leave the actor, run down the gap
  between the two columns and come into the oval, so one actor reaching
  several use cases never draws over an oval.
- **An association** is a plain line. A label of `<<include>>` or `<<extend>>`
  turns it into a dashed dependency — that is the UML way of saying "this use
  case always needs that one".
- **The system boundary** (`b=`) is the dashed box around the use cases.

## 3. Pitfalls

- **The kind is `actor` or `uc`** — anything else is a 400.
- **A boundary only frames use cases** — putting an actor inside it draws the
  box around the actor too.
- **The use cases are stacked in one column** — the order in the URL is the
  order from the top.
- **A `+` in a label must be encoded** (`%2B`), like everywhere else.

