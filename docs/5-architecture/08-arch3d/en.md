---
x-title: 3D architecture — the height axis is "where the flow ends up"
x-desc: 'x-cmd/draw 3D architecture (`/draw/arch3d`): the same `n=`/`e=`/`b=` grammar as arch2, drawn as a rotatable 3D scene. The height axis is flow depth — sources on top, sinks at the bottom, layered automatically from the edges. Params: `view=flat` for the flat version, `bstyle=`/`planes=`/`aux=` for the guides.'
x-sidebar: draw 3D architecture
x-keywords: 3D architecture diagram, isometric diagram, draw, svg, arch3d, architecture
x-json-ld:
  '@context': https://schema.org
  '@graph':
    - '@type': TechArticle
      headline: 'draw 3D architecture'
      inLanguage: 'en'
      about: 'x-cmd/draw 08-arch3d'
---

# 3D architecture — the height axis is "where the flow ends up"

`/draw/arch3d` is the 3D sibling of `/draw/arch2`: the same `n=` nodes, `e=` edges
and `b=` groups, but the picture is an **isometric 3D scene** — every node is a
square tile, its icon on the tile, its label underneath.

The big difference from the flat version is the **height axis**. It is not
decoration: it shows where the flow ends up. The engine takes each connected
component, breaks cycles and walks the longest path: sources (outgoing edges
only) float on top (SOURCE), sinks (incoming edges only) sit at the bottom
(SINK), and everything else stays in the middle (MID). Stacked up, the diagram
reads as "where a request comes in and where it lands".

The static SVG is one isometric view from the default camera; on the
[explore page](https://x-cmd.com/draw/explore/arch3d?n=gw;cloud;API%20Gateway;REST%20entry&n=fn;be;Lambda;Business%20logic&e=gw;fn)
you can rotate the same scene with the mouse.

## Parameters

| param | meaning |
|---|---|
| `n=` | node: `id;type;label[;sub][;pos][;icon]` (type: `fe` `be` `db` `cloud` `sec` `bus` `svc` `ext`), repeatable |
| `e=` | edge: `from;to[;label][;main\|dash]`, repeatable |
| `b=` | group: `label;id id …`, repeatable |
| `view=flat` | skip the 3D scene and render the flat version (one plane per tier, side by side) |
| `bstyle=` | group guides: `plain` (default, badge only) / `tint` / `dash` |
| `planes=1` | draw the plane of each tier (off by default) |
| `aux=1` | floor grid + group wireframes (off by default) |

The **position field of a node is ignored** in the 3D version — tiers are
derived from the edges, not hand-placed; `r0c1` will not do anything. The sixth
field `icon` does work: write `provider:name` (e.g. `aws:cloudfront`) and the
matching vendor icon is drawn on the tile (the icon set ships with the service).

## Examples

### Three tiers on AWS

```text
https://x-cmd.com/draw/arch3d?n=cf;cloud;CloudFront;CDN;r0c0;aws:cloudfront&n=s3;db;S3;Static%20assets&n=igw;cloud;Internet%20Gateway&n=alb;cloud;ALB;HTTPS%20443&n=api;be;API%20service;ECS%20Fargate&n=lam;be;Lambda;Async&n=rds;db;RDS;PostgreSQL&n=redis;db;ElastiCache;Session&e=igw;alb;Public&e=cf;alb;Forward&e=cf;s3;Static&e=alb;api&e=api;rds;Query&e=api;redis;Cache&e=api;lam;Async&b=Public%20subnet;cf%20s3%20igw%20alb&b=Private%20subnet;api%20lam%20rds%20redis
```

[![3D · three tiers on AWS](https://x-cmd.com/draw/arch3d?n=cf;cloud;CloudFront;CDN;r0c0;aws:cloudfront&n=s3;db;S3;Static%20assets&n=igw;cloud;Internet%20Gateway&n=alb;cloud;ALB;HTTPS%20443&n=api;be;API%20service;ECS%20Fargate&n=lam;be;Lambda;Async&n=rds;db;RDS;PostgreSQL&n=redis;db;ElastiCache;Session&e=igw;alb;Public&e=cf;alb;Forward&e=cf;s3;Static&e=alb;api&e=api;rds;Query&e=api;redis;Cache&e=api;lam;Async&b=Public%20subnet;cf%20s3%20igw%20alb&b=Private%20subnet;api%20lam%20rds%20redis)](https://x-cmd.com/draw/explore/arch3d?n=cf;cloud;CloudFront;CDN;r0c0;aws:cloudfront&n=s3;db;S3;Static%20assets&n=igw;cloud;Internet%20Gateway&n=alb;cloud;ALB;HTTPS%20443&n=api;be;API%20service;ECS%20Fargate&n=lam;be;Lambda;Async&n=rds;db;RDS;PostgreSQL&n=redis;db;ElastiCache;Session&e=igw;alb;Public&e=cf;alb;Forward&e=cf;s3;Static&e=alb;api&e=api;rds;Query&e=api;redis;Cache&e=api;lam;Async&b=Public%20subnet;cf%20s3%20igw%20alb&b=Private%20subnet;api%20lam%20rds%20redis)

The entry points (`igw`, `cf`) are lifted to the top tier and the data stores
(`rds`, `redis`) sink to the bottom — no caption needed, the direction of the
request is visible at a glance.

### Serverless API

```text
https://x-cmd.com/draw/arch3d?n=gw;cloud;API%20Gateway;REST%20entry&n=fn;be;Lambda;Business%20logic&n=ddb;db;DynamoDB;Items&n=sqs;bus;SQS;Async%20queue&n=iam;sec;IAM;Least%20privilege&n=cog;be;CloudWatch;Metrics&e=gw;fn;Sync&e=gw;sqs;Enqueue&e=fn;ddb;Read%20write&e=sqs;fn;Consume&e=iam;fn;Grant&e=fn;cog;Trace&b=Edge;gw%20iam&b=Compute;fn%20sqs&b=Data;ddb
```

[![3D · serverless API](https://x-cmd.com/draw/arch3d?n=gw;cloud;API%20Gateway;REST%20entry&n=fn;be;Lambda;Business%20logic&n=ddb;db;DynamoDB;Items&n=sqs;bus;SQS;Async%20queue&n=iam;sec;IAM;Least%20privilege&n=cog;be;CloudWatch;Metrics&e=gw;fn;Sync&e=gw;sqs;Enqueue&e=fn;ddb;Read%20write&e=sqs;fn;Consume&e=iam;fn;Grant&e=fn;cog;Trace&b=Edge;gw%20iam&b=Compute;fn%20sqs&b=Data;ddb)](https://x-cmd.com/draw/explore/arch3d?n=gw;cloud;API%20Gateway;REST%20entry&n=fn;be;Lambda;Business%20logic&n=ddb;db;DynamoDB;Items&n=sqs;bus;SQS;Async%20queue&n=iam;sec;IAM;Least%20privilege&n=cog;be;CloudWatch;Metrics&e=gw;fn;Sync&e=gw;sqs;Enqueue&e=fn;ddb;Read%20write&e=sqs;fn;Consume&e=iam;fn;Grant&e=fn;cog;Trace&b=Edge;gw%20iam&b=Compute;fn%20sqs&b=Data;ddb)

### Data pipeline

```text
https://x-cmd.com/draw/arch3d?n=raw;db;S3;Raw&n=crawl;be;Glue;Crawler&n=etl;be;Glue%20ETL;Clean&n=rs;db;Redshift;Warehouse&n=qs;fe;QuickSight;Dashboard&n=ath;be;Athena;Ad-hoc&e=raw;crawl;Scan&e=crawl;etl;Tables&e=etl;rs;Load&e=rs;qs;Model&e=rs;ath;Query&b=Lake;raw%20crawl&b=Warehouse;etl%20rs%20ath%20qs
```

[![3D · data pipeline](https://x-cmd.com/draw/arch3d?n=raw;db;S3;Raw&n=crawl;be;Glue;Crawler&n=etl;be;Glue%20ETL;Clean&n=rs;db;Redshift;Warehouse&n=qs;fe;QuickSight;Dashboard&n=ath;be;Athena;Ad-hoc&e=raw;crawl;Scan&e=crawl;etl;Tables&e=etl;rs;Load&e=rs;qs;Model&e=rs;ath;Query&b=Lake;raw%20crawl&b=Warehouse;etl%20rs%20ath%20qs)](https://x-cmd.com/draw/explore/arch3d?n=raw;db;S3;Raw&n=crawl;be;Glue;Crawler&n=etl;be;Glue%20ETL;Clean&n=rs;db;Redshift;Warehouse&n=qs;fe;QuickSight;Dashboard&n=ath;be;Athena;Ad-hoc&e=raw;crawl;Scan&e=crawl;etl;Tables&e=etl;rs;Load&e=rs;qs;Model&e=rs;ath;Query&b=Lake;raw%20crawl&b=Warehouse;etl%20rs%20ath%20qs)

## Limits

- **Positions are ignored.** Tiers are computed per connected component
  (cycles broken, longest path walked); to move a node to another tier,
  change the edges, not a coordinate.
- **The static image is one fixed view.** The SVG is always the default
  isometric camera; to rotate, use the explore page (it re-projects the same
  scene with a movable camera).
- **Guides are all off by default.** `bstyle=`, `planes=` and `aux=` draw
  group frames, tier planes and the floor grid — turn them on only when the
  picture is meant to explain the layout itself.
- **Each connected component is layered on its own.** When the graph has
  disconnected pieces, every piece gets its own source/mid/sink stack —
  the pieces are not aligned in height.

## How it differs from the other kinds

- **`/draw/arch2`, `/draw/archmap`** — the same `n=`/`e=`/`b=` grammar in 2D:
  boxes, badges, orthogonal routing. Use the flat version for print and
  document bodies; use the 3D version to present "where the flow ends up".
  `view=flat` renders the same graph as one flat plane per tier, side by
  side — handy for a direct comparison.
- **`/draw/seq`** — a sequence diagram is about "who acts when"; the 3D
  architecture is about "who is upstream, who is downstream" — one is a
  time axis, the other a flow-depth axis.

More in the gallery: [/draw/demo/arch](https://x-cmd.com/draw/demo/arch).
