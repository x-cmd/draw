// 雷达图(base 待设计补充;规范款:radar-1 evil 双系列、radar-2 xcmd 手绘五维)。
import { duo, makeVariant, type Variant } from './types';
import { C_openLine, C_radarEvil, C_xcmdRadar } from './common';

export const RADAR_VARIANTS: Variant[] = [
  makeVariant({
    family: 'base',
    label: 'OpenData 线色',
    series: (['blue','red','slate','red-deep'] as const).map((c) => duo(C_openLine[c])),
  }),
  // 雷达图 1 · Evil 双系列:4 圈虚线环、空心点、轴端标签内嵌各系列数值(规范 radar-1,900×540)
  makeVariant({
    family: 'evil',
    label: 'Evil Charts 风格',
    series: [
      duo(C_radarEvil['blue-deep'], C_radarEvil['blue']),
      duo(C_radarEvil['green-deep'], C_radarEvil['green']),
    ],
    neutrals: {
      text: duo('#52525B', '#D4D4D8'),
      grid: duo(C_radarEvil['gray-light'], C_radarEvil['gray-deep']),
      baseline: duo('#D4D4D8', '#3F3F46'),
    },
    size: [900, 540],
    rules: {
      canvas: 'plain',
      radarMode: 'evil',
      radarMax: 100,
      legend: 'bottom', legendShape: 'square',
      num: 'none',
    },
  }),
  // 雷达图 2 · X-CMD 手绘五维:3 圈环、方形顶点标记、Handlee 手写标签(规范 radar-2,900×490)
  makeVariant({
    family: 'xcmd',
    label: 'X-CMD 风格',
    series: [duo(C_xcmdRadar['orange-light'], C_xcmdRadar['orange'])],
    neutrals: {
      muted: duo(C_xcmdRadar['label-light'], C_xcmdRadar['label-dark']),
      grid: duo(C_xcmdRadar['grid-light'], C_xcmdRadar['grid-dark']),
      baseline: duo(C_xcmdRadar['grid-light'], C_xcmdRadar['grid-dark']),
    },
    size: [900, 490],
    rules: {
      canvas: 'plain',
      radarMode: 'xcmd',
      radarMax: 100,
      num: 'none',
    },
  }),
];
