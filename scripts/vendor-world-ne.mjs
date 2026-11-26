/**
 * 生成世界地图的**经纬度**版本(球面用)—— 带 ISO 码的纯数据。
 *
 * 源: Natural Earth 110m/50m admin_0(public domain)
 *      https://raw.githubusercontent.com/nvkelso/natural-earth-vector/master/geojson/ne_110m_admin_0_countries.geojson
 * 流程: 取 ISO 码 → 在日界线上切开 → Douglas-Peucker 抽稀 → 坐标取两位小数 → 纯数据
 *
 * 为什么不用 world-atlas:它是 NE 的 TopoJSON 翻版,**恰好没有 ISO 字段**,键只能靠名字猜;
 * NE 的原文件自带 ISO_A2 / ISO_A3 / ADM0_A3 / WB_A3 → 字母码白送,还少一个依赖(topojson-client)。
 *
 * 用法: node scripts/vendor-world-ne.mjs [110m|50m] [容差(度)] [输出文件]
 */
import { writeFileSync } from 'node:fs';
import { dpRing } from './simplify.mjs';

const SCALE = process.argv[2] ?? '110m';
const SRC = `https://raw.githubusercontent.com/nvkelso/natural-earth-vector/master/geojson/ne_${SCALE}_admin_0_countries.geojson`;
const OUT = process.argv[4] ?? new URL('../src/render/vendor/world-ne.js', import.meta.url).pathname;
const TOL = Number(process.argv[3] ?? 0.1);   // 抽稀容差(度)
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

/**
 * 在**日界线上**把环切开(跨线的国家:俄罗斯/美国/斐济/查德 ✓)
 *
 * 不切会怎样:正射投影 + clipAngle(90) ⇒ 跨线的多边形被裁到半球边界时,
 * d3 把边界**闭合成一整圈** ⇒ 填充把那半个球都盖上 ✗
 * (实测:50m 的美国一国糊满整个球 ✓ —— 110m 恰好没这毛病,数据换了才暴露 ✗)。
 * 平面世界图早踩过这个坑 ⇒ 球面这边也要切 ✓。
 *
 * 切法:相邻两点经度差 > 180 ⇒ 在 ±180 处插一个点(纬度线性插值 ✓)断成两段 ✓。
 */
function cutAntimeridian(ring) {
  const n = ring.length;
  const out = [];
  let cur = [];
  for (let i = 0; i < n; i++) {
    const a = ring[i];
    const b = ring[(i + 1) % n];
    if (!cur.length) cur.push(a);
    if (Math.abs(b[0] - a[0]) > 180) {
      const dir = a[0] > 0 ? 1 : -1;                  // 从东半球跳到西半球 ⇒ 切在 +180 ✓
      const t = Math.abs((dir * 180 - a[0]) / (b[0] - a[0]));
      const lat = a[1] + t * (b[1] - a[1]);
      cur.push([dir * 180, lat]);
      out.push(cur);
      cur = [[-dir * 180, lat]];
    } else {
      cur.push(b);
    }
  }
  if (cur.length >= 3) out.push(cur);
  return out.length ? out : [ring];
}

/** 抽稀一个环(⚠️ 环是闭合的 ⇒ 必须用 dpRing ⇒ 开链的 dp 会把它塌成直线 ✗) */
const simplifyRing = (r) => {
  const s = dpRing(r, TOL);
  return s.map(([lon, lat]) => [Math.round(lon * 10 ** DECIMALS) / 10 ** DECIMALS,
    Math.round(lat * 10 ** DECIMALS) / 10 ** DECIMALS]);
};

/** 一个多边形(外环 + 洞)→ 切好的多边形(外环被日界线切开 ⇒ 几段 ✓) */
function polyPieces(rings) {
  const [outer, ...holes] = rings;
  const pieces = cutAntimeridian(outer);
  const hs = holes.map(simplifyRing);
  return pieces.map((p, i) => (i === 0 ? [simplifyRing(p), ...hs] : [simplifyRing(p)]));
}

/** 要素 → MultiPolygon 的坐标(一律 MultiPolygon ✓ 切开的段各自成多边形 ✓) */
function polysOf(geometry) {
  const coords = geometry.coordinates;
  const polys = geometry.type === 'Polygon' ? [coords] : coords;
  return polys.flatMap(polyPieces);
}

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
        // 用**短名**(NAME ✓)—— NAME_EN 是「People's Republic of China」这种全称 ✗ 标签太长
        name: (p.NAME ?? p.NAME_EN ?? '').replace(/ of America$/, ''),
        // 中文名:去掉「维吾尔/壮族/回族/特别行政区/自治区」这类后缀 ⇒ 新疆/广西/香港 ✓
        // (「中华人民共和国」⇒「中国」是特例 ✗ 直接换 ✓)
        nameZh: p.NAME_ZH && p.NAME_ZH !== '-99'
          ? (p.NAME_ZH === '中华人民共和国' ? '中国'
            : p.NAME_ZH.replace(/(维吾尔|壮族|回族|特别行政区|自治区|自治州)$/, ''))
          : '',
        wb: p.WB_A3 && p.WB_A3 !== '-99' ? p.WB_A3 : '',   // 世行码(跟 gdp/pop 的数据同源)
      },
      geometry: { type: 'MultiPolygon', coordinates: polysOf(f.geometry) },
    };
  })
  // 海(Indian Ocean / Southern Ocean ……)不是国家 ⇒ 剔掉(否则球上标着「印度洋」✗)
  .filter((f) => f.properties.iso3 && f.properties.TYPE !== 'Waterbody');

const header = `/* eslint-disable */
/**
 * 世界地图(经纬度,球面用)—— Natural Earth ${SCALE} admin_0,vendored。
 * 源: naturalearthdata.com(public domain)
 * 抽稀: Douglas-Peucker(tol=${TOL}°)· 环在日界线上切开 ✓
 * 键: properties.iso3(主) / iso2(别名) / adm0(兜底) —— 名字只作 label,不参与寻址
 */
export const worldNeGeoJson = ${JSON.stringify({ type: 'FeatureCollection', features })};
`;
writeFileSync(OUT, header);
console.log('wrote', OUT, features.length, '个要素');
