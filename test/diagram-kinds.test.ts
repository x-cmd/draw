import { describe, it, expect } from 'vitest';
import { renderMermaidFromUrl } from '../src/render/mermaid.js';
import { parseGantt } from '../src/render/gantt.js';

const url = (src: string): URL =>
  new URL('https://x-cmd.com/draw/mermaid?m=' + encodeURIComponent(src));

describe('mermaid flowchart', () => {
  it('renders a plain graph', () => {
    const r = renderMermaidFromUrl(url('graph TD\n  A[One] --> B[Two]'));
    expect(r.svg).toContain('<svg');
  });

  it('groups nodes into a boundary when they sit in a subgraph', () => {
    const r = renderMermaidFromUrl(url('graph TD\n  subgraph A\n    X[One]\n  end\n  X --> Y[Two]'));
    expect(r.svg).toContain('<svg');
  });

  it('renders an edge written inside a subgraph block', () => {
    // 连线写在 subgraph 里时,parser 不再单独声明两端 —— 以前这里会 500
    const src = 'graph TD\n  subgraph Edge\n    CDN[CDN] --> GW[Gateway]\n  end\n  GW --> API[API]';
    const r = renderMermaidFromUrl(url(src));
    expect(r.svg).toContain('<svg');
    expect(r.svg).toContain('CDN');
    expect(r.svg).toContain('Gateway');
  });

  it('keeps every member of a subgraph that contains an edge', () => {
    const src = 'graph TD\n  subgraph Edge\n    CDN[CDN] --> GW[Gateway]\n  end\n  GW --> API[API]';
    const r = renderMermaidFromUrl(url(src));
    expect(r.svg).toContain('Edge');
  });
});

describe('gantt source parsing', () => {
  const doc = (src: string) => {
    const d = parseGantt(src.startsWith('gantt') ? src : `gantt\n${src}`);
    return d.sections.flatMap((s) => s.tasks);
  };

  it('reads id, start and duration', () => {
    const [t] = doc('dateFormat YYYY-MM-DD\n  section Dev\n  Design :done, a1, 2026-11-01, 3d');
    expect(t).toMatchObject({ id: 'a1', start: '2026-11-01', endOrDur: '3d', flags: ['done'] });
  });

  it('keeps the duration of a task that starts after another one', () => {
    // 以前 after 后面的时长落进「开始」槽被丢掉,任务只剩 1 天
    const [t] = doc('dateFormat YYYY-MM-DD\n  section Dev\n  Build :active, a2, after a1, 5d');
    expect(t).toMatchObject({ id: 'a2', after: 'a1', endOrDur: '5d' });
    expect(t.start).toBeUndefined();
  });

  it('reads a milestone as a zero-length task', () => {
    const [t] = doc('dateFormat YYYY-MM-DD\n  section Dev\n  Ship :milestone, m1, 2026-11-10, 0d');
    expect(t).toMatchObject({ flags: ['milestone'], endOrDur: '0d' });
  });

  it('reads a completion percentage', () => {
    const [t] = doc('dateFormat YYYY-MM-DD\n  section Dev\n  Backend :active, b1, 2026-10-01, 20d, 40%');
    expect(t.progress).toBe(40);
    expect(t.endOrDur).toBe('20d');
  });
});
