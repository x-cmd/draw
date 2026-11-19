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

  it('完全错位:两翼合成一条梯子,每行只有一张卡', () => {
    const rows = matchLadderRows(
      [{ value: 10, label: 'L1' }, { value: 8, label: 'L2' }],
      [{ value: 9, label: 'R1' }, { value: 7, label: 'R2' }],
      'rank',
    );
    // 整体按强弱排:10,9,8,7 —— 不是「左 10 对右 9」
    expect(rows.map((r) => r[0]?.value ?? r[1]?.value)).toEqual([10, 9, 8, 7]);
    // 每一行只有一边有卡
    expect(rows[0][0]?.label).toBe('L1');
    expect(rows[0][1]).toBeUndefined();
    expect(rows[1][0]).toBeUndefined();
    expect(rows[1][1]?.label).toBe('R1');
    expect(rows[2][0]?.label).toBe('L2');
    expect(rows[3][1]?.label).toBe('R2');
  });

  it('匹配排序:值相近的排在同一行(两边都有)', () => {
    const rows = matchLadderRows(
      [{ value: 100, label: 'A' }, { value: 50, label: 'B' }],
      [{ value: 98, label: 'C' }, { value: 52, label: 'D' }],
      'value',
    );
    expect(rows[0][0]?.label).toBe('A');
    expect(rows[0][1]?.label).toBe('C');
    expect(rows[1][0]?.label).toBe('B');
    expect(rows[1][1]?.label).toBe('D');
  });

  it('匹配排序:value —— 右边的卡抬到最后一个 left[n] >= 右 的行', () => {
    // 全排序(两边合起来按强弱)⇒ 档的次序:先是 A 档(B/C 两张),再是 S 档 ✓
    // S 档里左边一张(S 100)、右边一张(S 98)⇒ 同一行 ✓
    // B 档里右边有两条(B 80/B 70)、左边只有一条(B 75)⇒ **左边空一格** ✓
    const rows = matchLadderRows(
      [{ value: 100, label: 'A' }, { value: 90, label: 'B' }, { value: 60, label: 'C' }],
      [{ value: 98, label: 'X' }, { value: 62, label: 'Y' }],
      'value',
    );
    expect(rows[0][1]?.label).toBe('X');     // X(98)落到 A(100) 那一行
    expect(rows[1][1]?.label).toBe('Y');     // Y(62)被抬到 B(90) 那一行
    expect(rows[2][1]).toBeUndefined();     // 缺位:C 那一行右边没有能对上的卡
  });

  it('匹配排序:右边自己按强弱排 ⇒ 抬升后顺序不变', () => {
    const rows = matchLadderRows(
      [{ value: 100, label: 'A' }, { value: 70, label: 'B' }, { value: 40, label: 'C' }],
      [{ value: 95, label: 'X' }, { value: 65, label: 'Y' }, { value: 35, label: 'Z' }],
      'value',
    );
    const rightLabels = rows.map((r) => r[1]?.label).filter(Boolean);
    expect(rightLabels).toEqual(['X', 'Y', 'Z']);   // 顺序没乱 ✓
  });

  it('match= 只认 rank / value / tier', () => {
    expect(() => renderFromUrl(url('type=butterfly-ladder&left=A:1&match=other'))).toThrow();
  });

  it('匹配排序:tier 档 —— 同一档的行连在一起,两边都可能空档', () => {
    const rows = matchLadderRows(
      [
        { value: 100, label: 'L-S', tier: 'S' },
        { value: 75, label: 'L-B', tier: 'B' },
      ],
      [
        { value: 98, label: 'R-S', tier: 'S' },
        { value: 80, label: 'R-B1', tier: 'B' },
        { value: 70, label: 'R-B2', tier: 'B' },
      ],
      'tier',
    );
    expect(rows[0][0]?.label).toBe('L-S');
    expect(rows[0][1]?.label).toBe('R-S');      // 同档 ⇒ 同一行 ✓
    expect(rows[1][0]?.label).toBe('L-B');
    expect(rows[1][1]?.label).toBe('R-B1');
    expect(rows[2][0]).toBeUndefined();          // 左边空了一格 ✓(右边的 B 有两张 ✓)
    expect(rows[2][1]?.label).toBe('R-B2');
  });
});
