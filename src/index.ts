// draw — Cloudflare Workers 入口(薄壳):
// 路由/渲染/短链逻辑在 handler.ts(运行时无关),本文件只做 Workers 专属的三件事 —
// 边缘缓存读写(caches.default)、ctx.waitUntil、限流 binding → platform.rateLimit。
// 代码结构(可维护性约定):
//   specs/    每种图表一个解析文件(base=公共校验),barrel 统一导出
//   render/   每种图表一个渲染文件(svg.ts=公共工具+RenderOpts,query.ts=参数→SVG 核心,dispatch.ts=模板分发)
//   handler.ts 共享 HTTP 层 · store.ts 短链存储(GitHub repo) · demo.ts 演示页
//   node/     Node 本地运行入口(server.ts 服务,cli.ts 命令行)
// 新增图表 = specs/xxx.ts + render/xxx.ts + store.ts 的 CHART_TEMPLATES 加一项
//           + render/query.ts 一行 + render/dispatch.ts 一行
import { handleRequest } from './handler.js';
import type { Platform } from './types.js';
// resvg-wasm 模块(workers 打包规则把 .wasm 识别为 WebAssembly.Module)。
// 只有 Workers 入口静态 import 它;Node/Deno 走 png.ts 里的 node_modules 文件读取。
import resvgWasm from '@resvg/resvg-wasm/index_bg.wasm';
import { injectResvgWasm } from './render/png.js';
injectResvgWasm(resvgWasm);

// 边缘缓存读:GET 图表/演示页响应按 URL 命中 Cache API(每 CF 节点独立)。
// POST、错误、no-store 不进缓存;?v= 与短链的 TTL 语义由 Cache-Control 承载。
// 缓存键带版本号:渲染逻辑修复的部署 bump ECV,旧条目(可能含坏渲染)整体作废
const ECV = '4'; // v4: 新增 ?format=png(渲染输出随 format/scheme/scale 变化),旧缓存条目作废
function edgeKey(request: Request): Request {
  const u = new URL(request.url);
  u.searchParams.set('ecv', ECV);
  return new Request(u.toString());
}
async function edgeCached(request: Request, render: () => Response | Promise<Response>): Promise<Response> {
  if (request.method !== 'GET') return await render();
  const cached = await caches.default.match(edgeKey(request));
  if (cached) return cached;
  return await render();
}

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const platform: Platform = {
      waitUntil: (p) => ctx.waitUntil(p),
      // 官方 Rate Limiting binding(每 CF 数据中心独立计数,全局限额 30/min/IP)
      rateLimit: env.RATE_LIMITER
        ? async (key) => (await env.RATE_LIMITER!.limit({ key })).success
        : undefined,
    };
    try {
      const res = await edgeCached(request, () => handleRequest(request, env, platform));
      // 写入边缘缓存(同 URL 同节点命中后 ~10ms;TTL 由响应 Cache-Control 决定)
      const cc = res.headers.get('cache-control') ?? '';
      if (request.method === 'GET' && res.status === 200 && /max-age=(3[0-9]{2,}|86[0-9]{3}|315[0-9]{4})/.test(cc)) {
        // 边缘副本统一 300s 淘汰:浏览器仍按原头缓存(短链 immutable 1 年),
        // 但渲染修复最迟 5 分钟/节点 内传播。注意:不能 new Response(res.body, res)——
        // 那会把 body 流转移给副本,原响应返回时抛 TypeError(曾致全站图表 500)。
        // 正确做法:clone 后读出文本,用可变 Headers 构造独立副本
        ctx.waitUntil((async () => {
          const body = await res.clone().text();
          const h = new Headers(res.headers);
          h.set('cache-control', 'public, max-age=300');
          await caches.default.put(edgeKey(request), new Response(body, { status: 200, headers: h }));
        })());
      }
      return res;
    } catch (e) {
      // handleRequest 内部已兜底;这里再兜一层以防缓存读写本身抛错
      const rid = crypto.randomUUID().slice(0, 8);
      console.error(JSON.stringify({
        msg: 'unhandled error', rid, method: request.method, url: request.url,
        error: e instanceof Error ? e.stack ?? e.message : String(e),
      }));
      return new Response(`internal error (ref ${rid})\n`, {
        status: 500,
        headers: { 'content-type': 'text/plain; charset=utf-8', 'cache-control': 'no-store' },
      });
    }
  },
};
