---
x-title: 图标 —— 云上架构图该有图标
x-desc: 'x-cmd/draw 图标库:来自 mingrammer/diagrams 的开源图标(Apache-2.0),内嵌成 data URI;架构图的节点可以带图标(`n=…;aws:ec2`)。'
x-sidebar: draw 图标
x-keywords: 图标, diagrams, aws, azure, gcp, 架构图, draw
x-json-ld:
  '@context': https://schema.org
  '@graph':
    - '@type': TechArticle
      headline: 'draw 图标'
      inLanguage: 'cn'
      about: 'x-cmd/draw 07-icons'
---

# 图标 —— 云上架构图该有图标

云上的架构图,画的是 AWS / Azure / GCP。**没有图标,读者认不出那堆方框是什么** ——
「一个方框,写着 API」和「一个方框,画着 Lambda 的橙图标」是两回事。

图标来自 [mingrammer/diagrams](https://github.com/mingrammer/diagrams) 的开源图标库
(Apache-2.0)。我们收的是常用的一批:62 个,缩到 48×48、量化成调色板,
**内嵌成 data URI** —— 所以 SVG 和 PNG 输出都带着它,不用外链,不用联网。

## 怎么用

节点语法多了一段(可选):`n=id;type;label[;副标题][;位置][;图标]`

```text
n=api;be;API 服务;ECS Fargate;r2c0;aws:ecs
n=db;db;RDS;PostgreSQL;r3c0;aws:rds
```

图标画在角标的位置(左上角那个小方块)—— 有图标就是图标,没有才是类型字母。

> 图标段可以放在副标题/位置的前面或后面:它长得像 `aws:ec2` 就认图标,
> 长得像 `r0c1` 就认位置,其余当副标题。

## 有哪些

**AWS(43 个)** —— `ec2` | `lambda` | `ecs` | `eks` | `fargate` | `batch` | `s3` | `ebs` | `efs` | `rds` | `aurora` | `dynamodb` | `redis` | `redshift` | `apigw` | `cloudfront` | `alb` | `nlb` | `route53` | `vpc` | `nat` | `igw` | `cloudwatch` | `cloudformation` | `cloudtrail` | `eventbridge` | `sns` | `sqs` | `stepfn` | `glue` | `athena` | `kinesis` | `quicksight` | `es` | `secrets` | `kms` | `acm` | `cognito` | `codebuild` | `codepipeline` | `codedeploy` | `ecr` | `opensearch`

**Azure(8 个)** —— `app` | `aci` | `container` | `cosmos` | `sql` | `redis` | `blob` | `ad`

**GCP(11 个)** —— `gce` | `func` | `gke` | `run` | `sql` | `firestore` | `spanner` | `bigtable` | `redis` | `gcs` | `disk`

想要更多?图标库是开源的,照着
[`scripts/vendor-icons.mjs`](https://github.com/x-cmd/draw/blob/main/scripts/vendor-icons.mjs)
加一行就能收进来 —— 脚本负责下载、缩到 48×48、量化,再重新生成 `src/render/icons.ts`。

## 例子

三层 Web 应用(AWS):

```text
https://x-cmd.com/draw/arch2?n=cf;cloud;CloudFront;CDN;r0c0;aws:cloudfront&n=s3;db;S3;静态资源;r0c1;aws:s3&n=igw;cloud;Internet Gateway;公网入口;r1c1;aws:igw&n=alb;cloud;ALB;HTTPS 443;r1c0;aws:alb&n=api;be;API 服务;ECS Fargate;r2c0;aws:ecs&n=lam;be;Lambda;异步任务;r2c1;aws:lambda&n=rds;db;RDS;PostgreSQL;r3c0;aws:rds&n=redis;db;ElastiCache;会话缓存;r3c1;aws:redis&e=igw;alb;公网&e=cf;alb;转发&e=cf;s3;静态&e=alb;api&e=api;rds;查询&e=api;redis;缓存&e=api;lam;异步&b=Public subnet;cf s3 igw alb&b=Private subnet;api lam rds redis&title=Three-tier web app on AWS&w=760
```

更多例子在场景页:[云上架构 —— 五个真的落地的架构](https://cn.x-cmd.com/draw/docs/cloud-architecture)。

## 大图标版:`/draw/cloud`

想要 [diagrams](https://github.com/mingrammer/diagrams) 那种**海报式**的云架构图 ——
节点不是方块,就是图标本身 —— 用另一个端点:

```text
https://x-cmd.com/draw/cloud?n=cf;cloud;CloudFront;CDN;r0c0;aws:cloudfront&n=alb;cloud;ALB;HTTPS 443;r1c0;aws:alb&n=api;be;API;ECS Fargate;r2c0;aws:ecs&n=rds;db;RDS;PostgreSQL;r3c0;aws:rds&e=cf;alb;转发&e=alb;api&e=api;rds;查询&b=Public subnet;cf alb&b=Private subnet;api rds&title=Three-tier on AWS&w=760
```

![云架构(大图标)](https://x-cmd.com/draw/cloud?n=cf;cloud;CloudFront;CDN;r0c0;aws:cloudfront&n=alb;cloud;ALB;HTTPS 443;r1c0;aws:alb&n=api;be;API;ECS Fargate;r2c0;aws:ecs&n=rds;db;RDS;PostgreSQL;r3c0;aws:rds&e=cf;alb;转发&e=alb;api&e=api;rds;查询&b=Public subnet;cf alb&b=Private subnet;api rds&title=Three-tier on AWS&w=760)

和 `/draw/arch2` 的区别只有两处:节点画成 64px 的图标(名字在下面),
连线只接图标那块(不穿名字)。`n=` `e=` `b=` 的写法完全一样。

## 取舍

- **收 62 个,不是两千个。** 图标库有几千个服务图标,全收进来仓库就撑不住了;
  常用的一批先够用,不够再加(一行脚本的事)。
- **内嵌,不外链。** 外链的话 SVG 很小,但 PNG 输出(resvg 不去抓外链)就没图标了 ——
  而 PNG 才是贴进 README 的那个。内嵌的代价是 SVG 大几 KB。
- **48×48 调色板。** 原图是 512×512 的 PNG(十几 KB),缩到 48×48 再量化,
  一个图标约 2KB —— 十个节点的图多 20KB,能接受。
