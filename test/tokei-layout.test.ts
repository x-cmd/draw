import { describe, it, expect } from 'vitest';
import { renderTokeiFromUrl, parseTokeiData } from '../src/render/tokei.js';

const url = (q: string): URL => new URL('https://x-cmd.com/draw/tokei?' + q);
const texts = (svg: string): string[] =>
  [...svg.matchAll(/<text[^>]*>([^<]*)<\/text>/g)].map((m) => m[1]);

// tokei 整份输出里,每个语言带一份 reports(每个文件一条)
const FULL = {
  TypeScript: { code: 4820, comments: 1180, blanks: 940, reports: [{ name: 'a.ts' }, { name: 'b.ts' }] },
  JavaScript: { code: 1687, comments: 298, blanks: 71, reports: [{ name: 'a.js' }] },
};
const TRIMMED = {
  TypeScript: { code: 4820, comments: 1180, blanks: 940 },
  JavaScript: { code: 1687, comments: 298, blanks: 71 },
};

describe('tokei:文件数', () => {
  it('整份输出里数 reports 的条数', () => {
    const { files } = parseTokeiData(JSON.stringify(FULL));
    expect(files).toEqual([2, 1]); // TypeScript 先(总量大)
  });

  it('裁剪过的 JSON 没有文件信息时就是 null(不编一个数出来)', () => {
    expect(parseTokeiData(JSON.stringify(TRIMMED)).files).toBeNull();
  });

  it('langs= 的第四个数是文件数', () => {
    const { files } = parseTokeiData(JSON.stringify({ TypeScript: { code: 1, comments: 2, blanks: 3, files: 45 } }));
    expect(files).toEqual([45]);
  });
});

describe('tokei:layout 四种摆法', () => {
  it('默认:堆叠柱 + 文件数折线(自己的右轴)', () => {
    const { svg } = renderTokeiFromUrl(url('d=' + encodeURIComponent(JSON.stringify(FULL))));
    expect(texts(svg)).toContain('files'); // 图例里有文件数
    expect(texts(svg)).toContain('2');      // 文件数的值
  });

  it('layout=bar:只有柱(输入里没有文件数时不画折线)', () => {
    const { svg } = renderTokeiFromUrl(url('d=' + encodeURIComponent(JSON.stringify(TRIMMED))));
    expect(texts(svg)).not.toContain('files');
  });

  it('layout=butterfly:左代码右注释+空行,文件数叠一条线', () => {
    const { svg } = renderTokeiFromUrl(url('d=' + encodeURIComponent(JSON.stringify(FULL)) + '&layout=butterfly'));
    expect(svg).toContain('<svg');
    expect(texts(svg)).toContain('code');
    expect(texts(svg)).toContain('comments');
    expect(texts(svg)).toContain('files');
  });

  it('layout=files:左文件数右三项行数(两侧各一套标尺)', () => {
    const { svg } = renderTokeiFromUrl(url('d=' + encodeURIComponent(JSON.stringify(FULL)) + '&layout=files'));
    expect(texts(svg)).toContain('files');
    expect(texts(svg)).toContain('blanks');
  });

  it('layout=tb:同一份数据站起来', () => {
    const { svg } = renderTokeiFromUrl(url('d=' + encodeURIComponent(JSON.stringify(FULL)) + '&layout=tb'));
    expect(texts(svg)).toContain('TypeScript');
    expect(texts(svg)).toContain('files');
  });

  it('layout 写错报错', () => {
    expect(() => renderTokeiFromUrl(url('d=' + encodeURIComponent(JSON.stringify(FULL)) + '&layout=xx'))).toThrow(/layout/);
  });
});
