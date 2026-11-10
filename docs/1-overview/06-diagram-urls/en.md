---
x-title: Diagram URLs — one grammar, eight kinds
x-desc: 'How to write the URL of a draw diagram: `n=` node (`id;type;label[;sub][;pos]`), `e=` edge (`from;to[;label][;variant]`), `b=` boundary (`label;id id`). One grammar for archmap, arch2, seq, uc, dataflow, lifecycle, erd and class — plus the node-type table for each kind.'
x-sidebar: draw diagram URLs
x-keywords: diagram url, architecture diagram, sequence diagram, use case, erd, class diagram, lifecycle, dataflow, node syntax, 架构图, 时序图, 用例图, 节点语法
x-json-ld:
  '@context': https://schema.org
  '@graph':
    - '@type': TechArticle
      headline: 'draw diagram URLs — one grammar, eight kinds'
      inLanguage: 'en'
      about: 'x-cmd/draw 01-overview-06-diagram-urls'
---

# Diagram URLs — one grammar, eight kinds

The data charts take flat parameters (`labels=`, `values=`, `series=`). The
diagrams take a **property table**: every node, edge and group is one line of
`id;type;label` separated by semicolons.

The point of this page: **you only learn this once.** Architecture diagrams,
sequence diagrams, use case diagrams, data flow, lifecycle, ERD and class
diagrams all read the same three parameters, in the same order, with the same
separators. Only the *vocabulary* changes — which type names a kind accepts.

## 1. The three lines

```text
n=id;type;label[;sub][;pos]     one node     (repeat it)
e=from;to[;label][;variant]      one edge     (repeat it)
b=label;id id …                  one group    (repeat it)
```

### n= — a node

| field | required | what it is |
|---|---|---|
| `id` | yes | the name you use in `e=` and `b=`. Letters, digits, dot, dash, underscore; it may not start with a punctuation mark |
| `type` | yes | what the node *is* — decides its colour, badge and shape. Each kind has its own vocabulary (§3) |
| `label` | yes | the text on the node |
| `sub` | no | a smaller second line. `%0A` inside it makes more lines — that is how an ERD table lists its fields |
| `pos` | no | where it goes. A grid cell `r0c1`, a span `r0c1w2`, or pixels `p40,80[,120x48]`. Leave it out and the engine packs the nodes itself |

```text
n=api;be;API Gateway;auth;r1c0w2
```

`id` = `api`, `type` = `be`, `label` = `API Gateway`, `sub` = `auth`,
position = row 1, column 0, two columns wide.

Trailing semicolons are ignored — `n=api;be;API Gateway;;` is the same node.

### e= — an edge

```text
e=from;to[;label][;variant]
```

`from` and `to` are node ids; both must exist, or it is a 400. `label` is the
text on the line. `variant` is how the line is drawn:

| kind | variant | what it draws |
|---|---|---|
| archmap, arch2, dataflow, lifecycle, erd, class | `main` | the line that carries the main flow (darker, heavier) |
| the same | `dash` | a secondary line (dashed) |
| seq | `dash` | a reply — the last field of the message line |
| uc | — | a `<<include>>` / `<<extend>>` label draws the line dashed |

```text
e=web;api;GET /draw?type=pie
e=api;api;main flow;main
```

### b= — a group

```text
b=label;id id …
```

Everything named after the semicolon is boxed together under that label: a
system boundary in an architecture diagram, a swim lane in a sequence
diagram, the system box in a use case diagram. The ids must already exist —
a group never creates nodes. Write `b=` more than once to draw more than one
group.

```text
b=Data Layer;pg cache
b=Namespace;p1 p2
```

An optional **third field** picks the frame's colour — a palette number 1–10
(`b=AWS Region;cdn lb api;9`). Leave it out and draw picks a colour the
diagram's node types are not using, so a frame never blends into the boxes it
surrounds.

## 2. Positions

| form | meaning |
|---|---|
| `r0c1` | row 0, column 1 |
| `r0c1w2` | row 0, column 1, two columns wide |
| `r1c0h2` | row 1, column 0, two rows tall |
| `p40,80` | 40 pixels from the left, 80 from the top |
| `p40,80,120x48` | the same, with an exact 120×48 box |

Grid cells are counted from zero. Two nodes in the same cell is a 400. A
node without a position is packed by the engine, in the order you wrote it,
into the first free cell.

In a **sequence diagram** the position is the column the participant stands
in (`r0c0`, `r0c1`, … — one row, many columns). In a **use case diagram**
the position is optional; leave it out and the actors line up on the left and
the use cases in a column on the right.

## 3. The vocabulary of each kind

Same grammar, different type names. This is the only thing you have to look
up per kind.

| kind | path | node types | what they look like |
|---|---|---|---|
| Architecture | `/draw/arch2` | `fe` `be` `db` `cloud` `sec` `bus` `svc` `ext` | coloured box + type badge |
| Architecture (v1) | `/draw/archmap` | `fe` `be` `db` `cloud` `sec` `bus` `svc` `ext` | plain box |
| Sequence | `/draw/seq` | `fe` `be` `db` `cloud` `sec` `bus` `svc` `ext` | header box over a lifeline |
| Use case | `/draw/uc` | `actor` `uc` | stick figure / oval |
| Data flow | `/draw/dataflow` | `process` `store` `source` `sink` | rectangle / cylinder / round |
| Lifecycle | `/draw/lifecycle` | `state` `decision` `terminal` | round / diamond / round |
| ERD | `/draw/erd` | `table` `view` | box with a field list |
| Class | `/draw/class` | `class` `iface` `enum` | box with a member list |

The eight architecture types:

| type | it is |
|---|---|
| `fe` | front end — browser, app, UI |
| `be` | back end — service, worker, API |
| `db` | database — Postgres, Redis, a store |
| `cloud` | cloud or managed service |
| `sec` | security — auth, gateway, WAF |
| `bus` | bus — queue, topic, stream |
| `svc` | generic service |
| `ext` | external system — a third party |

Using a type a kind does not know is a 400 with the list of the ones it does
know — the error tells you what to write.

## 4. A worked example

A data flow, four nodes, three edges, one store:

```text
https://x-cmd.com/draw/dataflow?n=raw;source;raw/orders.csv;;r0c0&n=extract;process;Extract rows;read %2B validate;r1c0&n=store;store;warehouse/orders;parquet;r2c0&n=dash;process;BI dashboard;;r2c1&e=raw;extract;rows&e=extract;store;write parquet&e=store;dash;query
```

- `n=raw;source;raw/orders.csv;;r0c0` — a source, no second line, at row 0
  column 0.
- `n=extract;process;Extract rows;read %2B validate;r1c0` — a process with a
  sub line.
- `e=raw;extract;rows` — a labelled edge. Both ids exist, so it draws.
- `store` is a `store`, so it gets the cylinder shape; `dash` is a `process`,
  so it gets a rectangle.

The same grammar with a different vocabulary is a use case diagram:

```text
https://x-cmd.com/draw/uc?n=dev;actor;Developer&n=chart;uc;Render a chart&e=dev;chart&b=draw;chart
```

## 5. Multi-line text

A `%0A` inside the `sub` field breaks the line. This is how an ERD table
lists its fields and a class lists its members:

```text
n=users;table;users;id:int (pk)%0Aname:text%0Acreated_at:timestamp;r0c0
n=user;class;User;id:int%0Aname:string%0Agreet(): void;r0c0
```

In **ERD** and **class** each line is drawn as a row: the name on the left,
the type on the right in a monospaced face, and a key badge in front. The
line splits at the first colon *outside* parentheses, so a method keeps its
parameters — `charge(amount: Money): Result` is the member
`charge(amount: Money)` of type `Result`.

| line | reads as |
|---|---|
| `id:int (pk)` | name `id`, type `int`, primary key |
| `user_id:int (fk)` | name `user_id`, type `int`, foreign key |
| `slug:text (uk)` | name `slug`, type `text`, unique key |
| `greet(): void` | name `greet()`, type `void` |
| `+ id:int` | the `+` is a UML visibility marker (write `%2B` in a URL) |

## 6. Encoding

The separators `;` `=` `,` `:` `/` `@` and `-` stay as they are. Everything
else that has meaning in a URL must be escaped:

| character | write it as | why |
|---|---|---|
| space | `%20` | `+` also means space in a query string, so never write a raw `+` |
| `+` | `%2B` | a literal plus |
| `&` | `%26` | it separates parameters |
| `#` | `%23` | it starts the fragment |
| `<` `>` | `%3C` `%3E` | for `<<include>>` |
| newline | `%0A` | for multi-line text |

## 7. Other kinds, other grammars

Three diagram paths do not use the property table, because they have a
standard of their own:

| path | parameter | what it takes |
|---|---|---|
| `/draw/mindmap` | `n=` | a path: `n=Root/Child/Grandchild`, one per branch |
| `/draw/mermaid` | `m=` | a Mermaid flowchart source |
| `/draw/gantt`, `/draw/gantt2` | `m=` | a Mermaid Gantt source |

## 8. Pitfalls

- **An edge can only point at a node that exists.** A typo in an id is a 400,
  never a silently dropped line.
- **One `n=` per node.** Repeated ids are a 400.
- **A group lists ids, it does not create them.**
- **Positions are grid cells, not pixels**, unless you write the `p` form.
- **The type vocabulary is per kind.** `process` is not a type in an
  architecture diagram; `fe` is not a type in a data flow diagram.
- **A label that is wider than the gap between two nodes pushes the columns
  apart** — the engine widens the column so the label has room instead of
  landing on top of a node.
