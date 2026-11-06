import { describe, it, expect } from 'vitest';
import { renderOnepageFromUrl, renderOnepageFromMarkdown, toRawGithub } from '../src/render/onepage.js';
import { handleRequest } from '../src/handler.js';

const BASE = 'https://draw.test/draw';
const MD = [
  '---',
  'title: 测试一页纸',
  'subtitle: 副标题行',
  'contact: 李均豪 X-CMD',
  'location: 广东 中山',
  'website: https://x-cmd.com',
  'qr: https://x-cmd.com',
  '---',
  '- 页头要点一',
  '- 页头要点二',
  '',
  '## 简介',
  '第一段正文,**加粗**在行内。',
  '',
  '**独立粗体小节**',
  '',
  '小节正文。',
  '',
  '## 数据',
  '- 项目一',
  '- 项目二',
].join('\n');

describe('renderOnepageFromMarkdown · md-engine-v2(行盒模型,常量由 STYLE 表推导)', () => {
  it('renders a 1800-wide strip whose height grows with content', async () => {
    const { svg } = await renderOnepageFromMarkdown(MD, new URL(`${BASE}/x-cmd/onepage`));
    expect(svg).toMatch(/^<svg/);
    expect(svg).toContain('width="1800"');
    const h = Number(/height="(\d+)"/.exec(svg)?.[1]);
    expect(h).toBeGreaterThan(2500);            // 条状:高度随内容生长
    expect(svg).toContain('测试一页纸');
    expect(svg).toContain('页头要点一');
    expect(svg).toContain('项目一');
  });

  it('markdown 语义:节头/正文/列表/页头要点各按 STYLE 呈现,无中文序号', async () => {
    const { svg } = await renderOnepageFromMarkdown(MD, new URL(`${BASE}/x-cmd/onepage`));
    expect(svg).toContain('fill="#808fa5"');                         // 正文蓝灰
    expect(svg).toMatch(/rect x="0"[^>]*fill="#3f78f6"/);           // 顶级节左缘装饰条(出血)
    expect(svg).toContain('font-weight="700" fill="#000000"');      // 节头黑粗
    expect(svg).not.toContain('一、简介');                            // 不臆造序号
    expect(svg).not.toContain('#16161e');                            // 页脚白底
    expect(svg).toContain('扫码了解更多');                            // QR 说明
    expect(svg).toContain('text-anchor="middle"');                   // 页脚联系行居中
    expect(svg).toContain('md-engine-v2');                            // 引擎标记(metadata 内已转义)
  });

  it('避头尾:全文无行首标点、无行尾开引号/开括号', async () => {
    const { svg } = await renderOnepageFromMarkdown(MD, new URL(`${BASE}/x-cmd/onepage`));
    const lines = [...svg.matchAll(/<text[^>]*>(?:<tspan[^>]*>)?([^<]+)/g)].map((m) => m[1]);
    const badStart = lines.filter((l) => /^[。，、；：？！,.:;?)）\]】」』…%]/.test(l));
    const badEnd = lines.filter((l) => /[（(\[【「『$#]$/.test(l));
    expect(badStart).toEqual([]);
    expect(badEnd).toEqual([]);
  });

  it('markdown 块语义:图表居中、引用块、hr、表格兜底、行内 code 等宽', async () => {
    const md = [
      '---', 'title: 块语义', '---', '',
      '![架构图](https://example.com/a.png =600x400)', '',
      '> 引用块一行', '',
      '---', '',
      '行内 `code` 与 **粗体**。', '',
      '| a | b |', '|---|---|', '| 1 | 2 |',
    ].join('\n');
    const { svg } = await renderOnepageFromMarkdown(md, new URL(`${BASE}/x-cmd/onepage`));
    const img = /<rect x="(\d+)"[^>]*rx="8"[^>]*fill="#f5f7fa"/.exec(svg) ?? /<image[^>]*x="(\d+)"/.exec(svg);
    expect(img).toBeTruthy();                                        // 图块(占位或实图)
    if (img !== null) expect(Number(img[1])).toBeGreaterThan(216);   // 居中:起点 > 左边距
    expect(svg).toContain('引用块一行');
    expect(svg).toMatch(/<rect [^>]*height="2" fill="#e5e7eb"/);     // hr
    expect(svg).toContain('1  ·  2');                                  // 表格行呈现(表头走粗体 tspan)
    expect(svg).toMatch(/<tspan font-family="'DrawMono'/);            // 行内 code 等宽
  });

  it('caps absurd length; missing title 400s; bare paragraphs legal', async () => {
    const huge = `---\ntitle: T\n---\n${Array.from({ length: 500 }, (_, i) => `## 节${i}\n内容内容内容内容内容内容内容内容内容内容。`).join('\n\n')}`;
    await expect(renderOnepageFromMarkdown(huge, new URL(`${BASE}/x-cmd/onepage`))).rejects.toThrowError(/tall/);
    await expect(renderOnepageFromMarkdown('只有正文没有标题', new URL(`${BASE}/x-cmd/onepage`))).rejects.toThrowError(/title/);
    const ok = await renderOnepageFromMarkdown('---\ntitle: T\n---\n无节正文,标题加散段即合法条状页。', new URL(`${BASE}/x-cmd/onepage`));
    expect(ok.svg).toContain('无节正文');
  });
});

describe('handleRequest · /draw/x-cmd/onepage', () => {
  it('GET ?d= svg + POST body svg + format=png', async () => {
    const d = encodeURIComponent(MD);
    const svg = await handleRequest(new Request(`${BASE}/x-cmd/onepage?d=${d}`), {}, {});
    expect(svg.status).toBe(200);
    expect(svg.headers.get('content-type')).toContain('image/svg+xml');
    const post = await handleRequest(new Request(`${BASE}/x-cmd/onepage`, { method: 'POST', body: MD }), {}, {});
    expect(post.status).toBe(200);
    expect(await post.text()).toContain('测试一页纸');
    const png = await handleRequest(new Request(`${BASE}/x-cmd/onepage?d=${d}&format=png`), {}, {});
    expect(png.status).toBe(200);
    expect(png.headers.get('content-type')).toBe('image/png');
    const buf = Buffer.from(await png.arrayBuffer());
    expect(buf.slice(1, 4).toString()).toBe('PNG');
    expect(buf.byteLength).toBeGreaterThan(40000);
  }, 60000);

  it('browser navigation (Sec-Fetch-Dest: document) gets a width-adaptive HTML shell; curl/img get raw SVG', async () => {
    const d = encodeURIComponent(MD);
    const doc = await handleRequest(new Request(`${BASE}/x-cmd/onepage?d=${d}`, { headers: { 'sec-fetch-dest': 'document' } }), {}, {});
    expect(doc.status).toBe(200);
    expect(doc.headers.get('content-type')).toContain('text/html');
    const html = await doc.text();
    expect(html).toContain('width=device-width');            // 手机视口
    expect(html).toContain('width:min(100%,420px)');           // 阅读宽度:正文≈17px
    expect(html).toMatch(/<svg[^>]*viewBox="0 0 1800 /);    // 内联 SVG 保留 viewBox
    expect(html).not.toMatch(/<svg[^>]*width="1800"/);       // 根上不再钉死 1800(交 CSS 100%)
    const raw = await handleRequest(new Request(`${BASE}/x-cmd/onepage?d=${d}`), {}, {});
    expect(raw.headers.get('content-type')).toContain('image/svg+xml'); // curl/<img>/fetch 原样
    expect(await raw.text()).toMatch(/^<svg[^>]*width="1800"/);
  });

  it('400s on missing d and oversized d (GET)', async () => {
    const bare = await handleRequest(new Request(`${BASE}/x-cmd/onepage`), {}, {});
    expect(bare.status).toBe(400);
    const big = await handleRequest(new Request(`${BASE}/x-cmd/onepage?d=${encodeURIComponent('一'.repeat(16001))}`), {}, {});
    expect(big.status).toBe(400);
    expect(await big.text()).toContain('POST');
  });

  it('toRawGithub: blob/raw 页面链接转 raw 直链,其余原样(ppt 逻辑①)', () => {
    expect(toRawGithub('https://github.com/x-cmd/draw/blob/main/onepage.SKILL.md'))
      .toBe('https://raw.githubusercontent.com/x-cmd/draw/main/onepage.SKILL.md');
    expect(toRawGithub('https://github.com/x-cmd/draw/raw/main/onepage.SKILL.md'))
      .toBe('https://raw.githubusercontent.com/x-cmd/draw/main/onepage.SKILL.md');
    expect(toRawGithub('https://raw.githubusercontent.com/x-cmd/draw/main/onepage.SKILL.md'))
      .toBe('https://raw.githubusercontent.com/x-cmd/draw/main/onepage.SKILL.md');
    expect(toRawGithub('https://example.com/doc.md')).toBe('https://example.com/doc.md');
    expect(() => toRawGithub('ftp://x.md')).toThrowError(/http/);
  });

  it('/draw/nocors: 400 on missing url / private host / non-GET', async () => {
    const bare = await handleRequest(new Request(`${BASE}/nocors`), {}, {});
    expect(bare.status).toBe(400);
    const priv = await handleRequest(new Request(`${BASE}/nocors?url=${encodeURIComponent('http://127.0.0.1/x.md')}`), {}, {});
    expect(priv.status).toBe(400);
    const post = await handleRequest(new Request(`${BASE}/nocors?url=${encodeURIComponent('https://example.com/a.md')}`, { method: 'POST' }), {}, {});
    expect(post.status).toBe(405);
  });
});

describe('handleRequest · /draw/x-cmd/onesvg (satori engine, #30)', () => {
  it('renders the same markdown contract: GET ?d= / POST / ?src= marker', async () => {
    const d = encodeURIComponent('---\ntitle: onesvg 测试\n---\n## 简介\n正文一段,**加粗**行内。\n\n- 要点一\n');
    const r = await handleRequest(new Request(`${BASE}/x-cmd/onesvg?d=${d}`), {}, {});
    expect(r.status).toBe(200);
    expect(r.headers.get('content-type')).toContain('image/svg+xml');
    const svg = await r.text();
    expect(svg).toMatch(/^<svg/);
    expect(svg).toContain('aria-label="onesvg 测试"');   // satori 输出字形 path,内容靠 aria 验
    const post = await handleRequest(new Request(`${BASE}/x-cmd/onesvg`, { method: 'POST', body: '---\ntitle: T\n---\n正文。' }), {}, {});
    expect(post.status).toBe(200);
    const bare = await handleRequest(new Request(`${BASE}/x-cmd/onesvg`), {}, {});
    expect(bare.status).toBe(400);
  }, 30000);
});
