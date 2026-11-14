// 四向箭头(compass = 简洁罗盘:中心一点,四支带箭头的轴,端点带标签)。
import { duo, makeVariant, type Variant } from './types.js';
import { C_scatterBlue } from './common.js';

export const COMPASS_VARIANTS: Variant[] = [
  makeVariant({
    family: 'base',
    label: '简洁罗盘',
    series: [
      duo(C_scatterBlue['blue']),
      duo(C_scatterBlue['blue-light']),
    ],
    neutrals: { grid: duo(C_scatterBlue['grid-light'], C_scatterBlue['grid-dark']) },
    size: [560, 460],
    rules: {
      canvas: 'plain',
      num: 'none',
    },
  }),
];
