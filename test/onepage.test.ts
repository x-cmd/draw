import { describe, it, expect } from 'vitest';
import { renderOnepageFromUrl, renderOnepageFromMarkdown } from '../src/render/onepage.js';
import { handleRequest } from '../src/handler.js';

const BASE = 'https://draw.test/draw';
const MD = [
  '---',
  'title: 测试一页纸',
  'subtitle: 副标题行',
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

describe('renderOnepageFromMarkdown · strip-v1 (mobile long-image)', () => {
  it('renders a 1800-wide strip whose height grows with content', () => {
    const { svg } = renderOnepageFromMarkdown(MD, new URL(`${BASE}/x-cmd/onepage`));
    expect(svg).toMatch(/^<svg/);
    expect(svg).toContain('width="1800"');
    const h = Number(/height="(\d+)"/.exec(svg)?.[1]);
    expect(h).toBeGreaterThan(2500);            // 条状:高度随内容生长
    expect(svg).toContain('测试一页纸');
    expect(svg).toContain('一、简介');            // 中文序号节头
    expect(svg).toContain('二、数据');
    expect(svg).toContain('页头要点一');
    expect(svg).toContain('项目一');
    expect(svg).toContain('fill="#16161e"');      // 全宽深色页脚块
    expect(svg).toMatch(/<rect[^>]*fill="#16161e"/);
    expect(svg).toContain('扫码了解更多');         // QR 卡说明
    expect(svg).not.toContain('stroke="#d8d8d8"'); // 无分隔线(原图风格:留白分隔)
  });

  it('bold-lead renders as an inline-tspan bold run or a standalone 44px lead', () => {
    const { svg } = renderOnepageFromMarkdown(MD, new URL(`${BASE}/x-cmd/onepage`));
    expect(svg).toContain('font-size="44"');       // 独立粗体小节
    expect(svg).toContain('<tspan font-family');   // 行内粗体
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

  it('400s on missing d and oversized d (GET)', async () => {
    const bare = await handleRequest(new Request(`${BASE}/x-cmd/onepage`), {}, {});
    expect(bare.status).toBe(400);
    const big = await handleRequest(new Request(`${BASE}/x-cmd/onepage?d=${encodeURIComponent('一'.repeat(16001))}`), {}, {});
    expect(big.status).toBe(400);
    expect(await big.text()).toContain('POST');
  });
});
