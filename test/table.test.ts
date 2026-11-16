import { describe, it, expect } from 'vitest';
import { draw } from '../src/lib.js';
import { renderTable, tableToGrid } from '../src/render/table.js';
import { parseTableSpec, tableSpecFromParams } from '../src/specs/table.js';
import { resolveSkin } from '../src/styles/index.js';
import { handleRequest } from '../src/handler.js';

describe('table kind', () => {
  it('扁平参数 → 规格', () => {
    const spec = parseTableSpec(
      tableSpecFromParams(new URLSearchParams('cols=Service,Errors&rows=api:12;worker:9')),
    );
    expect(spec.cols).toEqual(['Service', 'Errors']);
    expect(spec.rows).toEqual([
      ['api', '12'],
      ['worker', '9'],
    ]);
  });

  it('?d= 的 JSON 形态', () => {
    const spec = parseTableSpec('{"cols":["A","B"],"rows":[["x",1],["y",2]]}');
    expect(spec.cols).toEqual(['A', 'B']);
    expect(spec.rows).toEqual([
      ['x', '1'],
      ['y', '2'],
    ]);
  });

  it('渲染出的 SVG 里有表头和数据', () => {
    const { svg } = draw({ type: 'table', cols: 'Service,Errors', rows: 'api:12;worker:9' });
    expect(svg.startsWith('<svg')).toBe(true);
    expect(svg).toContain('Service');
    expect(svg).toContain('Errors');
    expect(svg).toContain('api');
    expect(svg).toContain('12');
  });

  it('输出里嵌着规格(能拆回数据)', () => {
    const { svg } = draw({ type: 'table', cols: 'A,B', rows: '1:2' });
    const m = /<metadata>([\s\S]*?)<\/metadata>/.exec(svg);
    expect(m).not.toBeNull();
    const raw = m![1]!
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&amp;/g, '&');
    const doc = JSON.parse(raw) as { generator: string; template: string; spec: unknown };
    expect(doc.generator).toBe('draw');
    expect(doc.template).toBe('table');
    expect(doc.spec).toEqual({ cols: ['A', 'B'], rows: [['1', '2']] });
  });

  it('整列都是数字 → 右对齐', () => {
    const spec = parseTableSpec(tableSpecFromParams(new URLSearchParams('cols=A,B&rows=1:2;3:4')));
    const grid = tableToGrid(spec);
    expect(grid.cols[0]?.align).toBe('right');
    expect(grid.cols[1]?.align).toBe('right');
  });

  it('有文字的列左对齐', () => {
    const spec = parseTableSpec(tableSpecFromParams(new URLSearchParams('cols=A,B&rows=x:2')));
    const grid = tableToGrid(spec);
    expect(grid.cols[0]?.align).toBe('left');
  });

  it('自然尺寸按内容算', () => {
    const spec = parseTableSpec(
      tableSpecFromParams(new URLSearchParams('cols=A,B&rows=1:2;3:4;5:6')),
    );
    const grid = tableToGrid(spec);
    expect(grid.rows).toHaveLength(3);
    expect(grid.width).toBeGreaterThan(0);
    expect(grid.height).toBeGreaterThan(0);
  });

  it('角标指向 /table(不是 draw 底下的 explore)', () => {
    const { svg } = draw({ type: 'table', cols: 'A', rows: '1' });
    expect(svg).toContain('https://x-cmd.com/table?d=');
    expect(svg).not.toContain('/draw/explore?type=table');
  });

  it('HTTP 层:GET /draw?type=table 出 SVG', async () => {
    const res = await handleRequest(
      new Request('https://draw.test/draw?type=table&cols=A,B&rows=1:2'),
      {},
      {},
    );
    expect(res.status).toBe(200);
    expect(res.headers.get('content-type')).toContain('image/svg+xml');
    expect(await res.text()).toContain('<metadata>');
  });

  it('HTTP 层:参数坏了给 400 纯文本,并说明怎么改', async () => {
    const res = await handleRequest(
      new Request('https://draw.test/draw?type=table&cols=A,B&rows=1:2:3'),
      {},
      {},
    );
    expect(res.status).toBe(400);
    expect(res.headers.get('content-type')).toContain('text/plain');
    const text = await res.text();
    expect(text).toContain('cells in row 1');
    expect(text).toContain('cols=A,B');
  });

  it('渲染器直接调也认规格', () => {
    const spec = parseTableSpec(
      tableSpecFromParams(new URLSearchParams('cols=A&rows=1')),
    );
    const skin = resolveSkin('table', null, 'auto');
    const svg = renderTable(spec, { width: 0, height: 0, version: 1, skin });
    expect(svg).toContain('A');
    expect(svg.startsWith('<svg')).toBe(true);
  });
});
