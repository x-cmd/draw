import { describe, it, expect } from 'vitest';
import { handleRequest } from '../src/handler.js';
import { renderKindFromUrl } from '../src/render/kinds.js';
import { renderGantt2FromUrl } from '../src/render/gantt2.js';

// 四种新图种:同一套引擎(架构图 v2 那张脸),各带一套语义类型词汇。
//   /draw/dataflow  数据流   /draw/lifecycle 生命周期
//   /draw/erd       实体关系 /draw/class     类图
// 以及 /draw/gantt2 —— 和 /draw/gantt 同一份输入,换一张脸。
const DATAFLOW = [
  'n=raw;source;raw/orders.csv;;r0c0',
  'n=extract;process;Extract rows;read + validate;r1c0',
  'n=store;store;warehouse/orders;parquet;r2c0',
  'e=raw;extract;rows',
  'e=extract;store;write parquet',
];
const LIFECYCLE = [
  'n=new;state;New;;r0c0',
  'n=paid;state;Paid;;r1c0',
  'n=ok;terminal;Fulfilled;;r1c1',
  'e=new;paid;payment ok',
  'e=paid;ok',
];
const ERD = [
  'n=users;table;users;id:int (pk)%0Aname:text;r0c0',
  'n=orders;table;orders;id:int (pk)%0Auser_id:int (fk);r1c0',
  'e=users;orders;1:N',
];
const CLASS = [
  'n=user;class;User;id:int%0Aname:string%0Agreet(): void;r0c0',
  'n=repo;iface;Repository;find(id): User?;r1c0',
  'e=user;repo;implements',
];

describe('new diagram kinds', () => {
  const cases: [string, string[]][] = [
    ['dataflow', DATAFLOW],
    ['lifecycle', LIFECYCLE],
    ['erd', ERD],
    ['class', CLASS],
  ];
  for (const [kind, params] of cases) {
    it(`renders ${kind} with a type legend`, () => {
      const { svg } = renderKindFromUrl(kind, new URL('https://x-cmd.com/draw/' + kind + '?' + params.join('&')));
      expect(svg).toContain('<svg');
      expect(svg).toContain('data-legend');
    });
  }

  it('gives each kind its own vocabulary and rejects the others', () => {
    expect(() => renderKindFromUrl('dataflow', new URL('https://x-cmd.com/draw/dataflow?n=x;state;S;r0c0'))).toThrow(/process/);
    expect(() => renderKindFromUrl('erd', new URL('https://x-cmd.com/draw/erd?n=x;class;C;r0c0'))).toThrow(/table/);
  });

  it('renders a multi-line node (field list) as separate lines', () => {
    const { svg } = renderKindFromUrl('erd', new URL('https://x-cmd.com/draw/erd?' + ERD.join('&')));
    expect(svg).toContain('id:int (pk)');
    expect(svg).toContain('user_id:int (fk)');
  });

  it('rejects a node that names an unknown peer', () => {
    expect(() => renderKindFromUrl('dataflow', new URL('https://x-cmd.com/draw/dataflow?n=x;process;X;r0c0&e=x;ghost'))).toThrow(/ghost/);
  });

  it('serves over HTTP', async () => {
    const res = await handleRequest(
      new Request('https://x-cmd.com/draw/lifecycle?' + LIFECYCLE.join('&')),
      {}, {},
    );
    expect(res.status).toBe(200);
    expect(res.headers.get('content-type')).toContain('image/svg+xml');
  });
});

describe('gantt v2', () => {
  const SRC = 'dateFormat YYYY-MM-DD\n  section Dev\n  Design :done, a1, 2026-11-01, 3d\n  Build :active, a2, after a1, 5d';

  it('renders bars coloured by status plus a legend', () => {
    const { svg } = renderGantt2FromUrl(new URL('https://x-cmd.com/draw/gantt2?m=' + encodeURIComponent(SRC)));
    expect(svg).toContain('<svg');
    expect(svg).toContain('data-legend');
    expect(svg).toContain('Done');
    expect(svg).toContain('Active');
  });

  it('takes the same source as the old gantt', async () => {
    const res = await handleRequest(
      new Request('https://x-cmd.com/draw/gantt2?m=' + encodeURIComponent(SRC)),
      {}, {},
    );
    expect(res.status).toBe(200);
  });
});
