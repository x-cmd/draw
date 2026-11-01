import { describe, it, expect } from 'vitest';
import { renderOnepageFromUrl, renderOnepageFromMarkdown } from '../src/render/onepage.js';
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

describe('renderOnepageFromMarkdown · strip-v3 (mobile long-image, measured from reference)', () => {
  it('renders a 1800-wide strip whose height grows with content', () => {
    const { svg } = renderOnepageFromMarkdown(MD, new URL(`${BASE}/x-cmd/onepage`));
    expect(svg).toMatch(/^<svg/);
    expect(svg).toContain('width="1800"');
    const h = Number(/height="(\d+)"/.exec(svg)?.[1]);
    expect(h).toBeGreaterThan(2500);            // 条状:高度随内容生长
    expect(svg).toContain('测试一页纸');
    expect(svg).not.toContain('一、简介');         // 原图无中文序号
    expect(svg).toContain('页头要点一');
    expect(svg).toContain('项目一');
  });

  it('matches the reference rhythm: body 73px gray, bold heads dark, gutter bars on major sections', () => {
    const { svg } = renderOnepageFromMarkdown(MD, new URL(`${BASE}/x-cmd/onepage`));
    expect(svg).toContain('font-size="73" fill="#808fa5"');        // 正文灰
    expect(svg).toMatch(/rect x="3"[^>]*fill="#3f78f6"/);         // 左缘装饰条(标题+顶级节)
    expect((svg.match(/rect x="3"/g) ?? []).length).toBe(4);      // 标题 + 简介 + 数据 + 联系方式
    expect(svg).toMatch(/font-size="73" fill="#000000"/);         // 节头:同字号,粗且深
    expect(svg).not.toContain('#16161e');                          // 原图页脚是白底,无深色块
    expect(svg).toContain('扫码了解更多');                          // QR 说明
    expect(svg).toContain('text-anchor="middle"');                 // 页脚联系行居中
  });

  it('bold-lead renders as a bold 73px head and inline bold as tspans', () => {
    const { svg } = renderOnepageFromMarkdown(MD, new URL(`${BASE}/x-cmd/onepage`));
    expect(svg).toContain('<tspan font-family');   // 行内粗体
    expect(svg).toContain('>独立粗体小节<');        // 整段粗体 → 次级节头
  });

  it('caps absurd length; missing title 400s; bare paragraphs legal', () => {
    const huge = `---\ntitle: T\n---\n${Array.from({ length: 400 }, (_, i) => `## 节${i}\n内容内容内容内容内容内容内容内容内容内容。`).join('\n\n')}`;
    expect(() => renderOnepageFromMarkdown(huge, new URL(`${BASE}/x-cmd/onepage`))).toThrowError(/tall/);
    expect(() => renderOnepageFromMarkdown('只有正文没有标题', new URL(`${BASE}/x-cmd/onepage`))).toThrowError(/title/);
    const ok = renderOnepageFromMarkdown('---\ntitle: T\n---\n无节正文,标题加散段即合法条状页。', new URL(`${BASE}/x-cmd/onepage`));
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
});
