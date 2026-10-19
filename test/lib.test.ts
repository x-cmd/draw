import { describe, it, expect } from 'vitest';
import { draw, ApiError } from '../src/lib.js';

// 库入口 draw():与 GET /draw 同参同输出,同步、无网络。
describe('draw', () => {
  it('renders from a plain object', () => {
    const { svg, version } = draw({ type: 'pie', labels: 'A,B', values: '3,2' });
    expect(version).toBe(1);
    expect(svg).toMatch(/^<svg/);
    expect(svg).toContain('<metadata');
  });

  it('renders from a query string', () => {
    expect(draw('?type=bar&labels=Mon,Tue&values=3,5').svg).toMatch(/^<svg/);
    expect(draw('type=qr&d=hello').svg).toMatch(/^<svg/);
  });

  it('supports repeated params via arrays (labels containing commas)', () => {
    const { svg } = draw({ type: 'bar', labels: ['Q1, 2024', 'Q2'], values: ['1', '2'] });
    expect(svg).toMatch(/^<svg/);
  });

  it('throws ApiError on bad params', () => {
    expect(() => draw({ type: 'nope' })).toThrow(ApiError);
    expect(() => draw({ type: 'pie', values: '3,2' })).toThrow(/labels|data/);
  });

  it('matches the HTTP layer output byte-for-byte for the same params', async () => {
    const { handleRequest } = await import('../src/handler.js');
    const q = 'type=sankey&labels=a,b,c&links=a>b:3;b>c:2';
    const viaLib = draw(q).svg;
    const viaHttp = await (await handleRequest(new Request(`https://draw.test/draw?${q}`), {}, {})).text();
    expect(viaLib).toBe(viaHttp);
  });
});
