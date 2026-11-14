// 布线的规矩(2026-11-15,x-cmd-hub/draw#91/#92/#93):
//   不同源的边不许共用一段,也不许首尾相接 —— 接成一根线,读者会看错图。
//   端口进出一组排,相邻 ≥ 9px(箭头 7px,挤了就叠)。
//   绕远有上限:不许为了避开一条线兜一大圈。
// 这里测的是**规矩**,不是哪条线走哪 —— 引擎在站上(private),这里守的是底线。
import { describe, expect, it } from 'vitest';
import { renderArchFromUrl } from '../src/render/arch.js';
import { renderArchmapFromUrl as renderArchmap } from '../src/render/archmap.js';

type Pt = [number, number];

/** 每条边的折点(去掉 <defs> —— 箭头也是 path,不然会被当成边) */
const routesOf = (svg: string): Pt[][] =>
  [...svg.replace(/<defs>[\s\S]*?<\/defs>/g, '').matchAll(/<path d="(M[^"]+)"/g)]
    .map((m) => m[1].split(/[ML]/).filter(Boolean).map((p) => p.trim().split(' ').map(Number) as Pt));

/** 线段(无向):同一段就是同一个 key */
const segKey = (a: Pt, b: Pt): string =>
  JSON.stringify(([[a[0], a[1]], [b[0], b[1]]] as [number, number][]).sort((p, q) => p[0] - q[0] || p[1] - q[1]));

/** 两条线共用的段(同一段被两条边走过) */
const sharedSegs = (routes: Pt[][]): string[] => {
  const owner = new Map<string, number>();
  const out: string[] = [];
  routes.forEach((r, i) => {
    for (let j = 1; j < r.length; j++) {
      const k = segKey(r[j - 1], r[j]);
      if (owner.has(k)) {
        if (!out.includes(k)) out.push(k);
      } else {
        owner.set(k, i);
      }
    }
  });
  return out;
};

/** 两条线的公共点(端点相接也算 —— 看着像一根线) */
const touchingPoints = (routes: Pt[][]): string[] => {
  const out: string[] = [];
  for (let i = 0; i < routes.length; i++) {
    for (let j = i + 1; j < routes.length; j++) {
      for (const p of routes[i]) {
        // 只看折点:两条线的竖段/横段中间重合不算「接上」
        for (const q of routes[j]) {
          if (p[0] === q[0] && p[1] === q[1] && !out.includes(`${p}`)) out.push(`${p}`);
        }
      }
    }
  }
  return out;
};

const HOME = [
  'n=inet;ext;Internet;WAN;r0c1',
  'n=router;sec;Router;OpenWrt;r1c1',
  'n=switch;svc;Switch;2.5G;r2c1',
  'n=ap;fe;Wi-Fi%20AP;Wi-Fi%206;r2c3',
  'n=nas;db;NAS;4x12TB;r3c0',
  'n=ha;be;Home%20Assistant;automations;r3c1',
  'n=jelly;fe;Jellyfin;media;r3c2',
  'n=pihole;be;Pi-hole;DNS;r3c3',
  'e=inet;router;WAN',
  'e=router;switch;LAN',
  'e=switch;ap;PoE',
  'e=switch;nas;2.5G',
  'e=switch;ha;2.5G',
  'e=switch;jelly;2.5G',
  'e=switch;pihole;2.5G',
].join('&');

const MONO = [
  'n=web;fe;Browser;r0c0',
  'n=cdn;cloud;CDN;r0c1',
  'n=gw;be;API%20Gateway;auth;r0c2',
  'n=auth;be;Auth%20Service;r1c1',
  'n=render;be;Chart%20Render;r1c2',
  'n=pg;db;Postgres;r2c1',
  'n=cache;db;Redis;r2c2',
  'e=web;cdn',
  'e=cdn;gw',
  'e=gw;auth',
  'e=gw;render',
  'e=auth;pg',
  'e=render;pg',
  'e=render;cache',
].join('&');

describe('布线的规矩', () => {
  it('arch2:没有两条边共用一段', () => {
    const { svg } = renderArchFromUrl(new URL(`https://x-cmd.com/draw/arch2?${HOME}`));
    const routes = routesOf(svg);
    expect(routes.length).toBe(7);
    expect(sharedSegs(routes)).toEqual([]);
  });

  it('archmap:没有两条边共用一段(旧写法两条不同源的边接成一根线)', () => {
    const { svg } = renderArchmap(new URL(`https://x-cmd.com/draw/archmap?${MONO}`));
    const routes = routesOf(svg);
    expect(routes.length).toBe(7);
    expect(sharedSegs(routes)).toEqual([]);
  });

  it('archmap:两条不同源的边不接在同一个点上', () => {
    // gw→auth 与 render→pg:旧写法选了同一条竖通道,首尾相接看着像网关直连数据库
    const { svg } = renderArchmap(new URL(`https://x-cmd.com/draw/archmap?${MONO}`));
    expect(touchingPoints(routesOf(svg))).toEqual([]);
  });

  it('扇出的线各走各的,不共用一段', () => {
    // 同一个源分出去的几条线:公开仓这版不给引线(引线是站上引擎的合流窗口)
    const { svg } = renderArchFromUrl(new URL('https://x-cmd.com/draw/arch2?' + [
      'n=sw;svc;Switch;r0c0',
      'n=a;db;A;r1c0',
      'n=b;db;B;r1c1',
      'n=c;db;C;r2c0',
      'e=sw;a',
      'e=sw;b',
      'e=sw;c',
    ].join('&')));
    expect(sharedSegs(routesOf(svg))).toEqual([]);
  });

  it('端口相邻的间距 ≥ 9px(箭头 7px,挤了就叠成一条黑杠)', () => {
    // 一个节点接六条线:端口得散开
    const { svg } = renderArchFromUrl(new URL('https://x-cmd.com/draw/arch2?' + [
      'n=hub;be;Hub;r0c2',
      'n=a;db;A;r1c0',
      'n=b;db;B;r1c1',
      'n=c;db;C;r1c2',
      'n=d;db;D;r1c3',
      'n=e;db;E;r2c0',
      'n=f;db;F;r2c1',
      'e=hub;a', 'e=hub;b', 'e=hub;c', 'e=hub;d', 'e=hub;e', 'e=hub;f',
    ].join('&')));
    const routes = routesOf(svg);
    // 同一个节点上出来的端口(起点)两两不重合
    const starts = routes.map((r) => r[0]);
    expect(new Set(starts.map((p) => `${p}`)).size).toBe(starts.length);
    // 相邻的起点至少隔 9px
    for (let i = 0; i < starts.length; i++) {
      for (let j = i + 1; j < starts.length; j++) {
        const d = Math.abs(starts[i][0] - starts[j][0]) + Math.abs(starts[i][1] - starts[j][1]);
        if (d === 0) continue; // 同一个点:上面那条已经断言过了
        expect(d, `端口 ${starts[i]} 与 ${starts[j]} 挨太近`).toBeGreaterThanOrEqual(9);
      }
    }
  });

  it('绕远有上限(不许为了避开一条线兜一大圈)', () => {
    // 这张图旧版最远的一条边绕了 15 倍(直线 113px,实际走 1708px)
    const nodes = [
      'n=hub;be;Hub;r0c2',
      'n=a;db;A;r1c0',
      'n=b;db;B;r1c1',
      'n=c;db;C;r1c3',
      'n=d;db;D;r2c0',
      'n=e;db;E;r2c1',
      'n=f;db;F;r2c3',
    ];
    const edges = ['e=hub;a', 'e=hub;b', 'e=hub;c', 'e=hub;d', 'e=hub;e', 'e=hub;f'];
    const { svg } = renderArchFromUrl(new URL('https://x-cmd.com/draw/arch2?' + [...nodes, ...edges].join('&')));
    for (const r of routesOf(svg)) {
      const len = r.slice(1).reduce((s, p, i) => s + Math.abs(p[0] - r[i][0]) + Math.abs(p[1] - r[i][1]), 0);
      const straight = Math.abs(r[r.length - 1][0] - r[0][0]) + Math.abs(r[r.length - 1][1] - r[0][1]);
      if (straight < 1) continue;
      expect(len / straight, `绕了 ${(len / straight).toFixed(1)} 倍`).toBeLessThanOrEqual(3.01);
    }
  });

  it('挂载点:调用方塞进来的布线引擎会被用上', () => {
    // 引擎只管几何,样式还是渲染层的事
    const { svg } = renderArchFromUrl(
      new URL('https://x-cmd.com/draw/arch2?' + [
        'n=a;be;A;r0c0',
        'n=b;be;B;r0c1',
        'e=a;b',
      ].join('&')),
      false,
      undefined,
      { routing: () => [[[10, 10], [90, 10], [90, 40]]] },
    );
    expect(svg).toContain('M10 10L90 10L90 40');
  });
});
