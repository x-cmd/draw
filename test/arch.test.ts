import { describe, it, expect } from 'vitest';
import { handleRequest } from '../src/handler.js';
import { renderArchFromUrl } from '../src/render/arch.js';
import { renderArchmapFromUrl } from '../src/render/archmap.js';

// /draw/arch2:架构图 v2 —— 和 /draw/archmap 同一套 URL 模型(data + 布局都在 URL 里),
// 换一张更像架构图的脸:类型着色 + 类型角标 + 底部图例 + 更松的布局 + 绕开盒子的走线。
const NODES = [
  'n=client;ext;Your app or CI;GET /draw?type=...;r0c0',
  'n=edge;fe;Edge worker;src/index.ts;r0c1',
  'n=handler;be;handler.ts;route + respond;r1c1',
  'n=specs;be;specs/;parse + validate;r2c0',
  'n=store;db;store.ts;short links;r2c1',
  'n=render;be;render/;draw the SVG;r3c0',
];
const EDGES = [
  'e=client;edge;HTTPS',
  'e=edge;handler',
  'e=handler;specs;spec',
  'e=handler;store;short link',
  'e=specs;render',
];

describe('arch v2 rendering', () => {
  it('renders a diagram with type badges, a legend and tinted nodes', () => {
    const url = new URL('https://x-cmd.com/draw/arch2?' + [...NODES, ...EDGES, 'title=Inside draw'].join('&'));
    const { svg } = renderArchFromUrl(url);
    expect(svg).toContain('<svg');
    expect(svg).toContain('Inside draw');
    // 图例:类型名 + 个数
    expect(svg).toContain('data-legend');
    expect(svg).toContain('Backend');
    expect(svg).toContain('External');
    // 类型角标
    expect(svg).toContain('>B<');
    expect(svg).toContain('>X<');
  });

  it('honours legend=0', () => {
    const url = new URL('https://x-cmd.com/draw/arch2?' + [...NODES, ...EDGES, 'legend=0'].join('&'));
    expect(renderArchFromUrl(url).svg).not.toContain('data-legend');
  });

  it('routes a fan-out without crossing the boxes in between', () => {
    // handler → specs/store/demo 三个目标在同一行:走总线通道,不横穿中间的盒子
    const nodes = [
      'n=h;be;Handler;r0c1',
      'n=a;be;Left;r1c0',
      'n=b;db;Middle;r1c1',
      'n=c;fe;Right;r1c2',
    ];
    const edges = ['e=h;a', 'e=h;b', 'e=h;c'];
    const url = new URL('https://x-cmd.com/draw/arch2?' + [...nodes, ...edges].join('&'));
    const { svg } = renderArchFromUrl(url);
    // 每条边都是折线(至少 4 个点),中间有一段是横着走的通道
    // (先去掉 <defs> —— 里面的箭头记号也是 muted 色的 path,不是边)
    const body = svg.replace(/<defs>.*?<\/defs>/s, '');
    const paths = [...body.matchAll(/<path d="([^"]+)"[^>]*stroke="var\(--d-muted\)"/g)].map((m) => m[1]);
    expect(paths.length).toBe(3);
    for (const d of paths) expect(d.split('L').length).toBeGreaterThan(2);
  });

  it('走一条公共的横向通道(总线),且不横穿中间的盒子', () => {
    const nodes = [
      'n=h;be;Handler;r0c1',
      'n=a;be;Left;r1c0',
      'n=b;db;Middle;r1c1',
      'n=c;fe;Right;r1c2',
    ];
    const edges = ['e=h;a', 'e=h;b', 'e=h;c'];
    const url = new URL('https://x-cmd.com/draw/arch2?' + [...nodes, ...edges].join('&'));
    const body = renderArchFromUrl(url).svg.replace(/<defs>.*?<\/defs>/s, '');
    const paths = [...body.matchAll(/<path d="([^"]+)"[^>]*stroke="var\(--d-muted\)"/g)].map((m) => m[1]);
    const pts = paths.map((d) => d.split(/[ML]/).filter(Boolean).map((p) => p.trim().split(' ').map(Number)));
    // 每条边都要有一段水平的通道,而且三条边共用同一条
    const channel = pts.map((p) => {
      for (let i = 1; i < p.length; i++) if (p[i][1] === p[i - 1][1]) return p[i][1];
      return null;
    });
    expect(channel.every((y) => y !== null)).toBe(true);
    expect(new Set(channel).size).toBe(1);
    // 盒子(rx=12 的是节点框)
    const boxes = [...body.matchAll(/<rect x="([\d.]+)" y="([\d.]+)" width="([\d.]+)" height="([\d.]+)" rx="12"/g)]
      .map((m) => ({ x: +m[1], y: +m[2], w: +m[3], h: +m[4] }));
    expect(boxes.length).toBe(4);
    // 任何一段线都不得穿过盒子(端点贴着边不算)
    for (const p of pts) {
      for (let i = 1; i < p.length; i++) {
        const [x1, y1] = p[i - 1];
        const [x2, y2] = p[i];
        for (const b of boxes) {
          const cross = y1 === y2
            ? y1 > b.y && y1 < b.y + b.h && Math.max(x1, x2) > b.x && Math.min(x1, x2) < b.x + b.w
            : x1 > b.x && x1 < b.x + b.w && Math.max(y1, y2) > b.y && Math.min(y1, y2) < b.y + b.h;
          expect(cross, `segment ${x1},${y1} → ${x2},${y2} crosses a box`).toBe(false);
        }
      }
    }
  });

  it('边界的小牌子不压住标题', () => {
    // 边界框比它的成员高一圈,牌子又探出边界框 9px —— 顶到画布上就会盖住标题
    const nodes = ['n=a;ext;A;;r0c0', 'n=b;be;B;;r0c1', 'n=c;be;C;;r1c1'];
    const url = new URL('https://x-cmd.com/draw/arch2?' + [...nodes, 'e=a;b', 'b=Top;a b', 'title=Inside draw'].join('&'));
    const { svg } = renderArchFromUrl(url);
    const dy = Number(/<g id="am" transform="translate\(0 ([\d.]+)\)"/.exec(svg)![1]);
    const titleY = Number(/<text x="44" y="([\d.]+)"[^>]*font-size="19"/.exec(svg)![1]);
    // 牌子:20 高、圆角 6 的小矩形(边标签的垫片是圆角 4)
    const chip = /<rect x="[\d.]+" y="([\d.]+)" width="[\d.]+" height="20" rx="6" fill="var\(--d-card\)"/.exec(svg);
    expect(chip).toBeTruthy();
    const chipTop = Number(chip![1]) + dy;
    expect(chipTop).toBeGreaterThan(titleY + 6);   // 牌子的顶在标题的字底之下
  });

  it('leaves the old /draw/archmap output untouched', () => {
    const q = 'n=user;ext;User;;r0c0&n=cdn;cloud;CDN;;r0c1&e=user;cdn;https&b=Data%20Layer;user%20cdn&title=Web%20App';
    const old = renderArchmapFromUrl(new URL('https://x-cmd.com/draw/archmap?' + q)).svg;
    const v2 = renderArchFromUrl(new URL('https://x-cmd.com/draw/arch2?' + q)).svg;
    expect(old).not.toBe(v2);
    expect(old).toContain('var(--d-border)'); // 老图:边框色
    expect(v2).toContain('data-legend');
  });

  it('answers 400 when there are no nodes', async () => {
    const res = await handleRequest(new Request('https://x-cmd.com/draw/arch2'), {}, {});
    expect(res.status).toBe(400);
    expect(await res.text()).toContain('n=');
  });

  it('serves the diagram over HTTP', async () => {
    const res = await handleRequest(
      new Request('https://x-cmd.com/draw/arch2?' + [...NODES, ...EDGES].join('&')),
      {}, {},
    );
    expect(res.status).toBe(200);
    expect(res.headers.get('content-type')).toContain('image/svg+xml');
  });
});
