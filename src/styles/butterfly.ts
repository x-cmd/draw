// 双翼条形图(butterfly):两个系列背靠背,共用一根中轴。
// 颜色沿用桑基那套多色板(两侧各一色,堆叠时按段续取)。
import { duo, makeVariant, type Variant } from './types.js';
import { C_sankey } from './common.js';

export const BUTTERFLY_VARIANTS: Variant[] = [
  makeVariant({
    family: 'base',
    label: '双翼条形图',
    series: [
      duo(C_sankey['blue']),
      duo(C_sankey['cyan']),
      duo(C_sankey['green']),
      duo(C_sankey['purple']),
      duo(C_sankey['orange']),
      duo(C_sankey['rose']),
    ],
    neutrals: { grid: duo('#E4E4E7', '#27272A') },
    size: [640, 420],
    rules: {
      canvas: 'plain',
      num: 'none',
    },
  }),
];
