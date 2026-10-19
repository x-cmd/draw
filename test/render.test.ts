import { describe, expect, it } from 'vitest';
import { renderPie } from '../src/render/pie';
import { renderBar } from '../src/render/bar';
import { renderLine } from '../src/render/line';
import { renderArea, renderAreaMulti, renderAreaByMode } from '../src/render/area';
import { renderStored } from '../src/render/dispatch';
import { renderLineMulti } from '../src/render/line-multi';
import { renderRadar, renderRadarByMode } from '../src/render/radar';
import { renderSankey } from '../src/render/sankey';
import { parseSankeySpec, sankeySpecFromParams } from '../src/specs/sankey';
import type { ChartInput } from '../src/specs';
import { renderBarMulti } from '../src/render/bar-grouped';
import { renderBarGrid } from '../src/render/bar-grid';
import { renderHbarOpendata, renderHbarCells, renderHbarDiverging, renderHbarLift } from '../src/render/hbar-spec';
import { renderBarStacked } from '../src/render/bar-stacked';
import { renderHBar } from '../src/render/hbar';
import { renderGauge } from '../src/render/gauge';
import { renderScatter } from '../src/render/scatter';
import { renderCombo } from '../src/render/combo';
import { parseSeriesSpec, parseInput, parseGaugeSpec, gaugeSpecFromParams, parseScatterSpec, scatterSpecFromParams, parseComboSpec, comboSpecFromParams, looksMultiSeries, ApiError, parseChartSpec, specFromParams, seriesSpecFromParams, csvToSpecJson } from '../src/specs';
import { rangeTicks } from '../src/render/svg';
import { renderQR, parseColor } from '../src/render/qr';
import { canonicalJson, fingerprint, assertHash, type StoredChart } from '../src/store';
import { niceTicks, fmtNum, esc, textW } from '../src/render/svg';
import { plainGeo, radialFit, type GeoMeasure } from '../src/render/measure';
import { INTER_WIDTHS } from '../src/styles/inter';
import { renderHbarByMode } from '../src/render/hbar-spec';
import { VARIANTS } from '../src/styles';
import { resolveVersion, CURRENT_VERSION } from '../src/version';
import { resolveSkin } from '../src/styles';

const SKIN = resolveSkin('pie', null, 'light'); // 默认=opendata(onSlice)
const LEGEND_SKIN = resolveSkin('pie', 'market-mono', 'light'); // legend 模式
const LINE_SKIN = resolveSkin('line', null, 'light'); // 默认=shadcn
const BAR_SKIN = resolveSkin('bar', 'base', 'light'); // 显式 base(bar 默认已改 evil,num=none)
const HBAR_SKIN = resolveSkin('hbar', null, 'light'); // base 水平柱
const COMBO_SKIN = resolveSkin('combo', null, 'light'); // base 混合
const AREA_SKIN = resolveSkin('area', null, 'light'); // 默认=evil(双系列虚线面积)
const O = { width: 560, height: 300, version: 1, skin: SKIN };
const OL = { width: 560, height: 300, version: 1, skin: LEGEND_SKIN };
const LO = { width: 560, height: 300, version: 1, skin: LINE_SKIN };

describe('parseChartSpec', () => {
  it('parses a valid spec', () => {
    const spec = parseChartSpec('{"title":"t","data":[{"label":"A","value":1}]}', 'pie');
    expect(spec.data[0]).toEqual({ label: 'A', value: 1 });
  });

  it('missing d throws 400 with example', () => {
    expect(() => parseChartSpec(null, 'pie')).toThrowError(ApiError);
    try {
      parseChartSpec(null, 'pie');
    } catch (e) {
      expect((e as ApiError).status).toBe(400);
      expect((e as ApiError).message).toContain('flat params');
    }
  });

  it('invalid JSON throws 400', () => {
    expect(() => parseChartSpec('{oops', 'pie')).toThrowError(/not valid JSON/);
  });

  it('negative value throws 400', () => {
    expect(() => parseChartSpec('{"data":[{"label":"A","value":-1}]}', 'bar')).toThrowError(/>= 0/);
  });

  it('all-zero data throws 400', () => {
    expect(() => parseChartSpec('{"data":[{"label":"A","value":0}]}', 'bar')).toThrowError(/sum to more than 0/);
  });

  it('over bar limit throws 400', () => {
    const data = Array.from({ length: 31 }, (_, i) => ({ label: String(i), value: 1 }));
    expect(() => parseChartSpec(JSON.stringify({ data }), 'bar')).toThrowError(/at most 30/);
  });
});

describe('specFromParams (flat readable URLs)', () => {
  it('builds spec from comma-separated flat params', () => {
    const p = new URLSearchParams('title=Stars&labels=TS,Py&values=48,23');
    const spec = parseChartSpec(specFromParams(p, 'pie'), 'pie');
    expect(spec.title).toBe('Stars');
    expect(spec.data).toEqual([{ label: 'TS', value: 48 }, { label: 'Py', value: 23 }]);
  });

  it('supports repeated params (labels containing commas)', () => {
    const p = new URLSearchParams('labels=Q1, 2024&labels=Q2&values=1&values=2');
    const spec = parseChartSpec(specFromParams(p, 'bar'), 'bar');
    expect(spec.data[0]).toEqual({ label: 'Q1, 2024', value: 1 });
  });

  it('d param takes precedence over flat params', () => {
    const p = new URLSearchParams('d=' + encodeURIComponent('{"data":[{"label":"x","value":1}]}') + '&labels=ignored&values=9');
    const spec = parseChartSpec(specFromParams(p, 'pie'), 'pie');
    expect(spec.data).toEqual([{ label: 'x', value: 1 }]);
  });

  it('mismatched labels/values throws 400', () => {
    const p = new URLSearchParams('labels=A,B&values=1');
    expect(() => specFromParams(p, 'pie')).toThrowError(/must match/);
  });

  it('non-numeric value throws 400', () => {
    const p = new URLSearchParams('labels=A&values=xyz');
    expect(() => specFromParams(p, 'bar')).toThrowError(/not a number/);
  });

  it('no params at all returns null (missing-data error)', () => {
    expect(specFromParams(new URLSearchParams('w=560'), 'pie')).toBeNull();
  });
});

describe('renderPie', () => {
  const spec = { title: 'Stars', unit: 'stars', data: [
    { label: 'TypeScript', value: 4821 }, { label: 'Python', value: 2312 }, { label: 'Go', value: 980 },
  ] };

  it('renders svg root with metadata and escaped title', () => {
    const svg = renderPie(spec, O);
    expect(svg).toMatch(/^<svg xmlns="http:\/\/www\.w3\.org\/2000\/svg"/);
    expect(svg).toContain('<metadata>');
    expect(svg).toContain('&quot;Stars&quot;'); // metadata JSON escaped
    expect(svg).toContain('</svg>');
  });

  it('renders on-slice labels by default (opendata)', () => {
    const svg = renderPie(spec, O);
    expect(svg).toContain('TypeScript 59%');
    expect(svg).not.toMatch(/r="4" fill="var/); // 无图例圆点
    expect(svg).toMatch(/font-size="30" font-weight="600"/); // 编辑式大标题
  });

  it('renders legend mode labels, values and percentages (market-mono)', () => {
    const svg = renderPie(spec, OL);
    expect(svg).toContain('TypeScript');
    expect(svg).toContain('4,821');
    expect(svg).toContain('%');
  });

  it('escapes XSS in labels', () => {
    const bad = { data: [{ label: '<script>alert(1)</script>', value: 5 }] };
    const svg = renderPie(bad, O);
    expect(svg).not.toContain('<script>');
    expect(svg).toContain('&lt;script&gt;');
  });

  it('single slice renders full ring', () => {
    const svg = renderPie({ data: [{ label: 'only', value: 10 }] }, O);
    expect(svg).toContain('<circle');
  });

  it('aggregates >9 slices into Other', () => {
    const data = Array.from({ length: 12 }, (_, i) => ({ label: 'x' + i, value: 10 - i }));
    const svg = renderPie({ data }, OL);
    expect(svg).toContain('Other');
    // metadata keeps the original full data
    expect(svg).toContain('x11');
  });
});

describe('renderBar', () => {
  const spec = { title: 'Downloads', data: [
    { label: 'Mon', value: 1200 }, { label: 'Tue', value: 1800 }, { label: 'Wed', value: 2400 },
  ] };

  it('renders bars with all value labels by default, peak bold', () => {
    const svg = renderBar(spec, { ...O, skin: BAR_SKIN });
    expect(svg).toContain('<path');
    expect(svg).toContain('<line');
    expect(svg).toContain('1.2k'); // 默认全标
    expect(svg).toContain('1.8k');
    expect(svg).toContain('2.4k');
    expect(svg).toContain('Mon');
    expect(svg).toContain('rx="12"');
  });

  it('num=peak labels only the peak', () => {
    const svg = renderBar(spec, { ...O, valueLabels: 'peak' });
    expect(svg).toContain('2.4k');
    expect(svg).not.toContain('>1.2k<');
    expect(svg).not.toContain('>1.8k<');
  });

  it('num=none labels nothing', () => {
    const svg = renderBar(spec, { ...O, valueLabels: 'none' });
    expect(svg).not.toContain('2.4k');
    expect(svg).toContain('Mon'); // 类别标签仍在
  });

  it('embeds metadata', () => {
    expect(renderBar(spec, { ...O, skin: BAR_SKIN })).toContain('&quot;template&quot;:&quot;bar&quot;');
  });
});

describe('renderLine', () => {
  const spec = { title: 'Trend', data: [
    { label: 'Mon', value: 1200 }, { label: 'Tue', value: 1800 }, { label: 'Wed', value: 1500 }, { label: 'Thu', value: 2400 },
  ] };

  it('renders smooth curve; spec variants default to no area / no value labels', () => {
    const svg = renderLine(spec, LO);
    expect(svg).toMatch(/<path d="M[^"]*C/); // 平滑贝塞尔曲线
    expect(svg).not.toContain('url(#dg-area)'); // shadcn 规范:无面积填充
    expect(svg).not.toContain('1.2k'); // 规范默认无数值标注
    expect(svg).toContain('&quot;template&quot;:&quot;line&quot;');
    // ?num=all 显式开启 → 标注出现
    const withNums = renderLine(spec, { ...LO, valueLabels: 'all' });
    expect(withNums).toContain('2.4k');
  });

  it('two points renders straight polyline without curve', () => {
    const svg = renderLine({ data: [{ label: 'a', value: 1 }, { label: 'b', value: 2 }] }, LO);
    expect(svg).toContain('<circle');
  });
});

describe('renderAreaMulti', () => {
  const spec = { labels: ['Jan', 'Feb', 'Mar'], series: [
    { name: 'Desktop', values: [300, 800, 500] },
    { name: 'Mobile', values: [150, 400, 280] },
  ] };

  it('draws both series: gradients, dashed strokes, dots, top-right legend', () => {
    const svg = renderAreaMulti(spec, { width: 560, height: 300, version: 1, skin: AREA_SKIN });
    expect(svg).toContain('url(#dg-area-0)');
    expect(svg).toContain('url(#dg-area-1)');
    expect((svg.match(/stroke-dasharray="5 5"/g) ?? []).length).toBe(2); // 双系列虚线描边
    expect((svg.match(/r="6"/g) ?? []).length).toBe(6); // 每系列 3 点
    expect(svg).toContain('width="11" height="11" rx="3"'); // 右上方块图例
    expect(svg).toContain('Desktop');
    expect(svg).toContain('&quot;template&quot;:&quot;area&quot;');
  });

  it('constant data renders without NaN (opendata data-range axis)', () => {
    const svg = renderArea({ data: [{ label: 'a', value: 5 }, { label: 'b', value: 5 }] }, { width: 560, height: 300, version: 1, skin: resolveSkin('area', 'opendata', 'light') });
    expect(svg.replace(/<style>[\s\S]*?<\/style>/, '')).not.toContain('NaN'); // 剥字体:base64 里恰有 "NaN" 字符
  });

  it('pixel variant: 100×46 grid, glowing trace, handwritten total', () => {
    const svg = renderAreaByMode({ multi: false, spec: { unit: 'GitHub Stars', data: [{ label: 'Dec', value: 0 }, { label: 'Jun', value: 900 }, { label: 'Sep', value: 1458 }] } }, { width: 900, height: 470, version: 1, skin: resolveSkin('area', 'pixel', 'light') });
    expect((svg.match(/stroke="var\(--d-grid\)" stroke-width="0\.7"/g) ?? []).length).toBe(4600); // 100×46 像素格
    expect(svg).toContain('#8FEA2A'); // 轨迹像素
    expect(svg).toContain('url(#px-wide)'); // 底层光晕
    expect(svg).toContain('1,458 GitHub Stars'); // 手写总量
    expect(svg).toContain('Handlee');
  });

  it('polka variant: staircase areas with dot patterns and big legend values', () => {
    const svg = renderAreaByMode({ multi: true, spec: parseSeriesSpec('{"labels":["A","B","C"],"series":[{"name":"x","values":[10,50,1458]},{"name":"y","values":[5,30,986]}]}', 'line') }, { width: 900, height: 470, version: 1, skin: resolveSkin('area', 'polka', 'light') });
    expect((svg.match(/<pattern/g) ?? []).length).toBe(2);
    expect(svg).toMatch(/ H\d+(\.\d+)? V\d/); // 正交阶梯
    expect((svg.match(/r="7" fill="none"/g) ?? []).length).toBe(2); // 圆圈图例
    expect(svg).toContain('>1,458<');
    expect(svg).toContain('>986<');
  });
});

describe('renderStored (short links)', () => {
  it('renders multi-series area docs', () => {
    const doc = {
      template: 'area',
      theme: 'base',
      spec: { labels: ['Jan', 'Feb', 'Mar'], series: [{ name: 'A', values: [3, 9, 6] }, { name: 'B', values: [1, 4, 2] }] },
    };
    const svg = renderStored(doc as never, { width: 560, height: 300, version: 1, skin: AREA_SKIN });
    expect(svg).toContain('url(#dg-area-0)');
    expect(svg).toContain('&quot;template&quot;:&quot;area&quot;');
  });
});

describe('renderRadar', () => {
  const spec = { title: 'Skills', data: [
    { label: 'TS', value: 90 }, { label: 'Rust', value: 60 }, { label: 'Go', value: 45 }, { label: 'Py', value: 80 },
  ] };

  it('renders web rings, filled polygon, vertex dots, labels', () => {
    const svg = renderRadar(spec, { ...O, width: 480, height: 360, skin: resolveSkin('radar', null, 'light') });
    expect((svg.match(/fill="none" stroke="var--d-grid"|stroke="var\(--d-grid\)"/g) ?? []).length).toBeGreaterThanOrEqual(3); // 蛛网环
    expect(svg).toContain('fill-opacity="0.18"');
    expect(svg).toContain('>TS<');
    expect(svg).toContain('&quot;template&quot;:&quot;radar&quot;');
  });

  it('evil variant: multi-series with inline axis values and hollow dots', () => {
    const skin = resolveSkin('radar', 'evil', 'light');
    const input: ChartInput = { multi: true, spec: parseSeriesSpec('{"labels":["A","B","C","D"],"series":[{"name":"X","values":[58,72,70,76]},{"name":"Y","values":[34,48,44,81]}]}', 'line') };
    const svg = renderRadarByMode(input, { width: 900, height: 540, version: 1, skin });
    expect((svg.match(/stroke-dasharray="5 6"/g) ?? []).length).toBe(4); // 4 圈虚线环
    expect((svg.match(/r="5" fill="var\(--d-card\)"/g) ?? []).length).toBe(8); // 4 维 × 2 系列空心点
    expect((svg.match(/font-size="13" font-weight="700"/g) ?? []).length).toBe(8); // 轴端内嵌数值
    expect(svg).toContain('>X<');
    expect(svg).toContain('&quot;template&quot;:&quot;radar&quot;');
  });

  it('xcmd variant: square vertex markers and Handlee labels', () => {
    const skin = resolveSkin('radar', 'xcmd', 'light');
    const svg = renderRadarByMode({ multi: false, spec: { data: [{ label: '性能', value: 68 }, { label: '易用性', value: 54 }, { label: '功能', value: 62 }, { label: '可移植性', value: 76 }, { label: '可靠性', value: 73 }] } }, { width: 900, height: 490, version: 1, skin });
    expect((svg.match(/width="6" height="6" rx="1"/g) ?? []).length).toBe(5); // 方形顶点
    expect(svg).toContain('Handlee'); // 手写标签
    expect(svg).toMatch(/stroke-width="2\.25"/); // 规范描边
  });

  it('base radar rejects multi-series', () => {
    const input: ChartInput = { multi: true, spec: parseSeriesSpec('{"labels":["A","B","C"],"series":[{"name":"X","values":[1,2,3]}]}', 'line') };
    expect(() => renderRadarByMode(input, O)).toThrowError(/only supported for t=evil/);
  });

  it('fewer than 3 dimensions throws 400', () => {
    expect(() => renderRadar({ data: [{ label: 'a', value: 1 }, { label: 'b', value: 2 }] }, { ...O, skin: resolveSkin('radar', null, 'light') })).toThrowError(/at least 3/);
  });
});

describe('multi-series', () => {
  const multiJSON = JSON.stringify({
    title: 'Downloads',
    labels: ['Mon', 'Tue', 'Wed'],
    series: [
      { name: 'draw', values: [120, 180, 150] },
      { name: 'qc', values: [80, 90, 85] },
    ],
  });

  it('parseSeriesSpec validates valid input', () => {
    const spec = parseSeriesSpec(multiJSON, 'line');
    expect(spec.series).toHaveLength(2);
    expect(spec.labels).toEqual(['Mon', 'Tue', 'Wed']);
  });

  it('values count mismatch throws 400', () => {
    const bad = JSON.stringify({ labels: ['A', 'B'], series: [{ name: 's', values: [1] }] });
    expect(() => parseSeriesSpec(bad, 'bar')).toThrowError(/one per label/);
  });

  it('more than 6 series throws 400', () => {
    const series = Array.from({ length: 7 }, (_, i) => ({ name: 's' + i, values: [1, 2] }));
    expect(() => parseSeriesSpec(JSON.stringify({ labels: ['A', 'B'], series }), 'line')).toThrowError(/at most 6/);
  });

  it('seriesSpecFromParams builds from repeated series params', () => {
    const p = new URLSearchParams('labels=Mon,Tue&series=a:1,2&series=b:3,4&title=T');
    const spec = parseSeriesSpec(seriesSpecFromParams(p), 'bar');
    expect(spec.series[1]).toEqual({ name: 'b', values: [3, 4] });
  });

  it('series without colon throws 400', () => {
    const p = new URLSearchParams('labels=A&series=noColonHere');
    expect(() => seriesSpecFromParams(p)).toThrowError(/colon/);
  });

  it('parseInput routes flat series to multi', () => {
    const input = parseInput(new URLSearchParams('labels=A,B&series=x:1,2'), 'bar');
    expect(input.multi).toBe(true);
  });

  it('parseInput rejects series for pie', () => {
    expect(() => parseInput(new URLSearchParams('labels=A&series=x:1'), 'pie')).toThrowError(/not supported for \/pie/);
  });

  it('parseInput keeps single-series via values param', () => {
    const input = parseInput(new URLSearchParams('labels=A,B&values=1,2'), 'bar');
    expect(input.multi).toBe(false);
  });

  it('renderBarMulti renders groups, legend, metadata', () => {
    const spec = parseSeriesSpec(multiJSON, 'bar');
    const svg = renderBarMulti(spec, { ...O, skin: BAR_SKIN });
    expect((svg.match(/<path d="M/g) ?? []).length).toBe(6); // 3 组 × 2 系列
    expect(svg).toContain('>draw<');
    expect(svg).toContain('>qc<');
    expect(svg).toContain('&quot;series&quot;');
  });

  it('evil bar variant: rx4 rects, dashed grid, no value labels', () => {
    const skin = resolveSkin('bar', 'evil', 'light');
    const spec = parseSeriesSpec('{"labels":["Jan","Feb"],"series":[{"name":"A","values":[3,5]},{"name":"B","values":[2,1]}]}', 'bar');
    const svg = renderBarMulti(spec, { width: 960, height: 520, version: 1, skin });
    expect((svg.match(/rx="4"/g) ?? []).length).toBe(4); // 四角圆角柱
    expect(svg).toContain('stroke-dasharray="4 6"'); // 虚线网格
    expect(svg).toContain('<line x1="76" y1="448" x2="910"'); // 规范几何:left 76/右 910/底 448
    expect(svg).not.toMatch(/font-size="10.5"/); // 默认无数值标注
  });

  it('grid bar variant: n×rows cells, header total and peak', () => {
    const skin = resolveSkin('bar', 'grid', 'light');
    const svg = renderBarGrid({ data: [{ label: '00:00', value: 2 }, { label: '02:00', value: 1 }, { label: '04:00', value: 3 }] }, { width: 960, height: 520, version: 1, skin });
    expect((svg.match(/rx="1"/g) ?? []).length).toBe(9); // 3 列 × 3 行
    expect(svg).toContain('[Σ] Total');
    expect(svg).toContain('[◆] Peak');
    expect(svg).toContain('04:00'); // 峰值时段
    expect(svg).toContain('&quot;template&quot;:&quot;bar&quot;');
  });

  it('hbar spec variants: rows/cells/diverging/lift', () => {
    const o960 = (skin: ReturnType<typeof resolveSkin>) => ({ width: skin.size![0], height: skin.size![1], version: 1, skin });
    // rows:逐行配色 + 参考线
    const rowsSkin = resolveSkin('hbar', 'opendata', 'light');
    const rows = renderHbarOpendata({ data: [{ label: 'A', value: 2.8 }, { label: 'B', value: 8.6 }] }, { ...o960(rowsSkin), refLine: 4.5, refLabel: 'WCAG AA' });
    expect(rows).toMatch(/stroke-dasharray="5 4"/); // 参考线
    expect(rows).toContain('WCAG AA');
    expect(rows).toContain('--d-s7'); // 第 7 行分类色存在
    // cells:24 格部分填充
    const cellsSkin = resolveSkin('hbar', 'xcmd', 'light');
    const cells = renderHbarCells({ data: [{ label: 'C', value: 80.4 }] }, o960(cellsSkin));
    expect((cells.match(/rx="1" fill="var\(--d-s1\)"/g) ?? []).length).toBe(20); // 19 满格 + 1 部分填充
    // diverging:双系列蝴蝶
    const dSkin = resolveSkin('hbar', 'xcmd-issue', 'light');
    const dv = renderHbarDiverging({ labels: ['a', 'b'], series: [{ name: '新建', values: [2, 12] }, { name: '关闭', values: [2, 9] }] }, o960(dSkin));
    expect((dv.match(/var\(--d-s1\)"/g) ?? []).length).toBe(3); // 2 左条 + 图例点
    expect((dv.match(/var\(--d-s2\)"/g) ?? []).length).toBe(3); // 2 右条 + 图例点
    expect(dv).toContain('新建');
    // lift:斜纹增益
    const lSkin = resolveSkin('hbar', 'rank', 'light');
    const lift = renderHbarLift({ labels: ['x'], series: [{ name: '基础得分', values: [35] }, { name: '搜索增益', values: [35.3] }] }, o960(lSkin));
    expect(lift).toContain('url(#dgl-hatch)');
    expect(lift).toContain('+35.3');
    expect(lift).toContain('基础得分');
  });

  it('renderLineMulti renders k curves and legend', () => {
    const spec = parseSeriesSpec(multiJSON, 'line');
    const svg = renderLineMulti(spec, LO);
    expect((svg.match(/stroke-linecap="round"/g) ?? []).length).toBe(2);
    expect(svg).toContain('>draw<'); // shadcn 左上图例
  });
});

describe('short-link store', () => {
  const doc: StoredChart = { template: 'pie', theme: 'aurora', spec: { data: [{ label: 'A', value: 1 }] } };

  it('fingerprint is deterministic and 16-hex', async () => {
    const h1 = await fingerprint(doc);
    const h2 = await fingerprint(doc);
    expect(h1).toBe(h2);
    expect(h1).toMatch(/^[0-9a-f]{16}$/);
  });

  it('fingerprint changes when spec changes', async () => {
    const h1 = await fingerprint(doc);
    const h2 = await fingerprint({ ...doc, spec: { data: [{ label: 'A', value: 2 }] } });
    expect(h1).not.toBe(h2);
  });

  it('canonicalJson sorts keys so key order does not affect fingerprint', async () => {
    const a = await fingerprint(doc);
    const reordered: StoredChart = { template: 'pie', spec: { data: [{ value: 1, label: 'A' }] }, theme: 'aurora' };
    expect(await fingerprint(reordered)).toBe(a);
    expect(canonicalJson({ b: 1, a: [2, { d: 3, c: 4 }] })).toBe('{"a":[2,{"c":4,"d":3}],"b":1}');
  });

  it('assertHash rejects invalid ids', () => {
    expect(() => assertHash('xyz')).toThrowError(/16 hex/);
    expect(() => assertHash('a'.repeat(17))).toThrowError(/16 hex/);
    expect(() => assertHash('a'.repeat(16))).not.toThrow();
  });

  it('csvToSpecJson: 2 columns → single series', () => {
    const spec = JSON.parse(csvToSpecJson('label,value\nMon,120\nTue,180'));
    expect(spec.data).toEqual([{ label: 'Mon', value: 120 }, { label: 'Tue', value: 180 }]);
  });

  it('csvToSpecJson: 3+ columns → multi series', () => {
    const spec = JSON.parse(csvToSpecJson('label,draw,qc\nMon,1,2\nTue,3,4'));
    expect(spec.series).toEqual([
      { name: 'draw', values: [1, 3] },
      { name: 'qc', values: [2, 4] },
    ]);
  });

  it('csvToSpecJson: ragged row and non-numeric value throw', () => {
    expect(() => csvToSpecJson('label,value\nMon,1,2')).toThrowError(/expected 2/);
    expect(() => csvToSpecJson('label,value\nMon,x')).toThrowError(/not a number/);
  });
});

describe('renderHBar', () => {
  const spec = { title: 'Ranking', data: [
    { label: 'TypeScript', value: 4821 }, { label: 'Python', value: 2312 }, { label: 'Rust', value: 645 },
  ] };

  it('renders horizontal bars with end labels and values', () => {
    const svg = renderHBar(spec, { ...O, skin: HBAR_SKIN });
    expect(svg).toContain('<path');
    expect(svg).toContain('TypeScript');
    expect(svg).toContain('4.8k'); // 默认全标
    expect(svg).toContain('&quot;template&quot;:&quot;hbar&quot;');
  });

  it('num=peak labels only the peak', () => {
    const svg = renderHBar(spec, { ...O, skin: HBAR_SKIN, valueLabels: 'peak' });
    expect(svg).toContain('4.8k');
    expect(svg).not.toContain('>2.3k<');
  });
});

describe('renderBarStacked', () => {
  const multi = parseSeriesSpec(JSON.stringify({
    labels: ['Mon', 'Tue'],
    series: [
      { name: 'a', values: [3, 1] },
      { name: 'b', values: [2, 4] },
    ],
  }), 'bar');

  it('renders one stack per label with in-segment values', () => {
    const svg = renderBarStacked(multi, { ...O, skin: BAR_SKIN });
    expect(svg).toContain('stroke="var(--d-card)"'); // 段间卡底色缝
    expect(svg).toContain('>3<'); // 段内数值(Mon: a=3)
    expect(svg).toContain('>2<'); // Mon: b=2
    expect(svg).toContain('>4<'); // Tue: b=4
    expect(svg).not.toMatch(/fill="var\(--d-on-s[0-9]\)"[^>]*>5</); // 不再标总量(仅轴刻度可出现 5)
    expect(svg).toContain('>a<'); // 图例
    expect(svg).toMatch(/fill="var--d-on-s[0-9]"|fill="var\(--d-on-s[0-9]\)"[^>]*>[0-9]</);
  });
});

describe('gauge', () => {
  it('parses from flat params', () => {
    const p = new URLSearchParams('value=87&max=100&title=CPU');
    expect(parseGaugeSpec(gaugeSpecFromParams(p))).toEqual({ title: 'CPU', value: 87, max: 100 });
  });

  it('defaults max to 100', () => {
    expect(parseGaugeSpec('{"value":42}').max).toBe(100);
  });

  it('value exceeding max throws 400', () => {
    expect(() => parseGaugeSpec('{"value":120,"max":100}')).toThrowError(/must not exceed/);
  });

  it('semi default: single value renders one track+value arc', () => {
    const svg = renderGauge({ value: 87, max: 100, title: 'CPU' }, { width: 860, height: 480, version: 1, skin: resolveSkin('gauge', null, 'light') });
    expect((svg.match(/stroke="var\(--d-faint\)"[^>]*stroke-linecap="round"/g) ?? []).length).toBe(1); // 轨道
    expect((svg.match(/stroke="var\(--d-s1\)"[^>]*stroke-linecap="round"/g) ?? []).length).toBe(1); // 值弧
    expect(svg).toContain('&quot;template&quot;:&quot;gauge&quot;');
  });

  it('semi rings: one arc per row, legend with percents', () => {
    const skin = resolveSkin('gauge', null, 'light');
    const svg = renderGauge({ max: 100, data: [
      { label: 'Chrome', value: 86 }, { label: 'Safari', value: 72 }, { label: 'Firefox', value: 64 }, { label: 'Edge', value: 58 }, { label: 'Other', value: 31 },
    ] }, { width: 860, height: 480, version: 1, skin });
    expect((svg.match(/stroke="var\(--d-faint\)"[^>]*stroke-linecap="round"/g) ?? []).length).toBe(5); // 5 轨道
    expect((svg.match(/stroke="var\(--d-s[1-5]\)"[^>]*stroke-linecap="round"/g) ?? []).length).toBe(5); // 5 值弧
    expect(svg).toContain('Chrome 86%');
    expect(svg).toContain('Other 31%');
  });

  it('gradient rings: pathLength dasharray and gradient legend swatches', () => {
    const skin = resolveSkin('gauge', 'gradient', 'light');
    const svg = renderGauge({ max: 100, data: [
      { label: 'Chrome', value: 88 }, { label: 'Safari', value: 76 }, { label: 'Firefox', value: 69 }, { label: 'Edge', value: 61 }, { label: 'Other', value: 43 },
    ] }, { width: 860, height: 480, version: 1, skin });
    expect((svg.match(/pathLength="100"/g) ?? []).length).toBe(5);
    expect(svg).toContain('stroke-dasharray="88 100"');
    expect((svg.match(/fill="url\(#dgg-\d\)"/g) ?? []).length).toBeGreaterThanOrEqual(5); // 渐变环+图例
    expect(svg).toContain('#2DD4BF'); // 首环渐变起点色
  });

  it('reliability keeps value/max semantics and rejects data', () => {
    const skin = resolveSkin('gauge', 'reliability', 'light');
    const svg = renderGauge({ value: 842, max: 1000, title: 'Delivery Reliability' }, { width: 960, height: 520, version: 1, skin });
    expect(svg).toContain('>842<');
    expect(() => renderGauge({ max: 100, data: [{ label: 'A', value: 50 }] }, { width: 960, height: 520, version: 1, skin })).toThrowError(/value=&max=/);
  });
});

describe('scatter', () => {
  it('parses from flat x/y params', () => {
    const p = new URLSearchParams('x=1,2,3&y=4,5,6&title=T');
    const spec = parseScatterSpec(scatterSpecFromParams(p));
    expect(spec.points).toEqual([{ x: 1, y: 4 }, { x: 2, y: 5 }, { x: 3, y: 6 }]);
  });

  it('supports negatives in single series and repeated params as multi-series', () => {
    const single = parseScatterSpec(scatterSpecFromParams(new URLSearchParams('x=-1,2&y=5,-3')));
    expect(single.points).toEqual([{ x: -1, y: 5 }, { x: 2, y: -3 }]);
    const multi = parseScatterSpec(scatterSpecFromParams(new URLSearchParams('x=-1&x=2&y=5&y=-3')));
    expect(multi.series).toEqual([
      { name: 'S1', points: [{ x: -1, y: 5 }] },
      { name: 'S2', points: [{ x: 2, y: -3 }] },
    ]);
  });

  it('bad point throws 400', () => {
    expect(() => parseScatterSpec('{"points":[[1,"a"]]}')).toThrowError(/must be \[x,y\] numbers/);
  });

  it('renders axes grid and points, no labels by default', () => {
    const svg = renderScatter({ title: 'Corr', points: [{ x: 1, y: 4 }, { x: 2, y: 5 }, { x: 3, y: 6 }] }, { ...O, width: 560, height: 360, skin: resolveSkin('scatter', null, 'light') });
    expect((svg.match(/<circle/g) ?? []).length).toBe(3);
    expect(svg).not.toContain('font-size="10.5"'); // 默认无点标签(标签独有字号)
    expect(svg).toContain('&quot;template&quot;:&quot;scatter&quot;');
  });

  it('num=all labels points', () => {
    const svg = renderScatter({ points: [{ x: 1, y: 4 }, { x: 2, y: 9 }] }, { ...O, width: 560, height: 360, valueLabels: 'all', skin: resolveSkin('scatter', null, 'light') });
    expect(svg).toContain('>4<');
    expect(svg).toContain('>9<');
  });
});

describe('combo', () => {
  it('parses flat series(bar) + line params', () => {
    const p = new URLSearchParams('labels=Mon,Tue&series=dl:120,180&line=growth:5,8');
    const spec = parseComboSpec(comboSpecFromParams(p));
    expect(spec.series).toEqual([
      { name: 'dl', values: [120, 180], kind: 'bar' },
      { name: 'growth', values: [5, 8], kind: 'line' },
    ]);
  });

  it('parses JSON per-series type', () => {
    const spec = parseComboSpec(JSON.stringify({ labels: ['A'], series: [{ name: 'x', values: [1] }, { name: 'y', values: [2], type: 'line' }] }));
    expect(spec.series[0].kind).toBe('bar');
    expect(spec.series[1].kind).toBe('line');
  });

  it('invalid type throws', () => {
    expect(() => parseComboSpec('{"labels":["A"],"series":[{"name":"x","values":[1],"type":"pie"}]}')).toThrowError(/"bar" or "line"/);
  });

  it('renders bars + curve + legend', () => {
    const svg = renderCombo(parseComboSpec(comboSpecFromParams(new URLSearchParams('labels=Mon,Tue,Wed&series=dl:120,180,150&line=growth:5,8,6'))), { ...O, skin: COMBO_SKIN });
    expect(svg).toMatch(/<path d="M[^"]*V/); // 柱
    expect(svg).toMatch(/stroke-linecap="round"/); // 线
    expect(svg).toContain('>dl<');
    expect(svg).toContain('>growth<');
    expect(svg).toContain('&quot;template&quot;:&quot;combo&quot;');
  });

  it('values= is accepted as an unnamed bar series', () => {
    const spec = parseComboSpec(comboSpecFromParams(new URLSearchParams('labels=Mon,Tue&unit=downloads&values=120,180&line=growth:5,8')));
    expect(spec.series[0]).toEqual({ name: 'downloads', values: [120, 180], kind: 'bar' });
  });

  it('value labels are all-or-nothing: dense charts drop the whole layer', () => {
    const sparse = renderCombo(parseComboSpec(comboSpecFromParams(new URLSearchParams('labels=A,B&series=dl:1200,1800&line=g:3,9'))), { ...O, skin: COMBO_SKIN });
    expect((sparse.match(/fill="var\(--d-on-s\d\)"/g) ?? []).length).toBe(2); // 柱标全出
    expect((sparse.match(/paint-order="stroke"/g) ?? []).length).toBe(2); // 线标全出
    const labels = Array.from({ length: 30 }, (_, i) => 'G' + i).join(',');
    const bars = Array.from({ length: 30 }, (_, i) => String(900 + (i * 137) % 1200)).join(',');
    const lines = Array.from({ length: 30 }, (_, i) => String(3 + (i % 7))).join(',');
    const dense = renderCombo(parseComboSpec(comboSpecFromParams(new URLSearchParams(`labels=${labels}&series=dl:${bars}&line=g:${lines}`))), { ...O, skin: COMBO_SKIN });
    expect(dense.match(/fill="var\(--d-on-s\d\)"/)).toBeNull(); // 柱标全无
    expect(dense.match(/paint-order="stroke"/)).toBeNull(); // 线标全无
  });
});

describe('solid pie (donut=0)', () => {
  const spec = { title: 'T', data: [{ label: 'A', value: 3 }, { label: 'B', value: 1 }] };

  it('wedges from center, no center total', () => {
    const svg = renderPie(spec, { ...O, donut: false });
    expect(svg).not.toMatch(/letter-spacing="-0.03em"/); // 无中心总数
    expect(svg).toMatch(/L[0-9.]+ [0-9.]+Z/); // 楔形:弧→圆心→闭合
  });

  it('donut default keeps ring and center', () => {
    const svg = renderPie(spec, OL);
    expect(svg).toMatch(/letter-spacing="-0.03em"/); // 环心总计(market-mono)
  });
});

describe('rangeTicks', () => {
  it('covers arbitrary range with clean steps', () => {
    expect(rangeTicks(3, 47, 4)).toEqual([10, 20, 30, 40]); // d3 step 10
    expect(rangeTicks(-5, 5, 4)).toEqual([-4, -2, 0, 2, 4]); // d3 step 2
    expect(rangeTicks(0.5, 4.5, 4)).toEqual([1, 2, 3, 4]);
  });
});

describe('review fixes regression', () => {
  it('looksMultiSeries: structural check, not string sniffing', () => {
    expect(looksMultiSeries('{"title":"my \\"series\\" note","data":[{"label":"A","value":1}]}')).toBe(false);
    expect(looksMultiSeries('{"labels":["A"],"series":[{"name":"s","values":[1]}]}')).toBe(true);
    expect(looksMultiSeries('{oops')).toBe(false);
  });

  it('combo reverse dual-axis: left axis scales to bar max', () => {
    const spec = parseComboSpec(comboSpecFromParams(new URLSearchParams('labels=A,B&series=small:5,10&line=huge:100,200')));
    const svg = renderCombo(spec, { ...O, skin: COMBO_SKIN });
    expect(svg).toContain('>8<'); // 左轴刻度来自 barMax(10),不再被 200 压扁(d3 步长 2)
    expect(svg).toContain('>200<'); // 右轴线刻度仍在
  });

  it('pie 9-category legend stays inside card, no title overlap', () => {
    const data = Array.from({ length: 12 }, (_, i) => ({ label: 'cat' + i, value: 10 - i }));
    const svg = renderPie({ title: 'T', data }, OL);
    // market-mono:底部两列网格图例(方形色块),9 行数据(8 + Other)
    const ys = [...svg.matchAll(/<rect x="[0-9.]+" y="([0-9.]+)" width="9" height="9" rx="2"/g)].map((m) => Number(m[1]));
    expect(ys.length).toBe(9);
    expect(Math.min(...ys)).toBeGreaterThanOrEqual(60); // 不压标题
    expect(Math.max(...ys)).toBeLessThanOrEqual(300 - 24); // 不出卡片
    expect(svg).toMatch(/<line x1="24"[^>]+stroke="var\(--d-border\)"/); // 图例上方细分隔线
  });

  it('scatter x/y count mismatch gives explicit message', () => {
    expect(() => scatterSpecFromParams(new URLSearchParams('x=1,2,3&y=4,5'))).toThrowError(/3 x values but 2 y values/);
  });
});

describe('renderQR', () => {
  it('renders module rects with quiet zone', () => {
    const svg = renderQR('hello', '#111827', '#ffffff', 240, 240, 1, SKIN);
    expect(svg).toMatch(/^<svg/);
    expect((svg.match(/<rect/g) ?? []).length).toBeGreaterThan(50);
    expect(svg).toContain('fill="#111827"');
  });

  it('parseColor validates hex and keeps default', () => {
    expect(parseColor(null, '#111827', 'fg')).toBe('#111827');
    expect(parseColor('123456', '#111827', 'fg')).toBe('#123456');
    expect(() => parseColor('red', '#111827', 'fg')).toThrowError(/hex/);
  });
});

describe('helpers', () => {
  it('niceTicks returns clean steps including 0 and ceiling', () => {
    expect(niceTicks(2400, 4)).toEqual([0, 500, 1000, 1500, 2000, 2500]); // d3 1/2/5 制(旧 2.5 档已去)
  });

  it('niceTicks handles small max', () => {
    const t = niceTicks(0.4, 4);
    expect(t[0]).toBe(0);
    expect(t[t.length - 1]).toBeGreaterThanOrEqual(0.4);
  });

  it('fmtNum compact formats', () => {
    expect(fmtNum(1234)).toBe('1.2k');
    expect(fmtNum(1500000)).toBe('1.5M');
    expect(fmtNum(-2_500_000_000)).toBe('-2.5B');
    expect(fmtNum(7)).toBe('7');
  });

  it('esc escapes xml entities', () => {
    expect(esc('<a>&"\'')).toBe('&lt;a&gt;&amp;&quot;&apos;');
  });
});

describe('resolveVersion', () => {
  it('absent v = latest with short TTL', () => {
    const r = resolveVersion(null);
    expect(r.version).toBe(CURRENT_VERSION);
    expect(r.cacheControl).toBe('public, max-age=300');
  });

  it('explicit v = pinned version, 1-day cache (immutable is short-link only)', () => {
    const r = resolveVersion('1');
    expect(r.version).toBe(1);
    expect(r.cacheControl).toBe('public, max-age=86400');
  });

  it('invalid v throws 400', () => {
    expect(() => resolveVersion('2')).toThrowError(ApiError);
    expect(() => resolveVersion('x')).toThrowError(ApiError);
  });
});


describe('measure 层纯函数', () => {
  const GEO: GeoMeasure = { ticks: [0, 500, 1000, 1500], xLabels: [] };
  const WIDE: GeoMeasure = { ticks: [0, 25000000000, 50000000000], xLabels: [] }; // '25B/50B' 缩写后刻度列仍窄于规范(fmtNum 大数缩写特性)


  it('plainGeo:默认数据零漂移(规范比例字面量),长标签实测撑大', () => {
    expect(plainGeo(960, 520, true, {})).toEqual({ left: 79, right: 910, top: 96, bottom: 416, xLabelY: 466, legendY: 50 });
    expect(plainGeo(960, 520, true, GEO).left).toBe(79); // 刻度列仍在规范内
    expect(plainGeo(960, 520, true, WIDE).left).toBe(79); // fmtNum 缩写后刻度列恒窄于规范
    const longLabel = plainGeo(960, 520, true, { xLabels: ['这是一个非常长的中文标签测试'] });
    expect(longLabel.left).toBeGreaterThanOrEqual(79);
    expect(longLabel.right).toBeLessThan(910); // 首末标签半宽外伸 → 右缘回收
  });

  it('radialFit 五分支:命中/压引线/截名/钉底/放弃', () => {
    const labelW = (c: number): number => c * 10;
    // ① 自然命中:不降级
    expect(radialFit({ natural: 100, budget: 300, lead: 50, minLead: 20, labelW, maxCut: 10, minCut: 2, floorK: 0.5, overflow: 'drop' }))
      .toMatchObject({ R: 100, cut: 10, lead: 50, drop: false });
    // ② lead-first 压引线+截名后命中:cut=8(50+20+80=150≤160)
    expect(radialFit({ natural: 100, budget: 160, lead: 50, minLead: 20, labelW, maxCut: 10, minCut: 2, floorK: 0.5, overflow: 'drop' }))
      .toMatchObject({ lead: 20, cut: 8, R: 60, drop: false });
    // ③ lead-first 截名后命中(floorK 下限)
    expect(radialFit({ natural: 100, budget: 100, lead: 50, minLead: 20, labelW, maxCut: 10, minCut: 2, floorK: 0.5, overflow: 'drop' }))
      .toMatchObject({ cut: 2, drop: false, R: 60 }); // 截到下限 2:50+20+20=90≤100 命中,R=max(100-40, floor 50)=60
    // ④ cut-first 全间距命中(不压间距)
    expect(radialFit({ natural: 100, budget: 170, lead: 50, minLead: 20, labelW, maxCut: 10, minCut: 2, floorK: 0.5, order: 'cut-first', overflow: 'floor' }))
      .toMatchObject({ lead: 50, drop: false });
    // ⑤ drop:穷尽仍放不下 → 放弃整层,R 保持自然值
    expect(radialFit({ natural: 100, budget: 40, lead: 50, minLead: 20, labelW, maxCut: 10, minCut: 2, floorK: 0.5, overflow: 'drop' }))
      .toEqual({ R: 100, cut: 2, lead: 20, drop: true });
  });

  it('textW:与内嵌字体同源(数字精确、CJK=1em、未知拉丁保守)', () => {
    expect(textW('123', 10)).toBeCloseTo(10 * (INTER_WIDTHS['1'] + INTER_WIDTHS['2'] + INTER_WIDTHS['3']), 5);
    expect(textW('速度', 10)).toBe(20); // CJK 1em
    expect(textW('é', 10)).toBe(10); // 子集外保守 1em
    expect(textW('iiii', 10)).toBeLessThan(textW('mmmm', 10)); // 逐字符 advance 生效
  });

  it('画布贴内容:hbar 四形态与 bar 收缩(公式字面量)', () => {
    const A = { width: 960, height: 480, version: 1, autoWidth: true, autoHeight: true } as const;
    const svg = (t: string) => renderHbarByMode({ multi: false, spec: { data: [{ label: 'a', value: 1 }, { label: 'b', value: 2 }, { label: 'c', value: 3 }] } } as never, { ...A, skin: resolveSkin('hbar', t, 'light') });
    const dims = (t: string) => { const m = svg(t).match(/width="(\d+)" height="(\d+)"/)!; return [Number(m[1]), Number(m[2])]; };
    // opendata n=3:h = 54+2×52+28+86 = 272;w = 960×272/480 = 544
    expect(dims('opendata')).toEqual([544, 272]);
    const svgCells = renderHbarByMode({ multi: false, spec: { data: [{ label: 'a', value: 60 }, { label: 'b', value: 30 }] } } as never, { width: 920, height: 300, version: 1, autoWidth: true, autoHeight: true, skin: resolveSkin('hbar', 'xcmd', 'light') });
    expect(svgCells).toMatch(/width="626" height="204"/); // h=86+48+16+54=204;w=920×204/300
    const svgDiv = renderHbarByMode({ multi: true, spec: { labels: ['a', 'b', 'c'], series: [{ name: 'o', values: [3, 1, 2] }, { name: 'c', values: [2, 4, 1] }] } } as never, { width: 820, height: 370, version: 1, autoWidth: true, autoHeight: true, skin: resolveSkin('hbar', 'xcmd-issue', 'light') });
    expect(svgDiv).toMatch(/width="508" height="229"/); // h=62+2×47+22+51;w=820×h/370
    const svgLift = renderHbarByMode({ multi: true, spec: { labels: ['a', 'b', 'c'], series: [{ name: 'b', values: [30, 20, 10] }, { name: 'l', values: [5, 8, 3] }] } } as never, { width: 960, height: 560, version: 1, autoWidth: true, autoHeight: true, skin: resolveSkin('hbar', 'rank', 'light') });
    expect(svgLift).toMatch(/width="444" height="259"/); // h=55+2×43+22+96;w=960×h/560
    // bar 单系列 n=3 收缩:373(贴内容,下限 320 不触发)
    const bar = renderBar({ data: [{ label: 'a', value: 1 }, { label: 'b', value: 2 }, { label: 'c', value: 3 }] }, { width: 560, height: 320, version: 1, autoWidth: true, autoHeight: true, skin: BAR_SKIN });
    expect(bar).toMatch(/width="373" height="320"/);
  });
});


describe('短链与直接 GET 一致性', () => {
  it('缺省 t= 存第一个变体 family:短链渲染与直接 GET 同尺寸、标题保留', () => {
    const theme = VARIANTS.bar[0].family; // createHandler 修复后的存储值
    expect(theme).toBe('evil');
    const spec = { title: 'Weekly downloads', unit: 'stars', data: [{ label: 'Mon', value: 1200 }, { label: 'Tue', value: 1800 }, { label: 'Wed', value: 1500 }] };
    const svg = renderStored({ template: 'bar', theme, spec } as never, {
      width: 960, height: 520, version: 1,
      skin: resolveSkin('bar', theme, 'light'),
      autoWidth: true, autoHeight: true,
    } as never);
    expect(svg).toContain('Weekly downloads');
    expect(svg).toMatch(/width="373" height="520"/); // evil 规范画布 + 组少贴内容,同直接 GET
  });
});


describe('短链与直接 GET 一致性', () => {
  it('combo 存档回环:kind 字段的线系列不被改成柱', () => {
    // 存档形态 = parseComboSpec 的输出(kind);renderStored 会再喂回解析器
    const svg = renderStored({
      template: 'combo', theme: 'base',
      spec: { labels: ['Mon', 'Tue'], series: [
        { name: 'dl', values: [120, 180], kind: 'bar' },
        { name: 'g', values: [3, 9], kind: 'line' },
      ] },
    } as never, { width: 560, height: 320, version: 1, skin: resolveSkin('combo', 'base', 'light'), autoWidth: true, autoHeight: true } as never);
    expect(svg).toContain('>g<'); // 线系列在图例里
    expect((svg.match(/<path d="M/g) ?? []).length).toBeGreaterThan(0); // 线的平滑路径存在
  });
});
describe('sankey', () => {
  // 生命线断言:每条流带的源端/目标端四角必须落在对应节点的矩形内
  // (d3-sankey 试验的教训:nodeSort 与松弛冲突会让流带飘出节点)
  function ribbonsInsideNodes(svg: string): boolean {
    // 只把宽 ≥13 的矩形当节点(图例方块/斜纹块 9-12px 不算,防 inside() 借它们"假通过")
    const rects = [...svg.matchAll(/<rect x="([\d.]+)" y="([\d.]+)" width="([\d.]+)" height="([\d.]+)"/g)]
      .map((m) => [Number(m[1]), Number(m[2]), Number(m[1]) + Number(m[3]), Number(m[2]) + Number(m[4])] as const)
      .filter(([x0, y0, x1, y1]) => x1 - x0 >= 13);
    const inside = (x: number, y: number) => rects.some(([x0, y0, x1, y1]) => x0 - 0.5 <= x && x <= x1 + 0.5 && y0 - 0.5 <= y && y <= y1 + 0.5);
    let bad = 0;
    let total = 0;
    for (const d of svg.matchAll(/<path d="(M[\d.]+ [\d.]+C[\d.]+ [\d.]+ [\d.]+ [\d.]+ [\d.]+ [\d.]+L[\d.]+ [\d.]+C[^"]+Z)"/g)) {
      // 我们生成的固定结构:M x1 y1 C c c c x2 y2 L x2 y2' C c c c x1 y1' Z
      const n = [...d[1].matchAll(/-?[\d.]+/g)].map(Number);
      const corners = [[n[0], n[1]], [n[6], n[7]], [n[8], n[9]], [n[14], n[15]]] as const;
      total++;
      if (corners.some(([x, y]) => !inside(x, y))) bad++;
    }
    if (bad > 0) throw new Error(`${bad}/${total} ribbons outside their nodes`);
    return total > 0;
  }

  it('every ribbon stays inside its source/target nodes (all variants)', () => {
    const cases = [
      ['labels=A,B,C,D,E&links=A>B:30;A>C:20;B>D:25;C>D:15;C>E:10', null],
      ['labels=Ads,Web,Signup,Buy,Drop&links=Ads>Signup:30;Web>Signup:20;Signup>Buy:40;Signup>Drop:10', 'fund'],
      ['labels=Ads,Web,Referral,Won&links=Ads>Won:30;Web>Won:20;Referral>Won:25', 'pipeline'],
    ] as const;
    for (const [qs, t] of cases) {
      const params = new URLSearchParams(qs + (t ? `&t=${t}` : ''));
      const svg = renderSankey(parseSankeySpec(sankeySpecFromParams(params)), { width: 720, height: 420, version: 1, skin: resolveSkin('sankey', t ?? null, 'light') });
      expect(ribbonsInsideNodes(svg)).toBe(true);
    }
  });


  const data = 'labels=Ads,Web,Signup,Buy,Drop&links=Ads>Signup:30;Web>Signup:20;Signup>Buy:40;Signup>Drop:10';

  it('parses flat links and JSON, validates nodes', () => {
    const spec = parseSankeySpec(sankeySpecFromParams(new URLSearchParams(data)));
    expect(spec.labels).toHaveLength(5);
    expect(spec.links[0]).toEqual({ from: 'Ads', to: 'Signup', value: 30 });
    expect(() => parseSankeySpec('{"labels":["A","B"],"links":[{"from":"A","to":"C","value":1}]}')).toThrowError(/unknown node/);
    expect(() => parseSankeySpec('{"labels":["A","B"],"links":[{"from":"A","to":"B","value":1},{"from":"B","to":"A","value":1}]}')).toThrowError(/DAG/);
    expect(() => parseSankeySpec('{"labels":["A","B"],"links":[{"from":"A","to":"A","value":1}]}')).toThrowError(/self-loop/);
  });

  it('basic: node heights proportional, closed bands, outside labels', () => {
    const svg = renderSankey(parseSankeySpec(sankeySpecFromParams(new URLSearchParams(data))), { width: 720, height: 420, version: 1, skin: resolveSkin('sankey', null, 'light') });
    const hs = [...svg.matchAll(/height="([\d.]+)" rx=/g)].map((m) => Number(m[1]));
    expect(hs.length).toBe(5);
    expect(hs[2] / hs[3]).toBeCloseTo(50 / 30, 0); // Signup:Ads = 流量比
    expect((svg.match(/fill-opacity="0\.46"/g) ?? []).length).toBe(4); // 封闭流带
    expect(svg).toContain('>30<');
    expect(svg).toContain('&quot;template&quot;:&quot;sankey&quot;');
  });

  it('fund: gradient bands, inside labels, stats footer', () => {
    const svg = renderSankey(parseSankeySpec(sankeySpecFromParams(new URLSearchParams(data))), { width: 760, height: 460, version: 1, skin: resolveSkin('sankey', 'fund', 'light') });
    expect((svg.match(/url\(#sk-\d+\)"/g) ?? []).length).toBe(4);
    expect(svg).toContain('TOTAL FLOW');
    expect(svg).toContain('50'); // 30+20 源头总量
  });

  it('pipeline: fade panel with total and route counts', () => {
    const svg = renderSankey(parseSankeySpec(sankeySpecFromParams(new URLSearchParams(data))), { width: 760, height: 400, version: 1, skin: resolveSkin('sankey', 'pipeline', 'light') });
    expect(svg).toContain('url(#sk-fade)');
    expect(svg).toContain('2 sources · 2 routes');
    expect(svg).toContain('>50<');
  });
});

describe('文字不得重叠(硬规则回归)', () => {
  // 解析 SVG 文本元素,估算包围盒后两两求交
  const boxes = (svg: string) => {
    const out: { raw: string; x0: number; y0: number; w: number; h: number; halo: boolean }[] = [];
    // 直接用 src 的 textW(与渲染同源),不再手写估宽(双份实现会漂移)
    for (const m of svg.matchAll(/<text([^>]*)>([\s\S]*?)<\/text>/g)) {
      const attrs = m[1];
      const raw = m[2].replace(/<[^>]+>/g, '').trim();
      if (!raw || /rotate\(/.test(attrs)) continue;
      const x = Number((attrs.match(/ x="([\d.-]+)"/) || [])[1]);
      const y = Number((attrs.match(/ y="([\d.-]+)"/) || [])[1]);
      const fs = Number((attrs.match(/font-size="([\d.]+)/) || [])[1] ?? 12);
      const anchor = (attrs.match(/text-anchor="(start|middle|end)"/) || [])[1] ?? 'start';
      if (!Number.isFinite(x) || !Number.isFinite(y)) continue;
      const w = textW(raw, fs);
      out.push({ raw, x0: anchor === 'middle' ? x - w / 2 : anchor === 'end' ? x - w : x, y0: y - fs * 0.8, w, h: fs * 1.05, halo: /paint-order="stroke"/.test(attrs) });
    }
    return out;
  };
  const overlaps = (svg: string): string[] => {
    const ts = boxes(svg);
    const hits: string[] = [];
    for (let i = 0; i < ts.length; i++)
      for (let j = i + 1; j < ts.length; j++) {
        const a = ts[i], b = ts[j];
        if (a.x0 < b.x0 + b.w && a.x0 + a.w > b.x0 && a.y0 < b.y0 + b.h && a.y0 + a.h > b.y0) hits.push(`${a.raw}×${b.raw}`);
      }
    return hits;
  };

  const idx = (n: number) => Array.from({ length: n }, (_, i) => i);
  const AUTO = { width: 560, height: 320, version: 1, autoWidth: true, autoHeight: true };

  it('bar 30 组不重叠(自动加宽让标签入柱)', () => {
    const data = idx(30).map((i) => ({ label: 'L' + i, value: 100 + ((i * 37) % 900) }));
    const svg = renderBar({ data }, { ...AUTO, skin: resolveSkin('bar', null, 'light') });
    expect(overlaps(svg)).toEqual([]);
  });

  it('分组柱 30×6 不重叠(自动加宽+预留图例)', () => {
    const series = idx(6).map((i) => `{"name":"s${i}","values":[${idx(30).map((j) => 10 + ((j * 37) % 90)).join(',')}]}`);
    const spec = parseSeriesSpec(`{"labels":[${idx(30).map((i) => `"L${i}"`).join(',')}],"series":[${series.join(',')}]}`, 'bar');
    const svg = renderBarMulti(spec, { ...AUTO, skin: resolveSkin('bar', null, 'light') });
    expect(overlaps(svg)).toEqual([]);
  });

  it('堆叠柱极端量级差不重叠(自动百分比)', () => {
    const spec = parseSeriesSpec('{"labels":["C","Yaml","CHeader","Sh","Happy"],"series":[{"name":"code","values":[30396,18706,4179,955,901]},{"name":"comments","values":[7838,52,757,116,0]},{"name":"blanks","values":[3563,2726,512,161,71]},{"name":"files","values":[45,11,32,14,1]}]}', 'bar');
    const svg = renderBarStacked(spec, { ...AUTO, skin: resolveSkin('bar', null, 'light') });
    expect(overlaps(svg)).toEqual([]);
  });

  it('堆叠混合图(柱+线)不重叠', () => {
    const spec = parseComboSpec('{"stack":true,"labels":["C","Yaml","CHeader","Sh","Happy"],"series":[{"name":"code","values":[30396,18706,4179,955,901]},{"name":"comments","values":[7838,52,757,116,0]},{"name":"blanks","values":[3563,2726,512,161,71]},{"name":"files","values":[45,11,32,14,1],"type":"line"}]}');
    const svg = renderCombo(spec, { ...AUTO, skin: resolveSkin('combo', null, 'light') });
    expect(overlaps(svg)).toEqual([]);
  });

  it('折线不得穿过数值标签(线压字也是遮挡)', () => {
    const spec = parseComboSpec('{"stack":true,"labels":["C","Yaml","CHeader","Sh","Happy"],"series":[{"name":"code","values":[30396,18706,4179,955,901]},{"name":"comments","values":[7838,52,757,116,0]},{"name":"blanks","values":[3563,2726,512,161,71]},{"name":"files","values":[45,11,32,14,1],"type":"line"}]}');
    const svg = renderCombo(spec, { ...AUTO, skin: resolveSkin('combo', null, 'light') });
    // 由折线数据点(圆点 r=2.5)重建线段,检查与每个文字框是否相交
    const pts = [...svg.matchAll(/<circle cx="([\d.]+)" cy="([\d.]+)" r="2\.5"/g)].map((m) => [Number(m[1]), Number(m[2])]);
    const segs: number[][] = [];
    for (let i = 1; i < pts.length; i++) segs.push([...pts[i - 1], ...pts[i]]);
    const hit = (x1: number, y1: number, x2: number, y2: number, rx: number, ry: number, rw: number, rh: number): boolean => {
      let t0 = 0, t1 = 1;
      const dx = x2 - x1, dy = y2 - y1;
      const p = [-dx, dx, -dy, dy], q = [x1 - rx, rx + rw - x1, y1 - ry, ry + rh - y1];
      for (let i = 0; i < 4; i++) {
        if (p[i] === 0) { if (q[i] < 0) return false; }
        else { const r = q[i] / p[i]; if (p[i] < 0) { if (r > t1) return false; if (r > t0) t0 = r; } else { if (r < t0) return false; if (r < t1) t1 = r; } }
      }
      return true;
    };
    // 允许被线穿过但带遮罩描边的文字(paint-order=stroke 把线遮住,数字仍清晰)
    const crossed = boxes(svg)
      .filter((b) => !b.halo)
      .filter((b) => segs.some((sg) => hit(sg[0], sg[1], sg[2], sg[3], b.x0 - 1, b.y0 - 1, b.w + 2, b.h + 2)));
    expect(crossed).toEqual([]);
  });

  it('桑基图 24 节点扇出不重叠(标签自适应)', () => {
    const labels = ['SRC', ...idx(23).map((i) => `L${i}`)];
    const links = idx(23).map((i) => `{"from":"SRC","to":"L${i}","value":${5 + (i % 30)}}`);
    const spec = parseSankeySpec(`{"labels":${JSON.stringify(labels)},"links":[${links.join(',')}]}`);
    const svg = renderSankey(spec, { width: 720, height: 420, version: 1, skin: resolveSkin('sankey', null, 'light') });
    expect(overlaps(svg)).toEqual([]);
  });
});
