---
x-title: 三维架构图 —— 高度轴就是「流到哪儿了」
x-desc: 'x-cmd/draw 三维架构图(`/draw/arch3d`):与 arch2 同一套 `n=`/`e=`/`b=` 语法,画成能转的三维场景。高度轴是流的深度 —— 源在上、汇在下,引擎按边自动分层。参数:`view=flat` 出平面图,`bstyle=`/`planes=`/`aux=` 控制辅助线。'
x-sidebar: 三维架构图
x-keywords: 三维架构图, 架构图, 3D architecture, isometric, draw, svg, arch3d, 等轴测
x-json-ld:
  '@context': https://schema.org
  '@graph':
    - '@type': TechArticle
      headline: 'draw 三维架构图'
      inLanguage: 'cn'
      about: 'x-cmd/draw 08-arch3d'
---

# 三维架构图 —— 高度轴就是「流到哪儿了」

`/draw/arch3d` 是 `/draw/arch2` 的三维版:同样的 `n=` 节点、`e=` 边、`b=` 分组,
画出来是同一个图,只是从平面的盒子换成一个**等轴测的三维场景** ——
每个节点是一块方板,图标贴在板上,标签在板下。

跟平面图最大的不同是**高度轴**:它不是装饰,讲的是「流量流到哪儿了」。
引擎把每个连通分量去环、沿最长路径分层:只有出边的源在最上面(SOURCE),
只有入边的汇在最下面(SINK),中间的都待在中层(MID)。
三层叠起来,一张「请求从哪儿进来、落到哪儿去」的图就立起来了。

静态 SVG 是默认相机那一眼等轴测;[explore 页](https://x-cmd.com/draw/explore/arch3d?n=gw;cloud;API%20Gateway;REST%20entry&n=fn;be;Lambda;Business%20logic&e=gw;fn)
里可以用鼠标转着看。

## 参数

| 参数 | 意思 |
|---|---|
| `n=` | 节点:`id;type;label[;sub][;pos][;icon]`(type:`fe` `be` `db` `cloud` `sec` `bus` `svc` `ext`),可重复 |
| `e=` | 边:`from;to[;label][;main\|dash]`,可重复 |
| `b=` | 分组:`label;id id …`,可重复 |
| `view=flat` | 不出三维场景,出二维版(各层一张平面图,并排摆) |
| `bstyle=` | 分组的辅助线:`plain`(缺省,只留牌子)/ `tint` / `dash` |
| `planes=1` | 把每一层的平面画出来(缺省不画) |
| `aux=1` | 地板网格 + 分组线框(缺省不画) |

节点里的**位置段在三维版里不生效** —— 层是引擎按边算出来的,不是手摆的,
写了 `r0c1` 也会被忽略。第六段 `icon` 生效:写 `aws:cloudfront` 这类
`provider:name`,板上就贴对应的公司图标(图标族随站上服务分发)。

## 例子

### AWS 三层架构

```text
https://x-cmd.com/draw/arch3d?n=cf;cloud;CloudFront;CDN;r0c0;aws:cloudfront&n=s3;db;S3;Static%20assets&n=igw;cloud;Internet%20Gateway&n=alb;cloud;ALB;HTTPS%20443&n=api;be;API%20service;ECS%20Fargate&n=lam;be;Lambda;Async&n=rds;db;RDS;PostgreSQL&n=redis;db;ElastiCache;Session&e=igw;alb;Public&e=cf;alb;Forward&e=cf;s3;Static&e=alb;api&e=api;rds;Query&e=api;redis;Cache&e=api;lam;Async&b=Public%20subnet;cf%20s3%20igw%20alb&b=Private%20subnet;api%20lam%20rds%20redis
```

[![三维 · AWS 三层架构](https://x-cmd.com/draw/arch3d?n=cf;cloud;CloudFront;CDN;r0c0;aws:cloudfront&n=s3;db;S3;Static%20assets&n=igw;cloud;Internet%20Gateway&n=alb;cloud;ALB;HTTPS%20443&n=api;be;API%20service;ECS%20Fargate&n=lam;be;Lambda;Async&n=rds;db;RDS;PostgreSQL&n=redis;db;ElastiCache;Session&e=igw;alb;Public&e=cf;alb;Forward&e=cf;s3;Static&e=alb;api&e=api;rds;Query&e=api;redis;Cache&e=api;lam;Async&b=Public%20subnet;cf%20s3%20igw%20alb&b=Private%20subnet;api%20lam%20rds%20redis)](https://x-cmd.com/draw/explore/arch3d?n=cf;cloud;CloudFront;CDN;r0c0;aws:cloudfront&n=s3;db;S3;Static%20assets&n=igw;cloud;Internet%20Gateway&n=alb;cloud;ALB;HTTPS%20443&n=api;be;API%20service;ECS%20Fargate&n=lam;be;Lambda;Async&n=rds;db;RDS;PostgreSQL&n=redis;db;ElastiCache;Session&e=igw;alb;Public&e=cf;alb;Forward&e=cf;s3;Static&e=alb;api&e=api;rds;Query&e=api;redis;Cache&e=api;lam;Async&b=Public%20subnet;cf%20s3%20igw%20alb&b=Private%20subnet;api%20lam%20rds%20redis)

入口(`igw`、`cf`)被边抬到了最上层,数据(`rds`、`redis`)沉到了最下面 ——
不用解释,看一眼就明白这趟请求的流向。

### 无服务器 API

```text
https://x-cmd.com/draw/arch3d?n=gw;cloud;API%20Gateway;REST%20entry&n=fn;be;Lambda;Business%20logic&n=ddb;db;DynamoDB;Items&n=sqs;bus;SQS;Async%20queue&n=iam;sec;IAM;Least%20privilege&n=cog;be;CloudWatch;Metrics&e=gw;fn;Sync&e=gw;sqs;Enqueue&e=fn;ddb;Read%20write&e=sqs;fn;Consume&e=iam;fn;Grant&e=fn;cog;Trace&b=Edge;gw%20iam&b=Compute;fn%20sqs&b=Data;ddb
```

[![三维 · 无服务器 API](https://x-cmd.com/draw/arch3d?n=gw;cloud;API%20Gateway;REST%20entry&n=fn;be;Lambda;Business%20logic&n=ddb;db;DynamoDB;Items&n=sqs;bus;SQS;Async%20queue&n=iam;sec;IAM;Least%20privilege&n=cog;be;CloudWatch;Metrics&e=gw;fn;Sync&e=gw;sqs;Enqueue&e=fn;ddb;Read%20write&e=sqs;fn;Consume&e=iam;fn;Grant&e=fn;cog;Trace&b=Edge;gw%20iam&b=Compute;fn%20sqs&b=Data;ddb)](https://x-cmd.com/draw/explore/arch3d?n=gw;cloud;API%20Gateway;REST%20entry&n=fn;be;Lambda;Business%20logic&n=ddb;db;DynamoDB;Items&n=sqs;bus;SQS;Async%20queue&n=iam;sec;IAM;Least%20privilege&n=cog;be;CloudWatch;Metrics&e=gw;fn;Sync&e=gw;sqs;Enqueue&e=fn;ddb;Read%20write&e=sqs;fn;Consume&e=iam;fn;Grant&e=fn;cog;Trace&b=Edge;gw%20iam&b=Compute;fn%20sqs&b=Data;ddb)

### 数据管道

```text
https://x-cmd.com/draw/arch3d?n=raw;db;S3;Raw&n=crawl;be;Glue;Crawler&n=etl;be;Glue%20ETL;Clean&n=rs;db;Redshift;Warehouse&n=qs;fe;QuickSight;Dashboard&n=ath;be;Athena;Ad-hoc&e=raw;crawl;Scan&e=crawl;etl;Tables&e=etl;rs;Load&e=rs;qs;Model&e=rs;ath;Query&b=Lake;raw%20crawl&b=Warehouse;etl%20rs%20ath%20qs
```

[![三维 · 数据管道](https://x-cmd.com/draw/arch3d?n=raw;db;S3;Raw&n=crawl;be;Glue;Crawler&n=etl;be;Glue%20ETL;Clean&n=rs;db;Redshift;Warehouse&n=qs;fe;QuickSight;Dashboard&n=ath;be;Athena;Ad-hoc&e=raw;crawl;Scan&e=crawl;etl;Tables&e=etl;rs;Load&e=rs;qs;Model&e=rs;ath;Query&b=Lake;raw%20crawl&b=Warehouse;etl%20rs%20ath%20qs)](https://x-cmd.com/draw/explore/arch3d?n=raw;db;S3;Raw&n=crawl;be;Glue;Crawler&n=etl;be;Glue%20ETL;Clean&n=rs;db;Redshift;Warehouse&n=qs;fe;QuickSight;Dashboard&n=ath;be;Athena;Ad-hoc&e=raw;crawl;Scan&e=crawl;etl;Tables&e=etl;rs;Load&e=rs;qs;Model&e=rs;ath;Query&b=Lake;raw%20crawl&b=Warehouse;etl%20rs%20ath%20qs)

## 限制

- **位置段不生效。** 三维版的分层是引擎对每个连通分量去环、沿最长路径算出来的,
  `r0c1` 这类格子坐标会被忽略;想让某节点换层,得改边,不是改坐标。
- **静态图是默认相机那一眼。** SVG 拿到的永远是等轴测视角;要旋转,
  去 explore 页(explore 拿同一份场景,换相机再投影一遍)。
- **辅助线默认全关。** `bstyle=`/`planes=`/`aux=` 这三个开关画出来的
  分组框、层平面、地板网格,都是「要讲解时才打开」的东西,平时不画。
- **每个连通分量各自分层。** 图里有几块互不相连的子图时,每块都按自己的
  源/中/汇分三层 —— 子图之间没有高度上的对齐。

## 跟别的图种的区别

- **`/draw/arch2`、`/draw/archmap`**:同一套 `n=`/`e=`/`b=` 的平面图 ——
  盒子、徽标、正交走线。要打印、要贴在文档正文里,用平面版;
  要在演示里讲「流到哪儿了」,用三维版。`view=flat` 可以把同一张图
  打回三张平面图并排,正好对照。
- **`/draw/seq`**:时序图讲「谁先谁后」,三维架构图讲「谁在上游、谁在下游」——
  一个是时间轴,一个是流量深度。

图库里还有更多:[/draw/demo/arch](https://x-cmd.com/draw/demo/arch)。
