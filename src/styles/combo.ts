// 混合图(base 待设计补充;规范款:combo-1 evil 柱线组合)。
import { duo, makeVariant, type Variant } from './types.js';
import { C_shadcn, C_comboEvil, C_sankey } from './common.js';

export const COMBO_VARIANTS: Variant[] = [
  makeVariant({
    family: 'base',
    label: 'shadcn 蓝阶',
    // 多系列换多色相,避免同族蓝分不清柱段
    series: [
      duo(C_shadcn['blue3']),
      duo(C_sankey['green']),
      duo(C_sankey['orange']),
      duo(C_sankey['purple']),
      duo(C_sankey['cyan']),
      duo(C_sankey['rose']),
    ],
    ramp: [duo(C_shadcn['blue3']), duo(C_shadcn['blue1'])],
  }),
  // 混合图 1 · Evil 柱线组合(规范 combo-1,960×500):紫柱+绿线双轴,圆角柱,右上图例
  makeVariant({
    family: 'evil',
    label: 'Evil Charts 柱线组合',
    series: [
      duo(C_comboEvil['purple-deep'], C_comboEvil['purple']),
      duo(C_comboEvil['green-deep'], C_comboEvil['green']),
    ],
    size: [960, 500],
    rules: {
      canvas: 'plain',
      comboMode: 'evil',
      grid: 'dashed', gridDash: '4 6',
      legend: 'top-right', legendShape: 'square',
      barCorner: 5,
      num: 'none',
    },
  }),
];
