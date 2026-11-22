import { describe, it, expect } from 'vitest';
import { renderMermaidFromUrl } from '../src/render/mermaid.js';
import { translateMindmap } from '../src/render/mermaid/mindmap.js';
import { translatePie } from '../src/render/mermaid/pie.js';
import { translateSankey } from '../src/render/mermaid/sankey.js';
import { translateQuadrant } from '../src/render/mermaid/quadrant.js';
import { translateXychart } from '../src/render/mermaid/xychart.js';
import { translateRadar } from '../src/render/mermaid/radar.js';
import { ApiError } from '../src/specs/index.js';

// mermaid 的数据类图种 → draw 的图表引擎:
// 导图(mindmap)、饼(pie)、桑基(sankey-beta)、象限(quadrantChart)、
// 柱/折线(xychart-beta)、雷达(radar-beta)。
// 翻完的参数直接喂给 draw 的引擎 —— 样式/交互/PNG/缓存全继承,不必再养第二套渲染器。
const url = (src: string): URL =>
  new URL('https://draw.test/draw/mermaid?m=' + encodeURIComponent(src));

/** 平面参数表 → 便于断言的字典(重复参数合成数组) */
function asDict(params: [string, string][]): Record<string, string | string[]> {
  const out: Record<string, string | string[]> = {};
  for (const [k, v] of params) {
    const hit = out[k];
    if (hit === undefined) out[k] = v;
    else if (Array.isArray(hit)) hit.push(v);
    else out[k] = [hit, v];
  }
  return out;
}

describe('mermaid mindmap → draw mindmap', () => {
  const SRC = `mindmap
  root((mindmap))
    Origins
      Long history
    Research
      On effectiveness<br/>and features`;

  it('turns the indentation into root/child/leaf paths', () => {
    const plan = translateMindmap(SRC);
    expect(plan.kind).toBe('mindmap');
    const d = asDict(plan.params);
    expect(d.n).toEqual([
      'mindmap',
      'mindmap/Origins',
      'mindmap/Origins/Long history',
      'mindmap/Research',
      'mindmap/Research/On effectiveness and features',
    ]);
  });

  it('strips the shape decoration (root((x)) → x)', () => {
    const plan = translateMindmap(`mindmap
  id1[Alpha]
    id2(Beta)
      id3{Gamma}`);
    expect(asDict(plan.params).n).toEqual(['Alpha', 'Alpha/Beta', 'Alpha/Beta/Gamma']);
  });

  it('strips the side-open shell (id>text] → text)', () => {
    const plan = translateMindmap(`mindmap
  id>Alpha]
    Beta`);
    expect(asDict(plan.params).n).toEqual(['Alpha', 'Alpha/Beta']);
  });

  it('turns a <br/> into a space (draw draws no HTML)', () => {
    const plan = translateMindmap(`mindmap
  Root
    On effectiveness<br/>and features`);
    expect(asDict(plan.params).n).toEqual(['Root', 'Root/On effectiveness and features']);
  });

  it('reads tabs as one level and tolerates 4-space indents', () => {
    const tab = translateMindmap('mindmap\n\tRoot\n\t\tChild');
    expect(asDict(tab.params).n).toEqual(['Root', 'Root/Child']);
    const four = translateMindmap('mindmap\n    Root\n        A\n        B\n            C');
    expect(asDict(four.params).n).toEqual(['Root', 'Root/A', 'Root/B', 'Root/B/C']);
  });

  it('renders the tree end to end', () => {
    const { svg } = renderMermaidFromUrl(url(SRC));
    expect(svg).toContain('>mindmap<');
    expect(svg).toContain('>Origins<');
    expect(svg).toContain('>Long history<');
    expect(svg).toContain('>Research<');
  });

  it('400s when there is no branch', () => {
    expect(() => translateMindmap('mindmap\n  only')).toThrow(ApiError);
    expect(() => translateMindmap('mindmap\n  only')).toThrow(/at least a root and one branch/);
  });
});

describe('mermaid pie → draw pie', () => {
  const SRC = `pie title Pets adopted by volunteers
    "Dogs" : 386
    "Cats" : 85
    "Rats" : 15`;

  it('splits the slices into parallel labels and values', () => {
    const plan = translatePie(SRC);
    expect(plan.kind).toBe('pie');
    const d = asDict(plan.params);
    expect(d.labels).toEqual(['Dogs', 'Cats', 'Rats']);
    expect(d.values).toBe('386,85,15');
    expect(d.title).toBe('Pets adopted by volunteers');
  });

  it('ignores the showData flag', () => {
    const plan = translatePie('pie showData\n  "Dogs" : 386');
    expect(asDict(plan.params).title).toBeUndefined();
    expect(asDict(plan.params).values).toBe('386');
  });

  it('renders the slices end to end', () => {
    const { svg } = renderMermaidFromUrl(url(SRC));
    // 饼图的标签自带百分比(切片旁写「Dogs 79%」)
    expect(svg).toMatch(/>Dogs \d+%</);
    expect(svg).toMatch(/>Cats \d+%</);
    expect(svg).toMatch(/>Rats \d+%</);
    expect(svg).toContain('Pets adopted by volunteers');
  });

  it('400s on a non-numeric value and on an empty pie', () => {
    expect(() => translatePie('pie\n  "Dogs" : many')).toThrow(ApiError);
    expect(() => translatePie('pie\n  "Dogs" : many')).toThrow(/needs a number after/);
    expect(() => translatePie('pie title Empty')).toThrow(/at least one slice/);
  });
});

describe('mermaid sankey-beta → draw sankey', () => {
  const SRC = `sankey-beta

Agricultural waste,Bio-conversion,124.729
Bio-conversion,Liquid,0.597`;

  it('collects the nodes in first-appearance order and one link per row', () => {
    const plan = translateSankey(SRC);
    expect(plan.kind).toBe('sankey');
    const d = asDict(plan.params);
    expect(d.labels).toEqual(['Agricultural waste', 'Bio-conversion', 'Liquid']);
    expect(d.links).toEqual([
      'Agricultural waste>Bio-conversion:124.729',
      'Bio-conversion>Liquid:0.597',
    ]);
  });

  it('renders the flows end to end', () => {
    const { svg } = renderMermaidFromUrl(url(SRC));
    expect(svg).toContain('Agricultural waste');
    expect(svg).toContain('Bio-conversion');
    expect(svg).toContain('Liquid');
  });

  it('400s on a non-positive weight and on an empty body', () => {
    expect(() => translateSankey('sankey-beta\nA,B,0')).toThrow(ApiError);
    expect(() => translateSankey('sankey-beta\nA,B,0')).toThrow(/positive number/);
    expect(() => translateSankey('sankey-beta')).toThrow(/at least one row/);
  });

  it('400s on a row that is not "source,target,value"', () => {
    expect(() => translateSankey('sankey-beta\nA,B')).toThrow(/source,target,value/);
  });
});

describe('mermaid quadrantChart → draw quadrant', () => {
  const SRC = `quadrantChart
    title Reach and engagement of campaigns
    x-axis Low Reach --> High Reach
    y-axis Low Engagement --> High Engagement
    quadrant-1 We should expand
    quadrant-2 Need to promote
    quadrant-3 Re-evaluate
    quadrant-4 May be improved
    Campaign A: [0.3, 0.6]
    Campaign B: [0.45, 0.23]`;

  it('maps the four quadrants in TL/TR/BL/BR order', () => {
    const plan = translateQuadrant(SRC);
    expect(plan.kind).toBe('quadrant');
    const d = asDict(plan.params);
    expect(d.quadrants).toBe('We should expand,Need to promote,Re-evaluate,May be improved');
    expect(d.title).toBe('Reach and engagement of campaigns');
    expect(d.items).toBe('Campaign A@0.3,0.6;Campaign B@0.45,0.23');
  });

  it('keeps the axis ends and derives the axis name from them', () => {
    const d = asDict(translateQuadrant(SRC).params);
    expect(d.xlow).toBe('Low Reach');
    expect(d.xhigh).toBe('High Reach');
    expect(d.xlabel).toBe('Reach');
    expect(d.ylow).toBe('Low Engagement');
    expect(d.yhigh).toBe('High Engagement');
    expect(d.ylabel).toBe('Engagement');
  });

  it('leaves the axis name empty when the ends share no word', () => {
    const d = asDict(translateQuadrant(`quadrantChart
    x-axis Low --> High
    quadrant-1 A
    quadrant-2 B
    quadrant-3 C
    quadrant-4 D`).params);
    expect(d.xlabel).toBeUndefined();
  });

  it('renders the matrix, the cells and the points end to end', () => {
    const { svg } = renderMermaidFromUrl(url(SRC));
    for (const t of ['We should expand', 'Need to promote', 'Re-evaluate', 'May be improved', 'Campaign A', 'Reach']) {
      expect(svg).toContain(t);
    }
  });

  it('400s when no quadrant is named', () => {
    expect(() => translateQuadrant('quadrantChart\n  title X')).toThrow(ApiError);
    expect(() => translateQuadrant('quadrantChart\n  title X')).toThrow(/at least one quadrant/);
  });

  it('leaves the missing cells empty when fewer than four are named', () => {
    // 引擎要正好四格 —— 缺的当空格,整张图仍画得出来
    const plan = translateQuadrant(`quadrantChart
    quadrant-1 We should expand
    quadrant-3 Re-evaluate`);
    expect(plan.kind).toBe('quadrant');
    const { svg } = renderMermaidFromUrl(url(`quadrantChart
    quadrant-1 We should expand
    quadrant-3 Re-evaluate`));
    expect(svg).toContain('We should expand');
    expect(svg).toContain('Re-evaluate');
  });
});

describe('mermaid xychart-beta → draw bar/line', () => {
  const SRC = `xychart-beta
    title "Sales Revenue"
    x-axis [jan, feb, mar]
    y-axis "Revenue (in $)" 0 --> 9000
    bar [5000, 6000, 7500]
    line [5000, 6000, 7500]`;

  it('reads the labels, the values and the y-axis unit', () => {
    const plan = translateXychart(SRC);
    expect(plan.kind).toBe('bar'); // bar 与 line 同时给:取 bar
    const d = asDict(plan.params);
    expect(d.labels).toEqual(['jan', 'feb', 'mar']);
    expect(d.values).toBe('5000,6000,7500');
    expect(d.title).toBe('Sales Revenue');
    expect(d.unit).toBe('Revenue (in $)');
  });

  it('picks line when there is no bar', () => {
    const plan = translateXychart('xychart-beta\n  x-axis [a, b]\n  line [1, 2]');
    expect(plan.kind).toBe('line');
    expect(asDict(plan.params).values).toBe('1,2');
  });

  it('takes the two ends of an x-axis range as the labels', () => {
    const d = asDict(translateXychart('xychart-beta\n  x-axis 1 --> 12\n  bar [1,2]').params);
    expect(d.labels).toEqual(['1', '12']);
  });

  it('numbers the labels when there is no x-axis', () => {
    const d = asDict(translateXychart('xychart-beta\n  bar [1,2]').params);
    expect(d.labels).toEqual(['1', '2']);
  });

  it('renders the bars end to end', () => {
    const { svg } = renderMermaidFromUrl(url(SRC));
    expect(svg).toContain('>jan<');
    expect(svg).toContain('>feb<');
    expect(svg).toContain('Sales Revenue');
  });

  it('400s when the label count and the value count disagree', () => {
    expect(() => translateXychart('xychart-beta\n  x-axis [a,b,c]\n  bar [1,2]')).toThrow(ApiError);
    expect(() => translateXychart('xychart-beta\n  x-axis [a,b,c]\n  bar [1,2]'))
      .toThrow(/x-axis has 3 labels but the series has 2 values/);
  });

  it('400s when there is no series at all', () => {
    expect(() => translateXychart('xychart-beta\n  x-axis [a,b]')).toThrow(/bar or a line series/);
  });
});

describe('mermaid radar-beta → draw radar', () => {
  const SRC = `radar-beta
    title My Radar Chart
    axis m["Math"], s["Science"], h["History"]
    curve a{1,2,3}`;

  it('reads the axis labels and the curve values', () => {
    const plan = translateRadar(SRC);
    expect(plan.kind).toBe('radar');
    const d = asDict(plan.params);
    expect(d.labels).toEqual(['Math', 'Science', 'History']);
    expect(d.values).toBe('1,2,3');
    expect(d.title).toBe('My Radar Chart');
  });

  it('keeps only the first curve', () => {
    const d = asDict(translateRadar(`radar-beta
    axis a["x"], b["y"], c["z"]
    curve p{1,2,3}
    curve q{4,5,6}`).params);
    expect(d.values).toBe('1,2,3');
  });

  it('renders the radar end to end', () => {
    const { svg } = renderMermaidFromUrl(url(SRC));
    expect(svg).toContain('Math');
    expect(svg).toContain('Science');
    expect(svg).toContain('History');
    expect(svg).toContain('My Radar Chart');
  });

  it('400s when the axis count and the curve disagree', () => {
    expect(() => translateRadar('radar-beta\n  axis a["x"], b["y"]\n  curve p{1,2,3}')).toThrow(ApiError);
    expect(() => translateRadar('radar-beta\n  axis a["x"], b["y"]\n  curve p{1,2,3}'))
      .toThrow(/axis count does not match the curve/);
  });

  it('400s with fewer than three axes', () => {
    expect(() => translateRadar('radar-beta\n  axis a["x"], b["y"]\n  curve p{1,2}')).toThrow(ApiError);
    expect(() => translateRadar('radar-beta\n  axis a["x"], b["y"]\n  curve p{1,2}'))
      .toThrow(/at least 3 axes/);
  });
});
