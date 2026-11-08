// 验方向:把城市经纬度用**同一套投影**投成平面坐标,再看这个点落在哪个州多边形里。
// 点落在正确的州里 → 地图朝向/投影都对(北在上、东在右)。
// 用法: node scripts/check-orient.mjs
import { geoConicEqualArea, geoMercator } from 'd3-geo';
import { readFileSync } from 'node:fs';
import { fitProjection } from './geo-util.mjs';

const CTH = 'https://cdn.jsdelivr.net/gh/codeforgermany/click_that_hood@main/public/data';
const TARGET_H = 400;

const loadSrc = async (file) => {
  const res = await fetch(`${CTH}/${file}.geojson`);
  if (!res.ok) throw new Error(`download failed: ${file}`);
  return res.json();
};
const loadVendored = (k) => {
  const s = readFileSync(new URL(`../src/render/vendor/${k}.js`, import.meta.url).pathname, 'utf8');
  return JSON.parse(s.slice(s.indexOf('GeoJson = ') + 'GeoJson = '.length, s.lastIndexOf(';')));
};

const PROJ = {
  BR: { file: 'brazil-states', proj: () => geoConicEqualArea().parallels([-5, -42]).rotate([-60, 0]) },
  AU: { file: 'australia', proj: () => geoConicEqualArea().parallels([-18, -36]).rotate([132, 0]) },
  DE: { file: 'germany', proj: () => geoConicEqualArea().parallels([35, 65]).rotate([-10, 0]) },
  KR: { file: 'korea', proj: () => geoMercator() },
};

// 射线法:点是否在环内(环是平面坐标)
function inRing(ring, x, y) {
  let inside = false;
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const [xi, yi] = ring[i];
    const [xj, yj] = ring[j];
    if ((yi > y) !== (yj > y) && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) inside = !inside;
  }
  return inside;
}
function inPolygon(rings, x, y) {
  if (!rings.length || !inRing(rings[0], x, y)) return false;
  for (let i = 1; i < rings.length; i++) if (inRing(rings[i], x, y)) return false; // 洞
  return true;
}
// 一个 feature 可能是 Polygon,也可能是 MultiPolygon(多个独立多边形,各自带洞)
const polysOf = (geom) => (geom.type === 'Polygon' ? [geom.coordinates] : geom.coordinates);
const inFeature = (geom, x, y) => polysOf(geom).some((rings) => inPolygon(rings, x, y));

// 城市:[名字, 经度, 纬度, 期望落在哪个州]
const CITIES = {
  BR: [
    ['马瑙斯 Manaus', -60.02, -3.12, 'Amazonas'],
    ['韦柳港 Porto Velho', -63.9, -8.76, 'Rondônia'],
    ['阿雷格里港 Porto Alegre', -51.23, -30.03, 'Rio Grande do Sul'],
    ['圣保罗 São Paulo', -46.63, -23.55, 'São Paulo'],
    ['萨尔瓦多 Salvador', -38.5, -12.97, 'Bahia'],
    ['福塔莱萨 Fortaleza', -38.52, -3.73, 'Ceará'],
    ['累西腓 Recife', -34.88, -8.05, 'Pernambuco'],
    ['里奥布兰科 Rio Branco', -67.81, -9.97, 'Acre'],
    ['博阿维斯塔 Boa Vista', -60.67, 2.82, 'Roraima'],
  ],
  AU: [
    ['珀斯 Perth', 115.86, -31.95, 'Western Australia'],
    ['达尔文 Darwin', 130.84, -12.46, 'Northern Territory'],
    ['凯佩尔 Cape York', 142.5, -10.68, 'Queensland'],
    ['布里斯班 Brisbane', 153.03, -27.47, 'Queensland'],
    ['悉尼 Sydney', 151.21, -33.87, 'New South Wales'],
    ['墨尔本 Melbourne', 144.96, -37.81, 'Victoria'],
    ['阿德莱德 Adelaide', 138.6, -34.93, 'South Australia'],
    ['霍巴特 Hobart', 147.33, -42.88, 'Tasmania'],
  ],
  DE: [
    ['柏林 Berlin', 13.4, 52.52, 'Berlin'],
    ['慕尼黑 München', 11.58, 48.14, 'Bayern'],
    ['汉堡 Hamburg', 9.99, 53.55, 'Hamburg'],
    ['科隆 Köln', 6.96, 50.94, 'Nordrhein-Westfalen'],
  ],
  KR: [
    ['首尔 Seoul', 126.98, 37.57, 'Seoul'],
    ['釜山 Busan', 129.08, 35.18, 'Busan'],
    ['济州 Jeju', 126.53, 33.5, 'Jeju-do'],
    ['大邱 Daegu', 128.6, 35.87, 'Daegu'],
  ],
};

for (const [map, cities] of Object.entries(CITIES)) {
  const { file, proj } = PROJ[map];
  const src = await loadSrc(file);
  const vendored = loadVendored(map.toLowerCase());
  const p = fitProjection(proj(), src, TARGET_H);
  console.log(`== ${map}`);
  let bad = 0;
  for (const [name, lon, lat, expect] of cities) {
    const [x, y] = p([lon, lat]);
    let hit = 'none';
    for (const f of vendored.features) {
      if (inFeature(f.geometry, x, y)) { hit = f.properties.name; break; }
    }
    if (hit !== expect) bad++;
    console.log(`   ${name.padEnd(26)} → ${hit.padEnd(20)} 期望 ${expect.padEnd(20)} ${hit === expect ? '✓' : '✗'}`);
  }
  console.log(`   ${bad === 0 ? '方向正确' : bad + ' 处不对'}`);
}
