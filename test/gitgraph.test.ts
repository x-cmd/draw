import { describe, it, expect } from 'vitest';
import { translateGitGraph } from '../src/render/mermaid/gitgraph.js';
import { renderGitGraphFromUrl, parseGitGraphSpec, gitGraphSpecFromParams } from '../src/render/gitgraph.js';
import { ApiError } from '../src/specs/index.js';

// /draw/gitgraph:分支是泳道,提交是泳道上的点,时间往下走。
// 参数:branch=(泳道,按序) / commit=id|lane|label|p1|p2 / title=。

const SRC = [
  'gitGraph',
  '   commit id:"one"',
  '   commit id:"two"',
  '   branch develop',
  '   checkout develop',
  '   commit id:"three"',
  '   checkout main',
  '   merge develop',
  '   tag v1.0',
].join('\n');

describe('mermaid gitGraph → draw gitgraph', () => {
  it('翻出 gitgraph 图种与分支(泳道)', () => {
    const plan = translateGitGraph(SRC);
    expect(plan.kind).toBe('gitgraph');
    expect(plan.params.filter(([k]) => k === 'branch')).toEqual([
      ['branch', 'main'],
      ['branch', 'develop'],
    ]);
  });

  it('commit 落在当前分支上,父是上一个提交', () => {
    const plan = translateGitGraph(SRC);
    const commits = plan.params.filter(([k]) => k === 'commit');
    expect(commits[0]).toEqual(['commit', 'one|main|||']);
    expect(commits[1]).toEqual(['commit', 'two|main||one|']);
    expect(commits[2]).toEqual(['commit', 'three|develop||two|']);
  });

  it('merge 把被并分支的提交写进第二父', () => {
    const plan = translateGitGraph(SRC);
    const commits = plan.params.filter(([k]) => k === 'commit');
    // 合并提交落在 main 上,第一父=two(当前分支的头),第二父=three(develop 的头)
    // 末尾的 tag v1.0 挂在合并提交上,所以标题里带了 [v1.0]
    expect(commits[3]).toEqual(['commit', 'm1|main|[v1.0]|two|three']);
  });

  it('branch 从当前 HEAD 分叉:新分支的第一个提交以分叉点为父', () => {
    const plan = translateGitGraph([
      'gitGraph',
      '  commit id:"one"',
      '  commit id:"two"',
      '  branch develop',
      '  checkout develop',
      '  commit id:"three"',
    ].join('\n'));
    const commits = plan.params.filter(([k]) => k === 'commit');
    expect(commits[2]).toEqual(['commit', 'three|develop||two|']);
  });

  it('tag 并进当前提交的文字', () => {
    const plan = translateGitGraph('gitGraph\n  commit id:"one"\n  tag v1.0');
    expect(plan.params).toContainEqual(['commit', 'one|main|[v1.0]||']);
  });

  it('commit "message" 的引号内容就是标题', () => {
    const plan = translateGitGraph('gitGraph\n  commit "first commit"');
    expect(plan.params).toContainEqual(['commit', 'c1|main|first commit||']);
  });

  it('%% 注释被跳过', () => {
    const plan = translateGitGraph('gitGraph\n  %% a comment\n  commit id:"one"');
    expect(plan.params.filter(([k]) => k === 'commit').length).toBe(1);
  });

  it('一个提交都没有就报错', () => {
    expect(() => translateGitGraph('gitGraph\n  branch develop')).toThrow(ApiError);
    expect(() => translateGitGraph('gitGraph\n  branch develop')).toThrow(/at least one commit/);
  });
});

describe('gitgraph rendering', () => {
  const url = (q: string): URL => new URL(`https://draw.test/draw/gitgraph?${q}`);

  it('画出分支名与提交文字', () => {
    const svg = renderGitGraphFromUrl(url(
      'branch=main&branch=develop' +
      '&commit=one|main|First commit||' +
      '&commit=two|develop|Feature work||' +
      '&commit=three|main|Merge develop|one|two',
    )).svg;
    expect(svg).toContain('<svg');
    expect(svg).toContain('>main<');
    expect(svg).toContain('>develop<');
    expect(svg).toContain('First commit');
    expect(svg).toContain('Feature work');
    expect(svg).toContain('Merge develop');
    expect(svg).toContain('var(--d-s1)');
    expect(svg).toContain('var(--d-s2)');
  });

  it('合并提交有两个父:一条普通边 + 一条合并曲线', () => {
    const svg = renderGitGraphFromUrl(url(
      'branch=main&branch=develop' +
      '&commit=one|main|A||' +
      '&commit=two|develop|B||' +
      '&commit=m3|main|C|one|two',
    )).svg;
    expect(svg).toContain('data-merge="1"');
    expect(svg).toContain('stroke-dasharray="7 4"');
  });

  it('标题走 titleBlock 的样子', () => {
    const svg = renderGitGraphFromUrl(url('branch=main&commit=one|main|A||&title=Release flow')).svg;
    expect(svg).toContain('>Release flow<');
    expect(svg).toContain('font-size="18"');
  });

  it('interactive:提交点带 data-tip,并落一个 metadata 岛', () => {
    const svg = renderGitGraphFromUrl(url('branch=main&commit=one|main|A||'), true).svg;
    expect(svg).toContain('data-tip="one · A · main"');
    expect(svg).toContain('<metadata id="gcommits">');
  });

  it('换个皮肤,画布里的色值就换', () => {
    const base = renderGitGraphFromUrl(url('branch=main&commit=one|main|A||')).svg;
    const macaron = renderGitGraphFromUrl(url('branch=main&commit=one|main|A||&t=macaron')).svg;
    expect(macaron).not.toBe(base);
    expect(macaron).toContain('--d-s1:');
  });

  it('同样的参数,输出确定', () => {
    const q = 'branch=main&branch=develop&commit=one|main|A||&commit=two|develop|B||';
    expect(renderGitGraphFromUrl(url(q)).svg).toBe(renderGitGraphFromUrl(url(q)).svg);
  });

  it('w=/h= 尊重画布尺寸', () => {
    const svg = renderGitGraphFromUrl(url('branch=main&commit=one|main|A||&w=900&h=700')).svg;
    expect(svg).toContain('width="900"');
    expect(svg).toContain('height="700"');
  });

  it('没给 w=/h= 时画布按内容自然尺寸(不小于内容)', () => {
    const svg = renderGitGraphFromUrl(url('branch=main&commit=one|main|A||')).svg;
    const w = Number(/<svg[^>]*\bwidth="(\d+)"/.exec(svg)![1]);
    const h = Number(/<svg[^>]*\bheight="(\d+)"/.exec(svg)![1]);
    expect(w).toBeGreaterThan(150);
    expect(h).toBeGreaterThan(80);
    expect(svg).not.toContain('width="900"');
  });
});

describe('gitgraph 参数校验', () => {
  it('没有分支就报错', () => {
    try {
      renderGitGraphFromUrl(new URL('https://draw.test/draw/gitgraph?commit=one|main|A||'));
      expect.unreachable('should have thrown');
    } catch (err) {
      expect(err).toBeInstanceOf(ApiError);
      expect((err as ApiError).message).toContain('at least one branch');
    }
  });

  it('提交落在未知分支上报错', () => {
    try {
      renderGitGraphFromUrl(new URL('https://draw.test/draw/gitgraph?branch=main&commit=one|nope|A||'));
      expect.unreachable('should have thrown');
    } catch (err) {
      expect(err).toBeInstanceOf(ApiError);
      expect((err as ApiError).message).toContain('unknown branch');
    }
  });

  it('?d= 的 JSON 形态:引用不存在的父提交报错', () => {
    try {
      parseGitGraphSpec(JSON.stringify({
        branches: ['main'],
        commits: [{ id: 'a', lane: 'main', parent: 'zzz' }],
      }));
      expect.unreachable('should have thrown');
    } catch (err) {
      expect(err).toBeInstanceOf(ApiError);
      expect((err as ApiError).message).toContain('unknown parent');
    }
  });

  it('?d= 不是合法 JSON 时报错并给例子', () => {
    expect(() => parseGitGraphSpec('{oops')).toThrow(ApiError);
    expect(() => parseGitGraphSpec('{oops')).toThrow(/valid JSON/);
  });

  it('gitGraphSpecFromParams 读扁平参数', () => {
    const spec = gitGraphSpecFromParams(new URLSearchParams('branch=main&commit=one|main|A|'));
    expect(spec.branches).toEqual(['main']);
    expect(spec.commits).toEqual([{ id: 'one', lane: 'main', label: 'A' }]);
  });

  it('?d= 的 JSON 形态也能直接渲染', () => {
    const d = encodeURIComponent(JSON.stringify({
      branches: ['main', 'develop'],
      commits: [
        { id: 'a', lane: 'main', label: 'First' },
        { id: 'b', lane: 'develop', label: 'Side', parent: 'a' },
        { id: 'm', lane: 'main', label: 'Merge', parent: 'a', parent2: 'b' },
      ],
    }));
    const svg = renderGitGraphFromUrl(new URL(`https://draw.test/draw/gitgraph?d=${d}`)).svg;
    expect(svg).toContain('First');
    expect(svg).toContain('Side');
    expect(svg).toContain('Merge');
    expect(svg).toContain('data-merge="1"');
  });
});
