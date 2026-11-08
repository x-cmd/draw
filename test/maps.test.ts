import { describe, it, expect } from 'vitest';
import { renderEchartsFromUrl } from '../src/render/echarts-ssr.js';
import { mapNamesOf, loadMapGeoJson } from '../src/render/maps.js';

// /draw/echarts 覆盖层的地图能力:echarts 6 不带地图数据,US 各州 GeoJSON 随包分发,
// option 里 "type":"map","map":"USA" 即得 choropleth(数据源 us-atlas,Albers 投影)。
const BASE = 'https://draw.test/draw';
const url = (query: string): URL => new URL(`${BASE}/echarts?${query}`);
const MAP_OPT = encodeURIComponent(JSON.stringify({
  visualMap: { min: 50000, max: 120000, inRange: { color: ['#dbeafe', '#1d4ed8'] } },
  series: [{ type: 'map', map: 'USA', data: [{ name: 'California', value: 102662 }, { name: 'Mississippi', value: 53751 }] }],
}));

describe('map data', () => {
  it('collects map names from series and geo components', () => {
    expect(mapNamesOf({ series: [{ type: 'map', map: 'USA' }] })).toEqual(['USA']);
    expect(mapNamesOf({ geo: { map: 'USA' } })).toEqual(['USA']);
    expect(mapNamesOf({ geo: [{ map: 'USA' }, { map: 'EU' }] })).toEqual(['USA', 'EU']);
    expect(mapNamesOf({ series: [{ type: 'bar', data: [1] }] })).toEqual([]);
    expect(mapNamesOf({})).toEqual([]);
  });

  it('renders a US choropleth from the vendored GeoJSON', async () => {
    const { svg } = await renderEchartsFromUrl(url(`d=${MAP_OPT}`));
    expect(svg).toMatch(/^<svg role="img"/);
    expect(svg).toContain('<path'); // 各州轮廓
    expect(svg).toContain('#dbeafe'); // visualMap 色带
    expect(svg).toContain('#1d4ed8');
    expect(svg).not.toContain('Map USA not exists'); // 地图名已注册
  });

  it('gives map series a canvas-filling layout unless the user sets one', async () => {
    const { svg } = await renderEchartsFromUrl(url(`d=${MAP_OPT}&w=760&h=520`));
    // 纵横比按数据(aspectScale=1,echarts 默认 0.75 会把投影过的地图压扁)
    expect(svg).toContain('&quot;aspectScale&quot;:1');
    // 尺寸按画布算:顶部给标题/角标留位,底部给图例留位
    expect(svg).toContain('&quot;layoutSize&quot;:');
    expect(svg).toContain('&quot;layoutCenter&quot;:');
    const own = encodeURIComponent(JSON.stringify({
      series: [{ type: 'map', map: 'USA', aspectScale: 0.5, layoutSize: '50%', data: [{ name: 'California', value: 1 }] }],
    }));
    const { svg: ownSvg } = await renderEchartsFromUrl(url(`d=${own}`));
    expect(ownSvg).toContain('&quot;aspectScale&quot;:0.5'); // 用户写的布局不被覆盖
    expect(ownSvg).toContain('&quot;layoutSize&quot;:&quot;50%&quot;');
  });

  it('400s on an unregistered map name', async () => {
    const bad = encodeURIComponent(JSON.stringify({ series: [{ type: 'map', map: 'MARS', data: [] }] }));
    await expect(renderEchartsFromUrl(url(`d=${bad}`))).rejects.toMatchObject({ status: 400 });
  });

  it('orients the map north-up (coordinates in the y-up convention echarts expects)', async () => {
    // 回归:echarts 按「y 向上(北为正)」解读地图坐标,自己翻成画布的 y 向下;
    // us-atlas 的投影产物是 d3 的屏幕约定(y 向下),不翻一次地图就是倒的。
    // 数据文件保持投影原样,翻转在 maps.ts —— 两边各断言一次。
    const maxY = (geo: unknown, name: string): number => {
      const f = (geo as { features: Array<{ properties: { name: string }; geometry: { coordinates: unknown } }> })
        .features.find((x) => x.properties.name === name);
      if (!f) throw new Error(`no such state: ${name}`);
      let m = -Infinity;
      const walk = (v: unknown): void => {
        if (Array.isArray(v)) {
          if (typeof v[0] === 'number') { m = Math.max(m, v[1] as number); return; }
          v.forEach(walk);
        }
      };
      walk(f.geometry.coordinates);
      return m;
    };
    const { usStatesGeoJson } = await import('../src/render/vendor/us-states.js');
    // 原始数据:y 向下(屏幕约定)→ 南边的州 y 更大
    expect(maxY(usStatesGeoJson, 'Florida')).toBeGreaterThan(maxY(usStatesGeoJson, 'Maine'));
    // 注册给 echarts 的那份:翻过 → 北为正,南边的州 y 更小
    const flipped = await loadMapGeoJson('USA');
    expect(maxY(flipped, 'Florida')).toBeLessThan(maxY(flipped, 'Maine'));
    expect(maxY(flipped, 'California')).toBeLessThan(maxY(flipped, 'Washington'));
  });
});

// 各国行政区划:数据必须是**行政区**(不是整国轮廓)——
// 整国轮廓只有一个 feature,按省着色的 series.data 里的省名一个都对不上,
// 画出来是一块灰饼(巴西/澳洲最初就是这样)。
describe('country subdivisions', () => {
  it('has one feature per state for BR and AU', async () => {
    const br = await loadMapGeoJson('BR') as { features: Array<{ properties: { name: string } }> };
    const au = await loadMapGeoJson('AU') as { features: Array<{ properties: { name: string } }> };
    const brNames = br.features.map((f) => f.properties.name);
    const auNames = au.features.map((f) => f.properties.name);
    expect(brNames).toHaveLength(27);
    expect(auNames.length).toBeGreaterThanOrEqual(8);
    // 名字带重音的也要对得上(数据源的写法)
    expect(brNames).toContain('São Paulo');
    expect(brNames).toContain('Espírito Santo');
    expect(brNames).toContain('Distrito Federal');
    expect(auNames).toContain('Western Australia');
    expect(auNames).toContain('Tasmania');
    // 不该再有「整个国家」这种单一 feature
    expect(brNames).not.toContain('Brazil');
    expect(auNames).not.toContain('Australia');
  });

  it('renders every state of BR with its own fill', async () => {
    const br = await loadMapGeoJson('BR') as { features: Array<{ properties: { name: string } }> };
    const data = br.features.map((f, i) => ({ name: f.properties.name, value: i + 1 }));
    const opt = encodeURIComponent(JSON.stringify({
      visualMap: { min: 1, max: 27, inRange: { color: ['#dbeafe', '#1d4ed8'] } },
      series: [{ type: 'map', map: 'BR', data }],
    }));
    const { svg } = await renderEchartsFromUrl(url(`d=${opt}`));
    // 27 个州各一条路径(边界独立 → 路径数 ≥ 州数)
    const paths = (svg.match(/<path/g) ?? []).length;
    expect(paths).toBeGreaterThanOrEqual(br.features.length);
    expect(svg).not.toContain('Map BR not exists');
  });
});
