import { describe, it, expect } from 'vitest';
import { renderArchFromUrl } from '../src/render/arch.js';
import { gridLayout, type LayoutEngine } from '../src/render/layout.js';

// 摆位引擎的挂载点:库只管把「怎么画」做好,「怎么摆」可以换。
// 自带的那个是通用的(够用但不聪明);更好的算法装在站上(私有仓)。
// 这里测的是口子通不通 —— 不是引擎本身好不好。

const frames = (svg: string): { x: number; y: number; w: number; h: number }[] =>
  [...svg.matchAll(/<rect x="([-\d.]+)" y="([-\d.]+)" width="([\d.]+)" height="([\d.]+)" rx="([\d.]+)"/g)]
    .map((m) => ({ x: +m[1], y: +m[2], w: +m[3], h: +m[4] }))
    .filter((b) => b.w >= 100 && b.h >= 40);

describe('布局引擎挂载点', () => {
  it('自带的引擎:没写位置的节点也摆得下(且不重不漏)', () => {
    const { svg } = renderArchFromUrl(
      new URL('https://x-cmd.com/draw/arch2?n=a;be;A&n=b;be;B&n=c;db;C&e=a;b&e=b;c'),
    );
    expect(frames(svg).length).toBe(3);
  });

  it('调用方塞进来的引擎会被用上', () => {
    // 一个把节点全排成一行的引擎 —— 摆出来的样子一眼看得出不是默认那个
    const row: LayoutEngine = (ctx) => {
      const boxes = new Map<string, { x: number; y: number; w: number; h: number }>();
      let x = ctx.pad;
      for (const n of ctx.nodes) {
        const s = ctx.sizeOf(n);
        boxes.set(n.id, { x, y: ctx.pad, w: s.w, h: s.h });
        x += s.w + ctx.gapX;
      }
      return { boxes, W: x + ctx.pad, H: ctx.pad * 2 + 60 };
    };
    const { svg } = renderArchFromUrl(
      new URL('https://x-cmd.com/draw/arch2?n=a;be;A&n=b;be;B&n=c;db;C&e=a;b&e=b;c'),
      false,
      undefined,
      { layout: row },
    );
    const f = frames(svg);
    expect(f.length).toBe(3);
    // 一行:三个框的 y 相同
    expect(new Set(f.map((b) => b.y)).size).toBe(1);
  });

  it('写了位置就不归引擎管(作者说了算)', () => {
    let called = 0;
    const spy: LayoutEngine = (ctx) => {
      called++;
      return gridLayout(ctx);
    };
    const { svg } = renderArchFromUrl(
      new URL('https://x-cmd.com/draw/arch2?n=a;be;A;r0c0&n=b;be;B;r0c1&n=c;db;C;r1c0&e=a;b&e=b;c'),
      false,
      undefined,
      { layout: spy },
    );
    expect(called).toBe(0);
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
    expect(new Set(f.map((b) => b.y)).size).toBe(2);
  });

  it('dir= 只影响没写位置的情况', () => {
    const tb = renderArchFromUrl(
      new URL('https://x-cmd.com/draw/arch2?n=open;be;Open&n=ok;db;Done&e=open;ok&dir=tb'),
    );
    expect(tb.svg).toContain('<svg');
  });
});

describe('分组(b=)的显示样式', () => {
  const Q = 'n=a;be;A&n=b;db;B&e=a;b&b=Group;a%20b';
  const dashed = (svg: string): number =>
    (svg.match(/stroke-dasharray="7 5"/g) ?? []).length;

  it('默认是区域底色(没有虚线框)', () => {
    const { svg } = renderArchFromUrl(new URL(`https://x-cmd.com/draw/arch2?${Q}`));
    expect(dashed(svg)).toBe(0);
    expect(svg).toMatch(/fill="var\(--d-s\d+\)" fill-opacity="0\.07"/);
  });

  it('bstyle=dash:要虚线框就写 dash', () => {
    const { svg } = renderArchFromUrl(new URL(`https://x-cmd.com/draw/arch2?${Q}&bstyle=dash`));
    expect(dashed(svg)).toBe(1);
  });

  it('bstyle=faint:更虚更淡的边', () => {
    const { svg } = renderArchFromUrl(new URL(`https://x-cmd.com/draw/arch2?${Q}&bstyle=faint`));
    expect(dashed(svg)).toBe(0);
    expect(svg).toContain('stroke-dasharray="3 5"');
  });

  it('bstyle=glow:荧光线(几层叠出光晕)', () => {
    const { svg } = renderArchFromUrl(new URL(`https://x-cmd.com/draw/arch2?${Q}&bstyle=glow`));
    expect(svg).toContain('stroke-width="7"');
    expect(svg).toContain('stroke-width="3.5"');
  });

  it('bstyle=tint:区域底色,不要边', () => {
    const { svg } = renderArchFromUrl(new URL(`https://x-cmd.com/draw/arch2?${Q}&bstyle=tint`));
    expect(svg).toMatch(/fill="var\(--d-s\d+\)" fill-opacity="0.07"/);
    // 没有边:区域底色不跟线打架
    expect(svg).not.toMatch(/fill-opacity="0.07"[^/]*stroke=/);
  });

  it('bstyle=plain:不画框', () => {
    const { svg } = renderArchFromUrl(new URL(`https://x-cmd.com/draw/arch2?${Q}&bstyle=plain`));
    expect(dashed(svg)).toBe(0);
    expect(svg).not.toContain('stroke-width="1.4" stroke-dasharray');
  });

  it('写错就 400(把候选列出来)', () => {
    expect(() =>
      renderArchFromUrl(new URL(`https://x-cmd.com/draw/arch2?${Q}&bstyle=neon`)),
    ).toThrow(/bstyle/);
  });
});
