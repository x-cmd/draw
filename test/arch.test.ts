import { describe, it, expect } from 'vitest';
import { handleRequest } from '../src/handler.js';
import { renderArchFromUrl, renderCloudFromUrl } from '../src/render/arch.js';
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
    const chip = /<rect x="[\d.]+" y="([\d.]+)" width="[\d.]+" height="20" rx="6" fill="var\(--d-s\d+\)"/.exec(svg);
    expect(chip).toBeTruthy();
    const chipTop = Number(chip![1]) + dy;
    expect(chipTop).toBeGreaterThan(titleY + 6);   // 牌子的顶在标题的字底之下
  });

  it('节点可以带云厂商图标(有图标就没有类型字母)', () => {
    const url = new URL('https://x-cmd.com/draw/arch2?' + [
      'n=api;be;API;ECS;r0c0;aws:ecs',
      'n=db;db;RDS;;r1c0;aws:rds',
      'n=plain;be;No icon;;r2c0',
    ].join('&'));
    const { svg } = renderArchFromUrl(url);
    // 图标是内嵌的 data URI(不外链)
    expect(svg).toContain('data:image/png;base64,');
    expect((svg.match(/<image /g) ?? []).length).toBe(2);
    // 没图标的节点还是类型字母
    expect((svg.match(/font-weight="700" fill="var\(--d-[^"]+\)">B</g) ?? []).length).toBe(1);
  });

  it('图标字段的位置随便放(认形状不认顺序)', () => {
    const a = renderArchFromUrl(new URL('https://x-cmd.com/draw/arch2?n=a;be;A;aws:ec2;r0c0')).svg;
    const b = renderArchFromUrl(new URL('https://x-cmd.com/draw/arch2?n=a;be;A;r0c0;aws:ec2')).svg;
    expect(a).toContain('data:image/png;base64,');
    expect(b).toContain('data:image/png;base64,');
    // 副标题还在
    const c = renderArchFromUrl(new URL('https://x-cmd.com/draw/arch2?n=a;be;A;sub;r0c0;aws:ec2')).svg;
    expect(c).toContain('sub');
    expect(c).toContain('data:image/png;base64,');
  });

  it('大图标版(/draw/cloud):节点就是图标,名字在下面', () => {
    const url = new URL('https://x-cmd.com/draw/cloud?' + [
      'n=api;be;API;;r0c0;aws:ecs',
      'n=db;db;RDS;;r1c0;aws:rds',
      'e=api;db;查询',
    ].join('&'));
    const { svg } = renderCloudFromUrl(url);
    // 图标是大块(64px),名字在下面
    expect(svg).toContain('width="64" height="64"');
    expect(svg).toContain('data:image/png;base64,');
    // 普通架构图不是这样(角标 20px 的方块)
    const plain = renderArchFromUrl(new URL('https://x-cmd.com/draw/arch2?' + [
      'n=api;be;API;;r0c0;aws:ecs',
    ].join('&'))).svg;
    expect(plain).not.toContain('width="64" height="64"');
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

describe('端口与走线', () => {
  /** 每条边的折点 */
  const routesOf = (svg: string): [number, number][][] =>
    [...svg.replace(/<defs>[\s\S]*?<\/defs>/g, '').matchAll(/<path d="(M[^"]+)"/g)]
      .map((m) => m[1].split(/[ML]/).filter(Boolean).map((p) => p.trim().split(' ').map(Number) as [number, number]));

  it('进来的线跟出去的线不落在同一个端口(不然看着像一根线穿过节点)', () => {
    // etl 在 rs 的右上:etl→rs 从右边进,rs→qs 从右边出
    const { svg } = renderArchFromUrl(new URL('https://x-cmd.com/draw/arch2?' + [
      'n=etl;be;ETL;r0c1',
      'n=rs;db;RS;r1c0',
      'n=qs;fe;QS;r1c1',
      'e=etl;rs;in',
      'e=rs;qs;out',
    ].join('&')));
    const routes = routesOf(svg);
    expect(routes.length).toBe(2);
    const inRoute = routes[0];   // etl → rs
    const outRoute = routes[1];  // rs → qs
    // 两个端口不是同一个点(是同一个点的话,看着像一根线穿过了节点)
    expect(inRoute[inRoute.length - 1]).not.toEqual(outRoute[0]);
  });

  it('扇出可以共用一段(从一个源分出去的几条线,起点同一边)', () => {
    // switch → 三个目标:共用源那一侧是好事(读者一眼看出是同一个源)
    const { svg } = renderArchFromUrl(new URL('https://x-cmd.com/draw/arch2?' + [
      'n=sw;svc;Switch;r0c0',
      'n=a;db;A;r1c0',
      'n=b;db;B;r1c1',
      'n=c;db;C;r2c0',
      'e=sw;a',
      'e=sw;b',
      'e=sw;c',
    ].join('&')));
    const routes = routesOf(svg);
    expect(routes.length).toBe(3);
    // 三条线都从 sw 的同一条边(下边)出来 → y 相同,x 散开
    const ys = routes.map((r) => r[0][1]);
    expect(new Set(ys).size).toBe(1);
    expect(new Set(routes.map((r) => r[0][0])).size).toBeGreaterThan(1);
  });
});

// org: 前缀 = 公司/机构图标。那族图标住在私有仓的内部图库里(商标图形不能公开分发),
// 公开请求查不到 → 画组图标(自绘的通用机构剪影,公开层不输出任何第三方图形)。
describe('org: 公司图标(公开层)', () => {
  const ORG = 'M5 4h14v18h-5v-5h-4v5H5V4Z';

  it('认 org: 前缀当图标字段(不当成副标题或位置)', () => {
    const svg = renderCloudFromUrl(new URL('https://x-cmd.com/draw/cloud?n=a;ext;Verisign;org:verisign;r0c0')).svg;
    expect(svg).toContain(ORG);
    expect(svg).toContain('Verisign');
    // 副标题没被当成图标吃掉:节点仍是图标节点(名字在下面),不是普通方框
    expect(svg).toContain('translate(');
  });

  it('公开层不内嵌任何第三方图形(组图标是矢量,不是 data URI)', () => {
    const svg = renderCloudFromUrl(new URL('https://x-cmd.com/draw/cloud?n=a;ext;Verisign;org:verisign;r0c0')).svg;
    expect(svg).not.toContain('data:image/');
    expect(svg).toContain('fill-rule="evenodd"');
  });

  it('云厂商图标那一族不受影响(照旧内嵌 data URI)', () => {
    const svg = renderCloudFromUrl(new URL('https://x-cmd.com/draw/cloud?n=a;cloud;CF;aws:cloudfront;r0c0')).svg;
    expect(svg).toContain('data:image/png;base64,');
    expect(svg).not.toContain(ORG);
  });

  it('arch2 的角标位画组图标(不是类型字母)', () => {
    const svg = renderArchFromUrl(new URL('https://x-cmd.com/draw/arch2?n=a;ext;Verisign;org:verisign;r0c0')).svg;
    expect(svg).toContain(ORG);
    // 类型字母让位给组图标:那格说的是"这是个机构",不是"这是外部依赖"
    expect(svg).not.toContain('>X<');
  });

  it('不认识的云厂商图标照旧(类型字母),不换成组图标', () => {
    const svg = renderArchFromUrl(new URL('https://x-cmd.com/draw/arch2?n=a;be;API;aws:nope;r0c0')).svg;
    expect(svg).not.toContain(ORG);
    expect(svg).toContain('>B<');
  });

  it('调用方可以注入图标(私有仓的公司图标库就是走这条路)', () => {
    const svg = renderCloudFromUrl(
      new URL('https://x-cmd.com/draw/cloud?n=a;ext;Verisign;org:verisign;r0c0'),
      false,
      { icons: { 'org:verisign': 'data:image/svg+xml;base64,PHN2Zz48L3N2Zz4=' } },
    ).svg;
    // 注入的图标优先,组图标让位
    expect(svg).toContain('data:image/svg+xml;base64,');
    expect(svg).not.toContain(ORG);
  });
});
