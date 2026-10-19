// 折线图风格变体(规范:折线图 1-5)。默认 = shadcn(规范第 1 个)。
import { duo, makeVariant, type Variant } from './types';
import { C_shadcn, C_evil, C_evilGlow, C_evilMono, C_openLine } from './common';

// Evil 系策略:亮色用深色、暗色用亮色(规范 line-2 实测)
const evilSeries = [
  duo(C_evil['green-deep'], C_evil['green']),
  duo(C_evil['red-deep'], C_evil['red']),
];

export const LINE_VARIANTS: Variant[] = [
  // 折线图 1 · shadcn:左上图例(圆点)、虚线网格、空心点、平滑、无面积无数值
  makeVariant({
    family: 'shadcn',
    label: 'shadcn 风格',
    series: [duo(C_shadcn['blue3']), duo(C_shadcn['blue1']), duo(C_shadcn['blue4']), duo(C_shadcn['blue2']), duo(C_shadcn['blue5'])],
    size: [960, 520],
  rules: {
      canvas: 'plain',
      grid: 'dashed', gridDash: '3 8', baseline: 'none',
      points: 'hollow', pointR: 5, lineWidth: 2.75, smooth: true,
      areaGradient: false, legend: 'top-left', legendShape: 'circle',
      num: 'none',
    },
  }),
  // 折线图 2 · Evil:右上图例(方块)、折线(非平滑)、实心大点、基线刻度点
  makeVariant({
    family: 'evil',
    label: 'Evil Charts 风格',
    series: evilSeries,
    size: [960, 520],
  rules: {
      canvas: 'plain',
      grid: 'dashed', gridDash: '3 7', baseline: 'dots',
      points: 'filled', pointR: 6, lineWidth: 1.6, smooth: false,
      areaGradient: false, legend: 'top-right', legendShape: 'square',
      num: 'none',
    },
  }),
  // 折线图 3 · Evil Glow:双渐变发光线,无点无图例无面积
  makeVariant({
    family: 'evil-glow',
    label: 'Evil Charts 渐变发光',
    series: [
      duo(C_evilGlow['orange-deep'], C_evilGlow['orange']),
      duo(C_evilGlow['pink-deep'], C_evilGlow['pink']),
      duo(C_evilGlow['cyan-deep'], C_evilGlow['cyan']),
      duo(C_evilGlow['violet-deep'], C_evilGlow['violet']),
    ],
    size: [960, 520],
  rules: {
      canvas: 'plain',
      grid: 'dashed', gridDash: '4 7', baseline: 'none',
      glow: true, points: 'none', lineWidth: 3, smooth: true,
      areaGradient: false, legend: 'none',
      num: 'none',
    },
  }),
  // 折线图 4 · Evil Mono:当前周实线墨色,对比系列虚线灰
  makeVariant({
    family: 'evil-mono',
    label: 'Evil Charts 黑白',
    series: [
      duo(C_evilMono['black'], C_evilMono['white']),
      duo(C_evilMono['gray-light'], C_evilMono['gray-deep']),
    ],
    size: [960, 520],
  rules: {
      canvas: 'plain',
      grid: 'dashed', gridDash: '4 7', baseline: 'dots',
      points: 'none', lineWidth: 2, smooth: false, dashSecondary: true,
      areaGradient: false, legend: 'none',
      num: 'none',
    },
  }),
  // 折线图 5 · OpenData:线端系列名、实网格、Y 轴标题、小点、编辑式标题
  makeVariant({
    family: 'opendata',
    label: 'OpenData 风格',
    series: [
      duo(C_openLine['blue']),
      duo(C_openLine['red']),
      duo(C_openLine['red-deep']),
      duo(C_openLine['slate']),
    ],
    neutrals: {
      grid: duo('rgba(0,0,0,0.08)', 'rgba(255,255,255,0.08)'),
    },
    size: [705, 500],
    rules: {
      canvas: 'plain',
      title: 'editorial',
      grid: 'solid', baseline: 'none', axisTitle: true, axisInline: true,
      points: 'filled', pointR: 3, lineWidth: 2, smooth: true,
      areaGradient: false, legend: 'none', endLabels: true,
      num: 'none',
    },
  }),
];
