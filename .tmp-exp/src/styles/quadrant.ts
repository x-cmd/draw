// 四象限图(base = 简洁矩阵:白底矩阵 + 中十字,格内标题,散点用蓝)。
import { duo, makeVariant, type Variant } from './types.js';
import { C_scatterBlue } from './common.js';

export const QUADRANT_VARIANTS: Variant[] = [
  makeVariant({
    family: 'base',
    label: '简洁矩阵',
    series: [
      duo(C_scatterBlue['blue']),
      duo(C_scatterBlue['blue-light']),
    ],
    neutrals: { grid: duo(C_scatterBlue['grid-light'], C_scatterBlue['grid-dark']) },
    size: [760, 520],
    rules: {
      canvas: 'plain',
      num: 'none',
    },
  }),
];
