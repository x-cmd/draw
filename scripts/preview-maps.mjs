// 本地预览:把 BR / AU 等地图渲染成 PNG,肉眼验收用。
// 用法: node scripts/preview-maps.mjs
import { writeFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';

const BR_STATES = [
  ['Distrito Federal', 34.8], ['Goiás', 21.4], ['Minas Gerais', 17.6], ['São Paulo', 26.2],
  ['Paraná', 21.9], ['Rio Grande do Sul', 21.2], ['Bahia', 13.4], ['Santa Catarina', 27.4],
  ['Ceará', 12.5], ['Espírito Santo', 21.8], ['Pernambuco', 14.8], ['Pará', 14.1],
  ['Maranhão', 10.7], ['Piauí', 12.2], ['Amazonas', 13.6], ['Rio Grande do Norte', 14.4],
  ['Mato Grosso', 22.4], ['Alagoas', 13.2], ['Paraíba', 12.9], ['Rio de Janeiro', 27.4],
  ['Mato Grosso do Sul', 20.9], ['Amapá', 20.6], ['Roraima', 18.2], ['Rondônia', 16.1],
  ['Acre', 13.7], ['Tocantins', 16.9], ['Sergipe', 14.7],
];
const AU_STATES = [
  ['New South Wales', 68.4], ['Victoria', 66.1], ['Australian Capital Territory', 118.2],
  ['Queensland', 72.8], ['Western Australia', 96.2], ['South Australia', 61.4],
  ['Tasmania', 61.8], ['Northern Territory', 68.9],
];

const mk = (map, title, rows, min, max, orient) => ({
  title: { text: title },
  visualMap: { min, max, orient: orient ?? 'horizontal',
    ...(orient === 'vertical' ? { left: 10, bottom: 16 } : { left: 'center', bottom: 8 }),
    text: ['高', '低'], itemWidth: 12, itemHeight: 180,
    inRange: { color: ['#dbeafe', '#93c5fd', '#3b82f6', '#1d4ed8'] } },
  series: [{ type: 'map', map, roam: false,
    label: { show: true, fontSize: 9, color: '#0f172a' },
    labelLayout: { hideOverlap: true },
    itemStyle: { areaColor: '#f1f5f9', borderColor: '#ffffff', borderWidth: 0.4 },
    data: rows.map(([name, value]) => ({ name, value })) }],
});

const CASES = [
  ['br', mk('BR', '巴西 · 人均 GDP(示例)', BR_STATES, 10, 40, 'vertical'), '460x460'],
  ['au', mk('AU', '澳大利亚 · 人均 GDP(示例)', AU_STATES, 55, 105, 'vertical'), '560x420'],
  ['br-old', mk('BR', '巴西 · 人均 GDP(示例)', BR_STATES, 10, 40), '560x336'],
  ['au-old', mk('AU', '澳大利亚 · 人均 GDP(示例)', AU_STATES, 55, 105), '560x336'],
];

for (const [name, option, size] of CASES) {
  const [w, h] = size.split('x');
  const file = `/tmp/map-${name}.json`;
  writeFileSync(file, JSON.stringify(option));
  execFileSync('npx', ['tsx', 'src/node/cli.ts', 'echarts', file, '--width', w, '--height', h, '--out', `/tmp/map-${name}.png`], { stdio: 'inherit' });
}
