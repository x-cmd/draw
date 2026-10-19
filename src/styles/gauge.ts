// 仪表盘风格变体:base = 规范 gauge-1 半圆多环(默认);gradient = 规范 gauge-2 渐变多环;
// reliability = 规范饼图 6(分区环+刻度条,语义上是仪表盘)。
import { duo, makeVariant, type Variant } from './types.js';
import { C_gauge, C_gaugeGradient, C_reliability } from './common.js';

export const GAUGE_VARIANTS: Variant[] = [
  // 仪表盘 1 · 半圆多环(规范 gauge-1,860×480):同心半圆弧,每行数据一环,值为百分比
  makeVariant({
    family: 'base',
    label: 'Evil Charts 半圆多环',
    series: ['blue', 'green', 'yellow', 'purple', 'gray'].map((c) => duo(C_gauge[c])),
    neutrals: { faint: duo(C_gauge['track-light'], C_gauge['track']) },
    size: [860, 480],
    rules: {
      canvas: 'plain',
      gauge: 'semi',
      num: 'none',
    },
  }),
  // 仪表盘 2 · 渐变多环(规范 gauge-2,860×480):整圆环,pathLength 按百分比点亮,环环渐变
  makeVariant({
    family: 'gradient',
    label: 'Evil Charts 渐变多环',
    series: ['mint', 'green', 'yellow', 'orange', 'cyan', 'indigo', 'violet', 'pink', 'peach', 'lemon', 'sky'].map((c) => duo(C_gaugeGradient[c])),
    neutrals: { faint: duo(C_gaugeGradient['track-light'], C_gaugeGradient['track']) },
    size: [860, 480],
    rules: {
      canvas: 'plain',
      gauge: 'rings',
      num: 'none',
    },
  }),
  // 饼图 6 · Reliability:四分区环(红/黄/青柠/绿)+ 中心分值 + 底部刻度条
  makeVariant({
    family: 'reliability',
    label: 'Evil Charts 可靠性评分',
    series: [
      duo(C_reliability['red-deep']),
      duo(C_reliability['yellow-deep']),
      duo(C_reliability['lime-deep']),
      duo(C_reliability['green-deep']),
    ],
    size: [960, 520],
    rules: {
      canvas: 'plain',
      gauge: 'zones',
      pieSliceGap: 6,
      pieCorner: 10,
      num: 'none',
    },
  }),
];
