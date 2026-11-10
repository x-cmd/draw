import { describe, it, expect } from 'vitest';
import { renderTokeiFromUrl } from '../src/render/tokei.js';

// /draw/tokei 两种输入形态:json(d=)和 property(langs=),同一份数据出同一张图。
const DATA = {
  TypeScript: { code: 4820, comments: 1180, blanks: 940 },
  JavaScript: { code: 1687, comments: 298, blanks: 71 },
  Shell: { code: 640, comments: 120, blanks: 88 },
};
const Q = 'title=Code%20composition&w=760&h=440';

describe('tokei input forms', () => {
  it('takes the property form (langs=Lang:code:comments:blanks)', () => {
    const { svg } = renderTokeiFromUrl(new URL(
      'https://x-cmd.com/draw/tokei?langs=TypeScript:4820:1180:940,JavaScript:1687:298:71,Shell:640:120:88&' + Q));
    expect(svg).toContain('TypeScript');
    expect(svg).toContain('<svg');
  });

  it('gives the same picture as the json form', () => {
    const a = renderTokeiFromUrl(new URL(
      'https://x-cmd.com/draw/tokei?langs=TypeScript:4820:1180:940,JavaScript:1687:298:71,Shell:640:120:88&' + Q)).svg;
    const b = renderTokeiFromUrl(new URL(
      'https://x-cmd.com/draw/tokei?d=' + encodeURIComponent(JSON.stringify(DATA)) + '&' + Q)).svg;
    expect(a).toBe(b);
  });

  it('lets the comments and blanks be left out', () => {
    const { svg } = renderTokeiFromUrl(new URL('https://x-cmd.com/draw/tokei?langs=Go:1200'));
    expect(svg).toContain('Go');
  });

  it('rejects a broken property form', () => {
    expect(() => renderTokeiFromUrl(new URL('https://x-cmd.com/draw/tokei?langs=TypeScript'))).toThrow(/langs/);
    expect(() => renderTokeiFromUrl(new URL('https://x-cmd.com/draw/tokei?langs=TypeScript:abc'))).toThrow(/langs/);
  });
});
