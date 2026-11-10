import { describe, it, expect } from 'vitest';
import { handleRequest } from '../src/handler.js';
import { renderSeqFromUrl } from '../src/render/seq.js';
import { renderUcFromUrl } from '../src/render/uc.js';

// /draw/seq 时序图:参与方一行,消息按 URL 顺序往下走;生命线 + 消息 + 激活条。
// /draw/uc 用例图:参与者(火柴人)+ 用例(椭圆)+ 系统边界;<<include>> 是虚线依赖。
const PARTICIPANTS = [
  'n=app;fe;Your app;;r0c0',
  'n=worker;be;Worker;;r0c1',
  'n=db;db;Database;;r0c2',
];
const MESSAGES = [
  'e=app;worker;GET /draw?type=pie',
  'e=worker;db;SELECT * FROM specs',
  'e=db;worker;row;dash',
  'e=worker;app;200 with metadata;dash',
];

describe('sequence diagram', () => {
  it('renders lifelines, labelled messages and activation bars', () => {
    const url = new URL('https://x-cmd.com/draw/seq?' + [...PARTICIPANTS, ...MESSAGES, 'title=One request'].join('&'));
    const { svg } = renderSeqFromUrl(url);
    expect(svg).toContain('<svg');
    expect(svg).toContain('One request');
    // 参与方
    expect(svg).toContain('Your app');
    expect(svg).toContain('Database');
    // 生命线
    expect(svg.match(/<line /g)?.length).toBe(3);
    // 消息文字
    expect(svg).toContain('GET /draw?type=pie');
    expect(svg).toContain('200 with metadata');
    // 回信是虚线
    expect(svg).toContain('stroke-dasharray');
    // 激活条
    expect(svg).toContain('fill-opacity="0.85"');
  });

  it('puts the messages in the order they appear in the URL', () => {
    const url = new URL('https://x-cmd.com/draw/seq?' + [...PARTICIPANTS, ...MESSAGES].join('&'));
    const { svg } = renderSeqFromUrl(url);
    // 只看画在图上的文字(metadata 里的 JSON 不算)
    const labels = [...svg.matchAll(/<text[^>]*>([^<]*)<\/text>/g)].map((m) => m[1]);
    const iGet = labels.indexOf('GET /draw?type=pie');
    const iSelect = labels.indexOf('SELECT * FROM specs');
    const iRow = labels.indexOf('row');
    const iBack = labels.indexOf('200 with metadata');
    expect(iGet).toBeGreaterThanOrEqual(0);
    expect(iGet).toBeLessThan(iSelect);
    expect(iSelect).toBeLessThan(iRow);
    expect(iRow).toBeLessThan(iBack);
  });

  it('rejects a message that names an unknown participant', () => {
    const url = new URL('https://x-cmd.com/draw/seq?' + [...PARTICIPANTS, 'e=app;nobody;hi'].join('&'));
    expect(() => renderSeqFromUrl(url)).toThrow(/nobody/);
  });

  it('answers 400 with no participants', async () => {
    const res = await handleRequest(new Request('https://x-cmd.com/draw/seq'), {}, {});
    expect(res.status).toBe(400);
    expect(await res.text()).toContain('n=');
  });
});

describe('use case diagram', () => {
  const uc = [
    'n=caller;actor;Your app or CI',
    'n=writer;actor;README or docs',
    'n=uc1;uc;Render a chart;GET /draw?type=...',
    'n=uc2;uc;Store a short link;POST /draw',
    'e=caller;uc1',
    'e=writer;uc2',
    'e=uc1;uc2;<<include>>',
    'b=draw;uc1 uc2',
    'title=What draw is for',
  ];
  it('draws stick figures, ovals and the system boundary', () => {
    const { svg } = renderUcFromUrl(new URL('https://x-cmd.com/draw/uc?' + uc.join('&')));
    expect(svg).toContain('<svg');
    // 火柴人:头是圆,身子是线
    expect(svg).toContain('<circle');
    // 用例是椭圆
    expect(svg).toContain('<ellipse');
    // 系统边界:虚线框 + 标签
    expect(svg).toContain('DRAW');
    expect(svg).toContain('stroke-dasharray');
    // 依赖是虚线
    expect(svg).toContain('&lt;&lt;include&gt;&gt;');
  });

  it('rejects an unknown kind', () => {
    expect(() => renderUcFromUrl(new URL('https://x-cmd.com/draw/uc?n=x;widget;Y'))).toThrow(/actor/);
  });

  it('rejects a boundary that names an unknown id', () => {
    expect(() => renderUcFromUrl(new URL('https://x-cmd.com/draw/uc?n=caller;actor;Y&b=draw;ghost'))).toThrow(/ghost/);
  });

  it('serves the diagram over HTTP', async () => {
    const res = await handleRequest(
      new Request('https://x-cmd.com/draw/uc?' + uc.join('&')),
      {}, {},
    );
    expect(res.status).toBe(200);
    expect(res.headers.get('content-type')).toContain('image/svg+xml');
  });
});
