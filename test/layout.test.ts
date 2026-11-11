import { describe, it, expect } from 'vitest';
import { layeredLayout } from '../src/render/layout.js';
import { renderArchFromUrl } from '../src/render/arch.js';
import { renderKindFromUrl } from '../src/render/kinds.js';

// 分层布局(Sugiyama):没写位置时,引擎按依赖分层摆 ——
// 层往右走(LR)、层内少交叉、边与边不打架。
// 以前是「按给的顺序塞进 12 列的一横排」,八个节点能撑出近 4000px 宽。

const node = (id: string) => ({ id, w: 160, h: 48 });

describe('layeredLayout · 分层', () => {
  it('链条排成一层一个:源在左,汇在右', () => {
    const res = layeredLayout({
      nodes: ['a', 'b', 'c', 'd'].map(node),
      edges: [
        { from: 'a', to: 'b' },
        { from: 'b', to: 'c' },
        { from: 'c', to: 'd' },
      ],
      layerGap: 60,
      nodeGap: 40,
      pad: 20,
    });
    expect(res.depth).toBe(4);
    const x = (id: string): number => res.boxes.get(id)!.x;
    expect(x('a')).toBeLessThan(x('b'));
    expect(x('b')).toBeLessThan(x('c'));
    expect(x('c')).toBeLessThan(x('d'));
  });

  it('扇出在同一层,汇在下一层', () => {
    const res = layeredLayout({
      nodes: ['a', 'b', 'c', 'd'].map(node),
      edges: [
        { from: 'a', to: 'b' },
        { from: 'a', to: 'c' },
        { from: 'a', to: 'd' },
      ],
    });
    expect(res.depth).toBe(2);
    // b/c/d 同一层 → 上下排开,不是左右排开
    const xs = ['b', 'c', 'd'].map((id) => res.boxes.get(id)!.x);
    expect(new Set(xs).size).toBe(1);
    const ys = ['b', 'c', 'd'].map((id) => res.boxes.get(id)!.y);
    expect(new Set(ys).size).toBe(3);
  });

  it('环不会把分层卡死', () => {
    const res = layeredLayout({
      nodes: ['a', 'b', 'c'].map(node),
      edges: [
        { from: 'a', to: 'b' },
        { from: 'b', to: 'c' },
        { from: 'c', to: 'a' },
      ],
    });
    expect(res.boxes.size).toBe(3);
    expect(res.depth).toBeLessThanOrEqual(3);
  });

  it('TB 方向:层往下走', () => {
    const res = layeredLayout({
      nodes: ['a', 'b'].map(node),
      edges: [{ from: 'a', to: 'b' }],
      dir: 'TB',
    });
    expect(res.boxes.get('a')!.y).toBeLessThan(res.boxes.get('b')!.y);
    // 同一层里是左右排开
    expect(res.boxes.get('a')!.x).toBe(res.boxes.get('b')!.x);
  });

  it('层内不重叠(保序最小间距)', () => {
    const res = layeredLayout({
      nodes: ['a', 'b', 'c'].map(node),
      edges: [
        { from: 'a', to: 'b' },
        { from: 'a', to: 'c' },
      ],
      nodeGap: 50,
    });
    const b = res.boxes.get('b')!;
    const c = res.boxes.get('c')!;
    expect(c.y - (b.y + b.h)).toBeGreaterThanOrEqual(50 - 0.01);
  });

  it('带标签的边:那一段留得开', () => {
    const res = layeredLayout({
      nodes: ['a', 'b'].map(node),
      edges: [{ from: 'a', to: 'b', labelW: 220 }],
      layerGap: 60,
    });
    const gap = res.boxes.get('b')!.x - (res.boxes.get('a')!.x + res.boxes.get('a')!.w);
    expect(gap).toBeGreaterThanOrEqual(220);
  });
});

describe('arch2 · 自动布局', () => {
  const AWS = [
    'n=cf;cloud;CloudFront;CDN',
    'n=s3;db;S3;Static assets',
    'n=igw;cloud;Internet Gateway;Public ingress',
    'n=alb;cloud;ALB;HTTPS 443',
    'n=api;be;API service;ECS Fargate',
    'n=lam;be;Lambda;Async jobs',
    'n=rds;db;RDS;PostgreSQL',
    'n=redis;db;ElastiCache;Session cache',
    'e=igw;alb;Public',
    'e=cf;alb;Forward',
    'e=cf;s3;Static',
    'e=alb;api',
    'e=api;rds;Query',
    'e=api;redis;Cache',
    'e=api;lam;Async',
  ];

  /** 节点框(宽 ≥ 100 的矩形:角标 20、垫片更小,都排除) */
  const frames = (svg: string): { x: number; y: number; w: number; h: number }[] =>
    [...svg.matchAll(/<rect x="([-\d.]+)" y="([-\d.]+)" width="([\d.]+)" height="([\d.]+)" rx="([\d.]+)"/g)]
      .map((m) => ({ x: +m[1], y: +m[2], w: +m[3], h: +m[4] }))
      .filter((b) => b.w >= 100 && b.h >= 40);

  it('没写位置 → 按依赖分层,不再是一条大横排', () => {
    const { svg } = renderArchFromUrl(new URL('https://x-cmd.com/draw/arch2?' + AWS.join('&')));
    const f = frames(svg);
    expect(f.length).toBe(8);
    // 列数 = 层数(4 层:入口 / 入口后 / 服务 / 数据),不是 8 个节点一排
    const cols = new Set(f.map((b) => b.x)).size;
    expect(cols).toBeLessThanOrEqual(5);
    // 画布不再宽到离谱(以前是 ~4000px)
    const w = Number(/<svg[^>]*width="([\d.]+)"/.exec(svg)![1]);
    expect(w).toBeLessThan(2200);
  });

  it('依赖方向:下游在下游那一侧', () => {
    const { svg } = renderArchFromUrl(new URL('https://x-cmd.com/draw/arch2?' + AWS.join('&')));
    const f = frames(svg);
    const leftMost = Math.min(...f.map((b) => b.x));
    const rightMost = Math.max(...f.map((b) => b.x));
    // API service 在 ALB 右边、RDS/Redis 更右边 —— 三层
    expect(new Set(f.map((b) => Math.round(b.x))).size).toBeLessThanOrEqual(5);
    expect(rightMost - leftMost).toBeGreaterThan(200);
  });

  it('写了位置就照旧按格子摆(作者说了算)', () => {
    const { svg } = renderArchFromUrl(
      new URL('https://x-cmd.com/draw/arch2?n=a;be;A;r0c0&n=b;be;B;r0c1&n=c;be;C;r1c0&e=a;b&e=b;c'),
    );
    const f = frames(svg);
    expect(f.length).toBe(3);
    // r0c0 → (44, 44);r0c1 → 右边一格;r1c0 → 下面一格
    expect(f[0].x).toBe(44);
    expect(f[1].x).toBeGreaterThan(f[0].x);
    expect(f[2].y).toBeGreaterThan(f[0].y);
  });

  it('grid= 明确列数 → 走格子,一行几格就几格换行', () => {
    const { svg } = renderArchFromUrl(
      new URL('https://x-cmd.com/draw/arch2?n=a;be;A&n=b;be;B&n=c;be;C&n=d;be;D&e=a;b&e=c;d&grid=2'),
    );
    const f = frames(svg);
    expect(f.length).toBe(4);
    // 两列:第三、四个节点换到第二行
    const rows = new Set(f.map((b) => b.y)).size;
    expect(rows).toBe(2);
  });

  it('dir=tb:层往下走(状态机那种竖着读)', () => {
    const { svg } = renderKindFromUrl(
      'lifecycle',
      new URL(
        'https://x-cmd.com/draw/lifecycle?n=open;state;Open&n=review;state;In review&n=ok;terminal;Fulfilled&e=open;review&e=review;ok&dir=tb',
      ),
    );
    const f = frames(svg);
    expect(f.length).toBe(3);
    const ys = f.map((b) => b.y);
    expect(Math.max(...ys)).toBeGreaterThan(Math.min(...ys) + 100);
  });

  it('自动布局下边与边不交叉', () => {
    const { svg } = renderArchFromUrl(new URL('https://x-cmd.com/draw/arch2?' + AWS.join('&')));
    const body = svg.replace(/<defs>[\s\S]*?<\/defs>/g, '');
    const routes = [...body.matchAll(/<path d="(M[^"]+)"/g)]
      .map((m) => m[1].split(/[ML]/).filter(Boolean).map((p) => p.trim().split(' ').map(Number)))
      .filter((pts) => pts.length > 1);
    expect(routes.length).toBe(7);
    const cross = (a: number[], b: number[], c: number[], d: number[]): boolean => {
      const o = (p: number[], q: number[], r: number[]): number =>
        (q[0] - p[0]) * (r[1] - p[1]) - (q[1] - p[1]) * (r[0] - p[0]);
      return o(c, d, a) * o(c, d, b) < 0 && o(a, b, c) * o(a, b, d) < 0;
    };
    for (let i = 0; i < routes.length; i++) {
      for (let j = i + 1; j < routes.length; j++) {
        for (let x = 1; x < routes[i].length; x++) {
          for (let y = 1; y < routes[j].length; y++) {
            expect(
              cross(routes[i][x - 1], routes[i][x], routes[j][y - 1], routes[j][y]),
              `边 ${i} 与 边 ${j} 交叉了`,
            ).toBe(false);
          }
        }
      }
    }
  });
});
