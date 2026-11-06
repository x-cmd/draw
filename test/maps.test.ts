import { describe, it, expect } from 'vitest';
import { renderEchartsFromUrl } from '../src/render/echarts-ssr.js';
import { mapNamesOf } from '../src/render/maps.js';

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

  it('fills the canvas for map series unless the user sets the layout', async () => {
    const { svg } = await renderEchartsFromUrl(url(`d=${MAP_OPT}`));
    expect(svg).toContain('&quot;zoom&quot;:1.1'); // 布局缺省铺满画布(回写进内嵌 metadata 的 option)
    const own = encodeURIComponent(JSON.stringify({
      series: [{ type: 'map', map: 'USA', zoom: 2, data: [{ name: 'California', value: 1 }] }],
    }));
    const { svg: ownSvg } = await renderEchartsFromUrl(url(`d=${own}`));
    expect(ownSvg).toContain('&quot;zoom&quot;:2'); // 用户写的布局不被覆盖
    expect(ownSvg).not.toContain('&quot;zoom&quot;:1.1');
  });

  it('400s on an unregistered map name', async () => {
    const bad = encodeURIComponent(JSON.stringify({ series: [{ type: 'map', map: 'MARS', data: [] }] }));
    await expect(renderEchartsFromUrl(url(`d=${bad}`))).rejects.toMatchObject({ status: 400 });
  });
});
