import { describe, it, expect } from 'vitest';
import { translateBlock } from '../src/render/mermaid/block.js';
import { blockSpecFromParams, parseBlockSpec, renderBlock, renderBlockFromUrl } from '../src/render/block.js';
import { ApiError } from '../src/specs/index.js';
import { resolveSkin } from '../src/styles/index.js';

const url = (qs: string): URL => new URL(`https://draw.test/draw/block?${qs}`);

/** 参数字典:同名参数收成数组 */
const byName = (params: [string, string][]): Record<string, string[]> => {
  const out: Record<string, string[]> = {};
  for (const [k, v] of params) (out[k] ??= []).push(v);
  return out;
};

const SRC = `block-beta
  columns 3
  a["A"] b["B"] c["C"]
  d space:2
  block:group1:2
  columns 1
  e["E"] --> f["F"]`;

describe('mermaid block-beta → draw block', () => {
  it('每个方块翻成一条 item=,列号按 columns 算', () => {
    const plan = translateBlock(SRC);
    expect(plan.kind).toBe('block');
    const p = byName(plan.params);
    expect(p.cols).toEqual(['3']);
    expect(p.item).toContain('a|0|A');
    expect(p.item).toContain('b|1|B');
    expect(p.item).toContain('c|2|C');
  });

  it('space:N 空出格子(列号按行内位置算,满一行换行)', () => {
    const p = byName(translateBlock('block-beta\n  columns 3\n  a space:2\n  b["B"]').params);
    // a 在第 0 列第 1 行;空两格后 b 到了第 2 行第 1 列(列号仍是 0)
    expect(p.item).toContain('a|0|a');
    expect(p.item).toContain('b|0|B');
  });

  it('block:ID:N 开一个组,组里的方块带上组 id', () => {
    const p = byName(translateBlock('block-beta\n  columns 3\n  block:g1:2\n  x["X"] y["Y"]').params);
    expect(p.item).toContain('x|0|X|g1');
    expect(p.item).toContain('y|1|Y|g1');
    expect(p.block).toContain('g1|0|1|g1');
  });

  it('箭头翻成 edge=', () => {
    const p = byName(translateBlock('block-beta\n  columns 1\n  e["E"] --> f["F"]').params);
    expect(p.edge).toEqual(['e|f']);
  });

  it('注释吃掉,不影响方块', () => {
    const p = byName(translateBlock('block-beta\n  %% 注释\n  a["A"]').params);
    expect(p.item).toEqual(['a|0|A']);
  });

  it('标签里的空格不算分隔符', () => {
    const p = byName(translateBlock('block-beta\n  columns 1\n  e["Error path"]').params);
    expect(p.item).toEqual(['e|0|Error path']);
  });

  it('列数中途改:画布按用过的最大列数算', () => {
    const p = byName(translateBlock('block-beta\n  columns 3\n  a["A"] b["B"] c["C"]\n  columns 1\n  d["D"]').params);
    expect(p.cols).toEqual(['3']);
  });

  it('一个方块都没有 → 报错', () => {
    expect(() => translateBlock('block-beta\n')).toThrow(ApiError);
    expect(() => translateBlock('block-beta\n')).toThrow(/at least one block/);
  });
});

describe('block spec parsing', () => {
  it('URL 参数 → 规格', () => {
    const spec = blockSpecFromParams(url('cols=3&item=a|0|A&item=b|1|B&edge=a|b&title=Blocks').searchParams);
    expect(spec.title).toBe('Blocks');
    expect(spec.cols).toBe(3);
    expect(spec.items).toHaveLength(2);
    expect(spec.edges).toEqual([{ from: 'a', to: 'b' }]);
  });

  it('JSON 形态 → 规格', () => {
    const spec = parseBlockSpec(JSON.stringify({ cols: 2, items: [{ id: 'x', col: 1, label: 'X' }] }));
    expect(spec.items).toEqual([{ id: 'x', col: 1, label: 'X' }]);
  });

  it('一个方块都没有 → 400', () => {
    expect(() => blockSpecFromParams(url('').searchParams)).toThrow(ApiError);
  });

  it('id 重复 → 400', () => {
    expect(() => blockSpecFromParams(url('item=a|0|A&item=a|1|B').searchParams)).toThrow(/duplicate/);
  });

  it('指向不存在的组 → 400', () => {
    expect(() => blockSpecFromParams(url('item=a|0|A|nope').searchParams)).toThrow(/unknown group/);
  });

  it('箭头指向不存在的方块 → 400', () => {
    expect(() => blockSpecFromParams(url('item=a|0|A&edge=a|zzz').searchParams)).toThrow(/unknown item/);
  });
});

describe('block rendering', () => {
  it('方块的名字都画在图上', () => {
    const { svg } = renderBlockFromUrl(url('cols=3&item=a|0|A&item=b|1|B&item=c|2|C'));
    expect(svg).toContain('>A<');
    expect(svg).toContain('>B<');
    expect(svg).toContain('>C<');
  });

  it('箭头画出来(带 marker)', () => {
    const { svg } = renderBlockFromUrl(url('item=a|0|A&item=b|1|B&edge=a|b'));
    expect(svg).toContain('marker-end="url(#bl-a)"');
  });

  it('组的框画出来,标签挂在上沿', () => {
    const { svg } = renderBlockFromUrl(url('cols=3&item=x|0|X|g1&item=y|1|Y|g1&block=g1|0|1|Group'));
    expect(svg).toContain('Group');
    expect(svg).toContain('stroke-dasharray="6 4"');
  });

  it('标题走 titleBlock', () => {
    const { svg } = renderBlockFromUrl(url('item=a|0|A&title=Blocks'));
    expect(svg).toContain('>Blocks<');
    expect(svg).toContain('font-size="18" font-weight="500"');
  });

  it('交互模式:data-tip + metadata 岛', () => {
    const { svg } = renderBlockFromUrl(url('item=a|0|A'), true);
    expect(svg).toContain('data-tip=');
    expect(svg).toContain('<metadata id="bitems">');
  });

  it('换皮:macaron 与默认皮肤不同', () => {
    const def = renderBlockFromUrl(url('item=a|0|A')).svg;
    const mac = renderBlockFromUrl(url('item=a|0|A&t=macaron')).svg;
    expect(mac).not.toBe(def);
    expect(mac).toContain('#D83B30');
  });

  it('renderBlock 直接调用也行', () => {
    const skin = resolveSkin('sankey', null, 'light');
    const svg = renderBlock({ cols: 1, items: [{ id: 'a', col: 0, label: 'A' }], groups: [], edges: [] },
      { width: 400, height: 200, version: 1, skin });
    expect(svg).toContain('>A<');
  });
});
