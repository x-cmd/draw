import { describe, it, expect } from 'vitest';
import { bakeFlatSvg, svgToPng } from '../src/render/png.js';
import { draw } from '../src/lib.js';
import { renderEchartsFromUrl } from '../src/render/echarts-ssr.js';
import { handleRequest } from '../src/handler.js';

// PNG 导出层(x-cmd-hub/draw#24):烘焙(var→色值固化) + resvg-wasm 光栅化。
// 烘焙对任意渲染器产出通用;wasm 走 Node 的 node_modules 文件读取路径。
const BASE = 'https://draw.test/draw';

describe('bakeFlatSvg', () => {
  const { svg } = draw({ type: 'pie', labels: 'A,B', values: '3,2' }); // auto 双套

  it('resolves every var() to a concrete color and strips style blocks', () => {
    const flat = bakeFlatSvg(svg, 'light');
    expect(flat).not.toContain('var(--d-');
    expect(flat).not.toContain('<style');
    expect(flat).toMatch(/fill="#[0-9a-f]{6}"/i); // 至少出现一个具体色
    expect(flat).toMatch(/^<svg/);
  });

  it('picks the dark palette when scheme=dark', () => {
    const light = bakeFlatSvg(svg, 'light');
    const dark = bakeFlatSvg(svg, 'dark');
    expect(light).not.toEqual(dark); // 双套皮肤明暗色值确有差异
  });

  it('works on echarts output (same var injection)', async () => {
    const d = encodeURIComponent(JSON.stringify({ series: [{ type: 'bar', data: [1, 2] }] }));
    const { svg: esvg } = await renderEchartsFromUrl(new URL(`${BASE}/echarts?d=${d}`));
    const flat = bakeFlatSvg(esvg, 'dark');
    expect(flat).not.toContain('var(--d-');
  });
});

describe('svgToPng', () => {
  it('rasterizes a chart to PNG bytes (magic header + IEND)', async () => {
    const { svg } = draw({ type: 'pie', labels: 'A,B', values: '3,2', title: 'PNG test' });
    const png = await svgToPng(svg, 'light');
    expect(png.byteLength).toBeGreaterThan(1000);
    const head = Buffer.from(png.slice(0, 8)).toString('hex');
    expect(head).toBe('89504e470d0a1a0a'); // \x89PNG\r\n\x1a\n
    expect(Buffer.from(png.slice(-8)).toString('hex')).toContain('49454e44'); // IEND
  }, 30000); // wasm 首次 init 慢

  it('honors scale (2x ≈ 4x the pixels)', async () => {
    const { svg } = draw({ type: 'pie', labels: 'A,B', values: '3,2' });
    const one = await svgToPng(svg, 'light', { scale: 1 });
    const two = await svgToPng(svg, 'light', { scale: 2 });
    expect(two.byteLength).toBeGreaterThan(one.byteLength);
  }, 30000);

  it('rejects scale out of bounds', async () => {
    const { svg } = draw({ type: 'pie', labels: 'A,B', values: '3,2' });
    await expect(svgToPng(svg, 'light', { scale: 4 })).rejects.toMatchObject({ status: 400 });
  });
});

describe('handleRequest · ?format=png', () => {
  it('serves image/png on every render route', async () => {
    const cases = [
      `${BASE}?type=pie&labels=A,B&values=3,2&format=png`,
      `${BASE}/echarts?d=${encodeURIComponent(JSON.stringify({ series: [{ type: 'bar', data: [1, 2] }] }))}&format=png&scheme=dark`,
    ];
    for (const u of cases) {
      const res = await handleRequest(new Request(u), {}, {});
      expect(res.status).toBe(200);
      expect(res.headers.get('content-type')).toBe('image/png');
      const body = Buffer.from(await res.arrayBuffer());
      expect(body.slice(1, 4).toString()).toBe('PNG');
    }
  }, 30000);

  it('defaults to svg and rejects unknown formats', async () => {
    const svg = await handleRequest(new Request(`${BASE}?type=pie&labels=A,B&values=3,2`), {}, {});
    expect(svg.headers.get('content-type')).toContain('image/svg+xml');
    const bad = await handleRequest(new Request(`${BASE}?type=pie&labels=A,B&values=3,2&format=webp`), {}, {});
    expect(bad.status).toBe(400);
    expect(await bad.text()).toContain('"format" must be svg (default) or png');
  });
});
