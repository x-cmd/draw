import { renderArchFromUrl } from './src/render/arch.js';
// 和 archify 的架构示例同一个拓扑:用户/鉴权 → CDN → 负载均衡 → API → 数据库,
// 外加对象存储、队列、Worker;两个边界(区域、安全组)
const q = [
  'n=auth;ext;Auth Provider;OAuth 2.0;r0c0',
  'n=users;ext;Users;Browser / Mobile;r1c0',
  'n=cdn;cloud;CloudFront;CDN;r1c1',
  'n=lb;cloud;Load Balancer;HTTPS :443;r1c2',
  'n=api;be;API Server;FastAPI :8000;r1c3',
  'n=pg;db;PostgreSQL;primary :5432;r2c3',
  'n=s3;cloud;S3;static assets;r2c2',
  'n=sqs;bus;SQS;job queue;r2c4',
  'n=worker;be;Worker;async jobs;r2c5',
  'e=auth;cdn;verify JWT',
  'e=users;cdn;HTTPS',
  'e=cdn;lb;forward',
  'e=lb;api;proxy',
  'e=api;pg;SQL',
  'e=api;s3;upload',
  'e=api;sqs;enqueue',
  'e=sqs;worker;consume',
  'e=worker;pg;write',
  'b=AWS Region us-west-2;cdn lb api pg s3 sqs worker',
  'b=sg-01 · 4437:8000;api',
  'title=Order service',
].join('&');
console.log(renderArchFromUrl(new URL('https://x-cmd.com/draw/arch2?' + q)).svg);
