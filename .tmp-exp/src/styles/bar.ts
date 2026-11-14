// 柱状图(base 待设计补充;规范款:bar-1 evil 分组柱、bar-2 grid 单元格柱)。
import { duo, makeVariant, type Variant } from './types.js';
import { C_shadcn, C_barEvil, C_gridMono, C_sankey } from './common.js';

export const BAR_VARIANTS: Variant[] = [
  makeVariant({
    family: 'evil',
    label: 'Evil Charts 分组柱',
    series: [
      duo(C_barEvil['green-deep'], C_barEvil['green']),
      duo(C_barEvil['red-deep'], C_barEvil['red']),
    ],
    size: [960, 520],
    rules: {
      canvas: 'plain',
      grid: 'dashed', gridDash: '4 6', baseline: 'none',
      legend: 'top-right', legendShape: 'square',
      barCorner: 4, num: 'none', tickFont: 11,
    },
  }),
  makeVariant({
    family: 'base',
    label: 'shadcn 蓝阶',
    // 单系列沿用品牌蓝;多系列(分组/堆叠)换多色相,避免同族蓝分不清段
    series: [
      duo(C_shadcn['blue3']),
      duo(C_sankey['green']),
      duo(C_sankey['orange']),
      duo(C_sankey['purple']),
      duo(C_sankey['cyan']),
      duo(C_sankey['rose']),
    ],
    ramp: [duo(C_shadcn['blue3']), duo(C_shadcn['blue1'])], // 单系列柱渐变保持蓝阶
  }),
  // 柱状图 1 · Evil 分组柱:圆角矩形柱(四角)+虚线网格+右上方块图例,无数值标注(规范 bar-1)

  // 柱状图 2 · Grid 单元格柱:每列自底向上点亮,一格一个单位;等宽字体表头(规范 bar-2)
  makeVariant({
    family: 'grid',
    label: 'Evil Charts 网格柱',
    series: [duo(C_gridMono['black'], C_gridMono['white'])],
    neutrals: {
      text: duo('#52525B', '#E4E4E7'),
      grid: duo(C_gridMono['gray-light'], C_barEvil['gray-deep']),
      faint: duo(C_gridMono['gray-light'], C_gridMono['gray-deep']),
    },
    size: [960, 520],
    rules: {
      canvas: 'plain',
      barMode: 'grid', grid: 'none', baseline: 'none',
      legend: 'none', num: 'none',
    },
  }),
];
