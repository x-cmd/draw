import { describe, it, expect } from 'vitest';
import { renderReleaseBannerFromUrl } from '../src/render/banner.js';
import { handleRequest } from '../src/handler.js';

const BASE = 'https://draw.test/draw';

describe('renderReleaseBannerFromUrl · x-cmd/release-banner', () => {
  const Q = 'title=Validate%20files%7Cagainst%20JSON%20Schema&version=0.10.13&cmd=x%20ajv';

  it('renders paper + slogan title + X-CMD tag + bare terminal', () => {
    const { svg } = renderReleaseBannerFromUrl(new URL(`${BASE}/x-cmd/release-banner?${Q}`));
    expect(svg).toMatch(/^<svg/);
    expect(svg).toContain('Validate files');
    expect(svg).toContain('against JSON Schema');
    expect(svg).toContain('X-CMD - v0.10.13');
    expect(svg).toContain('❯');
    expect(svg).toContain('DrawInterBold');
    expect(svg).toContain('id="halo"');
    expect(svg).toContain('&quot;template&quot;:&quot;release-banner&quot;');
    expect(svg).not.toContain('~ $');
  });

  it('paper=apple swaps the tint to #f5f5f7 and grain to neutral gray', () => {
    const yellow = renderReleaseBannerFromUrl(new URL(`${BASE}/x-cmd/release-banner?${Q}`));
    const apple = renderReleaseBannerFromUrl(new URL(`${BASE}/x-cmd/release-banner?${Q}&paper=apple`));
    expect(yellow.svg).toContain('#f0edd8');            // 锁定黄底色出现
    expect(apple.svg).toContain('#f5f5f7');             // 苹果白底色
    expect(apple.svg).toContain('#7a7a7a');             // 中性灰颗粒
    expect(yellow.svg).not.toEqual(apple.svg);
  });

  it('accepts all 9 paper names, rejects unknown', () => {
    for (const p of ['yellow', 'orange', 'pink', 'purple', 'green', 'cyan', 'blue', 'gray', 'apple']) {
      expect(renderReleaseBannerFromUrl(new URL(`${BASE}/x-cmd/release-banner?${Q}&paper=${p}`)).svg).toMatch(/^<svg/);
    }
    expect(() => renderReleaseBannerFromUrl(new URL(`${BASE}/x-cmd/release-banner?${Q}&paper=hotpink`))).toThrowError(/paper/);
  });

  it('is deterministic; title | splits two lines; single string wraps if long', () => {
    const u = new URL(`${BASE}/x-cmd/release-banner?${Q}`);
    expect(renderReleaseBannerFromUrl(u).svg).toBe(renderReleaseBannerFromUrl(new URL(u.toString())).svg);
    const one = renderReleaseBannerFromUrl(new URL(`${BASE}/x-cmd/release-banner?title=Faster%20everything&version=1&cmd=x`));
    expect([...one.svg.matchAll(/font-family="DrawInterBold"[^>]*>([^<]+)</g)]).toHaveLength(1);
    const two = renderReleaseBannerFromUrl(new URL(`${BASE}/x-cmd/release-banner?title=${encodeURIComponent('A very long slogan line that cannot fit on one single line')}&version=1&cmd=x`));
    expect([...two.svg.matchAll(/font-family="DrawInterBold"[^>]*>([^<]+)</g)]).toHaveLength(2);
  });

  it('400s on missing title/version/cmd', () => {
    expect(() => renderReleaseBannerFromUrl(new URL(`${BASE}/x-cmd/release-banner?version=1&cmd=x`))).toThrowError(/title/);
    expect(() => renderReleaseBannerFromUrl(new URL(`${BASE}/x-cmd/release-banner?title=T&cmd=x`))).toThrowError(/version/);
    expect(() => renderReleaseBannerFromUrl(new URL(`${BASE}/x-cmd/release-banner?title=T&version=1`))).toThrowError(/cmd/);
  });
});

describe('handleRequest · /draw/x-cmd/release-banner', () => {
  const q = 'title=Validate%20files%7Cagainst%20JSON%20Schema&version=0.10.13&cmd=x%20ajv';

  it('serves the namespaced route and the /banner legacy alias, svg + png', async () => {
    for (const path of ['/x-cmd/release-banner', '/banner']) {
      const svg = await handleRequest(new Request(`${BASE}${path}?${q}`), {}, {});
      expect(svg.status).toBe(200);
      expect(svg.headers.get('content-type')).toContain('image/svg+xml');
      const png = await handleRequest(new Request(`${BASE}${path}?${q}&paper=apple&format=png&scale=2`), {}, {});
      expect(png.status).toBe(200);
      expect(png.headers.get('content-type')).toBe('image/png');
    }
  }, 30000);
});
