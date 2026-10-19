// Secrets 不会出现在 wrangler types 生成的 Env 里,在此声明合并。
// GITHUB_TOKEN: wrangler secret put GITHUB_TOKEN(本地开发放 .dev.vars)
// BASE_PATH: 可选,显式钉死服务路径前缀(缺省自动探测:/draw 子路径或根路径)
interface Env {
  readonly GITHUB_TOKEN?: string;
  readonly BASE_PATH?: string;
}
