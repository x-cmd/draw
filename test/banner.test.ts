import { describe, it, expect } from 'vitest';
import { renderBannerFromUrl } from '../src/render/banner.js';
import { handleRequest } from '../src/handler.js';

const BASE = 'https://draw.test/draw';

describe('renderBannerFromUrl · cli-release-v1', () => {
  it('renders paper + title + terminal + ribbon', () => {
    const { svg, version } = renderBannerFromUrl(new URL(`${BASE}/banner?theme=cli-release-v1&title=Release%20v0.10.13&tagline=bug%20fixes%20and%20stability&cmd=x%20upgrade`));
    expect(svg).toMatch(/^<svg/);
    expect(svg).toContain('Release v0.10.13');
    expect(svg).toContain('~ $');
    expect(svg).toContain('x-cmd');
    expect(svg).toContain('<pattern id="grain"');
    expect(svg).toContain('fill-opacity="0.1"'); // 双层廉价投影(feDropShadow 会撞免费档 CPU 限)
    expect(svg).toContain('&quot;template&quot;:&quot;banner&quot;'); // metaTag 统一转义,与核心层一致
    expect(version).toBe(1);
  });

  it('wraps a long title into two balanced lines', () => {
    const { svg } = renderBannerFromUrl(new URL(`${BASE}/banner?title=${encodeURIComponent('Release v0.11.0 with new chart engine')}&cmd=x upgrade`));
    const titles = [...svg.matchAll(/font-size="72"[^>]*>([^<]+)</g)].map((m) => m[1]);
    expect(titles.length).toBe(2);
    expect(titles.join(' ')).toContain('engine');
  });

  it('is deterministic: same input, same svg', () => {
    const u = new URL(`${BASE}/banner?title=Release%20v0.10.13&cmd=x%20upgrade`);
    expect(renderBannerFromUrl(u).svg).toBe(renderBannerFromUrl(new URL(u.toString())).svg);
  });

  it('400s on missing title / cmd, oversize cmd, unknown theme', () => {
    expect(() => renderBannerFromUrl(new URL(`${BASE}/banner?cmd=x upgrade`))).toThrowError(/title/);
    expect(() => renderBannerFromUrl(new URL(`${BASE}/banner?title=Release v1`))).toThrowError(/cmd/);
    expect(() => renderBannerFromUrl(new URL(`${BASE}/banner?title=Release v1&cmd=${'x'.repeat(31)}`))).toThrowError(/30/);
    expect(() => renderBannerFromUrl(new URL(`${BASE}/banner?theme=nope&title=R&cmd=x`))).toThrowError(/theme/);
  });
});

describe('handleRequest · /draw/banner', () => {
  it('serves svg and png (og cover via format=png)', async () => {
    const q = 'theme=cli-release-v1&title=Release%20v0.10.13&tagline=bug%20fixes&cmd=x%20upgrade';
    const svg = await handleRequest(new Request(`${BASE}/banner?${q}`), {}, {});
    expect(svg.status).toBe(200);
    expect(svg.headers.get('content-type')).toContain('image/svg+xml');
    const png = await handleRequest(new Request(`${BASE}/banner?${q}&format=png&scale=2`), {}, {});
    expect(png.status).toBe(200);
    expect(png.headers.get('content-type')).toBe('image/png');
    expect((await png.arrayBuffer()).byteLength).toBeGreaterThan(50000);
  }, 30000);
});
