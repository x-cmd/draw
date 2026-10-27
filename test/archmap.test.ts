import { describe, it, expect } from 'vitest';
import { draw } from '../src/lib.js';
import { renderArchmapFromUrl } from '../src/render/archmap.js';
import { handleRequest } from '../src/handler.js';
import { ApiError } from '../src/specs/index.js';

// /draw/archmap(x-cmd-hub/draw#17/#20):网格拓扑图 — 解析/打包/路由/避让的确定性,
// 以及三种入口(子路径 /draw/archmap、type=archmap 透传、CLI 同参)同输出。
const WEBAPP = [
  ['n', 'user;ext;User;;r0c0'],
  ['n', 'cdn;cloud;CDN;;r0c1'],
  ['n', 'web;fe;Web App;SSR;r0c2'],
  ['n', 'api;be;API;;r1c1'],
  ['n', 'db;db;Postgres;;r2c1'],
  ['n', 'redis;db;Redis;;r2c2'],
  ['e', 'user;cdn;https'],
  ['e', 'cdn;web'],
  ['e', 'web;api;json'],
  ['e', 'api;db;sql;dash'],
  ['e', 'api;redis'],
  ['b', 'Data Layer;db redis'],
] as const;

function qs(pairs: readonly (readonly [string, string])[]): string {
  return '?' + pairs.map(([k, v]) => `${k}=${encodeURIComponent(v)}`).join('&');
}

describe('archmap rendering', () => {
  it('renders a three-tier map from the object form (repeated params as arrays)', () => {
    const obj: Record<string, string | string[]> = { type: 'archmap', title: 'Web App' };
    for (const [k, v] of WEBAPP) obj[k] = [...(Array.isArray(obj[k]) ? obj[k] : []), v];
    const { svg, version } = draw(obj);
    expect(svg).toContain('Postgres');
    expect(svg).toContain('DATA LAYER');
    expect(version).toBeGreaterThanOrEqual(1);
  });

  it('renders via query string (lib) and matches the /draw/archmap endpoint output', async () => {
    const url = `https://draw.test/draw/archmap${qs(WEBAPP)}`;
    const viaPath = renderArchmapFromUrl(new URL(url)).svg;
    const viaType = draw(`type=archmap${qs(WEBAPP).slice(1) ? '&' + qs(WEBAPP).slice(1) : ''}`).svg;
    const res = await handleRequest(new Request(url), {}, {});
    expect(res.status).toBe(200);
    expect(res.headers.get('content-type')).toContain('image/svg+xml');
    expect(await res.text()).toBe(viaPath);
    expect(viaType).toBe(viaPath);
  });

  it('accepts the /draw/arch alias', async () => {
    const res = await handleRequest(new Request(`https://draw.test/draw/arch${qs(WEBAPP.slice(0, 3))}`), {}, {});
    expect(res.status).toBe(200);
    expect(await res.text()).toMatch(/^<svg/);
  });

  it('emits nodes, orthogonal paths, markers, boundary label and metadata round-trip', () => {
    const svg = renderArchmapFromUrl(new URL(`https://draw.test/draw/archmap${qs(WEBAPP)}`)).svg;
    expect(svg).toContain('Web App');          // 标题
    expect(svg).toContain('Postgres');         // 节点
    expect(svg).toContain('DATA LAYER');       // 边界标签(大写)
    expect(svg).toContain('stroke-dasharray="5 3"'); // ext 虚线框(User)
    expect(svg).toContain('stroke-dasharray="5 4"'); // dash 变体边
    expect(svg).toMatch(/<path d="M[\d.]+ [\d.]+L[\d.]+ [\d.]+/); // 正交折线(相邻点单轴变化)
    expect(svg).toContain('marker-end="url(#am-p)"');
    expect(svg).toContain('template&quot;:&quot;archmap'); // <metadata> 回程(引号经 esc 转义)
  });

  it('keeps orthogonal segments single-axis (no diagonals)', () => {
    const svg = renderArchmapFromUrl(new URL(`https://draw.test/draw/archmap${qs(WEBAPP)}`)).svg;
    const body = svg.replace(/<defs>[\s\S]*?<\/defs>/, ''); // 箭头 marker 是斜三角,不算走线
    const paths = [...body.matchAll(/<path d="([^"]+)"/g)].map(m => m[1]);
    expect(paths.length).toBeGreaterThanOrEqual(5);
    for (const d of paths) {
      const pts = [...d.matchAll(/([ML])([\d.]+) ([\d.]+)/g)].map(m => [+m[2], +m[3]]);
      for (let i = 1; i < pts.length; i++) {
        const sameX = pts[i][0] === pts[i - 1][0];
        const sameY = pts[i][1] === pts[i - 1][1];
        expect(sameX || sameY).toBe(true);
      }
    }
  });

  it('supports spans, pixel escape hatch and grid= reservation', () => {
    const span = renderArchmapFromUrl(new URL(`https://draw.test/draw/archmap?n=a;svc;A;;r0c0w2&n=b;svc;B;;r0c2`)).svg;
    expect(span).toMatch(/width="(2\d\d|\d{3})"/); // 画布随轨道
    const px = renderArchmapFromUrl(new URL(`https://draw.test/draw/archmap?n=a;svc;A;;p40,60,120x44&n=b;svc;B;;p240,70`)).svg;
    expect(px).toContain('>A<');
    expect(px).toContain('>B<');
  });

  it('is deterministic for identical params', () => {
    const a = renderArchmapFromUrl(new URL(`https://draw.test/draw/archmap${qs(WEBAPP)}`)).svg;
    const b = renderArchmapFromUrl(new URL(`https://draw.test/draw/archmap${qs(WEBAPP)}`)).svg;
    expect(a).toBe(b);
  });
});

describe('archmap param validation', () => {
  const cases: [string, string][] = [
    ['', 'at least one node'],
    ['n=x;nope;X;r0c0', 'unknown type'],
    ['n=x;svc;X;sub;zz9', 'pos must look like'],
    ['n=x;svc;X;r9c9&n=y;svc;Y;r9c9', 'share grid cell'],
    ['n=x;svc;X;r0c0&n=x;svc;X;r1c0', 'duplicate node id'],
    ['n=x;svc;X;r0c0&e=x;ghost', 'unknown node "ghost"'],
    ['n=x;svc;X;r0c0&e=x;x;lab;fancy', 'unknown variant'],
    ['n=x;svc;X;r0c0&b=Box;ghost', 'unknown node "ghost"'],
    ['n=x;svc;X;r0c0&b=Box', 'expected <label>;<id>'],
  ];
  for (const [query, needle] of cases) {
    it(`rejects ?${query} with 400 (${needle})`, () => {
      expect(() => renderArchmapFromUrl(new URL(`https://draw.test/draw/archmap?${query}`))).toThrowError(ApiError);
      try {
        renderArchmapFromUrl(new URL(`https://draw.test/draw/archmap?${query}`));
      } catch (err) {
        expect((err as ApiError).message).toContain(needle);
      }
    });
  }
});
