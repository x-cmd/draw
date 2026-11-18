// 天梯图(ladder)与双翼天梯图(butterfly-ladder)的风格。
//
// 跟 butterfly 同一套多色板(两侧各一色)。
//
// 底纹轨道与刻度线都是「空的东西」—— 读者容易当成数据的一部分,
// 所以缺省是干净的:只有柱、柱尾的数值、档位分隔线。
import { duo, makeVariant, type Variant } from './types.js';
import { C_sankey } from './common.js';

const SERIES = [
  duo(C_sankey['blue']),
  duo(C_sankey['cyan']),
  duo(C_sankey['green']),
  duo(C_sankey['purple']),
  duo(C_sankey['orange']),
  duo(C_sankey['rose']),
];

export const LADDER_VARIANTS: Variant[] = [
  // 缺省:干净 —— 无底纹、无刻度线
  makeVariant({
    family: 'base',
    label: '天梯图',
    series: SERIES,
    neutrals: { grid: duo('#E4E4E7', '#27272A') },
    size: [640, 420],
    rules: {
      canvas: 'plain',
      num: 'none',
      grid: 'none',
      butterflyMode: 'bare',
    },
  }),
  // 有底纹轨道(标尺感):柱没到底的那截是一条空的灰轨道
  makeVariant({
    family: 'track',
    label: '天梯图(带底纹)',
    series: SERIES,
    neutrals: { grid: duo('#E4E4E7', '#27272A') },
    size: [640, 420],
    rules: {
      canvas: 'plain',
      num: 'none',
      grid: 'none',
      butterflyMode: 'track',
    },
  }),
  // 加刻度线(两侧各一套标尺)
  makeVariant({
    family: 'scale',
    label: '天梯图(带刻度)',
    series: SERIES,
    neutrals: { grid: duo('#E4E4E7', '#27272A') },
    size: [640, 420],
    rules: {
      canvas: 'plain',
      num: 'none',
      grid: 'solid',
      butterflyMode: 'track',
    },
  }),
];

export const BUTTERFLY_LADDER_VARIANTS: Variant[] = LADDER_VARIANTS.map((v) => ({
  ...v,
  family: v.family,
  label: v.label.replace('天梯图', '双翼天梯图'),
  size: [900, 520] as [number, number],
}));
