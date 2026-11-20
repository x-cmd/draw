// `?src=<url>`:规格放在文件里,URL 只带一个链接。
//
// 天梯图这类会有上千行数据 —— 塞进 URL 会超长(浏览器几千字符、代理几 KB 都有上限)。
// 所以规格可以放在一个 JSON 文件里,URL 只给链接。
//
// 跟 onepage 的 `?src=` 一个规矩:github blob 链接自动转 raw ✓;
// 不许取回环和私网地址(SSRF)✓;体积上限 1MB ✓。
//
// **一份实现** ✓ —— 库自己的 HTTP 层与站里的 worker 都用这个 ✓(别各抄一份 ✓)。
import { ApiError } from '../specs/index.js';
import { toRawGithub } from './onepage.js';

/** 取规格的上限:慢就是慢,不能一直挂着 ✓ */
const SRC_TIMEOUT_MS = 10_000;

/**
 * 把 `?src=<url>` 取来的规格折进 `d=` —— 返回一个改好的 URL ✓
 * (取来的 JSON 当成 d= 用 ✓;其余参数:标题、尺寸、风格照旧 ✓)。
 */
export async function resolveSrcSpec(url: URL): Promise<URL> {
  const src = url.searchParams.get('src');
  if (src === null || src === '') return url;
  const raw = toRawGithub(src);
  const host = new URL(raw).hostname;
  if (/^(localhost|127\.|10\.|192\.168\.|169\.254\.|0\.0\.0\.0$|\[?::1)/.test(host)) {
    throw new ApiError(400, 'refusing to fetch private/loopback addresses');
  }
  let up: Response;
  try {
    // **超时要设** ✓ —— 上游慢/不回(实测 GitHub raw 偶尔十几秒 ✗),
    // 不设的话请求一直挂着,页面转圈到天荒地老 ✗
    up = await fetch(raw, {
      headers: { 'user-agent': 'x-cmd/draw', accept: '*/*' },
      redirect: 'follow',
      signal: AbortSignal.timeout(SRC_TIMEOUT_MS),
    });
  } catch (e) {
    const timedOut = e instanceof Error && (e.name === 'TimeoutError' || e.name === 'AbortError');
    throw new ApiError(
      timedOut ? 504 : 502,
      timedOut
        ? `upstream timed out after ${SRC_TIMEOUT_MS / 1000}s: ${raw}`
        : `upstream fetch failed: ${e instanceof Error ? e.message : 'network error'}`,
    );
  }
  if (up.status >= 400) {
    throw new ApiError(up.status >= 500 ? 502 : 404, `upstream ${up.status} for ${raw}`);
  }
  const text = await up.text();
  if (text.length > 1024 * 1024) {
    throw new ApiError(413, `upstream spec is ${text.length}B (max 1048576)`);
  }
  let spec: unknown;
  try {
    spec = JSON.parse(text);
  } catch {
    throw new ApiError(400, `upstream spec is not valid JSON: ${raw}`);
  }
  const next = new URL(url);
  next.searchParams.delete('src');
  next.searchParams.set('d', text);
  // 规格文件自己知道是什么图(JSON 里的 type ✓)—— URL 没带 type 就补上 ✓
  // (只给一个文件链接就能画 ✓ —— 这就是 ?src= 的用法 ✓)
  if (!next.searchParams.get('type') && spec && typeof spec === 'object' && typeof (spec as { type?: unknown }).type === 'string') {
    next.searchParams.set('type', (spec as { type: string }).type);
  }
  return next;
}
