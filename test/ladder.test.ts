// 天梯图(ladder)与双翼天梯图(butterfly-ladder)。
//
// 三条要守住的规矩:
//   1. 档位是行的一组属性 —— 同一档的行连在一起,档名标在左边那一列
//   2. 一侧行数少时,多出来的行留空,**不挪位**
//   3. 双翼的行有两种配对:rank(完全错位)与 value(值相近的排同一行)
import { describe, it, expect } from 'vitest';
import { renderFromUrl } from '../src/render/query.js';
import { parseLadderSpec, matchLadderRows } from '../src/specs/ladder.js';

const url = (q: string): URL => new URL('https://x-cmd.com/draw?' + q);
const texts = (svg: string): string[] =>
  [...svg.matchAll(/<text[^>]*>([^<]*)<\/text>/g)].map((m) => m[1]);

describe('天梯图(ladder)', () => {
  it('单边:一行一个型号,数值在条尾', () => {
    const { svg } = renderFromUrl(url('type=ladder&labels=A,B,C&values=10,20,30'));
    expect(svg).toContain('<svg');
    const t = texts(svg);
    expect(t).toContain('A');
    expect(t).toContain('30');
  });

  it('档位:同档的行连在一起,档名标出来', () => {
    const { svg } = renderFromUrl(url('type=ladder&labels=A,B,C,D&values=40,30,20,10&tiers=S,S,A,A'));
    const t = texts(svg);
    expect(t).toContain('S');
    expect(t).toContain('A');
  });

  it('档位分隔线在组与组之间', () => {
    const { svg } = renderFromUrl(url('type=ladder&labels=A,B,C,D&values=40,30,20,10&tiers=S,S,A,A'));
    // 两组之间有一条横贯的分隔线(中轴之外的那条)
    expect(svg).toContain('stroke="var(--d-border)"');
  });
});

describe('双翼天梯图(butterfly-ladder)', () => {
  it('一行两个型号:左右各一个名字', () => {
    const { svg } = renderFromUrl(url(
      'type=butterfly-ladder&left=NVIDIA:3264,2851&right=AMD:2095,1875' +
      '&llabels=RTX 5090,RTX 4090&rlabels=RX 7900 XTX,RX 7900 XT',
    ));
    const t = texts(svg);
    expect(t).toContain('RTX 5090');
    expect(t).toContain('RX 7900 XTX');
    expect(t).toContain('NVIDIA');
    expect(t).toContain('AMD');
  });

  it('JSON 形态:名、值、档在一处', () => {
    const spec = parseLadderSpec(JSON.stringify({
      type: 'butterfly-ladder',
      left: { name: 'NVIDIA', items: [{ label: 'RTX 5090', value: 3264, tier: 'S' }] },
      right: { name: 'AMD', items: [{ label: 'RX 7900 XTX', value: 2095, tier: 'S' }] },
    }));
    expect(spec.left?.items[0].label).toBe('RTX 5090');
    expect(spec.left?.items[0].tier).toBe('S');
    expect(spec.left?.items[0].value).toBe(3264);
  });

  it('一侧行数少时,多出来的行留空,不挪位', () => {
    const rows = matchLadderRows(
      [{ value: 10 }, { value: 9 }, { value: 8 }],
      [{ value: 7 }],
      'rank',
    );
    expect(rows.length).toBe(3);
    expect(rows[0][0]?.value).toBe(10);
    expect(rows[0][1]?.value).toBe(7);
    expect(rows[1][1]).toBeUndefined();
    expect(rows[2][1]).toBeUndefined();
  });

  it('匹配排序:值相近的排在同一行', () => {
    const rows = matchLadderRows(
      [{ value: 100, label: 'A' }, { value: 50, label: 'B' }],
      [{ value: 98, label: 'C' }, { value: 52, label: 'D' }],
      'value',
    );
    // A(100)配 C(98),B(50)配 D(52)—— 不是按名次(A 配 D ✗)
    expect(rows[0][0]?.label).toBe('A');
    expect(rows[0][1]?.label).toBe('C');
    expect(rows[1][0]?.label).toBe('B');
    expect(rows[1][1]?.label).toBe('D');
  });

  it('完全错位:第 k 行对第 k 行', () => {
    const rows = matchLadderRows(
      [{ value: 100, label: 'A' }, { value: 50, label: 'B' }],
      [{ value: 98, label: 'C' }, { value: 52, label: 'D' }],
      'rank',
    );
    expect(rows[0][1]?.label).toBe('C');
    expect(rows[1][1]?.label).toBe('D');
  });

  it('match= 只认 rank / value', () => {
    expect(() => renderFromUrl(url('type=butterfly-ladder&left=A:1&match=other'))).toThrow();
  });
});
