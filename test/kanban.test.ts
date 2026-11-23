import { describe, it, expect } from 'vitest';
import { translateKanban } from '../src/render/mermaid/kanban.js';
import { renderKanbanFromUrl, parseKanbanSpec, kanbanSpecFromParams } from '../src/render/kanban.js';
import { ApiError } from '../src/specs/index.js';

// /draw/kanban:列并排,列里是任务卡。
// 参数:column=(列名,按序) / task=列|标题|元信息 / title=。

const SRC = [
  'kanban',
  '  Todo',
  '    task1[Implement the parser]',
  '    task2[Fix the layout]',
  '  Doing',
  '    task3[Draw the chart]',
  '  Done',
  '    task4[Ship it]',
].join('\n');

describe('mermaid kanban → draw kanban', () => {
  it('翻出 kanban 图种与列(按序)', () => {
    const plan = translateKanban(SRC);
    expect(plan.kind).toBe('kanban');
    expect(plan.params.filter(([k]) => k === 'column')).toEqual([
      ['column', 'Todo'],
      ['column', 'Doing'],
      ['column', 'Done'],
    ]);
  });

  it('任务按缩进归到列上', () => {
    const plan = translateKanban(SRC);
    expect(plan.params.filter(([k]) => k === 'task')).toEqual([
      ['task', 'Todo|Implement the parser|'],
      ['task', 'Todo|Fix the layout|'],
      ['task', 'Doing|Draw the chart|'],
      ['task', 'Done|Ship it|'],
    ]);
  });

  it('花括号里的元信息单独一段', () => {
    const plan = translateKanban('kanban\n  Todo\n    task1[Implement the parser]{priority: high}');
    expect(plan.params).toContainEqual(['task', 'Todo|Implement the parser|priority: high']);
  });

  it('%% 注释被跳过', () => {
    const plan = translateKanban('kanban\n  %% a comment\n  Todo\n    task1[Do it]');
    expect(plan.params.filter(([k]) => k === 'task').length).toBe(1);
  });

  it('一个任务都没有就报错', () => {
    expect(() => translateKanban('kanban\n  Todo\n  Doing')).toThrow(ApiError);
    expect(() => translateKanban('kanban\n  Todo\n  Doing')).toThrow(/at least one task/);
  });

  it('一列都没有就报错', () => {
    expect(() => translateKanban('kanban')).toThrow(ApiError);
  });
});

describe('kanban rendering', () => {
  const url = (q: string): URL => new URL(`https://draw.test/draw/kanban?${q}`);

  it('画出列名与任务卡标题', () => {
    const svg = renderKanbanFromUrl(url(
      'column=Todo&column=Doing&column=Done' +
      '&task=Todo|Implement the parser|high' +
      '&task=Doing|Draw the chart|' +
      '&task=Done|Ship it|',
    )).svg;
    expect(svg).toContain('<svg');
    expect(svg).toContain('>Todo<');
    expect(svg).toContain('>Doing<');
    expect(svg).toContain('>Done<');
    expect(svg).toContain('Implement the parser');
    expect(svg).toContain('Draw the chart');
    expect(svg).toContain('Ship it');
    expect(svg).toContain('high');
  });

  it('卡片用皮肤的中性色(card/border),不写死 hex', () => {
    const svg = renderKanbanFromUrl(url('column=Todo&task=Todo|A||')).svg;
    expect(svg).toContain('fill="var(--d-card)"');
    expect(svg).toContain('stroke="var(--d-border)"');
    // 画出来的图形里没有写死的色值(皮肤变量表本身当然有 hex)
    const body = svg.replace(/<style>[\s\S]*?<\/style>/, '');
    expect(body).not.toMatch(/#[0-9a-fA-F]{6}/);
  });

  it('列的强调色来自皮肤系列色', () => {
    const svg = renderKanbanFromUrl(url('column=Todo&column=Doing&task=Todo|A||&task=Doing|B||')).svg;
    expect(svg).toContain('var(--d-s1)');
    expect(svg).toContain('var(--d-s2)');
  });

  it('标题走 titleBlock 的样子', () => {
    const svg = renderKanbanFromUrl(url('column=Todo&task=Todo|A||&title=Sprint 12')).svg;
    expect(svg).toContain('>Sprint 12<');
    expect(svg).toContain('font-size="18"');
  });

  it('interactive:卡片带 data-tip,并落一个 metadata 岛', () => {
    const svg = renderKanbanFromUrl(url('column=Todo&task=Todo|Write parser|high|'), true).svg;
    expect(svg).toContain('data-tip="Write parser · high · Todo"');
    expect(svg).toContain('<metadata id="ktasks">');
  });

  it('换个皮肤,画布里的色值就换', () => {
    const base = renderKanbanFromUrl(url('column=Todo&task=Todo|A||')).svg;
    const macaron = renderKanbanFromUrl(url('column=Todo&task=Todo|A||&t=macaron')).svg;
    expect(macaron).not.toBe(base);
    expect(macaron).toContain('--d-s1:');
  });

  it('同样的参数,输出确定', () => {
    const q = 'column=Todo&column=Doing&task=Todo|A||&task=Doing|B||';
    expect(renderKanbanFromUrl(url(q)).svg).toBe(renderKanbanFromUrl(url(q)).svg);
  });

  it('w=/h= 尊重画布尺寸', () => {
    const svg = renderKanbanFromUrl(url('column=Todo&task=Todo|A||&w=900&h=600')).svg;
    expect(svg).toContain('width="900"');
    expect(svg).toContain('height="600"');
  });

  it('没给 w=/h= 时画布按内容自然尺寸', () => {
    const svg = renderKanbanFromUrl(url('column=Todo&task=Todo|A||')).svg;
    const w = Number(/<svg[^>]*\bwidth="(\d+)"/.exec(svg)![1]);
    const h = Number(/<svg[^>]*\bheight="(\d+)"/.exec(svg)![1]);
    expect(w).toBeGreaterThan(150);
    expect(h).toBeGreaterThan(80);
  });
});

describe('kanban 参数校验', () => {
  it('没有列就报错', () => {
    try {
      renderKanbanFromUrl(new URL('https://draw.test/draw/kanban?task=Todo|A||'));
      expect.unreachable('should have thrown');
    } catch (err) {
      expect(err).toBeInstanceOf(ApiError);
      expect((err as ApiError).message).toContain('at least one column');
    }
  });

  it('没有任务就报错', () => {
    try {
      renderKanbanFromUrl(new URL('https://draw.test/draw/kanban?column=Todo'));
      expect.unreachable('should have thrown');
    } catch (err) {
      expect(err).toBeInstanceOf(ApiError);
      expect((err as ApiError).message).toContain('at least one task');
    }
  });

  it('任务落在未知列上报错', () => {
    try {
      renderKanbanFromUrl(new URL('https://draw.test/draw/kanban?column=Todo&task=Nope|A||'));
      expect.unreachable('should have thrown');
    } catch (err) {
      expect(err).toBeInstanceOf(ApiError);
      expect((err as ApiError).message).toContain('unknown column');
    }
  });

  it('?d= 不是合法 JSON 时报错并给例子', () => {
    expect(() => parseKanbanSpec('{oops')).toThrow(ApiError);
    expect(() => parseKanbanSpec('{oops')).toThrow(/valid JSON/);
  });

  it('?d= 的 JSON 形态:任务引用不存在的列报错', () => {
    expect(() => parseKanbanSpec(JSON.stringify({
      columns: ['Todo'],
      tasks: [{ column: 'Nope', title: 'x' }],
    }))).toThrow(/not one of the columns/);
  });

  it('kanbanSpecFromParams 读扁平参数', () => {
    const spec = kanbanSpecFromParams(new URLSearchParams('column=Todo&task=Todo|A|high'));
    expect(spec.columns).toEqual(['Todo']);
    expect(spec.tasks).toEqual([{ column: 'Todo', title: 'A', meta: 'high' }]);
  });

  it('?d= 的 JSON 形态也能直接渲染', () => {
    const d = encodeURIComponent(JSON.stringify({
      columns: ['Todo', 'Done'],
      tasks: [
        { column: 'Todo', title: 'Write it', meta: 'high' },
        { column: 'Done', title: 'Shipped' },
      ],
    }));
    const svg = renderKanbanFromUrl(new URL(`https://draw.test/draw/kanban?d=${d}`)).svg;
    expect(svg).toContain('Write it');
    expect(svg).toContain('Shipped');
    expect(svg).toContain('>Todo<');
    expect(svg).toContain('>Done<');
  });

  it('超长的卡片标题会截断(不许越出卡片)', () => {
    const svg = renderKanbanFromUrl(new URL('https://draw.test/draw/kanban?' + [
      'column=Todo',
      'task=Todo|' + 'A very long task title that will not fit inside the card at all|',
    ].join('&'))).svg;
    expect(svg).toContain('…');
  });
});
