import { describe, it, expect } from 'vitest';
import { renderFromUrl } from '../src/render/query.js';
import { parseButterflySpec, butterflySpecFromParams } from '../src/specs/butterfly.js';

const url = (q: string): URL => new URL('https://x-cmd.com/draw?' + q);
const texts = (svg: string): string[] =>
  [...svg.matchAll(/<text[^>]*>([^<]*)<\/text>/g)].map((m) => m[1]);

describe('butterfly(双翼条形图)', () => {
  it('两侧的柱从中轴往两边长', () => {
    const { svg } = renderFromUrl(url('type=butterfly&labels=A,B&left=Opened:7,8&right=Closed:5,6'));
    expect(svg).toContain('<svg');
    // 两个系列的图例
    expect(texts(svg)).toContain('Opened');
    expect(texts(svg)).toContain('Closed');
    // 六个数值(每行两个)
    for (const v of ['7', '8', '5', '6']) expect(texts(svg)).toContain(v);
  });

  it('单位进图例(不放轴上 —— 「1k」配 MB 会读错)', () => {
    const { svg } = renderFromUrl(url('type=butterfly&labels=A&left=mem:12&right=disk:30&unit=MB'));
    expect(texts(svg)).toContain('mem (MB)');
    expect(texts(svg)).toContain('disk (MB)');
  });

  it('两侧各自可堆叠(自中轴往外)', () => {
    const { svg } = renderFromUrl(url('type=butterfly&labels=A&left=code:100;comments:20&right=x:50;y:10'));
    expect(texts(svg)).toContain('code');
    expect(texts(svg)).toContain('comments');
    expect(texts(svg)).toContain('x');
    expect(texts(svg)).toContain('y');
    // 堆叠后的总数(120 / 60)
    expect(texts(svg)).toContain('120');
    expect(texts(svg)).toContain('60');
  });

  it('dir=tb:柱自中轴往上/往下长', () => {
    const { svg } = renderFromUrl(url('type=butterfly&dir=tb&labels=0–19,20–39&left=Male:51,48&right=Female:49,52'));
    expect(texts(svg)).toContain('Male');
    expect(texts(svg)).toContain('Female');
    // 类目标签在下面(横排)
    expect(texts(svg)).toContain('0–19');
  });

  it('折线:自己的标尺,数值标在点上方', () => {
    const { svg } = renderFromUrl(url('type=butterfly&labels=duckdb,sqlite&left=mem:0.32,0.04&line=report:536,49178&lineside=right'));
    expect(texts(svg)).toContain('report');
    expect(texts(svg)).toContain('536');
    expect(texts(svg)).toContain('49,178');
  });

  it('JSON 形态也能画', () => {
    const spec = { labels: ['a'], left: { name: 'L', values: [1] }, right: { name: 'R', values: [2] } };
    const { svg } = renderFromUrl(url('type=butterfly&d=' + encodeURIComponent(JSON.stringify(spec))));
    expect(texts(svg)).toContain('L');
    expect(texts(svg)).toContain('R');
  });

  it('缺一侧就报错(至少要一侧)', () => {
    expect(() => renderFromUrl(url('type=butterfly&labels=A'))).toThrow();
  });

  it('方向写错报错', () => {
    expect(() => renderFromUrl(url('type=butterfly&labels=A&left=1&dir=xx'))).toThrow(/dir/);
  });

  it('扁平参数与 JSON 等价', () => {
    const flat = butterflySpecFromParams(new URLSearchParams('labels=A,B&left=Opened:7,8&right=Closed:5,6'));
    const json = JSON.stringify({
      labels: ['A', 'B'],
      left: { name: 'Opened', values: [7, 8] },
      right: { name: 'Closed', values: [5, 6] },
      dir: 'lr',
    });
    expect(flat && JSON.parse(flat)).toEqual(JSON.parse(json));
  });

  it('解析:方法签名的冒号不拆类型', () => {
    const spec = parseButterflySpec(JSON.stringify({
      labels: ['a'],
      left: { name: 'L', values: [1] },
      right: { name: 'R', values: [2] },
    }));
    expect(spec.labels).toEqual(['a']);
    expect(spec.left?.values).toEqual([1]);
  });
});
