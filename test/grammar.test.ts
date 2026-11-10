import { describe, it, expect } from 'vitest';
import { renderArchFromUrl } from '../src/render/arch.js';
import { renderArchmapFromUrl } from '../src/render/archmap.js';
import { renderSeqFromUrl } from '../src/render/seq.js';
import { renderUcFromUrl } from '../src/render/uc.js';
import { renderKindFromUrl } from '../src/render/kinds.js';

// 一套语法,所有带节点的图种共用:
//   n=id;type;label[;sub][;pos]     节点
//   e=from;to[;label][;dash|main]   边
//   b=label;id id …                  边界(框住一组节点)
// 这里把它钉死成契约:任何图种都不许自己另立一套。
type Kind = {
  /** URL 路径 */
  path: string;
  /** 这套图允许的节点类型 */
  types: string[];
  /** 这套图的一个合法节点(带副标 + 位置) */
  node: string;
  /** 这套图的第二条节点(用来连边) */
  node2: string;
  /** 这套图允许的边写法 */
  edge: string;
  render: (url: URL) => { svg: string };
};

const KINDS: Kind[] = [
  {
    path: '/draw/archmap',
    types: ['ext', 'fe', 'be', 'db', 'cloud', 'sec', 'bus', 'svc'],
    node: 'n=a;fe;Frontend;the browser;r0c0',
    node2: 'n=b;be;Backend;the worker;r1c0',
    edge: 'e=a;b;calls',
    render: (u) => renderArchmapFromUrl(u),
  },
  {
    path: '/draw/arch2',
    types: ['ext', 'fe', 'be', 'db', 'cloud', 'sec', 'bus', 'svc'],
    node: 'n=a;fe;Frontend;the browser;r0c0',
    node2: 'n=b;be;Backend;the worker;r1c0',
    edge: 'e=a;b;calls',
    render: (u) => renderArchFromUrl(u),
  },
  {
    path: '/draw/seq',
    types: ['ext', 'fe', 'be', 'db', 'cloud', 'sec', 'bus', 'svc'],
    node: 'n=a;fe;Your app;the caller;r0c0',
    node2: 'n=b;be;Worker;the server;r0c1',
    edge: 'e=a;b;GET /draw',
    render: (u) => renderSeqFromUrl(u),
  },
  {
    path: '/draw/uc',
    types: ['actor', 'uc'],
    node: 'n=a;actor;Your app;the caller;r0c0',
    node2: 'n=b;uc;Render a chart;the ask;r0c1',
    edge: 'e=a;b',
    render: (u) => renderUcFromUrl(u),
  },
  {
    path: '/draw/dataflow',
    types: ['process', 'store', 'source', 'sink'],
    node: 'n=a;process;Extract;read the CSV;r0c0',
    node2: 'n=b;store;Warehouse;parquet;r1c0',
    edge: 'e=a;b;rows',
    render: (u) => renderKindFromUrl('dataflow', u),
  },
  {
    path: '/draw/lifecycle',
    types: ['state', 'decision', 'terminal'],
    node: 'n=a;state;New;just created;r0c0',
    node2: 'n=b;terminal;Fulfilled;all done;r1c0',
    edge: 'e=a;b;paid',
    render: (u) => renderKindFromUrl('lifecycle', u),
  },
  {
    path: '/draw/erd',
    types: ['table', 'view'],
    node: 'n=a;table;users;id:int (pk)%0Aname:text;r0c0',
    node2: 'n=b;view;active_users;id:int;r1c0',
    edge: 'e=a;b;1:N',
    render: (u) => renderKindFromUrl('erd', u),
  },
  {
    path: '/draw/class',
    types: ['class', 'iface', 'enum'],
    node: 'n=a;class;User;id:int%0Aname:string;r0c0',
    node2: 'n=b;iface;Repository;find(id): User?;r1c0',
    edge: 'e=a;b;implements',
    render: (u) => renderKindFromUrl('class', u),
  },
];

describe('一套节点语法,所有图种通用', () => {
  for (const k of KINDS) {
    it(`${k.path} 接受 id;type;label;sub;pos`, () => {
      const url = new URL('https://x-cmd.com' + k.path + '?' + [k.node, k.node2, k.edge].join('&'));
      const { svg } = k.render(url);
      expect(svg).toContain('<svg');
      // 副标画出来了
      const subs = ['the browser', 'the worker', 'the caller', 'the server', 'the ask',
        'read the CSV', 'parquet', 'just created', 'all done', 'name:text', 'name:string'];
      const shown = subs.filter((s) => svg.includes(s));
      expect(shown.length).toBeGreaterThan(0);
    });

    it(`${k.path} 末尾多写分号不报错`, () => {
      const url = new URL('https://x-cmd.com' + k.path + '?' + [k.node + ';', k.node2 + ';;', k.edge].join('&'));
      const { svg } = k.render(url);
      expect(svg).toContain('<svg');
    });

    it(`${k.path} 不给位置也能画(自动排)`, () => {
      const bare = k.node.split(';').slice(0, 3).join(';');
      const bare2 = k.node2.split(';').slice(0, 3).join(';');
      const url = new URL('https://x-cmd.com' + k.path + '?' + [bare, bare2, k.edge].join('&'));
      const { svg } = k.render(url);
      expect(svg).toContain('<svg');
    });

    it(`${k.path} 认得 b= 边界参数`, () => {
      const url = new URL('https://x-cmd.com' + k.path + '?' + [k.node, k.node2, k.edge, 'b=sys;a b'].join('&'));
      const { svg } = k.render(url);
      expect(svg).toContain('SYS');
    });

    it(`${k.path} 只认自己那套类型词汇`, () => {
      const other = k.types.includes('fe') ? 'uc' : 'fe';
      const bad = `n=a;${other};X`;
      const url = new URL('https://x-cmd.com' + k.path + '?' + bad);
      expect(() => k.render(url)).toThrow();
    });
  }
});

describe('位置语法(r0c1 / p40,80)', () => {
  it('格子位置让节点落到指定的行列', () => {
    const one = 'n=a;be;A;;r0c0';
    const two = 'n=b;be;B;;r2c2';
    const url = new URL('https://x-cmd.com/draw/arch2?' + [one, two, 'e=a;b'].join('&'));
    const { svg } = renderArchFromUrl(url);
    const xs = [...svg.matchAll(/<rect x="([0-9.]+)"[^>]*data-node="a"/g)].map((m) => Number(m[1]));
    const xsB = [...svg.matchAll(/<rect x="([0-9.]+)"[^>]*data-node="b"/g)].map((m) => Number(m[1]));
    if (xs.length && xsB.length) {
      expect(xsB[0]).toBeGreaterThan(xs[0]);
    }
    // 至少画了东西
    expect(svg).toContain('<svg');
  });

  it('像素位置直接给出坐标', () => {
    const url = new URL('https://x-cmd.com/draw/arch2?n=a;be;Box;;p40,80');
    const { svg } = renderArchFromUrl(url);
    expect(svg).toContain('<svg');
    expect(svg).toContain('40');
  });

  it('位置写错时报错说清楚格式', () => {
    expect(() => renderArchFromUrl(new URL('https://x-cmd.com/draw/arch2?n=a;be;Box;;rXcY')))
      .toThrow(/r0c1/);
  });
});

describe('边标签要看得清', () => {
  const q = [
    'n=web;fe;Web app;your browser;r0c0',
    'n=api;be;API;Cloudflare Worker;r0c1',
    'n=db;db;Specs;JSON files;r1c1',
    'e=web;api;GET /draw?type=pie',
    'e=api;db;read',
  ].join('&');

  it('标签底衬用画布色,不是黑色(黑底深字 = 看不清)', () => {
    const { svg } = renderArchFromUrl(new URL('https://x-cmd.com/draw/arch2?' + q));
    // --d-bg 这个变量根本没定义,用它就等于没上色(默认黑)
    expect(svg).not.toContain('--d-bg');
    expect(svg).toContain('fill="var(--d-card)"');
  });

  it('两个边标签不叠在一起', () => {
    const { svg } = renderArchFromUrl(new URL('https://x-cmd.com/draw/arch2?' + q));
    // 标签底衬:宽 x 高 + x + y
    const chips = [...svg.matchAll(/<rect x="([0-9.]+)" y="([0-9.]+)" width="([0-9.]+)" height="([0-9.]+)" rx="5" fill="var\(--d-card\)"/g)]
      .map((m) => ({ x: +m[1], y: +m[2], w: +m[3], h: +m[4] }));
    expect(chips.length).toBeGreaterThanOrEqual(2);
    for (let i = 0; i < chips.length; i++) {
      for (let j = i + 1; j < chips.length; j++) {
        const a = chips[i]; const b = chips[j];
        const hit = a.x < b.x + b.w && b.x < a.x + a.w && a.y < b.y + b.h && b.y < a.y + a.h;
        expect(hit).toBe(false);
      }
    }
  });

  it('标签比空档宽时,把列撑开,标签不压在角标上', () => {
    const nodes = 'n=web;fe;Web app;;r0c0&n=api;be;API;;r0c1';
    const short = renderArchFromUrl(new URL('https://x-cmd.com/draw/arch2?' + nodes + '&e=web;api;call')).svg;
    const long = renderArchFromUrl(new URL('https://x-cmd.com/draw/arch2?' + nodes + '&e=web;api;GET /draw?type=pie')).svg;
    const wOf = (s: string): number => Number(/width="([0-9.]+)"/.exec(s)![1]);
    // 长标签的那张更宽(列被撑开了)
    expect(wOf(long)).toBeGreaterThan(wOf(short));
  });
});

describe('画布纸(paper=1)', () => {
  it('默认不铺纸,写了才有', () => {
    const q = 'n=a;be;A;;r0c0&n=b;be;B;;r0c1&e=a;b';
    const plain = renderArchFromUrl(new URL('https://x-cmd.com/draw/arch2?' + q)).svg;
    const paper = renderArchFromUrl(new URL('https://x-cmd.com/draw/arch2?' + q + '&paper=1')).svg;
    expect(plain).not.toContain('url(#am-paper)');
    expect(paper).toContain('url(#am-paper)');
    expect(paper).toContain('am-paper" width="26"');
  });
});

describe('b= 泳道/边界,所有图种都认', () => {
  it('seq 把一组参与方圈成泳道', () => {
    const q = [
      'n=app;fe;Your app;;r0c0',
      'n=api;be;API;;r0c1',
      'n=pay;ext;Provider;;r0c2',
      'e=app;api;call',
      'e=api;pay;charge',
      'b=draw;app api',
      'b=external;pay',
    ].join('&');
    const { svg } = renderSeqFromUrl(new URL('https://x-cmd.com/draw/seq?' + q));
    expect(svg).toContain('DRAW');
    expect(svg).toContain('EXTERNAL');
    expect(svg).toContain('data-boundary');
  });

  it('uc 可以画多层边界', () => {
    const q = [
      'n=a;actor;User',
      'n=u1;uc;Render',
      'n=u2;uc;Share',
      'e=a;u1',
      'b=inner;u1',
      'b=outer;u1 u2',
    ].join('&');
    const { svg } = renderUcFromUrl(new URL('https://x-cmd.com/draw/uc?' + q));
    expect(svg).toContain('INNER');
    expect(svg).toContain('OUTER');
  });

  it('边界上色:作者指定的色板编号优先', () => {
    const q = 'n=a;be;A;r0c0&n=b;be;B;r1c0&e=a;b&b=sys;a b;9';
    const { svg } = renderArchFromUrl(new URL('https://x-cmd.com/draw/arch2?' + q));
    expect(svg).toContain('var(--d-s9)');
  });

  it('边界默认取「这套词汇没被类型占用」的颜色', () => {
    // 架构图那八种类型占了 s1–s7,边界只能用 s8/s9/s10
    const q = 'n=a;be;A;r0c0&n=b;be;B;r1c0&e=a;b&b=sys;a b';
    const { svg } = renderArchFromUrl(new URL('https://x-cmd.com/draw/arch2?' + q));
    expect(svg).toContain('var(--d-s8)');
    expect(svg).not.toContain('var(--d-s1)" stroke-opacity="0.65"');
  });

  it('绕行的边待在边界框里,不跑出「区域」', () => {
    // 两端都在区域里,中间的盒子挡路 → 绕行通道应该在框内
    // 同一行里 d 和 e 之间夹着一个盒子 m → d→e 必须绕行
    const nodes = [
      'n=a;be;A;;r0c0', 'n=m;be;M;;r1c1',
      'n=d;be;D;;r1c0', 'n=e;be;E;;r1c2',
    ];
    const q = [...nodes, 'e=d;e;write', 'b=Region;d e m'].join('&');
    const { svg } = renderArchFromUrl(new URL('https://x-cmd.com/draw/arch2?' + q));
    // 边界框的下沿
    const bb = /<rect x="([\d.]+)" y="([\d.]+)" width="([\d.]+)" height="([\d.]+)" rx="14" fill="none" stroke="var\(--d-s\d+\)"/.exec(svg);
    expect(bb).toBeTruthy();
    const bottom = Number(bb![2]) + Number(bb![4]);
    // 走线的每一个 y 都要在框内(框的上沿留出标签胶囊的余量)
    for (const m of svg.matchAll(/<path d="M([\d.]+) ([\d.]+)L([\d.]+) ([\d.]+)/g)) {
      expect(Number(m[2])).toBeLessThan(bottom);
      expect(Number(m[4])).toBeLessThan(bottom);
    }
  });

  it('b= 里的 id 不存在就报错', () => {
    expect(() => renderSeqFromUrl(new URL('https://x-cmd.com/draw/seq?n=a;fe;A;r0c0&b=sys;ghost')))
      .toThrow(/ghost/);
  });
});

describe('Edit @X-CMD 角标直链 explore 落地页', () => {
  const hrefOf = (svg: string): string => /<a href="([^"]*)"/.exec(svg)?.[1] ?? '';
  const cases: [string, string, (u: URL) => { svg: string }][] = [
    ['arch2', 'n=a;be;A;r0c0&n=b;be;B;r1c0&e=a;b', (u) => renderArchFromUrl(u)],
    ['seq', 'n=a;be;A;r0c0&n=b;be;B;r1c0&e=a;b', (u) => renderSeqFromUrl(u)],
    ['uc', 'n=a;actor;A&n=b;uc;B&e=a;b', (u) => renderUcFromUrl(u)],
    ['dataflow', 'n=a;process;A;r0c0&n=b;store;B;r1c0&e=a;b', (u) => renderKindFromUrl('dataflow', u)],
    ['lifecycle', 'n=a;state;A;r0c0&n=b;state;B;r1c0&e=a;b', (u) => renderKindFromUrl('lifecycle', u)],
    ['erd', 'n=a;table;A;r0c0&n=b;table;B;r1c0&e=a;b', (u) => renderKindFromUrl('erd', u)],
    ['class', 'n=a;class;A;r0c0&n=b;class;B;r1c0&e=a;b', (u) => renderKindFromUrl('class', u)],
  ];
  for (const [kind, q, fn] of cases) {
    it(`${kind} 的角标链到 /draw/explore/${kind},并带着原来的参数`, () => {
      const { svg } = fn(new URL(`https://x-cmd.com/draw/${kind}?${q}`));
      const href = hrefOf(svg);
      expect(href).toContain(`/draw/explore/${kind}?`);
      // 参数还在(百分号编码也算)
      expect(decodeURIComponent(href)).toContain('n=a;');
      expect(decodeURIComponent(href)).toContain('e=a;b');
    });
  }
});
