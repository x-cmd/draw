import { describe, it, expect } from 'vitest';
import { handleRequest } from '../src/handler.js';

// 共享 HTTP 层(web-standard Request/Response):Worker 与 Node 服务走同一份代码,
// 这里直调 handleRequest 即可覆盖路由/渲染/错误路径,无需起任何服务器。
const BASE = 'https://draw.test/draw';

describe('handleRequest', () => {
  it('renders GET charts as SVG with version headers', async () => {
    const res = await handleRequest(new Request(`${BASE}?type=pie&labels=A,B&values=3,2`), {}, {});
    expect(res.status).toBe(200);
    expect(res.headers.get('content-type')).toContain('image/svg+xml');
    expect(res.headers.get('x-draw-version')).toBe('1');
    expect(await res.text()).toMatch(/^<svg/);
  });

  it('serves the demo page at the bare path', async () => {
    const res = await handleRequest(new Request(BASE), {}, {});
    expect(res.status).toBe(200);
    expect(res.headers.get('content-type')).toContain('text/html');
  });

  it('404s outside the service path', async () => {
    const res = await handleRequest(new Request('https://draw.test/other'), {}, {});
    expect(res.status).toBe(404);
  });

  it('turns bad chart params into a 400 text response', async () => {
    const res = await handleRequest(new Request(`${BASE}?type=pie`), {}, {});
    expect(res.status).toBe(400);
    expect(res.headers.get('content-type')).toContain('text/plain');
    expect(await res.text()).toMatch(/labels|values|data/);
  });

  it('400s POST create when storage is not configured (same as worker)', async () => {
    const res = await handleRequest(
      new Request(`${BASE}?type=pie`, { method: 'POST', body: '{"data":[{"label":"A","value":1}]}' }),
      {},
      {},
    );
    expect(res.status).toBe(400);
    expect(await res.text()).toContain('not configured');
  });

  it('405s non-GET/POST at the service root', async () => {
    const res = await handleRequest(new Request(BASE, { method: 'DELETE' }), {}, {});
    expect(res.status).toBe(405);
  });

  it('honors BASE_PATH pinning', async () => {
    const res = await handleRequest(new Request('https://draw.test/charts?type=qr&d=hi'), { BASE_PATH: '/charts' }, {});
    expect(res.status).toBe(200);
  });
});
