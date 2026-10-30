import { describe, it, expect } from 'vitest';
import { renderBannerFromUrl } from '../src/render/banner.js';
import { handleRequest } from '../src/handler.js';

const BASE = 'https://draw.test/draw';

describe('renderBannerFromUrl · cli-release-v1 (v2, spec-true)', () => {
  const Q = 'theme=cli-release-v1&title=Validate%20files%7Cagainst%20JSON%20Schema&version=0.10.13&cmd=x%20ajv';

  it('renders paper + slogan title + X-CMD tag + bare terminal', () => {
    const { svg } = renderBannerFromUrl(new URL(`${BASE}/banner?${Q}`));
    expect(svg).toMatch(/^<svg/);
    expect(svg).toContain('Validate files');
    expect(svg).toContain('against JSON Schema');
    expect(svg).toContain('X-CMD - v0.10.13'); // 版本号只出现在左下 tag
    expect(svg).toContain('❯');               // 绿色提示符
    expect(svg).toContain('fill="#4fb9f3"');   // bin 蓝
    expect(svg).toContain('DrawInterBold');    // 真 Bold 字族
    expect(svg).toContain('DrawMono');
    expect(svg).toContain('<pattern id="grain"'); // 点阵颗粒(非滤镜)
    expect(svg).not.toContain('ribbon');          // v1 的黄旗已废
    expect(svg).not.toContain('~ $');             // v1 的提示符已废
    expect(svg).not.toContain('>bash<');          // v1 发明的终端栏已废
  });

  it('splits title with | into two lines, single string stays one line', () => {
    const one = renderBannerFromUrl(new URL(`${BASE}/banner?title=Faster%20everything&version=1&cmd=x`));
    expect(one.svg.match(/DrawInterBold/g)?.length).toBeGreaterThanOrEqual(2); // @font-face + 文本
    expect([...one.svg.matchAll(/font-family="DrawInterBold"[^>]*>([^<]+)</g)]).toHaveLength(1);
    const two = renderBannerFromUrl(new URL(`${BASE}/banner?title=${encodeURIComponent('A very long slogan line that cannot fit on one single line')}&version=1&cmd=x`));
    expect([...two.svg.matchAll(/font-family="DrawInterBold"[^>]*>([^<]+)</g)]).toHaveLength(2);
  });

  it('is deterministic: same input, same svg', () => {
    const u = new URL(`${BASE}/banner?${Q}`);
    expect(renderBannerFromUrl(u).svg).toBe(renderBannerFromUrl(new URL(u.toString())).svg);
  });

  it('400s on missing title/version/cmd, oversize cmd, unknown theme', () => {
    expect(() => renderBannerFromUrl(new URL(`${BASE}/banner?version=1&cmd=x`))).toThrowError(/title/);
    expect(() => renderBannerFromUrl(new URL(`${BASE}/banner?title=T&cmd=x`))).toThrowError(/X-CMD/);
    expect(() => renderBannerFromUrl(new URL(`${BASE}/banner?title=T&version=1`))).toThrowError(/cmd/);
    expect(() => renderBannerFromUrl(new URL(`${BASE}/banner?title=T&version=1&cmd=${'x'.repeat(29)}`))).toThrowError(/28/);
    expect(() => renderBannerFromUrl(new URL(`${BASE}/banner?theme=nope&title=T&version=1&cmd=x`))).toThrowError(/theme/);
  });
});

describe('handleRequest · /draw/banner', () => {
  it('serves svg and png (og cover via format=png, scale=2 retina)', async () => {
    const q = 'theme=cli-release-v1&title=Validate%20files%7Cagainst%20JSON%20Schema&version=0.10.13&cmd=x%20ajv';
    const svg = await handleRequest(new Request(`${BASE}/banner?${q}`), {}, {});
    expect(svg.status).toBe(200);
    expect(svg.headers.get('content-type')).toContain('image/svg+xml');
    const png = await handleRequest(new Request(`${BASE}/banner?${q}&format=png&scale=2`), {}, {});
    expect(png.status).toBe(200);
    expect(png.headers.get('content-type')).toBe('image/png');
    expect((await png.arrayBuffer()).byteLength).toBeGreaterThan(50000);
  }, 30000);
});
