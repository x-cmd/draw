// 短链接存储层:图表 JSON 存在 GitHub 公开仓(charts/<指纹>.json),内容寻址、永不过期。
// 读取走 raw(免 token);写入需 GITHUB_TOKEN(secret,fine-grained PAT 仅授本仓 Contents 写)。
// 可见性:公开仓任何人都可浏览目录,请勿存放敏感数据(私有方案规划中,将收费提供)。
import { ApiError } from './specs';

export const CHART_TEMPLATES = ['pie', 'bar', 'hbar', 'line', 'area', 'radar', 'gauge', 'scatter', 'combo', 'sankey', 'qr'] as const;
export type ChartTemplate = (typeof CHART_TEMPLATES)[number];

export interface StoredChart {
  template: ChartTemplate;
  theme: string;
  stack?: boolean; // type=bar 多系列时:堆叠而非分组
  spec: unknown;
}

const HASH_RE = /^[0-9a-f]{16}$/;
const MAX_BODY = 64 * 1024;

export function assertHash(hash: string): void {
  if (!HASH_RE.test(hash)) {
    throw new ApiError(400, `short-link id must be 16 hex characters, got: ${JSON.stringify(hash)}`);
  }
}

// 规范化 JSON(递归排序 key),让"相同数据"得到相同指纹
export function canonicalJson(v: unknown): string {
  const walk = (x: unknown): unknown => {
    if (Array.isArray(x)) return x.map(walk);
    if (x !== null && typeof x === 'object') {
      const o: Record<string, unknown> = {};
      for (const k of Object.keys(x as Record<string, unknown>).sort()) {
        o[k] = walk((x as Record<string, unknown>)[k]);
      }
      return o;
    }
    return x;
  };
  return JSON.stringify(walk(v));
}

export async function fingerprint(doc: StoredChart): Promise<string> {
  const data = new TextEncoder().encode(canonicalJson(doc));
  const digest = await crypto.subtle.digest('SHA-256', data);
  return [...new Uint8Array(digest)].slice(0, 8).map((b) => b.toString(16).padStart(2, '0')).join('');
}

function base64(s: string): string {
  const bytes = new TextEncoder().encode(s);
  let bin = '';
  for (const b of bytes) bin += String.fromCharCode(b);
  return btoa(bin);
}

function requireRepo(env: { DATA_REPO?: string; DATA_BRANCH?: string }): { repo: string; branch: string } {
  if (!env.DATA_REPO) {
    throw new ApiError(400, 'server is not configured: set DATA_REPO ("owner/name") and GITHUB_TOKEN first');
  }
  return { repo: env.DATA_REPO, branch: env.DATA_BRANCH || 'main' };
}

// 写入(幂等):已存在视为成功
export async function putChart(env: Env, hash: string, doc: StoredChart): Promise<void> {
  const { repo, branch } = requireRepo(env);
  const token = env.GITHUB_TOKEN;
  if (!token) throw new ApiError(400, 'server is not configured: set GITHUB_TOKEN secret first');
  const res = await fetch(`https://api.github.com/repos/${repo}/contents/charts/${hash}.json`, {
    method: 'PUT',
    headers: {
      authorization: `Bearer ${token}`,
      accept: 'application/vnd.github+json',
      'content-type': 'application/json',
      'user-agent': 'draw-worker',
    },
    body: JSON.stringify({
      message: `chart ${hash} (${doc.template})`,
      branch,
      content: base64(JSON.stringify(doc)),
    }),
  });
  if (res.ok) return;
  if (res.status === 409 || res.status === 422) return; // 已存在(无 sha 的 PUT)→ 幂等成功
  throw new ApiError(502, `failed to store chart (GitHub ${res.status})`);
}

// 读取:恒走 raw(公开仓免 token、CDN 友好)。GITHUB_TOKEN 只是 Worker 的写入凭证
// (GitHub 对任何仓的写操作都要求认证),读取不再耗 API 配额(5000 req/h 仅剩创建消耗)。
export async function getChart(env: Env, hash: string): Promise<StoredChart> {
  const { repo, branch } = requireRepo(env);
  // 内容寻址短链:给 Cloudflare 边缘缓存(同 hash 永同内容,缓存安全),
  // 免每请求回源 raw(延迟 200-800ms)
  // 只缓 200-299:cacheEverything 会连 404/403 一起负缓存(坏哈希可被"预热"、限流瞬态被固化)
  const cfCache = { cacheEverything: true, cacheTtlByStatus: { '200-299': 86400, '300-499': 0, '500-599': 0 } } as const;
  const res = await fetch(`https://raw.githubusercontent.com/${repo}/${branch}/charts/${hash}.json`, { cf: cfCache });
  if (res.status === 404) throw new ApiError(404, `chart ${hash} not found`);
  if (!res.ok) throw new ApiError(502, `failed to load chart data (upstream ${res.status})`);
  const text = await res.text();
  if (text.length > MAX_BODY) throw new ApiError(502, 'stored chart data is unexpectedly large');
  let obj: unknown;
  try {
    obj = JSON.parse(text);
  } catch {
    throw new ApiError(502, `stored chart ${hash} is corrupted (invalid JSON)`);
  }
  const o = obj as Record<string, unknown>;
  if (typeof o.template !== 'string' || !CHART_TEMPLATES.includes(o.template as ChartTemplate)) {
    throw new ApiError(502, `stored chart ${hash} has an invalid template`);
  }
  const doc: StoredChart = {
    template: o.template as ChartTemplate,
    theme: typeof o.theme === 'string' ? o.theme : 'base',
    ...(o.stack === true ? { stack: true } : {}),
    spec: o.spec,
  };
  // 内容寻址完整性:存档被篡改/误编辑时指纹不再匹配 URL,拒绝渲染
  if ((await fingerprint(doc)) !== hash) {
    throw new ApiError(502, `stored chart ${hash} failed integrity check (content hash mismatch)`);
  }
  return doc;
}

export async function readBody(request: Request): Promise<string> {
  const declared = Number(request.headers.get('content-length') ?? '0');
  if (declared > MAX_BODY) throw new ApiError(400, `body too large (max ${MAX_BODY / 1024}KB)`);
  const text = await request.text();
  if (text.length > MAX_BODY) throw new ApiError(400, `body too large (max ${MAX_BODY / 1024}KB)`);
  return text;
}
