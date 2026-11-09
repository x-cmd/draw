---
x-title: Architecture diagram — authored cells, auto-routed
x-desc: 'x-cmd/draw architecture diagram quick reference (`/draw/archmap`). You place the nodes on a grid; the engine packs them, routes the edges and draws the boundary groups. Params: `n=` node (`id;type;label[;sub][;pos]`), `e=` edge (`from;to[;label][;variant]`), `b=` boundary (`label;id id …`), `t=` style (base/mono/soft), `title=`, `w=/h=`, `grid=`.'
x-sidebar: draw architecture diagram
x-keywords: architecture diagram, 架构图, draw, svg, topology, system design
x-json-ld:
  '@context': https://schema.org
  '@graph':
    - '@type': TechArticle
      headline: 'draw architecture diagram'
      inLanguage: 'en'
      about: 'x-cmd/draw 01-archmap'
---

# Architecture diagram — you place the cells, the engine routes

> This page is a stub: the examples below are live, the full write-up is still to come.

You draw the boxes on a grid, name the edges, and the engine packs the boxes,
routes the lines and draws the boundary groups. Nothing is laid out by hand.

```text
https://x-cmd.com/draw/archmap?n=web;fe;Browser;r0c0&n=cdn;cloud;CDN;r0c1&n=gw;be;API%20Gateway;auth;r0c2&n=auth;be;Auth%20Service;r1c1&n=render;be;Chart%20Render;r1c2&n=pg;db;Postgres;r2c1&n=cache;db;Redis;r2c2&e=web;cdn&e=cdn;gw&e=gw;auth&e=gw;render&e=auth;pg&e=render;pg&e=render;cache&b=Data%20Layer;pg%20cache
```

[![Three-tier web app](https://x-cmd.com/draw/archmap?n=web;fe;Browser;r0c0&n=cdn;cloud;CDN;r0c1&n=gw;be;API%20Gateway;auth;r0c2&n=auth;be;Auth%20Service;r1c1&n=render;be;Chart%20Render;r1c2&n=pg;db;Postgres;r2c1&n=cache;db;Redis;r2c2&e=web;cdn&e=cdn;gw&e=gw;auth&e=gw;render&e=auth;pg&e=render;pg&e=render;cache&b=Data%20Layer;pg%20cache)](https://x-cmd.com/draw/explore/archmap?n=web;fe;Browser;r0c0&n=cdn;cloud;CDN;r0c1&n=gw;be;API%20Gateway;auth;r0c2&n=auth;be;Auth%20Service;r1c1&n=render;be;Chart%20Render;r1c2&n=pg;db;Postgres;r2c1&n=cache;db;Redis;r2c2&e=web;cdn&e=cdn;gw&e=gw;auth&e=gw;render&e=auth;pg&e=render;pg&e=render;cache&b=Data%20Layer;pg%20cache)

A Kubernetes topology with a namespace boundary:

```text
https://x-cmd.com/draw/archmap?n=ing;cloud;Ingress;r0c0&n=svc;cloud;Service;r0c1&n=p1;be;Pod%20api-a;r1c0&n=p2;be;Pod%20api-b;r1c1&n=db;db;StatefulSet;r2c0&n=tw;fe;Web%20UI;r0c2&e=tw;svc&e=ing;svc&e=svc;p1&e=svc;p2&e=p1;db&e=p2;db&b=Namespace;p1%20p2&title=Kubernetes%20topology&w=560
```

[![Kubernetes topology](https://x-cmd.com/draw/archmap?n=ing;cloud;Ingress;r0c0&n=svc;cloud;Service;r0c1&n=p1;be;Pod%20api-a;r1c0&n=p2;be;Pod%20api-b;r1c1&n=db;db;StatefulSet;r2c0&n=tw;fe;Web%20UI;r0c2&e=tw;svc&e=ing;svc&e=svc;p1&e=svc;p2&e=p1;db&e=p2;db&b=Namespace;p1%20p2&title=Kubernetes%20topology&w=560)](https://x-cmd.com/draw/explore/archmap?n=ing;cloud;Ingress;r0c0&n=svc;cloud;Service;r0c1&n=p1;be;Pod%20api-a;r1c0&n=p2;be;Pod%20api-b;r1c1&n=db;db;StatefulSet;r2c0&n=tw;fe;Web%20UI;r0c2&e=tw;svc&e=ing;svc&e=svc;p1&e=svc;p2&e=p1;db&e=p2;db&b=Namespace;p1%20p2&title=Kubernetes%20topology&w=560)

## 1. Parameters

| param | meaning | default |
| --- | --- | --- |
| `n=` | a node: `id;type;label[;sublabel][;position]` — repeat for each node | — |
| `e=` | an edge: `from;to[;label][;variant]`, `variant` is `main` or `dash` | — |
| `b=` | a boundary: `label;id id …` — the named nodes are boxed together | — |
| `t=` | style: `base`, `mono` (line art) or `soft` | `base` |
| `title=` | diagram title | — |
| `w=` / `h=` | minimum width / height | natural size |
| `grid=` | force a grid of 1–12 columns | auto |

Node types: `ext` `fe` `be` `db` `cloud` `sec` `bus` `svc`.
Position is a grid cell `r0c1` (optionally `r0c1w2` to span) or pixels `p40,80`.

## 2. Pitfalls

- **Node ids must exist before an edge can name them** — an `e=` that points at
  an unknown id is a 400, not a silently dropped line.
- **One `n=` per node.** Repeated ids are a 400; give every box its own id.
- **A boundary lists members by id**, space separated — a boundary with no
  members is a 400.

