// 饼图风格变体(规范:饼图 1-5、7)。默认 = opendata(规范第 1 个)。
// reliability(饼图 6)语义上是仪表盘 → 放 src/styles/gauge.ts。
import { duo, makeVariant, type Variant } from './types';
import { C_openPie, C_evilPie, C_marketMono, C_progress, C_revenue } from './common';

export const PIE_VARIANTS: Variant[] = [
  // 饼图 1 · OpenData:全部标签圈外(白描边),编辑式大标题,细白缝,无图例
  makeVariant({
    family: 'opendata',
    label: 'OpenData 风格',
    series: [
      duo(C_openPie['cyan-soft']),
      duo(C_openPie['peach']),
      duo(C_openPie['blue-soft']),
      duo(C_openPie['rose-soft']),
      duo(C_openPie['green-soft']),
    ],
    size: [705, 500],
  rules: {
      canvas: 'plain',
      title: 'editorial',
      pieLabels: 'onSlice',
      pieCenter: 'none',
      pieSliceGap: 1.5,
      pieRadius: 0.6,
      legend: 'none',
      num: 'none',
    },
  }),
  // 饼图 2 · Evil:圆角扇区+白缝,数值内标(白字),底部单行图例
  makeVariant({
    family: 'evil',
    label: 'Evil Charts 风格',
    series: [
      duo(C_evilPie['blue-deep'], C_evilPie['blue']),
      duo(C_evilPie['green-deep'], C_evilPie['green']),
      duo(C_evilPie['yellow-deep'], C_evilPie['yellow']),
      duo(C_evilPie['purple-deep'], C_evilPie['purple']),
      duo(C_evilPie['gray-deep'], C_evilPie['gray']),
    ],
    size: [960, 520],
  rules: {
      canvas: 'plain',
      pieLabels: 'insideValue',
      pieCenter: 'none',
      pieSliceGap: 4,
      pieCorner: 8,
      pieRadius: 2 / 7, // 168 外径 / 48 内径的细环
      pieDir: 'ccw', // 规范 pie-2:3 点钟起逆时针
      pieStart: 0,
      legend: 'bottom',
      legendShape: 'square',
      num: 'none',
    },
  }),
  // 饼图 3 · Evil 外标:实心饼,引线外标(名灰值墨)
  makeVariant({
    family: 'evil-mono',
    label: 'Evil Charts 外标风格',
    series: [
      duo(C_evilPie['blue-deep'], C_evilPie['blue']),
      duo(C_evilPie['green-deep'], C_evilPie['green']),
      duo(C_evilPie['yellow-deep'], C_evilPie['yellow']),
      duo(C_evilPie['purple-deep'], C_evilPie['purple']),
      duo(C_evilPie['gray-deep'], C_evilPie['gray']),
    ],
    size: [960, 520],
  rules: {
      canvas: 'plain',
      pieLabels: 'outside',
      pieCenter: 'none',
      pieSliceGap: 2,
      pieCorner: 4,
      pieRadius: 0, // 实心饼
      pieDir: 'ccw', // 规范 pie-3:3 点钟起逆时针
      pieStart: 0,
      legend: 'none',
      num: 'none',
    },
  }),
  // 饼图 4 · Market Mono:灰阶按份额深浅,占比内标,环心总计,底部两列图例
  makeVariant({
    family: 'market-mono',
    label: 'Evil Charts 黑白风格',
    series: [
      duo(C_marketMono['black'], C_marketMono['white']),
      duo(C_marketMono['gray-1'], C_marketMono['silver']),
      duo(C_marketMono['gray-2'], C_marketMono['gray-5']),
      duo(C_marketMono['gray-3'], C_marketMono['gray-4']),
      duo(C_marketMono['gray-4'], C_marketMono['gray-3']),
      duo(C_marketMono['gray-5'], C_marketMono['gray-2']),
      duo(C_marketMono['silver'], C_marketMono['gray-1']),
    ],
    size: [960, 520],
  rules: {
      canvas: 'plain',
      pieLabels: 'insidePct',
      pieCenter: 'total',
      pieSliceGap: 3,
      pieCorner: 0,
      pieRadius: 92.94 / 168,
      pieDir: 'ccw', // 规范 pie-4:12 点钟起逆时针,扇区倒排
      pieStart: 90,
      pieOrder: 'reverse',
      legend: 'bottom',
      legendShape: 'square',
      legendValue: true,
      legendCols: 2,
      num: 'none',
    },
  }),
  // 饼图 5 · Progress:点状进度环,每行数据一个环,环心大百分比
  makeVariant({
    family: 'progress',
    label: 'Evil Charts 进度环风格',
    series: [duo(C_progress['pink'])],
    neutrals: {
      faint: duo(C_progress['track-light'], C_progress['track-dark']),
    },
    size: [960, 520],
    rules: {
      canvas: 'plain',
      pieLabels: 'dots',
      pieCenter: 'value',
      pieSliceGap: 0,
      pieRadius: 0,
      pieDir: 'ccw', // 规范 pie-5:点亮自 12 点钟逆时针
      legend: 'none',
      num: 'none',
    },
  }),
  // 饼图 7 · Revenue:扇区对角渐变+虚线内圈,环心总计,右侧图例带数值
  makeVariant({
    family: 'revenue',
    label: 'Evil Charts 渐变风格',
    series: [
      duo(C_revenue['purple']),
      duo(C_revenue['indigo']),
      duo(C_revenue['cyan-deep']),
      duo(C_revenue['green-deep']),
      duo(C_revenue['violet']),
      duo(C_revenue['blue']),
      duo(C_revenue['cyan']),
      duo(C_revenue['green']),
    ],
    size: [960, 520],
  rules: {
      canvas: 'plain',
      pieLabels: 'legend',
      pieCenter: 'total',
      pieSliceGap: 6,
      pieCorner: 12,
      pieRadius: 126.7 / 188,
      pieGradient: true,
      pieDashedInner: true,
      pieDir: 'ccw', // 规范 pie-7:12 点钟起逆时针
      pieStart: 90,
      legend: 'right',
      legendShape: 'square',
      legendValue: true,
      num: 'none',
    },
  }),
];
