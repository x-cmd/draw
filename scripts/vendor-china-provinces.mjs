/**
 * 生成中国**省级**的经纬度底图(球面用 ✓)。
 *
 * 源:DataV 的行政区划边界(阿里云 geo.datav.aliyun.com ✓ 公开数据 ✓)
 *   https://geo.datav.aliyun.com/areas_v3/bound/100000_full.json
 *
 * 为什么单独出一份:
 *   · src/render/vendor/china.js 是**投影后的屏幕坐标**(给平面地图 ✓)
 *     ⇒ 球面图用不了(球面要经纬度 ✓)⇒ 另出一份 ✓
 *   · 键用 **ISO 3166-2:CN**(CN-11 / CN-44 ……)✓ —— 主键一律 ISO ✓
 *     (国内那份 GB/T 2260 的两位码与 ISO 3166-2:CN 基本一致 ✓;
 *      台湾/香港/澳门在 ISO 里是单独的一级区划 ✓ ⇒ 同样用 ISO 码 ✓)
 *
 * 用法: node scripts/vendor-china-provinces.mjs [容差(度)] [输出文件]
 */
import { writeFileSync } from 'node:fs';
import { dpRing } from './simplify.mjs';

const SRC = 'https://geo.datav.aliyun.com/areas_v3/bound/100000_full.json';
const OUT = process.argv[3] ?? new URL('../src/render/vendor/china-provinces.js', import.meta.url).pathname;
const TOL = Number(process.argv[2] ?? 0.02);   // 抽稀容差(度 ≈ 2km ✓)
const DECIMALS = 2;

/**
 * 省 → ISO 3166-2:CN 的两位码 ✓
 * (DataV 给的是六位 adcode ⇒ 后两位就是 ✓;直辖市/特别行政区在 ISO 里也是一级 ✓)
 */
const ISO2 = {
  110000: '11', 120000: '12', 130000: '13', 140000: '14', 150000: '15',
  210000: '21', 220000: '22', 230000: '23',
  310000: '31', 320000: '32', 330000: '33', 340000: '34', 350000: '35',
  360000: '36', 370000: '37', 410000: '41', 420000: '42', 430000: '43',
  440000: '44', 450000: '45', 460000: '46', 500000: '50', 510000: '51',
  520000: '52', 530000: '53', 540000: '54', 610000: '61', 620000: '62',
  630000: '63', 640000: '64', 650000: '65', 710000: '71', 810000: '81',
  820000: '82',
};

const res = await fetch(SRC);
if (!res.ok) throw new Error(`下载失败: ${res.status}`);
const geo = await res.json();

// 台湾省:全国那份清单里没有它(700000 那个文件 404 ✗)⇒ 单独取 ✓
// ⚠️ 台湾的层级/编号有口径问题 ⇒ 改之前先看 x-cmd-hub/draw#165 ✓
const tw = await fetch('https://geo.datav.aliyun.com/areas_v3/bound/710000.json');
if (tw.ok) {
  const twGeo = await tw.json();
  if (!geo.features.some((f) => f.properties.adcode === 710000)) {
    geo.features.push(...twGeo.features.map((f) => ({ ...f, properties: { ...f.properties, adcode: 710000 } })));
  }
}

const isPair = (c) => Array.isArray(c) && c.length >= 2 && typeof c[0] === 'number';
const isRing = (c) => Array.isArray(c) && Array.isArray(c[0]) && isPair(c[0]);

const simplifyRing = (r) => {
  const s = dpRing(r, TOL);
  return s.map(([lon, lat]) => [Math.round(lon * 10 ** DECIMALS) / 10 ** DECIMALS,
    Math.round(lat * 10 ** DECIMALS) / 10 ** DECIMALS]);
};

/** 洞也要抽稀(洞的绕向是反的 ⇒ dpRing 照样能用 ✓) */
const polyOf = (rings) => rings.map(simplifyRing).filter((r) => r.length > 2);

const features = geo.features.map((f) => {
  const p = f.properties ?? {};
  const adcode = String(p.adcode ?? '');
  const code = ISO2[adcode];
  const polys = f.geometry.type === 'Polygon' ? [polyOf(f.geometry.coordinates)] : f.geometry.coordinates.map(polyOf);
  return {
    type: 'Feature',
    properties: {
      name: p.name ?? '',
      adcode,
      /** ISO 3166-2:CN 的两位码 ✓(拿不到就空 ✓) */
      code: code ?? '',
      /** 球面上的键:<alpha2>-<code> ✓ */
      key: code ? `CN-${code}` : '',
    },
    geometry: { type: 'MultiPolygon', coordinates: polys },
  };
}).filter((f) => f.properties.key);

const header = `/* eslint-disable */
/**
 * 中国省级底图(经纬度,球面用 ✓)—— DataV 行政区划边界(v3)✓
 * 键: properties.key = ISO 3166-2:CN(CN-11 / CN-44 ……)✓ · name / adcode ✓
 * 抽稀: Douglas-Peucker(tol=${TOL}°)· 环在日界线上切开 ✓
 * 源: geo.datav.aliyun.com/areas_v3(公开数据 ✓)
 */
export const chinaProvincesGeoJson = ${JSON.stringify({ type: 'FeatureCollection', features })};
`;
writeFileSync(OUT, header);
console.log(`写 ${OUT}:${features.length} 个省 ✓`);
