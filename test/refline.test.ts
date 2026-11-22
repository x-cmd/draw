import { describe, expect, it } from 'vitest';
import { renderFromUrl } from '../src/render/query.js';
import { renderBar } from '../src/render/bar.js';
import { renderLine } from '../src/render/line.js';
import { renderLineMulti } from '../src/render/line-multi.js';
import { renderBarMulti } from '../src/render/bar-grouped.js';
import { renderBarStacked } from '../src/render/bar-stacked.js';
import { renderArea } from '../src/render/area.js';
import { renderScatter } from '../src/render/scatter.js';
import { renderHbarOpendata } from '../src/render/hbar-spec.js';
import { resolveSkin } from '../src/styles/index.js';
import { ApiError } from '../src/specs/index.js';

const BASE = 'https://draw.test/draw';
const BAR_SKIN = resolveSkin('bar', 'base', 'light');
const LINE_SKIN = resolveSkin('line', null, 'light');

/** 取 SVG 里的参考线(虚线 5 4) */
const refLines = (svg: string): string[] => svg.match(/<line[^>]*stroke-dasharray="5 4"[^>]*>/g) ?? [];

describe('参考线 ?ref=', () => {
  it('bar/line: ref=100 画一条横线并带上数值文案', () => {
    const svg = renderFromUrl(new URL(`${BASE}?type=bar&labels=A,B&values=50,100&ref=100`)).svg;
    const lines = refLines(svg);
    expect(lines.length).toBe(1);
    // 横线:y1 === y2,且横跨绘图区
    const m = /x1="([\d.]+)" y1="([\d.]+)" x2="([\d.]+)" y2="([\d.]+)"/.exec(lines[0])!;
    expect(m[2]).toBe(m[4]);
    expect(Number(m[1])).toBeLessThan(Number(m[3]));
    // 线在 100 那个高度:数值 100 = 轴顶
    expect(svg).toContain('>100</text>');
  });

  it('ref= 的线落在正确的像素上', () => {
    const skin = resolveSkin('bar', 'base', 'light');
    const spec = { data: [{ label: 'A', value: 50 }, { label: 'B', value: 100 }] };
    const svg = renderBar(spec, { width: 560, height: 320, version: 1, skin, interactive: true, refLines: [{ value: 50 }] });
    const y = { ...JSON.parse(/<metadata id="dscale">([\s\S]*?)<\/metadata>/.exec(svg)![1].replace(/&quot;/g, '"')).y };
    const at = (v: number): number => y.p0 + ((v - y.v0) / (y.v1 - y.v0)) * (y.p1 - y.p0);
    const drawn = Number(/y1="([\d.]+)"/.exec(refLines(svg)[0])![1]);
    expect(Math.abs(at(50) - drawn)).toBeLessThan(1);
  });

  it('ref=100;目标 —— 文案用给定的文案', () => {
    const svg = renderFromUrl(new URL(`${BASE}?type=bar&labels=A,B&values=50,100&ref=100;目标`)).svg;
    expect(refLines(svg).length).toBe(1);
    expect(svg).toContain('>目标</text>');
  });

  it('ref=100;目标,#60a5fa —— 线用给定的颜色', () => {
    const svg = renderFromUrl(new URL(`${BASE}?type=bar&labels=A,B&values=50,100&ref=100;目标,%2360a5fa`)).svg;
    expect(refLines(svg)[0]).toContain('stroke="#60a5fa"');
  });

  it('ref= 的颜色也可以是语义槽位名', () => {
    const svg = renderFromUrl(new URL(`${BASE}?type=bar&labels=A,B&values=50,100&ref=100;目标,s3`)).svg;
    expect(refLines(svg)[0]).toContain('stroke="var(--d-s3)"');
  });

  it('ref= 可重复 —— 两条 ref 画两条线', () => {
    const svg = renderFromUrl(new URL(`${BASE}?type=bar&labels=A,B&values=50,100&ref=25&ref=75`)).svg;
    expect(refLines(svg).length).toBe(2);
  });

  it('ref= 超出值域 —— 不画线,但图照常出', () => {
    const r = renderFromUrl(new URL(`${BASE}?type=bar&labels=A,B&values=50,100&ref=999`));
    expect(refLines(r.svg).length).toBe(0);
    expect(r.svg).toContain('<svg');
  });

  it('ref= 不是数值 —— 400 且带纠正示例', () => {
    expect(() => renderFromUrl(new URL(`${BASE}?type=bar&labels=A,B&values=50,100&ref=abc`))).toThrowError(ApiError);
    try {
      renderFromUrl(new URL(`${BASE}?type=bar&labels=A,B&values=50,100&ref=abc`));
    } catch (e) {
      expect((e as ApiError).status).toBe(400);
      expect((e as ApiError).message).toContain('?ref=100');
    }
  });

  it('ref=1;x;notacolor —— 400(文案里不能再有 ";")', () => {
    expect(() => renderFromUrl(new URL(`${BASE}?type=bar&labels=A,B&values=50,100&ref=1;x;notacolor`))).toThrowError(ApiError);
  });

  it('裸数值保持老规矩:负数 400;新语法放开到任意有限值', () => {
    // 旧写法 ?ref=-5 的老行为就是 400(非负)
    expect(() => renderFromUrl(new URL(`${BASE}?type=bar&labels=A,B&values=50,100&ref=-5`))).toThrowError(ApiError);
    // 新语法:负数合法,只是落在量程外 → 不画,但不炸
    const r = renderFromUrl(new URL(`${BASE}?type=bar&labels=A,B&values=50,100&ref=-5;zero`));
    expect(refLines(r.svg).length).toBe(0);
  });

  it('ref=100;目标,notacolor —— 400(颜色不认识)', () => {
    expect(() => renderFromUrl(new URL(`${BASE}?type=bar&labels=A,B&values=50,100&ref=100;目标,notacolor`))).toThrowError(ApiError);
    try {
      renderFromUrl(new URL(`${BASE}?type=bar&labels=A,B&values=50,100&ref=100;目标,notacolor`));
    } catch (e) {
      expect((e as ApiError).status).toBe(400);
      expect((e as ApiError).message).toContain('#60a5fa');
    }
  });

  it('文案落在绘图区之外(不压数据)', () => {
    const svg = renderFromUrl(new URL(`${BASE}?type=bar&labels=A,B&values=50,100&ref=50;target`)).svg;
    const t = /<text[^>]*font-size="11"[^>]*>target<\/text>/.exec(svg)![0];
    const x = Number(/x="([\d.]+)"/.exec(t)![1]);
    const anchor = /text-anchor="(\w+)"/.exec(t)![1];
    const line = /x1="([\d.]+)".*x2="([\d.]+)"/.exec(refLines(svg)[0])!;
    const left = Number(line[1]);
    const right = Number(line[2]);
    // 右端之外(anchor=start,x>right)或左端之外(anchor=end,x<left)
    if (anchor === 'start') expect(x).toBeGreaterThan(right);
    else expect(x).toBeLessThan(left);
  });

  it('绘图区右侧给文案留出位置(不跟纵轴刻度叠字)', () => {
    const withRef = renderFromUrl(new URL(`${BASE}?type=bar&labels=A,B&values=50,100&ref=50;target`)).svg;
    const without = renderFromUrl(new URL(`${BASE}?type=bar&labels=A,B&values=50,100`)).svg;
    const rightOf = (svg: string): number => {
      const line = /<line[^>]*stroke="var\(--d-grid\)"[^>]*>/.exec(svg)![0];
      return Number(/x2="([\d.]+)"/.exec(line)![1]);
    };
    // 有参考线时绘图区右边收窄,给文案腾地方
    expect(rightOf(withRef)).toBeLessThan(rightOf(without));
  });

  it('窄画布放不下文案就翻到左边(仍不压数据)', () => {
    const svg = renderFromUrl(new URL(`${BASE}?type=bar&w=240&labels=A,B&values=50,100&ref=50;target`)).svg;
    const t = /<text[^>]*font-size="11"[^>]*>target<\/text>/.exec(svg);
    if (!t) return; // 画布太窄放不下就整条不标(也不压数据)
    const x = Number(/x="([\d.]+)"/.exec(t[0])![1]);
    const anchor = /text-anchor="(\w+)"/.exec(t[0])![1];
    const line = /x1="([\d.]+)".*x2="([\d.]+)"/.exec(refLines(svg)[0])!;
    if (anchor === 'start') expect(x).toBeGreaterThan(Number(line[2]));
    else expect(x).toBeLessThan(Number(line[1]));
  });

  it('两条挨得近的参考线 —— 文案错开,线仍在真实值上', () => {
    const svg = renderFromUrl(new URL(`${BASE}?type=bar&labels=A,B&values=50,100&ref=99&ref=100`)).svg;
    const lines = refLines(svg);
    expect(lines.length).toBe(2);
    const ys = lines.map((l) => Number(/y1="([\d.]+)"/.exec(l)![1]));
    // 线本身相差很小(值 99 与 100)
    expect(Math.abs(ys[0] - ys[1])).toBeLessThan(6);
    // 文案相差至少 12px
    const textYs = (svg.match(/<text[^>]*font-size="11"[^>]*>[^<]*<\/text>/g) ?? [])
      .map((t) => Number(/y="([\d.]+)"/.exec(t)![1]))
      .filter((y) => Math.abs(y - ys[0]) < 40)
      .sort((a, b) => a - b);
    expect(textYs.length).toBeGreaterThanOrEqual(2);
    expect(textYs[1] - textYs[0]).toBeGreaterThanOrEqual(11.5);
  });

  it('参考线画在数据之下(线在柱子的 path 之前)', () => {
    const svg = renderFromUrl(new URL(`${BASE}?type=bar&labels=A,B&values=50,100&ref=75`)).svg;
    const refAt = svg.indexOf('stroke-dasharray="5 4"');
    const barAt = svg.indexOf('<path d="M');
    expect(refAt).toBeGreaterThan(-1);
    expect(barAt).toBeGreaterThan(-1);
    // 线在柱体之前 —— 压在柱下面,读作参照而不是数据
    expect(refAt).toBeLessThan(barAt);
  });

  it('参考线不压制数值标注(num=all 仍标数)', () => {
    const svg = renderFromUrl(new URL(`${BASE}?type=bar&labels=A,B&values=50,100&ref=75&num=all`)).svg;
    expect(svg).toContain('>50</text>');
    expect(svg).toContain('>100</text>');
  });
});

describe('旧写法 ?ref= + ?reflabel=(hbar 竖线)', () => {
  const opendata = resolveSkin('hbar', 'opendata', 'light');
  const o = { width: opendata.size![0], height: opendata.size![1], version: 1, skin: opendata };

  it('旧写法仍画老样式的竖线(坐标与文案一字不改)', () => {
    const svg = renderFromUrl(new URL(`${BASE}?type=hbar&t=opendata&labels=A,B&values=2.8,8.6&ref=4.5&reflabel=WCAG%20AA`)).svg;
    // 老路径:1.5px 宽、faint 色、虚线 5 4
    const line = /<line[^>]*stroke-width="1.5" stroke-dasharray="5 4"[^>]*\/>/.exec(svg);
    expect(line).toBeTruthy();
    expect(line![0]).toContain('x1="219.32"');
    expect(line![0]).toContain('y1="36"');
    expect(line![0]).toContain('y2="134"');
    expect(svg).toContain('>WCAG AA</text>');
  });

  it('旧写法在渲染器层面也一致(不走新图层)', () => {
    const svg = renderHbarOpendata({ data: [{ label: 'A', value: 2.8 }, { label: 'B', value: 8.6 }] }, { ...o, refLine: 4.5, refLabel: 'WCAG AA' });
    expect(svg).toContain('stroke-width="1.5"');
    expect(svg).toContain('>WCAG AA</text>');
  });

  it('新语法在 hbar 上画新样式的竖线', () => {
    const svg = renderFromUrl(new URL(`${BASE}?type=hbar&t=opendata&labels=A,B&values=2.8,8.6&ref=4.5;SLA`)).svg;
    // 新样式:1px 宽
    expect(svg).toMatch(/<line[^>]*stroke-width="1" stroke-dasharray="5 4"[^>]*\/>/);
    expect(svg).toContain('>SLA</text>');
  });

  it('base 皮肤的老 URL 仍然什么都不画(以前就不吃 ?ref=)', () => {
    const svg = renderFromUrl(new URL(`${BASE}?type=hbar&labels=A,B&values=2.8,8.6&ref=4.5&reflabel=WCAG%20AA`)).svg;
    expect(svg).not.toContain('stroke-dasharray="5 4"');
    expect(svg).not.toContain('WCAG AA');
  });

  it('base 皮肤吃新语法(竖线)', () => {
    const svg = renderFromUrl(new URL(`${BASE}?type=hbar&labels=A,B&values=2.8,8.6&ref=4.5;SLA`)).svg;
    expect(svg).toMatch(/<line[^>]*stroke-dasharray="5 4"[^>]*\/>/);
    expect(svg).toContain('>SLA</text>');
  });
});

describe('各图种都吃参考线', () => {
  const SERIES = 'labels=A,B&series=X:50,100&series=Y:60,90';
  const cases: [string, () => string][] = [
    ['line', () => renderFromUrl(new URL(`${BASE}?type=line&labels=A,B&values=50,100&ref=75`)).svg],
    ['line-multi', () => renderFromUrl(new URL(`${BASE}?type=line&${SERIES}&ref=75`)).svg],
    ['bar', () => renderFromUrl(new URL(`${BASE}?type=bar&labels=A,B&values=50,100&ref=75`)).svg],
    ['bar-grouped', () => renderFromUrl(new URL(`${BASE}?type=bar&${SERIES}&ref=75`)).svg],
    ['bar-stacked', () => renderFromUrl(new URL(`${BASE}?type=bar&stack=1&${SERIES}&ref=75`)).svg],
    ['area', () => renderFromUrl(new URL(`${BASE}?type=area&labels=A,B&values=50,100&ref=75`)).svg],
    ['scatter', () => renderFromUrl(new URL(`${BASE}?type=scatter&x=1,2,3&y=50,100,75&ref=75`)).svg],
  ];
  for (const [name, fn] of cases) {
    it(`${name} 画参考线`, () => {
      expect(refLines(fn()).length).toBeGreaterThanOrEqual(1);
    });
  }

  it('pie / radar 收到参考线也不炸(没有值轴 → 不画)', () => {
    expect(() => renderFromUrl(new URL(`${BASE}?type=pie&labels=A,B&values=3,2&ref=2`))).not.toThrow();
    expect(() => renderFromUrl(new URL(`${BASE}?type=radar&labels=A,B,C&values=3,2,4&ref=2`))).not.toThrow();
  });
});

describe('交互模式的比例尺元数据 <metadata id="dscale">', () => {
  const dscaleOf = (svg: string): { y: { v0: number; p0: number; v1: number; p1: number }; values: number[] } =>
    JSON.parse(/<metadata id="dscale">([\s\S]*?)<\/metadata>/.exec(svg)![1].replace(/&quot;/g, '"').replace(/&amp;/g, '&'));

  it('bar:交互模式带 dscale,非交互不带', () => {
    const skin = resolveSkin('bar', 'base', 'light');
    const spec = { data: [{ label: 'A', value: 50 }, { label: 'B', value: 100 }] };
    const on = renderBar(spec, { width: 560, height: 320, version: 1, skin, interactive: true });
    expect(on).toContain('<metadata id="dscale">');
    const off = renderBar(spec, { width: 560, height: 320, version: 1, skin });
    expect(off).not.toContain('id="dscale"');
  });

  it('dscale 的 p0/p1/v0/v1 与画出来的参考线一致', () => {
    const skin = resolveSkin('bar', 'base', 'light');
    const spec = { data: [{ label: 'A', value: 50 }, { label: 'B', value: 100 }] };
    const svg = renderBar(spec, { width: 560, height: 320, version: 1, skin, interactive: true, refLines: [{ value: 75 }] });
    const { y, values } = dscaleOf(svg);
    expect(values).toEqual([50, 100]);
    // 两点定一线性映射:值 → 像素
    const at = (v: number): number => y.p0 + ((v - y.v0) / (y.v1 - y.v0)) * (y.p1 - y.p0);
    const drawn = Number(/y1="([\d.]+)"/.exec(refLines(svg)[0])![1]);
    expect(Math.abs(at(75) - drawn)).toBeLessThan(1);
  });

  it('line / line-multi / bar-grouped / bar-stacked / area / scatter 都带 dscale', () => {
    const multi = { labels: ['A', 'B'], series: [{ name: 'A', values: [50, 100] }, { name: 'B', values: [60, 90] }] };
    const svgs: string[] = [
      renderLine({ data: [{ label: 'A', value: 50 }, { label: 'B', value: 100 }] }, { width: 560, height: 320, version: 1, skin: LINE_SKIN, interactive: true }),
      renderLineMulti(multi, { width: 560, height: 320, version: 1, skin: LINE_SKIN, interactive: true }),
      renderBarMulti(multi, { width: 560, height: 320, version: 1, skin: BAR_SKIN, interactive: true }),
      renderBarStacked(multi, { width: 560, height: 320, version: 1, skin: BAR_SKIN, interactive: true }),
      renderArea({ data: [{ label: 'A', value: 50 }, { label: 'B', value: 100 }] }, { width: 560, height: 320, version: 1, skin: BAR_SKIN, interactive: true }),
      renderScatter({ points: [{ x: 1, y: 50 }, { x: 2, y: 100 }] }, { width: 560, height: 320, version: 1, skin: resolveSkin('scatter', null, 'light'), interactive: true }),
    ];
    for (const svg of svgs) expect(svg).toContain('<metadata id="dscale">');
  });

  it('多系列的 values 把所有系列摊平', () => {
    const multi = { labels: ['A', 'B'], series: [{ name: 'A', values: [50, 100] }, { name: 'B', values: [60, 90] }] };
    const svg = renderLineMulti(multi, { width: 560, height: 320, version: 1, skin: LINE_SKIN, interactive: true });
    expect(dscaleOf(svg).values).toEqual([50, 100, 60, 90]);
  });
});
