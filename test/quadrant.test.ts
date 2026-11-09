import { describe, it, expect } from 'vitest';
import { renderFromUrl } from '../src/render/query.js';
import { parseQuadrantSpec, quadrantSpecFromParams } from '../src/specs/quadrant.js';

const url = (query: string): URL => new URL(`https://draw.test/draw?${query}`);

// 四象限图(x-cmd-hub/draw#36):2×2 矩阵 —— 两轴各分高低,四格各一名称(可带说明),可加散点。
describe('quadrant chart', () => {
  it('parses the quadrants param (TL, TR, BL, BR)', () => {
    const raw = quadrantSpecFromParams(new URLSearchParams('quadrants=快赢,战略,填坑,放弃'));
    expect(raw).not.toBeNull();
    const spec = parseQuadrantSpec(raw);
    expect(spec.quadrants.map((c) => c.name)).toEqual(['快赢', '战略', '填坑', '放弃']);
  });

  it('needs exactly four quadrants', () => {
    expect(() => quadrantSpecFromParams(new URLSearchParams('quadrants=A,B,C')))
      .toThrow(/exactly 4/);
    expect(() => parseQuadrantSpec(JSON.stringify({ quadrants: ['A', 'B'] }))).toThrow(/exactly 4/);
    expect(() => parseQuadrantSpec(null)).toThrow(/Missing data/);
  });

  it('keeps the cell descriptions and the axis labels', () => {
    const raw = quadrantSpecFromParams(new URLSearchParams(
      'quadrants=A,B,C,D&quaddescs=甲,乙,丙,丁&xlabel=投入&ylabel=回报&xlow=少&xhigh=多',
    ));
    const spec = parseQuadrantSpec(raw);
    expect(spec.quadrants.map((c) => c.desc)).toEqual(['甲', '乙', '丙', '丁']);
    expect(spec.xlabel).toBe('投入');
    expect(spec.ylabel).toBe('回报');
    expect(spec.xlow).toBe('少');
    expect(spec.xhigh).toBe('多');
  });

  it('parses the items and clamps their coordinates into 0..1', () => {
    const raw = quadrantSpecFromParams(new URLSearchParams('quadrants=A,B,C,D&items=甲@0.2,0.8;乙@1.4,-0.3'));
    const spec = parseQuadrantSpec(raw);
    expect(spec.items).toEqual([
      { name: '甲', x: 0.2, y: 0.8 },
      { name: '乙', x: 1, y: 0 },
    ]);
    expect(() => quadrantSpecFromParams(new URLSearchParams('quadrants=A,B,C,D&items=坏数据'))).toThrow(/名称@x,y/);
  });

  it('renders the matrix, the cell titles and the points', async () => {
    const q = encodeURIComponent(JSON.stringify({
      title: '四象限决策',
      xlabel: '投入',
      ylabel: '回报',
      quadrants: [
        { name: '快赢', desc: '快速当下' },
        { name: '战略', desc: '长期投入' },
        { name: '填坑', desc: '补单' },
        { name: '放弃', desc: '无合行' },
      ],
      items: [{ name: '新业务', x: 0.8, y: 0.9 }],
    }));
    const { svg } = await renderFromUrl(url(`type=quadrant&d=${q}`));
    expect(svg).toMatch(/^<svg /);
    for (const t of ['快赢', '战略', '填坑', '放弃', '投入', '回报', '新业务']) {
      expect(svg).toContain(t);
    }
    // 2×2:外框 + 中十字(两条分隔线)
    expect((svg.match(/<line/g) ?? []).length).toBeGreaterThanOrEqual(2);
    expect((svg.match(/<circle/g) ?? []).length).toBe(1);
  });

  it('400s when the quadrants are missing', () => {
    expect(() => renderFromUrl(url('type=quadrant'))).toThrow(/Missing data/);
  });
});
