import { describe, it, expect } from 'vitest';
import { renderMermaidFromUrl } from '../src/render/mermaid.js';
import { translateSequence } from '../src/render/mermaid/seq.js';
import { ApiError } from '../src/specs/index.js';

// mermaid sequenceDiagram → draw 的时序图。
// 参与方 n=、消息 e=(顺序即时间)、分支框 f=(罩住第几条到第几条消息)。
const url = (src: string): URL =>
  new URL('https://draw.test/draw/mermaid?m=' + encodeURIComponent(src));

const render = (src: string): string => renderMermaidFromUrl(url(src)).svg;

describe('mermaid sequenceDiagram → draw seq', () => {
  it('participant/actor 声明翻成 n=(participant→be,actor→ext)', () => {
    const plan = translateSequence([
      'sequenceDiagram',
      '    participant A as Alice',
      '    actor B as Bob',
      '    A->>B: Hello',
    ].join('\n'));
    expect(plan.kind).toBe('seq');
    expect(plan.params.filter(([k]) => k === 'n')).toEqual([
      ['n', 'A;be;Alice'],
      ['n', 'B;ext;Bob'],
    ]);
  });

  it('没写 as 的参与方,名字就是 id 本身', () => {
    const plan = translateSequence('sequenceDiagram\n    participant A\n    A->>A: hi');
    expect(plan.params).toContainEqual(['n', 'A;be;A']);
  });

  it('消息按源码顺序翻成 e=', () => {
    const plan = translateSequence([
      'sequenceDiagram',
      '    participant A as Alice',
      '    participant B as Bob',
      '    A->>B: Hello Bob',
      '    B->>A: Hi',
    ].join('\n'));
    expect(plan.params.filter(([k]) => k === 'e')).toEqual([
      ['e', 'A;B;Hello Bob'],
      ['e', 'B;A;Hi'],
    ]);
  });

  it('消息正文里的冒号只按第一个断(12:30 是一个整体)', () => {
    const plan = translateSequence('sequenceDiagram\n    A->>B: 12:30');
    expect(plan.params).toContainEqual(['e', 'A;B;12:30']);
  });

  it('虚线回复带上 dash 标记', () => {
    const plan = translateSequence([
      'sequenceDiagram',
      '    A->>B: Hello',
      '    B-->>A: Great!',
    ].join('\n'));
    const es = plan.params.filter(([k]) => k === 'e');
    expect(es[0]).toEqual(['e', 'A;B;Hello']);
    expect(es[1]).toEqual(['e', 'B;A;Great!;dash']);
  });

  it('点线(-.->)也是虚线', () => {
    const plan = translateSequence('sequenceDiagram\n    A-.->B: later');
    expect(plan.params).toContainEqual(['e', 'A;B;later;dash']);
  });

  it('空标签不写标签段', () => {
    const plan = translateSequence('sequenceDiagram\n    A->>B:');
    expect(plan.params).toContainEqual(['e', 'A;B']);
  });

  it('自消息(from===to)是允许的', () => {
    const plan = translateSequence('sequenceDiagram\n    A->>A: self message');
    expect(plan.params).toContainEqual(['e', 'A;A;self message']);
    const svg = render('sequenceDiagram\n    participant A as Alice\n    A->>A: self message');
    expect(svg).toContain('>Alice<');
    expect(svg).toContain('self message');
  });

  it('没声明过的参与方按第一次出现自动补一个(be,名字就是 id)', () => {
    const plan = translateSequence([
      'sequenceDiagram',
      '    A->>B: Hello',
      '    B->>C: Hi',
    ].join('\n'));
    expect(plan.params.filter(([k]) => k === 'n')).toEqual([
      ['n', 'A;be;A'],
      ['n', 'B;be;B'],
      ['n', 'C;be;C'],
    ]);
  });

  it('alt/else 翻成分支框,罩住各自那段消息', () => {
    const plan = translateSequence([
      'sequenceDiagram',
      '    A->>B: one',
      '    alt is it ok',
      '        A->>B: yes',
      '    else not ok',
      '        A->>B: no',
      '    end',
    ].join('\n'));
    expect(plan.params.filter(([k]) => k === 'f')).toEqual([
      ['f', 'alt;is it ok;1;1'],
      ['f', 'else;not ok;2;2'],
    ]);
  });

  it('loop/opt/par/break 各自成框;and 与 par 同类(引擎才会并进一个框)', () => {
    const plan = translateSequence([
      'sequenceDiagram',
      '    loop every minute',
      '        A->>B: tick',
      '    end',
      '    opt extra',
      '        A->>B: maybe',
      '    end',
      '    par one',
      '        A->>B: p1',
      '    and two',
      '        A->>B: p2',
      '    end',
      '    break when it fails',
      '        A->>B: fail',
      '    end',
    ].join('\n'));
    expect(plan.params.filter(([k]) => k === 'f')).toEqual([
      ['f', 'loop;every minute;0;0'],
      ['f', 'opt;extra;1;1'],
      ['f', 'par;one;2;2'],
      ['f', 'par;two;3;3'],
      ['f', 'break;when it fails;4;4'],
    ]);
  });

  it('critical/option 没有对应的框,按 alt/else 落(引擎的 honest 近似)', () => {
    const plan = translateSequence([
      'sequenceDiagram',
      '    critical something bad',
      '        A->>B: bad',
      '    option mitigation',
      '        A->>B: mitigate',
      '    end',
    ].join('\n'));
    expect(plan.params.filter(([k]) => k === 'f')).toEqual([
      ['f', 'alt;something bad;0;0'],
      ['f', 'else;mitigation;1;1'],
    ]);
  });

  it('框里没有消息就不产分支框(引擎的 f= 要求 start<=end)', () => {
    const plan = translateSequence([
      'sequenceDiagram',
      '    alt nothing here',
      '    end',
      '    A->>B: after',
    ].join('\n'));
    expect(plan.params.filter(([k]) => k === 'f')).toEqual([]);
  });

  it('画不下的行(Note/activate/rect/autonumber)丢掉,不报错', () => {
    const plan = translateSequence([
      'sequenceDiagram',
      '    autonumber',
      '    participant A as Alice',
      '    participant B as Bob',
      '    Note over A,B: a note',
      '    Note right of A: another note',
      '    activate A',
      '    A->>B: Hello',
      '    deactivate A',
      '    rect rgb(200,255,255)',
      '        A->>B: inside rect',
      '    end',
    ].join('\n'));
    expect(plan.params.filter(([k]) => k === 'f')).toEqual([]);
    expect(plan.params.filter(([k]) => k === 'e').length).toBe(2);
  });

  it('一条消息都没有就报错', () => {
    expect(() => translateSequence('sequenceDiagram\n    participant A as Alice')).toThrow(ApiError);
    expect(() => translateSequence('sequenceDiagram\n    participant A as Alice')).toThrow(/at least one message/);
  });
});

describe('mermaid sequenceDiagram 端到端', () => {
  it('画出参与方、消息和分支框', () => {
    const svg = render([
      'sequenceDiagram',
      '    autonumber',
      '    participant A as Alice',
      '    actor B as Bob',
      '    A->>B: Hello Bob',
      '    B-->>A: Great!',
      '    alt is it ok',
      '        A->>B: yes',
      '    else not ok',
      '        A->>B: no',
      '    end',
    ].join('\n'));
    expect(svg).toContain('<svg');
    expect(svg).toContain('>Alice<');
    expect(svg).toContain('>Bob<');
    expect(svg).toContain('Hello Bob');
    expect(svg).toContain('Great!');
    expect(svg).toContain('alt [is it ok]');
    expect(svg).toContain('else [not ok]');
    expect(svg).not.toContain('mermaid:');
  });

  it('虚线回复画成虚线', () => {
    const svg = render([
      'sequenceDiagram',
      '    participant A as Alice',
      '    participant B as Bob',
      '    A->>B: Hello',
      '    B-->>A: Great!',
    ].join('\n'));
    expect(svg).toContain('stroke-dasharray="5 4"');
  });

  it('自动补出来的参与方也在图上', () => {
    const svg = render('sequenceDiagram\n    A->>B: Hello');
    expect(svg).toContain('>A<');
    expect(svg).toContain('>B<');
    expect(svg).toContain('Hello');
  });
});
