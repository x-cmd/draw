// 双翼条形图(butterfly):两个系列背靠背,共用一根中轴。
// 颜色沿用桑基那套多色板(两侧各一色,堆叠时按段续取)。
//
// 底纹轨道与刻度线都是「空的东西」:轨道没被柱填满的那截是灰的,刻度线又没有数字,
// 读者容易当成数据的一部分。所以缺省是干净的 —— 只有柱和柱端的数值。
// 想要标尺感(这一侧最长能到哪)再用 t=track / t=scale。
import { duo, makeVariant, type Variant } from './types.js';
import { C_sankey } from './common.js';

const SERIES = [
  duo(C_sankey['blue']),
  duo(C_sankey['cyan']),
  duo(C_sankey['green']),
  duo(C_sankey['purple']),
  duo(C_sankey['orange']),
  duo(C_sankey['rose']),
];

export const BUTTERFLY_VARIANTS: Variant[] = [
  // 缺省:干净 —— 无底纹、无刻度线
  makeVariant({
    family: 'base',
    label: '双翼条形图',
    series: SERIES,
    neutrals: { grid: duo('#E4E4E7', '#27272A') },
    size: [640, 420],
    rules: {
      canvas: 'plain',
      num: 'none',
      grid: 'none',
      butterflyMode: 'bare',
    },
  }),
  // 有底纹轨道(标尺感):柱没到底的那截是一条空的灰轨道
  makeVariant({
    family: 'track',
    label: '双翼条形图(带底纹)',
    series: SERIES,
    neutrals: { grid: duo('#E4E4E7', '#27272A') },
    size: [640, 420],
    rules: {
      canvas: 'plain',
      num: 'none',
      grid: 'none',
      butterflyMode: 'track',
    },
  }),
  // 有刻度线(两侧各画各的等距竖线)
  makeVariant({
    family: 'grid',
    label: '双翼条形图(带刻度)',
    series: SERIES,
    neutrals: { grid: duo('#E4E4E7', '#27272A') },
    size: [640, 420],
    rules: {
      canvas: 'plain',
      num: 'none',
      grid: 'solid',
      butterflyMode: 'bare',
    },
  }),
  // 底纹 + 刻度:完整的标尺感(最早那版的样子)
  makeVariant({
    family: 'scale',
    label: '双翼条形图(带底纹和刻度)',
    series: SERIES,
    neutrals: { grid: duo('#E4E4E7', '#27272A') },
    size: [640, 420],
    rules: {
      canvas: 'plain',
      num: 'none',
      grid: 'solid',
      butterflyMode: 'track',
    },
  }),
];
