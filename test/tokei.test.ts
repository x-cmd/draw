import { describe, it, expect } from 'vitest';
import { handleRequest } from '../src/handler.js';
import { parseTokei } from '../src/render/tokei.js';
import { ApiError } from '../src/specs/index.js';

// /draw/tokei:tokei --output json → 「代码 / 注释 / 空行」三段堆叠柱。
// 输入既接受 tokei 的完整输出(含每个文件的 reports),也接受裁剪过的子集。
const TOKEI = {
  TypeScript: { code: 1200, comments: 300, blanks: 150 },
  JavaScript: { code: 400, comments: 80, blanks: 40 },
  Shell: { code: 120, comments: 30, blanks: 25 },
};

const req = (url: string, init?: RequestInit): Request =>
  new Request('https://x-cmd.com' + url, init);

describe('tokei parsing', () => {
  it('splits each language into code, comments and blanks', () => {
    const spec = parseTokei(JSON.stringify(TOKEI));
    expect(spec.labels).toEqual(['TypeScript', 'JavaScript', 'Shell']);
    expect(spec.series).toEqual([
      { name: 'code', values: [1200, 400, 120] },
      { name: 'comments', values: [300, 80, 30] },
      { name: 'blanks', values: [150, 40, 25] },
    ]);
  });

  it('sorts languages by total, largest first', () => {
    const spec = parseTokei(JSON.stringify({ Shell: { code: 1 }, TypeScript: { code: 99 } }));
    expect(spec.labels).toEqual(['TypeScript', 'Shell']);
  });

  it('skips the Total row tokei adds', () => {
    const spec = parseTokei(JSON.stringify({ ...TOKEI, Total: { code: 1720, comments: 410, blanks: 215 } }));
    expect(spec.labels).toHaveLength(3);
    expect(spec.labels).not.toContain('Total');
  });

  it('reads the full tokei output, ignoring the per-file detail', () => {
    const full = {
      TypeScript: {
        code: 1200, comments: 300, blanks: 150,
        reports: [{ stats: { code: 100, comments: 20, blanks: 10, blobs: {} }, name: 'src/a.ts' }],
        children: {},
      },
    };
    const spec = parseTokei(JSON.stringify(full));
    expect(spec.labels).toEqual(['TypeScript']);
    expect(spec.series[0].values).toEqual([1200]);
  });

  it('drops languages with nothing in them', () => {
    const spec = parseTokei(JSON.stringify({ Markdown: { code: 0, comments: 0, blanks: 0 }, Go: { code: 10 } }));
    expect(spec.labels).toEqual(['Go']);
  });

  it('rejects input that is not tokei-shaped', () => {
    expect(() => parseTokei('not json')).toThrow(ApiError);
    expect(() => parseTokei('[]')).toThrow(ApiError);
    expect(() => parseTokei('{}')).toThrow(ApiError);
    expect(() => parseTokei('')).toThrow(ApiError);
  });
});

describe('/draw/tokei endpoint', () => {
  it('renders a stacked bar from the d= parameter', async () => {
    const d = encodeURIComponent(JSON.stringify(TOKEI));
    const res = await handleRequest(req(`/draw/tokei?d=${d}&title=Code%20stats`), {}, {});
    expect(res.status).toBe(200);
    const svg = await res.text();
    expect(svg).toContain('<svg');
    expect(svg).toContain('TypeScript');
    expect(svg).toContain('Code stats');
  });

  it('accepts the tokei json as a POST body', async () => {
    const res = await handleRequest(
      req('/draw/tokei', { method: 'POST', body: JSON.stringify(TOKEI) }),
      {}, {},
    );
    expect(res.status).toBe(200);
    expect(await res.text()).toContain('<svg');
  });

  it('answers 400 with a usable message when the data is missing', async () => {
    const res = await handleRequest(req('/draw/tokei'), {}, {});
    expect(res.status).toBe(400);
    expect(await res.text()).toContain('d=');
  });

  it('answers 405 for a method it does not take', async () => {
    const res = await handleRequest(req('/draw/tokei', { method: 'DELETE' }), {}, {});
    expect(res.status).toBe(405);
  });
});
