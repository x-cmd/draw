// 跨运行时结构类型:Worker 的全局 Env(自动生成类型)与 Node 的 process.env 摊平结果
// 都可赋值给 DrawEnv,渲染/HTTP 层因此对运行时无感。
export interface DrawEnv {
  BASE_PATH?: string;
  DATA_REPO?: string;
  DATA_BRANCH?: string;
  GITHUB_TOKEN?: string;
  RATE_LIMITER?: { limit(o: { key: string }): Promise<{ success: boolean }> };
}

// 运行时能力注入:Worker 提供 waitUntil(ctx)与限流 binding;Node 本地两者皆无(可选)。
export interface Platform {
  waitUntil?(p: Promise<unknown>): void;
  rateLimit?(key: string): Promise<boolean>; // true = 放行
}
