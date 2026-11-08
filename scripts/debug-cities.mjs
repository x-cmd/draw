// 调试:把城市点画到地图轮廓上,一眼看出朝向/投影对不对。
// 用法: node scripts/debug-cities.mjs AU > /tmp/au-debug.svg
import { geoConicEqualArea, geoMercator } from 'd3-geo';
import { readFileSync } from 'node:fs';
import { fitProjection } from './geo-util.mjs';

const CTH = 'https://cdn.jsdelivr.net/gh/codeforgermany/click_that_hood@main/public/data';
const TARGET_H = 400;

const PROJ = {
  BR: { file: 'brazil-states', proj: () => geoConicEqualArea().parallels([-5, -42]).rotate([-60, 0]) },
  AU: { file: 'australia', proj: () => geoConicEqualArea().parallels([-18, -36]).rotate([132, 0]) },
};

const CITIES = {
  BR: [
    ['Manaus', -60.02, -3.12], ['Porto Velho', -63.9, -8.76], ['Porto Alegre', -51.23, -30.03],
    ['São Paulo', -46.63, -23.55], ['Salvador', -38.5, -12.97], ['Fortaleza', -38.52, -3.73],
    ['Recife', -34.88, -8.05], ['Rio Branco', -67.81, -9.97], ['Boa Vista', -60.67, 2.82],
    ['Brasília', -47.88, -15.79],
  ],
  AU: [
    ['Perth', 115.86, -31.95], ['Darwin', 130.84, -12.46], ['Cape York', 142.5, -10.68],
    ['Brisbane', 153.03, -27.47], ['Sydney', 151.21, -33.87], ['Melbourne', 144.96, -37.81],
    ['Adelaide', 138.6, -34.93], ['Hobart', 147.33, -42.88], ['Canberra', 149.13, -35.28],
  ],
};

const map = process.argv[2] ?? 'AU';
const { file, proj } = PROJ[map];
const src = await (await fetch(`${CTH}/${file}.geojson`)).json();
const s = readFileSync(new URL(`../src/render/vendor/${map.toLowerCase()}.js`, import.meta.url).pathname, 'utf8');
const vendored = JSON.parse(s.slice(s.indexOf('GeoJson = ') + 'GeoJson = '.length, s.lastIndexOf(';')));
const p = fitProjection(proj(), src, TARGET_H);

// 平面坐标 → 画布(等比,留边)
let x0 = Infinity, x1 = -Infinity, y0 = Infinity, y1 = -Infinity;
const walk = (c) => {
  if (typeof c[0] === 'number') {
    x0 = Math.min(x0, c[0]); x1 = Math.max(x1, c[0]);
    y0 = Math.min(y0, c[1]); y1 = Math.max(y1, c[1]);
    return;
  }
  c.forEach(walk);
};
vendored.features.forEach((f) => walk(f.geometry.coordinates));
const W = 900, PAD = 40;
const k = Math.min((W - PAD * 2) / (x1 - x0), (W - PAD * 2) / (y1 - y0));
const cx = (v) => PAD + (v - x0) * k;
const cy = (v) => PAD + (v - y0) * k;

const paths = vendored.features.map((f) => {
  const parts = [];
  const rings = f.geometry.type === 'Polygon' ? f.geometry.coordinates : f.geometry.coordinates.flat();
  for (const ring of rings) {
    const d = ring.map(([x, y], i) => `${i ? 'L' : 'M'}${cx(x).toFixed(1)},${cy(y).toFixed(1)}`).join('') + 'Z';
    parts.push(`<path d="${d}" fill="#dbeafe" stroke="#334155" stroke-width="0.6"/>`);
  }
  return parts.join('');
}).join('');

const dots = CITIES[map].map(([name, lon, lat]) => {
  const [x, y] = p([lon, lat]);
  return `<circle cx="${cx(x).toFixed(1)}" cy="${cy(y).toFixed(1)}" r="5" fill="#dc2626"/><text x="${(cx(x) + 8).toFixed(1)}" y="${(cy(y) + 4).toFixed(1)}" font-size="13" fill="#b91c1c" font-family="sans-serif">${name}</text>`;
}).join('');

// 北箭头(指向上方 = 北)
const arrow = `<g transform="translate(${W - 70}, 70)"><circle r="26" fill="#fff" stroke="#334155"/><path d="M0,-18 L7,10 L0,4 L-7,10 Z" fill="#334155"/><text y="24" text-anchor="middle" font-size="13" fill="#334155" font-family="sans-serif">N</text></g>`;

console.log(`<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${W}" viewBox="0 0 ${W} ${W}"><rect width="${W}" height="${W}" fill="#fff"/>${paths}${dots}${arrow}</svg>`);
