// Node 本地运行入口:npm run serve(默认 http://localhost:8787)。
// 与 Cloudflare Worker 同一份 handler.ts;本地无边缘缓存、无限流(可自己加反代)。
// 环境变量:PORT(默认 8787)· BASE_PATH · DATA_REPO · DATA_BRANCH · GITHUB_TOKEN
// 设了 DATA_REPO + GITHUB_TOKEN 后,POST /draw 短链创建同样可用。
import http from 'node:http';
import { Readable } from 'node:stream';
import type { ReadableStream as NodeWebReadableStream } from 'node:stream/web';
import { handleRequest } from '../handler.js';
import type { DrawEnv } from '../types.js';

const PORT = Number(process.env.PORT ?? 8787);
const env: DrawEnv = {
  BASE_PATH: process.env.BASE_PATH,
  DATA_REPO: process.env.DATA_REPO,
  DATA_BRANCH: process.env.DATA_BRANCH,
  GITHUB_TOKEN: process.env.GITHUB_TOKEN,
};

// 先读完整 body 再构造 Request(readBody 的 64KB 上限仍在 handler 层兜底)
function readBody(req: http.IncomingMessage, limit = 1024 * 1024): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    let size = 0;
    req.on('data', (c: Buffer) => {
      size += c.length;
      if (size > limit) {
        req.destroy();
        reject(new Error('request body too large'));
        return;
      }
      chunks.push(c);
    });
    req.on('end', () => resolve(Buffer.concat(chunks)));
    req.on('error', reject);
  });
}

const server = http.createServer(async (req, res) => {
  try {
    const host = req.headers.host ?? `localhost:${PORT}`;
    const hasBody = req.method !== 'GET' && req.method !== 'HEAD';
    const body = hasBody ? await readBody(req) : undefined;

    // rawHeaders 是 [k1, v1, k2, v2...];同名头逗号合并(入站不会有 set-cookie)
    const headers: Record<string, string> = {};
    for (let i = 0; i < req.rawHeaders.length; i += 2) {
      const k = req.rawHeaders[i];
      const v = req.rawHeaders[i + 1];
      headers[k] = k in headers ? `${headers[k]}, ${v}` : v;
    }
    const request = new Request(`http://${host}${req.url ?? '/'}`, {
      method: req.method,
      headers,
      ...(body !== undefined ? { body, duplex: 'half' } : {}),
    });

    const response = await handleRequest(request, env, {});

    const out: Record<string, string | string[]> = {};
    response.headers.forEach((v, k) => { out[k] = v; });
    const setCookie = response.headers.getSetCookie();
    if (setCookie.length > 0) out['set-cookie'] = setCookie;
    res.writeHead(response.status, out);
    if (!response.body) {
      res.end();
      return;
    }
    Readable.fromWeb(response.body as unknown as NodeWebReadableStream).pipe(res);
  } catch (e) {
    console.error('node adapter error:', e);
    if (!res.headersSent) {
      res.writeHead(500, { 'content-type': 'text/plain; charset=utf-8' });
    }
    res.end('internal error\n');
  }
});

server.listen(PORT, () => {
  const short = env.DATA_REPO ? '' : '(POST short links disabled: set DATA_REPO + GITHUB_TOKEN to enable)';
  console.log(`draw serving at http://localhost:${PORT}/draw ${short}`);
});
