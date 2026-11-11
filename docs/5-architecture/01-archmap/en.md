---
x-title: Architecture diagram — you place the cells, the engine routes
x-desc: 'x-cmd/draw architecture diagram (`/draw/archmap`). Grid-placed nodes, engine-routed edges, boundary groups. Params: `n=` node (`id;type;label[;sub][;pos]`), `e=` edge (`from;to[;label][;variant]`), `b=` boundary (`label;id id`), `t=` style (base/mono/soft), `grid=`, `title=`, `w=/h=`.'
x-sidebar: draw architecture diagram
x-keywords: architecture diagram, 架构图, draw, svg, topology, system design, kubernetes
x-json-ld:
  '@context': https://schema.org
  '@graph':
    - '@type': TechArticle
      headline: 'draw architecture diagram'
      inLanguage: 'en'
      about: 'x-cmd/draw 01-archmap'
---

# Architecture diagram — you place the cells, the engine routes

You name the boxes and say which one points at which. The engine sizes the
boxes, packs them onto the grid you gave, routes the lines around them and
draws the boundary groups. Nothing is positioned by hand.

## Examples (what you see is what the URL gives; click to explore)

### A three-tier web app

```text
https://x-cmd.com/draw/archmap?n=web;fe;Browser;r0c0&n=cdn;cloud;CDN;r0c1&n=gw;be;API%20Gateway;auth;r0c2&n=auth;be;Auth%20Service;r1c1&n=render;be;Chart%20Render;r1c2&n=pg;db;Postgres;r2c1&n=cache;db;Redis;r2c2&e=web;cdn&e=cdn;gw&e=gw;auth&e=gw;render&e=auth;pg&e=render;pg&e=render;cache&b=Data%20Layer;pg%20cache
```

[![Three-tier web app](https://x-cmd.com/draw/archmap?n=web;fe;Browser;r0c0&n=cdn;cloud;CDN;r0c1&n=gw;be;API%20Gateway;auth;r0c2&n=auth;be;Auth%20Service;r1c1&n=render;be;Chart%20Render;r1c2&n=pg;db;Postgres;r2c1&n=cache;db;Redis;r2c2&e=web;cdn&e=cdn;gw&e=gw;auth&e=gw;render&e=auth;pg&e=render;pg&e=render;cache&b=Data%20Layer;pg%20cache)](https://x-cmd.com/draw/explore/archmap?n=web;fe;Browser;r0c0&n=cdn;cloud;CDN;r0c1&n=gw;be;API%20Gateway;auth;r0c2&n=auth;be;Auth%20Service;r1c1&n=render;be;Chart%20Render;r1c2&n=pg;db;Postgres;r2c1&n=cache;db;Redis;r2c2&e=web;cdn&e=cdn;gw&e=gw;auth&e=gw;render&e=auth;pg&e=render;pg&e=render;cache&b=Data%20Layer;pg%20cache)

The `Data Layer` box is a **boundary**: the two nodes named in it are boxed
together, so the reader sees which tier owns what.

### The same diagram in the other two styles

```text
https://x-cmd.com/draw/archmap?t=mono&n=web;fe;Browser;r0c0&n=cdn;cloud;CDN;r0c1&n=gw;be;API%20Gateway;auth;r0c2&n=auth;be;Auth%20Service;r1c1&n=render;be;Chart%20Render;r1c2&n=pg;db;Postgres;r2c1&n=cache;db;Redis;r2c2&e=web;cdn&e=cdn;gw&e=gw;auth&e=gw;render&e=auth;pg&e=render;pg&e=render;cache&b=Data%20Layer;pg%20cache
```

[![Three-tier web app · mono](https://x-cmd.com/draw/archmap?t=mono&n=web;fe;Browser;r0c0&n=cdn;cloud;CDN;r0c1&n=gw;be;API%20Gateway;auth;r0c2&n=auth;be;Auth%20Service;r1c1&n=render;be;Chart%20Render;r1c2&n=pg;db;Postgres;r2c1&n=cache;db;Redis;r2c2&e=web;cdn&e=cdn;gw&e=gw;auth&e=gw;render&e=auth;pg&e=render;pg&e=render;cache&b=Data%20Layer;pg%20cache)](https://x-cmd.com/draw/explore/archmap?t=mono&n=web;fe;Browser;r0c0&n=cdn;cloud;CDN;r0c1&n=gw;be;API%20Gateway;auth;r0c2&n=auth;be;Auth%20Service;r1c1&n=render;be;Chart%20Render;r1c2&n=pg;db;Postgres;r2c1&n=cache;db;Redis;r2c2&e=web;cdn&e=cdn;gw&e=gw;auth&e=gw;render&e=auth;pg&e=render;pg&e=render;cache&b=Data%20Layer;pg%20cache)

`mono` drops the fills and leaves line art — the one that survives a
photocopy. `soft` (below) is the pastel version:

```text
https://x-cmd.com/draw/archmap?t=soft&n=web;fe;Browser;r0c0&n=cdn;cloud;CDN;r0c1&n=gw;be;API%20Gateway;auth;r0c2&n=auth;be;Auth%20Service;r1c1&n=render;be;Chart%20Render;r1c2&n=pg;db;Postgres;r2c1&n=cache;db;Redis;r2c2&e=web;cdn&e=cdn;gw&e=gw;auth&e=gw;render&e=auth;pg&e=render;pg&e=render;cache&b=Data%20Layer;pg%20cache
```

[![Three-tier web app · soft](https://x-cmd.com/draw/archmap?t=soft&n=web;fe;Browser;r0c0&n=cdn;cloud;CDN;r0c1&n=gw;be;API%20Gateway;auth;r0c2&n=auth;be;Auth%20Service;r1c1&n=render;be;Chart%20Render;r1c2&n=pg;db;Postgres;r2c1&n=cache;db;Redis;r2c2&e=web;cdn&e=cdn;gw&e=gw;auth&e=gw;render&e=auth;pg&e=render;pg&e=render;cache&b=Data%20Layer;pg%20cache)](https://x-cmd.com/draw/explore/archmap?t=soft&n=web;fe;Browser;r0c0&n=cdn;cloud;CDN;r0c1&n=gw;be;API%20Gateway;auth;r0c2&n=auth;be;Auth%20Service;r1c1&n=render;be;Chart%20Render;r1c2&n=pg;db;Postgres;r2c1&n=cache;db;Redis;r2c2&e=web;cdn&e=cdn;gw&e=gw;auth&e=gw;render&e=auth;pg&e=render;pg&e=render;cache&b=Data%20Layer;pg%20cache)

### A Kubernetes topology with a namespace boundary

```text
https://x-cmd.com/draw/archmap?n=ing;cloud;Ingress;r0c0&n=svc;cloud;Service;r0c1&n=p1;be;Pod%20api-a;r1c0&n=p2;be;Pod%20api-b;r1c1&n=db;db;StatefulSet;r2c0&n=tw;fe;Web%20UI;r0c2&e=tw;svc&e=ing;svc&e=svc;p1&e=svc;p2&e=p1;db&e=p2;db&b=Namespace;p1%20p2&title=Kubernetes%20topology&w=560
```

[![Kubernetes topology](https://x-cmd.com/draw/archmap?n=ing;cloud;Ingress;r0c0&n=svc;cloud;Service;r0c1&n=p1;be;Pod%20api-a;r1c0&n=p2;be;Pod%20api-b;r1c1&n=db;db;StatefulSet;r2c0&n=tw;fe;Web%20UI;r0c2&e=tw;svc&e=ing;svc&e=svc;p1&e=svc;p2&e=p1;db&e=p2;db&b=Namespace;p1%20p2&title=Kubernetes%20topology&w=560)](https://x-cmd.com/draw/explore/archmap?n=ing;cloud;Ingress;r0c0&n=svc;cloud;Service;r0c1&n=p1;be;Pod%20api-a;r1c0&n=p2;be;Pod%20api-b;r1c1&n=db;db;StatefulSet;r2c0&n=tw;fe;Web%20UI;r0c2&e=tw;svc&e=ing;svc&e=svc;p1&e=svc;p2&e=p1;db&e=p2;db&b=Namespace;p1%20p2&title=Kubernetes%20topology&w=560)

## 1. Parameters

| param | meaning | default |
|---|---|---|
| `n=` | a node: `id;type;label[;sublabel][;position]` — repeat for each node | — |
| `e=` | an edge: `from;to[;label][;variant]` | — |
| `b=` | a boundary: `label;id id …` | — |
| `t=` | style: `base`, `mono` (line art) or `soft` (pastel) | `base` |
| `grid=` | force the grid to 1–12 columns | auto |
| `title=` | diagram title | — |
| `w=` / `h=` | minimum width / height | natural size |
| `v=` | freeze the response at a version | latest |

## 2. A newer look: `/draw/arch2`

Same URL model (`n=` / `e=` / `b=`), different face — the node types get
colours, each node carries a type badge, and the diagram ends with a legend:

```text
https://x-cmd.com/draw/arch2?n=api;be;API%20Gateway;auth;r1c0w2
```

`/draw/archmap` is unchanged and stays where it is; `/draw/arch2` is the one
to reach for when the diagram is going in front of people. In v2 the boundary
frames are coloured — pick one with an optional third field
(`b=AWS Region;cdn lb api;9`), or let draw choose a colour the node types
are not using. Edges that have to go around a box stay inside the frame they
belong to.

## 3. The node line

```
n=id;type;label[;sublabel][;position]
```

- **id** — the name you use in `e=` and `b=`. Letters, digits, dot, dash,
  underscore; it may not start with a digit or a punctuation mark.
- **type** — what the box is, which decides its colour and its icon:

| type | it is |
|---|---|
| `fe` | front end — browser, app, UI |
| `be` | back end — service, worker, API |
| `db` | database — Postgres, Redis, a store |
| `cloud` | cloud or managed service |
| `ext` | external system — a third party |
| `sec` | security — auth, gateway, WAF |
| `bus` | bus — queue, topic, stream |
| `svc` | generic service |

- **label** — the text in the box.
- **sublabel** — the smaller second line, optional.
- **position** — where the box goes, optional. A grid cell `r0c1` (row 0,
  column 1) or `r0c1w2` to span two columns; or pixels `p40,80` or
  `p40,80,120x48` for an exact box.

Leave the position out and the engine packs the boxes itself, in the order
you gave them (`/draw/arch2` does better: it lays the graph out in layers —
ranked by dependency, few crossings — see
[diagram URLs](../../1-overview/06-diagram-urls/en.md)).

## 4. The edge line

```
e=from;to[;label][;variant]
```

- **from** / **to** — node ids. Both must exist.
- **label** — text on the line.
- **variant** — `main` for the line that carries the main flow, `dash` for a
  secondary one.

## 5. The boundary line

```
b=label;id id …
```

Everything named after the semicolon is boxed together under the label. A
boundary with no members is a 400.

## 6. Pitfalls

- **An edge can only point at a node that exists** — a typo in an id is a
  400, not a silently dropped line.
- **One `n=` per node.** Repeated ids are a 400; every box needs its own id.
- **A boundary lists members by id**, space separated — it does not create
  the nodes.
- **Positions are grid cells, not pixels**, unless you write the `p` form.
  A node without a position is packed by the engine.
- **`grid=` sets the column count** (1–12) for the packed nodes; nodes with
  an explicit cell keep their place.

