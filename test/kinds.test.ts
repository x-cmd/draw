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

  it('renders a multi-line node (field list) as a field table', () => {
    const { svg } = renderKindFromUrl('erd', new URL('https://x-cmd.com/draw/erd?' + ERD.join('&')));
    // 画在图上的文字(不是 metadata 里的原文)
    const texts = [...svg.matchAll(/<text[^>]*>([^<]*)<\/text>/g)].map((m) => m[1]);
    expect(texts).toContain('id');        // 名字列
    expect(texts).toContain('int');       // 类型列(靠右)
    expect(texts).toContain('user_id');
    expect(texts).toContain('PK');        // 键标记
    expect(texts).toContain('FK');
    // 字段表是「两列」而不是一整行
    expect(texts).not.toContain('id:int (pk)');
  });

  it('splits a method signature at the colon outside the parentheses', () => {
    const q = 'n=user;class;User;%2B charge(amount: Money): Result%0A%2B id:int;r0c0';
    const { svg } = renderKindFromUrl('class', new URL('https://x-cmd.com/draw/class?' + q));
    const texts = [...svg.matchAll(/<text[^>]*>([^<]*)<\/text>/g)].map((m) => m[1]);
    expect(texts).toContain('charge(amount: Money)');  // 名字
    expect(texts).toContain('Result');                  // 类型
    expect(texts).not.toContain('charge(amount: Money): Result');
  });

  it('marks UML visibility when the member line starts with + - #', () => {
    const q = 'n=user;class;User;%2B id:int%0A- secret(): void;r0c0';
    const { svg } = renderKindFromUrl('class', new URL('https://x-cmd.com/draw/class?' + q));
    const texts = [...svg.matchAll(/<text[^>]*>([^<]*)<\/text>/g)].map((m) => m[1]);
    expect(texts).toContain('+');
    expect(texts).toContain('-');
  });

  it('ERD 字段行离标题条留出一口气(不贴着标题条下沿)', () => {
    const q = 'n=a;table;A;owner:string (pk)%0Aname:text;r0c0';
    const { svg } = renderKindFromUrl('erd', new URL('https://x-cmd.com/draw/erd?' + q));
    const node = /<rect x="([\d.]+)" y="([\d.]+)" width="([\d.]+)" height="([\d.]+)" rx="12"/.exec(svg)!;
    const field = /<text x="[\d.]+" y="([\d.]+)"[^>]*>owner</.exec(svg)!;
    expect(node).toBeTruthy();
    expect(field).toBeTruthy();
    // 标题条 30px 高,第一行字段的基线至少再往下 10px(贴着看不清)
    expect(Number(field[1]) - Number(node[2])).toBeGreaterThanOrEqual(40);
  });

  it('draws the crow\'s foot notation when the edge says 1:N', () => {
    const q = 'n=a;table;A;id:int (pk);r0c0&n=b;table;B;id:int (pk);r0c1&e=a;b;1:N';
    const { svg } = renderKindFromUrl('erd', new URL('https://x-cmd.com/draw/erd?' + q));
    // 「一」是一根横杠,「多」是三根爪 —— 三爪 + 一杠 = 四段
    const feet = [...svg.matchAll(/<path d="M[\d.]+ [\d.]+L[\d.]+ [\d.]+" fill="none" stroke="var\(--d-muted\)"/g)];
    expect(feet.length).toBe(4);
    // 基数标签还在
    expect(svg).toContain('1:N');
  });

  it('leaves the plain arrow alone when the label is not a cardinality', () => {
    const q = 'n=a;table;A;id:int;r0c0&n=b;table;B;id:int;r0c1&e=a;b;references';
    const { svg } = renderKindFromUrl('erd', new URL('https://x-cmd.com/draw/erd?' + q));
    expect(svg).toContain('marker-end');
  });

  it('class: extends 用实线空心三角,implements 用虚线空心三角', () => {
    const q = 'n=a;class;A;;r0c0&n=b;class;B;;r1c0&n=c;iface;I;;r0c1&e=a;b;extends&e=a;c;implements';
    const { svg } = renderKindFromUrl('class', new URL('https://x-cmd.com/draw/class?' + q));
    // 空心三角的记号
    expect(svg).toContain('url(#am-h)');
    // implements 那条是虚线
    expect(svg).toContain('stroke-dasharray="5 4"');
  });

  it('erd: 标签写成「1:N placed by」时,基数画鱼尾,标签只留动词', () => {
    const q = 'n=a;table;A;id:int (pk);r0c0&n=b;table;B;id:int (pk);r0c1&e=a;b;1:N placed by';
    const { svg } = renderKindFromUrl('erd', new URL('https://x-cmd.com/draw/erd?' + q));
    const texts = [...svg.matchAll(/<text[^>]*>([^<]*)<\/text>/g)].map((m) => m[1]);
    expect(texts).toContain('placed by');
    expect(texts).not.toContain('1:N placed by');
    // 鱼尾(三根爪 + 一根杠)
    const feet = [...svg.matchAll(/<path d="M[\d.]+ [\d.]+L[\d.]+ [\d.]+" fill="none" stroke="var\(--d-muted\)"/g)];
    expect(feet.length).toBe(4);
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
