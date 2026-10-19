// 面积图风格变体(规范:面积图 1-3)。默认 = evil(规范第 1 个)。
import { duo, makeVariant, type Variant } from './types.js';
import { C_evil, C_star, C_openArea } from './common.js';

export const AREA_VARIANTS: Variant[] = [
  // 面积图 1 · Evil:渐变面积 + 虚线描边 + 大实心点 + 右上图例(方块)
  makeVariant({
    family: 'evil',
    label: 'Evil Charts 风格',
    series: [
      duo(C_evil['green-deep'], C_evil['green']),
      duo(C_evil['red-deep'], C_evil['red']),
    ],
    size: [960, 520],
  rules: {
      canvas: 'plain',
      grid: 'dashed', gridDash: '3 7', baseline: 'none',
      points: 'filled', pointR: 6, lineWidth: 1.7, lineDash: '5 5', smooth: false,
      areaGradient: true, areaTop: 0.22, areaBottom: 0.015,
      legend: 'top-right', legendShape: 'square',
      num: 'none',
    },
  }),
  // 面积图 2 · GitHub Star:手绘滤镜 + 手写字体 + 黑色粗坐标轴 + 端点标注
  makeVariant({
    family: 'star',
    label: 'GitHub Star 风格',
    series: [duo(C_star['orange-red'])],
    neutrals: {
      ink: duo('#000000', '#FAFAFA'),
      text: duo('#000000', '#D4D4D8'),
      muted: duo('#000000', '#A1A1AA'),
      grid: duo('#EEEEEE', C_star['grid-dark']),
      baseline: duo('#222222', '#4A4F57'),
      border: duo('#000000', '#4A4F57'),
      halo: duo('#FFFFFF', '#0E0F11'),
    },
    size: [800, 533],
    rules: {
      canvas: 'card', // 手绘风自带白底画布(规范原版不透明)
      title: 'center',
      grid: 'solid', baseline: 'line',
      points: 'none', lineWidth: 3, smooth: true,
      areaGradient: true, areaTop: 0.22, areaBottom: 0.02,
      legend: 'none', sketch: true, axisTitle: true,
      num: 'none',
    },
  }),
  // 面积图 5 · OpenData:浓渐变面积 + 实网格 + Y 轴标题 + 小点 + 编辑式标题
  makeVariant({
    family: 'opendata',
    label: 'OpenData 风格',
    series: [duo(C_openArea['cyan']), duo(C_openArea['red']), duo(C_openArea['slate'])],
    neutrals: {
      grid: duo('rgba(0,0,0,0.08)', 'rgba(255,255,255,0.08)'),
    },
    size: [766, 500],
    rules: {
      canvas: 'plain',
      title: 'editorial',
      grid: 'solid', baseline: 'none', axisTitle: true, axisInline: true,
      points: 'filled', pointR: 3, lineWidth: 2, smooth: true,
      areaGradient: true, areaTop: 0.85, areaBottom: 0.1,
      legend: 'none',
      yFromZero: false, // 规范 area-3:Y 轴 120-240,不强制从 0
      refAvg: true,     // 均值参考虚线
      endValue: true,   // 末点标注
      tickFont: 14,
      num: 'none',
    },
  }),
  // 面积图 3 · 像素 GitHub Star:100×46 像素格 + 发光轨迹 + 手写标题(规范 area-3,900×470)
  makeVariant({
    family: 'pixel',
    label: '像素 GitHub Star',
    series: [duo('#8FEA2A')],
    neutrals: {
      grid: duo('#C9DCC4', '#183019'),
    },
    size: [900, 470],
    rules: {
      canvas: 'plain',
      areaMode: 'pixel',
      title: 'center',
      grid: 'none', baseline: 'none',
      num: 'none',
    },
  }),
  // 面积图 4 · 波点 GitHub Star:双系列阶梯面积,点阵 pattern 填充(规范 area-4,900×470)
  makeVariant({
    family: 'polka',
    label: '波点 GitHub Star',
    series: [duo('#B6F000'), duo('#3B82F6')],
    neutrals: {
      ink: duo('#27272A', '#E4E4E7'),
    },
    size: [900, 470],
    rules: {
      canvas: 'plain',
      areaMode: 'polka',
      grid: 'solid', baseline: 'line',
      smooth: false,
      legend: 'none',
      num: 'none',
    },
  }),
];
