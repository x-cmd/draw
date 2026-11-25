/**
 * 生成世界地图的**经纬度**版本(球面用)—— 带 ISO 码的纯数据。
 *
 * 源: Natural Earth 110m/50m admin_0(public domain)
 *      https://raw.githubusercontent.com/nvkelso/natural-earth-vector/master/geojson/ne_110m_admin_0_countries.geojson
 * 流程: 取 ISO 码 → Douglas-Peucker 抽稀 → 坐标取两位小数 → 落成纯数据
 *
 * 为什么不用 world-atlas:它是 NE 的 TopoJSON 翻版,**恰好没有 ISO 字段**,键只能靠名字猜;
 * NE 的原文件自带 ISO_A2 / ISO_A3 / ADM0_A3 / WB_A3 → 字母码白送,还少一个依赖(topojson-client)。
 *
 * 用法: node scripts/vendor-world-ne.mjs [110m|50m]
 */
import { writeFileSync } from 'node:fs';
import { dpRing } from './simplify.mjs';

const SCALE = process.argv[2] ?? '110m';
const SRC = `https://raw.githubusercontent.com/nvkelso/natural-earth-vector/master/geojson/ne_${SCALE}_admin_0_countries.geojson`;
const OUT = process.argv[4] ?? new URL('../src/render/vendor/world-ne.js', import.meta.url).pathname;
const TOL = Number(process.argv[3] ?? 0.25);   // 抽稀容差(度)
const DECIMALS = 2;       // 坐标小数位

/**
 * ISO 码怎么取 —— NE 的 ISO_A2 / ISO_A3 有一批是 -99(法国、挪威、北塞浦路斯、索马里兰、科索沃):
 * ISO_x_EH 是它们的真值;再兜底 ADM0_A3(NE 自己的三字母码,177 个要素全覆盖)。
 * 实测:alpha-3 → 174/177(alpha-2 → 175/177),缺的 3 个走 ADM0_A3(CYN / SOL / KOS)。
 */
const iso2 = (p) =>
  (p.ISO_A2 && p.ISO_A2 !== '-99') ? p.ISO_A2
    : (p.ISO_A2_EH && p.ISO_A2_EH !== '-99' ? p.ISO_A2_EH : '');
const iso3 = (p) =>
  (p.ISO_A3 && p.ISO_A3 !== '-99') ? p.ISO_A3
    : (p.ISO_A3_EH && p.ISO_A3_EH !== '-99' ? p.ISO_A3_EH : p.ADM0_A3);

const ring = (r) => {
  // ⚠️ 环是闭合的(首点=末点)⇒ 必须用 dpRing(切两段)⇒ 用开链的 dp 会把整条
  // 海岸线塌成一条直线(八边形轮廓 ✓ 那就是「抽象画」的来源)
  const s = dpRing(r, TOL);
  return s.map(([lon, lat]) => [Math.round(lon * 10 ** DECIMALS) / 10 ** DECIMALS,
    Math.round(lat * 10 ** DECIMALS) / 10 ** DECIMALS]);
};
const walk = (c) => (Array.isArray(c[0]) && typeof c[0][0] === 'number' ? ring(c) : c.map(walk));

const res = await fetch(SRC);
if (!res.ok) throw new Error(`下载失败: ${res.status}`);
const geo = await res.json();

const features = geo.features
  .map((f) => {
    const p = f.properties ?? {};
    return {
      type: 'Feature',
      properties: {
        iso3: iso3(p),                    // 主键
        iso2: iso2(p),                    // 别名
        adm0: p.ADM0_A3 ?? '',            // 兜底(NE 自己的码)
        name: p.NAME_EN ?? p.NAME ?? '',
        wb: p.WB_A3 && p.WB_A3 !== '-99' ? p.WB_A3 : '',   // 世行码(跟 gdp/pop 的数据同源)
      },
      geometry: { type: f.geometry.type, coordinates: walk(f.geometry.coordinates) },
    };
  })
  .filter((f) => f.properties.iso3);

const header = `/* eslint-disable */
/**
 * 世界地图(经纬度,球面用)—— Natural Earth ${SCALE} admin_0,vendored。
 * 源: naturalearthdata.com(public domain)· 抽稀: Douglas-Peucker(tol=${TOL}°)
 * 键: properties.iso3(主) / iso2(别名) / adm0(兜底) —— 名字只作 label,不参与寻址
 */
export const worldNeGeoJson = ${JSON.stringify({ type: 'FeatureCollection', features })};
`;
writeFileSync(OUT, header);
console.log('wrote', OUT, features.length, '个要素');
