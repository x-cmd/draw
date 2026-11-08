import { readFileSync } from 'node:fs';

for (const k of process.argv.slice(2)) {
  const s = readFileSync(new URL(`../src/render/vendor/${k}.js`, import.meta.url).pathname, 'utf8');
  const i = s.indexOf('GeoJson = ');
  const g = JSON.parse(s.slice(i + 'GeoJson = '.length, s.lastIndexOf(';')));
  let x0 = 1e9, x1 = -1e9, y0 = 1e9, y1 = -1e9;
  const w = (c) => {
    if (typeof c[0] === 'number') {
      x0 = Math.min(x0, c[0]); x1 = Math.max(x1, c[0]);
      y0 = Math.min(y0, c[1]); y1 = Math.max(y1, c[1]);
    } else c.forEach(w);
  };
  g.features.forEach((f) => w(f.geometry.coordinates));
  console.log(k.padEnd(4), 'n=' + String(g.features.length).padEnd(3),
    'bbox', [x0, x1, y0, y1].join(','),
    'w', x1 - x0, 'h', y1 - y0, 'aspect', ((x1 - x0) / (y1 - y0)).toFixed(3));
  console.log('     ', g.features.map((f) => f.properties.name).join(','));
}
