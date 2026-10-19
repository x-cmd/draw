// 版本与缓存语义(2026-09-20 决定,2026-09-26 修订):
// 缺省 = 最新版(短 TTL 300s)。?v=N = 钉住版本,长缓存 1 天;
// immutable 仅用于内容寻址短链 /c/<hash>(渲染代码随部署变化,/draw 的输出做不到真正冻结)。
import { ApiError } from './specs';

export const CURRENT_VERSION = 1;

export interface VersionInfo {
  version: number;
  cacheControl: string;
}

export function resolveVersion(vParam: string | null): VersionInfo {
  if (vParam === null) {
    return { version: CURRENT_VERSION, cacheControl: 'public, max-age=300' };
  }
  const v = Number(vParam);
  if (!Number.isInteger(v) || v < 1 || v > CURRENT_VERSION) {
    throw new ApiError(
      400,
      `"v" must be an integer between 1 and ${CURRENT_VERSION}, or omitted to get the latest. Got: ${JSON.stringify(vParam)}`,
    );
  }
  // 钉住版本:CDN/浏览器缓存 1 天(渲染仍随部署演进,不能承诺永久冻结)
  return { version: v, cacheControl: 'public, max-age=86400' };
}
