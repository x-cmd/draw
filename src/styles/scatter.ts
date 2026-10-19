// 散点图(base = 规范 scatter-1 简洁双系列:深浅蓝、完整双数值轴、轴标题)。
import { duo, makeVariant, type Variant } from './types.js';
import { C_scatterBlue } from './common.js';

export const SCATTER_VARIANTS: Variant[] = [
  makeVariant({
    family: 'base',
    label: '简洁双系列',
    series: [
      duo(C_scatterBlue['blue']),
      duo(C_scatterBlue['blue-light']),
    ],
    neutrals: { grid: duo(C_scatterBlue['grid-light'], C_scatterBlue['grid-dark']) },
    size: [920, 490],
    rules: {
      canvas: 'plain',
      axisTitle: true,
      legend: 'top-right', legendShape: 'circle',
      num: 'none',
    },
  }),
];
