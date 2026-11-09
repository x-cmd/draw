import { describe, it, expect } from 'vitest';
import { renderFromUrl } from '../src/render/query.js';
import { parseQuadrantSpec, quadrantSpecFromParams } from '../src/specs/quadrant.js';
import { parseCompassSpec, compassSpecFromParams } from '../src/specs/compass.js';

const url = (query: string): URL => new URL(`https://draw.test/draw?${query}`);

// 四象限图(x-cmd-hub/draw#36):一「族」决策图形 —— 矩阵式(带格)与十字式(只有轴),
// 两轴各分高低,可加按坐标落点的散点。
describe('quadrant chart', () => {
  it('parses the quadrants param (TL, TR, BL, BR)', () => {
    const raw = quadrantSpecFromParams(new URLSearchParams('quadrants=快赢,战略,填坑,放弃'));
    expect(raw).not.toBeNull();
    const spec = parseQuadrantSpec(raw);
    expect(spec.groups?.map((g) => g?.name)).toEqual(['快赢', '战略', '填坑', '放弃']);
  });

  it('needs exactly four quadrants when the cells are given', () => {
    expect(() => quadrantSpecFromParams(new URLSearchParams('quadrants=A,B,C')))
      .toThrow(/exactly 4/);
    expect(() => parseQuadrantSpec(JSON.stringify({ groups: ['A', 'B'] }))).toThrow(/exactly 4/);
    expect(() => parseQuadrantSpec(null)).toThrow(/Missing data/);
  });

  it('works with cells, without cells, or with points only', () => {
    // 只要轴(十字式):不强制四格
    const cross = parseQuadrantSpec(quadrantSpecFromParams(new URLSearchParams('xlabel=熟悉')));
    expect(cross.groups).toBeUndefined();
    // 只要点:也没有格
    const points = parseQuadrantSpec(quadrantSpecFromParams(new URLSearchParams('items=甲@0.2,0.8')));
    expect(points.groups).toBeUndefined();
    expect(points.items).toHaveLength(1);
    // 两样都没有 → 400
    expect(() => parseQuadrantSpec('{}')).toThrow(/groups|items/);
  });

  it('keeps the cell notes and the extra labels', () => {
    const raw = quadrantSpecFromParams(new URLSearchParams(
      'quadrants=A,B,C,D&quaddescs=甲;乙;丙;丁&quadlabels=甲1|甲2;乙1;丙1;丁1&xlabel=投入&ylabel=回报&xlow=少&xhigh=多',
    ));
    const spec = parseQuadrantSpec(raw);
    expect(spec.groups?.map((g) => g?.note)).toEqual(['甲', '乙', '丙', '丁']);
    expect(spec.groups?.[0]?.labels).toEqual(['甲1', '甲2']);
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
      groups: [
        { name: '快赢', note: '快速当下' },
        { name: '战略', note: '长期投入' },
        { name: '填坑', note: '补单' },
        { name: '放弃', note: '无合行' },
      ],
      items: [{ name: '新业务', x: 0.8, y: 0.9 }],
    }));
    const { svg } = await renderFromUrl(url(`type=quadrant&d=${q}`));
    expect(svg).toMatch(/^<svg /);
    for (const t of ['快赢', '战略', '填坑', '放弃', '投入', '回报', '新业务']) {
      expect(svg).toContain(t);
    }
    // 矩阵式:两支带箭头的轴 + 一条竖分隔线(框是 path,横分隔线就是横轴)
    expect((svg.match(/<line/g) ?? []).length).toBe(3);
    // 四个格各一个色点 + 散点一个
    expect((svg.match(/<circle/g) ?? []).length).toBe(5);
  });

  it('draws only the axes in the cross frame', async () => {
    const q = encodeURIComponent(JSON.stringify({ xlabel: '熟悉', ylabel: '关注' }));
    const { svg } = await renderFromUrl(url(`type=quadrant&d=${q}`));
    expect(svg).toContain('熟悉');
    expect(svg).toContain('关注');
    // 十字式:只有两支轴(矩阵式另有中分线,共 4 条 line)
    expect((svg.match(/<line/g) ?? []).length).toBe(2);
  });

  it('400s when the quadrants are missing', () => {
    expect(() => renderFromUrl(url('type=quadrant'))).toThrow(/Missing data/);
  });
});

// 四向箭头(compass):中心一点,四个方向各一支箭头 —— 与四象限是两种图形
describe('compass chart', () => {
  it('parses the four directions', () => {
    const spec = parseCompassSpec(compassSpecFromParams(new URLSearchParams(
      'up=自己&right=他人:同事&down=组织&left=环境',
    )));
    expect(spec.up?.label).toBe('自己');
    expect(spec.right).toEqual({ label: '他人', note: '同事' });
    expect(spec.down?.label).toBe('组织');
    expect(spec.left?.label).toBe('环境');
  });

  it('needs at least one direction', () => {
    expect(() => parseCompassSpec('{}')).toThrow(/at least one direction/);
    expect(() => parseCompassSpec(null)).toThrow(/Missing data/);
  });

  it('renders the four arrows and the labels', async () => {
    const q = encodeURIComponent(JSON.stringify({ center: '我', up: '自己', right: '他人', down: '组织', left: '环境' }));
    const { svg } = await renderFromUrl(url(`type=compass&d=${q}`));
    expect(svg).toMatch(/^<svg /);
    for (const t of ['自己', '他人', '组织', '环境', '我']) {
      expect(svg).toContain(t);
    }
    // 四支箭头 = 四条锥形箭身;标签胶囊是 rect,四个标签各一个色点 + 中心盘两点
    expect((svg.match(/<path/g) ?? []).length).toBe(4);
    expect((svg.match(/<circle/g) ?? []).length).toBe(6);
  });

  it('draws only the directions that have content', async () => {
    const q = encodeURIComponent(JSON.stringify({ up: '自己', right: '他人' }));
    const { svg } = await renderFromUrl(url(`type=compass&d=${q}`));
    expect((svg.match(/<path/g) ?? []).length).toBe(2);
    expect(svg).not.toContain('组织');
  });
});
