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

  it('画布盖得住绕到节点下面的反向边(以前那一段被裁掉,字看不全)', () => {
    // 反向边走出 U 形绕到节点下面 —— 画布只按节点盒算高度就会裁掉它
    const src = 'graph LR\n  App[Your app] -->|GET /draw?type=pie| Edge[Edge worker]\n  Edge -->|200 OK| App';
    const { svg } = renderMermaidFromUrl(url(src));
    const h = Number(/height="([0-9.]+)"/.exec(svg)![1]);
    // 走线最低点在画布内:折线的每个 y 都要小于画布高
    const ys = [...svg.matchAll(/<path d="M([^"]+)"/g)].flatMap((m) =>
      [...m[1].matchAll(/[ML](-?[0-9.]+) (-?[0-9.]+)/g)].map((p) => Number(p[2])),
    );
    expect(ys.length).toBeGreaterThan(0);
    for (const y of ys) expect(y).toBeLessThan(h);
    // 回信的标签画出来了
    expect(svg).toContain('200 OK');
  });

  it('边标签压在节点上时也有底衬,字不会被节点盖住', () => {
    const src = 'graph LR\n  A[App] -->|GET /draw?type=pie| B[Edge worker]';
    const { svg } = renderMermaidFromUrl(url(src));
    // 标签画在节点之后(层序靠后)且带底衬
    // (metadata 里也有这个字符串,取最后一次出现 —— 那才是画在图上的)
    const label = svg.lastIndexOf('GET /draw?type=pie');
    const node = svg.indexOf('>App<');
    expect(label).toBeGreaterThan(node);
    expect(svg).toContain(`rx="4" fill="var(--d-card)" stroke="var(--d-border)"`);
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
