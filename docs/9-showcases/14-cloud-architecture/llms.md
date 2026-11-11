---
name: docs/9-showcases-14-cloud-architecture
description: 'x-cmd/draw showcase: five cloud architectures that really ship — a three-tier web app, a CI/CD pipeline, a data pipeline to QuickSight, a serverless API and microservices on EKS. Each is one URL, with vendor icons on the nodes and boundaries for the groupings.'
type: reference
---

# Core Content

core_features:

  - A three-tier web app: public subnet (CloudFront, ALB, S3) and private subnet (ECS, Lambda, RDS, ElastiCache)
  - A CI/CD pipeline: commit, CodePipeline, CodeBuild, ECR, ECS, CodeDeploy, CloudWatch
  - A data pipeline: S3 to Glue to Redshift to QuickSight, with Athena alongside
  - A serverless API: API Gateway, Lambda, SQS, DynamoDB, IAM
  - Microservices on EKS behind an NLB, with Route 53 in front

# Key Information

highlights:

  - Icons are content: the reader recognises the services without reading
  - The boundaries are the grouping — subnets, lake versus warehouse, cluster
  - The words on the edges are the relationship: pull image, public, enqueue

# Use Cases

  - A README that needs the architecture
  - An onboarding doc for a team running on AWS

# Related Resources

official:
  endpoint: https://x-cmd.com/draw
related:
  icons: docs/5-architecture/07-icons/cn.md
  diagram_urls: docs/1-overview/06-diagram-urls/cn.md
  showcase: docs/9-showcases/12-reference-examples/cn.md
