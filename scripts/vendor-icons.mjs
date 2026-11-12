// 把 diagrams 的开源图标库(mingrammer/diagrams,resources/)收进来:
// 下载 → 缩到 48×48 → 量化调色板 → 存成 resources/icons/<key>.png,
// 再生成 src/render/icons.ts(名字 → data URI),渲染层直接内嵌。
// 用法:node scripts/vendor-icons.mjs
import { writeFileSync, mkdirSync, existsSync, readFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';

const BASE = 'https://cdn.jsdelivr.net/gh/mingrammer/diagrams@master/resources';
const OUT = 'resources/icons';
const MODULE = 'src/render/icons.ts';

// key → [provider, 文件夹, 文件名]
const ICONS = {
  'aws:ec2': ['aws', 'compute', 'ec2'],
  'aws:lambda': ['aws', 'compute', 'lambda'],
  'aws:ecs': ['aws', 'compute', 'elastic-container-service'],
  'aws:eks': ['aws', 'compute', 'elastic-kubernetes-service'],
  'aws:fargate': ['aws', 'compute', 'fargate'],
  'aws:batch': ['aws', 'compute', 'batch'],
  'aws:s3': ['aws', 'storage', 'simple-storage-service-s3-bucket'],
  'aws:ebs': ['aws', 'storage', 'elastic-block-store-ebs'],
  'aws:efs': ['aws', 'storage', 'elastic-file-system-efs'],
  'aws:rds': ['aws', 'database', 'rds'],
  'aws:aurora': ['aws', 'database', 'aurora'],
  'aws:dynamodb': ['aws', 'database', 'dynamodb'],
  'aws:redis': ['aws', 'database', 'elasticache-for-redis'],
  'aws:redshift': ['aws', 'database', 'redshift'],
  'aws:docdb': ['aws', 'database', 'documentdb-mongodb-compatibility'],
  'aws:apigw': ['aws', 'network', 'api-gateway'],
  'aws:cloudfront': ['aws', 'network', 'cloudfront'],
  'aws:alb': ['aws', 'network', 'elb-application-load-balancer'],
  'aws:nlb': ['aws', 'network', 'elb-network-load-balancer'],
  'aws:route53': ['aws', 'network', 'route-53'],
  'aws:vpc': ['aws', 'network', 'vpc'],
  'aws:nat': ['aws', 'network', 'nat-gateway'],
  'aws:igw': ['aws', 'network', 'internet-gateway'],
  'aws:cloudwatch': ['aws', 'management', 'cloudwatch'],
  'aws:cloudformation': ['aws', 'management', 'cloudformation'],
  'aws:cloudtrail': ['aws', 'management', 'cloudtrail'],
  'aws:eventbridge': ['aws', 'integration', 'eventbridge'],
  'aws:sns': ['aws', 'integration', 'simple-notification-service-sns'],
  'aws:sqs': ['aws', 'integration', 'simple-queue-service-sqs'],
  'aws:stepfn': ['aws', 'integration', 'step-functions'],
  'aws:glue': ['aws', 'analytics', 'glue'],
  'aws:athena': ['aws', 'analytics', 'athena'],
  'aws:kinesis': ['aws', 'analytics', 'kinesis-data-streams'],
  'aws:quicksight': ['aws', 'analytics', 'quicksight'],
  'aws:es': ['aws', 'analytics', 'elasticsearch-service'],
  'aws:iam': ['aws', 'security', 'identity-and-access-management-iam'],
  'aws:sts': ['aws', 'security', 'identity-and-access-management-iam-aws-sts'],
  'aws:sso': ['aws', 'security', 'single-sign-on'],
  'aws:waf': ['aws', 'security', 'waf'],
  'aws:guardduty': ['aws', 'security', 'guardduty'],
  'aws:secrets': ['aws', 'security', 'secrets-manager'],
  'aws:kms': ['aws', 'security', 'key-management-service'],
  'aws:acm': ['aws', 'security', 'certificate-manager'],
  'aws:cognito': ['aws', 'security', 'cognito'],
  'aws:codebuild': ['aws', 'devtools', 'codebuild'],
  'aws:codepipeline': ['aws', 'devtools', 'codepipeline'],
  'aws:codedeploy': ['aws', 'devtools', 'codedeploy'],
  'aws:ecr': ['aws', 'compute', 'ec2-container-registry'],
  'aws:opensearch': ['aws', 'analytics', 'amazon-opensearch-service'],
  'azure:app': ['azure', 'appservices', 'app-services'],
  'azure:vm': ['azure', 'compute', 'virtual-machine'],
  'azure:aci': ['azure', 'compute', 'container-instances'],
  'azure:container': ['azure', 'compute', 'container-apps'],
  'azure:cosmos': ['azure', 'database', 'cosmos-db'],
  'azure:sql': ['azure', 'database', 'sql-databases'],
  'azure:redis': ['azure', 'database', 'cache-for-redis'],
  'azure:blob': ['azure', 'storage', 'blob-storage'],
  'azure:ad': ['azure', 'identity', 'active-directory'],
  'gcp:gce': ['gcp', 'compute', 'compute-engine'],
  'gcp:func': ['gcp', 'compute', 'functions'],
  'gcp:gke': ['gcp', 'compute', 'kubernetes-engine'],
  'gcp:run': ['gcp', 'compute', 'run'],
  'gcp:sql': ['gcp', 'database', 'sql'],
  'gcp:firestore': ['gcp', 'database', 'firestore'],
  'gcp:spanner': ['gcp', 'database', 'spanner'],
  'gcp:bigtable': ['gcp', 'database', 'bigtable'],
  'gcp:redis': ['gcp', 'database', 'memorystore'],
  'gcp:gcs': ['gcp', 'storage', 'storage'],
  'gcp:disk': ['gcp', 'storage', 'persistent-disk'],
};

mkdirSync(OUT, { recursive: true });
const entries = [];
for (const [key, [provider, folder, name]] of Object.entries(ICONS)) {
  const file = `${OUT}/${key.replace(':', '-')}.png`;
  if (!existsSync(file)) {
    const url = `${BASE}/${provider}/${folder}/${name}.png`;
    const tmp = `/tmp/icon-${key.replace(':', '-')}.png`;
    try {
      execFileSync('curl', ['-sL', '--max-time', '60', url, '-o', tmp], { stdio: 'pipe' });
      // 缩到 48×48 + 量化调色板(48px 的显示尺寸,不需要 512px 的原图)
      execFileSync('python3', ['-c', `
from PIL import Image
im = Image.open('${tmp}').convert('RGBA')
im.thumbnail((48, 48), Image.LANCZOS)
im = im.quantize(colors=96, method=Image.FASTOCTREE)
im.save('${file}', optimize=True)
`], { stdio: 'pipe' });
      console.log('ok', key);
    } catch (e) {
      console.log('FAIL', key, String(e.message).slice(0, 80));
      continue;
    }
  }
  const b64 = readFileSync(file).toString('base64');
  entries.push([key, `data:image/png;base64,${b64}`]);
}

const body = `// 图标库:来自 mingrammer/diagrams 的开源图标(Apache-2.0),
// 缩到 48×48 并量化后内嵌成 data URI —— SVG 与 PNG 输出都带着它,不用外链。
// 由 scripts/vendor-icons.mjs 生成,别手改。
export const ICONS: Record<string, string> = {
${entries.map(([k, v]) => `  '${k}': '${v}',`).join('\n')}
};

/** 图标名字 → data URI(没有就是没有) */
export function iconOf(name: string): string | undefined {
  return ICONS[name];
}
`;
writeFileSync(MODULE, body);
console.log(`wrote ${MODULE}: ${entries.length} icons`);
