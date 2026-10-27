import { describe, it, expect } from 'vitest';
import { renderEchartsFromUrl, renderEchartsOption } from '../src/render/echarts-ssr.js';
import { handleRequest } from '../src/handler.js';

// /draw/echarts 覆盖层:echarts 官方 SSR + 皮肤变量注入(方案见 x-cmd-hub/draw#12)。
// Node 运行时直渲 + 共享 HTTP 层路由两条路径都覆盖。
const BASE = 'https://draw.test/draw';
const OPT = encodeURIComponent(
  JSON.stringify({ xAxis: { type: 'category', data: ['A', 'B', 'C'] }, yAxis: { type: 'value' }, series: [{ type: 'bar', data: [1, 2, 3] }] }),
);
const url = (query: string): URL => new URL(`${BASE}/echarts?${query}`);

describe('renderEchartsFromUrl', () => {
  it('renders an echarts option to a skinned SVG', async () => {
    const { svg, version, cacheControl } = await renderEchartsFromUrl(url(`d=${OPT}`));
    expect(svg).toMatch(/^<svg role="img"/);
    expect(svg).toContain('var(--d-s1)'); // 系列色走皮肤变量
    expect(svg).toContain('--d-grid'); // 轴/网格中性色变量已内嵌
    expect(svg).toContain('DrawInter'); // Inter 子集 @font-face + 根 font-family
    expect(svg).toContain('<metadata>'); // AI round-trip:option 原文内嵌(metaTag 统一转义,与核心层一致)
    expect(svg).toContain('&quot;generator&quot;:&quot;draw&quot;');
    expect(svg).toContain('&quot;template&quot;:&quot;echarts&quot;');
    expect(version).toBe(1);
    expect(cacheControl).toContain('max-age');
  });

  it('injects neutrals as CSS vars so auto scheme needs a single render', async () => {
    const { svg } = await renderEchartsFromUrl(url(`d=${OPT}`));
    expect(svg).toContain('prefers-color-scheme: dark'); // auto = 双套 vars + media query
    expect(svg).toContain('stroke="var(--d-grid)"');
  });

  it('keeps user-specified colors over injected defaults', async () => {
    const opt = encodeURIComponent(JSON.stringify({
      textStyle: { fontFamily: 'serif' },
      xAxis: { type: 'category', data: ['A'], axisLabel: { color: '#123456' }, axisLine: { lineStyle: { color: '#654321' } } },
      yAxis: { type: 'value' },
      series: [{ type: 'bar', data: [1], itemStyle: { color: '#abcdef' } }],
    }));
    const { svg } = await renderEchartsFromUrl(url(`d=${opt}`));
    expect(svg).toContain('#123456');
    expect(svg).toContain('#654321');
    expect(svg).toContain('#abcdef');
    expect(svg).toContain('serif');
    expect(svg).toContain('stroke="var(--d-grid)"'); // 用户未写 yAxis.splitLine → 中性色缺省仍注入
  });

  it('clamps w/h to the shared canvas bounds', async () => {
    const { svg } = await renderEchartsFromUrl(url(`d=${OPT}&w=9999&h=10`));
    expect(svg).toMatch(/width="1600"/);
    expect(svg).toMatch(/height="140"/);
  });

  it('supports scheme=dark without the media query', async () => {
    const { svg } = await renderEchartsFromUrl(url(`d=${OPT}&scheme=dark`));
    expect(svg).toContain('color-scheme:dark');
    expect(svg).not.toContain('prefers-color-scheme');
  });

  it('auto-injects axes for cartesian series (SSR parity with the browser)', async () => {
    // 浏览器里 bar/line 裸 option 会自动建坐标系;echarts SSR 不建,直接抛
    // 'xAxis "0" not found' —— 覆盖层必须补齐浏览器对等行为
    for (const t of ['bar', 'line', 'scatter', 'boxplot']) {
      const opt = encodeURIComponent(JSON.stringify(t === 'scatter'
        ? { series: [{ type: t, data: [[1, 2], [3, 4]] }] }
        : { series: [{ type: t, data: [[850, 950, 1000, 1050, 1150]] }] }));
      const { svg } = await renderEchartsFromUrl(url(`d=${opt}`));
      expect(svg).toMatch(/^<svg/);
      expect(svg).toContain('var(--d-grid)'); // 注入的空轴也拿到了中性色缺省
    }
    // 非笛卡尔系列(pie)不受影响
    const { svg: pie } = await renderEchartsFromUrl(url(`d=${encodeURIComponent(JSON.stringify({ series: [{ type: 'pie', data: [{ name: 'a', value: 1 }] }] }))}`));
    expect(pie).toMatch(/^<svg/);
  });

  it('400s on missing / invalid / non-object / oversized d', async () => {
    await expect(renderEchartsFromUrl(url('w=500'))).rejects.toMatchObject({ status: 400 });
    await expect(renderEchartsFromUrl(url('d=%7Bnot-json'))).rejects.toMatchObject({ status: 400 });
    await expect(renderEchartsFromUrl(url(`d=${encodeURIComponent('[1,2]')}`))).rejects.toMatchObject({ status: 400 });
    await expect(renderEchartsFromUrl(url(`d=${encodeURIComponent(JSON.stringify({ series: { data: 'x'.repeat(20000) } }))}`)))
      .rejects.toMatchObject({ status: 400 });
  });

  it('renderEchartsOption (CLI/lib path) has no URL-length cap and honors shared params', async () => {
    const big = { xAxis: { type: 'category', data: Array.from({ length: 1500 }, (_, i) => `cat-${i}`) }, yAxis: { type: 'value' }, series: [{ type: 'bar', data: Array.from({ length: 1500 }, (_, i) => i) }] };
    const json = JSON.stringify(big);
    expect(json.length).toBeGreaterThan(16000); // 同体积走 ?d= 会被 400,option 级 API 不受限
    const { svg } = await renderEchartsOption(big, new URLSearchParams('scheme=dark&w=900'));
    expect(svg).toMatch(/width="900"/);
    expect(svg).toContain('color-scheme:dark');
  });
});

describe('handleRequest · /draw/echarts', () => {
  it('serves the route and the /echart alias as SVG', async () => {
    for (const path of ['/echarts', '/echart']) {
      const res = await handleRequest(new Request(`${BASE}${path}?d=${OPT}`), {}, {});
      expect(res.status).toBe(200);
      expect(res.headers.get('content-type')).toContain('image/svg+xml');
      expect(await res.text()).toMatch(/^<svg/);
    }
  });

  it('405s non-GET and 400s a bare GET', async () => {
    const post = await handleRequest(new Request(`${BASE}/echarts`, { method: 'POST', body: '{}' }), {}, {});
    expect(post.status).toBe(405);
    const bare = await handleRequest(new Request(`${BASE}/echarts`), {}, {});
    expect(bare.status).toBe(400);
    expect(await bare.text()).toContain('"d" is required');
  });
});
