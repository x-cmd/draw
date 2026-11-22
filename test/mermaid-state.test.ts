import { describe, it, expect } from 'vitest';
import { renderMermaidFromUrl } from '../src/render/mermaid.js';
import { translateState } from '../src/render/mermaid/state.js';
import { ApiError } from '../src/specs/index.js';

// mermaid stateDiagram / stateDiagram-v2 → draw 的生命周期。
// 状态 n=(state/decision/terminal)、迁移 e=、组合态 b=、方向 dir=。
const url = (src: string): URL =>
  new URL('https://draw.test/draw/mermaid?m=' + encodeURIComponent(src));

const render = (src: string): string => renderMermaidFromUrl(url(src)).svg;

describe('mermaid stateDiagram → draw lifecycle', () => {
  it('状态翻成 n=(state),迁移翻成 e=', () => {
    const plan = translateState([
      'stateDiagram-v2',
      '    Still --> Moving : starts moving',
      '    Moving --> Still',
    ].join('\n'));
    expect(plan.kind).toBe('lifecycle');
    expect(plan.params).toEqual([
      ['n', 'Still;state;Still'],
      ['n', 'Moving;state;Moving'],
      ['e', 'Still;Moving;starts moving'],
      ['e', 'Moving;Still'],
    ]);
  });

  it('state "长名" as id 用长名当标签', () => {
    const plan = translateState([
      'stateDiagram-v2',
      '    state "This is a state description" as s2',
      '    s2 --> s3',
    ].join('\n'));
    expect(plan.params).toContainEqual(['n', 's2;state;This is a state description']);
    expect(plan.params).toContainEqual(['n', 's3;state;s3']);
  });

  it('s2 : 说明 追加到第四段(多行用 \\n 连起来)', () => {
    const plan = translateState([
      'stateDiagram-v2',
      '    state s2',
      '    s2 : first line',
      '    s2 : second line',
      '    s2 --> s3',
    ].join('\n'));
    expect(plan.params).toContainEqual(['n', 's2;state;s2;first line\nsecond line']);
  });

  it('<<fork>>/<<join>>/<<choice>> 是判定,<<end>> 是终态', () => {
    const plan = translateState([
      'stateDiagram-v2',
      '    state fork_state <<fork>>',
      '    state join_state <<join>>',
      '    state c <<choice>>',
      '    state e <<end>>',
      '    fork_state --> join_state',
    ].join('\n'));
    expect(plan.params).toContainEqual(['n', 'fork_state;decision;fork_state']);
    expect(plan.params).toContainEqual(['n', 'join_state;decision;join_state']);
    expect(plan.params).toContainEqual(['n', 'c;decision;c']);
    expect(plan.params).toContainEqual(['n', 'e;terminal;e']);
  });

  it('[*] 作源点是 Start,作宿点是 End,整张图各一个', () => {
    const plan = translateState([
      'stateDiagram-v2',
      '    [*] --> Still',
      '    Still --> Moving',
      '    Crash --> [*]',
    ].join('\n'));
    expect(plan.params).toContainEqual(['n', 'start;terminal;Start']);
    expect(plan.params).toContainEqual(['n', 'end;terminal;End']);
    expect(plan.params).toContainEqual(['e', 'start;Still']);
    expect(plan.params).toContainEqual(['e', 'Crash;end']);
  });

  it('组合态变成一个边界,里面的状态还是普通节点', () => {
    const plan = translateState([
      'stateDiagram-v2',
      '    state Composite {',
      '        [*] --> First',
      '        First --> Second',
      '    }',
    ].join('\n'));
    expect(plan.params).toContainEqual(['n', 'First;state;First']);
    expect(plan.params).toContainEqual(['n', 'Second;state;Second']);
    expect(plan.params).toContainEqual(['b', 'Composite;First Second']);
  });

  it('嵌套的组合态:内层的状态也算外层的一部分', () => {
    const plan = translateState([
      'stateDiagram-v2',
      '    state Outer {',
      '        state Inner {',
      '            Leaf --> Leaf2',
      '        }',
      '    }',
    ].join('\n'));
    expect(plan.params).toContainEqual(['b', 'Inner;Leaf Leaf2']);
    expect(plan.params).toContainEqual(['b', 'Outer;Leaf Leaf2']);
  });

  it('空组合态不产边界', () => {
    const plan = translateState([
      'stateDiagram-v2',
      '    state Empty {',
      '    }',
      '    A --> B',
    ].join('\n'));
    expect(plan.params.filter(([k]) => k === 'b')).toEqual([]);
  });

  it('direction LR/TB 落成 dir=', () => {
    expect(translateState('stateDiagram-v2\n    direction LR\n    A --> B').params).toContainEqual(['dir', 'lr']);
    expect(translateState('stateDiagram-v2\n    direction TB\n    A --> B').params).toContainEqual(['dir', 'tb']);
  });

  it('没写方向就不给 dir=', () => {
    const plan = translateState('stateDiagram-v2\n    A --> B');
    expect(plan.params.filter(([k]) => k === 'dir')).toEqual([]);
  });

  it('认不得的行(classDef/note/…)丢掉,不报错', () => {
    const plan = translateState([
      'stateDiagram-v2',
      '    classDef hot red',
      '    note right of A : a note',
      '    A --> B',
    ].join('\n'));
    expect(plan.params).toContainEqual(['e', 'A;B']);
  });

  it('图里真有个状态叫 start/end,洗白后不跟伪状态撞 id', () => {
    const plan = translateState([
      'stateDiagram-v2',
      '    [*] --> start',
      '    start --> end',
      '    end --> [*]',
    ].join('\n'));
    expect(plan.params).toContainEqual(['n', 'start;terminal;Start']);
    expect(plan.params).toContainEqual(['n', 'end;terminal;End']);
    // 用户的状态洗成了别的 id
    expect(plan.params.filter(([k, v]) => k === 'n' && v.endsWith(';state;start'))).toHaveLength(1);
    expect(plan.params.filter(([k, v]) => k === 'n' && v.endsWith(';state;end'))).toHaveLength(1);
    // id 都唯一
    const nodeIds = plan.params.filter(([k]) => k === 'n').map(([, v]) => v.split(';')[0]);
    expect(new Set(nodeIds).size).toBe(nodeIds.length);
  });

  it('一个状态都没有就报错', () => {
    expect(() => translateState('stateDiagram-v2\n    direction LR')).toThrow(ApiError);
    expect(() => translateState('stateDiagram-v2\n    direction LR')).toThrow(/at least one state/);
  });
});

describe('mermaid stateDiagram 端到端', () => {
  it('画出状态、迁移和 [*] 的起止', () => {
    const svg = render([
      'stateDiagram-v2',
      '    direction LR',
      '    [*] --> Still',
      '    Still --> Moving : starts moving',
      '    Moving --> Still',
      '    Moving --> Crash',
      '    Crash --> [*]',
    ].join('\n'));
    expect(svg).toContain('<svg');
    expect(svg).toContain('>Still<');
    expect(svg).toContain('>Moving<');
    expect(svg).toContain('>Crash<');
    expect(svg).toContain('>Start<');
    expect(svg).toContain('>End<');
    expect(svg).toContain('starts moving');
    expect(svg).not.toContain('mermaid:');
  });

  it('画出组合态的边界与里面的状态', () => {
    const svg = render([
      'stateDiagram-v2',
      '    state Composite {',
      '        [*] --> First',
      '        First --> Second',
      '    }',
    ].join('\n'));
    expect(svg).toContain('>First<');
    expect(svg).toContain('>Second<');
    expect(svg).toContain('COMPOSITE'); // 边界标签(引擎画成大写)
  });

  it('画出状态说明与判定框', () => {
    const svg = render([
      'stateDiagram-v2',
      '    state "Long name" as s2',
      '    s2 : some description text',
      '    state fork_state <<fork>>',
      '    s2 --> fork_state',
    ].join('\n'));
    expect(svg).toContain('Long name');
    expect(svg).toContain('some description text');
    expect(svg).toContain('fork_state');
  });

  it('direction LR 走横向布局', () => {
    const lr = render('stateDiagram-v2\n    direction LR\n    A --> B');
    const tb = render('stateDiagram-v2\n    direction TB\n    A --> B');
    expect(lr).not.toBe(tb);
    expect(lr).toContain('<svg');
    expect(tb).toContain('<svg');
  });
});
