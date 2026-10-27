import { describe, it, expect } from 'vitest';
import { draw } from '../src/lib.js';
import { renderMindmapFromUrl } from '../src/render/mindmap.js';
import { handleRequest } from '../src/handler.js';
import { ApiError } from '../src/specs/index.js';

// /draw/mindmap(x-cmd-hub/draw#17/#20):路径参数 → 前缀树 → tidy 布局。
// 叶槽位顺序 + 父居中;三种入口(子路径、type=mindmap 透传、对象数组形态)同输出。
const PATHS = [
  'Product/Features/Speed',
  'Product/Features/Simple',
  'Product/Features/Secure/SSO',
  'Product/Markets/EU',
  'Product/Markets/US',
  'Product/Team',
];

const qs = (ps: string[]): string => ps.map(p => `n=${encodeURIComponent(p)}`).join('&');

describe('mindmap rendering', () => {
  it('renders via the object form (n as array = repeated params)', () => {
    const { svg, version } = draw({ type: 'mindmap', n: PATHS });
    expect(svg).toContain('>Product<');
    expect(svg).toContain('>SSO<');
    expect(version).toBeGreaterThanOrEqual(1);
  });

  it('matches across /draw/mindmap endpoint and type=mindmap passthrough', async () => {
    const url = `https://draw.test/draw/mindmap?${qs(PATHS)}`;
    const viaPath = renderMindmapFromUrl(new URL(url)).svg;
    const viaType = draw(`type=mindmap&${qs(PATHS)}`).svg;
    const res = await handleRequest(new Request(url), {}, {});
    expect(res.status).toBe(200);
    expect(res.headers.get('content-type')).toContain('image/svg+xml');
    expect(await res.text()).toBe(viaPath);
    expect(viaType).toBe(viaPath);
  });

  it('emits root pill, branch-colored curves and metadata round-trip', () => {
    const svg = renderMindmapFromUrl(new URL(`https://draw.test/draw/mindmap?${qs(PATHS)}`)).svg;
    expect(svg).toMatch(/<rect [^>]*rx="13"/);          // 根胶囊
    expect(svg).toContain('font-weight="600"');          // 一级分支粗体
    expect(svg).toContain('stroke-linecap="round"');     // 有机曲线
    expect(svg).toContain('var(--d-s1)');                // 分支着色
    expect(svg).toContain('template&quot;:&quot;mindmap'); // <metadata> 回程
  });

  it('merges shared prefixes (intermediate nodes appear once)', () => {
    const svg = renderMindmapFromUrl(new URL(`https://draw.test/draw/mindmap?${qs(PATHS)}`)).svg;
    expect(svg.match(/>Features</g)?.length).toBe(1);
    expect(svg.match(/>Markets</g)?.length).toBe(1);
    expect(svg.match(/>Product</g)?.length).toBe(1);
  });

  it('keeps leaves in path order top-to-bottom', () => {
    const svg = renderMindmapFromUrl(new URL(`https://draw.test/draw/mindmap?${qs(['A/one', 'A/two', 'A/three'])}`)).svg;
    const ys = ['one', 'two', 'three'].map(t => {
      const m = new RegExp(`<text[^>]*y="([\\d.]+)"[^>]*>${t}<`).exec(svg);
      return m ? +m[1] : -1;
    });
    expect(ys[0]).toBeGreaterThan(0);
    expect(ys[0]).toBeLessThan(ys[1]);
    expect(ys[1]).toBeLessThan(ys[2]);
  });

  it('is deterministic for identical params', () => {
    const a = renderMindmapFromUrl(new URL(`https://draw.test/draw/mindmap?${qs(PATHS)}`)).svg;
    const b = renderMindmapFromUrl(new URL(`https://draw.test/draw/mindmap?${qs(PATHS)}`)).svg;
    expect(a).toBe(b);
  });
});

describe('mindmap param validation', () => {
  const cases: [string, string][] = [
    ['', 'at least one n='],
    ['n=Solo', 'at least one branch'],
    ['n=A/B&n=C/D', 'one tree'],
    ['n=A//B', 'non-empty'],
    ['n=A/B/', 'non-empty'],
    ['n=/A/B', 'non-empty'],
    ['n=' + Array.from({ length: 10 }, (_, i) => 'L' + i).join('/'), 'deeper than'],
  ];
  for (const [query, needle] of cases) {
    it(`rejects ?${query} with 400 (${needle})`, () => {
      try {
        renderMindmapFromUrl(new URL(`https://draw.test/draw/mindmap?${query}`));
        expect.unreachable('should have thrown');
      } catch (err) {
        expect(err).toBeInstanceOf(ApiError);
        expect((err as ApiError).message).toContain(needle);
      }
    });
  }
});
