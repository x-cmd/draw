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
  '## 简介',
  '第一段正文,**加粗**在行内。',
  '',
  '**亮点小标题**',
  '亮点正文段落。',
  '',
  '## 清单',
  '- 项目一',
  '- 项目二',
].join('\n');

describe('renderOnepageFromMarkdown · miracle-v1', () => {
  it('renders an A4 page with header, sections, footer and QR', () => {
    const { svg, version } = renderOnepageFromMarkdown(MD, new URL(`${BASE}/x-cmd/onepage`));
    expect(svg).toMatch(/^<svg/);
    expect(svg).toContain('width="1240"');
    expect(svg).toContain('height="1754"');
    expect(svg).toContain('测试一页纸');
    expect(svg).toContain('副标题行');
    expect(svg).toContain('简介');
    expect(svg).toContain('· 项目一');
    expect(svg).toContain('https://x-cmd.com');
    expect(svg).toMatch(/<rect[^>]*fill="#1a1a1a"/); // QR 黑块
    expect(svg).toContain('&quot;template&quot;:&quot;onepage&quot;');
    expect(version).toBe(1);
  });

  it('auto-shrinks long content; hard overflow 400 names the sections', () => {
    const long = `---\ntitle: 长文\n---\n${Array.from({ length: 30 }, (_, i) => `## 节${i}\n${Array.from({ length: 12 }, (_, j) => `第${j}段,内容足够长以触发缩放与溢出判定。`).join('\n\n')}`).join('\n\n')}`;
    expect(() => renderOnepageFromMarkdown(long, new URL(`${BASE}/x-cmd/onepage`))).toThrowError(/overflow.*节0/);
  });

  it('400s without a title; title + bare paragraphs is a legal page', () => {
    expect(() => renderOnepageFromMarkdown('只有正文没有标题', new URL(`${BASE}/x-cmd/onepage`))).toThrowError(/title/);
    const { svg } = renderOnepageFromMarkdown('---\ntitle: T\n---\n无节正文,标题加散段即合法一页纸。', new URL(`${BASE}/x-cmd/onepage`));
    expect(svg).toContain('无节正文');
  });

  it('falls back to # heading when yfm title absent', () => {
    const { svg } = renderOnepageFromMarkdown('# 兜底标题\n## 节\n正文', new URL(`${BASE}/x-cmd/onepage`));
    expect(svg).toContain('兜底标题');
  });
});

describe('handleRequest · /draw/x-cmd/onepage', () => {
  it('GET ?d= serves svg; POST body serves svg; format=png rasterizes with CJK', async () => {
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
    expect(buf.byteLength).toBeGreaterThan(60000); // CJK 字形在画(对照空版显著更大)
  }, 60000);

  it('400s on missing d and oversized d (GET)', async () => {
    const bare = await handleRequest(new Request(`${BASE}/x-cmd/onepage`), {}, {});
    expect(bare.status).toBe(400);
    const big = await handleRequest(new Request(`${BASE}/x-cmd/onepage?d=${encodeURIComponent('一'.repeat(16001))}`), {}, {});
    expect(big.status).toBe(400);
    expect(await big.text()).toContain('POST');
  });
});
