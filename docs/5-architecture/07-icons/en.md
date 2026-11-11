---
x-title: Icons — a cloud architecture diagram wants icons
x-desc: 'x-cmd/draw icon library: the open-source icons from mingrammer/diagrams (Apache-2.0), embedded as data URIs; architecture nodes can carry an icon (`n=…;aws:ec2`).'
x-sidebar: draw icons
x-keywords: icons, diagrams, aws, azure, gcp, architecture, draw
x-json-ld:
  '@context': https://schema.org
  '@graph':
    - '@type': TechArticle
      headline: 'draw icons'
      inLanguage: 'en'
      about: 'x-cmd/draw 07-icons'
---

# Icons — a cloud architecture diagram wants icons

A cloud architecture diagram is about AWS / Azure / GCP. **Without icons the
reader cannot tell what the boxes are** — "a box labelled API" and "a box with
Lambda's orange glyph" are not the same thing.

The icons come from the open-source library in
[mingrammer/diagrams](https://github.com/mingrammer/diagrams) (Apache-2.0). We
took the common ones: 62, scaled to 48×48, quantised to a palette and
**embedded as data URIs** — so the SVG and the PNG both carry them, with no
external fetch and no network.

## How to use

The node syntax gains one optional field:
`n=id;type;label[;subtitle][;position][;icon]`

```text
n=api;be;API service;ECS Fargate;r2c0;aws:ecs
n=db;db;RDS;PostgreSQL;r3c0;aws:rds
```

The icon lands where the type badge is (that little square in the top-left
corner) — with an icon there is no type letter.

> The icon field can sit before or after the subtitle/position: whatever looks
> like `aws:ec2` is the icon, whatever looks like `r0c1` is the position, and
> anything else is the subtitle.

## What is in there

**AWS (43)** — `ec2` | `lambda` | `ecs` | `eks` | `fargate` | `batch` | `s3` | `ebs` | `efs` | `rds` | `aurora` | `dynamodb` | `redis` | `redshift` | `apigw` | `cloudfront` | `alb` | `nlb` | `route53` | `vpc` | `nat` | `igw` | `cloudwatch` | `cloudformation` | `cloudtrail` | `eventbridge` | `sns` | `sqs` | `stepfn` | `glue` | `athena` | `kinesis` | `quicksight` | `es` | `secrets` | `kms` | `acm` | `cognito` | `codebuild` | `codepipeline` | `codedeploy` | `ecr` | `opensearch`

**Azure (8)** — `app` | `aci` | `container` | `cosmos` | `sql` | `redis` | `blob` | `ad`

**GCP (11)** — `gce` | `func` | `gke` | `run` | `sql` | `firestore` | `spanner` | `bigtable` | `redis` | `gcs` | `disk`

Want more? The library is open source, and
[`scripts/vendor-icons.mjs`](https://github.com/x-cmd/draw/blob/main/scripts/vendor-icons.mjs)
takes one more line per icon — it downloads, scales to 48×48, quantises, and
regenerates `src/render/icons.ts`.

## Example

A three-tier web app on AWS:

```text
https://x-cmd.com/draw/arch2?n=cf;cloud;CloudFront;CDN;r0c0;aws:cloudfront&n=s3;db;S3;静态资源;r0c1;aws:s3&n=igw;cloud;Internet Gateway;公网入口;r1c1;aws:igw&n=alb;cloud;ALB;HTTPS 443;r1c0;aws:alb&n=api;be;API 服务;ECS Fargate;r2c0;aws:ecs&n=lam;be;Lambda;异步任务;r2c1;aws:lambda&n=rds;db;RDS;PostgreSQL;r3c0;aws:rds&n=redis;db;ElastiCache;会话缓存;r3c1;aws:redis&e=igw;alb;公网&e=cf;alb;转发&e=cf;s3;静态&e=alb;api&e=api;rds;查询&e=api;redis;缓存&e=api;lam;异步&b=Public subnet;cf s3 igw alb&b=Private subnet;api lam rds redis&title=Three-tier web app on AWS&w=760
```

More in the showcase: [Cloud architecture — five real designs](https://www.x-cmd.com/draw/docs/cloud-architecture).

## Trade-offs

- **62 icons, not two thousand.** The library has thousands of service icons;
  taking them all would bloat the repository. The common ones come first, and
  adding more is one line of script.
- **Embedded, not linked.** A link would keep the SVG small, but the PNG output
  would lose the icons (resvg does not fetch them) — and the PNG is the one that
  ends up in a README. Embedding costs a few KB per SVG.
- **48×48, palette.** The sources are 512×512 PNGs (tens of KB); scaled to
  48×48 and quantised, one icon is about 2KB — twenty KB more for a ten-node
  diagram, which is fine.
