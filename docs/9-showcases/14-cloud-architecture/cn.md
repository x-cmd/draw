---
x-title: 云上架构 —— 五个真的落地的架构
x-desc: 'x-cmd/draw 场景用例:三层 Web 应用、CI/CD 流水线、数据管道、无服务器 API、EKS 上的微服务 —— 每一个都是 URL,节点带云厂商图标。'
x-sidebar: draw 场景用例 云架构
x-keywords: 云架构, AWS, Azure, GCP, 图标, 架构图, 微服务, CI/CD, draw 场景用例
x-json-ld:
  '@context': https://schema.org
  '@graph':
    - '@type': TechArticle
      headline: 'draw 场景用例 云架构'
      inLanguage: 'cn'
      about: 'x-cmd/draw 14-cloud-architecture'
---

# 云上架构 —— 五个真的落地的架构

架构图最难的不是画框,是**让读的人认出那堆框是什么**。所以节点上带图标:
来自 diagrams 开源图标库的 AWS / Azure / GCP 图标,缩到 48×48 内嵌进 SVG ——
贴进 README 的 PNG 也带着它。

每一个都是一个 URL。

## 一、三层 Web 应用(AWS)

```text
https://x-cmd.com/draw/arch2?n=cf;cloud;CloudFront;CDN;r0c0;aws:cloudfront&n=s3;db;S3;%E9%9D%99%E6%80%81%E8%B5%84%E6%BA%90;r0c1;aws:s3&n=igw;cloud;Internet%20Gateway;%E5%85%AC%E7%BD%91%E5%85%A5%E5%8F%A3;r1c1;aws:igw&n=alb;cloud;ALB;HTTPS%20443;r1c0;aws:alb&n=api;be;API%20%E6%9C%8D%E5%8A%A1;ECS%20Fargate;r2c0;aws:ecs&n=lam;be;Lambda;%E5%BC%82%E6%AD%A5%E4%BB%BB%E5%8A%A1;r2c1;aws:lambda&n=rds;db;RDS;PostgreSQL;r3c0;aws:rds&n=redis;db;ElastiCache;%E4%BC%9A%E8%AF%9D%E7%BC%93%E5%AD%98;r3c1;aws:redis&e=igw;alb;%E5%85%AC%E7%BD%91&e=cf;alb;%E8%BD%AC%E5%8F%91&e=cf;s3;%E9%9D%99%E6%80%81&e=alb;api&e=api;rds;%E6%9F%A5%E8%AF%A2&e=api;redis;%E7%BC%93%E5%AD%98&e=api;lam;%E5%BC%82%E6%AD%A5&b=Public%20subnet;cf%20s3%20igw%20alb&b=Private%20subnet;api%20lam%20rds%20redis&title=Three-tier%20web%20app%20on%20AWS&w=760
```

[![Three-tier web app on AWS](https://x-cmd.com/draw/arch2?n=cf;cloud;CloudFront;CDN;r0c0;aws:cloudfront&n=s3;db;S3;%E9%9D%99%E6%80%81%E8%B5%84%E6%BA%90;r0c1;aws:s3&n=igw;cloud;Internet%20Gateway;%E5%85%AC%E7%BD%91%E5%85%A5%E5%8F%A3;r1c1;aws:igw&n=alb;cloud;ALB;HTTPS%20443;r1c0;aws:alb&n=api;be;API%20%E6%9C%8D%E5%8A%A1;ECS%20Fargate;r2c0;aws:ecs&n=lam;be;Lambda;%E5%BC%82%E6%AD%A5%E4%BB%BB%E5%8A%A1;r2c1;aws:lambda&n=rds;db;RDS;PostgreSQL;r3c0;aws:rds&n=redis;db;ElastiCache;%E4%BC%9A%E8%AF%9D%E7%BC%93%E5%AD%98;r3c1;aws:redis&e=igw;alb;%E5%85%AC%E7%BD%91&e=cf;alb;%E8%BD%AC%E5%8F%91&e=cf;s3;%E9%9D%99%E6%80%81&e=alb;api&e=api;rds;%E6%9F%A5%E8%AF%A2&e=api;redis;%E7%BC%93%E5%AD%98&e=api;lam;%E5%BC%82%E6%AD%A5&b=Public%20subnet;cf%20s3%20igw%20alb&b=Private%20subnet;api%20lam%20rds%20redis&title=Three-tier%20web%20app%20on%20AWS&w=760)](https://x-cmd.com/draw/explore/arch2?n=cf;cloud;CloudFront;CDN;r0c0;aws:cloudfront&n=s3;db;S3;%E9%9D%99%E6%80%81%E8%B5%84%E6%BA%90;r0c1;aws:s3&n=igw;cloud;Internet%20Gateway;%E5%85%AC%E7%BD%91%E5%85%A5%E5%8F%A3;r1c1;aws:igw&n=alb;cloud;ALB;HTTPS%20443;r1c0;aws:alb&n=api;be;API%20%E6%9C%8D%E5%8A%A1;ECS%20Fargate;r2c0;aws:ecs&n=lam;be;Lambda;%E5%BC%82%E6%AD%A5%E4%BB%BB%E5%8A%A1;r2c1;aws:lambda&n=rds;db;RDS;PostgreSQL;r3c0;aws:rds&n=redis;db;ElastiCache;%E4%BC%9A%E8%AF%9D%E7%BC%93%E5%AD%98;r3c1;aws:redis&e=igw;alb;%E5%85%AC%E7%BD%91&e=cf;alb;%E8%BD%AC%E5%8F%91&e=cf;s3;%E9%9D%99%E6%80%81&e=alb;api&e=api;rds;%E6%9F%A5%E8%AF%A2&e=api;redis;%E7%BC%93%E5%AD%98&e=api;lam;%E5%BC%82%E6%AD%A5&b=Public%20subnet;cf%20s3%20igw%20alb&b=Private%20subnet;api%20lam%20rds%20redis&title=Three-tier%20web%20app%20on%20AWS&w=760)

公网子网放 CloudFront / ALB / S3,私有子网放服务与数据库 —— 边界框就是子网。

## 二、CI/CD 流水线

```text
https://x-cmd.com/draw/arch2?n=src;ext;GitHub;%E4%BB%A3%E7%A0%81%E4%BB%93%E5%BA%93;r0c0&n=build;be;CodeBuild;%E7%BC%96%E8%AF%91%20%2B%20%E6%B5%8B%E8%AF%95;r1c0;aws:codebuild&n=ecr;db;ECR;%E9%95%9C%E5%83%8F%E4%BB%93%E5%BA%93;r2c0;aws:ecr&n=ecs;be;ECS%20Fargate;%E8%B7%91%E5%AE%B9%E5%99%A8;r2c1;aws:ecs&n=pipe;be;CodePipeline;%E7%BC%96%E6%8E%92;r1c1;aws:codepipeline&n=cd;be;CodeDeploy;%E7%81%B0%E5%BA%A6%E5%8F%91%E5%B8%83;r3c1;aws:codedeploy&n=obs;be;CloudWatch;%E6%97%A5%E5%BF%97%E4%B8%8E%E5%91%8A%E8%AD%A6;r3c0;aws:cloudwatch&e=src;pipe;%E6%8F%90%E4%BA%A4%E8%A7%A6%E5%8F%91&e=pipe;build&e=build;ecr;%E6%8E%A8%E9%80%81%E9%95%9C%E5%83%8F&e=build;obs;%E6%97%A5%E5%BF%97&e=ecr;ecs;%E6%8B%89%E9%95%9C%E5%83%8F&e=ecs;cd;%E9%83%A8%E7%BD%B2&e=cd;obs;%E6%8C%87%E6%A0%87&b=Pipeline;pipe%20build%20ecr%20ecs%20cd&title=CI/CD%20pipeline%20on%20AWS&w=760
```

[![CI/CD pipeline on AWS](https://x-cmd.com/draw/arch2?n=src;ext;GitHub;%E4%BB%A3%E7%A0%81%E4%BB%93%E5%BA%93;r0c0&n=build;be;CodeBuild;%E7%BC%96%E8%AF%91%20%2B%20%E6%B5%8B%E8%AF%95;r1c0;aws:codebuild&n=ecr;db;ECR;%E9%95%9C%E5%83%8F%E4%BB%93%E5%BA%93;r2c0;aws:ecr&n=ecs;be;ECS%20Fargate;%E8%B7%91%E5%AE%B9%E5%99%A8;r2c1;aws:ecs&n=pipe;be;CodePipeline;%E7%BC%96%E6%8E%92;r1c1;aws:codepipeline&n=cd;be;CodeDeploy;%E7%81%B0%E5%BA%A6%E5%8F%91%E5%B8%83;r3c1;aws:codedeploy&n=obs;be;CloudWatch;%E6%97%A5%E5%BF%97%E4%B8%8E%E5%91%8A%E8%AD%A6;r3c0;aws:cloudwatch&e=src;pipe;%E6%8F%90%E4%BA%A4%E8%A7%A6%E5%8F%91&e=pipe;build&e=build;ecr;%E6%8E%A8%E9%80%81%E9%95%9C%E5%83%8F&e=build;obs;%E6%97%A5%E5%BF%97&e=ecr;ecs;%E6%8B%89%E9%95%9C%E5%83%8F&e=ecs;cd;%E9%83%A8%E7%BD%B2&e=cd;obs;%E6%8C%87%E6%A0%87&b=Pipeline;pipe%20build%20ecr%20ecs%20cd&title=CI/CD%20pipeline%20on%20AWS&w=760)](https://x-cmd.com/draw/explore/arch2?n=src;ext;GitHub;%E4%BB%A3%E7%A0%81%E4%BB%93%E5%BA%93;r0c0&n=build;be;CodeBuild;%E7%BC%96%E8%AF%91%20%2B%20%E6%B5%8B%E8%AF%95;r1c0;aws:codebuild&n=ecr;db;ECR;%E9%95%9C%E5%83%8F%E4%BB%93%E5%BA%93;r2c0;aws:ecr&n=ecs;be;ECS%20Fargate;%E8%B7%91%E5%AE%B9%E5%99%A8;r2c1;aws:ecs&n=pipe;be;CodePipeline;%E7%BC%96%E6%8E%92;r1c1;aws:codepipeline&n=cd;be;CodeDeploy;%E7%81%B0%E5%BA%A6%E5%8F%91%E5%B8%83;r3c1;aws:codedeploy&n=obs;be;CloudWatch;%E6%97%A5%E5%BF%97%E4%B8%8E%E5%91%8A%E8%AD%A6;r3c0;aws:cloudwatch&e=src;pipe;%E6%8F%90%E4%BA%A4%E8%A7%A6%E5%8F%91&e=pipe;build&e=build;ecr;%E6%8E%A8%E9%80%81%E9%95%9C%E5%83%8F&e=build;obs;%E6%97%A5%E5%BF%97&e=ecr;ecs;%E6%8B%89%E9%95%9C%E5%83%8F&e=ecs;cd;%E9%83%A8%E7%BD%B2&e=cd;obs;%E6%8C%87%E6%A0%87&b=Pipeline;pipe%20build%20ecr%20ecs%20cd&title=CI/CD%20pipeline%20on%20AWS&w=760)

从提交到灰度发布,每一步的产物都标在边上。

## 三、数据管道:S3 到 QuickSight

```text
https://x-cmd.com/draw/arch2?n=raw;db;S3;%E5%8E%9F%E5%A7%8B%E6%95%B0%E6%8D%AE;r0c0;aws:s3&n=crawl;be;Glue%20Crawler;%E5%85%83%E6%95%B0%E6%8D%AE;r1c0;aws:glue&n=etl;be;Glue%20ETL;%E6%B8%85%E6%B4%97%20%2B%20%E5%BB%BA%E6%A8%A1;r1c1;aws:glue&n=rs;db;Redshift;%E6%95%B0%E6%8D%AE%E4%BB%93%E5%BA%93;r2c0;aws:redshift&n=qs;fe;QuickSight;%E7%9C%8B%E6%9D%BF;r2c1;aws:quicksight&n=ath;be;Athena;%E5%8D%B3%E5%B8%AD%E6%9F%A5%E8%AF%A2;r3c1;aws:athena&e=raw;crawl;%E6%AF%8F%E6%97%A5%E6%89%AB%E6%8F%8F&e=crawl;etl;%E5%BB%BA%E8%A1%A8&e=etl;rs;%E5%85%A5%E4%BB%93&e=rs;qs;%E5%BB%BA%E6%A8%A1&e=rs;ath;%E8%81%94%E9%82%A6%E6%9F%A5%E8%AF%A2&b=Lake;raw%20crawl&b=Warehouse;etl%20rs%20ath%20qs&title=Data%20pipeline:%20S3%20to%20QuickSight&w=760
```

[![Data pipeline: S3 to QuickSight](https://x-cmd.com/draw/arch2?n=raw;db;S3;%E5%8E%9F%E5%A7%8B%E6%95%B0%E6%8D%AE;r0c0;aws:s3&n=crawl;be;Glue%20Crawler;%E5%85%83%E6%95%B0%E6%8D%AE;r1c0;aws:glue&n=etl;be;Glue%20ETL;%E6%B8%85%E6%B4%97%20%2B%20%E5%BB%BA%E6%A8%A1;r1c1;aws:glue&n=rs;db;Redshift;%E6%95%B0%E6%8D%AE%E4%BB%93%E5%BA%93;r2c0;aws:redshift&n=qs;fe;QuickSight;%E7%9C%8B%E6%9D%BF;r2c1;aws:quicksight&n=ath;be;Athena;%E5%8D%B3%E5%B8%AD%E6%9F%A5%E8%AF%A2;r3c1;aws:athena&e=raw;crawl;%E6%AF%8F%E6%97%A5%E6%89%AB%E6%8F%8F&e=crawl;etl;%E5%BB%BA%E8%A1%A8&e=etl;rs;%E5%85%A5%E4%BB%93&e=rs;qs;%E5%BB%BA%E6%A8%A1&e=rs;ath;%E8%81%94%E9%82%A6%E6%9F%A5%E8%AF%A2&b=Lake;raw%20crawl&b=Warehouse;etl%20rs%20ath%20qs&title=Data%20pipeline:%20S3%20to%20QuickSight&w=760)](https://x-cmd.com/draw/explore/arch2?n=raw;db;S3;%E5%8E%9F%E5%A7%8B%E6%95%B0%E6%8D%AE;r0c0;aws:s3&n=crawl;be;Glue%20Crawler;%E5%85%83%E6%95%B0%E6%8D%AE;r1c0;aws:glue&n=etl;be;Glue%20ETL;%E6%B8%85%E6%B4%97%20%2B%20%E5%BB%BA%E6%A8%A1;r1c1;aws:glue&n=rs;db;Redshift;%E6%95%B0%E6%8D%AE%E4%BB%93%E5%BA%93;r2c0;aws:redshift&n=qs;fe;QuickSight;%E7%9C%8B%E6%9D%BF;r2c1;aws:quicksight&n=ath;be;Athena;%E5%8D%B3%E5%B8%AD%E6%9F%A5%E8%AF%A2;r3c1;aws:athena&e=raw;crawl;%E6%AF%8F%E6%97%A5%E6%89%AB%E6%8F%8F&e=crawl;etl;%E5%BB%BA%E8%A1%A8&e=etl;rs;%E5%85%A5%E4%BB%93&e=rs;qs;%E5%BB%BA%E6%A8%A1&e=rs;ath;%E8%81%94%E9%82%A6%E6%9F%A5%E8%AF%A2&b=Lake;raw%20crawl&b=Warehouse;etl%20rs%20ath%20qs&title=Data%20pipeline:%20S3%20to%20QuickSight&w=760)

数据湖与数据仓库分成两个边界 —— 读者一眼知道数据在哪儿落地。

## 四、无服务器 API

```text
https://x-cmd.com/draw/arch2?n=gw;cloud;API%20Gateway;REST%20%E5%85%A5%E5%8F%A3;r0c0;aws:apigw&n=fn;be;Lambda;%E4%B8%9A%E5%8A%A1%E9%80%BB%E8%BE%91;r1c0;aws:lambda&n=ddb;db;DynamoDB;%E6%95%B0%E6%8D%AE%E8%A1%A8;r2c0;aws:dynamodb&n=sqs;bus;SQS;%E5%BC%82%E6%AD%A5%E9%98%9F%E5%88%97;r2c1;aws:sqs&n=iam;sec;IAM;%E6%9C%80%E5%B0%8F%E6%9D%83%E9%99%90;r0c1;aws:iam&n=cog;be;CloudWatch;%E6%8C%87%E6%A0%87%E4%B8%8E%E5%91%8A%E8%AD%A6;r3c0;aws:cloudwatch&e=gw;fn;%E5%90%8C%E6%AD%A5%E8%B0%83%E7%94%A8&e=gw;sqs;%E5%BC%82%E6%AD%A5%E5%85%A5%E9%98%9F&e=fn;ddb;%E8%AF%BB%E5%86%99&e=sqs;fn;%E6%B6%88%E8%B4%B9&e=iam;fn;%E6%8E%88%E6%9D%83&e=fn;cog;%E5%9F%8B%E7%82%B9&b=Edge;gw%20iam&b=Compute;fn%20sqs&b=Data;ddb&title=Serverless%20API&w=760
```

[![Serverless API](https://x-cmd.com/draw/arch2?n=gw;cloud;API%20Gateway;REST%20%E5%85%A5%E5%8F%A3;r0c0;aws:apigw&n=fn;be;Lambda;%E4%B8%9A%E5%8A%A1%E9%80%BB%E8%BE%91;r1c0;aws:lambda&n=ddb;db;DynamoDB;%E6%95%B0%E6%8D%AE%E8%A1%A8;r2c0;aws:dynamodb&n=sqs;bus;SQS;%E5%BC%82%E6%AD%A5%E9%98%9F%E5%88%97;r2c1;aws:sqs&n=iam;sec;IAM;%E6%9C%80%E5%B0%8F%E6%9D%83%E9%99%90;r0c1;aws:iam&n=cog;be;CloudWatch;%E6%8C%87%E6%A0%87%E4%B8%8E%E5%91%8A%E8%AD%A6;r3c0;aws:cloudwatch&e=gw;fn;%E5%90%8C%E6%AD%A5%E8%B0%83%E7%94%A8&e=gw;sqs;%E5%BC%82%E6%AD%A5%E5%85%A5%E9%98%9F&e=fn;ddb;%E8%AF%BB%E5%86%99&e=sqs;fn;%E6%B6%88%E8%B4%B9&e=iam;fn;%E6%8E%88%E6%9D%83&e=fn;cog;%E5%9F%8B%E7%82%B9&b=Edge;gw%20iam&b=Compute;fn%20sqs&b=Data;ddb&title=Serverless%20API&w=760)](https://x-cmd.com/draw/explore/arch2?n=gw;cloud;API%20Gateway;REST%20%E5%85%A5%E5%8F%A3;r0c0;aws:apigw&n=fn;be;Lambda;%E4%B8%9A%E5%8A%A1%E9%80%BB%E8%BE%91;r1c0;aws:lambda&n=ddb;db;DynamoDB;%E6%95%B0%E6%8D%AE%E8%A1%A8;r2c0;aws:dynamodb&n=sqs;bus;SQS;%E5%BC%82%E6%AD%A5%E9%98%9F%E5%88%97;r2c1;aws:sqs&n=iam;sec;IAM;%E6%9C%80%E5%B0%8F%E6%9D%83%E9%99%90;r0c1;aws:iam&n=cog;be;CloudWatch;%E6%8C%87%E6%A0%87%E4%B8%8E%E5%91%8A%E8%AD%A6;r3c0;aws:cloudwatch&e=gw;fn;%E5%90%8C%E6%AD%A5%E8%B0%83%E7%94%A8&e=gw;sqs;%E5%BC%82%E6%AD%A5%E5%85%A5%E9%98%9F&e=fn;ddb;%E8%AF%BB%E5%86%99&e=sqs;fn;%E6%B6%88%E8%B4%B9&e=iam;fn;%E6%8E%88%E6%9D%83&e=fn;cog;%E5%9F%8B%E7%82%B9&b=Edge;gw%20iam&b=Compute;fn%20sqs&b=Data;ddb&title=Serverless%20API&w=760)

入口、算力、数据三层,各自一个边界。

## 五、EKS 上的微服务

```text
https://x-cmd.com/draw/arch2?n=dns;cloud;Route%2053;%E5%9F%9F%E5%90%8D;r0c0;aws:route53&n=elb;cloud;NLB;%E5%85%A5%E5%8F%A3;r1c0;aws:nlb&n=eks;be;EKS;%E6%8E%A7%E5%88%B6%E9%9D%A2;r2c0;aws:eks&n=svc1;be;orders;%E8%AE%A2%E5%8D%95%E6%9C%8D%E5%8A%A1;r3c0&n=svc2;be;billing;%E8%AE%A1%E8%B4%B9%E6%9C%8D%E5%8A%A1;r3c1&n=es;db;OpenSearch;%E6%97%A5%E5%BF%97%E6%A3%80%E7%B4%A2;r4c1;aws:opensearch&n=s3;db;S3;%E9%9D%99%E6%80%81%E8%B5%84%E6%BA%90;r4c0;aws:s3&e=dns;elb;%E8%A7%A3%E6%9E%90&e=elb;eks&e=eks;svc1&e=eks;svc2&e=svc2;es;%E5%86%99%E6%97%A5%E5%BF%97&e=svc1;s3;%E8%AF%BB%E8%B5%84%E6%BA%90&b=Cluster;eks%20svc1%20svc2%20es&title=Microservices%20on%20EKS&w=760
```

[![Microservices on EKS](https://x-cmd.com/draw/arch2?n=dns;cloud;Route%2053;%E5%9F%9F%E5%90%8D;r0c0;aws:route53&n=elb;cloud;NLB;%E5%85%A5%E5%8F%A3;r1c0;aws:nlb&n=eks;be;EKS;%E6%8E%A7%E5%88%B6%E9%9D%A2;r2c0;aws:eks&n=svc1;be;orders;%E8%AE%A2%E5%8D%95%E6%9C%8D%E5%8A%A1;r3c0&n=svc2;be;billing;%E8%AE%A1%E8%B4%B9%E6%9C%8D%E5%8A%A1;r3c1&n=es;db;OpenSearch;%E6%97%A5%E5%BF%97%E6%A3%80%E7%B4%A2;r4c1;aws:opensearch&n=s3;db;S3;%E9%9D%99%E6%80%81%E8%B5%84%E6%BA%90;r4c0;aws:s3&e=dns;elb;%E8%A7%A3%E6%9E%90&e=elb;eks&e=eks;svc1&e=eks;svc2&e=svc2;es;%E5%86%99%E6%97%A5%E5%BF%97&e=svc1;s3;%E8%AF%BB%E8%B5%84%E6%BA%90&b=Cluster;eks%20svc1%20svc2%20es&title=Microservices%20on%20EKS&w=760)](https://x-cmd.com/draw/explore/arch2?n=dns;cloud;Route%2053;%E5%9F%9F%E5%90%8D;r0c0;aws:route53&n=elb;cloud;NLB;%E5%85%A5%E5%8F%A3;r1c0;aws:nlb&n=eks;be;EKS;%E6%8E%A7%E5%88%B6%E9%9D%A2;r2c0;aws:eks&n=svc1;be;orders;%E8%AE%A2%E5%8D%95%E6%9C%8D%E5%8A%A1;r3c0&n=svc2;be;billing;%E8%AE%A1%E8%B4%B9%E6%9C%8D%E5%8A%A1;r3c1&n=es;db;OpenSearch;%E6%97%A5%E5%BF%97%E6%A3%80%E7%B4%A2;r4c1;aws:opensearch&n=s3;db;S3;%E9%9D%99%E6%80%81%E8%B5%84%E6%BA%90;r4c0;aws:s3&e=dns;elb;%E8%A7%A3%E6%9E%90&e=elb;eks&e=eks;svc1&e=eks;svc2&e=svc2;es;%E5%86%99%E6%97%A5%E5%BF%97&e=svc1;s3;%E8%AF%BB%E8%B5%84%E6%BA%90&b=Cluster;eks%20svc1%20svc2%20es&title=Microservices%20on%20EKS&w=760)


---

## 这五个想说明的事

- **图标是内容,不是装饰。** 没有图标时读者只能读字;有了图标,一眼就知道
  「这是 Lambda」还是「这是 ECS」。
- **边界框就是分组。** 子网、VPC、环境 —— 用 `b=` 圈出来,不用自己画虚线框。
- **边上的字写的是关系。** 「拉镜像」「公网」「异步入队」—— 读者要的是这个。
